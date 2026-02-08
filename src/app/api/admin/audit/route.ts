// src/app/api/admin/audit/route.ts
// GRATIS.NGO — Audit Log API

import { NextRequest, NextResponse } from '@/lib/next-compat';
import {
  queryAuditLogs,
  getAuditStats,
  logAuditEvent,
} from '@/lib/audit/audit-service';
import type { AuditQuery, AuditAction, AuditCategory, AuditSeverity } from '@/types/audit';
import { requirePermissions } from '@/middleware/rbac';
import type { AuditAction as Action, AuditCategory as Category, AuditSeverity as Severity } from '@/types/audit';

/**
 * GET /api/admin/audit
 * Query audit logs (with filters)
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'mock-admin-user';

    // Check permission
    const authCheck = await requirePermissions(userId, {
      requiredPermissions: ['admin:audit'],
    });

    if (!authCheck.allowed) {
      return NextResponse.json(
        { error: 'Unauthorized', reason: authCheck.reason },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);

    // Build query from search params
    const query: AuditQuery = {
      limit: parseInt(searchParams.get('limit') || '50', 10),
      page: parseInt(searchParams.get('page') || '1', 10),
    };

    if (searchParams.get('startDate')) {
      query.startDate = searchParams.get('startDate')!;
    }
    if (searchParams.get('endDate')) {
      query.endDate = searchParams.get('endDate')!;
    }
    if (searchParams.get('actions')) {
      query.actions = searchParams.get('actions')!.split(',') as AuditAction[];
    }
    if (searchParams.get('categories')) {
      query.categories = searchParams.get('categories')!.split(',') as AuditCategory[];
    }
    if (searchParams.get('actorId')) {
      query.actorId = searchParams.get('actorId')!;
    }
    if (searchParams.get('targetType')) {
      query.targetType = searchParams.get('targetType')!;
    }
    if (searchParams.get('severities')) {
      query.severities = searchParams.get('severities')!.split(',') as AuditSeverity[];
    }
    if (searchParams.get('search')) {
      query.search = searchParams.get('search')!;
    }

    // Check if requesting stats
    if (searchParams.get('stats') === 'true') {
      const days = parseInt(searchParams.get('days') || '30', 10);
      const stats = await getAuditStats(days);
      return NextResponse.json({ stats });
    }

    // Query audit logs
    const logs = await queryAuditLogs(query);

    return NextResponse.json({
      ...logs,
      query,
    });
  } catch (error) {
    console.error('[Audit API] GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/audit
 * Manually log an audit event (for testing/admin purposes)
 */
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'mock-admin-user';

    // Check permission
    const authCheck = await requirePermissions(userId, {
      requiredPermissions: ['admin:audit'],
    });

    if (!authCheck.allowed) {
      return NextResponse.json(
        { error: 'Unauthorized', reason: authCheck.reason },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, category, actor, target, changes, metadata, description } = body;

    if (!action || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: action, category' },
        { status: 400 }
      );
    }

    // Log audit event
    const auditId = await logAuditEvent({
      action,
      category,
      actor: actor || { id: userId, email: 'admin@gratis.ngo', role: 'admin' },
      target,
      changes,
      metadata,
      description: description || `${action} on ${category}`,
    });

    return NextResponse.json({
      success: true,
      auditId,
      message: 'Audit event logged',
    });
  } catch (error) {
    console.error('[Audit API] POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
