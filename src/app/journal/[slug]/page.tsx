import Image from 'next/image'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { cache } from 'react'
import { client, postQuery, adjacentPostsQuery, defaultAuthor } from '@/lib/sanity'
import { Post } from '@/types/sanity'
import { urlFor } from '@/lib/sanity'
import { getBaseUrl } from '@/lib/env'
import { PortableText } from '@/components/content'
import { JsonLd } from '@/components/seo'
import Link from 'next/link'
import { logError } from '@/lib/logging'
import { Metadata } from 'next'

interface PostPageProps {
  params: Promise<{
    slug: string
  }>
}

export const revalidate = 3600 // Revalidate every hour

// Pre-generate all existing posts at build time for better LCP
export async function generateStaticParams() {
  const posts = await client.fetch(
    `*[_type == "journalEntry" && defined(slug) && private != true]{ "slug": slug.current }`
  )
  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }))
}

interface AdjacentPost {
  title: string
  slug: string
}

interface AdjacentPosts {
  newer: AdjacentPost | null
  older: AdjacentPost | null
}

// Cache getPost to deduplicate calls between generateMetadata and page render
const getPost = cache(async (slug: string): Promise<Post | null> => {
  try {
    const entry = await client.fetch(postQuery, { slug })
    if (!entry) return null
    // Add default author to journal entry
    return {
      ...entry,
      author: defaultAuthor,
      categories: []
    }
  } catch (error) {
    logError('sanity', 'Error fetching post', { error: error instanceof Error ? error.message : String(error) })
    return null
  }
})

const getAdjacentPosts = cache(async (publishedAt: string): Promise<AdjacentPosts> => {
  try {
    return await client.fetch(adjacentPostsQuery, { publishedAt })
  } catch (error) {
    logError('sanity', 'Error fetching adjacent posts', { error: error instanceof Error ? error.message : String(error) })
    return { newer: null, older: null }
  }
})

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.excerpt || `Read ${post.title} by ${post.author.name}`,
    alternates: {
      canonical: `https://suburbandadmode.com/journal/${post.slug.current}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || `Read ${post.title} by ${post.author.name}`,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: post.mainImage ? [{
        url: urlFor(post.mainImage).width(1200).height(630).url(),
        width: 1200,
        height: 630,
        alt: post.mainImage.alt || post.title,
      }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || `Read ${post.title} by ${post.author.name}`,
      images: post.mainImage ? [{
        url: urlFor(post.mainImage).width(1200).height(630).url(),
        alt: post.mainImage.alt || post.title,
      }] : [],
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  const [baseUrl, adjacentPosts] = await Promise.all([
    Promise.resolve(getBaseUrl()),
    getAdjacentPosts(post.publishedAt),
  ])
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : undefined,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Suburban Dad Mode',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/journal/${post.slug.current}`,
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://suburbandadmode.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Journal',
        item: 'https://suburbandadmode.com/journal',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://suburbandadmode.com/journal/${post.slug.current}`,
      },
    ],
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbSchema} />
      <article className="container mx-auto px-4 py-8 max-w-4xl">
      <nav className="mb-8">
        <Link
          href="/journal"
          className="inline-flex items-center gap-2 font-cooper text-sdm-text-light hover:text-sdm-primary transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Journal
        </Link>
      </nav>
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-sdm-text mb-4">
          {post.title}
        </h1>
        
        <div className="mb-6">
          <time dateTime={post.publishedAt} className="text-sm text-sdm-text-light">
            {format(new Date(post.publishedAt), 'MM/dd/yyyy')}
          </time>
        </div>

        {post.mainImage && (
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8">
            <Image
              src={urlFor(post.mainImage).width(1200).height(600).url()}
              alt={post.mainImage.alt || post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              className="object-cover"
              priority
            />
          </div>
        )}
      </header>

      <div className="prose prose-xl max-w-none text-xl md:text-2xl font-light">
        <PortableText content={post.body} />
      </div>

      {post.categories && post.categories.length > 0 && (
        <div className="mt-8 pt-8 border-t border-sdm-border">
          <h2 className="text-sm font-semibold text-sdm-text mb-2">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {post.categories.map((category) => (
              <span
                key={category._id}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sdm-surface-subtle text-sdm-text"
              >
                {category.title}
              </span>
            ))}
          </div>
        </div>
      )}

      {(adjacentPosts.newer || adjacentPosts.older) && (
        <nav className="flex items-center justify-between mt-12 pt-8 border-t border-sdm-border" aria-label="Journal navigation">
          {adjacentPosts.older ? (
            <Link
              href={`/journal/${adjacentPosts.older.slug}`}
              className="font-cooper text-sdm-text-light hover:text-sdm-primary transition-colors duration-200"
            >
              &larr; {adjacentPosts.older.title}
            </Link>
          ) : <span />}
          {adjacentPosts.newer ? (
            <Link
              href={`/journal/${adjacentPosts.newer.slug}`}
              className="font-cooper text-sdm-text-light hover:text-sdm-primary transition-colors duration-200 text-right"
            >
              {adjacentPosts.newer.title} &rarr;
            </Link>
          ) : <span />}
        </nav>
      )}
    </article>
    </>
  )
}