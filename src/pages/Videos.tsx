import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { PageHero } from "@/components/PageHero";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Search, Eye, Clock, Lock, Star } from "lucide-react";
import { Video } from "@/types/video";
import { VIDEO_CATEGORIES } from "@/lib/mux/config";
import {
  formatDuration,
  formatViewCount,
  getVideoThumbnail,
} from "@/lib/mux/helpers";

// Mock video data - in productie van Firestore
const MOCK_VIDEOS: Video[] = [
  {
    id: "1",
    title: "Clean Water Project: Kenya 2025",
    slug: "clean-water-project-kenya-2025",
    description:
      "See how your support brought clean water to 5.000 people in rural Kenya. Follow the journey from drilling the well to the first drops of clean water.",
    muxAssetId: "mock_asset_1",
    muxPlaybackId: "mock_playback_1",
    category: "impact_stories",
    tags: ["water", "kenya", "impact"],
    duration: 420, // 7 minutes
    thumbnailUrl:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
    accessLevel: "public",
    status: "ready",
    viewCount: 12500,
    likeCount: 890,
    publishedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
    updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
    authorId: "admin",
    authorName: "GRATIS Team",
    featured: true,
    featuredOrder: 1,
  },
  {
    id: "2",
    title: "Behind the Bottle: Design Process",
    slug: "behind-the-bottle-design-process",
    description:
      "Take an exclusive look at how we design our iconic GRATIS bottles. From concept sketches to final product.",
    muxAssetId: "mock_asset_2",
    muxPlaybackId: "mock_playback_2",
    category: "behind_scenes",
    tags: ["design", "product", "bottle"],
    duration: 300, // 5 minutes
    thumbnailUrl:
      "https://images.unsplash.com/photo-1560264280-88b68371db39?w=800",
    accessLevel: "members_only",
    status: "ready",
    viewCount: 8200,
    likeCount: 620,
    publishedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
    updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
    authorId: "admin",
    authorName: "Emma van Dijk",
    featured: true,
    featuredOrder: 2,
  },
  {
    id: "3",
    title: "Arts Education: Transforming Lives",
    slug: "arts-education-transforming-lives",
    description:
      "Meet the students whose lives were changed by our arts education programs. Hear their stories and see their incredible artwork.",
    muxAssetId: "mock_asset_3",
    muxPlaybackId: "mock_playback_3",
    category: "impact_stories",
    tags: ["arts", "education", "students"],
    duration: 540, // 9 minutes
    thumbnailUrl:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800",
    accessLevel: "public",
    status: "ready",
    viewCount: 15800,
    likeCount: 1230,
    publishedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
    updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
    authorId: "admin",
    authorName: "GRATIS Team",
    featured: true,
    featuredOrder: 3,
  },
  {
    id: "4",
    title: "Founder Series: Our Mission",
    slug: "founder-series-our-mission",
    description:
      "Emma van Dijk shares the inspiration behind GRATIS and our vision for the future. An intimate conversation about purpose and impact.",
    muxAssetId: "mock_asset_4",
    muxPlaybackId: "mock_playback_4",
    category: "behind_scenes",
    tags: ["founder", "mission", "vision"],
    duration: 720, // 12 minutes
    thumbnailUrl:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800",
    accessLevel: "tier_specific",
    requiredTier: "core",
    status: "ready",
    viewCount: 3200,
    likeCount: 420,
    publishedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
    updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
    authorId: "admin",
    authorName: "Emma van Dijk",
  },
  {
    id: "5",
    title: "How to Vote on NGO Partners",
    slug: "how-to-vote-on-ngo-partners",
    description:
      "Step-by-step tutorial on how TRIBE members can vote on which NGO partners we support each quarter.",
    muxAssetId: "mock_asset_5",
    muxPlaybackId: "mock_playback_5",
    category: "educational",
    tags: ["tutorial", "voting", "ngo"],
    duration: 180, // 3 minutes
    thumbnailUrl:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800",
    accessLevel: "members_only",
    status: "ready",
    viewCount: 5600,
    likeCount: 380,
    publishedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
    updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
    authorId: "admin",
    authorName: "GRATIS Team",
  },
];

export default function Videos() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredVideos = useMemo(() => {
    return MOCK_VIDEOS.filter((video) => {
      const matchesSearch =
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || video.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const featuredVideos = filteredVideos
    .filter((v) => v.featured)
    .sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0));

  const categoryVideos = filteredVideos.filter((v) => !v.featured);

  return (
    <>
      <SEO
        title="Impact TV - Videos"
        description="Watch inspiring stories, behind-the-scenes content, and educational videos about GRATIS impact"
      />

      <PageHero
        title="Impact TV"
        subtitle="Watch stories of change, learn about our work, and see your impact in action"
      />

      <div className="container py-12 space-y-8">
        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="flex-wrap h-auto">
              <TabsTrigger value="all">All Videos</TabsTrigger>
              {Object.entries(VIDEO_CATEGORIES).map(([key, label]) => (
                <TabsTrigger key={key} value={key}>
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Featured Videos */}
        {featuredVideos.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Featured</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVideos.map((video) => (
                <VideoCard key={video.id} video={video} featured />
              ))}
            </div>
          </section>
        )}

        {/* All Videos */}
        <section>
          <h2 className="text-2xl font-bold mb-4">
            {selectedCategory === "all"
              ? "All Videos"
              : VIDEO_CATEGORIES[
                  selectedCategory as keyof typeof VIDEO_CATEGORIES
                ]}
          </h2>

          {categoryVideos.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Play className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">No videos found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function VideoCard({
  video,
  featured = false,
}: {
  video: Video;
  featured?: boolean;
}) {
  const isLocked = video.accessLevel !== "public";

  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-shadow ${featured ? "border-primary" : ""}`}
    >
      <Link to={`/videos/${video.slug}`}>
        <div className="relative aspect-video">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
          />

          {/* Play Overlay */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
              <Play className="h-8 w-8 text-black ml-1" />
            </div>
          </div>

          {/* Duration Badge */}
          <Badge className="absolute bottom-2 right-2 bg-black/80 text-white">
            {formatDuration(video.duration)}
          </Badge>

          {/* Lock Badge */}
          {isLocked && (
            <Badge className="absolute top-2 left-2 bg-hot-lime text-jet-black gap-1">
              <Lock className="h-3 w-3" />
              {video.accessLevel === "members_only"
                ? "Members"
                : video.requiredTier?.toUpperCase()}
            </Badge>
          )}

          {/* Featured Star */}
          {featured && (
            <div className="absolute top-2 right-2">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            </div>
          )}
        </div>
      </Link>

      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-2 text-base">
          <Link to={`/videos/${video.slug}`} className="hover:underline">
            {video.title}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-2 text-sm">
          {video.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{formatViewCount(video.viewCount)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatDuration(video.duration)}</span>
          </div>
        </div>

        <div className="flex gap-1 mt-2 flex-wrap">
          {video.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <p className="text-xs text-muted-foreground">By {video.authorName}</p>
      </CardFooter>
    </Card>
  );
}
