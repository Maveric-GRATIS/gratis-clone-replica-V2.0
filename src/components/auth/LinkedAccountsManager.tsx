// ============================================================================
// GRATIS.NGO — Linked Accounts Manager (Settings Page)
// ============================================================================

import React, { useState, useEffect, useCallback } from "react";
import {
  Link2,
  Unlink,
  Loader2,
  Shield,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  SocialProvider,
  SOCIAL_PROVIDERS,
  LinkedAccount,
} from "@/types/social-auth";
import {
  getLinkedAccounts,
  linkProvider,
  unlinkProvider,
} from "@/lib/auth/social-auth-service";

interface LinkedAccountsManagerProps {
  userId: string;
}

export default function LinkedAccountsManager({
  userId,
}: LinkedAccountsManagerProps) {
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<SocialProvider | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    const accounts = await getLinkedAccounts(userId);
    setLinkedAccounts(accounts);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  async function handleLink(provider: SocialProvider) {
    setActionLoading(provider);
    setError(null);
    setSuccess(null);
    try {
      await linkProvider(provider);
      setSuccess(`${provider} account linked successfully!`);
      await loadAccounts();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to link account";
      setError(errorMessage);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleUnlink(provider: SocialProvider) {
    if (!confirm(`Unlink your ${provider} account?`)) return;
    setActionLoading(provider);
    setError(null);
    setSuccess(null);
    try {
      await unlinkProvider(provider);
      setSuccess(`${provider} account unlinked.`);
      await loadAccounts();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to unlink account";
      setError(errorMessage);
    } finally {
      setActionLoading(null);
    }
  }

  if (loading)
    return (
      <div className="text-gray-400 text-sm">Loading linked accounts...</div>
    );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-emerald-400" />
        <h3 className="text-lg font-semibold text-white">Linked Accounts</h3>
      </div>
      <p className="text-sm text-gray-400">
        Connect additional accounts for faster sign-in and account recovery.
      </p>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-sm text-emerald-400">
          <Check className="w-4 h-4 flex-shrink-0" /> {success}
        </div>
      )}

      <div className="space-y-2">
        {SOCIAL_PROVIDERS.map((config) => {
          const linked = linkedAccounts.find(
            (a) => a.provider === config.provider,
          );
          return (
            <div
              key={config.provider}
              className="flex items-center justify-between p-4 bg-gray-800/60 border border-gray-700 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: config.color + "20" }}
                >
                  <span
                    className="text-sm font-bold"
                    style={{ color: config.color }}
                  >
                    {config.displayName[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-white font-medium">
                    {config.displayName}
                  </p>
                  {linked ? (
                    <p className="text-xs text-gray-400">
                      {linked.email} • Connected{" "}
                      {new Date(linked.linkedAt).toLocaleDateString()}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">Not connected</p>
                  )}
                </div>
              </div>

              {linked ? (
                <button
                  onClick={() => handleUnlink(config.provider)}
                  disabled={actionLoading === config.provider}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-400 border border-red-400/30 rounded-lg hover:bg-red-500/10 transition disabled:opacity-50"
                >
                  {actionLoading === config.provider ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Unlink className="w-3 h-3" />
                  )}
                  Unlink
                </button>
              ) : config.enabled ? (
                <button
                  onClick={() => handleLink(config.provider)}
                  disabled={actionLoading === config.provider}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs text-emerald-400 border border-emerald-400/30 rounded-lg hover:bg-emerald-500/10 transition disabled:opacity-50"
                >
                  {actionLoading === config.provider ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Link2 className="w-3 h-3" />
                  )}
                  Connect
                </button>
              ) : (
                <span className="text-xs text-gray-600">Coming soon</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
