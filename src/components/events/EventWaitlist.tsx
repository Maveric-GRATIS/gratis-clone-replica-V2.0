/**
 * EventWaitlist Component
 *
 * Join waitlist for sold-out events
 */

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Users, CheckCircle2, AlertCircle } from "lucide-react";
import type { Event } from "@/types/event";
import { useToast } from "@/hooks/use-toast";

interface WaitlistEntry {
  id: string;
  eventId: string;
  email: string;
  name: string;
  ticketType: string;
  quantity: number;
  position: number;
  createdAt: Date;
  notified: boolean;
}

interface EventWaitlistProps {
  event: Event;
  ticketTypes?: Array<{
    name: string;
    price: number;
    available: number;
  }>;
}

export function EventWaitlist({ event, ticketTypes = [] }: EventWaitlistProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    ticketType: "",
    quantity: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [waitlistPosition, setWaitlistPosition] = useState<number | null>(null);

  // Mock waitlist stats (in production: fetch from Firestore)
  const waitlistStats = {
    totalWaiting: 45,
    lastNotified: "2 hours ago",
    averageWaitTime: "3-5 days",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.ticketType) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // In production: Save to Firestore
      const waitlistEntry: Omit<WaitlistEntry, "id"> = {
        eventId: event.id,
        email: formData.email,
        name: formData.name,
        ticketType: formData.ticketType,
        quantity: formData.quantity,
        position: waitlistStats.totalWaiting + 1,
        createdAt: new Date(),
        notified: false,
      };

      // Mock: Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsJoined(true);
      setWaitlistPosition(waitlistEntry.position);

      toast({
        title: "Added to waitlist!",
        description: `You're position #${waitlistEntry.position}. We'll notify you when tickets become available.`,
      });

      // Send confirmation email (in production)
      console.log("Sending waitlist confirmation email to:", formData.email);
    } catch (error) {
      console.error("Failed to join waitlist:", error);
      toast({
        title: "Error",
        description: "Failed to join waitlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isJoined && waitlistPosition) {
    return (
      <Card className="border-primary">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <CardTitle>You're on the Waitlist!</CardTitle>
          </div>
          <CardDescription>
            We'll notify you when tickets become available
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Your Position
              </span>
              <Badge variant="secondary" className="text-lg">
                #{waitlistPosition}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Ticket Type</span>
              <span className="font-medium">{formData.ticketType}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Quantity</span>
              <span className="font-medium">{formData.quantity}</span>
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You'll receive an email at <strong>{formData.email}</strong> when
              tickets become available. The offer will be valid for 24 hours.
            </AlertDescription>
          </Alert>

          <div className="text-sm text-muted-foreground">
            <p>
              Average wait time:{" "}
              <strong>{waitlistStats.averageWaitTime}</strong>
            </p>
            <p className="mt-1">
              Check your spam folder to ensure you receive our notification.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join the Waitlist</CardTitle>
        <CardDescription>
          This event is sold out. Join the waitlist to be notified when tickets
          become available.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-2xl font-bold">{waitlistStats.totalWaiting}</p>
              <p className="text-xs text-muted-foreground">On Waitlist</p>
            </div>
            <div className="text-center">
              <Clock className="h-5 w-5 mx-auto mb-1 text-electric-blue" />
              <p className="text-sm font-bold">
                {waitlistStats.averageWaitTime}
              </p>
              <p className="text-xs text-muted-foreground">Avg. Wait</p>
            </div>
            <div className="text-center">
              <CheckCircle2 className="h-5 w-5 mx-auto mb-1 text-hot-lime" />
              <p className="text-sm font-bold">{waitlistStats.lastNotified}</p>
              <p className="text-xs text-muted-foreground">Last Notified</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <p className="text-xs text-muted-foreground">
              We'll notify you at this email when tickets are available
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ticketType">Ticket Type</Label>
            <Select
              value={formData.ticketType}
              onValueChange={(value) =>
                setFormData({ ...formData, ticketType: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ticket type" />
              </SelectTrigger>
              <SelectContent>
                {ticketTypes.map((type) => (
                  <SelectItem key={type.name} value={type.name}>
                    {type.name} - €{type.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Number of Tickets</Label>
            <Select
              value={formData.quantity.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, quantity: parseInt(value) })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? "Ticket" : "Tickets"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              When tickets become available, you'll have 24 hours to complete
              your purchase. Your spot is not guaranteed until payment is
              received.
            </AlertDescription>
          </Alert>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
            size="lg"
          >
            {isSubmitting ? "Joining..." : "Join Waitlist"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
