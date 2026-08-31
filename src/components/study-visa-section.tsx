import { Link } from 'react-router-dom'
import { FlagIcon } from '@/components/flag-icon'
import { GraduationCap, BookOpen, Award, Globe } from 'lucide-react'

const STUDY_FEATURES = [
  {
    icon: GraduationCap,
    title: 'University Shortlisting',
    desc: 'Personalised university and course matching based on your profile, budget, and career goals.',
  },
  {
    icon: BookOpen,
    title: 'SOP & Application',
    desc: 'Statement of Purpose, LORs, and university applications drafted by experts.',
  },
  {
    icon: Award,
    title: 'Scholarship Guidance',
    desc: 'Identify and apply for merit-based scholarships and tuition waivers.',
  },
  {
    icon: Globe,
    title: 'Pre-departure Support',
    desc: 'Forex, accommodation, travel, and orientation — handled end-to-end.',
  },
]

const STUDY_DESTINATIONS = [
  { name: 'United Kingdom', to: '/study-in-uk' },
  { name: 'France', to: '/study-in-france' },
  { name: 'Germany', to: '/study-in-germany' },
  { name: 'Spain', to: '/study-in-spain' },
  { name: 'Dubai', to: '/study-in-dubai' },
  { name: 'Singapore', to: '/study-in-singapore' },
]

export function StudyVisaSection() {
  return (
    <section id="study-visa" className="relative scroll-mt-24 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
              <GraduationCap className="h-3.5 w-3.5" />
              Study Abroad
            </div>
            <h2 className="mt-5 font-serif text-3xl font-semibold leading-tight text-balance text-foreground md:text-4xl">
              Study where the <span className="text-primary">world&apos;s best</span> teach
            </h2>
            <p className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground">
              Primary study destinations: UK, France, Germany, Spain, Dubai and Singapore.
              We guide you from university shortlisting to student-visa documentation.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {STUDY_DESTINATIONS.map((d) => (
                <Link
                  key={d.to}
                  to={d.to}
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/50 px-4 py-2 text-xs font-medium text-foreground/85 transition hover:border-primary/60 hover:bg-primary/10 hover:text-primary"
                >
                  <FlagIcon country={d.name} className="text-sm" /> {d.name}
                </Link>
              ))}
            </div>

            <Link
              to="/study-visa"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Plan my study abroad
            </Link>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {STUDY_FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="lift-card rounded-2xl border border-border/60 bg-card/60 p-5"
                >
                  <div className="card-icon flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-3 font-serif text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
