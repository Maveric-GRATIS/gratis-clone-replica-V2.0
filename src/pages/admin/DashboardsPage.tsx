// ============================================================================
// GRATIS.NGO — Dashboards Manager Page (Section 83)
// ============================================================================

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Plus,
  RefreshCw,
  Grid,
  Eye,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Dashboard, WIDGET_PRESETS } from "@/types/dashboard-builder";

export default function DashboardsPage() {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboards();
  }, []);

  const loadDashboards = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboards?userId=user123");
      const data = await res.json();
      setDashboards(data.dashboards || []);
    } catch (error) {
      console.error("Error loading dashboards:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pt-24">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <LayoutDashboard className="w-8 h-8 text-pink-600" />
              Custom Dashboards
            </h1>
            <p className="text-gray-600 mt-1">
              Build custom analytics dashboards with widgets
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadDashboards} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Link to="/part18-test">
              <Button variant="secondary" size="sm">
                Test APIs
              </Button>
            </Link>
          </div>
        </div>

        {/* Widget Types */}
        <Card>
          <CardHeader>
            <CardTitle>Available Widget Types</CardTitle>
            <CardDescription>
              14 different widget types to build your custom dashboards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
              {WIDGET_PRESETS.map((preset) => (
                <div
                  key={preset.type}
                  className="p-3 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors cursor-pointer"
                  title={preset.label}
                >
                  <div className="text-xl mb-1">{preset.icon}</div>
                  <div className="text-xs font-medium truncate">
                    {preset.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {preset.defaultSize.width}x{preset.defaultSize.height}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dashboards List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Your Dashboards</CardTitle>
                <CardDescription>
                  Create and manage custom analytics dashboards
                </CardDescription>
              </div>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Dashboard
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <p className="mt-2 text-sm text-gray-600">
                  Loading dashboards...
                </p>
              </div>
            ) : dashboards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboards.map((dashboard) => (
                  <div
                    key={dashboard.id}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <LayoutDashboard className="w-5 h-5 text-pink-600" />
                        <div className="font-medium">{dashboard.name}</div>
                      </div>
                      {dashboard.isPublic && (
                        <Badge variant="outline">
                          <Eye className="w-3 h-3 mr-1" />
                          Public
                        </Badge>
                      )}
                    </div>

                    {dashboard.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {dashboard.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Grid className="w-4 h-4" />
                        <span>{dashboard.widgets.length} widgets</span>
                      </div>
                      <Badge variant="secondary">{dashboard.theme}</Badge>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex gap-2">
                        <Link
                          to={`/admin/dashboards/${dashboard.id}`}
                          className="flex-1"
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline" className="flex-1">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-600">
                <LayoutDashboard className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="font-medium">No dashboards yet</p>
                <p className="text-sm mt-1">
                  Create your first custom dashboard
                </p>
                <Button className="mt-4" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Dashboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Grid className="w-5 h-5 text-blue-600" />
                Flexible Layouts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Grid-based or freeform layouts with drag-and-drop positioning
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Real-time Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Connect widgets to Firestore, APIs, or static data sources
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-600" />
                Sharing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Share dashboards publicly or with specific team members
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
