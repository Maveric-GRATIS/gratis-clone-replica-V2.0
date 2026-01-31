import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventCheckIn as EventCheckInComponent } from "@/components/admin/EventCheckIn";
import { Calendar, QrCode, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";
import type { Event } from "@/types/event";

export default function AdminEventCheckIn() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch upcoming events
  const { data: events, isLoading } = useQuery({
    queryKey: ["admin-events-checkin"],
    queryFn: async () => {
      const eventsRef = collection(db, "events");
      const q = query(
        eventsRef,
        where("status", "==", "published"),
        orderBy("startDate", "asc"),
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];
    },
  });

  const filteredEvents = events?.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Mock event voor demo
  const mockEvent: Event = {
    id: "demo-event",
    title: "Amsterdam Water Festival 2026",
    slug: "amsterdam-water-festival-2026",
    description: "Demo event",
    shortDescription: "Demo",
    coverImage: "",
    gallery: [],
    type: "fundraiser",
    format: "in_person",
    status: "published",
    accessLevel: "public",
    startDate: Timestamp.fromDate(new Date("2026-06-15T10:00:00")),
    endDate: Timestamp.fromDate(new Date("2026-06-15T18:00:00")),
    timezone: "Europe/Amsterdam",
    location: {
      name: "Vondelpark",
      address: "Vondelpark 1",
      city: "Amsterdam",
      state: "",
      postalCode: "1071 AA",
      country: "Netherlands",
    },
    virtualDetails: null,
    registration: {
      enabled: true,
      maxAttendees: 500,
      currentAttendees: 234,
      waitlistEnabled: true,
      waitlistCount: 12,
      registrationStartDate: null,
      registrationEndDate: null,
      requireApproval: false,
    },
    ticketTiers: [],
    speakers: [],
    agenda: [],
    settings: {
      showAttendeeCount: true,
      showAttendeeList: false,
      allowComments: true,
      sendReminders: true,
      reminderSchedule: [24, 1],
      collectFeedback: true,
    },
    recording: null,
    organizerId: "admin",
    organizerName: "GRATIS Foundation",
    tags: [],
    categoryId: null,
    seo: {},
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    publishedAt: Timestamp.now(),
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Event Check-In</h1>
            <p className="text-muted-foreground">
              Scan tickets and manage event check-ins
            </p>
          </div>
        </div>

        <Tabs defaultValue="checkin" className="space-y-6">
          <TabsList>
            <TabsTrigger value="checkin">
              <QrCode className="mr-2 h-4 w-4" />
              Check-In
            </TabsTrigger>
            <TabsTrigger value="events">
              <Calendar className="mr-2 h-4 w-4" />
              Select Event
            </TabsTrigger>
          </TabsList>

          <TabsContent value="checkin" className="space-y-6">
            {selectedEvent ? (
              <EventCheckInComponent event={selectedEvent} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Event Selected</CardTitle>
                  <CardDescription>
                    Please select an event from the "Select Event" tab to start
                    check-in
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No event selected
                  </p>
                  <Button onClick={() => setSelectedEvent(mockEvent)}>
                    Use Demo Event
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Event</CardTitle>
                <CardDescription>
                  Choose an event to start check-in
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>

                {isLoading ? (
                  <p className="text-center text-muted-foreground py-8">
                    Loading events...
                  </p>
                ) : filteredEvents && filteredEvents.length > 0 ? (
                  <div className="space-y-2">
                    {filteredEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div>
                          <h3 className="font-semibold">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {format(event.startDate.toDate(), "PPP")}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary">{event.type}</Badge>
                            <Badge variant="outline">
                              {event.registration.currentAttendees} /{" "}
                              {event.registration.maxAttendees}
                            </Badge>
                          </div>
                        </div>
                        <Button>Select</Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      No events found
                    </p>
                    <Button onClick={() => setSelectedEvent(mockEvent)}>
                      Use Demo Event
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
