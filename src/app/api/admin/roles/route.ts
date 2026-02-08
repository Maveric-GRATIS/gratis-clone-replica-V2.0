// src/app/api/admin/roles/route.ts
// GRATIS.NGO — Admin Role Management API

import { NextRequest, NextResponse } from '@/lib/next-compat';
import type { RoleName, UserRole } from '@/types/rbac';
import { ROLE_DEFINITIONS } from '@/lib/rbac/role-definitions';
import {
  assignRole,
  revokeRole,
  getUserRoles,
  canAssignRoleToUser,
  buildContextForUser,
} from '@/lib/rbac/permission-service';
import { requirePermissions } from '@/middleware/rbac';

/**
 * GET /api/admin/roles
 * Fetch all role definitions or roles for a specific user
 */
export async function GET(request: NextRequest) {
  try {
    // Mock auth - in production, extract from session/token
    const userId = request.headers.get('x-user-id') || 'mock-admin-user';

    // Check permission
    const authCheck = await requirePermissions(userId, {
      requiredPermissions: ['users:read', 'admin:dashboard'],
    });

    if (!authCheck.allowed) {
      return NextResponse.json(
        { error: 'Unauthorized', reason: authCheck.reason },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('userId');

    if (targetUserId) {
      // Get roles for specific user
      const roles = await getUserRoles(targetUserId);
      return NextResponse.json({ roles });
    }

    // Return all role definitions
    const roles = Object.values(ROLE_DEFINITIONS);
    return NextResponse.json({ roles });
  } catch (error) {
    console.error('[Admin Roles API] GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/roles
 * Assign a role to a user
 */
export async function POST(request: NextRequest) {
  try {
    // Mock auth
    const userId = request.headers.get('x-user-id') || 'mock-admin-user';

    // Check permission
    const authCheck = await requirePermissions(userId, {
      requiredPermissions: ['users:role_assign'],
    });

    if (!authCheck.allowed) {
      return NextResponse.json(
        { error: 'Unauthorized', reason: authCheck.reason },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { targetUserId, role, scopeType, scopeId } = body;

    if (!targetUserId || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: targetUserId, role' },
        { status: 400 }
      );
    }

    // Check if current user can assign this role
    const canAssign = await canAssignRoleToUser(role as RoleName, authCheck.context || undefined);
    if (!canAssign) {
      return NextResponse.json(
        { error: 'Cannot assign this role - insufficient privileges' },
        { status: 403 }
      );
    }

    // Assign the role
    const userRole = await assignRole(
      targetUserId,
      role as RoleName,
      scopeType,
      scopeId
    );

    return NextResponse.json({
      success: true,
      role: userRole,
      message: `Role ${role} assigned to user ${targetUserId}`,
    });
  } catch (error) {
    console.error('[Admin Roles API] POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/roles
 * Revoke a role from a user
 */
export async function DELETE(request: NextRequest) {
  try {
    // Mock auth
    const userId = request.headers.get('x-user-id') || 'mock-admin-user';

    // Check permission
    const authCheck = await requirePermissions(userId, {
      requiredPermissions: ['users:role_assign'],
    });

    if (!authCheck.allowed) {
      return NextResponse.json(
        { error: 'Unauthorized', reason: authCheck.reason },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('userId');
    const role = searchParams.get('role');
    const scopeId = searchParams.get('scopeId') || undefined;

    if (!targetUserId || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, role' },
        { status: 400 }
      );
    }

    // Check if current user can revoke this role
    const canAssign = await canAssignRoleToUser(role as RoleName, authCheck.context || undefined);
    if (!canAssign) {
      return NextResponse.json(
        { error: 'Cannot revoke this role - insufficient privileges' },
        { status: 403 }
      );
    }

    // Revoke the role
    const success = await revokeRole(targetUserId, role as RoleName, scopeId);

    return NextResponse.json({
      success,
      message: `Role ${role} revoked from user ${targetUserId}`,
    });
  } catch (error) {
    console.error('[Admin Roles API] DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
