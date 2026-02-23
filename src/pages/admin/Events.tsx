import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash, Eye, EyeOff } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/firebase";
import {
  collection,
  getDocs,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  query as firestoreQuery,
} from "firebase/firestore";
import { toast } from "sonner";
import { format } from "date-fns";
import { EventDialog } from "@/components/admin/EventDialog";

interface Event {
  id: string;
  title: string;
  event_date: { seconds: number; nanoseconds: number };
  location: string | null;
  published: boolean;
}

export default function AdminEvents() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const { data: events, isLoading } = useQuery<Event[], Error>({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const eventsCollection = collection(db, "events");
      const q = firestoreQuery(eventsCollection, orderBy("event_date", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Event,
      );
    },
  });

  const togglePublished = useMutation({
    mutationFn: async ({
      id,
      published,
    }: {
      id: string;
      published: boolean;
    }) => {
      const eventRef = doc(db, "events", id);
      await updateDoc(eventRef, { published: !published });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast.success("Event status updated");
    },
    onError: () => {
      toast.error("Failed to update event status");
    },
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      const eventRef = doc(db, "events", id);
      await deleteDoc(eventRef);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast.success("Event deleted");
    },
    onError: () => {
      toast.error("Failed to delete event");
    },
  });

  const handleCreate = () => {
    setSelectedEvent(null);
    setDialogOpen(true);
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const filteredEvents = events?.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Events</h1>
            <p className="text-muted-foreground">
              Manage community events and gatherings
            </p>
          </div>
          <Button className="gap-2" onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Event Calendar</CardTitle>
            <CardDescription>
              All events past, present and future
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">
                Loading events...
              </p>
            ) : filteredEvents?.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No events found
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents?.map((event) => {
                    const eventDate = new Date(event.event_date.seconds * 1000);
                    const isPast = eventDate < new Date();

                    return (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">
                          {event.title}
                        </TableCell>
                        <TableCell>
                          {format(eventDate, "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>{event.location || "TBD"}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Badge
                              variant={
                                event.published ? "default" : "secondary"
                              }
                            >
                              {event.published ? "Published" : "Draft"}
                            </Badge>
                            {isPast && <Badge variant="outline">Past</Badge>}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                togglePublished.mutate({
                                  id: event.id,
                                  published: event.published,
                                })
                              }
                            >
                              {event.published ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(event)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteEvent.mutate(event.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <EventDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        event={selectedEvent}
      />
    </AdminLayout>
  );
}
