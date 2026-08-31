import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Clock, Users, ArrowRight, ChevronRight, ChevronLeft, Sparkles, MapPin } from 'lucide-react'
import { useUrgentRequirements, getRemainingDays } from '@/hooks/useUrgentRequirements'
import { FlagIcon } from '@/components/flag-icon'
import { Button } from '@/components/ui/button'

function getFlagEmoji(countryCode: string): string {
  try {
    return countryCode
      .toUpperCase()
      .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
  } catch {
    return '🌍'
  }
}

export function UrgentRequirementBanner() {
  const { requirements, isLoading } = useUrgentRequirements()
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto rotate if multiple active requirements
  useEffect(() => {
    if (requirements.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % requirements.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [requirements.length])

  if (isLoading || requirements.length === 0) return null

  const current = requirements[currentIndex] || requirements[0]
  const remainingDays = getRemainingDays(current.expires_at)

  return (
    <section className="relative z-20 py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-card/90 to-background/90 p-4 sm:p-5 shadow-[0_0_30px_rgba(201,162,39,0.15)] backdrop-blur-xl transition-all">
        {/* Animated background ambient glow */}
        <div className="absolute -top-12 -left-12 h-40 w-40 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-red-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Left badge & details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {/* Urgency Badge */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider animate-pulse">
                <Flame className="h-3.5 w-3.5 text-red-500 fill-red-500" />
                Urgent Opening
              </span>

              {/* Country Badge */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/80 border border-border/70 text-xs font-medium text-foreground">
                <FlagIcon country={current.country} code={current.country_code} className="text-base rounded-xs border border-border/40" />
                {current.country}
              </span>

              {/* Vacancies */}
              {current.vacancies > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
                  <Users className="h-3 w-3" />
                  {current.vacancies} Vacancies
                </span>
              )}

              {/* Remaining Days Countdown */}
              {remainingDays !== null && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400">
                  <Clock className="h-3 w-3" />
                  {remainingDays > 0 ? `${remainingDays} days remaining` : 'Closing today!'}
                </span>
              )}
            </div>

            {/* Title */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
              >
                <Link
                  to={`/urgent-requirements/${current.slug}`}
                  className="group block"
                >
                  <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {current.title}
                  </h3>
                  {current.summary && (
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground line-clamp-1">
                      {current.summary}
                    </p>
                  )}
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-border/50 pt-3 sm:pt-0">
            {/* Pagination if multiple */}
            {requirements.length > 1 && (
              <div className="flex items-center gap-1.5 mr-2">
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => (prev - 1 + requirements.length) % requirements.length)}
                  className="h-7 w-7 rounded-full bg-muted/30 hover:bg-muted/70 flex items-center justify-center text-muted-foreground hover:text-foreground transition"
                  aria-label="Previous requirement"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {currentIndex + 1}/{requirements.length}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => (prev + 1) % requirements.length)}
                  className="h-7 w-7 rounded-full bg-muted/30 hover:bg-muted/70 flex items-center justify-center text-muted-foreground hover:text-foreground transition"
                  aria-label="Next requirement"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

            <Button
              asChild
              size="sm"
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 shadow-lg shadow-primary/20 btn-glow"
            >
              <Link to={`/urgent-requirements/${current.slug}`}>
                View Details & Apply
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
export default UrgentRequirementBanner
