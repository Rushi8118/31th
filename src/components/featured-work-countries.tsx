import { Link } from 'react-router-dom'
import { ArrowRight, Briefcase } from 'lucide-react'
import { WORK_COUNTRY_BY_SLUG } from '@/content/work-countries'
import { FlagIcon } from '@/components/flag-icon'

const FEATURED = [
  'japan',
  'germany',
  'uk',
  'canada',
  'australia',
  'singapore',
  'france',
  'usa',
  'gulf',
  'ireland',
  'poland',
  'malta',
] as const

/** Lightweight homepage strip — avoids animating 40+ cards on scroll. */
export function FeaturedWorkCountries() {
  return (
    <section id="work-visa" className="relative scroll-mt-24 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
            <Briefcase className="h-3.5 w-3.5" />
            Work Permit Visas · 38+ countries
          </div>
          <h2 className="mt-5 font-serif text-3xl font-semibold text-foreground md:text-4xl">
            Popular work visa destinations
          </h2>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            Explore featured pathways, or view the full country list.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {FEATURED.map((slug) => {
            const c = WORK_COUNTRY_BY_SLUG[slug]
            if (!c) return null
            return (
              <Link
                key={slug}
                to={`/work-visa/${slug}`}
                className="lift-card rounded-2xl border border-border/60 bg-card/70 p-4 transition hover:border-primary/40 hover:bg-primary/5"
              >
                <p className="inline-flex items-center gap-2 font-medium text-foreground min-h-6">
                  {c.slug === 'africa' || c.slug === 'gulf' ? (
                    <span className="country-flag text-sm" aria-hidden="true">{c.flag}</span>
                  ) : (
                    <FlagIcon country={c.name} className="country-flag shrink-0 text-sm" />
                  )}
                  <span>{c.name}</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{c.visa}</p>
              </Link>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/work-visa"
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/15"
          >
            View all work visa countries
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
