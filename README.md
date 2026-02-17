# Suburban Dad Mode

A personal blog about family, finances, music, and suburban life.

**Live site**: [suburbandadmode.com](https://suburbandadmode.com)
**Repository**: [therapy-rgb/nextjs-blog](https://github.com/therapy-rgb/nextjs-blog)

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript, React 19 |
| Styling | Tailwind CSS v4 + `@tailwindcss/typography` |
| CMS | Sanity (headless, GROQ queries) |
| Error tracking | Sentry |
| Rate limiting | Upstash Redis |
| Testing | Vitest + React Testing Library |
| Deployment | Vercel (auto-deploy from `main`) |

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage -- hero image with tagline |
| `/journal` | Blog listing, sourced from Sanity (ISR: 1 hr) |
| `/posts/[slug]` | Individual blog posts (ISR: 1 hr) |
| `/la-familia` | Family photo gallery (vertical scroll) |
| `/puttering` | Poetry viewer from Sanity CMS (ISR: 1 hr) |
| `/about` | About page |
| `/contact` | Contact page (UI only) |
| `/documentation` | Site info from Sanity CMS: About Me, Now, Accessibility, Colophon (ISR: 1 hr) |
| `/projects` | Portfolio-style project dashboard from Sanity CMS (ISR: 1 hr) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create `.env.local` in the project root:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=<your-sanity-project-id>
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
```

### 3. Run locally

```bash
npm run dev            # Next.js dev server (Turbopack) -- localhost:3000
cd sanity-studio && npm run dev   # Sanity Studio -- localhost:3333
```

## Scripts

```bash
npm run dev        # Dev server with Turbopack
npm run build      # Production build
npm run start      # Serve production build
npm run lint       # ESLint on src/
npm run test       # Run tests once
npm run test:watch # Run tests in watch mode
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage
│   ├── layout.tsx          # Root layout (Header + Footer)
│   ├── journal/            # Blog listing (ISR)
│   ├── posts/[slug]/       # Individual posts (ISR)
│   ├── la-familia/         # Photo gallery
│   ├── puttering/          # Poetry viewer
│   ├── about/              # About page
│   ├── contact/            # Contact page
│   ├── documentation/      # Site info (About, Now, Accessibility, Colophon)
│   ├── projects/           # Project portfolio
│   ├── global-error.tsx    # Sentry error boundary
│   ├── not-found.tsx       # 404 page
│   ├── sitemap.ts          # Auto-generated sitemap
│   └── robots.ts           # Robots.txt
│
├── components/             # Organized by category, imported via barrel exports
│   ├── layout/             # Header, Footer, PageContainer
│   ├── ui/                 # ArrowLink, ContentCard
│   ├── content/            # PortableText, PostCard, ProjectCard, AuthorAvatar
│   └── seo/                # JsonLd (structured data)
│
├── hooks/
│   └── useMobileMenu.ts   # Mobile menu logic (escape, scroll lock, route-close)
│
├── lib/
│   ├── sanity.ts           # Sanity client + all GROQ queries
│   ├── constants.ts        # Site-wide config (name, URLs, cache times, rate limits)
│   ├── env.ts              # Environment variable validation
│   ├── validation.ts       # Input sanitization + XSS prevention
│   ├── api-security.ts     # Rate limiting, origin validation, honeypot, IP extraction
│   ├── logging.ts          # Structured JSON logging
│   └── navigation.ts       # Nav link definitions
│
├── types/
│   └── sanity.ts           # TypeScript types for Sanity documents
│
└── __tests__/              # Vitest tests
    ├── setup.ts
    ├── validation.test.ts
    └── env.test.ts

sanity-studio/              # Separate Sanity Studio app
public/                     # Static assets, fonts, images
```

## Component Imports

Components are grouped by category. Always use barrel exports:

```ts
import { Header, Footer, PageContainer } from '@/components/layout'
import { ArrowLink, ContentCard } from '@/components/ui'
import { PortableText, PostCard, ProjectCard, AuthorAvatar } from '@/components/content'
import { JsonLd } from '@/components/seo'
```

## How Content Works

### Blog posts (Sanity CMS)

1. Write and publish in Sanity Studio (locally at `localhost:3333` or deployed)
2. Next.js fetches content via GROQ queries in `src/lib/sanity.ts`
3. ISR revalidates every hour -- no manual redeploy needed for content changes
4. Private entries (`private: true`) are filtered out of all public queries

### Documentation sections (Sanity CMS)

The Documentation page sections (About Me, Now, Accessibility, Colophon) are `documentationSection` documents in Sanity. Edit them in Sanity Studio under the Documentation sidebar item. ISR revalidates every hour.

### Photo and poetry pages

La Familia photos and Puttering poems are managed in Sanity CMS. Edit them in Sanity Studio under their respective sidebar singletons. ISR revalidates every hour, and the Sanity webhook triggers on-demand revalidation.

## Deployment

Pushing to `main` triggers an automatic Vercel deployment. No manual steps required.

```bash
# Manual deploy (if needed)
vercel --prod
```

### Sanity Studio

```bash
cd sanity-studio && npx sanity deploy
```

## Custom Fonts

- **Cooper** -- Main display/body font (`font-cooper`, `font-display`)
- **TT Disruptors** -- Handwritten font for poems on the Puttering page

Font files are in `public/fonts/`.

## Other Documentation

These files exist in the repo for specific workflows:

| File | Purpose |
|------|---------|
| `CLAUDE.md` | AI assistant instructions (project conventions, architecture) |
| `START_HERE.md` | Quick-start guide for writing journal entries |
| `JOURNAL_ENTRIES.md` | Detailed journal entry workflow |
| `DEPLOYMENT.md` | Deployment troubleshooting notes |
| `SANITY_SETUP_GUIDE.md` | Initial Sanity CMS setup walkthrough |
| `La_Familia_Instructions.md` | How to update the photo gallery |
| `Puttering_Instructions.md` | How to update the poetry page |
