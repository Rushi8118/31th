import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, GraduationCap, Award, Globe2, CheckCircle2, Snowflake, BookOpen, Heart } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHero } from "@/components/page-hero"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Study in Canada from India - Canada Education Consultants | Siddhivinayak Overseas",
  description:
    "Study in Canada from India with trusted education consultants. University admissions, SDS visa help, scholarships & PR pathway guidance for fresh graduates.",
  keywords: [
    "study in Canada from India consultants",
    "Canada education consultants",
    "Canada student visa consultants India",
    "study abroad Canada",
    "SDS visa Canada",
    "post-study work permit Canada",
    "Canada PR for students",
  ],
}

const CANADA_HIGHLIGHTS = [
  { icon: Award, title: "Clear PR Pathway", desc: "Canadian education is one of the fastest routes to permanent residency through the Express Entry system." },
  { icon: Snowflake, title: "Affordable Education", desc: "Tuition fees and living costs in Canada are significantly lower than the US and UK." },
  { icon: Heart, title: "Welcoming Society", desc: "Canada is known for its multicultural, safe, and inclusive environment for international students." },
  { icon: Globe2, title: "3-Year Work Permit", desc: "Post-graduation work permits up to 3 years provide excellent international work experience." },
]

export default function StudyInCanadaPage() {
  return (
    <>
      <SiteHeader />
      <main className="relative overflow-hidden premium-page">
        <PageHero
          eyebrow="Study in Canada"
          title="Study in Canada from India"
          description="Embark on your Canadian education journey with expert guidance. Admissions to top universities, SDS visa processing, scholarship support, and PR pathway counselling."
          breadcrumbs={[{ label: "Home", to: "/" }, { label: "Study in Canada" }]}
        />

        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {CANADA_HIGHLIGHTS.map((h) => (
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
                Why Study in Canada?
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Canada has emerged as the most popular study destination for Indian students, and for good reason. With world-class universities, affordable tuition fees, and the clearest pathway to permanent residency, Canada offers unmatched value for international students. As leading <strong>Canada education consultants</strong>, we help Indian students navigate the SDS visa process, secure admissions to top Canadian universities, and plan their PR journey.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Canadian universities are known for their research output, quality of teaching, and strong industry connections. The Post-Graduation Work Permit (PGWP) allows students to work in Canada for up to three years after graduation, and the experience gained through PGWP significantly boosts Express Entry CRS scores. Canada's multicultural society, high standard of living, and excellent healthcare make it an ideal destination for students and their families.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Most affordable study destination among English-speaking countries",
                  "SDS visa processing — faster and higher approval rates",
                  "Up to 3 years post-graduation work permit",
                  "Clear Express Entry PR pathway for graduates",
                  "Safe, multicultural, and welcoming communities",
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
                Our Canada Study Services
              </h3>
              <ul className="mt-6 space-y-4">
                {[
                  { icon: BookOpen, label: "University & College Application Support" },
                  { icon: Award, label: "SDS Visa Filing & Documentation" },
                  { icon: Globe2, label: "PGWP & Express Entry PR Counselling" },
                  { icon: Heart, label: "Scholarship & GIC Guidance" },
                  { icon: GraduationCap, label: "IELTS/PTE Preparation & Coaching" },
                ].map((s) => (
                  <li key={s.label} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/60 p-4">
                    <s.icon className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm font-medium text-foreground">{s.label}</span>
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className="btn-glow mt-6 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/contact">Apply for Canada <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-t border-border/40 py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl text-center">
              Top Canadian Universities for Indian Students
            </h2>
            <p className="mt-4 text-center text-base text-muted-foreground max-w-2xl mx-auto">
              We help you gain admission to Canada's top universities and colleges across all provinces.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[
                "University of Toronto", "University of British Columbia",
                "McGill University", "University of Alberta",
                "McMaster University", "University of Montreal",
                "University of Waterloo", "Western University",
                "University of Calgary", "Queen's University",
                "Dalhousie University", "Simon Fraser University",
                "University of Ottawa", "University of Manitoba",
                "University of Saskatchewan", "York University",
                "University of Guelph", "Memorial University",
                "University of New Brunswick", "University of Windsor",
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
                What Happens After Your Studies? Canada Work Options
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Graduating from a Canadian DLI? The Post-Graduation Work Permit (PGWP) gives you up to 3 years of open work rights. Canadian work experience is the fastest pathway to permanent residency through the CEC program.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button asChild size="sm" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/post-study-work-visa/canada">Canada PGWP Guide <ArrowRight className="ml-1 h-3 w-3" /></Link>
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
                Ready to Study in Canada?
              </h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Our Canada education consultants have helped hundreds of Indian students achieve their study abroad and PR dreams. Book your free consultation today.
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
                Also explore: <Link href="/study-in-usa" className="text-primary hover:underline">Study in USA</Link> &middot; <Link href="/study-in-uk" className="text-primary hover:underline">Study in UK</Link> &middot; <Link href="/study-in-australia" className="text-primary hover:underline">Study in Australia</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
