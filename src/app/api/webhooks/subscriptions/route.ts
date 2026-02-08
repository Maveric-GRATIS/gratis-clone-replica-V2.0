// src/app/api/webhooks/subscriptions/route.ts
// GRATIS.NGO — Webhook Subscriptions API

import { NextRequest, NextResponse } from 'next/server';
import {
  createSubscription,
  getUserSubscriptions,
  getSubscription,
  deleteSubscription,
} from '@/lib/webhooks/delivery-service';
import { requirePermissions } from '@/middleware/rbac';

/**
 * GET /api/webhooks/subscriptions
 * Get all webhook subscriptions for current user
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'mock-user';

    // Check permission
    const authCheck = await requirePermissions(userId, {
      requiredPermissions: ['admin:webhooks'],
    });

    if (!authCheck.allowed) {
      return NextResponse.json(
        { error: 'Unauthorized', reason: authCheck.reason },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('id');

    if (subscriptionId) {
      // Get specific subscription
      const subscription = await getSubscription(subscriptionId);
      if (!subscription) {
        return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
      }
      return NextResponse.json({ subscription });
    }

    // Get all subscriptions for user
    const subscriptions = await getUserSubscriptions(userId);
    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error('[Webhook Subscriptions API] GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/webhooks/subscriptions
 * Create new webhook subscription
 */
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'mock-user';

    // Check permission
    const authCheck = await requirePermissions(userId, {
      requiredPermissions: ['admin:webhooks'],
    });

    if (!authCheck.allowed) {
      return NextResponse.json(
        { error: 'Unauthorized', reason: authCheck.reason },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, url, events, secret, partnerId } = body;

    // Validation
    if (!name || !url || !events || events.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: name, url, events' },
        { status: 400 }
      );
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    // Create subscription
    const subscription = await createSubscription({
      userId,
      partnerId,
      name,
      url,
      events,
      secret,
    });

    return NextResponse.json({
      success: true,
      subscription,
      message: 'Webhook subscription created',
    });
  } catch (error) {
    console.error('[Webhook Subscriptions API] POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/webhooks/subscriptions
 * Delete webhook subscription
 */
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'mock-user';

    // Check permission
    const authCheck = await requirePermissions(userId, {
      requiredPermissions: ['admin:webhooks'],
    });

    if (!authCheck.allowed) {
      return NextResponse.json(
        { error: 'Unauthorized', reason: authCheck.reason },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('id');

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Subscription ID required' }, { status: 400 });
    }

    // Verify ownership
    const subscription = await getSubscription(subscriptionId);
    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    if (subscription.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete subscription
    const success = await deleteSubscription(subscriptionId);

    return NextResponse.json({
      success,
      message: 'Webhook subscription deleted',
    });
  } catch (error) {
    console.error('[Webhook Subscriptions API] DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
