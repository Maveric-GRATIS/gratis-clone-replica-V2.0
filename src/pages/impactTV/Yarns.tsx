import SEO from "@/components/SEO";
import { LiveEventCard } from "@/components/impactTV/LiveEventCard";
import { yarnsContent, LiveEvent } from "@/data/impactTVContent";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Yarns() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "live" | "upcoming" | "replay">("all");

  const liveEvents = useMemo(() => 
    yarnsContent.filter(e => e.status === "live"), 
  []);

  const upcomingEvents = useMemo(() => 
    yarnsContent.filter(e => e.status === "upcoming")
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()),
  []);

  const replayEvents = useMemo(() => 
    yarnsContent.filter(e => e.status === "replay")
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()),
  []);

  const filteredEvents = useMemo(() => {
    let events: LiveEvent[] = [];
    
    if (filterStatus === "all") {
      events = [...liveEvents, ...upcomingEvents, ...replayEvents];
    } else {
      events = yarnsContent.filter(e => e.status === filterStatus);
    }

    if (searchQuery) {
      events = events.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return events;
  }, [searchQuery, filterStatus, liveEvents, upcomingEvents, replayEvents]);

  const handleEventClick = (event: LiveEvent) => {
    if (event.streamUrl) {
      window.open(event.streamUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="YARNS: Live Events & Replays | GRATIS Impact TV" 
        description="Stream our events live or catch the replay. Experience multicultural festivals, activations, and community gatherings."
        canonical={typeof window !== 'undefined' ? window.location.href : '/impact-tv/yarns'}
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-primary/10 to-background" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
            YARNS
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Live the moment. Stream our events live or catch the replay.
          </p>
        </div>
      </section>

      {/* Live Now Banner */}
      {liveEvents.length > 0 && (
        <section className="container max-w-7xl mx-auto px-4 mb-12">
          <div className="bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent border border-red-500/20 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-red-500 text-white animate-pulse text-base px-4 py-1">
                ● LIVE NOW
              </Badge>
              <h2 className="text-2xl font-bold">Happening Right Now</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveEvents.map(event => (
                <LiveEventCard 
                  key={event.id} 
                  event={event}
                  onClick={() => handleEventClick(event)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="container max-w-7xl mx-auto px-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="live">Live Now</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="replay">Replays</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Upcoming Events */}
      {(filterStatus === "all" || filterStatus === "upcoming") && upcomingEvents.length > 0 && (
        <section className="container max-w-7xl mx-auto px-4 mb-16">
          <h2 className="text-3xl font-bold mb-6">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map(event => (
              <LiveEventCard 
                key={event.id} 
                event={event}
                onClick={() => handleEventClick(event)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Replays */}
      {(filterStatus === "all" || filterStatus === "replay") && replayEvents.length > 0 && (
        <section className="container max-w-7xl mx-auto px-4 pb-16">
          <h2 className="text-3xl font-bold mb-6">
            {filterStatus === "replay" ? "All Replays" : "Catch the Replays"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {replayEvents.map(event => (
              <LiveEventCard 
                key={event.id} 
                event={event}
                onClick={() => handleEventClick(event)}
              />
            ))}
          </div>
        </section>
      )}

      {/* All Filtered Events */}
      {filterStatus !== "all" && filteredEvents.length === 0 && (
        <section className="container max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-muted-foreground text-lg">No events found.</p>
            <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or check back later.</p>
          </div>
        </section>
      )}
    </div>
  );
}
