"use client"

import { motion } from "framer-motion"
import { Quote, Star, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { customerReviews, getReviewInitials } from "@/lib/reviews-data"

export function Testimonials() {
  // Take first 6 reviews for the home page
  const homeReviews = customerReviews.slice(0, 6)

  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-semibold leading-tight text-balance text-foreground md:text-5xl">
            Real journeys.{" "}
            <span className="text-primary">Real outcomes.</span>
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Hear from our successful candidates who now live and work abroad with us.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {homeReviews.map((t, idx) => (
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="lift-card relative flex flex-col rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm"
            >
              <Quote
                aria-hidden="true"
                className="absolute right-5 top-5 h-8 w-8 text-primary/20"
              />
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                  {getReviewInitials(t.name)}
                </div>
                <div>
                  <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < t.rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <blockquote className="grow text-pretty text-sm leading-relaxed text-foreground/90 italic">
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <figcaption className="mt-6 border-t border-border/60 pt-4">
                <p className="font-semibold text-foreground">{t.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t.visa} · {t.country}
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full border-primary/20 hover:bg-primary/5"
          >
            <Link href="/reviews" className="group">
              View all 40+ reviews
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
