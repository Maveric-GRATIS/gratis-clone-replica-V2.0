// ============================================================================
// GRATIS.NGO — Health Check & Monitoring Type Definitions
// ============================================================================

export type ServiceStatus = 'healthy' | 'degraded' | 'down' | 'unknown';

export interface HealthCheckResult {
  status: ServiceStatus;
  timestamp: string;
  uptime: number;                    // Seconds since service start
  version: string;
  environment: string;
  services: ServiceHealth[];
  system: SystemMetrics;
  latency: LatencyMetrics;
}

export interface ServiceHealth {
  name: string;
  status: ServiceStatus;
  responseTime: number;              // Milliseconds
  lastChecked: string;
  message?: string;
  details?: Record<string, any>;
}

export interface SystemMetrics {
  memoryUsage: {
    used: number;                    // MB
    total: number;
    percentage: number;
  };
  cpuUsage: number;                  // Percentage
  activeConnections: number;
  requestsPerMinute: number;
  errorRate: number;                 // Percentage
  diskUsage?: {
    used: number;                    // GB
    total: number;
    percentage: number;
  };
}

export interface LatencyMetrics {
  p50: number;                       // ms
  p95: number;
  p99: number;
  average: number;
}

export interface UptimeRecord {
  date: string;
  status: ServiceStatus;
  uptime: number;                    // Percentage
  incidents: number;
  averageResponseTime: number;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'minor' | 'major' | 'critical';
  affectedServices: string[];
  startedAt: string;
  resolvedAt?: string;
  updates: IncidentUpdate[];
}

export interface IncidentUpdate {
  timestamp: string;
  status: string;
  message: string;
  author: string;
}

export interface AlertRule {
  id: string;
  name: string;
  service: string;
  metric: string;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  threshold: number;
  duration: number;                  // Seconds threshold must be exceeded
  channels: ('email' | 'slack' | 'webhook')[];
  enabled: boolean;
  lastTriggered?: string;
}
