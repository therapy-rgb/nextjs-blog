# Puttering Instructions for Claude Code

## Quick Reference
Use these instructions whenever you need to modify the Puttering page of Marcus's personal website.

## Project Locations
- **Main project directory**: `/Users/marcusberley/Documents/Development/Projects/Website/nextjs-blog`
- **Puttering component**: `src/app/puttering/page.tsx`
- **Image storage**: `public/` directory
- **Desktop files typically at**: `/Users/marcusberley/Desktop`

## Adding New Images to Puttering Page

### Step 1: Identify and Copy Images
```bash
# Check for new PNG files on desktop
ls -la "/Users/marcusberley/Desktop" | grep "\.png$"

# Copy to public directory with web-friendly names
cp "/Users/marcusberley/Desktop/[filename].png" "/path/to/nextjs-blog/public/[web-name].png"
```

**Naming Convention**: Use kebab-case (lowercase with hyphens)
- `Poems - page 3.png` → `poems-page-3.png`
- `Generated Image...` → `generated-image.png`

### Step 2: Update the Poems Array
**File**: `src/app/puttering/page.tsx`
**Location**: Lines ~7-39 (the `poems` array)

Add new entry before the closing bracket and comment:
```javascript
{
  src: "/your-image-name.png",
  alt: "Descriptive alt text",
  title: "Image Title",
  description: "Brief description"
}
```

### Step 3: Build and Deploy
```bash
cd "/Users/marcusberley/Documents/Development/Projects/Website/nextjs-blog"

# Build the project
npm run build

# Deploy to production (if Vercel auth is already set up)
npx vercel --prod --yes
```

## Important Technical Notes

### Image Specifications
- **Any aspect ratio supported** - CSS handles responsive display automatically
- **Current CSS styling** ensures proper display on mobile and desktop:
  - `objectFit: 'contain'` maintains aspect ratio
  - `maxHeight: '70vh'` prevents oversizing
  - Responsive width with `max-w-4xl`

### Component Structure
The Puttering page is a React component with:
- **Poems array**: Centralized configuration for all images
- **Navigation**: Automatic arrow controls, page indicators, keyboard shortcuts (1-9)
- **Mobile support**: Touch/swipe gestures
- **Transitions**: Built-in smooth page changes

### Common Issues & Solutions

#### Build Errors
If you encounter missing Sanity dependencies:
```bash
npm install @sanity/vision @sanity/color-input sanity-plugin-hotspot-array
```

#### Deployment Authentication
If Vercel login is needed:
```bash
npx vercel login
# Follow browser authentication flow
```

#### File Size Considerations
- No specific size limits, but larger files increase load times
- Next.js automatically optimizes images
- Current images range from ~200KB to ~2MB

## Efficient Workflow

### For Single Image Addition:
1. Copy image to `/public/` with appropriate name
2. Add entry to `poems` array in `page.tsx`
3. Build and deploy

### For Multiple Images:
1. Copy all images first
2. Add all entries to `poems` array in single edit
3. Build and deploy once

### Testing Without Deployment:
```bash
npm run dev
# Visit http://localhost:3000/puttering to test locally
```

## Current Page State (as of Sep 29, 2025)
- **Total pages**: 5 images
- **Images**: quick-sheets.png, quick-sheets-2.png, poems-page-3.png, poems-page-4.png, generated-image.png
- **Navigation**: Full keyboard, mouse, and touch support
- **Responsive**: Tested on mobile and desktop

## Deployment URLs
- **Production**: Check latest Vercel deployment URL (changes with each deploy)
- **Puttering page**: `[production-url]/puttering`

## File Dependencies
- **Framework**: Next.js 15.5.2
- **React**: 19.1.0
- **Hosting**: Vercel
- **Styling**: Tailwind CSS with custom responsive classes

## Quick Commands Cheat Sheet
```bash
# Navigate to project
cd "/Users/marcusberley/Documents/Development/Projects/Website/nextjs-blog"

# Check desktop files
ls -la "/Users/marcusberley/Desktop" | grep "\.png$"

# Copy image (example)
cp "/Users/marcusberley/Desktop/new-image.png" "public/new-image.png"

# Build
npm run build

# Deploy
npx vercel --prod --yes

# Local development
npm run dev
```

## What NOT to Modify
- Don't change the component structure or navigation logic
- Don't modify the responsive CSS styling
- Don't alter the touch/keyboard event handlers
- Only add to the `poems` array, don't modify existing entries unless specifically requested

## Success Indicators
- Build completes without errors
- Puttering page size increases in build output
- New page indicators appear (1, 2, 3, 4, 5, etc.)
- All navigation methods work (arrows, dots, keyboard, touch)
- Images display properly on both mobile and desktop
- Vercel deployment succeeds with new URL

## When to Ask for Clarification
- If desktop has multiple new PNG files and it's unclear which to add
- If requested image names are unclear or ambiguous
- If build fails with unrecognized errors
- If specific image ordering is requested but not clear
- If modifications beyond adding images are requested