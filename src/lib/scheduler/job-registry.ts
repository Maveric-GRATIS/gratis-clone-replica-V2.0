// src/lib/scheduler/job-registry.ts
// Registry of scheduled job handlers (client-side mock)

import { db } from '@/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  limit as firestoreLimit,
  orderBy,
  doc,
  updateDoc,
} from 'firebase/firestore';

export type JobHandler = (config: Record<string, unknown>) => Promise<string>;

// Job handler registry
const handlers = new Map<string, JobHandler>();

/**
 * Register a job handler
 */
export function registerJobHandler(name: string, handler: JobHandler): void {
  handlers.set(name, handler);
}

/**
 * Get a registered handler
 */
export function getJobHandler(name: string): JobHandler | undefined {
  return handlers.get(name);
}

/**
 * Get all registered handler names
 */
export function getRegisteredHandlers(): string[] {
  return Array.from(handlers.keys());
}

// ── Built-in job handlers (client-side simulations) ──────────────────────────────

registerJobHandler('cleanup/expired-sessions', async () => {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const q = query(
    collection(db, 'sessions'),
    where('expiresAt', '<', cutoff),
    firestoreLimit(500)
  );
  const snap = await getDocs(q);

  const batch = writeBatch(db);
  let count = 0;
  snap.docs.forEach((docRef) => {
    batch.delete(docRef.ref);
    count++;
  });

  if (count > 0) {
    await batch.commit();
  }

  return `Cleaned up ${count} expired sessions`;
});

registerJobHandler('cleanup/expired-exports', async () => {
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const q = query(
    collection(db, 'exports'),
    where('expiresAt', '<', cutoff),
    where('status', '==', 'completed'),
    firestoreLimit(100)
  );
  const snap = await getDocs(q);

  const batch = writeBatch(db);
  let count = 0;
  snap.docs.forEach((docRef) => {
    batch.update(docRef.ref, { status: 'expired' });
    count++;
  });

  if (count > 0) {
    await batch.commit();
  }

  return `Expired ${count} export records`;
});

registerJobHandler('analytics/daily-rollup', async () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().split('T')[0];

  // Count donations
  const donationsQuery = query(
    collection(db, 'donations'),
    where('createdAt', '>=', `${dateStr}T00:00:00Z`),
    where('createdAt', '<', `${dateStr}T23:59:59Z`)
  );
  const donationsSnap = await getDocs(donationsQuery);

  let totalAmount = 0;
  donationsSnap.docs.forEach((doc) => {
    totalAmount += doc.data().amount || 0;
  });

  // Count new users
  const usersQuery = query(
    collection(db, 'users'),
    where('createdAt', '>=', `${dateStr}T00:00:00Z`),
    where('createdAt', '<', `${dateStr}T23:59:59Z`)
  );
  const usersSnap = await getDocs(usersQuery);

  return `Daily rollup for ${dateStr}: ${donationsSnap.size} donations (€${totalAmount.toFixed(
    2
  )}), ${usersSnap.size} new users`;
});

registerJobHandler('notifications/digest', async (config) => {
  const frequency = (config.frequency as string) || 'daily';
  const q = query(
    collection(db, 'users'),
    where('notificationPrefs.digest', '==', frequency),
    firestoreLimit(500)
  );
  const snap = await getDocs(q);

  return `Queued ${snap.size} ${frequency} digest emails`;
});

registerJobHandler('subscriptions/renewal-check', async () => {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const q = query(
    collection(db, 'subscriptions'),
    where('status', '==', 'active'),
    where('nextBillingDate', '==', tomorrow)
  );
  const snap = await getDocs(q);

  return `Found ${snap.size} subscriptions renewing tomorrow`;
});

registerJobHandler('moderation/auto-review', async () => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const q = query(
    collection(db, 'moderation_queue'),
    where('status', '==', 'pending'),
    where('createdAt', '<', oneHourAgo),
    firestoreLimit(100)
  );
  const snap = await getDocs(q);

  const batch = writeBatch(db);
  let autoApproved = 0;

  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    // Auto-approve items with low risk scores
    if (data.autoScore?.overall < 0.2) {
      batch.update(docSnap.ref, {
        status: 'auto_approved',
        action: 'approve',
        reviewedBy: 'system',
        reviewedAt: new Date().toISOString(),
        reviewNote: 'Auto-approved: low risk score after 1-hour review period',
      });
      autoApproved++;
    }
  }

  if (autoApproved > 0) {
    await batch.commit();
  }

  return `Auto-approved ${autoApproved} of ${snap.size} pending moderation items`;
});

registerJobHandler('test/demo', async (config) => {
  const message = (config.message as string) || 'Test job executed successfully';
  // Simulate some work
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return message;
});
