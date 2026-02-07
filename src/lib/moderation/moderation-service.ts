// src/lib/moderation/moderation-service.ts
// Content moderation engine with auto-review (client-side)

import type {
  ModerationItem,
  ModerationScore,
  ModerationAction,
  ContentType,
  FlagReason,
  UserTrustScore,
} from '@/types/moderation';
import { db } from '@/firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  arrayUnion,
  Timestamp,
} from 'firebase/firestore';

// Banned words/patterns (basic list, extend as needed)
const BLOCKED_PATTERNS = [
  /\b(scam|phishing|free money|click here to win)\b/i,
  /https?:\/\/[^\s]+\.(tk|ml|ga|cf)\b/i, // Suspicious TLDs
  /(buy now|limited offer|act fast|congratulations you won)/i,
];

const PROFANITY_LIST = new Set([
  // Add your profanity list here
  'placeholder_bad_word',
  'spam_word',
]);

// Score thresholds
const AUTO_APPROVE_THRESHOLD = 0.15;
const AUTO_REJECT_THRESHOLD = 0.85;
const FLAG_REVIEW_THRESHOLD = 0.5;

/**
 * Client-side Moderation Service
 * Note: For production, sensitive operations should be done server-side
 */
export class ModerationService {
  /**
   * Submit content for moderation
   */
  static async submitForReview(params: {
    contentType: ContentType;
    contentId: string;
    content: string;
    authorId: string;
    authorName: string;
  }): Promise<ModerationItem> {
    // Run auto-scoring
    const autoScore = await this.analyzeContent(params.content);

    // Get user trust score
    const trustScore = await this.getUserTrustScore(params.authorId);

    // Determine auto-decision
    let status: ModerationItem['status'] = 'pending';
    let action: ModerationAction | undefined;

    if (autoScore.overall <= AUTO_APPROVE_THRESHOLD && trustScore.level !== 'new') {
      status = 'auto_approved';
      action = 'approve';
    } else if (autoScore.overall >= AUTO_REJECT_THRESHOLD) {
      status = 'rejected';
      action = 'reject';
    } else if (autoScore.overall >= FLAG_REVIEW_THRESHOLD) {
      status = 'flagged';
    }

    const item: Omit<ModerationItem, 'id'> = {
      contentType: params.contentType,
      contentId: params.contentId,
      content: params.content,
      authorId: params.authorId,
      authorName: params.authorName,
      status,
      autoScore,
      flags: [],
      action,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, 'moderation_queue'), item);

    // Update trust score stats
    if (status === 'auto_approved') {
      await this.updateTrustScore(params.authorId, 'approved');
    } else if (status === 'rejected') {
      await this.updateTrustScore(params.authorId, 'rejected');
    }

    return { id: docRef.id, ...item };
  }

  /**
   * Review a moderation item (admin action)
   */
  static async review(
    itemId: string,
    action: ModerationAction,
    reviewerId: string,
    note?: string
  ): Promise<void> {
    const docRef = doc(db, 'moderation_queue', itemId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Moderation item not found');
    }

    const item = docSnap.data() as ModerationItem;

    const statusMap: Record<ModerationAction, ModerationItem['status']> = {
      approve: 'approved',
      reject: 'rejected',
      flag: 'flagged',
      escalate: 'flagged',
      delete: 'rejected',
    };

    await updateDoc(docRef, {
      status: statusMap[action],
      action,
      reviewedBy: reviewerId,
      reviewedAt: new Date().toISOString(),
      reviewNote: note || null,
      updatedAt: new Date().toISOString(),
    });

    // Update user trust score
    if (action === 'approve') {
      await this.updateTrustScore(item.authorId, 'approved');
    } else if (action === 'reject' || action === 'delete') {
      await this.updateTrustScore(item.authorId, 'rejected');
    }

    // If content is approved/rejected, update the original content status
    if (action === 'approve') {
      await this.publishContent(item.contentType, item.contentId);
    } else if (action === 'reject' || action === 'delete') {
      await this.hideContent(item.contentType, item.contentId);
    }
  }

  /**
   * Flag content by a user
   */
  static async flagContent(
    itemId: string,
    reporterId: string,
    reporterName: string,
    reason: FlagReason,
    details?: string
  ): Promise<void> {
    const docRef = doc(db, 'moderation_queue', itemId);

    await updateDoc(docRef, {
      flags: arrayUnion({
        id: `flag_${Date.now()}`,
        reporterId,
        reporterName,
        reason,
        details: details || null,
        createdAt: new Date().toISOString(),
      }),
      status: 'flagged',
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Analyze content for moderation scoring
   */
  static async analyzeContent(content: string): Promise<ModerationScore> {
    const text = content.toLowerCase().trim();
    const scores = {
      spam: 0,
      toxicity: 0,
      profanity: 0,
      harassment: 0,
      hate_speech: 0,
      sexual_content: 0,
      violence: 0,
      self_harm: 0,
    };

    // Pattern matching for spam
    for (const pattern of BLOCKED_PATTERNS) {
      if (pattern.test(text)) {
        scores.spam = Math.min(scores.spam + 0.4, 1);
      }
    }

    // URL density check (high URL count = likely spam)
    const urlCount = (text.match(/https?:\/\//g) || []).length;
    if (urlCount > 3) scores.spam = Math.min(scores.spam + 0.3, 1);

    // Profanity check
    const words = text.split(/\s+/);
    const profanityCount = words.filter((w) =>
      PROFANITY_LIST.has(w.replace(/[^a-z]/g, ''))
    ).length;
    if (profanityCount > 0) {
      scores.profanity = Math.min(profanityCount * 0.2, 1);
    }

    // All caps detection (shouting)
    const upperRatio =
      content.replace(/[^A-Za-z]/g, '').length > 0
        ? (content.match(/[A-Z]/g) || []).length /
          content.replace(/[^A-Za-z]/g, '').length
        : 0;
    if (upperRatio > 0.7 && content.length > 20) {
      scores.toxicity = Math.min(scores.toxicity + 0.2, 1);
    }

    // Repetition detection
    const uniqueWords = new Set(words);
    if (words.length > 5 && uniqueWords.size / words.length < 0.3) {
      scores.spam = Math.min(scores.spam + 0.3, 1);
    }

    // Calculate overall score
    const overall =
      Object.values(scores).reduce((a, b) => a + b, 0) /
      Object.keys(scores).length;

    // Determine auto-decision
    let autoDecision: 'approve' | 'reject' | 'review' = 'review';
    if (overall <= AUTO_APPROVE_THRESHOLD) autoDecision = 'approve';
    else if (overall >= AUTO_REJECT_THRESHOLD) autoDecision = 'reject';

    // Simple sentiment
    const positiveWords = ['thank', 'great', 'amazing', 'love', 'wonderful', 'excellent'];
    const negativeWords = ['hate', 'terrible', 'awful', 'worst', 'disgusting'];
    const posCount = words.filter((w) => positiveWords.includes(w)).length;
    const negCount = words.filter((w) => negativeWords.includes(w)).length;
    const sentiment =
      posCount > negCount ? 'positive' : negCount > posCount ? 'negative' : 'neutral';

    return {
      overall: Math.min(overall, 1),
      categories: scores,
      language: 'en',
      sentiment,
      autoDecision,
      confidence: overall > 0.7 || overall < 0.3 ? 0.9 : 0.6,
    };
  }

  /**
   * Get user trust score
   */
  static async getUserTrustScore(userId: string): Promise<UserTrustScore> {
    const docRef = doc(db, 'user_trust_scores', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserTrustScore;
    }

    // Default for new users
    return {
      userId,
      score: 50,
      level: 'new',
      totalContent: 0,
      approvedContent: 0,
      rejectedContent: 0,
      flagCount: 0,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Update user trust score based on moderation outcome
   */
  private static async updateTrustScore(
    userId: string,
    outcome: 'approved' | 'rejected'
  ): Promise<void> {
    const docRef = doc(db, 'user_trust_scores', userId);
    const docSnap = await getDoc(docRef);

    let score: UserTrustScore;
    if (docSnap.exists()) {
      score = docSnap.data() as UserTrustScore;
    } else {
      score = {
        userId,
        score: 50,
        level: 'new',
        totalContent: 0,
        approvedContent: 0,
        rejectedContent: 0,
        flagCount: 0,
        lastUpdated: new Date().toISOString(),
      };
    }

    score.totalContent++;
    if (outcome === 'approved') {
      score.approvedContent++;
      score.score = Math.min(100, score.score + 2);
    } else {
      score.rejectedContent++;
      score.score = Math.max(0, score.score - 10);
    }

    // Determine trust level
    if (score.score >= 80 && score.approvedContent >= 20) {
      score.level = 'verified';
    } else if (score.score >= 60 && score.approvedContent >= 5) {
      score.level = 'trusted';
    } else if (score.score >= 30) {
      score.level = 'basic';
    } else {
      score.level = 'new';
    }

    score.lastUpdated = new Date().toISOString();
    await setDoc(docRef, score);
  }

  /**
   * Publish approved content
   */
  private static async publishContent(
    contentType: ContentType,
    contentId: string
  ): Promise<void> {
    const collectionMap: Record<ContentType, string> = {
      comment: 'comments',
      bio: 'users',
      project_description: 'projects',
      event_description: 'events',
      message: 'messages',
      review: 'reviews',
      image: 'media',
      report: 'reports',
    };

    const col = collectionMap[contentType];
    if (!col) return;

    try {
      const docRef = doc(db, col, contentId);
      await updateDoc(docRef, {
        moderationStatus: 'approved',
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`Failed to publish ${contentType} ${contentId}:`, error);
    }
  }

  /**
   * Hide rejected content
   */
  private static async hideContent(
    contentType: ContentType,
    contentId: string
  ): Promise<void> {
    const collectionMap: Record<ContentType, string> = {
      comment: 'comments',
      bio: 'users',
      project_description: 'projects',
      event_description: 'events',
      message: 'messages',
      review: 'reviews',
      image: 'media',
      report: 'reports',
    };

    const col = collectionMap[contentType];
    if (!col) return;

    try {
      const docRef = doc(db, col, contentId);
      await updateDoc(docRef, {
        moderationStatus: 'rejected',
        visible: false,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`Failed to hide ${contentType} ${contentId}:`, error);
    }
  }

  /**
   * Get moderation queue items
   */
  static async getQueueItems(
    status?: ModerationItem['status'],
    limitCount: number = 50
  ): Promise<ModerationItem[]> {
    const collectionRef = collection(db, 'moderation_queue');
    let q = query(collectionRef, orderBy('createdAt', 'desc'), limit(limitCount));

    if (status) {
      q = query(
        collectionRef,
        where('status', '==', status),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ModerationItem));
  }
}
