/**
 * Health Check Page
 * Kubernetes readiness/liveness probe endpoint
 */

import { useEffect, useState } from "react";
import {
  runReadinessChecks,
  isAlive,
  type ReadinessReport,
} from "@/lib/deployment/readiness";
import { CheckCircle, XCircle, AlertTriangle, Activity } from "lucide-react";

export default function HealthCheckPage() {
  const [report, setReport] = useState<ReadinessReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auto-refresh every 30 seconds
    const load = async () => {
      setLoading(true);
      try {
        const data = await runReadinessChecks();
        setReport(data);
      } catch (error) {
        console.error("Health check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading && !report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Running health checks...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-center mb-2">
            Health Check Failed
          </h1>
          <p className="text-gray-600 text-center">
            Unable to run health checks
          </p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800 border-green-300";
      case "degraded":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "unhealthy":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "warn":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "fail":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">System Health</h1>
            <div
              className={`px-4 py-2 rounded-full border-2 font-semibold ${getStatusColor(
                report.status,
              )}`}
            >
              {report.status.toUpperCase()}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Ready</p>
              <p className="text-2xl font-bold">
                {report.ready ? (
                  <span className="text-green-600">Yes</span>
                ) : (
                  <span className="text-red-600">No</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Uptime</p>
              <p className="text-2xl font-bold">
                {formatUptime(report.uptime)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Version</p>
              <p className="text-2xl font-bold font-mono">{report.version}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Environment</p>
              <p className="text-2xl font-bold">{report.environment}</p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">
                {report.summary.total}
              </p>
              <p className="text-sm text-gray-600">Total Checks</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {report.summary.passed}
              </p>
              <p className="text-sm text-gray-600">Passed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">
                {report.summary.warnings}
              </p>
              <p className="text-sm text-gray-600">Warnings</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">
                {report.summary.failures}
              </p>
              <p className="text-sm text-gray-600">Failures</p>
            </div>
          </div>
        </div>

        {/* Checks */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Health Checks</h2>
          <div className="space-y-3">
            {report.checks.map((check, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  check.status === "pass"
                    ? "bg-green-50 border-green-200"
                    : check.status === "warn"
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(check.status)}
                    <div>
                      <span className="font-semibold text-gray-900">
                        {check.name}
                      </span>
                      {check.critical && (
                        <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                          CRITICAL
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {check.latencyMs}ms
                  </span>
                </div>
                <p className="text-sm text-gray-700">{check.message}</p>
                {check.details && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                      View details
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-900 text-gray-100 rounded text-xs overflow-auto">
                      {JSON.stringify(check.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Last updated: {new Date(report.timestamp).toLocaleString()}</p>
          <p className="mt-1">Auto-refreshes every 30 seconds</p>
        </div>
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
