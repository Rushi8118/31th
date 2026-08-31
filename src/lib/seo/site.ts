/** Site-wide SEO + NAP constants for Siddhivinayak Overseas (Surat). */

export const SITE_URL = 'https://siddhivinayakoverseas.com'
export const SITE_NAME = 'Siddhivinayak Overseas'
export const SITE_TAGLINE = 'Visa & Overseas Education Consultants in Surat'

export const NAP = {
  legalName: 'Siddhivinayak Overseas',
  streetAddress: '620, 6th Floor, Pragti IT Park, Kiran Chowk to Yogi Chowk Road',
  addressLocality: 'Surat',
  addressRegion: 'Gujarat',
  postalCode: '395006',
  addressCountry: 'IN',
  fullAddress:
    '620, 6th Floor, Pragti IT Park, Kiran Chowk to Yogi Chowk Road, Surat, Gujarat, India',
  phoneIN: '+919925064666',
  phoneINDisplay: '+91 99250 64666',
  phone2IN: '+919512000632',
  phone2INDisplay: '+91 95120 00632',
  email: 'info@siddhivinayakoverseas.com',
  whatsappUrl: 'https://wa.me/919925064666',
  geo: {
    latitude: 21.1702,
    longitude: 72.8311,
  },
} as const

export const DEFAULT_OG_IMAGE = `${SITE_URL}/consultant-office.jpg`

export const SOCIAL_SAME_AS: string[] = [
  // Add verified profile URLs when available
]

export function absoluteUrl(path: string): string {
  if (!path || path === '/') return SITE_URL
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalized}`
}
