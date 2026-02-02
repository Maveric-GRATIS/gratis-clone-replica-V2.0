import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  increment
} from "firebase/firestore";
import { db } from "@/firebase";
import { Webhook, WebhookDelivery, WebhookPayload, WebhookEvent } from "@/types/webhook";
import crypto from "crypto";

export class WebhookService {

  /**
   * Register a new webhook
   */
  static async registerWebhook(
    partnerId: string,
    url: string,
    events: WebhookEvent[],
    secret?: string
  ): Promise<string> {
    const webhookRef = doc(collection(db, "webhooks"));

    const webhook: Omit<Webhook, "id"> = {
      partnerId,
      name: `Webhook for ${partnerId}`,
      url,
      events,
      secret: secret || this.generateSecret(),
      isActive: true,
      retryPolicy: {
        maxRetries: 3,
        retryInterval: 60 // seconds
      },
      headers: {},
      createdAt: Timestamp.now().toDate(),
      updatedAt: Timestamp.now().toDate()
    };

    await setDoc(webhookRef, webhook);
    return webhookRef.id;
  }

  /**
   * Generate webhook secret for signature verification
   */
  private static generateSecret(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  /**
   * Get all webhooks for a partner
   */
  static async getPartnerWebhooks(partnerId: string): Promise<Webhook[]> {
    const webhooksRef = collection(db, "webhooks");
    const q = query(
      webhooksRef,
      where("partnerId", "==", partnerId),
      where("isActive", "==", true)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Webhook));
  }

  /**
   * Get webhooks subscribed to specific event
   */
  static async getWebhooksForEvent(event: WebhookEvent): Promise<Webhook[]> {
    const webhooksRef = collection(db, "webhooks");
    const q = query(
      webhooksRef,
      where("events", "array-contains", event),
      where("isActive", "==", true)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Webhook));
  }

  /**
   * Trigger webhook for an event
   */
  static async triggerWebhook(
    event: WebhookEvent,
    data: any,
    metadata?: Record<string, any>
  ): Promise<void> {
    const webhooks = await this.getWebhooksForEvent(event);

    const payload: WebhookPayload = {
      event,
      data,
      timestamp: new Date().toISOString(),
      metadata
    };

    // Queue deliveries for all subscribed webhooks
    for (const webhook of webhooks) {
      await this.queueWebhookDelivery(webhook, payload);
    }
  }

  /**
   * Queue webhook delivery for processing
   */
  private static async queueWebhookDelivery(
    webhook: Webhook,
    payload: WebhookPayload
  ): Promise<void> {
    const deliveryRef = doc(collection(db, "webhookDeliveries"));

    const delivery: Omit<WebhookDelivery, "id"> = {
      webhookId: webhook.id,
      event: payload.event,
      payload: payload as any,
      attempts: 0,
      status: "pending",
      createdAt: Timestamp.now().toDate(),
      nextRetryAt: Timestamp.now().toDate()
    };

    await setDoc(deliveryRef, delivery);

    // Trigger immediate delivery attempt
    await this.deliverWebhook(deliveryRef.id, webhook, payload);
  }

  /**
   * Deliver webhook to endpoint
   */
  private static async deliverWebhook(
    deliveryId: string,
    webhook: Webhook,
    payload: WebhookPayload
  ): Promise<void> {
    const deliveryRef = doc(db, "webhookDeliveries", deliveryId);

    try {
      // Generate signature
      const signature = this.generateSignature(payload, webhook.secret);

      // Prepare headers
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "X-Webhook-Signature": signature,
        "X-Webhook-Event": payload.event,
        "X-Webhook-Timestamp": payload.timestamp,
        "User-Agent": "GRATIS-Webhooks/1.0"
      };

      // Add custom headers if provided
      if (webhook.headers) {
        Object.assign(headers, webhook.headers);
      }

      // Send request
      const response = await fetch(webhook.url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });

      // Update delivery status
      if (response.ok) {
        await updateDoc(deliveryRef, {
          status: "delivered",
          deliveredAt: Timestamp.now(),
          response: {
            status: response.status,
            headers: Object.fromEntries(response.headers.entries()),
            body: await response.text()
          }
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

    } catch (error: any) {
      // Update delivery with error
      const delivery = (await getDoc(deliveryRef)).data() as WebhookDelivery;
      const attempts = delivery.attempts + 1;
      const maxRetries = webhook.retryPolicy?.maxRetries || 3;

      if (attempts >= maxRetries) {
        // Max retries reached, mark as failed
        await updateDoc(deliveryRef, {
          status: "failed",
          attempts,
          error: error.message,
          failedAt: Timestamp.now()
        });
      } else {
        // Schedule retry
        const retryInterval = webhook.retryPolicy?.retryInterval || 60000;
        const nextRetryAt = new Date(Date.now() + retryInterval * Math.pow(2, attempts - 1)); // Exponential backoff

        await updateDoc(deliveryRef, {
          status: "pending",
          attempts,
          error: error.message,
          nextRetryAt: Timestamp.fromDate(nextRetryAt)
        });

        // Note: In production, you'd use a job queue or Cloud Functions scheduled task
        // to retry failed deliveries
      }
    }
  }

  /**
   * Generate HMAC-SHA256 signature for webhook payload
   */
  private static generateSignature(payload: WebhookPayload, secret: string): string {
    const payloadString = JSON.stringify(payload);
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(payloadString);
    return `sha256=${hmac.digest("hex")}`;
  }

  /**
   * Verify webhook signature (for receiving webhooks)
   */
  static verifySignature(
    payload: string,
    signature: string,
    secret: string
  ): boolean {
    const expectedSignature = this.generateSignature(JSON.parse(payload), secret);
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  /**
   * Update webhook configuration
   */
  static async updateWebhook(
    webhookId: string,
    updates: Partial<Webhook>
  ): Promise<void> {
    const webhookRef = doc(db, "webhooks", webhookId);

    await updateDoc(webhookRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  }

  /**
   * Deactivate webhook
   */
  static async deactivateWebhook(webhookId: string): Promise<void> {
    await this.updateWebhook(webhookId, { isActive: false });
  }

  /**
   * Reactivate webhook
   */
  static async reactivateWebhook(webhookId: string): Promise<void> {
    await this.updateWebhook(webhookId, { isActive: true });
  }

  /**
   * Delete webhook
   */
  static async deleteWebhook(webhookId: string): Promise<void> {
    const webhookRef = doc(db, "webhooks", webhookId);
    await updateDoc(webhookRef, {
      isActive: false,
      deletedAt: Timestamp.now().toDate()
    });
  }

  /**
   * Get webhook delivery history
   */
  static async getDeliveryHistory(
    webhookId: string,
    limitCount: number = 50
  ): Promise<WebhookDelivery[]> {
    const deliveriesRef = collection(db, "webhookDeliveries");
    const q = query(
      deliveriesRef,
      where("webhookId", "==", webhookId),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as WebhookDelivery));
  }

  /**
   * Get failed deliveries for retry
   */
  static async getFailedDeliveries(): Promise<WebhookDelivery[]> {
    const deliveriesRef = collection(db, "webhookDeliveries");
    const q = query(
      deliveriesRef,
      where("status", "==", "pending"),
      where("nextRetryAt", "<=", Timestamp.now()),
      limit(100)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as WebhookDelivery));
  }

  /**
   * Retry failed webhook delivery
   */
  static async retryDelivery(deliveryId: string): Promise<void> {
    const deliveryRef = doc(db, "webhookDeliveries", deliveryId);
    const deliveryDoc = await getDoc(deliveryRef);

    if (!deliveryDoc.exists()) {
      throw new Error("Delivery not found");
    }

    const delivery = deliveryDoc.data() as WebhookDelivery;
    const webhookDoc = await getDoc(doc(db, "webhooks", delivery.webhookId));

    if (!webhookDoc.exists()) {
      throw new Error("Webhook not found");
    }

    const webhook = { id: webhookDoc.id, ...webhookDoc.data() } as Webhook;
    await this.deliverWebhook(deliveryId, webhook, delivery.payload as any);
  }

  /**
   * Get webhook statistics
   */
  static async getWebhookStats(webhookId: string): Promise<{
    totalDeliveries: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    pendingDeliveries: number;
    successRate: number;
  }> {
    const deliveries = await this.getDeliveryHistory(webhookId, 1000);

    const total = deliveries.length;
    const successful = deliveries.filter(d => d.status === "delivered").length;
    const failed = deliveries.filter(d => d.status === "failed").length;
    const pending = deliveries.filter(d => d.status === "pending").length;

    return {
      totalDeliveries: total,
      successfulDeliveries: successful,
      failedDeliveries: failed,
      pendingDeliveries: pending,
      successRate: total > 0 ? (successful / total) * 100 : 0
    };
  }

  /**
   * Test webhook endpoint
   */
  static async testWebhook(webhookId: string): Promise<boolean> {
    const webhookDoc = await getDoc(doc(db, "webhooks", webhookId));

    if (!webhookDoc.exists()) {
      throw new Error("Webhook not found");
    }

    const webhook = { id: webhookDoc.id, ...webhookDoc.data() } as Webhook;

    const testPayload: WebhookPayload = {
      event: "donation.created" as WebhookEvent,
      data: {
        test: true,
        message: "Test webhook ping"
      },
      timestamp: new Date().toISOString()
    };

    try {
      const signature = this.generateSignature(testPayload, webhook.secret);

      const response = await fetch(webhook.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Signature": signature,
          "X-Webhook-Event": "test.ping",
          "User-Agent": "GRATIS-Webhooks/1.0"
        },
        body: JSON.stringify(testPayload),
        signal: AbortSignal.timeout(10000)
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export default WebhookService;
