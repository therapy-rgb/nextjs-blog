# Deployment Guide

## Quick Reference

### To Deploy Changes
```bash
cd /Users/marcusberley/Documents/Projects/nextjs-blog
git add -A
git commit -m "Your commit message"
git push origin main
```

Vercel will automatically deploy within 2-3 minutes.

### To Add Journal Entries
```bash
cd /Users/marcusberley/Documents/Projects/nextjs-blog/sanity-studio
npm run dev
```
Then visit http://localhost:3333, create a Journal Entry, and publish.

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
cd /Users/marcusberley/Documents/Projects/nextjs-blog
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

**Frontend (Next.js 16):**
- Repo: https://github.com/therapy-rgb/nextjs-blog
- Deployment: Vercel (auto-deploys from main branch)
- Domain: https://suburbandadmode.com

**CMS (Sanity):**
- Dataset: production
- Local Studio: `cd sanity-studio && npm run dev`

---

## Troubleshooting

### Changes not showing up?

1. **Check deployment status:**
   ```bash
   npx vercel ls | head -5
   ```
   Look for "Ready" status on recent deployments.

2. **Hard refresh your browser:**
   - Mac: `Cmd + Shift + R`
   - Windows: `Ctrl + Shift + R`

### Build failing?

1. Test locally first:
   ```bash
   npm run build
   ```

2. Check the error message - usually points to the file/line causing issues

3. Common issues:
   - TypeScript errors
   - Missing dependencies
   - Sanity client initialization errors
