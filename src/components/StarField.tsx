import { memo, useMemo, useEffect, useRef, useState, useCallback } from "react"

interface Star {
  id: number
  x: number
  y: number
  size: "tiny" | "small" | "medium" | "large"
  color: string
  duration: number
  delay: number
  isFeature: boolean
  hasGlow: boolean
  featureSize?: number
}

const COLORS = ["#E8B84B", "#F5D78E", "#FFFFFF", "#FFF8E7"]
const FEATURE_COLORS = ["#E8B84B", "#F5D78E"]
const SIZES = ["tiny", "small", "medium", "large"] as const

function generateStars(count: number): Star[] {
  const stars: Star[] = []
  const featureCount = 4 + Math.floor(Math.random() * 3) // 4-6 feature stars

  for (let i = 0; i < count; i++) {
    const isFeature = i < featureCount
    stars.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: isFeature ? "large" : SIZES[Math.floor(Math.random() * SIZES.length)],
      color: isFeature
        ? FEATURE_COLORS[Math.floor(Math.random() * FEATURE_COLORS.length)]
        : COLORS[Math.floor(Math.random() * COLORS.length)],
      duration: 1.5 + Math.random() * 2.5, // 1.5s to 4s
      delay: Math.random() * 3, // 0 to 3s
      isFeature,
      hasGlow: isFeature || Math.random() > 0.7,
      featureSize: isFeature ? 5 + Math.floor(Math.random() * 4) : undefined, // 5-8px
    })
  }
  return stars
}

function StarField({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)
  const targetRef = useRef({ x: 0, y: 0 })

  // Check for reduced motion preference
  const prefersReduced = useMemo(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }, [])

  // Determine star count based on screen width
  const starCount = useMemo(() => {
    if (typeof window === "undefined") return 80
    return window.innerWidth < 768 ? 45 : 100
  }, [])

  const stars = useMemo(() => generateStars(starCount), [starCount])

  // Mouse parallax effect (5-10px range)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (prefersReduced || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    targetRef.current = {
      x: ((e.clientX - cx) / rect.width) * 10,
      y: ((e.clientY - cy) / rect.height) * 8,
    }
  }, [prefersReduced])

  useEffect(() => {
    if (prefersReduced) return

    const smoothMove = () => {
      setMouseOffset((prev) => ({
        x: prev.x + (targetRef.current.x - prev.x) * 0.05,
        y: prev.y + (targetRef.current.y - prev.y) * 0.05,
      }))
      rafRef.current = requestAnimationFrame(smoothMove)
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    rafRef.current = requestAnimationFrame(smoothMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [prefersReduced, handleMouseMove])

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
      style={{
        transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
        willChange: "transform",
      }}
    >
      {stars.map((star) => (
        <span
          key={star.id}
          className={`hero-star ${
            star.isFeature
              ? "hero-star--feature"
              : `hero-star--${star.size}`
          } ${star.isFeature ? "hero-star--feature" : star.hasGlow ? "hero-star--glow" : "hero-star--normal"}`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            backgroundColor: star.color,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            ...(star.isFeature && star.featureSize
              ? { "--star-size": `${star.featureSize}px` } as React.CSSProperties
              : {}),
          }}
        />
      ))}
    </div>
  )
}

export default memo(StarField)
