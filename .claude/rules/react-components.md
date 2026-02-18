# React Component Rules

## TypeScript
- Always use TypeScript with explicit prop types
- Avoid `any` type — use proper typing

## JSX
- Escape HTML entities in JSX (`&quot;`, `&apos;`)
- Use `'use client'` directive for interactive components (forms, menus, anything with hooks or event handlers)
- Server components are the default for data-fetching/display components

## Styling
- Use Tailwind with semantic `sdm-*` color tokens (see `globals.css` + `tailwind.config.ts`)
- Primary: `sdm-primary`, Accent: `sdm-accent`, Text: `sdm-text`, Background: `sdm-background`
- Borders: `sdm-border`, Form inputs: `sdm-border-input`, Subtle surfaces: `sdm-surface-subtle`
- Icon backgrounds: `sdm-primary-subtle`, Overlays: `sdm-overlay`
- Cooper font for display/headings, system sans-serif for body
- Minimum 44x44px touch targets on interactive elements

## Imports
- Import from barrel exports, not direct file paths:
  ```ts
  import { Header, Footer } from '@/components/layout'
  import { ArrowLink } from '@/components/ui'
  ```

## Accessibility
- Include ARIA attributes (aria-label, aria-current, aria-controls)
- Support prefers-reduced-motion
- WCAG AA color contrast compliance
