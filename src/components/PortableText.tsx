import { PortableText as BasePortableText, PortableTextBlock } from '@portabletext/react'

interface PortableTextProps {
  content: PortableTextBlock[]
}

export default function PortableText({ content }: PortableTextProps) {
  return <BasePortableText value={content} />
}