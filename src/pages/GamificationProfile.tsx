/**
 * Gamification Profile Page
 * Part 8 - Section 37: User gamification dashboard
 */

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Flame,
  TrendingUp,
  Award,
  Star,
  Target,
  Calendar,
  Users,
  Lock,
} from "lucide-react";
import {
  BADGES,
  LEVEL_THRESHOLDS,
  getLevelPerks,
} from "@/lib/gamification/badges";
import type { UserBadge, UserLevel, Streak } from "@/types/gamification";

export default function GamificationProfile() {
  const { user } = useAuth();
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [level, setLevel] = useState<UserLevel | null>(null);
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadGamificationData();
    }
  }, [user]);

  const loadGamificationData = async () => {
    try {
      // Mock data for demonstration
      const mockLevel: UserLevel = {
        level: 5,
        title: "Champion",
        currentXP: 450,
        requiredXP: 1000,
        totalXP: 1450,
        perks: getLevelPerks(5),
      };

      const mockBadges: UserBadge[] = [
        {
          id: "1",
          userId: user?.uid || "",
          badgeId: "first_drop",
          badge: BADGES[0] as any,
          earnedAt: new Date(),
          isDisplayed: true,
        },
        {
          id: "2",
          userId: user?.uid || "",
          badgeId: "generous_soul",
          badge: BADGES[1] as any,
          earnedAt: new Date(),
          isDisplayed: true,
        },
        {
          id: "3",
          userId: user?.uid || "",
          badgeId: "week_warrior",
          badge: BADGES[11] as any,
          earnedAt: new Date(),
          isDisplayed: true,
        },
      ];

      const mockStreaks: Streak[] = [
        {
          id: "1",
          userId: user?.uid || "",
          type: "login",
          currentStreak: 12,
          longestStreak: 25,
          lastActivityAt: new Date(),
          streakStartedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        },
        {
          id: "2",
          userId: user?.uid || "",
          type: "donation",
          currentStreak: 3,
          longestStreak: 8,
          lastActivityAt: new Date(),
          streakStartedAt: new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000),
        },
      ];

      setBadges(mockBadges);
      setLevel(mockLevel);
      setStreaks(mockStreaks);
    } catch (error) {
      console.error("Error loading gamification data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-24 bg-muted rounded-lg"></div>
            <div className="h-24 bg-muted rounded-lg"></div>
            <div className="h-24 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = level
    ? (level.currentXP / level.requiredXP) * 100
    : 0;
  const loginStreak = streaks.find((s) => s.type === "login");
  const donationStreak = streaks.find((s) => s.type === "donation");

  return (
    <div className="container max-w-6xl mx-auto px-4 pt-24 pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Your Achievements</h1>
        <p className="text-muted-foreground">
          Track your progress, earn badges, and climb the leaderboard
        </p>
      </div>

      {/* Level Card */}
      {level && (
        <Card className="mb-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl flex items-center gap-2">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  Level {level.level}: {level.title}
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  {level.currentXP} / {level.requiredXP} XP to next level
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Total XP</div>
                <div className="text-3xl font-bold text-primary">
                  {level.totalXP}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progressPercentage} className="h-3 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Your Perks
                </h4>
                <ul className="space-y-1 text-sm">
                  {level.perks.map((perk, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Next Level Preview</h4>
                <div className="text-sm text-muted-foreground">
                  {LEVEL_THRESHOLDS[level.level] ? (
                    <p>
                      Unlock more perks when you reach{" "}
                      <span className="font-semibold text-foreground">
                        Level {level.level + 1}
                      </span>
                    </p>
                  ) : (
                    <p className="text-yellow-600">
                      You've reached the maximum level! 🎉
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Streaks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {loginStreak && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                Login Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold">
                    {loginStreak.currentStreak}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    days in a row
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    Best streak
                  </div>
                  <div className="text-2xl font-semibold text-muted-foreground">
                    {loginStreak.longestStreak}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {donationStreak && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Donation Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold">
                    {donationStreak.currentStreak}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    months in a row
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    Best streak
                  </div>
                  <div className="text-2xl font-semibold text-muted-foreground">
                    {donationStreak.longestStreak}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Badges ({badges.length}/
            {BADGES.filter((b) => !b.isSecret).length + " visible"})
          </CardTitle>
          <CardDescription>
            Earn badges by completing achievements and challenges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="earned">
            <TabsList>
              <TabsTrigger value="earned">Earned ({badges.length})</TabsTrigger>
              <TabsTrigger value="available">Available</TabsTrigger>
              <TabsTrigger value="secret">Secret</TabsTrigger>
            </TabsList>

            <TabsContent value="earned" className="mt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {badges.map((userBadge) => (
                  <div
                    key={userBadge.id}
                    className="flex flex-col items-center p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                  >
                    <div className="text-4xl mb-2">{userBadge.badge.icon}</div>
                    <div className="text-sm font-semibold text-center">
                      {userBadge.badge.name}
                    </div>
                    <Badge
                      className="mt-2 text-xs"
                      variant={
                        userBadge.badge.tier === "diamond"
                          ? "default"
                          : userBadge.badge.tier === "platinum"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {userBadge.badge.tier}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      {userBadge.badge.points} XP
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="available" className="mt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {BADGES.filter(
                  (b) =>
                    !b.isSecret && !badges.some((ub) => ub.badgeId === b.id),
                ).map((badge) => (
                  <div
                    key={badge.id}
                    className="flex flex-col items-center p-4 rounded-lg border bg-card opacity-60 hover:opacity-80 transition-opacity"
                  >
                    <div className="text-4xl mb-2 grayscale">{badge.icon}</div>
                    <div className="text-sm font-semibold text-center">
                      {badge.name}
                    </div>
                    <div className="text-xs text-center text-muted-foreground mt-1">
                      {badge.description}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {badge.points} XP
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="secret" className="mt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {BADGES.filter((b) => b.isSecret).map((badge) => {
                  const isEarned = badges.some((ub) => ub.badgeId === badge.id);
                  return (
                    <div
                      key={badge.id}
                      className={`flex flex-col items-center p-4 rounded-lg border bg-card ${
                        isEarned ? "" : "opacity-40"
                      }`}
                    >
                      {isEarned ? (
                        <>
                          <div className="text-4xl mb-2">{badge.icon}</div>
                          <div className="text-sm font-semibold text-center">
                            {badge.name}
                          </div>
                          <div className="text-xs text-center text-muted-foreground mt-1">
                            {badge.description}
                          </div>
                        </>
                      ) : (
                        <>
                          <Lock className="h-8 w-8 mb-2 text-muted-foreground" />
                          <div className="text-sm font-semibold text-center">
                            Secret Badge
                          </div>
                          <div className="text-xs text-center text-muted-foreground mt-1">
                            Hidden achievement
                          </div>
                        </>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">
                        {badge.points} XP
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
