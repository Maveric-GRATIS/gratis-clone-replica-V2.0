/**
 * Gamification Badges Configuration
 * Part 8 - Section 37: 20+ badges across 6 categories
 */

import type { Badge } from '@/types/gamification';

export const BADGES: Omit<Badge, 'createdAt'>[] = [
  // ========== DONATION BADGES ==========
  {
    id: 'first_drop',
    slug: 'first-drop',
    name: 'First Drop',
    description: 'Made your first donation',
    icon: '💧',
    category: 'donation',
    tier: 'bronze',
    points: 10,
    rarity: 'common',
    requirement: {
      type: 'count',
      metric: 'donations',
      threshold: 1,
    },
    isSecret: false,
  },
  {
    id: 'generous_soul',
    slug: 'generous-soul',
    name: 'Generous Soul',
    description: 'Donated €100 or more',
    icon: '💝',
    category: 'donation',
    tier: 'silver',
    points: 50,
    rarity: 'uncommon',
    requirement: {
      type: 'amount',
      metric: 'total_donated',
      threshold: 100,
    },
    isSecret: false,
  },
  {
    id: 'water_champion',
    slug: 'water-champion',
    name: 'Water Champion',
    description: 'Donated €500 or more',
    icon: '🏆',
    category: 'donation',
    tier: 'gold',
    points: 200,
    rarity: 'rare',
    requirement: {
      type: 'amount',
      metric: 'total_donated',
      threshold: 500,
    },
    isSecret: false,
  },
  {
    id: 'philanthropist',
    slug: 'philanthropist',
    name: 'Philanthropist',
    description: 'Donated €1,000 or more',
    icon: '👑',
    category: 'donation',
    tier: 'platinum',
    points: 500,
    rarity: 'epic',
    requirement: {
      type: 'amount',
      metric: 'total_donated',
      threshold: 1000,
    },
    isSecret: false,
  },
  {
    id: 'legend',
    slug: 'legend',
    name: 'Legend',
    description: 'Donated €10,000 or more',
    icon: '🌟',
    category: 'donation',
    tier: 'diamond',
    points: 2000,
    rarity: 'legendary',
    requirement: {
      type: 'amount',
      metric: 'total_donated',
      threshold: 10000,
    },
    isSecret: false,
  },
  {
    id: 'monthly_hero',
    slug: 'monthly-hero',
    name: 'Monthly Hero',
    description: 'Set up a recurring monthly donation',
    icon: '🦸',
    category: 'donation',
    tier: 'gold',
    points: 100,
    rarity: 'uncommon',
    requirement: {
      type: 'count',
      metric: 'subscriptions',
      threshold: 1,
    },
    isSecret: false,
  },

  // ========== ENGAGEMENT BADGES ==========
  {
    id: 'early_bird',
    slug: 'early-bird',
    name: 'Early Bird',
    description: 'One of the first 1000 members',
    icon: '🐦',
    category: 'engagement',
    tier: 'gold',
    points: 100,
    rarity: 'rare',
    requirement: {
      type: 'milestone',
      metric: 'member_number',
      threshold: 1000,
    },
    isSecret: false,
  },
  {
    id: 'bottle_collector',
    slug: 'bottle-collector',
    name: 'Bottle Collector',
    description: 'Ordered 5 different bottle designs',
    icon: '🍼',
    category: 'engagement',
    tier: 'silver',
    points: 75,
    rarity: 'uncommon',
    requirement: {
      type: 'count',
      metric: 'unique_bottles',
      threshold: 5,
    },
    isSecret: false,
  },
  {
    id: 'event_enthusiast',
    slug: 'event-enthusiast',
    name: 'Event Enthusiast',
    description: 'Attended 3 events',
    icon: '🎉',
    category: 'engagement',
    tier: 'silver',
    points: 50,
    rarity: 'uncommon',
    requirement: {
      type: 'count',
      metric: 'events_attended',
      threshold: 3,
    },
    isSecret: false,
  },

  // ========== SOCIAL BADGES ==========
  {
    id: 'connector',
    slug: 'connector',
    name: 'Connector',
    description: 'Referred 3 friends who signed up',
    icon: '🤝',
    category: 'social',
    tier: 'silver',
    points: 75,
    rarity: 'uncommon',
    requirement: {
      type: 'count',
      metric: 'referrals_qualified',
      threshold: 3,
    },
    isSecret: false,
  },
  {
    id: 'influencer',
    slug: 'influencer',
    name: 'Influencer',
    description: 'Referred 10 friends who made donations',
    icon: '⭐',
    category: 'social',
    tier: 'gold',
    points: 200,
    rarity: 'rare',
    requirement: {
      type: 'count',
      metric: 'referrals_donated',
      threshold: 10,
    },
    isSecret: false,
  },

  // ========== LOYALTY BADGES ==========
  {
    id: 'week_warrior',
    slug: 'week-warrior',
    name: 'Week Warrior',
    description: '7-day login streak',
    icon: '🔥',
    category: 'loyalty',
    tier: 'bronze',
    points: 20,
    rarity: 'common',
    requirement: {
      type: 'streak',
      metric: 'login_streak',
      threshold: 7,
    },
    isSecret: false,
  },
  {
    id: 'month_master',
    slug: 'month-master',
    name: 'Month Master',
    description: '30-day login streak',
    icon: '💪',
    category: 'loyalty',
    tier: 'silver',
    points: 100,
    rarity: 'uncommon',
    requirement: {
      type: 'streak',
      metric: 'login_streak',
      threshold: 30,
    },
    isSecret: false,
  },
  {
    id: 'year_veteran',
    slug: 'year-veteran',
    name: 'Year Veteran',
    description: 'Member for 1 year',
    icon: '🎖️',
    category: 'loyalty',
    tier: 'gold',
    points: 200,
    rarity: 'rare',
    requirement: {
      type: 'milestone',
      metric: 'membership_days',
      threshold: 365,
    },
    isSecret: false,
  },

  // ========== IMPACT BADGES ==========
  {
    id: 'life_saver',
    slug: 'life-saver',
    name: 'Life Saver',
    description: 'Your donations provided water to 100 people',
    icon: '💙',
    category: 'impact',
    tier: 'gold',
    points: 150,
    rarity: 'rare',
    requirement: {
      type: 'count',
      metric: 'people_helped',
      threshold: 100,
    },
    isSecret: false,
  },
  {
    id: 'village_hero',
    slug: 'village-hero',
    name: 'Village Hero',
    description: 'Your donations provided water to 1,000 people',
    icon: '🏘️',
    category: 'impact',
    tier: 'platinum',
    points: 500,
    rarity: 'epic',
    requirement: {
      type: 'count',
      metric: 'people_helped',
      threshold: 1000,
    },
    isSecret: false,
  },

  // ========== SECRET/SPECIAL BADGES ==========
  {
    id: 'night_owl',
    slug: 'night-owl',
    name: 'Night Owl',
    description: 'Made a donation at 3 AM',
    icon: '🦉',
    category: 'special',
    tier: 'bronze',
    points: 15,
    rarity: 'uncommon',
    requirement: {
      type: 'event',
      metric: 'donation_time',
      threshold: 3,
    },
    isSecret: true,
  },
  {
    id: 'lucky_seven',
    slug: 'lucky-seven',
    name: 'Lucky Seven',
    description: 'Donated exactly €77.77',
    icon: '🍀',
    category: 'special',
    tier: 'silver',
    points: 77,
    rarity: 'rare',
    requirement: {
      type: 'amount',
      metric: 'exact_donation',
      threshold: 77.77,
    },
    isSecret: true,
  },
  {
    id: 'anniversary',
    slug: 'anniversary',
    name: 'Anniversary',
    description: 'Donated on GRATIS anniversary day',
    icon: '🎂',
    category: 'special',
    tier: 'gold',
    points: 100,
    rarity: 'rare',
    requirement: {
      type: 'event',
      metric: 'anniversary_donation',
      threshold: 1,
    },
    isSecret: true,
  },
];

export const LEVEL_THRESHOLDS = [
  { level: 1, xp: 0, title: 'Newcomer' },
  { level: 2, xp: 100, title: 'Supporter' },
  { level: 3, xp: 250, title: 'Contributor' },
  { level: 4, xp: 500, title: 'Advocate' },
  { level: 5, xp: 1000, title: 'Champion' },
  { level: 6, xp: 2000, title: 'Hero' },
  { level: 7, xp: 3500, title: 'Guardian' },
  { level: 8, xp: 5500, title: 'Protector' },
  { level: 9, xp: 8000, title: 'Legend' },
  { level: 10, xp: 12000, title: 'Icon' },
];

export function getLevelPerks(level: number): string[] {
  const perks: string[] = [];
  if (level >= 2) perks.push('Access to exclusive bottle designs');
  if (level >= 3) perks.push('Early access to events');
  if (level >= 4) perks.push('10% discount on merchandise');
  if (level >= 5) perks.push('Featured supporter badge');
  if (level >= 6) perks.push('Priority customer support');
  if (level >= 7) perks.push('Exclusive quarterly webinars');
  if (level >= 8) perks.push('Personal impact report');
  if (level >= 9) perks.push('VIP event invitations');
  if (level >= 10) perks.push('Lifetime achievement recognition');
  return perks;
}

export function calculateLevel(totalXP: number): { level: number; title: string; currentXP: number; requiredXP: number } {
  let currentLevel = 1;
  let levelXP = 0;

  for (const threshold of LEVEL_THRESHOLDS) {
    if (totalXP >= threshold.xp) {
      currentLevel = threshold.level;
      levelXP = threshold.xp;
    }
  }

  const nextLevelThreshold = LEVEL_THRESHOLDS.find(t => t.level === currentLevel + 1);

  return {
    level: currentLevel,
    title: LEVEL_THRESHOLDS[currentLevel - 1].title,
    currentXP: totalXP - levelXP,
    requiredXP: nextLevelThreshold ? nextLevelThreshold.xp - levelXP : 0,
  };
}
