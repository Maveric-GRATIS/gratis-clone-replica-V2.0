/**
 * Global Error Handler
 * Centralized error processing, logging, and response
 */

import { AppError, isAppError, isOperationalError, toAppError } from './app-error';
import { ErrorSeverity, ErrorResponse, ErrorLogEntry } from '@/types/errors';
import { GENERAL_ERRORS } from './error-codes';

/**
 * Error handler configuration
 */
interface ErrorHandlerConfig {
  enableLogging: boolean;
  enableSentry: boolean;
  enableConsole: boolean;
  logToFirestore: boolean;
  notifyAdmins: boolean;
  shutdownOnCritical: boolean;
}

/**
 * Global error handler class
 */
class ErrorHandler {
  private config: ErrorHandlerConfig = {
    enableLogging: true,
    enableSentry: import.meta.env.PROD,
    enableConsole: import.meta.env.DEV,
    logToFirestore: true,
    notifyAdmins: true,
    shutdownOnCritical: false,
  };

  /**
   * Configure error handler
   */
  configure(config: Partial<ErrorHandlerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Handle error
   */
  async handle(error: Error | AppError, context?: Record<string, any>): Promise<ErrorResponse> {
    const appError = isAppError(error) ? error : toAppError(error);

    // Log error
    await this.logError(appError, context);

    // Send to monitoring services
    await this.reportError(appError, context);

    // Notify admins for critical errors
    if (appError.severity === ErrorSeverity.CRITICAL && this.config.notifyAdmins) {
      await this.notifyAdmins(appError, context);
    }

    // Shutdown on critical non-operational errors
    if (
      appError.severity === ErrorSeverity.CRITICAL &&
      !appError.isOperational &&
      this.config.shutdownOnCritical
    ) {
      await this.shutdown(appError);
    }

    return this.formatErrorResponse(appError, context);
  }

  /**
   * Handle async operation with error catching
   */
  async handleAsync<T>(
    operation: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      const errorResponse = await this.handle(error as Error, context);
      throw toAppError(error);
    }
  }

  /**
   * Handle sync operation with error catching
   */
  handleSync<T>(operation: () => T, context?: Record<string, any>): T {
    try {
      return operation();
    } catch (error) {
      this.handle(error as Error, context);
      throw toAppError(error);
    }
  }

  /**
   * Log error
   */
  private async logError(error: AppError, context?: Record<string, any>): Promise<void> {
    if (!this.config.enableLogging) return;

    const logEntry: ErrorLogEntry = {
      id: this.generateErrorId(),
      code: error.code,
      message: error.message,
      severity: error.severity,
      category: error.category,
      timestamp: error.timestamp,
      metadata: {
        ...context,
        stack: error.stack,
        details: error.details,
      },
      resolved: false,
    };

    // Console logging (development)
    if (this.config.enableConsole) {
      this.logToConsole(error, context);
    }

    // Firestore logging (production)
    if (this.config.logToFirestore) {
      await this.logToFirestore(logEntry);
    }
  }

  /**
   * Log to console
   */
  private logToConsole(error: AppError, context?: Record<string, any>): void {
    const logLevel = this.getLogLevel(error.severity);
    const logMessage = `[${error.code}] ${error.message}`;

    console[logLevel](logMessage, {
      severity: error.severity,
      category: error.category,
      statusCode: error.statusCode,
      details: error.details,
      context,
      stack: error.stack,
    });
  }

  /**
   * Log to Firestore
   */
  private async logToFirestore(entry: ErrorLogEntry): Promise<void> {
    try {
      // Import dynamically to avoid circular dependencies
      const { db } = await import('@/firebase');
      const { collection, addDoc } = await import('firebase/firestore');

      await addDoc(collection(db, 'errorLogs'), {
        ...entry,
        timestamp: entry.timestamp.toISOString(),
      });
    } catch (error) {
      console.error('Failed to log error to Firestore:', error);
    }
  }

  /**
   * Report to external monitoring
   */
  private async reportError(error: AppError, context?: Record<string, any>): Promise<void> {
    if (!this.config.enableSentry) return;

    try {
      // Try to import Sentry dynamically if available
      const sentryModule = await import('@/lib/errors/sentry').catch(() => null);

      if (!sentryModule) {
        console.warn('Sentry module not available');
        return;
      }

      const { captureException, setContext, setTag } = sentryModule;

      if (error.details) {
        setContext('error_details', error.details);
      }

      captureException(error);
    } catch (error) {
      // Sentry not configured or import failed
      console.warn('Sentry reporting failed:', error);
    }
  }

  /**
   * Notify administrators
   */
  private async notifyAdmins(error: AppError, context?: Record<string, any>): Promise<void> {
    try {
      // Note: Admin notification service not yet implemented
      // TODO: Implement sendAdminNotification in notification service
      console.warn('Admin notification requested but service not available:', {
        error: error.message,
        code: error.code,
        severity: error.severity,
      });

      /*
      // Future implementation:
      const notificationModule = await import('@/lib/services/notificationService').catch(() => null);

      if (!notificationModule || !notificationModule.sendAdminNotification) {
        console.warn('Notification service not available');
        return;
      }

      const { sendAdminNotification } = notificationModule;

      await sendAdminNotification({
        title: `${error.severity.toUpperCase()}: ${error.message}`,
        message: error.message,
        data: {
          code: error.code,
          severity: error.severity,
          category: error.category,
          context,
          timestamp: error.timestamp.toISOString(),
        },
      });
      */
    } catch (notifyError) {
      console.error('Failed to notify admins:', notifyError);
    }
  }

  /**
   * Shutdown application
   */
  private async shutdown(error: AppError): Promise<void> {
    console.error('Critical error detected. Shutting down...', error);

    // Perform cleanup
    try {
      // Close database connections
      // Cancel pending operations
      // Save state if needed
    } catch (cleanupError) {
      console.error('Cleanup failed:', cleanupError);
    }

    // Exit process (Node.js environment)
    if (typeof process !== 'undefined' && process.exit) {
      process.exit(1);
    }
  }

  /**
   * Format error response
   */
  private formatErrorResponse(error: AppError, context?: Record<string, any>): ErrorResponse {
    const response: ErrorResponse = {
      code: error.code,
      message: this.getUserFriendlyMessage(error),
      timestamp: error.timestamp.toISOString(),
    };

    // Include details in development
    if (import.meta.env.DEV) {
      response.details = {
        ...error.details,
        category: error.category,
        severity: error.severity,
        stack: error.stack,
      };
    }

    // Include request context if available
    if (context?.path) {
      response.path = context.path;
    }

    if (context?.requestId) {
      response.requestId = context.requestId;
    }

    return response;
  }

  /**
   * Get user-friendly error message
   */
  private getUserFriendlyMessage(error: AppError): string {
    // In production, sanitize technical messages
    if (import.meta.env.PROD && !error.isOperational) {
      return 'An unexpected error occurred. Our team has been notified.';
    }

    return error.message;
  }

  /**
   * Get log level from severity
   */
  private getLogLevel(severity: ErrorSeverity): 'log' | 'warn' | 'error' {
    switch (severity) {
      case ErrorSeverity.LOW:
        return 'log';
      case ErrorSeverity.MEDIUM:
        return 'warn';
      case ErrorSeverity.HIGH:
      case ErrorSeverity.CRITICAL:
        return 'error';
      default:
        return 'error';
    }
  }

  /**
   * Generate unique error ID
   */
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Check if error should be retried
   */
  shouldRetry(error: Error): boolean {
    if (isAppError(error)) {
      return error.isRetryable();
    }
    return false;
  }

  /**
   * Create error from unknown value
   */
  createError(error: unknown): AppError {
    if (isAppError(error)) {
      return error;
    }

    if (error instanceof Error) {
      return toAppError(error);
    }

    return AppError.fromErrorCode(GENERAL_ERRORS.UNKNOWN_ERROR, {
      originalError: error,
    });
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();

// Export class for testing
export { ErrorHandler };

/**
 * Utility: Handle error and return response
 */
export async function handleError(
  error: Error,
  context?: Record<string, any>
): Promise<ErrorResponse> {
  return errorHandler.handle(error, context);
}

/**
 * Utility: Wrap async function with error handling
 */
export function withErrorHandling<T>(
  fn: (...args: any[]) => Promise<T>,
  context?: Record<string, any>
) {
  return async (...args: any[]): Promise<T> => {
    try {
      return await fn(...args);
    } catch (error) {
      await errorHandler.handle(error as Error, context);
      throw error;
    }
  };
}

/**
 * Utility: Catch and convert errors
 */
export async function catchError<T>(
  promise: Promise<T>
): Promise<[T | null, AppError | null]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, errorHandler.createError(error)];
  }
}
