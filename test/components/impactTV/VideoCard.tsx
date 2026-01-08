import { VideoContent } from "@/data/impactTVContent";
import { Badge } from "@/components/ui/badge";
import { Play, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface VideoCardProps {
  video: VideoContent;
  onClick?: () => void;
}

export const VideoCard = ({ video, onClick }: VideoCardProps) => {
  return (
    <Card 
      className="group cursor-pointer overflow-hidden hover-scale border-border"
      onClick={onClick}
    >
      <div className="relative aspect-video bg-secondary overflow-hidden">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
            <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
          </div>
        </div>

        {/* Duration badge */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-background/90 rounded text-xs font-semibold">
            {video.duration}
          </div>
        )}

        {/* Featured badge */}
        {video.featured && (
          <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">
            FEATURED
          </Badge>
        )}

        {/* Series info */}
        {video.series && (
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
            {video.series} S{video.season}E{video.episode}
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-base line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {video.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            {video.viewCount && (
              <>
                <Eye className="w-3 h-3" />
                <span>{(video.viewCount / 1000).toFixed(1)}K views</span>
              </>
            )}
          </div>
          {video.socialPlatform && (
            <Badge variant="outline" className="text-xs">
              {video.socialPlatform}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
