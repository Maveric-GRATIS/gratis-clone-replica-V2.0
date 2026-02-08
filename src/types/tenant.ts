// src/types/tenant.ts
// GRATIS.NGO — Multi-Tenant & White-Label Types

export interface Tenant {
  id: string;
  name: string;
  domain: string; // e.g., 'redcross.gratis.ngo' or 'custom-domain.org'
  slug: string; // URL-safe identifier
  type: 'platform' | 'partner' | 'whitelabel';
  status: 'active' | 'suspended' | 'trial' | 'archived';

  // Branding
  branding: TenantBranding;

  // Configuration
  features: TenantFeatures;
  limits: TenantLimits;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  ownerId?: string;
  partnerId?: string;

  // Billing
  plan?: 'free' | 'starter' | 'pro' | 'enterprise';
  subscriptionEndsAt?: Date;
}

export interface TenantBranding {
  // Visual Identity
  logo?: string; // URL to logo
  favicon?: string;
  primaryColor: string; // Hex color
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;

  // Text
  displayName: string;
  tagline?: string;
  description?: string;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;

  // Custom CSS
  customCss?: string;
}

export interface TenantFeatures {
  // Core Features
  donations: boolean;
  projects: boolean;
  events: boolean;
  impactTV: boolean;
  partnerships: boolean;

  // Advanced Features
  customDomain: boolean;
  whiteLabel: boolean;
  apiAccess: boolean;
  webhooks: boolean;
  analytics: boolean;
  exportData: boolean;

  // Payment Features
  stripeConnect: boolean;
  recurringDonations: boolean;
  multiCurrency: boolean;

  // Content
  customPages: boolean;
  blog: boolean;
  newsletter: boolean;
}

export interface TenantLimits {
  maxUsers: number;
  maxProjects: number;
  maxEvents: number;
  maxStorageGB: number;
  maxApiCallsPerDay: number;
  maxWebhooks: number;
}

export interface TenantConfig {
  // Multi-language
  supportedLanguages: string[]; // ['nl', 'en', 'fr']
  defaultLanguage: string;

  // Contact
  contactEmail?: string;
  supportEmail?: string;
  phone?: string;
  address?: string;

  // Social
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };

  // Legal
  termsUrl?: string;
  privacyUrl?: string;

  // Integrations
  googleAnalyticsId?: string;
  facebookPixelId?: string;
}

export interface TenantResolution {
  tenant: Tenant;
  resolvedBy: 'domain' | 'slug' | 'header' | 'default';
  customDomain: boolean;
}

export type TenantStatus = 'active' | 'suspended' | 'trial' | 'archived';
export type TenantType = 'platform' | 'partner' | 'whitelabel';
