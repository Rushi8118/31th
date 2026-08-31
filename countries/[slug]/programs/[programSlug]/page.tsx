import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import {
  Globe2,
  ArrowLeft,
  ArrowRight,
  Clock,
  DollarSign,
  CheckCircle2,
  XCircle,
  Bookmark,
  FileText,
  ListChecks,
  GraduationCap,
  Building2,
  ChevronRight,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProgramPageProps {
  params: Promise<{ slug: string; programSlug: string }>
}

// Fallback program paths for static generation
const FALLBACK_PROGRAMS = [
  { slug: "japan", programSlug: "specified-skilled-worker" },
  { slug: "japan", programSlug: "student-visa" },
  { slug: "australia", programSlug: "temporary-skill-shortage-482" },
  { slug: "australia", programSlug: "student-visa-500" },
  { slug: "australia", programSlug: "skilled-independent-189" },
  { slug: "canada", programSlug: "express-entry-fsw" },
  { slug: "canada", programSlug: "study-permit" },
  { slug: "united-kingdom", programSlug: "skilled-worker" },
  { slug: "united-kingdom", programSlug: "student-visa" },
  { slug: "germany", programSlug: "opportunity-card" },
  { slug: "germany", programSlug: "eu-blue-card" },
  { slug: "germany", programSlug: "student-visa" },
  { slug: "new-zealand", programSlug: "accredited-employer-work-visa" },
  { slug: "new-zealand", programSlug: "student-visa" },
  { slug: "united-states", programSlug: "h1b-visa" },
  { slug: "united-states", programSlug: "f1-student-visa" },
  { slug: "united-arab-emirates", programSlug: "employment-visa" },
  { slug: "united-arab-emirates", programSlug: "golden-visa" },
]

export async function generateMetadata({ params }: ProgramPageProps): Promise<Metadata> {
  const { slug, programSlug } = await params
  const supabase = await createClient()
  const { data: program } = await supabase
    .from("public_visa_programs")
    .select("name, meta_title, meta_desc, country_name")
    .eq("country_slug", slug)
    .eq("slug", programSlug)
    .single()

  if (!program) return {}

  return {
    title: program.meta_title || `${program.name} | ${program.country_name} | Siddhivinayak Overseas`,
    description: program.meta_desc || `Details, eligibility, and requirements for ${program.name} in ${program.country_name}.`,
  }
}

export async function generateStaticParams() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("public_visa_programs")
    .select("country_slug, slug")

  const programs = (data && data.length > 0) ? data.map((p) => ({ slug: p.country_slug, programSlug: p.slug })) : FALLBACK_PROGRAMS
  return programs
}

export default async function ProgramPage({ params }: ProgramPageProps) {
  const { slug, programSlug } = await params
  const supabase = await createClient()

  const { data: program } = await supabase
    .from("public_visa_programs")
    .select("*")
    .eq("country_slug", slug)
    .eq("slug", programSlug)
    .single()

  if (!program) notFound()

  const eligibility = Array.isArray(program.eligibility) ? program.eligibility : []
  const requirements = Array.isArray(program.requirements) ? program.requirements : []
  const documents = Array.isArray(program.documents_needed) ? program.documents_needed : []
  const sectors = Array.isArray(program.popular_sectors) ? program.popular_sectors : []
  const universities = Array.isArray(program.universities) ? program.universities : []

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
              <Globe2 className="h-5 w-5 text-primary" />
            </span>
            <span className="font-serif text-base font-semibold">Siddhivinayak</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/" className="text-sm font-medium text-foreground/70 hover:text-foreground">Home</Link>
            <Link href="/countries" className="text-sm font-medium text-foreground/70 hover:text-foreground">Countries</Link>
            <Link href="/contact" className="text-sm font-medium text-foreground/70 hover:text-foreground">Contact</Link>
          </nav>
        </div>
      </header>

      <main className="min-h-screen bg-background">
        {/* Breadcrumb + Header */}
        <section className="border-b border-border/40 px-4 py-8 md:px-6 md:py-12">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/countries" className="hover:text-primary">Countries</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href={`/countries/${slug}`} className="hover:text-primary">{program.country_name}</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">{program.name}</span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{program.flag_emoji}</span>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {program.program_type.replace("_", " ").toUpperCase()} VISA
              </span>
            </div>

            <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {program.name}
            </h1>
            <p className="mt-3 text-muted-foreground md:text-lg">{program.description}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="btn-glow rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href={`/contact?country=${slug}&program=${programSlug}`}>
                  Start Application
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link href={`/countries/${slug}`}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to {program.country_name}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="border-b border-border/40 px-4 py-6 md:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {program.processing_time && (
                <div className="rounded-xl border border-border/60 bg-card/50 p-4">
                  <Clock className="mb-2 h-5 w-5 text-primary" />
                  <p className="text-lg font-bold text-foreground">{program.processing_time}</p>
                  <p className="text-xs text-muted-foreground">Processing Time</p>
                </div>
              )}
              {program.visa_duration && (
                <div className="rounded-xl border border-border/60 bg-card/50 p-4">
                  <Bookmark className="mb-2 h-5 w-5 text-primary" />
                  <p className="text-lg font-bold text-foreground">{program.visa_duration}</p>
                  <p className="text-xs text-muted-foreground">Visa Duration</p>
                </div>
              )}
              {program.cost_inr && (
                <div className="rounded-xl border border-border/60 bg-card/50 p-4">
                  <DollarSign className="mb-2 h-5 w-5 text-primary" />
                  <p className="text-lg font-bold text-foreground">₹{program.cost_inr.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Starting From</p>
                </div>
              )}
              {program.success_rate && (
                <div className="rounded-xl border border-border/60 bg-card/50 p-4">
                  <Star className="mb-2 h-5 w-5 text-primary" />
                  <p className="text-lg font-bold text-foreground">{program.success_rate}%</p>
                  <p className="text-xs text-muted-foreground">Success Rate</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Eligibility */}
              {eligibility.length > 0 && (
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <ListChecks className="h-5 w-5 text-primary" />
                    <h2 className="font-serif text-xl font-semibold">Eligibility</h2>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-card/50 p-5">
                    <ul className="space-y-3">
                      {eligibility.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Requirements */}
              {requirements.length > 0 && (
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h2 className="font-serif text-xl font-semibold">Requirements</h2>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-card/50 p-5">
                    <ul className="space-y-3">
                      {requirements.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Documents Needed */}
              {documents.length > 0 && (
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h2 className="font-serif text-xl font-semibold">Documents Needed</h2>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-card/50 p-5">
                    <ul className="space-y-3">
                      {documents.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <Bookmark className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Popular Sectors */}
              {sectors.length > 0 && (
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h2 className="font-serif text-xl font-semibold">Popular Sectors</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sectors.map((sector: string, i: number) => (
                      <span
                        key={i}
                        className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
                      >
                        {sector}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Universities */}
              {universities.length > 0 && (
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <h2 className="font-serif text-xl font-semibold">Top Universities</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {universities.map((uni: string, i: number) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-lg border border-border/40 bg-card/50 p-3 text-sm text-foreground"
                      >
                        <GraduationCap className="h-4 w-4 text-primary" />
                        {uni}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="sticky top-24 rounded-2xl border border-border/60 bg-card/50 p-5">
                <h3 className="mb-4 font-serif text-lg font-semibold">Program Highlights</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">PR Pathway</span>
                    {program.pathway_to_pr ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground/50" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Spousal Rights</span>
                    {program.spousal_rights ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground/50" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Work While Study</span>
                    {program.work_while_study ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground/50" />
                    )}
                  </div>
                  {program.post_study_work && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Post-Study Work</span>
                      <span className="font-medium text-foreground">{program.post_study_work}</span>
                    </div>
                  )}
                  {program.cost_local && program.cost_currency && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Local Fee</span>
                      <span className="font-medium text-foreground">
                        {program.cost_currency} {program.cost_local.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <Button asChild className="mt-6 w-full btn-glow rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href={`/contact?country=${slug}&program=${programSlug}`}>
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
