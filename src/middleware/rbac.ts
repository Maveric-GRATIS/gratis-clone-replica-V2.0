// src/middleware/rbac.ts
// GRATIS.NGO — RBAC Middleware

import type { Permission, RBACContext } from '@/types/rbac';
import { hasPermission, buildContextForUser } from '@/lib/rbac/permission-service';

export interface RBACMiddlewareOptions {
  requiredPermissions?: Permission[];
  requireAll?: boolean; // If true, user must have ALL permissions. If false, ANY permission
}

/**
 * RBAC Middleware for API routes
 * Checks if user has required permissions before allowing request
 */
export async function requirePermissions(
  userId: string,
  options: RBACMiddlewareOptions,
  context?: { partnerId?: string; projectId?: string }
): Promise<{ allowed: boolean; context: RBACContext | null; reason?: string }> {
  try {
    // Build RBAC context for user
    const rbacContext = await buildContextForUser(
      userId,
      context?.partnerId,
      context?.projectId
    );

    if (!options.requiredPermissions || options.requiredPermissions.length === 0) {
      // No permissions required, just need to be authenticated
      return { allowed: true, context: rbacContext };
    }

    const { requiredPermissions, requireAll = false } = options;

    if (requireAll) {
      // User must have ALL permissions
      const hasAll = requiredPermissions.every((p) => hasPermission(p, rbacContext));
      if (!hasAll) {
        return {
          allowed: false,
          context: rbacContext,
          reason: `Missing required permissions: ${requiredPermissions.join(', ')}`,
        };
      }
    } else {
      // User must have ANY permission
      const hasAny = requiredPermissions.some((p) => hasPermission(p, rbacContext));
      if (!hasAny) {
        return {
          allowed: false,
          context: rbacContext,
          reason: `Missing any of required permissions: ${requiredPermissions.join(', ')}`,
        };
      }
    }

    return { allowed: true, context: rbacContext };
  } catch (error) {
    console.error('[RBAC Middleware] Error:', error);
    return {
      allowed: false,
      context: null,
      reason: 'RBAC check failed due to internal error',
    };
  }
}

/**
 * Quick permission check helper
 */
export async function checkPermission(
  userId: string,
  permission: Permission,
  context?: { partnerId?: string; projectId?: string }
): Promise<boolean> {
  const result = await requirePermissions(userId, { requiredPermissions: [permission] }, context);
  return result.allowed;
}
