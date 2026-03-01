# Astro Migration Plan — Suburban Dad Mode

## From: Next.js 16 + Sanity CMS + Vercel
## To: Astro + Markdown/Data Files + Cloudflare Pages

---

## Executive Summary

Migrate suburbandadmode.com from Next.js/Sanity/Vercel to Astro with local content files on Cloudflare Pages. Based on a thorough audit of the current codebase and owner decisions.

**Key constraint: Platform migration, NOT a redesign.** The site must look and feel identical.

### Decisions Made

- **Legacy WordPress posts:** Skip entirely (not displayed on current site)
- **Notes page:** Migrate everything (all 12+ sections including House, Cars, Finances, Book Group)
- **Project location:** New directory alongside current repo (`suburban-dad-mode/` sibling to `nextjs-blog/`)
- **Contact page:** Remove entirely (no form, no social links)
- **Changelog:** Static snapshot of current data, then point to new repo going forward
- **Typewriter effect:** Pure CSS animation (no React island)
- **Color themes:** Rose only (default) with light/dark mode — drop Ocean, Forest, Sunset, Midnight, Grayscale

---

## Current Site Inventory

### Pages (7 routes after removing Contact)

| Route | Type | Data Source | Interactive? |
|-------|------|-------------|-------------|
| `/` | Static | None | Typewriter animation (CSS) |
| `/journal` | ISR (1hr) | Sanity `journalEntry` | Static render |
| `/journal/[slug]` | ISR (1hr) | Sanity `journalEntry` | Static render |
| `/about` | Static | Hardcoded | Static render |
| `/la-familia` | ISR (1hr) | Sanity `photoGallery` (singleton) | Static render |
| `/puttering` | ISR (1hr) | Sanity `putteringPoems` (singleton) | Client: poem selector, URL params |
| `/notes` | ISR (1hr) | Sanity (7 queries) + GitHub API | Client: sidebar nav, URL params, live dateline |

Plus: `/feed.xml` (RSS), `/sitemap.xml`, `/robots.txt`, `404`

### Sanity Content to Migrate

| Schema | Migration Target |
|--------|-----------------|
| `journalEntry` | Markdown files in `src/content/journal/` |
| `documentationSection` | Markdown files in `src/content/notes/` |
| `photoGallery` | Downloaded images + `gallery.json` |
| `putteringPoems` | `poems.json` |
| `project` | `projects.json` |
| `link` | `links.json` |
| `houseItem` | `house-items.json` |
| `carItem` | `car-items.json` |
| `financeItem` | `finance-items.json` |
| `bookGroupItem` | `book-group-items.json` |

**Skipped:** `post` (legacy WordPress), `author` (hardcoded), `category` (tags in frontmatter), `blockContent` (becomes standard markdown)

### Interactive Components (4 require Astro React islands)

| Component | Interactivity | Island Strategy |
|-----------|--------------|-----------------|
| `Header` + `useMobileMenu` | Mobile menu with focus-trap, active link detection | `client:load` (React) |
| `ThemeToggle` + `useTheme` | Theme cycling (light/dark/system) — Rose palette only | `client:idle` (React) |
| `Dateline` + `useDateline` | Live date/time (60s interval) + weather API | `client:idle` (React) |
| `PutteringContent` | Poem selector, URL params, prev/next nav | `client:load` (React) |
| `DocumentationContent` | 12+ section sidebar, URL params, complex filtering | `client:load` (React) |

**No longer islands:** Typewriter (pure CSS), ThemeScript (inline `<script>`)

### Design System (Simplified)

| Aspect | Details |
|--------|---------|
| CSS Framework | Tailwind CSS v4 with `@theme` directive |
| Color System | CSS custom properties (`--sdm-*`), Rose palette only, light + dark mode |
| Typography | Cooper font (3 weights: light/medium/bold), TT Disruptors (poetry), base font size 22px |
| Dark Mode | Class-based (`:root.dark`), FOUC prevention via blocking `<head>` script |

### Redirects (must preserve)

| From | To | Type |
|------|-----|------|
| `/posts/:slug` | `/journal/:slug` | 301 |
| `/documentation` | `/notes` | 301 |
| `/category/:slug*` | `/journal` | 301 |
| `/categories/:slug*` | `/journal` | 301 |
| `/projects` | `/notes?section=projects` | 301 |
| `/contact` | `/` | 301 |
| `www.suburbandadmode.com/*` | `https://suburbandadmode.com/*` | 301 |

---

## Phase 1: Project Scaffolding & Configuration

### 1.1 Initialize Astro Project

```bash
# Create as sibling directory to nextjs-blog/
cd ..
npm create astro@latest suburban-dad-mode
```

Configuration:
- `output: 'static'` (full SSG)
- `site: 'https://suburbandadmode.com'`
- TypeScript strict mode
- Install `@astrojs/react` for interactive islands
- Install `@astrojs/tailwind` for Tailwind v4
- Install `@astrojs/rss` for RSS feed
- Install `@astrojs/sitemap` for sitemap generation

### 1.2 Project Structure

```
suburban-dad-mode/                 # New repo, sibling to nextjs-blog/
├── src/
│   ├── content/
│   │   ├── config.ts              # Content collection schemas
│   │   ├── journal/               # Blog posts (markdown)
│   │   │   └── {slug}.md
│   │   └── notes/                 # Documentation sections (markdown)
│   │       └── {slug}.md
│   ├── data/                      # Structured data (non-markdown content)
│   │   ├── poems.json
│   │   ├── projects.json
│   │   ├── links.json
│   │   ├── house-items.json
│   │   ├── car-items.json
│   │   ├── finance-items.json
│   │   ├── book-group-items.json
│   │   ├── gallery.json           # Photo gallery metadata
│   │   └── changelog.json         # Static snapshot of git changelog
│   ├── layouts/
│   │   ├── BaseLayout.astro       # HTML shell, fonts, meta, header/footer
│   │   └── JournalPost.astro      # Single journal post layout
│   ├── pages/
│   │   ├── index.astro            # Homepage (with pure CSS typewriter)
│   │   ├── about.astro            # About page
│   │   ├── la-familia.astro       # Photo gallery
│   │   ├── puttering.astro        # Poetry page (loads React island)
│   │   ├── notes.astro            # Notes page (loads React island)
│   │   ├── journal/
│   │   │   ├── index.astro        # Journal listing
│   │   │   └── [...slug].astro    # Individual journal posts
│   │   ├── feed.xml.ts            # RSS feed
│   │   ├── robots.txt.ts          # Robots.txt
│   │   └── 404.astro              # Not found page
│   ├── components/
│   │   ├── Header.tsx             # React island (mobile menu + active link)
│   │   ├── Footer.astro           # Static (squiggle image)
│   │   ├── ThemeToggle.tsx        # React island (light/dark/system toggle only)
│   │   ├── ThemeScript.astro      # Blocking inline script for FOUC prevention
│   │   ├── Typewriter.astro       # Pure CSS typing animation
│   │   ├── Dateline.tsx           # React island (live date/time/weather)
│   │   ├── PutteringContent.tsx   # React island (poem viewer)
│   │   ├── DocumentationContent.tsx # React island (notes sidebar)
│   │   ├── TechStackContent.tsx   # React (uses react-icons, nested in DocumentationContent)
│   │   ├── ProjectCard.astro      # Static project card
│   │   ├── ArrowLink.astro        # Static link with arrow
│   │   ├── ContentCard.astro      # Static content container
│   │   ├── PageContainer.astro    # Static layout container
│   │   └── JsonLd.astro           # Static JSON-LD renderer
│   ├── hooks/                     # React hooks (used by islands only)
│   │   ├── useTheme.ts            # Simplified: light/dark/system only, no color schemes
│   │   ├── useDateline.ts         # Live date/time/weather (unchanged)
│   │   └── useMobileMenu.ts       # Mobile menu state (unchanged)
│   ├── lib/
│   │   ├── constants.ts           # Site config (simplified)
│   │   ├── navigation.ts          # Nav links (remove /contact)
│   │   ├── weather.ts             # Open-Meteo client (unchanged)
│   │   └── tech-icons.ts          # Tech → icon mapping (unchanged)
│   ├── styles/
│   │   └── globals.css            # Simplified: Rose theme only, light/dark
│   └── types/
│       └── content.ts             # TypeScript types for data files
├── public/
│   ├── fonts/                     # Cooper + TT Disruptors font files
│   ├── images/
│   │   ├── journal/               # Journal post images
│   │   └── gallery/               # La Familia photos (from Sanity)
│   ├── projects/                  # Project card images
│   ├── favicon.ico, etc.          # Favicons
│   ├── squiggle.webp              # Footer art
│   ├── image.webp                 # Homepage hero
│   ├── documentation-hero.webp    # Notes hero
│   ├── puttering-bookshelf.webp   # Puttering default image
│   └── site.webmanifest           # PWA manifest
├── scripts/
│   └── migrate-sanity.ts          # One-time content migration script
├── astro.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── _redirects                     # Cloudflare Pages redirects
├── _headers                       # Cloudflare Pages security headers
└── package.json
```

### 1.3 Key Configuration Files

**astro.config.mjs:**
```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://suburbandadmode.com',
  output: 'static',
  integrations: [
    react(),
    tailwind(),
    sitemap(),
  ],
  vite: {
    ssr: {
      noExternal: ['react-icons'],
    },
  },
});
```

**Tailwind config:** Port existing `tailwind.config.ts` — same colors, fonts, sizes, typography plugin. Remove unused color scheme mappings (ocean, forest, etc.).

**globals.css:** Copy from current codebase, then strip:
- All `data-theme="ocean"` / `"forest"` / `"sunset"` / `"midnight"` / `"grayscale"` blocks
- The `sdm-color-scheme` localStorage handling from ThemeScript
- The color scheme picker from ThemeToggle
- Keep: `:root` (Rose light), `:root.dark` (Rose dark), font-faces, scrollbar, selection, focus, prose, reduced motion, footer squiggle filters

---

## Phase 2: Content Migration

### 2.1 Migration Script (`scripts/migrate-sanity.ts`)

A Node.js script that runs once against the live Sanity dataset:

1. **Connects to Sanity** using project ID `4qp7h589` and dataset `production`

2. **Exports journal entries** as markdown:
   - Queries `postsQuery` (all journal entries with body)
   - For each entry:
     - Converts Portable Text body → Markdown using `@portabletext/to-markdown`
     - Custom serializers for: code blocks (with language + filename), images (download + rewrite), links (with target)
     - Generates frontmatter: `title`, `pubDate` (from `publishedAt`), `excerpt`, `tags`, `draft: false`, `mainImage` (if present)
     - Saves as `src/content/journal/{slug}.md`
   - Downloads all Sanity CDN images → `public/images/journal/` or `public/images/posts/`
   - Rewrites image references in markdown to local paths

3. **Exports documentation sections** as markdown:
   - Queries `documentationSectionsQuery`
   - Same Portable Text → Markdown conversion
   - Frontmatter: `title`, `order`
   - Saves as `src/content/notes/{slug}.md`

4. **Exports structured data** as JSON:
   - `poems.json` from `putteringPoemsQuery` — `[{ title, slug, text }]`
   - `projects.json` from `projectsQuery` — full project objects with local image paths
   - `links.json` from `linksQuery` — `[{ name, url }]`
   - `house-items.json` from `houseItemsQuery`
   - `car-items.json` from `carItemsQuery`
   - `finance-items.json` from `financeItemsQuery`
   - `book-group-items.json` from `bookGroupItemsQuery`
   - `gallery.json` from `photoGalleryQuery` — photo metadata with local paths

5. **Downloads gallery photos** from Sanity CDN → `public/images/gallery/`

6. **Downloads project images** from Sanity CDN → `public/projects/`

7. **Exports changelog snapshot:**
   - Calls GitHub API (same as `getChangelog()`)
   - Saves as `changelog.json`

### 2.2 Portable Text → Markdown Conversion

Block types to handle:

| Portable Text | Markdown Output |
|---------------|----------------|
| Normal text | Paragraph |
| H1-H4 | `#` - `####` |
| Strong | `**bold**` |
| Emphasis | `*italic*` |
| Code (inline) | `` `code` `` |
| Link annotation | `[text](url)` |
| Bullet list | `- item` |
| Number list | `1. item` |
| Blockquote | `> quote` |
| Code block (custom type) | ````language\ncode\n```` with optional filename comment |
| Image (custom type) | `![alt](local-path)` + caption if present |

### 2.3 Content Collection Schema

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const journal = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    excerpt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    mainImage: z.object({
      src: z.string(),
      alt: z.string(),
    }).optional(),
  }),
});

const notes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    order: z.number(),
  }),
});

export const collections = { journal, notes };
```

### 2.4 Validation Checklist

- [ ] Journal entry count matches Sanity source
- [ ] Spot-check 5+ posts for Portable Text → Markdown accuracy
- [ ] All inline images downloaded and referenced correctly
- [ ] Code blocks preserve language and filename
- [ ] Links preserved correctly
- [ ] Blockquotes, lists, headings render correctly
- [ ] Gallery photos all downloaded and display correctly
- [ ] Poems text preserved (including line breaks)
- [ ] Documentation sections convert cleanly
- [ ] Project data complete and images present
- [ ] Changelog snapshot contains expected data

---

## Phase 3: Build the Astro Site

### 3.1 Layouts

**BaseLayout.astro:**
- HTML boilerplate matching current `layout.tsx` exactly
- `<head>`:
  - `ThemeScript.astro` (blocking, first child — simplified for Rose only)
  - Organization JSON-LD schema
  - RSS feed `<link>`
  - Creative Commons license link
  - Font preloads (Cooper light/medium/bold)
  - Favicon links with cache busting (`v20260225`)
  - Theme-color meta tags (light: `#F3EFF5`, dark: `#1B1F2E`)
- `<body class="font-cooper antialiased min-h-screen flex flex-col text-sdm-text bg-sdm-background">`
- `<Header client:load />` (React island)
- `<main id="main-content" class="flex-grow">{slot}</main>`
- `<Footer />` (Astro component)
- Props: `title`, `description`, `canonical`, `ogImage`, `ogType`, `publishedTime`, `twitterCard`

**JournalPost.astro:**
- Extends BaseLayout
- BlogPosting + BreadcrumbList JSON-LD schemas
- Back-to-journal nav link (arrow + "Journal")
- Post header: title (text-4xl/5xl bold), date (MM/dd/yyyy), main image (if present)
- `<div class="prose prose-xl max-w-none text-xl md:text-2xl font-light">` wrapper for `<slot />`
- Previous/next post navigation (computed from sorted collection)

### 3.2 Pages

**Homepage (`index.astro`):**
- Screen-reader-only `<h1>Suburban Dad Mode - A Blog About Life in the Suburbs</h1>`
- Hero image: `<img src="/image.webp" ...>` (600×600, priority loading)
- Pure CSS Typewriter: `<Typewriter text="always classic" />`

**Journal listing (`journal/index.astro`):**
- `getCollection('journal')` → filter drafts → sort by pubDate desc
- Group by year and month (port `groupPostsByYearAndMonth` logic)
- Cycling background colors (`bg-sdm-journal-1/2/3`) with global color index
- Local image map (`postImages` record — same as current)
- Fallback excerpts map (same as current)
- RSS feed link

**Journal post (`journal/[...slug].astro`):**
- `getStaticPaths()` from journal collection
- Compute adjacent posts (newer/older) at build time from sorted collection
- Render with JournalPost layout
- `<Content />` for markdown body

**About (`about.astro`):**
- Static content matching current `/about` page
- Uses ContentCard, ArrowLink components

**La Familia (`la-familia.astro`):**
- Read `gallery.json` for photo metadata
- Masonry/columns layout: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Lazy loading (except first 3 images)
- Hover scale effect

**Puttering (`puttering.astro`):**
- Read `poems.json`
- `<PutteringContent client:load poems={poems} />`
- React island handles poem selection, URL params, prev/next

**Notes (`notes.astro`):**
- Read all data at build time:
  - Documentation sections from content collection (render to HTML strings)
  - Projects, links, house/car/finance/book items from JSON files
  - Changelog from static snapshot JSON
- `<DocumentationContent client:load sections={...} projects={...} ... />`
- Pass pre-rendered HTML for documentation sections

**404 (`404.astro`):**
- "404" heading in large display font
- Friendly message
- Back to home link
- Uses PageContainer

### 3.3 Component Details

**ThemeScript.astro (simplified):**
```astro
<script is:inline>
(function(){try{var t=localStorage.getItem('sdm-theme');var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches);if(d){document.documentElement.classList.add('dark')}document.documentElement.style.colorScheme=d?'dark':'light'}catch(e){}})();
</script>
```
No color scheme handling — Rose only.

**Typewriter.astro (pure CSS):**
```astro
---
interface Props {
  text: string;
  class?: string;
}
const { text, class: className } = Astro.props;
const charCount = text.length;
---
<p class:list={['typewriter', className]}
   style={`--chars: ${charCount}`}>
  {text}
</p>
<style>
  .typewriter {
    overflow: hidden;
    white-space: nowrap;
    border-right: 2px solid var(--sdm-text);
    width: 0;
    animation:
      typing 1.4s steps(var(--chars)) forwards,
      blink 0.7s step-end infinite;
  }
  @keyframes typing {
    to { width: 100%; }
  }
  @keyframes blink {
    50% { border-color: transparent; }
  }
  @media (prefers-reduced-motion: reduce) {
    .typewriter {
      width: 100%;
      animation: none;
      border-right: none;
    }
  }
</style>
```

**ThemeToggle.tsx (simplified):**
- Remove color scheme picker (no dropdown palette)
- Keep theme cycle button: system → light → dark → system
- Remove `setColorScheme`, `colorScheme`, `COLOR_SCHEMES`
- Icons: Sun (light), Moon (dark), Computer (system)

**useTheme.ts (simplified):**
- Remove `ColorScheme` type, `COLOR_SCHEME_KEY`, color scheme store
- Remove `applyColorScheme()`, `updateMetaThemeColor()`
- Keep: `Theme`, `ResolvedTheme`, `setTheme()`, `applyTheme()`
- Return: `{ theme, resolvedTheme, systemPref, setTheme }`

**Header.tsx:**
- Port directly from current codebase
- Replace `usePathname()` with `window.location.pathname`
- Keep `focus-trap-react` for mobile menu
- Keep `useMobileMenu` hook
- Include simplified `ThemeToggle` (no color picker)

**DocumentationContent.tsx:**
- Port from current codebase
- Replace `useRouter()` → `history.pushState()`
- Replace `useSearchParams()` → `new URLSearchParams(window.location.search)`
- Receive documentation section HTML as `Record<string, string>` (pre-rendered by Astro)
- Render section HTML via `dangerouslySetInnerHTML`
- Everything else (house, cars, finances, book group, projects, links, changelog) works as-is with JSON data props

**PutteringContent.tsx:**
- Port from current codebase
- Same router replacements as DocumentationContent
- Receives poems array as prop

### 3.4 Styling — Pixel-Perfect Port

1. **Copy `globals.css`** and strip non-Rose theme variants:
   - Keep: `@font-face` declarations (all 4 fonts)
   - Keep: `:root` (Rose light mode custom properties)
   - Keep: `:root.dark` (Rose dark mode custom properties)
   - Keep: journal alternating row colors
   - Keep: scrollbar, selection, focus ring, footer squiggle filters
   - Keep: prose spacing, reduced motion media query
   - Keep: `@theme inline` block (Tailwind v4)
   - **Remove:** `:root[data-theme="ocean"]` and all other theme variants (~200 lines removed)
   - **Remove:** `:root[data-theme="grayscale"] img { filter: grayscale(1) }` rule

2. **Port `tailwind.config.ts`** — same colors, font sizes (base 22px), typography plugin config

3. **Copy all font files** from `public/fonts/` verbatim

4. **Verification:** Screenshot comparison at 1440px and 375px for every page

### 3.5 RSS Feed

```typescript
// src/pages/feed.xml.ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('journal', ({ data }) => !data.draft);
  return rss({
    title: 'Suburban Dad Mode',
    description: 'A personal blog about family, finances, music, and suburban life.',
    site: context.site,
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.excerpt || '',
        link: `/journal/${post.slug}/`,
      })),
  });
}
```

### 3.6 Sitemap & Robots.txt

Sitemap auto-generated by `@astrojs/sitemap`. Robots.txt:
```
User-agent: *
Allow: /
Disallow: /private/
Disallow: /admin/
Sitemap: https://suburbandadmode.com/sitemap-index.xml
```

---

## Phase 4: SEO & Redirects

### 4.1 URL Parity

| Current URL | Astro URL | Status |
|-------------|-----------|--------|
| `/` | `/` | Match |
| `/journal` | `/journal` | Match |
| `/journal/{slug}` | `/journal/{slug}` | Match |
| `/about` | `/about` | Match |
| `/contact` | Removed → redirect to `/` | 301 |
| `/la-familia` | `/la-familia` | Match |
| `/puttering` | `/puttering` | Match |
| `/notes` | `/notes` | Match |
| `/feed.xml` | `/feed.xml` | Match |

Configure Astro's `trailingSlash` to match current Next.js behavior (no trailing slash by default).

### 4.2 Cloudflare `_redirects`

```
/posts/:slug  /journal/:slug  301
/documentation  /notes  301
/category/*  /journal  301
/categories/*  /journal  301
/projects  /notes?section=projects  301
/contact  /  301
```

WWW → non-WWW handled at Cloudflare DNS level.

### 4.3 Meta Tags

Port all metadata from current pages:
- Global: title template `{page} | Suburban Dad Mode`, Organization JSON-LD
- Per-page: canonical URL, OpenGraph (type, title, description, image, url), Twitter cards
- Journal posts: BlogPosting JSON-LD, BreadcrumbList JSON-LD, `article` og:type, `summary_large_image` Twitter card

### 4.4 Structured Data

- Organization schema on every page (BaseLayout)
- BlogPosting schema on journal posts (JournalPost layout)
- BreadcrumbList schema on journal posts (JournalPost layout)

---

## Phase 5: Cloudflare Pages Deployment

### 5.1 Build Configuration

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Output directory | `dist` |
| Node.js version | 20+ |
| Env vars needed | None (all content local) |

### 5.2 Security Headers (`_headers`)

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()
  Cross-Origin-Opener-Policy: same-origin
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https://api.open-meteo.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'

/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/_astro/*
  Cache-Control: public, max-age=31536000, immutable
```

### 5.3 Custom Domain Cutover

1. Push Astro project to new GitHub repo
2. Connect to Cloudflare Pages
3. Add custom domain `suburbandadmode.com`
4. Update DNS (remove Vercel CNAME → add CF Pages CNAME)
5. SSL provisions automatically
6. Monitor 24-48 hours for DNS propagation

---

## Phase 6: What Gets Removed

| Removed | Reason |
|---------|--------|
| Sanity CMS + Studio | Content now in git |
| `/api/revalidate` webhook | No ISR — deploys on push |
| Sentry error tracking | No server-side code |
| Upstash Redis rate limiting | No API routes |
| Contact page | Owner decision |
| 5 color themes | Simplified to Rose only |
| Color scheme picker UI | No longer needed |
| `@sanity/client`, `next-sanity` | No CMS |
| `@sentry/nextjs` | No error tracking |
| `@upstash/ratelimit`, `@upstash/redis` | No rate limiting |
| `server-only` | No server components |
| `src/lib/sanity.ts` | No CMS queries |
| `src/lib/api-security.ts` | No API security |
| `src/lib/env.ts` | No env validation needed |
| `src/lib/validation.ts` | No user input |
| `src/lib/logging.ts` | No structured logging |
| `src/lib/github.ts` | Changelog is static snapshot |
| `PortableText.tsx` | Markdown rendering built into Astro |
| `sentry.*.config.ts` | No Sentry |
| `vercel.json`, `.vercelignore` | No Vercel |
| `next.config.ts` | Replaced by `astro.config.mjs` |

---

## Phase 7: Pre-Launch Checklist

### Functional
- [ ] All journal entries render with correct formatting
- [ ] Journal listing groups by year/month correctly
- [ ] Journal post prev/next navigation works
- [ ] Homepage hero image and CSS typewriter work
- [ ] About page content matches current site
- [ ] La Familia gallery displays all photos in masonry layout
- [ ] Puttering poem selector works (URL params, prev/next)
- [ ] Notes page all 12+ sections work
- [ ] Notes sidebar navigation works on mobile and desktop
- [ ] Notes Dateline shows live date/time/weather
- [ ] Notes Changelog section shows static snapshot
- [ ] Notes Projects shows public/internal tabs
- [ ] Notes House/Cars/Finances/Book Group render correctly
- [ ] RSS feed validates
- [ ] Sitemap generates with all routes
- [ ] 404 page works
- [ ] `/contact` redirects to `/`

### Visual
- [ ] Screenshot comparison: every page at 1440px
- [ ] Screenshot comparison: every page at 375px
- [ ] Dark mode renders correctly (Rose palette)
- [ ] Theme toggle cycles light/dark/system correctly
- [ ] Mobile menu opens/closes with focus trap
- [ ] Footer squiggle renders correctly in light + dark
- [ ] Custom scrollbar styling works
- [ ] Selection colors match

### SEO
- [ ] All URLs match (no broken links)
- [ ] All redirects work
- [ ] Canonical URLs on every page
- [ ] OG + Twitter metadata correct per page
- [ ] JSON-LD schemas valid
- [ ] Trailing slash behavior matches

### Performance
- [ ] Lighthouse ≥ 95 across all categories
- [ ] Font preloading works
- [ ] Images lazy-load
- [ ] No layout shifts

---

## Phase 8: Post-Migration Workflow

### Writing a New Post

```bash
# 1. Create markdown file
cat > src/content/journal/my-new-post.md << 'EOF'
---
title: "My New Post"
pubDate: 2026-03-15
excerpt: "A brief description"
tags: ["life"]
---

Post content in standard markdown...
EOF

# 2. Add any images to public/images/journal/

# 3. Commit and push
git add . && git commit -m "New post: My New Post" && git push

# Cloudflare auto-deploys in ~1-2 minutes
```

### Updating Notes/Data

Edit JSON files in `src/data/` or markdown in `src/content/notes/`. Commit and push.

### Optional Post-Launch Enhancements

- **Pagefind** — static client-side search (zero server cost)
- **Cloudflare Web Analytics** — free, privacy-respecting
- **Keystatic** — visual editor UI on top of existing markdown files
- **Image optimization** — Cloudflare's built-in image resizing

---

## Risk Mitigation

1. **Keep Vercel running** until Cloudflare is fully verified — don't tear down until confident
2. **Migration script is idempotent** — safe to re-run if Sanity content changes during migration
3. **All content in git** — full version history, zero data loss risk
4. **Cloudflare instant rollbacks** — one click to revert a bad deploy
5. **URL parity verification** — automated crawl comparison before cutover
6. **Screenshot comparison** — visual regression testing at two viewport widths
7. **DNS propagation** — use low TTL on DNS records before cutover, monitor for 48 hours after

---

## Dependencies to Install

```json
{
  "dependencies": {
    "astro": "^5.x",
    "@astrojs/react": "^4.x",
    "@astrojs/tailwind": "^6.x",
    "@astrojs/rss": "^4.x",
    "@astrojs/sitemap": "^3.x",
    "react": "^19.x",
    "react-dom": "^19.x",
    "react-icons": "^5.x",
    "focus-trap-react": "^12.x",
    "date-fns": "^4.x",
    "tailwindcss": "^4.x",
    "@tailwindcss/typography": "^0.5.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "@types/react": "^19.x",
    "@types/react-dom": "^19.x"
  }
}
```

**Migration script (one-time, dev only):**
```json
{
  "@sanity/client": "^7.x",
  "@portabletext/to-markdown": "latest"
}
```
