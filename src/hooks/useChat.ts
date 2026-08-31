import { useEffect, useState, useRef, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from './use-auth'
import { toast } from 'sonner'

export type ChatMessage = {
  id: string
  sender_id: string
  receiver_id: string | null
  message: string
  file_url: string | null
  file_name: string | null
  is_read: boolean
  read_at: string | null
  created_at: string
}

export function useChat() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [officerTyping, setOfficerTyping] = useState(false)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  // 1. Fetch chat history
  const query = useQuery<ChatMessage[], Error>({
    queryKey: ['messages', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: true })

      if (error) {
        // Messages table fetch failed — return empty
        return []
      }
      return data as ChatMessage[]
    },
    enabled: !!user,
    staleTime: 0, // Keep fresh
  })

  // Mark all incoming messages as read when viewing
  const markMessagesAsRead = useCallback(async () => {
    if (!user) return
    const unread = query.data?.filter((m) => m.receiver_id === user.id && !m.is_read) || []
    if (unread.length === 0) return

    const { error } = await supabase
      .from('messages')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('receiver_id', user.id)
      .eq('is_read', false)

    if (!error) {
      queryClient.invalidateQueries({ queryKey: ['messages', user.id] })
    }
  }, [user, query.data, queryClient])

  useEffect(() => {
    markMessagesAsRead()
  }, [query.data, markMessagesAsRead])

  // 2. Realtime listener for new messages + typing status
  useEffect(() => {
    if (!user) return

    const logicalName = `realtime-chat-${user.id}`
    for (const existing of supabase.getChannels()) {
      if (existing.topic.includes(logicalName)) {
        void supabase.removeChannel(existing)
      }
    }

    const uniqueName = `${logicalName}:${Math.random().toString(36).slice(2, 9)}`
    const channel = supabase
      .channel(uniqueName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['messages', user.id] })
        },
      )
      .on('broadcast', { event: 'typing' }, (payload) => {
        if (payload.payload?.sender === 'officer') {
          setOfficerTyping(true)
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
          typingTimeoutRef.current = setTimeout(() => {
            setOfficerTyping(false)
          }, 3000)
        }
      })

    channel.subscribe()
    channelRef.current = channel

    return () => {
      channelRef.current = null
      void supabase.removeChannel(channel)
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    }
  }, [user, queryClient])

  // 3. Send message mutation
  const sendMutation = useMutation({
    mutationFn: async ({
      text,
      file,
    }: {
      text: string
      file?: File
    }) => {
      if (!user) throw new Error('Not authenticated')

      let fileUrl: string | null = null
      let fileName: string | null = null

      if (file) {
        // Upload attachment to chat-attachments bucket
        const fileExt = file.name.split('.').pop()
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('chat-attachments')
          .upload(path, file)

        if (!uploadError && uploadData) {
          const { data: publicUrlData } = supabase.storage
            .from('chat-attachments')
            .getPublicUrl(path)
          fileUrl = publicUrlData?.publicUrl || null
          fileName = file.name
        }
      }

      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            sender_id: user.id,
            receiver_id: null, // assigned case officer defaults to system/admin
            message: text,
            file_url: fileUrl,
            file_name: fileName,
            is_read: false,
          },
        ])
        .select()
        .single()

      if (error) throw error
      return data as ChatMessage
    },
    onMutate: async (newMsg) => {
      // Optimistic updates
      await queryClient.cancelQueries({ queryKey: ['messages', user?.id] })
      const previous = queryClient.getQueryData<ChatMessage[]>(['messages', user?.id])

      if (previous) {
        queryClient.setQueryData<ChatMessage[]>(
          ['messages', user?.id],
          [
            ...previous,
            {
              id: `optimistic-${Date.now()}`,
              sender_id: user?.id || '',
              receiver_id: null,
              message: newMsg.text,
              file_url: null,
              file_name: newMsg.file?.name || null,
              is_read: false,
              read_at: null,
              created_at: new Date().toISOString(),
            },
          ]
        )
      }
      return { previous }
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['messages', user?.id], context.previous)
      }
      toast.error('Failed to send message.')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', user?.id] })
    },
  })

  // 4. Send typing broadcast trigger
  const sendTypingBroadcast = async () => {
    if (!user || !channelRef.current) return
    await channelRef.current.send({
      type: 'broadcast',
      event: 'typing',
      payload: { sender: 'user' },
    })
  }

  return {
    messages: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    sendMessage: sendMutation.mutate,
    sendLoading: sendMutation.isPending,
    officerTyping,
    sendTypingBroadcast,
  }
}
