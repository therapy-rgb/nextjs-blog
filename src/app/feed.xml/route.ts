import { client, postsListQuery } from '@/lib/sanity'
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  DEFAULT_AUTHOR,
} from '@/lib/constants'
import type { PostListItem } from '@/types/sanity'

export const revalidate = 3600 // 1 hour

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const posts: PostListItem[] = await client.fetch(postsListQuery)

  const lastBuildDate =
    posts[0]?.publishedAt
      ? new Date(posts[0].publishedAt).toUTCString()
      : new Date().toUTCString()

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/posts/${post.slug.current}`
      const pubDate = new Date(post.publishedAt).toUTCString()
      const description = post.excerpt ? `<description>${escapeXml(post.excerpt)}</description>` : ''

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>${escapeXml(DEFAULT_AUTHOR.email)} (${escapeXml(DEFAULT_AUTHOR.name)})</author>
      ${description}
    </item>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}/journal</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <managingEditor>${escapeXml(DEFAULT_AUTHOR.email)} (${escapeXml(DEFAULT_AUTHOR.name)})</managingEditor>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
