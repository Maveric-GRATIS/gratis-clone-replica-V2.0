// src/types/ab-testing.ts
// A/B testing and feature flag types

export type FeatureFlagStatus = 'active' | 'inactive' | 'archived';
export type ExperimentStatus = 'draft' | 'running' | 'paused' | 'completed' | 'archived';
export type VariantAllocation = 'equal' | 'weighted' | 'custom';

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  status: FeatureFlagStatus;
  enabled: boolean;
  rules: FeatureFlagRule[];
  defaultValue: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags: string[];
}

export interface FeatureFlagRule {
  id: string;
  type: 'percentage' | 'userIds' | 'userAttribute' | 'environment';
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'in';
  attribute?: string;
  value: string | number | boolean | string[];
  percentage?: number;
  enabled: boolean;
}

export interface Experiment {
  id: string;
  key: string;
  name: string;
  description: string;
  hypothesis: string;
  status: ExperimentStatus;
  variants: ExperimentVariant[];
  targetAudience: TargetAudience;
  metrics: ExperimentMetric[];
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  results?: ExperimentResults;
  winner?: string;
}

export interface ExperimentVariant {
  id: string;
  key: string;
  name: string;
  description?: string;
  weight: number; // 0-100, must sum to 100
  isControl: boolean;
  config: Record<string, unknown>;
}

export interface TargetAudience {
  percentage: number; // 0-100 traffic percentage
  filters: AudienceFilter[];
}

export interface AudienceFilter {
  attribute: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'in' | 'greaterThan' | 'lessThan';
  value: string | number | string[];
}

export interface ExperimentMetric {
  id: string;
  name: string;
  type: 'conversion' | 'revenue' | 'engagement' | 'custom';
  eventName: string;
  isPrimary: boolean;
  minimumSampleSize?: number;
}

export interface ExperimentResults {
  totalParticipants: number;
  variantResults: VariantResult[];
  statisticalSignificance: number;
  confidenceLevel: number;
  isSignificant: boolean;
  startDate: string;
  endDate: string;
  duration: number;
}

export interface VariantResult {
  variantId: string;
  variantKey: string;
  participants: number;
  conversions: number;
  conversionRate: number;
  revenue?: number;
  averageRevenue?: number;
  improvement?: number; // vs control
  confidenceInterval: [number, number];
}

export interface ExperimentEvent {
  experimentId: string;
  variantId: string;
  userId: string;
  sessionId: string;
  eventType: 'exposure' | 'conversion' | 'revenue';
  eventName?: string;
  value?: number;
  metadata?: Record<string, unknown>;
  timestamp: string;
}
