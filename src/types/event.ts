import { Timestamp } from 'firebase/firestore';

export type EventType = 'conference' | 'workshop' | 'meetup' | 'webinar' | 'fundraiser' | 'volunteer' | 'social';

export type EventFormat = 'in_person' | 'virtual' | 'hybrid';

export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';

export type EventAccessLevel = 'public' | 'members_only' | 'invite_only';

export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled' | 'checked_in' | 'no_show';

export interface EventLocation {
  name: string;
  address: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  instructions?: string;
}

export interface EventVirtualDetails {
  platform: 'zoom' | 'google_meet' | 'teams' | 'youtube_live' | 'custom';
  url: string;
  meetingId?: string;
  passcode?: string;
  instructions?: string;
}

export interface EventTicketTier {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  quantity: number;
  sold: number;
  available: number;
  maxPerOrder: number;
  salesStartDate: Timestamp | null;
  salesEndDate: Timestamp | null;
  accessLevel: EventAccessLevel;
  benefits: string[];
}

export interface EventSpeaker {
  id: string;
  name: string;
  title: string;
  company?: string;
  bio?: string;
  photoURL?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface EventAgendaItem {
  id: string;
  title: string;
  description?: string;
  startTime: Timestamp;
  endTime: Timestamp;
  location?: string;
  speakers: string[];
  type: 'session' | 'break' | 'networking' | 'keynote' | 'panel' | 'workshop';
}

export interface Event {
  id: string;

  // Basic info
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  coverImage: string;
  gallery: string[];

  // Type and format
  type: EventType;
  format: EventFormat;
  status: EventStatus;
  accessLevel: EventAccessLevel;

  // Date and time
  startDate: Timestamp;
  endDate: Timestamp;
  timezone: string;

  // Location
  location: EventLocation | null;
  virtualDetails: EventVirtualDetails | null;

  // Registration
  registration: {
    enabled: boolean;
    maxAttendees: number;
    currentAttendees: number;
    waitlistEnabled: boolean;
    waitlistCount: number;
    registrationStartDate: Timestamp | null;
    registrationEndDate: Timestamp | null;
    requireApproval: boolean;
  };

  // Tickets
  ticketTiers: EventTicketTier[];

  // Content
  speakers: EventSpeaker[];
  agenda: EventAgendaItem[];

  // Settings
  settings: {
    showAttendeeCount: boolean;
    showAttendeeList: boolean;
    allowComments: boolean;
    sendReminders: boolean;
    reminderSchedule: number[];
    collectFeedback: boolean;
  };

  // Recording (for virtual events)
  recording: {
    available: boolean;
    muxAssetId?: string;
    muxPlaybackId?: string;
    duration?: number;
    accessLevel: EventAccessLevel;
  } | null;

  // Organizer
  organizerId: string;
  organizerName: string;

  // Tags and categories
  tags: string[];
  categoryId: string | null;

  // SEO
  seo: {
    title?: string;
    description?: string;
    ogImage?: string;
  };

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt: Timestamp | null;
}

export interface EventRegistration {
  id: string;

  // Event reference
  eventId: string;
  eventTitle: string;

  // Attendee
  userId: string | null;
  attendee: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    jobTitle?: string;
  };

  // Ticket
  ticketTierId: string;
  ticketTierName: string;
  ticketPrice: number;
  ticketCode: string;
  qrCodeUrl: string;

  // Status
  status: RegistrationStatus;
  checkedInAt: Timestamp | null;
  checkedInBy: string | null;

  // Payment
  stripePaymentIntentId: string | null;
  stripePaid: boolean;

  // Custom fields
  customFields: Record<string, any>;

  // Communication
  confirmationSentAt: Timestamp | null;
  remindersSentAt: Timestamp[];

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  confirmedAt: Timestamp | null;
  cancelledAt: Timestamp | null;
}

export interface CreateEventInput {
  title: string;
  description: string;
  shortDescription?: string;
  type: EventType;
  format: EventFormat;
  accessLevel?: EventAccessLevel;
  startDate: Date;
  endDate: Date;
  timezone: string;
  location?: EventLocation;
  virtualDetails?: EventVirtualDetails;
  coverImage?: string;
  maxAttendees?: number;
  ticketTiers?: Omit<EventTicketTier, 'id' | 'sold' | 'available'>[];
}

export interface RegisterEventInput {
  eventId: string;
  ticketTierId: string;
  attendees: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
  }[];
  customFields?: Record<string, any>;
}
