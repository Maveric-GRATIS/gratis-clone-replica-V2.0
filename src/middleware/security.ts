/**
 * Security Middleware
 * Provides CORS, security headers, request sanitization, and CSRF protection
 */

// Note: This is designed for Next.js but can be adapted for other frameworks
// For Vite/React Router, implement similar logic in API route handlers

/**
 * Content Security Policy configuration
 */
const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for Next.js
    "'unsafe-eval'", // Required for development
    'https://js.stripe.com',
    'https://www.googletagmanager.com',
  ],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https:',
    'https://image.mux.com',
    'https://firebasestorage.googleapis.com',
  ],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'connect-src': [
    "'self'",
    'https://*.firebase.com',
    'https://*.googleapis.com',
    'https://api.stripe.com',
    'https://stream.mux.com',
  ],
  'media-src': ["'self'", 'https://stream.mux.com', 'blob:'],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': [],
};

/**
 * Generates CSP header value
 */
function generateCSP(): string {
  return Object.entries(CSP_DIRECTIVES)
    .map(([key, values]) => {
      if (values.length === 0) return key;
      return `${key} ${values.join(' ')}`;
    })
    .join('; ');
}

/**
 * Security headers to add to all responses
 */
export const SECURITY_HEADERS = {
  // Content Security Policy
  'Content-Security-Policy': generateCSP(),

  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // Enable XSS protection
  'X-XSS-Protection': '1; mode=block',

  // Prevent clickjacking
  'X-Frame-Options': 'DENY',

  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions policy (formerly Feature-Policy)
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',

  // HSTS (HTTP Strict Transport Security)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
};

/**
 * CORS configuration
 */
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:8081',
  'https://gratis-ngo.vercel.app', // Replace with your production domain
];

/**
 * Checks if origin is allowed
 */
function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGINS.includes(origin);
}

/**
 * CORS headers
 */
function getCORSHeaders(origin: string | null): Record<string, string> {
  if (!isOriginAllowed(origin)) {
    return {};
  }

  return {
    'Access-Control-Allow-Origin': origin!,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400', // 24 hours
  };
}

/**
 * Sanitizes user input to prevent XSS
 */
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }

  if (input && typeof input === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }

  return input;
}

/**
 * Validates request origin and method
 */
export function validateRequest(request: Request): boolean {
  const origin = request.headers.get('origin');

  // Allow same-origin requests
  if (!origin) return true;

  // Check CORS
  if (!isOriginAllowed(origin)) {
    return false;
  }

  // Allow preflight requests
  if (request.method === 'OPTIONS') return true;

  return true;
}

/**
 * Security middleware for API routes
 * Usage: export const GET = securityMiddleware(async (request) => { ... })
 */
export function securityMiddleware(handler: (request: Request) => Promise<Response>) {
  return async (request: Request) => {
    const origin = request.headers.get('origin');

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          ...getCORSHeaders(origin),
        },
      });
    }

    // Validate request
    if (!validateRequest(request)) {
      return new Response(
        JSON.stringify({ error: 'Forbidden', message: 'Origin not allowed' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Call the actual handler
    const response = await handler(request);

    // Add security headers
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    // Add CORS headers
    Object.entries(getCORSHeaders(origin)).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  };
}

/**
 * CSRF token generation and validation
 */
const CSRF_TOKEN_LENGTH = 32;

export function generateCSRFToken(): string {
  const array = new Uint8Array(CSRF_TOKEN_LENGTH);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function validateCSRFToken(token: string | null, expectedToken: string): boolean {
  if (!token || !expectedToken) return false;
  if (token.length !== expectedToken.length) return false;

  // Constant-time comparison to prevent timing attacks
  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ expectedToken.charCodeAt(i);
  }

  return result === 0;
}

/**
 * IP address extraction from request
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP.trim();
  }

  return 'unknown';
}

/**
 * Request logging for security auditing
 */
export function logSecurityEvent(event: {
  type: 'auth' | 'rate-limit' | 'validation' | 'error';
  action: string;
  userId?: string;
  ip?: string;
  details?: any;
}) {
  const timestamp = new Date().toISOString();
  console.log(`[SECURITY] ${timestamp} - ${event.type.toUpperCase()} - ${event.action}`, {
    userId: event.userId || 'anonymous',
    ip: event.ip || 'unknown',
    details: event.details,
  });

  // In production, send to logging service (e.g., CloudWatch, Datadog)
}
