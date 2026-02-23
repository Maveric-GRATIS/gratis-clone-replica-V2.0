/**
 * File Upload Service
 * Handles file uploads with validation, optimization, and quota management
 */

import { storage, db } from '@/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc, increment } from 'firebase/firestore';
import type { MediaFile, MediaType, UploadConfig, StorageQuota, UploadProgress } from '@/types/media';

/**
 * Upload Configurations
 */
export const UPLOAD_CONFIGS: Record<string, UploadConfig> = {
  avatar: {
    maxSizeMB: 5,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    folder: 'avatars',
    generateThumbnail: true,
    optimizeImages: true,
    maxDimension: 512,
  },
  project: {
    maxSizeMB: 10,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    folder: 'projects',
    generateThumbnail: true,
    optimizeImages: true,
    maxDimension: 1920,
  },
  event: {
    maxSizeMB: 10,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    folder: 'events',
    generateThumbnail: true,
    optimizeImages: true,
    maxDimension: 1920,
  },
  document: {
    maxSizeMB: 25,
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    folder: 'documents',
    generateThumbnail: false,
    optimizeImages: false,
  },
  general: {
    maxSizeMB: 15,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'],
    folder: 'uploads',
    generateThumbnail: true,
    optimizeImages: true,
  },
};

/**
 * Storage quota limit per user (500MB)
 */
export const QUOTA_LIMIT_BYTES = 500 * 1024 * 1024;

/**
 * Upload Service Class
 */
export class UploadService {
  /**
   * Validate file before upload
   */
  static validateFile(
    file: File,
    config: UploadConfig
  ): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > config.maxSizeMB * 1024 * 1024) {
      return {
        valid: false,
        error: `File too large. Maximum size is ${config.maxSizeMB}MB`,
      };
    }

    // Check file type
    if (!config.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type not allowed. Allowed types: ${config.allowedTypes.join(', ')}`,
      };
    }

    return { valid: true };
  }

  /**
   * Upload a file
   */
  static async uploadFile(
    file: File,
    userId: string,
    configKey: string = 'general',
    onProgress?: (progress: UploadProgress) => void
  ): Promise<MediaFile> {
    const config = UPLOAD_CONFIGS[configKey] || UPLOAD_CONFIGS.general;

    // Validate file
    const validation = this.validateFile(file, config);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Check storage quota
    const quota = await this.getQuota(userId);
    if (quota.usedBytes + file.size > QUOTA_LIMIT_BYTES) {
      throw new Error(
        `Storage quota exceeded. You have used ${this.formatBytes(quota.usedBytes)} of ${this.formatBytes(QUOTA_LIMIT_BYTES)}`
      );
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'bin';
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    const filename = `${timestamp}_${random}.${ext}`;
    const storagePath = `${config.folder}/${userId}/${filename}`;

    // Determine media type
    const mediaType = this.getMediaType(file.type);

    // Create media record
    const mediaRef = doc(collection(db, 'media'));
    const media: MediaFile = {
      id: mediaRef.id,
      filename,
      originalName: file.name,
      mimeType: file.type,
      type: mediaType,
      status: 'uploading',
      sizeBytes: file.size,
      url: '',
      tags: [],
      uploadedBy: userId,
      folder: config.folder,
      metadata: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      // Report progress
      if (onProgress) {
        onProgress({
          loaded: 0,
          total: file.size,
          percent: 0,
          status: 'uploading',
        });
      }

      // Upload to Firebase Storage
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file, {
        contentType: file.type,
        customMetadata: {
          uploadedBy: userId,
          originalName: file.name,
        },
      });

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      media.url = downloadURL;

      // If image, generate thumbnail (simplified - in production use Cloud Functions)
      if (mediaType === 'image' && config.generateThumbnail) {
        media.thumbnailUrl = downloadURL; // In production, generate actual thumbnail

        // Get image dimensions if possible
        const dimensions = await this.getImageDimensions(file);
        if (dimensions) {
          media.width = dimensions.width;
          media.height = dimensions.height;
        }
      }

      media.status = 'ready';

      // Save to Firestore
      await setDoc(mediaRef, media);

      // Update user storage quota
      await this.updateQuota(userId, file.size);

      // Report complete
      if (onProgress) {
        onProgress({
          loaded: file.size,
          total: file.size,
          percent: 100,
          status: 'complete',
        });
      }

      return media;
    } catch (error) {
      media.status = 'failed';
      media.metadata = { error: error instanceof Error ? error.message : 'Upload failed' };
      await setDoc(mediaRef, media);

      if (onProgress) {
        onProgress({
          loaded: 0,
          total: file.size,
          percent: 0,
          status: 'error',
          error: error instanceof Error ? error.message : 'Upload failed',
        });
      }

      throw error;
    }
  }

  /**
   * Delete a media file
   */
  static async deleteFile(mediaId: string, userId: string): Promise<void> {
    const mediaRef = doc(db, 'media', mediaId);
    const mediaDoc = await getDoc(mediaRef);

    if (!mediaDoc.exists()) {
      throw new Error('File not found');
    }

    const media = mediaDoc.data() as MediaFile;

    // Check permissions
    if (media.uploadedBy !== userId) {
      throw new Error('Permission denied');
    }

    try {
      // Delete from Firebase Storage
      const storageRef = ref(storage, `${media.folder}/${userId}/${media.filename}`);
      await deleteObject(storageRef);

      // Delete thumbnail if exists
      if (media.thumbnailUrl) {
        try {
          const thumbRef = ref(storage, `${media.folder}/${userId}/thumbnails/${media.filename}`);
          await deleteObject(thumbRef);
        } catch {
          // Thumbnail may not exist
        }
      }
    } catch (error) {
      console.warn('Failed to delete from storage:', error);
      // Continue to delete record even if storage deletion fails
    }

    // Delete Firestore record
    await deleteDoc(mediaRef);

    // Update quota
    await this.updateQuota(userId, -media.sizeBytes);
  }

  /**
   * Update media metadata
   */
  static async updateMetadata(
    mediaId: string,
    userId: string,
    updates: Partial<Pick<MediaFile, 'alt' | 'caption' | 'tags'>>
  ): Promise<void> {
    const mediaRef = doc(db, 'media', mediaId);
    const mediaDoc = await getDoc(mediaRef);

    if (!mediaDoc.exists()) {
      throw new Error('File not found');
    }

    const media = mediaDoc.data() as MediaFile;

    // Check permissions
    if (media.uploadedBy !== userId) {
      throw new Error('Permission denied');
    }

    await updateDoc(mediaRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Get user storage quota
   */
  static async getQuota(userId: string): Promise<StorageQuota> {
    const quotaRef = doc(db, 'storage_quotas', userId);
    const quotaDoc = await getDoc(quotaRef);

    const data = quotaDoc.data();
    const used = data?.usedBytes || 0;
    const fileCount = data?.fileCount || 0;

    return {
      usedBytes: used,
      limitBytes: QUOTA_LIMIT_BYTES,
      fileCount,
      percentUsed: Math.round((used / QUOTA_LIMIT_BYTES) * 100),
    };
  }

  /**
   * Update user storage quota
   */
  private static async updateQuota(userId: string, deltaBytes: number): Promise<void> {
    const quotaRef = doc(db, 'storage_quotas', userId);

    await setDoc(
      quotaRef,
      {
        usedBytes: increment(deltaBytes),
        fileCount: increment(deltaBytes > 0 ? 1 : -1),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  }

  /**
   * Detect media type from MIME type
   */
  private static getMediaType(mimeType: string): MediaType {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'document';
  }

  /**
   * Get image dimensions
   */
  private static getImageDimensions(
    file: File
  ): Promise<{ width: number; height: number } | null> {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(null);
        return;
      }

      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({ width: img.width, height: img.height });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };

      img.src = url;
    });
  }

  /**
   * Format bytes to human-readable string
   */
  private static formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }
}

/**
 * Utility functions
 */
export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)}GB`;
};

export const getMediaIcon = (type: MediaType): string => {
  switch (type) {
    case 'image':
      return '🖼️';
    case 'video':
      return '🎥';
    case 'audio':
      return '🎵';
    case 'document':
      return '📄';
    default:
      return '📎';
  }
};
