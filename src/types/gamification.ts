/**
 * Gamification System Types
 * Part 8 - Section 37: Badges, Achievements, Levels, Streaks
 */

export interface Badge {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  tier: BadgeTier;
  points: number;
  rarity: BadgeRarity;
  requirement: BadgeRequirement;
  isSecret: boolean;
  createdAt: Date;
}

export type BadgeCategory =
  | 'donation'
  | 'engagement'
  | 'impact'
  | 'social'
  | 'loyalty'
  | 'special';

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface BadgeRequirement {
  type: 'count' | 'amount' | 'streak' | 'milestone' | 'event';
  metric: string;
  threshold: number;
  timeframe?: 'day' | 'week' | 'month' | 'year' | 'all_time';
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  badge: Badge;
  earnedAt: Date;
  progress?: number;
  isDisplayed: boolean;
}

export interface UserLevel {
  level: number;
  title: string;
  currentXP: number;
  requiredXP: number;
  totalXP: number;
  perks: string[];
}

export interface Streak {
  id: string;
  userId: string;
  type: 'login' | 'donation' | 'engagement';
  currentStreak: number;
  longestStreak: number;
  lastActivityAt: Date;
  streakStartedAt: Date;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  requirement: BadgeRequirement;
  rewards: {
    xp: number;
    badges?: string[];
    points?: number;
  };
  startDate: Date;
  endDate: Date;
  participants: number;
  completions: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatar?: string;
  score: number;
  level: number;
  change: number;
}

export interface UserStats {
  userId: string;
  totalXP: number;
  level: number;
  badges: UserBadge[];
  streaks: {
    login: {
      current: number;
      best: number;
      lastDate: string | null;
    };
    donation: {
      current: number;
      best: number;
      lastDate: string | null;
    };
    engagement: {
      current: number;
      best: number;
      lastDate: string | null;
    };
  };
  stats: {
    totalDonations: number;
    totalAmount: number;
    projectsSupported: number;
    referrals: number;
    eventsAttended: number;
    postsCreated: number;
    commentsCreated: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

