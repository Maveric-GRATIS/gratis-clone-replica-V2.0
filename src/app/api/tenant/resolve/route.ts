// src/app/api/tenant/resolve/route.ts
// GRATIS.NGO — Tenant Resolution API

import { NextRequest, NextResponse } from '@/lib/next-compat';
import { resolveTenant, getTenant } from '@/lib/tenant/tenant-service';

/**
 * GET /api/tenant/resolve
 * Resolve tenant from domain, slug, or tenant ID
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const domain = searchParams.get('domain') || undefined;
    const slug = searchParams.get('slug') || undefined;
    const tenantId = searchParams.get('tenantId') || undefined;
    const tenantHeader = request.headers.get('x-tenant-id') || undefined;

    // Direct tenant ID lookup
    if (tenantId) {
      const tenant = await getTenant(tenantId);
      if (!tenant) {
        return NextResponse.json(
          { error: 'Tenant not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        tenant,
        resolvedBy: 'id',
        customDomain: false,
      });
    }

    // Resolve tenant via multiple methods
    const resolution = await resolveTenant(domain, slug, tenantHeader);

    return NextResponse.json(resolution);
  } catch (error) {
    console.error('[Tenant Resolution API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to resolve tenant' },
      { status: 500 }
    );
  }
}
