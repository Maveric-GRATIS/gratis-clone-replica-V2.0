# GRATIS Foundation - Project Requirements Checklist

## 📦 Dependencies Te Installeren

### Core Dependencies (Check if installed)
```bash
bun add @stripe/stripe-js @stripe/react-stripe-js
bun add react-hook-form @hookform/resolvers zod
bun add recharts
bun add date-fns
bun add jspdf
bun add qrcode
```

### UI Components (shadcn/ui - Check welke ontbreken)
```bash
npx shadcn-ui@latest add slider
npx shadcn-ui@latest add select
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add progress
```

---

## 🔑 API Keys & Environment Variables Nodig

### `.env` bestand aanmaken:
```env
# Stripe (Payment Processing)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx

# Social Media APIs (Feature 15)
TWITTER_BEARER_TOKEN=your_twitter_api_bearer_token
INSTAGRAM_ACCESS_TOKEN=your_instagram_graph_api_token
FACEBOOK_ACCESS_TOKEN=your_facebook_graph_api_token
YOUTUBE_API_KEY=your_youtube_data_api_key

# Firebase (Already have?)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id

# Email Service (Part 4 - Already configured?)
RESEND_API_KEY=re_xxxxx

# Optional
SENTRY_DSN=your_sentry_dsn (for error tracking)
```

### Hoe te verkrijgen:

**Stripe:**
- ✅ Gratis account: https://dashboard.stripe.com/register
- ✅ Test keys meteen beschikbaar
- ❌ Live keys na verificatie

**Twitter API:**
- ✅ Gratis tier: https://developer.twitter.com/
- ⚠️ Basic tier: $100/maand (recommended voor production)
- 📝 Duurt 1-2 dagen approval

**Instagram/Facebook API:**
- ✅ Gratis via Facebook Developer: https://developers.facebook.com/
- 📝 Vereist Facebook Business Page
- 📝 Instagram moet gekoppeld zijn aan Facebook Page

**YouTube API:**
- ✅ Gratis tier (10,000 units/dag): https://console.cloud.google.com/
- 📝 Meteen beschikbaar

---

## 🔥 Firebase Setup Nodig

### Firestore Collections Te Maken:

#### 1. `tribe_members`
```javascript
// Firestore Console → Create Collection
{
  id: string,
  userId: string,
  tier: "monthly" | "quarterly" | "annual",
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  address: {
    street: string,
    city: string,
    postalCode: string,
    country: string
  },
  preferences: {
    interests: array,
    newsletter: boolean,
    impactUpdates: boolean,
    volunteerOpportunities: boolean
  },
  memberSince: timestamp,
  subscriptionId: string,
  bottlesClaimedTotal: number,
  bottlesAvailable: number,
  nextBottleDate: timestamp,
  impactScore: number,
  votingCredits: number,
  referrals: number,
  referralCode: string,
  status: "active" | "paused" | "cancelled",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 2. `donations`
```javascript
{
  id: string,
  userId: string (nullable),
  amount: number,
  frequency: "once" | "monthly" | "quarterly" | "annually",
  allocation: {
    cleanWater: number,
    education: number,
    healthcare: number,
    environment: number
  },
  donorInfo: {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    company: string,
    anonymous: boolean
  },
  stripePaymentId: string,
  stripeSubscriptionId: string (nullable),
  status: "completed" | "pending" | "failed" | "cancelled",
  receiptSent: boolean,
  createdAt: timestamp
}
```

#### 3. `recurring_donations`
```javascript
{
  id: string,
  userId: string,
  amount: number,
  frequency: "monthly" | "quarterly" | "annually",
  stripeSubscriptionId: string,
  allocation: { ... },
  status: "active" | "paused" | "cancelled",
  totalDonated: number,
  donationCount: number,
  nextCharge: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 4. `voting_periods`
```javascript
{
  id: string,
  quarter: string,
  startDate: timestamp,
  endDate: timestamp,
  status: "active" | "upcoming" | "completed",
  totalVotes: number,
  participation: number
}
```

#### 5. `voting_initiatives`
```javascript
{
  id: string,
  periodId: string,
  title: string,
  description: string,
  category: "environment" | "education" | "health" | "social",
  budget: number,
  timeline: string,
  beneficiaries: number,
  totalVotes: number,
  details: {
    goals: array,
    impact: string,
    partners: array
  },
  status: "active" | "completed"
}
```

#### 6. `member_votes`
```javascript
{
  id: string,
  memberId: string,
  periodId: string,
  initiativeId: string,
  votes: number,
  votedAt: timestamp
}
```

#### 7. `bottle_claims`
```javascript
{
  id: string,
  memberId: string,
  claimedAt: timestamp,
  location: string,
  qrCode: string,
  status: "pending" | "claimed" | "expired"
}
```

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Tribe Members - alleen eigen data
    match /tribe_members/{memberId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }

    // Donations - alleen eigen data
    match /donations/{donationId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if true; // Anonymous donations allowed
    }

    // Voting - members only read, admin write
    match /voting_initiatives/{initiativeId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.admin == true;
    }

    // Member votes - alleen eigen votes
    match /member_votes/{voteId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow write: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### Firestore Indexes Nodig
```javascript
// Console → Firestore → Indexes → Create
1. Collection: tribe_members
   - userId (ASC) + status (ASC)
   - tier (ASC) + status (ASC)

2. Collection: donations
   - userId (ASC) + createdAt (DESC)
   - status (ASC) + createdAt (DESC)

3. Collection: voting_initiatives
   - periodId (ASC) + totalVotes (DESC)
   - category (ASC) + totalVotes (DESC)

4. Collection: member_votes
   - memberId (ASC) + periodId (ASC)
   - initiativeId (ASC) + votes (DESC)
```

---

## 🖥️ Backend Endpoints Te Bouwen

### Firebase Functions Te Deployen:

#### 1. `/api/tribe/subscribe` (POST)
**Purpose:** Create TRIBE membership subscription
**Input:**
```typescript
{
  paymentMethodId: string,
  tier: "monthly" | "quarterly" | "annual",
  personalInfo: { firstName, lastName, email, ... },
  preferences: { interests, newsletter, ... }
}
```
**Output:**
```typescript
{
  success: boolean,
  subscriptionId?: string,
  memberId?: string,
  error?: string
}
```
**Wat doen:**
- Create Stripe subscription
- Create Firestore tribe_members document
- Generate unique member ID
- Generate referral code
- Send welcome email
- Return subscription details

#### 2. `/api/donations/process` (POST)
**Purpose:** Process one-time or recurring donation
**Input:**
```typescript
{
  paymentMethodId: string,
  amount: number,
  frequency: "once" | "monthly" | "quarterly" | "annually",
  allocation: { cleanWater, education, healthcare, environment },
  donorInfo: { firstName, lastName, email, anonymous, ... }
}
```
**Output:**
```typescript
{
  success: boolean,
  donationId?: string,
  error?: string
}
```
**Wat doen:**
- Create Stripe PaymentIntent (one-time) OR Subscription (recurring)
- Create Firestore donation document
- If recurring: create recurring_donations document
- Send confirmation email
- Send PDF receipt (if requested)
- Subscribe to newsletter (if opted in)

#### 3. `/api/social/feed` (GET) - ALREADY CREATED
**Purpose:** Aggregate social media posts
**Query params:** `?platform=all&limit=12`
**Output:** Array of social posts

#### 4. `/api/stripe/webhooks` (POST)
**Purpose:** Handle Stripe webhook events
**Events te handlen:**
- `payment_intent.succeeded` - One-time donation succeeded
- `invoice.paid` - Recurring donation paid
- `invoice.payment_failed` - Payment failed
- `customer.subscription.updated` - Subscription changed
- `customer.subscription.deleted` - Subscription cancelled
**Wat doen:**
- Update Firestore donation/subscription status
- Send confirmation emails
- Update member stats (bottles available, etc.)
- Handle failed payments

#### 5. `/api/tribe/bottles/claim` (POST)
**Purpose:** Claim bottle with QR code
**Input:**
```typescript
{
  memberId: string,
  qrCode: string,
  location: string
}
```
**Output:**
```typescript
{
  success: boolean,
  bottleId?: string,
  error?: string
}
```
**Wat doen:**
- Verify QR code
- Check bottles available
- Create bottle_claims document
- Decrement bottlesAvailable
- Increment bottlesClaimedTotal
- Update impactScore
- Send notification

#### 6. `/api/tribe/votes/cast` (POST)
**Purpose:** Cast vote for initiative
**Input:**
```typescript
{
  memberId: string,
  initiativeId: string,
  votes: number
}
```
**Output:**
```typescript
{
  success: boolean,
  error?: string
}
```
**Wat doen:**
- Check voting credits available
- Create/update member_votes document
- Update initiative totalVotes
- Decrement member votingCredits

---

## 🎨 Stripe Product Setup

### Stripe Dashboard Setup:
1. **Go to:** https://dashboard.stripe.com/test/products
2. **Create Products:**

#### Product 1: TRIBE Monthly Membership
- Name: `TRIBE Monthly Membership`
- Description: `1 premium bottle per month + quarterly voting rights`
- Price: `€15.00 / month`
- Billing: `Recurring - Monthly`
- Copy Price ID: `price_xxxxx`

#### Product 2: TRIBE Quarterly Membership
- Name: `TRIBE Quarterly Membership`
- Description: `3 premium bottles per quarter + benefits`
- Price: `€40.00 / 3 months`
- Billing: `Recurring - Every 3 months`
- Copy Price ID: `price_xxxxx`

#### Product 3: TRIBE Annual Membership
- Name: `TRIBE Annual Membership`
- Description: `12 premium bottles per year + VIP benefits`
- Price: `€150.00 / year`
- Billing: `Recurring - Yearly`
- Copy Price ID: `price_xxxxx`

### Add to `.env`:
```env
VITE_STRIPE_TRIBE_MONTHLY_PRICE_ID=price_xxxxx
VITE_STRIPE_TRIBE_QUARTERLY_PRICE_ID=price_xxxxx
VITE_STRIPE_TRIBE_ANNUAL_PRICE_ID=price_xxxxx
```

---

## 📧 Email Service Setup (Resend)

### Als je Part 4 email service al hebt:
- ✅ Email templates al gemaakt
- ✅ Functions al deployed
- ❌ Test emails versturen
- ❌ Verify domain (voor production)

### Nog te maken email templates:
1. **TRIBE Welcome Email** - na signup
2. **Donation Confirmation** - na donatie
3. **Recurring Donation Receipt** - elke maand/kwartaal/jaar
4. **Bottle Available Notification** - wanneer nieuwe bottle ready
5. **Voting Open Notification** - start nieuwe voting period
6. **Vote Confirmation** - na casten vote
7. **Subscription Paused** - recurring donation paused
8. **Subscription Cancelled** - recurring donation cancelled

---

## 🧪 Test Data Te Vullen

### Firestore Test Data:

#### Voting Period (ACTIVE)
```javascript
// voting_periods collection
{
  id: "q1-2026",
  quarter: "Q1 2026",
  startDate: new Date("2026-01-01"),
  endDate: new Date("2026-03-31"),
  status: "active",
  totalVotes: 0,
  participation: 0
}
```

#### 4 Test Initiatives
```javascript
// voting_initiatives collection
[
  {
    id: "init-2026-q1-1",
    periodId: "q1-2026",
    title: "Solar Panel Installation Program",
    description: "Install 100 solar panels in rural communities",
    category: "environment",
    budget: 50000,
    timeline: "6 months",
    beneficiaries: 500,
    totalVotes: 0,
    details: {
      goals: ["Install 100 panels", "Train 50 technicians", "Reduce emissions by 200 tons"],
      impact: "Bring clean energy to remote areas",
      partners: ["SolarAid", "Local Energy Coop"]
    },
    status: "active"
  },
  // ... 3 more initiatives
]
```

---

## 🚀 Deployment Checklist

### Voor je live gaat:

#### Environment:
- [ ] Wissel Stripe test keys naar live keys
- [ ] Wissel alle API test keys naar production keys
- [ ] Set up custom domain
- [ ] Configure CORS voor API endpoints
- [ ] Set up SSL certificate

#### Firebase:
- [ ] Deploy Firestore security rules
- [ ] Create Firestore indexes
- [ ] Deploy Firebase Functions
- [ ] Test email sending
- [ ] Set up Firebase Hosting (optional)

#### Stripe:
- [ ] Activate account (provide business details)
- [ ] Add bank account voor payouts
- [ ] Set up webhook endpoint in production
- [ ] Test payments met live keys
- [ ] Set up automated emails in Stripe

#### Testing:
- [ ] Test complete TRIBE signup flow
- [ ] Test donation flow (one-time + recurring)
- [ ] Test bottle claiming met QR code
- [ ] Test voting system
- [ ] Test recurring donation management
- [ ] Test PDF receipt generation
- [ ] Test email notifications
- [ ] Test payment failure handling

---

## ⚠️ Belangrijke Warnings

### Security:
- ❌ **NOOIT** commit API keys naar Git
- ❌ **NOOIT** gebruik live Stripe keys in development
- ✅ Gebruik `.env` file voor alle secrets
- ✅ Add `.env` to `.gitignore`

### Testing:
- ✅ Gebruik Stripe test cards: `4242 4242 4242 4242`
- ✅ Test failed payments: `4000 0000 0000 0002`
- ✅ Test 3D Secure: `4000 0025 0000 3155`
- ❌ Niet testen met echte kaarten in test mode

### API Rate Limits:
- Twitter Basic: 500k tweets/maand
- Instagram: 200 requests/uur
- Facebook: 200 requests/uur
- YouTube: 10,000 units/dag

---

## 📝 Volgende Stappen

### Priority 1 (CRITICAL - Zonder werkt niks):
1. ✅ Install missing dependencies (`bun add ...`)
2. ✅ Create `.env` file met Stripe test keys
3. ✅ Create Firestore collections
4. ✅ Deploy Firestore security rules
5. ✅ Create Stripe products (3 TRIBE tiers)

### Priority 2 (HIGH - Core functionality):
6. ✅ Build `/api/tribe/subscribe` endpoint
7. ✅ Build `/api/donations/process` endpoint
8. ✅ Setup Stripe webhook handler
9. ✅ Test TRIBE signup flow
10. ✅ Test donation flow

### Priority 3 (MEDIUM - Enhanced features):
11. ✅ Get social media API keys
12. ✅ Test social feed integration
13. ✅ Create test voting data
14. ✅ Test voting system
15. ✅ Test bottle claiming

### Priority 4 (LOW - Nice to have):
16. ✅ Setup email templates
17. ✅ Test email notifications
18. ✅ Add error monitoring (Sentry)
19. ✅ Performance optimization
20. ✅ Final testing before production

---

## 🆘 Als je hulp nodig hebt:

### Stripe Issues:
- Docs: https://stripe.com/docs
- Test cards: https://stripe.com/docs/testing
- Community: https://stackoverflow.com/questions/tagged/stripe-payments

### Firebase Issues:
- Docs: https://firebase.google.com/docs
- Console: https://console.firebase.google.com/
- Support: https://firebase.google.com/support

### Social Media APIs:
- Twitter: https://developer.twitter.com/en/docs
- Instagram: https://developers.facebook.com/docs/instagram-api
- Facebook: https://developers.facebook.com/docs/graph-api
- YouTube: https://developers.google.com/youtube/v3

---

## ✅ Quick Start Commands

```bash
# 1. Install alle dependencies
bun add @stripe/stripe-js @stripe/react-stripe-js react-hook-form @hookform/resolvers zod recharts date-fns jspdf qrcode

# 2. Install shadcn components
npx shadcn-ui@latest add slider select avatar tabs dialog progress

# 3. Create .env file
cp .env.example .env
# Edit .env met je API keys

# 4. Start development server
bun run dev

# 5. In another terminal - start Firebase emulators (optional for testing)
firebase emulators:start

# 6. Open browser
# http://localhost:5173
```

---

## 📊 Project Status

### ✅ COMPLEET (Frontend):
- ✅ Part 4: Admin Panel + Email/Notification System
- ✅ Feature 15: Social Media Integration (components)
- ✅ Feature 16: TRIBE Membership System (complete flow)
- ✅ Feature 17: Advanced Donation System (complete flow)

### ⚠️ NEEDS BACKEND:
- ❌ Stripe subscription creation endpoints
- ❌ Donation processing endpoints
- ❌ Webhook handlers
- ❌ Social media API integration
- ❌ Email sending via Resend

### ⚠️ NEEDS CONFIGURATION:
- ❌ Environment variables
- ❌ Firestore collections + indexes
- ❌ Firestore security rules
- ❌ Stripe products setup
- ❌ API keys voor social media

**Estimate tijd om alles werkend te krijgen: 2-3 dagen (met API keys aanvragen)**
