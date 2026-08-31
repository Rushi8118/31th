import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Check, Clipboard, Info, CalendarRange, Landmark, MessageSquareText } from 'lucide-react'
import { useNotifications, Notification } from '@/hooks/useNotifications'
import { formatDistanceToNow } from 'date-fns'

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Toggle dropdown
  const toggleDropdown = () => setIsOpen((prev) => !prev)

  // Handle outside clicks and Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  // Get matching icon per notification type
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'application_update':
        return <Clipboard className="h-4 w-4 text-[#C49A2B]" />
      case 'consultation_reminder':
        return <CalendarRange className="h-4 w-4 text-emerald-500" />
      case 'payment_due':
        return <Landmark className="h-4 w-4 text-red-500" />
      case 'document_request':
        return <Clipboard className="h-4 w-4 text-[#C49A2B]" />
      case 'promotion':
        return <Info className="h-4 w-4 text-purple-500" />
      default:
        return <Bell className="h-4 w-4 text-[#C49A2B]" />
    }
  }

  const lastFive = notifications.slice(0, 5)

  const handleItemClick = (notif: Notification) => {
    markAsRead(notif.id)
    setIsOpen(false)
    if (notif.action_url) {
      navigate(notif.action_url)
    } else {
      navigate('/dashboard/notifications')
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 text-[#1a1a2e] hover:text-[#C49A2B] bg-[#F5F0E8]/50 hover:bg-[#F5F0E8] rounded-full border border-border/40 transition duration-200"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-bold leading-none text-white bg-red-600 rounded-full animate-pulse transform translate-x-1/3 -translate-y-1/3">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-card border border-border/80 rounded-2xl shadow-xl z-50 overflow-hidden transform origin-top-right transition duration-300 scale-100 opacity-100">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a2e] text-[#F5F0E8] border-b border-border/20">
            <h3 className="font-serif text-sm font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="flex items-center gap-1 text-[11px] text-[#C49A2B] hover:text-[#C49A2B]/85 font-medium transition"
              >
                <Check className="h-3 w-3" /> Mark all read
              </button>
            )}
          </div>

          {/* List items */}
          <div className="max-h-[300px] overflow-y-auto divide-y divide-border/30">
            {lastFive.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <Bell className="h-8 w-8 text-muted-foreground/35 mb-2" />
                <p className="text-xs text-muted-foreground font-medium">All caught up!</p>
                <p className="text-[10px] text-muted-foreground/80">No recent notifications.</p>
              </div>
            ) : (
              lastFive.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleItemClick(notif)}
                  className={`flex items-start gap-3 p-4.5 cursor-pointer hover:bg-[#F5F0E8]/40 transition ${
                    !notif.is_read ? 'bg-[#C49A2B]/5 border-l-2 border-[#C49A2B]' : ''
                  }`}
                >
                  <div className="mt-0.5 p-1.5 rounded-full bg-[#1a1a2e]/5 shrink-0">
                    {getNotificationIcon(notif.type)}
                  </div>
                  <div className="space-y-1 flex-1">
                    <h4 className={`text-xs font-semibold text-[#1a1a2e] line-clamp-1 ${!notif.is_read ? 'font-bold' : ''}`}>
                      {notif.title}
                    </h4>
                    {notif.message && (
                      <p className="text-[11px] text-muted-foreground line-clamp-2">
                        {notif.message}
                      </p>
                    )}
                    <span className="text-[9px] text-muted-foreground/75 block">
                      {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* View All Footer */}
          <div
            onClick={() => {
              setIsOpen(false)
              navigate('/dashboard/notifications')
            }}
            className="block text-center py-2.5 bg-[#F5F0E8]/30 hover:bg-[#F5F0E8]/60 text-xs font-semibold text-[#C49A2B] border-t border-border/30 cursor-pointer transition"
          >
            View all notifications
          </div>
        </div>
      )}
    </div>
  )
}
