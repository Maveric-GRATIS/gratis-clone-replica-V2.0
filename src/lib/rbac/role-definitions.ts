// src/lib/rbac/role-definitions.ts
// GRATIS.NGO — Role Definitions & Permission Matrix

import type { RoleDefinition, RoleName, Permission } from '@/types/rbac';

export const ROLE_DEFINITIONS: Record<RoleName, RoleDefinition> = {
  superadmin: {
    name: 'superadmin',
    label: 'Super Administrator',
    description: 'Full system access with all permissions',
    permissions: [
      // All permissions
      'donations:read', 'donations:create', 'donations:update', 'donations:delete', 'donations:refund', 'donations:export',
      'projects:read', 'projects:create', 'projects:update', 'projects:delete', 'projects:publish',
      'events:read', 'events:create', 'events:update', 'events:delete', 'events:publish',
      'users:read', 'users:create', 'users:update', 'users:delete', 'users:role_assign', 'users:impersonate',
      'partners:read', 'partners:create', 'partners:update', 'partners:delete', 'partners:approve', 'partners:payout',
      'content:read', 'content:create', 'content:update', 'content:delete', 'content:publish', 'content:moderate',
      'admin:dashboard', 'admin:config', 'admin:audit', 'admin:analytics', 'admin:reports', 'admin:webhooks', 'admin:api_keys',
      'system:deploy', 'system:backup', 'system:restore', 'system:maintenance',
    ],
    isSystem: true,
    priority: 100,
  },

  admin: {
    name: 'admin',
    label: 'Administrator',
    description: 'Administrative access to most features',
    permissions: [
      'donations:read', 'donations:create', 'donations:update', 'donations:export',
      'projects:read', 'projects:create', 'projects:update', 'projects:delete', 'projects:publish',
      'events:read', 'events:create', 'events:update', 'events:delete', 'events:publish',
      'users:read', 'users:create', 'users:update', 'users:role_assign',
      'partners:read', 'partners:create', 'partners:update', 'partners:approve',
      'content:read', 'content:create', 'content:update', 'content:delete', 'content:publish', 'content:moderate',
      'admin:dashboard', 'admin:audit', 'admin:analytics', 'admin:reports',
    ],
    isSystem: true,
    priority: 90,
  },

  editor: {
    name: 'editor',
    label: 'Content Editor',
    description: 'Can manage content, projects, and events',
    permissions: [
      'donations:read',
      'projects:read', 'projects:create', 'projects:update',
      'events:read', 'events:create', 'events:update',
      'users:read',
      'partners:read',
      'content:read', 'content:create', 'content:update', 'content:publish',
      'admin:dashboard',
    ],
    isSystem: true,
    priority: 60,
  },

  moderator: {
    name: 'moderator',
    label: 'Content Moderator',
    description: 'Can moderate content and handle reports',
    permissions: [
      'donations:read',
      'projects:read',
      'events:read',
      'users:read',
      'partners:read',
      'content:read', 'content:moderate',
      'admin:dashboard',
    ],
    isSystem: true,
    priority: 50,
  },

  partner_admin: {
    name: 'partner_admin',
    label: 'Partner Administrator',
    description: 'Full access to partner organization',
    permissions: [
      'donations:read',
      'projects:read', 'projects:create', 'projects:update',
      'events:read', 'events:create', 'events:update',
      'partners:read', 'partners:update',
      'content:read', 'content:create', 'content:update',
    ],
    isSystem: false,
    priority: 40,
  },

  partner_member: {
    name: 'partner_member',
    label: 'Partner Member',
    description: 'Limited partner organization access',
    permissions: [
      'donations:read',
      'projects:read',
      'events:read',
      'partners:read',
      'content:read',
    ],
    isSystem: false,
    priority: 30,
  },

  tribe_member: {
    name: 'tribe_member',
    label: 'Tribe Member',
    description: 'Recurring supporter with tribe benefits',
    permissions: [
      'donations:read', 'donations:create',
      'projects:read',
      'events:read',
      'content:read',
    ],
    isSystem: false,
    priority: 25,
  },

  donor: {
    name: 'donor',
    label: 'Donor',
    description: 'Has made donations',
    permissions: [
      'donations:read', 'donations:create',
      'projects:read',
      'events:read',
      'content:read',
    ],
    isSystem: false,
    priority: 20,
  },

  volunteer: {
    name: 'volunteer',
    label: 'Volunteer',
    description: 'Registered volunteer',
    permissions: [
      'projects:read',
      'events:read',
      'content:read',
    ],
    isSystem: false,
    priority: 15,
  },

  viewer: {
    name: 'viewer',
    label: 'Viewer',
    description: 'Basic read-only access',
    permissions: [
      'projects:read',
      'events:read',
      'content:read',
    ],
    isSystem: true,
    priority: 10,
  },
};

// Helper Functions
export function getAllPermissions(role: RoleName): Permission[] {
  const def = ROLE_DEFINITIONS[role];
  if (!def) return [];

  const permissions = new Set<Permission>(def.permissions);

  // Resolve inherited roles
  if (def.inherits) {
    for (const parentRole of def.inherits) {
      getAllPermissions(parentRole).forEach((p) => permissions.add(p));
    }
  }

  return Array.from(permissions);
}

export function getRoleByPriority(): RoleDefinition[] {
  return Object.values(ROLE_DEFINITIONS).sort((a, b) => b.priority - a.priority);
}

export function canAssignRole(assignerRole: RoleName, targetRole: RoleName): boolean {
  const assigner = ROLE_DEFINITIONS[assignerRole];
  const target = ROLE_DEFINITIONS[targetRole];
  if (!assigner || !target) return false;
  // Can only assign roles with lower priority
  return assigner.priority > target.priority;
}
