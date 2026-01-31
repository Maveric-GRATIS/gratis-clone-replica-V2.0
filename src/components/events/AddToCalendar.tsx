/**
 * AddToCalendar Component
 *
 * Dropdown menu to add event to various calendar apps
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, Download } from "lucide-react";
import type { Event } from "@/types/event";
import {
  generateICalFile,
  downloadICalFile,
  generateGoogleCalendarUrl,
  generateOutlookCalendarUrl,
  generateYahooCalendarUrl,
  type CalendarEventData,
} from "@/lib/calendar";
import { useToast } from "@/hooks/use-toast";

interface AddToCalendarProps {
  event: Event;
  userEmail?: string;
  userName?: string;
  ticketId?: string;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
}

export function AddToCalendar({
  event,
  userEmail,
  userName,
  ticketId,
  variant = "outline",
  size = "default",
}: AddToCalendarProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const calendarData: CalendarEventData = {
    event,
    userEmail,
    userName,
    ticketId,
  };

  const handleDownloadICS = () => {
    try {
      setIsGenerating(true);
      const icalContent = generateICalFile(calendarData);
      const filename = `${event.slug}-${Date.now()}.ics`;
      downloadICalFile(icalContent, filename);

      toast({
        title: "Calendar file downloaded",
        description: "Open the .ics file to add the event to your calendar",
      });
    } catch (error) {
      console.error("Error downloading calendar file:", error);
      toast({
        title: "Error",
        description: "Failed to download calendar file",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGoogleCalendar = () => {
    const url = generateGoogleCalendarUrl(event);
    window.open(url, "_blank", "width=700,height=600");
  };

  const handleOutlookCalendar = () => {
    const url = generateOutlookCalendarUrl(event);
    window.open(url, "_blank", "width=700,height=600");
  };

  const handleYahooCalendar = () => {
    const url = generateYahooCalendarUrl(event);
    window.open(url, "_blank", "width=700,height=600");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={isGenerating}>
          <Calendar className="h-4 w-4 mr-2" />
          {isGenerating ? "Generating..." : "Add to Calendar"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleGoogleCalendar}>
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="h-4 w-4 mr-2"
          />
          Google Calendar
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleOutlookCalendar}>
          <img
            src="https://outlook.live.com/favicon.ico"
            alt="Outlook"
            className="h-4 w-4 mr-2"
          />
          Outlook Calendar
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleYahooCalendar}>
          <img
            src="https://www.yahoo.com/favicon.ico"
            alt="Yahoo"
            className="h-4 w-4 mr-2"
          />
          Yahoo Calendar
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleDownloadICS}>
          <Download className="h-4 w-4 mr-2" />
          Download .ics file
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
