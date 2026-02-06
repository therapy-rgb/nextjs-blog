import { PortableText as BasePortableText, PortableTextBlock } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import { SanityImageSource } from '@sanity/image-url'
import { SanityImage } from '@/types/sanity'

interface PortableTextProps {
  content: PortableTextBlock[]
}

const components = {
  types: {
    image: ({ value }: { value: SanityImage }) => {
      if (!value?.asset?._ref) {
        return null
      }
      return (
        <figure className="my-8">
          <Image
            src={urlFor(value as SanityImageSource)
              .width(1200)
              .auto('format')
              .quality(80)
              .url()}
            alt={value.alt || 'Blog post image'}
            width={1200}
            height={800}
            className="rounded-lg w-full h-auto"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1200px) 80vw, 800px"
          />
          {value.alt && (
            <figcaption className="text-center text-sm text-sdm-text-light mt-2">
              {value.alt}
            </figcaption>
          )}
        </figure>
      )
    },
  },
}

export default function PortableText({ content }: PortableTextProps) {
  return <BasePortableText value={content} components={components} />
}
