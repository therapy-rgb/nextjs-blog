import React from 'react'
import { PortableText as BasePortableText, PortableTextBlock } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import { SanityImageSource } from '@sanity/image-url'
import { SanityImage } from '@/types/sanity'

interface PortableTextProps {
  content: PortableTextBlock[]
}

const components = {
  marks: {
    link: ({ children, value }: { children: React.ReactNode; value?: { href?: string } }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sdm-primary no-underline hover:text-sdm-accent transition-colors duration-200"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }: { value: SanityImage }) => {
      if (!value?.asset?._ref) {
        return null
      }
      // Parse dimensions from asset ref (format: image-{hash}-{w}x{h}-{ext})
      const dims = value.asset._ref.match(/-(\d+)x(\d+)-/)
      const w = dims ? Number(dims[1]) : 1200
      const h = dims ? Number(dims[2]) : 800
      const isPortrait = h > w

      return (
        <figure className={`my-8 mx-auto${isPortrait ? ' max-w-sm' : ' max-w-2xl'}`}>
          <Image
            src={urlFor(value as SanityImageSource)
              .width(isPortrait ? 800 : 1200)
              .auto('format')
              .quality(80)
              .url()}
            alt={value.alt || 'Blog post image'}
            width={isPortrait ? 800 : 1200}
            height={isPortrait ? Math.round(800 * (h / w)) : 800}
            className="rounded-lg w-full h-auto"
            sizes={isPortrait
              ? '(max-width: 640px) 100vw, 384px'
              : '(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1200px) 80vw, 800px'}
          />
        </figure>
      )
    },
  },
}

export default function PortableText({ content }: PortableTextProps) {
  return <BasePortableText value={content} components={components} />
}
