import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { subscribePostgresChanges } from '@/lib/supabase/realtime'
import { useAuth } from './use-auth'
import { toast } from 'sonner'

export type Application = {
  id: string
  application_id: string | null
  user_id: string
  visa_program_id: string
  country_id: string
  application_type: 'work' | 'study' | 'business' | 'tourist' | 'investor'
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'withdrawn'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  personal_info: any
  education_history: any
  work_history: any
  document_checklist: any
  submitted_at: string | null
  review_started_at: string | null
  decision_at: string | null
  estimated_completion: string | null
  assigned_consultant: string | null
  consultant_notes: string | null
  created_at: string
  updated_at: string
  countries?: { name: string; flag_emoji: string }
  visa_programs?: { name: string }
}

export function useApplications() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // 1. Query applications list
  const query = useQuery<Application[], Error>({
    queryKey: ['applications', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          countries(name, flag_emoji),
          visa_programs(name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Application[]
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  // 2. Realtime subscription to reload applications
  useEffect(() => {
    if (!user?.id) return

    return subscribePostgresChanges(
      supabase,
      `user-apps-${user.id}`,
      {
        event: '*',
        schema: 'public',
        table: 'applications',
        filter: `user_id=eq.${user.id}`,
      },
      () => {
        queryClient.invalidateQueries({ queryKey: ['applications', user.id] })
      },
    )
  }, [user?.id, queryClient])

  // 3. Submit new application mutation
  const createApplicationMutation = useMutation({
    mutationFn: async (payload: Partial<Application>) => {
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('applications')
        .insert([{ ...payload, user_id: user.id }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications', user?.id] })
      toast.success('Application started successfully!')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to submit application.')
    },
  })

  return {
    applications: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    createApplication: createApplicationMutation.mutate,
    createLoading: createApplicationMutation.isPending,
  }
}
