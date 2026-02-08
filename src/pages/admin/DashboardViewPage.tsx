// ============================================================================
// GRATIS.NGO — Dashboard View Page (Section 83)
// ============================================================================

import { useParams, Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import DashboardView from "@/components/dashboards/DashboardView";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function DashboardViewPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <AdminLayout>
        <div className="space-y-6 pt-24">
          <div className="text-center py-12">
            <p className="text-gray-400">Dashboard ID is required</p>
            <Link to="/admin/dashboards">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboards
              </Button>
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 pt-24">
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboards">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboards
            </Button>
          </Link>
        </div>

        <DashboardView dashboardId={id} />
      </div>
    </AdminLayout>
  );
}
