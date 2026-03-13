/**
 * Example Product Card with Location-Based Pricing
 * Shows how to use the useLocationBasedPricing hook in a component
 */

import React from "react";
import {
  useLocationBasedPricing,
  useFormattedPrice,
} from "@/hooks/useLocationBasedPricing";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Globe } from "lucide-react";

interface ProductWithLocationPricingProps {
  productId: string;
  productName: string;
  productImage: string;
  productDescription?: string;
  onAddToCart?: (productId: string, stripePriceId: string) => void;
}

/**
 * Product Card Component with Location-Based Pricing
 * Automatically detects user location and shows USD/EUR pricing
 *
 * @example
 * ```tsx
 * <ProductWithLocationPricing
 *   productId="water-bottle-20oz"
 *   productName="GRATIS Water Bottle"
 *   productImage="/images/water-bottle.jpg"
 *   onAddToCart={(id, priceId) => console.log('Add to cart:', id, priceId)}
 * />
 * ```
 */
export function ProductWithLocationPricing({
  productId,
  productName,
  productImage,
  productDescription,
  onAddToCart,
}: ProductWithLocationPricingProps) {
  const {
    currency,
    stripePriceId,
    amount,
    displayPrice,
    country,
    loading,
    error,
    refetch,
  } = useLocationBasedPricing(productId);

  if (loading) {
    return (
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-6">
        <div className="mb-4 h-48 bg-muted animate-pulse rounded-lg" />
        <div className="space-y-4">
          <div className="h-6 bg-muted animate-pulse rounded" />
          <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
          <div className="h-8 bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm rounded-lg border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="relative overflow-hidden bg-muted h-48">
        <img
          src={productImage}
          alt={productName}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
        {/* Currency Badge */}
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
          <Globe className="w-4 h-4" />
          {currency}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{productName}</h3>

        {productDescription && (
          <p className="text-sm text-muted-foreground mb-3">
            {productDescription}
          </p>
        )}

        {/* Location Info */}
        <div className="text-xs text-muted-foreground mb-3">
          📍{" "}
          {country !== "Unknown"
            ? `Located in ${country}`
            : "Location detected"}
        </div>

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load pricing. Please try again.
            </AlertDescription>
          </Alert>
        )}

        {/* Price Display */}
        <div className="mb-4">
          <div className="text-3xl font-bold text-primary mb-1">
            {displayPrice ? (
              <span>
                {currency === "USD" ? "$" : "€"}
                {(amount / 100).toFixed(2)}
              </span>
            ) : (
              <span className="text-muted">--</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Stripe Price ID: {stripePriceId || "Loading..."}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (stripePriceId && onAddToCart) {
                onAddToCart(productId, stripePriceId);
              }
            }}
            disabled={!stripePriceId || loading}
            className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add to Cart
          </button>

          <button
            onClick={() => refetch()}
            className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            title="Refresh pricing"
          >
            🔄
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Simple Price Display Component
 * Just shows the price for a product
 */
export function LocationBasedPrice({ productId }: { productId: string }) {
  const { formattedPrice, currency, loading, error } =
    useFormattedPrice(productId);

  if (loading) {
    return <div className="h-6 bg-muted animate-pulse rounded w-24" />;
  }

  if (error) {
    return (
      <span className="text-muted-foreground text-sm">Price unavailable</span>
    );
  }

  return (
    <span className="font-bold text-lg">
      {formattedPrice}{" "}
      <span className="text-sm text-muted-foreground">{currency}</span>
    </span>
  );
}

/**
 * Currency Selector Component
 * Allows users to manually switch between USD/EUR
 */
import { useLocationPricingContextIfAvailable } from "@/contexts/LocationPricingContext";

export function CurrencySelector() {
  const context = useLocationPricingContextIfAvailable();

  if (!context) {
    return null;
  }

  const { currency, country, setCurrency, isLoading } = context;

  return (
    <div className="flex items-center gap-2 text-sm">
      <label className="font-semibold">Currency:</label>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as "USD" | "EUR", country)}
        disabled={isLoading}
        className="px-3 py-1.5 border border-border rounded-lg bg-background cursor-pointer"
      >
        <option value="USD">USD (United States)</option>
        <option value="EUR">EUR (Europe)</option>
      </select>
      <button
        onClick={() => context.refreshLocation()}
        disabled={isLoading}
        className="px-3 py-1.5 border border-border rounded-lg hover:bg-muted disabled:opacity-50 transition-colors"
        title="Auto-detect location"
      >
        🔍 Auto-detect
      </button>
    </div>
  );
}

/**
 * Location Info Display
 * Shows user's detected location and currency
 */
export function LocationInfo() {
  const context = useLocationPricingContextIfAvailable();
  const { currency, country, isLoading, error } =
    useLocationBasedPricing("dummy");

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">Detecting location...</div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-destructive">Error detecting location</div>
    );
  }

  return (
    <div className="text-sm text-muted-foreground">
      📍 <strong>{country}</strong> · <strong>{currency}</strong>
    </div>
  );
}
