import type { MetadataRoute } from "next"
import { createPublicClient } from "@/lib/supabase/public"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://siddhivinayakoverseas.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createPublicClient()
  const lastModified = new Date()

  // Static routes
  const staticRoutes = [
    { path: "", priority: 1.0 },
    { path: "/countries", priority: 0.9 },
    { path: "/work-visa", priority: 0.9 },
    { path: "/study-visa", priority: 0.9 },
    { path: "/services", priority: 0.8 },
    { path: "/about", priority: 0.7 },
    { path: "/contact", priority: 0.8 },
    { path: "/login", priority: 0.3 },
    { path: "/register", priority: 0.3 },
  ]

  // Fetch countries for dynamic routes
  const { data: countries } = await supabase
    .from("public_countries")
    .select("slug, updated_at")

  const countryRoutes = (countries || []).map((country) => ({
    url: `${SITE_URL}/countries/${country.slug}`,
    lastModified: country.updated_at ? new Date(country.updated_at) : lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // Fetch visa programs for dynamic routes
  const { data: programs } = await supabase
    .from("public_visa_programs")
    .select("country_slug, slug, updated_at")

  const programRoutes = (programs || []).map((program) => ({
    url: `${SITE_URL}/countries/${program.country_slug}/programs/${program.slug}`,
    lastModified: program.updated_at ? new Date(program.updated_at) : lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  const staticEntries = staticRoutes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: r.priority,
  }))

  return [...staticEntries, ...countryRoutes, ...programRoutes]
}
