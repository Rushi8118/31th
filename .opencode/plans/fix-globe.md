# Globe Fix Plan

## Problem
When writing `src/components/interactive-globe.tsx` via PowerShell, template literals with backticks (`` `relative ${className}` ``) got mangled. The `className` prop on the fallback and return divs became `{elative }` instead of `` `relative ${className}` ``. This causes `elative is not defined` at runtime → GlobeErrorBoundary catches it → shows "3D Globe unavailable".

## Fix
Rewrite `src/components/interactive-globe.tsx` with proper template literals. Two lines need fixing:
- Line ~445: `<div className={elative }` → `<div className={\`relative \${className}\`}`
- Line ~453: `<div className={elative }` → `<div className={\`relative \${className}\`}`

Also fix the pending `starField` reference in cleanup (line 157 declares `let starField: Points | null = null` but it's never assigned, while cleanup tries to dispose `starField!.geometry`). The fix: remove the `starField` declaration entirely since `nearStars`/`farStars` are disposed directly.

## Files to modify
- `src/components/interactive-globe.tsx` — fix 2 template literal lines + cleanup

## Verification
- `npm run build` should succeed
- `npm run dev` should show the globe rendering correctly
