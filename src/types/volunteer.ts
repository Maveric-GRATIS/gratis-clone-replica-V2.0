/**
 * Volunteer Types
 * Part 9 - Section 46: Volunteer management and opportunities
 */

export type VolunteerStatus = 'active' | 'inactive' | 'pending' | 'suspended';
export type OpportunityType = 'event' | 'ongoing' | 'project' | 'virtual';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Volunteer {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profileImage?: string;
  bio?: string;
  skills: string[];
  interests: string[];
  availability: VolunteerAvailability;
  totalHours: number;
  completedShifts: number;
  badges: string[];
  rating: number;
  status: VolunteerStatus;
  joinedAt: Date;
  lastActiveAt: Date;
}

export interface VolunteerAvailability {
  monday?: TimeSlot[];
  tuesday?: TimeSlot[];
  wednesday?: TimeSlot[];
  thursday?: TimeSlot[];
  friday?: TimeSlot[];
  saturday?: TimeSlot[];
  sunday?: TimeSlot[];
}

export interface TimeSlot {
  start: string; // HH:mm
  end: string; // HH:mm
}

export interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  type: OpportunityType;
  organization: string;
  location?: {
    address: string;
    city: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
  isVirtual: boolean;
  startDate: Date;
  endDate?: Date;
  requiredSkills: string[];
  skillLevel: SkillLevel;
  numberOfVolunteers: number;
  volunteersNeeded: number;
  volunteersAssigned: number;
  hoursPerWeek?: number;
  commitment?: string;
  benefits?: string[];
  imageUrl?: string;
  contactPerson: {
    name: string;
    email: string;
    phone?: string;
  };
  status: 'draft' | 'published' | 'in_progress' | 'completed' | 'cancelled';
  tags: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VolunteerShift {
  id: string;
  opportunityId: string;
  title: string;
  date: Date;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  volunteersNeeded: number;
  volunteersAssigned: number;
  location?: string;
  instructions?: string;
  status: 'open' | 'full' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface ShiftAssignment {
  id: string;
  shiftId: string;
  volunteerId: string;
  volunteerName: string;
  status: 'scheduled' | 'checked_in' | 'checked_out' | 'no_show' | 'cancelled';
  checkedInAt?: Date;
  checkedOutAt?: Date;
  hoursLogged?: number;
  notes?: string;
  assignedAt: Date;
}

export interface VolunteerHourLog {
  id: string;
  volunteerId: string;
  opportunityId?: string;
  shiftId?: string;
  date: Date;
  hours: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
}

export interface VolunteerBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: {
    type: 'hours' | 'shifts' | 'events' | 'milestone';
    threshold: number;
  };
}

export interface VolunteerApplication {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  motivation: string;
  skills: string[];
  availability: VolunteerAvailability;
  referenceContact?: {
    name: string;
    email: string;
    phone: string;
    relationship: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'interview_scheduled';
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
  interviewDate?: Date;
  submittedAt: Date;
}

export interface VolunteerStats {
  totalVolunteers: number;
  activeVolunteers: number;
  totalHours: number;
  avgHoursPerVolunteer: number;
  completedShifts: number;
  upcomingShifts: number;
  retentionRate: number;
}
