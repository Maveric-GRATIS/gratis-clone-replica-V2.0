// src/app/api/admin/audit/route.ts
// GRATIS.NGO — Audit Log API

import { NextRequest, NextResponse } from 'next/server';
import {
  queryAuditLogs,
  getAuditStats,
  logAuditEvent,
} from '@/lib/audit/audit-service';
import type { AuditQuery } from '@/types/audit';
import { requirePermissions } from '@/middleware/rbac';

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
      offset: parseInt(searchParams.get('offset') || '0', 10),
    };

    if (searchParams.get('startDate')) {
      query.startDate = new Date(searchParams.get('startDate')!);
    }
    if (searchParams.get('endDate')) {
      query.endDate = new Date(searchParams.get('endDate')!);
    }
    if (searchParams.get('actions')) {
      query.actions = searchParams.get('actions')!.split(',') as any[];
    }
    if (searchParams.get('categories')) {
      query.categories = searchParams.get('categories')!.split(',') as any[];
    }
    if (searchParams.get('userId')) {
      query.userId = searchParams.get('userId')!;
    }
    if (searchParams.get('targetId')) {
      query.targetId = searchParams.get('targetId')!;
    }
    if (searchParams.get('severity')) {
      query.severity = searchParams.get('severity')! as any;
    }
    if (searchParams.get('search')) {
      query.search = searchParams.get('search')!;
    }

    // Check if requesting stats
    if (searchParams.get('stats') === 'true') {
      const stats = await getAuditStats(query);
      return NextResponse.json({ stats });
    }

    // Query audit logs
    const logs = await queryAuditLogs(query);

    return NextResponse.json({
      logs,
      query,
      count: logs.length,
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
    const { action, category, actor, target, changes, metadata } = body;

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
      actor: actor || { userId, userEmail: 'admin@gratis.ngo', ipAddress: '127.0.0.1' },
      target,
      changes,
      metadata,
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
