// ============================================================================
// GRATIS.NGO — Public Status Page Component
// ============================================================================

import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Clock, RefreshCw, Loader2, Activity } from 'lucide-react';
import { HealthCheckResult, ServiceHealth, ServiceStatus, UptimeRecord } from '@/types/health-check';
import { performHealthCheck, getUptimeHistory } from '@/lib/monitoring/health-service';

const STATUS_CONFIG: Record<ServiceStatus, { icon: React.ReactNode; label: string; color: string; bg: string }> = {
  healthy:  { icon: <CheckCircle2 className="w-5 h-5" />, label: 'Operational', color: '#22c55e', bg: 'bg-emerald-500/10' },
  degraded: { icon: <AlertTriangle className="w-5 h-5" />, label: 'Degraded', color: '#eab308', bg: 'bg-yellow-500/10' },
  down:     { icon: <XCircle className="w-5 h-5" />, label: 'Outage', color: '#ef4444', bg: 'bg-red-500/10' },
  unknown:  { icon: <Clock className="w-5 h-5" />, label: 'Unknown', color: '#6b7280', bg: 'bg-gray-500/10' },
};

export function StatusPage() {
  const [health, setHealth] = useState<HealthCheckResult | null>(null);
  const [uptime, setUptime] = useState<UptimeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  async function loadStatus() {
    setLoading(true);
    try {
      const [healthData, uptimeData] = await Promise.all([
        performHealthCheck(),
        getUptimeHistory(90),
      ]);
      setHealth(healthData);
      setUptime(uptimeData);
    } catch (err) {
      console.error('Failed to load status:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading && !health) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  if (!health) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Unable to load system status</p>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[health.status];
  const avgUptime = uptime.length > 0
    ? (uptime.reduce((sum, r) => sum + r.uptime, 0) / uptime.length).toFixed(2)
    : '100.00';

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      {/* Overall Status */}
      <div className={`p-6 rounded-2xl border ${statusConfig.bg}`} style={{ borderColor: statusConfig.color + '30' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div style={{ color: statusConfig.color }}>{statusConfig.icon}</div>
            <div>
              <h1 className="text-xl font-bold text-white">All Systems {statusConfig.label}</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Last checked: {new Date(health.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <button
            onClick={loadStatus}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Services */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" /> Services
        </h2>
        {health.services.map((service) => {
          const sc = STATUS_CONFIG[service.status];
          return (
            <div
              key={service.name}
              className="flex items-center justify-between p-4 bg-gray-800/60 border border-gray-700 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div style={{ color: sc.color }}>{sc.icon}</div>
                <div>
                  <span className="text-sm text-white font-medium">{service.name}</span>
                  {service.message && (
                    <p className="text-xs text-gray-500 mt-0.5">{service.message}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400">{service.responseTime}ms</span>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: sc.color + '20', color: sc.color }}
                >
                  {sc.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Uptime Bar (Last 90 days) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Uptime — Last 90 Days</h2>
          <span className="text-sm font-bold text-emerald-400">{avgUptime}%</span>
        </div>
        <div className="flex gap-0.5 h-8">
          {uptime.slice(-90).map((record, i) => {
            const color = record.uptime >= 99.5 ? '#22c55e' : record.uptime >= 95 ? '#eab308' : '#ef4444';
            return (
              <div
                key={i}
                className="flex-1 rounded-sm cursor-pointer transition hover:opacity-80"
                style={{ backgroundColor: color }}
                title={`${record.date}: ${record.uptime}% uptime`}
              />
            );
          })}
          {uptime.length === 0 && (
            <div className="flex-1 bg-gray-800 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 text-sm">No uptime data available yet</p>
            </div>
          )}
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>90 days ago</span>
          <span>Today</span>
        </div>
      </div>

      {/* Performance */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Performance</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'p50 Latency', value: `${health.latency.p50}ms` },
            { label: 'p95 Latency', value: `${health.latency.p95}ms` },
            {
              label: 'Memory',
              value: health.system.memoryUsage.total > 0
                ? `${health.system.memoryUsage.percentage}%`
                : 'N/A'
            },
            {
              label: 'Uptime',
              value: `${Math.floor(health.uptime / 3600)}h ${Math.floor((health.uptime % 3600) / 60)}m`
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-gray-800/60 border border-gray-700 rounded-lg p-3 text-center"
            >
              <p className="text-lg font-bold text-white">{value}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Environment Info */}
      <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Version:</span>
            <span className="ml-2 text-white font-mono">{health.version}</span>
          </div>
          <div>
            <span className="text-gray-400">Environment:</span>
            <span className="ml-2 text-white font-mono">{health.environment}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatusPage;
