/**
 * Cache Management Utilities
 * Use these to clear cached data when admin makes changes
 */

const CACHE_KEYS = {
  URGENT_REQUIREMENTS: 'svo_admin_urgent_reqs_v3',
  COUNTRIES: 'svo_admin_countries_v5',
}

/**
 * Clear all admin-related caches
 * Call this when admin makes changes that should be reflected immediately on public pages
 */
export function clearAllAdminCaches() {
  try {
    Object.values(CACHE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
    console.log('[Cache] Cleared all admin caches')
  } catch (error) {
    console.warn('[Cache] Failed to clear caches:', error)
  }
}

/**
 * Clear urgent requirements cache
 */
export function clearUrgentRequirementsCache() {
  try {
    localStorage.removeItem(CACHE_KEYS.URGENT_REQUIREMENTS)
    console.log('[Cache] Cleared urgent requirements cache')
  } catch (error) {
    console.warn('[Cache] Failed to clear urgent requirements cache:', error)
  }
}

/**
 * Clear countries cache
 */
export function clearCountriesCache() {
  try {
    localStorage.removeItem(CACHE_KEYS.COUNTRIES)
    console.log('[Cache] Cleared countries cache')
  } catch (error) {
    console.warn('[Cache] Failed to clear countries cache:', error)
  }
}

/**
 * Force reload React Query cache
 * Requires QueryClient to be available on window object
 */
export function invalidateQueryCache(keys: string[]) {
  try {
    if (typeof window !== 'undefined' && (window as any).queryClient) {
      keys.forEach(key => {
        (window as any).queryClient.invalidateQueries([key])
      })
      console.log('[Cache] Invalidated React Query cache for:', keys)
    }
  } catch (error) {
    console.warn('[Cache] Failed to invalidate query cache:', error)
  }
}
