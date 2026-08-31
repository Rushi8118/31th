# Website Improvement Plan

## Phase 1: Flags Everywhere

### 1a. Create flag utility
- **File:** `src/lib/flags.ts` (NEW)
- **Content:** `COUNTRY_CODES` mapping (name→ISO2), `getFlagEmoji(code)`, `countryNameToFlag(name)`, `countryNameToCode(name)`

### 1b. Globe pin labels → flag + name
- **File:** `src/components/earth-globe.tsx`
- **Change:** Import `countryNameToFlag`, replace `{p.short ?? p.name}` with `{countryNameToFlag(p.name)} {p.short ?? p.name}` on pins (lines 416, 428)
- **Result:** Globe pins show flag emoji + "UK" / "NZ" / "USA" instead of just text

### 1c. Study Visa destination pills → add flags
- **File:** `src/components/study-visa-section.tsx`
- **Change:** Import `countryNameToFlag`, add flag emoji before each destination name in pills (line 64)

### 1d. Contact section phone selector → add flags
- **File:** `src/components/contact-section.tsx`
- **Change:** Already has `getFlag()` function — update to use the shared utility for consistency

---

## Phase 2: 3D Globe Quality Upgrade

### 2a. Texture upgrade (interactive-globe.tsx)
- **File:** `src/components/interactive-globe.tsx`
- **Changes:**
  - Increase segments: 48→64 (desktop), 32→48 (mobile)
  - Add high-res CDN texture: `https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg`
  - Add separate bump map: `https://unpkg.com/three-globe/example/img/earth-topology.png` with `bumpScale: 0.05`
  - Add cloud layer: separate `SphereGeometry(1.02, segments, segments)` with `MeshPhongMaterial` using cloud texture, transparent, rotating 20% slower than globe
  - Improve atmosphere: two-layer glow (inner `opacity: 0.15`, outer `opacity: 0.05`)
  - Better lighting: warm directional (0xfbbf24, 1.8), cool fill (0x6366f1, 0.6), rim light from behind
  - Star field: increase to 3000 stars with size variation

### 2b. Cloud texture
- **File:** `public/` — download cloud texture or use CDN:
  `https://unpkg.com/three-globe/example/img/earth-water.png` (can double as cloud map)

---

## Phase 3: UI/UX Polish

### 3a. Page transitions
- **File:** `src/App.tsx`
- **Change:** Wrap `<Routes>` with `<AnimatePresence>` and add `<motion.div>` to each route for fade transitions

### 3b. Hero section improvements
- **File:** `src/components/hero.tsx`
- **Changes:**
  - Add staggered entrance for stats numbers (animated counter)
  - Improve CTA button hover effects
  - Add gradient border animation to stat cards

### 3c. Loading states
- **File:** `src/pages/CountriesPage.tsx`
- **Change:** Replace spinner with skeleton cards (grid of pulsing rectangles)
- **File:** `src/pages/CountryPage.tsx`
- **Change:** Add skeleton layout matching the actual page structure

### 3d. Micro-interactions
- **File:** `src/components/work-visa-section.tsx`
- **Change:** Add hover scale effect on country cards, smoother transitions
- **File:** `src/index.css`
- **Change:** Add `scroll-behavior: smooth` on html, improve button hover states

### 3e. Navigation polish
- **File:** `src/components/site-header.tsx`
- **Change:** Add scroll progress indicator bar at top when page is scrolled

---

## Files Modified (total: ~12 files)

| File | Phase | Change |
|------|-------|--------|
| `src/lib/flags.ts` | 1a | NEW — flag utility |
| `src/components/earth-globe.tsx` | 1b | Flag emoji on pins |
| `src/components/study-visa-section.tsx` | 1c | Flags on destination pills |
| `src/components/contact-section.tsx` | 1d | Consistent flag utility |
| `src/components/interactive-globe.tsx` | 2a | Globe quality upgrade |
| `src/App.tsx` | 3a | Page transitions |
| `src/components/hero.tsx` | 3b | Hero improvements |
| `src/pages/CountriesPage.tsx` | 3c | Skeleton loading |
| `src/pages/CountryPage.tsx` | 3c | Skeleton loading |
| `src/components/work-visa-section.tsx` | 3d | Micro-interactions |
| `src/index.css` | 3d | Smooth scroll + polish |
| `src/components/site-header.tsx` | 3e | Progress indicator |
