import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Mock server-only module (throws in non-Next.js environments)
vi.mock('server-only', () => ({}))
