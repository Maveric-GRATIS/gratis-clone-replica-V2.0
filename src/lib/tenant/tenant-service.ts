// src/lib/tenant/tenant-service.ts
// GRATIS.NGO — Multi-Tenant Service

import type { Tenant, TenantResolution, TenantBranding, TenantFeatures, TenantLimits } from '@/types/tenant';

// Mock tenant data (in production, fetch from Firestore)
const mockTenants: Map<string, Tenant> = new Map();

// Default platform tenant
const PLATFORM_TENANT: Tenant = {
  id: 'platform',
  name: 'GRATIS.NGO',
  domain: 'gratis.ngo',
  slug: 'platform',
  type: 'platform',
  status: 'active',
  branding: {
    displayName: 'GRATIS.NGO',
    tagline: 'Maak impact, samen sterker',
    primaryColor: '#10b981',
    secondaryColor: '#059669',
    accentColor: '#f59e0b',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  features: {
    donations: true,
    projects: true,
    events: true,
    impactTV: true,
    partnerships: true,
    customDomain: true,
    whiteLabel: true,
    apiAccess: true,
    webhooks: true,
    analytics: true,
    exportData: true,
    stripeConnect: true,
    recurringDonations: true,
    multiCurrency: true,
    customPages: true,
    blog: true,
    newsletter: true,
  },
  limits: {
    maxUsers: 999999,
    maxProjects: 999999,
    maxEvents: 999999,
    maxStorageGB: 999999,
    maxApiCallsPerDay: 999999,
    maxWebhooks: 100,
  },
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date(),
};

// Initialize with platform tenant
mockTenants.set('platform', PLATFORM_TENANT);
mockTenants.set('gratis.ngo', PLATFORM_TENANT);

/**
 * Resolve tenant from request (domain, slug, or header)
 */
export async function resolveTenant(
  domain?: string,
  slug?: string,
  tenantHeader?: string
): Promise<TenantResolution> {
  // 1. Try tenant header (for API calls with X-Tenant-ID)
  if (tenantHeader) {
    const tenant = mockTenants.get(tenantHeader);
    if (tenant) {
      return {
        tenant,
        resolvedBy: 'header',
        customDomain: false,
      };
    }
  }

  // 2. Try domain lookup
  if (domain) {
    const tenant = mockTenants.get(domain) || await lookupByDomain(domain);
    if (tenant) {
      return {
        tenant,
        resolvedBy: 'domain',
        customDomain: domain !== 'gratis.ngo' && !domain.endsWith('.gratis.ngo'),
      };
    }
  }

  // 3. Try slug lookup
  if (slug) {
    const tenant = await getTenantBySlug(slug);
    if (tenant) {
      return {
        tenant,
        resolvedBy: 'slug',
        customDomain: false,
      };
    }
  }

  // 4. Default to platform tenant
  return {
    tenant: PLATFORM_TENANT,
    resolvedBy: 'default',
    customDomain: false,
  };
}

/**
 * Get tenant by ID
 */
export async function getTenant(tenantId: string): Promise<Tenant | null> {
  // In production: fetch from Firestore
  return mockTenants.get(tenantId) || null;
}

/**
 * Get tenant by slug
 */
export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  // In production: query Firestore where slug == slug
  for (const tenant of mockTenants.values()) {
    if (tenant.slug === slug) {
      return tenant;
    }
  }
  return null;
}

/**
 * Lookup tenant by custom domain
 */
async function lookupByDomain(domain: string): Promise<Tenant | null> {
  // In production: query Firestore where domain == domain
  for (const tenant of mockTenants.values()) {
    if (tenant.domain === domain) {
      return tenant;
    }
  }
  return null;
}

/**
 * Create a new tenant
 */
export async function createTenant(data: {
  name: string;
  slug: string;
  domain: string;
  type: 'partner' | 'whitelabel';
  ownerId: string;
  partnerId?: string;
  branding: TenantBranding;
  plan?: 'free' | 'starter' | 'pro' | 'enterprise';
}): Promise<Tenant> {
  const tenant: Tenant = {
    id: `tenant_${Date.now()}`,
    name: data.name,
    domain: data.domain,
    slug: data.slug,
    type: data.type,
    status: 'trial',
    branding: data.branding,
    features: getDefaultFeatures(data.plan || 'free'),
    limits: getDefaultLimits(data.plan || 'free'),
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: data.ownerId,
    partnerId: data.partnerId,
    plan: data.plan || 'free',
  };

  // In production: save to Firestore
  mockTenants.set(tenant.id, tenant);
  mockTenants.set(tenant.domain, tenant);

  console.log('[Tenant Service] Created tenant:', tenant.id);
  return tenant;
}

/**
 * Update tenant
 */
export async function updateTenant(
  tenantId: string,
  updates: Partial<Omit<Tenant, 'id' | 'createdAt'>>
): Promise<Tenant | null> {
  const tenant = mockTenants.get(tenantId);
  if (!tenant) return null;

  const updated: Tenant = {
    ...tenant,
    ...updates,
    updatedAt: new Date(),
  };

  mockTenants.set(tenantId, updated);
  console.log('[Tenant Service] Updated tenant:', tenantId);
  return updated;
}

/**
 * Check if feature is enabled for tenant
 */
export function hasFeature(tenant: Tenant, feature: keyof TenantFeatures): boolean {
  return tenant.features[feature] === true;
}

/**
 * Check if tenant is within limits
 */
export function checkLimit(
  tenant: Tenant,
  limit: keyof TenantLimits,
  currentValue: number
): { allowed: boolean; limit: number; current: number } {
  const limitValue = tenant.limits[limit];
  return {
    allowed: currentValue < limitValue,
    limit: limitValue,
    current: currentValue,
  };
}

/**
 * Get default features based on plan
 */
function getDefaultFeatures(plan: string): TenantFeatures {
  const baseFeatjres: TenantFeatures = {
    donations: true,
    projects: true,
    events: true,
    impactTV: false,
    partnerships: false,
    customDomain: false,
    whiteLabel: false,
    apiAccess: false,
    webhooks: false,
    analytics: false,
    exportData: false,
    stripeConnect: false,
    recurringDonations: false,
    multiCurrency: false,
    customPages: false,
    blog: false,
    newsletter: false,
  };

  if (plan === 'starter') {
    return {
      ...baseFeatjres,
      impactTV: true,
      analytics: true,
      exportData: true,
      blog: true,
    };
  }

  if (plan === 'pro') {
    return {
      ...baseFeatjres,
      impactTV: true,
      partnerships: true,
      customDomain: true,
      apiAccess: true,
      webhooks: true,
      analytics: true,
      exportData: true,
      stripeConnect: true,
      recurringDonations: true,
      multiCurrency: true,
      customPages: true,
      blog: true,
      newsletter: true,
    };
  }

  if (plan === 'enterprise') {
    return {
      donations: true,
      projects: true,
      events: true,
      impactTV: true,
      partnerships: true,
      customDomain: true,
      whiteLabel: true,
      apiAccess: true,
      webhooks: true,
      analytics: true,
      exportData: true,
      stripeConnect: true,
      recurringDonations: true,
      multiCurrency: true,
      customPages: true,
      blog: true,
      newsletter: true,
    };
  }

  return baseFeatjres;
}

/**
 * Get default limits based on plan
 */
function getDefaultLimits(plan: string): TenantLimits {
  const limits: Record<string, TenantLimits> = {
    free: {
      maxUsers: 5,
      maxProjects: 10,
      maxEvents: 10,
      maxStorageGB: 1,
      maxApiCallsPerDay: 100,
      maxWebhooks: 1,
    },
    starter: {
      maxUsers: 20,
      maxProjects: 50,
      maxEvents: 50,
      maxStorageGB: 10,
      maxApiCallsPerDay: 1000,
      maxWebhooks: 5,
    },
    pro: {
      maxUsers: 100,
      maxProjects: 200,
      maxEvents: 200,
      maxStorageGB: 50,
      maxApiCallsPerDay: 10000,
      maxWebhooks: 20,
    },
    enterprise: {
      maxUsers: 999999,
      maxProjects: 999999,
      maxEvents: 999999,
      maxStorageGB: 999999,
      maxApiCallsPerDay: 999999,
      maxWebhooks: 100,
    },
  };

  return limits[plan] || limits.free;
}

/**
 * Add example partner tenants for testing
 */
export function seedExampleTenants() {
  const redCross: Tenant = {
    id: 'tenant_redcross',
    name: 'Red Cross Netherlands',
    domain: 'redcross.gratis.ngo',
    slug: 'redcross',
    type: 'partner',
    status: 'active',
    branding: {
      displayName: 'Rode Kruis',
      tagline: 'Altijd in de buurt, overal ter wereld',
      primaryColor: '#E30613',
      secondaryColor: '#A00000',
      logo: '/partners/redcross-logo.svg',
    },
    features: getDefaultFeatures('pro'),
    limits: getDefaultLimits('pro'),
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date(),
    plan: 'pro',
  };

  mockTenants.set(redCross.id, redCross);
  mockTenants.set(redCross.domain, redCross);

  console.log('[Tenant Service] Seeded example tenants');
}

// Seed on module load (for testing)
if (process.env.NODE_ENV === 'development') {
  seedExampleTenants();
}
