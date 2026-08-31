import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from './use-auth'
import { toast } from 'sonner'

export type Appointment = {
  id: string
  user_id: string
  assigned_officer: string | null
  appointment_type: 'Video Call' | 'In-Person' | 'Phone Call'
  status: 'Scheduled' | 'Completed' | 'Cancelled'
  scheduled_at: string
  duration_minutes: number
  notes: string | null
  created_at: string
  updated_at: string
}

export function useAppointments() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // 1. Fetch user appointments
  const query = useQuery<Appointment[], Error>({
    queryKey: ['appointments', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('scheduled_at', { ascending: false })

      if (error) {
        // Fallback: Check consultations table if appointments table doesn't have records
        console.warn('Appointments select failed, check consultations:', error.message)
        const { data: consData, error: consError } = await supabase
          .from('consultations')
          .select('*')
          .eq('user_id', user.id)
          .order('scheduled_at', { ascending: false })

        if (consError) throw consError

        // Map consultations to appointments schema
        return (consData || []).map((c: any) => ({
          id: c.id,
          user_id: c.user_id || '',
          assigned_officer: c.assigned_consultant || null,
          appointment_type: c.consultation_type.includes('call') ? 'Phone Call' : 'Video Call',
          status: c.status === 'scheduled' || c.status === 'confirmed' ? 'Scheduled' : c.status === 'cancelled' ? 'Cancelled' : 'Completed',
          scheduled_at: c.scheduled_at,
          duration_minutes: c.duration_minutes || 30,
          notes: c.user_notes?.notes || null,
          created_at: c.created_at,
          updated_at: c.updated_at,
        })) as Appointment[]
      }

      return data as Appointment[]
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  })

  // 2. Book new appointment
  const bookMutation = useMutation({
    mutationFn: async (payload: {
      type: 'Video Call' | 'In-Person' | 'Phone Call'
      date: Date
      timeSlot: string
      notes?: string
    }) => {
      if (!user) throw new Error('Not authenticated')

      // Parse date and timeSlot together (e.g. date: 2026-05-28, slot: "10:00 AM")
      const [time, modifier] = payload.timeSlot.split(' ')
      let [hours, minutes] = time.split(':').map(Number)
      if (modifier === 'PM' && hours < 12) hours += 12
      if (modifier === 'AM' && hours === 12) hours = 0

      const scheduledDate = new Date(payload.date)
      scheduledDate.setHours(hours, minutes, 0, 0)

      const insertData = {
        user_id: user.id,
        appointment_type: payload.type,
        status: 'Scheduled',
        scheduled_at: scheduledDate.toISOString(),
        duration_minutes: 30,
        notes: payload.notes || null,
      }

      const { data, error } = await supabase
        .from('appointments')
        .insert([insertData])
        .select()
        .single()

      if (error) {
        // Fallback insertion into consultations table to maintain backward compatibility!
        console.warn('Insert into appointments failed, using fallback insert into consultations:', error.message)
        const fallbackType = payload.type === 'Phone Call' ? 'general' : 'work_visa'
        const { data: cData, error: cError } = await supabase
          .from('consultations')
          .insert([
            {
              user_id: user.id,
              consultation_type: fallbackType,
              status: 'scheduled',
              scheduled_at: scheduledDate.toISOString(),
              duration_minutes: 30,
              user_notes: { notes: payload.notes || '', source: 'appointments_page' },
            },
          ])
          .select()
          .single()

        if (cError) throw cError
        return cData
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', user?.id] })
      toast.success('Appointment booked successfully!', {
        description: 'A confirmation slot notification has been generated.',
      })
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to book appointment.')
    },
  })

  // 3. Cancel appointment
  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      // First try to update appointments
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'Cancelled' })
        .eq('id', id)

      if (error) {
        // Fallback cancellation inside consultations
        console.warn('Appointments cancellation failed, trying consultations cancellation:', error.message)
        const { error: cError } = await supabase
          .from('consultations')
          .update({ status: 'cancelled' })
          .eq('id', id)

        if (cError) throw cError
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', user?.id] })
      toast.success('Appointment cancelled successfully.')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to cancel appointment.')
    },
  })

  return {
    appointments: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    bookAppointment: bookMutation.mutate,
    bookLoading: bookMutation.isPending,
    cancelAppointment: cancelMutation.mutate,
    cancelLoading: cancelMutation.isPending,
  }
}
