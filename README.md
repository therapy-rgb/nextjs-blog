# Suburban Dad Mode

A personal blog about family, finances, music, and suburban life.

**Live site:** [suburbandadmode.com](https://suburbandadmode.com)

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| Language | [TypeScript](https://www.typescriptlang.org/) + [React 19](https://react.dev/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) + `@tailwindcss/typography` |
| CMS | [Sanity v5](https://www.sanity.io/) (headless, GROQ queries) |
| Error tracking | [Sentry](https://sentry.io/) |
| Rate limiting | [Upstash Redis](https://upstash.com/) |
| Testing | [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/) |
| Deployment | [Vercel](https://vercel.com/) (auto-deploy from `main`) |

## Features

- **Journal** -- long-form blog posts about family, finances, music, and suburban life
- **La Familia** -- family photo gallery with vertical scroll layout
- **Puttering** -- poetry collection rendered in handwritten font
- **Notes** -- site info hub (About Me, Now, House, Cars, Finances, Book Group, Projects, Links, Accessibility, Tech Stack, Changelog)
- **Dark mode** -- three-state toggle (light / dark / system preference), persisted in localStorage
- **RSS feed** -- auto-generated at `/feed.xml`
- **On-demand revalidation** -- Sanity webhook triggers instant cache invalidation; ISR as fallback
- **Changelog** -- monthly timeline of site changes pulled from the GitHub API

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage -- hero image with tagline |
| `/journal` | Blog listing, sourced from Sanity (ISR: 1 hr) |
| `/journal/[slug]` | Individual blog posts (ISR: 1 hr) |
| `/la-familia` | Family photo gallery (vertical scroll) |
| `/puttering` | Poetry viewer from Sanity CMS (ISR: 1 hr) |
| `/about` | About page |
| `/contact` | Contact page |
| `/notes` | Site info from Sanity CMS: About Me, Now, House, Cars, Finances, Book Group, Projects, Links, Accessibility, Tech Stack (ISR: 1 hr) |
| `/notes?section=projects` | Portfolio-style project dashboard (from Sanity CMS) |
| `/notes?section=changelog` | Monthly timeline of recent site changes (from GitHub API) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### 1. Clone and install

```bash
git clone https://github.com/therapy-rgb/nextjs-blog.git
cd nextjs-blog
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
NEXT_PUBLIC_BASE_URL=<base-url>
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

### 3. Run locally

```bash
npm run dev                          # Next.js dev server (Turbopack) -- localhost:3000
cd sanity-studio && npm run dev      # Sanity Studio -- localhost:3333
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint on `src/` |
| `npm run test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage
│   ├── layout.tsx          # Root layout (Header + Footer)
│   ├── journal/            # Blog listing (ISR)
│   ├── journal/[slug]/     # Individual posts (ISR)
│   ├── la-familia/         # Photo gallery
│   ├── puttering/          # Poetry viewer
│   ├── about/              # About page
│   ├── contact/            # Contact page
│   ├── notes/              # Site info (About, Now, House, Cars, Finances, Book Group, Projects, Links, Accessibility, Tech Stack, Changelog)
│   ├── api/revalidate/     # Sanity webhook for on-demand ISR
│   ├── feed.xml/           # RSS feed generation
│   ├── error.tsx           # Error boundary
│   ├── loading.tsx         # Loading skeleton
│   ├── global-error.tsx    # Sentry error boundary
│   ├── not-found.tsx       # 404 page
│   ├── sitemap.ts          # Auto-generated sitemap
│   └── robots.ts           # Robots.txt
│
├── components/             # Organized by category, imported via barrel exports
│   ├── layout/             # Header, Footer, PageContainer
│   ├── ui/                 # ArrowLink, ContentCard, ThemeToggle, Typewriter
│   ├── content/            # PortableText, PostCard, ProjectCard, AuthorAvatar
│   └── seo/                # JsonLd (structured data)
│
├── hooks/
│   ├── useMobileMenu.ts    # Mobile menu logic (escape, scroll lock, route-close)
│   └── useTheme.ts         # Theme toggle (light/dark/system) with localStorage + OS sync
│
├── lib/
│   ├── sanity.ts           # Sanity client + all GROQ queries
│   ├── constants.ts        # Site-wide config (name, URLs, cache times, rate limits)
│   ├── env.ts              # Environment variable validation
│   ├── validation.ts       # Input sanitization + XSS prevention
│   ├── api-security.ts     # Rate limiting, origin validation, honeypot, IP extraction
│   ├── logging.ts          # Structured JSON logging
│   ├── navigation.ts       # Nav link definitions
│   ├── tech-icons.ts       # Tech name -> react-icons mapping for ProjectCard
│   └── github.ts           # GitHub API client for changelog
│
├── types/
│   └── sanity.ts           # TypeScript types for Sanity documents
│
└── __tests__/              # Vitest tests

sanity-studio/              # Separate Sanity Studio app (own package.json)
public/                     # Static assets, fonts, images
```

## Content Management

### Journal entries (Sanity CMS)

1. Write and publish in Sanity Studio (locally at `localhost:3333` or deployed)
2. Next.js fetches content via GROQ queries in `src/lib/sanity.ts`
3. ISR revalidates every hour -- no manual redeploy needed for content changes
4. Private entries (`private: true`) are filtered out of all public queries
5. Sanity webhook triggers on-demand revalidation for near-instant updates

### Sanity schemas

| Type | Description |
|------|-------------|
| `journalEntry` | Blog posts (primary content type) |
| `post` | Legacy posts (from WordPress migration) |
| `author` | Author profiles |
| `category` | Post categories |
| `blockContent` | Rich text configuration |
| `documentationSection` | Notes page sections (About Me, Now, Accessibility, Tech Stack) |
| `photoGallery` | La Familia photo gallery (singleton) |
| `putteringPoems` | Poetry collection (singleton) |
| `project` | Portfolio projects with tech stack, links, category, and visibility |
| `link` | Curated external links (name, url, order) shown on Notes page |
| `houseItem` | House maintenance/repairs/upgrades checklist items |
| `carItem` | Car maintenance/repairs items (per vehicle) |
| `financeItem` | Finance tracking items (grouped, e.g. taxes-2025) |
| `bookGroupItem` | Book group reading list (title, author, year, meeting date) |

### Photo and poetry pages

La Familia photos and Puttering poems are managed in Sanity CMS under their respective sidebar singletons. ISR revalidates every hour, and the Sanity webhook triggers on-demand revalidation.

## Deployment

Pushing to `main` triggers an automatic [Vercel](https://vercel.com/) deployment. No manual steps required.

```bash
vercel --prod                            # Manual deploy (if needed)
cd sanity-studio && npx sanity deploy    # Deploy Sanity Studio
```

## Custom Fonts

- **Cooper** -- main display and body font (`font-cooper`, `font-display`)
- **TT Disruptors** -- handwritten font for poems on the Puttering page

Font files are in `public/fonts/`.

## Design

- **Colors:** Semantic `sdm-*` tokens -- deep rose primary, bright teal accent, light lavender background, navy text
- **Dark mode:** Class-based toggling via `useTheme` hook (light / dark / system), `ThemeScript` prevents FOUC
- **Typography:** Cooper for headings and body (22px base), Georgia as fallback
- **Footer:** Page-specific SVG line art illustrations

## License

This project is licensed under the [Creative Commons Attribution-NonCommercial 4.0 International License](LICENSE) (CC BY-NC 4.0).

You are free to share and adapt the material for non-commercial purposes with appropriate attribution. See the [LICENSE](LICENSE) file for details.
