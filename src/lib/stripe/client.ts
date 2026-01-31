/**
 * Stripe Client
 *
 * Client-side Stripe integration for GRATIS
 */

import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { STRIPE_PUBLISHABLE_KEY } from './config';

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Get Stripe instance (singleton pattern)
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    if (!STRIPE_PUBLISHABLE_KEY) {
      console.warn('Stripe publishable key not found. Set VITE_STRIPE_PUBLISHABLE_KEY in .env');
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

/**
 * Create Stripe Elements instance
 */
export const createStripeElements = async (
  clientSecret: string,
  options?: {
    appearance?: any;
    locale?: string;
  }
): Promise<StripeElements | null> => {
  const stripe = await getStripe();
  if (!stripe) return null;

  return stripe.elements({
    clientSecret,
    appearance: options?.appearance || {
      theme: 'stripe',
      variables: {
        colorPrimary: '#C1FF00',
        colorBackground: '#0D0D0D',
        colorText: '#FFFFFF',
        colorDanger: '#FF0077',
        fontFamily: 'Inter, system-ui, sans-serif',
        borderRadius: '8px',
      },
    },
    locale: (options?.locale as any) || 'auto',
  });
};

/**
 * Redirect to Stripe Checkout
 */
export const redirectToCheckout = async (sessionId: string): Promise<void> => {
  const stripe = await getStripe();
  if (!stripe) {
    throw new Error('Stripe not loaded');
  }

  const { error } = await stripe.redirectToCheckout({ sessionId });

  if (error) {
    throw error;
  }
};

/**
 * Confirm payment with Payment Intent
 */
export const confirmPayment = async (
  elements: StripeElements,
  confirmParams: {
    return_url: string;
    payment_method_data?: any;
  }
): Promise<{ error?: any }> => {
  const stripe = await getStripe();
  if (!stripe) {
    return { error: { message: 'Stripe not loaded' } };
  }

  return stripe.confirmPayment({
    elements,
    confirmParams,
  });
};

/**
 * Confirm setup for future payments
 */
export const confirmSetup = async (
  elements: StripeElements,
  confirmParams: {
    return_url: string;
  }
): Promise<{ error?: any }> => {
  const stripe = await getStripe();
  if (!stripe) {
    return { error: { message: 'Stripe not loaded' } };
  }

  return stripe.confirmSetup({
    elements,
    confirmParams,
  });
};
