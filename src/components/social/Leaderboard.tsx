import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import type { LeaderboardEntry } from "@/types/social";

// Tier colors
const tierColors: Record<string, string> = {
  free: "bg-gray-100 text-gray-700",
  supporter: "bg-blue-100 text-blue-700",
  champion: "bg-purple-100 text-purple-700",
  legend: "bg-amber-100 text-amber-700",
};

// Trophy colors for top 3
const trophyColors: Record<number, string> = {
  0: "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white",
  1: "bg-gradient-to-r from-gray-300 to-gray-400 text-white",
  2: "bg-gradient-to-r from-amber-600 to-amber-700 text-white",
};

// Mock leaderboard data
const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: "u1",
    userName: "Sarah van der Berg",
    userAvatar: "/lovable-uploads/8a4f1e36-7686-4d56-a54f-cc94de5fdbec.png",
    userTier: "legend",
    score: 125420,
    previousRank: 1,
    change: "same",
  },
  {
    rank: 2,
    userId: "u2",
    userName: "Marcus Schmidt",
    userAvatar: "/lovable-uploads/8a4f1e36-7686-4d56-a54f-cc94de5fdbec.png",
    userTier: "legend",
    score: 98750,
    previousRank: 3,
    change: "up",
  },
  {
    rank: 3,
    userId: "u3",
    userName: "Emma Laurent",
    userAvatar: "/lovable-uploads/8a4f1e36-7686-4d56-a54f-cc94de5fdbec.png",
    userTier: "champion",
    score: 87320,
    previousRank: 2,
    change: "down",
  },
  {
    rank: 4,
    userId: "u4",
    userName: "Jan de Vries",
    userAvatar: "/lovable-uploads/8a4f1e36-7686-4d56-a54f-cc94de5fdbec.png",
    userTier: "champion",
    score: 76540,
    previousRank: 4,
    change: "same",
  },
  {
    rank: 5,
    userId: "u5",
    userName: "Sophie Chen",
    userAvatar: "/lovable-uploads/8a4f1e36-7686-4d56-a54f-cc94de5fdbec.png",
    userTier: "supporter",
    score: 65200,
    previousRank: 6,
    change: "up",
  },
  {
    rank: 6,
    userId: "u6",
    userName: "Lars Andersson",
    userAvatar: "/lovable-uploads/8a4f1e36-7686-4d56-a54f-cc94de5fdbec.png",
    userTier: "supporter",
    score: 54800,
    previousRank: 5,
    change: "down",
  },
  {
    rank: 7,
    userId: "u7",
    userName: "Maria Rodriguez",
    userAvatar: "/lovable-uploads/8a4f1e36-7686-4d56-a54f-cc94de5fdbec.png",
    userTier: "supporter",
    score: 48300,
    previousRank: 7,
    change: "same",
  },
  {
    rank: 8,
    userId: "u8",
    userName: "Ahmed Hassan",
    userAvatar: "/lovable-uploads/8a4f1e36-7686-4d56-a54f-cc94de5fdbec.png",
    userTier: "free",
    score: 42100,
    change: "new",
  },
  {
    rank: 9,
    userId: "u9",
    userName: "Isabella Rossi",
    userAvatar: "/lovable-uploads/8a4f1e36-7686-4d56-a54f-cc94de5fdbec.png",
    userTier: "supporter",
    score: 38900,
    previousRank: 9,
    change: "same",
  },
  {
    rank: 10,
    userId: "u10",
    userName: "Thomas Müller",
    userAvatar: "/lovable-uploads/8a4f1e36-7686-4d56-a54f-cc94de5fdbec.png",
    userTier: "free",
    score: 35400,
    previousRank: 11,
    change: "up",
  },
];

interface LeaderboardProps {
  type?: "impact" | "donations" | "referrals";
  timeframe?: "weekly" | "monthly" | "all_time";
  limit?: number;
}

export function Leaderboard({
  type = "impact",
  timeframe = "monthly",
  limit = 10,
}: LeaderboardProps) {
  const { user } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
  const [selectedType, setSelectedType] = useState(type);

  const userRank = mockLeaderboard.findIndex((e) => e.userId === user?.uid) + 1;
  const userEntry = mockLeaderboard.find((e) => e.userId === user?.uid);

  const isCurrentUser = (userId: string) => userId === user?.uid;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Leaderboard
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="space-y-4 mb-6">
          <Tabs
            value={selectedType}
            onValueChange={(v) => setSelectedType(v as any)}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="impact">Impact</TabsTrigger>
              <TabsTrigger value="donations">Donations</TabsTrigger>
              <TabsTrigger value="referrals">Referrals</TabsTrigger>
            </TabsList>
          </Tabs>

          <Tabs
            value={selectedTimeframe}
            onValueChange={(v) => setSelectedTimeframe(v as any)}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="all_time">All Time</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* User's Position (if not in top 10) */}
        {userEntry && userRank > limit && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700 mb-2">Your Position</p>
            <LeaderboardRow entry={userEntry} index={userRank - 1} />
          </div>
        )}

        {/* Leaderboard List */}
        <div className="space-y-2">
          {mockLeaderboard.slice(0, limit).map((entry, index) => (
            <LeaderboardRow
              key={entry.userId}
              entry={entry}
              index={index}
              isCurrentUser={isCurrentUser(entry.userId)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function LeaderboardRow({
  entry,
  index,
  isCurrentUser = false,
}: {
  entry: LeaderboardEntry;
  index: number;
  isCurrentUser?: boolean;
}) {
  const isTopThree = index < 3;

  const ChangeIcon =
    entry.change === "up"
      ? TrendingUp
      : entry.change === "down"
        ? TrendingDown
        : entry.change === "new"
          ? Trophy
          : Minus;

  const changeColor =
    entry.change === "up"
      ? "text-green-600"
      : entry.change === "down"
        ? "text-red-600"
        : entry.change === "new"
          ? "text-purple-600"
          : "text-gray-400";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "flex items-center gap-4 p-3 rounded-lg transition-colors",
        isCurrentUser
          ? "bg-blue-50 border border-blue-200"
          : "hover:bg-gray-50",
      )}
    >
      {/* Rank */}
      <div className="flex-shrink-0">
        {isTopThree ? (
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-bold",
              trophyColors[index],
            )}
          >
            {entry.rank}
          </div>
        ) : (
          <div className="w-10 h-10 flex items-center justify-center font-bold text-gray-500">
            {entry.rank}
          </div>
        )}
      </div>

      {/* Avatar & Name */}
      <Avatar className="h-10 w-10">
        <AvatarImage src={entry.userAvatar} />
        <AvatarFallback>{entry.userName[0]}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <Link
          to={`/profile/${entry.userId}`}
          className="font-semibold hover:underline truncate block"
        >
          {entry.userName}
          {isCurrentUser && <span className="text-blue-600 ml-2">(You)</span>}
        </Link>
        <Badge
          variant="outline"
          className={cn("text-xs", tierColors[entry.userTier])}
        >
          {entry.userTier}
        </Badge>
      </div>

      {/* Score */}
      <div className="text-right">
        <p className="font-bold text-lg">{entry.score.toLocaleString()}</p>
        {entry.previousRank && (
          <div className={cn("flex items-center gap-1 text-xs", changeColor)}>
            <ChangeIcon className="h-3 w-3" />
            {entry.change === "new"
              ? "New"
              : entry.change === "same"
                ? "-"
                : Math.abs(entry.rank - entry.previousRank)}
          </div>
        )}
      </div>
    </motion.div>
  );
}
