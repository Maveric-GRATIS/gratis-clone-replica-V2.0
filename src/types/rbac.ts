// ============================================================================
// ROLE-BASED ACCESS CONTROL TYPE DEFINITIONS
// ============================================================================

/**
 * Platform resources that can be protected
 */
export type Resource =
  | 'donations'
  | 'users'
  | 'projects'
  | 'partners'
  | 'events'
  | 'content'
  | 'campaigns'
  | 'reports'
  | 'analytics'
  | 'settings'
  | 'roles'
  | 'permissions'
  | 'subscriptions'
  | 'payments'
  | 'refunds'
  | 'gdpr'
  | 'audit'
  | 'tribes'
  | 'social'
  | 'messaging'
  | 'support'
  | 'admin';

/**
 * Actions that can be performed on resources
 */
export type Action = 'create' | 'read' | 'update' | 'delete' | 'export' | 'approve' | 'manage' | 'role_assign' | 'dashboard' | 'webhooks' | 'audit';

/**
 * Permission string format: "resource:action"
 */
export type Permission = `${Resource}:${Action}`;

/**
 * Built-in system roles
 */
export type SystemRole = 'super_admin' | 'admin' | 'moderator' | 'partner_admin' | 'partner_user' | 'tribe_leader' | 'member' | 'guest';

/**
 * Role definition with permissions
 */
export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystemRole: boolean;
  isDefault: boolean;
  hierarchy: number; // Higher number = more power
  inheritsFrom?: string; // Role ID to inherit permissions from
  metadata: {
    maxUsers?: number;
    requiresApproval?: boolean;
    autoAssign?: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

/**
 * User role assignment
 */
export interface UserRole {
  userId: string;
  roleId: string;
  assignedBy: string;
  assignedAt: Date;
  expiresAt?: Date;
  scope?: {
    partnerId?: string;
    tribeId?: string;
    projectId?: string;
  };
}

/**
 * Role change audit entry
 */
export interface RoleChangeLog {
  id: string;
  userId: string;
  previousRole?: string;
  newRole: string;
  changedBy: string;
  reason?: string;
  timestamp: Date;
}

/**
 * Permission check result
 */
export interface PermissionCheckResult {
  allowed: boolean;
  role: string;
  matchedPermissions: Permission[];
  reason?: string;
}

/**
 * RBAC Context for permission evaluation
 */
export interface RBACContext {
  userId: string;
  roles: UserRole[];
  effectivePermissions: Permission[];
  partnerId?: string;
  projectId?: string;
}

/**
 * Role name type alias (for backward compatibility)
 */
export type RoleName = SystemRole | string;
