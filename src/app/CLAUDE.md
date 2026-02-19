# App Directory

## Routing

Uses Next.js App Router. Pages are server components by default.

## Key Pages

- **/** - Homepage (static)
- **/journal** - Blog listing (ISR: 1hr)
- **/journal/[slug]** - Individual posts (ISR: 1hr, pre-generated via generateStaticParams)
- **/about** - Static about page
- **/contact** - Contact page (UI only, no backend)
- **/la-familia** - Photo gallery from Sanity CMS (ISR: 1hr, server component)
- **/puttering** - Poetry viewer from Sanity CMS (ISR: 1hr, server component + client PutteringContent)
- **/notes** - Site info with sidebar nav, content from Sanity CMS (ISR: 1hr, client component for tab switching). Also includes Projects section in sidebar between "Now" and "Accessibility"

## Conventions

- Pages fetch data at the server level using async components
- ISR revalidation times are defined via `export const revalidate`
- Use `notFound()` for missing content, not error throws
- Import components from barrel exports: `@/components/layout`, `@/components/ui`, etc.
- Metadata is defined per-page using `export const metadata` or `generateMetadata`
