// src/types/platform-config.ts
// Platform configuration types

export interface PlatformConfig {
  id: string;
  environment: 'development' | 'staging' | 'production';

  // Site Settings
  siteName: string;
  siteUrl: string;
  supportEmail: string;
  maintenanceMode: boolean;

  // Features
  features: {
    videoUpload: boolean;
    liveStreaming: boolean;
    subscriptions: boolean;
    donations: boolean;
    marketplace: boolean;
    messaging: boolean;
    apiAccess: boolean;
  };

  // Limits
  limits: {
    maxVideoSize: number; // in MB
    maxVideoDuration: number; // in seconds
    maxVideosPerMonth: {
      free: number;
      basic: number;
      pro: number;
      enterprise: number;
    };
    maxStoragePerUser: number; // in GB
    apiRateLimit: number; // requests per minute
  };

  // Security
  security: {
    sessionTimeout: number; // in minutes
    passwordMinLength: number;
    requireEmailVerification: boolean;
    require2FA: boolean;
    allowedFileTypes: string[];
    maxLoginAttempts: number;
  };

  // Payment
  payment: {
    stripeEnabled: boolean;
    stripeLiveMode: boolean;
    currency: string;
    processingFee: number; // percentage
    minimumDonation: number;
  };

  // Email
  email: {
    provider: 'sendgrid' | 'mailgun' | 'ses';
    fromAddress: string;
    fromName: string;
    replyTo: string;
  };

  // CDN & Storage
  storage: {
    provider: 'firebase' | 'aws-s3' | 'gcs';
    cdnEnabled: boolean;
    cdnUrl?: string;
  };

  // Analytics
  analytics: {
    enabled: boolean;
    googleAnalyticsId?: string;
    mixpanelToken?: string;
  };

  // Social
  social: {
    facebookAppId?: string;
    twitterHandle?: string;
    linkedinPage?: string;
  };

  updatedAt: string;
  updatedBy: string;
}

export interface ConfigUpdateRequest {
  section: keyof PlatformConfig;
  data: Partial<PlatformConfig[keyof PlatformConfig]>;
}
