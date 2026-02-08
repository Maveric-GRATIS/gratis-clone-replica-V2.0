// src/types/realtime.ts
// Real-time notification types

export type NotificationChannel = 'global' | 'user' | 'admin' | 'project' | 'event';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface RealtimeNotification {
  id: string;
  channel: NotificationChannel;
  targetId?: string; // userId, projectId, etc.
  type: string;
  title: string;
  message: string;
  priority: NotificationPriority;
  data?: Record<string, unknown>;
  actionUrl?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface SSEConnection {
  id: string;
  userId: string;
  channels: string[];
  connectedAt: string;
  lastPingAt: string;
}

export interface NotificationPreferences {
  userId: string;
  channels: {
    email: boolean;
    push: boolean;
    inApp: boolean;
    sms: boolean;
  };
  types: Record<string, boolean>; // notification type -> enabled
  quietHours?: {
    enabled: boolean;
    start: string; // HH:mm
    end: string; // HH:mm
    timezone: string;
  };
  updatedAt: string;
}
