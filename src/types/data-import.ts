// ============================================================================
// GRATIS.NGO — Data Import / Migration Type Definitions
// ============================================================================

export type ImportFormat = 'csv' | 'json' | 'xlsx' | 'xml';

export type ImportEntityType =
  | 'contacts'
  | 'donations'
  | 'donors'
  | 'events'
  | 'projects'
  | 'partners'
  | 'volunteers'
  | 'subscribers';

export interface ImportMapping {
  sourceColumn: string;
  targetField: string;
  transform?: ImportTransform;
  required?: boolean;
  defaultValue?: string;
}

export type ImportTransform =
  | 'none'
  | 'lowercase'
  | 'uppercase'
  | 'trim'
  | 'date_parse'
  | 'number_parse'
  | 'currency_parse'
  | 'boolean_parse'
  | 'email_normalize'
  | 'phone_normalize'
  | 'split_comma'
  | 'custom';

export interface ImportJob {
  id: string;
  entityType: ImportEntityType;
  format: ImportFormat;
  fileName: string;
  fileSize: number;
  mappings: ImportMapping[];
  options: ImportOptions;
  status: ImportJobStatus;
  progress: ImportProgress;
  results: ImportResults;
  errors: ImportError[];
  createdBy: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

export type ImportJobStatus =
  | 'pending'
  | 'validating'
  | 'mapping'
  | 'importing'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface ImportOptions {
  duplicateHandling: 'skip' | 'update' | 'create_new';
  duplicateField?: string;           // Field to check for duplicates (e.g. 'email')
  batchSize: number;
  dryRun: boolean;
  sendNotifications: boolean;
  timezone?: string;
  dateFormat?: string;               // e.g. 'DD/MM/YYYY', 'MM-DD-YYYY'
  delimiter?: string;                // CSV delimiter
  skipEmptyRows: boolean;
  headerRow: number;                 // 0-indexed row containing headers
}

export interface ImportProgress {
  totalRows: number;
  processedRows: number;
  successCount: number;
  errorCount: number;
  skippedCount: number;
  updatedCount: number;
  percentage: number;
  currentBatch: number;
  totalBatches: number;
  estimatedTimeRemaining?: number;   // Seconds
}

export interface ImportResults {
  created: number;
  updated: number;
  skipped: number;
  failed: number;
  total: number;
  duration: number;                  // Milliseconds
  createdIds: string[];
  updatedIds: string[];
}

export interface ImportError {
  row: number;
  column?: string;
  value?: string;
  message: string;
  severity: 'warning' | 'error';
}

export interface ImportPreview {
  headers: string[];
  sampleRows: Record<string, string>[];   // First 5 rows
  totalRows: number;
  detectedFormat: ImportFormat;
  suggestedMappings: ImportMapping[];
  validationIssues: ImportError[];
}

// Entity field definitions for mapping UI
export const ENTITY_FIELDS: Record<ImportEntityType, { name: string; label: string; required: boolean }[]> = {
  contacts: [
    { name: 'email', label: 'Email', required: true },
    { name: 'firstName', label: 'First Name', required: false },
    { name: 'lastName', label: 'Last Name', required: false },
    { name: 'phone', label: 'Phone', required: false },
    { name: 'organization', label: 'Organization', required: false },
    { name: 'tags', label: 'Tags', required: false },
    { name: 'notes', label: 'Notes', required: false },
  ],
  donations: [
    { name: 'donorEmail', label: 'Donor Email', required: true },
    { name: 'amount', label: 'Amount', required: true },
    { name: 'currency', label: 'Currency', required: false },
    { name: 'date', label: 'Date', required: false },
    { name: 'campaignId', label: 'Campaign ID', required: false },
    { name: 'paymentMethod', label: 'Payment Method', required: false },
    { name: 'notes', label: 'Notes', required: false },
  ],
  donors: [
    { name: 'email', label: 'Email', required: true },
    { name: 'name', label: 'Name', required: false },
    { name: 'totalDonated', label: 'Total Donated', required: false },
    { name: 'lastDonation', label: 'Last Donation Date', required: false },
    { name: 'recurring', label: 'Recurring', required: false },
  ],
  events: [
    { name: 'title', label: 'Title', required: true },
    { name: 'date', label: 'Date', required: false },
    { name: 'location', label: 'Location', required: false },
    { name: 'capacity', label: 'Capacity', required: false },
    { name: 'ticketPrice', label: 'Ticket Price', required: false },
  ],
  projects: [
    { name: 'name', label: 'Name', required: true },
    { name: 'description', label: 'Description', required: false },
    { name: 'goalAmount', label: 'Goal Amount', required: false },
    { name: 'status', label: 'Status', required: false },
  ],
  partners: [
    { name: 'organizationName', label: 'Organization Name', required: true },
    { name: 'contactEmail', label: 'Contact Email', required: false },
    { name: 'website', label: 'Website', required: false },
    { name: 'category', label: 'Category', required: false },
  ],
  volunteers: [
    { name: 'email', label: 'Email', required: true },
    { name: 'name', label: 'Name', required: false },
    { name: 'skills', label: 'Skills', required: false },
    { name: 'location', label: 'Location', required: false },
  ],
  subscribers: [
    { name: 'email', label: 'Email', required: true },
    { name: 'source', label: 'Source', required: false },
    { name: 'subscribedAt', label: 'Subscribed Date', required: false },
  ],
};
