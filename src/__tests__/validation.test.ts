import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  validatePhone,
  escapeHtml,
  sanitizeString,
  isNonEmpty,
  isValidUrl,
} from '@/lib/validation'

describe('validateEmail', () => {
  it('accepts valid emails', () => {
    expect(validateEmail('user@example.com')).toBe(true)
    expect(validateEmail('test.user+tag@domain.co.uk')).toBe(true)
  })

  it('rejects invalid emails', () => {
    expect(validateEmail('')).toBe(false)
    expect(validateEmail('notanemail')).toBe(false)
    expect(validateEmail('missing@')).toBe(false)
    expect(validateEmail('@nodomain.com')).toBe(false)
  })

  it('trims whitespace before validating', () => {
    expect(validateEmail('  user@example.com  ')).toBe(true)
  })
})

describe('validatePhone', () => {
  it('accepts valid US phone numbers', () => {
    expect(validatePhone('555-123-4567')).toBe(true)
    expect(validatePhone('(555) 123-4567')).toBe(true)
    expect(validatePhone('5551234567')).toBe(true)
    expect(validatePhone('+1 555 123 4567')).toBe(true)
  })

  it('rejects invalid phone numbers', () => {
    expect(validatePhone('')).toBe(false)
    expect(validatePhone('123')).toBe(false)
    expect(validatePhone('abcdefghij')).toBe(false)
  })
})

describe('escapeHtml', () => {
  it('escapes HTML special characters', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    )
  })

  it('escapes ampersands', () => {
    expect(escapeHtml('a & b')).toBe('a &amp; b')
  })

  it('escapes single quotes', () => {
    expect(escapeHtml("it's")).toBe("it&#039;s")
  })

  it('handles strings with no special characters', () => {
    expect(escapeHtml('hello world')).toBe('hello world')
  })

  it('handles empty strings', () => {
    expect(escapeHtml('')).toBe('')
  })
})

describe('sanitizeString', () => {
  it('trims and truncates strings', () => {
    expect(sanitizeString('  hello  ', 10)).toBe('hello')
    expect(sanitizeString('a very long string', 5)).toBe('a ver')
  })

  it('handles null and undefined', () => {
    expect(sanitizeString(null, 10)).toBe('')
    expect(sanitizeString(undefined, 10)).toBe('')
  })

  it('converts non-string values', () => {
    expect(sanitizeString(123, 10)).toBe('123')
  })
})

describe('isNonEmpty', () => {
  it('returns true for non-empty strings', () => {
    expect(isNonEmpty('hello')).toBe(true)
  })

  it('returns false for empty and whitespace strings', () => {
    expect(isNonEmpty('')).toBe(false)
    expect(isNonEmpty('   ')).toBe(false)
  })
})

describe('isValidUrl', () => {
  it('accepts valid URLs', () => {
    expect(isValidUrl('https://example.com')).toBe(true)
    expect(isValidUrl('http://localhost:3000')).toBe(true)
  })

  it('rejects invalid URLs', () => {
    expect(isValidUrl('')).toBe(false)
    expect(isValidUrl('not-a-url')).toBe(false)
  })
})
