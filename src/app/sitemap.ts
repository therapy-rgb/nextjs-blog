import { MetadataRoute } from 'next'
import { client } from '@/lib/sanity'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com'

  let postEntries: MetadataRoute.Sitemap = []
  
  // Only try to fetch posts if Sanity is properly configured
  try {
    if (!client) {
      console.warn('Sanity client not configured, skipping dynamic sitemap entries')
      return [...staticPages]
    }

    const posts = await client.fetch(`
      *[_type == "post" && defined(slug.current)] {
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
    console.warn('Could not fetch posts for sitemap, using static routes only:', error)
  }

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
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
  ]

  return [...staticPages, ...postEntries]
}