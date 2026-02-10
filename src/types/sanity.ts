import { PortableTextBlock } from '@portabletext/react'

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
}

export interface Author {
  _id: string
  name: string
  slug: {
    current: string
  }
  image?: SanityImage
  bio?: PortableTextBlock[]
}

export interface Category {
  _id: string
  title: string
  slug: {
    current: string
  }
  description?: string
}

export interface Post {
  _id: string
  _updatedAt?: string
  title: string
  slug: {
    current: string
  }
  publishedAt: string
  excerpt?: string
  mainImage?: SanityImage
  body: PortableTextBlock[]
  author: Author
  categories?: Category[]
}

/** Lightweight post type for list views - excludes full body content */
export interface PostListItem {
  _id: string
  title: string
  slug: {
    current: string
  }
  publishedAt: string
  excerpt?: string
  mainImage?: SanityImage
}

export interface JournalEntry {
  _id: string
  title: string
  slug: {
    current: string
  }
  publishedAt: string
  excerpt?: string
  body: PortableTextBlock[]
}

export interface DocumentationSection {
  _id: string
  title: string
  slug: {
    current: string
  }
  content: PortableTextBlock[]
  order: number
}

export interface GalleryPhoto {
  _key: string
  alt: string
  caption?: string
  asset: {
    _ref: string
    _type: 'reference'
  }
}

export interface PhotoGallery {
  _id: string
  title: string
  photos: GalleryPhoto[]
}

export interface Poem {
  _key: string
  title: string
  slug: string
  text: string
}

export interface PutteringPoems {
  _id: string
  title: string
  poems: Poem[]
}