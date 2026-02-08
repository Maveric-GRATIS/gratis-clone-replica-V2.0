// src/app/api/developer/keys/validate/route.ts
// API Key Validation Endpoint

import { apiKeyService } from '@/lib/api-keys/api-key-service';

// POST /api/developer/keys/validate - Validate an API key
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key } = body;

    if (!key) {
      return new Response(JSON.stringify({ error: 'API key is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await apiKeyService.validateKey(key);

    if (!result.valid) {
      return new Response(JSON.stringify({
        valid: false,
        error: result.error || 'Invalid API key',
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      valid: true,
      apiKey: {
        name: result.apiKey?.name,
        environment: result.apiKey?.environment,
        scopes: result.apiKey?.scopes,
        rateLimit: result.apiKey?.rateLimit,
      },
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Failed to validate API key:', error);
    return new Response(JSON.stringify({ error: 'Failed to validate API key' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
