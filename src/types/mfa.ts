// src/types/mfa.ts
// Multi-Factor Authentication types

export type MFAMethod = 'totp' | 'sms' | 'email' | 'backup_codes';
export type MFAStatus = 'disabled' | 'pending_setup' | 'enabled';

export interface MFAConfig {
  userId: string;
  status: MFAStatus;
  methods: MFAMethodConfig[];
  backupCodes: BackupCode[];
  lastVerifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MFAMethodConfig {
  method: MFAMethod;
  enabled: boolean;
  primary: boolean;
  verifiedAt?: string;
  metadata?: Record<string, string>;
}

export interface TOTPSetup {
  secret: string;
  uri: string;
  qrCode: string; // base64 data URL
  backupCodes: string[];
}

export interface BackupCode {
  code: string;
  usedAt?: string;
}

export interface MFAChallenge {
  id: string;
  userId: string;
  method: MFAMethod;
  expiresAt: string;
  verified: boolean;
  attempts: number;
  maxAttempts: number;
  createdAt: string;
}

export interface MFAVerifyRequest {
  challengeId: string;
  code: string;
  method: MFAMethod;
}

export interface MFAVerifyResponse {
  success: boolean;
  token?: string;
  error?: string;
  remainingAttempts?: number;
}

export interface TrustedDevice {
  id: string;
  userId: string;
  deviceName: string;
  deviceType: string;
  lastUsed: string;
  ipAddress?: string;
  userAgent?: string;
  trusted: boolean;
  createdAt: string;
}
