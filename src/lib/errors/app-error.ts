/**
 * Custom Error Classes
 * Type-safe error handling for GRATIS NGO platform
 */

import {
  ErrorSeverity,
  ErrorCategory,
  HttpStatusCode,
  AppErrorOptions,
  ValidationErrorDetail,
} from '@/types/errors';
import { ErrorCodeDefinition } from './error-codes';

/**
 * Base Application Error
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly severity: ErrorSeverity;
  public readonly category: ErrorCategory;
  public readonly statusCode: HttpStatusCode;
  public readonly details?: Record<string, any>;
  public readonly metadata?: Record<string, any>;
  public readonly isOperational: boolean;
  public readonly timestamp: Date;
  public cause?: Error;

  constructor(
    message: string,
    options: AppErrorOptions = {}
  ) {
    super(message);

    // Maintain proper stack trace
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.code = options.code || 'GRT-999-999';
    this.severity = options.severity || ErrorSeverity.HIGH;
    this.category = options.category || ErrorCategory.UNKNOWN;
    this.statusCode = options.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;
    this.details = options.details;
    this.metadata = options.metadata;
    this.isOperational = options.isOperational ?? true;
    this.timestamp = new Date();

    // Preserve original error if provided
    if (options.cause) {
      this.cause = options.cause;
    }
  }

  /**
   * Create from error code definition
   */
  static fromErrorCode(
    definition: ErrorCodeDefinition,
    details?: Record<string, any>,
    metadata?: Record<string, any>
  ): AppError {
    return new AppError(definition.message, {
      code: definition.code,
      severity: definition.severity,
      category: definition.category,
      statusCode: definition.statusCode,
      details,
      metadata,
    });
  }

  /**
   * Convert to JSON response
   */
  toJSON() {
    return {
      code: this.code,
      message: this.message,
      severity: this.severity,
      category: this.category,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp.toISOString(),
    };
  }

  /**
   * Check if error is retryable
   */
  isRetryable(): boolean {
    return [
      ErrorCategory.NETWORK,
      ErrorCategory.DATABASE,
      ErrorCategory.EXTERNAL_API,
    ].includes(this.category) && this.statusCode >= 500;
  }
}

/**
 * Authentication Error
 */
export class AuthenticationError extends AppError {
  constructor(
    message: string = 'Authentication failed',
    options: AppErrorOptions = {}
  ) {
    super(message, {
      ...options,
      category: ErrorCategory.AUTHENTICATION,
      statusCode: options.statusCode || HttpStatusCode.UNAUTHORIZED,
      severity: options.severity || ErrorSeverity.MEDIUM,
    });
  }
}

/**
 * Authorization Error
 */
export class AuthorizationError extends AppError {
  constructor(
    message: string = 'Access forbidden',
    options: AppErrorOptions = {}
  ) {
    super(message, {
      ...options,
      category: ErrorCategory.AUTHORIZATION,
      statusCode: options.statusCode || HttpStatusCode.FORBIDDEN,
      severity: options.severity || ErrorSeverity.MEDIUM,
    });
  }
}

/**
 * Validation Error
 */
export class ValidationError extends AppError {
  public readonly validationErrors: ValidationErrorDetail[];

  constructor(
    message: string = 'Validation failed',
    validationErrors: ValidationErrorDetail[] = [],
    options: AppErrorOptions = {}
  ) {
    super(message, {
      ...options,
      category: ErrorCategory.VALIDATION,
      statusCode: HttpStatusCode.BAD_REQUEST,
      severity: ErrorSeverity.LOW,
      details: {
        ...options.details,
        validationErrors,
      },
    });

    this.validationErrors = validationErrors;
  }

  /**
   * Add validation error
   */
  addError(field: string, message: string, value?: any): void {
    this.validationErrors.push({ field, message, value });
  }

  /**
   * Check if field has error
   */
  hasError(field: string): boolean {
    return this.validationErrors.some((error) => error.field === field);
  }

  /**
   * Get errors for field
   */
  getErrors(field: string): ValidationErrorDetail[] {
    return this.validationErrors.filter((error) => error.field === field);
  }
}

/**
 * Database Error
 */
export class DatabaseError extends AppError {
  constructor(
    message: string = 'Database operation failed',
    options: AppErrorOptions = {}
  ) {
    super(message, {
      ...options,
      category: ErrorCategory.DATABASE,
      statusCode: options.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR,
      severity: options.severity || ErrorSeverity.HIGH,
    });
  }
}

/**
 * Not Found Error
 */
export class NotFoundError extends AppError {
  constructor(
    resource: string = 'Resource',
    options: AppErrorOptions = {}
  ) {
    super(`${resource} not found`, {
      ...options,
      statusCode: HttpStatusCode.NOT_FOUND,
      severity: ErrorSeverity.LOW,
      details: {
        ...options.details,
        resource,
      },
    });
  }
}

/**
 * Conflict Error
 */
export class ConflictError extends AppError {
  constructor(
    message: string = 'Resource conflict',
    options: AppErrorOptions = {}
  ) {
    super(message, {
      ...options,
      statusCode: HttpStatusCode.CONFLICT,
      severity: ErrorSeverity.MEDIUM,
    });
  }
}

/**
 * Network Error
 */
export class NetworkError extends AppError {
  constructor(
    message: string = 'Network error occurred',
    options: AppErrorOptions = {}
  ) {
    super(message, {
      ...options,
      category: ErrorCategory.NETWORK,
      statusCode: options.statusCode || HttpStatusCode.SERVICE_UNAVAILABLE,
      severity: options.severity || ErrorSeverity.MEDIUM,
    });
  }
}

/**
 * External API Error
 */
export class ExternalAPIError extends AppError {
  public readonly service: string;

  constructor(
    service: string,
    message: string = 'External API error',
    options: AppErrorOptions = {}
  ) {
    super(message, {
      ...options,
      category: ErrorCategory.EXTERNAL_API,
      statusCode: options.statusCode || HttpStatusCode.BAD_GATEWAY,
      severity: options.severity || ErrorSeverity.HIGH,
      details: {
        ...options.details,
        service,
      },
    });

    this.service = service;
  }
}

/**
 * Payment Error
 */
export class PaymentError extends AppError {
  constructor(
    message: string = 'Payment processing failed',
    options: AppErrorOptions = {}
  ) {
    super(message, {
      ...options,
      category: ErrorCategory.PAYMENT,
      statusCode: options.statusCode || HttpStatusCode.UNPROCESSABLE_ENTITY,
      severity: options.severity || ErrorSeverity.HIGH,
    });
  }
}

/**
 * File System Error
 */
export class FileSystemError extends AppError {
  constructor(
    message: string = 'File operation failed',
    options: AppErrorOptions = {}
  ) {
    super(message, {
      ...options,
      category: ErrorCategory.FILE_SYSTEM,
      statusCode: options.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR,
      severity: options.severity || ErrorSeverity.MEDIUM,
    });
  }
}

/**
 * Email Error
 */
export class EmailError extends AppError {
  constructor(
    message: string = 'Email operation failed',
    options: AppErrorOptions = {}
  ) {
    super(message, {
      ...options,
      category: ErrorCategory.EMAIL,
      statusCode: options.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR,
      severity: options.severity || ErrorSeverity.MEDIUM,
    });
  }
}

/**
 * Media Error
 */
export class MediaError extends AppError {
  constructor(
    message: string = 'Media operation failed',
    options: AppErrorOptions = {}
  ) {
    super(message, {
      ...options,
      category: ErrorCategory.MEDIA,
      statusCode: options.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR,
      severity: options.severity || ErrorSeverity.MEDIUM,
    });
  }
}

/**
 * Rate Limit Error
 */
export class RateLimitError extends AppError {
  public readonly retryAfter?: number;

  constructor(
    message: string = 'Rate limit exceeded',
    retryAfter?: number,
    options: AppErrorOptions = {}
  ) {
    super(message, {
      ...options,
      statusCode: HttpStatusCode.TOO_MANY_REQUESTS,
      severity: ErrorSeverity.MEDIUM,
      details: {
        ...options.details,
        retryAfter,
      },
    });

    this.retryAfter = retryAfter;
  }
}

/**
 * Service Unavailable Error
 */
export class ServiceUnavailableError extends AppError {
  constructor(
    message: string = 'Service temporarily unavailable',
    options: AppErrorOptions = {}
  ) {
    super(message, {
      ...options,
      statusCode: HttpStatusCode.SERVICE_UNAVAILABLE,
      severity: ErrorSeverity.HIGH,
    });
  }
}

/**
 * Timeout Error
 */
export class TimeoutError extends AppError {
  constructor(
    operation: string = 'Operation',
    timeout: number,
    options: AppErrorOptions = {}
  ) {
    super(`${operation} timed out after ${timeout}ms`, {
      ...options,
      category: ErrorCategory.NETWORK,
      statusCode: HttpStatusCode.GATEWAY_TIMEOUT,
      severity: ErrorSeverity.MEDIUM,
      details: {
        ...options.details,
        operation,
        timeout,
      },
    });
  }
}

/**
 * Check if error is an AppError
 */
export function isAppError(error: any): error is AppError {
  return error instanceof AppError;
}

/**
 * Check if error is operational (expected)
 */
export function isOperationalError(error: any): boolean {
  if (isAppError(error)) {
    return error.isOperational;
  }
  return false;
}

/**
 * Convert any error to AppError
 */
export function toAppError(error: any): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, {
      cause: error,
      metadata: {
        originalError: error.name,
        stack: error.stack,
      },
    });
  }

  return new AppError('Unknown error occurred', {
    details: { originalError: error },
  });
}
