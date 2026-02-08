// src/lib/webhooks/delivery-service.ts
// GRATIS.NGO — Webhook Delivery Service

import type {
  WebhookSubscription,
  WebhookDelivery,
  WebhookEvent,
  WebhookPayload,
  WebhookAttempt,
} from '@/types/webhook-delivery';
import crypto from 'crypto';

// Mock storage (in production: Firestore)
const mockSubscriptions = new Map<string, WebhookSubscription>();
const mockDeliveries = new Map<string, WebhookDelivery>();

/**
 * Create HMAC signature for webhook payload
 */
function createSignature(payload: string, secret: string, timestamp: number): string {
  const signedPayload = `${timestamp}.${payload}`;
  return crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');
}

/**
 * Send webhook to endpoint
 */
async function sendWebhook(
  url: string,
  payload: WebhookPayload,
  secret: string,
  timeoutMs: number = 10000
): Promise<{
  success: boolean;
  status?: number;
  responseTime: number;
  responseBody?: string;
  errorMessage?: string;
}> {
  const startTime = Date.now();

  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const payloadString = JSON.stringify(payload);
    const signature = createSignature(payloadString, secret, timestamp);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Timestamp': timestamp.toString(),
        'X-Webhook-Event': payload.event,
        'User-Agent': 'GRATIS.NGO-Webhooks/1.0',
      },
      body: payloadString,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const responseTime = Date.now() - startTime;
    const responseBody = await response.text();

    return {
      success: response.ok, // 2xx status codes
      status: response.status,
      responseTime,
      responseBody,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    return {
      success: false,
      responseTime,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Deliver webhook event
 */
export async function deliverWebhook(
  subscriptionId: string,
  event: WebhookEvent,
  payload: any
): Promise<WebhookDelivery> {
  const subscription = mockSubscriptions.get(subscriptionId);
  if (!subscription) {
    throw new Error(`Subscription ${subscriptionId} not found`);
  }

  if (subscription.status !== 'active') {
    throw new Error(`Subscription ${subscriptionId} is not active`);
  }

  // Create webhook payload
  const webhookPayload: WebhookPayload = {
    id: `evt_${Date.now()}`,
    event,
    timestamp: new Date().toISOString(),
    data: payload,
  };

  // Create delivery record
  const delivery: WebhookDelivery = {
    id: `delivery_${Date.now()}`,
    subscriptionId,
    event,
    payload: webhookPayload,
    status: 'pending',
    attemptCount: 0,
    maxAttempts: subscription.retryPolicy.maxRetries + 1,
    requestUrl: subscription.url,
    requestMethod: 'POST',
    requestHeaders: {},
    requestBody: JSON.stringify(webhookPayload),
    createdAt: new Date(),
    attempts: [],
  };

  mockDeliveries.set(delivery.id, delivery);

  // Attempt delivery
  await attemptDelivery(delivery.id);

  return mockDeliveries.get(delivery.id)!;
}

/**
 * Attempt delivery (or retry)
 */
export async function attemptDelivery(deliveryId: string): Promise<boolean> {
  const delivery = mockDeliveries.get(deliveryId);
  if (!delivery) {
    console.error(`[Webhook Delivery] Delivery ${deliveryId} not found`);
    return false;
  }

  const subscription = mockSubscriptions.get(delivery.subscriptionId);
  if (!subscription) {
    console.error(`[Webhook Delivery] Subscription ${delivery.subscriptionId} not found`);
    return false;
  }

  delivery.attemptCount += 1;
  delivery.status = 'retrying';

  console.log(
    `[Webhook Delivery] Attempt ${delivery.attemptCount}/${delivery.maxAttempts} for ${deliveryId}`
  );

  // Send webhook
  const result = await sendWebhook(
    subscription.url,
    delivery.payload as WebhookPayload,
    subscription.secret,
    subscription.timeoutMs
  );

  // Record attempt
  const attempt: WebhookAttempt = {
    attemptNumber: delivery.attemptCount,
    attemptedAt: new Date(),
    responseStatus: result.status,
    responseTime: result.responseTime,
    errorMessage: result.errorMessage,
    success: result.success,
  };

  delivery.attempts.push(attempt);
  delivery.responseStatus = result.status;
  delivery.responseBody = result.responseBody;
  delivery.responseTime = result.responseTime;
  delivery.errorMessage = result.errorMessage;

  if (result.success) {
    // Delivery successful
    delivery.status = 'delivered';
    delivery.deliveredAt = new Date();
    subscription.lastDeliveryAt = new Date();
    subscription.successfulDeliveries += 1;
    subscription.totalDeliveries += 1;

    console.log(`[Webhook Delivery] ✓ Successfully delivered ${deliveryId}`);
    return true;
  } else {
    // Delivery failed
    if (delivery.attemptCount >= delivery.maxAttempts) {
      // Max retries reached
      delivery.status = 'failed';
      delivery.failedAt = new Date();
      subscription.failedDeliveries += 1;
      subscription.totalDeliveries += 1;

      // Disable subscription after too many failures
      if (subscription.failedDeliveries >= 50) {
        subscription.status = 'failed';
        console.warn(
          `[Webhook Delivery] Subscription ${subscription.id} disabled due to too many failures`
        );
      }

      console.error(`[Webhook Delivery] ✗ Failed delivery ${deliveryId} (max retries reached)`);
      return false;
    } else {
      // Schedule retry
      const retryDelaySeconds =
        subscription.retryPolicy.retryDelays[delivery.attemptCount - 1] || 3600;
      const nextRetryAt = new Date(Date.now() + retryDelaySeconds * 1000);

      delivery.status = 'pending';
      delivery.nextRetryAt = nextRetryAt;

      console.log(
        `[Webhook Delivery] ⟳ Scheduled retry for ${deliveryId} at ${nextRetryAt.toISOString()}`
      );
      return false;
    }
  }
}

/**
 * Get pending/failed deliveries that need retry
 */
export function getPendingDeliveries(): WebhookDelivery[] {
  const now = new Date();
  const pending: WebhookDelivery[] = [];

  for (const delivery of mockDeliveries.values()) {
    if (
      delivery.status === 'pending' &&
      delivery.attemptCount < delivery.maxAttempts &&
      (!delivery.nextRetryAt || delivery.nextRetryAt <= now)
    ) {
      pending.push(delivery);
    }
  }

  return pending;
}

/**
 * Process retry queue
 */
export async function processRetryQueue(): Promise<{
  processed: number;
  successful: number;
  failed: number;
}> {
  const pending = getPendingDeliveries();
  let successful = 0;
  let failed = 0;

  console.log(`[Webhook Delivery] Processing ${pending.length} pending deliveries`);

  for (const delivery of pending) {
    const success = await attemptDelivery(delivery.id);
    if (success) {
      successful += 1;
    } else {
      failed += 1;
    }
  }

  return {
    processed: pending.length,
    successful,
    failed,
  };
}

/**
 * Trigger webhook for event
 */
export async function triggerWebhooks(event: WebhookEvent, payload: any): Promise<number> {
  console.log(`[Webhook Delivery] Triggering webhooks for event: ${event}`);

  const subscriptions = Array.from(mockSubscriptions.values()).filter(
    (sub) => sub.status === 'active' && sub.events.includes(event)
  );

  if (subscriptions.length === 0) {
    console.log(`[Webhook Delivery] No active subscriptions for ${event}`);
    return 0;
  }

  console.log(`[Webhook Delivery] Found ${subscriptions.length} subscriptions for ${event}`);

  const deliveryPromises = subscriptions.map((sub) => deliverWebhook(sub.id, event, payload));

  await Promise.all(deliveryPromises);

  return subscriptions.length;
}

/**
 * Create webhook subscription
 */
export async function createSubscription(data: {
  userId: string;
  partnerId?: string;
  name: string;
  url: string;
  events: WebhookEvent[];
  secret?: string;
}): Promise<WebhookSubscription> {
  const subscription: WebhookSubscription = {
    id: `sub_${Date.now()}`,
    userId: data.userId,
    partnerId: data.partnerId,
    name: data.name,
    url: data.url,
    events: data.events,
    secret: data.secret || crypto.randomBytes(32).toString('hex'),
    status: 'active',
    retryPolicy: {
      maxRetries: 5,
      retryDelays: [60, 300, 900, 3600, 7200], // 1m, 5m, 15m, 1h, 2h
    },
    timeoutMs: 10000,
    createdAt: new Date(),
    updatedAt: new Date(),
    totalDeliveries: 0,
    successfulDeliveries: 0,
    failedDeliveries: 0,
  };

  mockSubscriptions.set(subscription.id, subscription);
  console.log(`[Webhook Delivery] Created subscription ${subscription.id}`);
  return subscription;
}

/**
 * Get subscription by ID
 */
export async function getSubscription(subscriptionId: string): Promise<WebhookSubscription | null> {
  return mockSubscriptions.get(subscriptionId) || null;
}

/**
 * Get all subscriptions for user
 */
export async function getUserSubscriptions(userId: string): Promise<WebhookSubscription[]> {
  return Array.from(mockSubscriptions.values()).filter((sub) => sub.userId === userId);
}

/**
 * Delete subscription
 */
export async function deleteSubscription(subscriptionId: string): Promise<boolean> {
  return mockSubscriptions.delete(subscriptionId);
}
