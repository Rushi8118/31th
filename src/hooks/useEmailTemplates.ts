import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'

export interface EmailTemplate {
  id: string
  name: string
  slug: string
  subject: string
  html_body: string
  text_body: string | null
  variables: string[]
  category: string
  is_active: boolean
  last_sent_at: string | null
  send_count: number
  created_by: string | null
  created_at: string
  updated_at: string
}

export function useEmailTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTemplates = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error: err } = await supabase
        .from('email_templates')
        .select('*')
        .order('category', { ascending: true })
      if (err) throw err
      setTemplates((data ?? []).map(t => ({ ...t, variables: Array.isArray(t.variables) ? t.variables : JSON.parse(t.variables ?? '[]') })))
    } catch {
      setError('Failed to load email templates')
      setTemplates(DEMO_TEMPLATES)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateTemplate = useCallback(async (id: string, updates: Partial<EmailTemplate>) => {
    try {
      const { error: err } = await supabase
        .from('email_templates')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
      if (err) throw err
    } catch { /* demo mode */ }
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
    return { success: true }
  }, [])

  const sendTestEmail = useCallback(async (_templateId: string, _to: string, _variables: Record<string, string>) => {
    // In production, this would call a Supabase Edge Function
    await new Promise(r => setTimeout(r, 1200))
    return { success: true, message: 'Test email queued (connect Supabase to send real emails)' }
  }, [])

  const previewTemplate = useCallback((template: EmailTemplate, variables: Record<string, string>) => {
    let html = template.html_body
    let subject = template.subject
    for (const [key, val] of Object.entries(variables)) {
      const re = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g')
      html = html.replace(re, val)
      subject = subject.replace(re, val)
    }
    return { html, subject }
  }, [])

  useEffect(() => { fetchTemplates() }, [fetchTemplates])

  return { templates, loading, error, fetchTemplates, updateTemplate, sendTestEmail, previewTemplate }
}

export const DEMO_TEMPLATES: EmailTemplate[] = [
  {
    id: 't1', name: 'Welcome Email', slug: 'welcome',
    subject: 'Welcome to Siddhivinayak Overseas, {{full_name}}!',
    html_body: `<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
<h1 style="color:#b45309">Welcome, {{full_name}}!</h1>
<p>Thank you for registering with <strong>Siddhivinayak Overseas</strong>.</p>
<p>Start your visa journey today — explore countries, apply for visas, and book a consultation.</p>
<a href="{{dashboard_url}}" style="display:inline-block;background:#b45309;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px">Go to Dashboard</a>
</body></html>`,
    text_body: 'Welcome {{full_name}}! Thank you for registering.',
    variables: ['full_name', 'dashboard_url', 'email'],
    category: 'transactional', is_active: true,
    last_sent_at: new Date(Date.now() - 3600000).toISOString(), send_count: 142,
    created_by: null, created_at: new Date(Date.now() - 86400000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 't2', name: 'Password Reset', slug: 'password-reset',
    subject: 'Reset your Siddhivinayak Overseas password',
    html_body: `<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
<h1 style="color:#b45309">Reset Your Password</h1>
<p>Hi {{full_name}},</p>
<p>Click the button below to reset your password. This link expires in 1 hour.</p>
<a href="{{reset_url}}" style="display:inline-block;background:#b45309;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px">Reset Password</a>
<p style="color:#666;font-size:12px;margin-top:24px">If you didn't request this, you can ignore this email.</p>
</body></html>`,
    text_body: 'Hi {{full_name}}, reset your password: {{reset_url}}',
    variables: ['full_name', 'reset_url', 'email'],
    category: 'transactional', is_active: true,
    last_sent_at: new Date(Date.now() - 7200000).toISOString(), send_count: 34,
    created_by: null, created_at: new Date(Date.now() - 86400000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 't3', name: 'Application Received', slug: 'application-received',
    subject: 'We received your visa application — Ref #{{application_id}}',
    html_body: `<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
<h1 style="color:#b45309">Application Received ✓</h1>
<p>Hi {{full_name}},</p>
<p>We have received your visa application for <strong>{{country_name}}</strong>.</p>
<p><strong>Reference:</strong> #{{application_id}}</p>
<p>Our team will review your documents and contact you within 2–3 business days.</p>
</body></html>`,
    text_body: 'Hi {{full_name}}, your application #{{application_id}} for {{country_name}} has been received.',
    variables: ['full_name', 'application_id', 'country_name', 'email'],
    category: 'transactional', is_active: true,
    last_sent_at: new Date(Date.now() - 1800000).toISOString(), send_count: 89,
    created_by: null, created_at: new Date(Date.now() - 86400000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 't4', name: 'Admin Alert', slug: 'admin-alert',
    subject: '[ALERT] {{alert_type}} — Siddhivinayak Admin',
    html_body: `<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
<h1 style="color:#dc2626">⚠️ Admin Alert</h1>
<p><strong>Type:</strong> {{alert_type}}</p>
<p><strong>Details:</strong> {{alert_message}}</p>
<p><strong>Time:</strong> {{timestamp}}</p>
</body></html>`,
    text_body: 'ALERT [{{alert_type}}]: {{alert_message}} at {{timestamp}}',
    variables: ['alert_type', 'alert_message', 'timestamp'],
    category: 'admin', is_active: true,
    last_sent_at: null, send_count: 3,
    created_by: null, created_at: new Date(Date.now() - 86400000).toISOString(), updated_at: new Date().toISOString(),
  },
]
