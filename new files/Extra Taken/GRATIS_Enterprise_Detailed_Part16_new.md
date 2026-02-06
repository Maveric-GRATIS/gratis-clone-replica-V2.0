# GRATIS.NGO — Enterprise Detailed Build Guide — PART 14
## Sections 69–73: Audit Logs, RBAC, Multi-Tenant, GraphQL, Webhook Delivery
### Total Size: ~140KB | ~30 Files | Complexity: HIGH

---

# ═══════════════════════════════════════════════════════════════════════════════
## SECTION 69 — AUDIT LOG & ACTIVITY TRAIL SYSTEM
# ═══════════════════════════════════════════════════════════════════════════════

### File 69-1: `src/types/audit.ts`

```typescript
// ============================================================================
// GRATIS.NGO — Audit Log Type Definitions
// ============================================================================

export type AuditAction =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'login'
  | 'logout'
  | 'login_failed'
  | 'password_change'
  | 'mfa_enable'
  | 'mfa_disable'
  | 'role_change'
  | 'permission_grant'
  | 'permission_revoke'
  | 'export_data'
  | 'import_data'
  | 'payment_process'
  | 'payment_refund'
  | 'donation_receive'
  | 'subscription_change'
  | 'config_change'
  | 'deploy'
  | 'backup'
  | 'restore'
  | 'api_key_create'
  | 'api_key_revoke'
  | 'webhook_register'
  | 'webhook_delete'
  | 'moderation_action'
  | 'partner_approve'
  | 'partner_reject'
  | 'bulk_operation'
  | 'system_event';

export type AuditSeverity = 'low' | 'medium' | 'high' | 'critical';

export type AuditCategory =
  | 'authentication'
  | 'authorization'
  | 'data'
  | 'payment'
  | 'admin'
  | 'system'
  | 'partner'
  | 'user'
  | 'content'
  | 'security';

export interface AuditActor {
  id: string;
  email: string;
  name: string;
  role: string;
  ip?: string;
  userAgent?: string;
  sessionId?: string;
}

export interface AuditTarget {
  type: string;          // 'user' | 'donation' | 'project' | 'partner' | 'config' | ...
  id: string;
  name?: string;
  collection?: string;   // Firestore collection path
}

export interface AuditChange {
  field: string;
  oldValue: unknown;
  newValue: unknown;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: AuditAction;
  category: AuditCategory;
  severity: AuditSeverity;
  actor: AuditActor;
  target?: AuditTarget;
  changes?: AuditChange[];
  metadata?: Record<string, unknown>;
  description: string;
  success: boolean;
  errorMessage?: string;
  requestId?: string;
  duration?: number;        // milliseconds
  geoLocation?: {
    country: string;
    city: string;
    lat: number;
    lng: number;
  };
}

export interface AuditQuery {
  startDate?: string;
  endDate?: string;
  actions?: AuditAction[];
  categories?: AuditCategory[];
  severities?: AuditSeverity[];
  actorId?: string;
  targetType?: string;
  targetId?: string;
  success?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'timestamp' | 'severity' | 'action';
  sortOrder?: 'asc' | 'desc';
}

export interface AuditQueryResult {
  entries: AuditEntry[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface AuditStats {
  totalEntries: number;
  byAction: Record<string, number>;
  byCategory: Record<string, number>;
  bySeverity: Record<string, number>;
  failedActions: number;
  uniqueActors: number;
  topActors: { id: string; name: string; count: number }[];
  recentCritical: AuditEntry[];
}

export interface AuditRetentionPolicy {
  defaultDays: number;
  criticalDays: number;
  authDays: number;
  paymentDays: number;
}

export const DEFAULT_RETENTION: AuditRetentionPolicy = {
  defaultDays: 90,
  criticalDays: 2555,   // ~7 years (financial compliance)
  authDays: 365,
  paymentDays: 2555,
};

export const SEVERITY_MAP: Record<AuditAction, AuditSeverity> = {
  create: 'low',
  read: 'low',
  update: 'medium',
  delete: 'high',
  login: 'low',
  logout: 'low',
  login_failed: 'medium',
  password_change: 'medium',
  mfa_enable: 'medium',
  mfa_disable: 'high',
  role_change: 'high',
  permission_grant: 'high',
  permission_revoke: 'high',
  export_data: 'medium',
  import_data: 'high',
  payment_process: 'medium',
  payment_refund: 'high',
  donation_receive: 'low',
  subscription_change: 'medium',
  config_change: 'critical',
  deploy: 'critical',
  backup: 'medium',
  restore: 'critical',
  api_key_create: 'medium',
  api_key_revoke: 'high',
  webhook_register: 'medium',
  webhook_delete: 'medium',
  moderation_action: 'medium',
  partner_approve: 'high',
  partner_reject: 'high',
  bulk_operation: 'high',
  system_event: 'medium',
};
```

---

### File 69-2: `src/lib/audit/audit-service.ts`

```typescript
// ============================================================================
// GRATIS.NGO — Audit Log Service
// ============================================================================

import { db } from '@/lib/firebase/config';
import {
  collection,
  doc,
  setDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  startAfter,
  getDocs,
  getCountFromServer,
  Timestamp,
  writeBatch,
  deleteDoc,
} from 'firebase/firestore';
import {
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
  SEVERITY_MAP,
  DEFAULT_RETENTION,
  AuditRetentionPolicy,
} from '@/types/audit';

const AUDIT_COLLECTION = 'audit_logs';
const BATCH_SIZE = 500;

// ── Core Logging ─────────────────────────────────────────────────────────────

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
  const severity = SEVERITY_MAP[params.action] || 'medium';

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
    success: params.success ?? true,
    errorMessage: params.errorMessage,
    requestId: params.requestId,
    duration: params.duration,
  };

  try {
    const ref = doc(db, AUDIT_COLLECTION, id);
    await setDoc(ref, {
      ...entry,
      _timestamp: Timestamp.now(),
      _expiresAt: computeExpiry(severity, params.category),
    });

    // Alert on critical events
    if (severity === 'critical') {
      await alertCriticalEvent(entry);
    }

    return id;
  } catch (error) {
    // Audit logging should never throw — fail silently but log to console
    console.error('[AUDIT] Failed to write audit log:', error);
    return id;
  }
}

// ── Convenience Helpers ──────────────────────────────────────────────────────

export function auditAuth(
  action: 'login' | 'logout' | 'login_failed' | 'password_change' | 'mfa_enable' | 'mfa_disable',
  actor: AuditActor,
  meta?: Record<string, unknown>
) {
  return logAuditEvent({
    action,
    category: 'authentication',
    actor,
    description: `User ${actor.email} performed ${action}`,
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
    description: `Payment action ${action} on ${target.type} ${target.id}`,
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
      name: 'GRATIS System',
      role: 'system',
    },
    description,
    metadata: meta,
  });
}

// ── Query ────────────────────────────────────────────────────────────────────

export async function queryAuditLogs(params: AuditQuery): Promise<AuditQueryResult> {
  const page = params.page || 1;
  const pageLimit = Math.min(params.limit || 50, 200);
  const sortField = params.sortBy || 'timestamp';
  const sortDir = params.sortOrder || 'desc';

  let q = query(
    collection(db, AUDIT_COLLECTION),
    orderBy(sortField === 'timestamp' ? '_timestamp' : sortField, sortDir)
  );

  // Apply filters
  if (params.startDate) {
    q = query(q, where('_timestamp', '>=', Timestamp.fromDate(new Date(params.startDate))));
  }
  if (params.endDate) {
    q = query(q, where('_timestamp', '<=', Timestamp.fromDate(new Date(params.endDate))));
  }
  if (params.actions?.length) {
    q = query(q, where('action', 'in', params.actions.slice(0, 10)));
  }
  if (params.categories?.length) {
    q = query(q, where('category', 'in', params.categories.slice(0, 10)));
  }
  if (params.actorId) {
    q = query(q, where('actor.id', '==', params.actorId));
  }
  if (params.targetType) {
    q = query(q, where('target.type', '==', params.targetType));
  }
  if (params.success !== undefined) {
    q = query(q, where('success', '==', params.success));
  }

  q = query(q, firestoreLimit(pageLimit + 1));

  const snap = await getDocs(q);
  const entries = snap.docs.slice(0, pageLimit).map((d) => d.data() as AuditEntry);
  const hasMore = snap.docs.length > pageLimit;

  // Get total count (cached for performance)
  const countSnap = await getCountFromServer(collection(db, AUDIT_COLLECTION));
  const total = countSnap.data().count;

  return { entries, total, page, limit: pageLimit, hasMore };
}

// ── Stats ────────────────────────────────────────────────────────────────────

export async function getAuditStats(days: number = 30): Promise<AuditStats> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const q = query(
    collection(db, AUDIT_COLLECTION),
    where('_timestamp', '>=', Timestamp.fromDate(since)),
    orderBy('_timestamp', 'desc'),
    firestoreLimit(5000)
  );

  const snap = await getDocs(q);
  const entries = snap.docs.map((d) => d.data() as AuditEntry);

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

    if (entry.actor.id !== 'system') {
      if (!actorCounts[entry.actor.id]) {
        actorCounts[entry.actor.id] = { name: entry.actor.name, count: 0 };
      }
      actorCounts[entry.actor.id].count++;
    }
  }

  const topActors = Object.entries(actorCounts)
    .map(([id, { name, count }]) => ({ id, name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const recentCritical = entries
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

// ── Retention / Cleanup ──────────────────────────────────────────────────────

export async function cleanupExpiredAuditLogs(): Promise<number> {
  const now = Timestamp.now();
  const q = query(
    collection(db, AUDIT_COLLECTION),
    where('_expiresAt', '<=', now),
    firestoreLimit(BATCH_SIZE)
  );

  let totalDeleted = 0;
  let hasMore = true;

  while (hasMore) {
    const snap = await getDocs(q);
    if (snap.empty) break;

    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
    totalDeleted += snap.docs.length;
    hasMore = snap.docs.length === BATCH_SIZE;
  }

  return totalDeleted;
}

// ── Internal Helpers ─────────────────────────────────────────────────────────

function sanitizeActor(actor: AuditActor): AuditActor {
  return {
    ...actor,
    email: actor.email || 'unknown',
    name: actor.name || 'Unknown User',
    // Strip sensitive headers from userAgent
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

function computeExpiry(
  severity: AuditSeverity,
  category: AuditCategory,
  policy: AuditRetentionPolicy = DEFAULT_RETENTION
): Timestamp {
  let days = policy.defaultDays;

  if (severity === 'critical') days = policy.criticalDays;
  else if (category === 'authentication') days = policy.authDays;
  else if (category === 'payment') days = policy.paymentDays;

  const expiry = new Date();
  expiry.setDate(expiry.getDate() + days);
  return Timestamp.fromDate(expiry);
}

async function alertCriticalEvent(entry: AuditEntry): Promise<void> {
  // In production, send to Slack, PagerDuty, email, etc.
  console.warn(`[AUDIT:CRITICAL] ${entry.description}`, {
    action: entry.action,
    actor: entry.actor.email,
    target: entry.target,
  });
}
```

---

### File 69-3: `src/app/api/admin/audit/route.ts`

```typescript
// ============================================================================
// GRATIS.NGO — Admin Audit Log API
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/verify';
import { queryAuditLogs, getAuditStats } from '@/lib/audit/audit-service';
import { AuditQuery } from '@/types/audit';

export async function GET(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user || !['admin', 'superadmin'].includes(user.role)) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('mode'); // 'list' | 'stats'

  if (mode === 'stats') {
    const days = parseInt(searchParams.get('days') || '30', 10);
    const stats = await getAuditStats(days);
    return NextResponse.json(stats);
  }

  // Default: list mode
  const queryParams: AuditQuery = {
    startDate: searchParams.get('startDate') || undefined,
    endDate: searchParams.get('endDate') || undefined,
    actions: searchParams.get('actions')?.split(',') as AuditQuery['actions'],
    categories: searchParams.get('categories')?.split(',') as AuditQuery['categories'],
    severities: searchParams.get('severities')?.split(',') as AuditQuery['severities'],
    actorId: searchParams.get('actorId') || undefined,
    targetType: searchParams.get('targetType') || undefined,
    success: searchParams.has('success') ? searchParams.get('success') === 'true' : undefined,
    search: searchParams.get('search') || undefined,
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: parseInt(searchParams.get('limit') || '50', 10),
    sortBy: (searchParams.get('sortBy') as AuditQuery['sortBy']) || 'timestamp',
    sortOrder: (searchParams.get('sortOrder') as AuditQuery['sortOrder']) || 'desc',
  };

  const result = await queryAuditLogs(queryParams);
  return NextResponse.json(result);
}
```

---

### File 69-4: `src/middleware/audit.ts`

```typescript
// ============================================================================
// GRATIS.NGO — Audit Middleware (auto-log API mutations)
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { logAuditEvent } from '@/lib/audit/audit-service';
import { AuditAction, AuditActor, AuditCategory } from '@/types/audit';

interface AuditableRoute {
  pattern: RegExp;
  methods: string[];
  action: AuditAction;
  category: AuditCategory;
  targetType: string;
}

const AUDITABLE_ROUTES: AuditableRoute[] = [
  { pattern: /^\/api\/admin\/config/, methods: ['PUT', 'PATCH'], action: 'config_change', category: 'admin', targetType: 'config' },
  { pattern: /^\/api\/admin\/users/, methods: ['PUT', 'PATCH', 'DELETE'], action: 'update', category: 'admin', targetType: 'user' },
  { pattern: /^\/api\/donations/, methods: ['POST'], action: 'donation_receive', category: 'payment', targetType: 'donation' },
  { pattern: /^\/api\/partners\/.*\/approve/, methods: ['POST'], action: 'partner_approve', category: 'partner', targetType: 'partner' },
  { pattern: /^\/api\/partners\/.*\/reject/, methods: ['POST'], action: 'partner_reject', category: 'partner', targetType: 'partner' },
  { pattern: /^\/api\/developer\/keys/, methods: ['POST', 'DELETE'], action: 'api_key_create', category: 'security', targetType: 'api_key' },
  { pattern: /^\/api\/admin\/exports/, methods: ['POST'], action: 'export_data', category: 'data', targetType: 'export' },
];

export function shouldAudit(req: NextRequest): AuditableRoute | null {
  const path = new URL(req.url).pathname;
  const method = req.method;

  return AUDITABLE_ROUTES.find(
    (route) => route.pattern.test(path) && route.methods.includes(method)
  ) || null;
}

export async function auditRequest(
  req: NextRequest,
  response: NextResponse,
  route: AuditableRoute,
  actor: AuditActor,
  startTime: number
): Promise<void> {
  const path = new URL(req.url).pathname;
  const success = response.status >= 200 && response.status < 400;

  await logAuditEvent({
    action: route.action,
    category: route.category,
    actor,
    target: {
      type: route.targetType,
      id: extractIdFromPath(path),
    },
    description: `${req.method} ${path} → ${response.status}`,
    success,
    duration: Date.now() - startTime,
    requestId: req.headers.get('x-request-id') || undefined,
  });
}

function extractIdFromPath(path: string): string {
  const segments = path.split('/').filter(Boolean);
  // Return last segment that looks like an ID
  for (let i = segments.length - 1; i >= 0; i--) {
    if (/^[a-zA-Z0-9_-]{10,}$/.test(segments[i])) return segments[i];
  }
  return 'unknown';
}
```

---

### File 69-5: `src/components/admin/AuditLogViewer.tsx`

```tsx
// ============================================================================
// GRATIS.NGO — Admin Audit Log Viewer Component
// ============================================================================

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  AuditEntry,
  AuditQuery,
  AuditQueryResult,
  AuditStats,
  AuditAction,
  AuditCategory,
  AuditSeverity,
} from '@/types/audit';

const SEVERITY_COLORS: Record<AuditSeverity, string> = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

const CATEGORY_ICONS: Record<AuditCategory, string> = {
  authentication: '🔐',
  authorization: '🛡️',
  data: '📊',
  payment: '💰',
  admin: '⚙️',
  system: '🖥️',
  partner: '🤝',
  user: '👤',
  content: '📝',
  security: '🔒',
};

export default function AuditLogViewer() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<AuditQuery>({
    page: 1,
    limit: 50,
    sortBy: 'timestamp',
    sortOrder: 'desc',
  });
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);
  const [view, setView] = useState<'list' | 'stats'>('list');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('mode', 'list');
      params.set('page', String(filters.page || 1));
      params.set('limit', String(filters.limit || 50));
      if (filters.sortBy) params.set('sortBy', filters.sortBy);
      if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);
      if (filters.startDate) params.set('startDate', filters.startDate);
      if (filters.endDate) params.set('endDate', filters.endDate);
      if (filters.actions?.length) params.set('actions', filters.actions.join(','));
      if (filters.categories?.length) params.set('categories', filters.categories.join(','));
      if (filters.severities?.length) params.set('severities', filters.severities.join(','));
      if (filters.actorId) params.set('actorId', filters.actorId);

      const res = await fetch(`/api/admin/audit?${params}`);
      const data: AuditQueryResult = await res.json();
      setEntries(data.entries);
      setTotal(data.total);
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/audit?mode=stats&days=30');
      const data: AuditStats = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch audit stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [fetchLogs, fetchStats]);

  const handleFilterChange = (key: keyof AuditQuery, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Audit Trail</h2>
          <p className="text-sm text-gray-500 mt-1">{total.toLocaleString()} events recorded</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === 'list' ? 'bg-[#002E5F] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Log View
          </button>
          <button
            onClick={() => setView('stats')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === 'stats' ? 'bg-[#002E5F] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Analytics
          </button>
        </div>
      </div>

      {/* Stats View */}
      {view === 'stats' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <p className="text-sm text-gray-500">Total Events (30d)</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalEntries.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <p className="text-sm text-gray-500">Failed Actions</p>
            <p className="text-3xl font-bold text-red-600">{stats.failedActions}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <p className="text-sm text-gray-500">Unique Users</p>
            <p className="text-3xl font-bold text-blue-600">{stats.uniqueActors}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <p className="text-sm text-gray-500">Critical Events</p>
            <p className="text-3xl font-bold text-orange-600">{stats.bySeverity['critical'] || 0}</p>
          </div>

          {/* Top Actors */}
          <div className="md:col-span-2 bg-white p-4 rounded-xl border shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Most Active Users</h3>
            <div className="space-y-2">
              {stats.topActors.slice(0, 5).map((actor) => (
                <div key={actor.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{actor.name}</span>
                  <span className="text-sm font-medium text-gray-900">{actor.count} actions</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Critical */}
          <div className="md:col-span-2 bg-white p-4 rounded-xl border shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Recent Critical Events</h3>
            <div className="space-y-2">
              {stats.recentCritical.map((entry) => (
                <div key={entry.id} className="text-sm">
                  <span className="text-red-600 font-medium">{entry.action}</span>
                  <span className="text-gray-500"> — {entry.description}</span>
                  <span className="text-gray-400 block text-xs">
                    {new Date(entry.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
              {stats.recentCritical.length === 0 && (
                <p className="text-sm text-gray-400">No critical events in period</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      {view === 'list' && (
        <>
          <div className="flex flex-wrap gap-3 bg-gray-50 p-4 rounded-xl">
            <select
              className="px-3 py-2 border rounded-lg text-sm"
              onChange={(e) => handleFilterChange('categories', e.target.value ? [e.target.value] : undefined)}
            >
              <option value="">All Categories</option>
              {Object.keys(CATEGORY_ICONS).map((cat) => (
                <option key={cat} value={cat}>{CATEGORY_ICONS[cat as AuditCategory]} {cat}</option>
              ))}
            </select>

            <select
              className="px-3 py-2 border rounded-lg text-sm"
              onChange={(e) => handleFilterChange('severities', e.target.value ? [e.target.value] : undefined)}
            >
              <option value="">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>

            <input
              type="date"
              className="px-3 py-2 border rounded-lg text-sm"
              onChange={(e) => handleFilterChange('startDate', e.target.value || undefined)}
              placeholder="From"
            />
            <input
              type="date"
              className="px-3 py-2 border rounded-lg text-sm"
              onChange={(e) => handleFilterChange('endDate', e.target.value || undefined)}
              placeholder="To"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                      Loading audit trail...
                    </td>
                  </tr>
                ) : entries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                      No audit entries match your filters
                    </td>
                  </tr>
                ) : (
                  entries.map((entry) => (
                    <tr
                      key={entry.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedEntry(entry)}
                    >
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                        {new Date(entry.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${SEVERITY_COLORS[entry.severity]}`}>
                          {entry.severity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {CATEGORY_ICONS[entry.category]} {entry.category}
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-700">{entry.action}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{entry.actor.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{entry.description}</td>
                      <td className="px-4 py-3">
                        {entry.success ? (
                          <span className="text-green-600 text-sm">✓</span>
                        ) : (
                          <span className="text-red-600 text-sm">✗</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-4 py-3 border-t flex items-center justify-between text-sm text-gray-500">
              <span>
                Showing {((filters.page || 1) - 1) * (filters.limit || 50) + 1}–
                {Math.min((filters.page || 1) * (filters.limit || 50), total)} of {total}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={(filters.page || 1) <= 1}
                  onClick={() => handleFilterChange('page', (filters.page || 1) - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  disabled={!entries.length || entries.length < (filters.limit || 50)}
                  onClick={() => handleFilterChange('page', (filters.page || 1) + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Detail Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Audit Entry Detail</h3>
              <button onClick={() => setSelectedEntry(null)} className="text-gray-400 hover:text-gray-600 text-xl">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">ID:</span>
                  <p className="font-mono text-xs">{selectedEntry.id}</p>
                </div>
                <div>
                  <span className="text-gray-500">Timestamp:</span>
                  <p>{new Date(selectedEntry.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-500">Action:</span>
                  <p className="font-medium">{selectedEntry.action}</p>
                </div>
                <div>
                  <span className="text-gray-500">Category:</span>
                  <p>{CATEGORY_ICONS[selectedEntry.category]} {selectedEntry.category}</p>
                </div>
                <div>
                  <span className="text-gray-500">Severity:</span>
                  <p>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${SEVERITY_COLORS[selectedEntry.severity]}`}>
                      {selectedEntry.severity}
                    </span>
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <p>{selectedEntry.success ? '✅ Success' : '❌ Failed'}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <span className="text-gray-500 text-sm">Actor:</span>
                <p className="text-sm">{selectedEntry.actor.name} ({selectedEntry.actor.email})</p>
                <p className="text-xs text-gray-400">Role: {selectedEntry.actor.role} | IP: {selectedEntry.actor.ip || 'N/A'}</p>
              </div>

              {selectedEntry.target && (
                <div className="border-t pt-4">
                  <span className="text-gray-500 text-sm">Target:</span>
                  <p className="text-sm">{selectedEntry.target.type}: {selectedEntry.target.id}</p>
                  {selectedEntry.target.name && <p className="text-xs text-gray-400">{selectedEntry.target.name}</p>}
                </div>
              )}

              {selectedEntry.changes && selectedEntry.changes.length > 0 && (
                <div className="border-t pt-4">
                  <span className="text-gray-500 text-sm">Changes:</span>
                  <div className="mt-2 space-y-1">
                    {selectedEntry.changes.map((change, i) => (
                      <div key={i} className="text-xs font-mono bg-gray-50 p-2 rounded">
                        <span className="text-gray-500">{change.field}:</span>{' '}
                        <span className="text-red-600 line-through">{JSON.stringify(change.oldValue)}</span>{' '}
                        → <span className="text-green-600">{JSON.stringify(change.newValue)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <span className="text-gray-500 text-sm">Description:</span>
                <p className="text-sm">{selectedEntry.description}</p>
              </div>

              {selectedEntry.errorMessage && (
                <div className="border-t pt-4">
                  <span className="text-red-500 text-sm">Error:</span>
                  <p className="text-sm text-red-700 bg-red-50 p-2 rounded">{selectedEntry.errorMessage}</p>
                </div>
              )}

              {selectedEntry.duration !== undefined && (
                <div className="text-xs text-gray-400">Duration: {selectedEntry.duration}ms</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

### File 69-6: `src/app/admin/audit/page.tsx`

```tsx
// ============================================================================
// GRATIS.NGO — Admin Audit Log Page
// ============================================================================

import { Metadata } from 'next';
import AuditLogViewer from '@/components/admin/AuditLogViewer';

export const metadata: Metadata = {
  title: 'Audit Trail | GRATIS Admin',
  description: 'View platform activity audit logs',
};

export default function AuditPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <AuditLogViewer />
    </div>
  );
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
## SECTION 70 — ROLE-BASED ACCESS CONTROL (RBAC) & PERMISSIONS ENGINE
# ═══════════════════════════════════════════════════════════════════════════════

### File 70-1: `src/types/rbac.ts`

```typescript
// ============================================================================
// GRATIS.NGO — RBAC Type Definitions
// ============================================================================

export type Permission =
  // Donations
  | 'donations:read'
  | 'donations:create'
  | 'donations:update'
  | 'donations:delete'
  | 'donations:refund'
  | 'donations:export'
  // Projects
  | 'projects:read'
  | 'projects:create'
  | 'projects:update'
  | 'projects:delete'
  | 'projects:publish'
  // Events
  | 'events:read'
  | 'events:create'
  | 'events:update'
  | 'events:delete'
  | 'events:publish'
  // Users
  | 'users:read'
  | 'users:create'
  | 'users:update'
  | 'users:delete'
  | 'users:role_assign'
  | 'users:impersonate'
  // Partners
  | 'partners:read'
  | 'partners:create'
  | 'partners:update'
  | 'partners:delete'
  | 'partners:approve'
  | 'partners:payout'
  // Content (CMS)
  | 'content:read'
  | 'content:create'
  | 'content:update'
  | 'content:delete'
  | 'content:publish'
  | 'content:moderate'
  // Admin
  | 'admin:dashboard'
  | 'admin:config'
  | 'admin:audit'
  | 'admin:analytics'
  | 'admin:reports'
  | 'admin:webhooks'
  | 'admin:api_keys'
  // System
  | 'system:deploy'
  | 'system:backup'
  | 'system:restore'
  | 'system:maintenance';

export type RoleName =
  | 'superadmin'
  | 'admin'
  | 'editor'
  | 'moderator'
  | 'partner_admin'
  | 'partner_member'
  | 'tribe_member'
  | 'donor'
  | 'volunteer'
  | 'viewer';

export interface RoleDefinition {
  name: RoleName;
  label: string;
  description: string;
  permissions: Permission[];
  inherits?: RoleName[];   // Inherit permissions from other roles
  isSystem: boolean;       // System roles can't be deleted
  priority: number;        // Higher = more privileged (for display ordering)
}

export interface UserRole {
  userId: string;
  role: RoleName;
  assignedBy: string;
  assignedAt: string;
  expiresAt?: string;       // Optional time-limited role
  scope?: {                 // Optional scoped permissions
    type: 'partner' | 'project' | 'event';
    id: string;
  };
}

export interface PermissionCheck {
  userId: string;
  permission: Permission;
  resourceType?: string;
  resourceId?: string;
  granted: boolean;
  reason: string;
}
```

---

### File 70-2: `src/lib/rbac/role-definitions.ts`

```typescript
// ============================================================================
// GRATIS.NGO — Role Definitions & Permission Matrix
// ============================================================================

import { RoleDefinition, RoleName, Permission } from '@/types/rbac';

export const ROLE_DEFINITIONS: Record<RoleName, RoleDefinition> = {
  superadmin: {
    name: 'superadmin',
    label: 'Super Administrator',
    description: 'Full platform access with system-level operations',
    permissions: [
      // ALL permissions
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
    description: 'Full platform management without system operations',
    permissions: [
      'donations:read', 'donations:create', 'donations:update', 'donations:delete', 'donations:refund', 'donations:export',
      'projects:read', 'projects:create', 'projects:update', 'projects:delete', 'projects:publish',
      'events:read', 'events:create', 'events:update', 'events:delete', 'events:publish',
      'users:read', 'users:create', 'users:update', 'users:delete', 'users:role_assign',
      'partners:read', 'partners:create', 'partners:update', 'partners:delete', 'partners:approve', 'partners:payout',
      'content:read', 'content:create', 'content:update', 'content:delete', 'content:publish', 'content:moderate',
      'admin:dashboard', 'admin:config', 'admin:audit', 'admin:analytics', 'admin:reports', 'admin:webhooks', 'admin:api_keys',
    ],
    isSystem: true,
    priority: 90,
  },

  editor: {
    name: 'editor',
    label: 'Content Editor',
    description: 'Manage content, projects, and events',
    permissions: [
      'content:read', 'content:create', 'content:update', 'content:publish',
      'projects:read', 'projects:create', 'projects:update', 'projects:publish',
      'events:read', 'events:create', 'events:update', 'events:publish',
      'donations:read',
      'partners:read',
      'admin:dashboard', 'admin:analytics',
    ],
    isSystem: true,
    priority: 60,
  },

  moderator: {
    name: 'moderator',
    label: 'Content Moderator',
    description: 'Review and moderate user-generated content',
    permissions: [
      'content:read', 'content:moderate',
      'users:read',
      'donations:read',
      'projects:read',
      'events:read',
      'admin:dashboard',
    ],
    isSystem: true,
    priority: 50,
  },

  partner_admin: {
    name: 'partner_admin',
    label: 'Partner Administrator',
    description: 'Manage own partner organization',
    permissions: [
      'projects:read', 'projects:create', 'projects:update',
      'events:read', 'events:create', 'events:update',
      'donations:read',
      'partners:read', 'partners:update',
      'content:read', 'content:create',
    ],
    isSystem: true,
    priority: 40,
  },

  partner_member: {
    name: 'partner_member',
    label: 'Partner Team Member',
    description: 'View and contribute to partner projects',
    permissions: [
      'projects:read',
      'events:read',
      'donations:read',
      'partners:read',
      'content:read',
    ],
    isSystem: true,
    priority: 30,
  },

  tribe_member: {
    name: 'tribe_member',
    label: 'TRIBE Member',
    description: 'Premium membership with enhanced access',
    permissions: [
      'donations:read', 'donations:create',
      'projects:read',
      'events:read',
      'content:read',
    ],
    inherits: ['donor'],
    isSystem: true,
    priority: 25,
  },

  donor: {
    name: 'donor',
    label: 'Donor',
    description: 'Registered donor with donation history',
    permissions: [
      'donations:read', 'donations:create',
      'projects:read',
      'events:read',
      'content:read',
    ],
    isSystem: true,
    priority: 20,
  },

  volunteer: {
    name: 'volunteer',
    label: 'Volunteer',
    description: 'Volunteer with event and project access',
    permissions: [
      'projects:read',
      'events:read',
      'content:read',
    ],
    isSystem: true,
    priority: 15,
  },

  viewer: {
    name: 'viewer',
    label: 'Viewer',
    description: 'Read-only access to public content',
    permissions: [
      'projects:read',
      'events:read',
      'content:read',
    ],
    isSystem: true,
    priority: 10,
  },
};

// ── Helper Functions ─────────────────────────────────────────────────────────

export function getAllPermissions(role: RoleName): Permission[] {
  const def = ROLE_DEFINITIONS[role];
  if (!def) return [];

  const permissions = new Set<Permission>(def.permissions);

  // Resolve inherited roles
  if (def.inherits) {
    for (const parentRole of def.inherits) {
      const parentPerms = getAllPermissions(parentRole);
      parentPerms.forEach((p) => permissions.add(p));
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
```

---

### File 70-3: `src/lib/rbac/permission-service.ts`

```typescript
// ============================================================================
// GRATIS.NGO — Permission Checking Service
// ============================================================================

import { db } from '@/lib/firebase/config';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Permission, RoleName, UserRole, PermissionCheck } from '@/types/rbac';
import { getAllPermissions, ROLE_DEFINITIONS } from './role-definitions';

// In-memory cache for permission checks (per-request)
const permissionCache = new Map<string, { result: boolean; expires: number }>();
const CACHE_TTL = 60_000; // 1 minute

export async function checkPermission(
  userId: string,
  permission: Permission,
  resourceType?: string,
  resourceId?: string
): Promise<PermissionCheck> {
  const cacheKey = `${userId}:${permission}:${resourceType || ''}:${resourceId || ''}`;
  const cached = permissionCache.get(cacheKey);

  if (cached && cached.expires > Date.now()) {
    return {
      userId,
      permission,
      resourceType,
      resourceId,
      granted: cached.result,
      reason: 'cached',
    };
  }

  // Get user's primary role
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (!userDoc.exists()) {
    return deny(userId, permission, 'User not found');
  }

  const userData = userDoc.data();
  const primaryRole = (userData.role || 'viewer') as RoleName;

  // Check primary role permissions
  const rolePermissions = getAllPermissions(primaryRole);
  if (rolePermissions.includes(permission)) {
    cacheResult(cacheKey, true);
    return grant(userId, permission, `Granted by role: ${primaryRole}`);
  }

  // Check scoped roles (e.g., partner_admin for specific partner)
  if (resourceType && resourceId) {
    const scopedRoles = await getScopedRoles(userId, resourceType, resourceId);
    for (const scopedRole of scopedRoles) {
      const scopedPerms = getAllPermissions(scopedRole.role);
      if (scopedPerms.includes(permission)) {
        cacheResult(cacheKey, true);
        return grant(userId, permission, `Granted by scoped role: ${scopedRole.role} on ${resourceType}:${resourceId}`);
      }
    }
  }

  // Check for temporary elevated roles
  const tempRoles = await getTemporaryRoles(userId);
  for (const tempRole of tempRoles) {
    const tempPerms = getAllPermissions(tempRole.role);
    if (tempPerms.includes(permission)) {
      cacheResult(cacheKey, true);
      return grant(userId, permission, `Granted by temporary role: ${tempRole.role}`);
    }
  }

  cacheResult(cacheKey, false);
  return deny(userId, permission, `No matching role with permission: ${permission}`);
}

export async function hasPermission(
  userId: string,
  permission: Permission,
  resourceType?: string,
  resourceId?: string
): Promise<boolean> {
  const check = await checkPermission(userId, permission, resourceType, resourceId);
  return check.granted;
}

export async function hasAnyPermission(
  userId: string,
  permissions: Permission[]
): Promise<boolean> {
  for (const perm of permissions) {
    if (await hasPermission(userId, perm)) return true;
  }
  return false;
}

export async function hasAllPermissions(
  userId: string,
  permissions: Permission[]
): Promise<boolean> {
  for (const perm of permissions) {
    if (!(await hasPermission(userId, perm))) return false;
  }
  return true;
}

export async function getUserPermissions(userId: string): Promise<Permission[]> {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (!userDoc.exists()) return [];

  const primaryRole = (userDoc.data().role || 'viewer') as RoleName;
  const permissions = new Set<Permission>(getAllPermissions(primaryRole));

  // Add scoped role permissions
  const scopedRolesSnap = await getDocs(
    query(collection(db, 'user_roles'), where('userId', '==', userId))
  );
  for (const roleDoc of scopedRolesSnap.docs) {
    const roleData = roleDoc.data() as UserRole;
    if (roleData.expiresAt && new Date(roleData.expiresAt) < new Date()) continue;
    getAllPermissions(roleData.role).forEach((p) => permissions.add(p));
  }

  return Array.from(permissions);
}

// ── Scoped & Temporary Roles ─────────────────────────────────────────────────

async function getScopedRoles(userId: string, resourceType: string, resourceId: string): Promise<UserRole[]> {
  const q = query(
    collection(db, 'user_roles'),
    where('userId', '==', userId),
    where('scope.type', '==', resourceType),
    where('scope.id', '==', resourceId)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => d.data() as UserRole)
    .filter((r) => !r.expiresAt || new Date(r.expiresAt) > new Date());
}

async function getTemporaryRoles(userId: string): Promise<UserRole[]> {
  const q = query(
    collection(db, 'user_roles'),
    where('userId', '==', userId)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => d.data() as UserRole)
    .filter((r) => r.expiresAt && new Date(r.expiresAt) > new Date());
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function grant(userId: string, permission: Permission, reason: string): PermissionCheck {
  return { userId, permission, granted: true, reason };
}

function deny(userId: string, permission: Permission, reason: string): PermissionCheck {
  return { userId, permission, granted: false, reason };
}

function cacheResult(key: string, result: boolean): void {
  permissionCache.set(key, { result, expires: Date.now() + CACHE_TTL });

  // Prevent memory leak
  if (permissionCache.size > 10000) {
    const oldestKey = permissionCache.keys().next().value;
    if (oldestKey) permissionCache.delete(oldestKey);
  }
}

export function clearPermissionCache(userId?: string): void {
  if (userId) {
    for (const [key] of permissionCache) {
      if (key.startsWith(`${userId}:`)) permissionCache.delete(key);
    }
  } else {
    permissionCache.clear();
  }
}
```

---

### File 70-4: `src/middleware/rbac.ts`

```typescript
// ============================================================================
// GRATIS.NGO — RBAC Middleware for API Routes
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/verify';
import { hasPermission, hasAnyPermission } from '@/lib/rbac/permission-service';
import { Permission } from '@/types/rbac';

type RouteHandler = (req: NextRequest, context?: any) => Promise<NextResponse>;

/**
 * Require a single permission to access the route.
 */
export function requirePermission(permission: Permission, handler: RouteHandler): RouteHandler {
  return async (req: NextRequest, context?: any) => {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const granted = await hasPermission(user.uid, permission);
    if (!granted) {
      return NextResponse.json(
        {
          error: 'Insufficient permissions',
          required: permission,
          code: 'GRT-PERM-001',
        },
        { status: 403 }
      );
    }

    return handler(req, context);
  };
}

/**
 * Require ANY of the listed permissions (OR logic).
 */
export function requireAnyPermission(permissions: Permission[], handler: RouteHandler): RouteHandler {
  return async (req: NextRequest, context?: any) => {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const granted = await hasAnyPermission(user.uid, permissions);
    if (!granted) {
      return NextResponse.json(
        {
          error: 'Insufficient permissions',
          requiredAny: permissions,
          code: 'GRT-PERM-002',
        },
        { status: 403 }
      );
    }

    return handler(req, context);
  };
}

/**
 * Require resource ownership OR admin permission.
 */
export function requireOwnerOrPermission(
  permission: Permission,
  getResourceOwnerId: (req: NextRequest) => Promise<string | null>,
  handler: RouteHandler
): RouteHandler {
  return async (req: NextRequest, context?: any) => {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Check ownership
    const ownerId = await getResourceOwnerId(req);
    if (ownerId === user.uid) {
      return handler(req, context);
    }

    // Check permission fallback
    const granted = await hasPermission(user.uid, permission);
    if (!granted) {
      return NextResponse.json(
        { error: 'Access denied: not the owner and insufficient permissions' },
        { status: 403 }
      );
    }

    return handler(req, context);
  };
}
```

---

### File 70-5: `src/app/api/admin/roles/route.ts`

```typescript
// ============================================================================
// GRATIS.NGO — Admin Role Management API
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { doc, setDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { verifyAuth } from '@/lib/auth/verify';
import { hasPermission } from '@/lib/rbac/permission-service';
import { canAssignRole, ROLE_DEFINITIONS, getRoleByPriority } from '@/lib/rbac/role-definitions';
import { clearPermissionCache } from '@/lib/rbac/permission-service';
import { logAuditEvent } from '@/lib/audit/audit-service';
import { RoleName, UserRole } from '@/types/rbac';

// GET — list all roles or user's roles
export async function GET(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('mode');

  if (mode === 'definitions') {
    // Return all role definitions
    const granted = await hasPermission(user.uid, 'admin:dashboard');
    if (!granted) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return NextResponse.json(getRoleByPriority());
  }

  if (mode === 'user') {
    const targetUserId = searchParams.get('userId') || user.uid;
    const granted = await hasPermission(user.uid, 'users:read');
    if (!granted && targetUserId !== user.uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const snap = await getDocs(
      query(collection(db, 'user_roles'), where('userId', '==', targetUserId))
    );
    return NextResponse.json(snap.docs.map((d) => d.data()));
  }

  return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
}

// POST — assign a role to a user
export async function POST(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const granted = await hasPermission(user.uid, 'users:role_assign');
  if (!granted) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { userId, role, expiresAt, scope } = body as {
    userId: string;
    role: RoleName;
    expiresAt?: string;
    scope?: { type: string; id: string };
  };

  if (!userId || !role) {
    return NextResponse.json({ error: 'userId and role are required' }, { status: 400 });
  }

  if (!ROLE_DEFINITIONS[role]) {
    return NextResponse.json({ error: `Invalid role: ${role}` }, { status: 400 });
  }

  // Check that assigner has sufficient privilege
  const userDoc = await import('firebase/firestore').then(
    (m) => m.getDoc(doc(db, 'users', user.uid))
  );
  const assignerRole = (userDoc.data()?.role || 'viewer') as RoleName;
  if (!canAssignRole(assignerRole, role)) {
    return NextResponse.json({ error: 'Cannot assign a role equal to or above your own' }, { status: 403 });
  }

  const roleEntry: UserRole = {
    userId,
    role,
    assignedBy: user.uid,
    assignedAt: new Date().toISOString(),
    expiresAt,
    scope: scope as UserRole['scope'],
  };

  const roleId = `${userId}_${role}_${scope ? `${scope.type}_${scope.id}` : 'global'}`;
  await setDoc(doc(db, 'user_roles', roleId), roleEntry);

  // Clear cache for affected user
  clearPermissionCache(userId);

  // Audit
  await logAuditEvent({
    action: 'role_change',
    category: 'authorization',
    actor: { id: user.uid, email: user.email || '', name: user.name || '', role: assignerRole },
    target: { type: 'user', id: userId },
    description: `Assigned role ${role} to user ${userId}`,
    metadata: { role, scope, expiresAt },
  });

  return NextResponse.json({ success: true, roleId, role: roleEntry });
}

// DELETE — remove a role assignment
export async function DELETE(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const granted = await hasPermission(user.uid, 'users:role_assign');
  if (!granted) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const roleId = searchParams.get('roleId');
  if (!roleId) return NextResponse.json({ error: 'roleId required' }, { status: 400 });

  await deleteDoc(doc(db, 'user_roles', roleId));

  // Extract userId from roleId to clear cache
  const userId = roleId.split('_')[0];
  clearPermissionCache(userId);

  await logAuditEvent({
    action: 'permission_revoke',
    category: 'authorization',
    actor: { id: user.uid, email: user.email || '', name: user.name || '', role: 'admin' },
    target: { type: 'role', id: roleId },
    description: `Removed role assignment ${roleId}`,
  });

  return NextResponse.json({ success: true });
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
## SECTION 71 — MULTI-TENANT / WHITE-LABEL CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════

### File 71-1: `src/types/tenant.ts`

```typescript
// ============================================================================
// GRATIS.NGO — Multi-Tenant Type Definitions
// ============================================================================

export interface TenantConfig {
  id: string;
  slug: string;                 // URL slug: "gratis" → gratis.ngo
  name: string;
  domain?: string;              // Custom domain: "give.unicef.org"
  status: 'active' | 'inactive' | 'trial' | 'suspended';
  createdAt: string;
  updatedAt: string;

  // Branding
  branding: TenantBranding;

  // Feature flags
  features: TenantFeatures;

  // Limits
  limits: TenantLimits;

  // Integrations
  integrations: TenantIntegrations;

  // Contact & Legal
  organization: TenantOrganization;
}

export interface TenantBranding {
  logo: string;                 // URL to logo
  logoLight?: string;           // Logo for dark backgrounds
  favicon?: string;
  primaryColor: string;         // Hex color
  secondaryColor: string;
  accentColor: string;
  fontFamily?: string;
  customCSS?: string;           // Injected custom CSS
  heroImage?: string;
  emailHeader?: string;
  emailFooter?: string;
}

export interface TenantFeatures {
  donations: boolean;
  subscriptions: boolean;
  events: boolean;
  videoStreaming: boolean;
  bottleSystem: boolean;
  tribe: boolean;
  gamification: boolean;
  referrals: boolean;
  i18n: boolean;
  pwa: boolean;
  messaging: boolean;
  volunteers: boolean;
  multilingual: boolean;
  customDomain: boolean;
  apiAccess: boolean;
  whiteLabel: boolean;          // Remove GRATIS branding
}

export interface TenantLimits {
  maxProjects: number;
  maxEvents: number;
  maxPartners: number;
  maxAdmins: number;
  maxStorageGB: number;
  maxMonthlyEmails: number;
  maxDonationAmountCents: number;
}

export interface TenantIntegrations {
  stripe: {
    enabled: boolean;
    accountId?: string;          // Stripe Connect account
    publishableKey?: string;
  };
  sendgrid: {
    enabled: boolean;
    apiKey?: string;
    fromEmail?: string;
    fromName?: string;
  };
  analytics: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
    plausibleDomain?: string;
  };
}

export interface TenantOrganization {
  legalName: string;
  registrationNumber?: string;
  taxExemptStatus?: string;      // "501c3", "ANBI", etc.
  country: string;
  address: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  privacyPolicyUrl?: string;
  termsUrl?: string;
}

export interface TenantContext {
  tenant: TenantConfig;
  isDefault: boolean;            // true for main GRATIS.NGO tenant
}
```

---

### File 71-2: `src/lib/tenant/tenant-service.ts`

```typescript
// ============================================================================
// GRATIS.NGO — Multi-Tenant Resolution & Management
// ============================================================================

import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { TenantConfig, TenantContext, TenantBranding, TenantFeatures, TenantLimits } from '@/types/tenant';

const TENANT_COLLECTION = 'tenants';
const DEFAULT_TENANT_ID = 'gratis-ngo';

// In-memory cache per process
const tenantCache = new Map<string, { config: TenantConfig; expires: number }>();
const TENANT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// ── Default Branding ─────────────────────────────────────────────────────────

const DEFAULT_BRANDING: TenantBranding = {
  logo: '/images/gratis-logo.svg',
  logoLight: '/images/gratis-logo-white.svg',
  favicon: '/favicon.ico',
  primaryColor: '#002E5F',
  secondaryColor: '#C9A84C',
  accentColor: '#E8D5A3',
  fontFamily: 'Inter, sans-serif',
};

const DEFAULT_FEATURES: TenantFeatures = {
  donations: true,
  subscriptions: true,
  events: true,
  videoStreaming: true,
  bottleSystem: true,
  tribe: true,
  gamification: true,
  referrals: true,
  i18n: true,
  pwa: true,
  messaging: true,
  volunteers: true,
  multilingual: true,
  customDomain: false,
  apiAccess: true,
  whiteLabel: false,
};

const DEFAULT_LIMITS: TenantLimits = {
  maxProjects: 1000,
  maxEvents: 500,
  maxPartners: 200,
  maxAdmins: 50,
  maxStorageGB: 100,
  maxMonthlyEmails: 50000,
  maxDonationAmountCents: 10000000, // €100,000
};

// ── Tenant Resolution ────────────────────────────────────────────────────────

export async function resolveTenant(hostname: string): Promise<TenantContext> {
  // Check cache first
  const cached = tenantCache.get(hostname);
  if (cached && cached.expires > Date.now()) {
    return {
      tenant: cached.config,
      isDefault: cached.config.id === DEFAULT_TENANT_ID,
    };
  }

  // Try to find by custom domain
  let tenant = await findTenantByDomain(hostname);

  // Try slug-based resolution (e.g., "myorg.gratis.ngo")
  if (!tenant) {
    const slug = hostname.split('.')[0];
    tenant = await findTenantBySlug(slug);
  }

  // Fall back to default
  if (!tenant) {
    tenant = await getDefaultTenant();
  }

  // Cache the result
  tenantCache.set(hostname, { config: tenant, expires: Date.now() + TENANT_CACHE_TTL });

  return {
    tenant,
    isDefault: tenant.id === DEFAULT_TENANT_ID,
  };
}

export async function getTenantById(id: string): Promise<TenantConfig | null> {
  const ref = doc(db, TENANT_COLLECTION, id);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as TenantConfig) : null;
}

async function findTenantByDomain(domain: string): Promise<TenantConfig | null> {
  const q = query(
    collection(db, TENANT_COLLECTION),
    where('domain', '==', domain),
    where('status', '==', 'active')
  );
  const snap = await getDocs(q);
  return snap.empty ? null : (snap.docs[0].data() as TenantConfig);
}

async function findTenantBySlug(slug: string): Promise<TenantConfig | null> {
  const q = query(
    collection(db, TENANT_COLLECTION),
    where('slug', '==', slug),
    where('status', '==', 'active')
  );
  const snap = await getDocs(q);
  return snap.empty ? null : (snap.docs[0].data() as TenantConfig);
}

async function getDefaultTenant(): Promise<TenantConfig> {
  const ref = doc(db, TENANT_COLLECTION, DEFAULT_TENANT_ID);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data() as TenantConfig;

  // Bootstrap default tenant if not exists
  const defaultTenant: TenantConfig = {
    id: DEFAULT_TENANT_ID,
    slug: 'gratis',
    name: 'GRATIS Foundation',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    branding: DEFAULT_BRANDING,
    features: DEFAULT_FEATURES,
    limits: DEFAULT_LIMITS,
    integrations: {
      stripe: { enabled: true },
      sendgrid: { enabled: true },
      analytics: {},
    },
    organization: {
      legalName: 'Stichting GRATIS',
      country: 'NL',
      address: 'Amsterdam, Netherlands',
      contactEmail: 'info@gratis.ngo',
    },
  };

  await setDoc(ref, defaultTenant);
  return defaultTenant;
}

// ── Tenant Management ────────────────────────────────────────────────────────

export async function createTenant(config: Omit<TenantConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<TenantConfig> {
  const id = `tenant_${config.slug}_${Date.now()}`;
  const tenant: TenantConfig = {
    ...config,
    id,
    branding: { ...DEFAULT_BRANDING, ...config.branding },
    features: { ...DEFAULT_FEATURES, ...config.features },
    limits: { ...DEFAULT_LIMITS, ...config.limits },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(doc(db, TENANT_COLLECTION, id), tenant);
  return tenant;
}

export async function updateTenant(id: string, updates: Partial<TenantConfig>): Promise<void> {
  await updateDoc(doc(db, TENANT_COLLECTION, id), {
    ...updates,
    updatedAt: new Date().toISOString(),
  });

  // Invalidate cache entries for this tenant
  for (const [key, val] of tenantCache) {
    if (val.config.id === id) tenantCache.delete(key);
  }
}

export async function listTenants(): Promise<TenantConfig[]> {
  const snap = await getDocs(collection(db, TENANT_COLLECTION));
  return snap.docs.map((d) => d.data() as TenantConfig);
}

// ── Feature Check ────────────────────────────────────────────────────────────

export function hasFeature(tenant: TenantConfig, feature: keyof TenantFeatures): boolean {
  return tenant.features[feature] === true;
}

export function isWithinLimit(tenant: TenantConfig, metric: keyof TenantLimits, current: number): boolean {
  return current < tenant.limits[metric];
}
```

---

### File 71-3: `src/lib/tenant/tenant-context.tsx`

```tsx
// ============================================================================
// GRATIS.NGO — Tenant Context Provider
// ============================================================================

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { TenantConfig, TenantContext as TenantContextType } from '@/types/tenant';

interface TenantProviderProps {
  children: React.ReactNode;
  initialTenant?: TenantConfig;
}

const TenantCtx = createContext<TenantContextType | null>(null);

export function TenantProvider({ children, initialTenant }: TenantProviderProps) {
  const [context, setContext] = useState<TenantContextType | null>(
    initialTenant
      ? { tenant: initialTenant, isDefault: initialTenant.id === 'gratis-ngo' }
      : null
  );

  useEffect(() => {
    if (!context) {
      // Resolve tenant from current hostname
      fetch('/api/tenant/resolve')
        .then((res) => res.json())
        .then((data: TenantContextType) => setContext(data))
        .catch(() => {
          // Fallback: use default
          console.warn('Failed to resolve tenant, using defaults');
        });
    }
  }, [context]);

  // Inject CSS custom properties from tenant branding
  useEffect(() => {
    if (!context?.tenant?.branding) return;
    const { primaryColor, secondaryColor, accentColor, fontFamily, customCSS } = context.tenant.branding;

    document.documentElement.style.setProperty('--color-primary', primaryColor);
    document.documentElement.style.setProperty('--color-secondary', secondaryColor);
    document.documentElement.style.setProperty('--color-accent', accentColor);
    if (fontFamily) document.documentElement.style.setProperty('--font-family', fontFamily);

    // Inject custom CSS
    if (customCSS) {
      const style = document.createElement('style');
      style.id = 'tenant-custom-css';
      style.textContent = customCSS;
      document.head.appendChild(style);
      return () => { style.remove(); };
    }
  }, [context]);

  return <TenantCtx.Provider value={context}>{children}</TenantCtx.Provider>;
}

export function useTenant(): TenantContextType {
  const ctx = useContext(TenantCtx);
  if (!ctx) throw new Error('useTenant must be used within TenantProvider');
  return ctx;
}

export function useTenantFeature(feature: keyof TenantConfig['features']): boolean {
  const { tenant } = useTenant();
  return tenant.features[feature] === true;
}
```

---

### File 71-4: `src/app/api/tenant/resolve/route.ts`

```typescript
// ============================================================================
// GRATIS.NGO — Tenant Resolution API
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { resolveTenant } from '@/lib/tenant/tenant-service';

export async function GET(req: NextRequest) {
  const hostname = req.headers.get('host') || 'gratis.ngo';
  const context = await resolveTenant(hostname);

  // Don't expose sensitive integration keys to client
  const safeConfig = {
    ...context.tenant,
    integrations: {
      stripe: { enabled: context.tenant.integrations.stripe.enabled },
      sendgrid: { enabled: context.tenant.integrations.sendgrid.enabled },
      analytics: context.tenant.integrations.analytics,
    },
  };

  return NextResponse.json({ ...context, tenant: safeConfig });
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
## SECTION 72 — GRAPHQL API LAYER
# ═══════════════════════════════════════════════════════════════════════════════

### File 72-1: `src/lib/graphql/schema.ts`

```typescript
// ============================================================================
// GRATIS.NGO — GraphQL Schema Definitions
// ============================================================================

export const typeDefs = `#graphql
  scalar DateTime
  scalar JSON

  type Query {
    # Users
    me: User
    user(id: ID!): User

    # Projects
    projects(filter: ProjectFilter, limit: Int, offset: Int): ProjectConnection!
    project(id: ID!): Project

    # Events
    events(filter: EventFilter, limit: Int, offset: Int): EventConnection!
    event(id: ID!): Event

    # Donations
    myDonations(limit: Int, offset: Int): DonationConnection!
    donation(id: ID!): Donation

    # Partners
    partners(filter: PartnerFilter, limit: Int, offset: Int): PartnerConnection!
    partner(id: ID!): Partner

    # Impact
    platformStats: PlatformStats!
  }

  type Mutation {
    # Donations
    createDonation(input: CreateDonationInput!): DonationResult!

    # Events
    rsvpEvent(eventId: ID!): RSVPResult!
    cancelRSVP(eventId: ID!): RSVPResult!

    # User
    updateProfile(input: UpdateProfileInput!): User!
    updatePreferences(input: UpdatePreferencesInput!): User!

    # TRIBE
    joinTribe(tier: TribeTier!): TribeResult!
    cancelTribe: TribeResult!
  }

  # ── Types ──────────────────────────────────────────────────────────────────

  type User {
    id: ID!
    email: String!
    displayName: String
    photoURL: String
    role: String!
    tribeStatus: TribeStatus
    totalDonated: Float!
    donationCount: Int!
    joinedAt: DateTime!
    badges: [Badge!]!
    level: Int!
  }

  type Project {
    id: ID!
    title: String!
    description: String!
    category: String!
    partner: Partner!
    goalAmountCents: Int!
    raisedAmountCents: Int!
    currency: String!
    status: ProjectStatus!
    imageUrl: String
    location: String
    startDate: DateTime
    endDate: DateTime
    donorCount: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type ProjectConnection {
    items: [Project!]!
    total: Int!
    hasMore: Boolean!
  }

  type Event {
    id: ID!
    title: String!
    description: String!
    type: EventType!
    startDate: DateTime!
    endDate: DateTime!
    location: String
    isVirtual: Boolean!
    virtualLink: String
    imageUrl: String
    capacity: Int
    attendeeCount: Int!
    isFull: Boolean!
    project: Project
    createdAt: DateTime!
  }

  type EventConnection {
    items: [Event!]!
    total: Int!
    hasMore: Boolean!
  }

  type Donation {
    id: ID!
    amountCents: Int!
    currency: String!
    status: DonationStatus!
    project: Project
    isRecurring: Boolean!
    receiptUrl: String
    createdAt: DateTime!
  }

  type DonationConnection {
    items: [Donation!]!
    total: Int!
    hasMore: Boolean!
  }

  type Partner {
    id: ID!
    name: String!
    slug: String!
    description: String!
    logoUrl: String
    website: String
    country: String!
    category: String!
    verified: Boolean!
    projectCount: Int!
    totalRaised: Float!
    createdAt: DateTime!
  }

  type PartnerConnection {
    items: [Partner!]!
    total: Int!
    hasMore: Boolean!
  }

  type Badge {
    id: ID!
    name: String!
    icon: String!
    earnedAt: DateTime!
  }

  type TribeStatus {
    tier: TribeTier!
    active: Boolean!
    startDate: DateTime!
    nextBillingDate: DateTime
  }

  type PlatformStats {
    totalDonated: Float!
    totalDonors: Int!
    totalProjects: Int!
    totalPartners: Int!
    totalEvents: Int!
    bottlesRedirected: Int!
  }

  # ── Inputs ─────────────────────────────────────────────────────────────────

  input CreateDonationInput {
    amountCents: Int!
    currency: String
    projectId: ID
    isRecurring: Boolean
    paymentMethodId: String!
    message: String
  }

  input UpdateProfileInput {
    displayName: String
    photoURL: String
    bio: String
    location: String
  }

  input UpdatePreferencesInput {
    emailNotifications: Boolean
    language: String
    currency: String
  }

  input ProjectFilter {
    category: String
    status: ProjectStatus
    partnerId: ID
    search: String
  }

  input EventFilter {
    type: EventType
    upcoming: Boolean
    partnerId: ID
    search: String
  }

  input PartnerFilter {
    category: String
    country: String
    verified: Boolean
    search: String
  }

  # ── Enums ──────────────────────────────────────────────────────────────────

  enum ProjectStatus { active, funded, completed, paused }
  enum EventType { fundraiser, volunteer, webinar, community, gala }
  enum DonationStatus { pending, completed, failed, refunded }
  enum TribeTier { supporter, champion, guardian, visionary }

  # ── Results ────────────────────────────────────────────────────────────────

  type DonationResult {
    success: Boolean!
    donation: Donation
    clientSecret: String
    error: String
  }

  type RSVPResult {
    success: Boolean!
    message: String!
  }

  type TribeResult {
    success: Boolean!
    message: String!
    subscriptionId: String
  }
`;
```

---

### File 72-2: `src/lib/graphql/resolvers.ts`

```typescript
// ============================================================================
// GRATIS.NGO — GraphQL Resolvers
// ============================================================================

import { db } from '@/lib/firebase/config';
import {
  doc, getDoc, collection, query, where, orderBy, limit as firestoreLimit,
  getDocs, getCountFromServer, startAfter, updateDoc,
} from 'firebase/firestore';

interface GQLContext {
  userId?: string;
  userRole?: string;
}

export const resolvers = {
  Query: {
    me: async (_: unknown, __: unknown, ctx: GQLContext) => {
      if (!ctx.userId) return null;
      const snap = await getDoc(doc(db, 'users', ctx.userId));
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    },

    user: async (_: unknown, { id }: { id: string }, ctx: GQLContext) => {
      const snap = await getDoc(doc(db, 'users', id));
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    },

    projects: async (_: unknown, args: { filter?: any; limit?: number; offset?: number }) => {
      const pageLimit = Math.min(args.limit || 20, 100);
      let q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'), firestoreLimit(pageLimit + 1));

      if (args.filter?.category) {
        q = query(q, where('category', '==', args.filter.category));
      }
      if (args.filter?.status) {
        q = query(q, where('status', '==', args.filter.status));
      }
      if (args.filter?.partnerId) {
        q = query(q, where('partnerId', '==', args.filter.partnerId));
      }

      const snap = await getDocs(q);
      const items = snap.docs.slice(0, pageLimit).map((d) => ({ id: d.id, ...d.data() }));
      const countSnap = await getCountFromServer(collection(db, 'projects'));

      return {
        items,
        total: countSnap.data().count,
        hasMore: snap.docs.length > pageLimit,
      };
    },

    project: async (_: unknown, { id }: { id: string }) => {
      const snap = await getDoc(doc(db, 'projects', id));
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    },

    events: async (_: unknown, args: { filter?: any; limit?: number; offset?: number }) => {
      const pageLimit = Math.min(args.limit || 20, 100);
      let q = query(collection(db, 'events'), orderBy('startDate', 'asc'), firestoreLimit(pageLimit + 1));

      if (args.filter?.type) {
        q = query(q, where('type', '==', args.filter.type));
      }
      if (args.filter?.upcoming) {
        q = query(q, where('startDate', '>=', new Date().toISOString()));
      }

      const snap = await getDocs(q);
      const items = snap.docs.slice(0, pageLimit).map((d) => ({ id: d.id, ...d.data() }));
      const countSnap = await getCountFromServer(collection(db, 'events'));

      return {
        items,
        total: countSnap.data().count,
        hasMore: snap.docs.length > pageLimit,
      };
    },

    event: async (_: unknown, { id }: { id: string }) => {
      const snap = await getDoc(doc(db, 'events', id));
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    },

    myDonations: async (_: unknown, args: { limit?: number; offset?: number }, ctx: GQLContext) => {
      if (!ctx.userId) throw new Error('Authentication required');
      const pageLimit = Math.min(args.limit || 20, 100);
      const q = query(
        collection(db, 'donations'),
        where('userId', '==', ctx.userId),
        orderBy('createdAt', 'desc'),
        firestoreLimit(pageLimit)
      );
      const snap = await getDocs(q);
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      return { items, total: items.length, hasMore: false };
    },

    donation: async (_: unknown, { id }: { id: string }, ctx: GQLContext) => {
      const snap = await getDoc(doc(db, 'donations', id));
      if (!snap.exists()) return null;
      const data = snap.data();
      // Only owner or admin can view
      if (data.userId !== ctx.userId && ctx.userRole !== 'admin' && ctx.userRole !== 'superadmin') {
        throw new Error('Access denied');
      }
      return { id: snap.id, ...data };
    },

    partners: async (_: unknown, args: { filter?: any; limit?: number; offset?: number }) => {
      const pageLimit = Math.min(args.limit || 20, 100);
      let q = query(collection(db, 'partners'), where('status', '==', 'approved'), firestoreLimit(pageLimit + 1));

      if (args.filter?.category) q = query(q, where('category', '==', args.filter.category));
      if (args.filter?.country) q = query(q, where('country', '==', args.filter.country));

      const snap = await getDocs(q);
      const items = snap.docs.slice(0, pageLimit).map((d) => ({ id: d.id, ...d.data() }));
      const countSnap = await getCountFromServer(collection(db, 'partners'));

      return { items, total: countSnap.data().count, hasMore: snap.docs.length > pageLimit };
    },

    partner: async (_: unknown, { id }: { id: string }) => {
      const snap = await getDoc(doc(db, 'partners', id));
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    },

    platformStats: async () => {
      const [donations, projects, partners, events] = await Promise.all([
        getCountFromServer(collection(db, 'donations')),
        getCountFromServer(collection(db, 'projects')),
        getCountFromServer(collection(db, 'partners')),
        getCountFromServer(collection(db, 'events')),
      ]);

      // Get aggregate donation amount from stats doc
      const statsDoc = await getDoc(doc(db, 'platform_stats', 'global'));
      const statsData = statsDoc.data() || {};

      return {
        totalDonated: (statsData.totalDonatedCents || 0) / 100,
        totalDonors: statsData.totalDonors || 0,
        totalProjects: projects.data().count,
        totalPartners: partners.data().count,
        totalEvents: events.data().count,
        bottlesRedirected: statsData.bottlesRedirected || 0,
      };
    },
  },

  // Field resolvers for nested objects
  Project: {
    partner: async (parent: any) => {
      if (!parent.partnerId) return null;
      const snap = await getDoc(doc(db, 'partners', parent.partnerId));
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    },
  },

  Event: {
    project: async (parent: any) => {
      if (!parent.projectId) return null;
      const snap = await getDoc(doc(db, 'projects', parent.projectId));
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    },
    isFull: (parent: any) => {
      return parent.capacity ? parent.attendeeCount >= parent.capacity : false;
    },
  },

  Donation: {
    project: async (parent: any) => {
      if (!parent.projectId) return null;
      const snap = await getDoc(doc(db, 'projects', parent.projectId));
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    },
  },
};
```

---

### File 72-3: `src/app/api/graphql/route.ts`

```typescript
// ============================================================================
// GRATIS.NGO — GraphQL API Endpoint
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createSchema, createYoga } from 'graphql-yoga';
import { typeDefs } from '@/lib/graphql/schema';
import { resolvers } from '@/lib/graphql/resolvers';
import { verifyAuth } from '@/lib/auth/verify';

const schema = createSchema({ typeDefs, resolvers });

const yoga = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response },
  context: async ({ request }) => {
    // Extract auth context from request
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return { userId: undefined, userRole: undefined };
    }

    try {
      const user = await verifyAuth(request as unknown as NextRequest);
      return {
        userId: user?.uid,
        userRole: user?.role || 'viewer',
      };
    } catch {
      return { userId: undefined, userRole: undefined };
    }
  },
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || '*',
    methods: ['POST', 'OPTIONS'],
    credentials: true,
  },
});

export async function POST(req: NextRequest) {
  return yoga.handleRequest(req, {}) as unknown as NextResponse;
}

export async function OPTIONS(req: NextRequest) {
  return yoga.handleRequest(req, {}) as unknown as NextResponse;
}
```

---

### File 72-4: `src/hooks/useGraphQL.ts`

```typescript
// ============================================================================
// GRATIS.NGO — GraphQL Client Hook
// ============================================================================

'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface GraphQLResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useGraphQL<T = any>(
  queryStr: string,
  variables?: Record<string, unknown>
): GraphQLResult<T> {
  const { user } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (user) {
        const token = await user.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/graphql', {
        method: 'POST',
        headers,
        body: JSON.stringify({ query: queryStr, variables }),
      });

      const json = await res.json();

      if (json.errors) {
        setError(json.errors[0]?.message || 'GraphQL error');
      } else {
        setData(json.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  }, [queryStr, variables, user]);

  return { data, loading, error, refetch: execute };
}

export function useGraphQLMutation<T = any>() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (mutation: string, variables?: Record<string, unknown>): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        if (user) {
          const token = await user.getIdToken();
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch('/api/graphql', {
          method: 'POST',
          headers,
          body: JSON.stringify({ query: mutation, variables }),
        });

        const json = await res.json();

        if (json.errors) {
          setError(json.errors[0]?.message || 'Mutation error');
          return null;
        }

        return json.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Network error');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  return { mutate, loading, error };
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
## SECTION 73 — OUTBOUND WEBHOOK DELIVERY & RETRY SYSTEM
# ═══════════════════════════════════════════════════════════════════════════════

### File 73-1: `src/types/webhook-delivery.ts`

```typescript
// ============================================================================
// GRATIS.NGO — Outbound Webhook Delivery Types
// ============================================================================

export type WebhookEventType =
  | 'donation.created'
  | 'donation.completed'
  | 'donation.refunded'
  | 'subscription.created'
  | 'subscription.cancelled'
  | 'subscription.renewed'
  | 'project.created'
  | 'project.funded'
  | 'project.completed'
  | 'event.created'
  | 'event.updated'
  | 'event.cancelled'
  | 'partner.approved'
  | 'partner.suspended'
  | 'user.registered'
  | 'user.deleted'
  | 'tribe.joined'
  | 'tribe.cancelled'
  | 'bottle.claimed';

export interface WebhookSubscription {
  id: string;
  partnerId: string;         // Partner who registered the webhook
  url: string;               // Target URL
  events: WebhookEventType[];
  secret: string;            // HMAC signing secret
  status: 'active' | 'paused' | 'disabled' | 'failed';
  failureCount: number;
  lastDeliveredAt?: string;
  lastFailedAt?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, string>;
}

export interface WebhookDelivery {
  id: string;
  subscriptionId: string;
  eventType: WebhookEventType;
  payload: Record<string, unknown>;
  status: 'pending' | 'delivered' | 'failed' | 'retrying';
  attempts: WebhookAttempt[];
  maxRetries: number;
  nextRetryAt?: string;
  createdAt: string;
  completedAt?: string;
}

export interface WebhookAttempt {
  attemptNumber: number;
  timestamp: string;
  statusCode?: number;
  responseBody?: string;
  duration: number;          // ms
  error?: string;
  success: boolean;
}

export interface WebhookPayload {
  id: string;
  type: WebhookEventType;
  created: string;
  data: Record<string, unknown>;
  metadata: {
    source: 'gratis.ngo';
    version: 'v1';
    environment: string;
  };
}

export const RETRY_SCHEDULE = [
  60,        // 1 minute
  300,       // 5 minutes
  1800,      // 30 minutes
  7200,      // 2 hours
  21600,     // 6 hours
  86400,     // 24 hours
]; // Max 6 retries over ~31 hours
```

---

### File 73-2: `src/lib/webhooks/delivery-service.ts`

```typescript
// ============================================================================
// GRATIS.NGO — Webhook Delivery Engine
// ============================================================================

import { db } from '@/lib/firebase/config';
import {
  doc, setDoc, updateDoc, getDoc, collection, query, where, orderBy,
  getDocs, limit as firestoreLimit, Timestamp, writeBatch,
} from 'firebase/firestore';
import crypto from 'crypto';
import {
  WebhookSubscription,
  WebhookDelivery,
  WebhookAttempt,
  WebhookEventType,
  WebhookPayload,
  RETRY_SCHEDULE,
} from '@/types/webhook-delivery';

const SUBSCRIPTIONS_COL = 'webhook_subscriptions';
const DELIVERIES_COL = 'webhook_deliveries';
const MAX_DISABLE_FAILURES = 10;

// ── Dispatch an Event ────────────────────────────────────────────────────────

export async function dispatchWebhookEvent(
  eventType: WebhookEventType,
  data: Record<string, unknown>
): Promise<string[]> {
  // Find all active subscriptions for this event type
  const q = query(
    collection(db, SUBSCRIPTIONS_COL),
    where('status', '==', 'active'),
    where('events', 'array-contains', eventType)
  );
  const snap = await getDocs(q);

  if (snap.empty) return [];

  const deliveryIds: string[] = [];

  for (const subDoc of snap.docs) {
    const subscription = subDoc.data() as WebhookSubscription;
    const deliveryId = await createDelivery(subscription, eventType, data);
    deliveryIds.push(deliveryId);

    // Attempt immediate delivery
    deliverWebhook(deliveryId).catch((err) => {
      console.error(`[WEBHOOK] Immediate delivery failed for ${deliveryId}:`, err);
    });
  }

  return deliveryIds;
}

// ── Create Delivery Record ───────────────────────────────────────────────────

async function createDelivery(
  subscription: WebhookSubscription,
  eventType: WebhookEventType,
  data: Record<string, unknown>
): Promise<string> {
  const id = `whd_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const payload: WebhookPayload = {
    id,
    type: eventType,
    created: new Date().toISOString(),
    data,
    metadata: {
      source: 'gratis.ngo',
      version: 'v1',
      environment: process.env.NODE_ENV || 'development',
    },
  };

  const delivery: WebhookDelivery = {
    id,
    subscriptionId: subscription.id,
    eventType,
    payload,
    status: 'pending',
    attempts: [],
    maxRetries: RETRY_SCHEDULE.length,
    createdAt: new Date().toISOString(),
  };

  await setDoc(doc(db, DELIVERIES_COL, id), delivery);
  return id;
}

// ── Deliver a Single Webhook ─────────────────────────────────────────────────

export async function deliverWebhook(deliveryId: string): Promise<boolean> {
  const deliveryRef = doc(db, DELIVERIES_COL, deliveryId);
  const deliverySnap = await getDoc(deliveryRef);
  if (!deliverySnap.exists()) throw new Error(`Delivery ${deliveryId} not found`);

  const delivery = deliverySnap.data() as WebhookDelivery;
  if (delivery.status === 'delivered') return true;

  // Get subscription
  const subSnap = await getDoc(doc(db, SUBSCRIPTIONS_COL, delivery.subscriptionId));
  if (!subSnap.exists()) {
    await updateDoc(deliveryRef, { status: 'failed' });
    return false;
  }

  const subscription = subSnap.data() as WebhookSubscription;
  const attemptNumber = delivery.attempts.length + 1;
  const startTime = Date.now();

  try {
    // Sign the payload
    const payloadStr = JSON.stringify(delivery.payload);
    const signature = signPayload(payloadStr, subscription.secret);

    // Deliver
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const response = await fetch(subscription.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Id': delivery.id,
        'X-Webhook-Timestamp': new Date().toISOString(),
        'User-Agent': 'GRATIS-Webhook/1.0',
      },
      body: payloadStr,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const responseBody = await response.text().catch(() => '');
    const duration = Date.now() - startTime;
    const success = response.status >= 200 && response.status < 300;

    const attempt: WebhookAttempt = {
      attemptNumber,
      timestamp: new Date().toISOString(),
      statusCode: response.status,
      responseBody: responseBody.slice(0, 500),
      duration,
      success,
    };

    if (success) {
      await updateDoc(deliveryRef, {
        status: 'delivered',
        attempts: [...delivery.attempts, attempt],
        completedAt: new Date().toISOString(),
      });

      // Update subscription success stats
      await updateDoc(doc(db, SUBSCRIPTIONS_COL, subscription.id), {
        lastDeliveredAt: new Date().toISOString(),
        failureCount: 0,
      });

      return true;
    } else {
      return await handleFailure(delivery, attempt, subscription);
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    const attempt: WebhookAttempt = {
      attemptNumber,
      timestamp: new Date().toISOString(),
      duration,
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false,
    };

    return await handleFailure(delivery, attempt, subscription);
  }
}

// ── Failure Handling & Retry Scheduling ──────────────────────────────────────

async function handleFailure(
  delivery: WebhookDelivery,
  attempt: WebhookAttempt,
  subscription: WebhookSubscription
): Promise<false> {
  const updatedAttempts = [...delivery.attempts, attempt];
  const attemptIndex = updatedAttempts.length - 1;

  const deliveryRef = doc(db, DELIVERIES_COL, delivery.id);
  const subRef = doc(db, SUBSCRIPTIONS_COL, subscription.id);

  if (attemptIndex < RETRY_SCHEDULE.length) {
    // Schedule retry
    const retryDelay = RETRY_SCHEDULE[attemptIndex];
    const nextRetry = new Date(Date.now() + retryDelay * 1000);

    await updateDoc(deliveryRef, {
      status: 'retrying',
      attempts: updatedAttempts,
      nextRetryAt: nextRetry.toISOString(),
    });
  } else {
    // Max retries exhausted
    await updateDoc(deliveryRef, {
      status: 'failed',
      attempts: updatedAttempts,
    });
  }

  // Update subscription failure count
  const newFailureCount = (subscription.failureCount || 0) + 1;
  const updates: Record<string, unknown> = {
    failureCount: newFailureCount,
    lastFailedAt: new Date().toISOString(),
  };

  // Auto-disable after too many consecutive failures
  if (newFailureCount >= MAX_DISABLE_FAILURES) {
    updates.status = 'disabled';
    console.warn(`[WEBHOOK] Subscription ${subscription.id} auto-disabled after ${newFailureCount} failures`);
  }

  await updateDoc(subRef, updates);
  return false;
}

// ── Retry Processor (run via cron) ───────────────────────────────────────────

export async function processRetries(): Promise<{ processed: number; succeeded: number; failed: number }> {
  const now = new Date().toISOString();
  const q = query(
    collection(db, DELIVERIES_COL),
    where('status', '==', 'retrying'),
    where('nextRetryAt', '<=', now),
    firestoreLimit(50)
  );

  const snap = await getDocs(q);
  let succeeded = 0;
  let failed = 0;

  for (const d of snap.docs) {
    const success = await deliverWebhook(d.id);
    if (success) succeeded++;
    else failed++;
  }

  return { processed: snap.docs.length, succeeded, failed };
}

// ── Signing ──────────────────────────────────────────────────────────────────

function signPayload(payload: string, secret: string): string {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  return `sha256=${hmac.digest('hex')}`;
}

// ── Subscription Management ──────────────────────────────────────────────────

export async function createWebhookSubscription(
  partnerId: string,
  url: string,
  events: WebhookEventType[]
): Promise<WebhookSubscription> {
  const id = `whs_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const secret = crypto.randomBytes(32).toString('hex');

  const subscription: WebhookSubscription = {
    id,
    partnerId,
    url,
    events,
    secret,
    status: 'active',
    failureCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(doc(db, SUBSCRIPTIONS_COL, id), subscription);
  return subscription;
}

export async function getDeliveryHistory(
  subscriptionId: string,
  pageLimit: number = 20
): Promise<WebhookDelivery[]> {
  const q = query(
    collection(db, DELIVERIES_COL),
    where('subscriptionId', '==', subscriptionId),
    orderBy('createdAt', 'desc'),
    firestoreLimit(pageLimit)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as WebhookDelivery);
}
```

---

### File 73-3: `src/app/api/webhooks/subscriptions/route.ts`

```typescript
// ============================================================================
// GRATIS.NGO — Webhook Subscription Management API
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/verify';
import { hasPermission } from '@/lib/rbac/permission-service';
import {
  createWebhookSubscription,
  getDeliveryHistory,
} from '@/lib/webhooks/delivery-service';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { WebhookSubscription, WebhookEventType } from '@/types/webhook-delivery';

// GET — list partner's webhook subscriptions
export async function GET(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const partnerId = searchParams.get('partnerId');
  if (!partnerId) return NextResponse.json({ error: 'partnerId required' }, { status: 400 });

  const q = query(
    collection(db, 'webhook_subscriptions'),
    where('partnerId', '==', partnerId)
  );
  const snap = await getDocs(q);
  const subscriptions = snap.docs.map((d) => {
    const data = d.data() as WebhookSubscription;
    return { ...data, secret: `${data.secret.slice(0, 8)}...` }; // Mask secret
  });

  return NextResponse.json(subscriptions);
}

// POST — create new webhook subscription
export async function POST(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const granted = await hasPermission(user.uid, 'admin:webhooks');
  if (!granted) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { partnerId, url, events } = body as {
    partnerId: string;
    url: string;
    events: WebhookEventType[];
  };

  if (!partnerId || !url || !events?.length) {
    return NextResponse.json({ error: 'partnerId, url, and events are required' }, { status: 400 });
  }

  // Validate URL
  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  const subscription = await createWebhookSubscription(partnerId, url, events);

  // Return full secret only on creation
  return NextResponse.json(subscription, { status: 201 });
}

// PATCH — update subscription (pause/resume/update events)
export async function PATCH(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { subscriptionId, status, events } = body as {
    subscriptionId: string;
    status?: 'active' | 'paused';
    events?: WebhookEventType[];
  };

  if (!subscriptionId) {
    return NextResponse.json({ error: 'subscriptionId required' }, { status: 400 });
  }

  const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() };
  if (status) updates.status = status;
  if (events) updates.events = events;

  await updateDoc(doc(db, 'webhook_subscriptions', subscriptionId), updates);

  return NextResponse.json({ success: true });
}

// DELETE — remove subscription
export async function DELETE(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const subscriptionId = searchParams.get('id');
  if (!subscriptionId) return NextResponse.json({ error: 'id required' }, { status: 400 });

  await deleteDoc(doc(db, 'webhook_subscriptions', subscriptionId));

  return NextResponse.json({ success: true });
}
```

---

### File 73-4: `src/app/api/cron/webhook-retry/route.ts`

```typescript
// ============================================================================
// GRATIS.NGO — Webhook Retry Cron Endpoint
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { processRetries } from '@/lib/webhooks/delivery-service';

export async function POST(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await processRetries();

  return NextResponse.json({
    success: true,
    ...result,
    timestamp: new Date().toISOString(),
  });
}
```

---

### PART 14 SUMMARY

| Section | Title | Files | Lines (approx) |
|---------|-------|-------|-----------------|
| 69 | Audit Log & Activity Trail | 6 | ~850 |
| 70 | RBAC & Permissions Engine | 5 | ~750 |
| 71 | Multi-Tenant / White-Label | 4 | ~550 |
| 72 | GraphQL API Layer | 4 | ~650 |
| 73 | Outbound Webhook Delivery | 4 | ~600 |
| **TOTAL** | | **23 files** | **~3,400 lines** |

---

*End of Part 14 — Sections 69–73*
*Continues in Part 15 — Sections 74–78*
