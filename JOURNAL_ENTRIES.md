# Journal Entries Guide

## Overview

Journal entries are published to the **Junk Drawer** section of the website at `/junk-drawer/[slug]`.

## Creating a New Journal Entry

### 1. Start Sanity Studio

From the project root directory:

```bash
cd sanity-studio
npm run dev
```

This will start Sanity Studio at http://localhost:3333/

### 2. Access Journal Entries

1. Open http://localhost:3333/ in your browser
2. Sign in with your Sanity account
3. Click on **"Journal Entries"** 📔 in the left sidebar
4. Click **"Create"** or the **"+"** button

### 3. Fill in the Entry

Required fields:
- **Title**: The title of your journal entry
- **Slug**: Auto-generates from title (e.g., "my-journal-entry")
- **Published At**: Date and time for the entry
- **Body**: Your journal content (supports rich text formatting)

Optional fields:
- **Excerpt**: Short preview text (max 200 chars) for the listing page

### 4. Publish

1. Review your entry
2. Click **"Publish"** in the top-right corner
3. Your entry will appear at:
   - List: https://suburbandadmode.com/junk-drawer
   - Individual: https://suburbandadmode.com/junk-drawer/[your-slug]

## Content Features

The journal entry editor supports:

- **Text Formatting**: Bold, italic, inline code
- **Headings**: H1, H2, H3, H4
- **Lists**: Bullet and numbered lists
- **Blockquotes**: For highlighted text
- **Links**: External URLs
- **Images**: Uploaded images with alt text and captions
- **Code Blocks**: Syntax-highlighted code snippets

## Troubleshooting

### Schema Errors

If you see a SchemaError when loading Sanity Studio, verify:

1. All required packages are installed:
   ```bash
   npm install @sanity/code-input @sanity/color-input @sanity/vision
   ```

2. Verify the schema files exist:
   - `sanity-studio/schemaTypes/journalEntry.ts`
   - `sanity-studio/schemaTypes/blockContent.ts`

3. Validate the schema:
   ```bash
   npx sanity schema validate
   ```

### Entries Not Appearing

If published entries don't show on the website:

1. Check the entry has a `publishedAt` date set
2. Verify the Sanity project ID in `.env.local`:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=4qp7h589
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

3. Rebuild and redeploy:
   ```bash
   npm run build
   npx vercel --prod
   ```

## Technical Details

### Schema Structure

Journal entries use the following schema:
- Type: `journalEntry`
- Location in Sanity Studio: Content → Journal Entries
- Website routes: `/junk-drawer/[slug]`

### Files Modified

- `sanity-studio/schemaTypes/journalEntry.ts` - Journal entry schema definition
- `sanity-studio/schemaTypes/index.ts` - Schema exports
- `sanity-studio/structure.ts` - Sanity Studio sidebar structure
- `sanity-studio/sanity.config.ts` - Sanity configuration with plugins
- `src/lib/sanity.ts` - Frontend queries for journal entries
- `src/app/junk-drawer/[slug]/page.tsx` - Journal entry display page
- `src/app/junk-drawer/page.tsx` - Journal entries listing page

### Required Plugins

The following Sanity plugins are required:
- `@sanity/code-input` - For code block support in entries
- `@sanity/color-input` - For color picker functionality
- `@sanity/vision` - For testing GROQ queries
- `sanity-plugin-hotspot-array` - For image hotspot functionality
