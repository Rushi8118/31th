---
name: Mobile menu & globe rules
description: Two hard-won layout rules for the site header and hero globe that cause visual bugs if ignored.
---

## Mobile menu background
**Rule:** The mobile nav overlay must use `style={{ backgroundColor: '#f5f0e8' }}` — a hard-coded hex, not `bg-background/95` or any Tailwind opacity modifier.

**Why:** `bg-background/95` resolves to `oklch(0.97 0.01 95 / 0.95)` which is visually transparent in the browser even at 95% — the cream color is so light that the hero content bleeds through. The overlay must be fully opaque.

**How to apply:** In `site-header.tsx`, the AnimatePresence mobile menu div uses `style={{ zIndex: 60, backgroundColor: '#f5f0e8' }}`. Never replace with a Tailwind bg class.

## Globe container overflow
**Rule:** The `<div>` wrapping `<InteractiveGlobe>` in `hero.tsx` must NOT have `overflow-hidden`.

**Why:** Three.js renders a WebGL canvas that fills the container via ResizeObserver. `overflow-hidden` clips the canvas at the container boundary, cutting off the top/sides of the globe. The `rounded-2xl` border radius still applies visually without overflow-hidden because nothing actually overflows.

**How to apply:** Globe container div uses `className="relative w-full rounded-2xl"` — no overflow-hidden.
