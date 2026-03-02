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
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  Share2,
  Heart,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { useEvent } from "@/hooks/useEvents";

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading, error } = useEvent(id);

  if (isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event || error) {
    return (
      <div className="container py-12">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The event you're looking for doesn't exist or hasn't been published yet.
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

  // Convert Firestore Timestamp to Date
  const eventDate = event.date instanceof Timestamp 
    ? event.date.toDate() 
    : new Date(event.date as any);
  
  const eventEndDate = event.endDate 
    ? (event.endDate instanceof Timestamp ? event.endDate.toDate() : new Date(event.endDate as any))
    : null;

  const spotsLeft = event.capacity - event.registered;
  const isFull = spotsLeft <= 0;
  const isAlmostFull = spotsLeft > 0 && spotsLeft <= 10;

  return (
    <>
      <SEO
        title={event.title}
        description={event.description?.substring(0, 160)}
        image={event.imageUrl}
      />

      <div className="min-h-screen">
        {/* Hero Image */}
        <div className="relative h-[40vh] md:h-[50vh]">
          <img
            src={event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200"}
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
                <Badge variant="secondary">{event.type || "Event"}</Badge>
                <Badge variant="secondary">{event.status}</Badge>
                {isAlmostFull && !isFull && (
                  <Badge variant="destructive">Almost Full</Badge>
                )}
                {isFull && <Badge variant="destructive">Full</Badge>}
                {event.featured && (
                  <Badge className="bg-hot-lime text-jet-black">Featured</Badge>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {event.title}
              </h1>
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
                        {format(eventDate, "EEEE, MMMM d, yyyy")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(eventDate, "HH:mm")}
                        {eventEndDate && ` - ${format(eventEndDate, "HH:mm")}`}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-semibold">Location</p>
                      <p className="text-sm text-muted-foreground">
                        {event.location}
                      </p>
                      {event.locationDetails && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.locationDetails}
                        </p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-semibold">Capacity</p>
                      <p className="text-sm text-muted-foreground">
                        {event.registered} / {event.capacity} registered
                      </p>
                      {!isFull ? (
                        <p className="text-sm font-medium text-hot-lime">
                          {spotsLeft} spots remaining
                        </p>
                      ) : (
                        <p className="text-sm font-medium text-destructive">
                          Event is full
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
                <CardContent className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-line">
                  {event.description}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Registration Card */}
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Registration</CardTitle>
                  <CardDescription>
                    {isFull ? "Event is full" : "Register for this event"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Free Entry</span>
                      <Badge variant="outline" className="text-success border-success">
                        FREE
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} available
                    </p>
                  </div>

                  {!isFull ? (
                    <Button className="w-full" size="lg">
                      Register Now
                    </Button>
                  ) : (
                    <Button className="w-full" size="lg" variant="outline" disabled>
                      Event Full
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Share */}
              <Card>
                <CardHeader>
                  <CardTitle>Share Event</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: event.title,
                          text: event.description?.substring(0, 100),
                          url: window.location.href,
                        });
                      }
                    }}
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Heart className="h-4 w-4" />
                    Save
                  </Button>
                </CardContent>
              </Card>

              {/* Event Type */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{event.type || "General"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium capitalize">{event.status}</span>
                  </div>
                  {event.featured && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Featured:</span>
                      <Badge variant="secondary" className="h-5">Yes</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
