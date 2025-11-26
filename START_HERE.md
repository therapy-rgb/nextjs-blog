# START HERE - Journal Workflow Guide

**Last Updated**: November 26, 2025
**Status**: ✅ All systems working

---

## Quick Start - Writing a New Journal Entry

### 1. Start Sanity Studio
```bash
cd /Users/marcusberley/Documents/Development/Projects/website/nextjs-blog/sanity-studio
npm run dev
```
Opens at: http://localhost:3333/

### 2. Create Entry
1. Sign in to Sanity Studio
2. Click **"Journal Entries"** 📔 in sidebar
3. Click **"Create"** or **"+"**
4. Fill in fields (see below)
5. Click **"Publish"**

### 3. See It Live
- Wait ~60 seconds for ISR revalidation
- Visit: https://suburbandadmode.com/journal
- Your entry will appear automatically!

**No manual deployment needed!** The site uses Next.js ISR with 60-second revalidation.

---

## Current System Architecture

### Content Flow
```
Sanity Studio (localhost:3333)
    ↓ [Publish]
Sanity Cloud (content stored)
    ↓ [ISR revalidates every 60s]
Live Website (suburbandadmode.com)
```

### Code Deployment
```
Local Changes
    ↓ [git push]
GitHub (therapy-rgb/nextjs-blog)
    ↓ [auto-deploy]
Vercel
    ↓
Live Website (suburbandadmode.com)
```

---

## Journal Entry Schema

### Required Fields
- **Title**: Entry title (max 100 chars)
- **Slug**: Auto-generates from title
- **Published At**: Date/time (auto-fills with current time)
- **Body**: Rich text content (supports images, code, links, etc.)

### Optional Fields
- **Excerpt**: Preview text for listing page
- **Tags**: Array of string tags
- **Private**: Boolean (defaults to `false`/unchecked = public)

### Important Notes
- **Private field**: Entries with `private: true` are filtered out by queries and won't appear on the website
- **Slug generation**: Click "Generate" button next to slug field to auto-create from title
- **Mood field**: Removed as of Nov 26, 2025

---

## How Automatic Updates Work

### Content Updates (No Deploy Needed)
The journal page uses **ISR (Incremental Static Regeneration)**:
- File: `src/app/journal/page.tsx`
- Setting: `export const revalidate = 60`
- Behavior: Page checks for new content every 60 seconds
- Result: New Sanity entries appear automatically within 1 minute

### Code Updates (Auto-Deploy)
- Push to GitHub → Vercel automatically deploys
- Typical deploy time: 2-3 minutes
- No manual intervention needed

---

## Project Structure

```
nextjs-blog/
├── src/
│   ├── app/
│   │   ├── journal/page.tsx          # Journal listing (ISR: 60s)
│   │   ├── posts/[slug]/page.tsx     # Individual entries (ISR: 3600s)
│   │   └── globals.css               # Global styles
│   ├── components/
│   │   └── PortableText.tsx          # Sanity rich text renderer
│   └── lib/
│       └── sanity.ts                 # Queries & client config
├── sanity-studio/
│   ├── schemaTypes/
│   │   ├── journalEntry.ts           # Journal schema
│   │   ├── blockContent.ts           # Rich text config
│   │   └── index.ts                  # Schema exports
│   ├── structure.ts                  # Studio sidebar config
│   └── sanity.config.ts              # Sanity configuration
└── Documentation/
    ├── START_HERE.md                 # This file
    ├── JOURNAL_ENTRIES.md            # Detailed journal guide
    └── README.md                     # Project overview
```

---

## Key Files & Their Purpose

### Frontend (Next.js)
- **`src/lib/sanity.ts`**:
  - Sanity client configuration
  - GROQ queries for fetching entries
  - Filters out private entries: `private != true`

- **`src/app/journal/page.tsx`**:
  - Lists all journal entries
  - Revalidates every 60 seconds
  - Route: `/journal`

- **`src/app/posts/[slug]/page.tsx`**:
  - Individual journal entry display
  - Revalidates every 3600 seconds (1 hour)
  - Route: `/posts/[slug]`

### Backend (Sanity)
- **`sanity-studio/schemaTypes/journalEntry.ts`**:
  - Defines journal entry structure
  - Fields: title, slug, publishedAt, excerpt, body, tags, private

- **`sanity-studio/structure.ts`**:
  - Configures Sanity Studio sidebar
  - Orders entries by `publishedAt` (newest first)

---

## Recent Changes (Nov 26, 2025)

### Fixed Issues
1. ✅ **Structure.ts ordering**: Changed from `'date'` to `'publishedAt'`
2. ✅ **Private field filtering**: Added `private != true` to GROQ queries
3. ✅ **Private field default**: Changed from `true` to `false`
4. ✅ **Removed mood field**: Simplified schema

### Result
- Sanity Studio loads without errors
- Journal entries appear correctly
- Private entries are properly filtered
- Automatic content updates working via ISR

---

## Common Commands

### Development
```bash
# Start Sanity Studio
cd sanity-studio && npm run dev

# Start Next.js locally
npm run dev

# Run linter
npm run lint

# Build for production
npm run build
```

### Deployment
```bash
# Manual deploy (rarely needed)
npx vercel --prod

# Check recent deployments
npx vercel ls

# View deployment details
npx vercel inspect [deployment-url]
```

### Git Operations
```bash
# Check status
git status

# Commit changes
git add .
git commit -m "Your message"

# Push to GitHub (triggers auto-deploy)
git push
```

---

## Troubleshooting

### Journal Entry Not Appearing

1. **Check Private Field**
   - Open entry in Sanity Studio
   - Verify "Private" is unchecked (false)

2. **Check Required Fields**
   - Title: ✓
   - Slug: ✓ (must be generated)
   - Published At: ✓ (must have date)
   - Body: ✓ (must have content)

3. **Wait for Revalidation**
   - ISR revalidates every 60 seconds
   - Wait 1-2 minutes after publishing
   - Hard refresh browser (Cmd+Shift+R)

4. **Check Query**
   - Query filters: `defined(slug) && defined(publishedAt) && private != true`
   - Make sure all conditions are met

### Sanity Studio Errors

1. **"Could not fetch list items"**
   - Check `structure.ts` ordering field matches schema
   - Should be `publishedAt`, not `date`

2. **Schema Validation Errors**
   - Run: `npx sanity schema validate`
   - Check for field name mismatches

3. **Hot Reload Not Working**
   - Restart studio: `npm run dev`
   - Check for syntax errors in schema files

---

## Environment Variables

Located in `.env.local`:
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=4qp7h589
NEXT_PUBLIC_SANITY_DATASET=production
```

Also configured in Vercel dashboard for all environments (Development, Preview, Production).

---

## Live URLs

- **Production Site**: https://suburbandadmode.com
- **Journal List**: https://suburbandadmode.com/journal
- **Individual Entry**: https://suburbandadmode.com/posts/[slug]
- **Sanity Studio (Local)**: http://localhost:3333/
- **GitHub Repository**: https://github.com/therapy-rgb/nextjs-blog

---

## For Future Sessions

When returning to this project:
1. Read this file first for current status
2. Start Sanity Studio if writing content
3. Check JOURNAL_ENTRIES.md for detailed workflow
4. All systems are working - no setup needed!

**Current Status**: All issues resolved. System is production-ready and functioning as expected.
