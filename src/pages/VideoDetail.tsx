import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { MuxPlayer } from "@/components/video/MuxPlayer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Eye,
  ThumbsUp,
  Share2,
  Clock,
  Calendar,
  Lock,
  Play,
} from "lucide-react";
import { Video } from "@/types/video";
import { VIDEO_CATEGORIES } from "@/lib/mux/config";
import {
  formatDuration,
  formatViewCount,
  canAccessVideo,
} from "@/lib/mux/helpers";
import { format } from "date-fns";

// Mock data - in productie van Firestore
const getVideoBySlug = (slug: string): Video | null => {
  const videos: Video[] = [
    {
      id: "1",
      title: "Clean Water Project: Kenya 2025",
      slug: "clean-water-project-kenya-2025",
      description: `See how your support brought clean water to 5,000 people in rural Kenya. Follow the journey from drilling the well to the first drops of clean water.

This documentary takes you through the entire process - from site selection and community engagement, to drilling operations and water quality testing. Meet the families whose lives have been transformed by access to clean water.

**Impact Highlights:**
- 5,000 people now have access to clean water
- 3 new wells drilled in remote villages
- 95% reduction in waterborne diseases
- Children can now attend school instead of walking hours for water

**Partners:**
This project was made possible through partnerships with WaterAid Kenya and the local community leadership.`,
      muxAssetId: "mock_asset_1",
      muxPlaybackId: "mock_playback_1",
      category: "impact_stories",
      tags: ["water", "kenya", "impact", "documentary"],
      duration: 420,
      thumbnailUrl:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      accessLevel: "public",
      status: "ready",
      viewCount: 12500,
      likeCount: 890,
      publishedAt: {
        seconds: Date.now() / 1000 - 86400 * 7,
        nanoseconds: 0,
      } as any,
      createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
      updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
      authorId: "admin",
      authorName: "GRATIS Team",
      featured: true,
    },
  ];

  return videos.find((v) => v.slug === slug) || null;
};

// Mock related videos
const getRelatedVideos = (currentVideo: Video): Video[] => {
  return []; // Would filter by category/tags in production
};

export default function VideoDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [hasAccess, setHasAccess] = useState(true);
  const [liked, setLiked] = useState(false);
  const [watchTime, setWatchTime] = useState(0);

  useEffect(() => {
    if (slug) {
      const fetchedVideo = getVideoBySlug(slug);
      setVideo(fetchedVideo);

      if (fetchedVideo) {
        // Check access (mock - in production check user tier)
        const userTier = "explorer"; // Would come from auth context
        setHasAccess(canAccessVideo(fetchedVideo, userTier));

        // Get related videos
        setRelatedVideos(getRelatedVideos(fetchedVideo));
      }
    }
  }, [slug]);

  if (!video) {
    return (
      <div className="container py-12">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Play className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Video Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The video you're looking for doesn't exist.
            </p>
            <Button asChild>
              <Link to="/videos">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Videos
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleTimeUpdate = (currentTime: number) => {
    setWatchTime(currentTime);
    // In production: track watch progress
  };

  const handleVideoEnd = () => {
    // In production: mark video as watched, update analytics
    console.log("Video ended");
  };

  const handleLike = () => {
    setLiked(!liked);
    // In production: update like count in Firestore
  };

  return (
    <>
      <SEO
        title={video.title}
        description={video.description}
        image={video.thumbnailUrl}
      />

      <div className="min-h-screen bg-background">
        {/* Back Button */}
        <div className="container pt-6">
          <Button asChild variant="ghost" size="sm">
            <Link to="/videos">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Videos
            </Link>
          </Button>
        </div>

        <div className="container py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Player */}
              {hasAccess ? (
                <MuxPlayer
                  video={video}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleVideoEnd}
                  className="aspect-video"
                />
              ) : (
                <Card className="aspect-video flex items-center justify-center bg-muted">
                  <CardContent className="text-center py-12">
                    <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-bold mb-2">
                      Members Only Content
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {video.accessLevel === "tier_specific"
                        ? `This video is exclusive to ${video.requiredTier?.toUpperCase()} members and above`
                        : "This video is exclusive to TRIBE members"}
                    </p>
                    <Button asChild>
                      <Link to="/tribe">Join TRIBE</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Video Info */}
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{video.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{formatViewCount(video.viewCount)} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDuration(video.duration)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {video.publishedAt &&
                          format(
                            new Date(video.publishedAt.seconds * 1000),
                            "MMM d, yyyy",
                          )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant={liked ? "default" : "outline"}
                    onClick={handleLike}
                    className="gap-2"
                  >
                    <ThumbsUp
                      className={`h-4 w-4 ${liked ? "fill-current" : ""}`}
                    />
                    {liked ? "Liked" : "Like"}
                    <span className="ml-1">
                      ({video.likeCount + (liked ? 1 : 0)})
                    </span>
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>

                <Separator />

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={`https://ui-avatars.com/api/?name=${video.authorName}`}
                    />
                    <AvatarFallback>{video.authorName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{video.authorName}</p>
                    <p className="text-sm text-muted-foreground">
                      Content Creator
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-2">About this video</h3>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {video.description.split("\n\n").map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                {/* Tags & Category */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {VIDEO_CATEGORIES[video.category]}
                  </Badge>
                  {video.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Related Videos */}
              {relatedVideos.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Related Videos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {relatedVideos.map((relatedVideo) => (
                      <Link
                        key={relatedVideo.id}
                        to={`/videos/${relatedVideo.slug}`}
                        className="flex gap-3 hover:bg-muted p-2 rounded transition-colors"
                      >
                        <img
                          src={relatedVideo.thumbnailUrl}
                          alt={relatedVideo.title}
                          className="w-32 h-20 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-2">
                            {relatedVideo.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatViewCount(relatedVideo.viewCount)} views
                          </p>
                        </div>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* CTA Card */}
              <Card className="bg-gradient-to-br from-hot-lime to-electric-blue text-jet-black">
                <CardHeader>
                  <CardTitle>Join TRIBE</CardTitle>
                  <CardDescription className="text-jet-black/80">
                    Get access to exclusive videos, behind-the-scenes content,
                    and more
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full" variant="secondary">
                    <Link to="/tribe">Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
