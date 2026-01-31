/**
 * Stripe Configuration
 *
 * Client-side Stripe configuration for GRATIS payment system
 */

// Get Stripe publishable key from environment
export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

// Payment method types supported
export const PAYMENT_METHODS = {
  card: 'card',
  ideal: 'ideal',
  sepa_debit: 'sepa_debit',
  bancontact: 'bancontact',
} as const;

// Currency
export const CURRENCY = 'eur';

// Membership prices (in cents)
export const MEMBERSHIP_PRICES = {
  explorer: 0,      // Free tier
  insider: 1500,    // €15/month
  core: 5000,       // €50/month
  founder: 25000,   // €250/month
} as const;

// Stripe product IDs (these should come from .env in production)
export const STRIPE_PRICE_IDS = {
  insider_monthly: import.meta.env.VITE_STRIPE_PRICE_INSIDER_MONTHLY || 'price_insider_monthly',
  insider_yearly: import.meta.env.VITE_STRIPE_PRICE_INSIDER_YEARLY || 'price_insider_yearly',
  core_monthly: import.meta.env.VITE_STRIPE_PRICE_CORE_MONTHLY || 'price_core_monthly',
  core_yearly: import.meta.env.VITE_STRIPE_PRICE_CORE_YEARLY || 'price_core_yearly',
  founder_monthly: import.meta.env.VITE_STRIPE_PRICE_FOUNDER_MONTHLY || 'price_founder_monthly',
  founder_yearly: import.meta.env.VITE_STRIPE_PRICE_FOUNDER_YEARLY || 'price_founder_yearly',
} as const;

// Checkout success/cancel URLs
export const getCheckoutUrls = () => {
  const baseUrl = window.location.origin;
  return {
    success: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel: `${baseUrl}/checkout/cancel`,
  };
};

// Customer portal URL
export const getCustomerPortalUrl = () => {
  return import.meta.env.VITE_STRIPE_CUSTOMER_PORTAL_URL || '/settings';
};
