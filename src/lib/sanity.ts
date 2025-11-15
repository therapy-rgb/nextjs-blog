import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '4qp7h589'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

// Only create client if we have valid credentials
export const client = projectId && dataset ? createClient({
  projectId,
  dataset,
  apiVersion: '2023-05-03',
  useCdn: process.env.NODE_ENV === 'production',
}) : null as any

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// GROQ queries
export const postsQuery = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  mainImage,
  "author": author->{name, image}
}`

export const postQuery = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  mainImage,
  body,
  "author": author->{name, image, bio},
  "categories": categories[]->{title, slug}
}`

export const authorQuery = `*[_type == "author" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  image,
  bio
}`

// Journal entry queries
export const journalEntriesQuery = `*[_type == "journalEntry"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  body
}`

export const journalEntryQuery = `*[_type == "journalEntry" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  body
}`