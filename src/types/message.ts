/**
 * Message and Conversation Types
 *
 * Part 7 - Section 33: In-App Messaging System
 * Type definitions for messaging between donors and partners
 */

export interface Conversation {
  id: string;
  participants: {
    id: string;
    type: 'user' | 'partner';
    name: string;
    avatar?: string;
  }[];
  participantIds: string[];
  lastMessage?: {
    text: string;
    senderId: string;
    sentAt: Date;
  };
  unreadCount: Record<string, number>;
  projectId?: string;
  donationId?: string;
  status: 'active' | 'archived' | 'blocked';
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'user' | 'partner';
  content: {
    type: 'text' | 'image' | 'file' | 'donation_thank_you';
    text?: string;
    imageUrl?: string;
    fileUrl?: string;
    fileName?: string;
    donationAmount?: number;
  };
  readBy: string[];
  createdAt: Date;
}
