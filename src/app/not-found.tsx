import Link from 'next/link'
import PageContainer from '@/components/PageContainer'

export default function NotFound() {
  return (
    <PageContainer>
      <div className="text-center py-20">
        <h1 className="font-display text-6xl font-bold text-sdm-text mb-4">404</h1>
        <h2 className="font-display text-2xl font-bold text-sdm-text mb-4">Page Not Found</h2>
        <p className="text-lg text-sdm-text-light mb-8 font-cooper">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sdm-primary font-cooper font-semibold hover:text-sdm-accent transition-colors duration-200"
        >
          ← Back to Home
        </Link>
      </div>
    </PageContainer>
  )
}
