import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { subscribePostgresChanges } from '@/lib/supabase/realtime'

export function useRealtimeCountries() {
  const queryClient = useQueryClient()

  useEffect(() => {
    return subscribePostgresChanges(
      supabase,
      'schema-db-changes',
      [
        { event: '*', schema: 'public', table: 'countries' },
        { event: '*', schema: 'public', table: 'visa_programs' },
      ],
      (payload) => {
        const table = (payload as { table?: string }).table
        if (table === 'visa_programs') {
          queryClient.invalidateQueries({ queryKey: ['visaPrograms'] })
          queryClient.invalidateQueries({ queryKey: ['visaProgram'] })
          return
        }
        queryClient.invalidateQueries({ queryKey: ['countries'] })
        queryClient.invalidateQueries({ queryKey: ['country'] })
      },
    )
  }, [queryClient])
}
