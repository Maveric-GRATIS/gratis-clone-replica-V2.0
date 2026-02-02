import { Request, Response, NextFunction } from "express";
import { WebhookService } from "@/lib/webhooks/webhookService";

/**
 * POST /api/webhooks/register
 * Register a new webhook
 */
export async function registerWebhook(req: Request, res: Response, next: NextFunction) {
  try {
    const { partnerId, url, events, secret } = req.body;

    if (!partnerId || !url || !events || !Array.isArray(events)) {
      return res.status(400).json({ error: "Missing or invalid required fields" });
    }

    const webhookId = await WebhookService.registerWebhook(partnerId, url, events, secret);

    res.json({ webhookId });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/webhooks/partner/:partnerId
 * Get all webhooks for a partner
 */
export async function getPartnerWebhooks(req: Request, res: Response, next: NextFunction) {
  try {
    const { partnerId } = req.params;

    const webhooks = await WebhookService.getPartnerWebhooks(partnerId);

    res.json(webhooks);
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/webhooks/:webhookId
 * Update webhook configuration
 */
export async function updateWebhook(req: Request, res: Response, next: NextFunction) {
  try {
    const { webhookId } = req.params;
    const updates = req.body;

    await WebhookService.updateWebhook(webhookId, updates);

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/webhooks/:webhookId
 * Delete webhook
 */
export async function deleteWebhook(req: Request, res: Response, next: NextFunction) {
  try {
    const { webhookId } = req.params;

    await WebhookService.deleteWebhook(webhookId);

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/webhooks/:webhookId/test
 * Test webhook endpoint
 */
export async function testWebhook(req: Request, res: Response, next: NextFunction) {
  try {
    const { webhookId } = req.params;

    const success = await WebhookService.testWebhook(webhookId);

    res.json({ success });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/webhooks/:webhookId/deliveries
 * Get webhook delivery history
 */
export async function getDeliveryHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const { webhookId } = req.params;
    const { limit = 50 } = req.query;

    const deliveries = await WebhookService.getDeliveryHistory(
      webhookId,
      parseInt(limit as string)
    );

    res.json(deliveries);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/webhooks/deliveries/:deliveryId/retry
 * Retry failed webhook delivery
 */
export async function retryDelivery(req: Request, res: Response, next: NextFunction) {
  try {
    const { deliveryId } = req.params;

    await WebhookService.retryDelivery(deliveryId);

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/webhooks/:webhookId/stats
 * Get webhook statistics
 */
export async function getWebhookStats(req: Request, res: Response, next: NextFunction) {
  try {
    const { webhookId } = req.params;

    const stats = await WebhookService.getWebhookStats(webhookId);

    res.json(stats);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/webhooks/trigger
 * Trigger webhook event (internal use)
 */
export async function triggerWebhook(req: Request, res: Response, next: NextFunction) {
  try {
    const { event, data, metadata } = req.body;

    if (!event || !data) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await WebhookService.triggerWebhook(event, data, metadata);

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}
