import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js"

const url = (import.meta.env.VITE_SUPABASE_URL || "").trim()
const key = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  ""
).trim()

function isInvalidSupabaseConfig(nextUrl: string, nextKey: string) {
  if (!nextUrl || !nextKey) return true
  if (nextUrl.includes("placeholder.supabase.co")) return true
  if (nextUrl.includes("your-project-id")) return true
  if (nextKey.includes("placeholder") || nextKey.includes("your_anon")) return true
  if (nextKey.startsWith("sb_secret_")) return true
  try {
    const parsed = new URL(nextUrl)
    return parsed.protocol !== "https:" || !parsed.hostname.includes("supabase")
  } catch {
    return true
  }
}

export const supabaseConfigError = isInvalidSupabaseConfig(url, key)
  ? "[Supabase] Invalid or missing VITE_SUPABASE_URL / publishable key. " +
    "Create `.env.local` with your real project values, then restart `pnpm dev` " +
    "(do not start with placeholder env vars)."
  : null

if (supabaseConfigError && import.meta.env.DEV) {
  console.error(supabaseConfigError)
}

declare global {
  interface Window {
    __supabaseClientInstance?: SupabaseClient
  }
}

const safeUrl = supabaseConfigError ? "https://invalid.local.supabase.co" : url
const safeKey = supabaseConfigError ? "invalid-key" : key

let supabaseInstance: SupabaseClient

if (typeof window !== "undefined") {
  if (!window.__supabaseClientInstance) {
    window.__supabaseClientInstance = createSupabaseClient(safeUrl, safeKey, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
      global: {
        fetch: (...args) => {
          if (supabaseConfigError) {
            return Promise.reject(new Error(supabaseConfigError))
          }
          return fetch(...args)
        },
      },
    })
  }
  supabaseInstance = window.__supabaseClientInstance
} else {
  supabaseInstance = createSupabaseClient(safeUrl, safeKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}

export const supabase = supabaseInstance

export function createClient() {
  return supabaseInstance
}

export function getSupabaseConfigStatus() {
  return {
    ok: !supabaseConfigError,
    urlHost: (() => {
      try {
        return new URL(url).host
      } catch {
        return null
      }
    })(),
    error: supabaseConfigError,
  }
}

export type { SupabaseClient }
