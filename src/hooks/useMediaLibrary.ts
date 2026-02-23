/**
 * Media Library Hook
 * React hook for managing media uploads and library
 */

import { useState, useCallback } from 'react';
import { collection, query, where, orderBy, getDocs, limit, QueryConstraint } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { UploadService } from '@/lib/media/upload-service';
import type { MediaFile, UploadProgress, MediaLibraryFilters, StorageQuota } from '@/types/media';
import { useToast } from '@/hooks/use-toast';

export function useMediaLibrary() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [quota, setQuota] = useState<StorageQuota | null>(null);

  /**
   * Load storage quota
   */
  const loadQuota = useCallback(async() => {
    if (!user) return;

    try {
      const quotaData = await UploadService.getQuota(user.uid);
      setQuota(quotaData);
    } catch (error) {
      console.error('Failed to load quota:', error);
    }
  }, [user]);

  /**
   * Upload file
   */
  const uploadFile = useCallback(
    async (file: File, configKey: string = 'general'): Promise<MediaFile | null> => {
      if (!user) {
        toast({
          title: 'Error',
          description: 'You must be logged in to upload files',
          variant: 'destructive',
        });
        return null;
      }

      setIsUploading(true);
      setUploadProgress({
        loaded: 0,
        total: file.size,
        percent: 0,
        status: 'uploading',
      });

      try {
        const media = await UploadService.uploadFile(
          file,
          user.uid,
          configKey,
          (progress) => setUploadProgress(progress)
        );

        toast({
          title: 'Success',
          description: `File "${file.name}" uploaded successfully`,
        });

        // Refresh quota
        await loadQuota();

        return media;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Upload failed';
        toast({
          title: 'Upload failed',
          description: message,
          variant: 'destructive',
        });
        return null;
      } finally {
        setIsUploading(false);
        setTimeout(() => setUploadProgress(null), 2000);
      }
    },
    [user, toast, loadQuota]
  );

  /**
   * Delete file
   */
  const deleteFile = useCallback(
    async (mediaId: string): Promise<boolean> => {
      if (!user) return false;

      try {
        await UploadService.deleteFile(mediaId, user.uid);

        toast({
          title: 'Success',
          description: 'File deleted successfully',
        });

        // Refresh quota
        await loadQuota();

        return true;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Delete failed';
        toast({
          title: 'Delete failed',
          description: message,
          variant: 'destructive',
        });
        return false;
      }
    },
    [user, toast, loadQuota]
  );

  /**
   * Update file metadata
   */
  const updateMetadata = useCallback(
    async (
      mediaId: string,
      updates: Partial<Pick<MediaFile, 'alt' | 'caption' | 'tags'>>
    ): Promise<boolean> => {
      if (!user) return false;

      try {
        await UploadService.updateMetadata(mediaId, user.uid, updates);

        toast({
          title: 'Success',
          description: 'Metadata updated successfully',
        });

        return true;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Update failed';
        toast({
          title: 'Update failed',
          description: message,
          variant: 'destructive',
        });
        return false;
      }
    },
    [user, toast]
  );

  /**
   * Get user's media files
   */
  const getUserMedia = useCallback(
    async (filters?: MediaLibraryFilters): Promise<MediaFile[]> => {
      if (!user) return [];

      try {
        const constraints: QueryConstraint[] = [
          where('uploadedBy', '==', user.uid),
          orderBy('createdAt', 'desc'),
        ];

        if (filters?.type) {
          constraints.push(where('type', '==', filters.type));
        }

        if (filters?.folder) {
          constraints.push(where('folder', '==', filters.folder));
        }

        const q = query(collection(db, 'media'), ...constraints, limit(100));
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as MediaFile[];
      } catch (error) {
        console.error('Failed to load media:', error);
        return [];
      }
    },
    [user]
  );

  return {
    isUploading,
    uploadProgress,
    quota,
    uploadFile,
    deleteFile,
    updateMetadata,
    getUserMedia,
    loadQuota,
  };
}
