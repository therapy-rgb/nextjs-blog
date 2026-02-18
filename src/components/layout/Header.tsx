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
    <header className="border-b border-sdm-border shadow-sm bg-sdm-card">
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
            className="font-display text-xl font-bold text-sdm-primary hover:text-sdm-accent transition-colors duration-200"
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
            className="md:hidden inline-flex items-center gap-2 justify-center p-3 min-w-[44px] min-h-[44px] rounded-md text-sdm-text-light hover:text-sdm-primary hover:bg-sdm-surface-subtle transition-colors duration-200"
            onClick={toggle}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? 'Close main menu' : 'Open main menu'}
          >
            <span className="text-sm font-semibold tracking-wide uppercase">Menu</span>
            <svg
              className="h-6 w-6"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M7 12h16M4 18h16" />
            </svg>
          </button>
        </div>

      </div>

      {/* Mobile Side Drawer */}
      <div className="md:hidden" aria-hidden={!isOpen}>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={close}
        />

        {/* Drawer panel */}
        <FocusTrap
          active={isOpen}
          focusTrapOptions={{
            allowOutsideClick: true,
            returnFocusOnDeactivate: true,
            initialFocus: false,
          }}
        >
          <nav
            id="mobile-menu"
            ref={menuRef}
            className={`fixed top-0 right-0 w-44 bg-sdm-overlay backdrop-blur-sm shadow-xl rounded-bl-2xl z-50 transform transition-transform duration-300 ease-in-out ${
              isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            aria-label="Mobile navigation"
          >
            {/* Close button */}
            <div className="flex justify-start p-4 pb-2">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 min-w-[44px] min-h-[44px] rounded-md text-white/70 hover:text-white transition-colors duration-200"
                onClick={close}
                aria-label="Close menu"
              >
                <svg className="h-5 w-5" stroke="currentColor" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <div className="px-4 pb-4 space-y-0.5">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2.5 min-h-[44px] rounded-lg text-lg font-cooper transition-colors duration-200 ${
                    pathname === item.href
                      ? 'text-white font-bold bg-white/20'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={close}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </FocusTrap>
      </div>
    </header>
  )
}
