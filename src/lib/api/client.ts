// =============================================================================
// API CLIENT - Firebase Utilities
// =============================================================================

/**
 * API Error class for consistent error handling
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public status: number = 500
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Firebase error code mapping to user-friendly messages
 */
const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  'auth/user-not-found': 'No account found with this email address.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/invalid-email': 'Invalid email address.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Please check your connection.',
  'permission-denied': 'You do not have permission to perform this action.',
  'not-found': 'The requested resource was not found.',
  'already-exists': 'This resource already exists.',
  'unavailable': 'Service temporarily unavailable. Please try again.',
};

/**
 * Convert Firebase error to ApiError
 */
export function handleFirebaseError(error: any): ApiError {
  const code = error?.code || 'unknown';
  const message = FIREBASE_ERROR_MESSAGES[code] || error?.message || 'An unexpected error occurred.';

  let status = 500;
  if (code.includes('auth/') || code === 'permission-denied') {
    status = 401;
  } else if (code === 'not-found') {
    status = 404;
  } else if (code === 'already-exists') {
    status = 409;
  }

  return new ApiError(message, code, status);
}

/**
 * Retry logic for transient failures
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on auth errors or client errors
      if (error instanceof ApiError && error.status < 500) {
        throw error;
      }

      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    }
  }

  throw lastError || new ApiError('Operation failed after retries');
}

/**
 * Batch operation helper
 */
export function batchArray<T>(array: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < array.length; i += batchSize) {
    batches.push(array.slice(i, i + batchSize));
  }
  return batches;
}

/**
 * Debounce function for API calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  waitMs: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | undefined;

  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), waitMs);
  };
}

/**
 * Cache helper for API responses
 */
class ResponseCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: any, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now() + ttl,
    });
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);

    if (!cached) return null;

    if (Date.now() > cached.timestamp) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

export const apiCache = new ResponseCache();

/**
 * Generate cache key from params
 */
export function getCacheKey(prefix: string, params: Record<string, any>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${JSON.stringify(params[key])}`)
    .join('&');
  return `${prefix}:${sortedParams}`;
}
