/**
 * useVideoTracking Hook
 *
 * Track video views and watch progress
 */

import { useState, useEffect, useRef } from 'react';
import { Video, VideoView } from '@/types/video';
import { calculateCompletionPercentage, isVideoWatched } from '@/lib/mux/helpers';

interface VideoTrackingOptions {
  video: Video;
  userId?: string;
  updateInterval?: number; // seconds between progress updates
}

export const useVideoTracking = ({
  video,
  userId,
  updateInterval = 10,
}: VideoTrackingOptions) => {
  const [watchStartTime] = useState(Date.now());
  const [totalWatchTime, setTotalWatchTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const lastUpdateRef = useRef(0);
  const watchTimeRef = useRef(0);

  // Track view on component mount
  useEffect(() => {
    // In production: create initial view record in Firestore
    console.log('Video view started:', {
      videoId: video.id,
      userId,
      timestamp: new Date(watchStartTime),
    });

    return () => {
      // On unmount, save final watch progress
      handleSaveProgress(true);
    };
  }, []);

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);

    if (!isTracking) {
      setIsTracking(true);
    }

    // Calculate watch time
    const timeSinceLastUpdate = time - lastUpdateRef.current;
    if (timeSinceLastUpdate > 0 && timeSinceLastUpdate < 2) {
      // Only count if time diff is reasonable (prevents seeking from inflating watch time)
      watchTimeRef.current += timeSinceLastUpdate;
      setTotalWatchTime(watchTimeRef.current);
    }
    lastUpdateRef.current = time;

    // Periodic progress updates
    if (Math.floor(time) % updateInterval === 0) {
      handleSaveProgress(false);
    }
  };

  const handleSaveProgress = (isFinal: boolean) => {
    const completionPercentage = calculateCompletionPercentage(
      currentTime,
      video.duration
    );

    const watched = isVideoWatched(currentTime, video.duration);

    // In production: save to Firestore
    console.log('Saving video progress:', {
      videoId: video.id,
      userId,
      watchDuration: totalWatchTime,
      completionPercentage,
      currentTime,
      watched,
      isFinal,
    });

    // If video is considered "watched", increment view count
    if (watched && isFinal) {
      // In production: increment video viewCount in Firestore
      console.log('Video completed, incrementing view count');
    }
  };

  const handleVideoPlay = () => {
    setIsTracking(true);
    lastUpdateRef.current = currentTime;
  };

  const handleVideoPause = () => {
    setIsTracking(false);
    handleSaveProgress(false);
  };

  const handleVideoEnd = () => {
    setIsTracking(false);
    handleSaveProgress(true);
  };

  return {
    totalWatchTime,
    currentTime,
    isTracking,
    handleTimeUpdate,
    handleVideoPlay,
    handleVideoPause,
    handleVideoEnd,
  };
};
