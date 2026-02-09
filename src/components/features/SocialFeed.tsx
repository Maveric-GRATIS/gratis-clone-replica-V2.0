/**
 * SocialFeed Component
 *
 * Displays aggregated social media posts from multiple platforms
 * with filtering, layouts, and auto-refresh functionality.
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Instagram,
  ExternalLink,
  Heart,
  MessageCircle,
  Share2,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export interface SocialPost {
  id: string;
  platform: "twitter" | "instagram" | "facebook" | "youtube" | "linkedin";
  content: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  media?: {
    type: "image" | "video";
    url: string;
    thumbnail?: string;
  }[];
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
  url: string;
  createdAt: string;
}

interface SocialFeedProps {
  posts?: SocialPost[];
  layout?: "grid" | "masonry" | "carousel" | "list";
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
  showFilters?: boolean;
  maxPosts?: number;
  onPostClick?: (post: SocialPost) => void;
  className?: string;
}

interface PlatformConfig {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  name: string;
}

const platformConfig: Record<string, PlatformConfig> = {
  twitter: {
    icon: Twitter,
    color: "#1DA1F2",
    name: "Twitter",
  },
  instagram: {
    icon: Instagram,
    color: "#E4405F",
    name: "Instagram",
  },
  facebook: {
    icon: Facebook,
    color: "#1877F2",
    name: "Facebook",
  },
  youtube: {
    icon: Youtube,
    color: "#FF0000",
    name: "YouTube",
  },
  linkedin: {
    icon: Linkedin,
    color: "#0A66C2",
    name: "LinkedIn",
  },
};

// Mock data for demonstration
const mockPosts: SocialPost[] = [
  {
    id: "1",
    platform: "instagram",
    content:
      "Every bottle makes a difference! 💧 Join us in bringing clean water to communities worldwide. #GRATIS #CleanWater #Impact",
    author: {
      name: "GRATIS Foundation",
      username: "@gratis.ngo",
      avatar: "/lovable-uploads/logo-placeholder.png",
      verified: true,
    },
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800",
      },
    ],
    stats: {
      likes: 2847,
      comments: 156,
      shares: 423,
    },
    url: "https://instagram.com/p/example",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: "2",
    platform: "twitter",
    content:
      "🎨 Supporting arts education in 23 countries! Our latest impact report shows 150+ art programs funded through your water bottle purchases. Read more: link.gratis.ngo/impact",
    author: {
      name: "GRATIS",
      username: "@gratisngo",
      avatar: "/lovable-uploads/logo-placeholder.png",
      verified: true,
    },
    stats: {
      likes: 1523,
      comments: 89,
      shares: 312,
    },
    url: "https://twitter.com/gratisngo/status/example",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
  },
  {
    id: "3",
    platform: "facebook",
    content:
      "📚 Education changes everything. Thanks to our community, we've supported 1.000+ students this quarter. Your choice to drink GRATIS water makes this possible. 🙏",
    author: {
      name: "GRATIS Foundation",
      username: "gratis.foundation",
      avatar: "/lovable-uploads/logo-placeholder.png",
      verified: true,
    },
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
      },
    ],
    stats: {
      likes: 3421,
      comments: 234,
      shares: 856,
    },
    url: "https://facebook.com/gratis/posts/example",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: "4",
    platform: "youtube",
    content: "How Your Water Bottle Changes Lives | GRATIS Impact Story 2026",
    author: {
      name: "GRATIS",
      username: "@gratis",
      avatar: "/lovable-uploads/logo-placeholder.png",
      verified: true,
    },
    media: [
      {
        type: "video",
        url: "https://youtube.com/watch?v=example",
        thumbnail:
          "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=800",
      },
    ],
    stats: {
      likes: 5234,
      comments: 423,
      shares: 1023,
    },
    url: "https://youtube.com/watch?v=example",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: "5",
    platform: "linkedin",
    content:
      "Proud to announce: GRATIS has officially partnered with 127 NGOs across 23 countries. Together, we're proving that business can be a force for good. Read our latest impact report 👉",
    author: {
      name: "GRATIS Foundation",
      username: "gratis-foundation",
      avatar: "/lovable-uploads/logo-placeholder.png",
      verified: true,
    },
    stats: {
      likes: 1876,
      comments: 145,
      shares: 523,
    },
    url: "https://linkedin.com/company/gratis/posts/example",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
];

export function SocialFeed({
  posts = mockPosts,
  layout = "grid",
  autoRefresh = false,
  refreshInterval = 60000, // 1 minute
  showFilters = true,
  maxPosts,
  onPostClick,
  className,
}: SocialFeedProps) {
  const [filteredPosts, setFilteredPosts] = useState<SocialPost[]>(posts);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Filter posts by platform
    if (selectedPlatform === "all") {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(
        posts.filter((post) => post.platform === selectedPlatform),
      );
    }
  }, [selectedPlatform, posts]);

  useEffect(() => {
    // Auto-refresh functionality
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      handleRefresh();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const handleRefresh = async () => {
    setIsRefreshing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In production: fetch new posts from API
    // const response = await fetch('/api/social/feed');
    // const newPosts = await response.json();
    // setFilteredPosts(newPosts);

    setIsRefreshing(false);
  };

  const displayPosts = maxPosts
    ? filteredPosts.slice(0, maxPosts)
    : filteredPosts;

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const renderPost = (post: SocialPost) => {
    const config = platformConfig[post.platform];
    const Icon = config.icon;

    return (
      <Card
        key={post.id}
        className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => onPostClick?.(post)}
      >
        <CardContent className="p-4 space-y-3">
          {/* Author header */}
          <div className="flex items-start gap-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="font-semibold text-sm truncate">
                  {post.author.name}
                </p>
                {post.author.verified && (
                  <CheckCircle className="h-4 w-4 text-blue-500 shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="truncate">@{post.author.username}</span>
                <span>•</span>
                <span>
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
            <Badge
              variant="outline"
              className="shrink-0"
              style={{ borderColor: config.color, color: config.color }}
            >
              <Icon className="h-3 w-3 mr-1" />
              {config.name}
            </Badge>
          </div>

          {/* Content */}
          <p className="text-sm leading-relaxed">{post.content}</p>

          {/* Media */}
          {post.media && post.media.length > 0 && (
            <div className="rounded-lg overflow-hidden">
              {post.media[0].type === "image" ? (
                <img
                  src={post.media[0].url}
                  alt="Post media"
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="relative">
                  <img
                    src={post.media[0].thumbnail}
                    alt="Video thumbnail"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                      <div className="w-0 h-0 border-l-8 border-l-black border-y-6 border-y-transparent ml-1" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{formatNumber(post.stats.likes)}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>{formatNumber(post.stats.comments)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Share2 className="h-4 w-4" />
              <span>{formatNumber(post.stats.shares)}</span>
            </div>
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1 text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              View <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderLoadingSkeleton = () => (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-48 w-full rounded-lg" />
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
    </Card>
  );

  const layoutClass = {
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
    masonry: "columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4",
    carousel: "flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory",
    list: "flex flex-col gap-4",
  }[layout];

  return (
    <div className={className}>
      {/* Controls */}
      {showFilters && (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Select
              value={selectedPlatform}
              onValueChange={setSelectedPlatform}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All platforms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                {Object.entries(platformConfig).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {config.name}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <Badge variant="secondary">
              {displayPosts.length}{" "}
              {displayPosts.length === 1 ? "post" : "posts"}
            </Badge>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      )}

      {/* Posts */}
      {isLoading ? (
        <div className={layoutClass}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>{renderLoadingSkeleton()}</div>
          ))}
        </div>
      ) : displayPosts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">
              No posts found for the selected platform
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className={layoutClass}>
          {displayPosts.map((post) =>
            layout === "carousel" ? (
              <div key={post.id} className="min-w-[300px] snap-start">
                {renderPost(post)}
              </div>
            ) : (
              renderPost(post)
            ),
          )}
        </div>
      )}

      {/* Follow CTA */}
      <Card className="mt-8 bg-gradient-to-br from-primary/10 to-accent/10">
        <CardContent className="p-6 text-center space-y-4">
          <h3 className="text-xl font-bold">Follow GRATIS</h3>
          <p className="text-muted-foreground">
            Stay updated with our latest impact stories and community news
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {Object.entries(platformConfig).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <Button
                  key={key}
                  variant="outline"
                  size="sm"
                  asChild
                  className="gap-2"
                >
                  <a
                    href={`https://${key}.com/gratis`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="h-4 w-4" />
                    {config.name}
                  </a>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
