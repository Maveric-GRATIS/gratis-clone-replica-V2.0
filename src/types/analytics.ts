/**
 * Advanced Analytics Types
 * Part 9 - Section 45: Analytics, reporting, and segmentation
 */

export interface AnalyticsEvent {
  id: string;
  userId?: string;
  sessionId: string;
  eventName: string;
  eventCategory: 'page_view' | 'interaction' | 'transaction' | 'system' | 'custom';
  properties: Record<string, any>;
  timestamp: Date;
  platform: 'web' | 'ios' | 'android';
  deviceType: 'desktop' | 'tablet' | 'mobile';
  country?: string;
  city?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  userProperties?: Record<string, any>;
}

export interface FunnelAnalysis {
  id: string;
  name: string;
  steps: FunnelStep[];
  totalEntered: number;
  totalCompleted: number;
  overallConversionRate: number;
  avgTimeToConvert: number; // milliseconds
  dateRange: { start: Date; end: Date };
}

export interface FunnelStep {
  id: string;
  name: string;
  event: string;
  order: number;
  entered: number;
  completed: number;
  dropped: number;
  conversionRate: number;
  avgTimeToNext: number; // milliseconds
}

export interface CohortAnalysis {
  cohortType: 'signup_date' | 'first_purchase' | 'custom';
  period: 'daily' | 'weekly' | 'monthly';
  metric: 'retention' | 'revenue' | 'activity';
  cohorts: Cohort[];
}

export interface Cohort {
  name: string;
  date: Date;
  size: number;
  retentionByPeriod: number[]; // percentage retained for each period
}

export interface UserSegment {
  id: string;
  name: string;
  description?: string;
  rules: SegmentRule[];
  size: number;
  lastCalculated: Date;
  createdAt: Date;
}

export interface SegmentRule {
  type: 'property' | 'event' | 'cohort';
  field?: string;
  operator: 'equals' | 'not_equals' | 'gt' | 'lt' | 'contains' | 'in' | 'did' | 'did_not';
  value: any;
  timeframe?: { value: number; unit: 'days' | 'weeks' | 'months' };
}

export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'funnel' | 'cohort';
  title: string;
  config: WidgetConfig;
  position: { x: number; y: number; w: number; h: number };
}

export interface WidgetConfig {
  metric?: string;
  chartType?: 'line' | 'bar' | 'pie' | 'area';
  dimensions?: string[];
  filters?: Record<string, any>;
  dateRange?: 'today' | '7d' | '30d' | '90d' | 'custom';
  comparison?: 'previous_period' | 'previous_year';
}

export interface Report {
  id: string;
  name: string;
  description?: string;
  dataSource: 'donations' | 'users' | 'orders' | 'events' | 'custom';
  config: ReportConfig;
  schedule?: ReportSchedule;
  recipients: string[];
  createdBy: string;
  createdAt: Date;
  lastRun?: Date;
}

export interface ReportConfig {
  columns: ReportColumn[];
  filters: ReportFilter[];
  groupBy?: string[];
  sortBy?: { field: string; direction: 'asc' | 'desc' };
  limit?: number;
  aggregations?: ReportAggregation[];
}

export interface ReportColumn {
  field: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  format?: string;
}

export interface ReportFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'contains';
  value: any;
}

export interface ReportAggregation {
  field: string;
  function: 'sum' | 'avg' | 'min' | 'max' | 'count';
  label: string;
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly';
  dayOfWeek?: number; // 0-6
  dayOfMonth?: number; // 1-31
  time: string; // HH:mm
  timezone: string;
  format: 'pdf' | 'csv' | 'excel';
}

export interface ReportExecution {
  id: string;
  reportId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  rowCount?: number;
  fileUrl?: string;
  errorMessage?: string;
}
