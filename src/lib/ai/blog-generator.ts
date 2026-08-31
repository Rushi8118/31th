import { generateAiText, type AiProviderConfig } from './providers'

export type BlogGenerateMode = 'auto' | 'keywords'

export type BlogCategory =
  | 'general'
  | 'work_visa'
  | 'study_visa'
  | 'country_guide'
  | 'immigration_news'
  | 'success_story'
  | 'tips'
  | 'document_guide'

export type GeneratedBlogPost = {
  title: string
  slug: string
  excerpt: string
  content: string
  category: BlogCategory
  tags: string[]
  meta_title: string
  meta_desc: string
  keywords: string[]
  canonical_path: string
}

export type BlogGenerateInput = {
  mode: BlogGenerateMode
  keywords?: string
  instructions?: string
  websiteContext: string
  preferredCategory?: BlogCategory
}

const CATEGORIES: BlogCategory[] = [
  'general',
  'work_visa',
  'study_visa',
  'country_guide',
  'immigration_news',
  'success_story',
  'tips',
  'document_guide',
]

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

function extractJsonObject(raw: string): unknown {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const candidate = fenced?.[1]?.trim() || raw.trim()
  try {
    return JSON.parse(candidate)
  } catch {
    const start = candidate.indexOf('{')
    const end = candidate.lastIndexOf('}')
    if (start >= 0 && end > start) {
      return JSON.parse(candidate.slice(start, end + 1))
    }
    throw new Error('AI did not return valid JSON. Try again.')
  }
}

function normalizeGenerated(data: Record<string, unknown>): GeneratedBlogPost {
  const title = String(data.title || '').trim()
  if (!title) throw new Error('AI response missing title.')

  const content = String(data.content || '').trim()
  if (content.length < 200) throw new Error('AI content is too short. Try again.')

  const categoryRaw = String(data.category || 'general') as BlogCategory
  const category = CATEGORIES.includes(categoryRaw) ? categoryRaw : 'general'
  const slugBase = String(data.slug || title)
  const slug = slugify(slugBase) || `blog-${Date.now()}`
  const tags = Array.isArray(data.tags)
    ? data.tags.map((t) => String(t).trim()).filter(Boolean).slice(0, 12)
    : []
  const keywords = Array.isArray(data.keywords)
    ? data.keywords.map((k) => String(k).trim()).filter(Boolean).slice(0, 20)
    : tags

  const metaTitle = String(data.meta_title || title).trim().slice(0, 60)
  const metaDesc = String(data.meta_desc || data.excerpt || '')
    .trim()
    .slice(0, 160)
  const excerpt = String(data.excerpt || metaDesc).trim().slice(0, 280)

  return {
    title,
    slug,
    excerpt,
    content,
    category,
    tags,
    meta_title: metaTitle,
    meta_desc: metaDesc || excerpt.slice(0, 160),
    keywords,
    canonical_path: `/blog/${slug}`,
  }
}

function buildSystemPrompt(websiteContext: string): string {
  return `You are an expert SEO content writer for an Indian overseas education and visa consultancy.

Agency context:
${websiteContext}

Write helpful, accurate, cautious visa/study guidance. Never invent guaranteed approvals, processing times, or fees. Prefer phrases like "as of 2026", "typically", "varies by case".

Return ONLY valid JSON with this shape:
{
  "title": string,
  "slug": string (kebab-case),
  "excerpt": string (1-2 sentences),
  "content": string (HTML article body),
  "category": one of ${CATEGORIES.join(', ')},
  "tags": string[],
  "meta_title": string (<=60 chars),
  "meta_desc": string (<=155 chars),
  "keywords": string[]
}

HTML content rules:
- Use semantic tags only: h2, h3, p, ul, ol, li, table, thead, tbody, tr, th, td, strong, em, blockquote
- Do NOT include <html>, <body>, or <h1> (title is separate)
- Include an introduction, 4–7 H2 sections, at least one comparison/checklist TABLE, bullet lists, and a short FAQ section with H3 questions
- Add a clear CTA paragraph encouraging a free consultation with Siddhivinayak Overseas in Surat
- Keep tone professional, local to Surat/India readers, and SEO-optimized for the target keywords
- Aim for 900–1400 words worth of HTML content`
}

export async function generateBlogPost(
  config: AiProviderConfig,
  input: BlogGenerateInput,
): Promise<GeneratedBlogPost> {
  const system = buildSystemPrompt(input.websiteContext)
  const userPrompt =
    input.mode === 'auto'
      ? `Mode: FULL AUTO
Research and pick a high-intent SEO topic that fits this consultancy website.
Preferred category hint: ${input.preferredCategory || 'auto-choose'}.
Extra instructions: ${input.instructions?.trim() || 'None'}
Choose keywords that Indian students/workers actually search, then write the full SEO blog.`
      : `Mode: KEYWORD-DRIVEN
Target keywords / topic list:
${input.keywords?.trim() || '(none provided)'}

What the user wants covered:
${input.instructions?.trim() || 'Cover the keywords thoroughly with practical guidance.'}

Preferred category hint: ${input.preferredCategory || 'auto-choose'}
Write one complete SEO-optimized blog post around these keywords.`

  const raw = await generateAiText(config, [
    { role: 'system', content: system },
    { role: 'user', content: userPrompt },
  ])

  const parsed = extractJsonObject(raw) as Record<string, unknown>
  return normalizeGenerated(parsed)
}
