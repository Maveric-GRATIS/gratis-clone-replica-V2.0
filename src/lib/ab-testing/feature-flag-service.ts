// src/lib/ab-testing/feature-flag-service.ts
// Feature flag evaluation engine

import type { FeatureFlag, FeatureFlagRule } from '@/types/ab-testing';
import { db } from '@/firebase';
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

// In-memory cache for feature flags
let flagCache: Map<string, FeatureFlag> = new Map();
let cacheTimestamp = 0;
const CACHE_TTL = 60_000; // 1 minute

export class FeatureFlagService {
  /**
   * Evaluate a feature flag for a specific user context
   */
  static async isEnabled(
    flagKey: string,
    context: {
      userId?: string;
      email?: string;
      role?: string;
      plan?: string;
      country?: string;
      attributes?: Record<string, string | number | boolean>;
    } = {}
  ): Promise<boolean> {
    const flag = await this.getFlag(flagKey);
    if (!flag || flag.status !== 'active') return false;
    if (!flag.enabled) return flag.defaultValue;

    // Evaluate rules in order, first match wins
    for (const rule of flag.rules) {
      if (!rule.enabled) continue;
      const result = this.evaluateRule(rule, context);
      if (result !== null) return result;
    }

    return flag.defaultValue;
  }

  /**
   * Get all flags for a user context (bulk evaluation)
   */
  static async getAllFlags(
    context: {
      userId?: string;
      email?: string;
      role?: string;
      plan?: string;
      country?: string;
      attributes?: Record<string, string | number | boolean>;
    } = {}
  ): Promise<Record<string, boolean>> {
    await this.refreshCache();
    const results: Record<string, boolean> = {};

    for (const [key, flag] of flagCache) {
      if (flag.status !== 'active') continue;
      results[key] = await this.isEnabled(key, context);
    }

    return results;
  }

  /**
   * Get a single flag definition
   */
  static async getFlag(flagKey: string): Promise<FeatureFlag | null> {
    await this.refreshCache();
    return flagCache.get(flagKey) || null;
  }

  /**
   * Create or update a feature flag
   */
  static async upsertFlag(
    flag: Omit<FeatureFlag, 'createdAt' | 'updatedAt'>
  ): Promise<void> {
    const ref = doc(db, 'feature_flags', flag.id);
    const existing = await getDoc(ref);

    if (existing.exists()) {
      await updateDoc(ref, {
        ...flag,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(ref, {
        ...flag,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    // Invalidate cache
    cacheTimestamp = 0;
  }

  /**
   * Toggle a flag on/off
   */
  static async toggleFlag(flagId: string, enabled: boolean): Promise<void> {
    await updateDoc(doc(db, 'feature_flags', flagId), {
      enabled,
      updatedAt: serverTimestamp(),
    });
    cacheTimestamp = 0;
  }

  // -- Private helpers --

  private static evaluateRule(
    rule: FeatureFlagRule,
    context: Record<string, unknown>
  ): boolean | null {
    switch (rule.type) {
      case 'percentage':
        return this.evaluatePercentage(rule, context);
      case 'userIds':
        return this.evaluateUserIds(rule, context);
      case 'userAttribute':
        return this.evaluateAttribute(rule, context);
      case 'environment':
        return this.evaluateEnvironment(rule);
      default:
        return null;
    }
  }

  private static evaluatePercentage(
    rule: FeatureFlagRule,
    context: Record<string, unknown>
  ): boolean | null {
    const userId = (context.userId as string) || 'anonymous';
    const hash = this.hashString(`${rule.id}:${userId}`);
    const percentage = hash % 100;
    return percentage < (rule.percentage || 0);
  }

  private static evaluateUserIds(
    rule: FeatureFlagRule,
    context: Record<string, unknown>
  ): boolean | null {
    const userId = context.userId as string;
    if (!userId) return null;
    const allowedIds = Array.isArray(rule.value) ? rule.value : [rule.value];
    return allowedIds.includes(userId) ? true : null;
  }

  private static evaluateAttribute(
    rule: FeatureFlagRule,
    context: Record<string, unknown>
  ): boolean | null {
    const attr = rule.attribute;
    if (!attr) return null;

    const value = context[attr] ?? context.attributes?.[attr as keyof typeof context.attributes];
    if (value === undefined) return null;

    switch (rule.operator) {
      case 'equals':
        return value === rule.value ? true : null;
      case 'contains':
        return typeof value === 'string' && value.includes(String(rule.value))
          ? true
          : null;
      case 'in':
        return Array.isArray(rule.value) && rule.value.includes(String(value))
          ? true
          : null;
      case 'greaterThan':
        return typeof value === 'number' && value > Number(rule.value)
          ? true
          : null;
      case 'lessThan':
        return typeof value === 'number' && value < Number(rule.value)
          ? true
          : null;
      default:
        return null;
    }
  }

  private static evaluateEnvironment(rule: FeatureFlagRule): boolean | null {
    const env = import.meta.env.MODE || 'development';
    return env === rule.value ? true : null;
  }

  private static hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // 32-bit int
    }
    return Math.abs(hash);
  }

  private static async refreshCache(): Promise<void> {
    if (Date.now() - cacheTimestamp < CACHE_TTL) return;

    try {
      const snap = await getDocs(
        query(collection(db, 'feature_flags'), where('status', '!=', 'archived'))
      );

      const newCache = new Map<string, FeatureFlag>();
      snap.forEach((d) => {
        const data = d.data() as FeatureFlag;
        newCache.set(data.key, { ...data, id: d.id });
      });

      flagCache = newCache;
      cacheTimestamp = Date.now();
    } catch (error) {
      console.error('Failed to refresh feature flag cache:', error);
    }
  }
}
