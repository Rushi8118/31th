"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { GraduationCap, BookOpen, Award, Globe } from "lucide-react"

const STUDY_FEATURES = [
  {
    icon: GraduationCap,
    title: "University Shortlisting",
    desc: "Personalised university and course matching based on your profile, budget, and career goals.",
  },
  {
    icon: BookOpen,
    title: "SOP & Application",
    desc: "Statement of Purpose, LORs, and university applications drafted by experts.",
  },
  {
    icon: Award,
    title: "Scholarship Guidance",
    desc: "Identify and apply for merit-based scholarships and tuition waivers.",
  },
  {
    icon: Globe,
    title: "Pre-departure Support",
    desc: "Forex, accommodation, travel, and orientation — handled end-to-end.",
  },
]

const STUDY_DESTINATIONS = [
  "United Kingdom",
  "Germany",
  "Canada",
  "Australia",
  "New Zealand",
  "France",
  "USA",
  "Ireland",
]

export function StudyVisaSection() {
  return (
    <section id="study-visa" className="relative scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
              <GraduationCap className="h-3.5 w-3.5" />
              Study Abroad
            </div>
            <h2 className="mt-5 font-serif text-3xl font-semibold leading-tight text-balance text-foreground md:text-5xl">
              Study where the{" "}
              <span className="text-primary">world&apos;s best</span> teach
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              Bachelors, Masters, PhD, and diploma programs at top-ranked universities across
              eight study destinations. We guide you from shortlisting to landing on campus.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {STUDY_DESTINATIONS.map((d) => (
                <span
                  key={d}
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/50 px-4 py-2 text-xs font-medium text-foreground/85 transition hover:border-primary/60 hover:bg-primary/10 hover:text-primary"
                >
                  {d}
                </span>
              ))}
            </div>

            <Link
              href="/contact"
              className="btn-glow mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Plan my study abroad
            </Link>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {STUDY_FEATURES.map((feature, idx) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.07 }}
                  className="lift-card relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
