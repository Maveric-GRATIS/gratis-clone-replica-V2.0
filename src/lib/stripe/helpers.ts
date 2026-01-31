/**
 * Stripe Helper Functions
 *
 * Helper functions for Stripe payments in GRATIS
 */

import { TribeTier } from '@/types/user';
import { DonationAllocation } from '@/types/donation';

/**
 * Format amount in cents to currency string
 */
export const formatCurrency = (amountInCents: number, currency = 'EUR'): string => {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency,
  }).format(amountInCents / 100);
};

/**
 * Convert amount to cents
 */
export const toCents = (amount: number): number => {
  return Math.round(amount * 100);
};

/**
 * Convert cents to amount
 */
export const fromCents = (amountInCents: number): number => {
  return amountInCents / 100;
};

/**
 * Create membership checkout session data
 */
export interface MembershipCheckoutData {
  tier: TribeTier;
  interval: 'monthly' | 'yearly';
  userId: string;
  email: string;
  successUrl: string;
  cancelUrl: string;
}

/**
 * Create donation checkout session data
 */
export interface DonationCheckoutData {
  amount: number; // in cents
  allocation: DonationAllocation;
  frequency: 'one_time' | 'monthly' | 'yearly';
  userId?: string;
  email: string;
  dedication?: {
    type: 'in_honor' | 'in_memory';
    name: string;
    message?: string;
    notifyEmail?: string;
  };
  successUrl: string;
  cancelUrl: string;
}

/**
 * Create event ticket checkout session data
 */
export interface EventTicketCheckoutData {
  eventId: string;
  ticketTierId: string;
  quantity: number;
  attendeeInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  successUrl: string;
  cancelUrl: string;
}

/**
 * Calculate donation allocation amounts
 */
export const calculateAllocationAmounts = (
  totalAmount: number,
  allocation: DonationAllocation
): {
  water: number;
  arts: number;
  education: number;
} => {
  const water = Math.round(totalAmount * allocation.water);
  const arts = Math.round(totalAmount * allocation.arts);
  const education = Math.round(totalAmount * allocation.education);

  return { water, arts, education };
};

/**
 * Get membership tier display name
 */
export const getMembershipTierName = (tier: TribeTier): string => {
  const names: Record<TribeTier, string> = {
    explorer: 'Explorer',
    insider: 'Insider',
    core: 'Core',
    founder: 'Founder',
  };
  return names[tier];
};

/**
 * Get membership tier price
 */
export const getMembershipTierPrice = (tier: TribeTier, interval: 'monthly' | 'yearly'): number => {
  const monthlyPrices: Record<TribeTier, number> = {
    explorer: 0,
    insider: 1500,      // €15
    core: 5000,         // €50
    founder: 25000,     // €250
  };

  const monthlyPrice = monthlyPrices[tier];

  if (interval === 'yearly') {
    // 2 months free on yearly subscriptions
    return monthlyPrice * 10;
  }

  return monthlyPrice;
};

/**
 * Validate payment method for region
 */
export const isPaymentMethodAvailable = (
  paymentMethod: string,
  country: string
): boolean => {
  const availableByCountry: Record<string, string[]> = {
    NL: ['card', 'ideal', 'sepa_debit'],
    BE: ['card', 'bancontact', 'sepa_debit'],
    DE: ['card', 'sepa_debit'],
    FR: ['card', 'sepa_debit'],
    // Add more countries as needed
  };

  const available = availableByCountry[country] || ['card'];
  return available.includes(paymentMethod);
};

/**
 * Get payment method display name
 */
export const getPaymentMethodName = (paymentMethod: string): string => {
  const names: Record<string, string> = {
    card: 'Credit/Debit Card',
    ideal: 'iDEAL',
    sepa_debit: 'SEPA Direct Debit',
    bancontact: 'Bancontact',
  };
  return names[paymentMethod] || paymentMethod;
};

/**
 * Calculate processing fee (example: 1.4% + €0.25 for EU cards)
 */
export const calculateProcessingFee = (amount: number): number => {
  return Math.round(amount * 0.014 + 25);
};

/**
 * Calculate net amount after fees
 */
export const calculateNetAmount = (amount: number): number => {
  return amount - calculateProcessingFee(amount);
};
