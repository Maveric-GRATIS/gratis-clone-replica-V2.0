// src/lib/auth/mfa-service.ts
// Multi-Factor Authentication service (client-side)

import type {
  MFAConfig,
  TOTPSetup,
  BackupCode,
  MFAChallenge,
  MFAVerifyResponse,
} from '@/types/mfa';
import { db } from '@/firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';
import { TOTP } from 'otplib';

// Create TOTP instance
const totp = new TOTP();

// Create authenticator instance
const authenticator = {
  generateSecret: (length: number = 32): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'; // Base32 characters
    let secret = '';
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      secret += chars[array[i] % chars.length];
    }
    return secret;
  },
  keyuri: (user: string, service: string, secret: string): string => {
    return `otpauth://totp/${encodeURIComponent(service)}:${encodeURIComponent(user)}?secret=${secret}&issuer=${encodeURIComponent(service)}`;
  },
  verify: async ({ token, secret }: { token: string; secret: string }): Promise<boolean> => {
    try {
      // Generate current token and compare
      const currentToken = await totp.generate({ secret });
      return token === currentToken;
    } catch {
      return false;
    }
  },
};

/**
 * Client-side MFA Service
 * Note: For production, sensitive operations should be done server-side
 */
export class MFAService {
  /**
   * Initialize TOTP setup for a user
   */
  static async setupTOTP(userId: string, userEmail: string): Promise<TOTPSetup> {
    const secret = authenticator.generateSecret(32);
    const uri = authenticator.keyuri(userEmail, 'GRATIS.NGO', secret);

    // Generate backup codes
    const backupCodes = this.generateBackupCodes(10);

    // Store pending setup (not yet verified)
    await setDoc(
      doc(db, 'mfa_configs', userId),
      {
        userId,
        status: 'pending_setup',
        pendingSecret: this.encryptSecret(secret),
        backupCodes: backupCodes.map((code) => ({
          code: this.hashCode(code),
          usedAt: null,
        })),
        methods: [
          {
            method: 'totp',
            enabled: false,
            primary: true,
          },
        ],
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // Generate QR code as data URL (using external API for simplicity)
    const qrCode = await this.generateQRDataUrl(uri);

    return {
      secret,
      uri,
      qrCode,
      backupCodes,
    };
  }

  /**
   * Verify TOTP setup with initial code
   */
  static async verifySetup(
    userId: string,
    code: string
  ): Promise<{ success: boolean; error?: string }> {
    const configRef = doc(db, 'mfa_configs', userId);
    const configSnap = await getDoc(configRef);

    if (!configSnap.exists()) {
      return { success: false, error: 'MFA not configured' };
    }

    const config = configSnap.data() as MFAConfig & { pendingSecret?: string };

    if (config.status !== 'pending_setup') {
      return { success: false, error: 'MFA already enabled or not in setup' };
    }

    const secret = this.decryptSecret(config.pendingSecret || '');
    const isValid = await authenticator.verify({ token: code, secret });

    if (!isValid) {
      return { success: false, error: 'Invalid verification code' };
    }

    // Activate MFA
    await updateDoc(configRef, {
      status: 'enabled',
      secret: config.pendingSecret, // Keep encrypted
      pendingSecret: null,
      methods: [
        {
          method: 'totp',
          enabled: true,
          primary: true,
          verifiedAt: new Date().toISOString(),
        },
      ],
      lastVerifiedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Update user profile
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      mfaEnabled: true,
      updatedAt: new Date().toISOString(),
    });

    return { success: true };
  }

  /**
   * Create an MFA challenge for login
   */
  static async createChallenge(userId: string): Promise<MFAChallenge | null> {
    const configSnap = await getDoc(doc(db, 'mfa_configs', userId));

    if (!configSnap.exists() || configSnap.data()?.status !== 'enabled') {
      return null;
    }

    const challenge: Omit<MFAChallenge, 'id'> = {
      userId,
      method: 'totp',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
      verified: false,
      attempts: 0,
      maxAttempts: 5,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, 'mfa_challenges'), challenge);
    return { id: docRef.id, ...challenge };
  }

  /**
   * Verify an MFA challenge with user code
   */
  static async verifyChallenge(
    challengeId: string,
    code: string
  ): Promise<MFAVerifyResponse> {
    const challengeRef = doc(db, 'mfa_challenges', challengeId);
    const challengeSnap = await getDoc(challengeRef);

    if (!challengeSnap.exists()) {
      return { success: false, error: 'Challenge not found' };
    }

    const challenge = challengeSnap.data() as MFAChallenge;

    // Check expiration
    if (new Date(challenge.expiresAt) < new Date()) {
      await deleteDoc(challengeRef);
      return { success: false, error: 'Challenge expired' };
    }

    // Check attempts
    if (challenge.attempts >= challenge.maxAttempts) {
      await deleteDoc(challengeRef);
      return { success: false, error: 'Too many attempts', remainingAttempts: 0 };
    }

    // Increment attempts
    await updateDoc(challengeRef, {
      attempts: challenge.attempts + 1,
    });

    // Get MFA config
    const configSnap = await getDoc(doc(db, 'mfa_configs', challenge.userId));
    if (!configSnap.exists()) {
      return { success: false, error: 'MFA configuration not found' };
    }

    const config = configSnap.data() as MFAConfig & { secret?: string };
    const secret = this.decryptSecret(config.secret || '');

    // Check TOTP code
    const isValidTOTP = await authenticator.verify({ token: code, secret });
    if (isValidTOTP) {
      await updateDoc(challengeRef, { verified: true });

      // Generate MFA verification token
      const token = this.generateVerificationToken();

      return { success: true, token };
    }

    // Check backup codes
    const backupCodeIndex = config.backupCodes.findIndex(
      (bc: BackupCode) => !bc.usedAt && this.verifyHashedCode(code, bc.code)
    );

    if (backupCodeIndex >= 0) {
      // Mark backup code as used
      const updatedCodes = [...config.backupCodes];
      updatedCodes[backupCodeIndex].usedAt = new Date().toISOString();
      await updateDoc(doc(db, 'mfa_configs', challenge.userId), {
        backupCodes: updatedCodes,
      });

      await updateDoc(challengeRef, { verified: true });

      const token = this.generateVerificationToken();
      return { success: true, token };
    }

    const remaining = challenge.maxAttempts - challenge.attempts - 1;
    return {
      success: false,
      error: 'Invalid code',
      remainingAttempts: remaining,
    };
  }

  /**
   * Disable MFA for a user
   */
  static async disableMFA(userId: string, verificationCode: string): Promise<boolean> {
    // First verify the code
    const challenge = await this.createChallenge(userId);
    if (!challenge) {
      return false;
    }

    const verifyResult = await this.verifyChallenge(challenge.id, verificationCode);
    if (!verifyResult.success) {
      return false;
    }

    // Now disable MFA
    await updateDoc(doc(db, 'mfa_configs', userId), {
      status: 'disabled',
      methods: [],
      updatedAt: new Date().toISOString(),
    });

    await updateDoc(doc(db, 'users', userId), {
      mfaEnabled: false,
      updatedAt: new Date().toISOString(),
    });

    return true;
  }

  /**
   * Check if user has MFA enabled
   */
  static async isMFAEnabled(userId: string): Promise<boolean> {
    const docSnap = await getDoc(doc(db, 'mfa_configs', userId));
    return docSnap.exists() && docSnap.data()?.status === 'enabled';
  }

  /**
   * Get MFA config for user
   */
  static async getMFAConfig(userId: string): Promise<MFAConfig | null> {
    const docSnap = await getDoc(doc(db, 'mfa_configs', userId));
    if (!docSnap.exists()) {
      return null;
    }
    return docSnap.data() as MFAConfig;
  }

  /**
   * Regenerate backup codes
   */
  static async regenerateBackupCodes(
    userId: string,
    verificationCode: string
  ): Promise<string[] | null> {
    // First verify the code
    const challenge = await this.createChallenge(userId);
    if (!challenge) {
      return null;
    }

    const verifyResult = await this.verifyChallenge(challenge.id, verificationCode);
    if (!verifyResult.success) {
      return null;
    }

    const codes = this.generateBackupCodes(10);

    await updateDoc(doc(db, 'mfa_configs', userId), {
      backupCodes: codes.map((code) => ({
        code: this.hashCode(code),
        usedAt: null,
      })),
      updatedAt: new Date().toISOString(),
    });

    return codes;
  }

  // -- Private helpers --

  private static generateBackupCodes(count: number): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      const bytes = new Uint8Array(4);
      crypto.getRandomValues(bytes);
      const code = Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase();
      codes.push(`${code.slice(0, 4)}-${code.slice(4)}`);
    }
    return codes;
  }

  private static hashCode(code: string): string {
    // Simple hash for client-side (in production, do this server-side)
    const normalized = code.replace(/[-\s]/g, '').toLowerCase();
    return btoa(normalized); // Base64 encoding for simplicity
  }

  private static verifyHashedCode(input: string, hash: string): boolean {
    const inputHash = this.hashCode(input);
    return inputHash === hash;
  }

  private static encryptSecret(text: string): string {
    // Simple obfuscation (in production, use proper encryption server-side)
    return btoa(text);
  }

  private static decryptSecret(encryptedText: string): string {
    // Simple deobfuscation
    try {
      return atob(encryptedText);
    } catch {
      return '';
    }
  }

  private static generateVerificationToken(): string {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private static async generateQRDataUrl(uri: string): Promise<string> {
    // Use external QR code generation API
    const encodedUri = encodeURIComponent(uri);
    return `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodedUri}`;
  }
}
