import { Request, Response, NextFunction } from "express";
import { GamificationService } from "@/lib/gamification/gamificationService";

/**
 * GET /api/leaderboard
 * Get leaderboard data
 */
export async function getLeaderboard(req: Request, res: Response, next: NextFunction) {
  try {
    const { type = "xp", timeframe = "all-time", limit = 100 } = req.query;

    const leaderboard = await GamificationService.getLeaderboard(
      type as any,
      timeframe as any,
      parseInt(limit as string)
    );

    res.json(leaderboard);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/leaderboard/rank/:userId
 * Get user's rank in leaderboard
 */
export async function getUserRank(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;
    const { type = "xp" } = req.query;

    const rank = await GamificationService.getUserRank(userId, type as string);

    res.json({ rank });
  } catch (error) {
    next(error);
  }
}
