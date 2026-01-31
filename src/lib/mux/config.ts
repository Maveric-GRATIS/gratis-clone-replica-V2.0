/**
 * Mux Configuration
 *
 * Configuration for Mux video platform integration
 */

// Mux Environment Key (Data API)
export const MUX_ENVIRONMENT_KEY = import.meta.env.VITE_MUX_ENVIRONMENT_KEY || '';

// Mux Playback Policy
export type MuxPlaybackPolicy = 'public' | 'signed';

// Video Categories
export const VIDEO_CATEGORIES = {
  impact_stories: 'Impact Stories',
  behind_scenes: 'Behind the Scenes',
  educational: 'Educational',
  events: 'Events',
  campaigns: 'Campaigns',
  testimonials: 'Testimonials',
} as const;

export type VideoCategory = keyof typeof VIDEO_CATEGORIES;

// Video Access Levels
export type VideoAccessLevel = 'public' | 'members_only' | 'tier_specific';

// Mux Player Configuration
export const MUX_PLAYER_CONFIG = {
  // Default player theme
  theme: {
    accentColor: '#C1FF00',
    primaryColor: '#FFFFFF',
    secondaryColor: '#0D0D0D',
  },
  // Player features
  features: {
    playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
    quality: ['auto', '1080p', '720p', '480p', '360p'],
    captions: true,
    thumbnails: true,
  },
} as const;

// Video Quality Presets
export const VIDEO_QUALITY_PRESETS = {
  high: {
    width: 1920,
    height: 1080,
    bitrate: 5000,
  },
  medium: {
    width: 1280,
    height: 720,
    bitrate: 2500,
  },
  low: {
    width: 854,
    height: 480,
    bitrate: 1000,
  },
} as const;

// Get Mux Image URL
export const getMuxImageUrl = (
  playbackId: string,
  options?: {
    time?: number; // Thumbnail at specific time (seconds)
    width?: number;
    height?: number;
    fit_mode?: 'preserve' | 'crop' | 'smartcrop' | 'pad';
  }
): string => {
  const params = new URLSearchParams();

  if (options?.time !== undefined) {
    params.append('time', options.time.toString());
  }
  if (options?.width) {
    params.append('width', options.width.toString());
  }
  if (options?.height) {
    params.append('height', options.height.toString());
  }
  if (options?.fit_mode) {
    params.append('fit_mode', options.fit_mode);
  }

  const query = params.toString();
  return `https://image.mux.com/${playbackId}/thumbnail.jpg${query ? `?${query}` : ''}`;
};

// Get Mux GIF URL
export const getMuxGifUrl = (
  playbackId: string,
  options?: {
    start?: number;
    end?: number;
    width?: number;
    height?: number;
    fps?: number;
  }
): string => {
  const params = new URLSearchParams();

  if (options?.start !== undefined) {
    params.append('start', options.start.toString());
  }
  if (options?.end !== undefined) {
    params.append('end', options.end.toString());
  }
  if (options?.width) {
    params.append('width', options.width.toString());
  }
  if (options?.height) {
    params.append('height', options.height.toString());
  }
  if (options?.fps) {
    params.append('fps', options.fps.toString());
  }

  const query = params.toString();
  return `https://image.mux.com/${playbackId}/animated.gif${query ? `?${query}` : ''}`;
};

// Check if Mux is configured
export const isMuxConfigured = (): boolean => {
  return Boolean(MUX_ENVIRONMENT_KEY);
};
