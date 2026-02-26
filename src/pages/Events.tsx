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
import {
  Calendar,
  MapPin,
  Users,
  Video,
  Search,
  Clock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { useEvents, useUpcomingEvents, usePastEvents } from "@/hooks/useEvents";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function Events() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");

  const { data: allEvents, isLoading: allLoading } = useEvents();
  const { data: upcomingEvents, isLoading: upcomingLoading } =
    useUpcomingEvents(20);
  const { data: pastEvents, isLoading: pastLoading } = usePastEvents(20);

  // Determine which data to show based on active tab
  const { events, isLoading } = useMemo(() => {
    if (activeTab === "all") {
      return { events: allEvents || [], isLoading: allLoading };
    } else if (activeTab === "upcoming") {
      return { events: upcomingEvents || [], isLoading: upcomingLoading };
    } else {
      return { events: pastEvents || [], isLoading: pastLoading };
    }
  }, [
    activeTab,
    allEvents,
    upcomingEvents,
    pastEvents,
    allLoading,
    upcomingLoading,
    pastLoading,
  ]);

  // Filter events based on search
  const filteredEvents = useMemo(() => {
    if (!searchTerm.trim()) return events;

    const search = searchTerm.toLowerCase();
    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(search) ||
        event.description?.toLowerCase().includes(search) ||
        event.location?.toLowerCase().includes(search) ||
        event.type?.toLowerCase().includes(search),
    );
  }, [events, searchTerm]);

  const stats = {
    total: allEvents?.length || 0,
    upcoming: upcomingEvents?.length || 0,
    past: pastEvents?.length || 0,
  };

  return (
    <>
      <SEO
        title="Events & Community"
        description="Join GRATIS events, workshops, and webinars. Connect with our community and make an impact together."
        keywords="GRATIS events, community events, workshops, webinars, meetups"
      />

      <PageHero
        title="Events & Community"
        description="Connect, learn, and make impact together at GRATIS events"
        imageUrl="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Events", to: "/events" },
        ]}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Events
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Upcoming
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {stats.upcoming}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Past Events
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.past}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search events by name, location, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-lg py-6"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredEvents.length === 0 && (
            <Card className="text-center py-20">
              <CardContent>
                <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-2xl font-bold mb-2">No Events Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : activeTab === "upcoming"
                      ? "Check back soon for upcoming events!"
                      : "No events available in this category"}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Events Grid */}
          {!isLoading && filteredEvents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => {
                const eventDate = event.date?.toDate
                  ? event.date.toDate()
                  : new Date();
                const isPast = eventDate < new Date();
                const capacity = event.capacity || 0;
                const registered = event.registered || 0;
                const spotsLeft = capacity - registered;
                const percentFull =
                  capacity > 0 ? (registered / capacity) * 100 : 0;

                return (
                  <Card
                    key={event.id}
                    className="flex flex-col hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={
                          event.imageUrl ||
                          "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"
                        }
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      {event.featured && (
                        <Badge className="absolute top-2 right-2 bg-yellow-500">
                          Featured
                        </Badge>
                      )}
                      {isPast && (
                        <Badge
                          className="absolute top-2 left-2"
                          variant="secondary"
                        >
                          Past Event
                        </Badge>
                      )}
                    </div>

                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{event.type || "Event"}</Badge>
                        {event.status === "published" && (
                          <Badge variant="default">Published</Badge>
                        )}
                      </div>
                      <CardTitle className="line-clamp-2">
                        {event.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {event.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(eventDate, "MMM dd, yyyy • HH:mm")}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span className="line-clamp-1">
                            {event.location ||
                              event.locationDetails ||
                              "Online"}
                          </span>
                        </div>

                        {capacity > 0 && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                <Users className="h-4 w-4 inline mr-1" />
                                {registered} / {capacity} registered
                              </span>
                              <span className="font-medium">
                                {spotsLeft > 0
                                  ? `${spotsLeft} spots left`
                                  : "Full"}
                              </span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  percentFull >= 90
                                    ? "bg-red-500"
                                    : percentFull >= 70
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                }`}
                                style={{
                                  width: `${Math.min(percentFull, 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="pt-0">
                      <Link to={`/events/${event.id}`} className="w-full">
                        <Button
                          className="w-full gap-2"
                          disabled={isPast && spotsLeft <= 0}
                        >
                          {isPast
                            ? "View Details"
                            : spotsLeft > 0
                              ? "Register Now"
                              : "Join Waitlist"}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </Tabs>

        {/* CTA Section */}
        <Card className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Want to Host an Event?</h2>
            <p className="text-lg mb-6 opacity-90">
              Partner with GRATIS to organize impactful events for your
              community
            </p>
            <Button size="lg" variant="secondary">
              Become a Partner
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
