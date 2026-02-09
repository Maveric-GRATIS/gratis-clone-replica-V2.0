// ============================================================================
// GRATIS.NGO — Activity Feed Type Definitions
// ============================================================================

export type ActivityType =
  | 'donation_received'
  | 'donation_recurring'
  | 'project_created'
  | 'project_milestone'
  | 'project_completed'
  | 'event_created'
  | 'event_registration'
  | 'partner_joined'
  | 'partner_payout'
  | 'user_joined'
  | 'user_achievement'
  | 'tribe_signup'
  | 'content_published'
  | 'comment_posted'
  | 'system_update'
  | 'goal_reached';

export interface ActivityEntry {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  icon: string;
  color: string;
  actor?: {
    id: string;
    name: string;
    avatar?: string;
    type: 'user' | 'system' | 'partner';
  };
  target?: {
    id: string;
    type: string;
    name: string;
    url?: string;
  };
  metadata?: Record<string, any>;
  visibility: 'public' | 'team' | 'private';
  pinned?: boolean;
  reactions?: { emoji: string; count: number; userIds: string[] }[];
  createdAt: string;
}

export interface ActivityFeedConfig {
  userId?: string;
  types?: ActivityType[];
  visibility?: 'public' | 'team' | 'private';
  since?: string;
  limit?: number;
}

export const ACTIVITY_ICONS: Record<ActivityType, { icon: string; color: string }> = {
  donation_received:  { icon: '💚', color: '#10b981' },
  donation_recurring: { icon: '🔄', color: '#06b6d4' },
  project_created:    { icon: '🚀', color: '#8b5cf6' },
  project_milestone:  { icon: '🏆', color: '#f59e0b' },
  project_completed:  { icon: '✅', color: '#22c55e' },
  event_created:      { icon: '📅', color: '#3b82f6' },
  event_registration: { icon: '🎟️', color: '#6366f1' },
  partner_joined:     { icon: '🤝', color: '#14b8a6' },
  partner_payout:     { icon: '💰', color: '#eab308' },
  user_joined:        { icon: '👋', color: '#ec4899' },
  user_achievement:   { icon: '🏅', color: '#f97316' },
  tribe_signup:       { icon: '⚡', color: '#a855f7' },
  content_published:  { icon: '📝', color: '#64748b' },
  comment_posted:     { icon: '💬', color: '#0ea5e9' },
  system_update:      { icon: '⚙️', color: '#6b7280' },
  goal_reached:       { icon: '🎯', color: '#ef4444' },
};
