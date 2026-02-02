// =============================================================================
// SOCIAL TYPES
// =============================================================================

import type { Timestamp } from 'firebase/firestore';

/**
 * Activity types
 */
export type ActivityType =
  | 'bottle_ordered'
  | 'bottle_delivered'
  | 'donation_made'
  | 'achievement_unlocked'
  | 'tribe_joined'
  | 'tribe_upgraded'
  | 'event_registered'
  | 'event_attended'
  | 'impact_milestone'
  | 'referral_success'
  | 'project_voted'
  | 'comment_added'
  | 'profile_updated';

/**
 * Activity feed item
 */
export interface ActivityItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userTier: string;

  type: ActivityType;
  title: string;
  description: string;

  // Associated data
  metadata: {
    bottleId?: string;
    bottleName?: string;
    donationAmount?: number;
    achievementName?: string;
    achievementIcon?: string;
    eventId?: string;
    eventName?: string;
    projectId?: string;
    projectName?: string;
    impactValue?: number;
    impactUnit?: string;
  };

  // Visibility
  isPublic: boolean;
  visibleTo: 'everyone' | 'tribe_only' | 'followers' | 'private';

  // Engagement
  likes: number;
  comments: number;
  shares: number;
  likedBy: string[];

  // Timestamps
  createdAt: Timestamp | Date;
}

/**
 * Comment on activity
 */
export interface ActivityComment {
  id: string;
  activityId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userTier: string;

  content: string;

  // Engagement
  likes: number;
  likedBy: string[];

  // Reply
  parentCommentId?: string;
  replyCount: number;

  // Moderation
  isHidden: boolean;
  isReported: boolean;

  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

/**
 * User follow relationship
 */
export interface UserFollow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Timestamp;
}

/**
 * Leaderboard entry
 */
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  userTier: string;
  score: number;
  previousRank?: number;
  change: 'up' | 'down' | 'same' | 'new';
}
