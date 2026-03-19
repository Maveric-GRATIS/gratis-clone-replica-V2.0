/**
 * React hook for fetching and managing location-based pricing
 * Uses React Query for caching and data fetching
 */

import { useQuery, useQueryClient, useQueries } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import {
  fetchLocationPrice,
  getCachedCurrency,
  setCachedCurrency,
  detectLocationAndCurrency,
  formatPriceAmount,
} from '@/lib/pricing/locationPricing';
import {
  LocationPricingData,
  LocationPricingResponse,
  Currency,
} from '@/types/pricing';

/**
 * Hook to fetch and cache location-based pricing for a product
 *
 * Features:
 * - Automatic currency detection based on user location
 * - localStorage caching (24 hour expiry)
 * - React Query caching and refetching
 * - Fallback to EUR if detection fails
 *
 * @param productId - The product ID to fetch pricing for
 * @param userIp - Optional IP address (defaults to user's current IP)
 * @param enabled - Whether to enable the query (default: true)
 * @returns LocationPricingData with price info, loading state, and error
 *
 * @example
 * ```tsx
 * const { currency, stripePriceId, displayPrice, loading, error } = useLocationBasedPricing('product-123');
 *
 * if (loading) return <div>Loading price...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 *
 * return <div>Price: {displayPrice} {currency}</div>;
 * ```
 */
export function useLocationBasedPricing(
  productId: string,
  userIp?: string,
  enabled = true,
): LocationPricingData {
  const queryClient = useQueryClient();

  // First, detect location and get cached currency if available
  const {
    data: locationData,
    isLoading: locationLoading,
    error: locationError,
  } = useQuery({
    queryKey: ['location-currency', userIp],
    queryFn: async () => {
      // Try to use cached currency first
      const cached = getCachedCurrency();
      if (cached) {
        return cached;
      }

      // Otherwise, detect location
      const detected = await detectLocationAndCurrency(userIp);

      // Cache the result
      setCachedCurrency(detected.currency, detected.country);

      return detected;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    enabled,
  });

  // Fetch the actual price based on detected currency
  const {
    data: priceData,
    isLoading: priceLoading,
    error: priceError,
  } = useQuery({
    queryKey: ['location-price', productId, locationData?.currency],
    queryFn: async () => {
      if (!locationData?.currency) {
        throw new Error('Unable to determine currency');
      }

      const response = await fetchLocationPrice(productId, userIp);
      return response;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    enabled: enabled && !!locationData?.currency, // Only query after location is determined
  });

  // Refetch function for manual refresh
  const refetch = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ['location-currency', userIp],
    });
    queryClient.invalidateQueries({
      queryKey: ['location-price', productId],
    });
  }, [productId, userIp, queryClient]);

  // Build the return object
  const result: LocationPricingData = useMemo(() => {
    const loading = locationLoading || priceLoading;
    const error = locationError || priceError;

    if (priceData) {
      return {
        productId,
        currency: priceData.currency as Currency,
        stripePriceId: priceData.stripePriceId,
        amount: priceData.amount,
        displayPrice: priceData.displayPrice,
        country: locationData?.country || 'Unknown',
        loading,
        error: error as Error | null,
        refetch,
      };
    }

    // Return default state while loading
    return {
      productId,
      currency: locationData?.currency || 'EUR',
      stripePriceId: '',
      amount: 0,
      displayPrice: 0,
      country: locationData?.country || 'Unknown',
      loading,
      error: error as Error | null,
      refetch,
    };
  }, [productId, locationData, priceData, locationLoading, priceLoading, locationError, priceError, refetch]);

  return result;
}

/**
 * Hook to fetch pricing for multiple products at once
 * Efficient batch fetching with React Query
 */
export function useLocationBasedPricingBatch(
  productIds: string[],
  userIp?: string,
  enabled = true,
) {
  const queryClient = useQueryClient();

  const results = useQueries({
    queries: productIds.map((productId) => ({
      queryKey: ['location-price-batch', productId, userIp],
      queryFn: async () => {
        const response = await fetchLocationPrice(productId, userIp);
        return {
          productId,
          currency: response.currency as Currency,
          stripePriceId: response.stripePriceId,
          amount: response.amount,
          displayPrice: response.displayPrice,
          country: 'Unknown',
          loading: false,
          error: null,
          refetch: () => {
            queryClient.invalidateQueries({
              queryKey: ['location-price-batch', productId],
            });
          },
        } as LocationPricingData;
      },
      enabled,
      staleTime: 1000 * 60 * 30,
      gcTime: 1000 * 60 * 60,
    })),
  });

  const prices = results.map((result, index) => {
    if (result.data) {
      return result.data;
    }

    return {
      productId: productIds[index],
      currency: 'EUR' as Currency,
      stripePriceId: '',
      amount: 0,
      displayPrice: 0,
      country: 'Unknown',
      loading: result.isLoading,
      error: (result.error as Error | null) ?? null,
      refetch: () => {
        queryClient.invalidateQueries({
          queryKey: ['location-price-batch', productIds[index]],
        });
      },
    } as LocationPricingData;
  });

  // Calculate aggregate loading and error states
  const isLoading = results.some((r) => r.isLoading);
  const errors = results
    .map((r) => (r.error as Error | null) ?? null)
    .filter((error): error is Error => error !== null);

  return {
    prices,
    isLoading,
    hasErrors: errors.length > 0,
    errors,
  };
}

/**
 * Hook to get formatted price string with currency symbol
 */
export function useFormattedPrice(
  productId: string,
  userIp?: string,
  locale = 'en-US',
) {
  const pricing = useLocationBasedPricing(productId, userIp);

  const formattedPrice = useMemo(() => {
    if (!pricing.amount) return '';
    return formatPriceAmount(pricing.amount, pricing.currency, locale);
  }, [pricing.amount, pricing.currency, locale]);

  return {
    ...pricing,
    formattedPrice,
  };
}
