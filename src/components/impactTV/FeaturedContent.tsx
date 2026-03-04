import { VideoContent } from "@/data/impactTVContent";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Eye } from "lucide-react";

interface FeaturedContentProps {
  video: VideoContent;
  onClick?: () => void;
}

export const FeaturedContent = ({ video, onClick }: FeaturedContentProps) => {
  return (
    <div className="relative rounded-xl overflow-hidden group cursor-pointer mb-12" onClick={onClick}>
      {/* Background Image */}
      <div className="aspect-[21/9] w-full relative">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container max-w-6xl mx-auto px-8">
          <div className="max-w-2xl space-y-4">
            <Badge className="bg-accent text-accent-foreground text-sm px-3 py-1">
              FEATURED
            </Badge>

            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              {video.title}
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground line-clamp-3">
              {video.description}
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {video.duration && (
                <span className="font-semibold">{video.duration}</span>
              )}
              {video.viewCount && (
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{(video.viewCount / 1000).toFixed(1)}K views</span>
                </div>
              )}
              {video.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <Button size="lg" className="gap-2" onClick={onClick}>
                <Play className="w-5 h-5" fill="currentColor" />
                Watch Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Play icon overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="w-24 h-24 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center">
          <Play className="w-12 h-12 text-white ml-1" fill="currentColor" />
        </div>
      </div>
    </div>
  );
};
