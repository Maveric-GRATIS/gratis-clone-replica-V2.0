/**
 * React Context for managing location-based pricing across the entire application
 * Provides currency selection and prevents redundant geolocation requests
 * This context is optional - components can use useLocationBasedPricing hook directly
 */

import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  detectLocationAndCurrency,
  getCachedCurrency,
  setCachedCurrency,
} from "@/lib/pricing/locationPricing";
import { Currency } from "@/types/pricing";

interface LocationPricingContextType {
  // Detected user information
  currency: Currency;
  country: string;
  userIp?: string;

  // Loading and error states
  isLoading: boolean;
  error: Error | null;

  // Actions
  refreshLocation: () => Promise<void>;
  setCurrency: (currency: Currency, country: string) => void;
}

const LocationPricingContext = createContext<
  LocationPricingContextType | undefined
>(undefined);

interface LocationPricingProviderProps {
  children: React.ReactNode;
  userIp?: string; // Optional: provide user IP for testing
}

/**
 * Provider component for location-based pricing
 * Wrap your app (or relevant sections) with this to enable app-wide pricing context
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <LocationPricingProvider>
 *       <YourApp />
 *     </LocationPricingProvider>
 *   );
 * }
 * ```
 */
export function LocationPricingProvider({
  children,
  userIp,
}: LocationPricingProviderProps) {
  // Query for location and currency
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["app-location-currency", userIp],
    queryFn: async () => {
      // Try cached version first
      const cached = getCachedCurrency();
      if (cached) {
        return cached;
      }

      // Detect location
      const detected = await detectLocationAndCurrency(userIp);

      // Cache the result
      setCachedCurrency(detected.currency, detected.country);

      return detected;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  // Manual currency override
  const [overrideCurrency, setOverrideCurrency] =
    React.useState<Currency | null>(null);
  const [overrideCountry, setOverrideCountry] = React.useState<string | null>(
    null,
  );

  // Build context value
  const value: LocationPricingContextType = useMemo(
    () => ({
      currency: overrideCurrency || data?.currency || "EUR",
      country: overrideCountry || data?.country || "Unknown",
      userIp,
      isLoading,
      error: error as Error | null,
      refreshLocation: async () => {
        setOverrideCurrency(null);
        setOverrideCountry(null);
        await refetch();
      },
      setCurrency: (currency: Currency, country: string) => {
        setOverrideCurrency(currency);
        setOverrideCountry(country);
        setCachedCurrency(currency, country);
      },
    }),
    [
      data,
      overrideCurrency,
      overrideCountry,
      userIp,
      isLoading,
      error,
      refetch,
    ],
  );

  return (
    <LocationPricingContext.Provider value={value}>
      {children}
    </LocationPricingContext.Provider>
  );
}

/**
 * Hook to use location pricing context
 * Must be used within LocationPricingProvider
 *
 * @returns LocationPricingContextType
 * @throws Error if used outside of LocationPricingProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { currency, country, isLoading } = useLocationPricingContext();
 *
 *   if (isLoading) return <div>Detecting location...</div>;
 *
 *   return <div>You are in {country} using {currency}</div>;
 * }
 * ```
 */
export function useLocationPricingContext(): LocationPricingContextType {
  const context = useContext(LocationPricingContext);

  if (!context) {
    throw new Error(
      "useLocationPricingContext must be used within LocationPricingProvider",
    );
  }

  return context;
}

/**
 * Hook to check if LocationPricingContext is available
 * Returns null if not within provider, context otherwise
 */
export function useLocationPricingContextIfAvailable(): LocationPricingContextType | null {
  return useContext(LocationPricingContext) || null;
}
