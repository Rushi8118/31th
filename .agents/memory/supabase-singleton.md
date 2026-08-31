---
name: Supabase singleton pattern
description: How the shared Supabase client is structured and why main.tsx uses dynamic imports
---

## Rule
All files must `import { supabase } from "@/lib/supabase/client"`. Never call `createClient()` anywhere outside that file.

**Why:** Multiple `createClient()` calls create separate WebSocket connections, breaking realtime subscriptions and wasting resources. The singleton in `client.ts` is stored on `window.__supabaseClientInstance` to survive HMR in dev.

## How it works
- `src/lib/supabase/client.ts` throws at module init time if `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` are missing.
- `src/main.tsx` uses `await import('./lib/supabase/client')` (dynamic import, not static) to catch this throw before React renders. If caught, it renders `<EnvironmentError>` and stops.
- `src/components/EnvironmentError.tsx` shows a friendly dark-mode screen with the exact error + `.env.local` template.
- This means `main.tsx` must NOT have any static imports of modules that transitively import `client.ts` (App, AuthProvider, etc.) — all those are dynamically imported after the health check passes.

## Acceptance criteria (verified)
`grep -r "createClient(" src/` returns 0 results outside of `src/lib/supabase/client.ts` (utility wrappers like `createAdminClient`, `createServerSupabaseClient` are excluded by name).

## env var names
- `VITE_SUPABASE_URL` (required)
- `VITE_SUPABASE_ANON_KEY` (required; `VITE_SUPABASE_PUBLISHABLE_KEY` is accepted as alias)
