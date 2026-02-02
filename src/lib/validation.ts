/**
 * Validation Schemas using Zod
 * Based on GRATIS Part 1 specifications
 */

import { z } from 'zod';

// ==================== USER SCHEMAS ====================

export const userAddressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().optional(),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
});

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  displayName: z.string().optional(),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  displayName: z.string().optional(),
  photoURL: z.string().url().nullable().optional(),
  phone: z.string().nullable().optional(),
  dateOfBirth: z.date().nullable().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').nullable().optional(),
  company: z.string().nullable().optional(),
  jobTitle: z.string().nullable().optional(),
  website: z.string().url('Invalid URL').nullable().optional(),
  socialLinks: z
    .object({
      twitter: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      instagram: z.string().url().optional(),
    })
    .optional(),
  address: userAddressSchema.nullable().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// ==================== DONATION SCHEMAS ====================

export const donationAllocationSchema = z
  .object({
    water: z.number().min(0).max(100),
    arts: z.number().min(0).max(100),
    education: z.number().min(0).max(100),
  })
  .refine((data) => data.water + data.arts + data.education === 100, {
    message: 'Allocation must total 100%',
  });

export const donationDedicationSchema = z.object({
  enabled: z.boolean(),
  type: z.enum(['in_honor', 'in_memory']),
  name: z.string().min(1, 'Name is required'),
  notifyRecipient: z.boolean(),
  recipientEmail: z.string().email().optional(),
  recipientName: z.string().optional(),
  message: z.string().max(500).optional(),
});

export const createDonationSchema = z.object({
  amount: z.number().min(1, 'Amount must be at least €1'),
  frequency: z.enum(['one_time', 'monthly', 'quarterly', 'annually']),
  allocation: donationAllocationSchema,
  donorInfo: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    company: z.string().optional(),
  }),
  isAnonymous: z.boolean().optional(),
  processingFeeCovered: z.boolean().optional(),
  dedication: donationDedicationSchema.nullable().optional(),
  campaignId: z.string().optional(),
  source: z.string().optional(),
  utmParams: z
    .object({
      source: z.string().optional(),
      medium: z.string().optional(),
      campaign: z.string().optional(),
    })
    .optional(),
});

// ==================== EVENT SCHEMAS ====================

export const eventLocationSchema = z.object({
  name: z.string().min(1, 'Location name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().optional(),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  instructions: z.string().optional(),
});

export const eventVirtualDetailsSchema = z.object({
  platform: z.enum(['zoom', 'google_meet', 'teams', 'youtube_live', 'custom']),
  url: z.string().url('Invalid URL'),
  meetingId: z.string().optional(),
  passcode: z.string().optional(),
  instructions: z.string().optional(),
});

export const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z.string().max(200).optional(),
  type: z.enum(['conference', 'workshop', 'meetup', 'webinar', 'fundraiser', 'volunteer', 'social']),
  format: z.enum(['in_person', 'virtual', 'hybrid']),
  accessLevel: z.enum(['public', 'members_only', 'invite_only']).optional(),
  startDate: z.date(),
  endDate: z.date(),
  timezone: z.string(),
  location: eventLocationSchema.nullable().optional(),
  virtualDetails: eventVirtualDetailsSchema.nullable().optional(),
  coverImage: z.string().url().optional(),
  maxAttendees: z.number().min(1).optional(),
});

export const registerEventSchema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
  ticketTierId: z.string().min(1, 'Ticket tier is required'),
  attendees: z
    .array(
      z.object({
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        email: z.string().email('Invalid email address'),
        phone: z.string().optional(),
        company: z.string().optional(),
      })
    )
    .min(1, 'At least one attendee is required'),
  customFields: z.record(z.any()).optional(),
});

// ==================== CONTACT SCHEMAS ====================

export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  category: z.enum(['general', 'support', 'partnership', 'media', 'other']).optional(),
});

// ==================== NEWSLETTER SCHEMAS ====================

export const newsletterSubscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required').optional(),
  preferences: z
    .object({
      newsletter: z.boolean().optional(),
      events: z.boolean().optional(),
      impact: z.boolean().optional(),
    })
    .optional(),
});

// ==================== TRIBE MEMBERSHIP SCHEMAS ====================

export const tribeMembershipSchema = z.object({
  tier: z.enum(['explorer', 'insider', 'core', 'founder']),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  billingAddress: userAddressSchema,
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

// Export types from schemas
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateDonationInput = z.infer<typeof createDonationSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type RegisterEventInput = z.infer<typeof registerEventSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type NewsletterSubscribeInput = z.infer<typeof newsletterSubscribeSchema>;
export type TribeMembershipInput = z.infer<typeof tribeMembershipSchema>;
