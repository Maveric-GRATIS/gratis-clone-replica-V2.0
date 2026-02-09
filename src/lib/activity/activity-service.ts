// ============================================================================
// GRATIS.NGO — Activity Feed Service
// ============================================================================

import { db } from '@/firebase';
import {
  doc, setDoc, getDoc, updateDoc, collection, getDocs,
  query, where, orderBy, limit as firestoreLimit,
} from 'firebase/firestore';
import { ActivityEntry, ActivityType, ActivityFeedConfig, ACTIVITY_ICONS } from '@/types/activity-feed';

const ACTIVITY_COL = 'activity_feed';

// ── Create Activity Entry ────────────────────────────────────────────────────

export async function logActivity(params: {
  type: ActivityType;
  title: string;
  description: string;
  actor?: ActivityEntry['actor'];
  target?: ActivityEntry['target'];
  metadata?: Record<string, any>;
  visibility?: 'public' | 'team' | 'private';
}): Promise<ActivityEntry> {
  const iconConfig = ACTIVITY_ICONS[params.type];
  const id = `act_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const entry: ActivityEntry = {
    id,
    type: params.type,
    title: params.title,
    description: params.description,
    icon: iconConfig.icon,
    color: iconConfig.color,
    actor: params.actor,
    target: params.target,
    metadata: params.metadata,
    visibility: params.visibility || 'public',
    reactions: [],
    createdAt: new Date().toISOString(),
  };

  await setDoc(doc(db, ACTIVITY_COL, id), entry);
  return entry;
}

// ── Query Feed ───────────────────────────────────────────────────────────────

export async function getFeed(config: ActivityFeedConfig): Promise<ActivityEntry[]> {
  let q = query(collection(db, ACTIVITY_COL), orderBy('createdAt', 'desc'));

  if (config.visibility) q = query(q, where('visibility', '==', config.visibility));
  if (config.types?.length) q = query(q, where('type', 'in', config.types.slice(0, 10)));
  if (config.since) q = query(q, where('createdAt', '>=', config.since));
  if (config.limit) q = query(q, firestoreLimit(config.limit));

  const snap = await getDocs(q);
  let results = snap.docs.map((d) => d.data() as ActivityEntry);

  // Filter by user if needed
  if (config.userId) {
    results = results.filter(
      (a) => a.actor?.id === config.userId || a.target?.id === config.userId
    );
  }

  return results;
}

// ── Reactions ────────────────────────────────────────────────────────────────

export async function addReaction(activityId: string, userId: string, emoji: string): Promise<void> {
  const snap = await getDoc(doc(db, ACTIVITY_COL, activityId));
  if (!snap.exists()) throw new Error('Activity not found');

  const entry = snap.data() as ActivityEntry;
  const reactions = entry.reactions || [];
  const existing = reactions.find((r) => r.emoji === emoji);

  if (existing) {
    if (existing.userIds.includes(userId)) return; // Already reacted
    existing.count += 1;
    existing.userIds.push(userId);
  } else {
    reactions.push({ emoji, count: 1, userIds: [userId] });
  }

  await updateDoc(doc(db, ACTIVITY_COL, activityId), { reactions });
}

export async function removeReaction(activityId: string, userId: string, emoji: string): Promise<void> {
  const snap = await getDoc(doc(db, ACTIVITY_COL, activityId));
  if (!snap.exists()) return;

  const entry = snap.data() as ActivityEntry;
  const reactions = (entry.reactions || []).map((r) => {
    if (r.emoji !== emoji) return r;
    return { ...r, count: r.count - 1, userIds: r.userIds.filter((id) => id !== userId) };
  }).filter((r) => r.count > 0);

  await updateDoc(doc(db, ACTIVITY_COL, activityId), { reactions });
}

// ── Pin / Unpin ──────────────────────────────────────────────────────────────

export async function pinActivity(activityId: string): Promise<void> {
  await updateDoc(doc(db, ACTIVITY_COL, activityId), { pinned: true });
}

export async function unpinActivity(activityId: string): Promise<void> {
  await updateDoc(doc(db, ACTIVITY_COL, activityId), { pinned: false });
}
