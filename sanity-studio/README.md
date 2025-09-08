# Personal Blog - Sanity Studio

This is the Sanity Studio for the Personal Blog project.

## Setup Instructions

### 1. Create Sanity Account & Project

1. Go to [sanity.io](https://sanity.io) and create a free account
2. Create a new project:
   - Choose a project name (e.g., "Personal Blog")
   - Select a project ID (or let Sanity generate one)
   - Choose "production" dataset

### 2. Configure Environment Variables

Update `.env.local` with your project details:

```bash
SANITY_STUDIO_PROJECT_ID=your-actual-project-id
SANITY_STUDIO_DATASET=production
```

### 3. Install Dependencies (Already Done)

```bash
npm install
```

### 4. Start the Studio

```bash
npm run dev
```

This will start the Sanity Studio at `http://localhost:3333`

### 5. Deploy the Studio (Optional)

To deploy the studio to Sanity's hosting:

```bash
npm run deploy
```

This creates a hosted version at `https://your-project-id.sanity.studio`

## Schema Overview

### Post
- **Title**: Post title
- **Slug**: URL-friendly version of title
- **Author**: Reference to Author document
- **Main Image**: Featured image with alt text
- **Categories**: Array of category references
- **Published At**: Publication date/time
- **Excerpt**: Brief description for previews and SEO
- **Body**: Rich text content with images, code blocks, etc.
- **Featured**: Boolean to highlight on homepage
- **SEO**: Meta title, description, and keywords

### Author
- **Name**: Author's full name
- **Slug**: URL-friendly version of name
- **Image**: Profile photo with alt text
- **Bio**: Rich text biography
- **Email**: Contact email
- **Website**: Personal website URL
- **Social Links**: Twitter, GitHub, LinkedIn, Instagram

### Category
- **Title**: Category name
- **Slug**: URL-friendly version
- **Description**: Brief description
- **Color**: Visual identifier color

### Block Content
Rich text editor supporting:
- Headings (H1-H4)
- Lists (bullet/numbered)
- Text formatting (bold, italic, code)
- Links
- Images with alt text and captions
- Code blocks with syntax highlighting

## Studio Features

- **Organized Structure**: Posts separated by status (all, featured, drafts)
- **Rich Text Editor**: Full-featured editor for blog content
- **Image Management**: Upload and manage images with proper alt text
- **SEO Support**: Built-in fields for meta titles, descriptions, keywords
- **Preview**: See how content looks before publishing
- **Responsive**: Works on desktop and mobile

## Next Steps

1. Complete the Sanity account setup
2. Update environment variables
3. Start the studio: `npm run dev`
4. Create your first author
5. Create some categories
6. Write your first blog post!

## Connecting to Next.js

The Next.js frontend is already configured to connect to this Sanity project. Just make sure to:

1. Update `../env.local` with the same project ID
2. Get an API token from your Sanity project dashboard
3. Add the token to both environment files