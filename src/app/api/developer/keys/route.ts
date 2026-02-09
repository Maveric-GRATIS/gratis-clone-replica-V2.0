// src/app/api/developer/keys/route.ts
// API Key Management Endpoints

import { apiKeyService } from '@/lib/api-keys/api-key-service';
import { auth } from '@/firebase';
import type { APIKeyCreateRequest } from '@/types/api-keys';

// GET /api/developer/keys - List all API keys for current user
export async function GET(request: Request) {
  try {
    const user = auth.currentUser;
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const keys = await apiKeyService.listKeys(user.uid);

    return new Response(JSON.stringify({
      success: true,
      data: keys,
      count: keys.length,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Failed to list API keys:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch API keys' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST /api/developer/keys - Create new API key
export async function POST(request: Request) {
  try {
    const user = auth.currentUser;
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const params: APIKeyCreateRequest = {
      name: body.name,
      environment: body.environment || 'sandbox',
      scopes: body.scopes || ['read'],
      rateLimit: body.rateLimit || 1000,
      allowedOrigins: body.allowedOrigins || [],
      allowedIPs: body.allowedIPs || [],
      expiresInDays: body.expiresInDays,
    };

    const result = await apiKeyService.createKey(user.uid, params);

    return new Response(JSON.stringify({
      success: true,
      data: result,
      message: 'API key created successfully',
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: unknown) {
    console.error('Failed to create API key:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to create API key' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// DELETE /api/developer/keys?keyId=xxx - Revoke API key
export async function DELETE(request: Request) {
  try {
    const user = auth.currentUser;
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { searchParams } = new URL(request.url);
    const keyId = searchParams.get('keyId');

    if (!keyId) {
      return new Response(JSON.stringify({ error: 'keyId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await apiKeyService.revokeKey(keyId, user.uid);

    return new Response(JSON.stringify({
      success: true,
      message: 'API key revoked successfully',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: unknown) {
    console.error('Failed to revoke API key:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to revoke API key' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// PATCH /api/developer/keys?keyId=xxx&action=roll - Roll API key
export async function PATCH(request: Request) {
  try {
    const user = auth.currentUser;
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { searchParams } = new URL(request.url);
    const keyId = searchParams.get('keyId');
    const action = searchParams.get('action');

    if (!keyId) {
      return new Response(JSON.stringify({ error: 'keyId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (action === 'roll') {
      const result = await apiKeyService.rollKey(keyId, user.uid);
      return new Response(JSON.stringify({
        success: true,
        data: result,
        message: 'API key rolled successfully',
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: unknown) {
    console.error('Failed to update API key:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to update API key' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
