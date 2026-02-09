// ============================================================================
// GRATIS.NGO — Social Auth Type Definitions
// ============================================================================

export type SocialProvider =
  | 'google'
  | 'facebook'
  | 'apple'
  | 'github'
  | 'twitter'
  | 'linkedin'
  | 'microsoft';

export interface SocialAuthConfig {
  provider: SocialProvider;
  enabled: boolean;
  clientId: string;
  displayName: string;
  icon: string;
  color: string;
  scopes: string[];
}

export interface SocialProfile {
  provider: SocialProvider;
  providerId: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  locale?: string;
  verified: boolean;
  raw?: Record<string, unknown>;
}

export interface LinkedAccount {
  provider: SocialProvider;
  providerId: string;
  email: string;
  name: string;
  avatar?: string;
  linkedAt: string;
  lastUsed?: string;
}

export interface AuthResult {
  success: boolean;
  isNewUser: boolean;
  userId: string;
  email: string;
  token?: string;
  linkedAccounts: LinkedAccount[];
  error?: string;
}

export const SOCIAL_PROVIDERS: SocialAuthConfig[] = [
  {
    provider: 'google',
    enabled: true,
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    displayName: 'Google',
    icon: 'google',
    color: '#4285F4',
    scopes: ['email', 'profile'],
  },
  {
    provider: 'facebook',
    enabled: true,
    clientId: import.meta.env.VITE_FACEBOOK_APP_ID || '',
    displayName: 'Facebook',
    icon: 'facebook',
    color: '#1877F2',
    scopes: ['email', 'public_profile'],
  },
  {
    provider: 'apple',
    enabled: true,
    clientId: import.meta.env.VITE_APPLE_CLIENT_ID || '',
    displayName: 'Apple',
    icon: 'apple',
    color: '#000000',
    scopes: ['email', 'name'],
  },
  {
    provider: 'github',
    enabled: false,
    clientId: import.meta.env.VITE_GITHUB_CLIENT_ID || '',
    displayName: 'GitHub',
    icon: 'github',
    color: '#333333',
    scopes: ['user:email'],
  },
  {
    provider: 'twitter',
    enabled: false,
    clientId: import.meta.env.VITE_TWITTER_CLIENT_ID || '',
    displayName: 'X / Twitter',
    icon: 'twitter',
    color: '#1DA1F2',
    scopes: ['tweet.read', 'users.read'],
  },
  {
    provider: 'linkedin',
    enabled: false,
    clientId: import.meta.env.VITE_LINKEDIN_CLIENT_ID || '',
    displayName: 'LinkedIn',
    icon: 'linkedin',
    color: '#0A66C2',
    scopes: ['openid', 'profile', 'email'],
  },
  {
    provider: 'microsoft',
    enabled: false,
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID || '',
    displayName: 'Microsoft',
    icon: 'microsoft',
    color: '#00A4EF',
    scopes: ['openid', 'profile', 'email'],
  },
];
