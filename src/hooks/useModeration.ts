// src/hooks/useModeration.ts
// React hook for content moderation operations

import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { db } from '@/firebase';
import { ModerationService } from '@/lib/moderation/moderation-service';
import type { ModerationItem, ModerationStatus, ModerationAction, ContentType, FlagReason } from '@/types/moderation';

interface UseModerationOptions {
  status?: ModerationStatus;
  contentType?: ContentType;
  autoRefresh?: boolean;
  limit?: number;
}

interface UseModerationResult {
  items: ModerationItem[];
  loading: boolean;
  error: Error | null;
  submitForReview: (
    contentType: ContentType,
    contentId: string,
    content: string,
    authorId: string,
    authorName: string
  ) => Promise<void>;
  reviewItem: (
    itemId: string,
    action: ModerationAction,
    reviewerId: string,
    note?: string
  ) => Promise<void>;
  flagItem: (
    itemId: string,
    reporterId: string,
    reporterName: string,
    reason: FlagReason,
    details?: string
  ) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useModeration(options: UseModerationOptions = {}): UseModerationResult {
  const {
    status,
    contentType,
    autoRefresh = false,
    limit: itemLimit = 100,
  } = options;

  const [items, setItems] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await ModerationService.getQueueItems(status, itemLimit);

      // Apply contentType filter if specified
      const filtered = contentType
        ? data.filter((item) => item.contentType === contentType)
        : data;

      setItems(filtered);
    } catch (err) {
      console.error('Failed to load moderation items:', err);
      setError(err instanceof Error ? err : new Error('Failed to load items'));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [status, contentType, itemLimit]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Real-time updates with Firestore listener
  useEffect(() => {
    if (!autoRefresh) return;

    let unsubscribe: Unsubscribe | undefined;

    try {
      // Build query
      const constraints = [];

      if (status) {
        constraints.push(where('status', '==', status));
      }

      if (contentType) {
        constraints.push(where('contentType', '==', contentType));
      }

      constraints.push(orderBy('createdAt', 'desc'));
      constraints.push(limit(itemLimit));

      const q = query(collection(db, 'moderation_queue'), ...constraints);

      // Subscribe to real-time updates
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as ModerationItem[];

          setItems(data);
          setLoading(false);
        },
        (err) => {
          console.error('Moderation listener error:', err);
          setError(err instanceof Error ? err : new Error('Listener error'));
          setLoading(false);
        }
      );
    } catch (err) {
      console.error('Failed to setup listener:', err);
      setError(err instanceof Error ? err : new Error('Failed to setup listener'));
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [status, contentType, itemLimit, autoRefresh]);

  const submitForReview = useCallback(
    async (
      contentType: ContentType,
      contentId: string,
      content: string,
      authorId: string,
      authorName: string
    ) => {
      try {
        await ModerationService.submitForReview({
          contentType,
          contentId,
          content,
          authorId,
          authorName,
        });
        await loadItems();
      } catch (err) {
        console.error('Failed to submit for review:', err);
        throw err;
      }
    },
    [loadItems]
  );

  const reviewItem = useCallback(
    async (
      itemId: string,
      action: ModerationAction,
      reviewerId: string,
      note?: string
    ) => {
      try {
        await ModerationService.review(itemId, action, reviewerId, note);
        await loadItems();
      } catch (err) {
        console.error('Failed to review item:', err);
        throw err;
      }
    },
    [loadItems]
  );

  const flagItem = useCallback(
    async (
      itemId: string,
      reporterId: string,
      reporterName: string,
      reason: FlagReason,
      details?: string
    ) => {
      try {
        await ModerationService.flagContent(
          itemId,
          reporterId,
          reporterName,
          reason,
          details
        );
        await loadItems();
      } catch (err) {
        console.error('Failed to flag item:', err);
        throw err;
      }
    },
    [loadItems]
  );

  return {
    items,
    loading,
    error,
    submitForReview,
    reviewItem,
    flagItem,
    refresh: loadItems,
  };
}
