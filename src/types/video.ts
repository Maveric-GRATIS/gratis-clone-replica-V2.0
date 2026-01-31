/**
 * Video Types
 *
 * TypeScript types for video platform
 */

import { Timestamp } from 'firebase/firestore';
import { VideoCategory, VideoAccessLevel } from '@/lib/mux/config';

export interface Video {
  id: string;
  title: string;
  slug: string;
  description: string;

  // Mux data
  muxAssetId: string;
  muxPlaybackId: string;

  // Metadata
  category: VideoCategory;
  tags: string[];
  duration: number; // in seconds
  thumbnailUrl: string;

  // Access control
  accessLevel: VideoAccessLevel;
  requiredTier?: 'insider' | 'core' | 'founder';

  // Status
  status: 'processing' | 'ready' | 'errored';

  // Engagement
  viewCount: number;
  likeCount: number;

  // Publishing
  publishedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Author
  authorId: string;
  authorName: string;

  // Featured
  featured?: boolean;
  featuredOrder?: number;
}

export interface VideoView {
  id: string;
  videoId: string;
  userId?: string;
  viewedAt: Timestamp;
  watchDuration: number; // seconds watched
  completionPercentage: number; // 0-100
  ipAddress?: string;
  userAgent?: string;
}

export interface VideoPlaylist {
  id: string;
  title: string;
  slug: string;
  description: string;
  videoIds: string[];
  thumbnailUrl?: string;
  category?: VideoCategory;
  featured?: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface LiveStream {
  id: string;
  title: string;
  slug: string;
  description: string;

  // Mux Live Stream data
  muxStreamId: string;
  muxStreamKey: string;
  muxPlaybackId: string;

  // Status
  status: 'idle' | 'active' | 'disconnected';

  // Access control
  accessLevel: VideoAccessLevel;
  requiredTier?: 'insider' | 'core' | 'founder';

  // Scheduling
  scheduledStartTime?: Timestamp;
  scheduledEndTime?: Timestamp;
  actualStartTime?: Timestamp;
  actualEndTime?: Timestamp;

  // Engagement
  maxConcurrentViewers: number;
  totalViewers: number;

  // Recording
  recordingEnabled: boolean;
  recordedVideoId?: string;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Create Video Input
export interface CreateVideoInput {
  title: string;
  description: string;
  category: VideoCategory;
  tags: string[];
  accessLevel: VideoAccessLevel;
  requiredTier?: 'insider' | 'core' | 'founder';
  featured?: boolean;
}

// Update Video Input
export interface UpdateVideoInput {
  title?: string;
  description?: string;
  category?: VideoCategory;
  tags?: string[];
  accessLevel?: VideoAccessLevel;
  requiredTier?: 'insider' | 'core' | 'founder';
  featured?: boolean;
  status?: 'processing' | 'ready' | 'errored';
}

// Video Upload Progress
export interface VideoUploadProgress {
  videoId: string;
  uploadProgress: number; // 0-100
  processingProgress: number; // 0-100
  status: 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}
