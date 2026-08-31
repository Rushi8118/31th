import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, ArrowRight, Briefcase, CheckCircle2 } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHero } from "@/components/page-hero"
import { WorkVisaSection } from "@/components/work-visa-section"
import { ProcessSection } from "@/components/process-section"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Work Visa Consultants in India — Japan, Canada, UK, Australia, Germany | Siddhivinayak Overseas",
  description:
    "Overseas education consultants in India for work visas to Japan, Canada, UK, Australia & Germany. Expert guidance for fresh graduates & professionals. Apply now",
  keywords: [
    "work visa consultants India",
    "overseas education consultants",
    "Japan SSW visa",
    "Australia 482 visa",
    "Canada Express Entry",
    "UK Skilled Worker visa",
    "Germany EU Blue Card",
    "overseas work permit",
    "study abroad consultants",
    "international education guidance",
    "work abroad from India",
    "skilled migration visa",
  ],
  openGraph: {
    title: "Work Visa Consultants in India — Japan, Canada, UK, Australia, Germany | Siddhivinayak Overseas",
    description: "Work visas for fresh graduates & professionals to Japan, Canada, UK, Australia & Germany. Expert overseas education consultants in India.",
    url: "https://siddhivinayakoverseas.com/work-visa",
  },
}

const ELIGIBILITY = [
  "Age 21â€“45 (varies by country)",
  "Relevant qualification or trade certificate",
  "Required language test (IELTS / JLPT / German A1)",
  "2+ years relevant work experience",
  "Clear medical & character certificate",
]

export default function WorkVisaPage() {
  return (
    <>
      <SiteHeader />
      <main className="relative overflow-hidden premium-page">
        <PageHero
          eyebrow="Work Visa Consultancy"
          title="Work abroad with confidence"
          description="From skilled migration to employer-sponsored pathways â€” we match your profile to the right country, role, and visa category, then handle every step."
          breadcrumbs={[{ label: "Home", to: "/" }, { label: "Work Visa" }]}
        />

        {/* Reuse the country grid from home */}
        <WorkVisaSection />

        <section className="py-16 md:py-20">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 md:grid-cols-12 md:px-6">
            <div className="md:col-span-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                <Briefcase className="h-3.5 w-3.5" />
                Eligibility checklist
              </span>
              <h2 className="mt-5 font-serif text-3xl font-semibold leading-tight text-balance text-foreground md:text-4xl">
                Are you eligible to work abroad?
              </h2>
              <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
                Specific requirements vary by country and visa category, but most work visa
                routes share these baseline criteria.
              </p>
              <ul className="mt-6 space-y-3">
                {ELIGIBILITY.map((e) => (
                  <li
                    key={e}
                    className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/60 p-3 text-sm text-foreground/90"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    {e}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                size="lg"
                className="btn-glow mt-6 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link href="/contact">Check my eligibility</Link>
              </Button>
            </div>

            <div className="md:col-span-6">
              <div className="rounded-3xl border border-border/60 bg-card/70 p-6 backdrop-blur-sm md:p-8">
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  Most popular routes in 2026
                </h3>
                <ul className="mt-5 space-y-4">
                  {[
                    {
                      country: "Japan",
                      route: "SSW (Specified Skilled Worker) â€” care, hospitality, manufacturing",
                    },
                    {
                      country: "Australia",
                      route: "Subclass 482 / 186 employer-sponsored & 189 PR",
                    },
                    {
                      country: "Canada",
                      route: "Express Entry, PNP, LMIA-backed work permits",
                    },
                    {
                      country: "Germany",
                      route: "EU Blue Card & Opportunity Card for IT, engineering, healthcare",
                    },
                    {
                      country: "United Kingdom",
                      route: "Skilled Worker & Health & Care Worker visas",
                    },
                  ].map((r) => (
                    <li
                      key={r.country}
                      className="flex items-start gap-3 border-b border-border/50 pb-4 last:border-0 last:pb-0"
                    >
                      <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">{r.country}</p>
                        <p className="text-sm text-muted-foreground">{r.route}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border/40 py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 md:p-8">
              <h2 className="font-serif text-xl font-semibold text-foreground md:text-2xl">
                Alternative: Graduate Route for Recent UK Graduates
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                If you completed your degree in the UK within the last 6 months, you may be eligible for the simpler Graduate Route (2 years work rights) instead of requiring employer sponsorship for a Skilled Worker visa. An open work permit with no job offer needed.
              </p>
              <Button asChild size="sm" className="mt-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/post-study-work-visa/uk">Learn About UK Graduate Route <ArrowRight className="ml-1 h-3 w-3" /></Link>
              </Button>
            </div>
          </div>
        </section>

        <ProcessSection />
      </main>
      <SiteFooter />
    </>
  )
}
