import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, GraduationCap, Award, Globe2, CheckCircle2, Sun, BookOpen, TrendingUp } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHero } from "@/components/page-hero"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Study in Australia from India - Australia Education Consultants | Siddhivinayak Overseas",
  description:
    "Study in Australia from India with trusted education consultants. University admissions, student visa 500, scholarships & PSW guidance for fresh graduates.",
  keywords: [
    "study in Australia from India consultants",
    "Australia education consultants",
    "Australia student visa consultants India",
    "study abroad Australia",
    "subclass 500 visa",
    "post-study work visa Australia",
    "Australian university admissions",
  ],
}

const AUSTRALIA_HIGHLIGHTS = [
  { icon: Sun, title: "Top-Ranked Universities", desc: "7 of the world's top 100 universities with strong programs in STEM, healthcare, and business." },
  { icon: TrendingUp, title: "4-Year PSW Visa", desc: "Post-study work rights up to 4 years for select degrees, offering excellent career-building opportunities." },
  { icon: Award, title: "Research Excellence", desc: "Australian universities are global leaders in research with cutting-edge facilities and funding." },
  { icon: Globe2, title: "High Quality of Life", desc: "Consistently ranked among the world's most livable cities with excellent healthcare and lifestyle." },
]

export default function StudyInAustraliaPage() {
  return (
    <>
      <SiteHeader />
      <main className="relative overflow-hidden premium-page">
        <PageHero
          eyebrow="Study in Australia"
          title="Study in Australia from India"
          description="Pursue your education in the land of opportunity. Expert guidance on admissions to Australian universities, student visa 500, scholarships, and PSW pathways."
          breadcrumbs={[{ label: "Home", to: "/" }, { label: "Study in Australia" }]}
        />

        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {AUSTRALIA_HIGHLIGHTS.map((h) => (
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
                Why Study in Australia?
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Australia has become one of the most sought-after study destinations for Indian students, offering a perfect blend of world-class education, vibrant campus life, and excellent post-study work opportunities. As trusted <strong>Australia education consultants</strong>, we guide Indian students through every step of their Australian education journey — from university selection to Subclass 500 student visa approval.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Australian universities are renowned for their strong industry connections, practical teaching approach, and global research impact. The Australian government offers generous post-study work rights — up to 4 years for select bachelor's and master's degrees — allowing graduates to gain valuable international work experience. With a high standard of living, multicultural society, and excellent healthcare system, Australia provides an ideal environment for international students to thrive academically and personally.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "7 universities in the global top 100",
                  "Post-study work visa up to 4 years",
                  "Strong focus on STEM, healthcare, and business",
                  "Generous scholarship programs for Indian students",
                  "Excellent work-life balance and outdoor lifestyle",
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
                Our Australia Study Services
              </h3>
              <ul className="mt-6 space-y-4">
                {[
                  { icon: BookOpen, label: "University Shortlisting & Applications" },
                  { icon: Award, label: "Australia Awards & Other Scholarships" },
                  { icon: Globe2, label: "Subclass 500 Student Visa Filing" },
                  { icon: TrendingUp, label: "PSW Visa & Migration Pathway Advice" },
                  { icon: GraduationCap, label: "IELTS/PTE Preparation & Coaching" },
                ].map((s) => (
                  <li key={s.label} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/60 p-4">
                    <s.icon className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm font-medium text-foreground">{s.label}</span>
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className="btn-glow mt-6 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/contact">Apply for Australia <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-t border-border/40 py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl text-center">
              Top Australian Universities for Indian Students
            </h2>
            <p className="mt-4 text-center text-base text-muted-foreground max-w-2xl mx-auto">
              We help you gain admission to Australia's prestigious universities and institutions.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[
                "University of Melbourne", "University of Sydney",
                "University of New South Wales", "Australian National University",
                "Monash University", "University of Queensland",
                "University of Western Australia", "University of Adelaide",
                "University of Technology Sydney", "University of Wollongong",
                "RMIT University", "Queensland University of Technology",
                "Macquarie University", "Curtin University",
                "Deakin University", "University of Tasmania",
                "Griffith University", "La Trobe University",
                "Swinburne University", "Flinders University",
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
                What Happens After Your Studies? Australia Work Options
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Completed your Australian degree? The Subclass 485 visa gives you 2-4 years of work rights (up to 5 years with regional study). No job offer needed — you can work full-time in any role and build your pathway to PR.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button asChild size="sm" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/post-study-work-visa/australia">Australia Post-Study Work Visa Guide <ArrowRight className="ml-1 h-3 w-3" /></Link>
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
                Ready to Study in Australia?
              </h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Our Australia education consultants have helped hundreds of Indian students secure admissions to top Australian universities. Book your free consultation today.
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
                Also explore: <Link href="/study-in-usa" className="text-primary hover:underline">Study in USA</Link> &middot; <Link href="/study-in-uk" className="text-primary hover:underline">Study in UK</Link> &middot; <Link href="/study-in-canada" className="text-primary hover:underline">Study in Canada</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
