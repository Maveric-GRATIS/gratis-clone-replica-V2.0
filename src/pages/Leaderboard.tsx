/**
 * Leaderboard Page
 * Part 8 - Section 40: Rankings and competitions
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  Crown,
  Medal,
  Award,
  Users,
} from "lucide-react";
import type { LeaderboardEntry } from "@/types/gamification";

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: "1",
    displayName: "Sarah M.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    score: 5420,
    level: 10,
    change: 0,
  },
  {
    rank: 2,
    userId: "2",
    displayName: "Michael K.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    score: 4890,
    level: 9,
    change: 2,
  },
  {
    rank: 3,
    userId: "3",
    displayName: "Emma L.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    score: 4650,
    level: 9,
    change: -1,
  },
  {
    rank: 4,
    userId: "4",
    displayName: "James R.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    score: 4320,
    level: 8,
    change: 1,
  },
  {
    rank: 5,
    userId: "5",
    displayName: "Olivia T.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
    score: 3890,
    level: 8,
    change: -2,
  },
  {
    rank: 6,
    userId: "6",
    displayName: "Daniel W.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel",
    score: 3560,
    level: 7,
    change: 0,
  },
  {
    rank: 7,
    userId: "7",
    displayName: "Sophia P.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
    score: 3240,
    level: 7,
    change: 3,
  },
  {
    rank: 8,
    userId: "8",
    displayName: "Alexander B.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander",
    score: 2980,
    level: 6,
    change: -1,
  },
  {
    rank: 9,
    userId: "9",
    displayName: "Isabella H.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella",
    score: 2750,
    level: 6,
    change: 1,
  },
  {
    rank: 10,
    userId: "10",
    displayName: "William C.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=William",
    score: 2490,
    level: 6,
    change: -2,
  },
];

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaderboardType, setLeaderboardType] = useState("donations");
  const [timeframe, setTimeframe] = useState("monthly");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    loadLeaderboard();
  }, [leaderboardType, timeframe]);

  const loadLeaderboard = () => {
    // Mock data - in production, fetch from API
    setEntries(MOCK_LEADERBOARD);

    // Mock user rank
    if (user) {
      setUserRank({
        rank: 15,
        userId: user.uid,
        displayName: user.displayName || "You",
        avatar: user.photoURL,
        score: 1850,
        level: 5,
        change: 2,
      });
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-600" />;
    return (
      <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
    );
  };

  const getChangeIndicator = (change: number) => {
    if (change > 0) {
      return (
        <div className="flex items-center gap-1 text-green-600">
          <TrendingUp className="h-4 w-4" />
          <span className="text-xs">+{change}</span>
        </div>
      );
    }
    if (change < 0) {
      return (
        <div className="flex items-center gap-1 text-red-600">
          <TrendingDown className="h-4 w-4" />
          <span className="text-xs">{change}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 text-muted-foreground">
        <Minus className="h-4 w-4" />
        <span className="text-xs">0</span>
      </div>
    );
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 pt-24 pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Trophy className="h-10 w-10 text-yellow-500" />
          Leaderboard
        </h1>
        <p className="text-muted-foreground">
          See how you stack up against other supporters
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">
                Leaderboard Type
              </label>
              <Select
                value={leaderboardType}
                onValueChange={setLeaderboardType}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="donations">Total Donations</SelectItem>
                  <SelectItem value="impact">People Helped</SelectItem>
                  <SelectItem value="referrals">Referrals</SelectItem>
                  <SelectItem value="xp">Experience Points</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">
                Timeframe
              </label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Today</SelectItem>
                  <SelectItem value="weekly">This Week</SelectItem>
                  <SelectItem value="monthly">This Month</SelectItem>
                  <SelectItem value="all_time">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Rank Card */}
      {userRank && (
        <Card className="mb-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <span className="text-lg font-bold">#{userRank.rank}</span>
                </div>
                <Avatar className="h-12 w-12 border-2 border-primary">
                  <AvatarImage src={userRank.avatar} />
                  <AvatarFallback>
                    {userRank.displayName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    {userRank.displayName}
                    <Badge variant="secondary">You</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Level {userRank.level}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {userRank.score.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {leaderboardType === "donations" && "Total donated (€)"}
                  {leaderboardType === "impact" && "People helped"}
                  {leaderboardType === "referrals" && "Referrals"}
                  {leaderboardType === "xp" && "Total XP"}
                </div>
              </div>
              {getChangeIndicator(userRank.change)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top 3 Spotlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {entries.slice(0, 3).map((entry, index) => (
          <Card
            key={entry.userId}
            className={`relative ${
              index === 0
                ? "bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-yellow-500/20"
                : index === 1
                  ? "bg-gradient-to-br from-gray-400/10 to-gray-500/10 border-gray-400/20"
                  : "bg-gradient-to-br from-amber-600/10 to-orange-500/10 border-amber-600/20"
            }`}
          >
            <CardContent className="pt-6 text-center">
              <div className="flex justify-center mb-3">
                {getRankIcon(entry.rank)}
              </div>
              <Avatar className="h-20 w-20 mx-auto mb-3 border-4 border-background">
                <AvatarImage src={entry.avatar} />
                <AvatarFallback className="text-xl">
                  {entry.displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="font-semibold mb-1">{entry.displayName}</div>
              <Badge variant="outline" className="mb-2">
                Level {entry.level}
              </Badge>
              <div className="text-2xl font-bold text-primary">
                {entry.score.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {leaderboardType === "donations" && "€ donated"}
                {leaderboardType === "impact" && "people helped"}
                {leaderboardType === "referrals" && "referrals"}
                {leaderboardType === "xp" && "XP"}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Top Supporters
          </CardTitle>
          <CardDescription>
            Rankings update daily at midnight UTC
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {entries.map((entry) => (
              <div
                key={entry.userId}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  entry.userId === user?.uid
                    ? "bg-primary/5 border-primary/20"
                    : "hover:bg-accent"
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center justify-center w-10">
                    {getRankIcon(entry.rank)}
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={entry.avatar} />
                    <AvatarFallback>
                      {entry.displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium flex items-center gap-2">
                      {entry.displayName}
                      {entry.userId === user?.uid && (
                        <Badge variant="secondary" className="text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Level {entry.level}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-bold text-lg">
                      {entry.score.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {leaderboardType === "donations" && "€"}
                      {leaderboardType === "impact" && "people"}
                      {leaderboardType === "referrals" && "refs"}
                      {leaderboardType === "xp" && "XP"}
                    </div>
                  </div>
                  <div className="w-16">{getChangeIndicator(entry.change)}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
