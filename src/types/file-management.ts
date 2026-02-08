// ============================================================================
// GRATIS.NGO — File Management Type Definitions
// ============================================================================

export interface StoredFile {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;                   // Bytes
  extension: string;
  bucket: string;
  path: string;                   // Full storage path
  url: string;                    // Public/signed URL
  thumbnailUrl?: string;
  uploadedBy: {
    id: string;
    name: string;
    email: string;
  };
  folder?: string;                // Virtual folder path
  tags?: string[];
  description?: string;
  metadata: FileMetadata;
  access: FileAccess;
  versions: FileVersion[];
  status: 'uploading' | 'processing' | 'ready' | 'error' | 'deleted';
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface FileMetadata {
  width?: number;                 // Image/video
  height?: number;
  duration?: number;              // Audio/video seconds
  pages?: number;                 // PDF
  encoding?: string;
  checksum: string;               // SHA-256
  virusScanStatus?: 'pending' | 'clean' | 'infected' | 'error';
  virusScannedAt?: string;
  exifData?: Record<string, unknown>;
}

export interface FileAccess {
  visibility: 'public' | 'private' | 'restricted';
  allowedUsers?: string[];
  allowedRoles?: string[];
  expiresAt?: string;             // Signed URL expiry
}

export interface FileVersion {
  versionId: string;
  size: number;
  path: string;
  url: string;
  uploadedBy: string;
  createdAt: string;
  comment?: string;
}

export interface FileUploadParams {
  file: File;
  folder?: string;
  tags?: string[];
  description?: string;
  visibility?: 'public' | 'private' | 'restricted';
  generateThumbnail?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export interface FileUploadProgress {
  fileId: string;
  fileName: string;
  bytesTransferred: number;
  totalBytes: number;
  percentage: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

export interface FileQuota {
  used: number;                   // Bytes
  limit: number;                  // Bytes
  fileCount: number;
  fileCountLimit: number;
  usedFormatted: string;
  limitFormatted: string;
  percentUsed: number;
}

export interface FolderStructure {
  name: string;
  path: string;
  fileCount: number;
  totalSize: number;
  children: FolderStructure[];
  updatedAt: string;
}

// Allowed MIME types per category
export const ALLOWED_FILE_TYPES: Record<string, string[]> = {
  image:    ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  spreadsheet: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'],
  video:    ['video/mp4', 'video/webm', 'video/quicktime'],
  audio:    ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'],
};

export const MAX_FILE_SIZES: Record<string, number> = {
  image:       10 * 1024 * 1024,    // 10MB
  document:    50 * 1024 * 1024,    // 50MB
  spreadsheet: 25 * 1024 * 1024,    // 25MB
  video:       500 * 1024 * 1024,   // 500MB
  audio:       100 * 1024 * 1024,   // 100MB
  default:     25 * 1024 * 1024,    // 25MB
};
