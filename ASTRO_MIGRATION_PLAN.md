# Astro Migration Plan — Suburban Dad Mode

## From: Next.js 16 + Sanity CMS + Vercel
## To: Astro + Markdown/Data Files + Cloudflare Pages

---

## Executive Summary

Migrate suburbandadmode.com from Next.js/Sanity/Vercel to Astro with local content files on Cloudflare Pages. This plan combines the platform migration with an aggressive simplification: cutting the entire Notes section, dropping Tailwind in favor of vanilla CSS, eliminating all React islands, and reducing the site to its essential pages — homepage, journal, about, photo gallery, and poetry.

**The site will be simpler in both form and content.** Not a 1:1 port — a deliberate reduction.

### Decisions Made

- **Legacy WordPress posts:** Skip entirely (not displayed on current site)
- **Notes section:** Remove entirely (house, cars, finances, book-group, projects, links, accessibility, tech-stack, changelog, now, about-me)
- **Project location:** New directory alongside current repo (`suburban-dad-mode/` sibling to `nextjs-blog/`)
- **Contact page:** Remove entirely
- **Changelog:** Remove entirely
- **Dateline:** Remove entirely (no weather, no live clock)
- **Typewriter effect:** Remove — static text
- **Color themes:** Rose only — drop Ocean, Forest, Sunset, Midnight, Grayscale
- **Dark mode:** Remove — single light palette (Dark Reader for users who want it)
- **Tailwind:** Remove — vanilla CSS (~150 lines)
- **JSON-LD:** Remove entirely (marginal SEO value for a personal blog)
- **Sitemap integration:** Remove (`@astrojs/sitemap`) — Google crawls fine with 9 pages
- **Footer squiggle:** Remove — clean footer
- **Journal grouping/colors:** Remove — flat reverse-chronological list
- **Cooper Bold font:** Remove — keep light + medium only
- **La Familia:** Keep
- **Puttering (poetry):** Keep — with TT Disruptors font

### Simplifications Applied

| Simplification | What it eliminates | Lines saved |
|---------------|-------------------|-------------|
| Remove entire Notes section | `DocumentationContent.tsx` (545), `NotesSidebar`, 11 section pages, 7 JSON data files, sidebar nav, notes layout | ~800+ |
| Remove dateline entirely | `useDateline.ts` (109), `Dateline.tsx` (32), `weather.ts` (46) | ~190 |
| Remove changelog | `github.ts`, changelog data, GitHub API integration | ~100 |
| Remove tech-stack page | `TechStackContent.tsx`, `tech-icons.ts`, inline SVGs | ~150 |
| Remove projects page | `ProjectCard.tsx`, projects data/images | ~100 |
| Flatten Puttering into individual poem pages | `PutteringContent.tsx` (133 lines), Suspense wrapper | ~150 |
| Drop dark mode entirely | `useTheme.ts` (183), `ThemeToggle.tsx` (174), `ThemeScript.tsx` (15), dark color palette, squiggle-dark.webp | ~370 |
| Drop Tailwind — vanilla CSS | `tailwind.config.ts`, 3 Tailwind deps, theme bridge in globals.css | 3 deps removed |
| Drop JSON-LD entirely | `JsonLd` component, BlogPosting schema on every post | ~40 |
| Drop `@astrojs/sitemap` | sitemap generation config | 1 dep removed |
| Drop footer squiggle | squiggle.webp, squiggle-dark.webp, `<picture>` element | assets removed |
| Drop journal year/month grouping + cycling colors | Grouping logic, 3 journal color tokens | ~30 |
| Drop typewriter effect | CSS animation, `Typewriter.astro` component | ~15 |
| Drop Cooper Bold font weight | 1 font file (~50KB) | asset removed |
| Static Astro header + inline JS mobile menu | `Header.tsx` (150), `useMobileMenu.ts` (60), `focus-trap-react` dep | ~210 |
| Drop `date-fns` — use `Intl.DateTimeFormat` | `date-fns` dependency | dep removed |
| Drop `react-icons` | `react-icons` dependency, `tech-icons.ts` mapping | dep removed |
| Move post images/excerpts to frontmatter | Hardcoded `postImages` and `fallbackExcerpts` maps in journal page | ~30 |
| Drop custom scrollbar CSS | WebKit-only cosmetic styling | ~15 |
| Drop PWA manifest | `site.webmanifest`, icon references | config removed |
| Remove About page dead link | ArrowLink to removed `/contact` | ~5 |

**Result: Zero React. Zero framework JS. Zero Tailwind.** The entire site is static HTML + vanilla CSS + ~15 lines of inline JS (mobile menu toggle).

---

## Current → Target Comparison

### Dependency Count

| | Current (Next.js) | Target (Astro) |
|---|---|---|
| Production deps | 19 | 0 |
| Dev/build deps | 18 | 3 |
| **Total** | **37** | **3** |

Target dependencies:
```
astro
@astrojs/rss
typescript
```

No React. No Tailwind. No Sanity. No date-fns. No react-icons. No focus-trap-react.

### Client-Side JavaScript

| | Current | Target |
|---|---|---|
| React islands | 5 (Header, ThemeToggle, Dateline, PutteringContent, DocumentationContent) | 0 |
| Custom hooks | 3 (useTheme, useDateline, useMobileMenu) | 0 |
| Framework JS shipped | React 19 + island hydration code | None |
| Inline scripts | 1 (ThemeScript, 200 bytes) | 1 (~15 lines: mobile menu) |
| External API calls (client) | 1 (Open-Meteo weather) | 0 |

### Pages

| Current Route | Target Route | Change |
|---|---|---|
| `/` | `/` | Simplified (static text, no typewriter) |
| `/journal` | `/journal` | Simplified (flat list, no grouping/colors) |
| `/journal/[slug]` | `/journal/[slug]` | Same (no JSON-LD) |
| `/about` | `/about` | Same (remove dead /contact link) |
| `/contact` | Removed | 301 → `/` |
| `/la-familia` | `/la-familia` | Same |
| `/puttering` | `/puttering` | Poem index (list of all poems) |
| — | `/puttering/[slug]` | **New:** individual poem pages |
| `/notes` (SPA) | Removed | 301 → `/about` |
| `/notes?section=*` | Removed | 301 → `/about` |
| `/feed.xml` | `/feed.xml` | Same |

**9 routes** (home, journal index, journal posts, about, la-familia, puttering index, puttering poems, feed, 404). Down from ~20.

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
- **No `@astrojs/react`** — zero React
- **No `@astrojs/sitemap`** — unnecessary for 9 pages
- Install `@astrojs/rss` for RSS feed
- **No Tailwind** — vanilla CSS

### 1.2 Project Structure

```
suburban-dad-mode/
├── src/
│   ├── content/
│   │   ├── config.ts              # Content collection schemas
│   │   ├── journal/               # Blog posts (markdown)
│   │   │   └── {slug}.md
│   │   └── poems/                 # Individual poems (markdown)
│   │       └── {slug}.md
│   ├── data/
│   │   └── gallery.json           # La Familia photo data
│   ├── layouts/
│   │   ├── BaseLayout.astro       # HTML shell, fonts, meta, header/footer
│   │   └── JournalPost.astro      # Single journal post layout
│   ├── pages/
│   │   ├── index.astro            # Homepage
│   │   ├── about.astro            # About page
│   │   ├── la-familia.astro       # Photo gallery
│   │   ├── puttering/
│   │   │   ├── index.astro        # Poem listing
│   │   │   └── [...slug].astro    # Individual poem pages
│   │   ├── journal/
│   │   │   ├── index.astro        # Journal listing (flat list)
│   │   │   └── [...slug].astro    # Individual journal posts
│   │   ├── feed.xml.ts            # RSS feed
│   │   └── 404.astro
│   ├── components/
│   │   ├── Header.astro           # Static header + inline JS mobile menu
│   │   └── Footer.astro           # Minimal footer (copyright line)
│   ├── lib/
│   │   └── constants.ts           # Site config (name, URL, description)
│   └── styles/
│       └── globals.css            # ~150 lines: fonts, 5 color vars, prose, layout
├── public/
│   ├── fonts/                     # Cooper light + medium, TT Disruptors (3 files)
│   ├── images/
│   │   ├── journal/               # Post images
│   │   └── gallery/               # La Familia photos
│   ├── image.webp                 # Homepage hero
│   ├── puttering-bookshelf.webp   # Puttering index image
│   └── favicon.ico
├── scripts/
│   └── migrate-sanity.ts          # One-time content migration script
├── astro.config.mjs
├── tsconfig.json
├── _redirects                     # Cloudflare Pages redirects
├── _headers                       # Cloudflare Pages security headers
└── package.json
```

### 1.3 Configuration

**astro.config.mjs:**
```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://suburbandadmode.com',
  output: 'static',
});
```

That's the entire config. No integrations. No plugins.

---

## Phase 2: Content Migration

### 2.1 Migration Script (`scripts/migrate-sanity.ts`)

One-time Node.js script run against the live Sanity dataset:

1. **Connects to Sanity** using project ID `4qp7h589`, dataset `production`

2. **Exports journal entries** as markdown:
   - Converts Portable Text → Markdown via `@portabletext/to-markdown`
   - Custom serializers for: code blocks (language + filename), images (download + rewrite to local path), links
   - Frontmatter includes: `title`, `pubDate`, `excerpt`, `tags`, `draft`, `mainImage` (src + alt), `listImage` (for journal listing)
   - Downloads Sanity CDN images → `public/images/journal/`
   - Saves as `src/content/journal/{slug}.md`

3. **Exports poems** as content files:
   - Frontmatter: `title`, `slug`, `order`
   - Body: poem text (preserved with line breaks)
   - Saves as `src/content/poems/{slug}.md`

4. **Exports gallery data** as JSON:
   - `gallery.json` — `[{ src, alt, caption }]`
   - Downloads gallery photos from Sanity CDN → `public/images/gallery/`

That's it. No projects, links, house-items, car-items, finance-items, book-group-items, or changelog.

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
    listImage: z.string().optional(),
  }),
});

const poems = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    order: z.number(),
  }),
});

export const collections = { journal, poems };
```

Two collections. No `notes` collection.

### 2.4 Validation Checklist

- [ ] Journal entry count matches Sanity source
- [ ] Spot-check 5+ posts for formatting accuracy
- [ ] All inline images downloaded and referenced correctly
- [ ] Code blocks preserve language and filename
- [ ] Links, blockquotes, lists, headings render correctly
- [ ] Gallery photos all downloaded and display correctly
- [ ] Poems text preserved with line breaks

---

## Phase 3: Build the Astro Site

### 3.1 Layouts

**BaseLayout.astro:**
- HTML boilerplate
- `<head>`:
  - RSS feed `<link>`
  - Font preloads (Cooper light + medium only — 2 files)
  - Favicon
- `<body>` with base styles via CSS class
- `<Header />` (Astro component — static HTML + inline JS)
- `<main id="main-content">{slot}</main>`
- `<Footer />` (minimal)
- Props: `title`, `description`, `canonical`, `ogImage`, `ogType`, `publishedTime`, `twitterCard`
- **No ThemeScript** — no dark mode
- **No JSON-LD** — removed entirely

**JournalPost.astro:**
- Extends BaseLayout
- Back-to-journal nav link
- Post header: title, date (formatted via `Intl.DateTimeFormat`), main image
- Prose wrapper for `<slot />`
- Previous/next post navigation (computed at build time)

### 3.2 Pages

**Homepage (`index.astro`):**
- Screen-reader-only `<h1>`
- Hero image: `<img src="/image.webp" width="600" height="600" />`
- Static text: "always classic" — no animation, no typewriter

**Journal listing (`journal/index.astro`):**
- `getCollection('journal')` → filter drafts → sort by pubDate desc
- **Flat reverse-chronological list** — no year/month grouping, no cycling background colors
- Each entry: title (linked), date, optional excerpt
- Images from frontmatter
- RSS feed link (plain text link, no icon)

**Journal post (`journal/[...slug].astro`):**
- `getStaticPaths()` from journal collection
- Adjacent posts computed at build time from sorted collection
- Render with JournalPost layout
- `<Content />` for markdown body
- Date formatted via `Intl.DateTimeFormat`
- No JSON-LD

**About (`about.astro`):**
- Static content matching current page
- Remove "Get in touch" ArrowLink (dead link to removed /contact)
- Fold in any useful bits from the old Notes "About Me" section if desired
- Link to GitHub profile for projects

**La Familia (`la-familia.astro`):**
- Read `gallery.json`
- Responsive grid: CSS Grid with `auto-fill` columns
- `loading="lazy"` (except first 3)
- Hover scale effect (CSS only)

**Puttering index (`puttering/index.astro`):**
- `getCollection('poems')` → sort by order
- List all poem titles as links to `/puttering/{slug}`
- Bookshelf image when viewing the index
- All static HTML — zero JS

**Individual poem (`puttering/[...slug].astro`):**
- `getStaticPaths()` from poems collection
- Poem title + text rendered in TT Disruptors font
- Previous/next poem links computed at build time
- Styled card container matching current design
- All static HTML — zero JS

**404 (`404.astro`):**
- "404" heading, friendly message, back-to-home link

### 3.3 Component Details

**Header.astro (static + ~15 lines inline JS):**
```astro
---
const pathname = Astro.url.pathname;
const nav = [
  { name: 'Journal', href: '/journal' },
  { name: 'About', href: '/about' },
  { name: 'La Familia', href: '/la-familia' },
  { name: 'Puttering', href: '/puttering' },
];
---
<header>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <div class="header-inner">
    <a href="/" class="site-title">Suburban Dad Mode</a>

    <!-- Desktop nav -->
    <nav class="desktop-nav" aria-label="Main navigation">
      <ul>
        {nav.map((item) => (
          <li>
            <a
              href={item.href}
              class={pathname === item.href || pathname.startsWith(item.href + '/') ? 'active' : ''}
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
      class="menu-toggle"
      aria-expanded="false"
      aria-controls="mobile-menu"
      aria-label="Open main menu"
    >
      Menu
    </button>
  </div>

  <!-- Mobile drawer -->
  <div id="mobile-backdrop" class="backdrop hidden" aria-hidden="true"></div>
  <nav id="mobile-menu" class="mobile-menu closed" aria-label="Mobile navigation">
    <button id="menu-close" class="menu-close" aria-label="Close menu">&times;</button>
    <div class="mobile-links">
      {nav.map((item) => (
        <a
          href={item.href}
          class={pathname === item.href ? 'active' : ''}
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
  var toggle = document.getElementById('menu-toggle');
  var close = document.getElementById('menu-close');
  var menu = document.getElementById('mobile-menu');
  var backdrop = document.getElementById('mobile-backdrop');
  function open() {
    menu.classList.remove('closed');
    backdrop.classList.remove('hidden');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    close.focus();
  }
  function shut() {
    menu.classList.add('closed');
    backdrop.classList.add('hidden');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggle.focus();
  }
  toggle.addEventListener('click', open);
  close.addEventListener('click', shut);
  backdrop.addEventListener('click', shut);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !menu.classList.contains('closed')) shut();
  });
})();
</script>
```

~15 lines of inline JS. Navigation is 4 links: Journal, About, La Familia, Puttering. Active link highlighting computed at build time.

**Footer.astro (minimal):**
```astro
<footer>
  <p>&copy; {new Date().getFullYear()} Suburban Dad Mode</p>
</footer>
```

No squiggle image. No dark variant. Just a copyright line.

### 3.4 Styling — Vanilla CSS

**No Tailwind.** The entire design is expressed in ~150 lines of vanilla CSS using 5 CSS custom properties.

**globals.css:**
```css
/* === Fonts === */
@font-face { font-family: 'Cooper'; src: url('/fonts/cooper_light.woff2') format('woff2'); font-weight: 300; font-display: swap; }
@font-face { font-family: 'Cooper'; src: url('/fonts/cooper_medium.woff2') format('woff2'); font-weight: 500; font-display: swap; }
@font-face { font-family: 'TT Disruptors'; src: url('/fonts/TT_Disruptors_Regular.woff2') format('woff2'); font-display: swap; }

/* === Color palette (5 tokens) === */
:root {
  --text: #1D3557;
  --text-light: #3D6F8F;
  --bg: #F3EFF5;
  --accent: #B33D5E;
  --border: #E7E5E4;
}

/* === Base === */
*, *::before, *::after { box-sizing: border-box; margin: 0; }

html { font-size: 22px; }

body {
  font-family: 'Cooper', Georgia, serif;
  font-weight: 300;
  color: var(--text);
  background: var(--bg);
  line-height: 1.6;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  -webkit-font-smoothing: antialiased;
}

main { flex: 1; max-width: 42rem; margin: 0 auto; padding: 2rem 1rem; width: 100%; }

a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }

img { max-width: 100%; height: auto; display: block; }

::selection { background: var(--accent); color: white; }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

/* === Header === */
header { border-bottom: 1px solid var(--border); }
.header-inner { max-width: 42rem; margin: 0 auto; padding: 0 1rem; display: flex; align-items: center; justify-content: space-between; height: 5rem; }
.site-title { font-weight: 500; font-size: 1.1rem; color: var(--accent); text-decoration: none; }
.site-title:hover { text-decoration: none; opacity: 0.8; }
.desktop-nav ul { display: flex; gap: 2rem; list-style: none; padding: 0; }
.desktop-nav a { color: var(--text-light); font-size: 0.82rem; transition: color 0.15s; }
.desktop-nav a:hover, .desktop-nav a.active { color: var(--accent); text-decoration: none; }
.desktop-nav a.active { font-weight: 500; }
.menu-toggle { display: none; }
.skip-link { position: absolute; left: -9999px; }
.skip-link:focus { left: 1rem; top: 1rem; z-index: 100; background: var(--bg); padding: 0.5rem 1rem; }

@media (max-width: 768px) {
  .desktop-nav { display: none; }
  .menu-toggle { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem; min-width: 44px; min-height: 44px; border: none; background: none; color: var(--text-light); font-family: inherit; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; }
}

/* Mobile menu */
.backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 40; }
.backdrop.hidden { display: none; }
.mobile-menu { position: fixed; top: 0; right: 0; width: 12rem; background: rgba(179,61,94,0.9); backdrop-filter: blur(8px); z-index: 50; border-bottom-left-radius: 1rem; box-shadow: -2px 0 12px rgba(0,0,0,0.2); transform: translateX(0); transition: transform 0.2s ease; }
.mobile-menu.closed { transform: translateX(100%); }
.menu-close { display: block; padding: 0.75rem; min-width: 44px; min-height: 44px; border: none; background: none; color: rgba(255,255,255,0.7); font-size: 1.5rem; cursor: pointer; }
.mobile-links { padding: 0 1rem 1rem; }
.mobile-links a { display: block; padding: 0.6rem 0.75rem; min-height: 44px; color: rgba(255,255,255,0.85); font-size: 0.9rem; border-radius: 0.5rem; }
.mobile-links a:hover { background: rgba(255,255,255,0.1); color: white; text-decoration: none; }
.mobile-links a.active { font-weight: 500; color: white; background: rgba(255,255,255,0.2); }

/* === Footer === */
footer { margin-top: 4rem; padding: 2rem 1rem; text-align: center; color: var(--text-light); font-size: 0.7rem; }

/* === Prose (journal posts) === */
.prose h1, .prose h2, .prose h3, .prose h4 { font-weight: 500; margin: 1.5em 0 0.5em; }
.prose h2 { font-size: 1.3rem; }
.prose h3 { font-size: 1.1rem; }
.prose p { margin: 1.25em 0; }
.prose p:first-child { margin-top: 0; }
.prose ul, .prose ol { padding-left: 1.5em; margin: 1em 0; }
.prose li { margin: 0.25em 0; }
.prose blockquote { border-left: 3px solid var(--accent); padding-left: 1em; margin: 1.25em 0; color: var(--text-light); font-style: italic; }
.prose pre { background: #1e1e2e; color: #cdd6f4; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 1.25em 0; font-size: 0.7rem; font-family: 'SF Mono', 'Fira Code', monospace; }
.prose code { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 0.8em; }
.prose :not(pre) > code { background: rgba(0,0,0,0.06); padding: 0.15em 0.3em; border-radius: 0.25rem; }
.prose img { border-radius: 0.5rem; margin: 1.5em 0; }
.prose a { color: var(--accent); text-decoration: underline; }

/* === Journal listing === */
.journal-list { list-style: none; padding: 0; }
.journal-item { padding: 1rem 0; border-bottom: 1px solid var(--border); }
.journal-item:last-child { border-bottom: none; }
.journal-title { font-weight: 500; font-size: 1.1rem; }
.journal-title a { color: var(--text); }
.journal-title a:hover { color: var(--accent); }
.journal-date { color: var(--text-light); font-size: 0.7rem; }
.journal-excerpt { color: var(--text-light); font-size: 0.82rem; margin-top: 0.25em; }

/* === Gallery (La Familia) === */
.gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem; }
.gallery-item img { border-radius: 0.5rem; width: 100%; aspect-ratio: 1; object-fit: cover; transition: transform 0.2s; }
.gallery-item img:hover { transform: scale(1.03); }

/* === Puttering (poetry) === */
.poem-card { background: white; border-radius: 0.75rem; padding: 2rem; max-width: 36rem; margin: 0 auto; }
.poem-text { font-family: 'TT Disruptors', cursive; font-size: 1rem; line-height: 1.8; white-space: pre-line; }
.poem-nav { display: flex; justify-content: space-between; margin-top: 2rem; font-size: 0.8rem; }

/* === Reduced motion === */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
@media (prefers-reduced-motion: no-preference) {
  html { scroll-behavior: smooth; }
}
```

~150 lines. No build tool for styling. No Tailwind classes. Semantic CSS that reads like what it does.

**What's gone vs. current globals.css (495 lines):**
- `:root.dark` block (no dark mode)
- `@media (prefers-color-scheme: dark)` (no dark mode)
- All `data-theme` variants (~200 lines)
- Custom scrollbar styling
- Footer squiggle filter chains
- Tailwind theme bridge (`@theme inline`)
- 10+ extra CSS custom properties (sdm-card, sdm-surface-subtle, sdm-border-input, sdm-primary-subtle, sdm-overlay, sdm-journal-1/2/3)

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

### 3.6 Robots.txt

Static file in `public/robots.txt`:
```
User-agent: *
Allow: /
```

No sitemap reference. Google will crawl 9 pages via internal links.

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
| `/notes` | `/about` | 301 redirect |
| `/notes?section=*` | `/about` | 301 redirect |
| `/feed.xml` | `/feed.xml` | Match |

Configure Astro `trailingSlash` to match current behavior.

### 4.2 Cloudflare `_redirects`

```
# WordPress migration
/posts/:slug  /journal/:slug  301
/documentation  /about  301
/category/*  /journal  301
/categories/*  /journal  301

# Removed pages
/contact  /  301
/notes  /about  301
/notes/*  /about  301
/projects  /about  301

# Old query-param routes
/puttering?poem=:slug  /puttering/:slug  301
```

Note: Cloudflare Pages `_redirects` may not support query param matching. If not, add a small inline script on the `/puttering` index page that checks for the old query param and redirects client-side:
```js
const p = new URLSearchParams(location.search).get('poem');
if (p) location.replace('/puttering/' + p);
```

WWW → non-WWW handled at Cloudflare DNS level.

### 4.3 Meta Tags

- Global title template: `{page} | Suburban Dad Mode`
- Per-page: canonical URL, OpenGraph, Twitter cards
- Journal posts: `article` og:type, `summary_large_image` Twitter card, dynamic og:image from mainImage
- No JSON-LD on any page

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
| **Tailwind** (tailwindcss, @tailwindcss/postcss, @tailwindcss/typography) | Vanilla CSS |
| **Sanity** (client, studio, next-sanity, image-url, vision, color-input, hotspot-array) | Content in git |
| **Sentry** (nextjs integration) | No server code |
| **Upstash** (ratelimit, redis) | No API routes |
| **focus-trap-react** | Simple inline JS menu |
| **react-icons** | No icons needed (projects page removed) |
| **date-fns** | `Intl.DateTimeFormat` |
| **server-only** | No server components |
| **@astrojs/sitemap** | 9 pages don't need auto-sitemap |
| Contact page | Owner decision |
| **Entire Notes section** | Content better suited to private tools (Notion, etc.) |
| Notes sidebar + layout | No Notes pages to navigate |
| Changelog page + GitHub API | Developer vanity |
| Tech Stack page | Developer vanity |
| Projects page + ProjectCard | GitHub profile link on About page |
| Links page | Curated links belong in posts, not a dedicated page |
| House/Cars/Finances/Book Group pages | Personal todo lists, not blog content |
| Now page + dateline | Redundant with About page |
| Accessibility statement page | Single sentence in footer or About |
| 5 color themes | Rose only |
| **Dark mode entirely** | Single light palette; Dark Reader for users who want it |
| Theme toggle UI | Removed with dark mode |
| ThemeScript (FOUC prevention) | Removed with dark mode |
| Live weather dateline | Removed entirely |
| Typewriter animation | Static text — cleaner |
| Footer squiggle images | Copyright line — cleaner |
| Journal year/month grouping | Flat list — more scannable |
| Journal cycling background colors | Removed with grouping |
| Cooper Bold font file | 2 weights sufficient (light + medium) |
| JSON-LD (all schemas) | Marginal SEO value |
| DocumentationContent.tsx (545 lines) | Notes section removed |
| PutteringContent.tsx (133 lines) | Separate static pages |
| useTheme.ts (183 lines) | Dark mode removed |
| ThemeToggle.tsx (174 lines) | Dark mode removed |
| Header.tsx (150 lines) | Astro component + 15-line script |
| useDateline.ts (109 lines) | Dateline removed |
| useMobileMenu.ts (60 lines) | Part of header script |
| weather.ts (46 lines) | Dateline removed |
| github.ts | Changelog removed |
| tech-icons.ts | Tech Stack page removed |
| PortableText.tsx | Astro markdown rendering |
| All `src/lib/` except constants | No CMS, no API security, no validation, no logging |
| `sentry.*.config.ts` | No Sentry |
| `vercel.json`, `.vercelignore` | No Vercel |
| `next.config.ts` | Replaced by `astro.config.mjs` |
| `site.webmanifest` | Blog doesn't need PWA |
| `tailwind.config.ts` | No Tailwind |
| `postcss.config.mjs` | No PostCSS |
| squiggle.webp, squiggle-dark.webp | Footer squiggle removed |
| documentation-hero.webp | Notes section removed |
| 7 JSON data files (projects, links, house, cars, finances, book-group, changelog) | Notes section removed |

---

## Phase 7: Pre-Launch Checklist

### Functional
- [ ] All journal entries render with correct formatting
- [ ] Journal listing shows flat reverse-chronological list with titles, dates, excerpts
- [ ] Journal post prev/next navigation works
- [ ] Homepage hero image + static "always classic" text display
- [ ] About page content matches (dead /contact link removed)
- [ ] La Familia gallery displays all photos in responsive grid
- [ ] Puttering index lists all poems
- [ ] Each poem page renders correctly with TT Disruptors font
- [ ] Poem prev/next links work
- [ ] RSS feed validates
- [ ] 404 page works
- [ ] All redirects work (/contact → /, /notes → /about, /notes/* → /about, /puttering?poem=slug → /puttering/slug, /posts/* → /journal/*)

### Visual
- [ ] Screenshot comparison: every page at 1440px
- [ ] Screenshot comparison: every page at 375px
- [ ] Mobile menu opens/closes correctly
- [ ] Escape key closes mobile menu
- [ ] Selection colors work

### SEO
- [ ] All existing URLs either match or 301 redirect
- [ ] Canonical URLs on every page
- [ ] OG + Twitter metadata correct per page
- [ ] Trailing slash behavior consistent

### Performance
- [ ] Lighthouse ≥ 95 across all categories
- [ ] Zero framework JS in network tab
- [ ] Font preloading works (2 Cooper + 1 TT Disruptors)
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

### Adding a Photo

Add the image to `public/images/gallery/`, add an entry to `src/data/gallery.json`. Commit and push.

### Optional Post-Launch Enhancements

- **Pagefind** — static client-side search (zero server cost)
- **Cloudflare Web Analytics** — free, privacy-respecting

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
    "typescript": "^5.x"
  }
}
```

**3 dependencies.** Down from 37. Zero production dependencies. No Tailwind. No sitemap plugin.

**Migration script (one-time, not shipped):**
```json
{
  "@sanity/client": "^7.x",
  "@portabletext/to-markdown": "latest"
}
```
