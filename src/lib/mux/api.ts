/**
 * Mux API Functions
 *
 * Client-side wrappers for Firebase Cloud Functions that interact with Mux API
 */

import {
  CreateVideoInput,
  UpdateVideoInput,
  VideoUploadProgress,
  LiveStream
} from '@/types/video';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/firebase';

// Initialize Firebase Functions
const functions = getFunctions(app);

/**
 * Create a Mux video asset from a URL
 */
export interface CreateAssetFromUrlParams {
  url: string;
  input: CreateVideoInput;
}

export const createAssetFromUrl = async (
  params: CreateAssetFromUrlParams
): Promise<{ assetId: string; playbackId: string }> => {
  const createAsset = httpsCallable(functions, 'createMuxAsset');

  const result = await createAsset({
    url: params.url,
    metadata: {
      title: params.input.title,
      description: params.input.description,
      category: params.input.category,
    },
    playback_policy: params.input.accessLevel === 'public' ? 'public' : 'signed',
  });

  const data = result.data as any;
  };
};

/**
 * Create a direct upload URL for video files
 */
export interface CreateDirectUploadResponse {
  uploadId: string;
  uploadUrl: string;
  assetId: string;
}

export const createDirectUpload = async (
  input: CreateVideoInput
): Promise<CreateDirectUploadResponse> => {
  const createUpload = httpsCallable(functions, 'createMuxDirectUpload');

  const result = await createUpload({
    metadata: {
      title: input.title,
      description: input.description,
      category: input.category,
    },
    playback_policy: input.accessLevel === 'public' ? 'public' : 'signed',
    new_asset_settings: {
      playback_policy: [input.accessLevel === 'public' ? 'public' : 'signed'],
      mp4_support: 'standard',
    },
  });

  const data = result.data as any;
  return {
    uploadId: data.id,
    uploadUrl: data.url,
    assetId: data.asset_id,
  };
};

/**
 * Upload video file to Mux direct upload URL
 */
export const uploadVideoFile = async (
  file: File,
  uploadUrl: string,
  onProgress?: (progress: number) => void
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const percentComplete = (e.loaded / e.total) * 100;
        onProgress(percentComplete);
      }
    });

    // Handle completion
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    // Handle errors
    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload aborted'));
    });

    // Send the file
    xhr.open('PUT', uploadUrl);
    xhr.send(file);
  });
};

/**
 * Get Mux asset details
 */
export const getMuxAsset = async (assetId: string) => {
  const getAsset = httpsCallable(functions, 'getMuxAsset');
  const result = await getAsset({ asset_id: assetId });
  return result.data;
};

/**
 * Update Mux asset
 */
export const updateMuxAsset = async (
  assetId: string,
  updates: UpdateVideoInput
) => {
  const updateAsset = httpsCallable(functions, 'updateMuxAsset');
  const result = await updateAsset({ asset_id: assetId, updates });
  return result.data;
};

/**
 * Delete Mux asset
 */
export const deleteMuxAsset = async (assetId: string) => {
  const deleteAsset = httpsCallable(functions, 'deleteMuxAsset');
  const result = await deleteAsset({ asset_id: assetId });
  return result.data;
};

/**
 * Create a live stream
 */
export interface CreateLiveStreamParams {
  title: string;
  description: string;
  accessLevel: 'public' | 'members_only' | 'tier_specific';
  recordingEnabled: boolean;
}

export const createLiveStream = async (
  params: CreateLiveStreamParams
): Promise<{
  streamId: string;
  streamKey: string;
  playbackId: string;
}> => {
  const response = await fetch('/api/mux/createLiveStream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      playback_policy: params.accessLevel === 'public' ? 'public' : 'signed',
      new_asset_settings: params.recordingEnabled
        ? {
            playback_policy: [params.accessLevel === 'public' ? 'public' : 'signed'],
          }
        : undefined,
      reconnect_window: 60,
      reduced_latency: true,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create live stream');
  }

  const data = await response.json();
  returncreateStream = httpsCallable(functions, 'createMuxLiveStream');

  const result = await createStream({
    playback_policy: params.accessLevel === 'public' ? 'public' : 'signed',
    new_asset_settings: params.recordingEnabled
      ? {
          playback_policy: [params.accessLevel === 'public' ? 'public' : 'signed'],
        }
      : undefined,
    reconnect_window: 60,
    reduced_latency: true,
  });

  const data = result.data as any;
  return {
    streamId: data.id,
    streamKey: data.stream_key,
    playbackId: data.playback_ids[0].id,
  };
};

/**
 * Get live stream details
 */
export const getLiveStream = async (streamId: string) => {
  const getStream = httpsCallable(functions, 'getMuxLiveStream');
  const result = await getStream({ stream_id: streamId });
  return result.data;
};

/**
 * Delete live stream
 */
export const deleteLiveStream = async (streamId: string) => {
  const deleteStream = httpsCallable(functions, 'deleteMuxLiveStream');
  const result = await deleteStream({ stream_id: streamId });
  return result.data
  if (!response.ok) {
    throw new Error('Failed to add chapters');
  }

  return response.json();
};

/**
 * Add subtitles/transcripts to a video
 */
export interface AddSubtitlesParams {
  assetId: string;
  // Chapters are stored in Firestore, not directly in Mux
  // They will be used by the video player UI
  return { success: true, chapters };
};

/**
 * Add subtitles/transcripts to a video
 */
export interface AddSubtitlesParams {
  assetId: string;
  languageCode: string; // e.g., 'en', 'nl', 'fr'
  name: string; // e.g., 'English', 'Nederlands'
  url: string; // URL to .vtt file
  closedCaptions?: boolean;
}

export const addSubtitles = async (params: AddSubtitlesParams) => {
  const addSubs = httpsCallable(functions, 'addMuxSubtitles');

  const result = await addSubs({
    asset_id: params.assetId,
    language_code: params.languageCode,
    name: params.name,
    url: params.url,
    closed_captions: params.closedCaptions ?? false,
  });

  return result.data;
};

/**
 * Generate signed playback URL (for private videos)
 */
export const generateSignedPlaybackUrl = async (
  playbackId: string,
  expiresIn: number = 3600 // seconds, default 1 hour
): Promise<string> => {
  const generateUrl = httpsCallable(functions, 'generateMuxSignedUrl');

  const result = await generateUrl({
    playback_id: playbackId,
    expires_in: expiresIn,
  });

  const data = result.data as any