// ============================================================================
// AUDIT LOG TYPE DEFINITIONS
// ============================================================================

/**
 * Categories of auditable events
 */
export type AuditCategory =
  | 'auth'
  | 'donation'
  | 'subscription'
  | 'refund'
  | 'user'
  | 'role'
  | 'permission'
  | 'project'
  | 'partner'
  | 'event'
  | 'content'
  | 'gdpr'
  | 'system'
  | 'security'
  | 'payment'
  | 'webhook';

/**
 * Severity levels for audit entries
 */
export type AuditSeverity = 'info' | 'warning' | 'error' | 'critical';

/**
 * Core audit log entry
 */
export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  category: AuditCategory;
  action: string;
  severity: AuditSeverity;
  userId?: string;
  userEmail?: string;
  userRole?: string;
  resourceType?: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  success: boolean;
  errorCode?: string;
  errorMessage?: string;
}

/**
 * Audit log query filters
 */
export interface AuditQueryParams {
  category?: AuditCategory;
  severity?: AuditSeverity;
  userId?: string;
  resourceType?: string;
  resourceId?: string;
  startDate?: Date;
  endDate?: Date;
  searchText?: string;
  limit?: number;
  offset?: number;
  sortBy?: keyof AuditLogEntry;
  sortDirection?: 'asc' | 'desc';
}

/**
 * Audit log statistics
 */
export interface AuditStats {
  totalEntries: number;
  byCategory: Record<AuditCategory, number>;
  bySeverity: Record<AuditSeverity, number>;
  recentErrors: number;
  recentCritical: number;
}

/**
 * User activity entry (simplified view for users)
 */
export interface UserActivity {
  id: string;
  timestamp: Date;
  action: string;
  description: string;
  type: 'donation' | 'event' | 'social' | 'account' | 'tribe' | 'achievement';
}

/**
 * Retention policy definition
 */
export interface RetentionPolicy {
  category: AuditCategory;
  retentionDays: number;
  archiveBeforeDelete: boolean;
  description: string;
}
