import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Event {
  id?: string;
  title: string;
  description: string;
  location: string;
  locationDetails?: string;
  date: Timestamp | { seconds: number; nanoseconds: number };
  endDate?: Timestamp | { seconds: number; nanoseconds: number };
  capacity: number;
  registered: number;
  type: string;
  status: string;
  imageUrl?: string;
  featured: boolean;
  event_date?: { seconds: number; nanoseconds: number };
  published: boolean;
}

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: Event | null;
}

export function EventDialog({ open, onOpenChange, event }: EventDialogProps) {
  const queryClient = useQueryClient();
  const isEdit = !!event;

  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    location: event?.location || "",
    locationDetails: event?.locationDetails || "",
    date:
      event?.date || event?.event_date
        ? new Date(
            (event.date as any)?.seconds * 1000 ||
              (event.event_date?.seconds || 0) * 1000,
          )
            .toISOString()
            .slice(0, 16)
        : "",
    endDate: event?.endDate
      ? new Date((event.endDate as any).seconds * 1000)
          .toISOString()
          .slice(0, 16)
      : "",
    capacity: event?.capacity || 50,
    registered: event?.registered || 0,
    type: event?.type || "meetup",
    status: event?.status || "published",
    imageUrl: event?.imageUrl || "/lovable-uploads/event-placeholder.jpg",
    featured: event?.featured || false,
    published: event?.published ?? true,
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const eventsCollection = collection(db, "events");
      const eventDate = Timestamp.fromDate(new Date(data.date));
      const endDate = data.endDate
        ? Timestamp.fromDate(new Date(data.endDate))
        : undefined;

      await addDoc(eventsCollection, {
        title: data.title,
        description: data.description,
        location: data.location,
        locationDetails: data.locationDetails,
        date: eventDate,
        event_date: eventDate, // For compatibility
        endDate,
        capacity: data.capacity,
        registered: data.registered,
        type: data.type,
        status: data.status,
        imageUrl: data.imageUrl,
        featured: data.featured,
        published: data.published,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event created successfully");
      onOpenChange(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast.error("Failed to create event: " + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!event?.id) throw new Error("Event ID is required");
      const eventRef = doc(db, "events", event.id);
      const eventDate = Timestamp.fromDate(new Date(data.date));
      const endDate = data.endDate
        ? Timestamp.fromDate(new Date(data.endDate))
        : undefined;

      await updateDoc(eventRef, {
        title: data.title,
        description: data.description,
        location: data.location,
        locationDetails: data.locationDetails,
        date: eventDate,
        event_date: eventDate, // For compatibility
        endDate,
        capacity: data.capacity,
        registered: data.registered,
        type: data.type,
        status: data.status,
        imageUrl: data.imageUrl,
        featured: data.featured,
        published: data.published,
        updatedAt: Timestamp.now(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event updated successfully");
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error("Failed to update event: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("Event title is required");
      return;
    }
    if (!formData.date) {
      toast.error("Event date is required");
      return;
    }
    if (!formData.location.trim()) {
      toast.error("Location is required");
      return;
    }

    if (isEdit) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      locationDetails: "",
      date: "",
      endDate: "",
      capacity: 50,
      registered: 0,
      type: "meetup",
      status: "published",
      imageUrl: "/lovable-uploads/event-placeholder.jpg",
      featured: false,
      published: true,
    });
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Event" : "Create New Event"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update event information"
              : "Add a new event to the calendar"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            {/* Event Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., TRIBE Community Meetup"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Event description..."
                rows={3}
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="e.g., Amsterdam, Netherlands"
                required
              />
            </div>

            {/* Location Details */}
            <div className="space-y-2">
              <Label htmlFor="locationDetails">Location Details</Label>
              <Input
                id="locationDetails"
                value={formData.locationDetails}
                onChange={(e) =>
                  setFormData({ ...formData, locationDetails: e.target.value })
                }
                placeholder="e.g., Impact Hub Amsterdam, Haarlemmerweg 10"
              />
            </div>

            {/* Date & End Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Start Date & Time *</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date & Time</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Capacity & Registered */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      capacity: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registered">Registered</Label>
                <Input
                  id="registered"
                  type="number"
                  min="0"
                  value={formData.registered}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      registered: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Event Type</Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="meetup">Meetup</option>
                <option value="webinar">Webinar</option>
                <option value="gala">Gala</option>
                <option value="workshop">Workshop</option>
                <option value="conference">Conference</option>
              </select>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                placeholder="/lovable-uploads/event.jpg"
              />
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="h-20 w-full object-cover rounded border"
                />
              )}
            </div>

            {/* Switches */}
            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, published: checked })
                  }
                />
                <Label htmlFor="published">Published</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, featured: checked })
                  }
                />
                <Label htmlFor="featured">Featured Event</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Update Event" : "Create Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
