/**
 * Error Handling System - Main Export
 * Central export point for all error handling functionality
 */

// Types
export * from '@/types/errors';

// Error Codes
export * from './error-codes';

// Custom Error Classes
export * from './app-error';

// Error Handler
export * from './error-handler';

// Retry Logic
export * from './retry';

// Re-export commonly used items for convenience
export type { ErrorCodeDefinition } from './error-codes';
export { ERROR_CODES, getErrorDefinition, isRetryableError } from './error-codes';
export { AppError, toAppError, isAppError, isOperationalError } from './app-error';
export { errorHandler, handleError, withErrorHandling, catchError } from './error-handler';
export { retry, retryWithAttempts, retryNetwork, retryDatabase, retryExternalAPI } from './retry';
