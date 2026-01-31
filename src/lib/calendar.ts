/**
 * Calendar Integration Utilities
 *
 * Generate iCal files for Google Calendar, Apple Calendar, Outlook
 */

import ical, { ICalCalendar, ICalEventData } from 'ical-generator';
import type { Event, EventLocation } from '@/types/event';

export interface CalendarEventData {
  event: Event;
  userEmail?: string;
  userName?: string;
  ticketId?: string;
}

/**
 * Format EventLocation to string
 */
function formatLocation(location: EventLocation | null): string {
  if (!location) return '';
  const parts = [location.name, location.address, location.city];
  if (location.state) parts.push(location.state);
  parts.push(location.country);
  return parts.filter(Boolean).join(', ');
}

/**
 * Generate iCal file for event
 */
export function generateICalFile(data: CalendarEventData): string {
  const { event, userEmail, userName, ticketId } = data;

  const calendar = ical({
    name: `GRATIS Event: ${event.title}`,
    prodId: {
      company: 'GRATIS',
      product: 'Event Calendar',
      language: 'EN',
    },
  });

  // Use startDate and endDate from Event type
  const startDate = event.startDate.toDate();
  const endDate = event.endDate.toDate();

  calendar.createEvent({
    start: startDate,
    end: endDate,
    summary: event.title,
    description: generateEventDescription(event, ticketId),
    location: formatLocation(event.location),
    url: `${window.location.origin}/events/${event.slug}`,
    organizer: {
      name: 'GRATIS Events',
      email: 'events@gratis.org',
    },
  });

  return calendar.toString();
}

/**
 * Generate event description for calendar
 */
function generateEventDescription(event: Event, ticketId?: string): string {
  let description = event.description + '\n\n';

  if (ticketId) {
    description += `Ticket ID: ${ticketId}\n\n`;
  }

  if (event.agenda && event.agenda.length > 0) {
    description += 'AGENDA:\n';
    event.agenda.forEach((item) => {
      const startTime = item.startTime.toDate().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
      description += `${startTime} - ${item.title}\n`;
    });
    description += '\n';
  }

  if (event.speakers && event.speakers.length > 0) {
    description += 'SPEAKERS:\n';
    event.speakers.forEach((speaker) => {
      description += `- ${speaker.name}${speaker.title ? ` (${speaker.title})` : ''}\n`;
    });
    description += '\n';
  }

  description += `More info: ${window.location.origin}/events/${event.slug}`;

  return description;
}

/**
 * Download iCal file
 */
export function downloadICalFile(
  icalContent: string,
  filename: string = 'event.ics'
): void {
  const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

/**
 * Generate Google Calendar URL
 */
export function generateGoogleCalendarUrl(event: Event): string {
  const startDate = event.startDate.toDate();
  const endDate = event.endDate.toDate();

  const formatDate = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
    details: event.description,
    location: formatLocation(event.location),
    trp: 'false',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generate Outlook Calendar URL
 */
export function generateOutlookCalendarUrl(event: Event): string {
  const startDate = event.startDate.toDate();
  const endDate = event.endDate.toDate();

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    startdt: startDate.toISOString(),
    enddt: endDate.toISOString(),
    body: event.description,
    location: formatLocation(event.location),
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/**
 * Generate Yahoo Calendar URL
 */
export function generateYahooCalendarUrl(event: Event): string {
  const startDate = event.startDate.toDate();
  const endDate = event.endDate.toDate();

  const formatDate = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, '').substring(0, 15);
  };

  const params = new URLSearchParams({
    v: '60',
    title: event.title,
    st: formatDate(startDate),
    et: formatDate(endDate),
    desc: event.description,
    in_loc: formatLocation(event.location),
  });

  return `https://calendar.yahoo.com/?${params.toString()}`;
}
