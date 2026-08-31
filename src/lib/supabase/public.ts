/**
 * Re-exports the shared Supabase singleton for use in public/unauthenticated contexts.
 * All callers should prefer importing `supabase` from `@/lib/supabase/client` directly.
 */
export { supabase as publicSupabase } from "./client"
export { createClient as createPublicClient } from "./client"
