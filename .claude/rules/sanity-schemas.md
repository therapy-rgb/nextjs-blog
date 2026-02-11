# Sanity Schema Rules

## Package Versions
Project uses Sanity v5 with Next.js 16:
- `sanity` at `^5.9.0`
- `@sanity/client` at `^7.14.1`
- `next-sanity` at `^12.0.16`
- These versions require React 19+ and Next.js 16+

## Schema Patterns
- Schemas live in `sanity-studio/schemaTypes/`
- Use `defineType` and `defineField` wrappers from 'sanity'
- Include `description` field for better Studio UX
- Slugs should use `source: 'title'` for auto-generation

## Registration
- All new types must be registered in `sanity-studio/schemaTypes/index.ts`
- Test changes with Sanity Studio: `cd sanity-studio && npm run dev`
- Deploy with: `cd sanity-studio && npx sanity deploy`

## GROQ Queries
- All queries are centralized in `src/lib/sanity.ts` — not in page components
- Use projections to limit returned fields
- Test in Sanity Vision before deploying

## Content Visibility
- Posts require `published == true` to appear (BLOG_QUERY filters by this)
- Journal entries filtered by `private != true`
