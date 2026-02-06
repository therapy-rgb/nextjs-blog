# La Familia Instructions

## Quick Reference
Use these instructions whenever you need to modify the La Familia page.

## Project Locations
- **Main project directory**: `/Users/marcusberley/Documents/Projects/nextjs-blog`
- **La Familia component**: `src/app/la-familia/page.tsx`
- **Image storage**: `public/familia-photos/` directory (`.webp` format)

## Adding New Images to La Familia Page

### Step 1: Copy Images
```bash
# Copy to familia-photos directory
cp "/path/to/new-image.webp" "/Users/marcusberley/Documents/Projects/nextjs-blog/public/familia-photos/"
```

**Naming Convention**: Keep original filenames (no renaming required).

### Step 2: Update the Photos Array
**File**: `src/app/la-familia/page.tsx`

Add new entry to the `photos` array:
```javascript
const photos = [
  'existing-photo-1.jpg',
  'new-photo-name.jpg',    // Add here
  'existing-photo-2.jpg',
]
```

Note: The component automatically converts `.jpg`/`.jpeg` extensions to `.webp` when building the image `src` path, so list files with their original extension in the array.

### Step 3: Build and Deploy
```bash
cd /Users/marcusberley/Documents/Projects/nextjs-blog
npm run build
git add . && git commit -m "Update la familia photos" && git push
```

## Replacing All Photos (Complete Refresh)

1. Remove all existing photos from `public/familia-photos/`
2. Copy entire new collection into the directory
3. Replace the entire `photos` array with new filenames
4. Build and deploy

## Important Technical Notes

### Component Structure
The La Familia page is a client component (`'use client'`) with:
- **Photos array**: Centralized list of image filenames
- **PageContainer + ContentCard**: Uses shared layout/UI components
- **Vertical gallery layout**: Single-column display with centered images
- **Mobile responsive**: Adapts to different screen sizes
- **Hover effects**: `hover:scale-105` zoom transition
- **Lazy loading**: First 2 images eager-loaded, rest lazy-loaded

### Image Handling
- Images referenced as `.jpg` in the array are converted to `.webp` in the `src` path
- Uses Next.js `Image` component with `sizes="(max-width: 768px) 100vw, 400px"`
- Max width `max-w-md` per image card

### Testing Without Deployment
```bash
npm run dev
# Visit http://localhost:3000/la-familia
```

## Current Page State
- **Total photos**: 25 images
- **Layout**: Vertical gallery with centered cards inside a ContentCard
- **Responsive**: Mobile and desktop

## File Dependencies
- **Framework**: Next.js 16
- **React**: 19
- **Hosting**: Vercel
- **Components used**: `PageContainer` from `@/components/layout`, `ContentCard` from `@/components/ui`
