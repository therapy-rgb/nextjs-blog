# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Common Development Commands

### Development Server
```bash
npm run dev          # Start development server with Turbopack
```

### Build & Production
```bash
npm run build        # Build for production
npm run start        # Start production server
```

### Code Quality
```bash
npm run lint         # Run ESLint on src/ directory
```

### Sanity Studio (CMS)
```bash
cd sanity-studio
npm run dev          # Start Sanity Studio locally
npm run build        # Build Sanity Studio for deployment
npm run deploy       # Deploy Studio to Sanity
```

### Migration Tools (WordPress to Sanity)
```bash
cd migration
npm run migrate      # Complete migration process
npm run parse        # Parse WordPress XML export
npm run download-images # Download WordPress images
npm run import-sanity   # Import content to Sanity
npm run generate-redirects # Generate URL redirects
```

## Architecture Overview

This is a **Next.js 15 blog with Sanity CMS** that follows modern React patterns using the App Router architecture. The site is called "Suburban Dad Mode" and features a custom design with a Financial Times-inspired color scheme.

### Tech Stack
- **Framework**: Next.js 15 with App Router and TypeScript
- **CMS**: Sanity CMS with custom schemas
- **Styling**: Tailwind CSS with custom design system
- **Deployment**: Vercel-ready with environment configurations

### Core Architecture Patterns

#### 1. Next.js App Router Structure
- **App Directory**: `src/app/` contains all routes using Next.js 13+ App Router
- **Parallel Routes**: Different sections like `/la-familia`, `/junk-drawer`, `/puttering` are implemented as separate route groups
- **Dynamic Routes**: Blog posts use `[slug]` dynamic routing in `posts/[slug]/page.tsx`
- **Metadata**: Each route handles its own metadata via Next.js metadata API

#### 2. Sanity Integration
- **Client Configuration**: `src/lib/sanity.ts` configures the Sanity client with proper environment variables
- **GROQ Queries**: Predefined queries for posts, individual posts, and authors
- **Image Optimization**: Uses `@sanity/image-url` for responsive image handling
- **Type Safety**: Full TypeScript types in `src/types/sanity.ts` for all Sanity document types

#### 3. Content Management
- **Schemas**: Located in `sanity-studio/schemaTypes/` with structured content types:
  - `post.ts` - Blog posts with SEO fields, categories, featured images
  - `author.ts` - Author profiles with bio and images  
  - `category.ts` - Post categorization
  - `blockContent.ts` - Rich text content structure
- **Portable Text**: Custom rendering of rich text content from Sanity
- **Image Handling**: Sanity's asset pipeline with hotspot support and alt text

#### 4. Design System & Styling
- **Custom Tailwind Config**: Extensive customization in `tailwind.config.ts`
- **Color Palette**: Custom "sdm" (Suburban Dad Mode) colors with primary purple (#6528F7) and Financial Times pink background (#FFF1E6)
- **Typography**: Cooper font family as primary display font, Inter for body text
- **Responsive Design**: Mobile-first approach with hamburger navigation

### Key Components Architecture

#### Layout Components
- **Header**: Responsive navigation with mobile menu, active route highlighting
- **Footer**: Site footer with consistent styling
- **Layout**: Root layout with font loading, metadata, and consistent structure

#### Content Components  
- **PortableText**: Renders Sanity's rich text content with proper prose styling
- **PostCard**: Reusable blog post preview component
- **PostList**: Container for multiple post cards
- **JsonLd**: Structured data for SEO

### Migration System
The repository includes a comprehensive WordPress-to-Sanity migration system in the `migration/` directory:
- **Multi-step Process**: Parse XML → Download images → Import to Sanity → Generate redirects
- **Preserves SEO**: Maintains URLs, metadata, and redirects for SEO continuity
- **Image Migration**: Downloads and optimizes all WordPress images
- **Redirect Management**: Automatically updates `next.config.ts` with proper redirects

### Environment Configuration
Required environment variables:
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Sanity project identifier
- `NEXT_PUBLIC_SANITY_DATASET` - Sanity dataset (typically 'production')
- `SANITY_API_TOKEN` - Write token for Sanity operations (migration only)
- `NEXT_PUBLIC_BASE_URL` - Site base URL for metadata

### SEO & Performance
- **Built-in SEO**: Metadata API, Open Graph, Twitter Cards, structured data
- **Image Optimization**: Next.js Image component with Sanity's CDN
- **Sitemap & Robots**: Automatic generation via `sitemap.ts` and `robots.ts`
- **Performance**: Turbopack for faster development, optimized builds

## Development Workflow

1. **Content Changes**: Use Sanity Studio at `/studio` route or locally via `cd sanity-studio && npm run dev`
2. **Code Changes**: Standard Next.js development with hot reloading
3. **Schema Updates**: Modify files in `sanity-studio/schemaTypes/` and redeploy Studio
4. **Migration**: Use migration tools when importing content from WordPress
5. **Deployment**: Push to main branch for automatic Vercel deployment

## Important Notes

- The site uses a custom design system with specific color palette and typography
- All images should have alt text for accessibility and SEO
- Content structure is optimized for personal blogging with categories and featured posts
- The migration system preserves WordPress URLs through comprehensive redirect rules
- TypeScript is strictly enforced across the entire codebase