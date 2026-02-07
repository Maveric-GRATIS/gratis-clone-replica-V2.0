import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireMarketing?: boolean;
}

export const ProtectedRoute = ({
  children,
  requireAdmin = false,
  requireMarketing = false,
}: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isMarketing, loading: roleLoading } = useRole();

  // 🚨 DEVELOPMENT MODE: Bypass admin checks (REMOVE IN PRODUCTION!)
  const DEV_MODE = import.meta.env.DEV;

  if (authLoading || roleLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // In development, skip admin/marketing checks if user is logged in
  if (DEV_MODE) {
    console.log("🚨 DEV MODE: Admin checks disabled");
    return <>{children}</>;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireMarketing && !isMarketing && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
