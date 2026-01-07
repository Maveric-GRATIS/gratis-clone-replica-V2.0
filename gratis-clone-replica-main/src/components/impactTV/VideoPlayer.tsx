import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VideoContent } from "@/data/impactTVContent";
import { Button } from "@/components/ui/button";
import { Share2, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface VideoPlayerProps {
  video: VideoContent | null;
  open: boolean;
  onClose: () => void;
}

export const VideoPlayer = ({ video, open, onClose }: VideoPlayerProps) => {
  if (!video) return null;

  const handleShare = () => {
    const url = `${window.location.origin}/impact-tv/${video.category}/${video.slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const handleExternalLink = () => {
    if (video.videoUrl) {
      window.open(video.videoUrl, '_blank');
    } else {
      toast.info("External link not available for this video");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{video.title}</DialogTitle>
        </DialogHeader>

        {/* Video Player Area */}
        <div className="aspect-video bg-secondary rounded-lg overflow-hidden">
          {video.videoUrl ? (
            <iframe
              src={video.videoUrl}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              {video.series && (
                <Badge variant="secondary">
                  {video.series} - S{video.season}E{video.episode}
                </Badge>
              )}
              {video.socialPlatform && (
                <Badge variant="outline">{video.socialPlatform}</Badge>
              )}
              {video.duration && (
                <Badge variant="outline">{video.duration}</Badge>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              {video.videoUrl && (
                <Button variant="outline" size="sm" onClick={handleExternalLink}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Watch on {video.socialPlatform}
                </Button>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{video.description}</p>
          </div>

          {video.tags.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {video.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {video.viewCount && (
            <div className="text-sm text-muted-foreground">
              {video.viewCount.toLocaleString()} views • Published {new Date(video.publishedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
