import { Link } from 'react-router-dom'
import { ArrowUpRight, Briefcase } from 'lucide-react'
import { WORK_COUNTRY_BY_SLUG, WORK_COUNTRY_GROUPS } from '@/content/work-countries'
import { FlagIcon } from '@/components/flag-icon'

export function WorkVisaSection({ compact = false }: { compact?: boolean }) {
  return (
    <section id="work-visa" className="relative scroll-mt-24 py-20 md:py-28">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
            <Briefcase className="h-3.5 w-3.5" />
            Work Permit Specialists · 38+ destinations
          </div>
          <h2 className="mt-5 font-serif text-3xl font-semibold leading-tight text-balance text-foreground md:text-5xl">
            Work visa countries we <span className="text-primary">actively support</span>
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Europe, Asia, Oceania, North America, plus Africa and Gulf coverage — pick a country
            to see pathway details, then book a Surat consultation for eligibility mapping.
          </p>
        </div>

        <div className={`mt-12 space-y-7 ${compact ? 'md:space-y-6' : ''}`}>
          {WORK_COUNTRY_GROUPS.map((group) => (
            <article
              key={group.region}
              className="overflow-hidden rounded-3xl border border-border/60 bg-card/70"
            >
              <div className="border-b border-border/60 bg-primary/5 px-6 py-5 md:px-7">
                <h3 className="font-serif text-2xl font-semibold text-foreground">{group.region}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{group.subtitle}</p>
              </div>
              <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 md:p-6">
                {group.slugs.map((slug) => {
                  const country = WORK_COUNTRY_BY_SLUG[slug]
                  if (!country) return null
                  return (
                    <Link
                      key={slug}
                      to={`/work-visa/${slug}`}
                      className="group flex items-start justify-between gap-3 rounded-2xl border border-border/50 bg-background/50 p-4 transition hover:border-primary/40 hover:bg-primary/5"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {country.slug === 'africa' || country.slug === 'gulf' ? (
                            <span className="mr-2" aria-hidden="true">{country.flag}</span>
                          ) : (
                            <FlagIcon country={country.name} className="mr-2 inline-block align-[-0.1em]" />
                          )}
                          {country.name}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">{country.visa}</p>
                      </div>
                      <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
                    </Link>
                  )
                })}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Check my work visa eligibility
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
