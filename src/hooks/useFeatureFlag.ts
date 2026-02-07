// src/hooks/useFeatureFlag.ts
// React hooks for feature flags and A/B tests

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { FeatureFlagService } from '@/lib/ab-testing/feature-flag-service';
import { ExperimentService } from '@/lib/ab-testing/experiment-service';
import type { ExperimentVariant } from '@/types/experiments';

/**
 * Check if a feature flag is enabled
 */
export function useFeatureFlag(flagKey: string): {
  enabled: boolean;
  loading: boolean;
} {
  const { user } = useAuth();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function evaluate() {
      try {
        const result = await FeatureFlagService.isEnabled(flagKey, {
          userId: user?.uid,
          email: user?.email || undefined,
          role: (user as any)?.role,
          plan: (user as any)?.subscriptionTier,
        });
        if (mounted) setEnabled(result);
      } catch (error) {
        console.error(`Feature flag evaluation failed for "${flagKey}":`, error);
        if (mounted) setEnabled(false);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    evaluate();
    return () => { mounted = false; };
  }, [flagKey, user?.uid, user?.email]);

  return { enabled, loading };
}

/**
 * Get assigned variant for an A/B experiment
 */
export function useExperiment(experimentKey: string): {
  variant: ExperimentVariant | null;
  loading: boolean;
  trackConversion: (eventName: string, value?: number, metadata?: Record<string, unknown>) => Promise<void>;
} {
  const { user } = useAuth();
  const [variant, setVariant] = useState<ExperimentVariant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadVariant() {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        const result = await ExperimentService.getVariant(
          experimentKey,
          user.uid,
          {
            role: (user as any)?.role,
            plan: (user as any)?.subscriptionTier,
            country: (user as any)?.country,
          }
        );
        if (mounted) setVariant(result);
      } catch (error) {
        console.error(`Experiment "${experimentKey}" assignment failed:`, error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadVariant();
    return () => { mounted = false; };
  }, [experimentKey, user?.uid]);

  const trackConversion = useCallback(
    async (eventName: string, value?: number, metadata?: Record<string, unknown>) => {
      if (!user?.uid || !variant) return;
      await ExperimentService.trackConversion(
        experimentKey,
        user.uid,
        eventName,
        value,
        metadata
      );
    },
    [experimentKey, user?.uid, variant]
  );

  return { variant, loading, trackConversion };
}
