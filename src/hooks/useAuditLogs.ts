import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'

export interface AuditLog {
  id: string
  user_id: string | null
  user_email: string | null
  user_role: string | null
  action: string
  resource: string | null
  resource_id: string | null
  old_value: Record<string, unknown> | null
  new_value: Record<string, unknown> | null
  ip_address: string | null
  user_agent: string | null
  fingerprint: string | null
  severity: 'info' | 'warning' | 'critical'
  created_at: string
}

export interface AuditLogFilters {
  action?: string
  severity?: string
  userId?: string
  from?: string
  to?: string
  search?: string
}

export function useAuditLogs(filters: AuditLogFilters = {}) {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const fetchLogs = useCallback(async (page = 1, limit = 50) => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase
        .from('audit_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1)

      if (filters.severity) query = query.eq('severity', filters.severity)
      if (filters.userId)   query = query.eq('user_id', filters.userId)
      if (filters.action)   query = query.ilike('action', `%${filters.action}%`)
      if (filters.from)     query = query.gte('created_at', filters.from)
      if (filters.to)       query = query.lte('created_at', filters.to)
      if (filters.search)   query = query.or(
        `user_email.ilike.%${filters.search}%,action.ilike.%${filters.search}%,resource.ilike.%${filters.search}%`
      )

      const { data, error: err, count } = await query
      if (err) throw err
      setLogs(data ?? [])
      setTotal(count ?? 0)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load audit logs')
      // Provide realistic demo data when no Supabase connected
      setLogs(DEMO_AUDIT_LOGS)
      setTotal(DEMO_AUDIT_LOGS.length)
    } finally {
      setLoading(false)
    }
  }, [filters.severity, filters.userId, filters.action, filters.from, filters.to, filters.search])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  return { logs, loading, error, total, refetch: fetchLogs }
}

export async function insertAuditLog(entry: Omit<AuditLog, 'id' | 'created_at'>) {
  try {
    await supabase.from('audit_logs').insert(entry)
  } catch {
    // Silently fail — audit log should never break main flow
  }
}

// ─── Demo data (shown when Supabase not yet connected) ────────────────────────
const DEMO_AUDIT_LOGS: AuditLog[] = [
  {
    id: '1', user_id: 'u1', user_email: 'admin@example.com', user_role: 'admin',
    action: 'user.role_changed', resource: 'user_profiles', resource_id: 'u2',
    old_value: { user_role: 'viewer' }, new_value: { user_role: 'editor' },
    ip_address: '192.168.1.10', user_agent: 'Chrome/124 macOS', fingerprint: 'abc123',
    severity: 'warning', created_at: new Date(Date.now() - 60000).toISOString(),
  },
  {
    id: '2', user_id: 'u1', user_email: 'admin@example.com', user_role: 'admin',
    action: 'session.terminated', resource: 'admin_sessions', resource_id: 's1',
    old_value: { is_active: true }, new_value: { is_active: false },
    ip_address: '192.168.1.10', user_agent: 'Chrome/124 macOS', fingerprint: 'abc123',
    severity: 'info', created_at: new Date(Date.now() - 120000).toISOString(),
  },
  {
    id: '3', user_id: 'u3', user_email: 'hacker@unknown.com', user_role: 'user',
    action: 'auth.suspicious_login', resource: 'admin_sessions', resource_id: null,
    old_value: null, new_value: { reason: 'Fingerprint mismatch (score: 75)' },
    ip_address: '45.33.32.156', user_agent: 'curl/7.88.1', fingerprint: 'xxx999',
    severity: 'critical', created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '4', user_id: 'u2', user_email: 'manager@example.com', user_role: 'manager',
    action: 'email_template.updated', resource: 'email_templates', resource_id: 'welcome',
    old_value: { subject: 'Welcome!' }, new_value: { subject: 'Welcome to Siddhivinayak!' },
    ip_address: '10.0.0.5', user_agent: 'Firefox/125 Windows', fingerprint: 'def456',
    severity: 'info', created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '5', user_id: 'u1', user_email: 'admin@example.com', user_role: 'admin',
    action: 'automation.created', resource: 'automations', resource_id: 'a1',
    old_value: null, new_value: { name: 'Welcome email on signup' },
    ip_address: '192.168.1.10', user_agent: 'Chrome/124 macOS', fingerprint: 'abc123',
    severity: 'info', created_at: new Date(Date.now() - 86400000).toISOString(),
  },
]
