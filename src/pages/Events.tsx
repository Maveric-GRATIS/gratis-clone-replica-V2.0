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
  Filter,
  Clock,
  Globe,
  ArrowRight,
  Heart,
} from "lucide-react";
import { format } from "date-fns";

// Mock data - in productie komt dit van Firestore
const MOCK_EVENTS = [
  {
    id: "1",
    title: "Amsterdam Water Festival 2026",
    slug: "amsterdam-water-festival-2026",
    description:
      "Join us for a day of celebrating clean water access with live music, workshops, and free water distribution.",
    shortDescription: "Celebrate clean water with music and workshops",
    type: "fundraiser" as const,
    format: "in_person" as const,
    status: "published" as const,
    coverImage:
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
    startDate: new Date("2026-06-15T10:00:00"),
    endDate: new Date("2026-06-15T18:00:00"),
    timezone: "Europe/Amsterdam",
    location: {
      name: "Vondelpark",
      address: "Vondelpark 1",
      city: "Amsterdam",
      state: "",
      postalCode: "1071 AA",
      country: "Netherlands",
    },
    registration: {
      enabled: true,
      maxAttendees: 500,
      currentAttendees: 234,
      waitlistEnabled: true,
      waitlistCount: 12,
    },
    accessLevel: "public" as const,
    ticketTiers: [
      { id: "t1", name: "Free Entry", price: 0, available: 266 },
      { id: "t2", name: "Supporter", price: 25, available: 50 },
    ],
  },
  {
    id: "2",
    title: "Virtual Impact Webinar: Arts Education",
    slug: "virtual-impact-webinar-arts",
    description:
      "Learn how GRATIS supports arts education programs worldwide. Hear from NGO partners and see real impact stories.",
    shortDescription: "Online webinar about arts education impact",
    type: "webinar" as const,
    format: "virtual" as const,
    status: "published" as const,
    coverImage:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800",
    startDate: new Date("2026-02-20T19:00:00"),
    endDate: new Date("2026-02-20T20:30:00"),
    timezone: "Europe/Amsterdam",
    virtualDetails: {
      platform: "zoom" as const,
      url: "https://zoom.us/j/example",
    },
    registration: {
      enabled: true,
      maxAttendees: 1000,
      currentAttendees: 456,
      waitlistEnabled: false,
      waitlistCount: 0,
    },
    accessLevel: "public" as const,
    ticketTiers: [{ id: "t1", name: "Free Ticket", price: 0, available: 544 }],
  },
  {
    id: "3",
    title: "Bottle Design Workshop",
    slug: "bottle-design-workshop",
    description:
      "Hands-on workshop where you design your own GRATIS bottle. Learn about sustainable packaging and branding.",
    shortDescription: "Design your own GRATIS bottle",
    type: "workshop" as const,
    format: "in_person" as const,
    status: "published" as const,
    coverImage:
      "https://images.unsplash.com/photo-1560264280-88b68371db39?w=800",
    startDate: new Date("2026-03-10T14:00:00"),
    endDate: new Date("2026-03-10T17:00:00"),
    timezone: "Europe/Amsterdam",
    location: {
      name: "GRATIS HQ",
      address: "Prinsengracht 250",
      city: "Amsterdam",
      state: "",
      postalCode: "1016 HH",
      country: "Netherlands",
    },
    registration: {
      enabled: true,
      maxAttendees: 30,
      currentAttendees: 18,
      waitlistEnabled: true,
      waitlistCount: 5,
    },
    accessLevel: "members_only" as const,
    ticketTiers: [
      { id: "t1", name: "Member Ticket", price: 15, available: 12 },
    ],
  },
  {
    id: "4",
    title: "TRIBE Meetup: Rotterdam",
    slug: "tribe-meetup-rotterdam",
    description:
      "Connect with fellow TRIBE members in Rotterdam. Network, share stories, and plan local impact initiatives.",
    shortDescription: "Connect with TRIBE members in Rotterdam",
    type: "meetup" as const,
    format: "in_person" as const,
    status: "published" as const,
    coverImage:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800",
    startDate: new Date("2026-02-28T18:00:00"),
    endDate: new Date("2026-02-28T21:00:00"),
    timezone: "Europe/Amsterdam",
    location: {
      name: "De Witte Aap",
      address: "Witte de Withstraat 78",
      city: "Rotterdam",
      state: "",
      postalCode: "3012 BT",
      country: "Netherlands",
    },
    registration: {
      enabled: true,
      maxAttendees: 50,
      currentAttendees: 32,
      waitlistEnabled: false,
      waitlistCount: 0,
    },
    accessLevel: "members_only" as const,
    ticketTiers: [{ id: "t1", name: "Member Entry", price: 0, available: 18 }],
  },
];

export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormat, setSelectedFormat] = useState<
    "all" | "in_person" | "virtual" | "hybrid"
  >("all");
  const [selectedType, setSelectedType] = useState<"all" | string>("all");

  const filteredEvents = useMemo(() => {
    return MOCK_EVENTS.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFormat =
        selectedFormat === "all" || event.format === selectedFormat;
      const matchesType = selectedType === "all" || event.type === selectedType;

      return matchesSearch && matchesFormat && matchesType;
    });
  }, [searchQuery, selectedFormat, selectedType]);

  const upcomingEvents = filteredEvents.filter(
    (e) => new Date(e.startDate) > new Date(),
  );
  const pastEvents = filteredEvents.filter(
    (e) => new Date(e.startDate) <= new Date(),
  );

  return (
    <>
      <SEO
        title="Events"
        description="Join GRATIS events, workshops, and meetups. Connect with the community and make an impact."
      />

      <PageHero
        title="Events"
        subtitle="Join us for workshops, meetups, and impact initiatives"
      />

      <div className="container py-12 space-y-8">
        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Format Tabs */}
          <Tabs
            value={selectedFormat}
            onValueChange={(v) => setSelectedFormat(v as any)}
          >
            <TabsList>
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="in_person">In Person</TabsTrigger>
              <TabsTrigger value="virtual">Virtual</TabsTrigger>
              <TabsTrigger value="hybrid">Hybrid</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Type Filter */}
          <div className="flex gap-2 flex-wrap">
            {[
              "all",
              "workshop",
              "meetup",
              "webinar",
              "fundraiser",
              "conference",
            ].map((type) => (
              <Badge
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedType(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingEvents.length})
            </TabsTrigger>
            <TabsTrigger value="past">Past ({pastEvents.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            {upcomingEvents.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground">
                    No upcoming events found
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Check back soon for new events!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            {pastEvents.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground">
                    No past events
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map((event) => (
                  <EventCard key={event.id} event={event} isPast />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function EventCard({
  event,
  isPast = false,
}: {
  event: (typeof MOCK_EVENTS)[0];
  isPast?: boolean;
}) {
  const spotsLeft =
    event.registration.maxAttendees - event.registration.currentAttendees;
  const isSoldOut = spotsLeft <= 0;
  const isAlmostFull = spotsLeft > 0 && spotsLeft <= 10;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-video">
        <img
          src={event.coverImage}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur">
            {event.type}
          </Badge>
          {event.format === "virtual" && (
            <Badge
              variant="secondary"
              className="bg-white/90 backdrop-blur gap-1"
            >
              <Video className="h-3 w-3" />
              Virtual
            </Badge>
          )}
          {event.accessLevel === "members_only" && (
            <Badge variant="secondary" className="bg-hot-lime text-jet-black">
              Members Only
            </Badge>
          )}
        </div>
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-2">{event.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {event.shortDescription}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(event.startDate), "MMM d, yyyy")}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            {format(new Date(event.startDate), "HH:mm")} -{" "}
            {format(new Date(event.endDate), "HH:mm")}
          </span>
        </div>

        {event.format === "in_person" && event.location ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">
              {event.location.city}, {event.location.country}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="h-4 w-4" />
            <span>Online Event</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4" />
          <span
            className={
              isAlmostFull
                ? "text-warning"
                : isSoldOut
                  ? "text-destructive"
                  : ""
            }
          >
            {isSoldOut ? "Sold Out" : `${spotsLeft} spots left`}
          </span>
        </div>

        {event.ticketTiers[0].price === 0 ? (
          <Badge variant="outline" className="text-success border-success">
            FREE
          </Badge>
        ) : (
          <div className="text-lg font-bold">€{event.ticketTiers[0].price}</div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          asChild
          className="w-full"
          variant={isPast ? "outline" : "default"}
          disabled={isSoldOut && !event.registration.waitlistEnabled}
        >
          <Link to={`/events/${event.slug}`}>
            {isPast
              ? "View Details"
              : isSoldOut
                ? event.registration.waitlistEnabled
                  ? "Join Waitlist"
                  : "Sold Out"
                : "Register Now"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
