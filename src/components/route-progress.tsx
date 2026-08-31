import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

/** Thin top progress bar — never blanks the whole page. */
export function RouteProgress() {
  const location = useLocation()
  const [visible, setVisible] = useState(false)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    setVisible(true)
    setWidth(30)
    const t1 = window.setTimeout(() => setWidth(70), 80)
    const t2 = window.setTimeout(() => setWidth(100), 220)
    const t3 = window.setTimeout(() => {
      setVisible(false)
      setWidth(0)
    }, 420)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
    }
  }, [location.pathname])

  if (!visible) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 bg-transparent"
    >
      <div
        className="h-full bg-primary transition-[width] duration-200 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  )
}
