// ============================================================================
// GRATIS.NGO — Rate Limit Middleware
// ============================================================================

import { checkRateLimit as checkRateLimitFn } from '@/lib/rate-limit/rate-limiter';
import type { RateLimitScope } from '@/types/rate-limit';

// ── Rate Limit Enforcement ───────────────────────────────────────────────────

export interface RateLimitContext {
  scope: RateLimitScope;
  identifier: string;
  metadata?: Record<string, any>;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining?: number;
  resetAt?: Date;
  retryAfter?: number; // seconds
}

/**
 * Core rate limit check function
 * Can be used in any API route handler
 */
export async function enforceRateLimit(
  context: RateLimitContext
): Promise<RateLimitResult> {
  // Build the rate limit context from the scope and identifier
  const rateLimitCtx = {
    scope: context.scope,
    ip: context.identifier.startsWith('ip:') ? context.identifier.slice(3) : 'unknown',
    userId: context.identifier.startsWith('user:') ? context.identifier.slice(5) : undefined,
    apiKeyId: context.identifier.startsWith('api:') ? context.identifier.slice(4) : undefined,
    endpoint: context.metadata?.path || '/',
    userAgent: context.metadata?.userAgent,
  };

  const result = await checkRateLimitFn(
    context.scope,
    rateLimitCtx
  );

  if (!result.allowed) {
    return {
      allowed: false,
      resetAt: new Date(result.resetAt),
      retryAfter: result.retryAfter,
    };
  }

  return {
    allowed: true,
    remaining: result.remaining,
    resetAt: new Date(result.resetAt),
  };
}

/**
 * Extract identifier from request
 * Priority: user ID > API key > IP address
 */
export function extractIdentifier(request: Request, userId?: string): string {
  if (userId) return `user:${userId}`;

  // Check for API key in Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    return `api:${token.slice(0, 16)}`;
  }

  // Fall back to IP (simplified - in production use proper IP extraction)
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  return `ip:${ip}`;
}

/**
 * Higher-order function to wrap API route handlers with rate limiting
 *
 * Usage:
 * ```
 * export const GET = withRateLimit('api_general', async (req) => {
 *   // Your handler logic
 * });
 * ```
 */
export function withRateLimit(
  scope: RateLimitScope,
  handler: (request: Request, context?: unknown) => Promise<Response>
) {
  return async (request: Request, context?: unknown): Promise<Response> => {
    // Extract user from request (simplified - implement proper auth check)
    const userId = request.headers.get('x-user-id') || undefined;
    const identifier = extractIdentifier(request, userId);

    const result = await enforceRateLimit({
      scope,
      identifier,
      metadata: {
        path: new URL(request.url).pathname,
        method: request.method,
      },
    });

    if (!result.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          retryAfter: result.retryAfter,
          resetAt: result.resetAt,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(result.retryAfter || 60),
            'X-RateLimit-Reset': result.resetAt?.toISOString() || '',
          },
        }
      );
    }

    // Add rate limit headers to response
    const response = await handler(request, context);

    if (result.remaining !== undefined) {
      response.headers.set('X-RateLimit-Remaining', String(result.remaining));
    }
    if (result.resetAt) {
      response.headers.set('X-RateLimit-Reset', result.resetAt.toISOString());
    }

    return response;
  };
}

/**
 * Manual rate limit check for conditional logic
 *
 * Usage:
 * ```
 * const canProceed = await checkRateLimit('donation', userId);
 * if (!canProceed.allowed) {
 *   return Response.json({ error: 'Too many donations' }, { status: 429 });
 * }
 * ```
 */
export async function checkRateLimit(
  scope: RateLimitScope,
  identifier: string,
  metadata?: Record<string, any>
): Promise<RateLimitResult> {
  return enforceRateLimit({ scope, identifier, metadata });
}
