// src/middleware/audit.ts
// GRATIS.NGO — Audit Middleware

import type { AuditAction, AuditCategory, AuditActor } from '@/types/audit';
import { logAuditEvent } from '@/lib/audit/audit-service';

/**
 * Audit middleware — automatically log API mutations
 * Usage: Call this after successful API mutations
 */
export async function auditApiCall(params: {
  action: AuditAction;
  category: AuditCategory;
  userId: string;
  userEmail?: string;
  ipAddress?: string;
  targetId?: string;
  targetType?: string;
  changes?: Record<string, any>;
  metadata?: Record<string, any>;
  request?: Request;
}): Promise<string> {
  const {
    action,
    category,
    userId,
    userEmail,
    ipAddress,
    targetId,
    targetType,
    changes,
    metadata,
    request,
  } = params;

  const actor: AuditActor = {
    userId,
    userEmail,
    ipAddress: ipAddress || (request ? extractIpFromRequest(request) : undefined),
  };

  const target = targetId
    ? {
        id: targetId,
        type: targetType || 'unknown',
      }
    : undefined;

  const enhancedMetadata = {
    ...metadata,
    userAgent: request ? request.headers.get('user-agent') || undefined : undefined,
    method: request ? request.method : undefined,
    url: request ? request.url : undefined,
  };

  return logAuditEvent({
    action,
    category,
    actor,
    target,
    changes,
    metadata: enhancedMetadata,
  });
}

/**
 * Extract IP address from request
 */
function extractIpFromRequest(request: Request): string | undefined {
  // Try various headers (depending on deployment environment)
  const headers = request.headers;

  return (
    headers.get('x-real-ip') ||
    headers.get('x-forwarded-for')?.split(',')[0] ||
    headers.get('cf-connecting-ip') || // Cloudflare
    headers.get('x-client-ip') ||
    undefined
  );
}

/**
 * Higher-order function to wrap API routes with auto-audit
 */
export function withAudit<T extends (...args: any[]) => Promise<any>>(
  handler: T,
  auditConfig: {
    action: AuditAction;
    category: AuditCategory;
    getTargetId?: (result: any) => string | undefined;
    getChanges?: (args: any[], result: any) => Record<string, any> | undefined;
  }
): T {
  return (async (...args: any[]) => {
    try {
      const result = await handler(...args);

      // Extract userId from args (assume it's passed as first arg or in context)
      const userId = args[0]?.userId || 'system';

      // Log audit event
      await auditApiCall({
        action: auditConfig.action,
        category: auditConfig.category,
        userId,
        targetId: auditConfig.getTargetId ? auditConfig.getTargetId(result) : undefined,
        changes: auditConfig.getChanges ? auditConfig.getChanges(args, result) : undefined,
      });

      return result;
    } catch (error) {
      // Log failed attempt
      await auditApiCall({
        action: auditConfig.action,
        category: auditConfig.category,
        userId: args[0]?.userId || 'system',
        metadata: {
          error: error instanceof Error ? error.message : 'Unknown error',
          failed: true,
        },
      });
      throw error;
    }
  }) as T;
}
