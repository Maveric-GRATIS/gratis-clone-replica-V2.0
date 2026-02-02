/**
 * Support Ticket System Types
 * Part 8 - Section 38: Customer Support
 */

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
export type TicketCategory =
  | 'account'
  | 'billing'
  | 'donation'
  | 'order'
  | 'technical'
  | 'partnership'
  | 'feedback'
  | 'other';

export interface Ticket {
  id: string;
  ticketNumber: string;
  userId: string;
  userEmail: string;
  userName: string;
  userType: 'user' | 'partner';
  partnerId?: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo?: string;
  assignedToName?: string;
  attachments: TicketAttachment[];
  tags: string[];
  firstResponseAt?: Date;
  resolvedAt?: Date;
  closedAt?: Date;
  satisfactionRating?: number;
  satisfactionFeedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketAttachment {
  name: string;
  url: string;
  type: string;
  size?: number;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderType: 'user' | 'partner' | 'agent' | 'system';
  senderAvatar?: string;
  content: string;
  attachments?: TicketAttachment[];
  isInternal: boolean;
  createdAt: Date;
}

export interface CannedResponse {
  id: string;
  title: string;
  content: string;
  category: TicketCategory;
  tags: string[];
  usageCount: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  waitingCustomer: number;
  resolved: number;
  closed: number;
  resolvedToday: number;
  avgResponseTime: number; // in hours
  avgResolutionTime?: number; // in hours
  satisfactionRate?: number; // out of 5
}
