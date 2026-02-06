# Puttering Instructions

## Quick Reference
Use these instructions whenever you need to modify the Puttering page.

## Project Locations
- **Main project directory**: `/Users/marcusberley/Documents/Projects/nextjs-blog`
- **Puttering component**: `src/app/puttering/page.tsx`

## How the Page Works

The Puttering page displays poems in the **TT Disruptors** handwritten font. It uses a dropdown selector to choose a poem, and the selected poem's text renders below.

- When no poem is selected, a bookshelf image (`/puttering-bookshelf.webp`) is shown
- Selecting a poem from the dropdown navigates via query parameter (`/puttering?poem=slug`)
- Uses Next.js `Suspense` for client-side rendering with `useSearchParams`

## Adding a New Poem

### Step 1: Add to the Poems Array

**File**: `src/app/puttering/page.tsx`

Add a new entry to the `poems` array:

```javascript
const poems = [
  // ... existing poems
  {
    slug: 'your-poem-slug',        // URL-friendly identifier
    title: 'Your Poem Title',      // Displayed in the dropdown
    text: `Line one
Line two
Line three`                        // Use template literal for line breaks
  },
]
```

### Step 2: Build and Deploy

```bash
cd /Users/marcusberley/Documents/Projects/nextjs-blog
npm run build
git add . && git commit -m "Add new poem to Puttering" && git push
```

That's it. No images to copy -- poems are plain text in the component.

## Component Structure

The page is a client component (`'use client'`) with two parts:

1. **`PutteringContent`** -- the main UI:
   - Reads `?poem=` from search params via `useSearchParams()`
   - Renders a centered `<select>` dropdown with all poem titles
   - On selection, pushes `/puttering?poem=slug` via `useRouter()`
   - Displays the selected poem text in a styled card with `TT Disruptors` font

2. **`Puttering`** -- the default export:
   - Wraps `PutteringContent` in `<Suspense>` (required for `useSearchParams`)

### Poem Data Shape

```typescript
{
  slug: string       // Used in the URL query param
  title: string      // Shown in dropdown
  text: string       // The poem content (template literal with newlines)
}
```

### Styling Details
- Poem text renders at `text-4xl md:text-5xl` with `whitespace-pre-line`
- Background card uses `#FAF6EF` (warm off-white)
- Font: `'TT Disruptors', cursive`
- Dropdown: `max-w-xs`, centered, Cooper font

## Testing Without Deployment
```bash
npm run dev
# Visit http://localhost:3000/puttering
# Test dropdown selection and poem rendering
```

## Current Page State
- **Total poems**: 6
- **Poems**: Baby sleeping, It's late at night, A morning nap, Moments of respite, 3am, Natalie sleeps in her crib
- **Layout**: Dropdown selector + poem display card
- **Default view**: Bookshelf image when no poem selected

## File Dependencies
- **Framework**: Next.js 16
- **React**: 19
- **Hosting**: Vercel
- **Custom font**: TT Disruptors (loaded in `public/fonts/`)
