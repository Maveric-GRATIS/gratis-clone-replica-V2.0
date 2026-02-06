// ============================================================================
// MONITORING & OBSERVABILITY TYPE DEFINITIONS
// ============================================================================

export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

export interface DependencyCheck {
  name: string;
  status: HealthStatus;
  responseTimeMs: number;
  message?: string;
  lastChecked: string;
}

export interface SystemMetrics {
  uptime: number;
  memory: {
    used: number;
    free: number;
    total: number;
    percentUsed: number;
  };
  cpu: {
    count: number;
    model: string;
    usage: number;
  };
  requests: {
    total: number;
    perMinute: number;
    averageResponseTime: number;
  };
  errors: {
    count: number;
    rate: number;
  };
  errorRate: number;
}

export interface HealthCheckResponse {
  status: HealthStatus;
  version: string;
  environment: string;
  timestamp: string;
  dependencies: DependencyCheck[];
  metrics?: SystemMetrics;
}

export interface AlertRule {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  enabled: boolean;
  notifyChannels: ('email' | 'slack' | 'webhook')[];
}

export interface IncidentLog {
  id: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'low' | 'medium' | 'high' | 'critical';
  startedAt: string;
  resolvedAt?: string;
  affectedServices: string[];
  updates: {
    timestamp: string;
    message: string;
    author: string;
  }[];
}

export interface UptimeRecord {
  service: string;
  timestamp: string;
  status: HealthStatus;
  responseTimeMs: number;
  averageLatencyMs: number;
}

export interface MetricDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export interface StatusPageData {
  overallStatus: HealthStatus;
  incidents: IncidentLog[];
  uptime: {
    last24h: number;
    last7d: number;
    last30d: number;
  };
  services: DependencyCheck[];
  lastUpdated: string;
}
