/**
 * Pricing system types for location-based pricing with Stripe integration
 */

/**
 * Supported currencies for the pricing system
 */
export type Currency = 'USD' | 'EUR';

/**
 * Response from the geolocation API
 */
export interface GeolocationResponse {
  ip: string;
  country: string;
  country_code: string;
  city: string;
  region: string;
  currency: Currency;
}

/**
 * Stripe price data for a product
 */
export interface StripePrice {
  productId: string;
  currency: Currency;
  stripePriceId: string;
  amount: number; // in cents
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Location-based price response from Cloud Function
 */
export interface LocationPricingResponse {
  productId: string;
  country: string;
  currency: Currency;
  stripePriceId: string;
  amount: number; // in cents
  displayPrice: number; // for frontend display
}

/**
 * useLocationBasedPricing hook return type
 */
export interface LocationPricingData {
  productId: string;
  currency: Currency;
  stripePriceId: string;
  amount: number; // in cents
  displayPrice: number;
  country: string;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Cached currency information
 */
export interface CachedCurrency {
  currency: Currency;
  country: string;
  timestamp: number; // milliseconds
}

/**
 * Input for getPriceByLocation Cloud Function
 */
export interface GetPriceByLocationRequest {
  productId: string;
  userIp?: string; // optional, if not provided, function uses request IP
  forceRefresh?: boolean; // bypass cache
}

/**
 * Batch update request for admin
 */
export interface UpdateProductStripePricesRequest {
  productId: string;
  stripePriceIdUSD: string;
  stripePriceIdEUR: string;
  amountUSD: number; // in cents
  amountEUR: number; // in cents
}
