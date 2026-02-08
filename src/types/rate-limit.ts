// ============================================================================
// GRATIS.NGO — Rate Limiting Type Definitions
// ============================================================================

export interface RateLimitConfig {
  id: string;
  name: string;
  description: string;
  windowMs: number;          // Time window in milliseconds
  maxRequests: number;        // Max requests per window
  keyType: RateLimitKeyType;
  scope: RateLimitScope;
  enabled: boolean;
  burstLimit?: number;        // Max burst within short interval
  burstWindowMs?: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  whitelist?: string[];       // IPs or user IDs to skip
  blacklist?: string[];       // IPs or user IDs to always block
  penaltyMultiplier?: number; // Multiplier for repeated violations
  createdAt: string;
  updatedAt: string;
}

export type RateLimitKeyType =
  | 'ip'
  | 'user'
  | 'api_key'
  | 'ip_and_user'
  | 'endpoint'
  | 'global';

export type RateLimitScope =
  | 'api'
  | 'auth'
  | 'donations'
  | 'uploads'
  | 'search'
  | 'webhooks'
  | 'exports'
  | 'admin'
  | 'public';

export interface RateLimitEntry {
  key: string;
  count: number;
  resetAt: number;           // Unix timestamp
  burstCount?: number;
  burstResetAt?: number;
  violations: number;
  lastViolation?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: number;
  retryAfter?: number;       // Seconds until next allowed request
  reason?: string;
}

export interface RateLimitViolation {
  id: string;
  key: string;
  keyType: RateLimitKeyType;
  scope: RateLimitScope;
  endpoint: string;
  ip: string;
  userId?: string;
  apiKeyId?: string;
  count: number;
  limit: number;
  timestamp: string;
  userAgent?: string;
}

export interface RateLimitStats {
  totalRequests: number;
  blockedRequests: number;
  uniqueKeys: number;
  topViolators: { key: string; violations: number }[];
  requestsByScope: Record<RateLimitScope, number>;
  blockedByScope: Record<RateLimitScope, number>;
  averageRequestsPerMinute: number;
}

// Default rate limit presets per scope
export const RATE_LIMIT_PRESETS: Record<RateLimitScope, Omit<RateLimitConfig, 'id' | 'name' | 'description' | 'createdAt' | 'updatedAt'>> = {
  api:        { windowMs: 60_000, maxRequests: 100, keyType: 'api_key', scope: 'api', enabled: true, burstLimit: 20, burstWindowMs: 5_000 },
  auth:       { windowMs: 900_000, maxRequests: 10, keyType: 'ip', scope: 'auth', enabled: true, penaltyMultiplier: 2 },
  donations:  { windowMs: 60_000, maxRequests: 5, keyType: 'user', scope: 'donations', enabled: true },
  uploads:    { windowMs: 3_600_000, maxRequests: 50, keyType: 'user', scope: 'uploads', enabled: true },
  search:     { windowMs: 60_000, maxRequests: 30, keyType: 'ip_and_user', scope: 'search', enabled: true },
  webhooks:   { windowMs: 60_000, maxRequests: 1000, keyType: 'api_key', scope: 'webhooks', enabled: true },
  exports:    { windowMs: 3_600_000, maxRequests: 10, keyType: 'user', scope: 'exports', enabled: true },
  admin:      { windowMs: 60_000, maxRequests: 200, keyType: 'user', scope: 'admin', enabled: true },
  public:     { windowMs: 60_000, maxRequests: 60, keyType: 'ip', scope: 'public', enabled: true, burstLimit: 15, burstWindowMs: 5_000 },
};
