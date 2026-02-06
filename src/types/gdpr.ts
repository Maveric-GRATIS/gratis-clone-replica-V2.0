// ============================================================================
// GDPR COMPLIANCE TYPE DEFINITIONS
// ============================================================================

export type ConsentType =
  | 'essential'
  | 'functional'
  | 'analytics'
  | 'marketing'
  | 'advertising'
  | 'profiling';

export type ConsentStatus = 'granted' | 'denied' | 'pending';

export interface ConsentRecord {
  id: string;
  userId: string;
  consentType: ConsentType;
  status: ConsentStatus;
  timestamp: Date;
  expiresAt?: Date;
  ipAddress?: string;
  userAgent?: string;
  policyVersion: string;
  source: 'cookie_banner' | 'privacy_settings' | 'registration' | 'api';
}

export interface ConsentPreferences {
  essential: boolean; // Always true, cannot be disabled
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  advertising: boolean;
  profiling: boolean;
}

export interface DataExportRequest {
  id: string;
  userId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: Date;
  completedAt?: Date;
  downloadUrl?: string;
  expiresAt?: Date;
  format: 'json' | 'csv';
  fileSize?: number;
}

export interface DataDeletionRequest {
  id: string;
  userId: string;
  reason: string;
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected';
  requestedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  completedAt?: Date;
  retainedRecords?: string[]; // ANBI-required financial records
}

export interface CookieCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  enabled: boolean;
  cookies: {
    name: string;
    purpose: string;
    duration: string;
    provider: string;
  }[];
}

export interface DataBreachRecord {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedUsers: number;
  affectedData: string[];
  detectedAt: Date;
  reportedToAuthority: boolean;
  reportedAt?: Date;
  mitigationSteps: string[];
  notifiedUsers: boolean;
}
