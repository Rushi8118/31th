// @ts-nocheck
import Link from "next/link"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { Globe2, ArrowRight, MapPin, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Explore Countries | Work & Study Visa Destinations",
  description: "Explore 38+ work-permit countries and 6 study-visa countries with Siddhivinayak Overseas.",
  openGraph: {
    title: "Explore Countries | Siddhivinayak Overseas",
    description: "Discover work-permit opportunities across 38+ countries and study-visa pathways across 6 countries.",
  },
}

async function getCountries() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("public_countries")
    .select("*")
    .order("sort_order", { ascending: true })
  return data || []
}

export default async function CountriesPage() {
  const countries = await getCountries()

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
              <Globe2 className="h-5 w-5 text-primary" />
            </span>
            <span className="font-serif text-base font-semibold">Siddhivinayak</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/" className="text-sm font-medium text-foreground/70 hover:text-foreground">Home</Link>
            <Link href="/countries" className="text-sm font-medium text-primary">Countries</Link>
            <Link href="/contact" className="text-sm font-medium text-foreground/70 hover:text-foreground">Contact</Link>
          </nav>
        </div>
      </header>

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/40 px-4 py-16 md:px-6 md:py-24">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
              Choose Your Destination
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground md:text-lg">
              Explore visa programs across 38+ work-permit countries and 6 study-visa countries. Each destination offers unique opportunities for work, study, and permanent residency.
            </p>
          </div>
        </section>

        {/* Countries Grid */}
        <section className="px-4 py-12 md:px-6 md:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {countries.map((country) => (
                <Link
                  key={country.id}
                  href={`/countries/${country.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/50 p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{country.flag_emoji}</span>
                      <div>
                        <h2 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition">
                          {country.name}
                        </h2>
                        <p className="text-xs text-muted-foreground">{country.capital}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
                  </div>

                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {country.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      <MapPin className="h-3 w-3" />
                      {country.region}
                    </span>
                    {country.visa_stats && typeof country.visa_stats === 'object' && !Array.isArray(country.visa_stats) && (country.visa_stats as any).success_rate && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600">
                        <TrendingUp className="h-3 w-3" />
                        {(country.visa_stats as any).success_rate}% success
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 pb-20 md:px-6">
          <div className="mx-auto max-w-3xl rounded-3xl border border-primary/30 bg-primary/5 p-8 text-center md:p-12">
            <h2 className="font-serif text-2xl font-semibold text-foreground">
              Not sure which country is right for you?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Book a free consultation with our experts. We will assess your profile and recommend the best visa pathway.
            </p>
            <Button asChild className="mt-6 btn-glow rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/contact">
                Book Free Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </>
  )
}
