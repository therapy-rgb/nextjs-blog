import Image from 'next/image'
import { notFound } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { client, postQuery } from '@/lib/sanity'
import { Post } from '@/types/sanity'
import { urlFor } from '@/lib/sanity'
import PortableText from '@/components/PortableText'
import JsonLd from '@/components/JsonLd'
import { Metadata } from 'next'

interface PostPageProps {
  params: Promise<{
    slug: string
  }>
}

export const revalidate = 3600 // Revalidate every hour

async function getPost(slug: string): Promise<Post | null> {
  try {
    return await client.fetch(postQuery, { slug })
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com'
  
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
      name: 'My Personal Blog',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/posts/${post.slug.current}`,
    },
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <article className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>
        
        <div className="flex items-center gap-4 text-gray-600 mb-6">
          {post.author.image && (
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={urlFor(post.author.image).width(48).height(48).url()}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900">{post.author.name}</p>
            <time dateTime={post.publishedAt} className="text-sm">
              {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
            </time>
          </div>
        </div>

        {post.mainImage && (
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8">
            <Image
              src={urlFor(post.mainImage).width(1200).height(600).url()}
              alt={post.mainImage.alt || post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
      </header>

      <div className="prose prose-lg max-w-none">
        <PortableText content={post.body} />
      </div>

      {post.categories && post.categories.length > 0 && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {post.categories.map((category) => (
              <span
                key={category._id}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {category.title}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
    </>
  )
}