/**
 * A/B Testing and Feature Flag Types
 * Part 9 - Section 44: Experimentation and feature management
 */

export type ExperimentStatus = 'draft' | 'running' | 'paused' | 'completed' | 'archived';

export interface Experiment {
  id: string;
  key: string; // Unique key for lookups
  name: string;
  description: string;
  hypothesis: string;
  status: ExperimentStatus;
  startDate: Date;
  endDate?: Date;
  variants: ExperimentVariant[];
  trafficAllocation: number; // percentage
  targetAudience?: AudienceFilter;
  metrics: ExperimentMetric[];
  primaryMetricId: string;
  tags: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExperimentVariant {
  id: string;
  key?: string; // Optional key for variant lookups
  name: string;
  description?: string;
  weight: number; // percentage
  isControl: boolean;
  config: Record<string, any>;
}

export interface ExperimentAssignment {
  id: string;
  experimentId: string;
  userId: string;
  variantId: string;
  assignedAt: Date;
  context?: Record<string, any>;
}

export interface ExperimentMetric {
  id: string;
  name: string;
  event: string;
  type: 'conversion' | 'numeric' | 'count';
  aggregation?: 'sum' | 'avg' | 'count' | 'unique';
  isPrimary: boolean;
}

export interface AudienceFilter {
  userProperties?: Record<string, any>;
  platform?: ('web' | 'ios' | 'android')[];
  country?: string[];
  language?: string[];
  customSegment?: string;
}

export interface ExperimentResults {
  experimentId: string;
  experimentName: string;
  status: ExperimentStatus;
  startDate: Date;
  endDate?: Date;
  duration: number; // days
  totalParticipants: number;
  variants: VariantResult[];
  winner?: string; // variant id
  confidence: number;
  isSignificant: boolean;
  recommendation: string;
}

export interface VariantResult {
  variantId: string;
  variantName: string;
  isControl: boolean;
  participants: number;
  metrics: MetricResult[];
}

export interface MetricResult {
  metricId: string;
  metricName: string;
  value: number;
  sampleSize: number;
  conversionRate?: number;
  averageValue?: number;
  standardDeviation?: number;
  confidenceInterval: [number, number];
  pValue?: number;
  improvement?: number; // vs control, percentage
  isSignificant: boolean;
}

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  type: 'boolean' | 'string' | 'number' | 'json';
  defaultValue: any;
  enabled: boolean;
  rules: FeatureFlagRule[];
  environments: ('development' | 'staging' | 'production')[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FeatureFlagRule {
  id: string;
  priority: number;
  conditions: AudienceFilter;
  value: any;
  percentage?: number; // Gradual rollout
}
