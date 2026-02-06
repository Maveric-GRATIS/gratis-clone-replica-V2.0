// ============================================================================
// SUBSCRIPTION & RECURRING DONATION TYPES
// ============================================================================

export type SubscriptionStatus =
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'trialing'
  | 'unpaid'
  | 'paused';

export type SubscriptionInterval = 'month' | 'quarter' | 'year';

export type PlanTier = 'supporter' | 'champion' | 'guardian' | 'patron';

export interface SubscriptionPlan {
  id: PlanTier;
  name: string;
  description: string;
  pricing: {
    monthly: number;
    quarterly: number;
    yearly: number;
  };
  stripePriceIds: {
    monthly: string;
    quarterly: string;
    yearly: string;
  };
  features: string[];
  benefits: {
    bottles: number;
    taxReceipt: boolean;
    newsletter: boolean;
    exclusiveContent: boolean;
    votingPower: number;
  };
  popular?: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: PlanTier;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  status: SubscriptionStatus;
  interval: SubscriptionInterval;
  amount: number;
  currency: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  cancelReason?: string;
  trialStart?: Date;
  trialEnd?: Date;
  paymentMethodId?: string;
  nextInvoiceAmount?: number;
  nextInvoiceDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  stripePaymentMethodId: string;
  type: 'card' | 'sepa_debit' | 'ideal' | 'bancontact';
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  sepa?: {
    last4: string;
    bankCode: string;
  };
  isDefault: boolean;
  billingDetails: {
    name: string;
    email: string;
    phone?: string;
  };
  createdAt: Date;
}

export interface SubscriptionInvoice {
  id: string;
  subscriptionId: string;
  userId: string;
  stripeInvoiceId: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  periodStart: Date;
  periodEnd: Date;
  paidAt?: Date;
  invoiceUrl?: string;
  createdAt: Date;
}

export interface DonationSchedule {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  interval: SubscriptionInterval;
  projectAllocations: DonationAllocation[];
  nextDonationDate: Date;
  active: boolean;
  createdAt: Date;
}

export interface DonationAllocation {
  projectId: string;
  projectName: string;
  percentage: number;      // 0-100, must sum to 100
}

export interface SubscriptionEvent {
  id: string;
  subscriptionId: string;
  type: SubscriptionEventType;
  createdAt: Date;
}

export type SubscriptionEventType =
  | 'created'
  | 'updated'
  | 'canceled'
  | 'reactivated'
  | 'payment_succeeded'
  | 'payment_failed'
  | 'plan_changed'
  | 'paused'
  | 'resumed'
  | 'trial_started'
  | 'trial_ended';
