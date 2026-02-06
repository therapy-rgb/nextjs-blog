import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Puttering | Suburban Dad Mode',
  description: 'A collection of poems and creative writings from the suburbs.',
  alternates: {
    canonical: 'https://suburbandadmode.com/puttering',
  },
  openGraph: {
    title: 'Puttering | Suburban Dad Mode',
    description: 'A collection of poems and creative writings from the suburbs.',
    url: 'https://suburbandadmode.com/puttering',
    type: 'website',
  },
  twitter: {
    card: 'summary',
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
