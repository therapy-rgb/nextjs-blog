import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'La Familia | Suburban Dad Mode',
  description: 'A gallery of precious family moments and memories from our suburban adventures.',
}

export default function LaFamiliaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}