import { Timestamp } from 'firebase/firestore';

export type TribeTier = 'explorer' | 'insider' | 'core' | 'founder';

export type UserRole = 'user' | 'content_manager' | 'event_manager' | 'support' | 'admin' | 'super_admin';

export type AuthProvider = 'email' | 'google' | 'facebook' | 'apple';

export interface UserAddress {
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface UserPreferences {
  language: string;
  currency: string;
  timezone: string;
  emailNotifications: {
    newsletter: boolean;
    donations: boolean;
    events: boolean;
    impact: boolean;
    voting: boolean;
    marketing: boolean;
  };
  pushNotifications: {
    enabled: boolean;
    events: boolean;
    bottles: boolean;
    impact: boolean;
    voting: boolean;
  };
}

export interface UserMembership {
  tribeTier: TribeTier;
  stripeCustomerId: string | null;
  subscriptionId: string | null;
  subscriptionStatus: 'active' | 'past_due' | 'cancelled' | 'lifetime' | null;
  currentPeriodEnd: Timestamp | null;
  cancelAtPeriodEnd: boolean;
  startedAt: Timestamp | null;
  bottlesClaimedThisMonth: number;
  bottlesAllowedPerMonth: number;
  lastBottleClaimAt: Timestamp | null;
  votingEnabled: boolean;
  founderNumber: number | null;
}

export interface UserImpact {
  totalDonated: number;
  donationsCount: number;
  eventsAttended: number;
  bottlesClaimed: number;
  votesParticipated: number;
  referralsCount: number;
  allocation: {
    water: number;
    arts: number;
    education: number;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  photoURL: string | null;
  phone: string | null;
  dateOfBirth: Timestamp | null;
  bio: string | null;
  company: string | null;
  jobTitle: string | null;
  website: string | null;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  address: UserAddress | null;
  authProvider: AuthProvider;
  emailVerified: boolean;
  role: UserRole;
  membership: UserMembership;
  impact: UserImpact;
  preferences: UserPreferences;
  fcmTokens: string[];
  lastLoginAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  displayName?: string;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  photoURL?: string | null;
  phone?: string | null;
  dateOfBirth?: Date | null;
  bio?: string | null;
  company?: string | null;
  jobTitle?: string | null;
  website?: string | null;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  address?: UserAddress | null;
}

/**
 * Helper to create default user profile
 */
export function createDefaultUserProfile(
  id: string,
  email: string,
  input: CreateUserInput,
  authProvider: AuthProvider = 'email'
): Omit<UserProfile, 'createdAt' | 'updatedAt'> {
  return {
    id,
    email,
    displayName: input.displayName || `${input.firstName} ${input.lastName}`,
    firstName: input.firstName,
    lastName: input.lastName,
    photoURL: null,
    phone: null,
    dateOfBirth: null,
    bio: null,
    company: null,
    jobTitle: null,
    website: null,
    socialLinks: {},
    address: null,
    authProvider,
    emailVerified: false,
    role: 'user',
    membership: {
      tribeTier: 'explorer',
      stripeCustomerId: null,
      subscriptionId: null,
      subscriptionStatus: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      startedAt: null,
      bottlesClaimedThisMonth: 0,
      bottlesAllowedPerMonth: 1,
      lastBottleClaimAt: null,
      votingEnabled: false,
      founderNumber: null,
    },
    impact: {
      totalDonated: 0,
      donationsCount: 0,
      eventsAttended: 0,
      bottlesClaimed: 0,
      votesParticipated: 0,
      referralsCount: 0,
      allocation: {
        water: 40,
        arts: 30,
        education: 30,
      },
    },
    preferences: {
      language: 'en',
      currency: 'EUR',
      timezone: 'Europe/Amsterdam',
      emailNotifications: {
        newsletter: true,
        donations: true,
        events: true,
        impact: true,
        voting: true,
        marketing: false,
      },
      pushNotifications: {
        enabled: true,
        events: true,
        bottles: true,
        impact: true,
        voting: true,
      },
    },
    fcmTokens: [],
    lastLoginAt: null,
  };
}
