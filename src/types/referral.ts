// =============================================================================
// REFERRAL TYPES
// =============================================================================

/**
 * Referral status
 */
export type ReferralStatus =
  | "pending"
  | "registered"
  | "qualified"
  | "rewarded"
  | "expired";

/**
 * Referral record
 */
export interface Referral {
  id: string;
  referrerId: string;
  referrerCode: string;

  // Referred user
  referredUserId?: string;
  referredEmail: string;
  referredName?: string;

  // Status tracking
  status: ReferralStatus;
  clickCount: number;

  // Qualification criteria
  qualificationCriteria: {
    hasOrdered: boolean;
    hasJoinedTribe: boolean;
    hasDonated: boolean;
    minimumSpend?: number;
    spentAmount: number;
  };

  // Rewards
  referrerReward?: {
    type: "bottle" | "discount" | "donation_credit";
    value: number;
    claimed: boolean;
    claimedAt?: Date;
  };
  referredReward?: {
    type: "bottle" | "discount" | "donation_credit";
    value: number;
    claimed: boolean;
    claimedAt?: Date;
  };

  // Timestamps
  invitedAt: Date;
  registeredAt?: Date;
  qualifiedAt?: Date;
  rewardedAt?: Date;
  expiresAt: Date;
}

/**
 * User referral stats
 */
export interface ReferralStats {
  totalReferrals: number;
  pendingReferrals: number;
  qualifiedReferrals: number;
  rewardedReferrals: number;
  totalRewardsEarned: number;
  currentStreak: number;
  bestStreak: number;
}

/**
 * Reward tier
 */
export interface RewardTier {
  referrals: number;
  reward: string;
  icon: string;
  unlocked: boolean;
}
