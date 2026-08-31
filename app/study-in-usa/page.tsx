import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, GraduationCap, Award, Globe2, CheckCircle2, DollarSign, Clock, BookOpen } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHero } from "@/components/page-hero"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Study in USA from India - Top US Education Consultants | Siddhivinayak Overseas",
  description:
    "Study in USA from India with trusted education consultants. University admissions, F-1 visa help, scholarships & OPT guidance for fresh graduates. Apply now.",
  keywords: [
    "study in USA from India consultants",
    "USA education consultants",
    "US student visa consultants India",
    "study abroad USA",
    "American university admissions",
    "F-1 visa assistance",
    "OPT STEM extension",
  ],
}

const USA_HIGHLIGHTS = [
  { icon: GraduationCap, title: "World-Leading Universities", desc: "Home to 8 of the top 20 global universities including Harvard, MIT, Stanford, and Yale." },
  { icon: Award, title: "STEM OPT Extension", desc: "STEM graduates can work in the US for up to 3 years after graduation through the OPT program." },
  { icon: Globe2, title: "Diverse Campus Life", desc: "Over 4,000 universities offering unparalleled academic and cultural diversity." },
  { icon: DollarSign, title: "Generous Scholarships", desc: "Merit-based and need-based financial aid available at most US universities." },
]

export default function StudyInUSAPage() {
  return (
    <>
      <SiteHeader />
      <main className="relative overflow-hidden premium-page">
        <PageHero
          eyebrow="Study in USA"
          title="Study in USA from India"
          description="Unlock world-class education at America's top universities. Expert guidance on admissions, F-1 visas, scholarships, and STEM OPT pathways."
          breadcrumbs={[{ label: "Home", to: "/" }, { label: "Study in USA" }]}
        />

        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {USA_HIGHLIGHTS.map((h) => (
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
                Why Study in the USA?
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                The United States remains the most popular destination for Indian students seeking world-class higher education. With over 4,000 accredited universities, the US offers unparalleled academic choice, cutting-edge research facilities, and a dynamic campus culture that fosters innovation and leadership. As leading <strong>USA education consultants</strong>, we guide Indian students through every step of the journey — from university selection to F-1 visa approval.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                US degrees are recognized globally and carry immense value in the international job market. The Optional Practical Training (OPT) program allows international students to work in the US for up to 12 months after graduation, with a 24-month extension for STEM graduates. This makes the US an ideal destination for students pursuing careers in technology, engineering, healthcare, business, and the sciences.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "8 of the world's top 20 universities",
                  "Flexible curriculum with interdisciplinary options",
                  "Up to 3 years work authorization (STEM OPT)",
                  "Vibrant Indian student communities across campuses",
                  "Strong industry connections and internship opportunities",
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
                Our USA Study Services
              </h3>
              <ul className="mt-6 space-y-4">
                {[
                  { icon: BookOpen, label: "University Shortlisting & Applications" },
                  { icon: Award, label: "Scholarship & Financial Aid Guidance" },
                  { icon: Globe2, label: "F-1 Student Visa Filing & Preparation" },
                  { icon: Clock, label: "OPT & STEM Extension Counselling" },
                  { icon: GraduationCap, label: "GRE/GMAT/TOEFL/IELTS Preparation" },
                ].map((s) => (
                  <li key={s.label} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/60 p-4">
                    <s.icon className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm font-medium text-foreground">{s.label}</span>
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className="btn-glow mt-6 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/contact">Apply for USA <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-t border-border/40 py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl text-center">
              Top US Universities for Indian Students
            </h2>
            <p className="mt-4 text-center text-base text-muted-foreground max-w-2xl mx-auto">
              We help you gain admission to prestigious American universities across the country.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[
                "Harvard University", "Massachusetts Institute of Technology",
                "Stanford University", "University of California, Berkeley",
                "Columbia University", "University of Chicago",
                "University of Pennsylvania", "Cornell University",
                "University of Michigan", "New York University",
                "University of Texas at Austin", "University of Washington",
                "Georgia Institute of Technology", "Purdue University",
                "University of Illinois Urbana-Champaign", "Arizona State University",
                "University of Southern California", "Boston University",
                "Northeastern University", "University of Florida",
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
            <div className="rounded-3xl border border-primary/30 bg-primary/5 p-8 text-center md:p-12">
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                Ready to Study in the USA?
              </h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Our US education consultants have helped hundreds of Indian students secure admissions to top American universities. Book your free consultation today.
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
                Also explore: <Link href="/study-in-uk" className="text-primary hover:underline">Study in UK</Link> &middot; <Link href="/study-in-canada" className="text-primary hover:underline">Study in Canada</Link> &middot; <Link href="/study-in-australia" className="text-primary hover:underline">Study in Australia</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
