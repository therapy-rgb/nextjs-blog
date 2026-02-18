---
name: checkup
description: Run a comprehensive site health audit — security, performance, SEO, accessibility, and more
argument-hint: [optional section: security, deps, perf, seo, a11y, docs, code, or all]
---

# Site Health Checkup

Run a structured health audit of the site and produce a report with pass/warn/fail for each section.

## Input

$ARGUMENTS is an optional section name to run only that section:
- `security` — security only
- `deps` — dependencies only
- `perf` — performance only
- `seo` — SEO only
- `a11y` — accessibility only
- `docs` — documentation only
- `code` — code quality only

If $ARGUMENTS is empty or `all`, run all sections.

## Report Format

For each section, output a header with a status indicator:
- **PASS** — no issues found
- **WARN** — non-critical issues that should be addressed
- **FAIL** — critical issues that need immediate attention

End with a summary table showing the status of each section.

---

## Section 1: CODE QUALITY

Run each command and report results. Stop this section on first failure but continue to other sections.

```bash
npm run build 2>&1
```

```bash
npm run lint 2>&1
```

```bash
npm run test 2>&1
```

- PASS if all three succeed
- FAIL if any command fails — report which one and the error output

---

## Section 2: SECURITY

### 2a. Dependency vulnerabilities
```bash
npm audit --audit-level=moderate 2>&1
```
Report the number of vulnerabilities by severity. WARN if moderate, FAIL if high/critical.

### 2b. Hardcoded secrets
Search source files for potential hardcoded secrets. Check for patterns like API keys, tokens, passwords, and connection strings in `src/`, `sanity-studio/schemaTypes/`, and config files (excluding `.env*`, `node_modules`, `.next`).

Patterns to search for:
- Strings that look like API keys (long alphanumeric strings assigned to variables named `key`, `token`, `secret`, `password`, `apiKey`, etc.)
- Hardcoded URLs with credentials embedded
- Private keys or certificate content

FAIL if any secrets found in committed source. PASS if clean.

### 2c. CSP headers
Read `next.config.ts` and check that Content-Security-Policy headers are configured. WARN if missing or incomplete.

### 2d. Environment validation
Read `src/lib/env.ts` and cross-reference with `.env.local` variables. Check that all env vars used in the codebase are validated. WARN if any are accessed directly via `process.env` without going through env validation.

### 2e. API route protection
Check `src/app/api/revalidate/route.ts`:
- Verify it validates `SANITY_REVALIDATION_SECRET`
- Verify it uses security utilities from `src/lib/api-security.ts`

Check any other API routes under `src/app/api/` for rate limiting and input validation. WARN if unprotected routes found.

### 2f. XSS surface
Search for `dangerouslySetInnerHTML` usage in `src/`. For each occurrence, verify the content is sanitized with `escapeHtml()` from `src/lib/validation.ts`. FAIL if unsanitized usage found.

### 2g. HTTPS enforcement
Search for `http://` URLs in source files (excluding localhost, node_modules, comments referencing specs). WARN if any non-localhost HTTP URLs found in source.

---

## Section 3: DEPENDENCIES

```bash
npm outdated 2>&1
```

Report outdated packages in a table. Categorize:
- **Major version behind**: WARN (potential breaking changes)
- **Minor/patch behind**: informational
- Flag specifically if `next`, `react`, `sanity`, `@sanity/client`, or `next-sanity` are outdated — these are core and version-sensitive per `.claude/rules/sanity-schemas.md`

PASS if all core deps are current. WARN if minor updates available. FAIL if core deps are a major version behind.

---

## Section 4: PERFORMANCE

### 4a. Build output analysis
Run the build (reuse Section 1 results if already run) and analyze the output:
- Report page sizes from the build output (First Load JS for each route)
- WARN if any page exceeds 200kB First Load JS
- FAIL if any page exceeds 350kB First Load JS

### 4b. Image optimization
Check `public/` directory for images:
- Flag any images over 500kB (should be optimized or served via next/image)
- Check that pages use `next/image` component rather than raw `<img>` tags in `src/`
- WARN if raw `<img>` tags found or large unoptimized images exist

### 4c. Fonts
Check that font files in `public/fonts/` are reasonable sizes. WARN if any font file exceeds 500kB.

---

## Section 5: SEO

Start the dev server if not already running, then use Playwright to inspect the rendered pages.

### 5a. Check dev server
```bash
lsof -ti:3000 2>/dev/null
```
If not running, start it in the background and wait for ready.

### 5b. Homepage inspection
Navigate to `http://localhost:3000` with Playwright `browser_snapshot` and check:
- `<title>` tag exists and is descriptive
- `<meta name="description">` exists and has content
- Open Graph tags: `og:title`, `og:description`, `og:image`
- Twitter card tags
- Canonical URL
- Proper heading hierarchy (single `<h1>`, logical nesting)

### 5c. Robots and sitemap
Use Playwright to check:
- `http://localhost:3000/robots.txt` exists and has valid directives
- `http://localhost:3000/sitemap.xml` exists and contains URLs

### 5d. Structured data
Check for JSON-LD structured data on the homepage. Verify the `JsonLd` component from `src/components/seo/` is being used.

Report findings per check. PASS if all present. WARN for missing non-critical tags. FAIL if no title, no meta description, or no robots.txt.

---

## Section 6: ACCESSIBILITY

Using the same Playwright session from Section 5:

### 6a. Homepage audit
Take a `browser_snapshot` of the homepage and check:
- All images have `alt` attributes
- Interactive elements have ARIA labels where appropriate
- No empty links or buttons
- Focus order is logical (check tab sequence)
- `<html>` has `lang` attribute
- Skip-to-content link exists (or note if missing)

### 6b. Color contrast
Check `src/app/globals.css` color token definitions against WCAG AA requirements:
- Text (`sdm-text` #1D3557) on Background (`sdm-background` #F3EFF5)
- Text-light (`sdm-text-light` #457B9D) on Background
- Text on Card (`sdm-card` #FFFFFF)
- Primary (`sdm-primary` #C44569) on Background and Card
- Also check dark mode token pairs

### 6c. Touch targets
Search components in `src/components/` for interactive elements (buttons, links, form inputs). Verify they have minimum 44x44px touch targets via Tailwind classes (min-h-11, min-w-11, p-3, etc.) or explicit sizing.

### 6d. Keyboard navigation
Check that the mobile menu in `Header.tsx` uses focus-trap-react and supports Escape to close. Verify `useMobileMenu.ts` handles keyboard events.

### 6e. Reduced motion
Search for animations/transitions in source. Check for `prefers-reduced-motion` media query usage. WARN if animations exist without motion-safe guards.

PASS if all checks clear. WARN for missing nice-to-haves. FAIL for missing alt text, no lang attribute, or contrast failures.

---

## Section 7: DOCUMENTATION

### 7a. README freshness
Read `README.md` and compare against:
- Current `package.json` scripts and dependencies
- Current directory structure (`src/app/`, `src/components/`, `src/lib/`)
- Current environment variables referenced in source

Flag any sections that reference non-existent files, outdated dependency versions, or missing new features.

### 7b. CLAUDE.md freshness
Read `CLAUDE.md` and compare against:
- Actual project structure on disk
- Current barrel exports in `src/components/`
- Current hooks in `src/hooks/`
- Current lib modules in `src/lib/`
- Current Sanity schemas in `sanity-studio/schemaTypes/`

Flag any discrepancies.

### 7c. Component barrel exports
Verify each `index.ts` barrel export in `src/components/` re-exports all components in its directory. WARN if any component files are missing from their barrel export.

PASS if docs match reality. WARN if minor discrepancies. FAIL if major sections are outdated or wrong.

---

## Summary

After all sections complete, output a summary table:

```
SITE HEALTH CHECKUP — [date]
────────────────────────────────
  Code Quality     [PASS/WARN/FAIL]
  Security         [PASS/WARN/FAIL]
  Dependencies     [PASS/WARN/FAIL]
  Performance      [PASS/WARN/FAIL]
  SEO              [PASS/WARN/FAIL]
  Accessibility    [PASS/WARN/FAIL]
  Documentation    [PASS/WARN/FAIL]
────────────────────────────────
```

Then list the top 3 most important action items to address, prioritized by severity.
