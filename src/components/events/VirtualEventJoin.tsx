/**
 * VirtualEventJoin Component
 *
 * Join link and controls for virtual/hybrid events
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Video,
  ExternalLink,
  Copy,
  CheckCircle2,
  Clock,
  Users,
  Info,
  AlertTriangle,
  Mic,
  MicOff,
  VideoOff,
  Settings,
} from "lucide-react";
import { format, isBefore, isAfter, differenceInMinutes } from "date-fns";
import type { Event, EventVirtualDetails } from "@/types/event";

interface VirtualEventJoinProps {
  event: Event;
  userRegistered: boolean;
  userTicketId?: string;
}

export function VirtualEventJoin({
  event,
  userRegistered,
  userTicketId,
}: VirtualEventJoinProps) {
  const [copied, setCopied] = useState(false);
  const [timeUntilStart, setTimeUntilStart] = useState<string>("");
  const [canJoin, setCanJoin] = useState(false);
  const [isLive, setIsLive] = useState(false);

  const virtualDetails = event.virtualDetails;

  useEffect(() => {
    if (!event.startDate || !event.endDate) return;

    const updateTime = () => {
      const now = new Date();
      const startDate = event.startDate.toDate();
      const endDate = event.endDate.toDate();

      // Check if event is live
      const eventIsLive = isAfter(now, startDate) && isBefore(now, endDate);
      setIsLive(eventIsLive);

      // Can join 15 minutes before start
      const fifteenMinutesBefore = new Date(
        startDate.getTime() - 15 * 60 * 1000,
      );
      const canJoinNow =
        isAfter(now, fifteenMinutesBefore) && isBefore(now, endDate);
      setCanJoin(canJoinNow);

      // Calculate time until start
      if (isBefore(now, startDate)) {
        const minutesUntil = differenceInMinutes(startDate, now);
        if (minutesUntil < 60) {
          setTimeUntilStart(`${minutesUntil} minutes`);
        } else {
          const hoursUntil = Math.floor(minutesUntil / 60);
          setTimeUntilStart(`${hoursUntil} hour${hoursUntil > 1 ? "s" : ""}`);
        }
      } else if (eventIsLive) {
        setTimeUntilStart("Now Live");
      } else {
        setTimeUntilStart("Event Ended");
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [event.startDate, event.endDate]);

  const handleCopyLink = () => {
    if (virtualDetails?.url) {
      navigator.clipboard.writeText(virtualDetails.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleJoinEvent = () => {
    if (virtualDetails?.url) {
      window.open(virtualDetails.url, "_blank", "noopener,noreferrer");
    }
  };

  const getPlatformIcon = () => {
    switch (virtualDetails?.platform) {
      case "zoom":
        return "🎥";
      case "google_meet":
        return "📹";
      case "teams":
        return "💼";
      case "youtube_live":
        return "📺";
      default:
        return "🌐";
    }
  };

  const getPlatformName = () => {
    switch (virtualDetails?.platform) {
      case "zoom":
        return "Zoom";
      case "google_meet":
        return "Google Meet";
      case "teams":
        return "Microsoft Teams";
      case "youtube_live":
        return "YouTube Live";
      default:
        return "Custom Platform";
    }
  };

  if (!virtualDetails || event.format === "in_person") {
    return null;
  }

  if (!userRegistered) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            <CardTitle>Virtual Event</CardTitle>
          </div>
          <CardDescription>Register to receive the join link</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              This is a {event.format === "hybrid" ? "hybrid" : "virtual"}{" "}
              event. You'll receive the join link after registration.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={isLive ? "border-2 border-red-500" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getPlatformIcon()}</span>
              <div>
                <CardTitle>Join Virtual Event</CardTitle>
                <CardDescription>{getPlatformName()}</CardDescription>
              </div>
            </div>
            {isLive && (
              <Badge variant="destructive" className="animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full mr-2" />
                LIVE NOW
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Time Info */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">
                  {isLive
                    ? "Live Now"
                    : canJoin
                      ? "Starting Soon"
                      : "Starts In"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {timeUntilStart}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">
                {format(event.startDate.toDate(), "PPP")}
              </p>
              <p className="text-sm text-muted-foreground">
                {format(event.startDate.toDate(), "p")}
              </p>
            </div>
          </div>

          {/* Join Button */}
          {canJoin ? (
            <Button
              onClick={handleJoinEvent}
              size="lg"
              className="w-full text-lg"
              disabled={!virtualDetails?.url}
            >
              <Video className="h-5 w-5 mr-2" />
              {isLive ? "Join Live Event" : "Join Event"}
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          ) : isLive ? (
            <Button
              onClick={handleJoinEvent}
              size="lg"
              variant="destructive"
              className="w-full text-lg animate-pulse"
            >
              <Video className="h-5 w-5 mr-2" />
              Join Live Event Now
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Join link will be available 15 minutes before the event starts
              </AlertDescription>
            </Alert>
          )}

          {/* Meeting Details */}
          {virtualDetails.meetingId && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <p className="text-sm font-medium">Meeting Details</p>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Meeting ID:
                  </span>
                  <code className="text-sm font-mono">
                    {virtualDetails.meetingId}
                  </code>
                </div>
                {virtualDetails.passcode && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Passcode:
                    </span>
                    <code className="text-sm font-mono">
                      {virtualDetails.passcode}
                    </code>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Copy Link */}
          {virtualDetails.url && (
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="w-full"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Join Link
                </>
              )}
            </Button>
          )}

          {/* Instructions */}
          {virtualDetails.instructions && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <p className="font-medium mb-1">Important Instructions:</p>
                <p className="text-sm">{virtualDetails.instructions}</p>
              </AlertDescription>
            </Alert>
          )}

          {/* Pre-join Tips */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg space-y-2">
            <p className="text-sm font-medium flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Before You Join
            </p>
            <ul className="text-sm space-y-1 ml-6 list-disc text-muted-foreground">
              <li>Test your camera and microphone</li>
              <li>Use headphones for better audio quality</li>
              <li>Join from a quiet location</li>
              <li>Check your internet connection</li>
              <li>Have your ticket ready for verification</li>
            </ul>
          </div>

          {/* Support Info */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Having trouble joining? Contact support at{" "}
              <a
                href="mailto:events@gratis.ngo"
                className="underline font-medium"
              >
                events@gratis.ngo
              </a>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </motion.div>
  );
}
