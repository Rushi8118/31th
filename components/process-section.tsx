"use client"

import { motion } from "framer-motion"

const STEPS = [
  {
    n: "01",
    title: "Free Consultation",
    desc: "Share your profile. Get an honest, transparent assessment of the best country and visa category for you.",
  },
  {
    n: "02",
    title: "Profile Building",
    desc: "Skills assessment, language coaching (IELTS / JLPT / German), and credential evaluation.",
  },
  {
    n: "03",
    title: "Documentation",
    desc: "End-to-end paperwork — applications, SOPs, employer letters, and embassy forms drafted by experts.",
  },
  {
    n: "04",
    title: "Visa Filing",
    desc: "We file your visa application, track it daily, and prepare you for any interview.",
  },
  {
    n: "05",
    title: "Pre-departure",
    desc: "Forex, flight, accommodation, and on-arrival support so you land confident.",
  },
]

export function ProcessSection() {
  return (
    <section id="process" className="relative scroll-mt-24 py-20 md:py-28">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 grid-backdrop opacity-20"
      />
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-semibold leading-tight text-balance text-foreground md:text-5xl">
            A clear, calm process{" "}
            <span className="text-primary">from day one</span>
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Five carefully-designed stages, one dedicated case officer, zero surprises.
          </p>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
            Typical processing: UK work visa cases take about 8 weeks; Europe, Australia, New Zealand
            and other Tier 1 routes usually take 5–6 months after the file is ready. Employer response,
            appointments, document gaps and government decisions can change the timeline.
          </p>
        </div>

        <div className="relative mt-14">
          {/* Connecting line - desktop */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent lg:block"
          />

          <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((step, idx) => (
              <motion.li
                key={step.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                className="group relative rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1.5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/90 group-hover:shadow-xl group-hover:shadow-primary/40">
                  {step.n}
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
                  {step.desc}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
