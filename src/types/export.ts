// src/types/export.ts
// Data export and reporting types

export type ExportFormat = 'csv' | 'json' | 'xlsx' | 'pdf';
export type ExportStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'expired';
export type ExportScope = 'donations' | 'users' | 'projects' | 'events' | 'bottles' | 'partners' | 'subscriptions' | 'audit_logs';

export interface ExportRequest {
  id: string;
  scope: ExportScope;
  format: ExportFormat;
  filters: ExportFilter[];
  columns?: string[];
  dateRange?: { start: string; end: string };
  requestedBy: string;
  status: ExportStatus;
  fileUrl?: string;
  fileSize?: number;
  rowCount?: number;
  error?: string;
  createdAt: string;
  completedAt?: string;
  expiresAt?: string;
}

export interface ExportFilter {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains';
  value: string | number | boolean | string[];
}

export interface ReportDefinition {
  id: string;
  name: string;
  description: string;
  type: 'summary' | 'detail' | 'comparison' | 'trend';
  scope: ExportScope[];
  metrics: ReportMetric[];
  groupBy?: string[];
  schedule?: ReportSchedule;
  recipients?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportMetric {
  field: string;
  aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max' | 'distinct';
  label: string;
  format?: 'number' | 'currency' | 'percentage';
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  timezone: string;
  enabled: boolean;
  lastRun?: string;
  nextRun?: string;
}

export interface ReportResult {
  reportId: string;
  title: string;
  generatedAt: string;
  dateRange: { start: string; end: string };
  summary: Record<string, number | string>;
  data: Record<string, unknown>[];
  charts?: ChartData[];
}

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'area';
  title: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
  }[];
}

export interface ExportColumn {
  key: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'currency';
  format?: string;
}
