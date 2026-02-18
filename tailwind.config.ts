import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // Suburban Dad Mode color palette (resolved via CSS custom properties for dark mode)
        'sdm': {
          primary: 'var(--sdm-primary)',
          accent: 'var(--sdm-accent)',
          background: 'var(--sdm-background)',
          text: 'var(--sdm-text)',
          'text-light': 'var(--sdm-text-light)',
          'card': 'var(--sdm-card)',
        },
        // Custom grays (resolved via CSS custom properties for dark mode)
        'warm-gray': {
          50: 'var(--wg-50)',
          100: 'var(--wg-100)',
          200: 'var(--wg-200)',
          300: 'var(--wg-300)',
          400: 'var(--wg-400)',
          500: 'var(--wg-500)',
          600: 'var(--wg-600)',
          700: 'var(--wg-700)',
          800: 'var(--wg-800)',
          900: 'var(--wg-900)',
        },
      },
      fontFamily: {
        'body': ['var(--font-inter)', 'system-ui', 'sans-serif'],
        'cooper': ['Cooper', 'serif'],
        'display': ['Cooper', 'serif'],
        'disruptors': ['TT Disruptors', 'cursive'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['Cooper', 'serif'],
      },
      fontSize: {
        // Match the larger base font size from the reference site (rem for browser zoom support)
        'base': ['1.375rem', { lineHeight: '1.7' }],   // 22px
        'lg': ['1.5rem', { lineHeight: '1.6' }],       // 24px
        'xl': ['1.75rem', { lineHeight: '1.5' }],      // 28px
        '2xl': ['2rem', { lineHeight: '1.4' }],        // 32px
        '3xl': ['2.5rem', { lineHeight: '1.3' }],      // 40px
        '4xl': ['3rem', { lineHeight: '1.2' }],        // 48px
        '5xl': ['4rem', { lineHeight: '1.1' }],        // 64px
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            a: {
              color: 'inherit',
              textDecoration: 'underline',
              fontWeight: '500',
            },
            '[class~="lead"]': {
              color: 'inherit',
            },
            strong: {
              color: 'inherit',
            },
            'ol[type="A"]': {
              '--list-counter-style': 'upper-alpha',
            },
            'ol[type="a"]': {
              '--list-counter-style': 'lower-alpha',
            },
            'ol[type="A" s]': {
              '--list-counter-style': 'upper-alpha',
            },
            'ol[type="a" s]': {
              '--list-counter-style': 'lower-alpha',
            },
            'ol[type="I"]': {
              '--list-counter-style': 'upper-roman',
            },
            'ol[type="i"]': {
              '--list-counter-style': 'lower-roman',
            },
            'ol[type="I" s]': {
              '--list-counter-style': 'upper-roman',
            },
            'ol[type="i" s]': {
              '--list-counter-style': 'lower-roman',
            },
            'ol[type="1"]': {
              '--list-counter-style': 'decimal',
            },
            'ol > li::marker': {
              fontWeight: '400',
              color: 'var(--tw-prose-counters)',
            },
            'ul > li::marker': {
              color: 'var(--tw-prose-bullets)',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config