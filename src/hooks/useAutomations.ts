import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'

export interface AutomationCondition {
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than'
  value: string
}

export interface AutomationAction {
  type: 'send_email' | 'send_slack' | 'send_whatsapp' | 'create_notification' | 'update_status' | 'webhook'
  config: Record<string, string>
}

export interface Automation {
  id: string
  name: string
  description: string | null
  trigger_event: string
  conditions: AutomationCondition[]
  actions: AutomationAction[]
  is_active: boolean
  run_count: number
  last_run_at: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export const TRIGGER_EVENTS: { value: string; label: string; category: string }[] = [
  { value: 'user.registered',          label: 'User registered',                category: 'Users' },
  { value: 'user.role_changed',        label: 'User role changed',              category: 'Users' },
  { value: 'user.suspended',           label: 'User account suspended',         category: 'Users' },
  { value: 'application.submitted',   label: 'Application submitted',          category: 'Applications' },
  { value: 'application.approved',    label: 'Application approved',           category: 'Applications' },
  { value: 'application.rejected',    label: 'Application rejected',           category: 'Applications' },
  { value: 'appointment.booked',      label: 'Appointment booked',             category: 'Appointments' },
  { value: 'appointment.cancelled',   label: 'Appointment cancelled',          category: 'Appointments' },
  { value: 'auth.suspicious_login',   label: 'Suspicious login detected',      category: 'Security' },
  { value: 'auth.failed_login',       label: 'Failed login attempt (×5)',      category: 'Security' },
  { value: 'session.terminated',      label: 'Session forcefully terminated',   category: 'Security' },
  { value: 'document.uploaded',       label: 'Document uploaded',              category: 'Documents' },
  { value: 'payment.failed',          label: 'Payment failed',                 category: 'Payments' },
  { value: 'payment.completed',       label: 'Payment completed',              category: 'Payments' },
]

export const ACTION_TYPES: { value: AutomationAction['type']; label: string; icon: string }[] = [
  { value: 'send_email',           label: 'Send Email',           icon: '✉️' },
  { value: 'send_slack',           label: 'Send Slack Message',   icon: '💬' },
  { value: 'send_whatsapp',        label: 'Send WhatsApp',        icon: '📱' },
  { value: 'create_notification',  label: 'Create Notification',  icon: '🔔' },
  { value: 'update_status',        label: 'Update Status',        icon: '🔄' },
  { value: 'webhook',              label: 'Call Webhook',         icon: '🌐' },
]

export function useAutomations() {
  const [automations, setAutomations] = useState<Automation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAutomations = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error: err } = await supabase
        .from('automations')
        .select('*')
        .order('created_at', { ascending: false })
      if (err) throw err
      setAutomations(data ?? [])
    } catch {
      setError('Failed to load automations')
      setAutomations(DEMO_AUTOMATIONS)
    } finally {
      setLoading(false)
    }
  }, [])

  const createAutomation = useCallback(async (data: Omit<Automation, 'id' | 'run_count' | 'last_run_at' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: created, error: err } = await supabase
        .from('automations')
        .insert({ ...data, conditions: data.conditions, actions: data.actions })
        .select()
        .single()
      if (err) throw err
      setAutomations(prev => [created as Automation, ...prev])
      return { success: true, data: created }
    } catch {
      // Demo mode: add locally
      const demo: Automation = {
        ...data, id: Date.now().toString(), run_count: 0,
        last_run_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      }
      setAutomations(prev => [demo, ...prev])
      return { success: true, data: demo }
    }
  }, [])

  const updateAutomation = useCallback(async (id: string, updates: Partial<Automation>) => {
    try {
      const { error: err } = await supabase.from('automations').update(updates).eq('id', id)
      if (err) throw err
    } catch { /* demo mode */ }
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a))
  }, [])

  const deleteAutomation = useCallback(async (id: string) => {
    try {
      await supabase.from('automations').delete().eq('id', id)
    } catch { /* demo mode */ }
    setAutomations(prev => prev.filter(a => a.id !== id))
  }, [])

  const toggleAutomation = useCallback(async (id: string, isActive: boolean) => {
    await updateAutomation(id, { is_active: isActive })
  }, [updateAutomation])

  useEffect(() => { fetchAutomations() }, [fetchAutomations])

  return { automations, loading, error, fetchAutomations, createAutomation, updateAutomation, deleteAutomation, toggleAutomation }
}

const DEMO_AUTOMATIONS: Automation[] = [
  {
    id: 'a1', name: 'Welcome email on registration', description: 'Send welcome email when a new user registers',
    trigger_event: 'user.registered', conditions: [],
    actions: [{ type: 'send_email', config: { template: 'welcome', to: '{{user.email}}' } }],
    is_active: true, run_count: 142, last_run_at: new Date(Date.now() - 3600000).toISOString(),
    created_by: 'u1', created_at: new Date(Date.now() - 7 * 86400000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'a2', name: 'Alert admin on suspicious login', description: 'Notify admin via Slack when suspicious login detected',
    trigger_event: 'auth.suspicious_login', conditions: [],
    actions: [
      { type: 'send_slack', config: { channel: '#security', message: 'Suspicious login from {{session.ip}} — User: {{user.email}}' } },
      { type: 'send_email', config: { template: 'admin-alert', to: 'admin@example.com' } },
    ],
    is_active: true, run_count: 3, last_run_at: new Date(Date.now() - 86400000).toISOString(),
    created_by: 'u1', created_at: new Date(Date.now() - 5 * 86400000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'a3', name: 'WhatsApp confirmation on appointment', description: 'Send WhatsApp message when appointment is booked',
    trigger_event: 'appointment.booked', conditions: [],
    actions: [{ type: 'send_whatsapp', config: { to: '{{user.phone}}', message: 'Your appointment is confirmed for {{appointment.date}}.' } }],
    is_active: false, run_count: 28, last_run_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    created_by: 'u1', created_at: new Date(Date.now() - 3 * 86400000).toISOString(), updated_at: new Date().toISOString(),
  },
]
