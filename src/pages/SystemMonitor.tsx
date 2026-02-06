"use client";

import React, { useState, useEffect } from "react";
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
  Activity,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Server,
  Database,
  Zap,
} from "lucide-react";
import type { HealthCheckResponse, HealthStatus } from "@/types/monitoring";

// Mock health data generator for demo purposes
function generateMockHealth(): HealthCheckResponse {
  const uptime = Math.floor(
    (Date.now() - new Date("2025-01-01").getTime()) / 1000,
  );
  const totalMemory = 8 * 1024 * 1024 * 1024; // 8GB
  const usedMemory = totalMemory * (0.3 + Math.random() * 0.2); // 30-50% used
  const totalRequests = 15000 + Math.floor(Math.random() * 5000);
  const errorCount = Math.floor(Math.random() * 50);

  return {
    status: "healthy",
    version: "1.0.0",
    environment: "development",
    timestamp: new Date().toISOString(),
    dependencies: [
      {
        name: "Firebase",
        status: "healthy",
        responseTimeMs: 45 + Math.floor(Math.random() * 20),
        lastChecked: new Date().toISOString(),
        message: "Connected successfully",
      },
      {
        name: "Stripe API",
        status: "healthy",
        responseTimeMs: 120 + Math.floor(Math.random() * 50),
        lastChecked: new Date().toISOString(),
        message: "API operational",
      },
    ],
    metrics: {
      uptime,
      memory: {
        total: totalMemory,
        used: usedMemory,
        free: totalMemory - usedMemory,
        percentUsed: (usedMemory / totalMemory) * 100,
      },
      cpu: {
        count: 8,
        model: "Intel Core i7",
        usage: 15 + Math.random() * 25, // 15-40%
      },
      requests: {
        total: totalRequests,
        perMinute: 50 + Math.floor(Math.random() * 30),
        averageResponseTime: 45 + Math.floor(Math.random() * 30),
      },
      errors: {
        count: errorCount,
        rate: (errorCount / totalRequests) * 100,
      },
      errorRate: (errorCount / totalRequests) * 100,
    },
  };
}

const STATUS_CONFIG: Record<
  HealthStatus,
  { color: string; bg: string; label: string; icon: any }
> = {
  healthy: {
    color: "text-green-600",
    bg: "bg-green-50",
    label: "Healthy",
    icon: CheckCircle,
  },
  degraded: {
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    label: "Degraded",
    icon: AlertTriangle,
  },
  unhealthy: {
    color: "text-red-600",
    bg: "bg-red-50",
    label: "Unhealthy",
    icon: XCircle,
  },
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default function MonitoringDashboard() {
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchHealth = async () => {
    try {
      setLoading(true);
      // Generate mock health data for demo
      // In production, this would fetch from a real API endpoint
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
      const data = generateMockHealth();
      setHealth(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Failed to fetch health:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000); // Refresh every 10s for demo
    return () => clearInterval(interval);
  }, []);

  if (loading && !health) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-muted-foreground">Loading system status...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!health) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">System Unavailable</CardTitle>
              <CardDescription>
                Unable to fetch system health status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={fetchHealth} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  const statusConfig = STATUS_CONFIG[health.status];
  const StatusIcon = statusConfig.icon;

  return (
    <AdminLayout>
      <div className="container mx-auto pb-12 px-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">System Monitor</h1>
            <p className="text-muted-foreground">
              Real-time platform health and performance metrics
            </p>
          </div>
          <Button onClick={fetchHealth} variant="outline" disabled={loading}>
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Overall Status */}
        <Card className={statusConfig.bg}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div
                className={`p-4 rounded-full bg-white ${statusConfig.color}`}
              >
                <StatusIcon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  System Status: {statusConfig.label}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Version</div>
                <div className="text-lg font-semibold">{health.version}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Environment</div>
                <Badge variant="outline">{health.environment}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Grid */}
        {health.metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              icon="⏱️"
              label="Uptime"
              value={formatUptime(health.metrics.uptime)}
              subtitle={`${health.metrics.uptime}s`}
            />
            <MetricCard
              icon="💾"
              label="Memory Usage"
              value={`${health.metrics.memory.percentUsed.toFixed(1)}%`}
              subtitle={`${formatBytes(health.metrics.memory.used)} / ${formatBytes(health.metrics.memory.total)}`}
              alert={health.metrics.memory.percentUsed > 80}
            />
            <MetricCard
              icon="📊"
              label="Total Requests"
              value={health.metrics.requests.total.toLocaleString()}
              subtitle={`${health.metrics.requests.perMinute}/min`}
            />
            <MetricCard
              icon="⚠️"
              label="Error Rate"
              value={`${health.metrics.errorRate.toFixed(2)}%`}
              subtitle={`${health.metrics.errors.count} errors`}
              alert={health.metrics.errorRate > 5}
            />
          </div>
        )}

        {/* Dependencies */}
        {health.dependencies && health.dependencies.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Dependencies
              </CardTitle>
              <CardDescription>External service health checks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {health.dependencies.map((dep, idx) => {
                  const depStatusConfig = STATUS_CONFIG[dep.status];
                  const DepIcon = depStatusConfig.icon;

                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <DepIcon
                          className={`w-5 h-5 ${depStatusConfig.color}`}
                        />
                        <div>
                          <div className="font-semibold">{dep.name}</div>
                          {dep.message && (
                            <div className="text-sm text-muted-foreground">
                              {dep.message}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            dep.status === "healthy" ? "default" : "destructive"
                          }
                        >
                          {depStatusConfig.label}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          {dep.responseTimeMs}ms
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* System Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Application Version
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{health.version}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Environment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {health.environment}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Server Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date(health.timestamp).toLocaleTimeString()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

function MetricCard({
  icon,
  label,
  value,
  subtitle,
  alert = false,
}: {
  icon: string;
  label: string;
  value: string;
  subtitle: string;
  alert?: boolean;
}) {
  return (
    <Card
      className={
        alert ? "border-orange-500 bg-orange-50 dark:bg-orange-950" : ""
      }
    >
      <CardContent className="pt-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{icon}</span>
          <span className="text-sm font-medium text-muted-foreground">
            {label}
          </span>
        </div>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </CardContent>
    </Card>
  );
}
