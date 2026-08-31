import { useState } from 'react'
import { useEmailTemplates, type EmailTemplate } from '@/hooks/useEmailTemplates'
import { Mail, Eye, Send, Save, X, Edit2, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

function timeAgo(iso: string | null) {
  if (!iso) return 'Never'
  const diff = Date.now() - new Date(iso).getTime()
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return new Date(iso).toLocaleDateString()
}

function VariablePill({ name }: { name: string }) {
  return (
    <code className="px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded font-mono">
      {`{{${name}}}`}
    </code>
  )
}

export default function EmailTemplatesPage() {
  const { templates, loading, updateTemplate, sendTestEmail, previewTemplate } = useEmailTemplates()
  const [selected, setSelected] = useState<EmailTemplate | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState<Partial<EmailTemplate>>({})
  const [previewVars, setPreviewVars] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const [testEmail, setTestEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [sending, setSending] = useState(false)

  const openTemplate = (t: EmailTemplate) => {
    setSelected(t)
    setEditForm({ subject: t.subject, html_body: t.html_body, text_body: t.text_body ?? '' })
    // Pre-fill preview vars with placeholders
    const vars: Record<string, string> = {}
    for (const v of t.variables) vars[v] = `[${v}]`
    setPreviewVars(vars)
    setEditMode(false)
    setActiveTab('edit')
  }

  const handleSave = async () => {
    if (!selected) return
    setSaving(true)
    const result = await updateTemplate(selected.id, editForm)
    setSaving(false)
    if (result.success) {
      toast.success('Template saved')
      setSelected(prev => prev ? { ...prev, ...editForm } : null)
      setEditMode(false)
    } else {
      toast.error('Failed to save template')
    }
  }

  const handleSendTest = async () => {
    if (!selected) return
    if (!testEmail.trim()) { toast.error('Enter a recipient email'); return }
    setSending(true)
    const result = await sendTestEmail(selected.id, testEmail, previewVars)
    setSending(false)
    if (result.success) toast.success(result.message)
    else toast.error('Failed to send test email')
  }

  const preview = selected ? previewTemplate(
    { ...selected, ...(editMode ? editForm : {}) } as EmailTemplate,
    previewVars,
  ) : null

  const categories = [...new Set(templates.map(t => t.category))]

  return (
    <div className="flex gap-6 h-[calc(100vh-180px)] min-h-[500px]">
      {/* Template list */}
      <div className="w-72 shrink-0 bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Mail className="w-4 h-4" /> Email Templates
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">{templates.length} templates</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />)}
            </div>
          ) : (
            categories.map(cat => (
              <div key={cat}>
                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/30 border-b border-border">
                  {cat}
                </div>
                {templates.filter(t => t.category === cat).map(t => (
                  <button
                    key={t.id}
                    onClick={() => openTemplate(t)}
                    className={`w-full text-left px-4 py-3 border-b border-border/50 hover:bg-muted/30 transition-colors ${selected?.id === t.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-foreground truncate">{t.name}</span>
                      <Badge variant="outline" className={`text-xs shrink-0 ${t.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-muted text-muted-foreground'}`}>
                        {t.is_active ? 'On' : 'Off'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{t.subject}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Sent {t.send_count}× · {timeAgo(t.last_sent_at)}</p>
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Editor / Preview */}
      {!selected ? (
        <div className="flex-1 bg-card border border-dashed border-border rounded-2xl flex items-center justify-center">
          <div className="text-center">
            <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Select a template to edit</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
          {/* Toolbar */}
          <div className="px-6 py-3 border-b border-border flex items-center gap-3 flex-wrap">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground">{selected.name}</h3>
              <div className="flex gap-1 mt-1 flex-wrap">
                {selected.variables.map(v => <VariablePill key={v} name={v} />)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-border overflow-hidden">
                <button
                  onClick={() => setActiveTab('edit')}
                  className={`px-3 py-1.5 text-sm flex items-center gap-1.5 ${activeTab === 'edit' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1.5 text-sm flex items-center gap-1.5 ${activeTab === 'preview' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
              </div>
              {!editMode ? (
                <Button size="sm" variant="outline" onClick={() => setEditMode(true)}>
                  <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Edit
                </Button>
              ) : (
                <>
                  <Button size="sm" variant="outline" onClick={() => { setEditMode(false); setEditForm({ subject: selected.subject, html_body: selected.html_body }) }}>
                    <X className="w-3.5 h-3.5 mr-1.5" /> Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={saving}>
                    <Save className="w-3.5 h-3.5 mr-1.5" />
                    {saving ? 'Saving…' : 'Save'}
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {activeTab === 'edit' ? (
              <>
                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Subject line</label>
                  {editMode ? (
                    <Input
                      value={editForm.subject ?? ''}
                      onChange={e => setEditForm(prev => ({ ...prev, subject: e.target.value }))}
                      className="font-medium"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-muted/40 rounded-lg text-sm text-foreground border border-border">{selected.subject}</div>
                  )}
                </div>

                {/* HTML body */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">HTML body</label>
                  {editMode ? (
                    <textarea
                      value={editForm.html_body ?? ''}
                      onChange={e => setEditForm(prev => ({ ...prev, html_body: e.target.value }))}
                      rows={16}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-muted/40 rounded-lg border border-border">
                      <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap overflow-x-auto max-h-64">{selected.html_body}</pre>
                    </div>
                  )}
                </div>

                {/* Text body */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Plain-text fallback</label>
                  {editMode ? (
                    <textarea
                      value={editForm.text_body ?? ''}
                      onChange={e => setEditForm(prev => ({ ...prev, text_body: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-muted/40 rounded-lg text-sm text-muted-foreground border border-border">{selected.text_body ?? '—'}</div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Variable fill-in */}
                <div className="bg-muted/30 rounded-xl p-4 border border-border space-y-3">
                  <p className="text-sm font-medium text-foreground flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" /> Fill in variables for preview
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {selected.variables.map(v => (
                      <div key={v} className="space-y-1">
                        <label className="text-xs text-muted-foreground font-mono">{`{{${v}}}`}</label>
                        <Input
                          size={1}
                          className="h-8 text-sm"
                          value={previewVars[v] ?? ''}
                          onChange={e => setPreviewVars(prev => ({ ...prev, [v]: e.target.value }))}
                          placeholder={`Enter ${v}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subject preview */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Subject</p>
                  <div className="px-3 py-2 bg-muted/40 rounded-lg border border-border text-sm font-medium">{preview?.subject}</div>
                </div>

                {/* HTML preview */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Preview</p>
                  <div className="border border-border rounded-xl overflow-hidden bg-white">
                    <iframe
                      srcDoc={preview?.html ?? ''}
                      className="w-full h-80"
                      sandbox="allow-same-origin"
                      title="Email preview"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Send test */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Send className="w-4 h-4" /> Send Test Email
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="recipient@example.com"
                  value={testEmail}
                  onChange={e => setTestEmail(e.target.value)}
                  className="flex-1"
                />
                <Button size="sm" onClick={handleSendTest} disabled={sending}>
                  {sending ? 'Sending…' : <><Send className="w-3.5 h-3.5 mr-1.5" />Send</>}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Requires Supabase + email provider configured.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
