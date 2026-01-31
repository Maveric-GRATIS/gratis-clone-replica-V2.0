/**
 * Mux Helper Functions
 */

import { Video, VideoView } from '@/types/video';
import { getMuxImageUrl } from './config';

/**
 * Format video duration to readable string
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format view count to readable string
 */
export const formatViewCount = (views: number): string => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
};

/**
 * Calculate video engagement rate
 */
export const calculateEngagementRate = (video: Video): number => {
  if (video.viewCount === 0) return 0;
  return (video.likeCount / video.viewCount) * 100;
};

/**
 * Get video thumbnail URL with custom options
 */
export const getVideoThumbnail = (
  video: Video,
  options?: {
    time?: number;
    width?: number;
    height?: number;
  }
): string => {
  if (video.thumbnailUrl) {
    return video.thumbnailUrl;
  }
  return getMuxImageUrl(video.muxPlaybackId, options);
};

/**
 * Check if user can access video
 */
export const canAccessVideo = (
  video: Video,
  userTier: 'explorer' | 'insider' | 'core' | 'founder'
): boolean => {
  if (video.accessLevel === 'public') {
    return true;
  }

  if (video.accessLevel === 'members_only') {
    return userTier !== 'explorer';
  }

  if (video.accessLevel === 'tier_specific' && video.requiredTier) {
    const tierHierarchy = ['explorer', 'insider', 'core', 'founder'];
    const userTierIndex = tierHierarchy.indexOf(userTier);
    const requiredTierIndex = tierHierarchy.indexOf(video.requiredTier);
    return userTierIndex >= requiredTierIndex;
  }

  return false;
};

/**
 * Calculate video completion percentage
 */
export const calculateCompletionPercentage = (
  watchedSeconds: number,
  totalSeconds: number
): number => {
  if (totalSeconds === 0) return 0;
  return Math.min(Math.round((watchedSeconds / totalSeconds) * 100), 100);
};

/**
 * Check if video is considered "watched"
 */
export const isVideoWatched = (
  watchedSeconds: number,
  totalSeconds: number,
  threshold: number = 80 // 80% threshold
): boolean => {
  const percentage = calculateCompletionPercentage(watchedSeconds, totalSeconds);
  return percentage >= threshold;
};

/**
 * Get video playback URL
 */
export const getPlaybackUrl = (playbackId: string): string => {
  return `https://stream.mux.com/${playbackId}.m3u8`;
};

/**
 * Generate video embed code
 */
export const generateEmbedCode = (
  playbackId: string,
  options?: {
    width?: number;
    height?: number;
    autoplay?: boolean;
    muted?: boolean;
  }
): string => {
  const width = options?.width || 640;
  const height = options?.height || 360;
  const autoplay = options?.autoplay ? 'autoplay' : '';
  const muted = options?.muted ? 'muted' : '';

  return `<iframe
  src="https://stream.mux.com/${playbackId}.html?${autoplay}${muted}"
  width="${width}"
  height="${height}"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
></iframe>`;
};

/**
 * Track video view
 */
export interface TrackViewData {
  videoId: string;
  userId?: string;
  watchDuration: number;
  completionPercentage: number;
}

/**
 * Aggregate video analytics
 */
export interface VideoAnalytics {
  totalViews: number;
  uniqueViewers: number;
  averageWatchTime: number;
  completionRate: number;
  engagementRate: number;
}

export const calculateVideoAnalytics = (
  views: VideoView[],
  video: Video
): VideoAnalytics => {
  const totalViews = views.length;
  const uniqueViewers = new Set(views.filter(v => v.userId).map(v => v.userId)).size;
  const averageWatchTime = views.reduce((sum, v) => sum + v.watchDuration, 0) / totalViews || 0;
  const completionRate = views.filter(v => v.completionPercentage >= 80).length / totalViews * 100 || 0;
  const engagementRate = calculateEngagementRate(video);

  return {
    totalViews,
    uniqueViewers,
    averageWatchTime,
    completionRate,
    engagementRate,
  };
};
