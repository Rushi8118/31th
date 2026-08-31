import type { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://siddhivinayakoverseas.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const lastModified = new Date()

  const staticRoutes = [
    { path: "", priority: 1.0, changefreq: "weekly" as const },
    { path: "/countries", priority: 0.9, changefreq: "weekly" as const },
    { path: "/work-visa", priority: 0.9, changefreq: "weekly" as const },
    { path: "/study-visa", priority: 0.9, changefreq: "weekly" as const },
    { path: "/services", priority: 0.8, changefreq: "weekly" as const },
    { path: "/about", priority: 0.7, changefreq: "monthly" as const },
    { path: "/contact", priority: 0.8, changefreq: "monthly" as const },
    { path: "/reviews", priority: 0.6, changefreq: "monthly" as const },
    { path: "/privacy", priority: 0.3, changefreq: "monthly" as const },
    { path: "/terms", priority: 0.3, changefreq: "monthly" as const },
    { path: "/study-in-usa", priority: 0.8, changefreq: "weekly" as const },
    { path: "/study-in-uk", priority: 0.8, changefreq: "weekly" as const },
    { path: "/study-in-canada", priority: 0.8, changefreq: "weekly" as const },
    { path: "/study-in-australia", priority: 0.8, changefreq: "weekly" as const },
    { path: "/post-study-work-visa", priority: 0.8, changefreq: "weekly" as const },
    { path: "/post-study-work-visa/australia", priority: 0.8, changefreq: "weekly" as const },
    { path: "/post-study-work-visa/uk", priority: 0.8, changefreq: "weekly" as const },
  ]

  const { data: countries } = await supabase
    .from("public_countries")
    .select("slug, updated_at")

  const countryRoutes = (countries || []).map((country) => ({
    url: `${SITE_URL}/countries/${country.slug}`,
    lastModified: country.updated_at ? new Date(country.updated_at) : lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const { data: programs } = await supabase
    .from("public_visa_programs")
    .select("country_slug, slug, updated_at")

  const programRoutes = (programs || []).map((program) => ({
    url: `${SITE_URL}/countries/${program.country_slug}/programs/${program.slug}`,
    lastModified: program.updated_at ? new Date(program.updated_at) : lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  const { data: blogPosts } = await supabase
    .from("blog_posts")
    .select("slug, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })

  const blogRoutes = (blogPosts || []).map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.published_at ? new Date(post.published_at) : lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  const staticEntries = staticRoutes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified,
    changeFrequency: r.changefreq,
    priority: r.priority,
  }))

  return [...staticEntries, ...countryRoutes, ...programRoutes, ...blogRoutes]
}
