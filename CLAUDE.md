# CLAUDE.md

This file provides guidance for Claude Code when working on this project.

## Project Overview

Personal blog at **suburbandadmode.com** - a Next.js 16 + Sanity CMS site deployed on Vercel.

## Tech Stack

- **Next.js 16** with App Router and Turbopack
- **React 19** with TypeScript
- **Tailwind CSS v4** for styling
- **Sanity CMS** for content (headless)
- **Sentry** for error tracking
- **Upstash Redis** for rate limiting (API security)
- **Vitest** + React Testing Library for tests
- **focus-trap-react** for accessible mobile menu
- **Vercel** for deployment

## Commands

```bash
npm run dev        # Start dev server (Turbopack)
npm run build      # Production build
npm run lint       # ESLint on src/
npm run test       # Run tests once (CI)
npm run test:watch # Run tests in watch mode

# Sanity Studio (separate app)
cd sanity-studio && npm run dev  # localhost:3333
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── journal/      # Journal listing (ISR: 1hr)
│   ├── journal/[slug]/ # Individual posts (ISR: 1hr)
│   ├── api/revalidate/   # Sanity webhook → on-demand ISR
│   ├── global-error.tsx  # Sentry error boundary
│   └── ...
├── components/       # React components (organized by category)
│   ├── layout/       # Header, Footer, PageContainer
│   ├── ui/           # ArrowLink, ContentCard, ThemeToggle, Typewriter
│   ├── content/      # PortableText, PostCard, ProjectCard, AuthorAvatar
│   ├── seo/          # JsonLd
│   └── index.ts      # Root barrel export
├── hooks/            # Custom React hooks
│   ├── useMobileMenu.ts
│   └── useTheme.ts
├── lib/
│   ├── sanity.ts     # Sanity client & GROQ queries
│   ├── constants.ts  # Centralized site config, rate limits, origins
│   ├── env.ts        # Environment variable validation
│   ├── validation.ts # Input validation & sanitization (XSS prevention)
│   ├── api-security.ts # Rate limiting, origin validation, honeypot, IP extraction
│   ├── logging.ts    # Structured JSON logging
│   ├── navigation.ts # Navigation links
│   └── tech-icons.ts # Tech name → react-icons mapping for ProjectCard
├── types/
│   └── sanity.ts     # TypeScript types for Sanity data
└── __tests__/        # Vitest test files
    ├── setup.ts
    ├── validation.test.ts
    └── env.test.ts

sanity-studio/        # Separate Sanity Studio app
public/               # Static assets
sentry.*.config.ts    # Sentry configuration (client, server, edge)
vitest.config.ts      # Test configuration
```

## Key Files

- `src/lib/sanity.ts` - Sanity client, all GROQ queries
- `src/lib/constants.ts` - All site-wide constants and configuration
- `src/lib/env.ts` - Environment validation (runs at startup)
- `src/lib/validation.ts` - Shared validation/sanitization utilities
- `src/lib/api-security.ts` - Rate limiting, CSRF protection, bot detection
- `src/lib/tech-icons.ts` - Maps tech names to react-icons for ProjectCard
- `src/lib/github.ts` - GitHub API client for changelog (fetch, filter, clean, group commits)
- `src/app/api/revalidate/route.ts` - Sanity webhook handler for on-demand ISR
- `src/components/content/PortableText.tsx` - Sanity rich text renderer
- `src/components/layout/Header.tsx` - Header with focus-trap mobile menu
- `src/hooks/useMobileMenu.ts` - Mobile menu hook (escape, scroll lock, route-close)
- `src/hooks/useTheme.ts` - Theme toggle hook (light/dark/system, localStorage, OS sync via useSyncExternalStore)
- `src/app/layout.tsx` - Root layout with Header/Footer
- `src/components/layout/Footer.tsx` - Footer with page-specific SVG line art

## Component Imports

Components are organized by category. Always import from barrel exports:
```ts
import { Header, Footer, PageContainer } from '@/components/layout'
import { ArrowLink, ContentCard, ThemeToggle, Typewriter } from '@/components/ui'
import { PortableText, PostCard, ProjectCard } from '@/components/content'
import { JsonLd } from '@/components/seo'
```

## Custom Fonts

- **Cooper** - Main display/body font (`font-cooper`, `font-display`)
- **TT Disruptors** - Handwritten font for poems on Puttering page

Font files located in `public/fonts/`.

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=<project-id>
NEXT_PUBLIC_SANITY_DATASET=production
```

Optional (recommended for production):
```
NEXT_PUBLIC_SENTRY_DSN=<sentry-dsn>
SENTRY_DSN=<sentry-dsn>
SENTRY_ORG=<org-slug>
SENTRY_PROJECT=<project-slug>
UPSTASH_REDIS_REST_URL=<redis-url>
UPSTASH_REDIS_REST_TOKEN=<redis-token>
SANITY_REVALIDATION_SECRET=<webhook-secret>
SANITY_API_TOKEN=<sanity-api-token>
GITHUB_TOKEN=<fine-grained-pat>
```

## Conventions

- Use `NEXT_PUBLIC_` prefix for client-accessible env vars
- Sanity queries use parameterized GROQ (prevent injection)
- Sanity webhook triggers on-demand revalidation via `/api/revalidate`; ISR is the fallback
- Private journal entries filtered with `private != true`
- Import components from barrel exports, not direct file paths
- Custom hooks live in `src/hooks/` with `'use client'` directive
- All site constants belong in `src/lib/constants.ts`
- Screenshot/reference PNGs/JPGs in the project root are gitignored — delete them when no longer needed rather than letting them accumulate
- Escape HTML entities in JSX (`&quot;`, `&apos;`)

## Styling

- **Tailwind CSS v4** with semantic color tokens prefixed `sdm-` (defined in `globals.css` + `tailwind.config.ts`)
- Primary: `sdm-primary` (deep rose), Accent: `sdm-accent` (bright teal)
- Background: `sdm-background` (light lavender), Text: `sdm-text` (navy), Text-light: `sdm-text-light`
- Card: `sdm-card`, Border: `sdm-border`, Surface-subtle: `sdm-surface-subtle`, Border-input: `sdm-border-input`
- Primary-subtle: `sdm-primary-subtle` (icon backgrounds), Overlay: `sdm-overlay` (mobile menu)
- Dark mode uses class-based toggling (`:root.dark` in `globals.css`), controlled by `useTheme` hook (light/dark/system)
- `ThemeScript` component in `<head>` prevents FOUC by applying `.dark` class before first paint
- Fonts: **Cooper** (`font-cooper`, `font-display`) for headings/body, **TT Disruptors** (`font-disruptors`) for Puttering poetry
- Base font size is 22px (`text-base` = 1.375rem) — intentionally large
- Typography plugin used for rich text content

## Sanity CMS

### Schemas (in `sanity-studio/schemaTypes/`)

| Type | Description |
|------|-------------|
| `journalEntry` | Blog posts (primary content type) |
| `post` | Legacy posts (from WordPress migration) |
| `author` | Author profiles |
| `category` | Post categories |
| `blockContent` | Rich text config |
| `documentationSection` | Notes page content |
| `photoGallery` | La Familia photo gallery (singleton) |
| `putteringPoems` | Poetry collection (singleton) |
| `project` | Portfolio projects with tech stack, links, category (public/internal), visibility toggle |
| `link` | Curated external links (name, url, order) shown on Notes page |

### Content Flow
- Content managed in Sanity Studio → fetched via GROQ queries in `src/lib/sanity.ts`
- On-demand revalidation via Sanity webhook (`/api/revalidate`)
- ISR fallback: 1hr for content pages, 24hr for static pages
- `published == true` required for posts to appear (BLOG_QUERY filters by this)
- `private != true` for journal entries

## Security Notes

- Never hardcode credentials in source files
- Escape user/CMS content in `dangerouslySetInnerHTML`
- Use `escapeHtml()` from `lib/validation.ts` for user input
- Keep `.env*.local` files gitignored
- API routes should use `api-security.ts` for rate limiting and origin validation
- Sentry tracks errors in production (disabled in dev)
- CSP headers configured in `next.config.ts`

## Gotchas

- Project uses **Next.js 16**, **React 19**, **Sanity v5**, **Tailwind v4** — keep versions in sync, don't upgrade individually
- Use `npm run lint` not `next lint` (deprecated in Next.js 16)
- Always test build locally before pushing (`npm run build`)
- `sanity-studio/` is a separate app with its own `package.json` and `node_modules/`
- WordPress migration data in `migration/` is preserved for reference — don't delete
- `next.config.ts` has WordPress → new URL redirect rules — leave these intact
- Sanity project ID is `4qp7h589` (in `.env.local`)

## Deployment

### Vercel (Production)
- **Project**: `nextjs-blog` (suburbandadmode.com)
- **Auto-deploys** from `main` branch on push
- **Preview deployments** created for pull requests
- Environment variables must be configured in Vercel dashboard

```bash
# Manual deployment (if needed)
vercel --prod
```

### Sanity Studio
```bash
cd sanity-studio && npx sanity deploy
```

## Pre-Push Checklist

1. Run tests: `npm run test`
2. Run lint: `npm run lint`
3. Test build: `npm run build`
4. Check for console errors in dev: `npm run dev`
5. Verify environment variables are not hardcoded

## Common Issues

### Build Failures
- **Missing env vars**: Ensure `NEXT_PUBLIC_SANITY_*` vars are set in Vercel
- **Sanity query errors**: Check GROQ syntax in `src/lib/sanity.ts`
- **Type errors**: Run `npm run build` locally first to catch issues
- **Turbopack issues**: Try `next build` without `--turbopack` flag if dev works but build fails

### Content Not Updating
- Sanity webhook should trigger near-instant revalidation via `/api/revalidate`
- If webhook isn't working, ISR still revalidates every 1hr as a fallback
- Check `SANITY_REVALIDATION_SECRET` is set in Vercel and matches the Sanity webhook config
- For immediate manual updates, redeploy or use Vercel's "Redeploy" button

### Sanity Studio Issues
- Studio is a separate app in `sanity-studio/` directory
- Run `cd sanity-studio && npm install` if dependencies are missing
- Schema changes require Studio restart

## Auto-update README

When any of the following are meaningfully changed, update `README.md` to reflect the changes:

- `package.json` — update if dependencies, scripts, or tech stack versions change
- `src/app/` — update Project Structure if pages or API routes are added/removed
- `src/components/` — update if component categories or barrel exports change
- `src/hooks/` — update if custom hooks are added/removed
- `src/lib/` — update Key Files section if utility modules are added/removed
- `src/types/` — update if type definitions are restructured
- `sanity-studio/` — update if Sanity Studio config changes significantly
- Environment variables — update if required env vars are added/removed

Do not update the README for trivial changes (e.g. fixing a bug in an existing component, tweaking styles, updating content queries).

## Repository

- **GitHub**: https://github.com/therapy-rgb/nextjs-blog
- **Live site**: suburbandadmode.com
- **Branch strategy**: Direct commits to `main` for this project
