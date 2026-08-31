import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, GraduationCap, Award, Globe2, CheckCircle2, Clock, BookOpen, Landmark } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHero } from "@/components/page-hero"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Study in UK from India - UK Education Consultants | Siddhivinayak Overseas",
  description:
    "Study in UK from India with trusted education consultants. University admissions, Tier 4 visa help, scholarships & PSW guidance for fresh graduates. Apply now.",
  keywords: [
    "study in UK from India consultants",
    "UK education consultants",
    "UK student visa consultants India",
    "study abroad UK",
    "Russell Group universities",
    "Tier 4 visa assistance",
    "post-study work visa UK",
  ],
}

const UK_HIGHLIGHTS = [
  { icon: Landmark, title: "Prestigious Universities", desc: "Home to Oxford, Cambridge, and 24 Russell Group universities with centuries of academic excellence." },
  { icon: Award, title: "2-Year PSW Visa", desc: "Graduate Route visa allows 2 years of work in the UK after completing your degree." },
  { icon: Clock, title: "Shorter Programs", desc: "Most undergraduate programs are 3 years and master's programs are 1 year, saving time and money." },
  { icon: Globe2, title: "Global Career Hub", desc: "London is a global financial and tech hub with unmatched career opportunities for graduates." },
]

export default function StudyInUKPage() {
  return (
    <>
      <SiteHeader />
      <main className="relative overflow-hidden premium-page">
        <PageHero
          eyebrow="Study in UK"
          title="Study in UK from India"
          description="Pursue world-class education at Britain's finest universities. Comprehensive support for admissions, Tier 4 visas, scholarships, and PSW applications."
          breadcrumbs={[{ label: "Home", to: "/" }, { label: "Study in UK" }]}
        />

        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {UK_HIGHLIGHTS.map((h) => (
                <div key={h.title} className="lift-card rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm">
                  <h.icon className="h-8 w-8 text-primary" />
                  <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">{h.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{h.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border/40 py-16 md:py-20">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 md:grid-cols-2 md:px-6">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
                Why Study in the United Kingdom?
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                The United Kingdom has long been a beacon of academic excellence, attracting students from around the world to its historic and modern institutions. As experienced <strong>UK education consultants</strong>, we help Indian students navigate the admissions process for some of the world's most prestigious universities. The UK offers a unique blend of tradition and innovation, with cutting-edge research facilities and strong industry partnerships.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                One of the biggest advantages of studying in the UK is the shorter duration of programs — most bachelor's degrees are completed in three years and master's programs in just one year. This significantly reduces the overall cost of education. The Graduate Route visa allows international students to stay and work in the UK for two years after graduation, providing valuable international work experience. UK degrees are recognized globally and open doors to careers worldwide.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "4 of the world's top 10 universities",
                  "One-year master's programs — save time and tuition",
                  "2-year post-study work visa (Graduate Route)",
                  "Strong Indian student community and support networks",
                  "Excellent healthcare through NHS for students",
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
                Our UK Study Services
              </h3>
              <ul className="mt-6 space-y-4">
                {[
                  { icon: BookOpen, label: "UCAS Application & University Shortlisting" },
                  { icon: Award, label: "Commonwealth & Chevening Scholarship Guidance" },
                  { icon: Globe2, label: "Tier 4 (General) Student Visa Filing" },
                  { icon: Clock, label: "Graduate Route PSW Visa Counselling" },
                  { icon: GraduationCap, label: "IELTS/PTE Preparation & Coaching" },
                ].map((s) => (
                  <li key={s.label} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/60 p-4">
                    <s.icon className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm font-medium text-foreground">{s.label}</span>
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className="btn-glow mt-6 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/contact">Apply for UK <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-t border-border/40 py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl text-center">
              Top UK Universities for Indian Students
            </h2>
            <p className="mt-4 text-center text-base text-muted-foreground max-w-2xl mx-auto">
              We have partnerships with leading British universities across England, Scotland, Wales, and Northern Ireland.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[
                "University of Oxford", "University of Cambridge",
                "Imperial College London", "University College London",
                "University of Edinburgh", "University of Manchester",
                "King's College London", "London School of Economics",
                "University of Bristol", "University of Glasgow",
                "University of Birmingham", "University of Southampton",
                "University of Leeds", "University of Sheffield",
                "University of Nottingham", "University of Warwick",
                "University of Leicester", "Cardiff University",
                "University of Aberdeen", "Queen Mary University of London",
              ].map((uni) => (
                <div key={uni} className="rounded-xl border border-border/60 bg-card/50 p-4 text-center hover:border-primary/40 transition-colors">
                  <p className="text-sm font-medium text-foreground">{uni}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border/40 py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 md:p-8">
              <h2 className="font-serif text-xl font-semibold text-foreground md:text-2xl">
                What Happens After Your Studies? UK Work Options
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Completed your UK degree and want to stay? The UK Graduate Route gives you 2 years to work and gain international experience (3 years for PhD graduates). No job offer required — you can work in any role.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button asChild size="sm" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/post-study-work-visa/uk">UK Post-Study Work Visa Guide <ArrowRight className="ml-1 h-3 w-3" /></Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="rounded-full border-primary/20">
                  <Link href="/post-study-work-visa">Compare All Countries</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border/40 py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="rounded-3xl border border-primary/30 bg-primary/5 p-8 text-center md:p-12">
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                Ready to Study in the UK?
              </h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Our UK education consultants have guided hundreds of Indian students to top British universities. Start your journey today.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="btn-glow rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/contact">Free Consultation <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full border-primary/20">
                  <Link href="/services">Explore All Services</Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Also explore: <Link href="/study-in-usa" className="text-primary hover:underline">Study in USA</Link> &middot; <Link href="/study-in-canada" className="text-primary hover:underline">Study in Canada</Link> &middot; <Link href="/study-in-australia" className="text-primary hover:underline">Study in Australia</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
