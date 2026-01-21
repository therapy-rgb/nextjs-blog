import { PortableText as BasePortableText, PortableTextBlock } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
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
            src={urlFor(value as SanityImageSource).width(1200).url()}
            alt={value.alt || ''}
            width={1200}
            height={800}
            className="rounded-lg w-full h-auto"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
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