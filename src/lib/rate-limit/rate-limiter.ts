// ============================================================================
// GRATIS.NGO — Core Rate Limiter Engine
// ============================================================================

import { RateLimitConfig, RateLimitResult, RateLimitScope, RATE_LIMIT_PRESETS } from '@/types/rate-limit';
import {
  getEntry, incrementEntry, recordViolation, logViolation,
} from './rate-limit-store';

// ── Build Rate Limit Key ─────────────────────────────────────────────────────

function buildKey(config: RateLimitConfig, context: RateLimitContext): string {
  const parts = [`rl:${config.scope}`];

  switch (config.keyType) {
    case 'ip':
      parts.push(context.ip);
      break;
    case 'user':
      parts.push(context.userId || 'anonymous');
      break;
    case 'api_key':
      parts.push(context.apiKeyId || 'no_key');
      break;
    case 'ip_and_user':
      parts.push(context.ip, context.userId || 'anonymous');
      break;
    case 'endpoint':
      parts.push(context.endpoint);
      break;
    case 'global':
      parts.push('global');
      break;
  }

  return parts.join(':');
}

export interface RateLimitContext {
  ip: string;
  userId?: string;
  apiKeyId?: string;
  endpoint: string;
  userAgent?: string;
}

// ── Check Rate Limit ─────────────────────────────────────────────────────────

export async function checkRateLimit(
  scope: RateLimitScope,
  context: RateLimitContext,
  overrideConfig?: Partial<RateLimitConfig>
): Promise<RateLimitResult> {
  const preset = RATE_LIMIT_PRESETS[scope];
  const config: RateLimitConfig = {
    id: `preset_${scope}`,
    name: `${scope} rate limit`,
    description: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...preset,
    ...overrideConfig,
  };

  if (!config.enabled) {
    return { allowed: true, remaining: config.maxRequests, limit: config.maxRequests, resetAt: 0 };
  }

  // Check whitelist
  if (config.whitelist?.length) {
    if (
      config.whitelist.includes(context.ip) ||
      (context.userId && config.whitelist.includes(context.userId)) ||
      (context.apiKeyId && config.whitelist.includes(context.apiKeyId))
    ) {
      return { allowed: true, remaining: config.maxRequests, limit: config.maxRequests, resetAt: 0 };
    }
  }

  // Check blacklist
  if (config.blacklist?.length) {
    if (
      config.blacklist.includes(context.ip) ||
      (context.userId && config.blacklist.includes(context.userId))
    ) {
      return { allowed: false, remaining: 0, limit: 0, resetAt: 0, reason: 'Blacklisted' };
    }
  }

  const key = buildKey(config, context);
  const entry = incrementEntry(key, config.windowMs, config.burstWindowMs);

  // Calculate effective limit (with penalty for repeat violators)
  let effectiveLimit = config.maxRequests;
  if (config.penaltyMultiplier && entry.violations > 0) {
    const penaltyFactor = Math.pow(config.penaltyMultiplier, Math.min(entry.violations, 5));
    effectiveLimit = Math.max(1, Math.floor(config.maxRequests / penaltyFactor));
  }

  // Check burst limit first
  if (config.burstLimit && entry.burstCount && entry.burstCount > config.burstLimit) {
    recordViolation(key);

    // Log violation to Firestore
    await logViolation({
      key,
      keyType: config.keyType,
      scope: config.scope,
      endpoint: context.endpoint,
      ip: context.ip,
      userId: context.userId,
      apiKeyId: context.apiKeyId,
      count: entry.burstCount,
      limit: config.burstLimit,
      timestamp: new Date().toISOString(),
      userAgent: context.userAgent,
    });

    return {
      allowed: false,
      remaining: 0,
      limit: config.burstLimit,
      resetAt: entry.burstResetAt || entry.resetAt,
      retryAfter: Math.ceil((entry.burstResetAt || entry.resetAt - Date.now()) / 1000),
      reason: 'Burst limit exceeded',
    };
  }

  // Check main limit
  if (entry.count > effectiveLimit) {
    recordViolation(key);

    // Log violation
    await logViolation({
      key,
      keyType: config.keyType,
      scope: config.scope,
      endpoint: context.endpoint,
      ip: context.ip,
      userId: context.userId,
      apiKeyId: context.apiKeyId,
      count: entry.count,
      limit: effectiveLimit,
      timestamp: new Date().toISOString(),
      userAgent: context.userAgent,
    });

    return {
      allowed: false,
      remaining: 0,
      limit: effectiveLimit,
      resetAt: entry.resetAt,
      retryAfter: Math.ceil((entry.resetAt - Date.now()) / 1000),
      reason: 'Rate limit exceeded',
    };
  }

  return {
    allowed: true,
    remaining: effectiveLimit - entry.count,
    limit: effectiveLimit,
    resetAt: entry.resetAt,
  };
}
