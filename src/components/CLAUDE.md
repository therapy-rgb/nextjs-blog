# Components Directory

## Organization

Components are organized by category:

- **layout/** - Structural components: Header, Footer, PageContainer
- **ui/** - Reusable UI elements: ArrowLink, ContentCard
- **content/** - Content rendering: PortableText, PostCard, ProjectCard, AuthorAvatar
- **seo/** - SEO-related: JsonLd

Each subdirectory has an `index.ts` barrel export. Import from the category:
```ts
import { Header, Footer } from '@/components/layout'
import { ArrowLink } from '@/components/ui'
import { PortableText } from '@/components/content'
import { JsonLd } from '@/components/seo'
```

## Conventions

- Use `'use client'` directive only on interactive components (Header, Footer)
- Server components are the default for data-fetching components
- All components use TypeScript with explicit prop types
- Styling uses Tailwind with project color tokens (`sdm-primary`, `sdm-text`, etc.)
- Minimum 44x44px touch targets on interactive elements
- Include ARIA attributes for accessibility
