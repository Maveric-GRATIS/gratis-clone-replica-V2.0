// ============================================================================
// GRATIS.NGO — In-Memory + Firestore Rate Limit Store
// ============================================================================

import { db } from '@/firebase';
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
    for (const [key, entry] of memoryStore.entries()) {
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
      entry.burstResetAt = now + burstWindowMs;
      entry.burstCount = 0;
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
