import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('validateEnv', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('returns valid when required vars are set', async () => {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-id'
    process.env.NEXT_PUBLIC_SANITY_DATASET = 'production'
    process.env.NEXT_PHASE = 'phase-production-build' // skip auto-validation

    const { validateEnv } = await import('@/lib/env')
    const result = validateEnv()
    expect(result.valid).toBe(true)
    expect(result.missing).toHaveLength(0)
  })

  it('returns invalid when Sanity vars are missing', async () => {
    delete process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    delete process.env.NEXT_PUBLIC_SANITY_DATASET
    process.env.NEXT_PHASE = 'phase-production-build'

    const { validateEnv } = await import('@/lib/env')
    const result = validateEnv()
    expect(result.valid).toBe(false)
    expect(result.missing).toContain('NEXT_PUBLIC_SANITY_PROJECT_ID')
    expect(result.missing).toContain('NEXT_PUBLIC_SANITY_DATASET')
  })

  it('warns when optional vars are missing', async () => {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-id'
    process.env.NEXT_PUBLIC_SANITY_DATASET = 'production'
    process.env.NEXT_PHASE = 'phase-production-build'

    const { validateEnv } = await import('@/lib/env')
    const result = validateEnv()
    expect(result.warnings.length).toBeGreaterThan(0)
  })
})
