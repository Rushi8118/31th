import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, GraduationCap, Award, Globe2, CheckCircle2, Clock, BookOpen, TrendingUp, Building2, Users } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHero } from "@/components/page-hero"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Australia Post Study Work Visa: Subclass 485 Guide (2026) | Siddhivinayak Overseas",
  description:
    "Complete guide to Australia's post-study work visa (Subclass 485). 2-4 year work rights after graduation, eligibility, application process, regional benefits & PR pathway for international students.",
  keywords: [
    "post study work visa Australia",
    "Australia post study work visa",
    "Subclass 485 visa",
    "temporary graduate visa Australia",
    "post study work visa Australia for Indian students",
    "3 years post study work visa Australia",
    "Australia work after study",
    "how to get post study work visa Australia",
    "Australia PR after study",
  ],
}

const STEPS = [
  { step: "1", title: "Gather Documents", desc: "Start 3 months before graduation. Collect academic transcripts, completion letter, English test results, passport, and health insurance quotes." },
  { step: "2", title: "Health Examinations", desc: "Book health examination with a panel physician. Includes chest X-ray and medical checks. Results are valid for 12 months." },
  { step: "3", title: "Submit Application", desc: "Apply online through ImmiAccount within 6 months of receiving your completion letter. Upload all supporting documents." },
  { step: "4", title: "Wait for Processing", desc: "Current processing takes 5-8 months on average. You may receive a Bridging Visa allowing full work rights during this period." },
  { step: "5", title: "Receive Visa & Work", desc: "Once granted, your visa is valid for 2-4 years depending on your qualification. You can work full-time in any role." },
]

export default function AustraliaPostStudyWorkVisaPage() {
  return (
    <>
      <SiteHeader />
      <main className="relative overflow-hidden premium-page">
        <PageHero
          eyebrow="Australia Post-Study Work Visa"
          title="Australia Post Study Work Visa Guide: 2–4 Year Work Rights After Your Degree"
          description="Completed your studies in Australia? The Temporary Graduate visa (Subclass 485) gives you 2-4 years to work, gain experience, and transition to permanent residency."
          breadcrumbs={[{ label: "Home", to: "/" }, { label: "Post-Study Work Visa", to: "/post-study-work-visa" }, { label: "Australia" }]}
        />

        <section className="border-t border-border/40 py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                  <GraduationCap className="h-3.5 w-3.5" />
                  Subclass 485 Visa
                </span>
                <h2 className="mt-5 font-serif text-2xl font-semibold text-foreground md:text-3xl">
                  What is Australia&apos;s Post-Study Work Visa?
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  Australia offers two distinct streams under the Temporary Graduate visa (Subclass 485). Most international students qualify for the Post-Study Work stream, which offers:
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "2 years for Bachelor's degree holders",
                    "3 years for Master's degree holders",
                    "4 years for Doctoral degree holders",
                    "Additional 1-2 years if you studied in regional Australia",
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
                <p className="mt-2 text-sm text-muted-foreground">
                  To be eligible for Australia&apos;s post-study work visa:
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-start gap-3 text-sm text-foreground/90">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    Hold a degree from a CRICOS-registered Australian institution
                  </li>
                  <li className="flex items-start gap-3 text-sm text-foreground/90">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    Completed at least 2 years of study (16+ months)
                  </li>
                  <li className="flex items-start gap-3 text-sm text-foreground/90">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    Apply within 6 months of course completion
                  </li>
                  <li className="flex items-start gap-3 text-sm text-foreground/90">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    Under 50 years old at time of application
                  </li>
                  <li className="flex items-start gap-3 text-sm text-foreground/90">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    Meet English language requirements (IELTS 6.0 overall)
                  </li>
                  <li className="flex items-start gap-3 text-sm text-foreground/90">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    Pass health and character requirements
                  </li>
                </ul>
                <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3">
                  <p className="text-xs font-medium text-destructive">
                    Critical: You MUST apply within 6 months of receiving your completion letter. Miss this deadline and you lose eligibility permanently.
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
                Step by Step
              </span>
              <h2 className="mt-5 font-serif text-2xl font-semibold text-foreground md:text-3xl">
                Application Process: Step-by-Step Timeline
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
                The entire process takes 6-8 months. Start early to avoid any last-minute issues.
              </p>
            </div>
            <div className="mt-10 space-y-6">
              {STEPS.map((s, i) => (
                <div key={s.step} className="flex gap-4 rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground">{s.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                  </div>
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
                  Regional Benefits
                </span>
                <h2 className="mt-5 font-serif text-2xl font-semibold text-foreground md:text-3xl">
                  Extra Years for Regional Study
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  If you studied in regional Australia, you are eligible for significant additional benefits including extended visa duration and priority PR processing.
                </p>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  Regional areas include Adelaide (entire South Australia), Perth (Western Australia), Gold Coast, Sunshine Coast, Geelong, Newcastle, Wollongong, Hobart (Tasmania), and more.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "+1 year extension for Bachelor's graduates (total 3 years)",
                    "+2 years extension for Master's graduates (total 5 years)",
                    "Priority processing for permanent residency applications",
                    "Lower points requirement for skilled migration",
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
                  Pathway to Permanent Residency
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  The post-study work visa is your strategic pathway to Australian permanent residency. Most students follow the skilled migration route:
                </p>
                <ol className="mt-6 space-y-4">
                  {[
                    { title: "Years 1-2 on Post-Study Visa", desc: "Work full-time, gain Australian work experience in your field" },
                    { title: "Build Points", desc: "Australian work experience adds 5-20 points to your skilled migration score" },
                    { title: "Apply for PR", desc: "Subclass 189/190/491 after 2-3 years of work experience" },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="mt-6 rounded-xl border border-primary/30 bg-primary/10 p-4">
                  <p className="text-xs text-primary">
                    Most post-study work visa holders successfully transition to permanent residency within 5 years. Employer sponsorship is another popular route.
                  </p>
                </div>
                <Button asChild size="lg" className="btn-glow mt-6 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/contact">Check Your Eligibility <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border/40 py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
              <TrendingUp className="h-3.5 w-3.5" />
              Mistakes to Avoid
            </span>
            <h2 className="mt-5 font-serif text-2xl font-semibold text-foreground md:text-3xl">
              Common Mistakes That Lead to Rejection
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
              {[
                { title: "Missing the 6-Month Deadline", desc: "Students don't track their completion letter date accurately. Set reminders for 4 months and 5 months to ensure timely submission." },
                { title: "Insufficient English Scores", desc: "Assuming old IELTS scores are acceptable when band scores don't meet minimums. Take the test again 2-3 months before application." },
                { title: "Incomplete Study Period", desc: "Accelerated courses or credit transfers may result in less than 16 months actual study. Verify your study duration with your university." },
                { title: "Wrong Visa Stream", desc: "Applying for Graduate Work stream instead of Post-Study Work stream. Most Bachelor's/Master's graduates need the Post-Study Work stream." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/15 text-xs font-bold text-destructive">!</div>
                  <h3 className="mt-3 font-serif text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border/40 py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="rounded-3xl border border-primary/30 bg-primary/5 p-8 text-center md:p-12">
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                Need Help With Your Australia Post-Study Visa?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                We have helped 120+ Indian students secure Australian post-study work visas. Our team handles eligibility assessment, document verification, application lodgement, and PR pathway planning.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="btn-glow rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/contact">Free Consultation <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full border-primary/20">
                  <Link href="/post-study-work-visa">Back to Main Guide</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
