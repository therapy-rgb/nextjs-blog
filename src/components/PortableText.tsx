import { PortableText as BasePortableText } from '@portabletext/react'

interface PortableTextProps {
  content: any[] // Sanity portable text format - using any due to complex Sanity types
}

export default function PortableText({ content }: PortableTextProps) {
  return (
    <div className="prose prose-lg max-w-none">
      <BasePortableText value={content} />
    </div>
  )
}