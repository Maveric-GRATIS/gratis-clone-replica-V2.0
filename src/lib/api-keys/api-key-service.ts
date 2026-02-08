// src/lib/api-keys/api-key-service.ts
// API key generation, validation, and management (client-side implementation)

import type {
  APIKey,
  APIKeyCreateRequest,
  APIKeyCreateResponse,
  APIKeyUsageLog,
} from '@/types/api-keys';
import { db } from '@/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
  orderBy,
  limit,
} from 'firebase/firestore';

const KEY_PREFIX_PRODUCTION = 'gratis_pk_';
const KEY_PREFIX_SANDBOX = 'gratis_sk_';
const DEFAULT_RATE_LIMIT = 60; // per minute
const MAX_KEYS_PER_USER = 10;

/**
 * Generate a random string for API keys
 */
function generateRandomKey(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Simple hash function (for demo purposes)
 * In production, use crypto.subtle.digest() or server-side hashing
 */
async function hashKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export class APIKeyService {
  /**
   * Generate a new API key
   */
  static async createKey(
    userId: string,
    params: APIKeyCreateRequest
  ): Promise<APIKeyCreateResponse> {
    // Check key limit
    const keysQuery = query(
      collection(db, 'api_keys'),
      where('userId', '==', userId),
      where('status', '==', 'active')
    );
    const existingKeys = await getDocs(keysQuery);

    if (existingKeys.size >= MAX_KEYS_PER_USER) {
      throw new Error(`Maximum ${MAX_KEYS_PER_USER} active API keys per user`);
    }

    // Generate key
    const prefix =
      params.environment === 'production'
        ? KEY_PREFIX_PRODUCTION
        : KEY_PREFIX_SANDBOX;
    const rawKey = generateRandomKey(32);
    const fullKey = `${prefix}${rawKey}`;
    const keyHash = await hashKey(fullKey);
    const keyPrefix = fullKey.slice(0, prefix.length + 8);

    const expiresAt = params.expiresInDays
      ? new Date(
          Date.now() + params.expiresInDays * 24 * 60 * 60 * 1000
        ).toISOString()
      : undefined;

    const now = new Date().toISOString();
    const apiKey: Omit<APIKey, 'id'> = {
      name: params.name,
      keyPrefix,
      keyHash,
      userId,
      status: 'active',
      environment: params.environment,
      scopes: params.scopes,
      rateLimit: params.rateLimit || DEFAULT_RATE_LIMIT,
      allowedOrigins: params.allowedOrigins || [],
      allowedIPs: params.allowedIPs || [],
      usageCount: 0,
      expiresAt,
      createdAt: now,
      updatedAt: now,
    };

    const ref = await addDoc(collection(db, 'api_keys'), apiKey);

    // Log creation
    await addDoc(collection(db, 'audit_logs'), {
      action: 'api_key_created',
      userId,
      resourceId: ref.id,
      metadata: { name: params.name, environment: params.environment },
      timestamp: now,
    });

    return {
      id: ref.id,
      key: fullKey,
      name: params.name,
      keyPrefix,
      environment: params.environment,
      scopes: params.scopes,
      createdAt: apiKey.createdAt,
    };
  }

  /**
   * Validate an API key (client-side check - limited security)
   */
  static async validateKey(
    key: string
  ): Promise<{ valid: boolean; apiKey?: APIKey; error?: string }> {
    try {
      const keyHash = await hashKey(key);

      const q = query(
        collection(db, 'api_keys'),
        where('keyHash', '==', keyHash),
        where('status', '==', 'active'),
        limit(1)
      );

      const snap = await getDocs(q);

      if (snap.empty) {
        return { valid: false, error: 'Invalid API key' };
      }

      const apiKey = { id: snap.docs[0].id, ...snap.docs[0].data() } as APIKey;

      // Check expiration
      if (apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date()) {
        await updateDoc(doc(db, 'api_keys', apiKey.id), {
          status: 'expired',
          updatedAt: new Date().toISOString(),
        });
        return { valid: false, error: 'API key expired' };
      }

      // Update usage
      await updateDoc(doc(db, 'api_keys', apiKey.id), {
        lastUsedAt: new Date().toISOString(),
        usageCount: apiKey.usageCount + 1,
      });

      return { valid: true, apiKey };
    } catch (error) {
      return { valid: false, error: 'Validation failed' };
    }
  }

  /**
   * Revoke an API key
   */
  static async revokeKey(keyId: string, userId: string): Promise<void> {
    const keyRef = doc(db, 'api_keys', keyId);
    const keyDoc = await getDocs(query(collection(db, 'api_keys'), where('__name__', '==', keyId)));

    if (keyDoc.empty) throw new Error('API key not found');

    const key = keyDoc.docs[0].data() as APIKey;
    if (key.userId !== userId) throw new Error('Not authorized');

    await updateDoc(keyRef, {
      status: 'revoked',
      updatedAt: new Date().toISOString(),
    });

    await addDoc(collection(db, 'audit_logs'), {
      action: 'api_key_revoked',
      userId,
      resourceId: keyId,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * List user's API keys (never returns full key)
   */
  static async listKeys(userId: string): Promise<Omit<APIKey, 'keyHash'>[]> {
    const q = query(
      collection(db, 'api_keys'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const snap = await getDocs(q);

    return snap.docs.map((d) => {
      const data = d.data();
      const { keyHash, ...rest } = data;
      return { id: d.id, ...rest } as Omit<APIKey, 'keyHash'>;
    });
  }

  /**
   * Log API key usage
   */
  static async logUsage(params: Omit<APIKeyUsageLog, 'id'>): Promise<void> {
    await addDoc(collection(db, 'api_key_usage'), {
      ...params,
      createdAt: new Date().toISOString(),
    });
  }

  /**
   * Roll (rotate) an API key — creates new key, revokes old one
   */
  static async rollKey(
    keyId: string,
    userId: string
  ): Promise<APIKeyCreateResponse> {
    const keyDoc = await getDocs(query(collection(db, 'api_keys'), where('__name__', '==', keyId)));

    if (keyDoc.empty) throw new Error('API key not found');

    const oldKey = keyDoc.docs[0].data() as APIKey;
    if (oldKey.userId !== userId) throw new Error('Not authorized');

    // Create new key with same settings
    const newKey = await this.createKey(userId, {
      name: `${oldKey.name} (rotated)`,
      environment: oldKey.environment,
      scopes: oldKey.scopes,
      rateLimit: oldKey.rateLimit,
      allowedOrigins: oldKey.allowedOrigins,
      allowedIPs: oldKey.allowedIPs,
    });

    // Revoke old key
    await updateDoc(doc(db, 'api_keys', keyId), {
      status: 'revoked',
      updatedAt: new Date().toISOString(),
    });

    return newKey;
  }

  /**
   * Generate mock usage statistics
   */
  static generateMockUsageStats(keyId: string): any {
    const stats = {
      keyId,
      period: 'Last 7 days',
      totalRequests: Math.floor(Math.random() * 10000) + 1000,
      successCount: 0,
      errorCount: 0,
      avgResponseTimeMs: Math.floor(Math.random() * 200) + 50,
      topEndpoints: [
        { endpoint: '/api/donations', count: Math.floor(Math.random() * 500) + 100 },
        { endpoint: '/api/projects', count: Math.floor(Math.random() * 400) + 80 },
        { endpoint: '/api/events', count: Math.floor(Math.random() * 300) + 60 },
        { endpoint: '/api/users', count: Math.floor(Math.random() * 200) + 40 },
      ],
      requestsByHour: Array.from({ length: 24 }, (_, hour) => ({
        hour,
        count: Math.floor(Math.random() * 100) + 10,
      })),
    };

    stats.successCount = Math.floor(stats.totalRequests * 0.95);
    stats.errorCount = stats.totalRequests - stats.successCount;

    return stats;
  }
}

// Export singleton instance for convenience
export const apiKeyService = {
  createKey: (userId: string, params: APIKeyCreateRequest) =>
    APIKeyService.createKey(userId, params),
  validateKey: (key: string) => APIKeyService.validateKey(key),
  listKeys: (userId: string) =>
    APIKeyService.listKeys(userId),
  revokeKey: (keyId: string, userId: string) =>
    APIKeyService.revokeKey(keyId, userId),
  rollKey: (keyId: string, userId: string) =>
    APIKeyService.rollKey(keyId, userId),
  logUsage: (params: Omit<APIKeyUsageLog, 'id'>) =>
    APIKeyService.logUsage(params),
  generateMockUsageStats: (keyId: string) =>
    APIKeyService.generateMockUsageStats(keyId),
};
