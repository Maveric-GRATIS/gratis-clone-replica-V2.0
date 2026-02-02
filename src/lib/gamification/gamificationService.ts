import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  increment
} from "firebase/firestore";
import { db } from "@/firebase";
import { Badge, UserBadge, UserLevel, Streak, UserStats, Challenge } from "@/types/gamification";
import { BADGES, LEVEL_THRESHOLDS, calculateLevel, getLevelPerks } from "./badges";

export class GamificationService {

  /**
   * Initialize user gamification profile
   */
  static async initializeUserProfile(userId: string): Promise<void> {
    const userRef = doc(db, "gamification", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      const initialData: UserStats = {
        userId,
        totalXP: 0,
        level: 1,
        badges: [],
        streaks: {
          login: {
            current: 0,
            best: 0,
            lastDate: null
          },
          donation: {
            current: 0,
            best: 0,
            lastDate: null
          },
          engagement: {
            current: 0,
            best: 0,
            lastDate: null
          }
        },
        stats: {
          totalDonations: 0,
          totalAmount: 0,
          projectsSupported: 0,
          referrals: 0,
          eventsAttended: 0,
          postsCreated: 0,
          commentsCreated: 0
        },
      createdAt: Timestamp.now().toDate(),
      updatedAt: Timestamp.now().toDate()
    };

    await setDoc(userRef, initialData);
  }
}
  static async getUserStats(userId: string): Promise<UserStats | null> {
    const userRef = doc(db, "gamification", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return null;
    }

    return userDoc.data() as UserStats;
  }

  /**
   * Add XP to user and check for level up
   */
  static async addXP(userId: string, amount: number, reason: string): Promise<{ leveledUp: boolean; newLevel?: any }> {
    const userRef = doc(db, "gamification", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      await this.initializeUserProfile(userId);
    }

    const currentData = userDoc.data() as UserStats;
    const newTotalXP = currentData.totalXP + amount;
    const oldLevel = currentData.level;
    const newLevel = calculateLevel(newTotalXP);

    await updateDoc(userRef, {
      totalXP: increment(amount),
      level: newLevel.level,
      updatedAt: Timestamp.now()
    });

    // Log XP transaction
    await this.logXPTransaction(userId, amount, reason);

    // Check for level-based badges
    if (newLevel.level > oldLevel) {
      await this.checkLevelBadges(userId, newLevel.level);
      return { leveledUp: true, newLevel };
    }

    return { leveledUp: false };
  }

  /**
   * Log XP transaction for history
   */
  private static async logXPTransaction(userId: string, amount: number, reason: string): Promise<void> {
    const transactionRef = doc(collection(db, "gamification", userId, "xpHistory"));
    await setDoc(transactionRef, {
      amount,
      reason,
      timestamp: Timestamp.now()
    });
  }

  /**
   * Award a badge to user
   */
  static async awardBadge(userId: string, badgeId: string): Promise<boolean> {
    const userRef = doc(db, "gamification", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return false;
    }

    const userData = userDoc.data() as UserStats;
    const hasBadge = userData.badges.some(b => b.badgeId === badgeId);

    if (hasBadge) {
      return false; // Already has badge
    }

    const badge = BADGES.find(b => b.id === badgeId);
    if (!badge) {
      return false; // Badge doesn't exist
    }

    const userBadge: UserBadge = {
      id: `${userId}_${badgeId}`,
      userId,
      badgeId,
      badge: badge as Badge,
      earnedAt: Timestamp.now().toDate(),
      progress: 100,
      isDisplayed: true
    };

    await updateDoc(userRef, {
      badges: [...userData.badges, userBadge],
      totalXP: increment(badge.points),
      updatedAt: Timestamp.now()
    });

    // Check if new XP causes level up
    await this.addXP(userId, 0, "Badge check"); // This will trigger level check

    return true;
  }

  /**
   * Check and award badges based on user activity
   */
  static async checkAndAwardBadges(userId: string, activityType: string, data: any): Promise<string[]> {
    const awardedBadges: string[] = [];
    const userStats = await this.getUserStats(userId);

    if (!userStats) {
      return awardedBadges;
    }

    for (const badge of BADGES) {
      const hasBadge = userStats.badges.some(b => b.badgeId === badge.id);
      if (hasBadge) continue;

      const earned = await this.checkBadgeRequirement(badge as Badge, userStats, activityType, data);
      if (earned) {
        const success = await this.awardBadge(userId, badge.id);
        if (success) {
          awardedBadges.push(badge.id);
        }
      }
    }

    return awardedBadges;
  }

  /**
   * Check if badge requirement is met
   */
  private static async checkBadgeRequirement(
    badge: Badge,
    userStats: UserStats,
    activityType: string,
    data: any
  ): Promise<boolean> {
    if (!badge.requirement) return false;

    const req = badge.requirement;
    // Donation badges
    if (req.type === "count" && req.metric === "donations" && activityType === "donation") {
      return userStats.stats.totalDonations >= req.threshold;
    }

    if (req.type === "amount" && req.metric === "total_donated" && activityType === "donation") {
      return userStats.stats.totalAmount >= req.threshold;
    }

    // Streak badges
    if (req.type === "streak") {
      const streakType = data?.streakType || "login";
      return userStats.streaks[streakType]?.current >= req.threshold;
    }

    // Milestone badges
    if (req.type === "milestone" && req.metric === "projects") {
      return userStats.stats.projectsSupported >= req.threshold;
    }

    // Event badges
    if (req.type === "event" && activityType === "event") {
      return data?.eventType === req.metric;
    }

    // Secret badges
    if (badge.isSecret) {
      return this.checkSecretBadge(badge, userStats, data);
    }

    return false;
  }

  /**
   * Check secret badge conditions
   */
  private static checkSecretBadge(badge: Badge, userStats: UserStats, data: any): boolean {
    switch (badge.id) {
      case "night-owl":
        // Donated between 2 AM and 5 AM
        const hour = new Date().getHours();
        return data?.activityType === "donation" && hour >= 2 && hour < 5;

      case "lucky-seven":
        // 7th donation
        return userStats.stats.totalDonations === 7;

      case "anniversary":
        // User account is 1 year old
        const accountAge = Date.now() - userStats.createdAt.getTime();
        const oneYear = 365 * 24 * 60 * 60 * 1000;
        return accountAge >= oneYear;

      default:
        return false;
    }
  }

  /**
   * Check for level-based badges
   */
  private static async checkLevelBadges(userId: string, level: any): Promise<void> {
    // Award special badges at milestone levels
    const levelBadges: Record<number, string[]> = {
      5: ["champion"],
      10: ["legend"]
    };

    const badgesToAward = levelBadges[level] || [];
    for (const badgeId of badgesToAward) {
      await this.awardBadge(userId, badgeId);
    }
  }

  /**
   * Update streak (login, donation, engagement)
   */
  static async updateStreak(userId: string, streakType: "login" | "donation" | "engagement"): Promise<any> {
    const userRef = doc(db, "gamification", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      await this.initializeUserProfile(userId);
    }

    const userData = userDoc.data() as UserStats;
    const currentStreak = userData.streaks[streakType];
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    let newCurrent = 1;
    let newBest = currentStreak.best;

    if (currentStreak.lastDate) {
      const lastDate = new Date(currentStreak.lastDate);
      const lastDateStr = lastDate.toISOString().split("T")[0];
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (lastDateStr === today) {
        // Already updated today, no change
        return currentStreak;
      } else if (lastDateStr === yesterdayStr) {
        // Consecutive day
        newCurrent = currentStreak.current + 1;
      } else {
        // Streak broken
        newCurrent = 1;
      }
    }

    newBest = Math.max(newBest, newCurrent);

    const updatedStreak = {
      id: `${userId}_${streakType}`,
      userId,
      type: streakType,
      currentStreak: newCurrent,
      longestStreak: newBest,
      lastActivityAt: new Date(today),
      streakStartedAt: new Date(today)
    };

    await updateDoc(userRef, {
      [`streaks.${streakType}.current`]: newCurrent,
      [`streaks.${streakType}.best`]: newBest,
      [`streaks.${streakType}.lastDate`]: today,
      updatedAt: Timestamp.now()
    });

    // Check for streak badges
    await this.checkAndAwardBadges(userId, "streak", { streakType, streak: newCurrent });

    return updatedStreak;
  }

  /**
   * Update user stats after activity
   */
  static async updateStats(userId: string, statType: string, incrementBy: number = 1): Promise<void> {
    const userRef = doc(db, "gamification", userId);

    await updateDoc(userRef, {
      [`stats.${statType}`]: increment(incrementBy),
      updatedAt: Timestamp.now()
    });
  }

  /**
   * Get leaderboard data
   */
  static async getLeaderboard(
    type: "donations" | "impact" | "referrals" | "xp",
    timeframe: "daily" | "weekly" | "monthly" | "all-time",
    limitCount: number = 100
  ): Promise<any[]> {
    const collectionRef = collection(db, "gamification");
    let q;

    // For time-based filtering, we'd need separate collections or computed fields
    // For now, return top users by total XP
    q = query(
      collectionRef,
      orderBy("totalXP", "desc"),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    const leaderboard = snapshot.docs.map((doc, index) => {
      const data = doc.data() as UserStats;
      return {
        rank: index + 1,
        userId: doc.id,
        score: data.totalXP,
        level: data.level,
        badges: data.badges.length,
        change: 0 // Would need historical data
      };
    });

    return leaderboard;
  }

  /**
   * Get user's rank in leaderboard
   */
  static async getUserRank(userId: string, type: string = "xp"): Promise<number> {
    const leaderboard = await this.getLeaderboard(type as any, "all-time", 1000);
    const userIndex = leaderboard.findIndex(entry => entry.userId === userId);
    return userIndex !== -1 ? userIndex + 1 : -1;
  }

  /**
   * Get active challenges
   */
  static async getActiveChallenges(): Promise<Challenge[]> {
    const challengesRef = collection(db, "challenges");
    const now = Timestamp.now();

    const q = query(
      challengesRef,
      where("endDate", ">", now),
      orderBy("endDate", "asc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Challenge));
  }

  /**
   * Track challenge progress
   */
  static async updateChallengeProgress(
    userId: string,
    challengeId: string,
    progress: number
  ): Promise<void> {
    const progressRef = doc(db, "challengeProgress", `${userId}_${challengeId}`);

    await setDoc(progressRef, {
      userId,
      challengeId,
      progress,
      completed: progress >= 100,
      updatedAt: Timestamp.now()
    }, { merge: true });
  }
}

export default GamificationService;
