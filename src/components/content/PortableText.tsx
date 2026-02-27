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
  block: {
    h1: ({ children }: { children?: React.ReactNode }) => (
      <h1 className="text-4xl font-bold mt-10 mb-4">{children}</h1>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="text-3xl font-bold mt-10 mb-3">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-2xl font-semibold mt-8 mb-2">{children}</h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="text-xl font-semibold mt-6 mb-2">{children}</h4>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-4 border-sdm-primary pl-6 my-8 italic text-sdm-text-light">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-disc pl-8 my-6 space-y-2">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="list-decimal pl-8 my-6 space-y-2">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-bold">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
    code: ({ children }: { children?: React.ReactNode }) => (
      <code className="bg-sdm-surface-subtle border border-sdm-border px-1.5 py-0.5 rounded text-[0.875em] font-mono">
        {children}
      </code>
    ),
    link: ({ children, value }: { children: React.ReactNode; value?: { href?: string } }) => {
      const href = value?.href && /^https?:\/\//i.test(value.href) ? value.href : undefined
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sdm-primary no-underline hover:text-sdm-accent transition-colors duration-200"
        >
          {children}
        </a>
      )
    },
  },
  types: {
    code: ({ value }: { value: { code?: string; language?: string; filename?: string } }) => (
      <figure className="my-8">
        {value.filename && (
          <figcaption className="text-sm text-sdm-text-light mb-2 font-mono">
            {value.filename}
          </figcaption>
        )}
        <pre className="bg-sdm-surface-subtle border border-sdm-border rounded-lg p-4 overflow-x-auto">
          <code className="text-base font-mono leading-relaxed">{value.code}</code>
        </pre>
      </figure>
    ),
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
