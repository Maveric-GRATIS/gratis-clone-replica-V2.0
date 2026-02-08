// ============================================================================
// GRATIS.NGO — Custom Dashboard Builder Type Definitions
// ============================================================================

export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  layout: DashboardLayout;
  widgets: DashboardWidget[];
  theme: string;
  isPublic: boolean;
  sharedWith: string[];
  createdAt: string;
  updatedAt: string;
}

// Type alias for backward compatibility
export type Widget = DashboardWidget;

export interface DashboardLayout {
  type: 'grid' | 'freeform';
  columns: number;
  rowHeight: number;
  gap: number;
  padding: number;
}

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  position: WidgetPosition;
  config: WidgetConfig;
  dataSource?: WidgetDataSource;
  style: WidgetStyle;
  refreshInterval?: number;
}

export interface WidgetPosition {
  x: number;                       // Grid column
  y: number;                       // Grid row
  width: number;                   // Columns span
  height: number;                  // Rows span
}

export type WidgetType =
  | 'metric'
  | 'chart'
  | 'table'
  | 'list'
  | 'progress'
  | 'gauge'
  | 'map'
  | 'timeline'
  | 'calendar'
  | 'text'
  | 'countdown'
  | 'activity_feed'
  | 'leaderboard'
  | 'funnel';

export interface WidgetConfig {
  // Metric
  value?: number;
  label?: string;
  icon?: string;
  trend?: number;
  format?: 'number' | 'currency' | 'percentage' | 'duration';

  // Chart
  chartType?: 'line' | 'bar' | 'pie' | 'doughnut' | 'area' | 'radar';
  xAxis?: string;
  yAxis?: string;
  series?: string[];

  // Table
  columns?: { key: string; label: string; width?: string }[];
  sortable?: boolean;
  filterable?: boolean;

  // Progress
  current?: number;
  target?: number;
  showPercentage?: boolean;

  // Gauge
  min?: number;
  max?: number;
  thresholds?: { value: number; color: string }[];

  // Text
  content?: string;
  markdown?: boolean;

  // Countdown
  targetDate?: string;
  timezone?: string;

  // Generic
  [key: string]: any;
}

export interface WidgetDataSource {
  type: 'firestore' | 'api' | 'static' | 'computed';
  collection?: string;
  query?: any;
  apiEndpoint?: string;
  staticData?: any;
  computeFn?: string;
  refreshInterval?: number;
  limit?: number;
}

export interface WidgetStyle {
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  shadow?: boolean;
}

export interface DashboardTheme {
  name: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  primary: string;
  success: string;
  warning: string;
  danger: string;
}

export const DEFAULT_THEMES: Record<string, DashboardTheme> = {
  dark: {
    name: 'Dark',
    background: '#0f172a',
    surface: '#1e293b',
    textPrimary: '#f1f5f9',
    textSecondary: '#94a3b8',
    border: '#334155',
    primary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
  },
  light: {
    name: 'Light',
    background: '#ffffff',
    surface: '#f8fafc',
    textPrimary: '#0f172a',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    primary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
  },
};

// Widget type presets
export const WIDGET_PRESETS: { type: WidgetType; label: string; icon: string; defaultSize: { width: number; height: number } }[] = [
  { type: 'metric',     label: 'Metric Card',    icon: '📊', defaultSize: { width: 3, height: 2 } },
  { type: 'chart',      label: 'Chart',          icon: '📈', defaultSize: { width: 6, height: 4 } },
  { type: 'table',      label: 'Table',          icon: '📋', defaultSize: { width: 12, height: 6 } },
  { type: 'list',       label: 'List',           icon: '📝', defaultSize: { width: 4, height: 6 } },
  { type: 'progress',   label: 'Progress Bar',   icon: '⏳', defaultSize: { width: 4, height: 2 } },
  { type: 'gauge',      label: 'Gauge',          icon: '🎯', defaultSize: { width: 4, height: 3 } },
  { type: 'map',        label: 'Map',            icon: '🗺️', defaultSize: { width: 6, height: 6 } },
  { type: 'timeline',   label: 'Timeline',       icon: '⏱️', defaultSize: { width: 8, height: 5 } },
  { type: 'calendar',   label: 'Calendar',       icon: '📅', defaultSize: { width: 6, height: 6 } },
  { type: 'text',       label: 'Text Block',     icon: '📄', defaultSize: { width: 6, height: 3 } },
  { type: 'countdown',  label: 'Countdown',      icon: '⏰', defaultSize: { width: 4, height: 3 } },
  { type: 'activity_feed', label: 'Activity Feed', icon: '🔔', defaultSize: { width: 4, height: 8 } },
  { type: 'leaderboard', label: 'Leaderboard',   icon: '🏆', defaultSize: { width: 4, height: 6 } },
  { type: 'funnel',     label: 'Funnel',         icon: '📉', defaultSize: { width: 6, height: 4 } },
];
