// src/lib/config/platform-config-service.ts
// Platform configuration management with caching and audit logging

import type { PlatformConfig } from '@/types/platform-config';
import { db } from '@/firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  getDocs,
} from 'firebase/firestore';

export interface ConfigChangeLog {
  id?: string;
  section: string;
  field?: string;
  oldValue?: any;
  newValue?: any;
  changes?: Record<string, any>;
  changedBy: string;
  changedAt?: string;
  timestamp?: string;
  reason?: string;
}

const CONFIG_DOC = 'platform_config/current';
let cachedConfig: PlatformConfig | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60_000; // 1 minute

const DEFAULT_CONFIG: Partial<PlatformConfig> = {
  id: 'default',
  environment: 'production',
  siteName: ' GRATIS.NGO',
  siteUrl: 'https://gratis.ngo',
  supportEmail: 'support@gratis.ngo',
  maintenanceMode: false,
  features: {
    videoUpload: true,
    liveStreaming: false,
    subscriptions: true,
    donations: true,
    marketplace: true,
    messaging: true,
    apiAccess: false,
  },
  limits: {
    maxVideoSize: 500,
    maxVideoDuration: 3600,
    maxVideosPerMonth: {
      free: 5,
      basic: 20,
      pro: 100,
      enterprise: 999,
    },
    maxStoragePerUser: 10,
    apiRateLimit: 100,
  },
  security: {
    sessionTimeout: 60,
    passwordMinLength: 8,
    requireEmailVerification: true,
    require2FA: false,
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'pdf'],
    maxLoginAttempts: 5,
  },
  email: {
    provider: 'sendgrid' as const,
    fromAddress: 'hello@gratis.ngo',
    fromName: 'GRATIS.NGO',
    replyTo: 'support@gratis.ngo',
  },
};

export class PlatformConfigService {
  /**
   * Get the full platform configuration
   */
  static async getConfig(): Promise<PlatformConfig> {
    if (cachedConfig && Date.now() - cacheTimestamp < CACHE_TTL) {
      return cachedConfig;
    }

    try {
      const docRef = doc(db, 'platform_config', 'current');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        cachedConfig = docSnap.data() as PlatformConfig;
      } else {
        // Initialize with defaults
        await setDoc(docRef, DEFAULT_CONFIG);
        cachedConfig = DEFAULT_CONFIG as PlatformConfig;
      }
      cacheTimestamp = Date.now();
      return cachedConfig;
    } catch (error) {
      console.error('Failed to load platform config:', error);
      return DEFAULT_CONFIG as PlatformConfig;
    }
  }

  /**
   * Get a specific config section
   */
  static async getSection<K extends keyof PlatformConfig>(
    section: K
  ): Promise<PlatformConfig[K]> {
    const config = await this.getConfig();
    return config[section];
  }

  /**
   * Update a config section
   */
  static async updateSection<K extends keyof PlatformConfig>(
    section: K,
    updates: Partial<PlatformConfig[K]>,
    userId: string,
    reason?: string
  ): Promise<void> {
    const currentConfig = await this.getConfig();
    const currentSection = currentConfig[section];

    // Log individual field changes
    const changeLogs: Omit<ConfigChangeLog, 'id'>[] = [];
    for (const [key, newValue] of Object.entries(updates)) {
      const oldValue = (currentSection as Record<string, unknown>)[key];
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changeLogs.push({
          section,
          field: key,
          oldValue,
          newValue,
          changedBy: userId,
          changedAt: new Date().toISOString(),
          reason,
        });
      }
    }

    // Apply updates
    const currentSectionObj = currentSection as Record<string, any>;
    const updatedSection = { ...currentSectionObj, ...updates };
    const docRef = doc(db, 'platform_config', 'current');
    await updateDoc(docRef, {
      [section]: updatedSection,
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
    });

    // Store change logs
    for (const log of changeLogs) {
      await addDoc(collection(db, 'config_change_logs'), log);
    }

    // Invalidate cache
    cachedConfig = null;
    cacheTimestamp = 0;
  }

  /**
   * Check if a feature is enabled
   */
  static async isFeatureEnabled(
    feature: keyof PlatformConfig['features']
  ): Promise<boolean> {
    const config = await this.getConfig();
    return config.features[feature] ?? false;
  }

  /**
   * Check if maintenance mode is active
   */
  static async isMaintenanceMode(ipAddress?: string): Promise<boolean> {
    const config = await this.getConfig();
    return config.maintenanceMode;
  }

  /**
   * Get configuration change history
   */
  static async getChangeHistory(
    section?: keyof PlatformConfig,
    limitCount = 50
  ): Promise<ConfigChangeLog[]> {
    let q: any = query(
      collection(db, 'config_change_logs'),
      orderBy('changedAt', 'desc'),
      firestoreLimit(limitCount)
    );

    if (section) {
      q = query(
        collection(db, 'config_change_logs'),
        where('section', '==', section),
        orderBy('changedAt', 'desc'),
        firestoreLimit(limitCount)
      );
    }

    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) } as ConfigChangeLog));
  }

  /**
   * Reset a section to defaults
   */
  static async resetSection<K extends keyof PlatformConfig>(
    section: K,
    userId: string
  ): Promise<void> {
    await this.updateSection(
      section,
      DEFAULT_CONFIG[section],
      userId,
      'Reset to defaults'
    );
  }

  /**
   * Get default config (for reference)
   */
  static getDefaultConfig(): PlatformConfig {
    return { ...DEFAULT_CONFIG } as PlatformConfig;
  }

  /**
   * Clear cache (force refresh on next get)
   */
  static clearCache(): void {
    cachedConfig = null;
    cacheTimestamp = 0;
  }
}

// Export singleton instance for convenience
export const platformConfigService = {
  getConfig: () => PlatformConfigService.getConfig(),
  getSection: <K extends keyof PlatformConfig>(section: K) =>
    PlatformConfigService.getSection(section),
  updateSection: <K extends keyof PlatformConfig>(
    section: K,
    updates: Partial<PlatformConfig[K]>,
    userId: string,
    reason?: string
  ) => PlatformConfigService.updateSection(section, updates, userId, reason),
  isFeatureEnabled: (feature: keyof PlatformConfig['features']) =>
    PlatformConfigService.isFeatureEnabled(feature),
  isMaintenanceMode: (ipAddress?: string) =>
    PlatformConfigService.isMaintenanceMode(ipAddress),
  resetSection: <K extends keyof PlatformConfig>(section: K, userId: string) =>
    PlatformConfigService.resetSection(section, userId),
  clearCache: () => PlatformConfigService.clearCache(),
};
