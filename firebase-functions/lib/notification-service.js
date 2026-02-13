"use strict";
/**
 * Notification Service with Firebase Cloud Messaging
 * Handles in-app notifications, push notifications, and notification management
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifications = void 0;
exports.createNotification = createNotification;
exports.sendPushNotification = sendPushNotification;
exports.markNotificationRead = markNotificationRead;
exports.markAllNotificationsRead = markAllNotificationsRead;
exports.getUserNotifications = getUserNotifications;
exports.getUnreadCount = getUnreadCount;
exports.cleanupOldNotifications = cleanupOldNotifications;
exports.registerFCMToken = registerFCMToken;
exports.unregisterFCMToken = unregisterFCMToken;
exports.sendBulkNotifications = sendBulkNotifications;
const admin = __importStar(require("firebase-admin"));
// Create a notification for a user
async function createNotification(options) {
    const { userId, type, title, message, actionUrl, actionLabel, data, channels = ['app'], expiresAt, } = options;
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
            data: data ? Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])) : undefined,
            actionUrl,
        }).catch(err => console.error('Push notification failed:', err));
    }
    return notificationRef.id;
}
// Send push notification via FCM
async function sendPushNotification(options) {
    try {
        const { userId, title, body, data, imageUrl, actionUrl } = options;
        const db = admin.firestore();
        // Get user's FCM tokens
        const userDoc = await db.collection('users').doc(userId).get();
        const userData = userDoc.data();
        const fcmTokens = (userData === null || userData === void 0 ? void 0 : userData.fcmTokens) || [];
        if (fcmTokens.length === 0) {
            console.log('No FCM tokens found for user:', userId);
            return false;
        }
        // Prepare message
        const message = {
            notification: {
                title,
                body,
                imageUrl,
            },
            data: Object.assign(Object.assign({}, data), { click_action: actionUrl || '' }),
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
        console.log(`Push notification sent: ${response.successCount} success, ${response.failureCount} failures`);
        // Clean up invalid tokens
        const invalidTokens = [];
        response.responses.forEach((resp, idx) => {
            var _a;
            if (!resp.success &&
                ((_a = resp.error) === null || _a === void 0 ? void 0 : _a.code) === 'messaging/registration-token-not-registered') {
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
    }
    catch (error) {
        console.error('Push notification error:', error);
        return false;
    }
}
// Mark notification as read
async function markNotificationRead(userId, notificationId) {
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
async function markAllNotificationsRead(userId) {
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
async function getUserNotifications(userId, options) {
    const db = admin.firestore();
    let query = db
        .collection('notifications')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc');
    if (options === null || options === void 0 ? void 0 : options.unreadOnly) {
        query = query.where('isRead', '==', false);
    }
    if ((options === null || options === void 0 ? void 0 : options.types) && options.types.length > 0) {
        query = query.where('type', 'in', options.types);
    }
    if (options === null || options === void 0 ? void 0 : options.limit) {
        query = query.limit(options.limit);
    }
    const snapshot = await query.get();
    return snapshot.docs.map(doc => {
        var _a, _b, _c;
        const data = doc.data();
        return Object.assign(Object.assign({ id: doc.id }, data), { createdAt: (_a = data.createdAt) === null || _a === void 0 ? void 0 : _a.toDate(), readAt: (_b = data.readAt) === null || _b === void 0 ? void 0 : _b.toDate(), expiresAt: (_c = data.expiresAt) === null || _c === void 0 ? void 0 : _c.toDate() });
    });
}
// Get unread count
async function getUnreadCount(userId) {
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
async function cleanupOldNotifications(daysOld = 30) {
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
exports.notifications = {
    orderShipped: (userId, orderId, trackingUrl) => createNotification({
        userId,
        type: 'order',
        title: 'Your order has shipped! 📦',
        message: `Order ${orderId} is on its way. Track your delivery.`,
        actionUrl: trackingUrl,
        actionLabel: 'Track Order',
        channels: ['app', 'push'],
    }),
    votingOpen: (userId, quarterName) => createNotification({
        userId,
        type: 'voting',
        title: `${quarterName} Voting is Now Open! 🗳️`,
        message: 'Help decide where GRATIS funds go this quarter.',
        actionUrl: '/dashboard/voting',
        actionLabel: 'Vote Now',
        channels: ['app', 'push'],
    }),
    donationReceived: (userId, amount) => createNotification({
        userId,
        type: 'donation',
        title: 'Thank you for your donation! 💚',
        message: `Your €${amount} donation has been received and is making an impact.`,
        actionUrl: '/dashboard/impact',
        actionLabel: 'See Your Impact',
        channels: ['app'],
    }),
    eventReminder: (userId, eventTitle, eventId, hoursUntil) => createNotification({
        userId,
        type: 'event',
        title: `Event Starting ${hoursUntil === 1 ? 'in 1 hour' : `in ${hoursUntil} hours`}! 📅`,
        message: eventTitle,
        actionUrl: `/events/${eventId}`,
        actionLabel: 'View Event',
        channels: ['app', 'push'],
    }),
    membershipRenewal: (userId, daysUntil) => createNotification({
        userId,
        type: 'membership',
        title: `Membership renews in ${daysUntil} days`,
        message: 'Your TRIBE membership will automatically renew.',
        actionUrl: '/dashboard/membership',
        actionLabel: 'Manage Membership',
        channels: ['app'],
    }),
    bottleAvailable: (userId) => createNotification({
        userId,
        type: 'membership',
        title: 'New bottle available! 💧',
        message: 'Your monthly water bottle is ready to claim.',
        actionUrl: '/dashboard/bottles',
        actionLabel: 'Claim Bottle',
        channels: ['app', 'push'],
    }),
    campaignGoalReached: (userId, campaignName) => createNotification({
        userId,
        type: 'campaign',
        title: 'Campaign Goal Reached! 🎉',
        message: `The ${campaignName} campaign has reached its goal thanks to supporters like you!`,
        actionUrl: '/campaigns',
        actionLabel: 'View Campaign',
        channels: ['app'],
    }),
    impactMilestone: (userId, milestone) => createNotification({
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
async function registerFCMToken(userId, token) {
    const db = admin.firestore();
    await db
        .collection('users')
        .doc(userId)
        .update({
        fcmTokens: admin.firestore.FieldValue.arrayUnion(token),
    });
}
// Unregister FCM token
async function unregisterFCMToken(userId, token) {
    const db = admin.firestore();
    await db
        .collection('users')
        .doc(userId)
        .update({
        fcmTokens: admin.firestore.FieldValue.arrayRemove(token),
    });
}
// Send bulk notifications (for campaigns, announcements)
async function sendBulkNotifications(userIds, notification) {
    let success = 0;
    let failed = 0;
    // Process in batches of 100
    const batchSize = 100;
    for (let i = 0; i < userIds.length; i += batchSize) {
        const batch = userIds.slice(i, i + batchSize);
        const results = await Promise.allSettled(batch.map(userId => createNotification(Object.assign(Object.assign({}, notification), { userId }))));
        results.forEach(result => {
            if (result.status === 'fulfilled') {
                success++;
            }
            else {
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
//# sourceMappingURL=notification-service.js.map