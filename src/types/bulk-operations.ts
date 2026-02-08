// ============================================================================
// GRATIS.NGO — Bulk Operations Type Definitions
// ============================================================================

export type BulkOperationType =
  | 'update'
  | 'delete'
  | 'archive'
  | 'restore'
  | 'tag'
  | 'untag'
  | 'assign'
  | 'export'
  | 'duplicate'
  | 'merge';

export type BulkEntityType =
  | 'contacts'
  | 'donations'
  | 'donors'
  | 'events'
  | 'projects'
  | 'partners'
  | 'volunteers'
  | 'tickets';

export interface BulkOperation {
  id: string;
  type: BulkOperationType;
  entityType: BulkEntityType;
  targetIds: string[];
  params: Record<string, any>;
  status: BulkOperationStatus;
  progress: BulkProgress;
  results: BulkResults;
  errors: BulkError[];
  undoAvailable: boolean;
  createdBy: string;
  createdAt: string;
  completedAt?: string;
  undoExpiry?: string;
}

export type BulkOperationStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'undone';

export interface BulkProgress {
  total: number;
  processed: number;
  succeeded: number;
  failed: number;
  percentage: number;
}

export interface BulkResults {
  affectedCount: number;
  successIds: string[];
  failedIds: string[];
  previousValues?: Record<string, any>[]; // For undo
}

export interface BulkError {
  targetId: string;
  message: string;
  code?: string;
}

export interface BulkOperationConfig {
  type: BulkOperationType;
  label: string;
  description: string;
  icon: string;
  requiresConfirmation: boolean;
  allowUndo: boolean;
  maxTargets: number;
  paramFields?: { name: string; label: string; type: 'text' | 'select' | 'tags'; options?: string[] }[];
}

export const BULK_OPERATION_CONFIGS: Record<BulkOperationType, BulkOperationConfig> = {
  update:        { type: 'update', label: 'Bulk Update', description: 'Update fields on selected records', icon: '✏️', requiresConfirmation: true, allowUndo: true, maxTargets: 5000 },
  delete:        { type: 'delete', label: 'Bulk Delete', description: 'Permanently delete selected records', icon: '🗑️', requiresConfirmation: true, allowUndo: false, maxTargets: 1000 },
  archive:       { type: 'archive', label: 'Archive', description: 'Move to archive', icon: '📦', requiresConfirmation: false, allowUndo: true, maxTargets: 5000 },
  restore:       { type: 'restore', label: 'Restore', description: 'Restore from archive', icon: '♻️', requiresConfirmation: false, allowUndo: true, maxTargets: 5000 },
  tag:           { type: 'tag', label: 'Add Tags', description: 'Add tags to records', icon: '🏷️', requiresConfirmation: false, allowUndo: true, maxTargets: 10000 },
  untag:         { type: 'untag', label: 'Remove Tags', description: 'Remove tags from records', icon: '🚫', requiresConfirmation: false, allowUndo: true, maxTargets: 10000 },
  assign:        { type: 'assign', label: 'Assign', description: 'Assign to user/team', icon: '👤', requiresConfirmation: false, allowUndo: true, maxTargets: 5000 },
  export:        { type: 'export', label: 'Export', description: 'Export to CSV/JSON', icon: '📤', requiresConfirmation: false, allowUndo: false, maxTargets: 50000 },
  duplicate:     { type: 'duplicate', label: 'Duplicate', description: 'Create copies', icon: '📋', requiresConfirmation: true, allowUndo: false, maxTargets: 500 },
  merge:         { type: 'merge', label: 'Merge', description: 'Merge duplicate records', icon: '🔗', requiresConfirmation: true, allowUndo: false, maxTargets: 100 },
};
