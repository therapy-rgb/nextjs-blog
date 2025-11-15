# Deployment Guide

## Quick Reference

### To Deploy Changes
```bash
cd /Users/marcusberley/Documents/Development/Projects/website/nextjs-blog
git add -A
git commit -m "Your commit message"
git push origin main
```

Vercel will automatically deploy within 2-3 minutes.

### To Add Journal Entries
```bash
cd /Users/marcusberley/Documents/Development/Projects/website/my-blog
npm run dev
```
Then visit http://localhost:3333, create a Journal Entry, and publish.

---

## Known Issues & Solutions

### Issue: Vercel Deployments Failing with Sanity Errors

**Symptom:**
```
Error: `projectId` can only contain only a-z, 0-9 and dashes
Build error occurred at /sitemap.xml
```

**Root Cause:**
- Vercel environment variables (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`) weren't being loaded during build time
- The fallback values in `src/lib/sanity.ts` weren't working properly

**Solution:**
Hard-coded Sanity credentials directly in `src/lib/sanity.ts`:

```typescript
// Hard-coded values - environment variables not working on Vercel
const projectId = '4qp7h589'
const dataset = 'production'

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2023-05-03',
  useCdn: process.env.NODE_ENV === 'production',
})
```

**Why This Works:**
- Bypasses environment variable loading issues
- Ensures Sanity client always has valid credentials during build
- Credentials are safe to commit (read-only access, public project)

---

## Vercel Environment Variables

If you need to update environment variables in Vercel:

1. Log in to Vercel CLI:
   ```bash
   npx vercel login
   ```

2. Add environment variable:
   ```bash
   echo "value" | npx vercel env add VARIABLE_NAME production
   echo "value" | npx vercel env add VARIABLE_NAME preview
   echo "value" | npx vercel env add VARIABLE_NAME development
   ```

3. Redeploy:
   ```bash
   npx vercel --prod --force
   ```

---

## Manual Deployment

If automatic deployments aren't working:

```bash
cd /Users/marcusberley/Documents/Development/Projects/website/nextjs-blog
npx vercel --prod --force
```

---

## Testing Locally Before Deploy

Always test your build locally first:

```bash
npm run build
```

If this succeeds, Vercel should succeed too.

---

## Current Setup

**Frontend (Next.js):**
- Repo: https://github.com/therapy-rgb/nextjs-blog
- Deployment: Vercel (auto-deploys from main branch)
- Domain: https://suburbandadmode.com

**CMS (Sanity):**
- Project ID: 4qp7h589
- Dataset: production
- Local Studio: `cd ~/Documents/Development/Projects/website/my-blog && npm run dev`

---

## Troubleshooting

### Changes not showing up?

1. **Check deployment status:**
   ```bash
   npx vercel ls | head -5
   ```
   Look for "● Ready" status on recent deployments.

2. **Hard refresh your browser:**
   - Mac: `Cmd + Shift + R`
   - Windows: `Ctrl + Shift + R`

3. **Clear browser cache:**
   - Open DevTools (F12)
   - Right-click refresh button
   - Select "Empty Cache and Hard Reload"

### Build failing?

1. Test locally first:
   ```bash
   npm run build
   ```

2. Check the error message - usually points to the file/line causing issues

3. Common issues:
   - TypeScript errors
   - Missing dependencies
   - Async params in Next.js 15 (must await params)
   - Sanity client initialization errors

---

## Future Improvements

To properly use environment variables instead of hard-coded values:

1. Ensure `.env.local` exists locally with:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=4qp7h589
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

2. In Vercel dashboard, add these as environment variables to all environments

3. Update `src/lib/sanity.ts` to use environment variables with proper fallbacks

4. Make sure the sitemap and any server-side code handles missing Sanity gracefully
