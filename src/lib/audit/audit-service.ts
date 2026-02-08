// src/lib/audit/audit-service.ts
// GRATIS.NGO — Audit Log Service (Mock Implementation)

import type {
  AuditEntry,
  AuditAction,
  AuditCategory,
  AuditActor,
  AuditTarget,
  AuditChange,
  AuditQuery,
  AuditQueryResult,
  AuditStats,
  AuditSeverity,
} from '@/types/audit';
import { SEVERITY_MAP } from '@/types/audit';

// Mock audit storage (in production, use Firestore)
const auditLogs: AuditEntry[] = [];

// Core audit logging function
export async function logAuditEvent(params: {
  action: AuditAction;
  category: AuditCategory;
  actor: AuditActor;
  target?: AuditTarget;
  changes?: AuditChange[];
  metadata?: Record<string, unknown>;
  description: string;
  success?: boolean;
  errorMessage?: string;
  requestId?: string;
  duration?: number;
}): Promise<string> {
  const id = `aud_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  const severity = SEVERITY_MAP[params.action] || 'info';

  const entry: AuditEntry = {
    id,
    timestamp: new Date().toISOString(),
    action: params.action,
    category: params.category,
    severity,
    actor: sanitizeActor(params.actor),
    target: params.target,
    changes: params.changes ? redactSensitiveChanges(params.changes) : undefined,
    metadata: params.metadata,
    description: params.description,
    success: params.success !== false,
    errorMessage: params.errorMessage,
    requestId: params.requestId,
    duration: params.duration,
  };

  // Store in mock array (in production, save to Firestore)
  auditLogs.unshift(entry);

  // Keep only last 1000 entries in memory
  if (auditLogs.length > 1000) {
    auditLogs.pop();
  }

  // Alert on critical events
  if (severity === 'critical') {
    console.warn(`[AUDIT:CRITICAL] ${entry.description}`, entry);
  }

  return id;
}

// Convenience helpers
export function auditAuth(
  action: 'login' | 'logout' | 'login_failed' | 'password_change' | 'mfa_enable' | 'mfa_disable',
  actor: AuditActor,
  meta?: Record<string, unknown>
) {
  return logAuditEvent({
    action,
    category: 'authentication',
    actor,
    description: `${actor.email} ${action.replace('_', ' ')}`,
    metadata: meta,
  });
}

export function auditData(
  action: 'create' | 'read' | 'update' | 'delete',
  actor: AuditActor,
  target: AuditTarget,
  changes?: AuditChange[]
) {
  return logAuditEvent({
    action,
    category: 'data',
    actor,
    target,
    changes,
    description: `${actor.email} ${action}d ${target.type} ${target.id}`,
  });
}

export function auditPayment(
  action: 'payment_process' | 'payment_refund' | 'donation_receive' | 'subscription_change',
  actor: AuditActor,
  target: AuditTarget,
  meta?: Record<string, unknown>
) {
  return logAuditEvent({
    action,
    category: 'payment',
    actor,
    target,
    description: `${actor.email} ${action.replace('_', ' ')} for ${target.type} ${target.id}`,
    metadata: meta,
  });
}

export function auditAdmin(
  action: AuditAction,
  actor: AuditActor,
  description: string,
  meta?: Record<string, unknown>
) {
  return logAuditEvent({
    action,
    category: 'admin',
    actor,
    description,
    metadata: meta,
  });
}

export function auditSystem(
  action: 'deploy' | 'backup' | 'restore' | 'config_change' | 'system_event',
  description: string,
  meta?: Record<string, unknown>
) {
  return logAuditEvent({
    action,
    category: 'system',
    actor: {
      id: 'system',
      email: 'system@gratis.ngo',
      name: 'System',
      role: 'system',
    },
    description,
    metadata: meta,
  });
}

// Query audit logs
export async function queryAuditLogs(params: AuditQuery): Promise<AuditQueryResult> {
  const page = params.page || 1;
  const pageLimit = Math.min(params.limit || 50, 200);

  let filtered = [...auditLogs];

  // Apply filters
  if (params.startDate) {
    filtered = filtered.filter((e) => e.timestamp >= params.startDate!);
  }
  if (params.endDate) {
    filtered = filtered.filter((e) => e.timestamp <= params.endDate!);
  }
  if (params.actions?.length) {
    filtered = filtered.filter((e) => params.actions!.includes(e.action));
  }
  if (params.categories?.length) {
    filtered = filtered.filter((e) => params.categories!.includes(e.category));
  }
  if (params.severities?.length) {
    filtered = filtered.filter((e) => params.severities!.includes(e.severity));
  }
  if (params.actorId) {
    filtered = filtered.filter((e) => e.actor.id === params.actorId);
  }
  if (params.targetType) {
    filtered = filtered.filter((e) => e.target?.type === params.targetType);
  }
  if (params.success !== undefined) {
    filtered = filtered.filter((e) => e.success === params.success);
  }
  if (params.search) {
    const search = params.search.toLowerCase();
    filtered = filtered.filter((e) =>
      e.description.toLowerCase().includes(search) ||
      e.actor.email.toLowerCase().includes(search)
    );
  }

  // Sort
  const sortField = params.sortBy || 'timestamp';
  const sortDir = params.sortOrder || 'desc';
  filtered.sort((a, b) => {
    const aVal = a[sortField] as string;
    const bVal = b[sortField] as string;
    return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  // Paginate
  const start = (page - 1) * pageLimit;
  const entries = filtered.slice(start, start + pageLimit);
  const hasMore = filtered.length > start + pageLimit;

  return {
    entries,
    total: filtered.length,
    page,
    limit: pageLimit,
    hasMore,
  };
}

// Get audit statistics
export async function getAuditStats(days: number = 30): Promise<AuditStats> {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceStr = since.toISOString();

  const entries = auditLogs.filter((e) => e.timestamp >= sinceStr);

  const byAction: Record<string, number> = {};
  const byCategory: Record<string, number> = {};
  const bySeverity: Record<string, number> = {};
  const actorCounts: Record<string, { name: string; count: number }> = {};
  let failedActions = 0;

  for (const entry of entries) {
    byAction[entry.action] = (byAction[entry.action] || 0) + 1;
    byCategory[entry.category] = (byCategory[entry.category] || 0) + 1;
    bySeverity[entry.severity] = (bySeverity[entry.severity] || 0) + 1;

    if (!entry.success) failedActions++;

    if (!actorCounts[entry.actor.id]) {
      actorCounts[entry.actor.id] = { name: entry.actor.name, count: 0 };
    }
    actorCounts[entry.actor.id].count++;
  }

  const topActors = Object.entries(actorCounts)
    .map(([id, { name, count }]) => ({ id, name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const recentCritical = auditLogs
    .filter((e) => e.severity === 'critical')
    .slice(0, 5);

  return {
    totalEntries: entries.length,
    byAction,
    byCategory,
    bySeverity,
    failedActions,
    uniqueActors: Object.keys(actorCounts).length,
    topActors,
    recentCritical,
  };
}

// Internal helpers
function sanitizeActor(actor: AuditActor): AuditActor {
  return {
    ...actor,
    email: actor.email?.toLowerCase(),
    ip: actor.ip?.slice(0, 45),
    userAgent: actor.userAgent?.slice(0, 256),
  };
}

const SENSITIVE_FIELDS = ['password', 'token', 'secret', 'apiKey', 'creditCard', 'ssn', 'cardNumber'];

function redactSensitiveChanges(changes: AuditChange[]): AuditChange[] {
  return changes.map((change) => {
    if (SENSITIVE_FIELDS.some((f) => change.field.toLowerCase().includes(f.toLowerCase()))) {
      return { ...change, oldValue: '[REDACTED]', newValue: '[REDACTED]' };
    }
    return change;
  });
}
