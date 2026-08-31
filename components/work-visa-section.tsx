"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, Briefcase, Sparkles } from "lucide-react"

interface CountryItem {
  name: string
  flag: string
  visa: string
}

interface ContinentGroup {
  title: string
  subtitle: string
  countries: CountryItem[]
}

const CONTINENT_GROUPS: ContinentGroup[] = [
  {
    title: "Europe (West & North)",
    subtitle: "High-demand healthcare, engineering, and skilled labour routes",
    countries: [
      { name: "Germany", flag: "🇩🇪", visa: "EU Blue Card" },
      { name: "United Kingdom", flag: "🇬🇧", visa: "Skilled Worker" },
      { name: "France", flag: "🇫🇷", visa: "Talent / Work Permit" },
      { name: "Ireland", flag: "🇮🇪", visa: "Critical Skills Permit" },
      { name: "Netherlands", flag: "🇳🇱", visa: "Highly Skilled Migrant" },
      { name: "Switzerland", flag: "🇨🇭", visa: "Long-stay Work Permit" },
      { name: "Denmark", flag: "🇩🇰", visa: "Positive List Visa" },
      { name: "Sweden", flag: "🇸🇪", visa: "Work Permit" },
      { name: "Norway", flag: "🇳🇴", visa: "Skilled Worker Residence" },
      { name: "Finland", flag: "🇫🇮", visa: "Residence Permit for Work" },
    ],
  },
  {
    title: "Europe (South & East)",
    subtitle: "Fast-growing hospitality, logistics, and technical sectors",
    countries: [
      { name: "Spain", flag: "🇪🇸", visa: "General Work Authorization" },
      { name: "Portugal", flag: "🇵🇹", visa: "D1 / Work Visa" },
      { name: "Malta", flag: "🇲🇹", visa: "Single Permit" },
      { name: "Poland", flag: "🇵🇱", visa: "Type D Work Visa" },
      { name: "Austria", flag: "🇦🇹", visa: "Red-White-Red Card" },
      { name: "Croatia", flag: "🇭🇷", visa: "Work and Residence Permit" },
      { name: "Greece", flag: "🇬🇷", visa: "National Employment Visa" },
      { name: "Romania", flag: "🇷🇴", visa: "Long-stay Work Visa" },
      { name: "Slovakia", flag: "🇸🇰", visa: "Temporary Residence for Employment" },
      { name: "Hungary", flag: "🇭🇺", visa: "Guest Worker Permit" },
    ],
  },
  {
    title: "Americas & Pacific",
    subtitle: "Top destinations for PR pathways and global careers",
    countries: [
      { name: "Canada", flag: "🇨🇦", visa: "Work Permit / PR" },
      { name: "Australia", flag: "🇦🇺", visa: "482 / 186 / 189" },
      { name: "New Zealand", flag: "🇳🇿", visa: "AEWV" },
      { name: "United States", flag: "🇺🇸", visa: "H-1B / EB-3" },
    ],
  },
  {
    title: "Asia, Gulf & Africa",
    subtitle: "Strong opportunities across healthcare, construction, and hospitality",
    countries: [
      { name: "Singapore", flag: "🇸🇬", visa: "Employment Pass" },
      { name: "Malaysia", flag: "🇲🇾", visa: "Employment Pass" },
      { name: "Maldives", flag: "🇲🇻", visa: "Employment Approval" },
      { name: "Kazakhstan", flag: "🇰🇿", visa: "Work Visa" },
      { name: "Saudi Arabia", flag: "🇸🇦", visa: "Iqama Work Permit" },
      { name: "Qatar", flag: "🇶🇦", visa: "Work Residence Permit" },
      { name: "UAE", flag: "🇦🇪", visa: "Employment Visa" },
      { name: "Israel", flag: "🇮🇱", visa: "B/1 Work Visa" },
      { name: "Japan", flag: "🇯🇵", visa: "SSW / Engineer Visa" },
    ],
  },
]

export function WorkVisaSection({ compact = false }: { compact?: boolean }) {
  return (
    <section
      id="work-visa"
      className="relative scroll-mt-24 py-20 md:py-28"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
            <Briefcase className="h-3.5 w-3.5" />
            Work Visa Specialists
          </div>
          <h2 className="mt-5 font-serif text-3xl font-semibold leading-tight text-balance text-foreground md:text-5xl">
            Continent-wise <span className="text-primary">work visa pathways</span>
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            We designed this section for quick decision making: pick your preferred continent,
            compare country options, and connect with our team for eligibility mapping.
          </p>
        </div>

        <div className="mt-12 space-y-7">
          {CONTINENT_GROUPS.map((continent, idx) => (
            <motion.article
              key={continent.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
              className="lift-card overflow-hidden rounded-3xl border border-border/60 bg-card/65 backdrop-blur-sm"
            >
              <div className="flex flex-col gap-4 border-b border-border/60 bg-primary/5 px-6 py-5 md:flex-row md:items-end md:justify-between md:px-7">
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground">
                    {continent.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{continent.subtitle}</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  {continent.countries.length} destination options
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3 md:p-6">
                {(compact ? continent.countries.slice(0, 4) : continent.countries).map((country) => (
                  <Link
                    key={`${continent.title}-${country.name}`}
                    href={`/contact?country=${encodeURIComponent(country.name.toLowerCase())}`}
                    className="group rounded-2xl border border-border/60 bg-background/60 p-4 transition hover:border-primary/50 hover:bg-primary/5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="flex items-center gap-2 font-semibold text-foreground">
                        <span className="text-xl" aria-hidden="true">
                          {country.flag}
                        </span>
                        {country.name}
                      </p>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                    </div>
                    <p className="mt-1.5 text-xs uppercase tracking-wide text-primary/90">
                      {country.visa}
                    </p>
                  </Link>
                ))}
              </div>
              {compact && continent.countries.length > 4 && (
                <div className="px-6 pb-5 text-xs text-muted-foreground md:px-7">
                  +{continent.countries.length - 4} more countries in this continent
                </div>
              )}
            </motion.article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href={compact ? "/countries" : "/contact"}
            className="btn-glow inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {compact ? "Explore all countries by continent" : "Get continent-wise visa guidance"}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
