/**
 * Webhook System Types
 * Part 8 - Section 39: Partner Integrations
 */

export interface Webhook {
  id: string;
  partnerId: string;
  name: string;
  url: string;
  secret: string;
  events: WebhookEvent[];
  isActive: boolean;
  retryPolicy: WebhookRetryPolicy;
  headers?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

export type WebhookEvent =
  | 'donation.created'
  | 'donation.completed'
  | 'donation.failed'
  | 'project.funded'
  | 'project.milestone'
  | 'subscriber.new'
  | 'subscriber.cancelled'
  | 'message.new'
  | 'payout.processed';

export interface WebhookRetryPolicy {
  maxRetries: number;
  retryInterval: number; // in seconds
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: WebhookEvent;
  payload: Record<string, any>;
  responseStatus?: number;
  responseBody?: string;
  attempts: number;
  status: 'pending' | 'delivered' | 'failed';
  deliveredAt?: Date;
  nextRetryAt?: Date;
  createdAt: Date;
}

export interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  data: Record<string, any>;
  metadata?: Record<string, any>;
}
