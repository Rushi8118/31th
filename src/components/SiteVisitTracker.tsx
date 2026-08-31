import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'

/** Logs public website page views for the admin access dashboard. */
export function SiteVisitTracker() {
  const location = useLocation()
  const { user } = useAuth()

  useEffect(() => {
    // Skip noisy admin/dashboard internal routes from "website visitor" totals if desired?
    // Keep them — admins still count as activity, but dashboard can filter.
    void import('@/lib/site-visit-tracker').then(({ trackSiteEvent }) => {
      void trackSiteEvent({
        eventType: 'page_view',
        path: `${location.pathname}${location.search}`,
        title: document.title,
        userId: user?.id ?? null,
      })
    })
  }, [location.pathname, location.search, user?.id])

  return null
}
