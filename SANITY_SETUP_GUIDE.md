# Complete Sanity CMS Setup Guide

## 🎯 Overview

I've set up the complete Sanity CMS structure for your blog. Here's what's ready:

✅ **Sanity Studio configured** in `/sanity-studio/`
✅ **Complete schema** for journal entries, posts, authors, categories
✅ **Rich text editor** with images and code blocks
✅ **SEO optimization** built into content types
✅ **Next.js integration** ready to connect

## 📋 Required Steps to Complete Setup

### Step 1: Create Sanity Account & Project

**You need to complete this step manually:**

1. **Go to [sanity.io](https://sanity.io)**
2. **Create a free account** (GitHub/Google signin recommended)
3. **Create a new project:**
   - Project name: "Personal Blog" (or your choice)
   - Project ID: Note this down (e.g., `abc123xyz`)
   - Dataset: "production"

### Step 2: Update Environment Variables

After creating your project, update these files:

**Update `/nextjs-blog/.env.local`:**
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your-actual-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token-here
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

**Update `/nextjs-blog/sanity-studio/.env.local`:**
```bash
SANITY_STUDIO_PROJECT_ID=your-actual-project-id
SANITY_STUDIO_DATASET=production
```

### Step 3: Get API Token

1. In your Sanity project dashboard: https://sanity.io/manage
2. Go to **API** → **Tokens**
3. **Add API token**:
   - Name: "Blog Frontend"
   - Permissions: "Editor"
   - Copy the token and add to `.env.local`

### Step 4: Start Sanity Studio

```bash
cd ~/nextjs-blog/sanity-studio
npm run dev
```

The studio will be available at: **http://localhost:3333**

## 🏗️ What's Already Configured

### Schema Structure

**📔 Journal Entry Schema** (primary content type):
- Title, slug, publishedAt, excerpt
- Rich text body (blockContent)
- Tags, private flag
- This is the schema actively used for blog content at `/journal` and `/posts/[slug]`

**📝 Post Schema** (legacy):
- Title, slug, author, featured image
- Categories, publication date, excerpt
- Rich text body with images/code blocks
- Featured post option, SEO meta fields

**👤 Author Schema:**
- Name, slug, profile image, bio
- Email, website, social links

**🏷️ Category Schema:**
- Title, slug, description, color

### Studio Features

- **Smart organization**: Posts grouped by status
- **Rich editor**: Full-featured content editing
- **Image management**: Upload with alt text
- **SEO support**: Built-in optimization fields
- **Mobile responsive**: Works on all devices

### Frontend Integration

Your Next.js app is already configured to:
- Fetch posts from Sanity
- Render rich text content
- Display author information
- Handle SEO metadata
- Generate sitemaps

## 🚀 Quick Start After Setup

1. **Create your author profile** (required for posts)
2. **Add some categories** (optional but recommended)
3. **Write your first blog post**
4. **Check http://localhost:3000** to see it live!

## 🔧 Available Commands

**Next.js (in project root):**
```bash
npm run dev        # Start frontend
npm run build      # Build for production
```

**Sanity Studio (in sanity-studio/):**
```bash
npm run dev        # Start studio locally
npm run build      # Build studio
npm run deploy     # Deploy to sanity.studio
```

## 🌐 Deployment Ready

Once configured, your blog is ready to deploy to:
- **Vercel** (recommended for Next.js)
- **Netlify** 
- **Any host supporting Node.js**

The Sanity Studio can be deployed to Sanity's hosting with `npm run deploy`.

## 🎨 Customization

All schemas are in `sanity-studio/schemaTypes/` and can be modified:
- Add new fields to posts
- Create new content types
- Customize the studio interface
- Add validation rules

## 📞 Need Help?

Common issues and solutions:
1. **"Dataset not found"** → Check project ID matches exactly
2. **"Unauthorized"** → Verify API token has correct permissions
3. **Studio won't start** → Ensure all dependencies installed

Your complete blog setup is ready! Just complete the Sanity account creation and you'll be blogging in minutes. 🎉