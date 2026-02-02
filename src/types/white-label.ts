/**
 * Part 10 - Section 52: White-label Solution
 * Types for white-label platform configuration and customization
 */

import type { Timestamp } from 'firebase/firestore';

export interface WhiteLabelConfig {
  id: string;
  organizationId: string;
  subdomain: string;
  customDomain?: string;
  customDomainVerified?: boolean;
  branding: BrandingConfig;
  features: FeatureConfig;
  integrations: IntegrationConfig;
  localization: LocalizationConfig;
  legal: LegalConfig;
  analytics: AnalyticsConfig;
  status: 'active' | 'pending' | 'suspended';
  plan: 'starter' | 'professional' | 'enterprise';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface BrandingConfig {
  organizationName: string;
  tagline?: string;
  logoUrl: string;
  logoUrlDark?: string;
  faviconUrl: string;
  colors: {
    primary: string;
    primaryHover: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  typography: {
    fontFamily: string;
    headingFontFamily?: string;
    baseFontSize: number;
  };
  borderRadius: 'none' | 'small' | 'medium' | 'large' | 'full';
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  customCss?: string;
}

export interface FeatureConfig {
  donations: {
    enabled: boolean;
    minimumAmount: number;
    suggestedAmounts: number[];
    allowRecurring: boolean;
    allowAnonymous: boolean;
    showImpactCalculator: boolean;
  };
  shop: {
    enabled: boolean;
    showPrices: boolean;
    allowPreorders: boolean;
  };
  events: {
    enabled: boolean;
    allowRegistration: boolean;
    showPastEvents: boolean;
  };
  community: {
    enabled: boolean;
    showLeaderboard: boolean;
    showSocialFeed: boolean;
  };
  gamification: {
    enabled: boolean;
    showBadges: boolean;
    showLevels: boolean;
    showStreaks: boolean;
  };
  referrals: {
    enabled: boolean;
    rewardType: 'none' | 'badge' | 'discount' | 'donation_match';
    rewardValue?: number;
  };
  volunteer: {
    enabled: boolean;
    requireApplication: boolean;
  };
}

export interface IntegrationConfig {
  payments: {
    stripeAccountId?: string;
    paypalMerchantId?: string;
    enabledMethods: string[];
  };
  email: {
    provider: 'default' | 'custom';
    fromEmail?: string;
    fromName?: string;
    replyToEmail?: string;
  };
  analytics: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
    customTrackingCode?: string;
  };
  social: {
    facebookAppId?: string;
    twitterHandle?: string;
  };
}

export interface LocalizationConfig {
  defaultLanguage: string;
  supportedLanguages: string[];
  defaultCurrency: string;
  supportedCurrencies: string[];
  dateFormat: string;
  timezone: string;
  translations: Record<string, Record<string, string>>;
}

export interface LegalConfig {
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
  cookiePolicyUrl?: string;
  imprintUrl?: string;
  dataProcessorAgreement?: boolean;
  gdprCompliant: boolean;
  cookieConsentEnabled: boolean;
  taxExemptNumber?: string;
  registrationNumber?: string;
}

export interface AnalyticsConfig {
  trackingEnabled: boolean;
  shareDataWithPlatform: boolean;
  customEvents: string[];
}

export interface WhiteLabelOrganization {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  taxId?: string;
  type: 'nonprofit' | 'charity' | 'foundation' | 'other';
  cause: string;
  description: string;
  websiteUrl?: string;
  socialProof?: {
    foundedYear?: number;
    teamSize?: number;
    donorsCount?: number;
    totalRaised?: number;
  };
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verificationDocuments?: string[];
  createdAt: Timestamp;
}
