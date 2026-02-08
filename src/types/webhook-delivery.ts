// src/types/webhook-delivery.ts
// GRATIS.NGO — Webhook Delivery Types

export interface WebhookSubscription {
  id: string;
  userId: string;
  partnerId?: string;
  name: string;
  url: string; // Endpoint to POST events to
  events: WebhookEvent[]; // Which events to subscribe to
  secret: string; // For HMAC signature verification
  status: 'active' | 'paused' | 'disabled' | 'failed';

  // Delivery configuration
  retryPolicy: WebhookRetryPolicy;
  timeoutMs: number; // Request timeout

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastDeliveryAt?: Date;

  // Statistics
  totalDeliveries: number;
  successfulDeliveries: number;
  failedDeliveries: number;
}

export type WebhookEvent =
  | 'donation.created'
  | 'donation.completed'
  | 'donation.refunded'
  | 'project.created'
  | 'project.updated'
  | 'project.completed'
  | 'event.created'
  | 'event.registration'
  | 'user.created'
  | 'partner.verified'
  | 'payout.created'
  | 'payout.completed';

export interface WebhookRetryPolicy {
  maxRetries: number; // e.g., 5
  retryDelays: number[]; // e.g., [60, 300, 900, 3600, 7200] (in seconds)
  backoffMultiplier?: number; // Optional exponential backoff
}

export interface WebhookDelivery {
  id: string;
  subscriptionId: string;
  event: WebhookEvent;
  payload: any; // Event payload

  // Delivery status
  status: 'pending' | 'delivered' | 'failed' | 'retrying';
  attemptCount: number;
  maxAttempts: number;

  // HTTP details
  requestUrl: string;
  requestMethod: 'POST';
  requestHeaders: Record<string, string>;
  requestBody: string;

  // Response details
  responseStatus?: number;
  responseBody?: string;
  responseTime?: number; // ms
  errorMessage?: string;

  // Timing
  createdAt: Date;
  nextRetryAt?: Date;
  deliveredAt?: Date;
  failedAt?: Date;

  // Attempts log
  attempts: WebhookAttempt[];
}

export interface WebhookAttempt {
  attemptNumber: number;
  attemptedAt: Date;
  responseStatus?: number;
  responseTime?: number;
  errorMessage?: string;
  success: boolean;
}

export interface WebhookPayload<T = any> {
  id: string; // Event ID
  event: WebhookEvent;
  timestamp: string; // ISO 8601
  data: T;
  tenant?: string; // Tenant ID for multi-tenant
}

export interface WebhookSignature {
  timestamp: number;
  signature: string; // HMAC-SHA256 of timestamp + payload
}
