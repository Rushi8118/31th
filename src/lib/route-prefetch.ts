/** Prefetch lazy route modules on hover/focus so navigation feels instant. */

const loaders: Record<string, () => Promise<unknown>> = {
  '/contact': () => import('@/pages/ContactPage'),
  '/services': () => import('@/pages/ServicesPage'),
  '/countries': () => import('@/pages/CountriesPage'),
  '/reviews': () => import('@/pages/ReviewsPage'),
  '/success-stories': () => import('@/pages/SuccessStoriesPage'),
  '/post-study-work-visa': () => import('@/pages/PostStudyWorkVisaPage'),
  '/study-in-germany': () => import('@/pages/StudyInGermanyPage'),
  '/study-in-france': () => import('@/pages/StudyInFrancePage'),
  '/study-in-spain': () => import('@/pages/StudyInSpainPage'),
  '/study-in-dubai': () => import('@/pages/StudyInDubaiPage'),
  '/study-in-singapore': () => import('@/pages/StudyInSingaporePage'),
  '/study-in-ireland': () => import('@/pages/StudyInIrelandPage'),
  '/study-in-new-zealand': () => import('@/pages/StudyInNewZealandPage'),
  '/work-visa/japan': () => import('@/pages/work-visa/WorkVisaCountryPage'),
  '/work-visa/germany': () => import('@/pages/work-visa/WorkVisaCountryPage'),
  '/work-visa/canada': () => import('@/pages/work-visa/WorkVisaCountryPage'),
  '/work-visa/uk': () => import('@/pages/work-visa/WorkVisaCountryPage'),
  '/work-visa/australia': () => import('@/pages/work-visa/WorkVisaCountryPage'),
  '/work-visa/singapore': () => import('@/pages/work-visa/WorkVisaCountryPage'),
  '/work-visa/gulf': () => import('@/pages/work-visa/WorkVisaCountryPage'),
  '/login': () => import('@/pages/LoginPage'),
  '/register': () => import('@/pages/RegisterPage'),
}

const warmed = new Set<string>()

export function prefetchRoute(path: string) {
  const key = path.split('?')[0]
  if (warmed.has(key)) return
  const loader = loaders[key]
  if (!loader) return
  warmed.add(key)
  void loader().catch(() => {
    warmed.delete(key)
  })
}
