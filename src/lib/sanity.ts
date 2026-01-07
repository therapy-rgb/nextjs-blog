import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

if (!projectId || !dataset) {
  throw new Error('Missing Sanity credentials: NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET must be set')
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2023-05-03',
  useCdn: process.env.NODE_ENV === 'production',
})

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// Default author for journal entries
export const defaultAuthor = {
  _id: 'default-author',
  name: 'Marcus Berley',
  slug: { current: 'marcus-berley' },
  image: undefined,
  bio: undefined
}

// GROQ queries for journal entries
export const postsQuery = `*[_type == "journalEntry" && defined(slug) && defined(publishedAt) && private != true] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  body,
  "mainImage": body[_type == "image"][0]
}`

export const postQuery = `*[_type == "journalEntry" && slug.current == $slug && private != true][0] {
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  body,
  "mainImage": body[_type == "image"][0]
}`

export const authorQuery = `*[_type == "author" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  image,
  bio
}`
