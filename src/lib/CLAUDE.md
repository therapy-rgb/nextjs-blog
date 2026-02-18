# Lib Directory

## Files

- **sanity.ts** - Sanity client configuration, GROQ queries, image URL builder
- **constants.ts** - Centralized site config: identity, cache, SEO, pagination, rate limits, allowed origins
- **env.ts** - Environment variable validation with typed exports, runs at startup
- **navigation.ts** - Navigation links configuration
- **validation.ts** - Input validation (email, phone) and sanitization (escapeHtml, sanitizeString)
- **api-security.ts** - Rate limiting (Upstash Redis + fallback), origin validation, honeypot detection, IP extraction
- **logging.ts** - Structured JSON logging for production debugging
- **tech-icons.ts** - Maps normalized tech names to react-icons components for ProjectCard

## Conventions

- All site-wide constants belong in `constants.ts`
- Environment variables are validated in `env.ts` and accessed via the `env` export
- GROQ queries are defined in `sanity.ts`, not in page components
- API security utilities are imported only in API route handlers
