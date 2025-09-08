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
        // Suburban Dad Mode color palette
        'sdm': {
          primary: '#6528F7',    // Primary purple
          accent: '#5511F8',     // Deeper purple accent
          background: '#f3e6e1', // Soft peachy-pink background
          text: '#0F172A',       // Dark navy text
          'text-light': '#64748B', // Light gray text
          'card': '#FFFFFF',     // White card background
        },
        // Custom grays to match the aesthetic
        'warm-gray': {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        },
      },
      fontFamily: {
        'body': ['var(--font-inter)', 'system-ui', 'sans-serif'],
        'cooper': ['var(--font-playfair)', 'serif'],
        'display': ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
      fontSize: {
        // Match the larger base font size from the reference site
        'base': ['22px', { lineHeight: '1.7' }],
        'lg': ['24px', { lineHeight: '1.6' }],
        'xl': ['28px', { lineHeight: '1.5' }],
        '2xl': ['32px', { lineHeight: '1.4' }],
        '3xl': ['40px', { lineHeight: '1.3' }],
        '4xl': ['48px', { lineHeight: '1.2' }],
        '5xl': ['64px', { lineHeight: '1.1' }],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
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