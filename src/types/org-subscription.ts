// ============================================================================
// GRATIS.NGO — Organization Subscription & Billing Type Definitions
// ============================================================================

export type OrgSubscriptionPlan = 'free' | 'starter' | 'pro' | 'enterprise';
export type OrgSubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'cancelled' | 'paused' | 'unpaid';
export type BillingCycle = 'monthly' | 'yearly';

export interface PlanDefinition {
  id: OrgSubscriptionPlan;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  features: PlanFeature[];
  limits: PlanLimits;
  highlighted?: boolean;
  stripePriceMonthly?: string;
  stripePriceYearly?: string;
}

export interface PlanFeature {
  name: string;
  included: boolean;
  limit?: string;
}

export interface PlanLimits {
  projects: number;
  events: number;
  storage: number;          // GB
  teamMembers: number;
  emailsPerMonth: number;
  apiCallsPerDay: number;
  customDomain: boolean;
  whiteLabel: boolean;
  prioritySupport: boolean;
  analytics: 'basic' | 'advanced' | 'enterprise';
}

export interface OrgSubscription {
  id: string;
  userId: string;
  organizationId?: string;
  plan: OrgSubscriptionPlan;
  status: OrgSubscriptionStatus;
  billingCycle: BillingCycle;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAt?: string;
  cancelledAt?: string;
  trialEnd?: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  amount: number;
  currency: string;
  features: PlanLimits;
  usage: OrgSubscriptionUsage;
  createdAt: string;
  updatedAt: string;
}

export interface OrgSubscriptionUsage {
  projects: number;
  events: number;
  storageUsed: number;     // GB
  teamMembers: number;
  emailsSent: number;
  apiCalls: number;
}

export interface OrgInvoice {
  id: string;
  subscriptionId: string;
  userId: string;
  stripeInvoiceId?: string;
  number: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  amount: number;
  currency: string;
  description: string;
  periodStart: string;
  periodEnd: string;
  paidAt?: string;
  pdf?: string;
  hostedUrl?: string;
  lineItems: OrgInvoiceLineItem[];
  createdAt: string;
}

export interface OrgInvoiceLineItem {
  description: string;
  quantity: number;
  unitAmount: number;
  amount: number;
}

export interface OrgPaymentMethod {
  id: string;
  type: 'card' | 'sepa' | 'ideal';
  brand?: string;
  last4: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  stripePaymentMethodId: string;
}

// Plan catalog
export const ORG_PLANS: PlanDefinition[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'For small NGOs getting started',
    monthlyPrice: 0,
    yearlyPrice: 0,
    currency: 'EUR',
    features: [
      { name: 'Up to 3 projects', included: true, limit: '3' },
      { name: 'Basic analytics', included: true },
      { name: 'Community support', included: true },
      { name: 'Custom domain', included: false },
      { name: 'White-label', included: false },
    ],
    limits: { projects: 3, events: 5, storage: 1, teamMembers: 2, emailsPerMonth: 500, apiCallsPerDay: 100, customDomain: false, whiteLabel: false, prioritySupport: false, analytics: 'basic' },
  },
  {
    id: 'starter',
    name: 'Starter',
    description: 'For growing organizations',
    monthlyPrice: 29,
    yearlyPrice: 290,
    currency: 'EUR',
    features: [
      { name: 'Up to 20 projects', included: true, limit: '20' },
      { name: 'Advanced analytics', included: true },
      { name: 'Email support', included: true },
      { name: 'Custom domain', included: true },
      { name: 'White-label', included: false },
    ],
    limits: { projects: 20, events: 50, storage: 10, teamMembers: 10, emailsPerMonth: 5000, apiCallsPerDay: 1000, customDomain: true, whiteLabel: false, prioritySupport: false, analytics: 'advanced' },
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For established nonprofits',
    monthlyPrice: 79,
    yearlyPrice: 790,
    currency: 'EUR',
    highlighted: true,
    features: [
      { name: 'Unlimited projects', included: true },
      { name: 'Enterprise analytics', included: true },
      { name: 'Priority support', included: true },
      { name: 'Custom domain', included: true },
      { name: 'White-label', included: true },
    ],
    limits: { projects: 9999, events: 9999, storage: 100, teamMembers: 50, emailsPerMonth: 50000, apiCallsPerDay: 10000, customDomain: true, whiteLabel: true, prioritySupport: true, analytics: 'enterprise' },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Custom solutions for large organizations',
    monthlyPrice: 299,
    yearlyPrice: 2990,
    currency: 'EUR',
    features: [
      { name: 'Everything in Pro', included: true },
      { name: 'Dedicated account manager', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'SLA guarantees', included: true },
      { name: 'On-premise option', included: true },
    ],
    limits: { projects: 99999, events: 99999, storage: 1000, teamMembers: 500, emailsPerMonth: 500000, apiCallsPerDay: 100000, customDomain: true, whiteLabel: true, prioritySupport: true, analytics: 'enterprise' },
  },
];
