// src/app/api/cron/webhook-retry/route.ts
// GRATIS.NGO — Webhook Retry Cron Job

import { NextRequest, NextResponse } from 'next/server';
import { processRetryQueue } from '@/lib/webhooks/delivery-service';

/**
 * GET /api/cron/webhook-retry
 * Process webhook retry queue (to be called by cron service)
 *
 * Usage with Vercel Cron:
 * Add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/webhook-retry",
 *     "schedule": "*/5 * * * *"  // Every 5 minutes
 *   }]
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (production security)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'dev-secret';

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized - invalid cron secret' },
        { status: 401 }
      );
    }

    console.log('[Webhook Retry Cron] Starting retry queue processing');

    const result = await processRetryQueue();

    console.log('[Webhook Retry Cron] Completed:', result);

    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Webhook Retry Cron] Error:', error);
    return NextResponse.json(
      {
        error: 'Cron job failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
