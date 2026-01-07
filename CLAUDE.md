# CLAUDE.md

This file provides guidance for Claude Code when working on this project.

## Project Overview

Personal blog at **suburbandadmode.com** - a Next.js 16 + Sanity CMS site deployed on Vercel.

## Tech Stack

- **Next.js 16** with App Router and Turbopack
- **React 19** with TypeScript
- **Tailwind CSS v4** for styling
- **Sanity CMS** for content (headless)
- **Vercel** for deployment

## Commands

```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm run lint     # ESLint on src/

# Sanity Studio (separate app)
cd sanity-studio && npm run dev  # localhost:3333
```

## Project Structure

```
src/
├── app/           # Next.js App Router pages
│   ├── journal/   # Journal listing (ISR: 60s)
│   ├── posts/[slug]/  # Individual posts (ISR: 1hr)
│   └── ...
├── components/    # React components
├── lib/
│   └── sanity.ts  # Sanity client & GROQ queries
└── types/
    └── sanity.ts  # TypeScript types for Sanity data

sanity-studio/     # Separate Sanity Studio app
public/            # Static assets
```

## Key Files

- `src/lib/sanity.ts` - Sanity client, all GROQ queries
- `src/components/PortableText.tsx` - Sanity rich text renderer
- `src/app/layout.tsx` - Root layout with Header/Footer
- `sanity-studio/schemaTypes/` - Content schemas

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=<project-id>
NEXT_PUBLIC_SANITY_DATASET=production
```

These must be set on Vercel for production.

## Conventions

- Use `NEXT_PUBLIC_` prefix for client-accessible env vars
- Sanity queries use parameterized GROQ (prevent injection)
- ISR handles content updates automatically (no webhooks)
- Private journal entries filtered with `private != true`

## Security Notes

- Never hardcode credentials in source files
- Escape user/CMS content in `dangerouslySetInnerHTML`
- Keep `.env*.local` files gitignored

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

1. Run lint: `npm run lint`
2. Test build: `npm run build`
3. Check for console errors in dev: `npm run dev`
4. Verify environment variables are not hardcoded

## Common Issues

### Build Failures
- **Missing env vars**: Ensure `NEXT_PUBLIC_SANITY_*` vars are set in Vercel
- **Sanity query errors**: Check GROQ syntax in `src/lib/sanity.ts`
- **Type errors**: Run `npm run build` locally first to catch issues
- **Turbopack issues**: Try `next build` without `--turbopack` flag if dev works but build fails

### Content Not Updating
- ISR revalidates: journal pages every 60s, posts every 1hr
- For immediate updates, redeploy or use Vercel's "Redeploy" button
- Check `revalidate` values in page components if timing seems off

### Sanity Studio Issues
- Studio is a separate app in `sanity-studio/` directory
- Run `cd sanity-studio && npm install` if dependencies are missing
- Schema changes require Studio restart

## Repository

- **GitHub**: https://github.com/therapy-rgb/nextjs-blog
- **Live site**: suburbandadmode.com
- **Branch strategy**: Direct commits to `main` for this project
