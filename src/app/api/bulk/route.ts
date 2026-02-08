// ============================================================================
// GRATIS.NGO — Bulk Operations API Routes
// ============================================================================

import { BulkOperation, BULK_OPERATION_CONFIGS } from '@/types/bulk-operations';

// Mock bulk operations
const mockOperations: BulkOperation[] = [
  {
    id: 'bulk_001',
    type: 'tag',
    entityType: 'contacts',
    targetIds: ['contact_1', 'contact_2', 'contact_3'],
    params: { tags: ['vip', 'donor'] },
    status: 'completed',
    progress: {
      total: 3,
      processed: 3,
      succeeded: 3,
      failed: 0,
      percentage: 100,
    },
    results: {
      affectedCount: 3,
      successIds: ['contact_1', 'contact_2', 'contact_3'],
      failedIds: [],
    },
    errors: [],
    undoAvailable: true,
    createdBy: 'user123',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    completedAt: new Date(Date.now() - 1790000).toISOString(),
    undoExpiry: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    id: 'bulk_002',
    type: 'archive',
    entityType: 'events',
    targetIds: ['event_1', 'event_2'],
    params: {},
    status: 'completed',
    progress: {
      total: 2,
      processed: 2,
      succeeded: 2,
      failed: 0,
      percentage: 100,
    },
    results: {
      affectedCount: 2,
      successIds: ['event_1', 'event_2'],
      failedIds: [],
    },
    errors: [],
    undoAvailable: true,
    createdBy: 'user123',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    completedAt: new Date(Date.now() - 3550000).toISOString(),
    undoExpiry: new Date(Date.now() + 82800000).toISOString(),
  },
];

// GET /api/bulk — List or get operations
export async function GET(req: Request) {
  const url = new URL(req.url);
  const opId = url.searchParams.get('id');
  const userId = url.searchParams.get('userId');

  if (opId) {
    const op = mockOperations.find(o => o.id === opId);
    if (!op) return Response.json({ error: 'Operation not found' }, { status: 404 });
    return Response.json({ operation: op });
  }

  const ops = userId ? mockOperations.filter(o => o.createdBy === userId) : mockOperations;
  return Response.json({ operations: ops });
}

// POST /api/bulk — Create & execute, or undo
export async function POST(req: Request) {
  const body = await req.json();
  const { action, type, entityType, targetIds, params, userId, operationId } = body;

  if (action === 'undo') {
    if (!operationId) {
      return Response.json({ error: 'operationId required' }, { status: 400 });
    }

    const op = mockOperations.find(o => o.id === operationId);
    if (!op) {
      return Response.json({ error: 'Operation not found' }, { status: 404 });
    }

    // Mock undo
    return Response.json({ success: true, message: 'Operation undone' });
  }

  // Create and execute bulk operation
  if (!type || !entityType || !targetIds || targetIds.length === 0) {
    return Response.json({
      error: 'Missing required fields: type, entityType, targetIds'
    }, { status: 400 });
  }

  const config = BULK_OPERATION_CONFIGS[type as keyof typeof BULK_OPERATION_CONFIGS];
  if (!config) {
    return Response.json({ error: 'Invalid operation type' }, { status: 400 });
  }

  if (targetIds.length > config.maxTargets) {
    return Response.json({
      error: `Too many targets. Maximum: ${config.maxTargets}`
    }, { status: 400 });
  }

  // Create mock operation
  const newOp: BulkOperation = {
    id: `bulk_${Date.now()}`,
    type,
    entityType,
    targetIds,
    params: params || {},
    status: 'pending',
    progress: {
      total: targetIds.length,
      processed: 0,
      succeeded: 0,
      failed: 0,
      percentage: 0,
    },
    results: {
      affectedCount: 0,
      successIds: [],
      failedIds: [],
    },
    errors: [],
    undoAvailable: config.allowUndo,
    createdBy: userId || 'user123',
    createdAt: new Date().toISOString(),
    undoExpiry: config.allowUndo
      ? new Date(Date.now() + 86400000).toISOString()
      : undefined,
  };

  // Simulate immediate completion for demo
  newOp.status = 'completed';
  newOp.progress = {
    total: targetIds.length,
    processed: targetIds.length,
    succeeded: targetIds.length,
    failed: 0,
    percentage: 100,
  };
  newOp.results = {
    affectedCount: targetIds.length,
    successIds: targetIds,
    failedIds: [],
  };
  newOp.completedAt = new Date().toISOString();

  return Response.json({ operation: newOp, message: 'Bulk operation started' });
}
