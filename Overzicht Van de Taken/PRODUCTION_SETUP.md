# Production Setup Guide

Deze guide helpt je om van mock data naar een volledig werkende productie omgeving te gaan.

---

## 📋 **Checklist**

- [ ] Firebase Blaze Plan activeren
- [ ] Stripe Live API Keys configureren
- [ ] Mux Account & API Keys instellen (voor Video Platform)
- [ ] Email Service configureren (SendGrid/Mailgun)
- [ ] Firebase Functions deployen
- [ ] Firebase Storage configureren
- [ ] Environment Variables instellen
- [ ] Database seeden met echte data
- [ ] Testing & QA

---

## 🔥 **1. Firebase Blaze Plan Upgrade**

### Waarom nodig?
- Firebase Functions (voor backend logica zoals Stripe webhooks, email verzending)
- Firestore queries zonder limieten
- Firebase Storage voor file uploads (images, PDFs, exports)
- Externe API calls (Stripe, Mux, Email services)

### Kosten (ongeveer)
- **Firestore**: €0.06 per 100K reads, €0.18 per 100K writes
- **Cloud Functions**: €0.40 per miljoen invocations + compute time
- **Storage**: €0.026 per GB/maand
- **Eerste maand**: Vaak gratis credits (~$300)

### Activatie
```bash
# Firebase console openen
firebase console

# Ga naar: Project Settings → Usage and billing → Modify plan
# Selecteer: Blaze (pay as you go)
```

**Let op**: Stel spending limits in om onverwachte kosten te voorkomen!
- Ga naar: Google Cloud Console → Billing → Budgets & alerts
- Stel budget alert in (bijv. €50/maand)

---

## 💳 **2. Stripe Account & API Keys**

### Wat je nodig hebt
1. **Stripe Account**: https://dashboard.stripe.com/register
2. **Test Mode Keys** (huidige .env gebruikt deze al)
3. **Live Mode Keys** (voor productie)

### Live Keys ophalen
```
Stripe Dashboard → Developers → API Keys → Reveal live key

Kopieer:
- Publishable key: pk_live_...
- Secret key: sk_live_...
```

### Webhook Setup
```bash
# 1. Stripe CLI installeren
# Download van: https://stripe.com/docs/stripe-cli

# 2. Login
stripe login

# 3. Webhook endpoint registreren
# Endpoint: https://your-domain.com/api/stripe-webhook
# Of via Firebase Functions: https://us-central1-gratis-ngo-7bb44.cloudfunctions.net/stripeWebhook

# Events om te luisteren:
- checkout.session.completed
- payment_intent.succeeded
- payment_intent.payment_failed
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_succeeded
- invoice.payment_failed
```

### .env Update (Productie)
```env
# Stripe Live Keys
VITE_STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...  # Alleen in Firebase Functions config!
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Products & Prices aanmaken in Stripe
Je moet je producten handmatig aanmaken in Stripe Dashboard:

```
Dashboard → Products → Add product

Voorbeelden:
1. Water Bottle Donation
   - Price: €2.50 (one-time)
   - Product ID opslaan in Firestore

2. TRIBE Membership
   - Price: €5/month (recurring)
   - Product ID opslaan in Firestore

3. Event Tickets
   - Price: variabel per event
```

### Script om Stripe producten te synchroniseren
```bash
# Run script om Stripe products naar Firestore te syncen
npm run sync-stripe-products
```

---

## 🎥 **3. Mux Account & Video Platform**

### Waarom nodig?
Voor het Video Platform (Section 58) - live streaming en video hosting

### Setup
1. **Mux Account**: https://dashboard.mux.com/signup
2. **API Keys ophalen**:
   ```
   Mux Dashboard → Settings → Access Tokens

   Create new token met permissions:
   - Mux Video (read/write)
   - Mux Data (read)
   ```

3. **.env Update**:
   ```env
   MUX_TOKEN_ID=your_token_id
   MUX_TOKEN_SECRET=your_token_secret
   ```

4. **Webhooks configureren**:
   ```
   Endpoint: https://us-central1-gratis-ngo-7bb44.cloudfunctions.net/muxWebhook

   Events:
   - video.asset.ready
   - video.asset.errored
   - video.live_stream.active
   - video.live_stream.idle
   ```

### Kosten Mux
- **Video Encoding**: $0.005 per minuut
- **Video Delivery**: $0.01 per GB
- **Live Streaming**: $0.015 per minuut

---

## 📧 **4. Email Service (SendGrid of Mailgun)**

### Optie A: SendGrid (Aanbevolen)
```bash
# 1. Account aanmaken: https://signup.sendgrid.com/

# 2. API Key ophalen
SendGrid Dashboard → Settings → API Keys → Create API Key

# 3. Sender Identity verifiëren
Settings → Sender Authentication → Verify email

# 4. .env Update
EMAIL_API_KEY=SG.xxxxx
EMAIL_FROM=noreply@gratis.ngo
```

**Gratis tier**: 100 emails/dag (voldoende voor testen)

### Optie B: Mailgun
```env
MAILGUN_API_KEY=your_mailgun_key
MAILGUN_DOMAIN=mg.gratis.ngo
```

### Email Templates in Firebase Functions
```typescript
// firebase-functions/src/email-service.ts
// Gebruikt al SendGrid/Mailgun voor:
- Donation receipts
- Event tickets
- Password resets
- Weekly impact reports
- Subscription confirmations
```

---

## ☁️ **5. Firebase Functions Deployen**

### Huidige status
Je hebt al Firebase Functions code in `firebase-functions/`:
- ✅ `stripe-functions.ts` - Stripe integratie
- ✅ `stripe-webhooks.ts` - Webhook handlers
- ✅ `mux-functions.ts` - Video platform
- ✅ `email-service.ts` - Email verzending
- ✅ `notification-service.ts` - Push notifications

### Deploy Commands
```bash
# 1. Functions dependencies installeren
cd firebase-functions
npm install

# 2. Environment variables instellen
firebase functions:config:set \
  stripe.secret_key="sk_live_..." \
  stripe.webhook_secret="whsec_..." \
  mux.token_id="your_token_id" \
  mux.token_secret="your_token_secret" \
  sendgrid.api_key="SG.xxxxx" \
  sendgrid.from_email="noreply@gratis.ngo"

# 3. Build TypeScript
npm run build

# 4. Deploy
cd ..
firebase deploy --only functions

# Alternatief: deploy specifieke functions
firebase deploy --only functions:stripeWebhook
firebase deploy --only functions:createPaymentIntent
firebase deploy --only functions:muxWebhook
```

### Functions die gedeployed moeten worden
```
✅ stripeWebhook - Stripe payments
✅ createPaymentIntent - Payment processing
✅ createCheckoutSession - Stripe Checkout
✅ cancelSubscription - Subscription management
✅ muxWebhook - Video processing
✅ sendDonationReceipt - Email receipt
✅ sendEventTicket - Event confirmation
✅ generateTaxReceipt - Tax documentation
✅ processDataExport - Data exports (Section 61)
```

---

## 📦 **6. Firebase Storage Configureren**

### Storage Rules updaten
```bash
# Deploy storage rules
firebase deploy --only storage
```

Huidige `storage.rules`:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Donation receipts (private)
    match /receipts/{userId}/{receiptId} {
      allow read: if request.auth.uid == userId;
      allow write: if false; // Only Cloud Functions
    }

    // Tax receipts (private)
    match /tax-receipts/{userId}/{year}/{receiptId} {
      allow read: if request.auth.uid == userId;
      allow write: if false;
    }

    // Data exports (admin only)
    match /exports/{exportId} {
      allow read: if request.auth.token.role == 'admin';
      allow write: if false;
    }

    // User uploads (profile pictures, etc)
    match /user-uploads/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024; // 5MB max
    }

    // Video thumbnails (public)
    match /video-thumbnails/{videoId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

### Storage Buckets aanmaken
```bash
# Firebase console → Storage → Get started
# Default bucket wordt automatisch aangemaakt

# Extra buckets voor verschillende regio's (optioneel)
gsutil mb -c standard -l europe-west1 gs://gratis-ngo-eu-media
```

---

## 🗄️ **7. Database Seeden met Echte Data**

### Huidige Mock Data verwijderen
```bash
# Products collection
firebase firestore:delete --collection=products --batch-size=100

# Events collection
firebase firestore:delete --collection=events --batch-size=100

# Blog posts
firebase firestore:delete --collection=blog_posts --batch-size=100
```

### Seeds Scripts runnen
```bash
# 1. Products toevoegen
npm run seed:products

# 2. Events toevoegen
npm run seed:events

# 3. NGO Partners toevoegen
npm run seed:partners

# 4. Blog posts
npm run seed:blog

# Of alles in één keer
npm run seed:all
```

### Manual Data Entry via Admin Panel
Na deployment kan je via het Admin Panel data toevoegen:
- `/admin/products` - Producten
- `/admin/events` - Events
- `/admin/partners` - NGO Partners
- `/admin/blog` - Blog posts

---

## 🔐 **8. Environment Variables**

### Development (.env - LOCAL)
```env
# Firebase (al geconfigureerd)
VITE_FIREBASE_API_KEY=AIzaSyCiCkqrHcBJZVcy6RXsBKeb-NZXnKsAD6s
VITE_FIREBASE_AUTH_DOMAIN=gratis-ngo-7bb44.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=gratis-ngo-7bb44
VITE_FIREBASE_STORAGE_BUCKET=gratis-ngo-7bb44.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=659832345710
VITE_FIREBASE_APP_ID=1:659832345710:web:8048362b3636c465f4c27f
VITE_FIREBASE_MEASUREMENT_ID=G-LF6HJ0RP8D

# Stripe (TEST mode)
VITE_STRIPE_PUBLIC_KEY=pk_test_...

# Analytics (optioneel)
VITE_GA_MEASUREMENT_ID=G-...
```

### Production (Vercel/Netlify Environment Variables)
```env
# Firebase (same as dev)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
# ... rest of Firebase config

# Stripe LIVE
VITE_STRIPE_PUBLIC_KEY=pk_live_...

# Build settings
NODE_VERSION=18
```

### Firebase Functions Config (SECRET - niet in .env!)
```bash
# Set via Firebase CLI
firebase functions:config:set \
  stripe.secret_key="sk_live_..." \
  stripe.webhook_secret="whsec_..." \
  mux.token_id="..." \
  mux.token_secret="..." \
  sendgrid.api_key="SG...." \
  sendgrid.from_email="noreply@gratis.ngo"

# View current config
firebase functions:config:get
```

---

## 🧪 **9. Testing Checklist**

### Payment Flow (Stripe)
- [ ] Create donation → Checkout → Success
- [ ] Failed payment handling
- [ ] Receipt email verzonden
- [ ] Transaction in Firestore opgeslagen
- [ ] Webhook events processed

### Video Platform (Mux)
- [ ] Video upload
- [ ] Video processing
- [ ] Thumbnail generation
- [ ] Live stream creation
- [ ] Live stream playback

### Email System
- [ ] Donation receipt
- [ ] Event ticket
- [ ] Password reset
- [ ] Weekly impact report
- [ ] Subscription confirmation

### Admin Features
- [ ] User management
- [ ] Product CRUD
- [ ] Event CRUD
- [ ] Analytics dashboard
- [ ] Data export (Section 61)
- [ ] Audit logs (Section 62)

### Part 14 Enterprise Features
- [ ] SEO Manager - Page audits
- [ ] Feature Flags - Toggle features
- [ ] Data Export - CSV/Excel/PDF exports
- [ ] MFA Setup - 2FA authentication
- [ ] Moderation Queue - Content moderation

---

## 💰 **Kosten Schatting (Maandelijks)**

### Small Scale (< 1000 users)
- **Firebase**: €5-20/maand
- **Stripe**: €0 (percentage per transactie: 1.4% + €0.25)
- **Mux**: €10-30/maand (afhankelijk van video usage)
- **SendGrid**: Gratis (100 emails/dag)
- **Hosting**: €0 (Vercel/Netlify gratis tier)

**Totaal**: ~€15-50/maand

### Medium Scale (1000-10000 users)
- **Firebase**: €50-200/maand
- **Stripe**: Percentage based
- **Mux**: €100-500/maand
- **SendGrid**: €15-80/maand (40K-100K emails)
- **Hosting**: €0-20/maand

**Totaal**: ~€200-800/maand

---

## 🚀 **Deployment Steps (Production Ready)**

### 1. Backend Setup (Firebase)
```bash
# 1. Upgrade Firebase plan
firebase console → Blaze plan

# 2. Deploy security rules
firebase deploy --only firestore:rules
firebase deploy --only storage:rules

# 3. Deploy functions
cd firebase-functions
npm run build
cd ..
firebase deploy --only functions

# 4. Setup indexes
firebase deploy --only firestore:indexes
```

### 2. External Services
```bash
# 1. Stripe
- Create products in Stripe Dashboard
- Setup webhooks
- Configure live API keys

# 2. Mux (if using video)
- Create access token
- Setup webhooks
- Test upload

# 3. SendGrid
- Verify domain (optional)
- Create API key
- Configure sender identity
```

### 3. Frontend Deployment (Vercel recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
# Project Settings → Environment Variables
```

### 4. Database Seeding
```bash
# Run seed scripts
npm run seed:all

# Or manually via Admin Panel
# /admin/products
# /admin/events
# /admin/partners
```

### 5. Testing & QA
- Test alle payment flows
- Test email verzending
- Test file uploads
- Test admin features
- Test Part 14 features (SEO, exports, MFA)

---

## 🆘 **Troubleshooting**

### Firebase Functions falen
```bash
# Check logs
firebase functions:log

# Common issues:
- Missing environment variables → firebase functions:config:set
- CORS errors → Check cors settings in functions
- Timeout → Increase timeout in firebase.json
```

### Stripe Webhooks niet ontvangen
```bash
# Test locally
stripe listen --forward-to http://localhost:5001/gratis-ngo-7bb44/us-central1/stripeWebhook

# Check webhook logs in Stripe Dashboard
Dashboard → Developers → Webhooks → View logs
```

### Email niet verzonden
```bash
# Check SendGrid activity
Dashboard → Activity

# Common issues:
- Sender not verified
- API key invalid
- Daily limit reached (free tier: 100/day)
```

### Storage upload falen
```bash
# Check storage rules
firebase deploy --only storage:rules

# Check bucket CORS
gsutil cors set cors.json gs://gratis-ngo-7bb44.appspot.com
```

---

## 📞 **Support & Resources**

- **Firebase Docs**: https://firebase.google.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **Mux Docs**: https://docs.mux.com
- **SendGrid Docs**: https://docs.sendgrid.com

- **Firebase Support**: https://firebase.google.com/support
- **Stripe Support**: https://support.stripe.com

---

## ✅ **Final Checklist**

- [ ] Firebase Blaze plan actief
- [ ] Spending limits ingesteld
- [ ] Stripe live keys geconfigureerd
- [ ] Stripe products aangemaakt
- [ ] Stripe webhooks werkend
- [ ] Mux account actief (indien video needed)
- [ ] SendGrid/Email service werkend
- [ ] Firebase Functions deployed
- [ ] Firestore security rules deployed
- [ ] Storage rules deployed
- [ ] Database geseeded
- [ ] Environment variables ingesteld
- [ ] Frontend deployed (Vercel/Netlify)
- [ ] Domain geconfigureerd
- [ ] SSL certificaat actief
- [ ] Alle tests passed
- [ ] Monitoring ingesteld (Firebase Performance, Analytics)

---

**Status Update**:
- ✅ Frontend: 100% compleet (inclusief Part 14 Enterprise features)
- ✅ Firebase Functions: Code compleet, deployment pending
- ⚠️ External Services: Accounts needed (Stripe Live, Mux, SendGrid)
- ⚠️ Database: Mock data, needs seeding with real data

**Eerstvolgende stap**: Firebase Blaze plan activeren en Firebase Functions deployen.
