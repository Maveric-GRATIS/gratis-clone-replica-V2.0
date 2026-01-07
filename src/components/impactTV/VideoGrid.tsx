import { VideoContent } from "@/data/impactTVContent";
import { VideoCard } from "./VideoCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface VideoGridProps {
  videos: VideoContent[];
  loading?: boolean;
  onVideoClick?: (video: VideoContent) => void;
  columns?: 2 | 3 | 4;
  showLoadMore?: boolean;
  initialCount?: number;
}

export const VideoGrid = ({ 
  videos, 
  loading, 
  onVideoClick,
  columns = 3,
  showLoadMore = false,
  initialCount = 12
}: VideoGridProps) => {
  const [displayCount, setDisplayCount] = useState(initialCount);

  const columnClasses = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
  };

  if (loading) {
    return (
      <div className={`grid grid-cols-1 ${columnClasses[columns]} gap-6`}>
        {[...Array(initialCount)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-video w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg">No videos found.</p>
        <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or check back later.</p>
      </div>
    );
  }

  const displayedVideos = showLoadMore ? videos.slice(0, displayCount) : videos;
  const hasMore = displayCount < videos.length;

  return (
    <div className="space-y-8">
      <div className={`grid grid-cols-1 ${columnClasses[columns]} gap-6`}>
        {displayedVideos.map((video) => (
          <VideoCard 
            key={video.id} 
            video={video}
            onClick={() => onVideoClick?.(video)}
          />
        ))}
      </div>

      {showLoadMore && hasMore && (
        <div className="text-center pt-4">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => setDisplayCount(prev => prev + initialCount)}
          >
            Load More Videos
          </Button>
        </div>
      )}
    </div>
  );
};
