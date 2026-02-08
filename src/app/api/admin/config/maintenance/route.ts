// src/app/api/admin/config/maintenance/route.ts
// Maintenance Mode Management Endpoint

import { platformConfigService } from '@/lib/config/platform-config-service';
import { auth } from '@/firebase';

// POST /api/admin/config/maintenance - Toggle maintenance mode
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
    const { enabled, reason } = body;

    if (typeof enabled !== 'boolean') {
      return new Response(JSON.stringify({ error: 'enabled (boolean) is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // TODO: Implement using updateSection for maintenanceMode field
    // For now, return mock response
    return new Response(JSON.stringify({
      success: true,
      message: enabled
        ? 'Maintenance mode enabled'
        : 'Maintenance mode disabled',
      maintenanceMode: enabled,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Failed to toggle maintenance mode:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to toggle maintenance mode' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// GET /api/admin/config/maintenance - Check maintenance mode status
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ipAddress = searchParams.get('ip') || undefined;

    const inMaintenance = await platformConfigService.isMaintenanceMode(ipAddress);

    return new Response(JSON.stringify({
      success: true,
      maintenanceMode: inMaintenance,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Failed to check maintenance mode:', error);
    return new Response(JSON.stringify({ error: 'Failed to check maintenance mode' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
