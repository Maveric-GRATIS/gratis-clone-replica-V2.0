// src/lib/ab-testing/experiment-service.ts
// A/B Testing Experiment Service

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
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import type { Experiment, ExperimentVariant, ExperimentAssignment } from '@/types/experiments';

// In-memory cache for experiment assignments
const assignments = new Map<string, string>();
const experiments = new Map<string, Experiment>();
let experimentsTimestamp = 0;
const CACHE_TTL = 60_000; // 1 minute

export class ExperimentService {
  /**
   * Get variant assignment for a user
   */
  static async getVariant(
    experimentKey: string,
    userId: string,
    context: {
      role?: string;
      plan?: string;
      country?: string;
      attributes?: Record<string, string | number | boolean>;
    } = {}
  ): Promise<ExperimentVariant | null> {
    // Check cache first
    const cacheKey = `${experimentKey}:${userId}`;
    const cachedVariantId = assignments.get(cacheKey);

    const experiment = await this.getExperiment(experimentKey);
    if (!experiment || experiment.status !== 'running') return null;

    // Return cached assignment if exists
    if (cachedVariantId) {
      const variant = experiment.variants.find((v) => v.id === cachedVariantId);
      if (variant) return variant;
    }

    // Check for existing assignment in Firestore
    const assignmentRef = doc(db, 'experiment_assignments', `${experimentKey}_${userId}`);
    const assignmentDoc = await getDoc(assignmentRef);

    if (assignmentDoc.exists()) {
      const data = assignmentDoc.data() as ExperimentAssignment;
      const variant = experiment.variants.find((v) => v.id === data.variantId);
      if (variant) {
        assignments.set(cacheKey, variant.id);
        return variant;
      }
    }

    // Check if user matches target audience
    if (experiment.targetAudience) {
      if (!this.matchesAudience(context, experiment.targetAudience)) {
        return null;
      }
    }

    // New assignment - select variant based on weights
    const variant = this.selectVariant(experiment.variants, userId);

    // Save assignment
    await setDoc(assignmentRef, {
      experimentId: experiment.id,
      experimentKey,
      variantId: variant.id,
      userId,
      assignedAt: serverTimestamp(),
      context,
    });

    // Track exposure
    await this.trackEvent({
      experimentId: experiment.id,
      experimentKey,
      variantId: variant.id,
      userId,
      sessionId: this.getSessionId(),
      eventType: 'exposure',
      timestamp: new Date().toISOString(),
    });

    // Update counters
    await updateDoc(doc(db, 'experiments', experiment.id), {
      [`variantCounts.${variant.id}`]: increment(1),
    });

    assignments.set(cacheKey, variant.id);
    return variant;
  }

  /**
   * Track a conversion event for an experiment
   */
  static async trackConversion(
    experimentKey: string,
    userId: string,
    eventName: string,
    value?: number,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    const cacheKey = `${experimentKey}:${userId}`;
    const variantId = assignments.get(cacheKey);
    if (!variantId) {
      // If not in cache, try to get from Firestore
      const assignmentRef = doc(db, 'experiment_assignments', `${experimentKey}_${userId}`);
      const assignmentDoc = await getDoc(assignmentRef);
      if (!assignmentDoc.exists()) return;
      const assignment = assignmentDoc.data() as ExperimentAssignment;
      assignments.set(cacheKey, assignment.variantId);
    }

    const experiment = await this.getExperiment(experimentKey);
    if (!experiment) return;

    const finalVariantId = assignments.get(cacheKey);
    if (!finalVariantId) return;

    await this.trackEvent({
      experimentId: experiment.id,
      experimentKey,
      variantId: finalVariantId,
      userId,
      sessionId: this.getSessionId(),
      eventType: value !== undefined ? 'revenue' : 'conversion',
      eventName,
      value,
      metadata,
      timestamp: new Date().toISOString(),
    });

    // Update conversion counter
    await updateDoc(doc(db, 'experiments', experiment.id), {
      [`conversionCounts.${finalVariantId}`]: increment(1),
      ...(value !== undefined
        ? { [`revenueSums.${finalVariantId}`]: increment(value) }
        : {}),
    });
  }

  /**
   * Get experiment definition
   */
  static async getExperiment(experimentKey: string): Promise<Experiment | null> {
    // Refresh cache if needed
    await this.refreshExperiments();

    return experiments.get(experimentKey) || null;
  }

  /**
   * Get all active experiments
   */
  static async getActiveExperiments(): Promise<Experiment[]> {
    await this.refreshExperiments();
    return Array.from(experiments.values()).filter((exp) => exp.status === 'running');
  }

  /**
   * Select variant based on weighted random distribution
   */
  private static selectVariant(
    variants: ExperimentVariant[],
    userId: string
  ): ExperimentVariant {
    // Use deterministic hash-based selection for consistent assignment
    const hash = this.hashString(`${userId}`);
    const randomValue = hash % 100;

    let cumulative = 0;
    for (const variant of variants) {
      cumulative += variant.weight;
      if (randomValue < cumulative) {
        return variant;
      }
    }

    // Fallback to control variant
    return variants.find((v) => v.isControl) || variants[0];
  }

  /**
   * Check if user context matches target audience
   */
  private static matchesAudience(
    context: Record<string, any>,
    audience: any
  ): boolean {
    // Simple audience matching - can be extended
    if (audience.roles && context.role) {
      if (!audience.roles.includes(context.role)) return false;
    }

    if (audience.plans && context.plan) {
      if (!audience.plans.includes(context.plan)) return false;
    }

    if (audience.countries && context.country) {
      if (!audience.countries.includes(context.country)) return false;
    }

    return true;
  }

  /**
   * Track experiment event
   */
  private static async trackEvent(event: {
    experimentId: string;
    experimentKey?: string;
    variantId: string;
    userId: string;
    sessionId?: string;
    eventType: 'exposure' | 'conversion' | 'revenue';
    eventName?: string;
    value?: number;
    metadata?: Record<string, unknown>;
    timestamp: string;
  }): Promise<void> {
    try {
      const eventsRef = collection(db, 'experiment_events');
      await setDoc(doc(eventsRef), event);
    } catch (error) {
      console.error('Failed to track experiment event:', error);
    }
  }

  /**
   * Get or create session ID
   */
  private static getSessionId(): string {
    const key = 'exp_session_id';
    let sessionId = sessionStorage.getItem(key);
    if (!sessionId) {
      sessionId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
      sessionStorage.setItem(key, sessionId);
    }
    return sessionId;
  }

  /**
   * Refresh experiments cache
   */
  private static async refreshExperiments(): Promise<void> {
    const now = Date.now();
    if (now - experimentsTimestamp < CACHE_TTL) return;

    try {
      const q = query(
        collection(db, 'experiments'),
        where('status', '==', 'running')
      );
      const snapshot = await getDocs(q);

      experiments.clear();
      snapshot.docs.forEach((doc) => {
        const data = doc.data() as Experiment;
        experiments.set(data.key, { id: doc.id, ...data });
      });

      experimentsTimestamp = now;
    } catch (error) {
      console.error('Failed to refresh experiments cache:', error);
    }
  }

  /**
   * Hash string to number (for deterministic variant selection)
   */
  private static hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
}
