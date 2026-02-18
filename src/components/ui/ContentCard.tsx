import { ReactNode } from 'react'

interface ContentCardProps {
  children: ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
}

const paddingClasses = {
  sm: 'p-6',
  md: 'p-6 sm:p-8',
  lg: 'p-8 sm:p-12',
}

export default function ContentCard({
  children,
  className = '',
  padding = 'md',
}: ContentCardProps) {
  return (
    <div
      className={`bg-sdm-card rounded-lg shadow-sm border border-sdm-border ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </div>
  )
}
