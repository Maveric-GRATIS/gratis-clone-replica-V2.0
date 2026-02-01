/**
 * Notification Service with Firebase Cloud Messaging
 * Handles in-app notifications, push notifications, and notification management
 */

import * as admin from 'firebase-admin';

// Notification types
export type NotificationType =
  | 'system'
  | 'order'
  | 'event'
  | 'donation'
  | 'membership'
  | 'campaign'
  | 'voting'
  | 'impact';

interface CreateNotificationOptions {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  data?: Record<string, any>;
  channels?: ('app' | 'email' | 'push')[];
  expiresAt?: Date;
}

interface SendPushNotificationOptions {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
  actionUrl?: string;
}

// Create a notification for a user
export async function createNotification(
  options: CreateNotificationOptions
): Promise<string> {
  const {
    userId,
    type,
    title,
    message,
    actionUrl,
    actionLabel,
    data,
    channels = ['app'],
    expiresAt,
  } = options;

  const db = admin.firestore();

  // Create notification document
  const notificationRef = db.collection('notifications').doc();

  await notificationRef.set({
    id: notificationRef.id,
    userId,
    type,
    title,
    message,
    actionUrl,
    actionLabel,
    data,
    channels,
    deliveredVia: ['app'],
    isRead: false,
    readAt: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    expiresAt: expiresAt ? admin.firestore.Timestamp.fromDate(expiresAt) : null,
  });

  // Also add to user's notifications subcollection for easy querying
  await db
    .collection('users')
    .doc(userId)
    .collection('notifications')
    .doc(notificationRef.id)
    .set({
      notificationId: notificationRef.id,
      type,
      isRead: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

  // Send via requested channels
  if (channels.includes('push')) {
    await sendPushNotification({
      userId,
      title,
      body: message,
      data: data ? Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, String(v)])
      ) : undefined,
      actionUrl,
    }).catch(err => console.error('Push notification failed:', err));
  }

  return notificationRef.id;
}

// Send push notification via FCM
export async function sendPushNotification(
  options: SendPushNotificationOptions
): Promise<boolean> {
  try {
    const { userId, title, body, data, imageUrl, actionUrl } = options;

    const db = admin.firestore();

    // Get user's FCM tokens
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    const fcmTokens = userData?.fcmTokens || [];

    if (fcmTokens.length === 0) {
      console.log('No FCM tokens found for user:', userId);
      return false;
    }

    // Prepare message
    const message: admin.messaging.MulticastMessage = {
      notification: {
        title,
        body,
        imageUrl,
      },
      data: {
        ...data,
        click_action: actionUrl || '',
      },
      tokens: fcmTokens,
      webpush: {
        fcmOptions: {
          link: actionUrl,
        },
        notification: {
          icon: '/images/logo-192.png',
          badge: '/images/badge-96.png',
        },
      },
      apns: {
        payload: {
          aps: {
            badge: 1,
            sound: 'default',
            category: 'NOTIFICATION',
          },
        },
      },
      android: {
        notification: {
          icon: 'notification_icon',
          color: '#C1FF00',
          clickAction: actionUrl,
        },
      },
    };

    // Send to all user's devices
    const response = await admin.messaging().sendEachForMulticast(message);

    console.log(
      `Push notification sent: ${response.successCount} success, ${response.failureCount} failures`
    );

    // Clean up invalid tokens
    const invalidTokens: string[] = [];
    response.responses.forEach((resp, idx) => {
      if (
        !resp.success &&
        resp.error?.code === 'messaging/registration-token-not-registered'
      ) {
        invalidTokens.push(fcmTokens[idx]);
      }
    });

    if (invalidTokens.length > 0) {
      await db
        .collection('users')
        .doc(userId)
        .update({
          fcmTokens: admin.firestore.FieldValue.arrayRemove(...invalidTokens),
        });
      console.log('Removed invalid FCM tokens:', invalidTokens.length);
    }

    return response.successCount > 0;
  } catch (error) {
    console.error('Push notification error:', error);
    return false;
  }
}

// Mark notification as read
export async function markNotificationRead(
  userId: string,
  notificationId: string
): Promise<void> {
  const db = admin.firestore();
  const now = admin.firestore.FieldValue.serverTimestamp();

  await Promise.all([
    db.collection('notifications').doc(notificationId).update({
      isRead: true,
      readAt: now,
    }),
    db
      .collection('users')
      .doc(userId)
      .collection('notifications')
      .doc(notificationId)
      .update({
        isRead: true,
        readAt: now,
      }),
  ]);
}

// Mark all notifications as read
export async function markAllNotificationsRead(userId: string): Promise<void> {
  const db = admin.firestore();
  const batch = db.batch();
  const now = admin.firestore.FieldValue.serverTimestamp();

  // Get all unread notifications
  const snapshot = await db
    .collection('users')
    .doc(userId)
    .collection('notifications')
    .where('isRead', '==', false)
    .get();

  snapshot.docs.forEach(doc => {
    batch.update(doc.ref, { isRead: true, readAt: now });
    batch.update(db.collection('notifications').doc(doc.id), {
      isRead: true,
      readAt: now,
    });
  });

  await batch.commit();
}

// Get user's notifications
export async function getUserNotifications(
  userId: string,
  options?: {
    limit?: number;
    unreadOnly?: boolean;
    types?: NotificationType[];
  }
): Promise<any[]> {
  const db = admin.firestore();
  let query: admin.firestore.Query = db
    .collection('notifications')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc');

  if (options?.unreadOnly) {
    query = query.where('isRead', '==', false);
  }

  if (options?.types && options.types.length > 0) {
    query = query.where('type', 'in', options.types);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const snapshot = await query.get();

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      readAt: data.readAt?.toDate(),
      expiresAt: data.expiresAt?.toDate(),
    };
  });
}

// Get unread count
export async function getUnreadCount(userId: string): Promise<number> {
  const db = admin.firestore();
  const snapshot = await db
    .collection('users')
    .doc(userId)
    .collection('notifications')
    .where('isRead', '==', false)
    .count()
    .get();

  return snapshot.data().count;
}

// Delete old notifications (scheduled job)
export async function cleanupOldNotifications(
  daysOld: number = 30
): Promise<number> {
  const db = admin.firestore();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const snapshot = await db
    .collection('notifications')
    .where('createdAt', '<', admin.firestore.Timestamp.fromDate(cutoffDate))
    .where('isRead', '==', true)
    .limit(500) // Process in batches
    .get();

  if (snapshot.empty) {
    return 0;
  }

  const batch = db.batch();
  snapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });

  await batch.commit();

  return snapshot.size;
}

// Pre-built notification creators
export const notifications = {
  orderShipped: (userId: string, orderId: string, trackingUrl: string) =>
    createNotification({
      userId,
      type: 'order',
      title: 'Your order has shipped! 📦',
      message: `Order ${orderId} is on its way. Track your delivery.`,
      actionUrl: trackingUrl,
      actionLabel: 'Track Order',
      channels: ['app', 'push'],
    }),

  votingOpen: (userId: string, quarterName: string) =>
    createNotification({
      userId,
      type: 'voting',
      title: `${quarterName} Voting is Now Open! 🗳️`,
      message: 'Help decide where GRATIS funds go this quarter.',
      actionUrl: '/dashboard/voting',
      actionLabel: 'Vote Now',
      channels: ['app', 'push'],
    }),

  donationReceived: (userId: string, amount: number) =>
    createNotification({
      userId,
      type: 'donation',
      title: 'Thank you for your donation! 💚',
      message: `Your €${amount} donation has been received and is making an impact.`,
      actionUrl: '/dashboard/impact',
      actionLabel: 'See Your Impact',
      channels: ['app'],
    }),

  eventReminder: (
    userId: string,
    eventTitle: string,
    eventId: string,
    hoursUntil: number
  ) =>
    createNotification({
      userId,
      type: 'event',
      title: `Event Starting ${hoursUntil === 1 ? 'in 1 hour' : `in ${hoursUntil} hours`}! 📅`,
      message: eventTitle,
      actionUrl: `/events/${eventId}`,
      actionLabel: 'View Event',
      channels: ['app', 'push'],
    }),

  membershipRenewal: (userId: string, daysUntil: number) =>
    createNotification({
      userId,
      type: 'membership',
      title: `Membership renews in ${daysUntil} days`,
      message: 'Your TRIBE membership will automatically renew.',
      actionUrl: '/dashboard/membership',
      actionLabel: 'Manage Membership',
      channels: ['app'],
    }),

  bottleAvailable: (userId: string) =>
    createNotification({
      userId,
      type: 'membership',
      title: 'New bottle available! 💧',
      message: 'Your monthly water bottle is ready to claim.',
      actionUrl: '/dashboard/bottles',
      actionLabel: 'Claim Bottle',
      channels: ['app', 'push'],
    }),

  campaignGoalReached: (userId: string, campaignName: string) =>
    createNotification({
      userId,
      type: 'campaign',
      title: 'Campaign Goal Reached! 🎉',
      message: `The ${campaignName} campaign has reached its goal thanks to supporters like you!`,
      actionUrl: '/campaigns',
      actionLabel: 'View Campaign',
      channels: ['app'],
    }),

  impactMilestone: (userId: string, milestone: string) =>
    createNotification({
      userId,
      type: 'impact',
      title: 'Impact Milestone Reached! 🌟',
      message: milestone,
      actionUrl: '/dashboard/impact',
      actionLabel: 'See Your Impact',
      channels: ['app'],
    }),
};

// Register FCM token for user
export async function registerFCMToken(
  userId: string,
  token: string
): Promise<void> {
  const db = admin.firestore();
  await db
    .collection('users')
    .doc(userId)
    .update({
      fcmTokens: admin.firestore.FieldValue.arrayUnion(token),
    });
}

// Unregister FCM token
export async function unregisterFCMToken(
  userId: string,
  token: string
): Promise<void> {
  const db = admin.firestore();
  await db
    .collection('users')
    .doc(userId)
    .update({
      fcmTokens: admin.firestore.FieldValue.arrayRemove(token),
    });
}

// Send bulk notifications (for campaigns, announcements)
export async function sendBulkNotifications(
  userIds: string[],
  notification: Omit<CreateNotificationOptions, 'userId'>
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  // Process in batches of 100
  const batchSize = 100;
  for (let i = 0; i < userIds.length; i += batchSize) {
    const batch = userIds.slice(i, i + batchSize);

    const results = await Promise.allSettled(
      batch.map(userId =>
        createNotification({
          ...notification,
          userId,
        })
      )
    );

    results.forEach(result => {
      if (result.status === 'fulfilled') {
        success++;
      } else {
        failed++;
        console.error('Bulk notification failed:', result.reason);
      }
    });

    // Small delay between batches to avoid rate limits
    if (i + batchSize < userIds.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return { success, failed };
}
