// ============================================================================
// GRATIS.NGO — Widget Renderer Component
// ============================================================================

import React from "react";
import { DashboardWidget, WidgetType } from "@/types/dashboard-builder";
import {
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Activity,
  BarChart,
  PieChart,
  LineChart,
  MapPin,
  Bell,
} from "lucide-react";

interface WidgetRendererProps {
  widget: DashboardWidget;
  data?: any;
}

export default function WidgetRenderer({ widget, data }: WidgetRendererProps) {
  const renderContent = () => {
    switch (widget.type) {
      case "metric":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-400">
                ${data?.totalDonations?.toLocaleString() || 0}
              </p>
              <p className="text-xs text-gray-400">Total Donations</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">
                {data?.totalEvents || 0}
              </p>
              <p className="text-xs text-gray-400">Events</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">
                {data?.activeVolunteers || 0}
              </p>
              <p className="text-xs text-gray-400">Volunteers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">
                ${data?.avgDonationAmount || 0}
              </p>
              <p className="text-xs text-gray-400">Avg Donation</p>
            </div>
          </div>
        );

      case "chart":
        return (
          <div className="space-y-3">
            {data?.datasets?.[0]?.data?.map((value: number, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-8">
                  {data.labels[i]}
                </span>
                <div className="flex-1 h-6 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500"
                    style={{
                      width: `${(value / Math.max(...data.datasets[0].data)) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-white w-16 text-right">
                  ${value.toLocaleString()}
                </span>
              </div>
            )) || <p className="text-gray-400 text-center">No data</p>}
          </div>
        );

      case "calendar":
        return (
          <div className="space-y-2">
            {data?.events?.map((event: any) => (
              <div
                key={event.id}
                className="flex items-center gap-3 p-2 bg-gray-700/50 rounded-lg"
              >
                <Calendar className="w-4 h-4 text-emerald-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">
                    {event.title}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )) || <p className="text-gray-400 text-center">No events</p>}
          </div>
        );

      case "activity_feed":
        return (
          <div className="space-y-2">
            {data?.activities?.map((activity: any) => (
              <div
                key={activity.id}
                className="flex items-center gap-3 p-2 bg-gray-700/50 rounded-lg"
              >
                <Activity className="w-4 h-4 text-blue-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{activity.user}</p>
                  <p className="text-xs text-gray-400">
                    {activity.type === "donation"
                      ? `Donated $${activity.amount}`
                      : activity.event}
                  </p>
                </div>
              </div>
            )) || <p className="text-gray-400 text-center">No activity</p>}
          </div>
        );

      case "leaderboard":
        return (
          <div className="space-y-2">
            {data?.donors?.map((donor: any, i: number) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2 bg-gray-700/50 rounded-lg"
              >
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium">{donor.name}</p>
                  <p className="text-xs text-gray-400">
                    {donor.donationCount} donations
                  </p>
                </div>
                <p className="text-sm text-emerald-400 font-bold">
                  ${donor.totalDonations.toLocaleString()}
                </p>
              </div>
            )) || <p className="text-gray-400 text-center">No donors</p>}
          </div>
        );

      case "progress":
        const progress = ((data?.current || 0) / (data?.goal || 1)) * 100;
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Progress</span>
              <span className="text-sm text-white font-bold">
                {progress.toFixed(0)}%
              </span>
            </div>
            <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>${data?.current?.toLocaleString() || 0}</span>
              <span>${data?.goal?.toLocaleString() || 0}</span>
            </div>
          </div>
        );

      case "map":
        return (
          <div className="flex items-center justify-center h-40 bg-gray-700/30 rounded-lg">
            <MapPin className="w-8 h-8 text-gray-500" />
            <p className="text-gray-400 ml-2">
              Map widget (integration required)
            </p>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-400">Widget type: {widget.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">{widget.title}</h3>
        {getWidgetIcon(widget.type)}
      </div>
      <div className="overflow-auto">{renderContent()}</div>
    </div>
  );
}

function getWidgetIcon(type: WidgetType) {
  const iconClass = "w-4 h-4 text-gray-400";
  switch (type) {
    case "metric":
      return <TrendingUp className={iconClass} />;
    case "chart":
      return <BarChart className={iconClass} />;
    case "calendar":
      return <Calendar className={iconClass} />;
    case "activity_feed":
      return <Activity className={iconClass} />;
    case "leaderboard":
      return <Users className={iconClass} />;
    case "progress":
      return <TrendingUp className={iconClass} />;
    case "map":
      return <MapPin className={iconClass} />;
    default:
      return <BarChart className={iconClass} />;
  }
}
