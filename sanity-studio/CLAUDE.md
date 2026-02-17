# Sanity Studio

This is a **separate app** from the Next.js site. It has its own `package.json` and `node_modules/`.

## Commands

```bash
npm run dev      # Start Studio at localhost:3333
npx sanity deploy  # Deploy to hosted Studio URL
```

## Schemas

Defined in `schemaTypes/`. Current types:

| Type | Description |
|------|-------------|
| `journalEntry` | Blog posts (primary) |
| `post` | Legacy WordPress posts |
| `author` | Author profiles |
| `category` | Post categories |
| `blockContent` | Rich text config |
| `documentationSection` | Notes page sections |
| `photoGallery` | Photo gallery (singleton) |
| `putteringPoems` | Poetry collection (singleton) |
| `project` | Portfolio projects (visible toggle, ordered) |

## Adding a New Schema

1. Create file in `schemaTypes/` using `defineType` and `defineField`
2. Register in `schemaTypes/index.ts`
3. Restart Studio to test
4. Deploy with `npx sanity deploy`

## Custom Structure

`structure.ts` defines the Studio sidebar layout. Singleton documents (photoGallery, putteringPoems) appear as direct links rather than lists.
