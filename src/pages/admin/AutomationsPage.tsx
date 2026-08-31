import { useState } from 'react'
import { useAutomations, TRIGGER_EVENTS, ACTION_TYPES, type Automation, type AutomationAction } from '@/hooks/useAutomations'
import { useAuth } from '@/hooks/use-auth'
import { Plus, Zap, Trash2, Edit2, Power, PowerOff, X, Save, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

const ACTION_FIELD_HINTS: Record<string, Record<string, string>> = {
  send_email:          { template: 'Template slug (e.g. welcome)', to: 'Recipient (e.g. {{user.email}})' },
  send_slack:          { channel: 'Slack channel (e.g. #alerts)', message: 'Message text' },
  send_whatsapp:       { to: 'Phone (e.g. {{user.phone}})', message: 'Message text' },
  create_notification: { title: 'Notification title', message: 'Notification body' },
  update_status:       { resource: 'Table name', field: 'Field name', value: 'New value' },
  webhook:             { url: 'Webhook URL', method: 'POST or GET' },
}

function timeAgo(iso: string | null) {
  if (!iso) return 'Never'
  const diff = Date.now() - new Date(iso).getTime()
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return new Date(iso).toLocaleDateString()
}

function ActionBadge({ action }: { action: AutomationAction }) {
  const meta = ACTION_TYPES.find(a => a.value === action.type)
  return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
      {meta?.icon} {meta?.label ?? action.type}
    </span>
  )
}

interface AutomationFormData {
  name: string
  description: string
  trigger_event: string
  actions: AutomationAction[]
  is_active: boolean
}

const EMPTY_FORM: AutomationFormData = {
  name: '', description: '', trigger_event: 'user.registered',
  actions: [{ type: 'send_email', config: { template: 'welcome', to: '{{user.email}}' } }],
  is_active: true,
}

export default function AutomationsPage() {
  const { profile } = useAuth()
  const { automations, loading, createAutomation, deleteAutomation, toggleAutomation } = useAutomations()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<AutomationFormData>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const addAction = () => {
    setForm(prev => ({
      ...prev,
      actions: [...prev.actions, { type: 'send_email', config: {} }],
    }))
  }

  const updateAction = (idx: number, updates: Partial<AutomationAction>) => {
    setForm(prev => ({
      ...prev,
      actions: prev.actions.map((a, i) => i === idx ? { ...a, ...updates } : a),
    }))
  }

  const updateActionConfig = (idx: number, key: string, val: string) => {
    setForm(prev => ({
      ...prev,
      actions: prev.actions.map((a, i) => i === idx ? { ...a, config: { ...a.config, [key]: val } } : a),
    }))
  }

  const removeAction = (idx: number) => {
    setForm(prev => ({ ...prev, actions: prev.actions.filter((_, i) => i !== idx) }))
  }

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return }
    if (form.actions.length === 0) { toast.error('Add at least one action'); return }
    setSaving(true)
    const result = await createAutomation({
      ...form,
      created_by: profile?.id ?? null,
      conditions: [],
    })
    setSaving(false)
    if (result.success) {
      toast.success('Automation created')
      setShowForm(false)
      setForm(EMPTY_FORM)
    }
  }

  const groupedTriggers: Record<string, typeof TRIGGER_EVENTS> = {}
  for (const t of TRIGGER_EVENTS) {
    if (!groupedTriggers[t.category]) groupedTriggers[t.category] = []
    groupedTriggers[t.category].push(t)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Automations</h1>
          <p className="text-sm text-muted-foreground mt-1">When X happens → do Y. No code required.</p>
        </div>
        <Button onClick={() => setShowForm(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" /> New Automation
        </Button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" /> New Automation
            </h2>
            <button onClick={() => { setShowForm(false); setForm(EMPTY_FORM) }} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Basic info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Name *</label>
                <Input
                  placeholder="e.g. Welcome email on signup"
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Description</label>
                <Input
                  placeholder="What does this automation do?"
                  value={form.description}
                  onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>

            {/* Trigger */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Trigger: When this happens…</label>
              <div className="relative">
                <select
                  value={form.trigger_event}
                  onChange={e => setForm(prev => ({ ...prev, trigger_event: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                >
                  {Object.entries(groupedTriggers).map(([cat, events]) => (
                    <optgroup key={cat} label={cat}>
                      {events.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </optgroup>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Actions: Then do this…</label>
              {form.actions.map((action, idx) => {
                const hints = ACTION_FIELD_HINTS[action.type] ?? {}
                return (
                  <div key={idx} className="p-4 bg-muted/30 rounded-xl border border-border space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <select
                          value={action.type}
                          onChange={e => updateAction(idx, { type: e.target.value as AutomationAction['type'], config: {} })}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary pr-8"
                        >
                          {ACTION_TYPES.map(t => (
                            <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-2.5 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                      </div>
                      {form.actions.length > 1 && (
                        <button onClick={() => removeAction(idx)} className="text-muted-foreground hover:text-red-600 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Object.entries(hints).map(([key, placeholder]) => (
                        <div key={key} className="space-y-1">
                          <label className="text-xs text-muted-foreground capitalize">{key.replace('_', ' ')}</label>
                          <Input
                            size={1}
                            placeholder={placeholder}
                            value={action.config[key] ?? ''}
                            onChange={e => updateActionConfig(idx, key, e.target.value)}
                            className="text-sm h-8"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
              <Button variant="outline" size="sm" onClick={addAction}>
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Another Action
              </Button>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => { setShowForm(false); setForm(EMPTY_FORM) }}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving…' : 'Save Automation'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Automations list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-card border border-border rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : automations.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center">
          <Zap className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium text-foreground">No automations yet</p>
          <p className="text-sm text-muted-foreground mt-1">Create your first automation to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {automations.map((auto: Automation) => {
            const trigger = TRIGGER_EVENTS.find(t => t.value === auto.trigger_event)
            return (
              <div key={auto.id} className={`bg-card border rounded-2xl p-5 flex items-start gap-4 transition-opacity ${!auto.is_active ? 'opacity-60' : ''} border-border`}>
                <div className={`p-2.5 rounded-xl mt-0.5 ${auto.is_active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  <Zap className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground">{auto.name}</h3>
                    <Badge variant="outline" className={`text-xs ${auto.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-muted text-muted-foreground'}`}>
                      {auto.is_active ? 'Active' : 'Paused'}
                    </Badge>
                  </div>
                  {auto.description && <p className="text-sm text-muted-foreground mt-0.5">{auto.description}</p>}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">
                      🎯 <strong>Trigger:</strong> {trigger?.label ?? auto.trigger_event}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <div className="flex gap-1 flex-wrap">
                      {auto.actions.map((a, i) => <ActionBadge key={i} action={a} />)}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Ran {auto.run_count} times · Last run {timeAgo(auto.last_run_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleAutomation(auto.id, !auto.is_active)}
                    className={`p-2 rounded-lg transition-colors ${auto.is_active ? 'text-green-600 hover:bg-green-50' : 'text-muted-foreground hover:bg-muted'}`}
                    title={auto.is_active ? 'Pause' : 'Resume'}
                  >
                    {auto.is_active ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this automation?')) deleteAutomation(auto.id)
                    }}
                    className="p-2 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
