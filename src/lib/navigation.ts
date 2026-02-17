export const navigation = [
  { name: 'La Familia', href: '/la-familia' },
  { name: 'Puttering', href: '/puttering' },
  { name: 'Journal', href: '/journal' },
  { name: 'Notes', href: '/documentation' },
  { name: 'Projects', href: '/projects' },
] as const

export type NavigationItem = (typeof navigation)[number]
