// src/lib/rbac/permission-service.ts
// GRATIS.NGO — Permission & RBAC Service

import type { Permission, RoleName, RBACContext, UserRole } from '@/types/rbac';
import { ROLE_DEFINITIONS, getAllPermissions } from './role-definitions';

// Current User Context (mock for now)
let currentUserContext: RBACContext | null = null;

export function setUserContext(context: RBACContext) {
  currentUserContext = context;
}

export function getUserContext(): RBACContext | null {
  return currentUserContext;
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(permission: Permission, context?: RBACContext): boolean {
  const ctx = context || currentUserContext;
  if (!ctx) return false;

  // Check if user has any role that includes this permission
  for (const userRole of ctx.roles) {
    const roleName = userRole.role;
    const permissions = getAllPermissions(roleName);

    if (permissions.includes(permission)) {
      // Check scope restrictions
      if (permission.startsWith('partners:') && userRole.scopeType === 'partner') {
        // For partner-scoped roles, only allow if within scope
        if (ctx.partnerId && userRole.scopeId === ctx.partnerId) {
          return true;
        }
      } else if (permission.startsWith('projects:') && userRole.scopeType === 'project') {
        // For project-scoped roles
        if (ctx.projectId && userRole.scopeId === ctx.projectId) {
          return true;
        }
      } else if (userRole.scopeType === 'global' || !userRole.scopeType) {
        // Global permissions
        return true;
      }
    }
  }

  return false;
}

/**
 * Check if user has ANY of the specified permissions
 */
export function hasAnyPermission(permissions: Permission[], context?: RBACContext): boolean {
  return permissions.some((p) => hasPermission(p, context));
}

/**
 * Check if user has ALL of the specified permissions
 */
export function hasAllPermissions(permissions: Permission[], context?: RBACContext): boolean {
  return permissions.every((p) => hasPermission(p, context));
}

/**
 * Check if user has a specific role
 */
export function hasRole(roleName: RoleName, context?: RBACContext): boolean {
  const ctx = context || currentUserContext;
  if (!ctx) return false;
  return ctx.roles.some((r) => r.role === roleName);
}

/**
 * Check if user has ANY of the specified roles
 */
export function hasAnyRole(roleNames: RoleName[], context?: RBACContext): boolean {
  return roleNames.some((role) => hasRole(role, context));
}

/**
 * Get highest priority role for the user
 */
export function getPrimaryRole(context?: RBACContext): RoleName | null {
  const ctx = context || currentUserContext;
  if (!ctx || ctx.roles.length === 0) return null;

  let highestPriority = -1;
  let primaryRole: RoleName | null = null;

  for (const userRole of ctx.roles) {
    const def = ROLE_DEFINITIONS[userRole.role];
    if (def && def.priority > highestPriority) {
      highestPriority = def.priority;
      primaryRole = userRole.role;
    }
  }

  return primaryRole;
}

/**
 * Get all permissions for the user (union of all roles)
 */
export function getUserPermissions(context?: RBACContext): Permission[] {
  const ctx = context || currentUserContext;
  if (!ctx) return [];

  const allPermissions = new Set<Permission>();

  for (const userRole of ctx.roles) {
    const permissions = getAllPermissions(userRole.role);
    permissions.forEach((p) => allPermissions.add(p));
  }

  return Array.from(allPermissions);
}

/**
 * Check if action is allowed (permission + owner check)
 */
export interface AccessCheckOptions {
  permission: Permission;
  resourceOwnerId?: string;
  resourcePartnerId?: string;
  resourceProjectId?: string;
  requireOwner?: boolean;
}

export function canPerformAction(options: AccessCheckOptions, context?: RBACContext): boolean {
  const ctx = context || currentUserContext;
  if (!ctx) return false;

  const { permission, resourceOwnerId, resourcePartnerId, resourceProjectId, requireOwner } = options;

  // Check if user has the permission
  if (!hasPermission(permission, ctx)) {
    return false;
  }

  // If requireOwner is true, check if user owns the resource
  if (requireOwner && resourceOwnerId && resourceOwnerId !== ctx.userId) {
    return false;
  }

  // Check partner scope
  if (resourcePartnerId) {
    const hasPartnerAccess = ctx.roles.some(
      (r) => r.scopeType === 'partner' && r.scopeId === resourcePartnerId
    );
    // Superadmin/admin can access all partners
    if (!hasPartnerAccess && !hasAnyRole(['superadmin', 'admin'], ctx)) {
      return false;
    }
  }

  // Check project scope
  if (resourceProjectId) {
    const hasProjectAccess = ctx.roles.some(
      (r) => r.scopeType === 'project' && r.scopeId === resourceProjectId
    );
    if (!hasProjectAccess && !hasAnyRole(['superadmin', 'admin', 'editor'], ctx)) {
      return false;
    }
  }

  return true;
}

/**
 * Can assign role check
 */
export function canAssignRoleToUser(targetRole: RoleName, context?: RBACContext): boolean {
  const ctx = context || currentUserContext;
  if (!ctx) return false;

  // Must have users:role_assign permission
  if (!hasPermission('users:role_assign', ctx)) {
    return false;
  }

  // Get user's highest role
  const primaryRole = getPrimaryRole(ctx);
  if (!primaryRole) return false;

  // Can only assign roles with lower priority
  const userRoleDef = ROLE_DEFINITIONS[primaryRole];
  const targetRoleDef = ROLE_DEFINITIONS[targetRole];

  if (!userRoleDef || !targetRoleDef) return false;

  return userRoleDef.priority > targetRoleDef.priority;
}

/**
 * Filter list based on permissions
 */
export function filterByPermission<T>(
  items: T[],
  getPermission: (item: T) => Permission,
  context?: RBACContext
): T[] {
  return items.filter((item) => hasPermission(getPermission(item), context));
}

/**
 * Mock: Assign role to user (in real app, this would call Firebase)
 */
export async function assignRole(
  userId: string,
  role: RoleName,
  scopeType?: 'global' | 'partner' | 'project',
  scopeId?: string
): Promise<UserRole> {
  // Mock implementation
  console.log('[RBAC] Assigning role:', { userId, role, scopeType, scopeId });

  const userRole: UserRole = {
    userId,
    role,
    scopeType: scopeType || 'global',
    scopeId,
    assignedAt: new Date(),
    assignedBy: currentUserContext?.userId || 'system',
  };

  // In production: save to Firestore
  return userRole;
}

/**
 * Mock: Revoke role from user
 */
export async function revokeRole(
  userId: string,
  role: RoleName,
  scopeId?: string
): Promise<boolean> {
  console.log('[RBAC] Revoking role:', { userId, role, scopeId });
  // In production: remove from Firestore
  return true;
}

/**
 * Mock: Get user roles (from Firestore)
 */
export async function getUserRoles(userId: string): Promise<UserRole[]> {
  console.log('[RBAC] Fetching roles for user:', userId);

  // Mock data
  return [
    {
      userId,
      role: 'admin',
      scopeType: 'global',
      assignedAt: new Date(),
      assignedBy: 'system',
    },
  ];
}

/**
 * Build RBAC context from user data
 */
export async function buildContextForUser(
  userId: string,
  partnerId?: string,
  projectId?: string
): Promise<RBACContext> {
  const roles = await getUserRoles(userId);

  return {
    userId,
    roles,
    partnerId,
    projectId,
  };
}
