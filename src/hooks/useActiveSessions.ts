import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'

export interface AdminSession {
  id: string
  user_id: string
  user_email?: string
  user_role?: string
  fingerprint: string | null
  user_agent: string | null
  ip_address: string | null
  device_type: string | null
  browser: string | null
  os: string | null
  location: string | null
  timezone: string | null
  is_active: boolean
  last_seen: string
  terminated_at: string | null
  terminated_by: string | null
  created_at: string
}

export function useActiveSessions() {
  const [sessions, setSessions] = useState<AdminSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tableMissing, setTableMissing] = useState(false)

  const fetchSessions = useCallback(async () => {
    if (tableMissing) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('admin_sessions')
        .select('*')
        .order('last_seen', { ascending: false })
        .limit(100)

      // Table missing (PGRST205) — use demo data and stop polling 404s
      if (err) {
        if (err.code === 'PGRST205' || /Could not find the table/i.test(err.message)) {
          setTableMissing(true)
          setError(null)
          setSessions(DEMO_SESSIONS)
          return
        }
        throw err
      }
      setSessions(data ?? [])
    } catch {
      setError('Failed to load sessions')
      setSessions(DEMO_SESSIONS)
    } finally {
      setLoading(false)
    }
  }, [tableMissing])

  const terminateSession = useCallback(async (sessionId: string, terminatedBy: string) => {
    try {
      if (!tableMissing) {
        const { error: err } = await supabase
          .from('admin_sessions')
          .update({
            is_active: false,
            terminated_at: new Date().toISOString(),
            terminated_by: terminatedBy,
          })
          .eq('id', sessionId)
        if (err) throw err
      }
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, is_active: false, terminated_at: new Date().toISOString() }
            : s,
        ),
      )
      return { success: true }
    } catch (err: unknown) {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, is_active: false, terminated_at: new Date().toISOString() }
            : s,
        ),
      )
      return { success: false, error: err instanceof Error ? err.message : 'Failed' }
    }
  }, [tableMissing])

  useEffect(() => {
    void fetchSessions()
    if (tableMissing) return
    const interval = setInterval(() => {
      void fetchSessions()
    }, 30000)
    return () => clearInterval(interval)
  }, [fetchSessions, tableMissing])

  const activeSessions = sessions.filter(s => s.is_active)
  const terminatedSessions = sessions.filter(s => !s.is_active)

  return { sessions, activeSessions, terminatedSessions, loading, error, refetch: fetchSessions, terminateSession }
}

const DEMO_SESSIONS: AdminSession[] = [
  {
    id: 's1', user_id: 'u1', user_email: 'admin@example.com', user_role: 'admin',
    fingerprint: 'abc123', user_agent: 'Mozilla/5.0 (Macintosh) Chrome/124',
    ip_address: '192.168.1.10', device_type: 'Desktop', browser: 'Chrome', os: 'macOS',
    location: 'Mumbai, IN', timezone: 'Asia/Kolkata', is_active: true,
    last_seen: new Date(Date.now() - 30000).toISOString(),
    terminated_at: null, terminated_by: null, created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 's2', user_id: 'u2', user_email: 'manager@example.com', user_role: 'manager',
    fingerprint: 'def456', user_agent: 'Mozilla/5.0 (Windows NT) Firefox/125',
    ip_address: '10.0.0.5', device_type: 'Desktop', browser: 'Firefox', os: 'Windows',
    location: 'Pune, IN', timezone: 'Asia/Kolkata', is_active: true,
    last_seen: new Date(Date.now() - 120000).toISOString(),
    terminated_at: null, terminated_by: null, created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 's3', user_id: 'u3', user_email: 'editor@example.com', user_role: 'editor',
    fingerprint: 'ghi789', user_agent: 'Mozilla/5.0 (iPhone) Safari/17',
    ip_address: '172.16.0.1', device_type: 'Mobile', browser: 'Safari', os: 'iOS',
    location: 'Delhi, IN', timezone: 'Asia/Kolkata', is_active: false,
    last_seen: new Date(Date.now() - 86400000).toISOString(),
    terminated_at: new Date(Date.now() - 86400000).toISOString(), terminated_by: 'u1',
    created_at: new Date(Date.now() - 90000000).toISOString(),
  },
]
