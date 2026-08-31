import React, { useState, useEffect, useRef } from 'react'
import { useChat, ChatMessage } from '@/hooks/useChat'
import { useAuth } from '@/hooks/use-auth'
import UserAvatar from '@/components/UserAvatar'
import {
  Send,
  Paperclip,
  Check,
  CheckCheck,
  Smile,
  Search,
  MessageSquare,
  FileText,
  Clock,
  ArrowDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ChatPage() {
  const { user } = useAuth()
  const {
    messages,
    sendMessage,
    sendLoading,
    officerTyping,
    sendTypingBroadcast,
  } = useChat()

  const [text, setText] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [search, setSearch] = useState('')
  
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to latest message on payload modifications
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, officerTyping])

  if (!user) return null

  // Filter messages by search term
  const filtered = messages.filter((m) =>
    m.message.toLowerCase().includes(search.toLowerCase())
  )

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() && !selectedFile) return

    sendMessage(
      {
        text: text,
        file: selectedFile || undefined,
      },
      {
        onSuccess: () => {
          setText('')
          setSelectedFile(null)
        },
      }
    )
  }

  // Trigger typing broadcasts
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
    sendTypingBroadcast()
  }

  const handleAttachmentClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds the 5MB limit.')
        return
      }
      setSelectedFile(file)
    }
  }

  return (
    <div className="h-[calc(100vh-140px)] min-h-[500px] flex flex-col bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
      
      {/* 1. Header with case officer profile info */}
      <div className="px-5 py-3.5 bg-[#1a1a2e] text-[#F5F0E8] flex items-center justify-between border-b border-[#C49A2B]/10 shrink-0">
        <div className="flex items-center gap-3">
          {/* Mock Officer Avatar */}
          <div className="relative">
            <UserAvatar fullName="Siddhivinayak Officer" size="sm" className="border border-[#C49A2B]/35" />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-[#1a1a2e]" />
          </div>
          <div className="leading-tight">
            <h3 className="text-xs font-bold font-serif">Siddhivinayak Desk</h3>
            <p className="text-[9px] text-emerald-400 font-semibold mt-0.5">Online Support</p>
          </div>
        </div>

        {/* Search bar inside header */}
        <div className="relative hidden sm:block w-48">
          <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-[#F5F0E8]/50" />
          <input
            type="text"
            placeholder="Search chat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-7 pl-8 pr-3 text-[10px] rounded-lg border border-[#C49A2B]/20 bg-[#F5F0E8]/10 text-[#F5F0E8] focus:border-[#C49A2B] focus:outline-none"
          />
        </div>
      </div>

      {/* 2. Scrolling chat logs block */}
      <div
        ref={scrollContainerRef}
        className="flex-1 p-5 overflow-y-auto bg-[#F5F0E8]/10 space-y-4 scroll-smooth"
      >
        {filtered.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <MessageSquare className="h-12 w-12 text-muted-foreground/35 mb-3" />
            <p className="text-xs text-muted-foreground font-semibold">Start your conversation!</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 max-w-[200px]">
              Ask our consultants about your file reviews or schedules.
            </p>
          </div>
        ) : (
          filtered.map((msg) => {
            const isMe = msg.sender_id === user.id
            return (
              <div
                key={msg.id}
                className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl p-3.5 text-xs shadow-sm flex flex-col gap-1.5 leading-normal relative ${
                    isMe
                      ? 'bg-[#1a1a2e] text-[#F5F0E8] rounded-tr-none'
                      : 'bg-card text-[#1a1a2e] border border-border/50 rounded-tl-none'
                  }`}
                >
                  {/* Text Message content */}
                  <p className="break-words whitespace-pre-wrap">{msg.message}</p>

                  {/* Attachment if present */}
                  {msg.file_url && (
                    <a
                      href={msg.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 p-2 rounded-lg border transition ${
                        isMe
                          ? 'bg-[#F5F0E8]/10 border-white/10 text-[#C49A2B]'
                          : 'bg-[#1a1a2e]/5 border-border/50 text-[#C49A2B]'
                      }`}
                    >
                      <FileText className="h-4 w-4 shrink-0" />
                      <span className="text-[10px] font-bold underline truncate max-w-[120px]">
                        {msg.file_name || 'Attachment'}
                      </span>
                    </a>
                  )}

                  {/* Message Metadata footer */}
                  <div className="flex items-center gap-1.5 self-end text-[8px] text-muted-foreground">
                    <span>
                      {new Date(msg.created_at).toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    
                    {/* Double Check receipts */}
                    {isMe && (
                      <span className="shrink-0">
                        {msg.is_read ? (
                          <CheckCheck className="h-3.5 w-3.5 text-[#C49A2B]" />
                        ) : (
                          <Check className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}

        {/* Case officer typing indicator bubble */}
        {officerTyping && (
          <div className="flex w-full justify-start animate-pulse">
            <div className="bg-card text-muted-foreground border border-border/50 rounded-2xl rounded-tl-none p-3 text-[10px] font-semibold italic flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-[#C49A2B] rounded-full animate-bounce" />
              <span>Officer is typing...</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Footer Text Box input controls */}
      <form
        onSubmit={handleSend}
        className="px-4 py-3 bg-[#F5F0E8]/40 border-t border-border/50 flex items-center gap-2.5 shrink-0 relative"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf, .jpeg, .jpg, .png"
        />

        {/* Selected file notification banner preview */}
        {selectedFile && (
          <div className="absolute left-4 bottom-full mb-2 bg-[#1a1a2e] text-[#F5F0E8] border border-[#C49A2B]/30 px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-2 shadow-lg animate-slideUp">
            <Paperclip className="h-3.5 w-3.5 text-[#C49A2B]" />
            <span className="font-bold truncate max-w-[140px]">{selectedFile.name}</span>
            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              className="text-red-400 hover:text-red-300 font-bold ml-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Paperclip attachment clip */}
        <button
          type="button"
          onClick={handleAttachmentClick}
          className="p-2.5 text-muted-foreground hover:text-[#C49A2B] bg-card border border-border/60 rounded-xl transition duration-200"
          aria-label="Add Attachment"
        >
          <Paperclip className="h-4.5 w-4.5" />
        </button>

        {/* Message Input text field */}
        <Input
          type="text"
          placeholder="Type your message..."
          value={text}
          onChange={handleInputChange}
          className="flex-1 h-10 border-border/65 bg-card focus:border-[#C49A2B]/40 rounded-xl text-xs"
          disabled={sendLoading}
        />

        {/* Send Action submit */}
        <Button
          type="submit"
          disabled={sendLoading || (!text.trim() && !selectedFile)}
          className="rounded-xl h-10 w-10 p-0 bg-primary hover:bg-primary/95 text-primary-foreground btn-glow"
          aria-label="Send Message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
