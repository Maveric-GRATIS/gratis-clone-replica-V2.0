/**
 * Error Types & Interfaces
 * Comprehensive error type system for GRATIS NGO platform
 */

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Error categories
export enum ErrorCategory {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  DATABASE = 'database',
  NETWORK = 'network',
  EXTERNAL_API = 'external_api',
  FILE_SYSTEM = 'file_system',
  PAYMENT = 'payment',
  EMAIL = 'email',
  MEDIA = 'media',
  UNKNOWN = 'unknown',
}

// HTTP status codes
export enum HttpStatusCode {
  // Success
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,

  // Client errors
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,

  // Server errors
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

// Error response structure
export interface ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  path?: string;
  requestId?: string;
}

// Error metadata
export interface ErrorMetadata {
  userId?: string;
  sessionId?: string;
  ip?: string;
  userAgent?: string;
  route?: string;
  method?: string;
  params?: Record<string, any>;
  body?: Record<string, any>;
  stack?: string;
  originalError?: string;
  details?: Record<string, any>;
  [key: string]: any; // Allow additional properties
}

// Error log entry
export interface ErrorLogEntry {
  id: string;
  code: string;
  message: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  timestamp: Date;
  metadata?: ErrorMetadata;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
}

// Retry configuration
export interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableErrors?: string[];
}

// Validation error details
export interface ValidationErrorDetail {
  field: string;
  message: string;
  value?: any;
}

// Custom error options
export interface AppErrorOptions {
  code?: string;
  severity?: ErrorSeverity;
  category?: ErrorCategory;
  statusCode?: HttpStatusCode;
  details?: Record<string, any>;
  metadata?: ErrorMetadata;
  cause?: Error;
  isOperational?: boolean;
}
