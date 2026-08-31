import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, GraduationCap, Award, Globe2, CheckCircle2, Clock, BookOpen, TrendingUp, Building2, Users } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHero } from "@/components/page-hero"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "UK Post Study Work Visa 2026: Graduate Route Guide | Siddhivinayak Overseas",
  description:
    "Complete guide to the UK Graduate Route visa. 2-year work rights (3 for PhD), eligibility requirements, application process costs & PR pathways for international students in the UK.",
  keywords: [
    "post study work visa UK",
    "UK post study work visa",
    "UK Graduate Route visa",
    "post study work visa UK eligibility",
    "2 years post study work visa UK",
    "UK work after study",
    "graduate visa UK",
    "post study work visa UK for Indian students",
    "UK PSW visa 2026",
    "how to apply UK graduate route",
  ],
}

const ELIGIBILITY = [
  "Completed an eligible course at a UK Higher Education Provider with a track record of compliance",
  "Hold a valid Student visa (formerly Tier 4) at the time of application",
  "Apply before your current Student visa expires",
  "Be physically present in the UK when applying",
  "No criminal convictions or immigration violations",
]

export default function UKPostStudyWorkVisaPage() {
  return (
    <>
      <SiteHeader />
      <main className="relative overflow-hidden premium-page">
        <PageHero
          eyebrow="UK Post-Study Work Visa"
          title="UK Post Study Work Visa 2026: Everything International Students Need to Know"
          description="The UK Graduate Route allows international students to stay and work in the UK for 2 years after completing their degree. PhD graduates can stay for 3 years."
          breadcrumbs={[{ label: "Home", to: "/" }, { label: "Post-Study Work Visa", to: "/post-study-work-visa" }, { label: "United Kingdom" }]}
        />

        <section className="border-t border-border/40 py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                  <GraduationCap className="h-3.5 w-3.5" />
                  UK Graduate Route
                </span>
                <h2 className="mt-5 font-serif text-2xl font-semibold text-foreground md:text-3xl">
                  What is the UK Graduate Route?
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  The UK Graduate Route was introduced in July 2021 and allows international students who have completed a degree at a UK university to stay and work in the UK for up to 2 years (or 3 years for PhD graduates). The visa is an unsponsored, open work permit — meaning you do not need a job offer to apply.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "Work in any job at any skill level",
                    "Self-employment and freelance work allowed",
                    "No employer sponsorship required",
                    "Can switch to Skilled Worker visa after securing a job",
                    "Family members can join as dependants",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-foreground/90">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur-sm md:p-8">
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  Eligibility Requirements
                </h3>
                <ul className="mt-6 space-y-3">
                  {ELIGIBILITY.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-foreground/90">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 rounded-xl border border-primary/30 bg-primary/10 p-3">
                  <p className="text-xs font-medium text-primary">
                    Duration: 2 years for Bachelor's and Master's graduates, 3 years for PhD graduates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border/40 py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                <Clock className="h-3.5 w-3.5" />
                Application Process
              </span>
              <h2 className="mt-5 font-serif text-2xl font-semibold text-foreground md:text-3xl">
                How to Apply for the UK Graduate Route
              </h2>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
              {[
                { step: "01", title: "Complete Your Degree", desc: "Finish your course and receive official confirmation from your university that you have passed. The UK Home Office will verify this electronically." },
                { step: "02", title: "Apply Online", desc: "Submit your application through the UK Visas and Immigration website. You must apply from within the UK before your Student visa expires." },
                { step: "03", title: "Receive Decision", desc: "Standard processing takes approximately 8 weeks. You can work full-time while waiting for a decision if you applied before your visa expired." },
              ].map((item) => (
                <div key={item.step} className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm">
                  <span className="text-3xl font-bold text-primary/30">{item.step}</span>
                  <h3 className="mt-2 font-serif text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border/40 py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                  <Building2 className="h-3.5 w-3.5" />
                  After the Graduate Route
                </span>
                <h2 className="mt-5 font-serif text-2xl font-semibold text-foreground md:text-3xl">
                  Pathways After Your Graduate Visa Expires
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  The most common pathway after the Graduate Route visa expires is switching to the Skilled Worker visa. This requires a job offer from a UK employer with a valid sponsorship licence.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "Skilled Worker visa: Most popular route, requires employer sponsorship",
                    "Health and Care Worker visa: For healthcare professionals with reduced fees",
                    "Innovator Founder visa: For those starting a business in the UK",
                    "Global Talent visa: For leaders in academia, research, arts and technology",
                    "Family visa: If you have a partner or parent settled in the UK",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-foreground/90">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur-sm md:p-8">
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  Working Rights & Restrictions
                </h3>
                <ul className="mt-6 space-y-4">
                  {[
                    { icon: Globe2, label: "Full-time work", desc: "Work 40+ hours per week in any role at any skill level" },
                    { icon: Award, label: "Self-employment", desc: "Freelance work and self-employment are permitted" },
                    { icon: BookOpen, label: "Study allowed", desc: "You can study further, but cannot do a new degree on this visa" },
                    { icon: TrendingUp, label: "Visa switching", desc: "Can switch to Skilled Worker or other eligible visa categories from within the UK" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </ul>
                <Button asChild size="lg" className="btn-glow mt-6 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/contact">Check Your Eligibility <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border/40 py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="rounded-3xl border border-primary/30 bg-primary/5 p-8 text-center md:p-12">
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                Ready to Stay and Work in the UK?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                Our team can help you prepare your Graduate Route application, review your documents, and plan your transition to a Skilled Worker visa. Book a free consultation today.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="btn-glow rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/contact">Free Consultation <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full border-primary/20">
                  <Link href="/post-study-work-visa">Back to Main Guide</Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Also explore: <Link href="/study-in-uk" className="text-primary hover:underline">Study in UK</Link> &middot; <Link href="/post-study-work-visa/australia" className="text-primary hover:underline">Australia Post-Study Visa</Link> &middot; <Link href="/post-study-work-visa/canada" className="text-primary hover:underline">Canada PGWP</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
