# GRATIS.NGO Enterprise Development Prompts - PART 9
## Mobile Push, A/B Testing, Advanced Analytics & International (Sections 43-48)
### Total Estimated Size: ~65,000 tokens | Complexity: HIGH

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 43: MOBILE PUSH NOTIFICATIONS & DEEP LINKS
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 43.1: Push Notification Types and Service

```
Create a comprehensive push notification system with Firebase Cloud Messaging.

### FILE: src/types/push-notification.ts
```typescript
import type { Timestamp } from 'firebase/firestore';

export type NotificationChannel = 
  | 'donations'
  | 'impact'
  | 'events'
  | 'community'
  | 'promotions'
  | 'account'
  | 'partners';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface PushNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  imageUrl?: string;
  channel: NotificationChannel;
  priority: NotificationPriority;
  data?: Record<string, string>;
  deepLink?: string;
  actionButtons?: NotificationAction[];
  scheduledFor?: Timestamp;
  sentAt?: Timestamp;
  deliveredAt?: Timestamp;
  openedAt?: Timestamp;
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'failed';
  fcmMessageId?: string;
  errorMessage?: string;
  createdAt: Timestamp;
}

export interface NotificationAction {
  id: string;
  title: string;
  icon?: string;
  deepLink: string;
}

export interface UserPushSettings {
  userId: string;
  fcmTokens: FCMToken[];
  channels: Record<NotificationChannel, boolean>;
  quietHours?: {
    enabled: boolean;
    startTime: string; // HH:mm
    endTime: string;
    timezone: string;
  };
  frequency: 'all' | 'important' | 'minimal';
  updatedAt: Timestamp;
}

export interface FCMToken {
  token: string;
  platform: 'web' | 'ios' | 'android';
  deviceId: string;
  deviceName?: string;
  lastUsedAt: Timestamp;
  createdAt: Timestamp;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  channel: NotificationChannel;
  titleTemplate: string;
  bodyTemplate: string;
  imageUrl?: string;
  deepLinkTemplate?: string;
  variables: string[];
  createdAt: Timestamp;
}

export interface DeepLinkConfig {
  scheme: string;
  webBaseUrl: string;
  appBaseUrl: string;
  routes: DeepLinkRoute[];
}

export interface DeepLinkRoute {
  path: string;
  screen: string;
  params?: string[];
  requiresAuth: boolean;
}
```

### FILE: src/lib/notifications/push-service.ts
```typescript
import admin from 'firebase-admin';
import { db } from '@/lib/firebase/admin';
import type { PushNotification, NotificationChannel, UserPushSettings } from '@/types/push-notification';

const DEEP_LINK_CONFIG = {
  scheme: 'gratisngo',
  webBaseUrl: 'https://gratis.ngo',
  appBaseUrl: 'gratisngo://',
  routes: [
    { path: '/donation/:id', screen: 'DonationDetail', params: ['id'], requiresAuth: true },
    { path: '/project/:slug', screen: 'ProjectDetail', params: ['slug'], requiresAuth: false },
    { path: '/event/:id', screen: 'EventDetail', params: ['id'], requiresAuth: false },
    { path: '/bottle/:id', screen: 'BottleDetail', params: ['id'], requiresAuth: false },
    { path: '/achievements', screen: 'Achievements', requiresAuth: true },
    { path: '/leaderboard', screen: 'Leaderboard', requiresAuth: false },
    { path: '/profile', screen: 'Profile', requiresAuth: true },
    { path: '/settings', screen: 'Settings', requiresAuth: true },
  ],
};

export async function sendPushNotification(
  userId: string,
  notification: Omit<PushNotification, 'id' | 'userId' | 'status' | 'createdAt'>
): Promise<string | null> {
  try {
    // Get user's push settings
    const settingsDoc = await db.collection('userPushSettings').doc(userId).get();
    if (!settingsDoc.exists) return null;

    const settings = settingsDoc.data() as UserPushSettings;

    // Check if channel is enabled
    if (!settings.channels[notification.channel]) return null;

    // Check quiet hours
    if (settings.quietHours?.enabled && isQuietHours(settings.quietHours)) {
      // Schedule for after quiet hours
      return await scheduleNotification(userId, notification, settings.quietHours.endTime);
    }

    // Get active FCM tokens
    const activeTokens = settings.fcmTokens.filter(
      (t) => Date.now() - t.lastUsedAt.toDate().getTime() < 30 * 24 * 60 * 60 * 1000
    );

    if (activeTokens.length === 0) return null;

    // Create notification record
    const notificationId = crypto.randomUUID();
    const notificationDoc: PushNotification = {
      id: notificationId,
      userId,
      ...notification,
      status: 'pending',
      createdAt: new Date() as any,
    };

    await db.collection('pushNotifications').doc(notificationId).set(notificationDoc);

    // Build FCM message
    const message: admin.messaging.MulticastMessage = {
      tokens: activeTokens.map((t) => t.token),
      notification: {
        title: notification.title,
        body: notification.body,
        imageUrl: notification.imageUrl,
      },
      data: {
        notificationId,
        channel: notification.channel,
        deepLink: notification.deepLink || '',
        ...notification.data,
      },
      android: {
        priority: notification.priority === 'urgent' ? 'high' : 'normal',
        notification: {
          channelId: notification.channel,
          icon: 'ic_notification',
          color: '#0066CC',
          clickAction: 'OPEN_DEEP_LINK',
        },
      },
      apns: {
        payload: {
          aps: {
            alert: {
              title: notification.title,
              body: notification.body,
            },
            badge: 1,
            sound: notification.priority === 'urgent' ? 'urgent.wav' : 'default',
            'mutable-content': 1,
          },
        },
        fcmOptions: {
          imageUrl: notification.imageUrl,
        },
      },
      webpush: {
        notification: {
          title: notification.title,
          body: notification.body,
          icon: '/icons/notification-icon.png',
          badge: '/icons/badge-icon.png',
          image: notification.imageUrl,
          actions: notification.actionButtons?.map((a) => ({
            action: a.id,
            title: a.title,
            icon: a.icon,
          })),
        },
        fcmOptions: {
          link: notification.deepLink || 'https://gratis.ngo',
        },
      },
    };

    // Send via FCM
    const response = await admin.messaging().sendEachForMulticast(message);

    // Update notification status
    const successCount = response.successCount;
    await db.collection('pushNotifications').doc(notificationId).update({
      status: successCount > 0 ? 'sent' : 'failed',
      sentAt: new Date(),
      fcmMessageId: response.responses[0]?.messageId,
      errorMessage: response.responses[0]?.error?.message,
    });

    // Remove invalid tokens
    response.responses.forEach((resp, idx) => {
      if (resp.error?.code === 'messaging/invalid-registration-token' ||
          resp.error?.code === 'messaging/registration-token-not-registered') {
        removeInvalidToken(userId, activeTokens[idx].token);
      }
    });

    return notificationId;
  } catch (error) {
    console.error('Error sending push notification:', error);
    return null;
  }
}

export async function sendBulkNotification(
  userIds: string[],
  notification: Omit<PushNotification, 'id' | 'userId' | 'status' | 'createdAt'>
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  // Process in batches of 500
  const batchSize = 500;
  for (let i = 0; i < userIds.length; i += batchSize) {
    const batch = userIds.slice(i, i + batchSize);
    const results = await Promise.allSettled(
      batch.map((userId) => sendPushNotification(userId, notification))
    );

    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) sent++;
      else failed++;
    });
  }

  return { sent, failed };
}

export async function sendTopicNotification(
  topic: string,
  notification: {
    title: string;
    body: string;
    imageUrl?: string;
    data?: Record<string, string>;
  }
): Promise<string | null> {
  try {
    const message: admin.messaging.Message = {
      topic,
      notification: {
        title: notification.title,
        body: notification.body,
        imageUrl: notification.imageUrl,
      },
      data: notification.data,
    };

    const response = await admin.messaging().send(message);
    return response;
  } catch (error) {
    console.error('Error sending topic notification:', error);
    return null;
  }
}

export function generateDeepLink(path: string, params?: Record<string, string>): string {
  let url = `${DEEP_LINK_CONFIG.webBaseUrl}${path}`;
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value);
    });
  }

  return url;
}

export function generateUniversalLink(path: string, params?: Record<string, string>): {
  web: string;
  app: string;
} {
  const webUrl = generateDeepLink(path, params);
  let appUrl = `${DEEP_LINK_CONFIG.appBaseUrl}${path}`;
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      appUrl = appUrl.replace(`:${key}`, value);
    });
  }

  return { web: webUrl, app: appUrl };
}

function isQuietHours(quietHours: UserPushSettings['quietHours']): boolean {
  if (!quietHours) return false;
  
  const now = new Date();
  const [startHour, startMin] = quietHours.startTime.split(':').map(Number);
  const [endHour, endMin] = quietHours.endTime.split(':').map(Number);
  
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  if (startMinutes < endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  } else {
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }
}

async function scheduleNotification(
  userId: string,
  notification: any,
  afterTime: string
): Promise<string> {
  const [hour, min] = afterTime.split(':').map(Number);
  const scheduledFor = new Date();
  scheduledFor.setHours(hour, min, 0, 0);
  
  if (scheduledFor <= new Date()) {
    scheduledFor.setDate(scheduledFor.getDate() + 1);
  }

  const notificationId = crypto.randomUUID();
  await db.collection('pushNotifications').doc(notificationId).set({
    id: notificationId,
    userId,
    ...notification,
    status: 'pending',
    scheduledFor,
    createdAt: new Date(),
  });

  return notificationId;
}

async function removeInvalidToken(userId: string, token: string): Promise<void> {
  const settingsRef = db.collection('userPushSettings').doc(userId);
  const settingsDoc = await settingsRef.get();
  
  if (settingsDoc.exists) {
    const settings = settingsDoc.data() as UserPushSettings;
    const updatedTokens = settings.fcmTokens.filter((t) => t.token !== token);
    await settingsRef.update({ fcmTokens: updatedTokens });
  }
}
```

### FILE: src/lib/notifications/templates.ts
```typescript
import { db } from '@/lib/firebase/admin';
import { sendPushNotification, generateDeepLink } from './push-service';

// Predefined notification templates
export const NOTIFICATION_TEMPLATES = {
  // Donation notifications
  DONATION_RECEIVED: {
    channel: 'donations' as const,
    priority: 'normal' as const,
    titleTemplate: 'Thank you for your donation! 💙',
    bodyTemplate: 'Your €{{amount}} donation will provide clean water to {{people}} people.',
    deepLinkTemplate: '/donation/{{donationId}}',
  },
  DONATION_MATCHED: {
    channel: 'donations' as const,
    priority: 'high' as const,
    titleTemplate: 'Your donation was matched! 🎉',
    bodyTemplate: '{{partnerName}} matched your €{{amount}} donation, doubling your impact!',
    deepLinkTemplate: '/donation/{{donationId}}',
  },
  RECURRING_REMINDER: {
    channel: 'donations' as const,
    priority: 'low' as const,
    titleTemplate: 'Monthly donation coming up',
    bodyTemplate: 'Your €{{amount}} monthly donation will be processed on {{date}}.',
    deepLinkTemplate: '/settings/subscriptions',
  },

  // Impact notifications
  PROJECT_UPDATE: {
    channel: 'impact' as const,
    priority: 'normal' as const,
    titleTemplate: 'Project Update: {{projectName}}',
    bodyTemplate: '{{update}}',
    deepLinkTemplate: '/project/{{projectSlug}}',
  },
  MILESTONE_REACHED: {
    channel: 'impact' as const,
    priority: 'high' as const,
    titleTemplate: 'Milestone Achieved! 🎯',
    bodyTemplate: '{{projectName}} has reached {{milestone}}!',
    deepLinkTemplate: '/project/{{projectSlug}}',
  },
  IMPACT_REPORT: {
    channel: 'impact' as const,
    priority: 'normal' as const,
    titleTemplate: 'Your Monthly Impact Report 📊',
    bodyTemplate: 'You helped {{people}} people access clean water this month!',
    deepLinkTemplate: '/dashboard/impact',
  },

  // Event notifications
  EVENT_REMINDER: {
    channel: 'events' as const,
    priority: 'high' as const,
    titleTemplate: 'Event Starting Soon! 📅',
    bodyTemplate: '{{eventName}} starts in {{timeUntil}}.',
    deepLinkTemplate: '/event/{{eventId}}',
  },
  NEW_EVENT: {
    channel: 'events' as const,
    priority: 'normal' as const,
    titleTemplate: 'New Event: {{eventName}}',
    bodyTemplate: 'Join us on {{date}} for {{eventName}}.',
    deepLinkTemplate: '/event/{{eventId}}',
  },

  // Community notifications
  BADGE_EARNED: {
    channel: 'community' as const,
    priority: 'normal' as const,
    titleTemplate: 'New Badge Earned! 🏆',
    bodyTemplate: 'You earned the "{{badgeName}}" badge!',
    deepLinkTemplate: '/achievements',
  },
  LEVEL_UP: {
    channel: 'community' as const,
    priority: 'high' as const,
    titleTemplate: 'Level Up! 🎊',
    bodyTemplate: 'Congratulations! You reached Level {{level}} - {{title}}!',
    deepLinkTemplate: '/achievements',
  },
  LEADERBOARD_CHANGE: {
    channel: 'community' as const,
    priority: 'low' as const,
    titleTemplate: 'Leaderboard Update 📈',
    bodyTemplate: 'You moved to #{{rank}} on the {{leaderboard}} leaderboard!',
    deepLinkTemplate: '/leaderboard',
  },
  STREAK_REMINDER: {
    channel: 'community' as const,
    priority: 'normal' as const,
    titleTemplate: "Don't lose your streak! 🔥",
    bodyTemplate: 'Your {{days}}-day streak is at risk. Visit today to keep it going!',
    deepLinkTemplate: '/dashboard',
  },

  // Account notifications
  WELCOME: {
    channel: 'account' as const,
    priority: 'normal' as const,
    titleTemplate: 'Welcome to GRATIS.NGO! 💧',
    bodyTemplate: 'Start your journey to making a difference. Every drop counts!',
    deepLinkTemplate: '/onboarding',
  },
  SUBSCRIPTION_CREATED: {
    channel: 'account' as const,
    priority: 'normal' as const,
    titleTemplate: 'Subscription Confirmed ✅',
    bodyTemplate: 'Your {{planName}} subscription is now active.',
    deepLinkTemplate: '/settings/subscriptions',
  },
  ORDER_SHIPPED: {
    channel: 'account' as const,
    priority: 'normal' as const,
    titleTemplate: 'Your Order Has Shipped! 📦',
    bodyTemplate: 'Your {{itemName}} is on its way. Track your delivery.',
    deepLinkTemplate: '/orders/{{orderId}}',
  },
};

export async function sendTemplatedNotification(
  userId: string,
  templateKey: keyof typeof NOTIFICATION_TEMPLATES,
  variables: Record<string, string | number>
): Promise<string | null> {
  const template = NOTIFICATION_TEMPLATES[templateKey];
  
  // Replace variables in templates
  let title = template.titleTemplate;
  let body = template.bodyTemplate;
  let deepLink = template.deepLinkTemplate;

  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    title = title.replace(regex, String(value));
    body = body.replace(regex, String(value));
    if (deepLink) {
      deepLink = deepLink.replace(regex, String(value));
    }
  });

  return sendPushNotification(userId, {
    title,
    body,
    channel: template.channel,
    priority: template.priority,
    deepLink: deepLink ? generateDeepLink(deepLink) : undefined,
  });
}
```

### FILE: src/app/api/notifications/register-device/route.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { db } from '@/lib/firebase/admin';
import type { FCMToken, UserPushSettings } from '@/types/push-notification';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { token, platform, deviceId, deviceName } = await request.json();

    if (!token || !platform || !deviceId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const settingsRef = db.collection('userPushSettings').doc(session.user.id);
    const settingsDoc = await settingsRef.get();

    const newToken: FCMToken = {
      token,
      platform,
      deviceId,
      deviceName,
      lastUsedAt: new Date() as any,
      createdAt: new Date() as any,
    };

    if (settingsDoc.exists) {
      const settings = settingsDoc.data() as UserPushSettings;
      
      // Remove existing token for this device
      const filteredTokens = settings.fcmTokens.filter((t) => t.deviceId !== deviceId);
      
      await settingsRef.update({
        fcmTokens: [...filteredTokens, newToken],
        updatedAt: new Date(),
      });
    } else {
      // Create new settings with default channels enabled
      const newSettings: UserPushSettings = {
        userId: session.user.id,
        fcmTokens: [newToken],
        channels: {
          donations: true,
          impact: true,
          events: true,
          community: true,
          promotions: false,
          account: true,
          partners: true,
        },
        frequency: 'all',
        updatedAt: new Date() as any,
      };

      await settingsRef.set(newSettings);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error registering device:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### FILE: src/app/api/notifications/settings/route.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { db } from '@/lib/firebase/admin';
import type { UserPushSettings } from '@/types/push-notification';

// GET - Fetch notification settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settingsDoc = await db.collection('userPushSettings').doc(session.user.id).get();
    
    if (!settingsDoc.exists) {
      // Return default settings
      return NextResponse.json({
        settings: {
          channels: {
            donations: true,
            impact: true,
            events: true,
            community: true,
            promotions: false,
            account: true,
            partners: true,
          },
          quietHours: null,
          frequency: 'all',
        },
      });
    }

    const settings = settingsDoc.data() as UserPushSettings;
    
    return NextResponse.json({
      settings: {
        channels: settings.channels,
        quietHours: settings.quietHours,
        frequency: settings.frequency,
        deviceCount: settings.fcmTokens.length,
      },
    });
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Update notification settings
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();
    const settingsRef = db.collection('userPushSettings').doc(session.user.id);
    
    await settingsRef.update({
      ...updates,
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 44: A/B TESTING FRAMEWORK
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 44.1: Create A/B Testing System

```
Create a comprehensive A/B testing framework with feature flags.

### FILE: src/types/experiments.ts
```typescript
import type { Timestamp } from 'firebase/firestore';

export interface Experiment {
  id: string;
  name: string;
  description: string;
  hypothesis: string;
  status: 'draft' | 'running' | 'paused' | 'completed' | 'archived';
  type: 'ab_test' | 'multivariate' | 'feature_flag';
  targetAudience: AudienceFilter;
  variants: ExperimentVariant[];
  metrics: ExperimentMetric[];
  trafficAllocation: number; // 0-100, percentage of users in experiment
  startDate?: Timestamp;
  endDate?: Timestamp;
  minimumSampleSize: number;
  confidenceLevel: number; // 0.90, 0.95, 0.99
  results?: ExperimentResults;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ExperimentVariant {
  id: string;
  name: string;
  description?: string;
  weight: number; // 0-100, percentage allocation
  isControl: boolean;
  config: Record<string, any>;
}

export interface ExperimentMetric {
  id: string;
  name: string;
  type: 'conversion' | 'count' | 'value' | 'duration';
  event: string;
  isPrimary: boolean;
  minimumDetectableEffect?: number;
}

export interface AudienceFilter {
  includeAll?: boolean;
  userTypes?: ('new' | 'returning' | 'subscriber')[];
  countries?: string[];
  platforms?: ('web' | 'ios' | 'android')[];
  userSegments?: string[];
  customRules?: {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'gt' | 'lt' | 'in';
    value: any;
  }[];
}

export interface ExperimentAssignment {
  id: string;
  experimentId: string;
  userId: string;
  variantId: string;
  assignedAt: Timestamp;
  context: {
    platform: string;
    country?: string;
    userAgent?: string;
  };
}

export interface ExperimentEvent {
  id: string;
  experimentId: string;
  userId: string;
  variantId: string;
  metricId: string;
  eventName: string;
  value?: number;
  metadata?: Record<string, any>;
  timestamp: Timestamp;
}

export interface ExperimentResults {
  experimentId: string;
  calculatedAt: Timestamp;
  totalParticipants: number;
  variantResults: VariantResult[];
  winner?: string;
  isSignificant: boolean;
  confidenceLevel: number;
}

export interface VariantResult {
  variantId: string;
  variantName: string;
  participants: number;
  metrics: MetricResult[];
  isWinner: boolean;
}

export interface MetricResult {
  metricId: string;
  metricName: string;
  value: number;
  sampleSize: number;
  conversionRate?: number;
  averageValue?: number;
  standardDeviation?: number;
  confidenceInterval: [number, number];
  pValue?: number;
  improvement?: number; // vs control, percentage
  isSignificant: boolean;
}

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  type: 'boolean' | 'string' | 'number' | 'json';
  defaultValue: any;
  enabled: boolean;
  rules: FeatureFlagRule[];
  environments: ('development' | 'staging' | 'production')[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FeatureFlagRule {
  id: string;
  priority: number;
  conditions: AudienceFilter;
  value: any;
  percentage?: number; // Gradual rollout
}
```

### FILE: src/lib/experiments/service.ts
```typescript
import { db } from '@/lib/firebase/admin';
import crypto from 'crypto';
import type { 
  Experiment, 
  ExperimentAssignment, 
  ExperimentVariant,
  FeatureFlag,
  AudienceFilter
} from '@/types/experiments';

// Deterministic assignment using hash
function getVariantAssignment(
  experimentId: string,
  userId: string,
  variants: ExperimentVariant[]
): ExperimentVariant {
  const hash = crypto
    .createHash('md5')
    .update(`${experimentId}:${userId}`)
    .digest('hex');
  
  const hashNum = parseInt(hash.substring(0, 8), 16);
  const normalized = hashNum / 0xffffffff; // 0-1
  
  let cumulative = 0;
  for (const variant of variants) {
    cumulative += variant.weight / 100;
    if (normalized <= cumulative) {
      return variant;
    }
  }
  
  return variants[0]; // Fallback to first variant
}

export async function getExperimentVariant(
  experimentId: string,
  userId: string,
  context: { platform?: string; country?: string; userAgent?: string } = {}
): Promise<{ variant: ExperimentVariant; isNewAssignment: boolean } | null> {
  try {
    // Check for existing assignment
    const existingAssignment = await db.collection('experimentAssignments')
      .where('experimentId', '==', experimentId)
      .where('userId', '==', userId)
      .limit(1)
      .get();

    if (!existingAssignment.empty) {
      const assignment = existingAssignment.docs[0].data() as ExperimentAssignment;
      const experimentDoc = await db.collection('experiments').doc(experimentId).get();
      const experiment = experimentDoc.data() as Experiment;
      const variant = experiment.variants.find((v) => v.id === assignment.variantId);
      
      return variant ? { variant, isNewAssignment: false } : null;
    }

    // Get experiment
    const experimentDoc = await db.collection('experiments').doc(experimentId).get();
    if (!experimentDoc.exists) return null;

    const experiment = experimentDoc.data() as Experiment;

    // Check if experiment is running
    if (experiment.status !== 'running') return null;

    // Check traffic allocation
    const trafficHash = crypto
      .createHash('md5')
      .update(`traffic:${experimentId}:${userId}`)
      .digest('hex');
    const trafficNum = parseInt(trafficHash.substring(0, 8), 16) / 0xffffffff * 100;
    
    if (trafficNum > experiment.trafficAllocation) {
      // User not in experiment
      return null;
    }

    // Check audience targeting
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    
    if (!matchesAudience(experiment.targetAudience, userData, context)) {
      return null;
    }

    // Assign variant
    const variant = getVariantAssignment(experimentId, userId, experiment.variants);

    // Store assignment
    const assignmentId = `${experimentId}_${userId}`;
    await db.collection('experimentAssignments').doc(assignmentId).set({
      id: assignmentId,
      experimentId,
      userId,
      variantId: variant.id,
      assignedAt: new Date(),
      context,
    });

    return { variant, isNewAssignment: true };
  } catch (error) {
    console.error('Error getting experiment variant:', error);
    return null;
  }
}

export async function trackExperimentEvent(
  experimentId: string,
  userId: string,
  eventName: string,
  value?: number,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    // Get assignment
    const assignmentDoc = await db.collection('experimentAssignments')
      .doc(`${experimentId}_${userId}`)
      .get();
    
    if (!assignmentDoc.exists) return;

    const assignment = assignmentDoc.data() as ExperimentAssignment;

    // Get experiment to find metric
    const experimentDoc = await db.collection('experiments').doc(experimentId).get();
    const experiment = experimentDoc.data() as Experiment;
    const metric = experiment.metrics.find((m) => m.event === eventName);

    if (!metric) return;

    // Store event
    await db.collection('experimentEvents').add({
      experimentId,
      userId,
      variantId: assignment.variantId,
      metricId: metric.id,
      eventName,
      value,
      metadata,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error tracking experiment event:', error);
  }
}

export async function getFeatureFlag(
  flagKey: string,
  userId?: string,
  context: { platform?: string; country?: string } = {}
): Promise<any> {
  try {
    const flagDoc = await db.collection('featureFlags')
      .where('key', '==', flagKey)
      .where('enabled', '==', true)
      .limit(1)
      .get();

    if (flagDoc.empty) return null;

    const flag = flagDoc.docs[0].data() as FeatureFlag;

    // Check environment
    const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
    if (!flag.environments.includes(env as any)) {
      return flag.defaultValue;
    }

    // Evaluate rules in priority order
    const sortedRules = [...flag.rules].sort((a, b) => a.priority - b.priority);

    let userData = null;
    if (userId) {
      const userDoc = await db.collection('users').doc(userId).get();
      userData = userDoc.data();
    }

    for (const rule of sortedRules) {
      if (matchesAudience(rule.conditions, userData, context)) {
        // Check percentage rollout
        if (rule.percentage !== undefined && rule.percentage < 100) {
          if (!userId) continue;
          
          const hash = crypto
            .createHash('md5')
            .update(`${flagKey}:${userId}`)
            .digest('hex');
          const hashNum = parseInt(hash.substring(0, 8), 16) / 0xffffffff * 100;
          
          if (hashNum > rule.percentage) continue;
        }

        return rule.value;
      }
    }

    return flag.defaultValue;
  } catch (error) {
    console.error('Error getting feature flag:', error);
    return null;
  }
}

function matchesAudience(
  filter: AudienceFilter,
  userData: any,
  context: { platform?: string; country?: string }
): boolean {
  if (filter.includeAll) return true;

  // Check platforms
  if (filter.platforms && filter.platforms.length > 0) {
    if (!context.platform || !filter.platforms.includes(context.platform as any)) {
      return false;
    }
  }

  // Check countries
  if (filter.countries && filter.countries.length > 0) {
    if (!context.country || !filter.countries.includes(context.country)) {
      return false;
    }
  }

  // Check user types
  if (filter.userTypes && filter.userTypes.length > 0 && userData) {
    const userType = userData.hasSubscription ? 'subscriber' : 
                     userData.totalDonations > 0 ? 'returning' : 'new';
    if (!filter.userTypes.includes(userType)) {
      return false;
    }
  }

  // Check custom rules
  if (filter.customRules && filter.customRules.length > 0 && userData) {
    for (const rule of filter.customRules) {
      const fieldValue = userData[rule.field];
      
      switch (rule.operator) {
        case 'equals':
          if (fieldValue !== rule.value) return false;
          break;
        case 'not_equals':
          if (fieldValue === rule.value) return false;
          break;
        case 'contains':
          if (!fieldValue?.includes?.(rule.value)) return false;
          break;
        case 'gt':
          if (!(fieldValue > rule.value)) return false;
          break;
        case 'lt':
          if (!(fieldValue < rule.value)) return false;
          break;
        case 'in':
          if (!rule.value.includes(fieldValue)) return false;
          break;
      }
    }
  }

  return true;
}

export async function calculateExperimentResults(experimentId: string): Promise<void> {
  const experimentDoc = await db.collection('experiments').doc(experimentId).get();
  const experiment = experimentDoc.data() as Experiment;

  // Get all events
  const eventsSnapshot = await db.collection('experimentEvents')
    .where('experimentId', '==', experimentId)
    .get();

  const events = eventsSnapshot.docs.map((d) => d.data());

  // Get all assignments
  const assignmentsSnapshot = await db.collection('experimentAssignments')
    .where('experimentId', '==', experimentId)
    .get();

  const assignments = assignmentsSnapshot.docs.map((d) => d.data());

  // Calculate results per variant
  const variantResults = experiment.variants.map((variant) => {
    const variantAssignments = assignments.filter((a) => a.variantId === variant.id);
    const variantEvents = events.filter((e) => e.variantId === variant.id);

    const metrics = experiment.metrics.map((metric) => {
      const metricEvents = variantEvents.filter((e) => e.metricId === metric.id);
      
      let value = 0;
      let conversionRate: number | undefined;
      let averageValue: number | undefined;

      switch (metric.type) {
        case 'conversion':
          const uniqueConverters = new Set(metricEvents.map((e) => e.userId)).size;
          conversionRate = variantAssignments.length > 0 
            ? uniqueConverters / variantAssignments.length 
            : 0;
          value = conversionRate;
          break;
        case 'count':
          value = metricEvents.length;
          break;
        case 'value':
          const values = metricEvents.map((e) => e.value || 0);
          averageValue = values.length > 0 
            ? values.reduce((a, b) => a + b, 0) / values.length 
            : 0;
          value = averageValue;
          break;
      }

      return {
        metricId: metric.id,
        metricName: metric.name,
        value,
        sampleSize: variantAssignments.length,
        conversionRate,
        averageValue,
        confidenceInterval: [0, 0] as [number, number], // Simplified
        isSignificant: false, // Would need statistical test
      };
    });

    return {
      variantId: variant.id,
      variantName: variant.name,
      participants: variantAssignments.length,
      metrics,
      isWinner: false,
    };
  });

  // Determine winner (simplified - would need proper statistical testing)
  const controlVariant = variantResults.find((v) => 
    experiment.variants.find((ev) => ev.id === v.variantId)?.isControl
  );
  
  const primaryMetric = experiment.metrics.find((m) => m.isPrimary);
  
  if (controlVariant && primaryMetric) {
    const controlMetricResult = controlVariant.metrics.find((m) => m.metricId === primaryMetric.id);
    
    let bestVariant = controlVariant;
    let bestImprovement = 0;

    for (const variant of variantResults) {
      const metricResult = variant.metrics.find((m) => m.metricId === primaryMetric.id);
      if (metricResult && controlMetricResult && controlMetricResult.value > 0) {
        const improvement = (metricResult.value - controlMetricResult.value) / controlMetricResult.value;
        if (improvement > bestImprovement) {
          bestImprovement = improvement;
          bestVariant = variant;
        }
      }
    }

    bestVariant.isWinner = true;
  }

  // Store results
  await db.collection('experiments').doc(experimentId).update({
    results: {
      experimentId,
      calculatedAt: new Date(),
      totalParticipants: assignments.length,
      variantResults,
      winner: variantResults.find((v) => v.isWinner)?.variantId,
      isSignificant: false, // Would need proper testing
      confidenceLevel: experiment.confidenceLevel,
    },
    updatedAt: new Date(),
  });
}
```

### FILE: src/hooks/useExperiment.ts
```typescript
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface UseExperimentResult<T = any> {
  variant: T | null;
  isLoading: boolean;
  trackEvent: (eventName: string, value?: number, metadata?: Record<string, any>) => Promise<void>;
}

export function useExperiment<T = any>(experimentId: string): UseExperimentResult<T> {
  const { user } = useAuth();
  const [variant, setVariant] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchVariant = async () => {
      try {
        const response = await fetch(`/api/experiments/${experimentId}/variant`);
        if (response.ok) {
          const data = await response.json();
          setVariant(data.variant?.config || null);
        }
      } catch (error) {
        console.error('Error fetching experiment variant:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVariant();
  }, [experimentId, user]);

  const trackEvent = async (
    eventName: string,
    value?: number,
    metadata?: Record<string, any>
  ) => {
    if (!user) return;

    try {
      await fetch(`/api/experiments/${experimentId}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventName, value, metadata }),
      });
    } catch (error) {
      console.error('Error tracking experiment event:', error);
    }
  };

  return { variant, isLoading, trackEvent };
}

export function useFeatureFlag<T = boolean>(flagKey: string, defaultValue: T): T {
  const { user } = useAuth();
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    const fetchFlag = async () => {
      try {
        const response = await fetch(`/api/feature-flags/${flagKey}`);
        if (response.ok) {
          const data = await response.json();
          setValue(data.value ?? defaultValue);
        }
      } catch (error) {
        console.error('Error fetching feature flag:', error);
      }
    };

    fetchFlag();
  }, [flagKey, user, defaultValue]);

  return value;
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 45: ADVANCED ANALYTICS & COHORT ANALYSIS
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 45.1: Create Advanced Analytics System

```
Create comprehensive analytics with cohort analysis and funnel tracking.

### FILE: src/types/analytics.ts
```typescript
import type { Timestamp } from 'firebase/firestore';

export interface AnalyticsEvent {
  id: string;
  userId?: string;
  sessionId: string;
  eventName: string;
  eventCategory: string;
  properties: Record<string, any>;
  userProperties?: Record<string, any>;
  timestamp: Timestamp;
  platform: 'web' | 'ios' | 'android';
  deviceType: 'desktop' | 'tablet' | 'mobile';
  country?: string;
  city?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface Funnel {
  id: string;
  name: string;
  description?: string;
  steps: FunnelStep[];
  timeWindow: number; // hours
  createdAt: Timestamp;
}

export interface FunnelStep {
  id: string;
  name: string;
  eventName: string;
  eventFilters?: Record<string, any>;
  order: number;
}

export interface FunnelAnalysis {
  funnelId: string;
  dateRange: { start: Date; end: Date };
  steps: FunnelStepResult[];
  overallConversion: number;
  averageTimeToConvert: number;
}

export interface FunnelStepResult {
  stepId: string;
  stepName: string;
  users: number;
  conversionRate: number;
  dropoffRate: number;
  averageTimeFromPrevious?: number;
}

export interface Cohort {
  id: string;
  name: string;
  type: 'acquisition' | 'behavior' | 'custom';
  definition: CohortDefinition;
  size: number;
  createdAt: Timestamp;
}

export interface CohortDefinition {
  timeGranularity: 'day' | 'week' | 'month';
  cohortEvent: string;
  cohortFilters?: Record<string, any>;
  returnEvent: string;
  returnFilters?: Record<string, any>;
}

export interface CohortAnalysis {
  cohortId: string;
  dateRange: { start: Date; end: Date };
  cohorts: CohortData[];
}

export interface CohortData {
  cohortDate: string;
  cohortSize: number;
  retentionByPeriod: number[]; // percentage retained for each period
}

export interface UserSegment {
  id: string;
  name: string;
  description?: string;
  rules: SegmentRule[];
  size: number;
  lastCalculated: Timestamp;
  createdAt: Timestamp;
}

export interface SegmentRule {
  type: 'property' | 'event' | 'cohort';
  field?: string;
  operator: 'equals' | 'not_equals' | 'gt' | 'lt' | 'contains' | 'in' | 'did' | 'did_not';
  value: any;
  timeframe?: { value: number; unit: 'days' | 'weeks' | 'months' };
}

export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'funnel' | 'cohort';
  title: string;
  config: WidgetConfig;
  position: { x: number; y: number; w: number; h: number };
}

export interface WidgetConfig {
  metric?: string;
  chartType?: 'line' | 'bar' | 'pie' | 'area';
  dimensions?: string[];
  filters?: Record<string, any>;
  dateRange?: 'today' | '7d' | '30d' | '90d' | 'custom';
  comparison?: 'previous_period' | 'previous_year';
}
```

### FILE: src/lib/analytics/tracking.ts
```typescript
import { db } from '@/lib/firebase/admin';
import { nanoid } from 'nanoid';
import type { AnalyticsEvent } from '@/types/analytics';

export async function trackEvent(
  eventName: string,
  properties: Record<string, any> = {},
  context: {
    userId?: string;
    sessionId?: string;
    platform?: 'web' | 'ios' | 'android';
    deviceType?: 'desktop' | 'tablet' | 'mobile';
    country?: string;
    city?: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  } = {}
): Promise<string> {
  const eventId = nanoid(12);
  
  const event: AnalyticsEvent = {
    id: eventId,
    userId: context.userId,
    sessionId: context.sessionId || nanoid(12),
    eventName,
    eventCategory: categorizeEvent(eventName),
    properties,
    timestamp: new Date() as any,
    platform: context.platform || 'web',
    deviceType: context.deviceType || 'desktop',
    country: context.country,
    city: context.city,
    referrer: context.referrer,
    utmSource: context.utmSource,
    utmMedium: context.utmMedium,
    utmCampaign: context.utmCampaign,
  };

  // Get user properties if userId exists
  if (context.userId) {
    const userDoc = await db.collection('users').doc(context.userId).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      event.userProperties = {
        level: userData?.level,
        totalDonations: userData?.totalDonations,
        memberSince: userData?.createdAt,
        hasSubscription: userData?.hasSubscription,
      };
    }
  }

  await db.collection('analyticsEvents').doc(eventId).set(event);

  // Update real-time counters
  await updateRealtimeCounters(event);

  return eventId;
}

function categorizeEvent(eventName: string): string {
  const categories: Record<string, string[]> = {
    acquisition: ['page_view', 'signup_started', 'signup_completed', 'referral_visit'],
    engagement: ['button_click', 'form_submit', 'video_play', 'scroll_depth', 'share'],
    donation: ['donation_started', 'donation_completed', 'donation_failed', 'subscription_created'],
    commerce: ['bottle_viewed', 'add_to_cart', 'checkout_started', 'purchase_completed'],
    retention: ['login', 'return_visit', 'notification_opened', 'email_opened'],
  };

  for (const [category, events] of Object.entries(categories)) {
    if (events.some((e) => eventName.includes(e))) {
      return category;
    }
  }

  return 'other';
}

async function updateRealtimeCounters(event: AnalyticsEvent): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const counterRef = db.collection('analyticsCounters').doc(`${today}_${event.eventName}`);

  await db.runTransaction(async (transaction) => {
    const counterDoc = await transaction.get(counterRef);
    
    if (counterDoc.exists) {
      transaction.update(counterRef, {
        count: (counterDoc.data()?.count || 0) + 1,
        lastUpdated: new Date(),
      });
    } else {
      transaction.set(counterRef, {
        date: today,
        eventName: event.eventName,
        eventCategory: event.eventCategory,
        count: 1,
        lastUpdated: new Date(),
      });
    }
  });
}

// Pre-defined tracking functions
export const track = {
  pageView: (page: string, context: any) => 
    trackEvent('page_view', { page }, context),
  
  signupStarted: (method: string, context: any) => 
    trackEvent('signup_started', { method }, context),
  
  signupCompleted: (method: string, context: any) => 
    trackEvent('signup_completed', { method }, context),
  
  donationStarted: (amount: number, currency: string, context: any) => 
    trackEvent('donation_started', { amount, currency }, context),
  
  donationCompleted: (donationId: string, amount: number, context: any) => 
    trackEvent('donation_completed', { donationId, amount }, context),
  
  bottleViewed: (bottleId: string, context: any) => 
    trackEvent('bottle_viewed', { bottleId }, context),
  
  addToCart: (itemId: string, itemType: string, price: number, context: any) => 
    trackEvent('add_to_cart', { itemId, itemType, price }, context),
  
  purchaseCompleted: (orderId: string, total: number, items: number, context: any) => 
    trackEvent('purchase_completed', { orderId, total, items }, context),
  
  buttonClick: (buttonId: string, buttonText: string, context: any) => 
    trackEvent('button_click', { buttonId, buttonText }, context),
  
  searchPerformed: (query: string, resultsCount: number, context: any) => 
    trackEvent('search_performed', { query, resultsCount }, context),
};
```

### FILE: src/lib/analytics/funnel.ts
```typescript
import { db } from '@/lib/firebase/admin';
import type { Funnel, FunnelAnalysis, FunnelStepResult } from '@/types/analytics';

export async function analyzeFunnel(
  funnelId: string,
  dateRange: { start: Date; end: Date }
): Promise<FunnelAnalysis> {
  const funnelDoc = await db.collection('funnels').doc(funnelId).get();
  const funnel = funnelDoc.data() as Funnel;

  const sortedSteps = [...funnel.steps].sort((a, b) => a.order - b.order);
  const stepResults: FunnelStepResult[] = [];
  
  let previousStepUsers: Set<string> = new Set();
  let totalStartUsers = 0;

  for (let i = 0; i < sortedSteps.length; i++) {
    const step = sortedSteps[i];
    
    // Query events for this step
    let query = db.collection('analyticsEvents')
      .where('eventName', '==', step.eventName)
      .where('timestamp', '>=', dateRange.start)
      .where('timestamp', '<=', dateRange.end);

    // Apply step filters
    if (step.eventFilters) {
      for (const [key, value] of Object.entries(step.eventFilters)) {
        query = query.where(`properties.${key}`, '==', value);
      }
    }

    const eventsSnapshot = await query.get();
    const stepUsers = new Set<string>();
    const eventTimes: Map<string, Date> = new Map();

    eventsSnapshot.docs.forEach((doc) => {
      const event = doc.data();
      if (event.userId) {
        stepUsers.add(event.userId);
        if (!eventTimes.has(event.userId)) {
          eventTimes.set(event.userId, event.timestamp.toDate());
        }
      }
    });

    // Filter to users who completed previous step (if not first step)
    let validUsers: Set<string>;
    if (i === 0) {
      validUsers = stepUsers;
      totalStartUsers = validUsers.size;
    } else {
      validUsers = new Set([...stepUsers].filter((u) => previousStepUsers.has(u)));
    }

    const conversionRate = i === 0 ? 1 : 
      (previousStepUsers.size > 0 ? validUsers.size / previousStepUsers.size : 0);
    
    const dropoffRate = 1 - conversionRate;

    stepResults.push({
      stepId: step.id,
      stepName: step.name,
      users: validUsers.size,
      conversionRate,
      dropoffRate,
    });

    previousStepUsers = validUsers;
  }

  const overallConversion = totalStartUsers > 0 
    ? stepResults[stepResults.length - 1].users / totalStartUsers 
    : 0;

  return {
    funnelId,
    dateRange,
    steps: stepResults,
    overallConversion,
    averageTimeToConvert: 0, // Would calculate from timestamps
  };
}

// Pre-defined funnels
export const STANDARD_FUNNELS = {
  donationFunnel: {
    name: 'Donation Funnel',
    steps: [
      { id: '1', name: 'Page View', eventName: 'page_view', order: 1 },
      { id: '2', name: 'Donation Started', eventName: 'donation_started', order: 2 },
      { id: '3', name: 'Payment Info Entered', eventName: 'payment_info_entered', order: 3 },
      { id: '4', name: 'Donation Completed', eventName: 'donation_completed', order: 4 },
    ],
    timeWindow: 24,
  },
  signupFunnel: {
    name: 'Signup Funnel',
    steps: [
      { id: '1', name: 'Landing Page', eventName: 'page_view', order: 1, eventFilters: { page: '/' } },
      { id: '2', name: 'Signup Started', eventName: 'signup_started', order: 2 },
      { id: '3', name: 'Email Verified', eventName: 'email_verified', order: 3 },
      { id: '4', name: 'Profile Completed', eventName: 'profile_completed', order: 4 },
    ],
    timeWindow: 168, // 7 days
  },
  purchaseFunnel: {
    name: 'Bottle Purchase Funnel',
    steps: [
      { id: '1', name: 'Bottle Viewed', eventName: 'bottle_viewed', order: 1 },
      { id: '2', name: 'Added to Cart', eventName: 'add_to_cart', order: 2 },
      { id: '3', name: 'Checkout Started', eventName: 'checkout_started', order: 3 },
      { id: '4', name: 'Purchase Completed', eventName: 'purchase_completed', order: 4 },
    ],
    timeWindow: 72,
  },
};
```

### FILE: src/lib/analytics/cohort.ts
```typescript
import { db } from '@/lib/firebase/admin';
import type { Cohort, CohortAnalysis, CohortData, CohortDefinition } from '@/types/analytics';

export async function analyzeCohort(
  cohortId: string,
  dateRange: { start: Date; end: Date },
  periods: number = 12
): Promise<CohortAnalysis> {
  const cohortDoc = await db.collection('cohorts').doc(cohortId).get();
  const cohort = cohortDoc.data() as Cohort;

  const cohorts: CohortData[] = [];
  const { timeGranularity, cohortEvent, returnEvent } = cohort.definition;

  // Generate cohort periods
  const periodMs = timeGranularity === 'day' ? 86400000 :
                   timeGranularity === 'week' ? 604800000 : 2592000000;

  let currentDate = new Date(dateRange.start);
  
  while (currentDate <= dateRange.end) {
    const periodStart = new Date(currentDate);
    const periodEnd = new Date(currentDate.getTime() + periodMs);

    // Get users who did cohort event in this period
    const cohortUsersSnapshot = await db.collection('analyticsEvents')
      .where('eventName', '==', cohortEvent)
      .where('timestamp', '>=', periodStart)
      .where('timestamp', '<', periodEnd)
      .get();

    const cohortUsers = new Set<string>();
    cohortUsersSnapshot.docs.forEach((doc) => {
      const userId = doc.data().userId;
      if (userId) cohortUsers.add(userId);
    });

    const cohortSize = cohortUsers.size;
    const retentionByPeriod: number[] = [];

    // Calculate retention for each subsequent period
    for (let p = 0; p < periods; p++) {
      const retentionStart = new Date(periodStart.getTime() + p * periodMs);
      const retentionEnd = new Date(retentionStart.getTime() + periodMs);

      if (retentionEnd > new Date()) {
        retentionByPeriod.push(-1); // Future period
        continue;
      }

      // Get users who did return event in this period
      const returnUsersSnapshot = await db.collection('analyticsEvents')
        .where('eventName', '==', returnEvent)
        .where('timestamp', '>=', retentionStart)
        .where('timestamp', '<', retentionEnd)
        .get();

      const returnUsers = new Set<string>();
      returnUsersSnapshot.docs.forEach((doc) => {
        const userId = doc.data().userId;
        if (userId && cohortUsers.has(userId)) {
          returnUsers.add(userId);
        }
      });

      const retention = cohortSize > 0 ? returnUsers.size / cohortSize : 0;
      retentionByPeriod.push(retention);
    }

    cohorts.push({
      cohortDate: periodStart.toISOString().split('T')[0],
      cohortSize,
      retentionByPeriod,
    });

    currentDate = periodEnd;
  }

  return {
    cohortId,
    dateRange,
    cohorts,
  };
}

// Pre-defined cohort definitions
export const STANDARD_COHORTS = {
  signupRetention: {
    name: 'Signup Retention',
    type: 'acquisition' as const,
    definition: {
      timeGranularity: 'week' as const,
      cohortEvent: 'signup_completed',
      returnEvent: 'login',
    },
  },
  donorRetention: {
    name: 'Donor Retention',
    type: 'behavior' as const,
    definition: {
      timeGranularity: 'month' as const,
      cohortEvent: 'donation_completed',
      returnEvent: 'donation_completed',
    },
  },
  engagementRetention: {
    name: 'Engagement Retention',
    type: 'acquisition' as const,
    definition: {
      timeGranularity: 'week' as const,
      cohortEvent: 'signup_completed',
      returnEvent: 'page_view',
    },
  },
};
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 46: CUSTOM REPORT BUILDER
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 46.1: Create Report Builder System

```
Create a flexible report builder for custom analytics reports.

### FILE: src/types/reports.ts
```typescript
import type { Timestamp } from 'firebase/firestore';

export interface Report {
  id: string;
  name: string;
  description?: string;
  type: 'standard' | 'custom';
  category: 'donations' | 'users' | 'impact' | 'engagement' | 'financial' | 'custom';
  config: ReportConfig;
  schedule?: ReportSchedule;
  recipients?: string[];
  lastRunAt?: Timestamp;
  lastRunStatus?: 'success' | 'failed';
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ReportConfig {
  dataSource: string;
  columns: ReportColumn[];
  filters: ReportFilter[];
  groupBy?: string[];
  orderBy?: { column: string; direction: 'asc' | 'desc' }[];
  limit?: number;
  dateRange: {
    type: 'fixed' | 'relative';
    start?: string;
    end?: string;
    relativePeriod?: 'today' | 'yesterday' | 'last_7_days' | 'last_30_days' | 'this_month' | 'last_month' | 'this_year';
  };
  visualization?: ReportVisualization;
}

export interface ReportColumn {
  id: string;
  field: string;
  label: string;
  type: 'dimension' | 'metric';
  aggregation?: 'sum' | 'avg' | 'count' | 'count_distinct' | 'min' | 'max';
  format?: 'number' | 'currency' | 'percentage' | 'date' | 'datetime';
  formula?: string;
}

export interface ReportFilter {
  id: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'gt' | 'gte' | 'lt' | 'lte' | 'between' | 'in' | 'not_in' | 'is_null' | 'is_not_null';
  value: any;
  valueEnd?: any; // For 'between' operator
}

export interface ReportVisualization {
  type: 'table' | 'bar_chart' | 'line_chart' | 'pie_chart' | 'area_chart' | 'metric_card';
  options?: {
    xAxis?: string;
    yAxis?: string[];
    colors?: string[];
    showLegend?: boolean;
    stacked?: boolean;
  };
}

export interface ReportSchedule {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  time: string; // HH:mm
  timezone: string;
  format: 'pdf' | 'csv' | 'excel';
}

export interface ReportExecution {
  id: string;
  reportId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: Timestamp;
  completedAt?: Timestamp;
  rowCount?: number;
  fileUrl?: string;
  errorMessage?: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  config: ReportConfig;
  thumbnail?: string;
}
```

### FILE: src/lib/reports/builder.ts
```typescript
import { db } from '@/lib/firebase/admin';
import type { Report, ReportConfig, ReportExecution } from '@/types/reports';

const DATA_SOURCES = {
  donations: {
    collection: 'donations',
    availableFields: [
      { name: 'id', type: 'string', label: 'Donation ID' },
      { name: 'amount', type: 'number', label: 'Amount' },
      { name: 'currency', type: 'string', label: 'Currency' },
      { name: 'status', type: 'string', label: 'Status' },
      { name: 'paymentMethod', type: 'string', label: 'Payment Method' },
      { name: 'isRecurring', type: 'boolean', label: 'Is Recurring' },
      { name: 'isAnonymous', type: 'boolean', label: 'Is Anonymous' },
      { name: 'projectId', type: 'string', label: 'Project ID' },
      { name: 'partnerId', type: 'string', label: 'Partner ID' },
      { name: 'createdAt', type: 'timestamp', label: 'Created At' },
    ],
  },
  users: {
    collection: 'users',
    availableFields: [
      { name: 'id', type: 'string', label: 'User ID' },
      { name: 'email', type: 'string', label: 'Email' },
      { name: 'firstName', type: 'string', label: 'First Name' },
      { name: 'lastName', type: 'string', label: 'Last Name' },
      { name: 'country', type: 'string', label: 'Country' },
      { name: 'level', type: 'number', label: 'Level' },
      { name: 'totalDonations', type: 'number', label: 'Total Donations' },
      { name: 'referralCode', type: 'string', label: 'Referral Code' },
      { name: 'createdAt', type: 'timestamp', label: 'Signup Date' },
    ],
  },
  orders: {
    collection: 'orders',
    availableFields: [
      { name: 'id', type: 'string', label: 'Order ID' },
      { name: 'total', type: 'number', label: 'Total' },
      { name: 'status', type: 'string', label: 'Status' },
      { name: 'itemCount', type: 'number', label: 'Item Count' },
      { name: 'shippingCountry', type: 'string', label: 'Shipping Country' },
      { name: 'createdAt', type: 'timestamp', label: 'Order Date' },
    ],
  },
  events: {
    collection: 'analyticsEvents',
    availableFields: [
      { name: 'eventName', type: 'string', label: 'Event Name' },
      { name: 'eventCategory', type: 'string', label: 'Category' },
      { name: 'userId', type: 'string', label: 'User ID' },
      { name: 'platform', type: 'string', label: 'Platform' },
      { name: 'country', type: 'string', label: 'Country' },
      { name: 'timestamp', type: 'timestamp', label: 'Timestamp' },
    ],
  },
};

export async function executeReport(reportId: string): Promise<ReportExecution> {
  const executionId = crypto.randomUUID();
  
  // Create execution record
  await db.collection('reportExecutions').doc(executionId).set({
    id: executionId,
    reportId,
    status: 'running',
    startedAt: new Date(),
  });

  try {
    const reportDoc = await db.collection('reports').doc(reportId).get();
    const report = reportDoc.data() as Report;

    const results = await runReportQuery(report.config);

    // Store results
    await db.collection('reportResults').doc(executionId).set({
      executionId,
      reportId,
      data: results,
      createdAt: new Date(),
    });

    // Update execution status
    await db.collection('reportExecutions').doc(executionId).update({
      status: 'completed',
      completedAt: new Date(),
      rowCount: results.length,
    });

    // Update report last run
    await db.collection('reports').doc(reportId).update({
      lastRunAt: new Date(),
      lastRunStatus: 'success',
    });

    return {
      id: executionId,
      reportId,
      status: 'completed',
      startedAt: new Date() as any,
      completedAt: new Date() as any,
      rowCount: results.length,
    };
  } catch (error) {
    await db.collection('reportExecutions').doc(executionId).update({
      status: 'failed',
      completedAt: new Date(),
      errorMessage: (error as Error).message,
    });

    await db.collection('reports').doc(reportId).update({
      lastRunAt: new Date(),
      lastRunStatus: 'failed',
    });

    throw error;
  }
}

async function runReportQuery(config: ReportConfig): Promise<any[]> {
  const dataSource = DATA_SOURCES[config.dataSource as keyof typeof DATA_SOURCES];
  if (!dataSource) throw new Error(`Unknown data source: ${config.dataSource}`);

  let query: any = db.collection(dataSource.collection);

  // Apply date range filter
  const dateRange = getDateRange(config.dateRange);
  if (dateRange) {
    query = query
      .where('createdAt', '>=', dateRange.start)
      .where('createdAt', '<=', dateRange.end);
  }

  // Apply filters
  for (const filter of config.filters) {
    query = applyFilter(query, filter);
  }

  // Apply limit
  if (config.limit) {
    query = query.limit(config.limit);
  }

  const snapshot = await query.get();
  let results = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

  // Apply grouping and aggregations
  if (config.groupBy && config.groupBy.length > 0) {
    results = aggregateResults(results, config.columns, config.groupBy);
  }

  // Apply sorting
  if (config.orderBy && config.orderBy.length > 0) {
    results = sortResults(results, config.orderBy);
  }

  // Select only requested columns
  results = results.map((row: any) => {
    const selected: any = {};
    for (const column of config.columns) {
      selected[column.id] = formatValue(row[column.field], column);
    }
    return selected;
  });

  return results;
}

function getDateRange(dateRange: ReportConfig['dateRange']): { start: Date; end: Date } | null {
  if (dateRange.type === 'fixed' && dateRange.start && dateRange.end) {
    return {
      start: new Date(dateRange.start),
      end: new Date(dateRange.end),
    };
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (dateRange.relativePeriod) {
    case 'today':
      return { start: today, end: now };
    case 'yesterday':
      const yesterday = new Date(today.getTime() - 86400000);
      return { start: yesterday, end: today };
    case 'last_7_days':
      return { start: new Date(today.getTime() - 7 * 86400000), end: now };
    case 'last_30_days':
      return { start: new Date(today.getTime() - 30 * 86400000), end: now };
    case 'this_month':
      return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: now };
    case 'last_month':
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      return { start: lastMonth, end: lastMonthEnd };
    case 'this_year':
      return { start: new Date(now.getFullYear(), 0, 1), end: now };
    default:
      return null;
  }
}

function applyFilter(query: any, filter: any): any {
  const operators: Record<string, any> = {
    equals: '==',
    not_equals: '!=',
    gt: '>',
    gte: '>=',
    lt: '<',
    lte: '<=',
    in: 'in',
    not_in: 'not-in',
  };

  const op = operators[filter.operator];
  if (op) {
    return query.where(filter.field, op, filter.value);
  }

  return query;
}

function aggregateResults(results: any[], columns: any[], groupBy: string[]): any[] {
  const groups: Map<string, any[]> = new Map();

  for (const row of results) {
    const key = groupBy.map((g) => row[g]).join('|');
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(row);
  }

  const aggregated: any[] = [];
  
  for (const [key, rows] of groups) {
    const result: any = {};
    
    // Add group by fields
    groupBy.forEach((g, i) => {
      result[g] = key.split('|')[i];
    });

    // Calculate aggregations
    for (const column of columns) {
      if (column.type === 'metric' && column.aggregation) {
        const values = rows.map((r) => r[column.field]).filter((v) => v !== undefined);
        
        switch (column.aggregation) {
          case 'sum':
            result[column.field] = values.reduce((a, b) => a + b, 0);
            break;
          case 'avg':
            result[column.field] = values.length > 0 
              ? values.reduce((a, b) => a + b, 0) / values.length 
              : 0;
            break;
          case 'count':
            result[column.field] = values.length;
            break;
          case 'count_distinct':
            result[column.field] = new Set(values).size;
            break;
          case 'min':
            result[column.field] = Math.min(...values);
            break;
          case 'max':
            result[column.field] = Math.max(...values);
            break;
        }
      }
    }

    aggregated.push(result);
  }

  return aggregated;
}

function sortResults(results: any[], orderBy: any[]): any[] {
  return [...results].sort((a, b) => {
    for (const { column, direction } of orderBy) {
      if (a[column] < b[column]) return direction === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
}

function formatValue(value: any, column: any): any {
  if (value === undefined || value === null) return null;

  switch (column.format) {
    case 'currency':
      return typeof value === 'number' ? `€${value.toFixed(2)}` : value;
    case 'percentage':
      return typeof value === 'number' ? `${(value * 100).toFixed(1)}%` : value;
    case 'date':
      return value?.toDate?.() 
        ? value.toDate().toISOString().split('T')[0] 
        : value;
    case 'datetime':
      return value?.toDate?.() 
        ? value.toDate().toISOString() 
        : value;
    default:
      return value;
  }
}

export const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'donation_summary',
    name: 'Donation Summary',
    description: 'Overview of donations by status and payment method',
    category: 'donations',
    config: {
      dataSource: 'donations',
      columns: [
        { id: 'status', field: 'status', label: 'Status', type: 'dimension' },
        { id: 'count', field: 'id', label: 'Count', type: 'metric', aggregation: 'count' },
        { id: 'total', field: 'amount', label: 'Total', type: 'metric', aggregation: 'sum', format: 'currency' },
        { id: 'avg', field: 'amount', label: 'Average', type: 'metric', aggregation: 'avg', format: 'currency' },
      ],
      filters: [],
      groupBy: ['status'],
      dateRange: { type: 'relative', relativePeriod: 'last_30_days' },
      visualization: { type: 'bar_chart', options: { xAxis: 'status', yAxis: ['total'] } },
    },
  },
  {
    id: 'user_growth',
    name: 'User Growth',
    description: 'New user signups over time',
    category: 'users',
    config: {
      dataSource: 'users',
      columns: [
        { id: 'date', field: 'createdAt', label: 'Date', type: 'dimension', format: 'date' },
        { id: 'signups', field: 'id', label: 'Signups', type: 'metric', aggregation: 'count' },
      ],
      filters: [],
      groupBy: ['createdAt'],
      dateRange: { type: 'relative', relativePeriod: 'last_30_days' },
      visualization: { type: 'line_chart', options: { xAxis: 'date', yAxis: ['signups'] } },
    },
  },
  {
    id: 'top_donors',
    name: 'Top Donors',
    description: 'Highest contributing donors',
    category: 'donations',
    config: {
      dataSource: 'donations',
      columns: [
        { id: 'userId', field: 'userId', label: 'User', type: 'dimension' },
        { id: 'donations', field: 'id', label: 'Donations', type: 'metric', aggregation: 'count' },
        { id: 'total', field: 'amount', label: 'Total', type: 'metric', aggregation: 'sum', format: 'currency' },
      ],
      filters: [{ id: '1', field: 'status', operator: 'equals', value: 'completed' }],
      groupBy: ['userId'],
      orderBy: [{ column: 'total', direction: 'desc' }],
      limit: 50,
      dateRange: { type: 'relative', relativePeriod: 'this_year' },
      visualization: { type: 'table' },
    },
  },
];
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 47: VOLUNTEER MANAGEMENT SYSTEM
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 47.1: Create Volunteer Management

```
Create a volunteer management system with shift scheduling and hour tracking.

### FILE: src/types/volunteer.ts
```typescript
import type { Timestamp } from 'firebase/firestore';

export interface Volunteer {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  skills: string[];
  interests: string[];
  availability: VolunteerAvailability;
  status: 'pending' | 'active' | 'inactive' | 'suspended';
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  backgroundCheckStatus?: 'pending' | 'approved' | 'rejected';
  backgroundCheckDate?: Timestamp;
  totalHours: number;
  badgesEarned: string[];
  notes?: string;
  joinedAt: Timestamp;
  updatedAt: Timestamp;
}

export interface VolunteerAvailability {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

export interface TimeSlot {
  start: string; // HH:mm
  end: string;
}

export interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  type: 'event' | 'ongoing' | 'project';
  location: {
    type: 'onsite' | 'remote' | 'hybrid';
    address?: string;
    city?: string;
    country?: string;
  };
  skillsRequired: string[];
  skillsPreferred?: string[];
  spotsTotal: number;
  spotsFilled: number;
  minAge?: number;
  requiresBackgroundCheck: boolean;
  startDate: Timestamp;
  endDate?: Timestamp;
  shifts: VolunteerShift[];
  contactPerson: {
    name: string;
    email: string;
    phone?: string;
  };
  status: 'draft' | 'published' | 'filled' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface VolunteerShift {
  id: string;
  opportunityId: string;
  date: Timestamp;
  startTime: string;
  endTime: string;
  spotsTotal: number;
  spotsFilled: number;
  assignments: ShiftAssignment[];
  notes?: string;
}

export interface ShiftAssignment {
  id: string;
  shiftId: string;
  volunteerId: string;
  volunteerName: string;
  status: 'scheduled' | 'checked_in' | 'checked_out' | 'no_show' | 'cancelled';
  checkedInAt?: Timestamp;
  checkedOutAt?: Timestamp;
  hoursLogged?: number;
  notes?: string;
  assignedAt: Timestamp;
}

export interface VolunteerHourLog {
  id: string;
  volunteerId: string;
  opportunityId?: string;
  shiftId?: string;
  date: Timestamp;
  hours: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Timestamp;
  createdAt: Timestamp;
}

export interface VolunteerBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: {
    type: 'hours' | 'shifts' | 'events' | 'milestone';
    threshold: number;
  };
}

export interface VolunteerApplication {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  motivation: string;
  skills: string[];
  availability: VolunteerAvailability;
  referenceContact?: {
    name: string;
    email: string;
    phone: string;
    relationship: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'interview_scheduled';
  reviewedBy?: string;
  reviewedAt?: Timestamp;
  reviewNotes?: string;
  interviewDate?: Timestamp;
  submittedAt: Timestamp;
}
```

### FILE: src/lib/volunteers/service.ts
```typescript
import { db } from '@/lib/firebase/admin';
import { sendEmail } from '@/lib/email/service';
import type { 
  Volunteer, 
  VolunteerOpportunity, 
  VolunteerShift, 
  ShiftAssignment,
  VolunteerHourLog,
  VolunteerApplication
} from '@/types/volunteer';

export async function createVolunteerApplication(
  application: Omit<VolunteerApplication, 'id' | 'status' | 'submittedAt'>
): Promise<string> {
  const applicationId = crypto.randomUUID();
  
  await db.collection('volunteerApplications').doc(applicationId).set({
    id: applicationId,
    ...application,
    status: 'pending',
    submittedAt: new Date(),
  });

  // Notify volunteer coordinators
  await db.collection('notifications').add({
    type: 'volunteer_application',
    title: 'New Volunteer Application',
    body: `${application.firstName} ${application.lastName} has applied to volunteer.`,
    targetRole: 'volunteer_coordinator',
    data: { applicationId },
    createdAt: new Date(),
  });

  // Send confirmation email
  await sendEmail({
    to: application.email,
    subject: 'Volunteer Application Received - GRATIS.NGO',
    template: 'volunteer_application_received',
    data: { firstName: application.firstName },
  });

  return applicationId;
}

export async function approveVolunteerApplication(
  applicationId: string,
  reviewedBy: string,
  notes?: string
): Promise<Volunteer> {
  const applicationDoc = await db.collection('volunteerApplications').doc(applicationId).get();
  const application = applicationDoc.data() as VolunteerApplication;

  // Update application
  await db.collection('volunteerApplications').doc(applicationId).update({
    status: 'approved',
    reviewedBy,
    reviewedAt: new Date(),
    reviewNotes: notes,
  });

  // Create volunteer record
  const volunteerId = crypto.randomUUID();
  const volunteer: Volunteer = {
    id: volunteerId,
    userId: application.userId,
    firstName: application.firstName,
    lastName: application.lastName,
    email: application.email,
    phone: application.phone,
    skills: application.skills,
    interests: [],
    availability: application.availability,
    status: 'active',
    totalHours: 0,
    badgesEarned: [],
    joinedAt: new Date() as any,
    updatedAt: new Date() as any,
  };

  await db.collection('volunteers').doc(volunteerId).set(volunteer);

  // Update user record
  await db.collection('users').doc(application.userId).update({
    isVolunteer: true,
    volunteerId,
  });

  // Send welcome email
  await sendEmail({
    to: application.email,
    subject: 'Welcome to the GRATIS.NGO Volunteer Team! 🎉',
    template: 'volunteer_welcome',
    data: { firstName: application.firstName },
  });

  return volunteer;
}

export async function assignVolunteerToShift(
  volunteerId: string,
  shiftId: string
): Promise<ShiftAssignment> {
  const shiftRef = db.collection('volunteerShifts').doc(shiftId);
  const shiftDoc = await shiftRef.get();
  const shift = shiftDoc.data() as VolunteerShift;

  if (shift.spotsFilled >= shift.spotsTotal) {
    throw new Error('Shift is full');
  }

  const volunteerDoc = await db.collection('volunteers').doc(volunteerId).get();
  const volunteer = volunteerDoc.data() as Volunteer;

  const assignmentId = `${shiftId}_${volunteerId}`;
  const assignment: ShiftAssignment = {
    id: assignmentId,
    shiftId,
    volunteerId,
    volunteerName: `${volunteer.firstName} ${volunteer.lastName}`,
    status: 'scheduled',
    assignedAt: new Date() as any,
  };

  await db.runTransaction(async (transaction) => {
    transaction.update(shiftRef, {
      spotsFilled: shift.spotsFilled + 1,
      assignments: [...shift.assignments, assignment],
    });
  });

  // Send confirmation
  await sendEmail({
    to: volunteer.email,
    subject: 'Shift Confirmed - GRATIS.NGO',
    template: 'volunteer_shift_confirmed',
    data: {
      firstName: volunteer.firstName,
      shiftDate: shift.date,
      startTime: shift.startTime,
      endTime: shift.endTime,
    },
  });

  return assignment;
}

export async function checkInVolunteer(
  shiftId: string,
  volunteerId: string
): Promise<void> {
  const shiftRef = db.collection('volunteerShifts').doc(shiftId);
  const shiftDoc = await shiftRef.get();
  const shift = shiftDoc.data() as VolunteerShift;

  const updatedAssignments = shift.assignments.map((a) => {
    if (a.volunteerId === volunteerId) {
      return { ...a, status: 'checked_in' as const, checkedInAt: new Date() };
    }
    return a;
  });

  await shiftRef.update({ assignments: updatedAssignments });
}

export async function checkOutVolunteer(
  shiftId: string,
  volunteerId: string
): Promise<number> {
  const shiftRef = db.collection('volunteerShifts').doc(shiftId);
  const shiftDoc = await shiftRef.get();
  const shift = shiftDoc.data() as VolunteerShift;

  const assignment = shift.assignments.find((a) => a.volunteerId === volunteerId);
  if (!assignment || !assignment.checkedInAt) {
    throw new Error('Volunteer not checked in');
  }

  const checkedOutAt = new Date();
  const hoursLogged = (checkedOutAt.getTime() - assignment.checkedInAt.toDate().getTime()) / (1000 * 60 * 60);

  const updatedAssignments = shift.assignments.map((a) => {
    if (a.volunteerId === volunteerId) {
      return { ...a, status: 'checked_out' as const, checkedOutAt, hoursLogged };
    }
    return a;
  });

  await shiftRef.update({ assignments: updatedAssignments });

  // Log hours
  await logVolunteerHours(volunteerId, hoursLogged, shift.opportunityId, shiftId);

  // Update volunteer total hours
  await db.collection('volunteers').doc(volunteerId).update({
    totalHours: admin.firestore.FieldValue.increment(hoursLogged),
    updatedAt: new Date(),
  });

  // Check for badge achievements
  await checkVolunteerBadges(volunteerId);

  return hoursLogged;
}

async function logVolunteerHours(
  volunteerId: string,
  hours: number,
  opportunityId?: string,
  shiftId?: string
): Promise<void> {
  const logId = crypto.randomUUID();
  
  await db.collection('volunteerHourLogs').doc(logId).set({
    id: logId,
    volunteerId,
    opportunityId,
    shiftId,
    date: new Date(),
    hours,
    description: 'Shift completed',
    status: 'approved',
    approvedAt: new Date(),
    createdAt: new Date(),
  });
}

async function checkVolunteerBadges(volunteerId: string): Promise<void> {
  const volunteerDoc = await db.collection('volunteers').doc(volunteerId).get();
  const volunteer = volunteerDoc.data() as Volunteer;

  const badgesSnapshot = await db.collection('volunteerBadges').get();
  const badges = badgesSnapshot.docs.map((d) => d.data());

  const newBadges: string[] = [];

  for (const badge of badges) {
    if (volunteer.badgesEarned.includes(badge.id)) continue;

    let earned = false;

    switch (badge.requirement.type) {
      case 'hours':
        earned = volunteer.totalHours >= badge.requirement.threshold;
        break;
      case 'shifts':
        const shiftsCount = await db.collection('volunteerShifts')
          .where('assignments', 'array-contains', { volunteerId, status: 'checked_out' })
          .count()
          .get();
        earned = shiftsCount.data().count >= badge.requirement.threshold;
        break;
    }

    if (earned) {
      newBadges.push(badge.id);
    }
  }

  if (newBadges.length > 0) {
    await db.collection('volunteers').doc(volunteerId).update({
      badgesEarned: [...volunteer.badgesEarned, ...newBadges],
    });

    // Notify volunteer
    await db.collection('notifications').add({
      userId: volunteer.userId,
      type: 'volunteer_badge_earned',
      title: 'New Volunteer Badge! 🏅',
      body: 'You earned a new volunteer badge for your dedication!',
      createdAt: new Date(),
    });
  }
}

export async function getVolunteerStats(volunteerId: string): Promise<{
  totalHours: number;
  shiftsCompleted: number;
  upcomingShifts: number;
  badgesCount: number;
  rank: number;
}> {
  const volunteerDoc = await db.collection('volunteers').doc(volunteerId).get();
  const volunteer = volunteerDoc.data() as Volunteer;

  // Get shifts completed
  const completedShiftsSnapshot = await db.collectionGroup('assignments')
    .where('volunteerId', '==', volunteerId)
    .where('status', '==', 'checked_out')
    .get();

  // Get upcoming shifts
  const upcomingShiftsSnapshot = await db.collectionGroup('assignments')
    .where('volunteerId', '==', volunteerId)
    .where('status', '==', 'scheduled')
    .get();

  // Get rank
  const allVolunteersSnapshot = await db.collection('volunteers')
    .where('status', '==', 'active')
    .orderBy('totalHours', 'desc')
    .get();

  const rank = allVolunteersSnapshot.docs.findIndex((d) => d.id === volunteerId) + 1;

  return {
    totalHours: volunteer.totalHours,
    shiftsCompleted: completedShiftsSnapshot.size,
    upcomingShifts: upcomingShiftsSnapshot.size,
    badgesCount: volunteer.badgesEarned.length,
    rank,
  };
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 48: MULTI-CURRENCY & INTERNATIONAL SUPPORT
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 48.1: Create Multi-Currency System

```
Create multi-currency support with exchange rates and localization.

### FILE: src/types/currency.ts
```typescript
import type { Timestamp } from 'firebase/firestore';

export interface Currency {
  code: string; // ISO 4217
  name: string;
  symbol: string;
  symbolPosition: 'before' | 'after';
  decimalPlaces: number;
  thousandsSeparator: string;
  decimalSeparator: string;
  isSupported: boolean;
  isDefault: boolean;
}

export interface ExchangeRate {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  source: 'manual' | 'api' | 'calculated';
  validFrom: Timestamp;
  validTo?: Timestamp;
  updatedAt: Timestamp;
}

export interface CurrencyAmount {
  amount: number;
  currency: string;
  convertedAmount?: number;
  convertedCurrency?: string;
  exchangeRate?: number;
}

export interface LocaleConfig {
  code: string; // e.g., 'en-US', 'nl-NL', 'de-DE'
  language: string;
  country: string;
  currency: string;
  dateFormat: string;
  timeFormat: string;
  numberFormat: {
    thousandsSeparator: string;
    decimalSeparator: string;
  };
  translations: Record<string, string>;
}

export interface TaxConfig {
  country: string;
  vatRate: number;
  vatNumber?: string;
  isEU: boolean;
  reverseCharge: boolean;
  taxExemptForDonations: boolean;
}
```

### FILE: src/lib/currency/service.ts
```typescript
import { db } from '@/lib/firebase/admin';
import type { Currency, ExchangeRate, CurrencyAmount } from '@/types/currency';

const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'EUR', name: 'Euro', symbol: '€', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: '.', decimalSeparator: ',', isSupported: true, isDefault: true },
  { code: 'USD', name: 'US Dollar', symbol: '$', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: ',', decimalSeparator: '.', isSupported: true, isDefault: false },
  { code: 'GBP', name: 'British Pound', symbol: '£', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: ',', decimalSeparator: '.', isSupported: true, isDefault: false },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', symbolPosition: 'after', decimalPlaces: 2, thousandsSeparator: "'", decimalSeparator: '.', isSupported: true, isDefault: false },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', symbolPosition: 'after', decimalPlaces: 2, thousandsSeparator: ' ', decimalSeparator: ',', isSupported: true, isDefault: false },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', symbolPosition: 'after', decimalPlaces: 2, thousandsSeparator: ' ', decimalSeparator: ',', isSupported: true, isDefault: false },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', symbolPosition: 'after', decimalPlaces: 2, thousandsSeparator: '.', decimalSeparator: ',', isSupported: true, isDefault: false },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', symbolPosition: 'after', decimalPlaces: 2, thousandsSeparator: ' ', decimalSeparator: ',', isSupported: true, isDefault: false },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', symbolPosition: 'after', decimalPlaces: 2, thousandsSeparator: ' ', decimalSeparator: ',', isSupported: true, isDefault: false },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', symbolPosition: 'before', decimalPlaces: 2, thousandsSeparator: ',', decimalSeparator: '.', isSupported: true, isDefault: false },
];

export function getSupportedCurrencies(): Currency[] {
  return SUPPORTED_CURRENCIES.filter((c) => c.isSupported);
}

export function getCurrency(code: string): Currency | undefined {
  return SUPPORTED_CURRENCIES.find((c) => c.code === code);
}

export function getDefaultCurrency(): Currency {
  return SUPPORTED_CURRENCIES.find((c) => c.isDefault)!;
}

export async function getExchangeRate(
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  if (fromCurrency === toCurrency) return 1;

  // Check cache first
  const cacheKey = `exchange_rate_${fromCurrency}_${toCurrency}`;
  const cached = await getCachedRate(cacheKey);
  if (cached) return cached;

  // Get from database
  const rateDoc = await db.collection('exchangeRates')
    .where('fromCurrency', '==', fromCurrency)
    .where('toCurrency', '==', toCurrency)
    .orderBy('validFrom', 'desc')
    .limit(1)
    .get();

  if (!rateDoc.empty) {
    const rate = rateDoc.docs[0].data() as ExchangeRate;
    await cacheRate(cacheKey, rate.rate, 3600); // Cache for 1 hour
    return rate.rate;
  }

  // Try reverse rate
  const reverseRateDoc = await db.collection('exchangeRates')
    .where('fromCurrency', '==', toCurrency)
    .where('toCurrency', '==', fromCurrency)
    .orderBy('validFrom', 'desc')
    .limit(1)
    .get();

  if (!reverseRateDoc.empty) {
    const reverseRate = reverseRateDoc.docs[0].data() as ExchangeRate;
    const rate = 1 / reverseRate.rate;
    await cacheRate(cacheKey, rate, 3600);
    return rate;
  }

  // Fetch from external API
  const apiRate = await fetchExchangeRateFromAPI(fromCurrency, toCurrency);
  if (apiRate) {
    await saveExchangeRate(fromCurrency, toCurrency, apiRate, 'api');
    await cacheRate(cacheKey, apiRate, 3600);
    return apiRate;
  }

  throw new Error(`Exchange rate not found: ${fromCurrency} -> ${toCurrency}`);
}

export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<CurrencyAmount> {
  const rate = await getExchangeRate(fromCurrency, toCurrency);
  const convertedAmount = Math.round(amount * rate * 100) / 100;

  return {
    amount,
    currency: fromCurrency,
    convertedAmount,
    convertedCurrency: toCurrency,
    exchangeRate: rate,
  };
}

export function formatCurrency(
  amount: number,
  currencyCode: string,
  locale?: string
): string {
  const currency = getCurrency(currencyCode);
  if (!currency) {
    return `${amount.toFixed(2)} ${currencyCode}`;
  }

  const formattedNumber = formatNumber(amount, currency);
  
  return currency.symbolPosition === 'before'
    ? `${currency.symbol}${formattedNumber}`
    : `${formattedNumber} ${currency.symbol}`;
}

function formatNumber(amount: number, currency: Currency): string {
  const fixed = amount.toFixed(currency.decimalPlaces);
  const [intPart, decPart] = fixed.split('.');
  
  // Add thousands separators
  const withSeparators = intPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    currency.thousandsSeparator
  );

  return decPart
    ? `${withSeparators}${currency.decimalSeparator}${decPart}`
    : withSeparators;
}

async function fetchExchangeRateFromAPI(
  fromCurrency: string,
  toCurrency: string
): Promise<number | null> {
  try {
    // Using exchangerate-api.com (free tier)
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
    );
    const data = await response.json();
    return data.rates[toCurrency] || null;
  } catch (error) {
    console.error('Failed to fetch exchange rate:', error);
    return null;
  }
}

async function saveExchangeRate(
  fromCurrency: string,
  toCurrency: string,
  rate: number,
  source: 'manual' | 'api' | 'calculated'
): Promise<void> {
  const rateId = `${fromCurrency}_${toCurrency}_${Date.now()}`;
  
  await db.collection('exchangeRates').doc(rateId).set({
    id: rateId,
    fromCurrency,
    toCurrency,
    rate,
    source,
    validFrom: new Date(),
    updatedAt: new Date(),
  });
}

async function getCachedRate(key: string): Promise<number | null> {
  const cacheDoc = await db.collection('cache').doc(key).get();
  if (!cacheDoc.exists) return null;
  
  const cache = cacheDoc.data();
  if (cache?.expiresAt.toDate() < new Date()) return null;
  
  return cache?.value;
}

async function cacheRate(key: string, value: number, ttlSeconds: number): Promise<void> {
  await db.collection('cache').doc(key).set({
    value,
    expiresAt: new Date(Date.now() + ttlSeconds * 1000),
    createdAt: new Date(),
  });
}

// Update exchange rates daily
export async function updateAllExchangeRates(): Promise<void> {
  const baseCurrency = 'EUR';
  const currencies = SUPPORTED_CURRENCIES.filter((c) => c.code !== baseCurrency);

  for (const currency of currencies) {
    try {
      const rate = await fetchExchangeRateFromAPI(baseCurrency, currency.code);
      if (rate) {
        await saveExchangeRate(baseCurrency, currency.code, rate, 'api');
      }
    } catch (error) {
      console.error(`Failed to update rate for ${currency.code}:`, error);
    }
  }
}
```

### FILE: src/lib/i18n/locales.ts
```typescript
import type { LocaleConfig } from '@/types/currency';

export const SUPPORTED_LOCALES: LocaleConfig[] = [
  {
    code: 'en-US',
    language: 'English',
    country: 'US',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'h:mm A',
    numberFormat: { thousandsSeparator: ',', decimalSeparator: '.' },
    translations: {},
  },
  {
    code: 'en-GB',
    language: 'English',
    country: 'GB',
    currency: 'GBP',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    numberFormat: { thousandsSeparator: ',', decimalSeparator: '.' },
    translations: {},
  },
  {
    code: 'nl-NL',
    language: 'Nederlands',
    country: 'NL',
    currency: 'EUR',
    dateFormat: 'DD-MM-YYYY',
    timeFormat: 'HH:mm',
    numberFormat: { thousandsSeparator: '.', decimalSeparator: ',' },
    translations: {
      'donate': 'Doneer',
      'home': 'Home',
      'about': 'Over ons',
      'projects': 'Projecten',
      'events': 'Evenementen',
      'shop': 'Winkel',
      'login': 'Inloggen',
      'signup': 'Registreren',
      'dashboard': 'Dashboard',
      'settings': 'Instellingen',
    },
  },
  {
    code: 'de-DE',
    language: 'Deutsch',
    country: 'DE',
    currency: 'EUR',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: 'HH:mm',
    numberFormat: { thousandsSeparator: '.', decimalSeparator: ',' },
    translations: {
      'donate': 'Spenden',
      'home': 'Startseite',
      'about': 'Über uns',
      'projects': 'Projekte',
      'events': 'Veranstaltungen',
      'shop': 'Shop',
      'login': 'Anmelden',
      'signup': 'Registrieren',
      'dashboard': 'Dashboard',
      'settings': 'Einstellungen',
    },
  },
  {
    code: 'fr-FR',
    language: 'Français',
    country: 'FR',
    currency: 'EUR',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    numberFormat: { thousandsSeparator: ' ', decimalSeparator: ',' },
    translations: {
      'donate': 'Faire un don',
      'home': 'Accueil',
      'about': 'À propos',
      'projects': 'Projets',
      'events': 'Événements',
      'shop': 'Boutique',
      'login': 'Connexion',
      'signup': "S'inscrire",
      'dashboard': 'Tableau de bord',
      'settings': 'Paramètres',
    },
  },
  {
    code: 'ar-AE',
    language: 'العربية',
    country: 'AE',
    currency: 'AED',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    numberFormat: { thousandsSeparator: ',', decimalSeparator: '.' },
    translations: {
      'donate': 'تبرع',
      'home': 'الرئيسية',
      'about': 'من نحن',
      'projects': 'المشاريع',
      'events': 'الفعاليات',
      'shop': 'المتجر',
      'login': 'تسجيل الدخول',
      'signup': 'التسجيل',
      'dashboard': 'لوحة التحكم',
      'settings': 'الإعدادات',
    },
  },
];

export function getLocale(code: string): LocaleConfig | undefined {
  return SUPPORTED_LOCALES.find((l) => l.code === code);
}

export function getLocaleByCountry(country: string): LocaleConfig | undefined {
  return SUPPORTED_LOCALES.find((l) => l.country === country);
}

export function translate(key: string, locale: string): string {
  const localeConfig = getLocale(locale);
  return localeConfig?.translations[key] || key;
}

export function formatDate(date: Date, locale: string): string {
  const localeConfig = getLocale(locale);
  const format = localeConfig?.dateFormat || 'YYYY-MM-DD';
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', String(year));
}

export function formatTime(date: Date, locale: string): string {
  const localeConfig = getLocale(locale);
  const format = localeConfig?.timeFormat || 'HH:mm';
  
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  if (format.includes('A')) {
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  return `${String(hours).padStart(2, '0')}:${minutes}`;
}
```

---

## SUMMARY OF PART 9

| Section | Feature | Description |
|---------|---------|-------------|
| 43 | Push Notifications | FCM integration, deep links, quiet hours, templates |
| 44 | A/B Testing | Experiments, feature flags, variant assignment, tracking |
| 45 | Advanced Analytics | Event tracking, funnels, cohort analysis, segmentation |
| 46 | Report Builder | Custom reports, aggregations, visualizations, scheduling |
| 47 | Volunteer Management | Applications, shifts, check-in/out, hour tracking, badges |
| 48 | Multi-currency | Exchange rates, formatting, localization, translations |

## COMPLETE SYSTEM SUMMARY (Parts 1-9)

| Part | Sections | Focus | Est. Size |
|------|----------|-------|-----------|
| 1 | 1-5 | Foundation (Firebase, Auth, Schema) | ~72KB |
| 2 | 6-10 | Core (Homepage, Dashboard, Bottles, Events, Video) | ~159KB |
| 3 | 11-13 | Community (Social, TRIBE, Donations) | ~69KB |
| 4 | 14-18 | Admin (Impact, Referrals, Admin Panel, CMS, Analytics) | ~128KB |
| 5 | 19-24 | Infrastructure (API, Testing, Security, Notifications) | ~49KB |
| 6 | 25-30 | Partner System (Applications, Dashboard, Payouts) | ~123KB |
| 7 | 31-36 | Partner Advanced (Teams, Profiles, Messaging, Admin) | ~99KB |
| 8 | 37-42 | Gamification, Support, Webhooks, Leaderboards | ~55KB |
| 9 | 43-48 | Push, A/B Testing, Analytics, Reports, Volunteers, i18n | ~65KB |

**Total: ~819KB of production-ready code across 48 sections**
