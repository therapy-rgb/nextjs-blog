/**
 * API security utilities for rate limiting, origin validation, and request protection.
 * Ready for use when API routes are added (e.g., newsletter signup, etc.).
 */

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { RATE_LIMITS, getAllowedOrigins } from './constants'

// ============================================================
// Rate Limiting
// ============================================================

// Create Redis client and rate limiter only if env vars are available
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null

const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(RATE_LIMITS.DEFAULT.MAX_REQUESTS, '15 m'),
      analytics: true,
      prefix: 'sdm-api',
    })
  : null

// Fallback in-memory rate limiter (used when Redis is unavailable)
const fallbackRateLimitMap = new Map<string, { count: number; resetTime: number }>()

export interface RateLimitResult {
  success: boolean
  remaining?: number
  reset?: number
}

/**
 * Check rate limit for an IP address.
 * Uses Redis if available, falls back to in-memory limiting.
 */
export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  if (ratelimit) {
    try {
      const result = await ratelimit.limit(ip)
      return { success: result.success, remaining: result.remaining, reset: result.reset }
    } catch (error) {
      console.error('Redis rate limit error, using fallback:', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  // Fallback: in-memory rate limiting
  const now = Date.now()
  const record = fallbackRateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    const resetTime = now + RATE_LIMITS.DEFAULT.WINDOW_MS
    fallbackRateLimitMap.set(ip, { count: 1, resetTime })
    return { success: true, remaining: RATE_LIMITS.DEFAULT.MAX_REQUESTS - 1, reset: resetTime }
  }

  if (record.count >= RATE_LIMITS.DEFAULT.MAX_REQUESTS) {
    return { success: false, remaining: 0, reset: record.resetTime }
  }

  record.count++
  return { success: true, remaining: RATE_LIMITS.DEFAULT.MAX_REQUESTS - record.count, reset: record.resetTime }
}

/**
 * Create standard rate limit headers for API responses (RFC 6585)
 */
export function createRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'RateLimit-Limit': String(RATE_LIMITS.DEFAULT.MAX_REQUESTS),
    'RateLimit-Remaining': String(result.remaining ?? 0),
  }
  if (result.reset) {
    headers['RateLimit-Reset'] = String(Math.ceil(result.reset / 1000))
  }
  return headers
}

// ============================================================
// Origin Validation
// ============================================================

const ALLOWED_ORIGINS = getAllowedOrigins()

/**
 * Validate that the request origin is allowed.
 */
export function validateOrigin(origin: string | null): boolean {
  return origin !== null && ALLOWED_ORIGINS.includes(origin)
}

// ============================================================
// Honeypot Detection
// ============================================================

/**
 * Check if honeypot fields were filled (likely bot submission).
 */
export function detectHoneypot(body: Record<string, unknown>): boolean {
  const honeypotValue = body.website || body.company || body.url
  return !!honeypotValue && String(honeypotValue).trim().length > 0
}

// ============================================================
// IP Extraction
// ============================================================

/**
 * Validate IP address format (IPv4 or IPv6).
 */
function isValidIP(ip: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
  if (ipv4Regex.test(ip)) {
    const parts = ip.split('.').map(Number)
    return parts.every(part => part >= 0 && part <= 255)
  }

  const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/
  return ipv6Regex.test(ip)
}

/**
 * Extract client IP from request headers.
 * On Vercel, x-real-ip is set by the platform and cannot be spoofed.
 */
export function getClientIP(request: Request): string {
  const realIP = request.headers.get('x-real-ip')
  if (realIP && isValidIP(realIP)) {
    return realIP
  }

  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    const firstIP = forwardedFor.split(',')[0]?.trim()
    if (firstIP && isValidIP(firstIP)) {
      return firstIP
    }
  }

  return 'unknown'
}

// ============================================================
// Request Size Validation
// ============================================================

/**
 * Check if request content length exceeds maximum allowed size.
 */
export function isRequestTooLarge(request: Request): boolean {
  const contentLength = request.headers.get('content-length')
  return contentLength !== null && parseInt(contentLength, 10) > RATE_LIMITS.MAX_REQUEST_SIZE
}
