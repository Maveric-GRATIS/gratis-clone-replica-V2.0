import { LiveEvent } from "@/data/impactTVContent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Eye, Play } from "lucide-react";
import { useEffect, useState } from "react";

interface LiveEventCardProps {
  event: LiveEvent;
  onClick?: () => void;
}

export const LiveEventCard = ({ event, onClick }: LiveEventCardProps) => {
  const [timeUntil, setTimeUntil] = useState<string>("");

  useEffect(() => {
    if (event.status !== "upcoming") return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const start = new Date(event.startDate).getTime();
      const diff = start - now;

      if (diff <= 0) {
        setTimeUntil("Starting soon!");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeUntil(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeUntil(`${hours}h ${minutes}m`);
      } else {
        setTimeUntil(`${minutes}m`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [event.startDate, event.status]);

  const getStatusBadge = () => {
    switch (event.status) {
      case "live":
        return (
          <Badge className="bg-red-500 text-white animate-pulse">● LIVE</Badge>
        );
      case "upcoming":
        return <Badge variant="secondary">UPCOMING</Badge>;
      case "replay":
        return <Badge variant="outline">REPLAY</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="group cursor-pointer overflow-hidden hover-scale border-border">
      <div className="relative aspect-video bg-secondary overflow-hidden">
        <img
          src={event.thumbnail}
          alt={event.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Status badge */}
        <div className="absolute top-4 left-4">{getStatusBadge()}</div>

        {/* Countdown for upcoming */}
        {event.status === "upcoming" && timeUntil && (
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-background/90 rounded-md text-sm font-semibold">
            {timeUntil}
          </div>
        )}

        {/* Play button overlay */}
        {event.status !== "upcoming" && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center">
              <Play
                className="w-10 h-10 text-primary-foreground ml-1"
                fill="currentColor"
              />
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-4">
        <div>
          <h3 className="font-bold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(event.startDate)}</span>
          </div>

          {event.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
          )}

          {event.viewCount && event.status === "replay" && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Eye className="w-4 h-4" />
              <span>{(event.viewCount / 1000).toFixed(1)}K views</span>
            </div>
          )}
        </div>

        <Button
          className="w-full"
          variant={event.status === "live" ? "default" : "outline"}
          onClick={onClick}
        >
          {event.status === "live" && "Watch Live"}
          {event.status === "upcoming" && "Set Reminder"}
          {event.status === "replay" && "Watch Replay"}
        </Button>
      </CardContent>
    </Card>
  );
};
