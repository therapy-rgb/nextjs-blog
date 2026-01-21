export const navigation = [
  { name: 'Home', href: '/' },
  { name: 'La Familia', href: '/la-familia' },
  { name: 'Puttering', href: '/puttering' },
  { name: 'Journal', href: '/journal' },
] as const

export type NavigationItem = (typeof navigation)[number]
