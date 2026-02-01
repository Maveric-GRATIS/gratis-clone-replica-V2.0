# Stripe Setup Configuration

## Environment Variables

Create `firebase-functions/.runtimeconfig.json` for local development:

```json
{
  "stripe": {
    "secret_key": "sk_test_YOUR_SECRET_KEY_HERE",
    "webhook_secret": "whsec_YOUR_WEBHOOK_SECRET_HERE"
  }
}
```

## Firebase Functions Configuration

For production, set environment variables:

```bash
firebase functions:config:set stripe.secret_key="sk_live_YOUR_SECRET_KEY"
firebase functions:config:set stripe.webhook_secret="whsec_YOUR_WEBHOOK_SECRET"
```

## Stripe Dashboard Setup Checklist

### 1. Get API Keys
- [ ] Go to: https://dashboard.stripe.com/test/apikeys
- [ ] Copy **Secret key** (starts with `sk_test_`)
- [ ] Copy **Publishable key** (starts with `pk_test_`)

### 2. Create Products

#### Insider Membership
```
Name: Insider Membership
Price: €9.99 EUR
Billing: Recurring (monthly)
Metadata:
  - tier: insider
  - type: membership
```

#### Champion Membership
```
Name: Champion Membership
Price: €29.99 EUR
Billing: Recurring (monthly)
Metadata:
  - tier: champion
  - type: membership
```

#### Corporate Partner
```
Name: Corporate Partner
Price: €499 EUR
Billing: Recurring (monthly)
Metadata:
  - tier: partner
  - type: membership
```

### 3. Configure Webhook

- [ ] Go to: https://dashboard.stripe.com/test/webhooks
- [ ] Click "Add endpoint"
- [ ] URL: `https://YOUR_PROJECT_ID.cloudfunctions.net/stripeWebhook`
- [ ] Select events:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.paid`
  - `invoice.payment_failed`
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
- [ ] Copy **Signing secret** (starts with `whsec_`)

### 4. Payment Methods

Enable payment methods in Stripe Dashboard:
- [ ] Cards (Visa, Mastercard, Amex)
- [ ] iDEAL (Netherlands)
- [ ] Bancontact (Belgium)
- [ ] SEPA Direct Debit

### 5. Business Settings

- [ ] Business name: GRATIS
- [ ] Support email: support@gratis.org
- [ ] Statement descriptor: "GRATIS"
- [ ] Logo: Upload your logo
- [ ] Brand color: Match your website

## Deployment Steps

### 1. Install Dependencies

```bash
cd firebase-functions
npm install
```

### 2. Set Configuration

**Local Development:**
```bash
# Create .runtimeconfig.json with test keys
cat > .runtimeconfig.json << EOF
{
  "stripe": {
    "secret_key": "sk_test_YOUR_KEY",
    "webhook_secret": "whsec_YOUR_SECRET"
  }
}
EOF
```

**Production:**
```bash
firebase functions:config:set stripe.secret_key="sk_live_YOUR_KEY"
firebase functions:config:set stripe.webhook_secret="whsec_YOUR_SECRET"
```

### 3. Build and Deploy

```bash
npm run build
firebase deploy --only functions
```

### 4. Verify Deployment

```bash
# Check function URLs
firebase functions:list

# Expected output:
# ✔ stripeWebhook(us-central1)
# ✔ createMembershipCheckout(us-central1)
# ✔ createDonationCheckout(us-central1)
# ✔ createEventTicketCheckout(us-central1)
# ✔ createCustomerPortal(us-central1)
# ✔ getSubscriptionStatus(us-central1)
# ✔ cancelSubscription(us-central1)
# ✔ createStripeProduct(us-central1)
```

## Testing Locally

### 1. Start Emulators

```bash
firebase emulators:start
```

### 2. Test Webhook Locally

```bash
# Install Stripe CLI
stripe login

# Forward webhooks
stripe listen --forward-to http://localhost:5001/YOUR_PROJECT/us-central1/stripeWebhook

# In another terminal, trigger events
stripe trigger checkout.session.completed
stripe trigger invoice.paid
```

### 3. Test Cards

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Requires Auth: 4000 0025 0000 3155
Expired: 4000 0000 0000 0069
```

## Frontend Environment Variables

Create `.env.local` in project root:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY
```

## Firestore Security Rules

Add to `firestore.rules`:

```javascript
match /donations/{donationId} {
  allow read: if request.auth != null &&
    (request.auth.uid == resource.data.userId ||
     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
  allow create: if request.auth != null;
}

match /event_registrations/{registrationId} {
  allow read: if request.auth != null &&
    (request.auth.uid == resource.data.userId ||
     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
  allow create: if request.auth != null;
}
```

## Monitoring

### Firebase Functions Logs

```bash
# View all logs
firebase functions:log

# View specific function
firebase functions:log --only stripeWebhook

# Follow logs in real-time
firebase functions:log --follow
```

### Stripe Dashboard

Monitor payments in real-time:
- [ ] Dashboard → Payments
- [ ] Dashboard → Webhooks → Recent deliveries
- [ ] Dashboard → Customers
- [ ] Dashboard → Subscriptions

## Post-Deployment Checklist

- [ ] Verify webhook endpoint is receiving events
- [ ] Test membership checkout flow
- [ ] Test donation checkout flow
- [ ] Test event ticket checkout flow
- [ ] Test customer portal access
- [ ] Test subscription cancellation
- [ ] Verify Firestore records are created correctly
- [ ] Test with real payment methods
- [ ] Enable email notifications
- [ ] Set up production keys when ready

## Going Live

### Before Launch:
1. [ ] Switch to live API keys (`sk_live_`, `pk_live_`)
2. [ ] Update webhook endpoint to production URL
3. [ ] Test with real (small) payments
4. [ ] Enable 3D Secure authentication
5. [ ] Set up monitoring and alerts
6. [ ] Configure tax settings (if applicable)
7. [ ] Review refund policy
8. [ ] Update terms of service

### After Launch:
1. [ ] Monitor webhook deliveries
2. [ ] Check payment success rates
3. [ ] Review failed payment logs
4. [ ] Set up automated email receipts
5. [ ] Configure dispute handling
6. [ ] Enable subscription recovery features

## Support Resources

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe Support**: https://support.stripe.com
- **Firebase Functions**: https://firebase.google.com/docs/functions
- **Testing**: https://stripe.com/docs/testing

## Common Issues

### "Customer not found"
**Solution**: Ensure user is logged in and `stripeCustomerId` exists in Firestore.

### "Invalid webhook signature"
**Solution**: Verify `webhook_secret` is set correctly and matches Stripe dashboard.

### "Product not found"
**Solution**: Create products in Stripe dashboard or use `createStripeProduct` function.

### Checkout redirects to wrong URL
**Solution**: Check `successUrl` and `cancelUrl` parameters include full domain.

---

**Setup Time**: ~30 minutes
**Difficulty**: Intermediate
**Prerequisites**: Firebase project, Stripe account
