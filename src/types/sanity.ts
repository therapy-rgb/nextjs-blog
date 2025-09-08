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
  bio?: any[] // Portable Text - keeping as any for Sanity's rich text format
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
  title: string
  slug: {
    current: string
  }
  publishedAt: string
  excerpt?: string
  mainImage?: SanityImage
  body: any[] // Portable Text - keeping as any for Sanity's rich text format
  author: Author
  categories?: Category[]
}