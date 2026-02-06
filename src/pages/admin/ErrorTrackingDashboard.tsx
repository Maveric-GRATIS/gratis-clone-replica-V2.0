/**
 * Error Tracking Dashboard
 * Monitor application errors and performance
 */

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  XCircle,
  TrendingDown,
  TrendingUp,
  Activity,
  RefreshCw,
} from "lucide-react";

export default function ErrorTrackingDashboard() {
  const [timeRange, setTimeRange] = useState("24h");

  // Mock data - replace with Sentry integration
  const errors = [
    {
      id: "1",
      type: "TypeError",
      message: "Cannot read property 'map' of undefined",
      severity: "error",
      count: 12,
      lastSeen: "2026-02-06T11:30:00Z",
      firstSeen: "2026-02-06T09:00:00Z",
      status: "unresolved",
      affectedUsers: 8,
    },
    {
      id: "2",
      type: "NetworkError",
      message: "Failed to fetch: api/projects",
      severity: "warning",
      count: 5,
      lastSeen: "2026-02-06T11:15:00Z",
      firstSeen: "2026-02-06T10:30:00Z",
      status: "unresolved",
      affectedUsers: 3,
    },
    {
      id: "3",
      type: "ValidationError",
      message: "Invalid email format in registration form",
      severity: "info",
      count: 3,
      lastSeen: "2026-02-06T10:45:00Z",
      firstSeen: "2026-02-06T08:15:00Z",
      status: "resolved",
      affectedUsers: 2,
    },
    {
      id: "4",
      type: "ChunkLoadError",
      message: "Loading chunk 5 failed",
      severity: "error",
      count: 18,
      lastSeen: "2026-02-06T11:00:00Z",
      firstSeen: "2026-02-05T14:00:00Z",
      status: "investigating",
      affectedUsers: 15,
    },
  ];

  const stats = {
    totalErrors: errors.reduce((sum, e) => sum + e.count, 0),
    unresolvedErrors: errors.filter((e) => e.status === "unresolved").length,
    affectedUsers: errors.reduce((sum, e) => sum + e.affectedUsers, 0),
    errorRate: 0.03, // 0.03% of requests
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "info":
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "error":
        return <Badge className="bg-red-500 text-white">Error</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500 text-white">Warning</Badge>;
      case "info":
        return <Badge className="bg-blue-500 text-white">Info</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return <Badge className="bg-green-500 text-white">Resolved</Badge>;
      case "investigating":
        return <Badge className="bg-purple-500 text-white">Investigating</Badge>;
      case "unresolved":
        return <Badge variant="destructive">Unresolved</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-primary" />
              Error Tracking
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor application errors and performance metrics
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Total Errors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalErrors}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingDown className="w-3 h-3 text-green-500" />
                12% vs last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Unresolved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.unresolvedErrors}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Requires attention
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Affected Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.affectedUsers}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Unique users impacted
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Error Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(stats.errorRate * 100).toFixed(2)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-red-500" />
                0.01% vs yesterday
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sentry Setup Notice */}
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="w-5 h-5" />
              Sentry Integration Pending
            </CardTitle>
            <CardDescription>
              This dashboard shows mock data. Integrate Sentry for real-time error tracking.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p className="font-semibold">Setup Instructions:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Install Sentry SDK: <code className="bg-white px-2 py-0.5 rounded">npm install @sentry/react</code></li>
                <li>Create Sentry project at <a href="https://sentry.io" target="_blank" rel="noopener noreferrer" className="text-primary underline">sentry.io</a></li>
                <li>Add DSN to environment variables: <code className="bg-white px-2 py-0.5 rounded">VITE_SENTRY_DSN</code></li>
                <li>Initialize in <code className="bg-white px-2 py-0.5 rounded">src/lib/errors/sentry.ts</code></li>
                <li>Wrap app with Sentry ErrorBoundary</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Error List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Errors</CardTitle>
            <CardDescription>
              Latest errors grouped by type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {errors.map((error) => (
                <div
                  key={error.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {getSeverityIcon(error.severity)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{error.type}</span>
                        {getSeverityBadge(error.severity)}
                        {getStatusBadge(error.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {error.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Count: {error.count}</span>
                        <span>Users: {error.affectedUsers}</span>
                        <span>
                          Last seen: {new Date(error.lastSeen).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {error.status === "unresolved" && (
                      <Button variant="outline" size="sm">
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Web Vitals Card */}
        <Card>
          <CardHeader>
            <CardTitle>Web Vitals</CardTitle>
            <CardDescription>
              Core Web Vitals performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">LCP</span>
                  <Badge className="bg-green-500 text-white">Good</Badge>
                </div>
                <div className="text-2xl font-bold">1.2s</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Largest Contentful Paint
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">FID</span>
                  <Badge className="bg-green-500 text-white">Good</Badge>
                </div>
                <div className="text-2xl font-bold">45ms</div>
                <p className="text-xs text-muted-foreground mt-1">
                  First Input Delay
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">CLS</span>
                  <Badge className="bg-yellow-500 text-white">Needs Work</Badge>
                </div>
                <div className="text-2xl font-bold">0.15</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Cumulative Layout Shift
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
