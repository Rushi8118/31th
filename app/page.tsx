import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { WorkVisaSection } from "@/components/work-visa-section"
import { StudyVisaSection } from "@/components/study-visa-section"
import { ProcessSection } from "@/components/process-section"
import { WhyUs } from "@/components/why-us"
import { Testimonials } from "@/components/testimonials"
import { SeoContentSection } from "@/components/seo-content-section"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="relative overflow-hidden premium-page">
        <Hero />
        <WorkVisaSection compact />
        <StudyVisaSection />
        <ProcessSection />
        <WhyUs />
        <Testimonials />

        <SeoContentSection />

        {/* CTA banner linking to dedicated /contact page */}
        <section className="px-4 pb-20 md:px-6 md:pb-28">
          <div className="shimmer-border mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 rounded-3xl border border-primary/30 bg-primary/10 p-8 text-center md:flex-row md:p-10 md:text-left">
            <div className="max-w-xl">
              <h2 className="font-serif text-2xl font-semibold leading-tight text-foreground md:text-3xl">
                Ready to start your overseas journey?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground md:text-base">
                Book a free 30-minute consultation. Our experts will assess your profile and
                map out the best work or study visa pathway for you.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="btn-glow rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/contact" className="group">
                Book free consultation
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
