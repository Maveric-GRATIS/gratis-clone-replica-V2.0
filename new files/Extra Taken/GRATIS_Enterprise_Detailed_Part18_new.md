# GRATIS.NGO — Enterprise Detailed Build Guide — PART 16
## Sections 79–83: Rate Limiting, File Management, Data Import, Bulk Operations, Custom Dashboards
### Total Size: ~130KB | ~28 Files | Complexity: HIGH

---

# ═══════════════════════════════════════════════════════════════════════════════
## SECTION 79 — RATE LIMITING & API THROTTLING
# ═══════════════════════════════════════════════════════════════════════════════

### File 79-1: `src/types/rate-limit.ts`

```typescript
// ============================================================================
// GRATIS.NGO — Rate Limiting Type Definitions
// ============================================================================

export interface RateLimitConfig {
  id: string;
  name: string;
  description: string;
  windowMs: number;          // Time window in milliseconds
  maxRequests: number;        // Max requests per window
  keyType: RateLimitKeyType;
  scope: RateLimitScope;
  enabled: boolean;
  burstLimit?: number;        // Max burst within short interval
  burstWindowMs?: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  whitelist?: string[];       // IPs or user IDs to skip
  blacklist?: string[];       // IPs or user IDs to always block
  penaltyMultiplier?: number; // Multiplier for repeated violations
  createdAt: string;
  updatedAt: string;
}

export type RateLimitKeyType =
  | 'ip'
  | 'user'
  | 'api_key'
  | 'ip_and_user'
  | 'endpoint'
  | 'global';

export type RateLimitScope =
  | 'api'
  | 'auth'
  | 'donations'
  | 'uploads'
  | 'search'
  | 'webhooks'
  | 'exports'
  | 'admin'
  | 'public';

export interface RateLimitEntry {
  key: string;
  count: number;
  resetAt: number;           // Unix timestamp
  burstCount?: number;
  burstResetAt?: number;
  violations: number;
  lastViolation?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: number;
  retryAfter?: number;       // Seconds until next allowed request
  reason?: string;
}

export interface RateLimitViolation {
  id: string;
  key: string;
  keyType: RateLimitKeyType;
  scope: RateLimitScope;
  endpoint: string;
  ip: string;
  userId?: string;
  apiKeyId?: string;
  count: number;
  limit: number;
  timestamp: string;
  userAgent?: string;
}

export interface RateLimitStats {
  totalRequests: number;
  blockedRequests: number;
  uniqueKeys: number;
  topViolators: { key: string; violations: number }[];
  requestsByScope: Record<RateLimitScope, number>;
  blockedByScope: Record<RateLimitScope, number>;
  averageRequestsPerMinute: number;
}

// Default rate limit presets per scope
export const RATE_LIMIT_PRESETS: Record<RateLimitScope, Omit<RateLimitConfig, 'id' | 'name' | 'description' | 'createdAt' | 'updatedAt'>> = {
  api:        { windowMs: 60_000, maxRequests: 100, keyType: 'api_key', scope: 'api', enabled: true, burstLimit: 20, burstWindowMs: 5_000 },
  auth:       { windowMs: 900_000, maxRequests: 10, keyType: 'ip', scope: 'auth', enabled: true, penaltyMultiplier: 2 },
  donations:  { windowMs: 60_000, maxRequests: 5, keyType: 'user', scope: 'donations', enabled: true },
  uploads:    { windowMs: 3_600_000, maxRequests: 50, keyType: 'user', scope: 'uploads', enabled: true },
  search:     { windowMs: 60_000, maxRequests: 30, keyType: 'ip_and_user', scope: 'search', enabled: true },
  webhooks:   { windowMs: 60_000, maxRequests: 1000, keyType: 'api_key', scope: 'webhooks', enabled: true },
  exports:    { windowMs: 3_600_000, maxRequests: 10, keyType: 'user', scope: 'exports', enabled: true },
  admin:      { windowMs: 60_000, maxRequests: 200, keyType: 'user', scope: 'admin', enabled: true },
  public:     { windowMs: 60_000, maxRequests: 60, keyType: 'ip', scope: 'public', enabled: true, burstLimit: 15, burstWindowMs: 5_000 },
};
```

---

### File 79-2: `src/lib/rate-limit/rate-limit-store.ts`

```typescript
// ============================================================================
// GRATIS.NGO — In-Memory + Firestore Rate Limit Store
// ============================================================================

import { db } from '@/lib/firebase/config';
import { doc, setDoc, getDoc, deleteDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { RateLimitEntry, RateLimitViolation } from '@/types/rate-limit';

// In-memory store for hot path (per-instance)
const memoryStore = new Map<string, RateLimitEntry>();
const CLEANUP_INTERVAL = 60_000; // 1 minute

// Periodic cleanup of expired entries
let cleanupTimer: NodeJS.Timeout | null = null;

function startCleanup(): void {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of memoryStore) {
      if (entry.resetAt < now) {
        memoryStore.delete(key);
      }
    }
  }, CLEANUP_INTERVAL);
}

startCleanup();

// ── Memory Store Operations ──────────────────────────────────────────────────

export function getEntry(key: string): RateLimitEntry | undefined {
  const entry = memoryStore.get(key);
  if (!entry) return undefined;

  const now = Date.now();
  // Window expired — reset
  if (entry.resetAt < now) {
    memoryStore.delete(key);
    return undefined;
  }

  // Burst window expired — reset burst counter
  if (entry.burstResetAt && entry.burstResetAt < now) {
    entry.burstCount = 0;
    entry.burstResetAt = undefined;
  }

  return entry;
}

export function incrementEntry(
  key: string,
  windowMs: number,
  burstWindowMs?: number
): RateLimitEntry {
  const now = Date.now();
  let entry = getEntry(key);

  if (!entry) {
    entry = {
      key,
      count: 0,
      resetAt: now + windowMs,
      violations: 0,
    };
  }

  entry.count += 1;

  // Track burst
  if (burstWindowMs) {
    if (!entry.burstResetAt || entry.burstResetAt < now) {
      entry.burstCount = 0;
      entry.burstResetAt = now + burstWindowMs;
    }
    entry.burstCount = (entry.burstCount || 0) + 1;
  }

  memoryStore.set(key, entry);
  return entry;
}

export function recordViolation(key: string): void {
  const entry = memoryStore.get(key);
  if (entry) {
    entry.violations += 1;
    entry.lastViolation = new Date().toISOString();
    memoryStore.set(key, entry);
  }
}

export function resetEntry(key: string): void {
  memoryStore.delete(key);
}

export function getStoreSize(): number {
  return memoryStore.size;
}

export function getAllEntries(): Map<string, RateLimitEntry> {
  return new Map(memoryStore);
}

// ── Firestore Violation Logging ──────────────────────────────────────────────

const VIOLATIONS_COL = 'rate_limit_violations';

export async function logViolation(violation: Omit<RateLimitViolation, 'id'>): Promise<string> {
  const id = `rlv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const full: RateLimitViolation = { ...violation, id };
  await setDoc(doc(db, VIOLATIONS_COL, id), full);
  return id;
}

export async function getViolations(params: {
  key?: string;
  scope?: string;
  since?: string;
  limit?: number;
}): Promise<RateLimitViolation[]> {
  let q = query(collection(db, VIOLATIONS_COL));

  if (params.key) {
    q = query(q, where('key', '==', params.key));
  }
  if (params.scope) {
    q = query(q, where('scope', '==', params.scope));
  }

  const snap = await getDocs(q);
  let results = snap.docs.map((d) => d.data() as RateLimitViolation);

  if (params.since) {
    results = results.filter((v) => v.timestamp >= params.since!);
  }

  results.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  return results.slice(0, params.limit || 100);
}

export async function clearViolations(olderThanDays: number): Promise<number> {
  const cutoff = new Date(Date.now() - olderThanDays * 86_400_000).toISOString();
  const snap = await getDocs(collection(db, VIOLATIONS_COL));
  let deleted = 0;

  for (const d of snap.docs) {
    const v = d.data() as RateLimitViolation;
    if (v.timestamp < cutoff) {
      await deleteDoc(d.ref);
      deleted++;
    }
  }

  return deleted;
}
```

---

### File 79-3: `src/lib/rate-limit/rate-limiter.ts`

```typescript
// ============================================================================
// GRATIS.NGO — Core Rate Limiter Engine
// ============================================================================

import { RateLimitConfig, RateLimitResult, RateLimitScope, RATE_LIMIT_PRESETS } from '@/types/rate-limit';
import {
  getEntry, incrementEntry, recordViolation, logViolation,
} from './rate-limit-store';

// ── Build Rate Limit Key ─────────────────────────────────────────────────────

function buildKey(config: RateLimitConfig, context: RateLimitContext): string {
  const parts = [`rl:${config.scope}`];

  switch (config.keyType) {
    case 'ip':
      parts.push(`ip:${context.ip}`);
      break;
    case 'user':
      parts.push(`usr:${context.userId || context.ip}`);
      break;
    case 'api_key':
      parts.push(`key:${context.apiKeyId || context.ip}`);
      break;
    case 'ip_and_user':
      parts.push(`ip:${context.ip}`, `usr:${context.userId || 'anon'}`);
      break;
    case 'endpoint':
      parts.push(`ep:${context.endpoint}`, `ip:${context.ip}`);
      break;
    case 'global':
      parts.push('global');
      break;
  }

  return parts.join(':');
}

export interface RateLimitContext {
  ip: string;
  userId?: string;
  apiKeyId?: string;
  endpoint: string;
  userAgent?: string;
}

// ── Check Rate Limit ─────────────────────────────────────────────────────────

export async function checkRateLimit(
  scope: RateLimitScope,
  context: RateLimitContext,
  overrideConfig?: Partial<RateLimitConfig>
): Promise<RateLimitResult> {
  const preset = RATE_LIMIT_PRESETS[scope];
  const config: RateLimitConfig = {
    id: `preset_${scope}`,
    name: `${scope} rate limit`,
    description: '',
    createdAt: '',
    updatedAt: '',
    ...preset,
    ...overrideConfig,
  };

  if (!config.enabled) {
    return { allowed: true, remaining: config.maxRequests, limit: config.maxRequests, resetAt: 0 };
  }

  // Check whitelist
  if (config.whitelist?.length) {
    if (
      config.whitelist.includes(context.ip) ||
      (context.userId && config.whitelist.includes(context.userId)) ||
      (context.apiKeyId && config.whitelist.includes(context.apiKeyId))
    ) {
      return { allowed: true, remaining: config.maxRequests, limit: config.maxRequests, resetAt: 0 };
    }
  }

  // Check blacklist
  if (config.blacklist?.length) {
    if (
      config.blacklist.includes(context.ip) ||
      (context.userId && config.blacklist.includes(context.userId))
    ) {
      return { allowed: false, remaining: 0, limit: 0, resetAt: Date.now() + 86_400_000, reason: 'Blacklisted' };
    }
  }

  const key = buildKey(config, context);
  const entry = incrementEntry(key, config.windowMs, config.burstWindowMs);

  // Calculate effective limit (with penalty for repeat violators)
  let effectiveLimit = config.maxRequests;
  if (config.penaltyMultiplier && entry.violations > 0) {
    const penaltyFactor = Math.pow(config.penaltyMultiplier, Math.min(entry.violations, 5));
    effectiveLimit = Math.max(1, Math.floor(config.maxRequests / penaltyFactor));
  }

  // Check burst limit first
  if (config.burstLimit && entry.burstCount && entry.burstCount > config.burstLimit) {
    recordViolation(key);
    await logViolation({
      key,
      keyType: config.keyType,
      scope: config.scope,
      endpoint: context.endpoint,
      ip: context.ip,
      userId: context.userId,
      apiKeyId: context.apiKeyId,
      count: entry.burstCount,
      limit: config.burstLimit,
      timestamp: new Date().toISOString(),
      userAgent: context.userAgent,
    });

    return {
      allowed: false,
      remaining: 0,
      limit: config.burstLimit,
      resetAt: entry.burstResetAt || Date.now() + (config.burstWindowMs || 5000),
      retryAfter: Math.ceil(((entry.burstResetAt || Date.now() + 5000) - Date.now()) / 1000),
      reason: 'Burst rate limit exceeded',
    };
  }

  // Check main limit
  if (entry.count > effectiveLimit) {
    recordViolation(key);
    await logViolation({
      key,
      keyType: config.keyType,
      scope: config.scope,
      endpoint: context.endpoint,
      ip: context.ip,
      userId: context.userId,
      apiKeyId: context.apiKeyId,
      count: entry.count,
      limit: effectiveLimit,
      timestamp: new Date().toISOString(),
      userAgent: context.userAgent,
    });

    return {
      allowed: false,
      remaining: 0,
      limit: effectiveLimit,
      resetAt: entry.resetAt,
      retryAfter: Math.ceil((entry.resetAt - Date.now()) / 1000),
      reason: entry.violations > 2
        ? `Rate limit exceeded (penalty applied: ${entry.violations} violations)`
        : 'Rate limit exceeded',
    };
  }

  return {
    allowed: true,
    remaining: effectiveLimit - entry.count,
    limit: effectiveLimit,
    resetAt: entry.resetAt,
  };
}
```

---

### File 79-4: `src/middleware/rate-limit.ts`

```typescript
// ============================================================================
// GRATIS.NGO — Rate Limit Middleware for Next.js API Routes
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { RateLimitScope } from '@/types/rate-limit';
import { checkRateLimit, RateLimitContext } from '@/lib/rate-limit/rate-limiter';

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    req.headers.get('cf-connecting-ip') ||
    '0.0.0.0'
  );
}

function getUserId(req: NextRequest): string | undefined {
  // Extract from session/JWT — placeholder; integrate with your auth system
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return undefined;
  try {
    const token = authHeader.replace('Bearer ', '');
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return payload.sub || payload.uid;
  } catch {
    return undefined;
  }
}

function getApiKeyId(req: NextRequest): string | undefined {
  return req.headers.get('x-api-key')?.slice(0, 16) || undefined;
}

/**
 * Higher-order function that wraps an API route handler with rate limiting.
 *
 * Usage:
 * ```
 * export const GET = withRateLimit('public', async (req) => {
 *   return NextResponse.json({ data: '...' });
 * });
 * ```
 */
export function withRateLimit(
  scope: RateLimitScope,
  handler: (req: NextRequest) => Promise<NextResponse>,
  overrideConfig?: { maxRequests?: number; windowMs?: number }
) {
  return async function rateLimitedHandler(req: NextRequest): Promise<NextResponse> {
    const context: RateLimitContext = {
      ip: getClientIP(req),
      userId: getUserId(req),
      apiKeyId: getApiKeyId(req),
      endpoint: req.nextUrl.pathname,
      userAgent: req.headers.get('user-agent') || undefined,
    };

    const result = await checkRateLimit(scope, context, overrideConfig);

    if (!result.allowed) {
      return NextResponse.json(
        {
          error: 'Too Many Requests',
          message: result.reason || 'Rate limit exceeded. Please try again later.',
          retryAfter: result.retryAfter,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(result.limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(result.resetAt),
            'Retry-After': String(result.retryAfter || 60),
          },
        }
      );
    }

    // Execute the actual handler
    const response = await handler(req);

    // Attach rate limit headers to successful responses
    response.headers.set('X-RateLimit-Limit', String(result.limit));
    response.headers.set('X-RateLimit-Remaining', String(result.remaining));
    response.headers.set('X-RateLimit-Reset', String(result.resetAt));

    return response;
  };
}

/**
 * Standalone rate limit check for use inside route handlers.
 */
export async function enforceRateLimit(
  req: NextRequest,
  scope: RateLimitScope
): Promise<NextResponse | null> {
  const context: RateLimitContext = {
    ip: getClientIP(req),
    userId: getUserId(req),
    apiKeyId: getApiKeyId(req),
    endpoint: req.nextUrl.pathname,
    userAgent: req.headers.get('user-agent') || undefined,
  };

  const result = await checkRateLimit(scope, context);

  if (!result.allowed) {
    return NextResponse.json(
      {
        error: 'Too Many Requests',
        message: result.reason || 'Rate limit exceeded.',
        retryAfter: result.retryAfter,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(result.retryAfter || 60),
        },
      }
    );
  }

  return null; // Allowed — continue
}
```

---

### File 79-5: `src/app/api/admin/rate-limits/route.ts`

```typescript
// ============================================================================
// GRATIS.NGO — Admin Rate Limit Management API
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getViolations, clearViolations, getAllEntries, getStoreSize } from '@/lib/rate-limit/rate-limit-store';
import { RateLimitStats, RateLimitScope, RATE_LIMIT_PRESETS } from '@/types/rate-limit';

// GET /api/admin/rate-limits — Dashboard stats + config
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const action = searchParams.get('action') || 'stats';

  if (action === 'config') {
    return NextResponse.json({
      presets: RATE_LIMIT_PRESETS,
    });
  }

  if (action === 'violations') {
    const scope = searchParams.get('scope') || undefined;
    const since = searchParams.get('since') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const violations = await getViolations({ scope, since, limit });
    return NextResponse.json({ violations, total: violations.length });
  }

  // Default: stats overview
  const entries = getAllEntries();
  const scopes = Object.keys(RATE_LIMIT_PRESETS) as RateLimitScope[];

  const requestsByScope: Partial<Record<RateLimitScope, number>> = {};
  const blockedByScope: Partial<Record<RateLimitScope, number>> = {};
  let totalRequests = 0;
  let blockedRequests = 0;
  const violatorMap = new Map<string, number>();

  for (const [key, entry] of entries) {
    const scopeMatch = key.match(/^rl:(\w+):/);
    const scope = (scopeMatch?.[1] || 'unknown') as RateLimitScope;

    totalRequests += entry.count;
    requestsByScope[scope] = (requestsByScope[scope] || 0) + entry.count;

    if (entry.violations > 0) {
      blockedRequests += entry.violations;
      blockedByScope[scope] = (blockedByScope[scope] || 0) + entry.violations;
      violatorMap.set(key, entry.violations);
    }
  }

  const topViolators = Array.from(violatorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([key, violations]) => ({ key, violations }));

  const stats: RateLimitStats = {
    totalRequests,
    blockedRequests,
    uniqueKeys: entries.size,
    topViolators,
    requestsByScope: requestsByScope as Record<RateLimitScope, number>,
    blockedByScope: blockedByScope as Record<RateLimitScope, number>,
    averageRequestsPerMinute: Math.round(totalRequests / Math.max(1, entries.size)),
  };

  return NextResponse.json({ stats, storeSize: getStoreSize() });
}

// POST /api/admin/rate-limits — Admin actions
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action } = body;

  if (action === 'clear_violations') {
    const { olderThanDays = 30 } = body;
    const deleted = await clearViolations(olderThanDays);
    return NextResponse.json({ success: true, deleted });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
## SECTION 80 — FILE MANAGEMENT & CLOUD STORAGE
# ═══════════════════════════════════════════════════════════════════════════════

### File 80-1: `src/types/file-management.ts`

```typescript
// ============================================================================
// GRATIS.NGO — File Management Type Definitions
// ============================================================================

export interface StoredFile {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;                   // Bytes
  extension: string;
  bucket: string;
  path: string;                   // Full storage path
  url: string;                    // Public/signed URL
  thumbnailUrl?: string;
  uploadedBy: {
    id: string;
    name: string;
    email: string;
  };
  folder?: string;                // Virtual folder path
  tags?: string[];
  description?: string;
  metadata: FileMetadata;
  access: FileAccess;
  versions: FileVersion[];
  status: 'uploading' | 'processing' | 'ready' | 'error' | 'deleted';
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface FileMetadata {
  width?: number;                 // Image/video
  height?: number;
  duration?: number;              // Audio/video seconds
  pages?: number;                 // PDF
  encoding?: string;
  checksum: string;               // SHA-256
  virusScanStatus?: 'pending' | 'clean' | 'infected' | 'error';
  virusScannedAt?: string;
  exifData?: Record<string, unknown>;
}

export interface FileAccess {
  visibility: 'public' | 'private' | 'restricted';
  allowedUsers?: string[];
  allowedRoles?: string[];
  expiresAt?: string;             // Signed URL expiry
}

export interface FileVersion {
  versionId: string;
  size: number;
  path: string;
  url: string;
  uploadedBy: string;
  createdAt: string;
  comment?: string;
}

export interface FileUploadParams {
  file: File;
  folder?: string;
  tags?: string[];
  description?: string;
  visibility?: 'public' | 'private' | 'restricted';
  generateThumbnail?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export interface FileUploadProgress {
  fileId: string;
  fileName: string;
  bytesTransferred: number;
  totalBytes: number;
  percentage: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

export interface FileQuota {
  used: number;                   // Bytes
  limit: number;                  // Bytes
  fileCount: number;
  fileCountLimit: number;
  usedFormatted: string;
  limitFormatted: string;
  percentUsed: number;
}

export interface FolderStructure {
  name: string;
  path: string;
  fileCount: number;
  totalSize: number;
  children: FolderStructure[];
  updatedAt: string;
}

// Allowed MIME types per category
export const ALLOWED_FILE_TYPES: Record<string, string[]> = {
  image:    ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  spreadsheet: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'],
  video:    ['video/mp4', 'video/webm', 'video/quicktime'],
  audio:    ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'],
};

export const MAX_FILE_SIZES: Record<string, number> = {
  image:       10 * 1024 * 1024,    // 10MB
  document:    50 * 1024 * 1024,    // 50MB
  spreadsheet: 25 * 1024 * 1024,    // 25MB
  video:       500 * 1024 * 1024,   // 500MB
  audio:       100 * 1024 * 1024,   // 100MB
  default:     25 * 1024 * 1024,    // 25MB
};
```

---

### File 80-2: `src/lib/files/file-service.ts`

```typescript
// ============================================================================
// GRATIS.NGO — File Management Service (Firebase Storage + Firestore)
// ============================================================================

import { db, storage } from '@/lib/firebase/config';
import {
  ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll,
  getMetadata as getStorageMetadata,
} from 'firebase/storage';
import {
  doc, setDoc, getDoc, updateDoc, deleteDoc, collection, query,
  where, orderBy, limit as firestoreLimit, getDocs, increment,
} from 'firebase/firestore';
import crypto from 'crypto';
import {
  StoredFile, FileMetadata, FileUploadParams, FileUploadProgress,
  FileQuota, FolderStructure, FileVersion,
  ALLOWED_FILE_TYPES, MAX_FILE_SIZES,
} from '@/types/file-management';

const FILES_COL = 'files';
const QUOTAS_COL = 'file_quotas';

// ── Helpers ──────────────────────────────────────────────────────────────────

function getFileCategory(mimeType: string): string {
  for (const [category, types] of Object.entries(ALLOWED_FILE_TYPES)) {
    if (types.includes(mimeType)) return category;
  }
  return 'default';
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function generateFileId(): string {
  return `file_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
}

function sanitizeFileName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
}

// ── Validation ───────────────────────────────────────────────────────────────

export function validateFile(file: File): { valid: boolean; error?: string } {
  const category = getFileCategory(file.type);
  const allAllowed = Object.values(ALLOWED_FILE_TYPES).flat();

  if (!allAllowed.includes(file.type)) {
    return { valid: false, error: `File type ${file.type} is not allowed.` };
  }

  const maxSize = MAX_FILE_SIZES[category] || MAX_FILE_SIZES.default;
  if (file.size > maxSize) {
    return { valid: false, error: `File too large. Max size: ${formatBytes(maxSize)}.` };
  }

  return { valid: true };
}

// ── Upload ───────────────────────────────────────────────────────────────────

export async function uploadFile(
  params: FileUploadParams,
  userId: string,
  userName: string,
  userEmail: string,
  onProgress?: (progress: FileUploadProgress) => void
): Promise<StoredFile> {
  const { file, folder, tags, description, visibility, generateThumbnail } = params;

  // Validate
  const validation = validateFile(file);
  if (!validation.valid) throw new Error(validation.error);

  // Check quota
  const quota = await getQuota(userId);
  if (quota.used + file.size > quota.limit) {
    throw new Error(`Storage quota exceeded. Used: ${quota.usedFormatted} / ${quota.limitFormatted}`);
  }

  const fileId = generateFileId();
  const ext = file.name.split('.').pop() || '';
  const safeName = sanitizeFileName(file.name);
  const storagePath = folder
    ? `uploads/${userId}/${folder}/${fileId}_${safeName}`
    : `uploads/${userId}/${fileId}_${safeName}`;

  // Compute checksum from first 1MB (for speed)
  const arrayBuffer = await file.slice(0, 1024 * 1024).arrayBuffer();
  const checksum = crypto.createHash('sha256').update(Buffer.from(arrayBuffer)).digest('hex');

  // Upload to Firebase Storage
  const storageRef = ref(storage, storagePath);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const percentage = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        onProgress?.({
          fileId,
          fileName: file.name,
          bytesTransferred: snapshot.bytesTransferred,
          totalBytes: snapshot.totalBytes,
          percentage,
          status: 'uploading',
        });
      },
      (error) => {
        onProgress?.({ fileId, fileName: file.name, bytesTransferred: 0, totalBytes: file.size, percentage: 0, status: 'error', error: error.message });
        reject(error);
      },
      async () => {
        try {
          onProgress?.({ fileId, fileName: file.name, bytesTransferred: file.size, totalBytes: file.size, percentage: 100, status: 'processing' });

          const url = await getDownloadURL(storageRef);

          const metadata: FileMetadata = {
            checksum,
            virusScanStatus: 'pending',
          };

          const storedFile: StoredFile = {
            id: fileId,
            name: safeName,
            originalName: file.name,
            mimeType: file.type,
            size: file.size,
            extension: ext,
            bucket: 'default',
            path: storagePath,
            url,
            uploadedBy: { id: userId, name: userName, email: userEmail },
            folder: folder || undefined,
            tags: tags || [],
            description: description || undefined,
            metadata,
            access: {
              visibility: visibility || 'private',
            },
            versions: [{
              versionId: `v1_${fileId}`,
              size: file.size,
              path: storagePath,
              url,
              uploadedBy: userId,
              createdAt: new Date().toISOString(),
            }],
            status: 'ready',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // Save to Firestore
          await setDoc(doc(db, FILES_COL, fileId), storedFile);

          // Update quota
          await updateQuota(userId, file.size, 1);

          onProgress?.({ fileId, fileName: file.name, bytesTransferred: file.size, totalBytes: file.size, percentage: 100, status: 'complete' });
          resolve(storedFile);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}

// ── Read / Query ─────────────────────────────────────────────────────────────

export async function getFile(fileId: string): Promise<StoredFile | null> {
  const snap = await getDoc(doc(db, FILES_COL, fileId));
  return snap.exists() ? (snap.data() as StoredFile) : null;
}

export async function listFiles(params: {
  userId?: string;
  folder?: string;
  mimeType?: string;
  tags?: string[];
  status?: string;
  limit?: number;
}): Promise<StoredFile[]> {
  let q = query(collection(db, FILES_COL), where('status', '!=', 'deleted'));

  if (params.userId) q = query(q, where('uploadedBy.id', '==', params.userId));
  if (params.folder) q = query(q, where('folder', '==', params.folder));

  const snap = await getDocs(q);
  let results = snap.docs.map((d) => d.data() as StoredFile);

  if (params.mimeType) {
    results = results.filter((f) => f.mimeType.startsWith(params.mimeType!));
  }
  if (params.tags?.length) {
    results = results.filter((f) => params.tags!.some((t) => f.tags?.includes(t)));
  }

  results.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return results.slice(0, params.limit || 100);
}

// ── Delete ───────────────────────────────────────────────────────────────────

export async function deleteFile(fileId: string, hardDelete = false): Promise<void> {
  const file = await getFile(fileId);
  if (!file) throw new Error('File not found');

  if (hardDelete) {
    // Delete from storage
    try {
      const storageRef = ref(storage, file.path);
      await deleteObject(storageRef);
    } catch { /* file may already be deleted from storage */ }

    // Delete all versions
    for (const version of file.versions) {
      try {
        const vRef = ref(storage, version.path);
        await deleteObject(vRef);
      } catch { /* skip */ }
    }

    await deleteDoc(doc(db, FILES_COL, fileId));
  } else {
    // Soft delete
    await updateDoc(doc(db, FILES_COL, fileId), {
      status: 'deleted',
      deletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  // Update quota
  await updateQuota(file.uploadedBy.id, -file.size, -1);
}

// ── Versioning ───────────────────────────────────────────────────────────────

export async function uploadNewVersion(
  fileId: string,
  file: File,
  userId: string,
  comment?: string
): Promise<StoredFile> {
  const existing = await getFile(fileId);
  if (!existing) throw new Error('File not found');

  const versionId = `v${existing.versions.length + 1}_${fileId}`;
  const storagePath = `${existing.path}_v${existing.versions.length + 1}`;

  const storageRef = ref(storage, storagePath);
  await uploadBytesResumable(storageRef, file);
  const url = await getDownloadURL(storageRef);

  const newVersion: FileVersion = {
    versionId,
    size: file.size,
    path: storagePath,
    url,
    uploadedBy: userId,
    createdAt: new Date().toISOString(),
    comment,
  };

  const updatedVersions = [...existing.versions, newVersion];

  await updateDoc(doc(db, FILES_COL, fileId), {
    url,
    size: file.size,
    versions: updatedVersions,
    updatedAt: new Date().toISOString(),
  });

  const sizeDiff = file.size - existing.size;
  await updateQuota(existing.uploadedBy.id, sizeDiff, 0);

  return { ...existing, url, size: file.size, versions: updatedVersions };
}

// ── Quota Management ─────────────────────────────────────────────────────────

const DEFAULT_QUOTA_LIMIT = 5 * 1024 * 1024 * 1024; // 5GB
const DEFAULT_FILE_COUNT_LIMIT = 10_000;

export async function getQuota(userId: string): Promise<FileQuota> {
  const snap = await getDoc(doc(db, QUOTAS_COL, userId));
  if (snap.exists()) {
    const data = snap.data();
    return {
      used: data.used || 0,
      limit: data.limit || DEFAULT_QUOTA_LIMIT,
      fileCount: data.fileCount || 0,
      fileCountLimit: data.fileCountLimit || DEFAULT_FILE_COUNT_LIMIT,
      usedFormatted: formatBytes(data.used || 0),
      limitFormatted: formatBytes(data.limit || DEFAULT_QUOTA_LIMIT),
      percentUsed: Math.round(((data.used || 0) / (data.limit || DEFAULT_QUOTA_LIMIT)) * 100),
    };
  }

  // Initialize quota
  const quota = { used: 0, limit: DEFAULT_QUOTA_LIMIT, fileCount: 0, fileCountLimit: DEFAULT_FILE_COUNT_LIMIT };
  await setDoc(doc(db, QUOTAS_COL, userId), quota);

  return {
    ...quota,
    usedFormatted: '0 B',
    limitFormatted: formatBytes(DEFAULT_QUOTA_LIMIT),
    percentUsed: 0,
  };
}

async function updateQuota(userId: string, sizeChange: number, countChange: number): Promise<void> {
  await updateDoc(doc(db, QUOTAS_COL, userId), {
    used: increment(sizeChange),
    fileCount: increment(countChange),
  });
}

// ── Folder Structure ─────────────────────────────────────────────────────────

export async function getFolderStructure(userId: string): Promise<FolderStructure[]> {
  const files = await listFiles({ userId, limit: 10_000 });
  const folderMap = new Map<string, { fileCount: number; totalSize: number; updatedAt: string }>();

  for (const file of files) {
    const folder = file.folder || '(root)';
    const existing = folderMap.get(folder) || { fileCount: 0, totalSize: 0, updatedAt: '' };
    existing.fileCount += 1;
    existing.totalSize += file.size;
    if (file.updatedAt > existing.updatedAt) existing.updatedAt = file.updatedAt;
    folderMap.set(folder, existing);
  }

  return Array.from(folderMap.entries()).map(([name, data]) => ({
    name,
    path: name,
    fileCount: data.fileCount,
    totalSize: data.totalSize,
    children: [],
    updatedAt: data.updatedAt,
  }));
}
```

---

### File 80-3: `src/app/api/files/route.ts`

```typescript
// ============================================================================
// GRATIS.NGO — File Management API Routes
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getFile, listFiles, deleteFile, getQuota, getFolderStructure } from '@/lib/files/file-service';

// GET /api/files — List files or get single file
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const fileId = searchParams.get('id');
  const action = searchParams.get('action');
  const userId = searchParams.get('userId') || '';

  if (fileId) {
    const file = await getFile(fileId);
    if (!file) return NextResponse.json({ error: 'File not found' }, { status: 404 });
    return NextResponse.json({ file });
  }

  if (action === 'quota') {
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });
    const quota = await getQuota(userId);
    return NextResponse.json({ quota });
  }

  if (action === 'folders') {
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });
    const folders = await getFolderStructure(userId);
    return NextResponse.json({ folders });
  }

  const files = await listFiles({
    userId: userId || undefined,
    folder: searchParams.get('folder') || undefined,
    mimeType: searchParams.get('mimeType') || undefined,
    tags: searchParams.get('tags')?.split(',') || undefined,
    limit: parseInt(searchParams.get('limit') || '50', 10),
  });

  return NextResponse.json({ files, total: files.length });
}

// DELETE /api/files — Delete a file
export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { fileId, hardDelete = false } = body;

  if (!fileId) return NextResponse.json({ error: 'fileId required' }, { status: 400 });

  await deleteFile(fileId, hardDelete);
  return NextResponse.json({ success: true, fileId });
}
```

---

### File 80-4: `src/app/api/files/upload/route.ts`

```typescript
// ============================================================================
// GRATIS.NGO — File Upload API Route (Server-Side)
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db, storage } from '@/lib/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, updateDoc, increment } from 'firebase/firestore';
import crypto from 'crypto';

export const config = {
  api: { bodyParser: false },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const userId = formData.get('userId') as string;
    const userName = formData.get('userName') as string;
    const userEmail = formData.get('userEmail') as string;
    const folder = formData.get('folder') as string | null;
    const tagsStr = formData.get('tags') as string | null;
    const description = formData.get('description') as string | null;
    const visibility = (formData.get('visibility') as string) || 'private';

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    // Validate size (50MB max for this endpoint)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max: 50MB' }, { status: 413 });
    }

    const fileId = `file_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
    const ext = file.name.split('.').pop() || '';
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase();
    const storagePath = folder
      ? `uploads/${userId}/${folder}/${fileId}_${safeName}`
      : `uploads/${userId}/${fileId}_${safeName}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const checksum = crypto.createHash('sha256').update(buffer).digest('hex');

    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, buffer, { contentType: file.type });
    const url = await getDownloadURL(storageRef);

    const storedFile = {
      id: fileId,
      name: safeName,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      extension: ext,
      bucket: 'default',
      path: storagePath,
      url,
      uploadedBy: { id: userId, name: userName, email: userEmail },
      folder: folder || undefined,
      tags: tagsStr ? tagsStr.split(',').map((t) => t.trim()) : [],
      description: description || undefined,
      metadata: { checksum, virusScanStatus: 'pending' },
      access: { visibility },
      versions: [{ versionId: `v1_${fileId}`, size: file.size, path: storagePath, url, uploadedBy: userId, createdAt: new Date().toISOString() }],
      status: 'ready',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'files', fileId), storedFile);
    await updateDoc(doc(db, 'file_quotas', userId), {
      used: increment(file.size),
      fileCount: increment(1),
    });

    return NextResponse.json({ success: true, file: storedFile });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
```

---

### File 80-5: `src/components/files/FileUploader.tsx`

```typescript
// ============================================================================
// GRATIS.NGO — File Upload Component with Drag & Drop
// ============================================================================

'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Upload, X, File as FileIcon, Image, Film, Music, FileText, Check, AlertCircle, Loader2 } from 'lucide-react';
import { FileUploadProgress, ALLOWED_FILE_TYPES, MAX_FILE_SIZES } from '@/types/file-management';

interface FileUploaderProps {
  userId: string;
  userName: string;
  userEmail: string;
  folder?: string;
  maxFiles?: number;
  acceptedTypes?: string[];
  onUploadComplete?: (files: any[]) => void;
  onError?: (error: string) => void;
}

const FILE_ICONS: Record<string, React.ReactNode> = {
  image: <Image className="w-5 h-5 text-purple-400" />,
  video: <Film className="w-5 h-5 text-blue-400" />,
  audio: <Music className="w-5 h-5 text-green-400" />,
  document: <FileText className="w-5 h-5 text-orange-400" />,
  default: <FileIcon className="w-5 h-5 text-gray-400" />,
};

function getIconForType(mimeType: string): React.ReactNode {
  for (const [category, types] of Object.entries(ALLOWED_FILE_TYPES)) {
    if (types.includes(mimeType)) return FILE_ICONS[category] || FILE_ICONS.default;
  }
  return FILE_ICONS.default;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function FileUploader({
  userId, userName, userEmail, folder, maxFiles = 10,
  acceptedTypes, onUploadComplete, onError,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState<(FileUploadProgress & { file: File })[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files).slice(0, maxFiles);
    const newUploads = fileArray.map((file) => ({
      file,
      fileId: `temp_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      fileName: file.name,
      bytesTransferred: 0,
      totalBytes: file.size,
      percentage: 0,
      status: 'uploading' as const,
    }));

    setUploads((prev) => [...prev, ...newUploads]);
    const completedFiles: any[] = [];

    for (let i = 0; i < newUploads.length; i++) {
      const upload = newUploads[i];
      try {
        const formData = new FormData();
        formData.append('file', upload.file);
        formData.append('userId', userId);
        formData.append('userName', userName);
        formData.append('userEmail', userEmail);
        if (folder) formData.append('folder', folder);

        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setUploads((prev) =>
            prev.map((u) =>
              u.fileId === upload.fileId
                ? { ...u, percentage: Math.min(u.percentage + 15, 90), status: 'uploading' }
                : u
            )
          );
        }, 200);

        const res = await fetch('/api/files/upload', { method: 'POST', body: formData });
        clearInterval(progressInterval);

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Upload failed');
        }

        const data = await res.json();
        completedFiles.push(data.file);

        setUploads((prev) =>
          prev.map((u) =>
            u.fileId === upload.fileId
              ? { ...u, percentage: 100, status: 'complete', fileId: data.file.id }
              : u
          )
        );
      } catch (error: any) {
        setUploads((prev) =>
          prev.map((u) =>
            u.fileId === upload.fileId
              ? { ...u, status: 'error', error: error.message }
              : u
          )
        );
        onError?.(error.message);
      }
    }

    if (completedFiles.length > 0) {
      onUploadComplete?.(completedFiles);
    }
  }, [userId, userName, userEmail, folder, maxFiles, onUploadComplete, onError]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const removeUpload = (fileId: string) => {
    setUploads((prev) => prev.filter((u) => u.fileId !== fileId));
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${isDragging
            ? 'border-emerald-400 bg-emerald-500/10'
            : 'border-gray-600 hover:border-gray-400 bg-gray-800/30'
          }
        `}
      >
        <Upload className={`w-10 h-10 mx-auto mb-3 ${isDragging ? 'text-emerald-400' : 'text-gray-400'}`} />
        <p className="text-sm text-gray-300 font-medium">
          {isDragging ? 'Drop files here...' : 'Drag & drop files here, or click to browse'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Max {maxFiles} files • Images, documents, video, audio
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          accept={acceptedTypes?.join(',') || undefined}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {/* Upload Queue */}
      {uploads.length > 0 && (
        <div className="space-y-2">
          {uploads.map((upload) => (
            <div
              key={upload.fileId}
              className="flex items-center gap-3 bg-gray-800/60 rounded-lg px-4 py-3 border border-gray-700"
            >
              {getIconForType(upload.file.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{upload.fileName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        upload.status === 'complete' ? 'bg-emerald-500' :
                        upload.status === 'error' ? 'bg-red-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${upload.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-12 text-right">
                    {upload.status === 'complete' ? (
                      <Check className="w-4 h-4 text-emerald-400 inline" />
                    ) : upload.status === 'error' ? (
                      <AlertCircle className="w-4 h-4 text-red-400 inline" />
                    ) : (
                      `${upload.percentage}%`
                    )}
                  </span>
                </div>
                {upload.status === 'error' && (
                  <p className="text-xs text-red-400 mt-0.5">{upload.error}</p>
                )}
                <p className="text-xs text-gray-500">{formatBytes(upload.totalBytes)}</p>
              </div>
              <button onClick={() => removeUpload(upload.fileId)} className="text-gray-500 hover:text-gray-300">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

### File 80-6: `src/components/files/FileManager.tsx`

```typescript
// ============================================================================
// GRATIS.NGO — File Manager Component with Grid/List View
// ============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import {
  Grid, List, Search, Folder, Filter, Download, Trash2,
  Eye, MoreHorizontal, HardDrive, RefreshCw,
} from 'lucide-react';
import { StoredFile, FileQuota, FolderStructure } from '@/types/file-management';
import FileUploader from './FileUploader';

interface FileManagerProps {
  userId: string;
  userName: string;
  userEmail: string;
}

type ViewMode = 'grid' | 'list';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function FileManager({ userId, userName, userEmail }: FileManagerProps) {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [quota, setQuota] = useState<FileQuota | null>(null);
  const [folders, setFolders] = useState<FolderStructure[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | undefined>();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [showUploader, setShowUploader] = useState(false);

  useEffect(() => {
    loadFiles();
    loadQuota();
    loadFolders();
  }, [currentFolder]);

  async function loadFiles() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ userId });
      if (currentFolder) params.set('folder', currentFolder);
      const res = await fetch(`/api/files?${params}`);
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err) {
      console.error('Failed to load files:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadQuota() {
    const res = await fetch(`/api/files?action=quota&userId=${userId}`);
    const data = await res.json();
    setQuota(data.quota);
  }

  async function loadFolders() {
    const res = await fetch(`/api/files?action=folders&userId=${userId}`);
    const data = await res.json();
    setFolders(data.folders || []);
  }

  async function handleDelete(fileId: string) {
    if (!confirm('Delete this file?')) return;
    await fetch('/api/files', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId }),
    });
    loadFiles();
    loadQuota();
  }

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.originalName.toLowerCase().includes(search.toLowerCase()) ||
    f.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleSelect = (id: string) => {
    setSelectedFiles((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header: Quota + Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">File Manager</h2>
          {quota && (
            <div className="flex items-center gap-2 mt-1">
              <HardDrive className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">
                {quota.usedFormatted} / {quota.limitFormatted} ({quota.percentUsed}%)
              </span>
              <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${quota.percentUsed > 90 ? 'bg-red-500' : quota.percentUsed > 70 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                  style={{ width: `${quota.percentUsed}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setShowUploader(!showUploader)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition">
            Upload Files
          </button>
          <button onClick={loadFiles} className="p-2 text-gray-400 hover:text-white border border-gray-600 rounded-lg">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Upload Area (collapsible) */}
      {showUploader && (
        <FileUploader
          userId={userId}
          userName={userName}
          userEmail={userEmail}
          folder={currentFolder}
          onUploadComplete={() => { loadFiles(); loadQuota(); }}
        />
      )}

      {/* Search + View Toggle */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="flex border border-gray-600 rounded-lg overflow-hidden">
          <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}>
            <Grid className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}>
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Folder Breadcrumb */}
      <div className="flex items-center gap-1 text-sm">
        <button onClick={() => setCurrentFolder(undefined)} className="text-emerald-400 hover:underline">
          All Files
        </button>
        {currentFolder && (
          <>
            <span className="text-gray-500">/</span>
            <span className="text-white">{currentFolder}</span>
          </>
        )}
      </div>

      {/* Folders */}
      {!currentFolder && folders.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {folders.map((folder) => (
            <button
              key={folder.path}
              onClick={() => setCurrentFolder(folder.path)}
              className="flex items-center gap-3 p-3 bg-gray-800/60 border border-gray-700 rounded-lg hover:border-gray-500 transition text-left"
            >
              <Folder className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-sm text-white font-medium truncate">{folder.name}</p>
                <p className="text-xs text-gray-400">{folder.fileCount} files • {formatBytes(folder.totalSize)}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Files Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredFiles.map((file) => (
            <div key={file.id} className={`group relative bg-gray-800/60 border rounded-lg overflow-hidden transition ${selectedFiles.has(file.id) ? 'border-emerald-500' : 'border-gray-700 hover:border-gray-500'}`}>
              <div className="aspect-square flex items-center justify-center bg-gray-900/50 cursor-pointer" onClick={() => toggleSelect(file.id)}>
                {file.mimeType.startsWith('image/') ? (
                  <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <div className="text-4xl mb-2">
                      {file.mimeType.startsWith('video/') ? '🎬' : file.mimeType.startsWith('audio/') ? '🎵' : file.mimeType.includes('pdf') ? '📄' : '📁'}
                    </div>
                    <p className="text-xs text-gray-400 uppercase">{file.extension}</p>
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm text-white truncate" title={file.originalName}>{file.originalName}</p>
                <p className="text-xs text-gray-400 mt-0.5">{formatBytes(file.size)}</p>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex gap-1">
                <a href={file.url} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-gray-800/90 rounded text-gray-300 hover:text-white">
                  <Eye className="w-3.5 h-3.5" />
                </a>
                <a href={file.url} download={file.originalName} className="p-1.5 bg-gray-800/90 rounded text-gray-300 hover:text-white">
                  <Download className="w-3.5 h-3.5" />
                </a>
                <button onClick={() => handleDelete(file.id)} className="p-1.5 bg-gray-800/90 rounded text-red-400 hover:text-red-300">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Files List */
        <div className="space-y-1">
          {filteredFiles.map((file) => (
            <div key={file.id} className={`flex items-center gap-3 p-3 rounded-lg transition cursor-pointer ${selectedFiles.has(file.id) ? 'bg-emerald-500/10 border border-emerald-500/30' : 'hover:bg-gray-800/60'}`}
              onClick={() => toggleSelect(file.id)}>
              <div className="text-xl">
                {file.mimeType.startsWith('image/') ? '🖼️' : file.mimeType.startsWith('video/') ? '🎬' : file.mimeType.startsWith('audio/') ? '🎵' : '📄'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{file.originalName}</p>
                <p className="text-xs text-gray-400">{formatBytes(file.size)} • {new Date(file.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><Eye className="w-4 h-4" /></a>
                <a href={file.url} download className="text-gray-400 hover:text-white"><Download className="w-4 h-4" /></a>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(file.id); }} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredFiles.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No files found</p>
          <p className="text-sm mt-1">Upload files to get started</p>
        </div>
      )}
    </div>
  );
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
## SECTION 81 — DATA MIGRATION & IMPORT SYSTEM
# ═══════════════════════════════════════════════════════════════════════════════

### File 81-1: `src/types/data-import.ts`

```typescript
// ============================================================================
// GRATIS.NGO — Data Import / Migration Type Definitions
// ============================================================================

export type ImportFormat = 'csv' | 'json' | 'xlsx' | 'xml';

export type ImportEntityType =
  | 'contacts'
  | 'donations'
  | 'donors'
  | 'events'
  | 'projects'
  | 'partners'
  | 'volunteers'
  | 'subscribers';

export interface ImportMapping {
  sourceColumn: string;
  targetField: string;
  transform?: ImportTransform;
  required?: boolean;
  defaultValue?: string;
}

export type ImportTransform =
  | 'none'
  | 'lowercase'
  | 'uppercase'
  | 'trim'
  | 'date_parse'
  | 'number_parse'
  | 'currency_parse'
  | 'boolean_parse'
  | 'email_normalize'
  | 'phone_normalize'
  | 'split_comma'
  | 'custom';

export interface ImportJob {
  id: string;
  entityType: ImportEntityType;
  format: ImportFormat;
  fileName: string;
  fileSize: number;
  mappings: ImportMapping[];
  options: ImportOptions;
  status: ImportJobStatus;
  progress: ImportProgress;
  results: ImportResults;
  errors: ImportError[];
  createdBy: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

export type ImportJobStatus =
  | 'pending'
  | 'validating'
  | 'mapping'
  | 'importing'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface ImportOptions {
  duplicateHandling: 'skip' | 'update' | 'create_new';
  duplicateField?: string;           // Field to check for duplicates (e.g. 'email')
  batchSize: number;
  dryRun: boolean;
  sendNotifications: boolean;
  timezone?: string;
  dateFormat?: string;               // e.g. 'DD/MM/YYYY', 'MM-DD-YYYY'
  delimiter?: string;                // CSV delimiter
  skipEmptyRows: boolean;
  headerRow: number;                 // 0-indexed row containing headers
}

export interface ImportProgress {
  totalRows: number;
  processedRows: number;
  successCount: number;
  errorCount: number;
  skippedCount: number;
  updatedCount: number;
  percentage: number;
  currentBatch: number;
  totalBatches: number;
  estimatedTimeRemaining?: number;   // Seconds
}

export interface ImportResults {
  created: number;
  updated: number;
  skipped: number;
  failed: number;
  total: number;
  duration: number;                  // Milliseconds
  createdIds: string[];
  updatedIds: string[];
}

export interface ImportError {
  row: number;
  column?: string;
  value?: string;
  message: string;
  severity: 'warning' | 'error';
}

export interface ImportPreview {
  headers: string[];
  sampleRows: Record<string, string>[];   // First 5 rows
  totalRows: number;
  detectedFormat: ImportFormat;
  suggestedMappings: ImportMapping[];
  validationIssues: ImportError[];
}

// Entity field definitions for mapping UI
export const ENTITY_FIELDS: Record<ImportEntityType, { name: string; label: string; required: boolean }[]> = {
  contacts: [
    { name: 'email', label: 'Email', required: true },
    { name: 'firstName', label: 'First Name', required: true },
    { name: 'lastName', label: 'Last Name', required: true },
    { name: 'phone', label: 'Phone', required: false },
    { name: 'company', label: 'Company', required: false },
    { name: 'city', label: 'City', required: false },
    { name: 'country', label: 'Country', required: false },
    { name: 'tags', label: 'Tags', required: false },
    { name: 'notes', label: 'Notes', required: false },
  ],
  donations: [
    { name: 'donorEmail', label: 'Donor Email', required: true },
    { name: 'amount', label: 'Amount', required: true },
    { name: 'currency', label: 'Currency', required: true },
    { name: 'date', label: 'Date', required: true },
    { name: 'projectId', label: 'Project ID', required: false },
    { name: 'paymentMethod', label: 'Payment Method', required: false },
    { name: 'transactionId', label: 'Transaction ID', required: false },
    { name: 'notes', label: 'Notes', required: false },
  ],
  donors: [
    { name: 'email', label: 'Email', required: true },
    { name: 'name', label: 'Full Name', required: true },
    { name: 'totalDonated', label: 'Total Donated', required: false },
    { name: 'firstDonation', label: 'First Donation Date', required: false },
    { name: 'tier', label: 'Tier', required: false },
    { name: 'recurring', label: 'Recurring', required: false },
  ],
  events: [
    { name: 'title', label: 'Title', required: true },
    { name: 'date', label: 'Date', required: true },
    { name: 'location', label: 'Location', required: false },
    { name: 'description', label: 'Description', required: false },
    { name: 'capacity', label: 'Capacity', required: false },
    { name: 'ticketPrice', label: 'Ticket Price', required: false },
  ],
  projects: [
    { name: 'name', label: 'Name', required: true },
    { name: 'description', label: 'Description', required: true },
    { name: 'goalAmount', label: 'Goal Amount', required: false },
    { name: 'category', label: 'Category', required: false },
    { name: 'status', label: 'Status', required: false },
  ],
  partners: [
    { name: 'organizationName', label: 'Organization Name', required: true },
    { name: 'contactEmail', label: 'Contact Email', required: true },
    { name: 'contactName', label: 'Contact Name', required: true },
    { name: 'country', label: 'Country', required: false },
    { name: 'category', label: 'Category', required: false },
  ],
  volunteers: [
    { name: 'email', label: 'Email', required: true },
    { name: 'name', label: 'Name', required: true },
    { name: 'skills', label: 'Skills', required: false },
    { name: 'availability', label: 'Availability', required: false },
    { name: 'location', label: 'Location', required: false },
  ],
  subscribers: [
    { name: 'email', label: 'Email', required: true },
    { name: 'name', label: 'Name', required: false },
    { name: 'source', label: 'Source', required: false },
    { name: 'subscribedAt', label: 'Subscribed Date', required: false },
  ],
};
```

---

### File 81-2: `src/lib/import/import-service.ts`

```typescript
// ============================================================================
// GRATIS.NGO — Data Import Service
// ============================================================================

import { db } from '@/lib/firebase/config';
import { doc, setDoc, getDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import {
  ImportJob, ImportJobStatus, ImportMapping, ImportOptions,
  ImportPreview, ImportError, ImportResults, ImportProgress,
  ImportEntityType, ImportTransform, ENTITY_FIELDS,
} from '@/types/data-import';

const IMPORT_JOBS_COL = 'import_jobs';

// ── Parse CSV ────────────────────────────────────────────────────────────────

export function parseCSV(text: string, delimiter = ','): { headers: string[]; rows: Record<string, string>[] } {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length === 0) return { headers: [], rows: [] };

  const headers = lines[0].split(delimiter).map((h) => h.trim().replace(/^"|"$/g, ''));
  const rows = lines.slice(1).map((line) => {
    const values = line.split(delimiter).map((v) => v.trim().replace(/^"|"$/g, ''));
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = values[i] || ''; });
    return row;
  });

  return { headers, rows };
}

// ── Parse JSON ───────────────────────────────────────────────────────────────

export function parseJSON(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const data = JSON.parse(text);
  const arr = Array.isArray(data) ? data : data.data || data.records || [data];
  if (arr.length === 0) return { headers: [], rows: [] };

  const headers = Object.keys(arr[0]);
  const rows = arr.map((item: any) => {
    const row: Record<string, string> = {};
    headers.forEach((h) => { row[h] = String(item[h] ?? ''); });
    return row;
  });

  return { headers, rows };
}

// ── Apply Transform ──────────────────────────────────────────────────────────

export function applyTransform(value: string, transform: ImportTransform): any {
  if (!value && transform !== 'boolean_parse') return value;

  switch (transform) {
    case 'none':           return value;
    case 'lowercase':      return value.toLowerCase();
    case 'uppercase':      return value.toUpperCase();
    case 'trim':           return value.trim();
    case 'date_parse':     return new Date(value).toISOString();
    case 'number_parse':   return parseFloat(value.replace(/[^0-9.-]/g, '')) || 0;
    case 'currency_parse': return parseFloat(value.replace(/[^0-9.-]/g, '')) || 0;
    case 'boolean_parse':  return ['true', '1', 'yes', 'y'].includes(value.toLowerCase());
    case 'email_normalize': return value.toLowerCase().trim();
    case 'phone_normalize': return value.replace(/[^0-9+]/g, '');
    case 'split_comma':    return value.split(',').map((v) => v.trim()).filter(Boolean);
    default:               return value;
  }
}

// ── Auto-Suggest Mappings ────────────────────────────────────────────────────

export function suggestMappings(headers: string[], entityType: ImportEntityType): ImportMapping[] {
  const fields = ENTITY_FIELDS[entityType];
  const mappings: ImportMapping[] = [];

  for (const field of fields) {
    const headerLower = headers.map((h) => h.toLowerCase().replace(/[_\s-]/g, ''));
    const fieldLower = field.name.toLowerCase();
    const labelLower = field.label.toLowerCase().replace(/\s/g, '');

    let bestMatch = '';
    let bestScore = 0;

    for (let i = 0; i < headers.length; i++) {
      const h = headerLower[i];
      let score = 0;

      if (h === fieldLower || h === labelLower) score = 100;
      else if (h.includes(fieldLower) || fieldLower.includes(h)) score = 70;
      else if (h.includes(labelLower) || labelLower.includes(h)) score = 60;

      // Common aliases
      const aliases: Record<string, string[]> = {
        email: ['e-mail', 'emailaddress', 'mail'],
        firstName: ['first', 'fname', 'givenname'],
        lastName: ['last', 'lname', 'surname', 'familyname'],
        phone: ['tel', 'telephone', 'mobile', 'cell'],
        amount: ['total', 'sum', 'value', 'price'],
        name: ['fullname', 'displayname'],
      };
      if (aliases[field.name]?.some((a) => h.includes(a))) score = Math.max(score, 80);

      if (score > bestScore) {
        bestScore = score;
        bestMatch = headers[i];
      }
    }

    if (bestScore >= 60) {
      mappings.push({
        sourceColumn: bestMatch,
        targetField: field.name,
        transform: getDefaultTransform(field.name),
        required: field.required,
      });
    }
  }

  return mappings;
}

function getDefaultTransform(fieldName: string): ImportTransform {
  if (fieldName.includes('email')) return 'email_normalize';
  if (fieldName.includes('phone')) return 'phone_normalize';
  if (fieldName.includes('date') || fieldName.includes('Date')) return 'date_parse';
  if (['amount', 'totalDonated', 'goalAmount', 'ticketPrice'].includes(fieldName)) return 'currency_parse';
  if (['recurring'].includes(fieldName)) return 'boolean_parse';
  if (['tags', 'skills'].includes(fieldName)) return 'split_comma';
  return 'trim';
}

// ── Preview Import ───────────────────────────────────────────────────────────

export function previewImport(
  text: string,
  format: 'csv' | 'json',
  entityType: ImportEntityType,
  delimiter?: string
): ImportPreview {
  const { headers, rows } = format === 'csv' ? parseCSV(text, delimiter) : parseJSON(text);

  const suggestedMappings = suggestMappings(headers, entityType);

  const validationIssues: ImportError[] = [];
  const requiredFields = ENTITY_FIELDS[entityType].filter((f) => f.required);

  for (const field of requiredFields) {
    const mapped = suggestedMappings.find((m) => m.targetField === field.name);
    if (!mapped) {
      validationIssues.push({
        row: 0,
        column: field.name,
        message: `Required field "${field.label}" is not mapped to any column.`,
        severity: 'error',
      });
    }
  }

  // Check sample data quality
  const sampleRows = rows.slice(0, 5);
  for (let i = 0; i < Math.min(sampleRows.length, 3); i++) {
    for (const mapping of suggestedMappings) {
      const value = sampleRows[i][mapping.sourceColumn];
      if (mapping.required && (!value || value.trim() === '')) {
        validationIssues.push({
          row: i + 2,
          column: mapping.sourceColumn,
          value,
          message: `Required value missing in row ${i + 2}.`,
          severity: 'warning',
        });
      }
    }
  }

  return {
    headers,
    sampleRows,
    totalRows: rows.length,
    detectedFormat: format,
    suggestedMappings,
    validationIssues,
  };
}

// ── Execute Import ───────────────────────────────────────────────────────────

export async function executeImport(
  jobId: string,
  rows: Record<string, string>[],
  mappings: ImportMapping[],
  options: ImportOptions,
  entityType: ImportEntityType
): Promise<ImportResults> {
  const startTime = Date.now();
  const results: ImportResults = {
    created: 0, updated: 0, skipped: 0, failed: 0,
    total: rows.length, duration: 0,
    createdIds: [], updatedIds: [],
  };
  const errors: ImportError[] = [];
  const batchSize = options.batchSize || 50;
  const totalBatches = Math.ceil(rows.length / batchSize);

  for (let batch = 0; batch < totalBatches; batch++) {
    const batchRows = rows.slice(batch * batchSize, (batch + 1) * batchSize);

    for (let i = 0; i < batchRows.length; i++) {
      const rowIndex = batch * batchSize + i;
      const row = batchRows[i];

      try {
        // Map row to entity
        const entity: Record<string, any> = {};
        for (const mapping of mappings) {
          const rawValue = row[mapping.sourceColumn] || mapping.defaultValue || '';
          entity[mapping.targetField] = applyTransform(rawValue, mapping.transform || 'none');
        }

        // Validate required fields
        const missingRequired = mappings
          .filter((m) => m.required && !entity[m.targetField])
          .map((m) => m.targetField);

        if (missingRequired.length > 0) {
          errors.push({ row: rowIndex + 2, message: `Missing required: ${missingRequired.join(', ')}`, severity: 'error' });
          results.failed++;
          continue;
        }

        // Check duplicates
        if (options.duplicateField && entity[options.duplicateField]) {
          const dupQuery = query(
            collection(db, entityType),
            where(options.duplicateField, '==', entity[options.duplicateField])
          );
          const dupSnap = await getDocs(dupQuery);

          if (!dupSnap.empty) {
            if (options.duplicateHandling === 'skip') {
              results.skipped++;
              continue;
            } else if (options.duplicateHandling === 'update') {
              const existingId = dupSnap.docs[0].id;
              if (!options.dryRun) {
                await updateDoc(doc(db, entityType, existingId), { ...entity, updatedAt: new Date().toISOString() });
              }
              results.updated++;
              results.updatedIds.push(existingId);
              continue;
            }
          }
        }

        // Create new record
        const id = `${entityType.slice(0, 3)}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        if (!options.dryRun) {
          await setDoc(doc(db, entityType, id), {
            ...entity,
            id,
            importJobId: jobId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
        results.created++;
        results.createdIds.push(id);
      } catch (error: any) {
        errors.push({ row: rowIndex + 2, message: error.message, severity: 'error' });
        results.failed++;
      }
    }

    // Update job progress
    const processed = Math.min((batch + 1) * batchSize, rows.length);
    await updateDoc(doc(db, IMPORT_JOBS_COL, jobId), {
      'progress.processedRows': processed,
      'progress.successCount': results.created + results.updated,
      'progress.errorCount': results.failed,
      'progress.skippedCount': results.skipped,
      'progress.percentage': Math.round((processed / rows.length) * 100),
      'progress.currentBatch': batch + 1,
    });
  }

  results.duration = Date.now() - startTime;

  // Finalize job
  await updateDoc(doc(db, IMPORT_JOBS_COL, jobId), {
    status: results.failed > 0 && results.created === 0 ? 'failed' : 'completed',
    results,
    errors: errors.slice(0, 500),
    completedAt: new Date().toISOString(),
  });

  return results;
}

// ── Job CRUD ─────────────────────────────────────────────────────────────────

export async function createImportJob(params: {
  entityType: ImportEntityType;
  format: 'csv' | 'json';
  fileName: string;
  fileSize: number;
  mappings: ImportMapping[];
  options: ImportOptions;
  totalRows: number;
  createdBy: string;
}): Promise<ImportJob> {
  const id = `imp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const job: ImportJob = {
    id,
    entityType: params.entityType,
    format: params.format,
    fileName: params.fileName,
    fileSize: params.fileSize,
    mappings: params.mappings,
    options: params.options,
    status: 'pending',
    progress: {
      totalRows: params.totalRows,
      processedRows: 0,
      successCount: 0,
      errorCount: 0,
      skippedCount: 0,
      updatedCount: 0,
      percentage: 0,
      currentBatch: 0,
      totalBatches: Math.ceil(params.totalRows / (params.options.batchSize || 50)),
    },
    results: { created: 0, updated: 0, skipped: 0, failed: 0, total: params.totalRows, duration: 0, createdIds: [], updatedIds: [] },
    errors: [],
    createdBy: params.createdBy,
    createdAt: new Date().toISOString(),
  };

  await setDoc(doc(db, IMPORT_JOBS_COL, id), job);
  return job;
}

export async function getImportJob(jobId: string): Promise<ImportJob | null> {
  const snap = await getDoc(doc(db, IMPORT_JOBS_COL, jobId));
  return snap.exists() ? (snap.data() as ImportJob) : null;
}

export async function listImportJobs(userId?: string): Promise<ImportJob[]> {
  let q = query(collection(db, IMPORT_JOBS_COL));
  if (userId) q = query(q, where('createdBy', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as ImportJob).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
```

---

### File 81-3: `src/app/api/import/route.ts`

```typescript
// ============================================================================
// GRATIS.NGO — Data Import API Routes
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  previewImport, createImportJob, executeImport, getImportJob,
  listImportJobs, parseCSV, parseJSON,
} from '@/lib/import/import-service';

// GET /api/import — List import jobs
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const jobId = searchParams.get('jobId');

  if (jobId) {
    const job = await getImportJob(jobId);
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    return NextResponse.json({ job });
  }

  const userId = searchParams.get('userId') || undefined;
  const jobs = await listImportJobs(userId);
  return NextResponse.json({ jobs });
}

// POST /api/import — Preview or execute import
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const action = formData.get('action') as string;
    const entityType = formData.get('entityType') as string;
    const format = (formData.get('format') as string) || 'csv';

    if (action === 'preview') {
      const file = formData.get('file') as File;
      if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

      const text = await file.text();
      const delimiter = formData.get('delimiter') as string || ',';
      const preview = previewImport(text, format as 'csv' | 'json', entityType as any, delimiter);

      return NextResponse.json({ preview });
    }

    if (action === 'execute') {
      const file = formData.get('file') as File;
      const mappingsStr = formData.get('mappings') as string;
      const optionsStr = formData.get('options') as string;
      const userId = formData.get('userId') as string;

      if (!file || !mappingsStr || !optionsStr) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const mappings = JSON.parse(mappingsStr);
      const options = JSON.parse(optionsStr);
      const text = await file.text();
      const { rows } = format === 'csv' ? parseCSV(text, options.delimiter) : parseJSON(text);

      const job = await createImportJob({
        entityType: entityType as any,
        format: format as 'csv' | 'json',
        fileName: file.name,
        fileSize: file.size,
        mappings,
        options,
        totalRows: rows.length,
        createdBy: userId,
      });

      // Execute asynchronously (in production, use a queue)
      executeImport(job.id, rows, mappings, options, entityType as any).catch(console.error);

      return NextResponse.json({ job, message: 'Import started' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

---

### File 81-4: `src/components/import/DataImportWizard.tsx`

```typescript
// ============================================================================
// GRATIS.NGO — Multi-Step Data Import Wizard
// ============================================================================

'use client';

import React, { useState } from 'react';
import {
  Upload, ArrowRight, ArrowLeft, Check, AlertCircle, Loader2,
  FileText, Settings, Columns, Play, CheckCircle2,
} from 'lucide-react';
import { ImportPreview, ImportMapping, ImportEntityType, ENTITY_FIELDS } from '@/types/data-import';

type WizardStep = 'upload' | 'preview' | 'mapping' | 'options' | 'execute' | 'results';

interface DataImportWizardProps {
  userId: string;
  onComplete?: () => void;
}

export default function DataImportWizard({ userId, onComplete }: DataImportWizardProps) {
  const [step, setStep] = useState<WizardStep>('upload');
  const [entityType, setEntityType] = useState<ImportEntityType>('contacts');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [mappings, setMappings] = useState<ImportMapping[]>([]);
  const [options, setOptions] = useState({
    duplicateHandling: 'skip' as 'skip' | 'update' | 'create_new',
    duplicateField: 'email',
    batchSize: 50,
    dryRun: false,
    sendNotifications: false,
    skipEmptyRows: true,
    headerRow: 0,
    delimiter: ',',
  });
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);

  const steps: { key: WizardStep; label: string; icon: React.ReactNode }[] = [
    { key: 'upload', label: 'Upload', icon: <Upload className="w-4 h-4" /> },
    { key: 'preview', label: 'Preview', icon: <FileText className="w-4 h-4" /> },
    { key: 'mapping', label: 'Mapping', icon: <Columns className="w-4 h-4" /> },
    { key: 'options', label: 'Options', icon: <Settings className="w-4 h-4" /> },
    { key: 'execute', label: 'Import', icon: <Play className="w-4 h-4" /> },
    { key: 'results', label: 'Results', icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  async function handlePreview() {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('action', 'preview');
      formData.append('entityType', entityType);
      formData.append('file', file);
      formData.append('format', file.name.endsWith('.json') ? 'json' : 'csv');
      formData.append('delimiter', options.delimiter);

      const res = await fetch('/api/import', { method: 'POST', body: formData });
      const data = await res.json();
      setPreview(data.preview);
      setMappings(data.preview.suggestedMappings);
      setStep('preview');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleExecute() {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('action', 'execute');
      formData.append('entityType', entityType);
      formData.append('file', file);
      formData.append('format', file.name.endsWith('.json') ? 'json' : 'csv');
      formData.append('mappings', JSON.stringify(mappings));
      formData.append('options', JSON.stringify(options));
      formData.append('userId', userId);

      const res = await fetch('/api/import', { method: 'POST', body: formData });
      const data = await res.json();
      setJobId(data.job.id);
      setStep('results');

      // Poll for results
      const pollInterval = setInterval(async () => {
        const jobRes = await fetch(`/api/import?jobId=${data.job.id}`);
        const jobData = await jobRes.json();
        if (jobData.job.status === 'completed' || jobData.job.status === 'failed') {
          setResults(jobData.job);
          clearInterval(pollInterval);
          setLoading(false);
        }
      }, 2000);
    } catch (err: any) {
      alert(err.message);
      setLoading(false);
    }
  }

  const entityOptions: { value: ImportEntityType; label: string }[] = [
    { value: 'contacts', label: 'Contacts' },
    { value: 'donations', label: 'Donations' },
    { value: 'donors', label: 'Donors' },
    { value: 'events', label: 'Events' },
    { value: 'projects', label: 'Projects' },
    { value: 'partners', label: 'Partners' },
    { value: 'volunteers', label: 'Volunteers' },
    { value: 'subscribers', label: 'Subscribers' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <React.Fragment key={s.key}>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap ${step === s.key ? 'bg-emerald-600 text-white' : steps.findIndex((x) => x.key === step) > i ? 'bg-emerald-600/20 text-emerald-400' : 'bg-gray-800 text-gray-400'}`}>
              {s.icon} {s.label}
            </div>
            {i < steps.length - 1 && <ArrowRight className="w-4 h-4 text-gray-600 flex-shrink-0" />}
          </React.Fragment>
        ))}
      </div>

      {/* Step: Upload */}
      {step === 'upload' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Data Type</label>
            <select value={entityType} onChange={(e) => setEntityType(e.target.value as ImportEntityType)} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white">
              {entityOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Upload File</label>
            <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-gray-400 transition" onClick={() => document.getElementById('import-file')?.click()}>
              <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
              <p className="text-sm text-gray-300">{file ? file.name : 'Click to select CSV or JSON file'}</p>
              <input id="import-file" type="file" accept=".csv,.json,.xlsx" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>
          </div>
          <button onClick={handlePreview} disabled={!file || loading} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg transition">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />} Preview Data
          </button>
        </div>
      )}

      {/* Step: Preview */}
      {step === 'preview' && preview && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-300">Found <span className="text-white font-bold">{preview.totalRows}</span> rows with <span className="text-white font-bold">{preview.headers.length}</span> columns</p>
            {preview.validationIssues.length > 0 && (
              <p className="text-sm text-yellow-400 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {preview.validationIssues.length} issues</p>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">{preview.headers.map((h) => <th key={h} className="px-3 py-2 text-left text-gray-400 font-medium">{h}</th>)}</tr>
              </thead>
              <tbody>
                {preview.sampleRows.slice(0, 5).map((row, i) => (
                  <tr key={i} className="border-b border-gray-800">{preview.headers.map((h) => <td key={h} className="px-3 py-2 text-gray-300 truncate max-w-[200px]">{row[h]}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep('upload')} className="flex items-center gap-2 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800"><ArrowLeft className="w-4 h-4" /> Back</button>
            <button onClick={() => setStep('mapping')} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">Configure Mapping <ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* Step: Mapping */}
      {step === 'mapping' && preview && (
        <div className="space-y-4">
          <p className="text-sm text-gray-400">Map source columns to {entityType} fields:</p>
          {ENTITY_FIELDS[entityType].map((field) => {
            const mapping = mappings.find((m) => m.targetField === field.name);
            return (
              <div key={field.name} className="flex items-center gap-4">
                <div className="w-1/3">
                  <span className="text-sm text-white">{field.label} {field.required && <span className="text-red-400">*</span>}</span>
                </div>
                <ArrowLeft className="w-4 h-4 text-gray-500" />
                <select
                  value={mapping?.sourceColumn || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setMappings((prev) => {
                      const filtered = prev.filter((m) => m.targetField !== field.name);
                      if (val) filtered.push({ sourceColumn: val, targetField: field.name, required: field.required, transform: 'trim' });
                      return filtered;
                    });
                  }}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm"
                >
                  <option value="">— Skip —</option>
                  {preview.headers.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            );
          })}
          <div className="flex gap-3">
            <button onClick={() => setStep('preview')} className="flex items-center gap-2 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800"><ArrowLeft className="w-4 h-4" /> Back</button>
            <button onClick={() => setStep('options')} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">Options <ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* Step: Options */}
      {step === 'options' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Duplicate Handling</label>
            <select value={options.duplicateHandling} onChange={(e) => setOptions({ ...options, duplicateHandling: e.target.value as any })} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm">
              <option value="skip">Skip duplicates</option>
              <option value="update">Update existing records</option>
              <option value="create_new">Create new (allow duplicates)</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="dryRun" checked={options.dryRun} onChange={(e) => setOptions({ ...options, dryRun: e.target.checked })} className="rounded" />
            <label htmlFor="dryRun" className="text-sm text-gray-300">Dry run (validate without importing)</label>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep('mapping')} className="flex items-center gap-2 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800"><ArrowLeft className="w-4 h-4" /> Back</button>
            <button onClick={() => setStep('execute')} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">Review & Import <ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* Step: Execute */}
      {step === 'execute' && (
        <div className="space-y-4">
          <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 space-y-2">
            <p className="text-sm text-gray-300">Entity: <span className="text-white font-medium">{entityType}</span></p>
            <p className="text-sm text-gray-300">File: <span className="text-white font-medium">{file?.name}</span></p>
            <p className="text-sm text-gray-300">Rows: <span className="text-white font-medium">{preview?.totalRows}</span></p>
            <p className="text-sm text-gray-300">Mappings: <span className="text-white font-medium">{mappings.length} fields</span></p>
            <p className="text-sm text-gray-300">Mode: <span className="text-white font-medium">{options.dryRun ? 'Dry Run' : 'Live Import'}</span></p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep('options')} className="flex items-center gap-2 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800"><ArrowLeft className="w-4 h-4" /> Back</button>
            <button onClick={handleExecute} disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />} {options.dryRun ? 'Run Validation' : 'Start Import'}
            </button>
          </div>
        </div>
      )}

      {/* Step: Results */}
      {step === 'results' && (
        <div className="space-y-4">
          {!results ? (
            <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto" /><p className="text-gray-400 mt-3">Processing import...</p></div>
          ) : (
            <>
              <div className={`p-4 rounded-lg border ${results.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                <p className={`text-lg font-bold ${results.status === 'completed' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {results.status === 'completed' ? 'Import Complete!' : 'Import Failed'}
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-emerald-400">{results.results.created}</p>
                  <p className="text-xs text-gray-400">Created</p>
                </div>
                <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-blue-400">{results.results.updated}</p>
                  <p className="text-xs text-gray-400">Updated</p>
                </div>
                <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-yellow-400">{results.results.skipped}</p>
                  <p className="text-xs text-gray-400">Skipped</p>
                </div>
                <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-red-400">{results.results.failed}</p>
                  <p className="text-xs text-gray-400">Failed</p>
                </div>
              </div>
              {results.errors?.length > 0 && (
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {results.errors.slice(0, 20).map((err: any, i: number) => (
                    <p key={i} className="text-xs text-red-400">Row {err.row}: {err.message}</p>
                  ))}
                </div>
              )}
              <button onClick={() => { setStep('upload'); setFile(null); setPreview(null); onComplete?.(); }} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">
                Import More Data
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
## SECTION 82 — BULK OPERATIONS & BATCH PROCESSING
# ═══════════════════════════════════════════════════════════════════════════════

### File 82-1: `src/types/bulk-operations.ts`

```typescript
// ============================================================================
// GRATIS.NGO — Bulk Operations Type Definitions
// ============================================================================

export type BulkOperationType =
  | 'update'
  | 'delete'
  | 'archive'
  | 'unarchive'
  | 'assign'
  | 'tag'
  | 'untag'
  | 'export'
  | 'email'
  | 'change_status'
  | 'merge';

export type BulkEntityType =
  | 'contacts'
  | 'donations'
  | 'projects'
  | 'events'
  | 'partners'
  | 'volunteers'
  | 'subscribers'
  | 'tickets';

export interface BulkOperation {
  id: string;
  type: BulkOperationType;
  entityType: BulkEntityType;
  targetIds: string[];
  params: Record<string, any>;
  status: BulkOperationStatus;
  progress: BulkProgress;
  results: BulkResults;
  errors: BulkError[];
  createdBy: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  undoAvailable: boolean;
  undoExpiry?: string;
}

export type BulkOperationStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'undone';

export interface BulkProgress {
  total: number;
  processed: number;
  succeeded: number;
  failed: number;
  percentage: number;
}

export interface BulkResults {
  affectedCount: number;
  affectedIds: string[];
  duration: number;
  previousValues?: Record<string, any>[]; // For undo
}

export interface BulkError {
  targetId: string;
  message: string;
  code?: string;
}

export interface BulkOperationConfig {
  type: BulkOperationType;
  label: string;
  description: string;
  icon: string;
  requiresConfirmation: boolean;
  allowUndo: boolean;
  maxTargets: number;
  paramFields?: { name: string; label: string; type: 'text' | 'select' | 'tags'; options?: string[] }[];
}

export const BULK_OPERATION_CONFIGS: Record<BulkOperationType, BulkOperationConfig> = {
  update:        { type: 'update', label: 'Bulk Update', description: 'Update fields on selected records', icon: '✏️', requiresConfirmation: true, allowUndo: true, maxTargets: 5000 },
  delete:        { type: 'delete', label: 'Bulk Delete', description: 'Permanently delete selected records', icon: '🗑️', requiresConfirmation: true, allowUndo: false, maxTargets: 1000 },
  archive:       { type: 'archive', label: 'Archive', description: 'Archive selected records', icon: '📦', requiresConfirmation: false, allowUndo: true, maxTargets: 5000 },
  unarchive:     { type: 'unarchive', label: 'Unarchive', description: 'Restore archived records', icon: '📤', requiresConfirmation: false, allowUndo: true, maxTargets: 5000 },
  assign:        { type: 'assign', label: 'Assign', description: 'Assign to a team member', icon: '👤', requiresConfirmation: false, allowUndo: true, maxTargets: 5000, paramFields: [{ name: 'assignee', label: 'Assign To', type: 'select' }] },
  tag:           { type: 'tag', label: 'Add Tags', description: 'Add tags to selected records', icon: '🏷️', requiresConfirmation: false, allowUndo: true, maxTargets: 10000, paramFields: [{ name: 'tags', label: 'Tags', type: 'tags' }] },
  untag:         { type: 'untag', label: 'Remove Tags', description: 'Remove tags from selected records', icon: '🏷️', requiresConfirmation: false, allowUndo: true, maxTargets: 10000, paramFields: [{ name: 'tags', label: 'Tags to Remove', type: 'tags' }] },
  export:        { type: 'export', label: 'Export', description: 'Export selected records', icon: '📥', requiresConfirmation: false, allowUndo: false, maxTargets: 50000 },
  email:         { type: 'email', label: 'Send Email', description: 'Send email to selected contacts', icon: '📧', requiresConfirmation: true, allowUndo: false, maxTargets: 5000, paramFields: [{ name: 'templateId', label: 'Email Template', type: 'select' }] },
  change_status: { type: 'change_status', label: 'Change Status', description: 'Update status of selected records', icon: '🔄', requiresConfirmation: true, allowUndo: true, maxTargets: 5000, paramFields: [{ name: 'status', label: 'New Status', type: 'select' }] },
  merge:         { type: 'merge', label: 'Merge', description: 'Merge duplicate records', icon: '🔗', requiresConfirmation: true, allowUndo: false, maxTargets: 100 },
};
```

---

### File 82-2: `src/lib/bulk/bulk-operation-service.ts`

```typescript
// ============================================================================
// GRATIS.NGO — Bulk Operation Execution Engine
// ============================================================================

import { db } from '@/lib/firebase/config';
import {
  doc, setDoc, getDoc, updateDoc, deleteDoc,
  collection, getDocs, query, where, writeBatch,
} from 'firebase/firestore';
import {
  BulkOperation, BulkOperationType, BulkEntityType,
  BulkOperationStatus, BulkProgress, BulkResults, BulkError,
  BULK_OPERATION_CONFIGS,
} from '@/types/bulk-operations';

const BULK_OPS_COL = 'bulk_operations';

// ── Create & Execute ─────────────────────────────────────────────────────────

export async function createBulkOperation(params: {
  type: BulkOperationType;
  entityType: BulkEntityType;
  targetIds: string[];
  operationParams: Record<string, any>;
  createdBy: string;
}): Promise<BulkOperation> {
  const config = BULK_OPERATION_CONFIGS[params.type];

  if (params.targetIds.length > config.maxTargets) {
    throw new Error(`Maximum ${config.maxTargets} records for ${config.label} operation.`);
  }

  const id = `bulk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const op: BulkOperation = {
    id,
    type: params.type,
    entityType: params.entityType,
    targetIds: params.targetIds,
    params: params.operationParams,
    status: 'pending',
    progress: { total: params.targetIds.length, processed: 0, succeeded: 0, failed: 0, percentage: 0 },
    results: { affectedCount: 0, affectedIds: [], duration: 0 },
    errors: [],
    createdBy: params.createdBy,
    createdAt: new Date().toISOString(),
    undoAvailable: config.allowUndo,
    undoExpiry: config.allowUndo ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : undefined,
  };

  await setDoc(doc(db, BULK_OPS_COL, id), op);
  return op;
}

export async function executeBulkOperation(opId: string): Promise<BulkResults> {
  const op = await getBulkOperation(opId);
  if (!op) throw new Error('Operation not found');

  await updateDoc(doc(db, BULK_OPS_COL, opId), {
    status: 'processing',
    startedAt: new Date().toISOString(),
  });

  const startTime = Date.now();
  const errors: BulkError[] = [];
  const affectedIds: string[] = [];
  const previousValues: Record<string, any>[] = [];
  let succeeded = 0;
  let failed = 0;
  const batchSize = 50;

  for (let i = 0; i < op.targetIds.length; i += batchSize) {
    const batch = op.targetIds.slice(i, i + batchSize);

    for (const targetId of batch) {
      try {
        const result = await processRecord(op.entityType, targetId, op.type, op.params);
        if (result.previousValue) previousValues.push({ id: targetId, ...result.previousValue });
        affectedIds.push(targetId);
        succeeded++;
      } catch (error: any) {
        errors.push({ targetId, message: error.message });
        failed++;
      }
    }

    // Update progress
    const processed = Math.min(i + batchSize, op.targetIds.length);
    await updateDoc(doc(db, BULK_OPS_COL, opId), {
      'progress.processed': processed,
      'progress.succeeded': succeeded,
      'progress.failed': failed,
      'progress.percentage': Math.round((processed / op.targetIds.length) * 100),
    });
  }

  const duration = Date.now() - startTime;
  const results: BulkResults = {
    affectedCount: affectedIds.length,
    affectedIds,
    duration,
    previousValues: previousValues.length > 0 ? previousValues : undefined,
  };

  await updateDoc(doc(db, BULK_OPS_COL, opId), {
    status: failed > 0 && succeeded === 0 ? 'failed' : 'completed',
    results,
    errors: errors.slice(0, 500),
    completedAt: new Date().toISOString(),
  });

  return results;
}

// ── Process Single Record ────────────────────────────────────────────────────

async function processRecord(
  entityType: BulkEntityType,
  targetId: string,
  operationType: BulkOperationType,
  params: Record<string, any>
): Promise<{ previousValue?: Record<string, any> }> {
  const docRef = doc(db, entityType, targetId);
  const snap = await getDoc(docRef);

  if (!snap.exists()) throw new Error('Record not found');
  const current = snap.data();

  switch (operationType) {
    case 'update':
      await updateDoc(docRef, { ...params.fields, updatedAt: new Date().toISOString() });
      return { previousValue: Object.fromEntries(Object.keys(params.fields).map((k) => [k, current[k]])) };

    case 'delete':
      await deleteDoc(docRef);
      return { previousValue: current };

    case 'archive':
      await updateDoc(docRef, { archived: true, archivedAt: new Date().toISOString() });
      return { previousValue: { archived: current.archived } };

    case 'unarchive':
      await updateDoc(docRef, { archived: false, archivedAt: null });
      return { previousValue: { archived: true } };

    case 'assign':
      await updateDoc(docRef, { assignedTo: params.assignee, updatedAt: new Date().toISOString() });
      return { previousValue: { assignedTo: current.assignedTo } };

    case 'tag':
      const currentTags = current.tags || [];
      const newTags = [...new Set([...currentTags, ...(params.tags || [])])];
      await updateDoc(docRef, { tags: newTags, updatedAt: new Date().toISOString() });
      return { previousValue: { tags: currentTags } };

    case 'untag':
      const existingTags = current.tags || [];
      const filtered = existingTags.filter((t: string) => !params.tags?.includes(t));
      await updateDoc(docRef, { tags: filtered, updatedAt: new Date().toISOString() });
      return { previousValue: { tags: existingTags } };

    case 'change_status':
      await updateDoc(docRef, { status: params.status, updatedAt: new Date().toISOString() });
      return { previousValue: { status: current.status } };

    default:
      throw new Error(`Unsupported operation: ${operationType}`);
  }
}

// ── Undo ─────────────────────────────────────────────────────────────────────

export async function undoBulkOperation(opId: string): Promise<void> {
  const op = await getBulkOperation(opId);
  if (!op) throw new Error('Operation not found');
  if (!op.undoAvailable) throw new Error('Undo not available for this operation');
  if (op.undoExpiry && new Date(op.undoExpiry) < new Date()) throw new Error('Undo window expired');
  if (!op.results.previousValues?.length) throw new Error('No undo data available');

  for (const prev of op.results.previousValues) {
    const { id, ...values } = prev;
    try {
      await updateDoc(doc(db, op.entityType, id), { ...values, updatedAt: new Date().toISOString() });
    } catch { /* skip records that no longer exist */ }
  }

  await updateDoc(doc(db, BULK_OPS_COL, opId), { status: 'undone', undoAvailable: false });
}

// ── Query ────────────────────────────────────────────────────────────────────

export async function getBulkOperation(opId: string): Promise<BulkOperation | null> {
  const snap = await getDoc(doc(db, BULK_OPS_COL, opId));
  return snap.exists() ? (snap.data() as BulkOperation) : null;
}

export async function listBulkOperations(userId?: string): Promise<BulkOperation[]> {
  let q = query(collection(db, BULK_OPS_COL));
  if (userId) q = query(q, where('createdBy', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as BulkOperation).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
```

---

### File 82-3: `src/app/api/bulk/route.ts`

```typescript
// ============================================================================
// GRATIS.NGO — Bulk Operations API Routes
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  createBulkOperation, executeBulkOperation, undoBulkOperation,
  getBulkOperation, listBulkOperations,
} from '@/lib/bulk/bulk-operation-service';

// GET /api/bulk — List or get operations
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const opId = searchParams.get('id');

  if (opId) {
    const op = await getBulkOperation(opId);
    if (!op) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ operation: op });
  }

  const userId = searchParams.get('userId') || undefined;
  const ops = await listBulkOperations(userId);
  return NextResponse.json({ operations: ops });
}

// POST /api/bulk — Create & execute, or undo
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action } = body;

  if (action === 'undo') {
    const { operationId } = body;
    await undoBulkOperation(operationId);
    return NextResponse.json({ success: true, message: 'Operation undone' });
  }

  // Create and execute
  const { type, entityType, targetIds, params: opParams, userId } = body;

  if (!type || !entityType || !targetIds?.length || !userId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const op = await createBulkOperation({
    type,
    entityType,
    targetIds,
    operationParams: opParams || {},
    createdBy: userId,
  });

  // Execute asynchronously
  executeBulkOperation(op.id).catch(console.error);

  return NextResponse.json({ operation: op, message: 'Bulk operation started' });
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
## SECTION 83 — CUSTOM DASHBOARD BUILDER (WIDGET SYSTEM)
# ═══════════════════════════════════════════════════════════════════════════════

### File 83-1: `src/types/dashboard-builder.ts`

```typescript
// ============================================================================
// GRATIS.NGO — Custom Dashboard Builder Type Definitions
// ============================================================================

export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  visibility: 'private' | 'team' | 'public';
  layout: DashboardLayout;
  widgets: DashboardWidget[];
  theme: DashboardTheme;
  refreshInterval?: number;        // Seconds; 0 = manual only
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardLayout {
  type: 'grid' | 'freeform';
  columns: number;                 // 1-12
  rows?: number;
  gap: number;                     // px
  padding: number;
}

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  position: WidgetPosition;
  config: WidgetConfig;
  dataSource: WidgetDataSource;
  style?: WidgetStyle;
  visible: boolean;
  refreshInterval?: number;
}

export interface WidgetPosition {
  x: number;                       // Grid column
  y: number;                       // Grid row
  width: number;                   // Columns span
  height: number;                  // Rows span
}

export type WidgetType =
  | 'metric'
  | 'chart_line'
  | 'chart_bar'
  | 'chart_pie'
  | 'chart_area'
  | 'chart_donut'
  | 'table'
  | 'list'
  | 'progress'
  | 'countdown'
  | 'text'
  | 'image'
  | 'feed'
  | 'map'
  | 'funnel';

export interface WidgetConfig {
  // Metric
  metric?: {
    value: string;               // Field path or aggregation
    label: string;
    prefix?: string;             // e.g. '€'
    suffix?: string;             // e.g. '%'
    comparison?: 'previous_period' | 'previous_year' | 'target';
    target?: number;
    format?: 'number' | 'currency' | 'percentage';
  };
  // Chart
  chart?: {
    xAxis: string;
    yAxis: string[];
    groupBy?: string;
    colors?: string[];
    stacked?: boolean;
    showLegend?: boolean;
    showGrid?: boolean;
    timeRange?: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  };
  // Table
  table?: {
    columns: { field: string; label: string; width?: number; sortable?: boolean }[];
    pageSize?: number;
    sortField?: string;
    sortDirection?: 'asc' | 'desc';
  };
  // Progress
  progress?: {
    current: number;
    target: number;
    label: string;
    color?: string;
  };
  // Text / Markdown
  text?: {
    content: string;
    format: 'plain' | 'markdown' | 'html';
  };
  // Countdown
  countdown?: {
    targetDate: string;
    label: string;
    completedMessage?: string;
  };
}

export interface WidgetDataSource {
  type: 'firestore' | 'api' | 'static' | 'computed';
  collection?: string;
  filters?: { field: string; operator: string; value: any }[];
  aggregation?: 'count' | 'sum' | 'avg' | 'min' | 'max';
  aggregationField?: string;
  timeField?: string;
  timeRange?: { start: string; end: string };
  apiEndpoint?: string;
  staticData?: any;
  limit?: number;
}

export interface WidgetStyle {
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderRadius?: number;
  padding?: number;
  shadow?: boolean;
}

export interface DashboardTheme {
  name: string;
  backgroundColor: string;
  cardBackground: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
}

export const DEFAULT_THEMES: Record<string, DashboardTheme> = {
  dark: {
    name: 'Dark',
    backgroundColor: '#0f172a',
    cardBackground: '#1e293b',
    textPrimary: '#f1f5f9',
    textSecondary: '#94a3b8',
    accent: '#10b981',
    success: '#22c55e',
    warning: '#eab308',
    danger: '#ef4444',
  },
  light: {
    name: 'Light',
    backgroundColor: '#f8fafc',
    cardBackground: '#ffffff',
    textPrimary: '#0f172a',
    textSecondary: '#64748b',
    accent: '#059669',
    success: '#16a34a',
    warning: '#ca8a04',
    danger: '#dc2626',
  },
  ngo: {
    name: 'NGO Green',
    backgroundColor: '#022c22',
    cardBackground: '#064e3b',
    textPrimary: '#ecfdf5',
    textSecondary: '#6ee7b7',
    accent: '#34d399',
    success: '#4ade80',
    warning: '#fbbf24',
    danger: '#f87171',
  },
};

// Widget type presets
export const WIDGET_PRESETS: { type: WidgetType; label: string; icon: string; defaultSize: { width: number; height: number } }[] = [
  { type: 'metric',     label: 'Metric Card',    icon: '📊', defaultSize: { width: 3, height: 2 } },
  { type: 'chart_line', label: 'Line Chart',     icon: '📈', defaultSize: { width: 6, height: 4 } },
  { type: 'chart_bar',  label: 'Bar Chart',      icon: '📊', defaultSize: { width: 6, height: 4 } },
  { type: 'chart_pie',  label: 'Pie Chart',      icon: '🥧', defaultSize: { width: 4, height: 4 } },
  { type: 'chart_area', label: 'Area Chart',     icon: '🏔️', defaultSize: { width: 6, height: 4 } },
  { type: 'chart_donut',label: 'Donut Chart',    icon: '🍩', defaultSize: { width: 4, height: 4 } },
  { type: 'table',      label: 'Data Table',     icon: '📋', defaultSize: { width: 12, height: 5 } },
  { type: 'list',       label: 'List',           icon: '📝', defaultSize: { width: 4, height: 4 } },
  { type: 'progress',   label: 'Progress Bar',   icon: '🎯', defaultSize: { width: 4, height: 2 } },
  { type: 'countdown',  label: 'Countdown',      icon: '⏳', defaultSize: { width: 3, height: 2 } },
  { type: 'text',       label: 'Text Block',     icon: '📝', defaultSize: { width: 6, height: 3 } },
  { type: 'feed',       label: 'Activity Feed',  icon: '📰', defaultSize: { width: 4, height: 5 } },
  { type: 'funnel',     label: 'Funnel',         icon: '📉', defaultSize: { width: 6, height: 4 } },
];
```

---

### File 83-2: `src/lib/dashboards/dashboard-service.ts`

```typescript
// ============================================================================
// GRATIS.NGO — Dashboard CRUD & Widget Data Service
// ============================================================================

import { db } from '@/lib/firebase/config';
import {
  doc, setDoc, getDoc, updateDoc, deleteDoc,
  collection, getDocs, query, where, orderBy,
  getCountFromServer, limit as firestoreLimit,
} from 'firebase/firestore';
import {
  Dashboard, DashboardWidget, WidgetDataSource,
  DEFAULT_THEMES, DashboardLayout,
} from '@/types/dashboard-builder';

const DASHBOARDS_COL = 'dashboards';

// ── Dashboard CRUD ───────────────────────────────────────────────────────────

export async function createDashboard(params: {
  name: string;
  description?: string;
  ownerId: string;
  visibility?: 'private' | 'team' | 'public';
  theme?: string;
}): Promise<Dashboard> {
  const id = `dash_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const dashboard: Dashboard = {
    id,
    name: params.name,
    description: params.description,
    ownerId: params.ownerId,
    visibility: params.visibility || 'private',
    layout: { type: 'grid', columns: 12, gap: 16, padding: 24 },
    widgets: [],
    theme: DEFAULT_THEMES[params.theme || 'dark'],
    refreshInterval: 300,
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(doc(db, DASHBOARDS_COL, id), dashboard);
  return dashboard;
}

export async function getDashboard(id: string): Promise<Dashboard | null> {
  const snap = await getDoc(doc(db, DASHBOARDS_COL, id));
  return snap.exists() ? (snap.data() as Dashboard) : null;
}

export async function listDashboards(userId: string): Promise<Dashboard[]> {
  const q = query(collection(db, DASHBOARDS_COL), where('ownerId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Dashboard).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function updateDashboard(id: string, updates: Partial<Dashboard>): Promise<void> {
  await updateDoc(doc(db, DASHBOARDS_COL, id), { ...updates, updatedAt: new Date().toISOString() });
}

export async function deleteDashboard(id: string): Promise<void> {
  await deleteDoc(doc(db, DASHBOARDS_COL, id));
}

// ── Widget Management ────────────────────────────────────────────────────────

export async function addWidget(dashboardId: string, widget: DashboardWidget): Promise<void> {
  const dashboard = await getDashboard(dashboardId);
  if (!dashboard) throw new Error('Dashboard not found');

  const widgets = [...dashboard.widgets, widget];
  await updateDoc(doc(db, DASHBOARDS_COL, dashboardId), { widgets, updatedAt: new Date().toISOString() });
}

export async function updateWidget(dashboardId: string, widgetId: string, updates: Partial<DashboardWidget>): Promise<void> {
  const dashboard = await getDashboard(dashboardId);
  if (!dashboard) throw new Error('Dashboard not found');

  const widgets = dashboard.widgets.map((w) =>
    w.id === widgetId ? { ...w, ...updates } : w
  );
  await updateDoc(doc(db, DASHBOARDS_COL, dashboardId), { widgets, updatedAt: new Date().toISOString() });
}

export async function removeWidget(dashboardId: string, widgetId: string): Promise<void> {
  const dashboard = await getDashboard(dashboardId);
  if (!dashboard) throw new Error('Dashboard not found');

  const widgets = dashboard.widgets.filter((w) => w.id !== widgetId);
  await updateDoc(doc(db, DASHBOARDS_COL, dashboardId), { widgets, updatedAt: new Date().toISOString() });
}

export async function reorderWidgets(dashboardId: string, widgetIds: string[]): Promise<void> {
  const dashboard = await getDashboard(dashboardId);
  if (!dashboard) throw new Error('Dashboard not found');

  const widgetMap = new Map(dashboard.widgets.map((w) => [w.id, w]));
  const reordered = widgetIds.map((id) => widgetMap.get(id)!).filter(Boolean);
  await updateDoc(doc(db, DASHBOARDS_COL, dashboardId), { widgets: reordered, updatedAt: new Date().toISOString() });
}

// ── Widget Data Fetching ─────────────────────────────────────────────────────

export async function fetchWidgetData(dataSource: WidgetDataSource): Promise<any> {
  if (dataSource.type === 'static') return dataSource.staticData;

  if (dataSource.type === 'api' && dataSource.apiEndpoint) {
    const res = await fetch(dataSource.apiEndpoint);
    return res.json();
  }

  if (dataSource.type === 'firestore' && dataSource.collection) {
    let q = query(collection(db, dataSource.collection));

    // Apply filters
    if (dataSource.filters) {
      for (const filter of dataSource.filters) {
        q = query(q, where(filter.field, filter.operator as any, filter.value));
      }
    }

    // Time range filter
    if (dataSource.timeField && dataSource.timeRange) {
      q = query(q,
        where(dataSource.timeField, '>=', dataSource.timeRange.start),
        where(dataSource.timeField, '<=', dataSource.timeRange.end)
      );
    }

    // Aggregation
    if (dataSource.aggregation === 'count') {
      const snap = await getCountFromServer(q);
      return { value: snap.data().count };
    }

    // Get documents
    if (dataSource.limit) q = query(q, firestoreLimit(dataSource.limit));
    const snap = await getDocs(q);
    const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Apply aggregation
    if (dataSource.aggregation && dataSource.aggregationField) {
      const values = docs.map((d: any) => parseFloat(d[dataSource.aggregationField!]) || 0);
      switch (dataSource.aggregation) {
        case 'sum': return { value: values.reduce((a, b) => a + b, 0) };
        case 'avg': return { value: values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0 };
        case 'min': return { value: Math.min(...values) };
        case 'max': return { value: Math.max(...values) };
      }
    }

    return docs;
  }

  return null;
}
```

---

### File 83-3: `src/app/api/dashboards/route.ts`

```typescript
// ============================================================================
// GRATIS.NGO — Dashboard API Routes
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  createDashboard, getDashboard, listDashboards,
  updateDashboard, deleteDashboard,
  addWidget, updateWidget, removeWidget,
  fetchWidgetData,
} from '@/lib/dashboards/dashboard-service';

// GET /api/dashboards
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get('id');
  const userId = searchParams.get('userId');
  const widgetId = searchParams.get('widgetId');

  if (id && widgetId) {
    // Fetch widget data
    const dashboard = await getDashboard(id);
    if (!dashboard) return NextResponse.json({ error: 'Dashboard not found' }, { status: 404 });
    const widget = dashboard.widgets.find((w) => w.id === widgetId);
    if (!widget) return NextResponse.json({ error: 'Widget not found' }, { status: 404 });
    const data = await fetchWidgetData(widget.dataSource);
    return NextResponse.json({ data });
  }

  if (id) {
    const dashboard = await getDashboard(id);
    if (!dashboard) return NextResponse.json({ error: 'Dashboard not found' }, { status: 404 });
    return NextResponse.json({ dashboard });
  }

  if (userId) {
    const dashboards = await listDashboards(userId);
    return NextResponse.json({ dashboards });
  }

  return NextResponse.json({ error: 'userId or id required' }, { status: 400 });
}

// POST /api/dashboards
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action } = body;

  if (action === 'create') {
    const dashboard = await createDashboard(body);
    return NextResponse.json({ dashboard });
  }

  if (action === 'add_widget') {
    const { dashboardId, widget } = body;
    await addWidget(dashboardId, widget);
    return NextResponse.json({ success: true });
  }

  if (action === 'update_widget') {
    const { dashboardId, widgetId, updates } = body;
    await updateWidget(dashboardId, widgetId, updates);
    return NextResponse.json({ success: true });
  }

  if (action === 'remove_widget') {
    const { dashboardId, widgetId } = body;
    await removeWidget(dashboardId, widgetId);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}

// PATCH /api/dashboards
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  await updateDashboard(id, updates);
  return NextResponse.json({ success: true });
}

// DELETE /api/dashboards
export async function DELETE(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  await deleteDashboard(id);
  return NextResponse.json({ success: true });
}
```

---

### File 83-4: `src/components/dashboards/WidgetRenderer.tsx`

```typescript
// ============================================================================
// GRATIS.NGO — Universal Widget Renderer Component
// ============================================================================

'use client';

import React, { useEffect, useState } from 'react';
import { DashboardWidget, DashboardTheme } from '@/types/dashboard-builder';
import { RefreshCw, Settings, Trash2, GripVertical, Loader2, TrendingUp, TrendingDown } from 'lucide-react';

interface WidgetRendererProps {
  widget: DashboardWidget;
  dashboardId: string;
  theme: DashboardTheme;
  isEditing?: boolean;
  onEdit?: (widgetId: string) => void;
  onRemove?: (widgetId: string) => void;
}

export default function WidgetRenderer({ widget, dashboardId, theme, isEditing, onEdit, onRemove }: WidgetRendererProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    if (widget.refreshInterval && widget.refreshInterval > 0) {
      const interval = setInterval(fetchData, widget.refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [widget.id, widget.dataSource]);

  async function fetchData() {
    try {
      setLoading(true);
      const res = await fetch(`/api/dashboards?id=${dashboardId}&widgetId=${widget.id}`);
      const json = await res.json();
      setData(json.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const style = widget.style || {};

  return (
    <div
      className="relative group rounded-xl border transition-all h-full flex flex-col"
      style={{
        backgroundColor: style.backgroundColor || theme.cardBackground,
        borderColor: style.borderColor || 'rgba(255,255,255,0.1)',
        borderRadius: style.borderRadius || 12,
        padding: style.padding || 20,
        boxShadow: style.shadow ? '0 4px 20px rgba(0,0,0,0.3)' : undefined,
        gridColumn: `span ${widget.position.width}`,
        gridRow: `span ${widget.position.height}`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold" style={{ color: theme.textPrimary }}>{widget.title}</h3>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
          <button onClick={fetchData} className="p-1 rounded hover:bg-white/10"><RefreshCw className="w-3.5 h-3.5" style={{ color: theme.textSecondary }} /></button>
          {isEditing && (
            <>
              <button onClick={() => onEdit?.(widget.id)} className="p-1 rounded hover:bg-white/10"><Settings className="w-3.5 h-3.5" style={{ color: theme.textSecondary }} /></button>
              <button onClick={() => onRemove?.(widget.id)} className="p-1 rounded hover:bg-red-500/20"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
              <div className="cursor-grab p-1 rounded hover:bg-white/10"><GripVertical className="w-3.5 h-3.5" style={{ color: theme.textSecondary }} /></div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center">
        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: theme.accent }} />
        ) : error ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : (
          <WidgetContent widget={widget} data={data} theme={theme} />
        )}
      </div>
    </div>
  );
}

// ── Widget Content Renderers ─────────────────────────────────────────────────

function WidgetContent({ widget, data, theme }: { widget: DashboardWidget; data: any; theme: DashboardTheme }) {
  switch (widget.type) {
    case 'metric':
      return <MetricWidget config={widget.config.metric!} data={data} theme={theme} />;
    case 'progress':
      return <ProgressWidget config={widget.config.progress!} theme={theme} />;
    case 'countdown':
      return <CountdownWidget config={widget.config.countdown!} theme={theme} />;
    case 'text':
      return <TextWidget config={widget.config.text!} theme={theme} />;
    case 'table':
      return <TableWidget config={widget.config.table!} data={data} theme={theme} />;
    default:
      return <p style={{ color: theme.textSecondary }} className="text-sm">Widget type: {widget.type}</p>;
  }
}

function MetricWidget({ config, data, theme }: { config: any; data: any; theme: DashboardTheme }) {
  const value = data?.value ?? 0;
  const formatted = config.format === 'currency'
    ? `${config.prefix || '€'}${value.toLocaleString()}`
    : config.format === 'percentage'
      ? `${value}${config.suffix || '%'}`
      : `${config.prefix || ''}${value.toLocaleString()}${config.suffix || ''}`;

  return (
    <div className="text-center">
      <p className="text-3xl font-bold" style={{ color: theme.textPrimary }}>{formatted}</p>
      <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>{config.label}</p>
      {config.target && (
        <div className="flex items-center justify-center gap-1 mt-2">
          {value >= config.target ? (
            <TrendingUp className="w-4 h-4" style={{ color: theme.success }} />
          ) : (
            <TrendingDown className="w-4 h-4" style={{ color: theme.danger }} />
          )}
          <span className="text-xs" style={{ color: value >= config.target ? theme.success : theme.danger }}>
            {Math.round((value / config.target) * 100)}% of target
          </span>
        </div>
      )}
    </div>
  );
}

function ProgressWidget({ config, theme }: { config: any; theme: DashboardTheme }) {
  const percentage = Math.round((config.current / config.target) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="text-sm" style={{ color: theme.textPrimary }}>{config.label}</span>
        <span className="text-sm font-bold" style={{ color: theme.accent }}>{percentage}%</span>
      </div>
      <div className="w-full h-3 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${percentage}%`, backgroundColor: config.color || theme.accent }} />
      </div>
      <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
        {config.current.toLocaleString()} / {config.target.toLocaleString()}
      </p>
    </div>
  );
}

function CountdownWidget({ config, theme }: { config: any; theme: DashboardTheme }) {
  const target = new Date(config.targetDate).getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);

  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);

  if (diff <= 0) {
    return <p className="text-lg font-bold" style={{ color: theme.success }}>{config.completedMessage || 'Time is up!'}</p>;
  }

  return (
    <div className="text-center">
      <p className="text-sm mb-2" style={{ color: theme.textSecondary }}>{config.label}</p>
      <div className="flex gap-4 justify-center">
        {[{ val: days, label: 'Days' }, { val: hours, label: 'Hours' }, { val: minutes, label: 'Min' }].map(({ val, label }) => (
          <div key={label}>
            <p className="text-2xl font-bold" style={{ color: theme.textPrimary }}>{val}</p>
            <p className="text-xs" style={{ color: theme.textSecondary }}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TextWidget({ config, theme }: { config: any; theme: DashboardTheme }) {
  return <div className="prose prose-sm" style={{ color: theme.textPrimary }} dangerouslySetInnerHTML={{ __html: config.content }} />;
}

function TableWidget({ config, data, theme }: { config: any; data: any; theme: DashboardTheme }) {
  const rows = Array.isArray(data) ? data : [];
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottomColor: 'rgba(255,255,255,0.1)' }} className="border-b">
            {config.columns.map((col: any) => (
              <th key={col.field} className="text-left px-2 py-1.5 font-medium" style={{ color: theme.textSecondary }}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, config.pageSize || 10).map((row: any, i: number) => (
            <tr key={i} style={{ borderBottomColor: 'rgba(255,255,255,0.05)' }} className="border-b">
              {config.columns.map((col: any) => (
                <td key={col.field} className="px-2 py-1.5" style={{ color: theme.textPrimary }}>{row[col.field] ?? '—'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

### File 83-5: `src/components/dashboards/DashboardView.tsx`

```typescript
// ============================================================================
// GRATIS.NGO — Dashboard View with Grid Layout
// ============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import { Dashboard } from '@/types/dashboard-builder';
import WidgetRenderer from './WidgetRenderer';
import { Plus, Edit3, Eye, Save, Layout } from 'lucide-react';

interface DashboardViewProps {
  dashboardId: string;
}

export default function DashboardView({ dashboardId }: DashboardViewProps) {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [dashboardId]);

  async function loadDashboard() {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboards?id=${dashboardId}`);
      const data = await res.json();
      setDashboard(data.dashboard);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveWidget(widgetId: string) {
    if (!confirm('Remove this widget?')) return;
    await fetch('/api/dashboards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'remove_widget', dashboardId, widgetId }),
    });
    loadDashboard();
  }

  if (loading || !dashboard) {
    return <div className="flex items-center justify-center h-64 text-gray-400">Loading dashboard...</div>;
  }

  return (
    <div style={{ backgroundColor: dashboard.theme.backgroundColor, padding: dashboard.layout.padding }} className="min-h-screen rounded-2xl">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: dashboard.theme.textPrimary }}>{dashboard.name}</h1>
          {dashboard.description && <p className="text-sm mt-0.5" style={{ color: dashboard.theme.textSecondary }}>{dashboard.description}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition"
            style={{
              backgroundColor: isEditing ? dashboard.theme.accent : 'rgba(255,255,255,0.1)',
              color: isEditing ? '#fff' : dashboard.theme.textSecondary,
            }}
          >
            {isEditing ? <><Save className="w-4 h-4" /> Done</> : <><Edit3 className="w-4 h-4" /> Edit</>}
          </button>
        </div>
      </div>

      {/* Widget Grid */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${dashboard.layout.columns}, 1fr)`,
          gap: dashboard.layout.gap,
        }}
      >
        {dashboard.widgets
          .filter((w) => w.visible)
          .map((widget) => (
            <div
              key={widget.id}
              style={{
                gridColumn: `span ${Math.min(widget.position.width, dashboard.layout.columns)}`,
                gridRow: `span ${widget.position.height}`,
              }}
            >
              <WidgetRenderer
                widget={widget}
                dashboardId={dashboardId}
                theme={dashboard.theme}
                isEditing={isEditing}
                onEdit={() => {/* open widget editor modal */}}
                onRemove={handleRemoveWidget}
              />
            </div>
          ))}

        {/* Add Widget Button (edit mode only) */}
        {isEditing && (
          <div
            className="flex items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition hover:border-opacity-60"
            style={{ borderColor: dashboard.theme.accent, minHeight: 120, gridColumn: 'span 3' }}
          >
            <div className="text-center">
              <Plus className="w-8 h-8 mx-auto" style={{ color: dashboard.theme.accent }} />
              <p className="text-sm mt-1" style={{ color: dashboard.theme.textSecondary }}>Add Widget</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

### PART 16 SUMMARY

| Section | Title | Files | Lines (approx) |
|---------|-------|-------|-----------------|
| 79 | Rate Limiting & API Throttling | 5 | ~720 |
| 80 | File Management & Cloud Storage | 6 | ~950 |
| 81 | Data Migration & Import System | 4 | ~850 |
| 82 | Bulk Operations & Batch Processing | 3 | ~500 |
| 83 | Custom Dashboard Builder | 5 | ~680 |
| **TOTAL** | | **23 files** | **~3,700 lines** |

---

*End of Part 16 — Sections 79–83*
*Continues in Part 17 — Sections 84–88*
