import Link from "next/link"
import { Globe2 } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="relative border-t border-primary/10 bg-background/95">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
                <Globe2 className="h-5 w-5 text-primary" />
              </span>
              <div className="flex flex-col leading-tight">
                <span className="font-serif text-base font-semibold text-foreground">
                  Siddhivinayak
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Overseas
                </span>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Trusted overseas consultancy for Work and Study Visas. Helping aspirants build
              global careers across Japan, Australia, Canada, the UK, Germany, NZ, Russia, USA,
              UAE, and more.
            </p>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Pages
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                { label: "Work Visa", href: "/work-visa" },
                { label: "Study Visa", href: "/study-visa" },
                { label: "All Services", href: "/services" },
                { label: "Customer Reviews", href: "/reviews" },
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    prefetch
                    className="text-muted-foreground transition hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Countries
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
              {[
                { label: "USA", href: "/study-in-usa" },
                { label: "UK", href: "/study-in-uk" },
                { label: "Canada", href: "/study-in-canada" },
                { label: "Australia", href: "/study-in-australia" },
                { label: "Japan", href: "/countries" },
                { label: "Germany", href: "/countries" },
                { label: "NZ", href: "/countries" },
                { label: "UAE", href: "/countries" },
              ].map((c) => (
                <li key={c.label}>
                  <Link
                    href={c.href}
                    className="text-muted-foreground transition hover:text-primary"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Contact
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a
                  href="tel:+919925064666"
                  className="transition hover:text-primary"
                >
                  +91 99250 64666
                </a>
              </li>
              <li>
                <a
                  href="tel:+919512000632"
                  className="transition hover:text-primary"
                >
                  +91 95120 00632
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919925064666"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-primary"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@siddhivinayakoverseas.com"
                  className="transition hover:text-primary"
                >
                  info@siddhivinayakoverseas.com
                </a>
              </li>
              <li>India · Serving clients globally</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} Siddhivinayak Overseas. All rights reserved.
          </p>
          <p>Made with care for global aspirants.</p>
        </div>
      </div>
    </footer>
  )
}
