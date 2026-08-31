import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

export type RelatedLink = {
  label: string
  to: string
  description?: string
}

type RelatedLinksProps = {
  title?: string
  links: RelatedLink[]
}

export function RelatedLinks({ title = 'Related pages', links }: RelatedLinksProps) {
  if (!links.length) return null

  return (
    <section className="border-t border-border/40 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">{title}</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="group rounded-2xl border border-border/60 bg-card/60 p-5 transition hover:border-primary/40 hover:bg-card"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-medium text-foreground group-hover:text-primary">{link.label}</h3>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
              </div>
              {link.description ? (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{link.description}</p>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
