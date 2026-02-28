Add tile images from ~/Desktop to the most recent journal entries that don't have tiles yet.

## Steps

### 1. Find images on the desktop

```bash
find ~/Desktop -maxdepth 1 -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.webp' -o -iname '*.heic' \) | sort
```

If no images found, tell the user and stop.

### 2. Find journal entries without tiles

Query Sanity for recent journal entries:

```javascript
const {createClient} = require('@sanity/client');
const client = createClient({
  projectId: '4qp7h589',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});
client.fetch('*[_type == "journalEntry" && defined(slug) && defined(publishedAt) && private != true] | order(publishedAt desc)[0..19] { title, "slug": slug.current, publishedAt }')
  .then(r => console.log(JSON.stringify(r)));
```

Then read the `postImages` map in `src/app/journal/page.tsx` and find entries whose slugs are NOT already in the map. Take the N most recent unmatched entries, where N = number of desktop images found.

If there are more images than entries without tiles, warn the user and only process as many as there are entries.

### 3. Convert images if needed

For each image:

- If already `.webp`, copy directly to `public/images/journal/<slug>.webp`
- If not `.webp`, convert using `cwebp -q 80 <source> -o public/images/journal/<slug>.webp` (install cwebp via `brew install webp` if missing)

Assign images to entries arbitrarily (order doesn't matter).

### 4. Update the postImages mapping

In `src/app/journal/page.tsx`, add new entries to the top of the `postImages` object (before existing entries), following the existing pattern:

```typescript
'<slug>': '/images/journal/<slug>.webp',
```

### 5. Commit and push

```bash
git add src/app/journal/page.tsx public/images/journal/<new-files>
git commit -m "Add journal tile images for <entry-titles>"
git push
```

### 6. Report

Tell the user which images were assigned to which entries and confirm the push. Remind them that Vercel will auto-deploy.
