import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EventRegistration } from "@/components/events/EventRegistration";
import { AddToCalendar } from "@/components/events/AddToCalendar";
import { EventWaitlist } from "@/components/events/EventWaitlist";
import { VirtualEventJoin } from "@/components/events/VirtualEventJoin";
import {
  Calendar,
  MapPin,
  Users,
  Video,
  Clock,
  Globe,
  ArrowLeft,
  Share2,
  Heart,
  Download,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import type { Event } from "@/types/event";

// Mock event data - in productie van Firestore
const getEventBySlug = (slug: string) => {
  const events = [
    {
      id: "1",
      title: "Amsterdam Water Festival 2026",
      slug: "amsterdam-water-festival-2026",
      description: `Join us for a full day celebrating clean water access at Amsterdam's iconic Vondelpark. This festival combines entertainment, education, and impact in a unique way.

**What to Expect:**
- Live music performances from local and international artists
- Interactive workshops on water conservation and sustainability
- Free water bottle distribution (5.000 bottles!)
- Meet NGO partners and learn about their projects
- Kids zone with educational games
- Food trucks with sustainable options
- Impact stories from beneficiaries

**Why Attend:**
This isn't just a festival - it's a movement. Every ticket supports our water distribution programs in East Africa. Come for the music, stay for the impact stories, leave as part of the solution.

**Important Info:**
- Rain or shine event (covered areas available)
- Family-friendly
- Accessible for wheelchairs
- Free parking nearby at Q-Park
- Public transport: Tram 2, 5, 12 to Museumplein`,
      shortDescription: "Celebrate clean water with music and workshops",
      type: "fundraiser" as const,
      format: "in_person" as const,
      status: "published" as const,
      coverImage:
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200",
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
        coordinates: { lat: 52.3579946, lng: 4.8686484 },
      },
      registration: {
        enabled: true,
        maxAttendees: 500,
        currentAttendees: 234,
        waitlistEnabled: true,
        waitlistCount: 12,
        registrationDeadline: new Date("2026-06-14T23:59:59"),
      },
      accessLevel: "public" as const,
      ticketTiers: [
        {
          id: "t1",
          name: "Free Entry",
          price: 0,
          available: 266,
          description: "Basic entry to the festival",
          benefits: [
            "Access to all activities",
            "Free water bottle",
            "Festival wristband",
          ],
        },
        {
          id: "t2",
          name: "Supporter",
          price: 25,
          available: 50,
          description: "Support the cause with extra benefits",
          benefits: [
            "All Free Entry benefits",
            "VIP lounge access",
            "Exclusive GRATIS merch",
            "Meet & greet with artists",
          ],
        },
      ],
      speakers: [
        {
          id: "s1",
          name: "Emma van Dijk",
          role: "Founder & CEO, GRATIS",
          bio: "Emma founded GRATIS in 2020 with a vision to make clean water accessible while supporting arts and education.",
          photo:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
        },
        {
          id: "s2",
          name: "Dr. James Omondi",
          role: "Water Expert, WaterAid Kenya",
          bio: "Dr. Omondi has 15 years of experience in water infrastructure projects across East Africa.",
          photo:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        },
      ],
      agenda: [
        {
          id: "a1",
          startTime: new Date("2026-06-15T10:00:00"),
          endTime: new Date("2026-06-15T10:30:00"),
          title: "Opening Ceremony",
          description:
            "Welcome speech by Emma van Dijk and water blessing ceremony",
        },
        {
          id: "a2",
          startTime: new Date("2026-06-15T11:00:00"),
          endTime: new Date("2026-06-15T12:00:00"),
          title: "Workshop: Water Conservation at Home",
          description: "Learn practical tips to reduce water consumption",
          speaker: "s2",
        },
        {
          id: "a3",
          startTime: new Date("2026-06-15T13:00:00"),
          endTime: new Date("2026-06-15T14:30:00"),
          title: "Live Music: The Watershed Band",
          description: "Afrobeat meets EDM in this high-energy performance",
        },
        {
          id: "a4",
          startTime: new Date("2026-06-15T15:00:00"),
          endTime: new Date("2026-06-15T16:00:00"),
          title: "Impact Stories Panel",
          description:
            "Hear from beneficiaries and NGO partners about real-world impact",
          speaker: "s1",
        },
        {
          id: "a5",
          startTime: new Date("2026-06-15T17:00:00"),
          endTime: new Date("2026-06-15T18:00:00"),
          title: "Closing Concert",
          description: "Surprise guest artist performance",
        },
      ],
      organizer: {
        name: "GRATIS Foundation",
        email: "events@gratis.org",
        phone: "+31 20 123 4567",
      },
      tags: ["water", "sustainability", "music", "festival", "fundraiser"],
    },
    {
      id: "2",
      title: "Virtual Impact Webinar: Arts Education",
      slug: "virtual-impact-webinar-arts",
      description: `Learn how GRATIS supports arts education programs worldwide. Hear from NGO partners and see real impact stories.

**Agenda:**
- Overview of our arts education programs
- Case studies from partner NGOs
- Impact measurement and results
- Q&A session

**Who Should Attend:**
- NGO partners
- Education professionals
- GRATIS supporters
- Anyone interested in arts education`,
      shortDescription: "Online webinar about arts education impact",
      type: "webinar" as const,
      format: "virtual" as const,
      status: "published" as const,
      coverImage:
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200",
      startDate: new Date("2026-02-20T19:00:00"),
      endDate: new Date("2026-02-20T20:30:00"),
      timezone: "Europe/Amsterdam",
      virtualDetails: {
        platform: "zoom" as const,
        url: "https://zoom.us/j/example",
        meetingId: "123 456 7890",
        password: "gratis2026",
      },
      registration: {
        enabled: true,
        maxAttendees: 1000,
        currentAttendees: 456,
        waitlistEnabled: false,
        waitlistCount: 0,
        registrationDeadline: new Date("2026-02-20T18:00:00"),
      },
      accessLevel: "public" as const,
      ticketTiers: [
        {
          id: "t1",
          name: "Free Ticket",
          price: 0,
          available: 544,
          description: "Access to the webinar",
          benefits: [
            "Live webinar access",
            "Recording access",
            "Q&A participation",
          ],
        },
      ],
      speakers: [
        {
          id: "s1",
          name: "Emma van Dijk",
          role: "Founder & CEO, GRATIS",
          bio: "Emma founded GRATIS in 2020 with a vision to make clean water accessible while supporting arts and education.",
          photo:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
        },
      ],
      agenda: [
        {
          id: "a1",
          startTime: new Date("2026-02-20T19:00:00"),
          endTime: new Date("2026-02-20T19:15:00"),
          title: "Welcome & Introduction",
          description: "Overview of GRATIS arts education initiatives",
        },
        {
          id: "a2",
          startTime: new Date("2026-02-20T19:15:00"),
          endTime: new Date("2026-02-20T19:45:00"),
          title: "NGO Partner Stories",
          description: "Real impact stories from partner organizations",
        },
        {
          id: "a3",
          startTime: new Date("2026-02-20T19:45:00"),
          endTime: new Date("2026-02-20T20:15:00"),
          title: "Impact Data & Results",
          description: "Quantitative analysis of program outcomes",
        },
        {
          id: "a4",
          startTime: new Date("2026-02-20T20:15:00"),
          endTime: new Date("2026-02-20T20:30:00"),
          title: "Q&A Session",
          description: "Open questions and discussion",
        },
      ],
      organizer: {
        name: "GRATIS Foundation",
        email: "events@gratis.org",
        phone: "+31 20 123 4567",
      },
      tags: ["arts", "education", "webinar", "impact"],
    },
    {
      id: "3",
      title: "TRIBE Meetup: Rotterdam",
      slug: "tribe-meetup-rotterdam",
      description: `Connect with fellow TRIBE members in Rotterdam. Network, share stories, and plan local impact initiatives.

**What to Expect:**
- Networking with local TRIBE members
- Discussion on local impact projects
- Free drinks and snacks
- Exclusive TRIBE member benefits
- Planning next quarter initiatives

**Members Only:**
This event is exclusively for TRIBE members. Please bring your membership card.`,
      shortDescription: "Connect with TRIBE members in Rotterdam",
      type: "meetup" as const,
      format: "in_person" as const,
      status: "published" as const,
      coverImage:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200",
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
        coordinates: { lat: 51.9138533, lng: 4.4732197 },
      },
      registration: {
        enabled: true,
        maxAttendees: 50,
        currentAttendees: 32,
        waitlistEnabled: false,
        waitlistCount: 0,
        registrationDeadline: new Date("2026-02-27T23:59:59"),
      },
      accessLevel: "members_only" as const,
      ticketTiers: [
        {
          id: "t1",
          name: "Member Entry",
          price: 0,
          available: 18,
          description: "Free for TRIBE members",
          benefits: [
            "Free entry",
            "Free drinks",
            "Free snacks",
            "Exclusive merch",
          ],
        },
      ],
      speakers: [],
      agenda: [
        {
          id: "a1",
          startTime: new Date("2026-02-28T18:00:00"),
          endTime: new Date("2026-02-28T18:30:00"),
          title: "Welcome & Introductions",
          description: "Meet fellow TRIBE members",
        },
        {
          id: "a2",
          startTime: new Date("2026-02-28T18:30:00"),
          endTime: new Date("2026-02-28T19:30:00"),
          title: "Local Impact Discussion",
          description: "Brainstorm local projects and initiatives",
        },
        {
          id: "a3",
          startTime: new Date("2026-02-28T19:30:00"),
          endTime: new Date("2026-02-28T21:00:00"),
          title: "Networking & Drinks",
          description: "Casual networking with snacks and drinks",
        },
      ],
      organizer: {
        name: "GRATIS Foundation - Rotterdam Chapter",
        email: "rotterdam@gratis.org",
        phone: "+31 10 123 4567",
      },
      tags: ["tribe", "meetup", "networking", "members"],
    },
  ];

  return events.find((e) => e.slug === slug);
};

export default function EventDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);

  const event = slug ? getEventBySlug(slug) : null;

  if (!event) {
    return (
      <div className="container py-12">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The event you're looking for doesn't exist.
            </p>
            <Button asChild>
              <Link to="/events">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Events
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const spotsLeft =
    event.registration.maxAttendees - event.registration.currentAttendees;
  const isSoldOut = spotsLeft <= 0;
  const isAlmostFull = spotsLeft > 0 && spotsLeft <= 20;

  return (
    <>
      <SEO
        title={event.title}
        description={event.shortDescription}
        image={event.coverImage}
      />

      <div className="min-h-screen">
        {/* Hero Image */}
        <div className="relative h-[40vh] md:h-[50vh]">
          <img
            src={event.coverImage}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="container">
              <Button asChild variant="ghost" size="sm" className="mb-4">
                <Link to="/events">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Events
                </Link>
              </Button>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{event.type}</Badge>
                {event.format === "virtual" && (
                  <Badge variant="secondary" className="gap-1">
                    <Video className="h-3 w-3" />
                    Virtual
                  </Badge>
                )}
                {event.accessLevel === "members_only" && (
                  <Badge className="bg-hot-lime text-jet-black">
                    Members Only
                  </Badge>
                )}
                {isAlmostFull && !isSoldOut && (
                  <Badge variant="destructive">Almost Full</Badge>
                )}
                {isSoldOut && <Badge variant="destructive">Sold Out</Badge>}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {event.title}
              </h1>
              <p className="text-xl text-muted-foreground">
                {event.shortDescription}
              </p>
            </div>
          </div>
        </div>

        <div className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Key Info */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-semibold">Date & Time</p>
                      <p className="text-sm text-muted-foreground">
                        {format(
                          new Date(event.startDate),
                          "EEEE, MMMM d, yyyy",
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(event.startDate), "HH:mm")} -{" "}
                        {format(new Date(event.endDate), "HH:mm")}{" "}
                        {event.timezone}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {event.format === "in_person" && event.location ? (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-semibold">Location</p>
                        <p className="text-sm text-muted-foreground">
                          {event.location.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {event.location.address}, {event.location.city}
                        </p>
                        <Button
                          variant="link"
                          className="h-auto p-0 mt-1"
                          asChild
                        >
                          <a
                            href={`https://maps.google.com/?q=${event.location.coordinates?.lat},${event.location.coordinates?.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View on Map{" "}
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-semibold">Virtual Event</p>
                        <p className="text-sm text-muted-foreground">
                          Join from anywhere in the world
                        </p>
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-semibold">Capacity</p>
                      <p className="text-sm text-muted-foreground">
                        {event.registration.currentAttendees} /{" "}
                        {event.registration.maxAttendees} registered
                      </p>
                      {!isSoldOut && (
                        <p className="text-sm font-medium text-hot-lime">
                          {spotsLeft} spots remaining
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About */}
              <Card>
                <CardHeader>
                  <CardTitle>About This Event</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                  {event.description.split("\n\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </CardContent>
              </Card>

              {/* Agenda */}
              {event.agenda && event.agenda.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Agenda</CardTitle>
                    <CardDescription>
                      Event schedule and activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {event.agenda.map((item, index) => (
                      <div key={item.id}>
                        {index > 0 && <Separator className="my-4" />}
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-24 text-sm text-muted-foreground">
                            {format(new Date(item.startTime), "HH:mm")}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Speakers */}
              {event.speakers && event.speakers.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Speakers & Hosts</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                    {event.speakers.map((speaker) => (
                      <div key={speaker.id} className="flex gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={speaker.photo} alt={speaker.name} />
                          <AvatarFallback>
                            {speaker.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{speaker.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {speaker.role}
                          </p>
                          <p className="text-sm">{speaker.bio}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Virtual Event Join (if virtual/hybrid) */}
              {(event.format === "virtual" || event.format === "hybrid") && (
                <VirtualEventJoin
                  event={event as unknown as Event}
                  userRegistered={false} // TODO: Check if user is registered
                  userTicketId={undefined}
                />
              )}

              {/* Registration Card */}
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Register</CardTitle>
                  <CardDescription>Choose your ticket</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {event.ticketTiers.map((tier) => (
                    <div
                      key={tier.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedTicket === tier.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedTicket(tier.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{tier.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {tier.description}
                          </p>
                        </div>
                        <div className="text-right">
                          {tier.price === 0 ? (
                            <Badge
                              variant="outline"
                              className="text-success border-success"
                            >
                              FREE
                            </Badge>
                          ) : (
                            <p className="text-lg font-bold">€{tier.price}</p>
                          )}
                        </div>
                      </div>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {tier.benefits?.map((benefit, i) => (
                          <li key={i}>✓ {benefit}</li>
                        ))}
                      </ul>
                      <p className="text-sm text-muted-foreground mt-2">
                        {tier.available} available
                      </p>
                    </div>
                  ))}

                  {!isSoldOut ? (
                    <>
                      <Button
                        className="w-full"
                        size="lg"
                        disabled={!selectedTicket}
                        onClick={() => setShowRegistration(true)}
                      >
                        {selectedTicket
                          ? "Continue to Registration"
                          : "Select a Ticket"}
                      </Button>
                      <AddToCalendar event={event as unknown as Event} />
                    </>
                  ) : (
                    event.registration.waitlistEnabled && (
                      <EventWaitlist
                        event={event as unknown as Event}
                        ticketTypes={event.ticketTiers.map((t) => ({
                          id: t.id,
                          name: t.name,
                          price: t.price,
                          available: t.available || 0,
                        }))}
                      />
                    )
                  )}
                </CardContent>
              </Card>

              {/* Share */}
              <Card>
                <CardHeader>
                  <CardTitle>Share Event</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Heart className="h-4 w-4" />
                    Save
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Add to Calendar
                  </Button>
                </CardContent>
              </Card>

              {/* Organizer */}
              <Card>
                <CardHeader>
                  <CardTitle>Organizer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold mb-2">{event.organizer.name}</p>
                  <p className="text-sm text-muted-foreground mb-1">
                    {event.organizer.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {event.organizer.phone}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <Dialog open={showRegistration} onOpenChange={setShowRegistration}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Register for {event.title}</DialogTitle>
          </DialogHeader>
          <EventRegistration
            event={event}
            onComplete={(registrationId) => {
              console.log("Registration completed:", registrationId);
              // Modal blijft open zodat gebruiker bevestiging kan zien
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
