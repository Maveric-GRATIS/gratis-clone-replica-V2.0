# Location-Based Pricing System - Setup Guide

Complete guide to implementing the location-based pricing system using Firebase Cloud Functions and Stripe.

## Overview

This system automatically detects the user's location based on their IP address and displays product prices in the appropriate currency:
- **USD** for users in the United States
- **EUR** for users in the European Union and rest of world

All pricing data is securely managed via Firebase Cloud Functions, and Stripe price IDs are stored in Firestore.

---

## Prerequisites

- Firebase project configured and initialized
- Stripe account with products and price IDs created
- Firebase CLI installed and configured
- Node.js 18+ installed

---

## Part 1: Stripe Setup

### Step 1.1: Create Products in Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Products** → **Add Product**
3. Create a product (e.g., "GRATIS Water Bottle 20oz")
4. For each product, create **two prices**:
   - One in **USD** (e.g., $2.99)
   - One in **EUR** (e.g., €2.79)

5. Copy the **Price ID** for each price (format: `price_xxxxxxx`)

### Step 1.2: Collect Price IDs

Create a mapping of your products with their Stripe price IDs:

```json
{
  "water-bottle-20oz": {
    "stripePriceIdUSD": "price_1234567890abcdef",
    "stripePriceIdEUR": "price_abcdef1234567890",
    "amountUSD": 299,
    "amountEUR": 279
  },
  "water-bottle-500ml": {
    "stripePriceIdUSD": "price_fedcba0987654321",
    "stripePriceIdEUR": "price_0987654321fedcba",
    "amountUSD": 199,
    "amountEUR": 179
  }
}
```

**Note:** Amounts are in cents (299 cents = $2.99 or €2.99)

---

## Part 2: Firebase Cloud Functions Setup

### Step 2.1: Environment Variables

Add your Stripe secret key to Firebase Cloud Functions configuration:

```bash
cd firebase-functions

# Set Stripe Secret Key
firebase functions:config:set stripe.secret_key="sk_live_..."

# Optional: Set ipapi.co API key for higher rate limits
firebase functions:config:set ipapi.key="your_api_key"
```

To view current config:
```bash
firebase functions:config:get
```

To remove a config value:
```bash
firebase functions:config:unset stripe.secret_key
```

### Step 2.2: Deploy Cloud Functions

Deploy the new pricing functions:

```bash
cd firebase-functions
npm install  # Install dependencies if needed
firebase deploy --only functions
```

Verify deployment in Firebase Console:
- Go to **Functions** tab
- You should see:
  - `getLocationPricing` (callable)
  - `getPriceByLocation` (callable)
  - `updateProductStripePrices` (callable)

---

## Part 3: Initialize Firestore Data

### Step 3.1: Add Stripe Prices to Firestore

Use the `updateProductStripePrices` Cloud Function to populate initial data.

#### Option A: Via Firebase Console

1. Go to Firestore → **Collections** → **stripe_prices** (create if not exists)
2. Click **Add Document**
3. Set Document ID: `{productId}_{currency}` (e.g., `water-bottle-20oz_USD`)
4. Add fields:
   ```
   productId: "water-bottle-20oz"
   currency: "USD"
   stripePriceId: "price_1234567890abcdef"
   amount: 299
   createdAt: (server timestamp)
   ```

5. Repeat for each product and currency combination

#### Option B: Via Cloud Function

Call the `updateProductStripePrices` function from your backend:

```javascript
const functions = firebase.functions();
const updatePrices = firebase.functions().httpsCallable('updateProductStripePrices');

const updates = [
  {
    productId: "water-bottle-20oz",
    stripePriceIdUSD: "price_1234567890abcdef",
    stripePriceIdEUR: "price_abcdef1234567890",
    amountUSD: 299,
    amountEUR: 279
  },
  // ... more products
];

try {
  const result = await updatePrices({ updates });
  console.log(`Updated ${result.data.updatedCount} products`);
} catch (error) {
  console.error('Error updating prices:', error);
}
```

**Note:** Only admins can call this function. Ensure the calling user has `role: "admin"` in Firestore.

### Step 3.2: Verify Data in Firestore

1. Open Firebase Console → Firestore
2. Navigate to **stripe_prices** collection
3. Verify documents exist for each product/currency combination
4. Check that all fields are correctly populated

---

## Part 4: Frontend Setup

### Step 4.1: Environment Variables

Create `.env.local` in your project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_STRIPE_PUBLIC_KEY=pk_live_...
VITE_CLOUD_FUNCTION_URL=https://us-central1-your-project.cloudfunctions.net
```

### Step 4.2: Add LocationPricingProvider (Optional)

If using the LocationPricingContext, wrap your app:

```tsx
import { LocationPricingProvider } from '@/contexts/LocationPricingContext';

function App() {
  return (
    <LocationPricingProvider>
      <YourAppContent />
    </LocationPricingProvider>
  );
}
```

### Step 4.3: Use in Components

#### Simple Usage with Hook

```tsx
import { useLocationBasedPricing } from '@/hooks/useLocationBasedPricing';

function ProductCard({ productId }: { productId: string }) {
  const {
    currency,
    stripePriceId,
    displayPrice,
    country,
    loading,
    error
  } = useLocationBasedPricing(productId);

  if (loading) return <div>Loading price...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Price: {currency} {displayPrice.toFixed(2)}</h2>
      <p>Stripe Price ID: {stripePriceId}</p>
      <p>Location: {country}</p>
    </div>
  );
}
```

#### Using Example Component

```tsx
import { ProductWithLocationPricing } from '@/examples/ProductWithLocationPricing';

// In your page or parent component
<ProductWithLocationPricing
  productId="water-bottle-20oz"
  productName="GRATIS Water Bottle 20oz"
  productImage="/images/water-bottle.jpg"
  productDescription="Premium hydration bottle"
  onAddToCart={(productId, stripePriceId) => {
    console.log(`Add to cart: ${productId}, Price: ${stripePriceId}`);
  }}
/>
```

#### Using Formatted Price Hook

```tsx
import { useFormattedPrice } from '@/hooks/useLocationBasedPricing';

function PriceDisplay({ productId }: { productId: string }) {
  const { formattedPrice, currency, loading } = useFormattedPrice(productId);

  if (loading) return <span>--</span>;
  return <span>{formattedPrice}</span>;
}
```

---

## Part 5: Integration with Stripe Checkout

### Example: Adding to Cart with Stripe

```tsx
import { useLocationBasedPricing } from '@/hooks/useLocationBasedPricing';
import { loadStripe } from '@stripe/stripe-js';

async function checkoutWithLocation(productId: string) {
  // Get location-based price
  const { stripePriceId, currency } = useLocationBasedPricing(productId);

  if (!stripePriceId) {
    alert('Price not available');
    return;
  }

  // Create checkout session
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId,
      stripePriceId, // Use location-based price ID
      currency,
      quantity: 1,
    }),
  });

  const { sessionId } = await response.json();

  // Redirect to Stripe Checkout
  const stripe = await loadStripe(process.env.VITE_STRIPE_PUBLIC_KEY);
  await stripe!.redirectToCheckout({ sessionId });
}
```

---

## Part 6: Testing & Verification

### Backend Testing

#### Test Location Detection

```bash
# Test getLocationPricing function
curl -X POST https://us-central1-your-project.cloudfunctions.net/getLocationPricing \
  -H "Content-Type: application/json" \
  -d '{"ipAddress":"8.8.8.8"}'

# Expected response (US IP):
{
  "currency": "USD",
  "country": "United States",
  "countryCode": "US"
}

# Expected response (EU IP):
{
  "currency": "EUR",
  "country": "Germany",
  "countryCode": "DE"
}
```

#### Test Price Fetching

```bash
curl -X POST https://us-central1-your-project.cloudfunctions.net/getPriceByLocation \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ID_TOKEN" \
  -d '{
    "productId": "water-bottle-20oz",
    "userIp": "8.8.8.8"
  }'

# Expected response:
{
  "productId": "water-bottle-20oz",
  "country": "United States",
  "currency": "USD",
  "stripePriceId": "price_...",
  "amount": 299,
  "displayPrice": 2.99
}
```

### Frontend Testing

1. **Test Caching:**
   - Load page with product
   - Check browser localStorage for `gratis_location_currency`
   - Verify it contains cached currency and timestamp

2. **Test Location Fallback:**
   - Disable internet temporarily
   - Verify app defaults to EUR
   - Check console for error logs

3. **Test Multiple Currencies:**
   - Use VPN or modify request header to simulate different locations
   - Verify currency switches between USD/EUR

4. **Test Price Display:**
   - Verify `useLocationBasedPricing` hook returns correct data
   - Verify prices display with proper currency formatting

---

## Part 7: Monitoring & Troubleshooting

### Firebase Cloud Functions Monitoring

1. Go to Firebase Console → **Functions** → **Logs**
2. Filter by function name and time
3. Check for errors and warnings

### Common Issues

#### Issue: "Price not available" error

**Solution:**
- Verify Firestore `stripe_prices` collection has documents
- Check document IDs match pattern: `{productId}_{currency}`
- Verify `currency` field has exact value "USD" or "EUR"
- Check Firestore security rules allow read access

#### Issue: Wrong currency displayed

**Solution:**
- Check ipapi.co geolocation results for your IP
- Verify `getCurrencyForCountry()` function has correct country mappings
- Clear browser cache and localStorage

#### Issue: localStorage not persisting

**Solution:**
- Check browser localStorage is enabled
- Verify no browser privacy mode is enabled
- Check localStorage quota hasn't been exceeded

#### Issue: High latency on first load

**Solution:**
- Consider implementing a global geolocation cache
- Pre-fetch prices during app initialization
- Use React Query's prefetching feature

---

## Part 8: Production Checklist

- [ ] Stripe credentials properly set in Cloud Functions config
- [ ] All products have USD and EUR prices in Firestore
- [ ] Firestore security rules deployed
- [ ] Cloud Functions deployed to production
- [ ] Frontend environment variables configured
- [ ] localStorage caching working
- [ ] Error handling tested
- [ ] Fallback to EUR verified
- [ ] Rate limiting working on Cloud Functions
- [ ] Admin function access restricted to admin users
- [ ] Stripe taxes/VAT configured (if needed)
- [ ] Monitoring/logging configured

---

## Part 9: Future Enhancements

1. **Regional Taxes/VAT:**
   - Store tax rates per region in Firestore
   - Calculate total with tax in frontend

2. **Local Currency Display:**
   - Extend beyond USD/EUR
   - Create currency mapping for specific regions

3. **Price Caching Strategy:**
   - Implement server-side cache with Redis
   - Reduce Firestore read costs

4. **A/B Testing:**
   - Test different prices for different regions
   - Track conversion rates by region

5. **Currency Selector:**
   - Allow users to manually override detected currency
   - Save preference to Firestore user profile

---

## Support & Troubleshooting

For issues:
1. Check Firebase Console logs
2. Review browser console for errors
3. Verify Firestore data structure
4. Check Cloud Functions deployment
5. Test with curl to isolate frontend vs backend issues

---

## API Reference

### Hooks

#### `useLocationBasedPricing(productId, userIp?, enabled?)`
Returns location-based pricing data with loading and error states.

#### `useFormattedPrice(productId, userIp?, locale?)`
Returns formatted price string with currency symbol.

#### `useLocationBasedPricingBatch(productIds, userIp?, enabled?)`
Fetch pricing for multiple products efficiently.

### Cloud Functions

#### `getLocationPricing(data: { ipAddress?: string })`
Detect user's country and preferred currency.

#### `getPriceByLocation(data: { productId: string; userIp?: string; forceRefresh?: boolean })`
Get Stripe price ID for a product based on user location.

#### `updateProductStripePrices(data: { updates: Array<...> })`
Batch update Stripe price IDs (Admin only).

### Utilities

```typescript
// Get cached currency from localStorage
getCachedCurrency(): { currency: Currency; country: string } | null

// Cache currency selection
setCachedCurrency(currency: Currency, country: string): void

// Clear cached currency
clearCachedCurrency(): void

// Format price amount to display string
formatPriceAmount(amountInCents: number, currency: Currency): string

// Convert cents to decimal
centsToDecimal(cents: number): number

// Convert decimal to cents
decimalToCents(decimal: number): number
```

---

**Last Updated:** 2024
**Version:** 1.0.0
