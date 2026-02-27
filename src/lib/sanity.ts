import { createClient } from '@sanity/client'
import { createImageUrlBuilder, SanityImageSource } from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

if (!projectId || !dataset) {
  throw new Error('Missing Sanity credentials: NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET must be set')
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-12',
  useCdn: process.env.NODE_ENV === 'production',
})

const builder = createImageUrlBuilder(client)

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

// Lightweight query for listing pages - excludes full body content
export const postsListQuery = `*[_type == "journalEntry" && defined(slug) && defined(publishedAt) && private != true] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  "mainImage": coalesce(mainImage, body[_type == "image"][0])
}`

// Full query for backwards compatibility (deprecated - use postsListQuery for listings)
export const postsQuery = `*[_type == "journalEntry" && defined(slug) && defined(publishedAt) && private != true] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  body,
  "mainImage": coalesce(mainImage, body[_type == "image"][0])
}`

// Full query for individual post detail pages
export const postQuery = `*[_type == "journalEntry" && slug.current == $slug && private != true][0] {
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  body,
  "mainImage": coalesce(mainImage, body[_type == "image"][0])
}`

// Fetch the adjacent (newer/older) journal entries for prev/next navigation
export const adjacentPostsQuery = `{
  "newer": *[_type == "journalEntry" && defined(slug) && defined(publishedAt) && private != true && publishedAt > $publishedAt] | order(publishedAt asc)[0] {
    title,
    "slug": slug.current
  },
  "older": *[_type == "journalEntry" && defined(slug) && defined(publishedAt) && private != true && publishedAt < $publishedAt] | order(publishedAt desc)[0] {
    title,
    "slug": slug.current
  }
}`

export const authorQuery = `*[_type == "author" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  image,
  bio
}`

export const documentationSectionsQuery = `*[_type == "documentationSection"] | order(order asc) {
  _id,
  title,
  slug,
  content,
  order
}`

export const photoGalleryQuery = `*[_id == "photoGallery"][0] {
  _id,
  title,
  photos[] {
    _key,
    alt,
    caption,
    asset
  }
}`

export const putteringPoemsQuery = `*[_id == "putteringPoems"][0] {
  _id,
  title,
  poems[] {
    _key,
    title,
    "slug": slug.current,
    text
  }
}`

export const linksQuery = `*[_type == "link"] | order(lower(name) asc) {
  _id,
  name,
  url
}`

export const houseItemsQuery = `*[_type == "houseItem"] | order(order asc) {
  _id,
  title,
  category,
  order
}`

export const carItemsQuery = `*[_type == "carItem"] | order(order asc) {
  _id,
  title,
  car,
  category,
  order
}`

export const projectsQuery = `*[_type == "project" && visible == true] | order(order asc) {
  _id,
  title,
  slug,
  description,
  url,
  repoUrl,
  image,
  techStack,
  category,
  order
}`
