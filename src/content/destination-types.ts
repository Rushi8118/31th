import type { FaqItem } from '@/lib/seo/schema'
import type { RelatedLink } from '@/components/seo/RelatedLinks'

export type ContentSection = {
  heading: string
  body: string[]
  bullets?: string[]
}

export type DestinationContent = {
  path: string
  kind: 'study' | 'work' | 'local' | 'guide' | 'hub'
  country?: string
  eyebrow: string
  h1: string
  title: string
  description: string
  keywords: string
  heroDescription: string
  processingTime?: string
  breadcrumbs: Array<{ label: string; to?: string }>
  highlights: Array<{ title: string; desc: string }>
  sections: ContentSection[]
  processSteps?: Array<{ title: string; desc: string }>
  documents?: string[]
  eligibility?: string[]
  faqs: FaqItem[]
  related: RelatedLink[]
  serviceType: string
  datePublished?: string
}
