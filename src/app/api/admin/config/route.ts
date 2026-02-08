// src/app/api/admin/config/route.ts
// Platform Configuration Management Endpoints

import { platformConfigService } from '@/lib/config/platform-config-service';
import { auth } from '@/firebase';
import type { PlatformConfig } from '@/types/platform-config';

// GET /api/admin/config - Get current platform configuration
export async function GET(request: Request) {
  try {
    const user = auth.currentUser;
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // TODO: Check if user has admin:config permission

    const config = await platformConfigService.getConfig();

    return new Response(JSON.stringify({
      success: true,
      data: config,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Failed to fetch config:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch platform configuration' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// PUT /api/admin/config - Update platform configuration
export async function PUT(request: Request) {
  try {
    const user = auth.currentUser;
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const updates: Partial<PlatformConfig> = body.config;
    const reason = body.reason || 'Configuration update';

    if (!updates) {
      return new Response(JSON.stringify({ error: 'config is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // TODO: Implement full config update by iterating sections
    // For now, return mock response
    return new Response(JSON.stringify({
      success: true,
      message: 'Full configuration update not yet implemented. Use PATCH for section updates.',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Failed to update config:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to update configuration' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// PATCH /api/admin/config - Update specific section
export async function PATCH(request: Request) {
  try {
    const user = auth.currentUser;
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { section, data, reason } = body;

    if (!section || !data) {
      return new Response(JSON.stringify({ error: 'section and data are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await platformConfigService.updateSection(
      section,
      data,
      user.uid,
      reason || `${section} section update`
    );

    return new Response(JSON.stringify({
      success: true,
      message: `${section} updated successfully`,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Failed to update config section:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to update configuration section' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
