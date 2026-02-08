// ============================================================================
// GRATIS.NGO — Dashboard View Component
// ============================================================================

import React, { useState, useEffect } from "react";
import { Dashboard, DashboardWidget } from "@/types/dashboard-builder";
import WidgetRenderer from "./WidgetRenderer";
import { Grid, Plus, Settings, Trash2 } from "lucide-react";

interface DashboardViewProps {
  dashboardId: string;
}

export default function DashboardView({ dashboardId }: DashboardViewProps) {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [widgetData, setWidgetData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [dashboardId]);

  async function loadDashboard() {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboards?id=${dashboardId}`);
      const data = await res.json();
      setDashboard(data.dashboard);

      // Load data for each widget
      const dataPromises = data.dashboard.widgets.map((w: DashboardWidget) =>
        fetch(`/api/dashboards?action=widget_data&widgetType=${w.type}`).then(
          (r) => r.json(),
        ),
      );
      const results = await Promise.all(dataPromises);

      const dataMap: Record<string, any> = {};
      data.dashboard.widgets.forEach((w: DashboardWidget, i: number) => {
        dataMap[w.id] = results[i].data;
      });
      setWidgetData(dataMap);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  async function removeWidget(widgetId: string) {
    if (!confirm("Remove this widget?")) return;

    await fetch("/api/dashboards", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dashboardId, widgetId }),
    });

    loadDashboard();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Dashboard not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{dashboard.name}</h2>
          {dashboard.description && (
            <p className="text-sm text-gray-400 mt-1">
              {dashboard.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-white border border-gray-600 rounded-lg">
            <Settings className="w-4 h-4" />
          </button>
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg">
            <Plus className="w-4 h-4 inline mr-1" />
            Add Widget
          </button>
        </div>
      </div>

      {/* Widgets Grid */}
      {dashboard.widgets.length === 0 ? (
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center">
          <Grid className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400 mb-4">No widgets yet</p>
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg">
            Add Your First Widget
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboard.widgets.map((widget) => (
            <div key={widget.id} className="relative group">
              <WidgetRenderer widget={widget} data={widgetData[widget.id]} />

              {/* Widget Actions (on hover) */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => removeWidget(widget.id)}
                  className="p-1.5 bg-gray-900/90 rounded hover:bg-red-600 transition"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
