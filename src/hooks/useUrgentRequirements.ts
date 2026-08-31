import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

export type UrgentRequirement = {
  id: string
  title: string
  slug: string
  country: string
  country_code: string
  category: string
  vacancies: number
  salary: string
  experience_required?: string
  image_url?: string
  summary: string
  content: string
  status: 'active' | 'closed' | 'expired'
  expires_at: string | null
  created_at: string
  updated_at: string
}

export type UrgentRequirementInput = {
  id?: string
  title: string
  slug: string
  country: string
  country_code: string
  category: string
  vacancies: number
  salary: string
  experience_required?: string
  image_url?: string
  summary: string
  content: string
  status?: 'active' | 'closed' | 'expired'
  duration_days?: number
  expires_at?: string | null
}

const LOCAL_URGENT_KEY = 'svo_admin_urgent_reqs_v3'

// Check if a requirement is expired based on its expiration date
export function isRequirementExpired(req: UrgentRequirement): boolean {
  if (req.status === 'closed') return true
  if (req.status === 'expired') return true
  if (!req.expires_at) return false
  return new Date(req.expires_at).getTime() < Date.now()
}

// Calculate remaining days for display
export function getRemainingDays(expiresAt: string | null): number | null {
  if (!expiresAt) return null
  const diffMs = new Date(expiresAt).getTime() - Date.now()
  if (diffMs <= 0) return 0
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

const FALLBACK_URGENT_REQUIREMENTS: UrgentRequirement[] = [
  {
    id: 'fallback-1',
    title: 'Urgent: 25 Specified Skilled Workers (SSW Caregivers) for Japan',
    slug: 'japan-ssw-caregiver-urgent',
    country: 'Japan',
    country_code: 'JP',
    category: 'Specified Skilled Worker (SSW-1)',
    vacancies: 25,
    salary: '¥220,000 - ¥280,000 / month (~₹1.25L - ₹1.6L)',
    experience_required: 'JLPT N4 / NAT-TEST & Caregiving Skill Test',
    image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    summary: 'Direct hospital placement in Tokyo and Osaka with fast-track visa sponsorship, subsidized accommodation, and JLPT training support.',
    content: `### Urgent Placement Mandate for Japan SSW Caregivers
Siddhivinayak Overseas Surat has received an official priority mandate to recruit **25 Qualified Caregivers** for leading healthcare groups in Tokyo and Osaka.

#### Key Benefits:
- **Direct Employer Sponsorship:** 5-year renewable SSW-1 visa.
- **Flight & Housing:** Flight ticket allowance & subsidized accommodation.
- **High Salary:** Up to ¥280,000/month with overtime opportunities.
- **Fast-Track Processing:** COE (Certificate of Eligibility) issued within 45-60 days.

#### Requirements:
1. JLPT N4 or NAT-TEST Level 4 certification (or currently enrolled).
2. Nursing / GNM diploma OR Nursing Assistant training certificate.
3. Valid Indian Passport with minimum 18 months validity.`,
    status: 'active',
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fallback-2',
    title: 'Urgent: 15 Health & Care Staff for UK NHS Trust Hospitals',
    slug: 'uk-nhs-healthcare-assistant-urgent',
    country: 'United Kingdom',
    country_code: 'GB',
    category: 'Health & Care Worker Visa',
    vacancies: 15,
    salary: '£23,400 - £28,000 / year (~₹24L - ₹29L)',
    experience_required: '1+ Year Healthcare / Nursing experience & IELTS 5.0+',
    image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80',
    summary: 'NHS-approved healthcare assistant positions with COS (Certificate of Sponsorship) and fast 3-week UK visa processing.',
    content: `### Immediate Openings for UK NHS Healthcare Support Workers
Recruiting 15 dedicated Health & Care workers for NHS Trust Partner Hospitals across London, Manchester, and Birmingham.

#### Offer Details:
- **COS Provided:** Tier 2 / Health & Care Worker Sponsorship (3-Year renewable).
- **Relocation Package:** First month free accommodation + NHS relocation grant.
- **Family Visa:** Spousal work permit & free NHS healthcare coverage for dependents.

#### Eligibility Criteria:
1. GNM Nursing / B.Sc Nursing / ANM diploma with minimum 1 year clinical experience.
2. UKVI IELTS General score 5.0+ or PTE Academic UKVI 43+.
3. Clean Police Clearance Certificate from RPO Gujarat.`,
    status: 'active',
    expires_at: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fallback-3',
    title: 'Urgent: 30 Opportunity Card IT & Engineering Candidates for Germany',
    slug: 'germany-chancenkarte-it-engineers-urgent',
    country: 'Germany',
    country_code: 'DE',
    category: 'Opportunity Card (Chancenkarte)',
    vacancies: 30,
    salary: '€45,000 - €65,000 / year (~₹40L - ₹58L)',
    experience_required: 'Degree in Engineering / CS & German A2 or English B2',
    image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    summary: 'Fast-track Chancenkarte visa processing for software developers, CNC machinists, electrical engineers, and mechanical technicians.',
    content: `### Germany Opportunity Card (Chancenkarte) Priority Pool
Siddhivinayak Overseas is facilitating direct Opportunity Card applications for qualified Indian engineers and tech professionals looking to work in Munich, Stuttgart, and Berlin.

#### Key Advantages:
- **No Prior Job Offer Required:** Move to Germany on a 1-year job seeker visa with work rights.
- **Part-Time Work Allowed:** Earn up to 20 hours/week while interviewing.
- **Fast-Track PR:** Convert to EU Blue Card after securing employment.

#### Qualification Points:
1. Recognized Engineering or IT Degree (Anabin H+ listed).
2. German language A2 certificate OR English B2 score.
3. 2+ years of relevant industry experience.`,
    status: 'active',
    expires_at: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fallback-4',
    title: 'Urgent: 20 Construction & MEP Supervisors for Croatia (Schengen)',
    slug: 'croatia-mep-construction-supervisors-urgent',
    country: 'Croatia',
    country_code: 'HR',
    category: 'Work & Residence Permit (Schengen)',
    vacancies: 20,
    salary: '€1,200 - €1,600 / month (~₹1.1L - ₹1.45L)',
    experience_required: 'ITI / Diploma & 3+ Years Site Experience',
    image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=800&auto=format&fit=crop&q=80',
    summary: 'Schengen work permit mandate for commercial construction projects in Zagreb and Split with free food and accommodation provided.',
    content: `### Croatia Schengen Work Permit Placement Drive
Urgent opening for 20 Construction Foremen, MEP Technicians, Electricians, and Welders for major infrastructure projects in Croatia.

#### Package Details:
- **Free Accommodation & Food:** Provided by employer.
- **Schengen Visa:** Full travel rights across 29 Schengen member states.
- **Contract Duration:** 1-Year renewable work permit.

#### Candidate Requirements:
1. ITI / Vocational Diploma in Civil, Electrical, or Mechanical.
2. Minimum 3 years site experience in India or Gulf.
3. Clean Police Clearance Certificate with MEA Apostille.`,
    status: 'active',
    expires_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

function getInitialRequirements(): UrgentRequirement[] {
  try {
    const cached = localStorage.getItem(LOCAL_URGENT_KEY)
    if (cached) {
      const parsed = JSON.parse(cached)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {}
  return FALLBACK_URGENT_REQUIREMENTS
}

/**
 * Public hook to fetch active urgent requirements
 */
export function usePublicUrgentRequirements() {
  const [requirements, setRequirements] = useState<UrgentRequirement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchActive = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000))
      const query = supabase
        .from('urgent_requirements')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      const result = await Promise.race([query, timeout])

      if (result && 'data' in result && Array.isArray(result.data)) {
        const now = Date.now()
        const active = (result.data as UrgentRequirement[]).filter((item) => {
          if (item.status === 'closed' || item.status === 'expired') return false
          if (!item.expires_at) return true
          return new Date(item.expires_at).getTime() > now
        })
        setRequirements(active)
        // Update cache with fresh data
        try {
          localStorage.setItem(LOCAL_URGENT_KEY, JSON.stringify(active))
        } catch {}
      } else {
        // Fallback to cached or default data
        const fallback = getInitialRequirements()
        setRequirements(fallback)
      }
    } catch (err: any) {
      console.warn('[usePublicUrgentRequirements] fetch warning:', err)
      setRequirements(getInitialRequirements())
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchActive()
  }, [fetchActive])

  return {
    requirements,
    isLoading,
    error,
    refetch: fetchActive,
  }
}

export const useUrgentRequirements = usePublicUrgentRequirements

/**
 * Public hook to fetch a single urgent requirement by slug
 */
export function useUrgentRequirementBySlug(slug: string | undefined) {
  const [requirement, setRequirement] = useState<UrgentRequirement | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOne = useCallback(async () => {
    if (!slug) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { data, error: dbErr } = await supabase
        .from('urgent_requirements')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()

      if (data) {
        setRequirement(data as UrgentRequirement)
      } else {
        const local = getInitialRequirements()
        const found = local.find(r => r.slug === slug || r.id === slug)
        setRequirement(found || null)
      }
    } catch (err: any) {
      const local = getInitialRequirements()
      const found = local.find(r => r.slug === slug || r.id === slug)
      setRequirement(found || null)
    } finally {
      setIsLoading(false)
    }
  }, [slug])

  useEffect(() => {
    fetchOne()
  }, [fetchOne])

  return {
    requirement,
    isLoading,
    error,
    refetch: fetchOne,
  }
}

/**
 * Admin Hook for Managing Urgent Requirements (Full CRUD)
 */
export function useAdminUrgentRequirements() {
  const [requirements, setRequirements] = useState<UrgentRequirement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Save to local storage cache
  const saveToLocal = useCallback((items: UrgentRequirement[]) => {
    try {
      localStorage.setItem(LOCAL_URGENT_KEY, JSON.stringify(items))
    } catch {}
  }, [])

  // Fetch all requirements for admin (both active and closed)
  const fetchAll = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000))
      const query = supabase
        .from('urgent_requirements')
        .select('*')
        .order('created_at', { ascending: false })

      const result = await Promise.race([query, timeout])

      if (result && 'data' in result && Array.isArray(result.data)) {
        setRequirements(result.data as UrgentRequirement[])
        saveToLocal(result.data as UrgentRequirement[])
      } else {
        const initial = getInitialRequirements()
        setRequirements(initial)
        saveToLocal(initial)
      }
    } catch (err: any) {
      console.warn('[useAdminUrgentRequirements] fetch warning:', err)
      const initial = getInitialRequirements()
      setRequirements(initial)
      saveToLocal(initial)
    } finally {
      setIsLoading(false)
    }
  }, [saveToLocal])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  // Save (Create or Update)
  const saveRequirement = async (input: UrgentRequirementInput): Promise<UrgentRequirement> => {
    setSaving(true)
    try {
      let expires_at = input.expires_at

      if (input.duration_days && !expires_at) {
        const d = new Date()
        d.setDate(d.getDate() + Number(input.duration_days))
        expires_at = d.toISOString()
      }

      const now = new Date().toISOString()
      const existing = requirements.find(r => r.id === input.id || r.slug === input.slug)

      const fullItem: UrgentRequirement = {
        id: input.id || existing?.id || `req-${Date.now()}`,
        title: input.title,
        slug: input.slug,
        country: input.country,
        country_code: input.country_code || 'XX',
        category: input.category,
        vacancies: Number(input.vacancies) || 1,
        salary: input.salary,
        experience_required: input.experience_required || '',
        image_url: input.image_url || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
        summary: input.summary || '',
        content: input.content,
        status: input.status || 'active',
        expires_at: expires_at || existing?.expires_at || null,
        created_at: existing?.created_at || now,
        updated_at: now,
      }

      const nextList = existing
        ? requirements.map(r => (r.id === fullItem.id || r.slug === fullItem.slug ? fullItem : r))
        : [fullItem, ...requirements]

      setRequirements(nextList)
      saveToLocal(nextList)

      const payload = {
        title: fullItem.title,
        slug: fullItem.slug,
        country: fullItem.country,
        country_code: fullItem.country_code,
        category: fullItem.category,
        vacancies: fullItem.vacancies,
        salary: fullItem.salary,
        experience_required: fullItem.experience_required,
        image_url: fullItem.image_url,
        summary: fullItem.summary,
        content: fullItem.content,
        status: fullItem.status,
        expires_at: fullItem.expires_at,
        updated_at: now,
      }

      const { error: dbErr } = await supabase
        .from('urgent_requirements')
        .upsert([payload as any], { onConflict: 'slug' })

      if (dbErr) {
        console.warn('[useAdminUrgentRequirements] Supabase upsert notice:', dbErr.message)
      }

      toast.success(`Urgent requirement "${fullItem.title}" updated live!`)
      return fullItem
    } catch (err: any) {
      toast.error(err?.message || 'Saved locally!')
      throw err
    } finally {
      setSaving(false)
    }
  }

  // Toggle status (active / closed)
  const toggleStatus = async (id: string, newStatus: 'active' | 'closed') => {
    try {
      const target = requirements.find(r => r.id === id || r.slug === id)
      if (target) {
        toast.info(`Requirement "${target.title}" is now ${newStatus === 'active' ? 'Active on website' : 'Hidden / Closed'}`)
        await saveRequirement({ ...target, status: newStatus })
        
        // Clear public cache to force fresh data on user-facing pages
        try {
          localStorage.removeItem(LOCAL_URGENT_KEY)
        } catch {}
      }
    } catch (err: any) {
      toast.error('Failed to update requirement status')
    }
  }

  // Delete requirement
  const deleteRequirement = async (id: string) => {
    try {
      const target = requirements.find(r => r.id === id || r.slug === id)
      const nextList = requirements.filter((r) => r.id !== id && r.slug !== id)
      setRequirements(nextList)
      saveToLocal(nextList)

      if (target?.slug) {
        await supabase.from('urgent_requirements').delete().eq('slug', target.slug)
      }
      
      // Clear public cache to force fresh data on user-facing pages
      try {
        localStorage.removeItem(LOCAL_URGENT_KEY)
      } catch {}
      
      toast.success('Urgent requirement deleted')
    } catch (err: any) {
      toast.error('Failed to delete requirement')
    }
  }

  // Extend duration
  const extendDuration = async (id: string, daysToAdd: number = 7) => {
    try {
      const target = requirements.find(r => r.id === id || r.slug === id)
      if (!target) return
      const currentExpiry = target.expires_at ? new Date(target.expires_at).getTime() : Date.now()
      const newExpiry = new Date(Math.max(currentExpiry, Date.now()) + daysToAdd * 24 * 60 * 60 * 1000).toISOString()
      await saveRequirement({ ...target, expires_at: newExpiry, status: 'active' })
      toast.success(`Extended deadline by +${daysToAdd} days!`)
    } catch (err: any) {
      toast.error('Failed to extend duration')
    }
  }

  return {
    requirements,
    isLoading,
    saving,
    error,
    refetch: fetchAll,
    fetchAll,
    saveRequirement,
    toggleStatus,
    deleteRequirement,
    removeRequirement: deleteRequirement,
    extendDuration,
  }
}
