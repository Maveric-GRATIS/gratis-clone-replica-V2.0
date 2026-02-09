/**
 * Rate Limiting Implementation
 * In-memory sliding window rate limiter with optional Redis backend
 */

interface RateLimitRule {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

interface RateLimitEntry {
  timestamps: number[]; // Array of request timestamps
  blocked: boolean;
  blockedUntil?: number;
}

// Rate limit tiers
export const RATE_LIMITS = {
  public: { windowMs: 60 * 1000, maxRequests: 60 }, // 60 req/min
  authenticated: { windowMs: 60 * 1000, maxRequests: 300 }, // 300 req/min
  admin: { windowMs: 60 * 1000, maxRequests: 1000 }, // 1000 req/min
  api: { windowMs: 60 * 1000, maxRequests: 100 }, // 100 req/min
  strict: { windowMs: 60 * 1000, maxRequests: 10 }, // 10 req/min (for sensitive endpoints)
} as const;

// In-memory storage (use Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Cleans up old entries from the rate limit store
 */
function cleanupOldEntries() {
  const now = Date.now();
  const maxAge = 5 * 60 * 1000; // 5 minutes

  for (const [key, entry] of rateLimitStore.entries()) {
    // Remove entries that haven't been accessed in 5 minutes
    const lastTimestamp = entry.timestamps[entry.timestamps.length - 1] || 0;
    if (now - lastTimestamp > maxAge) {
      rateLimitStore.delete(key);
    }
  }
}

// Cleanup old entries every minute
setInterval(cleanupOldEntries, 60 * 1000);

/**
 * Generates a rate limit key from identifier and tier
 */
function getRateLimitKey(identifier: string, tier: keyof typeof RATE_LIMITS): string {
  return `ratelimit:${tier}:${identifier}`;
}

/**
 * Checks if a request should be rate limited
 * Returns { allowed: boolean, remaining: number, resetAt: number }
 */
export function checkRateLimit(
  identifier: string,
  tier: keyof typeof RATE_LIMITS = 'public'
): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
} {
  const rule = RATE_LIMITS[tier];
  const key = getRateLimitKey(identifier, tier);
  const now = Date.now();

  // Get or create entry
  let entry = rateLimitStore.get(key);
  if (!entry) {
    entry = { timestamps: [], blocked: false };
    rateLimitStore.set(key, entry);
  }

  // Check if currently blocked
  if (entry.blocked && entry.blockedUntil && now < entry.blockedUntil) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.blockedUntil,
      limit: rule.maxRequests,
    };
  }

  // Remove blocked status if time has passed
  if (entry.blocked && entry.blockedUntil && now >= entry.blockedUntil) {
    entry.blocked = false;
    entry.blockedUntil = undefined;
    entry.timestamps = [];
  }

  // Remove timestamps outside the current window
  const windowStart = now - rule.windowMs;
  entry.timestamps = entry.timestamps.filter(ts => ts > windowStart);

  // Check if limit exceeded
  if (entry.timestamps.length >= rule.maxRequests) {
    // Block for the duration of the window
    entry.blocked = true;
    entry.blockedUntil = now + rule.windowMs;

    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.blockedUntil,
      limit: rule.maxRequests,
    };
  }

  // Add current timestamp
  entry.timestamps.push(now);

  return {
    allowed: true,
    remaining: rule.maxRequests - entry.timestamps.length,
    resetAt: now + rule.windowMs,
    limit: rule.maxRequests,
  };
}

/**
 * Resets rate limit for a specific identifier
 */
export function resetRateLimit(identifier: string, tier: keyof typeof RATE_LIMITS = 'public'): void {
  const key = getRateLimitKey(identifier, tier);
  rateLimitStore.delete(key);
}

/**
 * Blocks an identifier for a specific duration
 */
export function blockIdentifier(
  identifier: string,
  durationMs: number,
  tier: keyof typeof RATE_LIMITS = 'public'
): void {
  const key = getRateLimitKey(identifier, tier);
  const now = Date.now();

  rateLimitStore.set(key, {
    timestamps: [],
    blocked: true,
    blockedUntil: now + durationMs,
  });
}

/**
 * Gets rate limit info without consuming a request
 */
export function getRateLimitInfo(
  identifier: string,
  tier: keyof typeof RATE_LIMITS = 'public'
): {
  current: number;
  limit: number;
  remaining: number;
  resetAt: number;
} {
  const rule = RATE_LIMITS[tier];
  const key = getRateLimitKey(identifier, tier);
  const now = Date.now();

  const entry = rateLimitStore.get(key);
  if (!entry) {
    return {
      current: 0,
      limit: rule.maxRequests,
      remaining: rule.maxRequests,
      resetAt: now + rule.windowMs,
    };
  }

  // Remove timestamps outside the current window
  const windowStart = now - rule.windowMs;
  const validTimestamps = entry.timestamps.filter(ts => ts > windowStart);

  return {
    current: validTimestamps.length,
    limit: rule.maxRequests,
    remaining: Math.max(0, rule.maxRequests - validTimestamps.length),
    resetAt: validTimestamps[0] ? validTimestamps[0] + rule.windowMs : now + rule.windowMs,
  };
}

/**
 * Express-style middleware for rate limiting
 */
export function rateLimitMiddleware(tier: keyof typeof RATE_LIMITS = 'public') {
  return (req: Request, res: Response, next: () => void) => {
    // Use IP address or user ID as identifier
    const identifier = req.user?.uid || req.ip || req.connection.remoteAddress || 'unknown';

    const result = checkRateLimit(identifier, tier);

    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', result.limit);
    res.setHeader('X-RateLimit-Remaining', result.remaining);
    res.setHeader('X-RateLimit-Reset', new Date(result.resetAt).toISOString());

    if (!result.allowed) {
      res.status(429).json({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        resetAt: new Date(result.resetAt).toISOString(),
      });
      return;
    }

    next();
  };
}

/**
 * React hook for client-side rate limit checking
 */
export function useRateLimit(identifier: string, tier: keyof typeof RATE_LIMITS = 'public') {
  const info = getRateLimitInfo(identifier, tier);

  return {
    ...info,
    isLimited: info.remaining === 0,
    percentUsed: (info.current / info.limit) * 100,
  };
}
