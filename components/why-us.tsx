"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { CheckCircle2, Users, Headphones, FileCheck2, Globe } from "lucide-react"

const POINTS = [
  {
    icon: Users,
    title: "Dedicated case officer",
    desc: "One expert from start to landing — never a call center.",
  },
  {
    icon: FileCheck2,
    title: "Transparent pricing",
    desc: "No hidden fees. Detailed quote before you sign anything.",
  },
  {
    icon: Globe,
    title: "Global employer network",
    desc: "Direct partnerships with vetted employers across 8 countries.",
  },
  {
    icon: Headphones,
    title: "Post-landing support",
    desc: "Settlement help, banking, SIM, accommodation — even after you land.",
  },
]

export function WhyUs() {
  return (
    <section id="why-us" className="relative scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/40 shadow-2xl"
            >
              <Image
                src="/consultant-office.jpg"
                alt="Siddhivinayak Overseas consultant guiding a client through visa documentation"
                width={900}
                height={700}
                className="h-auto w-full object-cover"
                priority
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-tr from-background/60 via-transparent to-primary/10"
              />

              {/* Floating stat card */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3 rounded-2xl border border-primary/30 bg-background/85 p-4 backdrop-blur-md md:left-auto md:right-5 md:max-w-[260px]">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/20">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-serif text-2xl font-semibold leading-none text-foreground">
                    98%
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Visa approval success rate
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-6">
            <h2 className="font-serif text-3xl font-semibold leading-tight text-balance text-foreground md:text-5xl">
              Why thousands choose{" "}
              <span className="text-primary">Siddhivinayak Overseas</span>
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              We&apos;ve helped over 5,000 candidates relocate, study, and build careers abroad.
              Our promise is simple: clear advice, ethical practice, and relentless follow-through.
            </p>

            <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {POINTS.map((p, idx) => (
                <motion.li
                  key={p.title}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: idx * 0.07 }}
                  className="lift-card flex gap-3 rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
                    <p.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{p.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {p.desc}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
