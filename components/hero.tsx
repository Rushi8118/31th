// @ts-nocheck
"use client"

import { Suspense } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const InteractiveGlobe = dynamic(() => import("@/components/interactive-globe"), {
  ssr: false,
  loading: () => <GlobeFallback />,
})

function GlobeFallback() {
  return (
    <div className="flex h-[400px] w-full items-center justify-center md:h-[500px]">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
            Trusted by 500+ work visa clients
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-background pt-28 pb-8 text-foreground md:pt-36 md:pb-12"
    >
      {/* Soft premium wash */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(58% 44% at 50% 0%, oklch(0.7 0.16 84 / 0.16) 0%, transparent 72%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.25 0.05 258 / 0.04) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.25 0.05 258 / 0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 md:px-6 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Trusted by 500+ work visa clients
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-5 font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-balance text-foreground md:text-6xl lg:text-[4rem]"
          >
            Your gateway to a{" "}
            <span className="relative whitespace-nowrap text-primary glow-text">
              global career
              <svg
                aria-hidden="true"
                viewBox="0 0 200 8"
                className="absolute -bottom-1 left-0 h-2 w-full text-primary/60"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 4 Q 50 0 100 4 T 200 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Siddhivinayak Overseas is your specialist partner for{" "}
            <span className="font-semibold text-foreground">Work Visas</span> and{" "}
            Australia, Canada, the UK, Germany, New Zealand, Russia, USA, and UAE. End-to-end
            documentation, employer connects, and a dedicated case officer.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button
              asChild
              size="lg"
              className="btn-glow rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/contact" className="group">
                Start Your Visa Journey
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-border/70 bg-transparent text-foreground hover:border-primary/60 hover:bg-primary/10 hover:text-primary"
            >
              <Link href="/countries">Explore Countries</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Global visa consultancy
            </div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-semibold text-foreground">98%</span>
              <span className="text-muted-foreground">visa success rate</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-semibold text-foreground">38+</span>
              <span className="text-muted-foreground">work permit countries</span>
            </div>
          </motion.div>
        </div>

        {/* 3D Globe Section */}
        <div className="lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative mx-auto"
          >
            <Suspense fallback={<GlobeFallback />}>
              <div className="relative h-[400px] w-full md:h-[500px]">
                <InteractiveGlobe className="h-full w-full" showMarkers={false} showInstructions={false} />

                <div className="pointer-events-none absolute bottom-6 right-4 rounded-2xl border border-white/15 bg-black/45 p-5 text-white shadow-2xl backdrop-blur-xl">
                  <p className="text-xs text-white/75">Typical work visa timeline</p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight">UK: 8 weeks</p>
                  <p className="mt-1 text-xs text-emerald-200">Other Tier 1 routes: 5–6 months</p>
                </div>
              </div>
            </Suspense>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-4 px-4 md:grid-cols-3 md:px-6">
        {[
          { title: "Healthcare Jobs", text: "Ireland, UK, Germany pathways with complete documentation support." },
          { title: "Work Permit Worldwide", text: "Continent-wise opportunities with role-based country matching." },
          { title: "Study Abroad", text: "Top university admissions with visa filing and interview preparation." },
        ].map((item) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45 }}
            className="lift-card rounded-2xl border border-border/60 bg-card/80 p-5"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-primary">{item.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
