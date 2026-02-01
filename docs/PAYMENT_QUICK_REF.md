# Complete Payment System - Quick Reference

## 🚀 Quick Start

### 1. Set Environment Variables

```bash
# Firebase Functions
firebase functions:config:set stripe.secret_key="sk_test_YOUR_KEY"
firebase functions:config:set stripe.webhook_secret="whsec_YOUR_SECRET"

# Client-side (.env.local)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
```

### 2. Deploy Functions

```bash
cd firebase-functions
npm install
npm run build
firebase deploy --only functions
```

### 3. Configure Stripe Webhook

URL: `https://YOUR_PROJECT.cloudfunctions.net/stripeWebhook`

Events:
- checkout.session.completed
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.paid
- invoice.payment_failed
- payment_intent.succeeded
- payment_intent.payment_failed

### 4. Add Routes

```tsx
import { PaymentRoutes } from "@/routes/PaymentRoutes";

<Route path="/*" element={<PaymentRoutes />} />
```

## 📍 Component Usage

### Membership Checkout
```tsx
import MembershipCheckout from "@/components/checkout/MembershipCheckout";

<Route path="/membership" element={<MembershipCheckout />} />

// Navigate
navigate("/membership");
```

### Donation Checkout
```tsx
import DonationCheckout from "@/components/checkout/DonationCheckout";

<Route path="/donate" element={<DonationCheckout />} />

// Navigate
navigate("/donate");
```

### Event Ticket Checkout
```tsx
import EventTicketCheckout from "@/components/checkout/EventTicketCheckout";

<Route path="/events/:eventId/checkout" element={<EventTicketCheckout />} />

// Navigate
navigate(`/events/${eventId}/checkout`);
```

### Customer Portal
```tsx
import CustomerPortal from "@/components/checkout/CustomerPortal";

<Route path="/portal" element={<CustomerPortal />} />

// Navigate
navigate("/portal");
```

## 🔧 Firebase Functions

### Client-Callable Functions

#### Create Membership Checkout
```typescript
const functions = getFunctions();
const createCheckout = httpsCallable(functions, "createMembershipCheckout");

const result = await createCheckout({
  tier: "insider" | "champion" | "partner",
  successUrl: "https://yoursite.com/success",
  cancelUrl: "https://yoursite.com/cancel"
});

const { url } = result.data;
window.location.href = url;
```

#### Create Donation Checkout
```typescript
const createCheckout = httpsCallable(functions, "createDonationCheckout");

const result = await createCheckout({
  amount: 25.00,
  recurring: true,
  interval: "month",
  allocation: {
    healthcare: 40,
    housing: 30,
    education: 20,
    community: 10
  },
  successUrl: "https://yoursite.com/success",
  cancelUrl: "https://yoursite.com/cancel"
});
```

#### Create Event Ticket Checkout
```typescript
const createCheckout = httpsCallable(functions, "createEventTicketCheckout");

const result = await createCheckout({
  eventId: "event_123",
  ticketType: "General",
  quantity: 2,
  successUrl: "https://yoursite.com/confirmation",
  cancelUrl: "https://yoursite.com/checkout"
});
```

#### Open Customer Portal
```typescript
const createPortal = httpsCallable(functions, "createCustomerPortal");

const result = await createPortal({
  returnUrl: window.location.href
});

const { url } = result.data;
window.location.href = url;
```

#### Get Subscription Status
```typescript
const getStatus = httpsCallable(functions, "getSubscriptionStatus");

const result = await getStatus();
const { subscription } = result.data;

console.log(subscription.status); // "active", "past_due", etc.
console.log(subscription.current_period_end); // Timestamp
```

#### Cancel Subscription
```typescript
const cancel = httpsCallable(functions, "cancelSubscription");

await cancel({
  immediately: false // If true, cancels now. If false, at period end
});
```

#### Create Product (Admin Only)
```typescript
const createProduct = httpsCallable(functions, "createStripeProduct");

await createProduct({
  name: "Insider Membership",
  price: 9.99,
  interval: "month",
  metadata: {
    tier: "insider",
    type: "membership"
  }
});
```

## 💾 Firestore Queries

### Get User Donations
```typescript
const q = query(
  collection(db, "donations"),
  where("userId", "==", userId),
  orderBy("createdAt", "desc")
);

const snapshot = await getDocs(q);
const donations = snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
}));
```

### Get User Tickets
```typescript
const q = query(
  collection(db, "event_registrations"),
  where("userId", "==", userId),
  where("status", "==", "valid")
);

const snapshot = await getDocs(q);
const tickets = snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
}));
```

### Get Event Ticket Types
```typescript
const eventDoc = await getDoc(doc(db, "events", eventId));
const event = eventDoc.data();
const ticketTypes = event.ticketTypes; // Array of ticket types
```

## 🧪 Testing

### Test Cards
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Auth Required: 4000 0025 0000 3155
Insufficient: 4000 0000 0000 9995
```

### Test Webhooks Locally
```bash
# Install Stripe CLI
stripe login

# Forward webhooks
stripe listen --forward-to http://localhost:5001/PROJECT/us-central1/stripeWebhook

# Trigger events
stripe trigger checkout.session.completed
stripe trigger invoice.paid
stripe trigger customer.subscription.deleted
```

### Test Functions Locally
```bash
# Start emulators
firebase emulators:start

# Your functions will be available at:
# http://localhost:5001/PROJECT/us-central1/FUNCTION_NAME
```

## 🐛 Troubleshooting

### "Customer not found"
**Fix**: User must be logged in. Check Firebase Auth.

### "Invalid webhook signature"
**Fix**: Verify `stripe.webhook_secret` matches Stripe dashboard.

### "Product not found"
**Fix**: Create products using `createStripeProduct` or Stripe dashboard.

### Checkout session fails
**Fix**: Check Firebase Functions logs: `firebase functions:log`

### Webhook not receiving events
**Fix**:
1. Check Stripe Dashboard → Webhooks → Recent deliveries
2. Verify webhook URL is correct
3. Check that functions are deployed

## 📊 Monitoring

### View Logs
```bash
# All logs
firebase functions:log

# Specific function
firebase functions:log --only stripeWebhook

# Follow in real-time
firebase functions:log --follow
```

### Stripe Dashboard
- Payments: dashboard.stripe.com/payments
- Webhooks: dashboard.stripe.com/webhooks
- Customers: dashboard.stripe.com/customers
- Subscriptions: dashboard.stripe.com/subscriptions

## 🔗 Integration Examples

### Add "Become a Member" Button
```tsx
<Button onClick={() => navigate("/membership")}>
  Become a Member
</Button>
```

### Add "Donate Now" Button
```tsx
<Button onClick={() => navigate("/donate")}>
  Donate Now
</Button>
```

### Add "Buy Tickets" Button
```tsx
<Button onClick={() => navigate(`/events/${eventId}/checkout`)}>
  Buy Tickets
</Button>
```

### Add "Manage Billing" Link
```tsx
<Link to="/portal">Manage Billing</Link>
```

### Show Membership Badge
```tsx
{user?.membershipTier && (
  <Badge variant="premium">
    {user.membershipTier} Member
  </Badge>
)}
```

### Show Total Donated
```tsx
<div>
  Total Donated: €{user?.totalDonated?.toFixed(2) || "0.00"}
</div>
```

## 📱 Email Templates (To Implement)

### Membership Welcome
- Subject: "Welcome to GRATIS!"
- Content: Membership benefits, next steps
- Include: Dashboard link, portal link

### Donation Receipt
- Subject: "Thank you for your donation"
- Content: Impact message, tax receipt
- Include: PDF receipt, allocation breakdown

### Ticket Confirmation
- Subject: "Your tickets for [Event Name]"
- Content: Event details, QR codes
- Include: Calendar invite, venue directions

### Payment Failed
- Subject: "Payment issue with your subscription"
- Content: Update payment method link
- Include: Portal link, support contact

## 🎨 Styling

All components use shadcn/ui:
- `Button` - Primary actions
- `Card` - Content containers
- `Badge` - Status indicators
- `Input` - Form fields
- `Slider` - Allocation controls
- `Select` - Dropdown menus

Customize in `tailwind.config.ts`:
```typescript
theme: {
  extend: {
    colors: {
      primary: {...},
      secondary: {...}
    }
  }
}
```

## 📦 Dependencies

Already installed:
- ✅ stripe (Firebase Functions)
- ✅ firebase-admin
- ✅ firebase-functions
- ✅ @stripe/stripe-js (client-side)

If needed:
```bash
cd firebase-functions
npm install stripe

cd ..
npm install @stripe/stripe-js
```

## 🚦 Status Checks

### Is Everything Working?
```bash
# Check functions are deployed
firebase functions:list

# Check webhook is configured
# Go to: dashboard.stripe.com/webhooks

# Test a payment
# Use test card: 4242 4242 4242 4242
```

### Quick Health Check
1. ✅ Can create membership checkout?
2. ✅ Can create donation checkout?
3. ✅ Can create ticket checkout?
4. ✅ Can access customer portal?
5. ✅ Are webhooks receiving events?
6. ✅ Are Firestore records created?

## 📞 Support

Need help?
- Docs: [STRIPE_INTEGRATION.md](./STRIPE_INTEGRATION.md)
- Setup: [STRIPE_SETUP.md](./STRIPE_SETUP.md)
- Stripe: support.stripe.com
- Firebase: firebase.google.com/support

---

**Quick Ref Version**: 1.0
**Last Updated**: 2024
**Status**: Production Ready ✅
