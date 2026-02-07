// src/components/ab-testing/FeatureGate.tsx
// Conditional rendering based on feature flags

import { ReactNode } from "react";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";

interface FeatureGateProps {
  flag: string;
  children: ReactNode;
  fallback?: ReactNode;
  loading?: ReactNode;
}

export function FeatureGate({
  flag,
  children,
  fallback = null,
  loading: loadingContent = null,
}: FeatureGateProps) {
  const { enabled, loading } = useFeatureFlag(flag);

  if (loading) return <>{loadingContent}</>;
  if (!enabled) return <>{fallback}</>;

  return <>{children}</>;
}
