/**
 * Utility functions for location-based pricing system
 * Handles geolocation, caching, and Stripe price fetching
 */

import { functions } from '@/firebase';
import { httpsCallable } from 'firebase/functions';
import {
  GeolocationResponse,
  LocationPricingResponse,
  CachedCurrency,
  Currency,
  GetPriceByLocationRequest,
} from '@/types/pricing';

// Cache keys for localStorage
const CACHE_KEY_CURRENCY = 'gratis_location_currency';
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Detects user's country and preferred currency from IP address
 * Uses ipapi.co as fallback if Cloud Function is unavailable
 */
export async function detectLocationAndCurrency(
  userIp?: string,
): Promise<{ currency: Currency; country: string }> {
  try {
    // Try to use Cloud Function first (more control, better security)
    const getLocationFunction = httpsCallable(functions, 'getLocationPricing');
    const result = await getLocationFunction({
      ipAddress: userIp,
    });

    const data = result.data as any;
    return {
      currency: data.currency || 'EUR',
      country: data.country || 'Unknown',
    };
  } catch (error) {
    console.warn('Cloud Function failed, falling back to ipapi.co', error);
    // Fallback to direct API call
    return detectLocationViaIpApi(userIp);
  }
}

/**
 * Fallback: Detect location directly from ipapi.co
 */
async function detectLocationViaIpApi(userIp?: string): Promise<{ currency: Currency; country: string }> {
  try {
    const url = userIp
      ? `https://ipapi.co/${userIp}/json/`
      : 'https://ipapi.co/json/';

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = (await response.json()) as GeolocationResponse;

    // Determine currency: US → USD, everywhere else → EUR
    const currency: Currency = data.country_code === 'US' ? 'USD' : 'EUR';

    return {
      currency,
      country: data.country,
    };
  } catch (error) {
    console.error('Location detection failed:', error);
    // Fallback to EUR if everything fails
    return {
      currency: 'EUR',
      country: 'Unknown',
    };
  }
}

/**
 * Fetch location-based Stripe price for a product
 */
export async function fetchLocationPrice(
  productId: string,
  userIp?: string,
  forceRefresh = false,
): Promise<LocationPricingResponse> {
  try {
    const getPriceFunction = httpsCallable(functions, 'getPriceByLocation');
    const request: GetPriceByLocationRequest = {
      productId,
      userIp,
      forceRefresh,
    };

    const result = await getPriceFunction(request);
    return result.data as LocationPricingResponse;
  } catch (error) {
    console.error('Failed to fetch location-based price:', error);
    throw error;
  }
}

/**
 * Get cached currency from localStorage
 * Returns null if cache is expired or not found
 */
export function getCachedCurrency(): { currency: Currency; country: string } | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY_CURRENCY);
    if (!cached) return null;

    const data: CachedCurrency = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is still valid
    if (now - data.timestamp > CACHE_EXPIRY_MS) {
      localStorage.removeItem(CACHE_KEY_CURRENCY);
      return null;
    }

    return {
      currency: data.currency,
      country: data.country,
    };
  } catch (error) {
    console.warn('Failed to read cached currency:', error);
    return null;
  }
}

/**
 * Cache currency selection in localStorage
 */
export function setCachedCurrency(
  currency: Currency,
  country: string,
): void {
  try {
    const data: CachedCurrency = {
      currency,
      country,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY_CURRENCY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to cache currency:', error);
    // Fail silently - app will still work without caching
  }
}

/**
 * Clear cached currency (useful for testing or currency reset)
 */
export function clearCachedCurrency(): void {
  try {
    localStorage.removeItem(CACHE_KEY_CURRENCY);
  } catch (error) {
    console.warn('Failed to clear cached currency:', error);
  }
}

/**
 * Format price amount (in cents) to display format
 */
export function formatPriceAmount(
  amountInCents: number,
  currency: Currency,
  locale = 'en-US',
): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const amountInDollars = amountInCents / 100;
  return formatter.format(amountInDollars);
}

/**
 * Convert amount from cents to decimal
 */
export function centsToDecimal(cents: number): number {
  return cents / 100;
}

/**
 * Convert decimal amount to cents
 */
export function decimalToCents(decimal: number): number {
  return Math.round(decimal * 100);
}
