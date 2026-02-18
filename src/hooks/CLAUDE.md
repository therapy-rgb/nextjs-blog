# Hooks Directory

## Files

- **useMobileMenu.ts** - Mobile menu state management with route-close, Escape key, body scroll lock, and focus restoration
- **useTheme.ts** - Theme toggle (light/dark/system) using `useSyncExternalStore` for localStorage + OS preference. Cross-tab sync via `storage` event

## Conventions

- All custom hooks go in this directory
- Hooks must include `'use client'` directive at the top
- Use `useCallback` for stable function references returned from hooks
- Include JSDoc comments describing the hook's behavior
