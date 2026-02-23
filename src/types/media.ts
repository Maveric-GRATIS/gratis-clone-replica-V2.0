/**
 * Media Type Definitions
 * Types for file uploads, media library, and storage quotas
 */

export type MediaType = 'image' | 'video' | 'document' | 'audio';
export type MediaStatus = 'uploading' | 'processing' | 'ready' | 'failed';

export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  type: MediaType;
  status: MediaStatus;
  sizeBytes: number;
  url: string;
  thumbnailUrl?: string;
  responsiveUrls?: Record<string, string>;
  width?: number;
  height?: number;
  duration?: number; // seconds for video/audio
  alt?: string;
  caption?: string;
  uploadedBy: string;
  folder?: string;
  tags: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface UploadConfig {
  maxSizeMB: number;
  allowedTypes: string[];
  folder: string;
  generateThumbnail: boolean;
  optimizeImages: boolean;
  maxDimension?: number;
}

export interface StorageQuota {
  usedBytes: number;
  limitBytes: number;
  fileCount: number;
  percentUsed: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percent: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

export interface MediaLibraryFilters {
  type?: MediaType;
  folder?: string;
  tags?: string[];
  searchQuery?: string;
  uploadedBy?: string;
  dateFrom?: string;
  dateTo?: string;
}
