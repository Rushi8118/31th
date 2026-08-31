import { useEffect, useState } from 'react'
import { ExternalLink, KeyRound, Save, Settings, Sparkles } from 'lucide-react'
import { PermissionGuard } from '@/components/auth/PermissionGuard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAdminAiSettings } from '@/hooks/useAdminAiSettings'
import { PROVIDER_PRESETS, type AiProviderId } from '@/lib/ai/providers'

export default function AdminSettingsPage() {
  const { settings, loading, saving, dbReady, save } = useAdminAiSettings()
  const [activeProvider, setActiveProvider] = useState<AiProviderId>('gemini')
  const [geminiApiKey, setGeminiApiKey] = useState('')
  const [geminiModel, setGeminiModel] = useState('gemini-2.0-flash')
  const [openrouterApiKey, setOpenrouterApiKey] = useState('')
  const [openrouterModel, setOpenrouterModel] = useState('google/gemini-2.0-flash-001')
  const [websiteContext, setWebsiteContext] = useState('')
  const [defaultCategory, setDefaultCategory] = useState('general')

  useEffect(() => {
    setActiveProvider(settings.activeProvider)
    setGeminiApiKey(settings.geminiApiKey)
    setGeminiModel(settings.geminiModel)
    setOpenrouterApiKey(settings.openrouterApiKey)
    setOpenrouterModel(settings.openrouterModel)
    setWebsiteContext(settings.websiteContext)
    setDefaultCategory(settings.defaultCategory)
  }, [settings])

  const handleSave = async () => {
    await save({
      activeProvider,
      geminiApiKey,
      geminiModel,
      openrouterApiKey,
      openrouterModel,
      websiteContext,
      defaultCategory,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <Settings className="h-6 w-6" /> Settings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Shared admin configuration — AI keys apply to every admin account.
          </p>
        </div>
        <PermissionGuard permission="settings.update">
          <Button onClick={handleSave} disabled={saving || loading} className="gap-1.5">
            <Save className="h-4 w-4" />
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </PermissionGuard>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Blog Providers
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Store Gemini and OpenRouter API keys in the database for all admins. Edit model names
              freely.
            </p>
          </div>
          <span
            className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
              dbReady
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-amber-200 bg-amber-50 text-amber-900'
            }`}
          >
            {dbReady ? 'Saved in database (shared)' : 'Local fallback — run 022 SQL for shared DB'}
          </span>
        </div>

        <div className="mb-5 grid gap-3 sm:grid-cols-2">
          {(Object.keys(PROVIDER_PRESETS) as AiProviderId[]).map((id) => {
            const preset = PROVIDER_PRESETS[id]
            const selected = activeProvider === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveProvider(id)}
                className={`rounded-xl border p-4 text-left transition ${
                  selected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
                }`}
              >
                <p className="font-semibold text-foreground">{preset.label}</p>
                <a
                  href={preset.docsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Get API key <ExternalLink className="h-3 w-3" />
                </a>
              </button>
            )
          })}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <ProviderFields
            title="Google Gemini"
            icon={<KeyRound className="h-4 w-4" />}
            apiKey={geminiApiKey}
            onApiKey={setGeminiApiKey}
            model={geminiModel}
            onModel={setGeminiModel}
            models={PROVIDER_PRESETS.gemini.models}
            placeholder="AIza…"
          />
          <ProviderFields
            title="OpenRouter"
            icon={<KeyRound className="h-4 w-4" />}
            apiKey={openrouterApiKey}
            onApiKey={setOpenrouterApiKey}
            model={openrouterModel}
            onModel={setOpenrouterModel}
            models={PROVIDER_PRESETS.openrouter.models}
            placeholder="sk-or-…"
          />
        </div>

        <div className="mt-5 space-y-4 border-t border-border pt-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Website context for Auto mode
            </label>
            <textarea
              value={websiteContext}
              onChange={(e) => setWebsiteContext(e.target.value)}
              rows={4}
              className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              placeholder="Describe the business so Auto mode picks the right keywords…"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Default blog category
            </label>
            <select
              value={defaultCategory}
              onChange={(e) => setDefaultCategory(e.target.value)}
              className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm sm:max-w-xs"
            >
              <option value="general">general</option>
              <option value="study_visa">study_visa</option>
              <option value="work_visa">work_visa</option>
              <option value="country_guide">country_guide</option>
              <option value="tips">tips</option>
              <option value="document_guide">document_guide</option>
              <option value="immigration_news">immigration_news</option>
              <option value="success_story">success_story</option>
            </select>
          </div>
        </div>

        <PermissionGuard permission="settings.update">
          <Button onClick={handleSave} disabled={saving || loading} className="mt-5 gap-1.5">
            <Save className="h-4 w-4" />
            Save AI settings
          </Button>
        </PermissionGuard>
      </div>
    </div>
  )
}

function ProviderFields({
  title,
  icon,
  apiKey,
  onApiKey,
  model,
  onModel,
  models,
  placeholder,
}: {
  title: string
  icon: React.ReactNode
  apiKey: string
  onApiKey: (v: string) => void
  model: string
  onModel: (v: string) => void
  models: string[]
  placeholder: string
}) {
  return (
    <div className="space-y-3 rounded-xl border border-border p-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        {icon}
        {title}
      </h3>
      <div>
        <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          API key
        </label>
        <Input
          type="password"
          value={apiKey}
          onChange={(e) => onApiKey(e.target.value)}
          placeholder={placeholder}
          className="mt-1.5"
          autoComplete="off"
        />
      </div>
      <div>
        <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Model name (editable)
        </label>
        <Input
          value={model}
          onChange={(e) => onModel(e.target.value)}
          list={`${title}-models`}
          className="mt-1.5"
        />
        <datalist id={`${title}-models`}>
          {models.map((m) => (
            <option key={m} value={m} />
          ))}
        </datalist>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Pick a preset or type any model id your provider supports.
        </p>
      </div>
    </div>
  )
}
