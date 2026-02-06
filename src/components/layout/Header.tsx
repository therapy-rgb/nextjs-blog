'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { usePathname } from 'next/navigation'
import FocusTrap from 'focus-trap-react'
import { navigation } from '@/lib/navigation'
import { useMobileMenu } from '@/hooks/useMobileMenu'

export default function Header() {
  const { isOpen, toggle, close, toggleButtonRef } = useMobileMenu()
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null)

  return (
    <header className="border-b border-warm-gray-200 shadow-sm bg-sdm-card">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-sdm-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-md"
      >
        Skip to main content
      </a>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="font-display text-3xl font-bold text-sdm-primary hover:text-sdm-accent transition-colors duration-200"
          >
            Suburban Dad Mode
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex">
            <ul className="flex space-x-8">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`font-cooper text-lg transition-colors duration-200 ${
                      pathname === item.href
                        ? 'text-sdm-primary font-bold'
                        : 'text-sdm-text-light hover:text-sdm-primary'
                    }`}
                    aria-current={pathname === item.href ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile menu button */}
          <button
            ref={toggleButtonRef}
            type="button"
            className="md:hidden inline-flex items-center justify-center p-3 min-w-[44px] min-h-[44px] rounded-md text-sdm-text-light hover:text-sdm-primary hover:bg-warm-gray-100 transition-colors duration-200"
            onClick={toggle}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? 'Close main menu' : 'Open main menu'}
          >
            {/* Hamburger icon */}
            <svg
              className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            {/* Close icon */}
            <svg
              className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation with Focus Trap */}
        {isOpen && (
          <FocusTrap
            active={isOpen}
            focusTrapOptions={{
              allowOutsideClick: true,
              returnFocusOnDeactivate: true,
              initialFocus: false,
            }}
          >
            <div id="mobile-menu" ref={menuRef} className="md:hidden" role="navigation" aria-label="Mobile navigation">
              <div className="px-2 pt-2 pb-3 space-y-1 border-t border-warm-gray-200">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-3 py-3 min-h-[44px] rounded-md text-lg font-cooper transition-colors duration-200 ${
                      pathname === item.href
                        ? 'text-sdm-primary bg-warm-gray-100 font-bold'
                        : 'text-sdm-text-light hover:text-sdm-primary hover:bg-warm-gray-100'
                    }`}
                    onClick={close}
                    aria-current={pathname === item.href ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </FocusTrap>
        )}
      </div>
    </header>
  )
}
