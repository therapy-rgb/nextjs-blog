# Personal Blog with Next.js and Sanity

A modern, fast, and SEO-optimized personal blog built with Next.js 14, TypeScript, Tailwind CSS, and Sanity CMS.

## Features

- **Next.js 14+** with App Router and TypeScript
- **Sanity CMS** for content management
- **Tailwind CSS** for responsive design
- **SEO-optimized** with meta tags, Open Graph, and structured data
- **Image optimization** with Next.js Image component
- **Clean, modern design** optimized for personal blogging
- **Ready for Vercel deployment**

## Quick Start

### 1. Set up Sanity CMS

1. Create a new Sanity project at [sanity.io](https://sanity.io)
2. Install Sanity CLI: `npm install -g @sanity/cli`
3. Create a new Sanity project: `sanity init`
4. Set up your schemas for:
   - Post
   - Author
   - Category

### 2. Configure Environment Variables

Update `.env.local` with your Sanity project details:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token_here
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### 3. Install Dependencies and Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your blog.

## Project Structure

```
src/
├── app/                    # App Router pages
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── posts/[slug]/      # Individual blog post pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── robots.ts          # Robots.txt
│   └── sitemap.ts         # Sitemap generation
├── components/            # React components
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── JsonLd.tsx         # Structured data
│   ├── PortableText.tsx   # Sanity rich text renderer
│   ├── PostCard.tsx       # Blog post preview
│   └── PostList.tsx       # List of blog posts
├── lib/
│   └── sanity.ts          # Sanity client and queries
└── types/
    └── sanity.ts          # TypeScript types
```

## Sanity Schema Example

Create these schemas in your Sanity Studio:

### Post Schema
```javascript
export default {
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'}
    },
    {
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }
      ]
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}]
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      validation: Rule => Rule.required()
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3
    },
    {
      name: 'body',
      title: 'Body',
      type: 'blockContent'
    }
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage'
    },
    prepare(selection) {
      const {author} = selection
      return Object.assign({}, selection, {
        subtitle: author && `by ${author}`
      })
    }
  }
}
```

## Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

## Customization

- Update the site title, description, and social links in `src/app/layout.tsx`
- Customize colors and fonts in `tailwind.config.ts`
- Modify the header and footer in their respective components
- Add new pages by creating folders in `src/app/`

## SEO Features

- Automatic sitemap generation
- Robots.txt
- Open Graph meta tags
- Twitter Card support
- Structured data (JSON-LD)
- Optimized meta descriptions

## Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## License

MIT License - feel free to use this template for your personal blog!
