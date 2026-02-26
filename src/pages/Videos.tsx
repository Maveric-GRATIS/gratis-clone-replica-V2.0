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
import {
  useVideos,
  useFeaturedVideos,
  useVideosByCategory,
} from "@/hooks/useVideos";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function Videos() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Fetch videos from Firebase
  const { data: allVideos, isLoading: allLoading } = useVideos();
  const { data: featuredVideosData, isLoading: featuredLoading } =
    useFeaturedVideos(10);

  // Filter videos based on category and search
  const categoryData = useVideosByCategory(
    selectedCategory !== "all" ? selectedCategory : undefined,
  );

  const displayVideos =
    selectedCategory === "all" ? allVideos || [] : categoryData.data || [];

  const isLoading =
    selectedCategory === "all" ? allLoading : categoryData.isLoading;

  const filteredVideos = useMemo(() => {
    if (!searchQuery.trim()) return displayVideos;

    const search = searchQuery.toLowerCase();
    return displayVideos.filter(
      (video) =>
        video.title.toLowerCase().includes(search) ||
        video.description?.toLowerCase().includes(search) ||
        video.tags?.some((tag) => tag.toLowerCase().includes(search)),
    );
  }, [displayVideos, searchQuery]);

  const featuredVideos = (featuredVideosData || [])
    .filter((v) => {
      if (selectedCategory === "all") return true;
      return v.category === selectedCategory;
    })
    .filter((v) => {
      if (!searchQuery.trim()) return true;
      const search = searchQuery.toLowerCase();
      return (
        v.title.toLowerCase().includes(search) ||
        v.description?.toLowerCase().includes(search)
      );
    });

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

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        )}

        {!isLoading && (
          <>
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
                    <p className="text-lg text-muted-foreground">
                      No videos found
                    </p>
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
          </>
        )}
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
