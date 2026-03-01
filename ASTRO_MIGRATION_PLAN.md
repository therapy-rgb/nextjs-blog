# Astro Migration Plan — Suburban Dad Mode

## From: Next.js 16 + Sanity CMS + Vercel
## To: Astro + Markdown/Data Files + Cloudflare Pages

---

## Executive Summary

Migrate suburbandadmode.com from Next.js/Sanity/Vercel to Astro with local content files on Cloudflare Pages. This plan combines the platform migration with a comprehensive simplification pass: flattening SPA-like pages into static routes, eliminating all React islands, removing unnecessary dependencies, and reducing ~2,000 lines of interactive JavaScript to ~30 lines of inline vanilla JS.

**The site will look and feel identical to users. Only the machinery underneath changes.**

### Decisions Made

- **Legacy WordPress posts:** Skip entirely (not displayed on current site)
- **Notes page sections:** Migrate everything (all 12+ sections)
- **Project location:** New directory alongside current repo (`suburban-dad-mode/` sibling to `nextjs-blog/`)
- **Contact page:** Remove entirely
- **Changelog:** Static snapshot of current data, point to new repo going forward
- **Typewriter effect:** Pure CSS animation
- **Color themes:** Rose only — drop Ocean, Forest, Sunset, Midnight, Grayscale

### Simplifications Applied

| Simplification | What it eliminates | Lines saved |
|---------------|-------------------|-------------|
| Flatten Notes into separate routes | `DocumentationContent.tsx` (545 lines), Suspense wrapper, complex data orchestration | ~600 |
| Flatten Puttering into individual poem pages | `PutteringContent.tsx` (133 lines), Suspense wrapper | ~150 |
| Drop theme toggle — follow OS preference via CSS | `useTheme.ts` (183), `ThemeToggle.tsx` (174), `ThemeScript.tsx` (15) | ~370 |
| Static Astro header + inline JS mobile menu | `Header.tsx` (150), `useMobileMenu.ts` (60), `focus-trap-react` dep | ~210 |
| Drop live dateline — inline script for date only | `useDateline.ts` (109), `Dateline.tsx` (32), `weather.ts` (46) | ~190 |
| Drop `date-fns` — use `Intl.DateTimeFormat` | `date-fns` dependency | dep removed |
| Drop `react-icons` — inline SVGs | `react-icons` dependency, `tech-icons.ts` mapping | dep removed |
| Move post images/excerpts to frontmatter | Hardcoded `postImages` and `fallbackExcerpts` maps in journal page | ~30 |
| Drop custom scrollbar CSS | WebKit-only cosmetic styling | ~15 |
| Simplify footer squiggle | Complex CSS filter chains per theme | ~20 |
| Drop PWA manifest | `site.webmanifest`, icon references | config removed |
| Simplify JSON-LD | Drop Organization + BreadcrumbList schemas, keep BlogPosting | ~40 |
| Simplify robots.txt | Remove disallows for nonexistent paths | ~2 |
| Remove About page dead link | ArrowLink to removed `/contact` | ~5 |

**Result: Zero React. Zero React islands. Zero framework JS shipped to the browser.** The entire site is static HTML + CSS + ~30 lines of vanilla inline JS (mobile menu toggle + date display).

---

## Current → Target Comparison

### Dependency Count

| | Current (Next.js) | Target (Astro) |
|---|---|---|
| Production deps | 19 | 0 |
| Dev/build deps | 18 | 7 |
| **Total** | **37** | **7** |

Target dependencies:
```
astro
@astrojs/rss
@astrojs/sitemap
tailwindcss
@tailwindcss/postcss
@tailwindcss/typography
typescript
```

No React. No react-dom. No focus-trap-react. No react-icons. No date-fns.

### Client-Side JavaScript

| | Current | Target |
|---|---|---|
| React islands | 5 (Header, ThemeToggle, Dateline, PutteringContent, DocumentationContent) | 0 |
| Custom hooks | 3 (useTheme, useDateline, useMobileMenu) | 0 |
| Framework JS shipped | React 19 + island hydration code | None |
| Inline scripts | 1 (ThemeScript, 200 bytes) | 2 (~30 lines total: mobile menu + date) |
| External API calls (client) | 1 (Open-Meteo weather) | 0 |

### Pages

| Current Route | Target Route | Change |
|---|---|---|
| `/` | `/` | Same (CSS typewriter instead of JS) |
| `/journal` | `/journal` | Same (images/excerpts in frontmatter) |
| `/journal/[slug]` | `/journal/[slug]` | Same |
| `/about` | `/about` | Same (remove dead /contact link) |
| `/contact` | Removed | 301 → `/` |
| `/la-familia` | `/la-familia` | Same |
| `/puttering` | `/puttering` | Poem index (list of all poems) |
| — | `/puttering/[slug]` | **New:** individual poem pages |
| `/notes` (SPA) | `/notes` | Section index (list of all sections) |
| `/notes?section=about-me` | `/notes/about-me` | **New:** individual section pages |
| `/notes?section=now` | `/notes/now` | **New:** includes static dateline |
| `/notes?section=house` | `/notes/house` | **New:** static page |
| `/notes?section=cars` | `/notes/cars` | **New:** static page |
| `/notes?section=finances` | `/notes/finances` | **New:** static page |
| `/notes?section=book-group` | `/notes/book-group` | **New:** static page |
| `/notes?section=projects` | `/notes/projects` | **New:** static page |
| `/notes?section=links` | `/notes/links` | **New:** static page |
| `/notes?section=accessibility` | `/notes/accessibility` | **New:** static page |
| `/notes?section=tech-stack` | `/notes/tech-stack` | **New:** static page (inline SVGs) |
| `/notes?section=changelog` | `/notes/changelog` | **New:** static page |
| `/feed.xml` | `/feed.xml` | Same |

---

## Phase 1: Project Scaffolding

### 1.1 Initialize Astro Project

```bash
cd ..
npm create astro@latest suburban-dad-mode
```

Configuration:
- `output: 'static'`
- `site: 'https://suburbandadmode.com'`
- TypeScript strict mode
- **No `@astrojs/react`** — zero React islands
- Install `@astrojs/sitemap` for sitemap
- Install `@astrojs/rss` for RSS feed
- Tailwind CSS v4 via `@tailwindcss/postcss`

### 1.2 Project Structure

```
suburban-dad-mode/
├── src/
│   ├── content/
│   │   ├── config.ts              # Content collection schemas
│   │   ├── journal/               # Blog posts (markdown)
│   │   │   └── {slug}.md
│   │   ├── notes/                 # Documentation sections (markdown)
│   │   │   └── {slug}.md
│   │   └── poems/                 # Individual poems (markdown or content)
│   │       └── {slug}.md
│   ├── data/                      # Structured data (JSON)
│   │   ├── projects.json
│   │   ├── links.json
│   │   ├── house-items.json
│   │   ├── car-items.json
│   │   ├── finance-items.json
│   │   ├── book-group-items.json
│   │   ├── gallery.json
│   │   └── changelog.json         # Static snapshot
│   ├── layouts/
│   │   ├── BaseLayout.astro       # HTML shell, fonts, meta, header/footer
│   │   ├── JournalPost.astro      # Single journal post layout
│   │   └── NotesSection.astro     # Single notes section layout (sidebar + content)
│   ├── pages/
│   │   ├── index.astro            # Homepage
│   │   ├── about.astro            # About page
│   │   ├── la-familia.astro       # Photo gallery
│   │   ├── puttering/
│   │   │   ├── index.astro        # Poem listing (all poems)
│   │   │   └── [...slug].astro    # Individual poem pages
│   │   ├── notes/
│   │   │   ├── index.astro        # Notes index (links to all sections)
│   │   │   ├── now.astro          # "Now" section (with dateline)
│   │   │   ├── house.astro        # House items
│   │   │   ├── cars.astro         # Car items
│   │   │   ├── finances.astro     # Finance items
│   │   │   ├── book-group.astro   # Book group
│   │   │   ├── projects.astro     # Projects (public/internal)
│   │   │   ├── links.astro        # Curated links
│   │   │   ├── tech-stack.astro   # Tech stack (inline SVG icons)
│   │   │   ├── changelog.astro    # Changelog (static snapshot)
│   │   │   └── [...slug].astro    # CMS-sourced sections (about-me, accessibility, etc.)
│   │   ├── journal/
│   │   │   ├── index.astro        # Journal listing
│   │   │   └── [...slug].astro    # Individual journal posts
│   │   ├── feed.xml.ts            # RSS feed
│   │   ├── robots.txt.ts          # Robots.txt
│   │   └── 404.astro
│   ├── components/
│   │   ├── Header.astro           # Static header + inline JS mobile menu
│   │   ├── Footer.astro           # Static footer (squiggle image)
│   │   ├── Typewriter.astro       # Pure CSS typing animation
│   │   ├── NotesSidebar.astro     # Static sidebar nav for notes pages
│   │   ├── ProjectCard.astro      # Static project card (inline SVG icons)
│   │   ├── ArrowLink.astro        # Static link with arrow
│   │   ├── ContentCard.astro      # Static content container
│   │   ├── PageContainer.astro    # Static layout wrapper
│   │   └── JsonLd.astro           # JSON-LD renderer
│   ├── lib/
│   │   ├── constants.ts           # Site config
│   │   └── navigation.ts          # Nav links
│   ├── styles/
│   │   └── globals.css            # CSS: Rose palette, light/dark via media query
│   └── types/
│       └── content.ts             # TypeScript types for data files
├── public/
│   ├── fonts/                     # Cooper (3 weights) + TT Disruptors
│   ├── images/
│   │   ├── journal/               # Journal post images
│   │   └── gallery/               # La Familia photos
│   ├── projects/                  # Project card images
│   ├── favicon.ico, etc.
│   ├── squiggle.webp              # Footer art (single version)
│   ├── squiggle-dark.webp         # Footer art (dark mode variant)
│   ├── image.webp                 # Homepage hero
│   ├── documentation-hero.webp    # Notes index hero
│   └── puttering-bookshelf.webp   # Puttering index image
├── scripts/
│   └── migrate-sanity.ts          # One-time content migration script
├── astro.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── _redirects                     # Cloudflare Pages redirects
├── _headers                       # Cloudflare Pages security headers
└── package.json
```

### 1.3 Configuration

**astro.config.mjs:**
```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://suburbandadmode.com',
  output: 'static',
  integrations: [
    sitemap(),
  ],
});
```

No React integration. No Vite SSR config. Minimal.

**Tailwind:** Port existing `tailwind.config.ts` — same sdm-* color tokens, Cooper font family, 22px base font size, typography plugin. Remove unused color scheme mappings.

**globals.css:** Rewrite for simplicity (details in Phase 3.4).

---

## Phase 2: Content Migration

### 2.1 Migration Script (`scripts/migrate-sanity.ts`)

One-time Node.js script run against the live Sanity dataset:

1. **Connects to Sanity** using project ID `4qp7h589`, dataset `production`

2. **Exports journal entries** as markdown:
   - Converts Portable Text → Markdown via `@portabletext/to-markdown`
   - Custom serializers for: code blocks (language + filename), images (download + rewrite to local path), links
   - Frontmatter includes: `title`, `pubDate`, `excerpt`, `tags`, `draft`, `mainImage` (src + alt), `listImage` (for journal listing — replaces hardcoded `postImages` map)
   - Downloads Sanity CDN images → `public/images/journal/`
   - Saves as `src/content/journal/{slug}.md`

3. **Exports documentation sections** as markdown:
   - Same Portable Text → Markdown conversion
   - Frontmatter: `title`, `slug`, `order`
   - Saves as `src/content/notes/{slug}.md`

4. **Exports poems** as content files:
   - Frontmatter: `title`, `slug`, `order`
   - Body: poem text (preserved with line breaks)
   - Saves as `src/content/poems/{slug}.md`

5. **Exports structured data** as JSON:
   - `projects.json` — full project objects with local image paths
   - `links.json` — `[{ name, url }]`
   - `house-items.json` — `[{ title, category, order }]`
   - `car-items.json` — `[{ title, car, category, order }]`
   - `finance-items.json` — `[{ title, group, order }]`
   - `book-group-items.json` — `[{ title, author, year, meetingDate, order }]`
   - `gallery.json` — `[{ src, alt, caption }]`

6. **Downloads gallery photos** from Sanity CDN → `public/images/gallery/`

7. **Downloads project images** from Sanity CDN → `public/projects/`

8. **Exports changelog snapshot** via GitHub API → `changelog.json`

### 2.2 Portable Text → Markdown Conversion

| Portable Text | Markdown Output |
|---------------|----------------|
| Normal text | Paragraph |
| H1–H4 | `#` – `####` |
| Strong | `**bold**` |
| Emphasis | `*italic*` |
| Code (inline) | `` `code` `` |
| Link annotation | `[text](url)` |
| Bullet list | `- item` |
| Number list | `1. item` |
| Blockquote | `> quote` |
| Code block (custom type) | ` ```language ` with optional `<!-- filename -->` comment |
| Image (custom type) | `![alt](/images/journal/filename.webp)` + caption if present |

### 2.3 Content Collection Schemas

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
    listImage: z.string().optional(),  // thumbnail for journal listing
  }),
});

const notes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    order: z.number(),
  }),
});

const poems = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    order: z.number(),
  }),
});

export const collections = { journal, notes, poems };
```

### 2.4 Validation Checklist

- [ ] Journal entry count matches Sanity source
- [ ] Spot-check 5+ posts for formatting accuracy
- [ ] All inline images downloaded and referenced correctly
- [ ] Code blocks preserve language and filename
- [ ] Links, blockquotes, lists, headings render correctly
- [ ] Gallery photos all downloaded and display correctly
- [ ] Poems text preserved with line breaks
- [ ] Documentation sections convert cleanly
- [ ] Project data complete and images present
- [ ] Changelog snapshot contains expected data

---

## Phase 3: Build the Astro Site

### 3.1 Layouts

**BaseLayout.astro:**
- HTML boilerplate matching current `layout.tsx`
- `<head>`:
  - RSS feed `<link>`
  - Font preloads (Cooper light/medium/bold)
  - Favicon links
  - Theme-color meta tags (light: `#F3EFF5`, dark: `#1B1F2E`)
- `<body class="font-cooper antialiased min-h-screen flex flex-col text-sdm-text bg-sdm-background">`
- `<Header />` (Astro component — static HTML + inline JS)
- `<main id="main-content" class="flex-grow">{slot}</main>`
- `<Footer />` (Astro component)
- Props: `title`, `description`, `canonical`, `ogImage`, `ogType`, `publishedTime`, `twitterCard`
- **No ThemeScript** — dark mode via CSS `prefers-color-scheme` media query (no JS needed)
- **No Organization JSON-LD** — marginal SEO value for a personal blog

**JournalPost.astro:**
- Extends BaseLayout
- BlogPosting JSON-LD schema
- Back-to-journal nav link
- Post header: title, date (formatted via `Intl.DateTimeFormat`), main image
- `<div class="prose prose-xl max-w-none text-xl md:text-2xl font-light">` wrapper for `<slot />`
- Previous/next post navigation (computed at build time)

**NotesSection.astro:**
- Extends BaseLayout
- Includes `<NotesSidebar />` component showing all notes sections
- Active section highlighted at build time (Astro knows which page it's rendering)
- Content area with `<slot />`
- Layout: sidebar (sticky on desktop, collapsible on mobile) + content

### 3.2 Pages

**Homepage (`index.astro`):**
- Screen-reader-only `<h1>`
- Hero image: `<img src="/image.webp" width="600" height="600" />`
- Pure CSS Typewriter: `<Typewriter text="always classic" />`

**Journal listing (`journal/index.astro`):**
- `getCollection('journal')` → filter drafts → sort by pubDate desc
- Group by year and month using `Intl.DateTimeFormat`:
  ```ts
  const year = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(date)
  const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date)
  ```
- Cycling background colors (`bg-sdm-journal-1/2/3`)
- Images and excerpts from frontmatter (no hardcoded maps)
- RSS feed link (inline SVG icon, no react-icons)

**Journal post (`journal/[...slug].astro`):**
- `getStaticPaths()` from journal collection
- Adjacent posts computed at build time from sorted collection
- Render with JournalPost layout
- `<Content />` for markdown body
- Date formatted via `Intl.DateTimeFormat`

**About (`about.astro`):**
- Static content matching current page
- Remove "Get in touch" ArrowLink (dead link to removed /contact)
- Replace with link to Notes or email

**La Familia (`la-familia.astro`):**
- Read `gallery.json`
- Masonry columns: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- `loading="lazy"` (except first 3)
- Hover scale effect (CSS only)

**Puttering index (`puttering/index.astro`):**
- `getCollection('poems')` → sort by order
- List all poem titles as links to `/puttering/{slug}`
- Bookshelf image when viewing the index
- No React island — just a static list

**Individual poem (`puttering/[...slug].astro`):**
- `getStaticPaths()` from poems collection
- Poem title + text rendered in TT Disruptors font
- Previous/next poem links computed at build time
- Styled card container matching current design
- All static HTML — zero JS

**Notes index (`notes/index.astro`):**
- Hero image
- Links to all notes sections (same order as current sidebar)
- Uses NotesSection layout or standalone layout

**Notes section pages** (individual `.astro` files + `[...slug].astro`):

Each notes section becomes its own static page using `NotesSection.astro` layout:

| Page | Data Source | Rendering |
|------|-----------|-----------|
| `/notes/now` | `notes/now.md` content collection | Markdown + inline dateline script |
| `/notes/house` | `house-items.json` | Static HTML with category grouping |
| `/notes/cars` | `car-items.json` | Static HTML with vehicle + category grouping |
| `/notes/finances` | `finance-items.json` | Static HTML with group sections |
| `/notes/book-group` | `book-group-items.json` | Static HTML with reading list |
| `/notes/projects` | `projects.json` | Static ProjectCard components (public/internal) |
| `/notes/links` | `links.json` | Static link pills |
| `/notes/tech-stack` | Hardcoded + inline SVGs | Static page (no react-icons) |
| `/notes/changelog` | `changelog.json` | Static timeline |
| `/notes/[...slug]` | `notes/*.md` content collection | Markdown sections (about-me, accessibility, etc.) |

Each page includes the `NotesSidebar` component with the current section highlighted.

**404 (`404.astro`):**
- "404" heading, friendly message, back-to-home link

### 3.3 Component Details

**Header.astro (static + ~20 lines inline JS):**
```astro
---
import { navigation } from '../lib/navigation';
const pathname = Astro.url.pathname;
---
<header class="border-b border-sdm-border shadow-sm bg-sdm-card">
  <a href="#main-content" class="sr-only focus:not-sr-only ...">Skip to main content</a>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-20">
      <a href="/" class="font-display text-xl font-bold text-sdm-primary hover:text-sdm-accent transition-colors">
        Suburban Dad Mode
      </a>

      <!-- Desktop nav -->
      <nav class="hidden md:flex items-center">
        <ul class="flex space-x-8">
          {navigation.map((item) => (
            <li>
              <a
                href={item.href}
                class:list={[
                  'font-cooper text-lg transition-colors',
                  pathname === item.href || pathname.startsWith(item.href + '/')
                    ? 'text-sdm-primary font-bold'
                    : 'text-sdm-text-light hover:text-sdm-primary'
                ]}
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <!-- Mobile menu button -->
      <button
        type="button"
        id="menu-toggle"
        class="md:hidden inline-flex items-center gap-2 p-3 min-w-[44px] min-h-[44px] rounded-md text-sdm-text-light hover:text-sdm-primary"
        aria-expanded="false"
        aria-controls="mobile-menu"
        aria-label="Open main menu"
      >
        <span class="text-sm font-semibold tracking-wide uppercase">Menu</span>
        <!-- hamburger SVG inline -->
      </button>
    </div>
  </div>

  <!-- Mobile drawer -->
  <div id="mobile-backdrop" class="fixed inset-0 bg-black/30 z-40 hidden" aria-hidden="true"></div>
  <nav id="mobile-menu" class="fixed top-0 right-0 w-48 bg-sdm-overlay backdrop-blur-sm shadow-xl rounded-bl-2xl z-50 translate-x-full transition-transform" aria-label="Mobile navigation">
    <button id="menu-close" class="p-2 min-w-[44px] min-h-[44px] text-white/70 hover:text-white" aria-label="Close menu">
      <!-- X SVG inline -->
    </button>
    <div class="px-4 pb-4 space-y-0.5">
      {navigation.map((item) => (
        <a
          href={item.href}
          class:list={[
            'block px-3 py-2.5 min-h-[44px] rounded-lg text-lg font-cooper transition-colors',
            pathname === item.href ? 'text-white font-bold bg-white/20' : 'text-white/85 hover:text-white hover:bg-white/10'
          ]}
          aria-current={pathname === item.href ? 'page' : undefined}
        >
          {item.name}
        </a>
      ))}
    </div>
  </nav>
</header>

<script is:inline>
(function() {
  const toggle = document.getElementById('menu-toggle');
  const close = document.getElementById('menu-close');
  const menu = document.getElementById('mobile-menu');
  const backdrop = document.getElementById('mobile-backdrop');
  function open() {
    menu.classList.remove('translate-x-full');
    backdrop.classList.remove('hidden');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    close.focus();
  }
  function shut() {
    menu.classList.add('translate-x-full');
    backdrop.classList.add('hidden');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggle.focus();
  }
  toggle.addEventListener('click', open);
  close.addEventListener('click', shut);
  backdrop.addEventListener('click', shut);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !menu.classList.contains('translate-x-full')) shut();
  });
})();
</script>
```

~20 lines of inline JS replaces: `Header.tsx` (150 lines) + `useMobileMenu.ts` (60 lines) + `focus-trap-react` dependency. Provides: toggle, close, backdrop click, Escape key, scroll lock, focus return. The only trade-off vs. `focus-trap-react` is that Tab doesn't cycle within the menu — acceptable for a 4-link nav.

Active link highlighting is computed at build time by Astro (`Astro.url.pathname`), not at runtime via `usePathname()`.

**Footer.astro (simplified squiggle):**
```astro
<footer class="mt-20">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 flex justify-center md:justify-start">
    <picture aria-hidden="true">
      <source srcset="/squiggle-dark.webp" media="(prefers-color-scheme: dark)" />
      <img src="/squiggle.webp" alt="" width="800" height="252" class="w-64 md:w-80 opacity-90" />
    </picture>
  </div>
</footer>
```

Two image variants (light/dark) via `<picture>` + `<source media>`. Replaces the complex CSS filter chains that varied by theme and mode. Create `squiggle-dark.webp` during migration (apply the dark filter once, save the result).

**Typewriter.astro (pure CSS):**
```astro
---
interface Props { text: string; class?: string; }
const { text, class: className } = Astro.props;
---
<p class:list={['typewriter', className]} style={`--chars: ${text.length}`}>{text}</p>
<style>
  .typewriter {
    overflow: hidden;
    white-space: nowrap;
    border-right: 2px solid var(--sdm-text);
    width: 0;
    animation: typing 1.4s steps(var(--chars)) forwards, blink 0.7s step-end infinite;
  }
  @keyframes typing { to { width: 100%; } }
  @keyframes blink { 50% { border-color: transparent; } }
  @media (prefers-reduced-motion: reduce) {
    .typewriter { width: 100%; animation: none; border-right: none; }
  }
</style>
```

**NotesSidebar.astro:**
```astro
---
interface Props { current?: string; }
const { current } = Astro.props;
const sections = [
  { slug: 'about-me', title: 'About Me' },
  { slug: 'now', title: 'Now' },
  { slug: 'house', title: 'House' },
  { slug: 'cars', title: 'Cars' },
  { slug: 'finances', title: 'Finances' },
  { slug: 'book-group', title: 'Book Group' },
  { slug: 'projects', title: 'Projects' },
  { slug: 'links', title: 'Links' },
  { slug: 'accessibility', title: 'Accessibility' },
  { slug: 'tech-stack', title: 'Tech Stack' },
  { slug: 'changelog', title: 'Changelog' },
];
---
<nav class="md:w-56 shrink-0 md:sticky md:top-24 md:self-start" aria-label="Notes sections">
  <details class="md:[&>summary]:hidden md:open" open>
    <summary class="w-full flex items-center justify-between py-2.5 px-3 text-left font-cooper text-lg font-semibold text-sdm-text border-b border-sdm-text/20 cursor-pointer md:cursor-default">
      Notes
      <span class="text-sdm-text-light md:hidden">&#9662;</span>
    </summary>
    <ul class="py-1">
      {sections.map(s => (
        <li>
          <a
            href={`/notes/${s.slug}`}
            class:list={[
              'block w-full text-left py-1.5 px-5 font-cooper text-base transition-colors',
              current === s.slug ? 'text-sdm-primary font-semibold' : 'text-sdm-text-light hover:text-sdm-primary'
            ]}
            aria-current={current === s.slug ? 'page' : undefined}
          >
            {s.title}
          </a>
        </li>
      ))}
    </ul>
  </details>
</nav>
```

Uses `<details>/<summary>` for mobile collapsibility — zero JS. On desktop, the `md:[&>summary]:hidden md:open` classes hide the summary and keep the list always open.

**Dateline replacement (inline script in `notes/now.astro`):**
```astro
<p class="text-sdm-text-light font-cooper text-lg" role="status">
  <span id="dateline-date"></span>
  <span class="mx-1.5" aria-hidden="true">&middot;</span>
  <span id="dateline-time"></span>
  <span class="mx-1.5 hidden sm:inline" aria-hidden="true">&middot;</span>
  <br class="sm:hidden" />
  <span>Cranston, RI</span>
</p>
<script is:inline>
(function() {
  var tz = 'America/New_York';
  var d = document.getElementById('dateline-date');
  var t = document.getElementById('dateline-time');
  function tick() {
    var now = new Date();
    d.textContent = new Intl.DateTimeFormat('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric', timeZone:tz }).format(now);
    t.textContent = new Intl.DateTimeFormat('en-US', { hour:'numeric', minute:'2-digit', timeZone:tz }).format(now);
  }
  tick();
  setInterval(tick, 60000);
})();
</script>
```

~10 lines replaces: `useDateline.ts` (109 lines) + `Dateline.tsx` (32 lines) + `weather.ts` (46 lines) + Open-Meteo API dependency. Drops the weather display (users have weather apps). Keeps live date/time updating every minute.

**ProjectCard.astro (inline SVG icons):**
- Port current ProjectCard design
- Replace `react-icons` tech stack icons with inline SVGs
- Extract the ~15 specific SVG paths used in `tech-icons.ts` into a simple Astro helper or inline them directly
- Static component, zero JS

**JsonLd.astro:**
```astro
---
interface Props { data: Record<string, unknown>; }
const { data } = Astro.props;
const json = JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
---
<script type="application/ld+json" set:html={json} />
```

### 3.4 Styling — Simplified

**Dark mode approach change:** Replace class-based toggling (`:root.dark`) with CSS `prefers-color-scheme` media query. This eliminates:
- `ThemeScript.tsx` (no FOUC prevention needed — media queries apply instantly)
- `useTheme.ts` hook (183 lines)
- `ThemeToggle.tsx` component (174 lines)
- `sdm-theme` localStorage key
- The React island required to host ThemeToggle
- `suppressHydrationWarning` on `<html>`

**globals.css rewrite:**
```css
/* Font faces — same 4 fonts */
@font-face { font-family: 'Cooper'; src: url('/fonts/cooper_light.woff2') ...; font-weight: 300; }
@font-face { font-family: 'Cooper'; src: url('/fonts/cooper_medium.woff2') ...; font-weight: normal; }
@font-face { font-family: 'Cooper'; src: url('/fonts/cooper_bold.woff2') ...; font-weight: bold; }
@font-face { font-family: 'TT Disruptors'; src: url('/fonts/TT_Disruptors_Regular.woff2') ...; }

/* Rose palette — light (default) */
:root {
  --sdm-primary: #B33D5E;
  --sdm-accent: #2EC4B6;
  --sdm-background: #F3EFF5;
  --sdm-text: #1D3557;
  --sdm-text-light: #3D6F8F;
  --sdm-card: #FFFFFF;
  --sdm-border: #E7E5E4;
  --sdm-surface-subtle: #F5F5F4;
  --sdm-border-input: #D6D3D1;
  --sdm-primary-subtle: rgba(179, 61, 94, 0.1);
  --sdm-overlay: rgba(179, 61, 94, 0.8);
  --sdm-journal-1: rgba(179, 61, 94, 0.12);
  --sdm-journal-2: rgba(46, 196, 182, 0.12);
  --sdm-journal-3: rgba(176, 128, 48, 0.14);
}

/* Rose palette — dark (auto via OS preference) */
@media (prefers-color-scheme: dark) {
  :root {
    --sdm-primary: #D4597D;
    --sdm-accent: #38D4C6;
    --sdm-background: #1B1F2E;
    --sdm-text: #E2DFE4;
    --sdm-text-light: #9EADC0;
    --sdm-card: #252A3B;
    --sdm-border: #333847;
    --sdm-surface-subtle: #262B38;
    --sdm-border-input: #414756;
    --sdm-primary-subtle: rgba(212, 89, 125, 0.15);
    --sdm-overlay: rgba(212, 89, 125, 0.85);
    --sdm-journal-1: rgba(212, 89, 125, 0.15);
    --sdm-journal-2: rgba(56, 212, 198, 0.15);
    --sdm-journal-3: rgba(212, 168, 74, 0.15);
  }
}

/* Tailwind v4 theme bridge */
@theme inline {
  --font-cooper: 'Cooper', serif;
  --font-display: 'Cooper', serif;
  --color-sdm-primary: var(--sdm-primary);
  --color-sdm-accent: var(--sdm-accent);
  /* ... all sdm-* tokens ... */
}

/* Selection */
::selection { background-color: var(--sdm-primary); color: white; }

/* Focus */
:focus-visible { outline: 2px solid var(--sdm-primary); outline-offset: 2px; }

/* Prose spacing */
.prose p { margin-top: 1.25em; margin-bottom: 1.25em; }
.prose p:first-child { margin-top: 0; }
.prose p:last-child { margin-bottom: 0; }

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
@media (prefers-reduced-motion: no-preference) {
  html { scroll-behavior: smooth; }
}
```

**What's removed from current globals.css:**
- `:root.dark` block (replaced by `@media (prefers-color-scheme: dark)`)
- All `data-theme` variants (~200 lines: ocean, forest, sunset, midnight, grayscale)
- Custom scrollbar styling (~15 lines — WebKit-only, cosmetic)
- Footer squiggle filter chains (~20 lines — replaced by `<picture>` element)
- `--scrollbar-*` custom properties
- `color-scheme` property (browser handles this automatically with media query)

**Estimated globals.css:** ~150 lines (down from 495).

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

Sitemap auto-generated by `@astrojs/sitemap`.

```
User-agent: *
Allow: /
Sitemap: https://suburbandadmode.com/sitemap-index.xml
```

---

## Phase 4: SEO & Redirects

### 4.1 URL Parity

| Current URL | Astro URL | Status |
|---|---|---|
| `/` | `/` | Match |
| `/journal` | `/journal` | Match |
| `/journal/{slug}` | `/journal/{slug}` | Match |
| `/about` | `/about` | Match |
| `/contact` | `/` | 301 redirect |
| `/la-familia` | `/la-familia` | Match |
| `/puttering` | `/puttering` | Match (now a listing page) |
| `/puttering?poem={slug}` | `/puttering/{slug}` | 301 redirect |
| `/notes` | `/notes` | Match (now an index page) |
| `/notes?section={slug}` | `/notes/{slug}` | 301 redirect |
| `/feed.xml` | `/feed.xml` | Match |

Configure Astro `trailingSlash` to match current behavior.

### 4.2 Cloudflare `_redirects`

```
# WordPress migration
/posts/:slug  /journal/:slug  301
/documentation  /notes  301
/category/*  /journal  301
/categories/*  /journal  301

# Removed pages
/contact  /  301

# Old query-param routes → new clean routes
/projects  /notes/projects  301
/notes?section=:slug  /notes/:slug  301
/puttering?poem=:slug  /puttering/:slug  301
```

Note: Cloudflare Pages `_redirects` may not support query param matching. If not, add a small inline script on `/notes` and `/puttering` index pages that checks for the old query param and redirects client-side:
```js
const p = new URLSearchParams(location.search).get('section');
if (p) location.replace('/notes/' + p);
```

WWW → non-WWW handled at Cloudflare DNS level.

### 4.3 Meta Tags

- Global title template: `{page} | Suburban Dad Mode`
- Per-page: canonical URL, OpenGraph, Twitter cards
- Journal posts: `article` og:type, `summary_large_image` Twitter card, dynamic og:image from mainImage

### 4.4 Structured Data

- **BlogPosting** JSON-LD on journal posts (keep — good SEO value)
- **Organization** JSON-LD: drop (marginal value for personal blog)
- **BreadcrumbList** JSON-LD: drop (marginal value, one less thing to maintain)

---

## Phase 5: Cloudflare Pages Deployment

### 5.1 Build Configuration

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Output directory | `dist` |
| Node.js version | 20+ |
| Env vars needed | None |

### 5.2 Security Headers (`_headers`)

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; frame-ancestors 'none'; object-src 'none'

/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/_astro/*
  Cache-Control: public, max-age=31536000, immutable
```

Simplified vs. current: removed Sanity CDN, Sentry, Open-Meteo, GitHub API from CSP `connect-src`. Removed unused permissions (payment, usb, browsing-topics). Removed `blob:` from img-src (no longer used).

### 5.3 Custom Domain Cutover

1. Push Astro project to new GitHub repo
2. Connect to Cloudflare Pages
3. Add custom domain `suburbandadmode.com`
4. Update DNS (remove Vercel CNAME → add CF Pages CNAME)
5. SSL provisions automatically
6. Monitor 24-48 hours

---

## Phase 6: What Gets Removed

| Removed | Reason |
|---------|--------|
| **React** (react, react-dom) | Zero islands — all pages static |
| **Sanity** (client, studio, next-sanity, image-url, vision, color-input, hotspot-array) | Content in git |
| **Sentry** (nextjs integration) | No server code |
| **Upstash** (ratelimit, redis) | No API routes |
| **focus-trap-react** | Simple inline JS menu |
| **react-icons** | Inline SVGs |
| **date-fns** | `Intl.DateTimeFormat` |
| **server-only** | No server components |
| Contact page | Owner decision |
| 5 color themes | Rose only |
| Theme toggle UI | OS preference via CSS |
| ThemeScript (FOUC prevention) | Not needed with CSS media query |
| Live weather dateline | Inline date script, no weather |
| DocumentationContent.tsx (545 lines) | Separate static pages |
| PutteringContent.tsx (133 lines) | Separate static pages |
| useTheme.ts (183 lines) | CSS handles it |
| ThemeToggle.tsx (174 lines) | Removed |
| Header.tsx (150 lines) | Astro component + 20-line script |
| useDateline.ts (109 lines) | 10-line inline script |
| useMobileMenu.ts (60 lines) | Part of header script |
| weather.ts (46 lines) | Removed |
| PortableText.tsx | Astro markdown rendering |
| All `src/lib/` except constants + navigation | No CMS, no API security, no validation, no logging |
| `sentry.*.config.ts` | No Sentry |
| `vercel.json`, `.vercelignore` | No Vercel |
| `next.config.ts` | Replaced by `astro.config.mjs` |
| `site.webmanifest` | Blog doesn't need PWA |

---

## Phase 7: Pre-Launch Checklist

### Functional
- [ ] All journal entries render with correct formatting
- [ ] Journal listing groups by year/month, images + excerpts from frontmatter
- [ ] Journal post prev/next navigation works
- [ ] Homepage hero image + CSS typewriter work
- [ ] About page content matches (dead /contact link removed)
- [ ] La Familia gallery displays all photos
- [ ] Puttering index lists all poems
- [ ] Each poem page renders correctly with TT Disruptors font
- [ ] Poem prev/next links work
- [ ] Notes index links to all sections
- [ ] Each notes section page renders correctly
- [ ] Notes sidebar highlights current section
- [ ] Notes sidebar collapses on mobile (details/summary)
- [ ] Now page dateline shows live date/time
- [ ] House/Cars/Finances/Book Group pages render data
- [ ] Projects page shows public/internal groups
- [ ] Links page shows curated links
- [ ] Tech Stack page renders with inline SVG icons
- [ ] Changelog page shows static snapshot timeline
- [ ] RSS feed validates
- [ ] Sitemap generates with all routes (including new /notes/* and /puttering/* routes)
- [ ] 404 page works
- [ ] All redirects work (/contact, /posts/*, /notes?section=*, /puttering?poem=*)

### Visual
- [ ] Screenshot comparison: every page at 1440px
- [ ] Screenshot comparison: every page at 375px
- [ ] Dark mode renders correctly via OS preference
- [ ] No FOUC (CSS media query applies instantly)
- [ ] Mobile menu opens/closes correctly
- [ ] Escape key closes mobile menu
- [ ] Footer squiggle shows correct variant per color scheme
- [ ] Selection colors work in light + dark

### SEO
- [ ] All existing URLs either match or redirect
- [ ] Canonical URLs on every page
- [ ] OG + Twitter metadata correct per page
- [ ] BlogPosting JSON-LD valid on journal posts
- [ ] Trailing slash behavior consistent

### Performance
- [ ] Lighthouse ≥ 95 across all categories
- [ ] Zero framework JS in network tab
- [ ] Font preloading works
- [ ] Images lazy-load
- [ ] No layout shifts

---

## Phase 8: Post-Migration Workflow

### Writing a New Post

```bash
cat > src/content/journal/my-new-post.md << 'EOF'
---
title: "My New Post"
pubDate: 2026-03-15
excerpt: "A brief description"
tags: ["life"]
listImage: "/images/journal/my-new-post.webp"
---

Post content in standard markdown...
EOF

# Add images, commit, push — Cloudflare auto-deploys in ~1-2 min
```

### Adding a Poem

Create `src/content/poems/new-poem.md` with title, order, and poem text. Commit and push.

### Updating Notes Data

Edit JSON files in `src/data/`. Commit and push.

### Adding a Notes Section

Create `src/content/notes/new-section.md`. Add an entry to the `sections` array in `NotesSidebar.astro`. Commit and push.

### Optional Post-Launch Enhancements

- **Pagefind** — static client-side search (zero server cost)
- **Cloudflare Web Analytics** — free, privacy-respecting
- **Keystatic** — visual editor UI on top of existing markdown files

---

## Risk Mitigation

1. **Keep Vercel running** until Cloudflare is fully verified
2. **Migration script is idempotent** — safe to re-run
3. **All content in git** — full version history, zero data loss
4. **Cloudflare instant rollbacks** — one click to revert
5. **URL parity verification** — automated crawl comparison before cutover
6. **Screenshot comparison** — visual regression testing at two viewports
7. **DNS propagation** — low TTL before cutover, monitor 48 hours after

---

## Final Dependency List

```json
{
  "devDependencies": {
    "astro": "^5.x",
    "@astrojs/rss": "^4.x",
    "@astrojs/sitemap": "^3.x",
    "tailwindcss": "^4.x",
    "@tailwindcss/postcss": "^4.x",
    "@tailwindcss/typography": "^0.5.x",
    "typescript": "^5.x"
  }
}
```

**7 dependencies.** Down from 37. Zero production dependencies.

**Migration script (one-time, not shipped):**
```json
{
  "@sanity/client": "^7.x",
  "@portabletext/to-markdown": "latest"
}
```
