// ============================================================================
// ADVANCED ANALYTICS TYPE DEFINITIONS
// ============================================================================

export interface DateRange {
  startDate: Date;
  endDate: Date;
  label: string;
}

export interface DatePreset {
  label: string;
  getValue: () => DateRange;
}

export interface MetricCard {
  id: string;
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
  color?: string;
  sparklineData?: number[];
}

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface ChartDataset {
  label: string;
  data: number[];
  color?: string;
  type?: 'line' | 'bar' | 'area';
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface FunnelStep {
  name: string;
  value: number;
  dropoff?: number;
  conversionRate?: number;
  averageTime?: number; // seconds between this step and previous
}

export interface CohortData {
  cohort: string; // e.g., "2024-01", "2024-02"
  size: number;
  retentionByPeriod: Record<number, number>; // period → retention %
}

export interface GeographicData {
  country: string;
  countryCode: string;
  users: number;
  donations: number;
  revenue: number;
  averageDonation: number;
  latitude?: number;
  longitude?: number;
}

export interface RealTimeMetrics {
  activeUsers: number;
  activeDonors: number;
  recentDonations: {
    id: string;
    amount: number;
    currency: string;
    timestamp: Date;
    country: string;
  }[];
  liveRevenue: number;
  trendinProjectId?: string;
  trendingProjectName?: string;
}

export interface AnalyticsReport {
  id: string;
  name: string;
  type: 'donations' | 'users' | 'campaigns' | 'custom';
  dateRange: DateRange;
  metrics: string[];
  generatedBy: string;
  generatedAt: Date;
  fileUrl?: string;
  status: 'generating' | 'ready' | 'failed';
}

export interface DonorSegment {
  id: string;
  name: string;
  criteria: Record<string, any>;
  size: number;
  totalRevenue: number;
  averageDonation: number;
  retentionRate: number;
}

export interface ConversionEvent {
  event: string;
  count: number;
  conversionRate: number;
  revenue: number;
}

export type AnalyticsTimeframe = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
export type AnalyticsMetric = 'donations' | 'revenue' | 'donors' | 'users' | 'events' | 'bottles';
