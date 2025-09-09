import { PortableText as BasePortableText, PortableTextBlock } from '@portabletext/react'

interface PortableTextProps {
  content: PortableTextBlock[]
}

export default function PortableText({ content }: PortableTextProps) {
  return (
    <div className="prose prose-lg max-w-none">
      <BasePortableText value={content} />
    </div>
  )
}