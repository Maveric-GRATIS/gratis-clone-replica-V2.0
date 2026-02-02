import { Request, Response, NextFunction } from "express";
import { GamificationService } from "@/lib/gamification/gamificationService";

/**
 * GET /api/gamification/profile/:userId
 * Get user's gamification profile
 */
export async function getUserProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;

    const profile = await GamificationService.getUserStats(userId);

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/gamification/xp
 * Add XP to user
 */
export async function addXP(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, amount, reason } = req.body;

    if (!userId || !amount || !reason) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await GamificationService.addXP(userId, amount, reason);

    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/gamification/badges/award
 * Award a badge to user
 */
export async function awardBadge(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, badgeId } = req.body;

    if (!userId || !badgeId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const success = await GamificationService.awardBadge(userId, badgeId);

    if (!success) {
      return res.status(400).json({ error: "Failed to award badge" });
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/gamification/badges/check
 * Check and award badges based on activity
 */
export async function checkBadges(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, activityType, data } = req.body;

    if (!userId || !activityType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const awardedBadges = await GamificationService.checkAndAwardBadges(
      userId,
      activityType,
      data
    );

    res.json({ awardedBadges });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/gamification/streak
 * Update user streak
 */
export async function updateStreak(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, streakType } = req.body;

    if (!userId || !streakType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const streak = await GamificationService.updateStreak(userId, streakType);

    res.json(streak);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/gamification/challenges
 * Get active challenges
 */
export async function getActiveChallenges(req: Request, res: Response, next: NextFunction) {
  try {
    const challenges = await GamificationService.getActiveChallenges();

    res.json(challenges);
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/gamification/challenges/:challengeId/progress
 * Update challenge progress
 */
export async function updateChallengeProgress(req: Request, res: Response, next: NextFunction) {
  try {
    const { challengeId } = req.params;
    const { userId, progress } = req.body;

    if (!userId || progress === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await GamificationService.updateChallengeProgress(userId, challengeId, progress);

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}
