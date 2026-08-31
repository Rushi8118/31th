# 🎨 Premium Design System
**Siddhivinayak Overseas - World-Class UI/UX**

---

## 🌈 Color Philosophy

Inspired by: **Apple, Stripe, Linear, Vercel, Notion**

### Light Mode
- **Background**: Warm Ivory `oklch(0.97 0.01 95)` - Soft, premium feel
- **Primary**: Rich Gold `oklch(0.7 0.16 84)` - Trust, prestige, warmth
- **Foreground**: Deep Navy `oklch(0.25 0.05 258)` - Professional, readable
- **Accent**: Amber highlights for CTAs

### Dark Mode  
- **Background**: Deep Space `oklch(0.18 0.035 255)` - Elegant, modern
- **Primary**: Bright Gold `oklch(0.78 0.155 75)` - High contrast
- **Foreground**: Soft White `oklch(0.96 0.012 85)` - Easy on eyes

---

## ✍️ Typography Scale

```css
/* Headings - Serif for elegance */
H1: 48-72px | font-serif | font-bold | tracking-tight | leading-[1.1]
H2: 36-48px | font-serif | font-semibold | tracking-tight | leading-[1.2]
H3: 24-32px | font-serif | font-semibold | leading-[1.3]
H4: 20-24px | font-sans | font-semibold | leading-[1.4]

/* Body - Sans for readability */
Large: 18-20px | font-sans | font-normal | leading-relaxed
Base: 15-16px | font-sans | font-normal | leading-[1.7]
Small: 13-14px | font-sans | font-normal | leading-[1.6]
Tiny: 11-12px | font-sans | font-medium | tracking-wide | uppercase
```

---

## 📏 Spacing System

```css
/* Consistent 4px base unit */
--space-1: 0.25rem  /* 4px */
--space-2: 0.5rem   /* 8px */
--space-3: 0.75rem  /* 12px */
--space-4: 1rem     /* 16px */
--space-5: 1.25rem  /* 20px */
--space-6: 1.5rem   /* 24px */
--space-8: 2rem     /* 32px */
--space-10: 2.5rem  /* 40px */
--space-12: 3rem    /* 48px */
--space-16: 4rem    /* 64px */
--space-20: 5rem    /* 80px */
--space-24: 6rem    /* 96px */
```

---

## 🔘 Button States

### Primary Button
```
Default: Gradient gold, subtle shadow
Hover: Lift -2px, glow shadow, shimmer effect
Active: Scale 0.98, press down
Focus: Ring 2px primary/40, offset 2px
Disabled: 50% opacity, no pointer events
Loading: Spinning ring + "Loading..." text
```

### Secondary/Outline
```
Default: Border 2px, transparent bg
Hover: Border primary, bg primary/5, lift
Active: Scale 0.98
```

---

## 🎴 Card Variants

### Lift Card
```css
Default: Subtle border, light shadow
Hover: 
  - translateY(-6px)
  - Shadow: 0 12px 32px -8px primary/15
  - Border: primary/40
  - Glow outline
Transition: 400ms cubic-bezier(0.2, 0.8, 0.2, 1)
```

### Glass Card
```css
Background: rgba(255,255,255,0.6)
Backdrop-filter: blur(20px)
Border: 1px primary/15
Border-top: 3px primary/60
```

---

## 🎭 Animation Tokens

```css
--transition-fast: 150ms
--transition-base: 300ms
--transition-slow: 450ms

--ease-spring: cubic-bezier(0.2, 0.8, 0.2, 1)
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)
--ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1)
```

---

## ⚡ Micro Interactions

### Button Arrow
```
Default: static
Hover: translateX(4px) 200ms
```

### Nav Link Underline
```
Default: width 0%
Hover/Active: width 100% from center
Transition: 300ms ease
```

### Card Image Zoom
```
Parent: overflow hidden
Image: transition transform 600ms
Hover: scale(1.08)
```

---

## 🎨 Hover Effects Checklist

✅ All buttons: Lift + glow
✅ All cards: Lift + border glow
✅ Nav links: Underline animation
✅ Images: Zoom on hover
✅ Icons: Scale 1.1 + rotate
✅ Social links: Color shift
✅ CTAs: Shimmer pass
✅ Form inputs: Focus ring glow

---

## ♿ Accessibility Standards

```
✅ WCAG 2.1 AA Compliant
✅ Color contrast ratio > 4.5:1
✅ Focus visible on all interactive elements
✅ Keyboard navigation support
✅ Screen reader optimized (ARIA labels)
✅ Touch targets minimum 44x44px
✅ Reduced motion support
✅ Skip to content link
```

---

## 📱 Responsive Breakpoints

```css
Mobile: 320px - 639px
Tablet: 640px - 1023px
Desktop: 1024px - 1439px
Large: 1440px - 1919px
XL: 1920px+
```

---

## 🎯 Design Principles

1. **Simplicity Over Complexity**
   - Clean layouts, generous whitespace
   - One primary action per section

2. **Consistency**
   - Unified spacing, colors, typography
   - Predictable interactions

3. **Performance**
   - 60 FPS animations
   - Optimized images (WebP)
   - Lazy loading

4. **Trust & Luxury**
   - Premium gold accents
   - Subtle animations
   - Professional imagery

5. **Accessibility First**
   - Keyboard navigation
   - Screen reader support
   - High contrast

---

**Created:** July 4, 2026  
**Version:** 2.0 Premium
