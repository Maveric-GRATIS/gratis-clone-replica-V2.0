import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  MessageCircle,
  Share2,
  Trophy,
  Gift,
  Users,
  Zap,
  Calendar,
  CheckCircle,
  Leaf,
  UserPlus,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import type { ActivityItem, ActivityComment } from "@/types/social";

// Activity type configurations
const activityConfig: Record<
  string,
  { icon: any; color: string; bgColor: string }
> = {
  bottle_ordered: {
    icon: Gift,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  bottle_delivered: {
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  donation_made: { icon: Heart, color: "text-red-600", bgColor: "bg-red-100" },
  achievement_unlocked: {
    icon: Trophy,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  tribe_joined: {
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  tribe_upgraded: {
    icon: Zap,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  event_registered: {
    icon: Calendar,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
  event_attended: {
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  impact_milestone: {
    icon: Leaf,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  referral_success: {
    icon: UserPlus,
    color: "text-cyan-600",
    bgColor: "bg-cyan-100",
  },
  project_voted: {
    icon: CheckCircle,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
};

// Tier colors
const tierColors: Record<string, string> = {
  free: "text-gray-600",
  supporter: "text-blue-600",
  champion: "text-purple-600",
  legend: "text-amber-600",
};

// Mock data
const mockActivities: ActivityItem[] = [
  {
    id: "1",
    userId: "u1",
    userName: "Sarah van der Berg",
    userAvatar: "/lovable-uploads/8a4f1e36-7686-4d56-a54f-cc94de5fdbec.png",
    userTier: "champion",
    type: "achievement_unlocked",
    title: "Achievement Unlocked!",
    description:
      'Earned the "Water Champion" badge for helping provide 10.000 liters of clean water.',
    metadata: {
      achievementName: "Water Champion",
      achievementIcon: "🏆",
      impactValue: 10000,
      impactUnit: "liters",
    },
    isPublic: true,
    visibleTo: "everyone",
    likes: 24,
    comments: 5,
    shares: 2,
    likedBy: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "2",
    userId: "u2",
    userName: "Marcus Schmidt",
    userAvatar: "/lovable-uploads/8a4f1e36-7686-4d56-a54f-cc94de5fdbec.png",
    userTier: "legend",
    type: "donation_made",
    title: "Made a Donation",
    description: "Donated to the Kenya Clean Water Initiative",
    metadata: {
      donationAmount: 5000,
      projectId: "p1",
      projectName: "Kenya Clean Water Initiative",
    },
    isPublic: true,
    visibleTo: "everyone",
    likes: 42,
    comments: 8,
    shares: 5,
    likedBy: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "3",
    userId: "u3",
    userName: "Emma Laurent",
    userAvatar: "/lovable-uploads/8a4f1e36-7686-4d56-a54f-cc94de5fdbec.png",
    userTier: "supporter",
    type: "bottle_delivered",
    title: "Bottle Delivered!",
    description: 'Received the limited edition "Ocean Wave" bottle',
    metadata: {
      bottleId: "b1",
      bottleName: "Ocean Wave Limited Edition",
    },
    isPublic: true,
    visibleTo: "everyone",
    likes: 18,
    comments: 3,
    shares: 1,
    likedBy: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
];

interface CommunityActivityFeedProps {
  filter?: "all" | "following" | "tribe";
  userId?: string;
  limit?: number;
}

export function CommunityActivityFeed({
  filter = "all",
  userId,
  limit,
}: CommunityActivityFeedProps) {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>(mockActivities);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedComments, setExpandedComments] = useState<string[]>([]);

  const handleLike = async (activityId: string) => {
    setActivities((prev) =>
      prev.map((a) =>
        a.id === activityId
          ? {
              ...a,
              likes: a.likedBy.includes(user?.uid || "")
                ? a.likes - 1
                : a.likes + 1,
              likedBy: a.likedBy.includes(user?.uid || "")
                ? a.likedBy.filter((id) => id !== user?.uid)
                : [...a.likedBy, user?.uid || ""],
            }
          : a,
      ),
    );
  };

  const toggleComments = (activityId: string) => {
    setExpandedComments((prev) =>
      prev.includes(activityId)
        ? prev.filter((id) => id !== activityId)
        : [...prev, activityId],
    );
  };

  return (
    <div className="space-y-6">
      {/* Feed Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant={filter === "all" ? "default" : "outline"} size="sm">
          All Activity
        </Button>
        <Button
          variant={filter === "following" ? "default" : "outline"}
          size="sm"
        >
          Following
        </Button>
        <Button variant={filter === "tribe" ? "default" : "outline"} size="sm">
          TRIBE Only
        </Button>
      </div>

      {/* Activity Items */}
      <AnimatePresence>
        {activities.map((activity, index) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onLike={() => handleLike(activity.id)}
            isLiked={activity.likedBy.includes(user?.uid || "")}
            showComments={expandedComments.includes(activity.id)}
            onToggleComments={() => toggleComments(activity.id)}
            index={index}
          />
        ))}
      </AnimatePresence>

      {/* Load More */}
      {!limit && (
        <div className="text-center">
          <Button variant="outline" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

// Activity Card Component
function ActivityCard({
  activity,
  onLike,
  isLiked,
  showComments,
  onToggleComments,
  index,
}: {
  activity: ActivityItem;
  onLike: () => void;
  isLiked: boolean;
  showComments: boolean;
  onToggleComments: () => void;
  index: number;
}) {
  const config = activityConfig[activity.type] || {
    icon: Gift,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
  };

  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card>
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start gap-4">
            {/* Avatar with Activity Icon */}
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={activity.userAvatar} />
                <AvatarFallback>{activity.userName[0]}</AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "absolute -bottom-1 -right-1 p-1 rounded-full",
                  config.bgColor,
                )}
              >
                <Icon className={cn("h-3 w-3", config.color)} />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  to={`/profile/${activity.userId}`}
                  className="font-semibold hover:underline"
                >
                  {activity.userName}
                </Link>
                <Badge
                  variant="outline"
                  className={cn("text-xs", tierColors[activity.userTier])}
                >
                  {activity.userTier}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  ·{" "}
                  {formatDistanceToNow(activity.createdAt as Date, {
                    addSuffix: true,
                  })}
                </span>
              </div>

              <p className="text-muted-foreground mt-1">
                {activity.description}
              </p>

              {/* Activity-specific content */}
              {activity.type === "achievement_unlocked" &&
                activity.metadata.achievementName && (
                  <div className="mt-3 flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <span className="text-3xl">
                      {activity.metadata.achievementIcon}
                    </span>
                    <div>
                      <p className="font-semibold">
                        {activity.metadata.achievementName}
                      </p>
                      {activity.metadata.impactValue && (
                        <p className="text-sm text-muted-foreground">
                          {activity.metadata.impactValue.toLocaleString()}{" "}
                          {activity.metadata.impactUnit}
                        </p>
                      )}
                    </div>
                  </div>
                )}

              {activity.type === "donation_made" &&
                activity.metadata.donationAmount && (
                  <div className="mt-3 flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <Heart className="h-6 w-6 text-red-500" />
                    <div>
                      <p className="font-semibold">
                        €{(activity.metadata.donationAmount / 100).toFixed(2)}{" "}
                        donated
                      </p>
                      {activity.metadata.projectName && (
                        <p className="text-sm text-muted-foreground">
                          {activity.metadata.projectName}
                        </p>
                      )}
                    </div>
                  </div>
                )}

              {activity.type === "bottle_delivered" &&
                activity.metadata.bottleName && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="font-semibold">
                      {activity.metadata.bottleName}
                    </p>
                  </div>
                )}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Engagement Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onLike}
              className={cn(isLiked && "text-red-500")}
            >
              <Heart
                className={cn("mr-2 h-4 w-4", isLiked && "fill-current")}
              />
              {activity.likes}
            </Button>

            <Button variant="ghost" size="sm" onClick={onToggleComments}>
              <MessageCircle className="mr-2 h-4 w-4" />
              {activity.comments}
            </Button>

            <Button variant="ghost" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              {activity.shares}
            </Button>
          </div>

          {/* Comments Section */}
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t"
              >
                <CommentsSection activityId={activity.id} />
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Comments Section Component
function CommentsSection({ activityId }: { activityId: string }) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const comments: ActivityComment[] = [
    {
      id: "c1",
      activityId,
      userId: "u4",
      userName: "Jan de Vries",
      userAvatar: "/lovable-uploads/8a4f1e36-7686-4d56-a54f-cc94de5fdbec.png",
      userTier: "supporter",
      content: "Amazing achievement! Keep up the great work! 🎉",
      likes: 5,
      likedBy: [],
      replyCount: 1,
      isHidden: false,
      isReported: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 15),
      updatedAt: new Date(),
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    setNewComment("");
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-4">
      {/* New Comment Form */}
      {user && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL || undefined} />
            <AvatarFallback>{user.displayName?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[60px]"
            />
            <Button
              type="submit"
              size="sm"
              className="mt-2"
              disabled={isSubmitting || !newComment.trim()}
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </form>
      )}

      {/* Existing Comments */}
      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.userAvatar} />
              <AvatarFallback>{comment.userName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {comment.userName}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn("text-xs", tierColors[comment.userTier])}
                  >
                    {comment.userTier}
                  </Badge>
                </div>
                <p className="text-sm mt-1">{comment.content}</p>
              </div>
              <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground px-3">
                <span>
                  {formatDistanceToNow(comment.createdAt as Date, {
                    addSuffix: true,
                  })}
                </span>
                <button className="hover:text-foreground">Like</button>
                <button className="hover:text-foreground">Reply</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
