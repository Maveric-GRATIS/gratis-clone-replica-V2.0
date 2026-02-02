/**
 * Push Notification Types
 * Part 9 - Section 43: Mobile push notifications and deep links
 */

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
  scheduledFor?: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'failed';
  fcmMessageId?: string;
  errorMessage?: string;
  createdAt: Date;
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
  updatedAt: Date;
}

export interface FCMToken {
  token: string;
  platform: 'web' | 'ios' | 'android';
  deviceId: string;
  deviceName?: string;
  lastUsedAt: Date;
  createdAt: Date;
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
  createdAt: Date;
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

export interface NotificationStats {
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  deliveryRate: number;
  openRate: number;
  byChannel: Record<NotificationChannel, {
    sent: number;
    delivered: number;
    opened: number;
    deliveryRate: number;
    openRate: number;
  }>;
}
