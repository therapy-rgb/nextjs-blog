# Astro Migration Plan — Suburban Dad Mode

## From: Next.js 16 + Sanity CMS + Vercel
## To: Astro + Markdown/Data Files + Cloudflare Pages

---

## Executive Summary

This plan details the migration of suburbandadmode.com from its current Next.js/Sanity/Vercel stack to Astro with local content files, deployed on Cloudflare Pages. It is based on a thorough audit of the current codebase.

**Key constraint: Platform migration, NOT a redesign.** The site must look and feel identical.

---

## Current Site Inventory

### Pages (8 routes + 2 API routes + 2 metadata routes)

| Route | Type | Data Source | Interactive? |
|-------|------|-------------|-------------|
| `/` | Static | None | Typewriter animation (JS) |
| `/journal` | ISR (1hr) | Sanity `journalEntry` | Static render |
| `/journal/[slug]` | ISR (1hr) | Sanity `journalEntry` | Static render |
| `/about` | Static | Hardcoded | Static render |
| `/contact` | Static | Hardcoded | Non-functional form |
| `/la-familia` | ISR (1hr) | Sanity `photoGallery` (singleton) | Static render |
| `/puttering` | ISR (1hr) | Sanity `putteringPoems` (singleton) | Client: poem selector, URL params |
| `/notes` | ISR (1hr) | Sanity (7 queries) + GitHub API | Client: sidebar nav, URL params, live dateline |
| `/feed.xml` | ISR (1hr) | Sanity `journalEntry` | N/A (RSS) |
| `/api/revalidate` | Dynamic | Sanity webhook | N/A (webhook handler) |
| `/sitemap.xml` | Generated | Sanity + static routes | N/A |
| `/robots.txt` | Generated | Static | N/A |

### Sanity Content Types (14 schemas)

| Schema | Migration Target | Count/Type |
|--------|-----------------|------------|
| `journalEntry` | Markdown files in `src/content/journal/` | Multiple documents |
| `post` (legacy WordPress) | Markdown files (or archive/skip) | Multiple documents |
| `author` | Hardcoded constant (single author site) | 1 used |
| `category` | Frontmatter tags on posts | Few |
| `blockContent` | Standard markdown | Rich text config |
| `documentationSection` | Markdown files in `src/content/notes/` | Multiple, ordered |
| `photoGallery` | Downloaded images + data file | Singleton |
| `putteringPoems` | Data file (JSON/YAML) | Singleton |
| `project` | Data file (JSON/YAML) | Multiple, ordered |
| `link` | Data file (JSON/YAML) | Multiple |
| `houseItem` | Data file (JSON/YAML) | Multiple |
| `carItem` | Data file (JSON/YAML) | Multiple |
| `financeItem` | Data file (JSON/YAML) | Multiple |
| `bookGroupItem` | Data file (JSON/YAML) | Multiple |

### Interactive Components (6 require Astro islands)

| Component | Interactivity | Island Strategy |
|-----------|--------------|-----------------|
| `Header` + `useMobileMenu` | Mobile menu with focus-trap, active link detection | `client:load` (React island) |
| `ThemeToggle` + `useTheme` | Theme cycling (light/dark/system) + 6 color schemes | `client:idle` (React island) |
| `Typewriter` | Character-by-character typing with setTimeout | `client:idle` (React island) OR pure CSS |
| `Dateline` + `useDateline` | Live date/time (60s interval) + weather API | `client:idle` (React island) |
| `PutteringContent` | Poem selector, URL params, prev/next nav | `client:load` (React island) |
| `DocumentationContent` | 12+ section sidebar, URL params, complex filtering | `client:load` (React island) |

### Design System

| Aspect | Details |
|--------|---------|
| CSS Framework | Tailwind CSS v4 with `@theme` directive |
| Color System | CSS custom properties (`--sdm-*`) with 6 theme palettes (rose, ocean, forest, sunset, midnight, grayscale) × 2 modes (light/dark) = 12 total schemes |
| Typography | Cooper font (3 weights: light/medium/bold), TT Disruptors (poetry), base font size 22px |
| Dark Mode | Class-based (`:root.dark`), FOUC prevention via blocking `<head>` script |
| Design Tokens | `sdm-primary`, `sdm-accent`, `sdm-background`, `sdm-text`, `sdm-text-light`, `sdm-card`, `sdm-border`, `sdm-surface-subtle`, `sdm-border-input`, `sdm-primary-subtle`, `sdm-overlay`, `sdm-journal-1/2/3` |

### External API Dependencies

| API | Used By | Purpose |
|-----|---------|---------|
| Open-Meteo | `useDateline` hook → Dateline component | Weather for Cranston, RI |
| GitHub API | Notes page → Changelog section | Recent commits display |
| Sanity CDN | Post images, gallery photos | Image hosting (will be localized) |

### Redirects (must preserve)

| From | To | Type |
|------|-----|------|
| `/posts/:slug` | `/journal/:slug` | 301 |
| `/documentation` | `/notes` | 301 |
| `/category/:slug*` | `/journal` | 301 |
| `/categories/:slug*` | `/journal` | 301 |
| `/projects` | `/notes?section=projects` | 301 |
| `www.suburbandadmode.com/*` | `https://suburbandadmode.com/*` | 301 |

---

## Phase 1: Project Scaffolding & Configuration

### 1.1 Initialize Astro Project

```bash
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
suburban-dad-mode/
├── src/
│   ├── content/
│   │   ├── config.ts              # Content collection schemas
│   │   ├── journal/               # Blog posts (markdown)
│   │   │   └── {slug}.md
│   │   └── notes/                 # Documentation sections (markdown)
│   │       └── {slug}.md
│   ├── data/                      # Structured data (non-markdown content)
│   │   ├── poems.json             # Puttering poems
│   │   ├── projects.json          # Portfolio projects
│   │   ├── links.json             # Curated links
│   │   ├── house-items.json       # House maintenance items
│   │   ├── car-items.json         # Car maintenance items
│   │   ├── finance-items.json     # Finance tracking items
│   │   ├── book-group-items.json  # Book group reading list
│   │   └── gallery.json           # Photo gallery metadata
│   ├── layouts/
│   │   ├── BaseLayout.astro       # HTML shell, fonts, meta, header/footer
│   │   └── JournalPost.astro      # Single journal post layout
│   ├── pages/
│   │   ├── index.astro            # Homepage
│   │   ├── about.astro            # About page
│   │   ├── contact.astro          # Contact page
│   │   ├── la-familia.astro       # Photo gallery
│   │   ├── puttering.astro        # Poetry page (loads React island)
│   │   ├── notes.astro            # Notes page (loads React island)
│   │   ├── journal/
│   │   │   ├── index.astro        # Journal listing
│   │   │   └── [...slug].astro    # Individual journal posts
│   │   ├── feed.xml.ts            # RSS feed
│   │   ├── sitemap-index.xml      # (auto-generated by @astrojs/sitemap)
│   │   ├── robots.txt.ts          # Robots.txt
│   │   └── 404.astro              # Not found page
│   ├── components/
│   │   ├── Header.tsx             # React island (mobile menu + active link)
│   │   ├── Footer.astro           # Static (squiggle image)
│   │   ├── ThemeToggle.tsx        # React island (theme + color scheme)
│   │   ├── ThemeScript.astro      # Blocking script for FOUC prevention
│   │   ├── Typewriter.tsx         # React island (typing animation)
│   │   ├── Dateline.tsx           # React island (live date/time/weather)
│   │   ├── PutteringContent.tsx   # React island (poem viewer)
│   │   ├── DocumentationContent.tsx # React island (notes sidebar)
│   │   ├── ProjectCard.astro      # Static project card
│   │   ├── PostCard.astro         # Static post listing card
│   │   ├── ArrowLink.astro        # Static link with arrow
│   │   ├── ContentCard.astro      # Static content container
│   │   ├── PageContainer.astro    # Static layout container
│   │   └── JsonLd.astro           # Static JSON-LD renderer
│   ├── hooks/                     # React hooks (used by islands)
│   │   ├── useTheme.ts            # Theme state management
│   │   ├── useDateline.ts         # Live date/time/weather
│   │   └── useMobileMenu.ts       # Mobile menu state
│   ├── lib/
│   │   ├── constants.ts           # Site config
│   │   ├── navigation.ts          # Nav links
│   │   ├── weather.ts             # Open-Meteo client
│   │   └── tech-icons.ts          # Tech → icon mapping
│   ├── styles/
│   │   └── globals.css            # Full CSS (custom properties, fonts, themes)
│   └── types/
│       └── content.ts             # TypeScript types
├── public/
│   ├── fonts/                     # Cooper + TT Disruptors font files
│   ├── images/
│   │   ├── journal/               # Journal post images
│   │   └── gallery/               # La Familia photos (downloaded from Sanity)
│   ├── projects/                  # Project card images
│   ├── favicon.ico, etc.          # Favicons
│   ├── squiggle.webp              # Footer art
│   ├── image.webp                 # Homepage hero
│   ├── documentation-hero.webp    # Notes hero
│   ├── puttering-bookshelf.webp   # Puttering default image
│   └── site.webmanifest           # PWA manifest
├── scripts/
│   └── migrate-sanity.ts          # Content migration script
├── astro.config.mjs
├── tailwind.config.ts             # Port existing config
├── tsconfig.json
├── _redirects                     # Cloudflare Pages redirects
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

**Tailwind config:** Port the existing `tailwind.config.ts` wholesale — same colors, fonts, sizes, typography plugin.

**globals.css:** Copy the entire existing `globals.css` — all custom properties, font-face declarations, theme variants, scrollbar styles, selection colors, reduced motion queries.

---

## Phase 2: Content Migration

### 2.1 Migration Script

Create `scripts/migrate-sanity.ts` that:

1. **Connects to Sanity** using the existing project ID and dataset
2. **Exports journal entries** as markdown files:
   - Converts Portable Text → Markdown (using `@portabletext/to-markdown` or a custom walker)
   - Generates frontmatter: `title`, `slug`, `pubDate`, `excerpt`, `tags`, `draft`, `mainImage`
   - Downloads any Sanity CDN images → `public/images/journal/` or `public/images/posts/`
   - Rewrites image URLs in markdown to local paths
   - Handles: bold, italic, links, code blocks (with language + filename), blockquotes, lists, headings, inline images
3. **Exports legacy posts** (if desired — see question below)
4. **Exports documentation sections** as markdown files:
   - Same Portable Text → Markdown conversion
   - Frontmatter: `title`, `slug`, `order`
5. **Exports structured data** as JSON files:
   - `poems.json` — array of `{ title, slug, text }`
   - `projects.json` — array of project objects
   - `links.json` — array of `{ name, url }`
   - `house-items.json` — array with category + order
   - `car-items.json` — array with car + category + order
   - `finance-items.json` — array with group + order
   - `book-group-items.json` — array with all fields
   - `gallery.json` — photo metadata + local paths
6. **Downloads gallery photos** from Sanity CDN → `public/images/gallery/`
7. **Downloads project images** (if hosted on Sanity) → `public/projects/`

### 2.2 Content Collection Schemas

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

### 2.3 Data File Schemas (TypeScript types)

```typescript
// src/types/content.ts
export interface Poem {
  title: string;
  slug: string;
  text: string;
}

export interface Project {
  title: string;
  slug: string;
  description: string;
  url?: string;
  repoUrl?: string;
  image?: { src: string; alt: string };
  techStack: string[];
  category: 'public' | 'internal';
  order: number;
}

export interface CuratedLink {
  name: string;
  url: string;
}

export interface HouseItem {
  title: string;
  category: 'maintenance' | 'repairs' | 'upgrades';
  order: number;
}

export interface CarItem {
  title: string;
  car: 'rav4' | 'bolt-euv';
  category: 'maintenance' | 'repairs';
  order: number;
}

export interface FinanceItem {
  title: string;
  group: string;
  order: number;
}

export interface BookGroupItem {
  title: string;
  author: string;
  year?: string;
  meetingDate?: string;
  order: number;
}

export interface GalleryPhoto {
  src: string;
  alt: string;
  caption?: string;
}
```

### 2.4 Validation Checklist

- [ ] Journal entry count matches Sanity source
- [ ] Spot-check 5+ posts for Portable Text → Markdown accuracy
- [ ] All inline images downloaded and referenced correctly
- [ ] Code blocks preserve language and filename
- [ ] Links preserved with correct href and target behavior
- [ ] Blockquotes, lists, headings render correctly
- [ ] Gallery photos all downloaded and display correctly
- [ ] Poems text preserved (including line breaks)
- [ ] Documentation sections convert cleanly
- [ ] Project data complete and images present

---

## Phase 3: Build the Astro Site

### 3.1 Layouts

**BaseLayout.astro:**
- HTML boilerplate matching current `layout.tsx`
- `<head>`: ThemeScript (blocking), Organization JSON-LD, RSS link, Creative Commons link, font preloads (Cooper light/medium/bold), favicon links with cache busting, theme-color meta tags
- `<body class="font-cooper antialiased min-h-screen flex flex-col text-sdm-text bg-sdm-background">`
- `<Header client:load />` (React island)
- `<main id="main-content" class="flex-grow">{slot}</main>`
- `<Footer />` (Astro component)
- Props: `title`, `description`, `canonical`, `ogImage`, `ogType`, `publishedTime`, `twitterCard`

**JournalPost.astro:**
- Extends BaseLayout
- Breadcrumb JSON-LD + BlogPosting JSON-LD
- Back-to-journal nav link
- Post header (title, date, main image)
- Prose container for markdown content
- Categories display
- Previous/next post navigation
- Passes SEO metadata up to BaseLayout

### 3.2 Pages

**Homepage (`index.astro`):**
- Hero image (static `<img>` from `/image.webp`)
- `<Typewriter client:idle text="always classic" />` React island
- Screen-reader-only `<h1>`

**Journal listing (`journal/index.astro`):**
- Query all journal entries from content collection
- Sort by pubDate descending, filter out drafts
- Group by year and month (same logic as current `groupPostsByYearAndMonth`)
- Cycling background colors (`bg-sdm-journal-1/2/3`)
- RSS link
- Static page — no island needed

**Journal post (`journal/[...slug].astro`):**
- `getStaticPaths()` from content collection
- Render with JournalPost layout
- `<Content />` component for markdown
- Adjacent post navigation (computed at build time from collection)

**About (`about.astro`):**
- Static content matching current about page
- Uses ContentCard, ArrowLink components

**Contact (`contact.astro`):**
- Static form UI (same as current — non-functional)
- Social links

**La Familia (`la-familia.astro`):**
- Read gallery data from JSON
- Masonry/columns layout (1/2/3 columns responsive)
- Static `<img>` tags with lazy loading
- No island needed

**Puttering (`puttering.astro`):**
- `<PutteringContent client:load poems={poems} />` React island
- Pass poems data from JSON as prop

**Notes (`notes.astro`):**
- Fetch all data at build time: sections (markdown), projects, links, house/car/finance/book items (JSON), changelog (GitHub API at build time)
- `<DocumentationContent client:load ... />` React island with all data as props

**404 (`404.astro`):**
- Matching current not-found page design

### 3.3 Component Migration Matrix

| Current Component | Astro Target | Type | Notes |
|-------------------|-------------|------|-------|
| `Header.tsx` | `Header.tsx` | React island (`client:load`) | Port directly, replace `usePathname()` with `window.location.pathname` |
| `Footer.tsx` | `Footer.astro` | Astro component | Replace `next/image` with `<img>` |
| `ThemeToggle.tsx` | `ThemeToggle.tsx` | React island (`client:idle`) | Port directly — pure client-side logic |
| `ThemeScript.tsx` | `ThemeScript.astro` | Astro `<script is:inline>` | Blocking inline script in `<head>` |
| `Typewriter.tsx` | `Typewriter.tsx` | React island (`client:idle`) | Port directly — setTimeout animation |
| `Dateline.tsx` | `Dateline.tsx` | React island (`client:idle`) | Port directly — live updates + weather API |
| `PutteringContent.tsx` | `PutteringContent.tsx` | React island (`client:load`) | Replace `useRouter`/`useSearchParams` with vanilla `URLSearchParams` + `history.pushState` |
| `DocumentationContent.tsx` | `DocumentationContent.tsx` | React island (`client:load`) | Same replacement for router; receives pre-rendered markdown as HTML strings |
| `PortableText.tsx` | Removed (markdown handles this) | N/A | Individual posts render via Astro's `<Content />` |
| `PostCard.tsx` | `PostCard.astro` | Astro component | Static with CSS hover effects |
| `ProjectCard.tsx` | `ProjectCard.astro` (or keep `.tsx` for icon mapping) | Astro/React | Depends on `react-icons` usage |
| `ArrowLink.tsx` | `ArrowLink.astro` | Astro component | Pure CSS hover |
| `ContentCard.tsx` | `ContentCard.astro` | Astro component | Pure container |
| `PageContainer.tsx` | `PageContainer.astro` | Astro component | Pure container |
| `JsonLd.tsx` | `JsonLd.astro` | Astro component | `<script type="application/ld+json" set:html={...}>` |
| `AuthorAvatar.tsx` | Removed or inline | N/A | Single author, rarely shown |
| `TechStackContent.tsx` | Keep as React (uses react-icons) | React island | Used in Notes "Tech Stack" section |

### 3.4 Styling — Pixel-Perfect Port

1. **Copy `globals.css` verbatim** — all 495 lines including:
   - All `@font-face` declarations
   - All `:root` and `:root.dark` custom properties
   - All 6 color theme variants (`data-theme` variants)
   - Footer squiggle filters
   - Scrollbar styling
   - Selection colors
   - Focus ring styles
   - Prose spacing
   - Reduced motion media query

2. **Port `tailwind.config.ts` verbatim** — same colors, font sizes, typography plugin config

3. **Copy all font files** from `public/fonts/`

4. **Preserve base font size** of 22px (`text-base: 1.375rem`)

5. **Verification method:** Screenshot comparison at 1440px and 375px widths for every page

### 3.5 RSS Feed (`feed.xml.ts`)

```typescript
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../lib/constants';

export async function GET(context) {
  const posts = await getCollection('journal', ({ data }) => !data.draft);
  return rss({
    title: SITE.name,
    description: SITE.description,
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

### 3.6 Sitemap

Auto-generated by `@astrojs/sitemap` integration. Verify it includes:
- All static pages (/, /journal, /about, /contact, /la-familia, /puttering, /notes)
- All journal post pages
- `/notes?section=projects` (may need manual addition)

### 3.7 Robots.txt

```
User-agent: *
Allow: /
Disallow: /private/
Disallow: /admin/
Sitemap: https://suburbandadmode.com/sitemap-index.xml
```

---

## Phase 4: Special Considerations

### 4.1 Next.js Image → Standard Images

The current site uses `next/image` extensively for optimization. In Astro:
- Use Astro's built-in `<Image />` component from `astro:assets` for local images (auto-optimization)
- For gallery photos and post images, ensure WebP format and appropriate sizing
- Set explicit `width`, `height`, `loading="lazy"` attributes
- Use `sizes` attribute for responsive images

### 4.2 Router Replacements for React Islands

Current React components use Next.js `useRouter()` and `useSearchParams()`. In Astro islands:
- Replace with vanilla `window.location`, `URLSearchParams`, and `history.pushState()`
- No full-page reload needed — just URL param updates

### 4.3 Weather API in Static Context

The `useDateline` hook fetches weather client-side (in the browser). This already works without SSR — the hook runs entirely in the browser. No change needed for Astro islands.

### 4.4 GitHub Changelog in Static Context

Currently fetched server-side on each request (ISR). Two options:
1. **Build-time fetch:** Call GitHub API during `astro build`, embed data in the page. Stale until next deploy.
2. **Client-side fetch:** Move to a React island that fetches on mount. Always fresh but adds client-side API call.

Recommendation: Build-time fetch (option 1) — changelog is low-priority content, and deploys will refresh it.

### 4.5 Documentation Sections with Portable Text

The Notes page renders documentation sections via Portable Text. After migration:
- Sections become markdown files
- The `DocumentationContent` React island receives pre-rendered HTML strings (rendered at build time by Astro's markdown pipeline)
- The island switches which HTML to display based on sidebar selection
- Tech Stack section uses `react-icons` — keep as React component within the island

### 4.6 Focus-Trap in Header

The `focus-trap-react` library works in React islands. Keep as-is in the Header component.

### 4.7 Sanity Image URL References in Existing Content

Any Portable Text content that references Sanity CDN images (`cdn.sanity.io`) needs those images downloaded locally. The migration script must:
1. Parse all image blocks in Portable Text
2. Download each image from Sanity CDN
3. Save locally with a deterministic filename
4. Rewrite the markdown image reference to the local path

### 4.8 The ThemeScript (FOUC Prevention)

Must remain as a blocking inline script. In Astro:
```astro
<!-- ThemeScript.astro -->
<script is:inline>
(function(){try{var t=localStorage.getItem('sdm-theme');var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches);if(d){document.documentElement.classList.add('dark')}document.documentElement.style.colorScheme=d?'dark':'light';var s=localStorage.getItem('sdm-color-scheme');if(s){document.documentElement.setAttribute('data-theme',s)}}catch(e){}})();
</script>
```

---

## Phase 5: SEO & Redirects

### 5.1 URL Parity (Critical)

| Current URL | Astro URL | Status |
|-------------|-----------|--------|
| `/` | `/` | Match |
| `/journal` | `/journal` | Match (verify no trailing slash difference) |
| `/journal/{slug}` | `/journal/{slug}` | Match (verify trailing slash config) |
| `/about` | `/about` | Match |
| `/contact` | `/contact` | Match |
| `/la-familia` | `/la-familia` | Match |
| `/puttering` | `/puttering` | Match |
| `/notes` | `/notes` | Match |
| `/notes?section=projects` | `/notes?section=projects` | Match (query params preserved by island) |
| `/feed.xml` | `/feed.xml` | Match |
| `/sitemap.xml` | `/sitemap-index.xml` | **Redirect needed** (or configure Astro) |

### 5.2 Cloudflare `_redirects` File

```
# WordPress migration redirects
/posts/:slug  /journal/:slug  301
/documentation  /notes  301
/category/*  /journal  301
/categories/*  /journal  301
/projects  /notes?section=projects  301

# Sitemap compatibility (if Astro generates at different path)
/sitemap.xml  /sitemap-index.xml  301
```

WWW → non-WWW redirect handled at Cloudflare DNS level (not in `_redirects`).

### 5.3 Meta Tags

Port all metadata from current pages:
- Title template: `{page} | Suburban Dad Mode`
- OpenGraph: type, title, description, image, url
- Twitter cards: summary_large_image for posts, summary for other pages
- Canonical URLs on every page
- Per-post dynamic metadata (title, description, og:image from mainImage)

### 5.4 Structured Data (JSON-LD)

- Organization schema on every page (from BaseLayout)
- BlogPosting schema on journal posts
- BreadcrumbList schema on journal posts

---

## Phase 6: Cloudflare Pages Deployment

### 6.1 Build Configuration

- Build command: `npm run build`
- Output directory: `dist`
- Node.js version: 20+
- Environment variables: None required (all content is local)

### 6.2 Security Headers

Cloudflare Pages supports `_headers` file:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()
  Cross-Origin-Opener-Policy: same-origin
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https://api.open-meteo.com https://api.github.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'

/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/_astro/*
  Cache-Control: public, max-age=31536000, immutable
```

Note: CSP simplified — no longer need Sanity CDN or Sentry connections.

### 6.3 Custom Domain

1. Add `suburbandadmode.com` to Cloudflare (if not already there for DNS)
2. Connect GitHub repo to Cloudflare Pages
3. Add custom domain in Pages settings
4. Update DNS records (remove Vercel CNAME, add Cloudflare Pages CNAME)

---

## Phase 7: What Gets Removed

| Current Feature | Disposition |
|----------------|-------------|
| Sanity CMS | No longer needed — content in git |
| Sanity webhook (`/api/revalidate`) | Removed — no ISR, deploys on push |
| Sentry error tracking | Removed — replace with Cloudflare Analytics or nothing |
| Upstash Redis rate limiting | Removed — no API routes to protect |
| `@sanity/client`, `next-sanity` deps | Removed |
| `@sentry/nextjs` dep | Removed |
| `@upstash/ratelimit`, `@upstash/redis` deps | Removed |
| `server-only` dep | Removed |
| `src/lib/sanity.ts` | Removed |
| `src/lib/api-security.ts` | Removed |
| `src/lib/env.ts` | Simplified (no Sanity env vars) |
| `src/lib/validation.ts` | Removed (no user input processing) |
| `src/lib/logging.ts` | Removed or simplified |
| `src/components/content/PortableText.tsx` | Removed (markdown rendering built into Astro) |
| `sanity-studio/` directory | Archived or deleted |
| `sentry.*.config.ts` files | Removed |
| `vercel.json` | Removed |
| `.vercelignore` | Removed |
| `next.config.ts` | Replaced by `astro.config.mjs` |

---

## Phase 8: Pre-Launch Checklist

### Functional Verification
- [ ] All 14 journal entries render correctly with formatting
- [ ] Journal listing groups by year/month correctly
- [ ] Journal post prev/next navigation works
- [ ] Homepage hero image and typewriter effect work
- [ ] About page content matches
- [ ] Contact page renders identically
- [ ] La Familia gallery displays all photos
- [ ] Puttering poem selector works (URL params, prev/next)
- [ ] Notes page all 12+ sections work
- [ ] Notes sidebar navigation works on mobile and desktop
- [ ] Notes Dateline shows live date/time/weather
- [ ] Notes Changelog section shows commits
- [ ] Notes Projects section shows public/internal tabs
- [ ] Notes House/Cars/Finances/Book Group sections render
- [ ] RSS feed validates and contains all posts
- [ ] Sitemap generates with all routes
- [ ] Robots.txt is correct
- [ ] 404 page works

### Visual Verification
- [ ] Screenshot comparison: every page at 1440px width
- [ ] Screenshot comparison: every page at 375px width
- [ ] Dark mode renders correctly
- [ ] All 6 color themes render correctly
- [ ] Theme toggle cycles correctly
- [ ] Color scheme picker works
- [ ] Mobile menu opens/closes with focus trap
- [ ] Footer squiggle renders with correct filters per theme
- [ ] Custom scrollbar styling works
- [ ] Selection colors match

### SEO Verification
- [ ] All URLs match existing site (no broken links)
- [ ] All redirects work (`/posts/slug` → `/journal/slug`, etc.)
- [ ] Canonical URLs present on all pages
- [ ] OpenGraph metadata correct per page
- [ ] Twitter card metadata correct per page
- [ ] JSON-LD schemas valid (Organization, BlogPosting, BreadcrumbList)
- [ ] Trailing slash behavior matches current site

### Performance
- [ ] Lighthouse score ≥ 95 across all categories
- [ ] Font loading performs well (preload + swap)
- [ ] Images lazy-load appropriately
- [ ] No layout shifts from theme/font loading

### Security
- [ ] CSP headers applied correctly
- [ ] HSTS header present
- [ ] X-Frame-Options DENY
- [ ] No exposed secrets in built output

---

## Phase 9: Post-Migration Workflow

### Writing a New Post

1. Create `src/content/journal/my-new-post.md`
2. Add frontmatter (title, pubDate, excerpt, tags)
3. Write content in standard markdown
4. Add images to `public/images/journal/`
5. `git add . && git commit -m "New post: My New Post" && git push`
6. Cloudflare Pages auto-builds and deploys (~1-2 minutes)

### Updating Notes/Data

- Edit JSON files in `src/data/` for house items, projects, etc.
- Edit markdown files in `src/content/notes/` for documentation sections
- Commit and push — auto-deploys

### Adding a New Color Theme

- Add CSS custom properties to `globals.css` under new `data-theme` value
- Add to `COLOR_SCHEMES` array in `useTheme.ts`
- Commit and push

---

## Open Questions

See the clarifying questions below — several decisions need to be made before implementation begins.

---

## Risk Mitigation

1. **Keep Vercel deployment running** until Cloudflare is fully verified
2. **Migration script is idempotent** — safe to re-run
3. **All content in git** — full version history, no data loss risk
4. **Cloudflare Pages instant rollbacks** — one-click if issues arise
5. **URL parity verification** — automated comparison of all routes
6. **Screenshot comparison** — visual regression testing before cutover
