// =============================================================================
// NOTIFICATION TYPES
// =============================================================================

export type NotificationType =
  | 'order'
  | 'donation'
  | 'tribe'
  | 'referral'
  | 'project'
  | 'event'
  | 'system';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  priority: NotificationPriority;

  title: string;
  message: string;

  // Optional data
  actionUrl?: string;
  actionLabel?: string;
  imageUrl?: string;

  // Metadata
  read: boolean;
  archived: boolean;

  // Timestamps
  createdAt: Date;
  readAt?: Date;
}

export interface NotificationPreferences {
  userId: string;

  // Email preferences
  email: {
    enabled: boolean;
    orderUpdates: boolean;
    donationReceipts: boolean;
    tribeUpdates: boolean;
    referralRewards: boolean;
    projectUpdates: boolean;
    eventReminders: boolean;
    newsletter: boolean;
  };

  // Push preferences
  push: {
    enabled: boolean;
    orderUpdates: boolean;
    donationReceipts: boolean;
    tribeUpdates: boolean;
    referralRewards: boolean;
    projectUpdates: boolean;
    eventReminders: boolean;
  };

  // In-app preferences
  inApp: {
    enabled: boolean;
    showBadge: boolean;
    playSound: boolean;
  };

  updatedAt: Date;
}

export interface NotificationTemplate {
  type: NotificationType;
  title: string;
  message: string;
  actionLabel?: string;
}

export const NOTIFICATION_TEMPLATES: Record<string, NotificationTemplate> = {
  // Order notifications
  'order.created': {
    type: 'order',
    title: 'Order Confirmed! 🎉',
    message: 'Your order #{orderNumber} has been confirmed. We\'ll notify you when it ships.',
    actionLabel: 'View Order',
  },
  'order.shipped': {
    type: 'order',
    title: 'Order Shipped! 📦',
    message: 'Your order #{orderNumber} is on its way! Track your delivery.',
    actionLabel: 'Track Shipment',
  },
  'order.delivered': {
    type: 'order',
    title: 'Order Delivered! ✅',
    message: 'Your order #{orderNumber} has been delivered. Enjoy!',
    actionLabel: 'View Order',
  },

  // Donation notifications
  'donation.success': {
    type: 'donation',
    title: 'Thank You! 💚',
    message: 'Your donation of {amount} has been processed. You\'re making a difference!',
    actionLabel: 'View Impact',
  },
  'donation.recurring': {
    type: 'donation',
    title: 'Monthly Donation Processed',
    message: 'Your recurring donation of {amount} has been processed. Thank you for your continued support!',
    actionLabel: 'Manage Donations',
  },

  // TRIBE notifications
  'tribe.welcome': {
    type: 'tribe',
    title: 'Welcome to TRIBE! 👑',
    message: 'You\'re now a TRIBE member! Start voting on impact projects and enjoy exclusive benefits.',
    actionLabel: 'Explore Benefits',
  },
  'tribe.vote_open': {
    type: 'tribe',
    title: 'New Project Vote Open! 🗳️',
    message: 'A new impact project "{projectName}" is open for voting. Cast your vote now!',
    actionLabel: 'Vote Now',
  },
  'tribe.vote_closing': {
    type: 'tribe',
    title: 'Vote Closing Soon! ⏰',
    message: 'Voting for "{projectName}" closes in 24 hours. Make your voice heard!',
    actionLabel: 'Vote Now',
  },

  // Referral notifications
  'referral.registered': {
    type: 'referral',
    title: 'Friend Joined! 🎊',
    message: '{friendName} joined using your referral link!',
    actionLabel: 'View Referrals',
  },
  'referral.qualified': {
    type: 'referral',
    title: 'Referral Qualified! ⭐',
    message: '{friendName} made their first order. You\'ve earned a reward!',
    actionLabel: 'Claim Reward',
  },
  'referral.reward': {
    type: 'referral',
    title: 'Reward Unlocked! 🎁',
    message: 'You\'ve earned a {rewardType}! Check your rewards.',
    actionLabel: 'View Rewards',
  },

  // Project notifications
  'project.update': {
    type: 'project',
    title: 'Project Update: {projectName}',
    message: 'New update from the "{projectName}" project you supported!',
    actionLabel: 'Read Update',
  },
  'project.completed': {
    type: 'project',
    title: 'Project Completed! 🎯',
    message: 'The "{projectName}" project you supported has been completed. See the impact!',
    actionLabel: 'View Impact',
  },

  // Event notifications
  'event.reminder': {
    type: 'event',
    title: 'Event Reminder 📅',
    message: '"{eventName}" starts in {timeUntil}. Don\'t miss it!',
    actionLabel: 'View Event',
  },
  'event.cancelled': {
    type: 'event',
    title: 'Event Cancelled',
    message: 'Unfortunately, "{eventName}" has been cancelled. We apologize for the inconvenience.',
    actionLabel: 'Browse Events',
  },

  // System notifications
  'system.maintenance': {
    type: 'system',
    title: 'Scheduled Maintenance',
    message: 'We\'ll be performing maintenance on {date}. Services may be temporarily unavailable.',
    actionLabel: 'Learn More',
  },
  'system.security': {
    type: 'system',
    title: 'Security Alert 🔒',
    message: 'We detected a login from a new device. If this wasn\'t you, secure your account immediately.',
    actionLabel: 'Secure Account',
  },
};
