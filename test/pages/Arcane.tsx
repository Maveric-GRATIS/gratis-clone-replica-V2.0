import { useState, useMemo } from "react";
import SEO from "@/components/SEO";
import { events } from "@/data/events";
import { EventCard } from "@/components/events/EventCard";
import { EventFilters } from "@/components/events/EventFilters";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export default function Arcane() {
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(9);

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesCity = selectedCity === "All Cities" || event.city === selectedCity;
      const matchesType = selectedType === "All Types" || event.type === selectedType;
      const matchesStatus = selectedStatus === "all" || event.status === selectedStatus;
      const matchesSearch = searchQuery === "" || 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.city.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCity && matchesType && matchesStatus && matchesSearch;
    });
  }, [selectedCity, selectedType, selectedStatus, searchQuery]);

  const visibleEvents = filteredEvents.slice(0, visibleCount);
  const hasMore = visibleCount < filteredEvents.length;

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="GRATIS ARCANE — Multicultural Events Worldwide" 
        description="Join GRATIS at music festivals, cultural celebrations, and street events in Amsterdam, NYC, London, Berlin, Paris, Barcelona & more. Free water. Bold culture. Real impact."
        canonical={typeof window !== 'undefined' ? window.location.href : '/arcane'} 
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-primary/10 to-background" />
        <div className="absolute inset-0 bg-[url('/lovable-uploads/1788a965-772c-43e2-af66-c9ed8ffc22aa.png')] opacity-5 bg-cover bg-center" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
            ARCANE: WHERE CULTURE MEETS MOVEMENT
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Free water. Bold culture. Real impact. Join us at festivals, street parties, and multicultural celebrations worldwide.
          </p>
        </div>
      </section>

      {/* Filters */}
      <EventFilters
        selectedCity={selectedCity}
        selectedType={selectedType}
        selectedStatus={selectedStatus}
        searchQuery={searchQuery}
        resultCount={filteredEvents.length}
        onCityChange={setSelectedCity}
        onTypeChange={setSelectedType}
        onStatusChange={setSelectedStatus}
        onSearchChange={setSearchQuery}
      />

      {/* Events Grid */}
      <section className="container py-12">
        {filteredEvents.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Calendar className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-2xl font-bold mb-2">No Events Found</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              No events match your filters. Try adjusting your search or check back soon for new events!
            </p>
            <Button
              onClick={() => {
                setSelectedCity("All Cities");
                setSelectedType("All Types");
                setSelectedStatus("upcoming");
                setSearchQuery("");
              }}
              variant="hero"
            >
              View All Events
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {visibleEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event}
                  onRSVP={(event) => {
                    // TODO: Implement RSVP modal
                    console.log("RSVP for:", event.title);
                  }}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-12">
                <Button
                  onClick={() => setVisibleCount((prev) => prev + 9)}
                  variant="outline"
                  size="lg"
                  className="font-bold"
                >
                  Load More Events
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
