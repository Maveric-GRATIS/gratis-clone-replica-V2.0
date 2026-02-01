# Stripe Payment Integration

Complete Stripe integration for GRATIS platform, including memberships, donations, and event tickets.

## 📋 Features Implemented

### ✅ Server-Side (Firebase Functions)

1. **Stripe Functions** (`firebase-functions/src/stripe-functions.ts`)
   - `createMembershipCheckout` - Create subscription checkout for membership tiers
   - `createDonationCheckout` - Create one-time or recurring donation checkout
   - `createEventTicketCheckout` - Create event ticket purchase checkout
   - `createCustomerPortal` - Generate Stripe billing portal session
   - `getSubscriptionStatus` - Retrieve active subscription details
   - `cancelSubscription` - Cancel subscription (immediately or at period end)
   - `createStripeProduct` - Admin function to create products/prices (Admin only)

2. **Webhook Handler** (`firebase-functions/src/stripe-webhooks.ts`)
   - `stripeWebhook` - Main webhook endpoint with signature verification
   - Handles all Stripe events:
     - `checkout.session.completed` - Process completed checkouts
     - `customer.subscription.created` - New subscription created
     - `customer.subscription.updated` - Subscription status changes
     - `customer.subscription.deleted` - Subscription cancellation
     - `invoice.paid` - Successful recurring payment
     - `invoice.payment_failed` - Failed payment notification
     - `payment_intent.succeeded` - Payment confirmation
     - `payment_intent.payment_failed` - Payment failure

### ✅ Client-Side Components

1. **MembershipCheckout** (`src/components/checkout/MembershipCheckout.tsx`)
   - Display 3 membership tiers: Insider (€9.99), Champion (€29.99), Partner (€499)
   - Tier selection with feature comparison
   - Stripe Checkout integration
   - Success/cancel URL handling

2. **DonationCheckout** (`src/components/checkout/DonationCheckout.tsx`)
   - Preset amounts: €10, €25, €50, €100, €250
   - Custom amount input
   - One-time or recurring donations (monthly/yearly)
   - Interactive allocation sliders across 4 categories:
     - Healthcare
     - Housing
     - Education
     - Community
   - Real-time impact calculation

3. **EventTicketCheckout** (`src/components/checkout/EventTicketCheckout.tsx`)
   - Dynamic event loading from Firestore
   - Multiple ticket types support
   - Quantity selection with availability check
   - Order summary with total calculation
   - QR code ticket generation (handled by webhook)

4. **CustomerPortal** (`src/components/checkout/CustomerPortal.tsx`)
   - View active subscription details
   - Access Stripe billing portal
   - Cancel subscription
   - View donation history
   - Download invoices
   - Update payment methods

## 🚀 Setup Instructions

### 1. Stripe Configuration

#### Set Stripe API Keys in Firebase Functions

```bash
cd firebase-functions
firebase functions:config:set stripe.secret_key="sk_test_your_secret_key"
firebase functions:config:set stripe.webhook_secret="whsec_your_webhook_secret"
```

#### For Local Development

Create `firebase-functions/.runtimeconfig.json`:
```json
{
  "stripe": {
    "secret_key": "sk_test_your_secret_key",
    "webhook_secret": "whsec_your_webhook_secret"
  }
}
```

### 2. Create Stripe Products

Use the admin function to create products:

```typescript
// Call from admin panel or Firebase console
const createStripeProduct = httpsCallable(functions, "createStripeProduct");

// Membership: Insider
await createStripeProduct({
  name: "Insider Membership",
  price: 9.99,
  interval: "month",
  metadata: { tier: "insider", type: "membership" }
});

// Membership: Champion
await createStripeProduct({
  name: "Champion Membership",
  price: 29.99,
  interval: "month",
  metadata: { tier: "champion", type: "membership" }
});

// Membership: Corporate Partner
await createStripeProduct({
  name: "Corporate Partner",
  price: 499,
  interval: "month",
  metadata: { tier: "partner", type: "membership" }
});
```

### 3. Configure Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://YOUR_PROJECT.cloudfunctions.net/stripeWebhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy webhook signing secret
5. Set in Firebase config: `firebase functions:config:set stripe.webhook_secret="whsec_..."`

### 4. Deploy Functions

```bash
cd firebase-functions
npm install
npm run build
firebase deploy --only functions
```

## 📊 Database Schema

### Users Collection
```typescript
{
  stripeCustomerId: string;
  membershipTier: "insider" | "champion" | "partner" | null;
  membershipStatus: "active" | "past_due" | "canceled" | null;
  stripeSubscriptionId: string | null;
  currentPeriodEnd: Timestamp | null;
  totalDonated: number;
  lastDonationAt: Timestamp | null;
  paymentFailedAt: Timestamp | null;
}
```

### Donations Collection
```typescript
{
  userId: string | null; // null for anonymous
  amount: number;
  currency: string; // "eur"
  allocation: {
    healthcare: number; // percentage
    housing: number;
    education: number;
    community: number;
  };
  stripePaymentIntentId: string;
  stripeInvoiceId?: string; // for recurring
  stripeSubscriptionId?: string; // for recurring
  status: "completed" | "pending" | "failed";
  recurring: boolean;
  createdAt: Timestamp;
}
```

### Event Registrations Collection
```typescript
{
  userId: string;
  eventId: string;
  ticketType: string;
  orderNumber: string; // "ORD-{timestamp}-{random}"
  qrCode: string; // Generated QR code data
  purchasedAt: Timestamp;
  checkedIn: boolean;
  status: "valid" | "used" | "cancelled";
}
```

## 🔐 Security

### Function Authorization
- All payment functions require authentication (`context.auth`)
- Admin-only functions check for `admin` custom claim
- Rate limiting implemented (100 requests/min per user)

### Webhook Security
- Stripe signature verification using `stripe.webhooks.constructEvent`
- Webhook secret stored securely in Firebase config
- Invalid signatures rejected with 400 error

### Customer Verification
- Stripe customer IDs linked to Firebase users
- Metadata contains user IDs for verification
- All operations validated against authenticated user

## 💳 Supported Payment Methods

- Credit/Debit Cards (Visa, Mastercard, Amex)
- iDEAL (Netherlands)
- Bancontact (Belgium)
- SEPA Direct Debit (recurring payments)

## 🌍 Internationalization

All components support i18n with translation keys:
- `membership.*` - Membership checkout
- `donation.*` - Donation checkout
- `tickets.*` - Event tickets
- `portal.*` - Customer portal
- `error.*` - Error messages

## 📧 Post-Purchase Flow

### Memberships
1. User completes checkout → Stripe session created
2. Webhook receives `checkout.session.completed`
3. `handleMembershipPurchase` activates membership
4. User document updated with tier and status
5. Email confirmation sent (implement separately)

### Donations
1. User completes checkout with allocation
2. Webhook receives `checkout.session.completed`
3. `handleDonationPurchase` records donation
4. Allocation percentages saved
5. Tax receipt email sent (implement separately)

### Event Tickets
1. User purchases tickets
2. Webhook receives `checkout.session.completed`
3. `handleEventTicketPurchase` creates ticket records
4. QR codes generated for each ticket
5. Ticket email sent with QR codes (implement separately)

### Recurring Payments
1. First payment processed as above
2. `invoice.paid` webhook for each renewal
3. Donation recorded for recurring donations
4. Membership stays active automatically

## 🧪 Testing

### Test Mode
Use Stripe test keys for development:
- `sk_test_...` - Secret key
- `pk_test_...` - Publishable key

### Test Cards
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
```

### Test Webhooks Locally
```bash
# Install Stripe CLI
stripe login
stripe listen --forward-to http://localhost:5001/YOUR_PROJECT/us-central1/stripeWebhook

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger invoice.paid
```

## 📈 Future Enhancements

- [ ] Email notifications (Resend/SendGrid integration)
- [ ] Tax receipt generation
- [ ] Refund processing
- [ ] Proration for membership upgrades
- [ ] Gift memberships
- [ ] Coupon/discount codes
- [ ] Multi-currency support
- [ ] Apple Pay / Google Pay
- [ ] Subscription pause feature
- [ ] Payment plan installments

## 🐛 Troubleshooting

### Webhook Not Receiving Events
1. Check Stripe Dashboard → Webhooks → Recent deliveries
2. Verify webhook URL is correct
3. Ensure functions are deployed
4. Check Firebase Functions logs: `firebase functions:log`

### Customer Not Found Error
1. Verify user is authenticated
2. Check `stripeCustomerId` exists in user document
3. Ensure customer was created in Stripe

### Checkout Session Fails
1. Check Stripe API key is set correctly
2. Verify products exist in Stripe Dashboard
3. Check Firebase Functions logs for detailed error
4. Ensure success/cancel URLs are accessible

### Allocation Not Saving
1. Verify allocation object sums to 100%
2. Check webhook handler logs
3. Ensure `allocation` field in metadata is valid JSON

## 📞 Support

For issues or questions:
1. Check Firebase Functions logs: `firebase functions:log`
2. Check Stripe Dashboard for failed webhooks
3. Review error messages in browser console
4. Contact Stripe support for payment issues

---

**Created**: 2024
**Last Updated**: 2024
**Version**: 1.0.0
**Stripe API Version**: 2023-10-16
