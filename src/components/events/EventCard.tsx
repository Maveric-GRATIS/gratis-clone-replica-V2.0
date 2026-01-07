import { format } from "date-fns";
import { Calendar, MapPin, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Event } from "@/data/events";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: Event;
  onRSVP?: (event: Event) => void;
}

const getStatusBadgeStyles = (status: Event["status"]) => {
  switch (status) {
    case "live":
      return "bg-red-500 text-white animate-pulse";
    case "upcoming":
      return "bg-gradient-to-r from-[hsl(var(--brand-yellow))] to-[hsl(var(--brand-pink))] text-foreground";
    case "past":
      return "bg-muted text-muted-foreground";
  }
};

const getTypeBadgeColor = (type: string) => {
  const typeColors: Record<string, string> = {
    "Music Festival": "bg-[hsl(var(--brand-pink))] text-white",
    "Cultural Celebration": "bg-[hsl(var(--brand-blue))] text-white",
    "Street Festival": "bg-[hsl(var(--brand-yellow))] text-foreground",
    "Art & Design": "bg-purple-600 text-white",
  };
  return typeColors[type] || "bg-secondary text-secondary-foreground";
};

export const EventCard = ({ event, onRSVP }: EventCardProps) => {
  const dateRange = event.endDate
    ? `${format(new Date(event.date), "MMM d")} - ${format(new Date(event.endDate), "MMM d, yyyy")}`
    : format(new Date(event.date), "MMM d, yyyy");

  const handleCTA = () => {
    if (event.status === "upcoming" && onRSVP) {
      onRSVP(event);
    }
  };

  const getCTAText = () => {
    switch (event.status) {
      case "live":
        return "WATCH LIVE";
      case "upcoming":
        return "RSVP NOW";
      case "past":
        return "VIEW RECAP";
    }
  };

  return (
    <Card className="overflow-hidden group hover-scale border-border/50 hover:border-primary/50 transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        
        {/* Status Badge */}
        <Badge
          className={cn(
            "absolute top-3 right-3 font-bold",
            getStatusBadgeStyles(event.status)
          )}
        >
          {event.status.toUpperCase()}
        </Badge>

        {/* Type Badge */}
        <Badge
          className={cn(
            "absolute top-3 left-3 font-semibold",
            getTypeBadgeColor(event.type)
          )}
        >
          {event.type}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Date & Location */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{dateRange}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>{event.city}, {event.country}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold leading-tight line-clamp-2">
          {event.title}
        </h3>

        {/* Venue */}
        <p className="text-sm text-muted-foreground">{event.venue}</p>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>

        {/* What We Do There */}
        <div className="pt-2 border-t border-border/50">
          <p className="text-xs font-semibold text-primary mb-1">WHAT WE DO THERE</p>
          <p className="text-xs text-foreground/80 line-clamp-2">
            {event.whatWeDoThere}
          </p>
        </div>

        {/* Attendees */}
        {event.attendees && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>{event.attendees.toLocaleString()} expected attendees</span>
          </div>
        )}

        {/* CTA Button */}
        <Button
          onClick={handleCTA}
          variant={event.status === "upcoming" ? "hero" : "outline"}
          className="w-full mt-2 font-bold"
          size="lg"
        >
          {getCTAText()}
        </Button>
      </div>
    </Card>
  );
};
