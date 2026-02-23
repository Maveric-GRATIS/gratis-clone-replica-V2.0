/**
 * Error Codes Catalog
 * Format: GRT-XXX-XXX
 * Comprehensive error code system for GRATIS NGO platform
 */

import { ErrorSeverity, ErrorCategory, HttpStatusCode } from '@/types/errors';

export interface ErrorCodeDefinition {
  code: string;
  message: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  statusCode: HttpStatusCode;
  retryable: boolean;
}

/**
 * Authentication Errors (GRT-001-XXX)
 */
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: {
    code: 'GRT-001-001',
    message: 'Invalid email or password',
    severity: ErrorSeverity.MEDIUM,
    category: ErrorCategory.AUTHENTICATION,
    statusCode: HttpStatusCode.UNAUTHORIZED,
    retryable: false,
  },
  TOKEN_EXPIRED: {
    code: 'GRT-001-002',
    message: 'Authentication token has expired',
    severity: ErrorSeverity.LOW,
    category: ErrorCategory.AUTHENTICATION,
    statusCode: HttpStatusCode.UNAUTHORIZED,
    retryable: true,
  },
  TOKEN_INVALID: {
    code: 'GRT-001-003',
    message: 'Invalid authentication token',
    severity: ErrorSeverity.MEDIUM,
    category: ErrorCategory.AUTHENTICATION,
    statusCode: HttpStatusCode.UNAUTHORIZED,
    retryable: false,
  },
  SESSION_EXPIRED: {
    code: 'GRT-001-004',
    message: 'Session has expired',
    severity: ErrorSeverity.LOW,
    category: ErrorCategory.AUTHENTICATION,
    statusCode: HttpStatusCode.UNAUTHORIZED,
    retryable: true,
  },
  MFA_REQUIRED: {
    code: 'GRT-001-005',
    message: 'Multi-factor authentication required',
    severity: ErrorSeverity.LOW,
    category: ErrorCategory.AUTHENTICATION,
    statusCode: HttpStatusCode.FORBIDDEN,
    retryable: false,
  },
} as const;

/**
 * Authorization Errors (GRT-002-XXX)
 */
export const AUTHZ_ERRORS = {
  INSUFFICIENT_PERMISSIONS: {
    code: 'GRT-002-001',
    message: 'Insufficient permissions to perform this action',
    severity: ErrorSeverity.MEDIUM,
    category: ErrorCategory.AUTHORIZATION,
    statusCode: HttpStatusCode.FORBIDDEN,
    retryable: false,
  },
  RESOURCE_FORBIDDEN: {
    code: 'GRT-002-002',
    message: 'Access to this resource is forbidden',
    severity: ErrorSeverity.MEDIUM,
    category: ErrorCategory.AUTHORIZATION,
    statusCode: HttpStatusCode.FORBIDDEN,
    retryable: false,
  },
  ADMIN_REQUIRED: {
    code: 'GRT-002-003',
    message: 'Administrator privileges required',
    severity: ErrorSeverity.MEDIUM,
    category: ErrorCategory.AUTHORIZATION,
    statusCode: HttpStatusCode.FORBIDDEN,
    retryable: false,
  },
  NGO_MEMBER_REQUIRED: {
    code: 'GRT-002-004',
    message: 'NGO membership required',
    severity: ErrorSeverity.LOW,
    category: ErrorCategory.AUTHORIZATION,
    statusCode: HttpStatusCode.FORBIDDEN,
    retryable: false,
  },
} as const;

/**
 * Validation Errors (GRT-003-XXX)
 */
export const VALIDATION_ERRORS = {
  INVALID_INPUT: {
    code: 'GRT-003-001',
    message: 'Invalid input data',
    severity: ErrorSeverity.LOW,
    category: ErrorCategory.VALIDATION,
    statusCode: HttpStatusCode.BAD_REQUEST,
    retryable: false,
  },
  REQUIRED_FIELD_MISSING: {
    code: 'GRT-003-002',
    message: 'Required field is missing',
    severity: ErrorSeverity.LOW,
    category: ErrorCategory.VALIDATION,
    statusCode: HttpStatusCode.BAD_REQUEST,
    retryable: false,
  },
  INVALID_EMAIL: {
    code: 'GRT-003-003',
    message: 'Invalid email format',
    severity: ErrorSeverity.LOW,
    category: ErrorCategory.VALIDATION,
    statusCode: HttpStatusCode.BAD_REQUEST,
    retryable: false,
  },
  INVALID_PHONE: {
    code: 'GRT-003-004',
    message: 'Invalid phone number format',
    severity: ErrorSeverity.LOW,
    category: ErrorCategory.VALIDATION,
    statusCode: HttpStatusCode.BAD_REQUEST,
    retryable: false,
  },
  INVALID_URL: {
    code: 'GRT-003-005',
    message: 'Invalid URL format',
    severity: ErrorSeverity.LOW,
    category: ErrorCategory.VALIDATION,
    statusCode: HttpStatusCode.BAD_REQUEST,
    retryable: false,
  },
  INVALID_DATE: {
    code: 'GRT-003-006',
    message: 'Invalid date format',
    severity: ErrorSeverity.LOW,
    category: ErrorCategory.VALIDATION,
    statusCode: HttpStatusCode.BAD_REQUEST,
    retryable: false,
  },
  VALUE_OUT_OF_RANGE: {
    code: 'GRT-003-007',
    message: 'Value is out of acceptable range',
    severity: ErrorSeverity.LOW,
    category: ErrorCategory.VALIDATION,
    statusCode: HttpStatusCode.BAD_REQUEST,
    retryable: false,
  },
} as const;

/**
 * Database Errors (GRT-004-XXX)
 */
export const DATABASE_ERRORS = {
  CONNECTION_FAILED: {
    code: 'GRT-004-001',
    message: 'Database connection failed',
    severity: ErrorSeverity.CRITICAL,
    category: ErrorCategory.DATABASE,
    statusCode: HttpStatusCode.SERVICE_UNAVAILABLE,
    retryable: true,
  },
  QUERY_FAILED: {
    code: 'GRT-004-002',
    message: 'Database query failed',
    severity: ErrorSeverity.HIGH,
    category: ErrorCategory.DATABASE,
    statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    retryable: true,
  },
  DOCUMENT_NOT_FOUND: {
    code: 'GRT-004-003',
    message: 'Document not found',
    severity: ErrorSeverity.LOW,
    category: ErrorCategory.DATABASE,
    statusCode: HttpStatusCode.NOT_FOUND,
    retryable: false,
  },
  DUPLICATE_ENTRY: {
    code: 'GRT-004-004',
    message: 'Duplicate entry exists',
    severity: ErrorSeverity.MEDIUM,
    category: ErrorCategory.DATABASE,
    statusCode: HttpStatusCode.CONFLICT,
    retryable: false,
  },
  TRANSACTION_FAILED: {
    code: 'GRT-004-005',
    message: 'Transaction failed',
    severity: ErrorSeverity.HIGH,
    category: ErrorCategory.DATABASE,
    statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    retryable: true,
  },
} as const;

/**
 * Network Errors (GRT-005-XXX)
 */
export const NETWORK_ERRORS = {
  TIMEOUT: {
    code: 'GRT-005-001',
    message: 'Request timeout',
    severity: ErrorSeverity.MEDIUM,
    category: ErrorCategory.NETWORK,
    statusCode: HttpStatusCode.GATEWAY_TIMEOUT,
    retryable: true,
  },
  CONNECTION_REFUSED: {
    code: 'GRT-005-002',
    message: 'Connection refused',
    severity: ErrorSeverity.HIGH,
    category: ErrorCategory.NETWORK,
    statusCode: HttpStatusCode.SERVICE_UNAVAILABLE,
    retryable: true,
  },
  DNS_RESOLUTION_FAILED: {
    code: 'GRT-005-003',
    message: 'DNS resolution failed',
    severity: ErrorSeverity.HIGH,
    category: ErrorCategory.NETWORK,
    statusCode: HttpStatusCode.BAD_GATEWAY,
    retryable: true,
  },
  NETWORK_UNAVAILABLE: {
    code: 'GRT-005-004',
    message: 'Network unavailable',
    severity: ErrorSeverity.HIGH,
    category: ErrorCategory.NETWORK,
    statusCode: HttpStatusCode.SERVICE_UNAVAILABLE,
    retryable: true,
  },
} as const;

/**
 * External API Errors (GRT-006-XXX)
 */
export const EXTERNAL_API_ERRORS = {
  STRIPE_ERROR: {
    code: 'GRT-006-001',
    message: 'Stripe payment error',
    severity: ErrorSeverity.HIGH,
    category: ErrorCategory.EXTERNAL_API,
    statusCode: HttpStatusCode.BAD_GATEWAY,
    retryable: false,
  },
  SENDGRID_ERROR: {
    code: 'GRT-006-002',
    message: 'Email service error',
    severity: ErrorSeverity.MEDIUM,
    category: ErrorCategory.EXTERNAL_API,
    statusCode: HttpStatusCode.BAD_GATEWAY,
    retryable: true,
  },
  MUX_ERROR: {
    code: 'GRT-006-003',
    message: 'Video service error',
    severity: ErrorSeverity.MEDIUM,
    category: ErrorCategory.EXTERNAL_API,
    statusCode: HttpStatusCode.BAD_GATEWAY,
    retryable: true,
  },
  FIREBASE_ERROR: {
    code: 'GRT-006-004',
    message: 'Firebase service error',
    severity: ErrorSeverity.HIGH,
    category: ErrorCategory.EXTERNAL_API,
    statusCode: HttpStatusCode.BAD_GATEWAY,
    retryable: true,
  },
  RATE_LIMIT_EXCEEDED: {
    code: 'GRT-006-005',
    message: 'External API rate limit exceeded',
    severity: ErrorSeverity.MEDIUM,
    category: ErrorCategory.EXTERNAL_API,
    statusCode: HttpStatusCode.TOO_MANY_REQUESTS,
    retryable: true,
  },
} as const;

/**
 * File System Errors (GRT-007-XXX)
 */
export const FILE_ERRORS = {
  FILE_NOT_FOUND: {
    code: 'GRT-007-001',
    message: 'File not found',
    severity: ErrorSeverity.LOW,
    category: ErrorCategory.FILE_SYSTEM,
    statusCode: HttpStatusCode.NOT_FOUND,
    retryable: false,
  },
  FILE_TOO_LARGE: {
    code: 'GRT-007-002',
    message: 'File size exceeds limit',
    severity: ErrorSeverity.LOW,
    category: ErrorCategory.FILE_SYSTEM,
    statusCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
    retryable: false,
  },
  INVALID_FILE_TYPE: {
    code: 'GRT-007-003',
    message: 'Invalid file type',
    severity: ErrorSeverity.LOW,
    category: ErrorCategory.FILE_SYSTEM,
    statusCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
    retryable: false,
  },
  UPLOAD_FAILED: {
    code: 'GRT-007-004',
    message: 'File upload failed',
    severity: ErrorSeverity.MEDIUM,
    category: ErrorCategory.FILE_SYSTEM,
    statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    retryable: true,
  },
  STORAGE_QUOTA_EXCEEDED: {
    code: 'GRT-007-005',
    message: 'Storage quota exceeded',
    severity: ErrorSeverity.MEDIUM,
    category: ErrorCategory.FILE_SYSTEM,
    statusCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
    retryable: false,
  },
} as const;

/**
 * Payment Errors (GRT-008-XXX)
 */
export const PAYMENT_ERRORS = {
  PAYMENT_FAILED: {
    code: 'GRT-008-001',
    message: 'Payment processing failed',
    severity: ErrorSeverity.HIGH,
    category: ErrorCategory.PAYMENT,
    statusCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
    retryable: false,
  },
  INSUFFICIENT_FUNDS: {
    code: 'GRT-008-002',
    message: 'Insufficient funds',
    severity: ErrorSeverity.LOW,
    category: ErrorCategory.PAYMENT,
    statusCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
    retryable: false,
  },
  CARD_DECLINED: {
    code: 'GRT-008-003',
    message: 'Card declined',
    severity: ErrorSeverity.LOW,
    category: ErrorCategory.PAYMENT,
    statusCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
    retryable: false,
  },
  INVALID_PAYMENT_METHOD: {
    code: 'GRT-008-004',
    message: 'Invalid payment method',
    severity: ErrorSeverity.LOW,
    category: ErrorCategory.PAYMENT,
    statusCode: HttpStatusCode.BAD_REQUEST,
    retryable: false,
  },
  REFUND_FAILED: {
    code: 'GRT-008-005',
    message: 'Refund processing failed',
    severity: ErrorSeverity.HIGH,
    category: ErrorCategory.PAYMENT,
    statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    retryable: true,
  },
} as const;

/**
 * Email Errors (GRT-009-XXX)
 */
export const EMAIL_ERRORS = {
  SEND_FAILED: {
    code: 'GRT-009-001',
    message: 'Email send failed',
    severity: ErrorSeverity.MEDIUM,
    category: ErrorCategory.EMAIL,
    statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    retryable: true,
  },
  INVALID_RECIPIENT: {
    code: 'GRT-009-002',
    message: 'Invalid email recipient',
    severity: ErrorSeverity.LOW,
    category: ErrorCategory.EMAIL,
    statusCode: HttpStatusCode.BAD_REQUEST,
    retryable: false,
  },
  TEMPLATE_NOT_FOUND: {
    code: 'GRT-009-003',
    message: 'Email template not found',
    severity: ErrorSeverity.MEDIUM,
    category: ErrorCategory.EMAIL,
    statusCode: HttpStatusCode.NOT_FOUND,
    retryable: false,
  },
  QUEUE_FULL: {
    code: 'GRT-009-004',
    message: 'Email queue is full',
    severity: ErrorSeverity.HIGH,
    category: ErrorCategory.EMAIL,
    statusCode: HttpStatusCode.SERVICE_UNAVAILABLE,
    retryable: true,
  },
} as const;

/**
 * Media Errors (GRT-010-XXX)
 */
export const MEDIA_ERRORS = {
  PROCESSING_FAILED: {
    code: 'GRT-010-001',
    message: 'Media processing failed',
    severity: ErrorSeverity.MEDIUM,
    category: ErrorCategory.MEDIA,
    statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    retryable: true,
  },
  INVALID_FORMAT: {
    code: 'GRT-010-002',
    message: 'Invalid media format',
    severity: ErrorSeverity.LOW,
    category: ErrorCategory.MEDIA,
    statusCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
    retryable: false,
  },
  TRANSCODING_FAILED: {
    code: 'GRT-010-003',
    message: 'Video transcoding failed',
    severity: ErrorSeverity.MEDIUM,
    category: ErrorCategory.MEDIA,
    statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    retryable: true,
  },
  THUMBNAIL_GENERATION_FAILED: {
    code: 'GRT-010-004',
    message: 'Thumbnail generation failed',
    severity: ErrorSeverity.LOW,
    category: ErrorCategory.MEDIA,
    statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    retryable: true,
  },
} as const;

/**
 * General Errors (GRT-999-XXX)
 */
export const GENERAL_ERRORS = {
  INTERNAL_ERROR: {
    code: 'GRT-999-001',
    message: 'Internal server error',
    severity: ErrorSeverity.CRITICAL,
    category: ErrorCategory.UNKNOWN,
    statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    retryable: false,
  },
  SERVICE_UNAVAILABLE: {
    code: 'GRT-999-002',
    message: 'Service temporarily unavailable',
    severity: ErrorSeverity.HIGH,
    category: ErrorCategory.UNKNOWN,
    statusCode: HttpStatusCode.SERVICE_UNAVAILABLE,
    retryable: true,
  },
  MAINTENANCE_MODE: {
    code: 'GRT-999-003',
    message: 'System is under maintenance',
    severity: ErrorSeverity.MEDIUM,
    category: ErrorCategory.UNKNOWN,
    statusCode: HttpStatusCode.SERVICE_UNAVAILABLE,
    retryable: true,
  },
  UNKNOWN_ERROR: {
    code: 'GRT-999-999',
    message: 'An unknown error occurred',
    severity: ErrorSeverity.HIGH,
    category: ErrorCategory.UNKNOWN,
    statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    retryable: false,
  },
} as const;

/**
 * All error codes combined
 */
export const ERROR_CODES = {
  ...AUTH_ERRORS,
  ...AUTHZ_ERRORS,
  ...VALIDATION_ERRORS,
  ...DATABASE_ERRORS,
  ...NETWORK_ERRORS,
  ...EXTERNAL_API_ERRORS,
  ...FILE_ERRORS,
  ...PAYMENT_ERRORS,
  ...EMAIL_ERRORS,
  ...MEDIA_ERRORS,
  ...GENERAL_ERRORS,
} as const;

/**
 * Get error definition by code
 */
export function getErrorDefinition(code: string): ErrorCodeDefinition | undefined {
  return Object.values(ERROR_CODES).find((error) => error.code === code);
}

/**
 * Check if error is retryable
 */
export function isRetryableError(code: string): boolean {
  const definition = getErrorDefinition(code);
  return definition?.retryable ?? false;
}

/**
 * Get errors by category
 */
export function getErrorsByCategory(category: ErrorCategory): ErrorCodeDefinition[] {
  return Object.values(ERROR_CODES).filter((error) => error.category === category);
}

/**
 * Get errors by severity
 */
export function getErrorsBySeverity(severity: ErrorSeverity): ErrorCodeDefinition[] {
  return Object.values(ERROR_CODES).filter((error) => error.severity === severity);
}
