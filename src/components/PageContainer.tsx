import { ReactNode } from 'react'

interface PageContainerProps {
  maxWidth?: '3xl' | '4xl' | '6xl'
  children: ReactNode
  className?: string
}

const maxWidthClasses = {
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '6xl': 'max-w-6xl',
}

export default function PageContainer({
  maxWidth = '4xl',
  children,
  className = '',
}: PageContainerProps) {
  return (
    <div
      className={`${maxWidthClasses[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8 py-16 ${className}`}
    >
      {children}
    </div>
  )
}
