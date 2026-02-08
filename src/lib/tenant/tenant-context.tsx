// src/lib/tenant/tenant-context.tsx
// GRATIS.NGO — Tenant Context Provider

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Tenant, TenantResolution } from "@/types/tenant";
import { resolveTenant } from "./tenant-service";

interface TenantContextValue {
  tenant: Tenant | null;
  resolution: TenantResolution | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const TenantContext = createContext<TenantContextValue | undefined>(undefined);

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within TenantProvider");
  }
  return context;
}

interface TenantProviderProps {
  children: React.ReactNode;
  domain?: string; // For custom domain resolution
  slug?: string; // For slug-based routing
}

export function TenantProvider({
  children,
  domain,
  slug,
}: TenantProviderProps) {
  const [resolution, setResolution] = useState<TenantResolution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTenant = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get domain from window if not provided
      const currentDomain =
        domain ||
        (typeof window !== "undefined" ? window.location.hostname : undefined);

      const resolved = await resolveTenant(currentDomain, slug);
      setResolution(resolved);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to resolve tenant"),
      );
      console.error("[TenantContext] Error resolving tenant:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenant();
  }, [domain, slug]);

  const value: TenantContextValue = {
    tenant: resolution?.tenant || null,
    resolution,
    loading,
    error,
    refetch: fetchTenant,
  };

  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  );
}

/**
 * Hook to check if a feature is enabled for current tenant
 */
export function useTenantFeature(feature: keyof Tenant["features"]): boolean {
  const { tenant } = useTenant();
  if (!tenant) return false;
  return tenant.features[feature] === true;
}

/**
 * Hook to get tenant branding
 */
export function useTenantBranding() {
  const { tenant } = useTenant();
  return tenant?.branding || null;
}

/**
 * Hook to check tenant limits
 */
export function useTenantLimit(limit: keyof Tenant["limits"]) {
  const { tenant } = useTenant();
  if (!tenant) return 0;
  return tenant.limits[limit];
}
