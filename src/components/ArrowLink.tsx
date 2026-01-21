import Link from 'next/link'
import { ReactNode } from 'react'
import { Route } from 'next'

interface ArrowLinkProps<T extends string> {
  href: Route<T> | T
  children: ReactNode
  className?: string
}

export default function ArrowLink<T extends string>({ href, children, className = '' }: ArrowLinkProps<T>) {
  return (
    <Link
      href={href as Route<T>}
      className={`inline-flex items-center gap-2 text-sdm-primary font-cooper font-semibold hover:text-sdm-accent transition-colors duration-200 group ${className}`}
    >
      {children}
      <svg
        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </Link>
  )
}
