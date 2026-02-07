// src/hooks/useMFA.ts
// Hook for managing MFA status and operations

import { useState, useEffect } from 'react';
import { MFAService } from '@/lib/auth/mfa-service';
import { useAuth } from '@/hooks/useAuth';
import type { MFAConfig } from '@/types/mfa';

export function useMFA() {
  const { user } = useAuth();
  const [mfaConfig, setMfaConfig] = useState<MFAConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMFAConfig = async () => {
    if (!user) {
      setMfaConfig(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const config = await MFAService.getMFAConfig(user.uid);
      setMfaConfig(config);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load MFA config');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMFAConfig();
  }, [user]);

  const isEnabled = mfaConfig?.status === 'enabled';
  const isPending = mfaConfig?.status === 'pending_setup';

  const refresh = () => {
    loadMFAConfig();
  };

  return {
    mfaConfig,
    isEnabled,
    isPending,
    loading,
    error,
    refresh,
  };
}
