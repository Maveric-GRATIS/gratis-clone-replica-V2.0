// src/lib/realtime/notification-hub.ts
// Real-time notification hub using Firebase Firestore realtime listeners

import type { RealtimeNotification } from '@/types/realtime';
import { db } from '@/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
  Unsubscribe,
  addDoc,
} from 'firebase/firestore';

type NotificationCallback = (notification: RealtimeNotification) => void;

interface Subscription {
  id: string;
  userId: string;
  channels: string[];
  callback: NotificationCallback;
  unsubscribe?: Unsubscribe;
}

class NotificationHub {
  private subscriptions = new Map<string, Subscription>();
  private notificationCache = new Map<string, RealtimeNotification[]>();

  /**
   * Subscribe to notifications for specific channels
   */
  subscribe(
    userId: string,
    channels: string[],
    callback: NotificationCallback
  ): string {
    const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Always include user-specific channel
    const allChannels = [...new Set([...channels, `user:${userId}`, 'global'])];

    // Setup Firestore listener
    const notificationsQuery = query(
      collection(db, 'realtime_notifications'),
      where('channel', 'in', allChannels.slice(0, 10)), // Firestore limit
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const notification = {
            id: change.doc.id,
            ...change.doc.data(),
          } as RealtimeNotification;

          // Check if notification matches user's channels
          const shouldReceive = this.checkChannelMatch(
            notification,
            allChannels,
            userId
          );

          if (shouldReceive) {
            callback(notification);
            this.addToCache(userId, notification);
          }
        }
      });
    });

    this.subscriptions.set(subscriptionId, {
      id: subscriptionId,
      userId,
      channels: allChannels,
      callback,
      unsubscribe,
    });

    return subscriptionId;
  }

  /**
   * Unsubscribe from notifications
   */
  unsubscribe(subscriptionId: string): void {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription?.unsubscribe) {
      subscription.unsubscribe();
    }
    this.subscriptions.delete(subscriptionId);
  }

  /**
   * Broadcast a notification (add to Firestore)
   */
  async broadcast(notification: Omit<RealtimeNotification, 'id'>): Promise<string> {
    const ref = await addDoc(collection(db, 'realtime_notifications'), notification);
    return ref.id;
  }

  /**
   * Send notification to a specific user
   */
  async sendToUser(
    userId: string,
    notification: Omit<RealtimeNotification, 'id' | 'channel' | 'targetId'>
  ): Promise<string> {
    return this.broadcast({
      ...notification,
      channel: 'user',
      targetId: userId,
    });
  }

  /**
   * Send to all admin users
   */
  async sendToAdmins(
    notification: Omit<RealtimeNotification, 'id' | 'channel'>
  ): Promise<string> {
    return this.broadcast({
      ...notification,
      channel: 'admin',
    });
  }

  /**
   * Get cached notifications for a user
   */
  getCachedNotifications(userId: string): RealtimeNotification[] {
    return this.notificationCache.get(userId) || [];
  }

  /**
   * Clear cached notifications
   */
  clearCache(userId: string): void {
    this.notificationCache.delete(userId);
  }

  /**
   * Get statistics about active subscriptions
   */
  getStats(): {
    totalSubscriptions: number;
    uniqueUsers: number;
    channelCounts: Record<string, number>;
  } {
    const uniqueUsers = new Set<string>();
    const channelCounts: Record<string, number> = {};

    for (const sub of this.subscriptions.values()) {
      uniqueUsers.add(sub.userId);
      for (const channel of sub.channels) {
        channelCounts[channel] = (channelCounts[channel] || 0) + 1;
      }
    }

    return {
      totalSubscriptions: this.subscriptions.size,
      uniqueUsers: uniqueUsers.size,
      channelCounts,
    };
  }

  /**
   * Cleanup all subscriptions
   */
  destroy(): void {
    for (const subscription of this.subscriptions.values()) {
      if (subscription.unsubscribe) {
        subscription.unsubscribe();
      }
    }
    this.subscriptions.clear();
    this.notificationCache.clear();
  }

  // -- Private helpers --

  private checkChannelMatch(
    notification: RealtimeNotification,
    subscribedChannels: string[],
    userId: string
  ): boolean {
    const channelKey = notification.targetId
      ? `${notification.channel}:${notification.targetId}`
      : notification.channel;

    return (
      subscribedChannels.includes(channelKey) ||
      subscribedChannels.includes(notification.channel) ||
      subscribedChannels.includes('global') ||
      (notification.channel === 'user' && notification.targetId === userId)
    );
  }

  private addToCache(userId: string, notification: RealtimeNotification): void {
    const cache = this.notificationCache.get(userId) || [];
    cache.unshift(notification);

    // Keep only last 50 notifications
    if (cache.length > 50) {
      cache.pop();
    }

    this.notificationCache.set(userId, cache);
  }
}

// Singleton instance
export const notificationHub = new NotificationHub();
