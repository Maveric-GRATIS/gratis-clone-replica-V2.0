// ============================================================================
// GRATIS.NGO — Admin Rate Limit Management API
// ============================================================================

import { getViolations, clearViolations, getAllEntries, getStoreSize } from '@/lib/rate-limit/rate-limit-store';
import { RateLimitStats, RateLimitScope, RATE_LIMIT_PRESETS } from '@/types/rate-limit';

// GET /api/admin/rate-limits — Dashboard stats + config
export async function GET(req: Request) {
  const url = new URL(req.url);
  const action = url.searchParams.get('action') || 'stats';

  if (action === 'config') {
    return Response.json({ presets: RATE_LIMIT_PRESETS });
  }

  if (action === 'violations') {
    const scope = url.searchParams.get('scope') || undefined;
    const since = url.searchParams.get('since') || undefined;
    const violations = await getViolations({ scope, since, limit: 100 });
    return Response.json({ violations, total: violations.length });
  }

  // Default: stats overview
  const entries = getAllEntries();
  const scopes = Object.keys(RATE_LIMIT_PRESETS) as RateLimitScope[];

  const requestsByScope: Partial<Record<RateLimitScope, number>> = {};
  const blockedByScope: Partial<Record<RateLimitScope, number>> = {};
  let totalRequests = 0;
  let blockedRequests = 0;
  const violatorMap = new Map<string, number>();

  for (const [key, entry] of entries) {
    const scopeMatch = key.match(/^rl:(\w+):/);
    if (scopeMatch) {
      const scope = scopeMatch[1] as RateLimitScope;
      requestsByScope[scope] = (requestsByScope[scope] || 0) + entry.count;
      totalRequests += entry.count;

      if (entry.violations > 0) {
        blockedByScope[scope] = (blockedByScope[scope] || 0) + entry.violations;
        blockedRequests += entry.violations;
        violatorMap.set(key, entry.violations);
      }
    }
  }

  const topViolators = Array.from(violatorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([key, violations]) => ({ key, violations }));

  const stats: RateLimitStats = {
    totalRequests,
    blockedRequests,
    uniqueKeys: entries.size,
    topViolators,
    requestsByScope: requestsByScope as Record<RateLimitScope, number>,
    blockedByScope: blockedByScope as Record<RateLimitScope, number>,
    averageRequestsPerMinute: Math.round(totalRequests / Math.max(1, entries.size)),
  };

  return Response.json({ stats, storeSize: getStoreSize() });
}

// POST /api/admin/rate-limits — Admin actions
export async function POST(req: Request) {
  const body = await req.json();
  const { action } = body;

  if (action === 'clear_violations') {
    const { olderThanDays = 30 } = body;
    const deleted = await clearViolations(olderThanDays);
    return Response.json({ success: true, deleted });
  }

  return Response.json({ error: 'Unknown action' }, { status: 400 });
}
