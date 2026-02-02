/**
 * Part 10 - Section 51: Integration Marketplace
 * Types for third-party app integrations and marketplace
 */

import type { Timestamp } from 'firebase/firestore';

export interface Integration {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  category: IntegrationCategory;
  provider: string;
  logoUrl: string;
  bannerUrl?: string;
  version: string;
  status: 'active' | 'beta' | 'deprecated';
  features: string[];
  pricing: 'free' | 'freemium' | 'paid';
  authType: 'oauth2' | 'api_key' | 'webhook' | 'custom';
  authConfig: OAuthConfig | APIKeyConfig | WebhookConfig;
  permissions: IntegrationPermission[];
  settingsSchema: IntegrationSettingsSchema;
  webhookEvents?: string[];
  documentationUrl?: string;
  supportEmail?: string;
  installCount: number;
  rating?: number;
  reviewCount?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type IntegrationCategory =
  | 'crm'
  | 'email'
  | 'payment'
  | 'analytics'
  | 'social'
  | 'productivity'
  | 'accounting'
  | 'communication'
  | 'automation'
  | 'other';

export interface OAuthConfig {
  type: 'oauth2';
  authorizationUrl: string;
  tokenUrl: string;
  scopes: string[];
  clientIdConfigKey: string;
  clientSecretConfigKey: string;
}

export interface APIKeyConfig {
  type: 'api_key';
  headerName: string;
  prefix?: string;
}

export interface WebhookConfig {
  type: 'webhook';
  signatureHeader: string;
  signatureAlgorithm: 'hmac-sha256' | 'hmac-sha1';
}

export interface IntegrationPermission {
  id: string;
  name: string;
  description: string;
  scope: string;
  required: boolean;
}

export interface IntegrationSettingsSchema {
  fields: SettingsField[];
}

export interface SettingsField {
  key: string;
  label: string;
  type: 'text' | 'password' | 'number' | 'boolean' | 'select' | 'multiselect';
  required: boolean;
  default?: any;
  options?: { value: string; label: string }[];
  helpText?: string;
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
  };
}

export interface InstalledIntegration {
  id: string;
  integrationId: string;
  integrationSlug: string;
  organizationId: string;
  userId: string;
  status: 'pending' | 'active' | 'paused' | 'error' | 'uninstalled';
  settings: Record<string, any>;
  credentials?: {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Timestamp;
    apiKey?: string;
  };
  permissions: string[];
  lastSyncAt?: Timestamp;
  lastErrorAt?: Timestamp;
  lastError?: string;
  installedAt: Timestamp;
  updatedAt: Timestamp;
}

export interface IntegrationLog {
  id: string;
  installedIntegrationId: string;
  type: 'sync' | 'webhook' | 'api_call' | 'error';
  action: string;
  status: 'success' | 'failure';
  request?: {
    method: string;
    url: string;
    headers?: Record<string, string>;
    body?: any;
  };
  response?: {
    status: number;
    headers?: Record<string, string>;
    body?: any;
  };
  error?: string;
  duration?: number;
  metadata?: Record<string, any>;
  createdAt: Timestamp;
}

export interface IntegrationReview {
  id: string;
  integrationId: string;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  isVerified: boolean;
  helpfulCount: number;
  createdAt: Timestamp;
}
