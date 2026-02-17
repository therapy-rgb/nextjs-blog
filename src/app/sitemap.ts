import { MetadataRoute } from 'next'
import { client } from '@/lib/sanity'
import { getBaseUrl } from '@/lib/env'
import { logWarn } from '@/lib/logging'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl()

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/journal`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/la-familia`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/puttering`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/documentation?section=projects`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]

  let postEntries: MetadataRoute.Sitemap = []

  // Only try to fetch posts if Sanity is properly configured
  if (!client) {
    logWarn('sanity', 'Sanity client not configured, skipping dynamic sitemap entries')
    return [...staticPages]
  }

  try {
    const posts = await client.fetch(`
      *[_type == "journalEntry" && defined(slug.current) && private != true] {
        "slug": slug.current,
        "updatedAt": coalesce(_updatedAt, publishedAt)
      }
    `)

    postEntries = posts.map((post: { slug: string; updatedAt: string }) => ({
      url: `${baseUrl}/posts/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    logWarn('sanity', 'Could not fetch posts for sitemap, using static routes only', { error: error instanceof Error ? error.message : String(error) })
  }

  return [...staticPages, ...postEntries]
}