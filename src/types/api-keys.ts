// src/types/api-keys.ts
// API key management types for the developer portal

export type APIKeyStatus = 'active' | 'revoked' | 'expired';
export type APIKeyScope = 'read' | 'write' | 'admin';
export type APIKeyEnvironment = 'production' | 'sandbox';

export interface APIKey {
  id: string;
  name: string;
  keyPrefix: string; // First 8 chars shown to user (gratis_pk_...)
  keyHash: string; // SHA-256 hash of full key
  userId: string;
  organizationId?: string;
  status: APIKeyStatus;
  environment: APIKeyEnvironment;
  scopes: APIKeyScope[];
  rateLimit: number; // Requests per minute
  allowedOrigins: string[];
  allowedIPs: string[];
  lastUsedAt?: string;
  usageCount: number;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface APIKeyCreateRequest {
  name: string;
  environment: APIKeyEnvironment;
  scopes: APIKeyScope[];
  rateLimit?: number;
  allowedOrigins?: string[];
  allowedIPs?: string[];
  expiresInDays?: number;
}

export interface APIKeyCreateResponse {
  id: string;
  key: string; // Full key, shown only once
  name: string;
  keyPrefix: string;
  environment: APIKeyEnvironment;
  scopes: APIKeyScope[];
  createdAt: string;
}

export interface APIKeyUsageLog {
  id: string;
  keyId: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTimeMs: number;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

export interface APIKeyUsageStats {
  keyId: string;
  period: string;
  totalRequests: number;
  successCount: number;
  errorCount: number;
  avgResponseTimeMs: number;
  topEndpoints: { endpoint: string; count: number }[];
  requestsByHour: { hour: number; count: number }[];
}

export interface DeveloperApp {
  id: string;
  name: string;
  description: string;
  userId: string;
  websiteUrl?: string;
  callbackUrls: string[];
  apiKeys: string[]; // API key IDs
  webhookUrl?: string;
  webhookSecret?: string;
  status: 'active' | 'suspended';
  createdAt: string;
  updatedAt: string;
}
