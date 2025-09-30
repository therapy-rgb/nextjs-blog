# La Familia Instructions for Claude Code

## Quick Reference
Use these instructions whenever you need to modify the La Familia page of Marcus's personal website.

## Project Locations
- **Main project directory**: `/Users/marcusberley/Documents/Development/Projects/Website/nextjs-blog`
- **La Familia component**: `src/app/la-familia/page.tsx`
- **Image storage**: `public/familia-photos/` directory
- **Desktop files typically at**: `/Users/marcusberley/Desktop`

## Adding New Images to La Familia Page

### Step 1: Identify and Copy Images
```bash
# Check for new image files on desktop
ls -la "/Users/marcusberley/Desktop/photos" | grep -E "\.(jpg|jpeg|png|JPG|JPEG|PNG)$"

# Copy to familia-photos directory with original names
cp "/Users/marcusberley/Desktop/photos"/*.jpg "/path/to/nextjs-blog/public/familia-photos/"
cp "/Users/marcusberley/Desktop/photos"/*.JPG "/path/to/nextjs-blog/public/familia-photos/"
```

**Naming Convention**: Keep original filenames (no renaming required)
- `IMG_2724.jpg` → `IMG_2724.jpg`
- `133398442_zw2ypx3k75.jpg` → `133398442_zw2ypx3k75.jpg`

### Step 2: Update the Photos Array
**File**: `src/app/la-familia/page.tsx`
**Location**: Lines ~6-28 (the `photos` array)

Add new entry in alphabetical/numerical order:
```javascript
const photos = [
  'existing-photo-1.jpg',
  'new-photo-name.jpg',    // Add here
  'existing-photo-2.jpg',
]
```

### Step 3: Build and Deploy
```bash
cd "/Users/marcusberley/Documents/Development/Projects/Website/nextjs-blog"

# Build the project
npm run build

# Deploy to production (if Vercel auth is already set up)
npx vercel --prod --yes
```

## Replacing All Photos (Complete Refresh)

### Step 1: Remove All Current Photos
```bash
# Remove all photos from familia-photos directory
rm -f "/path/to/nextjs-blog/public/familia-photos"/*.jpg
rm -f "/path/to/nextjs-blog/public/familia-photos"/*.JPG
rm -f "/path/to/nextjs-blog/public/familia-photos"/*.jpeg
rm -f "/path/to/nextjs-blog/public/familia-photos"/*.JPEG
rm -f "/path/to/nextjs-blog/public/familia-photos"/*.png
rm -f "/path/to/nextjs-blog/public/familia-photos"/*.PNG
```

### Step 2: Copy New Photo Collection
```bash
# Copy entire new collection
cp "/Users/marcusberley/Desktop/photos"/* "/path/to/nextjs-blog/public/familia-photos/"
```

### Step 3: Replace Entire Photos Array
Replace the entire `photos` array with new filenames:
```javascript
const photos = [
  'new-photo-1.jpg',
  'new-photo-2.jpg',
  'new-photo-3.jpg',
  // ... all new photos
]
```

## Important Technical Notes

### Image Specifications
- **Any aspect ratio supported** - CSS handles responsive display automatically
- **Current CSS styling** ensures proper display:
  - `objectFit: 'contain'` maintains aspect ratio
  - Fixed dimensions: `width={400} height={300}`
  - Responsive width with `w-full h-auto`
  - Hover zoom effect with `hover:scale-105`

### Component Structure
The La Familia page is a React component with:
- **Photos array**: Centralized configuration for all images
- **Vertical gallery layout**: Single-column display with centered images
- **Card-based design**: Each photo in a rounded container
- **Mobile responsive**: Adapts to different screen sizes
- **Hover effects**: Smooth zoom transitions on interaction

### Layout Differences from Puttering Page
- **No navigation controls** (no arrows, page indicators, or keyboard shortcuts)
- **Vertical scrolling** instead of paginated view
- **All photos visible** at once in a single view
- **Simpler structure** - just an array of photos rendered in sequence

### Common Issues & Solutions

#### Build Errors
If you encounter missing dependencies:
```bash
npm install
```

#### Large Photo Collections
- Current page displays all photos at once
- Consider image optimization for large collections
- Next.js automatically optimizes images with the Image component

#### File Size Considerations
- No specific limits, but larger files increase load times
- Current photos typically range from ~500KB to ~3MB
- Next.js Image component provides automatic optimization

## Efficient Workflow

### For Single Image Addition:
1. Copy image to `/public/familia-photos/` with original name
2. Add entry to `photos` array in `page.tsx` (maintain order)
3. Build and deploy

### For Multiple Images:
1. Copy all images to `/public/familia-photos/`
2. Add all entries to `photos` array in single edit
3. Build and deploy once

### For Complete Photo Replacement:
1. Remove all existing photos from directory
2. Copy entire new collection
3. Replace entire `photos` array with new filenames
4. Build and deploy

### Testing Without Deployment:
```bash
npm run dev
# Visit http://localhost:3000/la-familia to test locally
```

## Current Page State (as of Sep 30, 2025)
- **Total photos**: 21 images
- **Latest photos**: IMG_2724 through IMG_5495 series, plus 133398442_zw2ypx3k75
- **Layout**: Vertical gallery with centered cards
- **Responsive**: Tested on mobile and desktop
- **No pagination**: All photos displayed in single scrollable view

## File Dependencies
- **Framework**: Next.js 15.5.2
- **React**: 19.1.0
- **Hosting**: Vercel
- **Styling**: Tailwind CSS with custom responsive classes
- **Image optimization**: Next.js Image component

## Quick Commands Cheat Sheet
```bash
# Navigate to project
cd "/Users/marcusberley/Documents/Development/Projects/Website/nextjs-blog"

# Check desktop photos
ls -la "/Users/marcusberley/Desktop/photos"

# Copy single image (example)
cp "/Users/marcusberley/Desktop/photos/new-image.jpg" "public/familia-photos/new-image.jpg"

# Copy all images
cp "/Users/marcusberley/Desktop/photos"/*.jpg "public/familia-photos/"

# Remove all current photos
rm -f "public/familia-photos"/*.{jpg,JPG,jpeg,JPEG,png,PNG}

# Build
npm run build

# Deploy
npx vercel --prod --yes

# Local development
npm run dev
```

## What NOT to Modify
- Don't change the component structure or layout design
- Don't modify the responsive CSS styling
- Don't alter the Image component configuration
- Don't change the card-based display format
- Only add/modify the `photos` array entries

## Success Indicators
- Build completes without errors
- All photos display properly in vertical layout
- Responsive design works on mobile and desktop
- Hover effects function correctly
- Images maintain aspect ratios with proper sizing
- Vercel deployment succeeds with new URL

## Git and Deployment Workflow
Always commit and deploy changes:
```bash
# Add and commit changes
git add .
git commit -m "Update la familia page with new photos"

# Handle any merge conflicts if needed
git pull --no-rebase origin main

# Push to GitHub
git push origin main

# Deploy to Vercel
npx vercel --prod --yes
```

## When to Ask for Clarification
- If desktop has multiple photo directories and it's unclear which to use
- If requested photo selection criteria are unclear
- If build fails with unrecognized errors
- If specific photo ordering is requested but not clear
- If layout modifications beyond photo updates are requested
- If performance issues arise with large photo collections

## Deployment URLs
- **Production**: Check latest Vercel deployment URL (changes with each deploy)
- **La Familia page**: `[production-url]/la-familia`

## Differences from Puttering Page
- **Display method**: All photos visible vs. paginated slideshow
- **Navigation**: Scroll-based vs. arrow/keyboard navigation
- **Layout**: Vertical gallery vs. single photo display
- **Interaction**: Hover zoom vs. page navigation
- **Photo management**: Simple array vs. complex navigation state