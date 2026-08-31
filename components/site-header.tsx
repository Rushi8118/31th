"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Menu, X, Globe2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Work Visa", href: "/work-visa" },
  { label: "Study Visa", href: "/study-visa" },
  { label: "Reviews", href: "/reviews" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-2xl border-b border-primary/20 shadow-lg shadow-black/[0.03]"
          : "bg-background/70 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          aria-label="Siddhivinayak Overseas - Home"
        >
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30 transition group-hover:bg-primary/25 group-hover:ring-primary/60">
            <Globe2 className="h-5 w-5 text-primary" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-serif text-base font-semibold text-foreground md:text-lg">
              Siddhivinayak
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground md:text-[11px]">
              Overseas
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              data-active={isActive(item.href)}
              className="nav-link text-sm font-medium text-foreground/80 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/40 hover:bg-primary/5"
              >
                <User className="h-4 w-4" />
                Dashboard
              </Link>
              <Button
                onClick={signOut}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="rounded-full">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/70 bg-card/60 text-foreground transition hover:border-primary/60 hover:text-primary lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
          open ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-4 mb-4 rounded-xl border border-border/70 bg-card/95 p-3 backdrop-blur-xl">
          <nav className="flex flex-col" aria-label="Mobile">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                onClick={() => setOpen(false)}
                data-active={isActive(item.href)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/85 transition hover:bg-primary/10 hover:text-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/85 transition hover:bg-primary/10 hover:text-primary"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    signOut()
                    setOpen(false)
                  }}
                  className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-foreground/85 transition hover:bg-primary/10 hover:text-primary"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/85 transition hover:bg-primary/10 hover:text-primary"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/85 transition hover:bg-primary/10 hover:text-primary"
                >
                  Register
                </Link>
              </>
            )}
            <Button
              asChild
              className="mt-2 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setOpen(false)}
            >
              <Link href="/contact">Free Consultation</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
