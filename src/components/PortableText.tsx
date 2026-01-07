import { PortableText as BasePortableText, PortableTextBlock } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

interface PortableTextProps {
  content: PortableTextBlock[]
}

interface ImageValue {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
}

const components = {
  types: {
    image: ({ value }: { value: ImageValue }) => {
      if (!value?.asset?._ref) {
        return null
      }
      return (
        <figure className="my-8">
          <Image
            src={urlFor(value as SanityImageSource).width(1200).url()}
            alt={value.alt || ''}
            width={1200}
            height={800}
            className="rounded-lg w-full h-auto"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
          {value.alt && (
            <figcaption className="text-center text-sm text-gray-500 mt-2">
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