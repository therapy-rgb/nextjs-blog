# Personal Blog with Next.js and Sanity

A modern, fast, and SEO-optimized personal blog built with Next.js 15, TypeScript, Tailwind CSS, and Sanity CMS.

**Live Site**: [suburbandadmode.com](https://suburbandadmode.com)
**GitHub**: [therapy-rgb/nextjs-blog](https://github.com/therapy-rgb/nextjs-blog)

## Features

- **Next.js 15** with App Router and TypeScript
- **Sanity CMS** for headless content management
- **ISR (Incremental Static Regeneration)** - Content updates automatically without manual deploys
- **Tailwind CSS v4** for responsive design
- **SEO-optimized** with meta tags, Open Graph, and structured data
- **Image optimization** with Next.js Image component
- **Journal entries** with rich text editor support
- **Auto-deployment** from GitHub to Vercel

## Quick Start

**For writing journal entries**: See [START_HERE.md](./START_HERE.md) or [JOURNAL_ENTRIES.md](./JOURNAL_ENTRIES.md)

### 1. Clone & Install

```bash
git clone https://github.com/therapy-rgb/nextjs-blog.git
cd nextjs-blog
npm install
```

### 2. Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=4qp7h589
NEXT_PUBLIC_SANITY_DATASET=production
```

### 3. Start Development

```bash
# Start Next.js
npm run dev

# Start Sanity Studio (for writing content)
cd sanity-studio && npm run dev
```

- Next.js: [http://localhost:3000](http://localhost:3000)
- Sanity Studio: [http://localhost:3333](http://localhost:3333)

## Project Structure

```
nextjs-blog/
├── src/
│   ├── app/
│   │   ├── journal/page.tsx          # Journal listing (ISR: 60s)
│   │   ├── posts/[slug]/page.tsx     # Individual entries (ISR: 3600s)
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page
│   │   └── globals.css               # Global styles
│   ├── components/
│   │   ├── PortableText.tsx          # Sanity rich text renderer
│   │   ├── Header.tsx                # Site header
│   │   └── Footer.tsx                # Site footer
│   ├── lib/
│   │   └── sanity.ts                 # Sanity client & queries
│   └── types/
│       └── sanity.ts                 # TypeScript types
├── sanity-studio/
│   ├── schemaTypes/
│   │   ├── journalEntry.ts           # Journal entry schema
│   │   ├── blockContent.ts           # Rich text config
│   │   └── index.ts                  # Schema exports
│   ├── structure.ts                  # Studio sidebar config
│   └── sanity.config.ts              # Sanity configuration
├── START_HERE.md                     # Quick reference guide
├── JOURNAL_ENTRIES.md                # Journal workflow guide
└── README.md                         # This file
```

## Content Management

### Journal Entry Schema

Journal entries (`journalEntry`) include:
- **title**: String (required, max 100 chars)
- **slug**: Auto-generated from title (required)
- **publishedAt**: DateTime (required, auto-fills)
- **excerpt**: Text (optional preview)
- **body**: Rich text with block content (required)
- **tags**: Array of strings (optional)
- **private**: Boolean (defaults to false)

### Content Features

The rich text editor supports:
- Text formatting (bold, italic, inline code)
- Headings (H1-H4)
- Lists (bullet and numbered)
- Blockquotes
- Links
- Images with alt text
- Code blocks with syntax highlighting

## How Content Updates Work

### Automatic Updates via ISR

This site uses **Incremental Static Regeneration (ISR)**:

1. **Journal listing page** (`/journal`):
   - Revalidates every 60 seconds
   - New entries appear automatically within 1 minute

2. **Individual entries** (`/posts/[slug]`):
   - Revalidates every 3600 seconds (1 hour)
   - Updates automatically without manual deployment

**No webhook needed!** Content updates are handled by Next.js ISR.

### Code Deployment

1. Push code changes to GitHub
2. Vercel automatically deploys (2-3 minutes)
3. Live site updates at suburbandadmode.com

## Documentation

- **[START_HERE.md](./START_HERE.md)** - Comprehensive guide to the project
- **[JOURNAL_ENTRIES.md](./JOURNAL_ENTRIES.md)** - How to write journal entries
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment guide (if needed)

## Development Scripts

```bash
npm run dev          # Start Next.js dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Sanity Studio
cd sanity-studio
npm run dev          # Start Sanity Studio (localhost:3333)
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **CMS**: Sanity.io
- **Deployment**: Vercel
- **Version Control**: GitHub

## Environment

- **Production**: https://suburbandadmode.com
- **Repository**: https://github.com/therapy-rgb/nextjs-blog
- **Sanity Project**: 4qp7h589
- **Dataset**: production

## Recent Updates (Nov 26, 2025)

- Fixed journal entry schema ordering
- Added private field filtering
- Removed mood field from schema
- Updated documentation
- Confirmed ISR auto-updates working

## Support

For questions or issues:
1. Check [START_HERE.md](./START_HERE.md)
2. Check [JOURNAL_ENTRIES.md](./JOURNAL_ENTRIES.md)
3. Review troubleshooting sections
