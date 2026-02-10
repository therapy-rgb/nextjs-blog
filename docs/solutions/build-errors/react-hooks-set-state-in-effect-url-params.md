---
title: "ESLint react-hooks/set-state-in-effect Error in PutteringContent Dropdown"
date: 2026-02-10
category: build-errors
tags:
  - react-hooks
  - useEffect
  - state-initialization
  - eslint
  - useSearchParams
severity: low
component: src/app/puttering/PutteringContent.tsx
symptoms:
  - "ESLint error: react-hooks/set-state-in-effect rule violation"
  - "Build failure during lint step — setState called synchronously inside useEffect"
root_cause: "Used useEffect to set dropdown open state from URL params when the value was already available during render"
resolution: "Derived initial state directly via useState(!!selectedSlug) instead of useState(false) + useEffect"
time_to_fix: "5 minutes"
---

# ESLint react-hooks/set-state-in-effect: Deriving State from URL Params

## Problem Symptom

During the `/ship` build process, ESLint flagged `setOpen(true)` inside a `useEffect` in `PutteringContent.tsx`:

```
error  react-hooks/set-state-in-effect — setState called synchronously in useEffect body
```

The build/lint step failed, blocking deployment.

## Root Cause

A `useEffect` was used to synchronize dropdown open state with URL search params — but `selectedSlug` was already available during render via `useSearchParams()`. The effect caused an unnecessary extra render cycle and violated the ESLint rule.

```tsx
// Anti-pattern: setState in useEffect for a value available at render time
const [open, setOpen] = useState(false)

useEffect(() => {
  if (selectedSlug) setOpen(true)
}, [selectedSlug])
```

### Why this is wrong

1. **Extra render cycle** — First render: `open = false`. Effect runs. Second render: `open = true`. The correct state was knowable from the start.
2. **Violates effect semantics** — `useEffect` is for side effects (DOM, subscriptions, fetching), not for synchronizing already-available values.
3. **UI flash** — Between the two renders, the dropdown briefly renders in the wrong state.

## Solution

Removed the `useEffect` entirely. Derived initial state directly from the URL param:

### Before

```tsx
import { useState, useEffect, Suspense } from 'react'

const [open, setOpen] = useState(false)

useEffect(() => {
  if (selectedSlug) setOpen(true)
}, [selectedSlug])

const handleSelect = (slug: string) => {
  router.push(`/puttering?poem=${slug}`, { scroll: false })
}
```

### After

```tsx
import { useState, Suspense } from 'react'

const [open, setOpen] = useState(!!selectedSlug)

const handleSelect = (slug: string) => {
  setOpen(true)
  router.push(`/puttering?poem=${slug}`, { scroll: false })
}
```

### Key changes

1. `useState(!!selectedSlug)` — converts URL param to boolean at initialization
2. `setOpen(true)` moved to `handleSelect` — keeps dropdown open when user clicks a poem
3. `useEffect` removed from imports

## Related Codebase Patterns

- **`src/hooks/useMobileMenu.ts`** — Uses React 19 pattern of setting state during render (not useEffect) to respond to route changes
- **`src/app/documentation/DocumentationContent.tsx`** — Same pattern: derives state from `useSearchParams()` at render time
- **`src/components/ui/Typewriter.tsx`** — Example of correct useEffect usage (timer-based animation, an actual side effect)

## Prevention: Decision Checklist

Before writing `useEffect` + `setState`, ask:

1. **Is the value available during render?** (props, useSearchParams, synchronous hooks)
   - YES: Initialize state directly. Do NOT use useEffect.
2. **Am I transforming a prop into state?**
   - YES: Use a plain variable or `useMemo`, not useState + useEffect.
3. **Do I need to fetch, subscribe, or wait for the value?**
   - YES: useEffect is appropriate.
4. **Am I interacting with the DOM or external system?**
   - YES: useEffect is appropriate.

**Rule of thumb:** If the value is available now, derive it now.

## When useEffect IS Appropriate

- Data fetching / async operations
- Event listeners and subscriptions
- DOM manipulations (focus, scroll, measurements)
- Synchronizing with external systems (localStorage, analytics)
- Timer-based operations

## References

- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) — React docs
- [eslint-plugin-react-hooks](https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks)
- [Next.js useSearchParams](https://nextjs.org/docs/app/api-reference/functions/use-search-params)
