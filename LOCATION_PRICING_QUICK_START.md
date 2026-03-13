# Quick Start Guide - Location-Based Pricing

Get your location-based pricing system running in 10 minutes.

## Prerequisites ✓

- [ ] Firebase project created
- [ ] Stripe account with products created
- [ ] Project dependencies installed (`npm install`)
- [ ] Firebase CLI installed

## Step 1: Create Stripe Prices (2 min)

1. Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/products)
2. Select a product, create a price in USD and EUR
3. Copy the Price IDs:
   ```
   Product: "Water Bottle 20oz"
   - USD Price ID: price_1A2B3C4D5E6F
   - EUR Price ID: price_6F5E4D3C2B1A
   - Amount USD: 299 cents ($2.99)
   - Amount EUR: 279 cents (€2.79)
   ```

## Step 2: Set Environment Variables (1 min)

**CloudFunctions config:**
```bash
cd firebase-functions
firebase functions:config:set stripe.secret_key="sk_live_..."
firebase deploy --only functions
```

**Frontend .env.local:**
```env
VITE_STRIPE_PUBLIC_KEY=pk_live_...
```

## Step 3: Add Pricing Data to Firestore (2 min)

Use Firebase Console to create collection `stripe_prices` with documents:

**Document 1:** `water-bottle-20oz_USD`
```json
{
  "productId": "water-bottle-20oz",
  "currency": "USD",
  "stripePriceId": "price_1A2B3C4D5E6F",
  "amount": 299,
  "createdAt": "(server timestamp)"
}
```

**Document 2:** `water-bottle-20oz_EUR`
```json
{
  "productId": "water-bottle-20oz",
  "currency": "EUR",
  "stripePriceId": "price_6F5E4D3C2B1A",
  "amount": 279,
  "createdAt": "(server timestamp)"
}
```

Or programmatically using the Cloud Function...

## Step 4: Use in Your Component (1 min)

```tsx
import { useLocationBasedPricing } from '@/hooks/useLocationBasedPricing';

export function ProductCard() {
  const {
    currency,
    displayPrice,
    stripePriceId,
    country,
    loading,
    error
  } = useLocationBasedPricing('water-bottle-20oz');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>${currency} {displayPrice.toFixed(2)}</h2>
      <p>{country}</p>
      <button onClick={() => addToCart(stripePriceId)}>
        Add to Cart
      </button>
    </div>
  );
}
```

## Step 5: Test It (4 min)

**Test location detection:**
```bash
# Open browser console
> const pricing = await firebase.functions()
    .httpsCallable('getLocationPricing')({});
> console.log(pricing.data);
// Should show: { currency: 'USD' or 'EUR', country: '...' }
```

**Test price fetching:**
```bash
> const price = await firebase.functions()
    .httpsCallable('getPriceByLocation')({
      productId: 'water-bottle-20oz'
    });
> console.log(price.data);
// Should show: { stripePriceId: 'price_...', amount: 299, ... }
```

**Check localStorage cache:**
```bash
> localStorage.getItem('gratis_location_currency')
// Should output: { currency: 'USD', country: 'United States', timestamp: ... }
```

## Done! 🎉

Your location-based pricing system is live!

---

## Next Steps

- [ ] Add more products
- [ ] Integrate with checkout flow
- [ ] Test with different VPNs/IPs
- [ ] Set up monitoring in Firebase Console
- [ ] Customize currency selector component
- [ ] Add price formatting per locale

## Useful Commands

```bash
# View Cloud Functions logs
firebase functions:log

# Test function locally
firebase emulators:start

# Check deployed functions
firebase functions:list

# View Firestore data
firebase firestore:export ./backup
```

## Example: Using with ProductWithLocationPricing Component

```tsx
import { ProductWithLocationPricing } from '@/examples/ProductWithLocationPricing';

export function ShopPage() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <ProductWithLocationPricing
        productId="water-bottle-20oz"
        productName="GRATIS Water Bottle 20oz"
        productImage="/images/bottle.jpg"
        onAddToCart={(id, priceId) => {
          console.log(`Add ${id} with price ${priceId}`);
        }}
      />
    </div>
  );
}
```

## Troubleshooting

| Issue | Solution |\n| --- | --- |\n| "Price not available" | Check Firestore has stripe_prices collection with correct doc IDs |\n| Wrong currency shown | Verify ipapi.co geolocation is working (test with curl) |\n| Loading forever | Check Cloud Functions deployed and network logs |\n| localStorage empty | Check browser localStorage is enabled |\n| 404 on Cloud Function | Redeploy: `firebase deploy --only functions` |\n\n## Full Documentation

See `LOCATION_PRICING_SETUP.md` for complete setup guide.
