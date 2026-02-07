// src/types/moderation.ts
// Content moderation types

export type ModerationStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'flagged'
  | 'auto_approved';

export type ModerationAction = 'approve' | 'reject' | 'flag' | 'escalate' | 'delete';

export type ContentType =
  | 'comment'
  | 'bio'
  | 'project_description'
  | 'event_description'
  | 'message'
  | 'review'
  | 'image'
  | 'report';

export type FlagReason =
  | 'spam'
  | 'harassment'
  | 'hate_speech'
  | 'violence'
  | 'sexual_content'
  | 'misinformation'
  | 'copyright'
  | 'other';

export interface ModerationItem {
  id: string;
  contentType: ContentType;
  contentId: string;
  content: string;
  authorId: string;
  authorName: string;
  status: ModerationStatus;
  autoScore?: ModerationScore;
  flags: ContentFlag[];
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNote?: string;
  action?: ModerationAction;
  createdAt: string;
  updatedAt: string;
}

export interface ModerationScore {
  overall: number; // 0-1, higher = more likely problematic
  categories: {
    spam: number;
    toxicity: number;
    profanity: number;
    harassment: number;
    hate_speech: number;
    sexual_content: number;
    violence: number;
    self_harm: number;
  };
  language: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  autoDecision: 'approve' | 'reject' | 'review';
  confidence: number;
}

export interface ContentFlag {
  id: string;
  reporterId: string;
  reporterName: string;
  reason: FlagReason;
  details?: string;
  createdAt: string;
}

export interface ModerationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  type: 'keyword' | 'regex' | 'score_threshold' | 'flag_count' | 'user_trust';
  config: Record<string, unknown>;
  action: ModerationAction;
  priority: number;
  createdAt: string;
}

export interface ModerationStats {
  pending: number;
  approved: number;
  rejected: number;
  flagged: number;
  autoApproved: number;
  totalToday: number;
  averageReviewTime: number;
  topReasons: { reason: string; count: number }[];
}

export interface UserTrustScore {
  userId: string;
  score: number; // 0-100
  level: 'new' | 'basic' | 'trusted' | 'verified';
  totalContent: number;
  approvedContent: number;
  rejectedContent: number;
  flagCount: number;
  lastUpdated: string;
}
