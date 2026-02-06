/**
 * Structured logging utilities
 * Outputs JSON-formatted logs for better parsing in production (Vercel, Sentry, etc.)
 */

export type LogLevel = 'info' | 'warn' | 'error'
export type LogType = 'api' | 'validation' | 'rate_limit' | 'honeypot' | 'origin' | 'sanity' | 'general'

interface LogEntry {
  timestamp: string
  level: LogLevel
  service: string
  type: LogType
  message: string
  ip?: string
  details?: Record<string, unknown>
}

const SERVICE_NAME = 'suburban-dad-mode'

/**
 * Log an error with structured JSON format.
 */
export function logError(type: LogType, message: string, details?: Record<string, unknown>): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: 'error',
    service: SERVICE_NAME,
    type,
    message,
    ...details,
  }
  console.error(JSON.stringify(entry))
}

/**
 * Log a warning with structured JSON format.
 */
export function logWarn(type: LogType, message: string, details?: Record<string, unknown>): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: 'warn',
    service: SERVICE_NAME,
    type,
    message,
    ...details,
  }
  console.warn(JSON.stringify(entry))
}

/**
 * Log info with structured JSON format.
 */
export function logInfo(type: LogType, message: string, details?: Record<string, unknown>): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: 'info',
    service: SERVICE_NAME,
    type,
    message,
    ...details,
  }
  console.log(JSON.stringify(entry))
}
