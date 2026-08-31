import { generateAiText, getActiveApiKey, type AiProviderConfig } from './providers'

const LOCAL_AI_KEY = 'svo_admin_ai_settings_v1'

function getStoredAiConfig(): AiProviderConfig {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_AI_KEY) : null
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        activeProvider: parsed.activeProvider || 'gemini',
        geminiApiKey: parsed.geminiApiKey || '',
        geminiModel: parsed.geminiModel || 'gemini-2.0-flash',
        openrouterApiKey: parsed.openrouterApiKey || '',
        openrouterModel: parsed.openrouterModel || 'google/gemini-2.0-flash-001',
      }
    }
  } catch {}
  return {
    activeProvider: 'gemini',
    geminiApiKey: '',
    geminiModel: 'gemini-2.0-flash',
    openrouterApiKey: '',
    openrouterModel: 'google/gemini-2.0-flash-001',
  }
}

export type GeneratedUrgentRequirement = {
  title: string
  slug: string
  country: string
  country_code: string
  category: string
  vacancies: number
  salary: string
  experience_required: string
  image_url: string
  summary: string
  content: string
  duration_days: number
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

const FALLBACK_IMAGES: Record<string, string> = {
  healthcare: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
  nursing: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
  hospitality: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
  culinary: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
  construction: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80',
  engineering: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
  it: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
  agriculture: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
  transport: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
  general: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
}

function getMatchingImage(category: string, title: string): string {
  const text = `${category} ${title}`.toLowerCase()
  if (text.includes('health') || text.includes('care') || text.includes('nurse') || text.includes('hospital')) return FALLBACK_IMAGES.healthcare
  if (text.includes('food') || text.includes('cook') || text.includes('chef') || text.includes('hotel') || text.includes('restaurant')) return FALLBACK_IMAGES.hospitality
  if (text.includes('construct') || text.includes('weld') || text.includes('carpenter') || text.includes('mason')) return FALLBACK_IMAGES.construction
  if (text.includes('tech') || text.includes('software') || text.includes('developer') || text.includes('it ') || text.includes('engineer')) return FALLBACK_IMAGES.it
  if (text.includes('driver') || text.includes('truck') || text.includes('logistics')) return FALLBACK_IMAGES.transport
  if (text.includes('farm') || text.includes('agri')) return FALLBACK_IMAGES.agriculture
  return FALLBACK_IMAGES.general
}

function getCountryCode(country: string): string {
  const c = country.toLowerCase()
  if (c.includes('uk') || c.includes('united kingdom') || c.includes('britain') || c.includes('england')) return 'GB'
  if (c.includes('japan') || c.includes('tokyo')) return 'JP'
  if (c.includes('canada')) return 'CA'
  if (c.includes('australia')) return 'AU'
  if (c.includes('germany') || c.includes('deutschland')) return 'DE'
  if (c.includes('usa') || c.includes('united states') || c.includes('america')) return 'US'
  if (c.includes('dubai') || c.includes('uae') || c.includes('emirates')) return 'AE'
  if (c.includes('singapore')) return 'SG'
  if (c.includes('new zealand')) return 'NZ'
  if (c.includes('france')) return 'FR'
  if (c.includes('ireland')) return 'IE'
  return 'GB'
}

/**
 * High-quality procedural generator if AI key is missing or offline
 */
function generateProceduralRequirement(prompt: string, countryHint: string): GeneratedUrgentRequirement {
  const country = countryHint || 'United Kingdom'
  const countryCode = getCountryCode(country)
  const isHealthcare = /care|nurse|health|medical/i.test(prompt)
  const isJapan = countryCode === 'JP' || /japan|ssw|tokutei/i.test(prompt)
  const isDriver = /driver|truck|transport|heavy/i.test(prompt)
  const isHospitality = /chef|cook|hotel|waiter|hospitality/i.test(prompt)
  const isIT = /developer|software|engineer|tech|data|it/i.test(prompt)

  let title = `Urgent Requirement: 20 Skilled Workers for ${country}`
  let category = 'Work Visa / Skilled Employment'
  let vacancies = 20
  let salary = '£24,000 – £28,000 / year + Overtime'
  let experience_required = '1+ Year relevant experience'
  let duration_days = 14

  if (isHealthcare) {
    title = `Urgent Requirement: 25 Care Assistants & Support Workers (${country})`
    category = 'Healthcare / Work Visa'
    vacancies = 25
    salary = countryCode === 'GB' ? '£24,500 – £29,000 / year + NHS Overtime' : 'Competitive Overseas Healthcare Package'
    experience_required = '1+ Year Caregiving, Nursing or Hospital experience'
  } else if (isJapan) {
    title = 'Urgent: 15 Specified Skilled Workers (Japan SSW Fast-Track)'
    category = 'Skilled Worker / SSW'
    vacancies = 15
    salary = '¥230,000 – ¥270,000 / month (₹1.35L – ₹1.60L)'
    experience_required = 'Freshers or 6+ months experience with Japanese basics'
  } else if (isDriver) {
    title = `Urgent Requirement: 12 Commercial Heavy Vehicle Drivers (${country})`
    category = 'Logistics & Transport'
    vacancies = 12
    salary = countryCode === 'CA' ? '$28 – $34 / hour ($55,000 – $68,000 / yr)' : 'High Tax-Free Monthly Package + Accommodation'
    experience_required = 'Valid Commercial Driving License + 2 years experience'
  } else if (isHospitality) {
    title = `Urgent Opening: 10 Head & Specialty Chefs (${country})`
    category = 'Hospitality & Culinary'
    vacancies = 10
    salary = 'Attractive overseas salary + Food & Accommodation'
    experience_required = '2+ Years culinary/hotel experience'
  } else if (isIT) {
    title = `Urgent Hiring: 8 Senior Software Engineers & Cloud Specialists (${country})`
    category = 'Information Technology / EU Blue Card'
    vacancies = 8
    salary = countryCode === 'DE' ? '€60,000 – €78,000 / year' : '£55,000 – £75,000 / year'
    experience_required = '3+ Years software engineering experience'
  } else if (prompt.trim()) {
    title = `Urgent Requirement: ${prompt.trim()} (${country})`
  }

  const slug = slugify(title)
  const image_url = getMatchingImage(category, title)
  const summary = `Exclusive urgent mandate for verified visa sponsorship in ${country}. Fast-track processing, direct employer sponsorship, and end-to-end documentation from Siddhivinayak Overseas Surat.`

  const content = `## Urgent Opportunity Overview

Siddhivinayak Overseas has received an official priority recruitment mandate for **${title}** located in **${country}**. This urgent requirement offers fast-track visa sponsorship, excellent compensation, and direct relocation support for qualified candidates from Gujarat and across India.

### Key Highlights & Benefits
- **Visa Sponsorship**: Full official work visa sponsorship with verified employer Certificate / Approval.
- **Salary & Package**: ${salary}.
- **Contract Duration**: 2 to 3 Years (renewable, with clear pathway to Permanent Residency / PR).
- **Accommodation & Relocation**: Initial accommodation assistance, airport pickup, and relocation allowances provided.
- **Family Status**: Eligible candidates can bring spouse and dependent children with full local work and schooling benefits.

### Eligibility Criteria
1. **Experience**: ${experience_required}.
2. **Education**: Recognized Diploma, Degree, or certified vocational credentials in the relevant domain.
3. **Language**: Basic communicative English or relevant local language certification (IELTS / PTE / JLPT where applicable).
4. **Passport**: Valid Indian passport with at least 18 months remaining validity.
5. **Clearances**: Clean Police Clearance Certificate (PCC) and medical fitness clearance.

### Application & Visa Process
1. **Profile Assessment**: Immediate resume & credentials evaluation at our Surat office (Pragti IT Park, Yogi Chowk).
2. **Employer Interview**: Video interview directly with the overseas hiring authority.
3. **Offer Letter & Sponsorship**: Official job offer and visa sponsorship documents issued within 10 to 14 days of selection.
4. **Visa Filing & Biometrics**: Priority submission at VFS Surat/Ahmedabad with guidance from our senior visa lawyers.
5. **Pre-Departure Orientation**: Comprehensive briefing on flights, taxation, banking, and overseas settlement.

### How to Apply
Due to limited vacancies (${vacancies} total positions), applications are screened on a **first-come, first-served basis**. Submit your application through the form below or walk in to our Surat office immediately.`

  return {
    title,
    slug,
    country,
    country_code: countryCode,
    category,
    vacancies,
    salary,
    experience_required,
    image_url,
    summary,
    content,
    duration_days,
  }
}

export async function generateUrgentRequirementWithAi(
  prompt: string,
  countryHint: string = 'United Kingdom',
  config?: AiProviderConfig
): Promise<GeneratedUrgentRequirement> {
  const activeConfig = config || getStoredAiConfig()
  const apiKey = getActiveApiKey(activeConfig)

  // If no API key is set, return the rich procedural requirement generator
  if (!apiKey) {
    return generateProceduralRequirement(prompt, countryHint)
  }

  const systemPrompt = `You are a senior overseas recruitment and visa consultant for Siddhivinayak Overseas (Surat, Gujarat, India).
Your task is to generate a comprehensive, highly persuasive, and professional Urgent Job / Visa Requirement alert in strict JSON format.

JSON Schema required:
{
  "title": "Short, catchy urgent title (e.g. Urgent Requirement: 25 Senior Care Assistants for UK NHS)",
  "slug": "url-friendly-slug",
  "country": "Country Name (e.g. United Kingdom, Japan, Canada, Germany, Australia, UAE)",
  "country_code": "2-letter ISO (e.g. GB, JP, CA, DE, AU, AE)",
  "category": "Industry / Visa Category (e.g. Healthcare / Work Visa, Skilled Worker / SSW, Hospitality, IT)",
  "vacancies": 25,
  "salary": "Salary range with local currency + INR conversion (e.g. £24,500 – £28,000 / year + Overtime)",
  "experience_required": "Brief experience requirements (e.g. 1+ Year Caregiving or Nursing)",
  "summary": "2-3 sentence punchy summary explaining the urgency, sponsorship, and location",
  "content": "Full markdown article with sections: ## Urgent Opportunity Overview, ### Key Highlights & Benefits, ### Eligibility Criteria, ### Application & Visa Process, ### How to Apply",
  "duration_days": 14
}

Respond ONLY with valid JSON.`

  const userPrompt = `Create an urgent visa requirement for:
Topic / Prompt: ${prompt}
Target Country: ${countryHint}
Surat agency: Siddhivinayak Overseas (Pragti IT Park, Surat, Gujarat)`

  try {
    const raw = await generateAiText(activeConfig, [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ])

    const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)
    const jsonStr = jsonMatch ? jsonMatch[1].trim() : raw.trim()
    const parsed = JSON.parse(jsonStr)

    const title = String(parsed.title || `Urgent Requirement: ${prompt}`).trim()
    const country = String(parsed.country || countryHint || 'United Kingdom').trim()
    const countryCode = String(parsed.country_code || getCountryCode(country)).toUpperCase().slice(0, 2)
    const category = String(parsed.category || 'Work Visa').trim()
    const vacancies = Number(parsed.vacancies) || 10
    const salary = String(parsed.salary || 'Competitive Overseas Package').trim()
    const experience_required = String(parsed.experience_required || '1+ Year experience').trim()
    const summary = String(parsed.summary || `Urgent visa opportunity in ${country}`).trim()
    const content = String(parsed.content || '').trim()
    const duration_days = Number(parsed.duration_days) || 14
    const slug = slugify(parsed.slug || title)
    const image_url = getMatchingImage(category, title)

    return {
      title,
      slug,
      country,
      country_code: countryCode,
      category,
      vacancies,
      salary,
      experience_required,
      image_url,
      summary,
      content,
      duration_days,
    }
  } catch (error) {
    console.warn('AI generation fell back to procedural synthesis:', error)
    return generateProceduralRequirement(prompt, countryHint)
  }
}
