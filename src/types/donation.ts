import { Timestamp } from 'firebase/firestore';

export type DonationFrequency = 'one_time' | 'monthly' | 'quarterly' | 'annually';

export type DonationStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';

export type PaymentMethod = 'card' | 'ideal' | 'sepa_debit' | 'bancontact';

export interface DonationAllocation {
  water: number;
  arts: number;
  education: number;
}

export interface DonationDedication {
  enabled: boolean;
  type: 'in_honor' | 'in_memory';
  name: string;
  notifyRecipient: boolean;
  recipientEmail?: string;
  recipientName?: string;
  message?: string;
}

export interface Donation {
  id: string;

  // Donor info
  userId: string | null;
  donorEmail: string;
  donorFirstName: string;
  donorLastName: string;
  donorPhone?: string;
  donorCompany?: string;
  isAnonymous: boolean;

  // Amount
  amount: number;
  currency: string;
  frequency: DonationFrequency;
  allocation: DonationAllocation;
  processingFeeCovered: boolean;
  processingFeeAmount: number;
  netAmount: number;

  // Payment
  status: DonationStatus;
  paymentMethod: PaymentMethod | null;
  stripePaymentIntentId: string | null;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  stripeInvoiceId: string | null;

  // Dedication
  dedication: DonationDedication | null;

  // Campaign (optional)
  campaignId: string | null;
  campaignName: string | null;

  // Tracking
  source: string | null;
  utmParams: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  } | null;

  // Receipt
  receiptNumber: string | null;
  receiptUrl: string | null;
  receiptSentAt: Timestamp | null;

  // Tax
  taxDeductible: boolean;
  taxReceiptRequested: boolean;

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  completedAt: Timestamp | null;
  failedAt: Timestamp | null;
  refundedAt: Timestamp | null;
}

export interface RecurringDonation {
  id: string;

  // Donor info
  userId: string;
  donorEmail: string;

  // Subscription
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  stripePriceId: string;

  // Amount
  amount: number;
  currency: string;
  frequency: Exclude<DonationFrequency, 'one_time'>;
  allocation: DonationAllocation;
  processingFeeCovered: boolean;

  // Status
  status: 'active' | 'past_due' | 'cancelled' | 'paused';
  currentPeriodStart: Timestamp;
  currentPeriodEnd: Timestamp;
  cancelAtPeriodEnd: boolean;
  cancelledAt: Timestamp | null;
  pausedAt: Timestamp | null;

  // History
  totalDonated: number;
  donationsCount: number;
  lastDonationAt: Timestamp | null;

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface DonationCampaign {
  id: string;

  // Basic info
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  coverImage: string;

  // Goals
  goalAmount: number;
  raisedAmount: number;
  donorsCount: number;
  currency: string;

  // Allocation
  allocation: DonationAllocation;

  // Dates
  startDate: Timestamp;
  endDate: Timestamp | null;

  // Status
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  featured: boolean;

  // Settings
  allowCustomAmount: boolean;
  suggestedAmounts: number[];
  minAmount: number;
  maxAmount: number | null;

  // Matching
  matchingEnabled: boolean;
  matchingRatio: number;
  matchingMaxAmount: number | null;
  matchingSponsor: string | null;

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateDonationInput {
  amount: number;
  frequency: DonationFrequency;
  allocation: DonationAllocation;
  donorInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
  };
  isAnonymous?: boolean;
  processingFeeCovered?: boolean;
  dedication?: DonationDedication;
  campaignId?: string;
  source?: string;
  utmParams?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
}
