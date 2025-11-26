# Journal Entries Guide

## Overview

Journal entries are published to the **Journal** section of the website at `/journal` (listing) and `/posts/[slug]` (individual entries).

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
- **Published At**: Date and time for the entry (auto-fills with current time)
- **Body**: Your journal content (supports rich text formatting)

Optional fields:
- **Excerpt**: Short preview text for the listing page
- **Tags**: Optional tags for categorization
- **Private**: Keep entry private (defaults to unchecked/public)

### 4. Publish

1. Review your entry
2. Click **"Publish"** in the top-right corner
3. Wait ~60 seconds for automatic update (ISR revalidation)
4. Your entry will appear at:
   - List: https://suburbandadmode.com/journal
   - Individual: https://suburbandadmode.com/posts/[your-slug]

**Note**: No manual deployment needed! The site uses Next.js ISR and automatically checks for new content every 60 seconds.

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

1. **Wait for ISR revalidation**: The page updates every 60 seconds. Wait 1-2 minutes after publishing.
2. **Check the entry has a `publishedAt` date set**: Required field must be filled.
3. **Verify the `private` field is set to `false`**: Unchecked in Sanity Studio.
4. **Check slug is generated**: Must have a valid slug.
5. **Verify Sanity project ID** in `.env.local`:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=4qp7h589
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

6. **Hard refresh browser**: Press Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows).

Note: Manual deployment is rarely needed. ISR handles content updates automatically.

## Technical Details

### Schema Structure

Journal entries use the following schema:
- Type: `journalEntry`
- Location in Sanity Studio: Content → Journal Entries
- Website routes: `/journal` (list) and `/posts/[slug]` (individual)
- Fields: title, slug, publishedAt, excerpt, body, tags, private
- Private entries (private: true) are filtered out from public queries

### Key Files

- `sanity-studio/schemaTypes/journalEntry.ts` - Journal entry schema definition
- `sanity-studio/structure.ts` - Sanity Studio sidebar structure
- `src/lib/sanity.ts` - Frontend queries for journal entries (filters out private entries)
- `src/app/journal/page.tsx` - Journal entries listing page
- `src/app/posts/[slug]/page.tsx` - Individual journal entry display page

### Required Plugins

The following Sanity plugins are required:
- `@sanity/code-input` - For code block support in entries
- `@sanity/color-input` - For color picker functionality
- `@sanity/vision` - For testing GROQ queries
- `sanity-plugin-hotspot-array` - For image hotspot functionality
