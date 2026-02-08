// ============================================================================
// AUDIT LOG TYPE DEFINITIONS
// ============================================================================

/**
 * Categories of auditable events
 */
export type AuditCategory =
  | 'auth'
  | 'authentication'
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
  | 'webhook'
  | 'data'
  | 'admin';

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
 * Audit log statistics (basic)
 */
export interface BasicAuditStats {
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

// ============================================================================
// ADDITIONAL AUDIT TYPES FOR AUDIT SERVICE
// ============================================================================

/**
 * Audit actions
 */
export type AuditAction =
  | 'login'
  | 'logout'
  | 'login_failed'
  | 'password_change'
  | 'mfa_enable'
  | 'mfa_disable'
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'export'
  | 'import'
  | 'approve'
  | 'reject'
  | 'publish'
  | 'archive'
  | 'payment_process'
  | 'payment_refund'
  | 'donation_receive'
  | 'subscription_change'
  | 'deploy'
  | 'backup'
  | 'restore'
  | 'config_change'
  | 'system_event';

/**
 * Audit actor (who performed the action)
 */
export interface AuditActor {
  id: string;
  email: string;
  name?: string;
  role?: string;
  ip?: string;
  userAgent?: string;
}

/**
 * Audit target (what was acted upon)
 */
export interface AuditTarget {
  type: string;
  id: string;
  name?: string;
}

/**
 * Audit change (field-level changes)
 */
export interface AuditChange {
  field: string;
  oldValue: any;
  newValue: any;
}

/**
 * Extended audit entry for service use
 */
export interface AuditEntry {
  id: string;
  timestamp: string;
  action: AuditAction;
  category: AuditCategory;
  severity: AuditSeverity;
  actor: AuditActor;
  target?: AuditTarget;
  changes?: AuditChange[];
  metadata?: Record<string, unknown>;
  description: string;
  success: boolean;
  errorMessage?: string;
  requestId?: string;
  duration?: number;
}

/**
 * Audit query parameters
 */
export interface AuditQuery {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  actions?: AuditAction[];
  categories?: AuditCategory[];
  severities?: AuditSeverity[];
  actorId?: string;
  targetType?: string;
  success?: boolean;
  search?: string;
  sortBy?: keyof AuditEntry;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Audit query result
 */
export interface AuditQueryResult {
  entries: AuditEntry[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Extended audit statistics
 */
export interface AuditStats {
  totalEntries: number;
  byAction: Record<string, number>;
  byCategory: Record<string, number>;
  bySeverity: Record<AuditSeverity, number>;
  failedActions: number;
  uniqueActors: number;
  topActors: Array<{ id: string; name: string; count: number }>;
  recentCritical: AuditEntry[];
}

/**
 * Severity mapping for actions
 */
export const SEVERITY_MAP: Record<string, AuditSeverity> = {
  login_failed: 'warning',
  delete: 'warning',
  export: 'info',
  archive: 'info',
  create: 'info',
  update: 'info',
  read: 'info',
  mfa_disable: 'warning',
  password_change: 'info',
};
