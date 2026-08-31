import { Link } from 'react-router-dom'
import { ArrowUpRight, BookOpen } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter, WhatsAppFab } from '@/components/site-footer'
import { PageHero } from '@/components/page-hero'
import { SeoHead } from '@/components/seo/SeoHead'
import { CtaBand } from '@/components/seo/CtaBand'
import { guideArticles, guidesIndexMeta } from '@/content/guides'
import {
  breadcrumbSchema,
  localBusinessSchema,
  organizationSchema,
  webpageSchema,
  websiteSchema,
} from '@/lib/seo/schema'

export default function GuidesPage() {
  return (
    <>
      <SeoHead
        title={guidesIndexMeta.title}
        description={guidesIndexMeta.description}
        path="/guides"
        keywords="visa guides India, study visa requirements, work visa guides, IELTS study abroad"
        jsonLd={[
          organizationSchema(),
          websiteSchema(),
          localBusinessSchema(),
          webpageSchema({
            title: guidesIndexMeta.title,
            description: guidesIndexMeta.description,
            path: '/guides',
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Guides', path: '/guides' },
          ]),
        ]}
      />
      <SiteHeader />
      <main id="main-content" className="relative overflow-hidden premium-page">
        <PageHero
          eyebrow="Visa knowledge hub"
          title="Visa Guides for Students & Professionals"
          description="Practical checklists and explanations from Siddhivinayak Overseas in Surat — written to help you prepare before counselling."
          breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Guides' }]}
        />
        <section className="py-16 md:py-20">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3 md:px-6">
            {guideArticles.map((guide) => (
              <Link
                key={guide.path}
                to={guide.path}
                className="group rounded-2xl border border-border/60 bg-card/60 p-6 transition hover:border-primary/40"
              >
                <BookOpen className="h-5 w-5 text-primary" />
                <div className="mt-4 flex items-start justify-between gap-3">
                  <h2 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary">
                    {guide.h1}
                  </h2>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{guide.description}</p>
              </Link>
            ))}
          </div>
        </section>
        <CtaBand title="Need help applying this to your profile?" />
      </main>
      <SiteFooter />
      <WhatsAppFab />
    </>
  )
}
