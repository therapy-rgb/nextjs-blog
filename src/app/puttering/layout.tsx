import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Puttering | Suburban Dad Mode',
  description: 'A collection of poems and creative writings from the suburbs.',
  openGraph: {
    title: 'Puttering | Suburban Dad Mode',
    description: 'A collection of poems and creative writings from the suburbs.',
  },
}

export default function PutteringLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
