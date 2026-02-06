# GRATIS.NGO — Enterprise Detailed Build Guide — PART 13
## Sections 64–68: API Keys, Real-Time Notifications, Cron Jobs, E2E Testing, Platform Config

> **Continues from Part 12 (Sections 59–63)**
> Total so far: Parts 1–12 = 63 sections, ~300 files, ~1,561KB

---

## SECTION 64 — API KEY MANAGEMENT & DEVELOPER PORTAL

### File 64-1: `src/types/api-keys.ts`

```typescript
// src/types/api-keys.ts
// API key management types for the developer portal

export type APIKeyStatus = 'active' | 'revoked' | 'expired';
export type APIKeyScope = 'read' | 'write' | 'admin';
export type APIKeyEnvironment = 'production' | 'sandbox';

export interface APIKey {
  id: string;
  name: string;
  keyPrefix: string; // First 8 chars shown to user (gratis_pk_...)
  keyHash: string; // SHA-256 hash of full key
  userId: string;
  organizationId?: string;
  status: APIKeyStatus;
  environment: APIKeyEnvironment;
  scopes: APIKeyScope[];
  rateLimit: number; // Requests per minute
  allowedOrigins: string[];
  allowedIPs: string[];
  lastUsedAt?: string;
  usageCount: number;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface APIKeyCreateRequest {
  name: string;
  environment: APIKeyEnvironment;
  scopes: APIKeyScope[];
  rateLimit?: number;
  allowedOrigins?: string[];
  allowedIPs?: string[];
  expiresInDays?: number;
}

export interface APIKeyCreateResponse {
  id: string;
  key: string; // Full key, shown only once
  name: string;
  keyPrefix: string;
  environment: APIKeyEnvironment;
  scopes: APIKeyScope[];
  createdAt: string;
}

export interface APIKeyUsageLog {
  id: string;
  keyId: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTimeMs: number;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

export interface APIKeyUsageStats {
  keyId: string;
  period: string;
  totalRequests: number;
  successCount: number;
  errorCount: number;
  avgResponseTimeMs: number;
  topEndpoints: { endpoint: string; count: number }[];
  requestsByHour: { hour: number; count: number }[];
}

export interface DeveloperApp {
  id: string;
  name: string;
  description: string;
  userId: string;
  websiteUrl?: string;
  callbackUrls: string[];
  apiKeys: string[]; // API key IDs
  webhookUrl?: string;
  webhookSecret?: string;
  status: 'active' | 'suspended';
  createdAt: string;
  updatedAt: string;
}
```

### File 64-2: `src/lib/api-keys/api-key-service.ts`

```typescript
// src/lib/api-keys/api-key-service.ts
// API key generation, validation, and management

import type {
  APIKey,
  APIKeyCreateRequest,
  APIKeyCreateResponse,
  APIKeyUsageLog,
  APIKeyScope,
} from '@/types/api-keys';
import { adminDb } from '@/lib/firebase/admin';
import * as crypto from 'crypto';

const KEY_PREFIX_PRODUCTION = 'gratis_pk_';
const KEY_PREFIX_SANDBOX = 'gratis_sk_';
const DEFAULT_RATE_LIMIT = 60; // per minute
const MAX_KEYS_PER_USER = 10;

export class APIKeyService {
  /**
   * Generate a new API key
   */
  static async createKey(
    userId: string,
    params: APIKeyCreateRequest
  ): Promise<APIKeyCreateResponse> {
    // Check key limit
    const existingKeys = await adminDb
      .collection('api_keys')
      .where('userId', '==', userId)
      .where('status', '==', 'active')
      .get();

    if (existingKeys.size >= MAX_KEYS_PER_USER) {
      throw new Error(`Maximum ${MAX_KEYS_PER_USER} active API keys per user`);
    }

    // Generate key
    const prefix =
      params.environment === 'production'
        ? KEY_PREFIX_PRODUCTION
        : KEY_PREFIX_SANDBOX;
    const rawKey = crypto.randomBytes(32).toString('hex');
    const fullKey = `${prefix}${rawKey}`;
    const keyHash = crypto.createHash('sha256').update(fullKey).digest('hex');
    const keyPrefix = fullKey.slice(0, prefix.length + 8);

    const expiresAt = params.expiresInDays
      ? new Date(
          Date.now() + params.expiresInDays * 24 * 60 * 60 * 1000
        ).toISOString()
      : undefined;

    const apiKey: Omit<APIKey, 'id'> = {
      name: params.name,
      keyPrefix,
      keyHash,
      userId,
      status: 'active',
      environment: params.environment,
      scopes: params.scopes,
      rateLimit: params.rateLimit || DEFAULT_RATE_LIMIT,
      allowedOrigins: params.allowedOrigins || [],
      allowedIPs: params.allowedIPs || [],
      usageCount: 0,
      expiresAt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const ref = await adminDb.collection('api_keys').add(apiKey);

    // Log creation
    await adminDb.collection('audit_logs').add({
      action: 'api_key_created',
      userId,
      resourceId: ref.id,
      metadata: { name: params.name, environment: params.environment },
      timestamp: new Date().toISOString(),
    });

    return {
      id: ref.id,
      key: fullKey,
      name: params.name,
      keyPrefix,
      environment: params.environment,
      scopes: params.scopes,
      createdAt: apiKey.createdAt,
    };
  }

  /**
   * Validate an API key and return its configuration
   */
  static async validateKey(
    key: string,
    options?: {
      requiredScopes?: APIKeyScope[];
      ipAddress?: string;
      origin?: string;
    }
  ): Promise<{ valid: boolean; apiKey?: APIKey; error?: string }> {
    const keyHash = crypto.createHash('sha256').update(key).digest('hex');

    const snap = await adminDb
      .collection('api_keys')
      .where('keyHash', '==', keyHash)
      .where('status', '==', 'active')
      .limit(1)
      .get();

    if (snap.empty) {
      return { valid: false, error: 'Invalid API key' };
    }

    const apiKey = { id: snap.docs[0].id, ...snap.docs[0].data() } as APIKey;

    // Check expiration
    if (apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date()) {
      await adminDb.collection('api_keys').doc(apiKey.id).update({
        status: 'expired',
        updatedAt: new Date().toISOString(),
      });
      return { valid: false, error: 'API key expired' };
    }

    // Check IP whitelist
    if (apiKey.allowedIPs.length > 0 && options?.ipAddress) {
      if (!apiKey.allowedIPs.includes(options.ipAddress)) {
        return { valid: false, error: 'IP address not allowed' };
      }
    }

    // Check origin whitelist
    if (apiKey.allowedOrigins.length > 0 && options?.origin) {
      if (!apiKey.allowedOrigins.includes(options.origin)) {
        return { valid: false, error: 'Origin not allowed' };
      }
    }

    // Check required scopes
    if (options?.requiredScopes) {
      const hasScopes = options.requiredScopes.every((s) =>
        apiKey.scopes.includes(s)
      );
      if (!hasScopes) {
        return { valid: false, error: 'Insufficient scopes' };
      }
    }

    // Update usage
    await adminDb.collection('api_keys').doc(apiKey.id).update({
      lastUsedAt: new Date().toISOString(),
      usageCount: apiKey.usageCount + 1,
    });

    return { valid: true, apiKey };
  }

  /**
   * Revoke an API key
   */
  static async revokeKey(keyId: string, userId: string): Promise<void> {
    const ref = adminDb.collection('api_keys').doc(keyId);
    const doc = await ref.get();

    if (!doc.exists) throw new Error('API key not found');

    const key = doc.data() as APIKey;
    if (key.userId !== userId) throw new Error('Not authorized');

    await ref.update({
      status: 'revoked',
      updatedAt: new Date().toISOString(),
    });

    await adminDb.collection('audit_logs').add({
      action: 'api_key_revoked',
      userId,
      resourceId: keyId,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * List user's API keys (never returns full key)
   */
  static async listKeys(userId: string): Promise<Omit<APIKey, 'keyHash'>[]> {
    const snap = await adminDb
      .collection('api_keys')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    return snap.docs.map((d) => {
      const data = d.data();
      const { keyHash, ...rest } = data;
      return { id: d.id, ...rest } as Omit<APIKey, 'keyHash'>;
    });
  }

  /**
   * Log API key usage
   */
  static async logUsage(params: Omit<APIKeyUsageLog, 'id'>): Promise<void> {
    await adminDb.collection('api_key_usage').add({
      ...params,
      createdAt: new Date().toISOString(),
    });
  }

  /**
   * Roll (rotate) an API key — creates new key, revokes old one
   */
  static async rollKey(
    keyId: string,
    userId: string
  ): Promise<APIKeyCreateResponse> {
    const ref = adminDb.collection('api_keys').doc(keyId);
    const doc = await ref.get();

    if (!doc.exists) throw new Error('API key not found');

    const oldKey = doc.data() as APIKey;
    if (oldKey.userId !== userId) throw new Error('Not authorized');

    // Create new key with same settings
    const newKey = await this.createKey(userId, {
      name: `${oldKey.name} (rotated)`,
      environment: oldKey.environment,
      scopes: oldKey.scopes,
      rateLimit: oldKey.rateLimit,
      allowedOrigins: oldKey.allowedOrigins,
      allowedIPs: oldKey.allowedIPs,
    });

    // Revoke old key
    await ref.update({
      status: 'revoked',
      updatedAt: new Date().toISOString(),
    });

    return newKey;
  }
}
```

### File 64-3: `src/middleware/api-key-auth.ts`

```typescript
// src/middleware/api-key-auth.ts
// Middleware for API key authentication on public API routes

import { NextRequest, NextResponse } from 'next/server';
import { APIKeyService } from '@/lib/api-keys/api-key-service';
import type { APIKeyScope } from '@/types/api-keys';

interface APIKeyAuthOptions {
  requiredScopes?: APIKeyScope[];
}

export async function withAPIKeyAuth(
  request: NextRequest,
  handler: (
    request: NextRequest,
    apiKeyUserId: string
  ) => Promise<NextResponse>,
  options?: APIKeyAuthOptions
): Promise<NextResponse> {
  // Extract API key from header or query param
  const authHeader = request.headers.get('Authorization');
  const queryKey = new URL(request.url).searchParams.get('api_key');

  let apiKey: string | null = null;

  if (authHeader?.startsWith('Bearer gratis_')) {
    apiKey = authHeader.slice(7);
  } else if (queryKey?.startsWith('gratis_')) {
    apiKey = queryKey;
  }

  if (!apiKey) {
    return NextResponse.json(
      {
        error: 'API key required',
        message:
          'Include your API key in the Authorization header: Bearer gratis_pk_...',
      },
      { status: 401 }
    );
  }

  const ipAddress =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';
  const origin = request.headers.get('origin') || '';

  const validation = await APIKeyService.validateKey(apiKey, {
    requiredScopes: options?.requiredScopes,
    ipAddress,
    origin,
  });

  if (!validation.valid || !validation.apiKey) {
    return NextResponse.json(
      { error: validation.error || 'Invalid API key' },
      { status: 403 }
    );
  }

  // Log usage
  const startTime = Date.now();

  try {
    const response = await handler(request, validation.apiKey.userId);

    // Log after response
    await APIKeyService.logUsage({
      keyId: validation.apiKey.id,
      endpoint: new URL(request.url).pathname,
      method: request.method,
      statusCode: response.status,
      responseTimeMs: Date.now() - startTime,
      ipAddress,
      userAgent: request.headers.get('user-agent') || '',
      timestamp: new Date().toISOString(),
    });

    return response;
  } catch (error) {
    await APIKeyService.logUsage({
      keyId: validation.apiKey.id,
      endpoint: new URL(request.url).pathname,
      method: request.method,
      statusCode: 500,
      responseTimeMs: Date.now() - startTime,
      ipAddress,
      userAgent: request.headers.get('user-agent') || '',
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
}
```

### File 64-4: `src/app/api/developer/keys/route.ts`

```typescript
// src/app/api/developer/keys/route.ts
// Developer API key management endpoints

import { NextRequest, NextResponse } from 'next/server';
import { APIKeyService } from '@/lib/api-keys/api-key-service';
import { verifyAuth } from '@/lib/auth/verify';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const keys = await APIKeyService.listKeys(user.uid);
    return NextResponse.json({ keys });
  } catch (error) {
    console.error('GET /api/developer/keys error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, environment, scopes, rateLimit, allowedOrigins, allowedIPs, expiresInDays } = body;

    if (!name || !environment || !scopes?.length) {
      return NextResponse.json(
        { error: 'name, environment, and scopes are required' },
        { status: 400 }
      );
    }

    const result = await APIKeyService.createKey(user.uid, {
      name,
      environment,
      scopes,
      rateLimit,
      allowedOrigins,
      allowedIPs,
      expiresInDays,
    });

    return NextResponse.json(
      {
        ...result,
        warning: 'Store this API key securely. It will not be shown again.',
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Key creation failed';
    console.error('POST /api/developer/keys error:', error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const keyId = searchParams.get('id');

    if (!keyId) {
      return NextResponse.json({ error: 'id parameter required' }, { status: 400 });
    }

    await APIKeyService.revokeKey(keyId, user.uid);
    return NextResponse.json({ success: true, message: 'API key revoked' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Revocation failed';
    console.error('DELETE /api/developer/keys error:', error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
```

---

## SECTION 65 — REAL-TIME NOTIFICATIONS (SSE / SERVER-SENT EVENTS)

### File 65-1: `src/types/realtime.ts`

```typescript
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
```

### File 65-2: `src/lib/realtime/notification-hub.ts`

```typescript
// src/lib/realtime/notification-hub.ts
// Server-Sent Events hub for real-time notifications

import type { RealtimeNotification, NotificationChannel } from '@/types/realtime';

type SSEController = ReadableStreamDefaultController<Uint8Array>;

interface Connection {
  controller: SSEController;
  userId: string;
  channels: Set<string>;
  connectedAt: Date;
  lastPingAt: Date;
}

class NotificationHub {
  private connections = new Map<string, Connection>();
  private pingInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Heartbeat every 30 seconds to keep connections alive
    this.pingInterval = setInterval(() => this.pingAll(), 30_000);
  }

  /**
   * Register a new SSE connection
   */
  addConnection(
    connectionId: string,
    controller: SSEController,
    userId: string,
    channels: string[]
  ): void {
    this.connections.set(connectionId, {
      controller,
      userId,
      channels: new Set(channels),
      connectedAt: new Date(),
      lastPingAt: new Date(),
    });

    // Send connection confirmation
    this.sendToConnection(connectionId, {
      type: 'connected',
      data: { connectionId, channels },
    });
  }

  /**
   * Remove a connection
   */
  removeConnection(connectionId: string): void {
    this.connections.delete(connectionId);
  }

  /**
   * Send notification to specific channels
   */
  broadcast(notification: RealtimeNotification): void {
    const channelKey = notification.targetId
      ? `${notification.channel}:${notification.targetId}`
      : notification.channel;

    for (const [connId, conn] of this.connections) {
      // Check if connection subscribes to this channel
      const shouldReceive =
        conn.channels.has(channelKey) ||
        conn.channels.has(notification.channel) ||
        conn.channels.has('global') ||
        (notification.channel === 'user' && notification.targetId === conn.userId);

      if (shouldReceive) {
        this.sendToConnection(connId, {
          type: 'notification',
          data: notification,
        });
      }
    }
  }

  /**
   * Send notification to a specific user
   */
  sendToUser(userId: string, notification: RealtimeNotification): void {
    for (const [connId, conn] of this.connections) {
      if (conn.userId === userId) {
        this.sendToConnection(connId, {
          type: 'notification',
          data: notification,
        });
      }
    }
  }

  /**
   * Send to all admin connections
   */
  sendToAdmins(notification: RealtimeNotification): void {
    for (const [connId, conn] of this.connections) {
      if (conn.channels.has('admin')) {
        this.sendToConnection(connId, {
          type: 'notification',
          data: notification,
        });
      }
    }
  }

  /**
   * Get connection stats
   */
  getStats(): {
    totalConnections: number;
    uniqueUsers: number;
    channelCounts: Record<string, number>;
  } {
    const uniqueUsers = new Set<string>();
    const channelCounts: Record<string, number> = {};

    for (const conn of this.connections.values()) {
      uniqueUsers.add(conn.userId);
      for (const channel of conn.channels) {
        channelCounts[channel] = (channelCounts[channel] || 0) + 1;
      }
    }

    return {
      totalConnections: this.connections.size,
      uniqueUsers: uniqueUsers.size,
      channelCounts,
    };
  }

  // -- Private helpers --

  private sendToConnection(
    connectionId: string,
    payload: { type: string; data: unknown }
  ): void {
    const conn = this.connections.get(connectionId);
    if (!conn) return;

    try {
      const message = `event: ${payload.type}\ndata: ${JSON.stringify(payload.data)}\nid: ${Date.now()}\n\n`;
      conn.controller.enqueue(new TextEncoder().encode(message));
    } catch (error) {
      // Connection likely closed
      this.connections.delete(connectionId);
    }
  }

  private pingAll(): void {
    const now = new Date();
    const staleTimeout = 5 * 60 * 1000; // 5 minutes

    for (const [connId, conn] of this.connections) {
      // Remove stale connections
      if (now.getTime() - conn.lastPingAt.getTime() > staleTimeout) {
        this.connections.delete(connId);
        continue;
      }

      try {
        const message = `event: ping\ndata: ${JSON.stringify({ timestamp: now.toISOString() })}\n\n`;
        conn.controller.enqueue(new TextEncoder().encode(message));
        conn.lastPingAt = now;
      } catch {
        this.connections.delete(connId);
      }
    }
  }

  /**
   * Cleanup on shutdown
   */
  destroy(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
    this.connections.clear();
  }
}

// Singleton instance
export const notificationHub = new NotificationHub();
```

### File 65-3: `src/app/api/realtime/stream/route.ts`

```typescript
// src/app/api/realtime/stream/route.ts
// SSE endpoint for real-time notifications

import { NextRequest } from 'next/server';
import { notificationHub } from '@/lib/realtime/notification-hub';
import { verifyAuth } from '@/lib/auth/verify';
import * as crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const user = await verifyAuth(request);
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const channelsParam = searchParams.get('channels') || 'global';
  const channels = channelsParam.split(',').map((c) => c.trim());

  // Always subscribe to user's personal channel
  if (!channels.includes(`user:${user.uid}`)) {
    channels.push(`user:${user.uid}`);
  }

  // Add admin channel if user is admin
  if (['admin', 'super_admin'].includes(user.role) && !channels.includes('admin')) {
    channels.push('admin');
  }

  const connectionId = crypto.randomUUID();

  const stream = new ReadableStream({
    start(controller) {
      notificationHub.addConnection(connectionId, controller, user.uid, channels);
    },
    cancel() {
      notificationHub.removeConnection(connectionId);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
```

### File 65-4: `src/app/api/realtime/send/route.ts`

```typescript
// src/app/api/realtime/send/route.ts
// Send real-time notification (admin only)

import { NextRequest, NextResponse } from 'next/server';
import { notificationHub } from '@/lib/realtime/notification-hub';
import { verifyAuth } from '@/lib/auth/verify';
import type { RealtimeNotification } from '@/types/realtime';

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || !['admin', 'super_admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { channel, targetId, type, title, message, priority, data, actionUrl } = body;

    if (!channel || !type || !title || !message) {
      return NextResponse.json(
        { error: 'channel, type, title, and message are required' },
        { status: 400 }
      );
    }

    const notification: RealtimeNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      channel,
      targetId,
      type,
      title,
      message,
      priority: priority || 'medium',
      data,
      actionUrl,
      createdAt: new Date().toISOString(),
    };

    notificationHub.broadcast(notification);

    return NextResponse.json({ success: true, notification });
  } catch (error) {
    console.error('POST /api/realtime/send error:', error);
    return NextResponse.json({ error: 'Send failed' }, { status: 500 });
  }
}
```

### File 65-5: `src/hooks/useRealtimeNotifications.ts`

```typescript
// src/hooks/useRealtimeNotifications.ts
// React hook for SSE real-time notifications

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { RealtimeNotification } from '@/types/realtime';

interface UseRealtimeOptions {
  channels?: string[];
  onNotification?: (notification: RealtimeNotification) => void;
  enabled?: boolean;
}

export function useRealtimeNotifications(options: UseRealtimeOptions = {}) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const reconnectAttempts = useRef(0);

  const connect = useCallback(() => {
    if (!user?.uid || options.enabled === false) return;

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const channels = options.channels || ['global'];
    const url = `/api/realtime/stream?channels=${channels.join(',')}`;

    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.addEventListener('connected', (e) => {
      setConnected(true);
      setError(null);
      reconnectAttempts.current = 0;
    });

    es.addEventListener('notification', (e) => {
      try {
        const notification = JSON.parse(e.data) as RealtimeNotification;
        setNotifications((prev) => [notification, ...prev].slice(0, 50));
        options.onNotification?.(notification);
      } catch (err) {
        console.error('Failed to parse notification:', err);
      }
    });

    es.addEventListener('ping', () => {
      // Keep-alive, no action needed
    });

    es.onerror = () => {
      setConnected(false);
      es.close();

      // Exponential backoff reconnect
      reconnectAttempts.current++;
      const delay = Math.min(
        1000 * Math.pow(2, reconnectAttempts.current),
        30_000
      );

      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, delay);
    };
  }, [user?.uid, options.channels, options.enabled, options.onNotification]);

  useEffect(() => {
    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return {
    notifications,
    connected,
    error,
    unreadCount: notifications.length,
    clearNotifications,
    dismissNotification,
  };
}
```

### File 65-6: `src/components/notifications/NotificationCenter.tsx`

```tsx
// src/components/notifications/NotificationCenter.tsx
// Real-time notification center UI component

'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, X, ExternalLink, Check, Trash2 } from 'lucide-react';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';
import type { RealtimeNotification } from '@/types/realtime';

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    connected,
    unreadCount,
    clearNotifications,
    dismissNotification,
  } = useRealtimeNotifications({
    channels: ['global'],
    onNotification: (n) => {
      if (n.priority === 'urgent') {
        // Show toast for urgent notifications
        showToast(n);
      }
    },
  });

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const priorityColors: Record<string, string> = {
    low: 'bg-gray-100 text-gray-600',
    medium: 'bg-blue-100 text-blue-600',
    high: 'bg-amber-100 text-amber-600',
    urgent: 'bg-red-100 text-red-600',
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label={`Notifications (${unreadCount} unread)`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        {/* Connection indicator */}
        <span
          className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ${
            connected ? 'bg-emerald-400' : 'bg-red-400'
          }`}
        />
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-[28rem] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications list */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onDismiss={() => dismissNotification(n.id)}
                  priorityColors={priorityColors}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationItem({
  notification,
  onDismiss,
  priorityColors,
}: {
  notification: RealtimeNotification;
  onDismiss: () => void;
  priorityColors: Record<string, string>;
}) {
  const timeAgo = getTimeAgo(notification.createdAt);

  return (
    <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 group transition-colors">
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 px-2 py-0.5 text-xs rounded-full font-medium ${
            priorityColors[notification.priority] || priorityColors.medium
          }`}
        >
          {notification.priority}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {notification.title}
          </p>
          <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
            {notification.message}
          </p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-xs text-gray-400">{timeAgo}</span>
            {notification.actionUrl && (
              <a
                href={notification.actionUrl}
                className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                View <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-opacity"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function showToast(notification: RealtimeNotification) {
  // Browser notification API
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(notification.title, {
      body: notification.message,
      icon: '/images/logo-icon.png',
    });
  }
}

function getTimeAgo(dateStr: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000
  );
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
```

---

## SECTION 66 — SCHEDULED TASKS & CRON JOB MANAGER

### File 66-1: `src/types/scheduler.ts`

```typescript
// src/types/scheduler.ts
// Scheduled task and cron job types

export type JobStatus = 'active' | 'paused' | 'disabled' | 'completed';
export type RunStatus = 'pending' | 'running' | 'success' | 'failed' | 'timeout' | 'skipped';

export interface ScheduledJob {
  id: string;
  name: string;
  description: string;
  handler: string; // Function path: 'jobs/cleanup-expired-sessions'
  schedule: string; // Cron expression: '0 */6 * * *'
  timezone: string;
  status: JobStatus;
  config: Record<string, unknown>;
  retryPolicy: RetryPolicy;
  timeout: number; // seconds
  lastRunAt?: string;
  lastRunStatus?: RunStatus;
  nextRunAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RetryPolicy {
  maxRetries: number;
  backoffMs: number;
  backoffMultiplier: number;
  maxBackoffMs: number;
}

export interface JobRun {
  id: string;
  jobId: string;
  jobName: string;
  status: RunStatus;
  startedAt: string;
  completedAt?: string;
  duration?: number; // ms
  output?: string;
  error?: string;
  retryCount: number;
  triggeredBy: 'schedule' | 'manual' | 'retry';
}

export interface JobMetrics {
  jobId: string;
  totalRuns: number;
  successCount: number;
  failureCount: number;
  avgDurationMs: number;
  lastSevenDays: {
    date: string;
    runs: number;
    successes: number;
    failures: number;
  }[];
}
```

### File 66-2: `src/lib/scheduler/job-registry.ts`

```typescript
// src/lib/scheduler/job-registry.ts
// Registry of all scheduled job handlers

import { adminDb, adminStorage } from '@/lib/firebase/admin';

type JobHandler = (config: Record<string, unknown>) => Promise<string>;

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

// ── Built-in job handlers ──────────────────────────────────────────

registerJobHandler('cleanup/expired-sessions', async () => {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const snap = await adminDb
    .collection('sessions')
    .where('expiresAt', '<', cutoff)
    .limit(500)
    .get();

  const batch = adminDb.batch();
  snap.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();

  return `Cleaned up ${snap.size} expired sessions`;
});

registerJobHandler('cleanup/expired-exports', async () => {
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const snap = await adminDb
    .collection('exports')
    .where('expiresAt', '<', cutoff)
    .where('status', '==', 'completed')
    .limit(100)
    .get();

  let deletedFiles = 0;
  const batch = adminDb.batch();

  for (const doc of snap.docs) {
    const data = doc.data();
    if (data.fileUrl) {
      try {
        const bucket = adminStorage.bucket();
        const fileName = new URL(data.fileUrl).pathname.split('/').pop();
        if (fileName) {
          await bucket.file(`exports/${fileName}`).delete();
          deletedFiles++;
        }
      } catch {
        // File may already be deleted
      }
    }
    batch.update(doc.ref, { status: 'expired' });
  }

  await batch.commit();
  return `Expired ${snap.size} exports, deleted ${deletedFiles} files`;
});

registerJobHandler('analytics/daily-rollup', async () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().split('T')[0];

  // Count donations
  const donationsSnap = await adminDb
    .collection('donations')
    .where('createdAt', '>=', `${dateStr}T00:00:00Z`)
    .where('createdAt', '<', `${dateStr}T23:59:59Z`)
    .get();

  let totalAmount = 0;
  donationsSnap.docs.forEach((doc) => {
    totalAmount += doc.data().amount || 0;
  });

  // Count new users
  const usersSnap = await adminDb
    .collection('users')
    .where('createdAt', '>=', `${dateStr}T00:00:00Z`)
    .where('createdAt', '<', `${dateStr}T23:59:59Z`)
    .get();

  // Count bottles
  const bottlesSnap = await adminDb
    .collection('bottle_submissions')
    .where('createdAt', '>=', `${dateStr}T00:00:00Z`)
    .where('createdAt', '<', `${dateStr}T23:59:59Z`)
    .get();

  let totalBottles = 0;
  bottlesSnap.docs.forEach((doc) => {
    totalBottles += doc.data().count || 0;
  });

  // Store daily rollup
  await adminDb.collection('analytics_daily').doc(dateStr).set({
    date: dateStr,
    donations: { count: donationsSnap.size, total: totalAmount },
    newUsers: usersSnap.size,
    bottles: { submissions: bottlesSnap.size, total: totalBottles },
    generatedAt: new Date().toISOString(),
  });

  return `Daily rollup for ${dateStr}: ${donationsSnap.size} donations (€${totalAmount.toFixed(2)}), ${usersSnap.size} new users, ${totalBottles} bottles`;
});

registerJobHandler('notifications/digest', async (config) => {
  const frequency = (config.frequency as string) || 'daily';
  const snap = await adminDb
    .collection('users')
    .where('notificationPrefs.digest', '==', frequency)
    .limit(500)
    .get();

  let sentCount = 0;
  for (const doc of snap.docs) {
    // Queue digest email (handled by email service)
    await adminDb.collection('email_queue').add({
      template: 'notification_digest',
      to: doc.data().email,
      data: { userId: doc.id, frequency },
      scheduledAt: new Date().toISOString(),
    });
    sentCount++;
  }

  return `Queued ${sentCount} ${frequency} digest emails`;
});

registerJobHandler('subscriptions/renewal-check', async () => {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const snap = await adminDb
    .collection('subscriptions')
    .where('status', '==', 'active')
    .where('nextBillingDate', '==', tomorrow)
    .get();

  let notified = 0;
  for (const doc of snap.docs) {
    const data = doc.data();
    await adminDb.collection('email_queue').add({
      template: 'subscription_renewal_reminder',
      to: data.userEmail,
      data: {
        plan: data.plan,
        amount: data.amount,
        renewalDate: tomorrow,
      },
      scheduledAt: new Date().toISOString(),
    });
    notified++;
  }

  return `Sent ${notified} renewal reminders for ${tomorrow}`;
});

registerJobHandler('moderation/auto-review', async () => {
  const snap = await adminDb
    .collection('moderation_queue')
    .where('status', '==', 'pending')
    .where('createdAt', '<', new Date(Date.now() - 60 * 60 * 1000).toISOString())
    .limit(100)
    .get();

  let autoApproved = 0;
  const batch = adminDb.batch();

  for (const doc of snap.docs) {
    const data = doc.data();
    // Auto-approve items with low risk scores that have been pending for 1+ hours
    if (data.autoScore?.overall < 0.2) {
      batch.update(doc.ref, {
        status: 'auto_approved',
        action: 'approve',
        reviewedBy: 'system',
        reviewedAt: new Date().toISOString(),
        reviewNote: 'Auto-approved: low risk score after 1-hour review period',
      });
      autoApproved++;
    }
  }

  await batch.commit();
  return `Auto-approved ${autoApproved} of ${snap.size} pending moderation items`;
});
```

### File 66-3: `src/lib/scheduler/scheduler-service.ts`

```typescript
// src/lib/scheduler/scheduler-service.ts
// Cron job scheduler with execution tracking

import type { ScheduledJob, JobRun, RunStatus } from '@/types/scheduler';
import { adminDb } from '@/lib/firebase/admin';
import { getJobHandler } from './job-registry';

export class SchedulerService {
  /**
   * Execute a scheduled job
   */
  static async executeJob(
    jobId: string,
    triggeredBy: JobRun['triggeredBy'] = 'schedule'
  ): Promise<JobRun> {
    const jobRef = adminDb.collection('scheduled_jobs').doc(jobId);
    const jobDoc = await jobRef.get();

    if (!jobDoc.exists) throw new Error(`Job ${jobId} not found`);
    const job = jobDoc.data() as ScheduledJob;

    if (job.status !== 'active' && triggeredBy === 'schedule') {
      throw new Error(`Job ${jobId} is not active`);
    }

    // Create run record
    const run: Omit<JobRun, 'id'> = {
      jobId,
      jobName: job.name,
      status: 'running',
      startedAt: new Date().toISOString(),
      retryCount: 0,
      triggeredBy,
    };

    const runRef = await adminDb.collection('job_runs').add(run);
    const runId = runRef.id;

    // Update job last run
    await jobRef.update({
      lastRunAt: run.startedAt,
      lastRunStatus: 'running',
    });

    try {
      // Get handler
      const handler = getJobHandler(job.handler);
      if (!handler) {
        throw new Error(`Handler not found: ${job.handler}`);
      }

      // Execute with timeout
      const output = await this.withTimeout(
        handler(job.config),
        job.timeout * 1000
      );

      const completedAt = new Date().toISOString();
      const duration =
        new Date(completedAt).getTime() - new Date(run.startedAt).getTime();

      // Update run
      await runRef.update({
        status: 'success',
        completedAt,
        duration,
        output: output.slice(0, 5000), // Limit output size
      });

      // Update job
      await jobRef.update({
        lastRunStatus: 'success',
        nextRunAt: this.getNextRunTime(job.schedule, job.timezone),
      });

      return {
        id: runId,
        ...run,
        status: 'success',
        completedAt,
        duration,
        output,
      };
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : 'Unknown error';
      const completedAt = new Date().toISOString();
      const duration =
        new Date(completedAt).getTime() - new Date(run.startedAt).getTime();

      await runRef.update({
        status: 'failed',
        completedAt,
        duration,
        error: errorMsg.slice(0, 5000),
      });

      await jobRef.update({ lastRunStatus: 'failed' });

      // Retry if policy allows
      if (run.retryCount < job.retryPolicy.maxRetries) {
        const delay = Math.min(
          job.retryPolicy.backoffMs *
            Math.pow(job.retryPolicy.backoffMultiplier, run.retryCount),
          job.retryPolicy.maxBackoffMs
        );

        setTimeout(() => {
          this.executeJob(jobId, 'retry').catch(console.error);
        }, delay);
      }

      return {
        id: runId,
        ...run,
        status: 'failed',
        completedAt,
        duration,
        error: errorMsg,
      };
    }
  }

  /**
   * Get all scheduled jobs
   */
  static async listJobs(): Promise<ScheduledJob[]> {
    const snap = await adminDb
      .collection('scheduled_jobs')
      .orderBy('name')
      .get();

    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ScheduledJob));
  }

  /**
   * Get recent runs for a job
   */
  static async getJobRuns(
    jobId: string,
    limit = 20
  ): Promise<JobRun[]> {
    const snap = await adminDb
      .collection('job_runs')
      .where('jobId', '==', jobId)
      .orderBy('startedAt', 'desc')
      .limit(limit)
      .get();

    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as JobRun));
  }

  /**
   * Create or update a scheduled job
   */
  static async upsertJob(
    job: Omit<ScheduledJob, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ): Promise<string> {
    const now = new Date().toISOString();

    if (job.id) {
      await adminDb
        .collection('scheduled_jobs')
        .doc(job.id)
        .update({ ...job, updatedAt: now });
      return job.id;
    }

    const ref = await adminDb.collection('scheduled_jobs').add({
      ...job,
      nextRunAt: this.getNextRunTime(job.schedule, job.timezone),
      createdAt: now,
      updatedAt: now,
    });
    return ref.id;
  }

  /**
   * Toggle job active/paused
   */
  static async toggleJob(jobId: string, status: 'active' | 'paused'): Promise<void> {
    await adminDb.collection('scheduled_jobs').doc(jobId).update({
      status,
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Process all due scheduled jobs
   * Called by the cron trigger endpoint
   */
  static async processDueJobs(): Promise<{ executed: number; errors: number }> {
    const now = new Date().toISOString();

    const snap = await adminDb
      .collection('scheduled_jobs')
      .where('status', '==', 'active')
      .where('nextRunAt', '<=', now)
      .get();

    let executed = 0;
    let errors = 0;

    for (const doc of snap.docs) {
      try {
        await this.executeJob(doc.id, 'schedule');
        executed++;
      } catch (error) {
        errors++;
        console.error(`Job ${doc.id} execution failed:`, error);
      }
    }

    return { executed, errors };
  }

  // -- Private helpers --

  private static async withTimeout<T>(
    promise: Promise<T>,
    ms: number
  ): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Job timed out after ${ms}ms`)), ms)
      ),
    ]);
  }

  private static getNextRunTime(cronExpr: string, timezone: string): string {
    // Simplified next-run calculator
    // In production, use a library like 'cron-parser'
    const parts = cronExpr.split(' ');
    if (parts.length < 5) return new Date(Date.now() + 3600000).toISOString();

    const minute = parts[0];
    const hour = parts[1];

    const now = new Date();
    const next = new Date(now);

    if (minute.startsWith('*/')) {
      const interval = parseInt(minute.slice(2));
      const nextMinute =
        Math.ceil((now.getMinutes() + 1) / interval) * interval;
      if (nextMinute >= 60) {
        next.setHours(next.getHours() + 1);
        next.setMinutes(nextMinute - 60);
      } else {
        next.setMinutes(nextMinute);
      }
    } else if (hour.startsWith('*/')) {
      const interval = parseInt(hour.slice(2));
      const nextHour =
        Math.ceil((now.getHours() + 1) / interval) * interval;
      next.setHours(nextHour % 24);
      next.setMinutes(parseInt(minute) || 0);
      if (next <= now) next.setDate(next.getDate() + 1);
    } else {
      next.setHours(parseInt(hour) || 0);
      next.setMinutes(parseInt(minute) || 0);
      if (next <= now) next.setDate(next.getDate() + 1);
    }

    next.setSeconds(0);
    next.setMilliseconds(0);
    return next.toISOString();
  }
}
```

### File 66-4: `src/app/api/cron/trigger/route.ts`

```typescript
// src/app/api/cron/trigger/route.ts
// Cron trigger endpoint — called by external scheduler (e.g., Cloud Scheduler)

import { NextRequest, NextResponse } from 'next/server';
import { SchedulerService } from '@/lib/scheduler/scheduler-service';

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('Authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('job');

    if (jobId) {
      // Execute specific job
      const result = await SchedulerService.executeJob(jobId, 'manual');
      return NextResponse.json({ run: result });
    }

    // Process all due jobs
    const result = await SchedulerService.processDueJobs();
    return NextResponse.json({
      message: `Processed ${result.executed} jobs, ${result.errors} errors`,
      ...result,
    });
  } catch (error) {
    console.error('Cron trigger error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Execution failed' },
      { status: 500 }
    );
  }
}
```

### File 66-5: `src/app/api/admin/scheduler/route.ts`

```typescript
// src/app/api/admin/scheduler/route.ts
// Admin API for managing scheduled jobs

import { NextRequest, NextResponse } from 'next/server';
import { SchedulerService } from '@/lib/scheduler/scheduler-service';
import { verifyAuth } from '@/lib/auth/verify';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || !['admin', 'super_admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (jobId) {
      const runs = await SchedulerService.getJobRuns(jobId);
      return NextResponse.json({ runs });
    }

    const jobs = await SchedulerService.listJobs();
    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('GET /api/admin/scheduler error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || !['admin', 'super_admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { action, jobId, jobData } = body;

    switch (action) {
      case 'execute': {
        if (!jobId) {
          return NextResponse.json({ error: 'jobId required' }, { status: 400 });
        }
        const run = await SchedulerService.executeJob(jobId, 'manual');
        return NextResponse.json({ run });
      }

      case 'toggle': {
        if (!jobId || !body.status) {
          return NextResponse.json(
            { error: 'jobId and status required' },
            { status: 400 }
          );
        }
        await SchedulerService.toggleJob(jobId, body.status);
        return NextResponse.json({ success: true });
      }

      case 'upsert': {
        if (!jobData) {
          return NextResponse.json({ error: 'jobData required' }, { status: 400 });
        }
        const id = await SchedulerService.upsertJob(jobData);
        return NextResponse.json({ id, success: true });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('POST /api/admin/scheduler error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## SECTION 67 — END-TO-END TESTING SUITE (PLAYWRIGHT)

### File 67-1: `playwright.config.ts`

```typescript
// playwright.config.ts
// Playwright E2E test configuration

import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [['html', { open: 'never' }], ['github'], ['junit', { outputFile: 'results/junit.xml' }]]
    : [['html', { open: 'on-failure' }]],

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },

  projects: [
    // Setup: authenticate shared users
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    // Desktop browsers
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
    },
    // Mobile viewports
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      dependencies: ['setup'],
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
      dependencies: ['setup'],
    },
  ],

  // Dev server (when not running against deployed URL)
  webServer: process.env.CI
    ? undefined
    : {
        command: 'npm run dev',
        url: BASE_URL,
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
```

### File 67-2: `e2e/auth.setup.ts`

```typescript
// e2e/auth.setup.ts
// Shared authentication setup for all test projects

import { test as setup, expect } from '@playwright/test';
import path from 'path';

const userFile = path.join(__dirname, '../.auth/user.json');
const adminFile = path.join(__dirname, '../.auth/admin.json');

setup('authenticate as regular user', async ({ page }) => {
  await page.goto('/auth/login');

  await page.getByLabel('Email').fill(process.env.TEST_USER_EMAIL || 'test@gratis.ngo');
  await page.getByLabel('Password').fill(process.env.TEST_USER_PASSWORD || 'TestPass123!');
  await page.getByRole('button', { name: 'Sign In' }).click();

  // Wait for redirect to dashboard
  await page.waitForURL('/dashboard**', { timeout: 15_000 });
  await expect(page.getByText('Dashboard')).toBeVisible();

  // Save auth state
  await page.context().storageState({ path: userFile });
});

setup('authenticate as admin', async ({ page }) => {
  await page.goto('/auth/login');

  await page.getByLabel('Email').fill(process.env.TEST_ADMIN_EMAIL || 'admin@gratis.ngo');
  await page.getByLabel('Password').fill(process.env.TEST_ADMIN_PASSWORD || 'AdminPass123!');
  await page.getByRole('button', { name: 'Sign In' }).click();

  await page.waitForURL('/admin**', { timeout: 15_000 });
  await expect(page.getByText('Admin')).toBeVisible();

  await page.context().storageState({ path: adminFile });
});
```

### File 67-3: `e2e/fixtures.ts`

```typescript
// e2e/fixtures.ts
// Shared test fixtures and page objects

import { test as base, expect, Page } from '@playwright/test';
import path from 'path';

// Extend test with custom fixtures
export const test = base.extend<{
  userPage: Page;
  adminPage: Page;
}>({
  userPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: path.join(__dirname, '../.auth/user.json'),
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: path.join(__dirname, '../.auth/admin.json'),
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect };

// Page object helpers

export class HomePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async expectHeroVisible() {
    await expect(this.page.getByRole('heading', { level: 1 })).toBeVisible();
  }

  async clickDonate() {
    await this.page.getByRole('link', { name: /donate/i }).first().click();
  }

  async clickProjects() {
    await this.page.getByRole('link', { name: /projects/i }).first().click();
  }
}

export class DonationPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/donate');
  }

  async selectAmount(amount: number) {
    await this.page.getByRole('button', { name: `€${amount}` }).click();
  }

  async enterCustomAmount(amount: string) {
    await this.page.getByLabel('Custom amount').fill(amount);
  }

  async selectProject(name: string) {
    await this.page.getByText(name).click();
  }

  async submitDonation() {
    await this.page.getByRole('button', { name: /donate|submit/i }).click();
  }

  async expectConfirmation() {
    await expect(
      this.page.getByText(/thank you|donation confirmed/i)
    ).toBeVisible({ timeout: 10_000 });
  }
}

export class AdminDashboard {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/admin');
  }

  async navigateTo(section: string) {
    await this.page.getByRole('link', { name: new RegExp(section, 'i') }).click();
  }

  async expectStatsVisible() {
    await expect(this.page.getByText(/total donations/i)).toBeVisible();
  }
}
```

### File 67-4: `e2e/homepage.spec.ts`

```typescript
// e2e/homepage.spec.ts
// Homepage and navigation E2E tests

import { test, expect, HomePage } from './fixtures';

test.describe('Homepage', () => {
  test('displays hero section and CTA', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.expectHeroVisible();

    // Check CTA buttons
    await expect(page.getByRole('link', { name: /donate/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /projects/i }).first()).toBeVisible();
  });

  test('navigates to all main pages', async ({ page }) => {
    await page.goto('/');

    const pages = [
      { link: /projects/i, url: '/projects' },
      { link: /events/i, url: '/events' },
      { link: /about/i, url: '/about' },
    ];

    for (const p of pages) {
      await page.goto('/');
      await page.getByRole('link', { name: p.link }).first().click();
      await expect(page).toHaveURL(new RegExp(p.url));
    }
  });

  test('is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    // Mobile menu should be available
    const menuButton = page.getByRole('button', { name: /menu/i });
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await expect(page.getByRole('navigation')).toBeVisible();
    }
  });

  test('has valid SEO meta tags', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/gratis/i);

    // Check meta description
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute('content');
    expect(description).toBeTruthy();
    expect(description!.length).toBeGreaterThan(50);

    // Check OG tags
    const ogTitle = await page
      .locator('meta[property="og:title"]')
      .getAttribute('content');
    expect(ogTitle).toBeTruthy();

    const ogImage = await page
      .locator('meta[property="og:image"]')
      .getAttribute('content');
    expect(ogImage).toBeTruthy();
  });

  test('loads within performance budget', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - startTime;

    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });
});
```

### File 67-5: `e2e/donation-flow.spec.ts`

```typescript
// e2e/donation-flow.spec.ts
// Complete donation flow E2E tests

import { test, expect, DonationPage } from './fixtures';

test.describe('Donation Flow', () => {
  test('completes a preset amount donation', async ({ userPage }) => {
    const donation = new DonationPage(userPage);
    await donation.goto();

    // Select €25 preset
    await donation.selectAmount(25);

    // Check amount is selected
    await expect(
      userPage.getByRole('button', { name: '€25' })
    ).toHaveAttribute('aria-pressed', 'true');
  });

  test('handles custom donation amount', async ({ userPage }) => {
    const donation = new DonationPage(userPage);
    await donation.goto();

    // Enter custom amount
    await donation.enterCustomAmount('42.50');

    // Verify the amount is displayed
    await expect(userPage.getByLabel('Custom amount')).toHaveValue('42.50');
  });

  test('shows project selection', async ({ userPage }) => {
    await userPage.goto('/donate');

    // Projects should be listed
    await expect(userPage.getByText(/select a project/i)).toBeVisible();
  });

  test('requires authentication for donation', async ({ page }) => {
    await page.goto('/donate');

    // Try to donate without being logged in
    const donateBtn = page.getByRole('button', { name: /donate|proceed/i });
    if (await donateBtn.isVisible()) {
      await donateBtn.click();
      // Should redirect to login or show auth prompt
      await expect(
        page.getByText(/sign in|log in|create account/i)
      ).toBeVisible({ timeout: 5_000 });
    }
  });

  test('displays donation history in dashboard', async ({ userPage }) => {
    await userPage.goto('/dashboard');

    // Check for donation history section
    const donationSection = userPage.getByText(/donation|giving/i);
    await expect(donationSection.first()).toBeVisible();
  });
});
```

### File 67-6: `e2e/admin.spec.ts`

```typescript
// e2e/admin.spec.ts
// Admin dashboard E2E tests

import { test, expect, AdminDashboard } from './fixtures';

test.describe('Admin Dashboard', () => {
  test('loads admin dashboard with stats', async ({ adminPage }) => {
    const admin = new AdminDashboard(adminPage);
    await admin.goto();
    await admin.expectStatsVisible();
  });

  test('navigates to user management', async ({ adminPage }) => {
    await adminPage.goto('/admin');
    await adminPage.getByRole('link', { name: /users/i }).click();
    await expect(adminPage).toHaveURL(/admin.*users/);
  });

  test('can view moderation queue', async ({ adminPage }) => {
    await adminPage.goto('/admin');
    await adminPage.getByRole('link', { name: /moderation/i }).click();
    await expect(adminPage.getByText(/moderation queue/i)).toBeVisible();
  });

  test('denies access to non-admin users', async ({ userPage }) => {
    await userPage.goto('/admin');

    // Should redirect or show forbidden
    const url = userPage.url();
    const forbidden = userPage.getByText(/forbidden|access denied|not authorized/i);
    const redirected = !url.includes('/admin');

    expect(redirected || (await forbidden.isVisible().catch(() => false))).toBeTruthy();
  });

  test('exports data successfully', async ({ adminPage }) => {
    await adminPage.goto('/admin');

    // Navigate to exports section
    const exportLink = adminPage.getByRole('link', { name: /export/i });
    if (await exportLink.isVisible()) {
      await exportLink.click();
      await expect(adminPage.getByText(/export data/i)).toBeVisible();
    }
  });
});
```

### File 67-7: `e2e/accessibility.spec.ts`

```typescript
// e2e/accessibility.spec.ts
// Accessibility checks across key pages

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pagesToTest = [
  { name: 'Homepage', url: '/' },
  { name: 'Projects', url: '/projects' },
  { name: 'Events', url: '/events' },
  { name: 'About', url: '/about' },
  { name: 'Donate', url: '/donate' },
  { name: 'Login', url: '/auth/login' },
];

for (const pageInfo of pagesToTest) {
  test(`${pageInfo.name} page passes accessibility checks`, async ({ page }) => {
    await page.goto(pageInfo.url);
    await page.waitForLoadState('domcontentloaded');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .exclude('.third-party-widget') // Exclude third-party widgets
      .analyze();

    // Filter out minor issues
    const criticalViolations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    if (criticalViolations.length > 0) {
      const summary = criticalViolations
        .map(
          (v) =>
            `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} instances)`
        )
        .join('\n');
      console.error(`Accessibility violations on ${pageInfo.name}:\n${summary}`);
    }

    expect(criticalViolations.length).toBe(0);
  });
}

test('keyboard navigation works on main pages', async ({ page }) => {
  await page.goto('/');

  // Tab through interactive elements
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Tab');
  }

  // Focused element should be visible and interactive
  const focused = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return {
      tag: el.tagName,
      visible: rect.width > 0 && rect.height > 0,
      focusable: true,
    };
  });

  expect(focused).toBeTruthy();
  expect(focused?.visible).toBe(true);
});

test('color contrast meets WCAG AA standards', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page })
    .withRules(['color-contrast'])
    .analyze();

  const contrastIssues = results.violations.filter(
    (v) => v.id === 'color-contrast'
  );

  // Allow up to 3 minor contrast issues (e.g., decorative elements)
  expect(contrastIssues.reduce((sum, v) => sum + v.nodes.length, 0)).toBeLessThanOrEqual(3);
});
```

---

## SECTION 68 — PLATFORM CONFIGURATION & SETTINGS MANAGEMENT

### File 68-1: `src/types/platform-config.ts`

```typescript
// src/types/platform-config.ts
// Platform-wide configuration types

export interface PlatformConfig {
  general: GeneralConfig;
  branding: BrandingConfig;
  features: FeatureConfig;
  donations: DonationConfig;
  email: EmailConfig;
  security: SecurityConfig;
  integrations: IntegrationConfig;
  maintenance: MaintenanceConfig;
  limits: LimitsConfig;
}

export interface GeneralConfig {
  siteName: string;
  siteUrl: string;
  supportEmail: string;
  defaultLanguage: string;
  availableLanguages: string[];
  defaultCurrency: string;
  availableCurrencies: string[];
  timezone: string;
  dateFormat: string;
}

export interface BrandingConfig {
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  darkMode: boolean;
  customCSS?: string;
  socialLinks: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
}

export interface FeatureConfig {
  donations: boolean;
  subscriptions: boolean;
  events: boolean;
  tribe: boolean;
  bottles: boolean;
  leaderboard: boolean;
  referrals: boolean;
  blog: boolean;
  chat: boolean;
  mfa: boolean;
  apiKeys: boolean;
  webhooks: boolean;
  gamification: boolean;
}

export interface DonationConfig {
  minimumAmount: number;
  maximumAmount: number;
  presetAmounts: number[];
  allowRecurring: boolean;
  defaultRecurring: boolean;
  processingFeePercentage: number;
  coverFeesOption: boolean;
  taxReceiptEnabled: boolean;
  taxReceiptThreshold: number;
  anonymousDonationsAllowed: boolean;
}

export interface EmailConfig {
  fromName: string;
  fromEmail: string;
  replyToEmail: string;
  sendgridApiKey: string;
  welcomeEmailEnabled: boolean;
  donationReceiptEnabled: boolean;
  weeklyDigestEnabled: boolean;
  marketingEmailsEnabled: boolean;
}

export interface SecurityConfig {
  sessionTimeout: number; // minutes
  maxLoginAttempts: number;
  lockoutDuration: number; // minutes
  passwordMinLength: number;
  requireMFA: boolean;
  allowSocialLogin: boolean;
  allowedSocialProviders: string[];
  corsOrigins: string[];
  rateLimitPerMinute: number;
}

export interface IntegrationConfig {
  stripe: { enabled: boolean; publicKey: string; webhookSecret: string };
  firebase: { projectId: string };
  sendgrid: { enabled: boolean; apiKey: string };
  mux: { enabled: boolean; tokenId: string; tokenSecret: string };
  analytics: { gaId?: string; plausibleDomain?: string };
  sentry: { enabled: boolean; dsn?: string };
}

export interface MaintenanceConfig {
  enabled: boolean;
  message: string;
  allowedIPs: string[];
  expectedEndTime?: string;
}

export interface LimitsConfig {
  maxFileUploadMB: number;
  maxImagesPerProject: number;
  maxEventsPerMonth: number;
  maxAPIKeysPerUser: number;
  maxExportsPerDay: number;
  maxTeamMembers: number;
}

export interface ConfigChangeLog {
  id: string;
  section: keyof PlatformConfig;
  field: string;
  oldValue: unknown;
  newValue: unknown;
  changedBy: string;
  changedAt: string;
  reason?: string;
}
```

### File 68-2: `src/lib/config/platform-config-service.ts`

```typescript
// src/lib/config/platform-config-service.ts
// Platform configuration management with caching and audit logging

import type { PlatformConfig, ConfigChangeLog } from '@/types/platform-config';
import { adminDb } from '@/lib/firebase/admin';

const CONFIG_DOC = 'platform_config/current';
let cachedConfig: PlatformConfig | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60_000; // 1 minute

const DEFAULT_CONFIG: PlatformConfig = {
  general: {
    siteName: 'GRATIS.NGO',
    siteUrl: 'https://gratis.ngo',
    supportEmail: 'support@gratis.ngo',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'nl', 'de', 'fr', 'es'],
    defaultCurrency: 'EUR',
    availableCurrencies: ['EUR', 'USD', 'GBP'],
    timezone: 'Europe/Amsterdam',
    dateFormat: 'DD/MM/YYYY',
  },
  branding: {
    logoUrl: '/images/logo.png',
    faviconUrl: '/favicon.ico',
    primaryColor: '#10b981',
    secondaryColor: '#064e3b',
    accentColor: '#f59e0b',
    darkMode: false,
    socialLinks: {
      twitter: 'https://twitter.com/gratisngo',
      instagram: 'https://instagram.com/gratisngo',
    },
  },
  features: {
    donations: true,
    subscriptions: true,
    events: true,
    tribe: true,
    bottles: true,
    leaderboard: true,
    referrals: true,
    blog: true,
    chat: false,
    mfa: true,
    apiKeys: true,
    webhooks: true,
    gamification: true,
  },
  donations: {
    minimumAmount: 1,
    maximumAmount: 50000,
    presetAmounts: [5, 10, 25, 50, 100],
    allowRecurring: true,
    defaultRecurring: false,
    processingFeePercentage: 2.9,
    coverFeesOption: true,
    taxReceiptEnabled: true,
    taxReceiptThreshold: 25,
    anonymousDonationsAllowed: true,
  },
  email: {
    fromName: 'GRATIS.NGO',
    fromEmail: 'hello@gratis.ngo',
    replyToEmail: 'support@gratis.ngo',
    sendgridApiKey: '',
    welcomeEmailEnabled: true,
    donationReceiptEnabled: true,
    weeklyDigestEnabled: true,
    marketingEmailsEnabled: false,
  },
  security: {
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    passwordMinLength: 8,
    requireMFA: false,
    allowSocialLogin: true,
    allowedSocialProviders: ['google', 'github'],
    corsOrigins: ['https://gratis.ngo'],
    rateLimitPerMinute: 60,
  },
  integrations: {
    stripe: { enabled: true, publicKey: '', webhookSecret: '' },
    firebase: { projectId: '' },
    sendgrid: { enabled: true, apiKey: '' },
    mux: { enabled: false, tokenId: '', tokenSecret: '' },
    analytics: {},
    sentry: { enabled: false },
  },
  maintenance: {
    enabled: false,
    message: 'We are currently performing scheduled maintenance. Please check back shortly.',
    allowedIPs: [],
  },
  limits: {
    maxFileUploadMB: 10,
    maxImagesPerProject: 20,
    maxEventsPerMonth: 50,
    maxAPIKeysPerUser: 10,
    maxExportsPerDay: 10,
    maxTeamMembers: 50,
  },
};

export class PlatformConfigService {
  /**
   * Get the full platform configuration
   */
  static async getConfig(): Promise<PlatformConfig> {
    if (cachedConfig && Date.now() - cacheTimestamp < CACHE_TTL) {
      return cachedConfig;
    }

    try {
      const doc = await adminDb.doc(CONFIG_DOC).get();
      if (doc.exists) {
        cachedConfig = this.mergeWithDefaults(doc.data() as Partial<PlatformConfig>);
      } else {
        // Initialize with defaults
        await adminDb.doc(CONFIG_DOC).set(DEFAULT_CONFIG);
        cachedConfig = DEFAULT_CONFIG;
      }
      cacheTimestamp = Date.now();
      return cachedConfig;
    } catch (error) {
      console.error('Failed to load platform config:', error);
      return DEFAULT_CONFIG;
    }
  }

  /**
   * Get a specific config section
   */
  static async getSection<K extends keyof PlatformConfig>(
    section: K
  ): Promise<PlatformConfig[K]> {
    const config = await this.getConfig();
    return config[section];
  }

  /**
   * Update a config section
   */
  static async updateSection<K extends keyof PlatformConfig>(
    section: K,
    updates: Partial<PlatformConfig[K]>,
    userId: string,
    reason?: string
  ): Promise<void> {
    const currentConfig = await this.getConfig();
    const currentSection = currentConfig[section];

    // Log individual field changes
    const changeLogs: Omit<ConfigChangeLog, 'id'>[] = [];
    for (const [key, newValue] of Object.entries(updates)) {
      const oldValue = (currentSection as Record<string, unknown>)[key];
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changeLogs.push({
          section,
          field: key,
          oldValue,
          newValue,
          changedBy: userId,
          changedAt: new Date().toISOString(),
          reason,
        });
      }
    }

    // Apply updates
    const updatedSection = { ...currentSection, ...updates };
    await adminDb.doc(CONFIG_DOC).update({
      [section]: updatedSection,
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
    });

    // Store change logs
    for (const log of changeLogs) {
      await adminDb.collection('config_change_logs').add(log);
    }

    // Invalidate cache
    cachedConfig = null;
    cacheTimestamp = 0;
  }

  /**
   * Check if a feature is enabled
   */
  static async isFeatureEnabled(feature: keyof PlatformConfig['features']): Promise<boolean> {
    const config = await this.getConfig();
    return config.features[feature] ?? false;
  }

  /**
   * Check if maintenance mode is active
   */
  static async isMaintenanceMode(ipAddress?: string): Promise<boolean> {
    const config = await this.getConfig();
    if (!config.maintenance.enabled) return false;
    if (ipAddress && config.maintenance.allowedIPs.includes(ipAddress)) return false;
    return true;
  }

  /**
   * Get configuration change history
   */
  static async getChangeHistory(
    section?: keyof PlatformConfig,
    limit = 50
  ): Promise<ConfigChangeLog[]> {
    let q: FirebaseFirestore.Query = adminDb
      .collection('config_change_logs')
      .orderBy('changedAt', 'desc');

    if (section) {
      q = q.where('section', '==', section);
    }

    const snap = await q.limit(limit).get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ConfigChangeLog));
  }

  /**
   * Reset a section to defaults
   */
  static async resetSection<K extends keyof PlatformConfig>(
    section: K,
    userId: string
  ): Promise<void> {
    await this.updateSection(section, DEFAULT_CONFIG[section], userId, 'Reset to defaults');
  }

  // -- Private helpers --

  private static mergeWithDefaults(
    partial: Partial<PlatformConfig>
  ): PlatformConfig {
    return {
      general: { ...DEFAULT_CONFIG.general, ...partial.general },
      branding: { ...DEFAULT_CONFIG.branding, ...partial.branding },
      features: { ...DEFAULT_CONFIG.features, ...partial.features },
      donations: { ...DEFAULT_CONFIG.donations, ...partial.donations },
      email: { ...DEFAULT_CONFIG.email, ...partial.email },
      security: { ...DEFAULT_CONFIG.security, ...partial.security },
      integrations: { ...DEFAULT_CONFIG.integrations, ...partial.integrations },
      maintenance: { ...DEFAULT_CONFIG.maintenance, ...partial.maintenance },
      limits: { ...DEFAULT_CONFIG.limits, ...partial.limits },
    };
  }
}
```

### File 68-3: `src/app/api/admin/config/route.ts`

```typescript
// src/app/api/admin/config/route.ts
// Admin API for platform configuration

import { NextRequest, NextResponse } from 'next/server';
import { PlatformConfigService } from '@/lib/config/platform-config-service';
import { verifyAuth } from '@/lib/auth/verify';
import type { PlatformConfig } from '@/types/platform-config';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section') as keyof PlatformConfig | null;

    if (section) {
      const data = await PlatformConfigService.getSection(section);
      return NextResponse.json({ [section]: data });
    }

    const config = await PlatformConfigService.getConfig();

    // Mask sensitive values
    const safeConfig = { ...config };
    if (safeConfig.email?.sendgridApiKey) {
      safeConfig.email.sendgridApiKey = '***masked***';
    }
    if (safeConfig.integrations?.stripe?.webhookSecret) {
      safeConfig.integrations.stripe.webhookSecret = '***masked***';
    }
    if (safeConfig.integrations?.sendgrid?.apiKey) {
      safeConfig.integrations.sendgrid.apiKey = '***masked***';
    }
    if (safeConfig.integrations?.mux?.tokenSecret) {
      safeConfig.integrations.mux.tokenSecret = '***masked***';
    }

    return NextResponse.json({ config: safeConfig });
  } catch (error) {
    console.error('GET /api/admin/config error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { section, updates, reason } = body;

    if (!section || !updates) {
      return NextResponse.json(
        { error: 'section and updates are required' },
        { status: 400 }
      );
    }

    const validSections: (keyof PlatformConfig)[] = [
      'general', 'branding', 'features', 'donations',
      'email', 'security', 'integrations', 'maintenance', 'limits',
    ];

    if (!validSections.includes(section)) {
      return NextResponse.json(
        { error: `Invalid section. Must be: ${validSections.join(', ')}` },
        { status: 400 }
      );
    }

    await PlatformConfigService.updateSection(
      section,
      updates,
      user.uid,
      reason
    );

    return NextResponse.json({
      success: true,
      message: `${section} configuration updated`,
    });
  } catch (error) {
    console.error('PATCH /api/admin/config error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### File 68-4: `src/app/api/admin/config/history/route.ts`

```typescript
// src/app/api/admin/config/history/route.ts
// Configuration change history

import { NextRequest, NextResponse } from 'next/server';
import { PlatformConfigService } from '@/lib/config/platform-config-service';
import { verifyAuth } from '@/lib/auth/verify';
import type { PlatformConfig } from '@/types/platform-config';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section') as keyof PlatformConfig | undefined;
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);

    const history = await PlatformConfigService.getChangeHistory(
      section || undefined,
      limit
    );

    return NextResponse.json({ history });
  } catch (error) {
    console.error('GET /api/admin/config/history error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### File 68-5: `src/middleware/maintenance.ts`

```typescript
// src/middleware/maintenance.ts
// Maintenance mode middleware

import { NextRequest, NextResponse } from 'next/server';
import { PlatformConfigService } from '@/lib/config/platform-config-service';

const BYPASS_PATHS = [
  '/api/health',
  '/api/admin',
  '/_next',
  '/favicon.ico',
];

export async function checkMaintenance(
  request: NextRequest
): Promise<NextResponse | null> {
  // Skip maintenance check for bypass paths
  const path = request.nextUrl.pathname;
  if (BYPASS_PATHS.some((bp) => path.startsWith(bp))) {
    return null;
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '';

  try {
    const isInMaintenance = await PlatformConfigService.isMaintenanceMode(ip);

    if (isInMaintenance) {
      // API requests get JSON
      if (path.startsWith('/api/')) {
        return NextResponse.json(
          {
            error: 'Service unavailable',
            message: 'We are currently performing scheduled maintenance.',
            retryAfter: 3600,
          },
          {
            status: 503,
            headers: { 'Retry-After': '3600' },
          }
        );
      }

      // UI requests get maintenance page
      const url = new URL('/maintenance', request.url);
      return NextResponse.rewrite(url);
    }
  } catch {
    // If config service fails, don't block requests
  }

  return null;
}
```

### File 68-6: `src/app/maintenance/page.tsx`

```tsx
// src/app/maintenance/page.tsx
// Maintenance mode page

import { Wrench, Clock, ArrowLeft } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Wrench className="w-10 h-10 text-amber-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Under Maintenance
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          We are currently performing scheduled maintenance to improve your
          experience. We&#39;ll be back shortly. Thank you for your patience!
        </p>

        {/* Estimated time */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border text-sm text-gray-600 mb-8">
          <Clock className="w-4 h-4" />
          <span>Usually takes less than an hour</span>
        </div>

        {/* Contact */}
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            Need help? Contact us at{' '}
            <a
              href="mailto:support@gratis.ngo"
              className="text-emerald-600 hover:text-emerald-700"
            >
              support@gratis.ngo
            </a>
          </p>

          {/* Status page link */}
          <a
            href="https://status.gratis.ngo"
            className="inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700"
          >
            Check system status
            <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
          </a>
        </div>
      </div>
    </div>
  );
}
```

---

### PART 13 SUMMARY

| Section | Title | Files | Lines (approx) |
|---------|-------|-------|-----------------|
| 64 | API Key Management & Developer Portal | 4 | ~550 |
| 65 | Real-Time Notifications (SSE) | 6 | ~600 |
| 66 | Scheduled Tasks & Cron Job Manager | 5 | ~650 |
| 67 | End-to-End Testing Suite (Playwright) | 7 | ~450 |
| 68 | Platform Configuration & Settings | 6 | ~600 |
| **TOTAL** | | **28 files** | **~2,850 lines** |

---

### CUMULATIVE TOTALS (Parts 1–13)

| Part | Sections | Files | Approx Size |
|------|----------|-------|-------------|
| 1 | 1–5 | ~25 | ~110KB |
| 2 | 6–10 | ~25 | ~115KB |
| 3 | 11–13 | ~18 | ~95KB |
| 4 | 14–18 | ~22 | ~100KB |
| 5 | 19–24 | ~28 | ~120KB |
| 6 | 25–30 | ~28 | ~115KB |
| 7 | 31–36 | ~26 | ~110KB |
| 8 | 37–42 | ~24 | ~105KB |
| 9 | 43–48 | ~30 | ~130KB |
| 10 | 49–53 | 39 | ~160KB |
| 11 | 54–58 | 31 | ~174KB |
| 12 | 59–63 | 29 | ~120KB |
| 13 | 64–68 | 28 | ~110KB |
| **TOTAL** | **1–68** | **~353** | **~1,664KB** |

---

*End of Part 13 — Sections 64–68*
*GRATIS.NGO Enterprise Build Guide: 68 sections complete.*
