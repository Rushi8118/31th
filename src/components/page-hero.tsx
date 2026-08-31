import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"

interface PageHeroProps {
  eyebrow: string
  title: string
  description: string
  breadcrumbs?: { label: string; to?: string }[]
}

export function PageHero({ eyebrow, title, description, breadcrumbs }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden pt-24 pb-10 sm:pt-28 md:pt-36 md:pb-16">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, oklch(0.62 0.17 50 / 0.14) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.30]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.24 0.04 35 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.24 0.04 35 / 0.06) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="mx-auto max-w-5xl px-4 text-center md:px-6">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="mb-5 flex flex-wrap items-center justify-center gap-1.5 text-xs text-muted-foreground"
          >
            {breadcrumbs.map((b, i) => (
              <span key={`${b.label}-${i}`} className="flex items-center gap-1.5">
                {b.to ? (
                  <Link to={b.to} className="transition hover:text-primary">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-foreground/80">{b.label}</span>
                )}
                {i < breadcrumbs.length - 1 && (
                  <ChevronRight className="h-3 w-3" aria-hidden="true" />
                )}
              </span>
            ))}
          </nav>
        )}

        <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
          {eyebrow}
        </span>

        <h1
          className="mt-5 font-serif font-semibold leading-[1.05] tracking-tight text-balance text-foreground"
          style={{ fontSize: "clamp(1.75rem, 7vw, 3.75rem)" }}
        >
          {title}
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
          {description}
        </p>
      </div>
    </section>
  )
}
