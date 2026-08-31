import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import type { AiProviderConfig, AiProviderId } from '@/lib/ai/providers'
import { toast } from 'sonner'

const LOCAL_KEY = 'svo_admin_ai_settings_v1'

export type AdminAiSettings = AiProviderConfig & {
  websiteContext: string
  defaultCategory: string
  source: 'db' | 'local'
}

const DEFAULTS: AdminAiSettings = {
  activeProvider: 'gemini',
  geminiApiKey: '',
  geminiModel: 'gemini-2.0-flash',
  openrouterApiKey: '',
  openrouterModel: 'google/gemini-2.0-flash-001',
  websiteContext:
    'Siddhivinayak Overseas — study visa and work visa consultants in Surat, Gujarat for Canada, UK, Australia, USA, Germany, Japan and more. Office at Pragti IT Park, Surat.',
  defaultCategory: 'general',
  source: 'local',
}

function readLocal(): AdminAiSettings {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (!raw) return DEFAULTS
    return { ...DEFAULTS, ...JSON.parse(raw), source: 'local' }
  } catch {
    return DEFAULTS
  }
}

function writeLocal(settings: AdminAiSettings) {
  const { source: _source, ...rest } = settings
  localStorage.setItem(LOCAL_KEY, JSON.stringify(rest))
}

function mapRow(row: Record<string, unknown>): AdminAiSettings {
  return {
    activeProvider: (row.active_provider as AiProviderId) || 'gemini',
    geminiApiKey: String(row.gemini_api_key || ''),
    geminiModel: String(row.gemini_model || DEFAULTS.geminiModel),
    openrouterApiKey: String(row.openrouter_api_key || ''),
    openrouterModel: String(row.openrouter_model || DEFAULTS.openrouterModel),
    websiteContext: String(row.website_context || DEFAULTS.websiteContext),
    defaultCategory: String(row.default_category || 'general'),
    source: 'db',
  }
}

export function useAdminAiSettings() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<AdminAiSettings>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dbReady, setDbReady] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('admin_ai_settings')
        .select('*')
        .eq('singleton_key', 'default')
        .maybeSingle()

      if (error) {
        setDbReady(false)
        setSettings(readLocal())
        return
      }

      setDbReady(true)
      if (data) {
        const mapped = mapRow(data as Record<string, unknown>)
        setSettings(mapped)
        writeLocal(mapped)
      } else {
        setSettings(readLocal())
      }
    } catch {
      setDbReady(false)
      setSettings(readLocal())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const save = useCallback(
    async (next: Omit<AdminAiSettings, 'source'>) => {
      setSaving(true)
      const payload: AdminAiSettings = { ...next, source: dbReady ? 'db' : 'local' }
      try {
        writeLocal(payload)

        if (dbReady) {
          const { error } = await supabase.from('admin_ai_settings').upsert(
            {
              singleton_key: 'default',
              active_provider: next.activeProvider,
              gemini_api_key: next.geminiApiKey || null,
              gemini_model: next.geminiModel,
              openrouter_api_key: next.openrouterApiKey || null,
              openrouter_model: next.openrouterModel,
              website_context: next.websiteContext,
              default_category: next.defaultCategory,
              updated_by: user?.id ?? null,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'singleton_key' },
          )
          if (error) throw error
          payload.source = 'db'
        }

        setSettings(payload)
        toast.success(dbReady ? 'AI settings saved for all admins.' : 'AI settings saved on this browser.')
        return true
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to save AI settings'
        toast.error(message)
        return false
      } finally {
        setSaving(false)
      }
    },
    [dbReady, user?.id],
  )

  return {
    settings,
    loading,
    saving,
    dbReady,
    reload: load,
    save,
  }
}
