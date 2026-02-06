/**
 * Shared validation and sanitization utilities
 * Provides XSS prevention, input sanitization, and common validators
 */

// Email regex - validates structure with local part, @ symbol, domain with TLD
export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

// Phone regex - US format with optional country code
export const PHONE_REGEX = /^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/

// Maximum field lengths for common inputs
export const MAX_LENGTHS = {
  name: 100,
  email: 100,
  phone: 20,
  subject: 200,
  message: 2000,
  url: 500,
} as const

/**
 * Validates an email address
 */
export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim())
}

/**
 * Validates a phone number (US format)
 */
export function validatePhone(phone: string): boolean {
  return PHONE_REGEX.test(phone.trim())
}

/**
 * Escapes HTML characters to prevent XSS
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (char) => map[char])
}

/**
 * Sanitizes a string by trimming and enforcing max length
 */
export function sanitizeString(value: unknown, maxLength: number): string {
  return String(value ?? '').trim().slice(0, maxLength)
}

/**
 * Validates that a string is not empty after trimming
 */
export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0
}

/**
 * Validates a URL string
 */
export function isValidUrl(value: string): boolean {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}
