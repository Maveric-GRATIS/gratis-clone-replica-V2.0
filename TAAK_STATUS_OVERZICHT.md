# GRATIS.NGO - Taak Status Overzicht & Stappenplan
**Datum analyse:** 30 januari 2026

## 📊 SAMENVATTING

| Status | Aantal | Percentage |
|--------|--------|------------|
| ✅ Compleet | 13 | 57% |
| 🟡 Gedeeltelijk | 5 | 22% |
| ❌ Nog te maken | 5 | 22% |
| **TOTAAL** | **23** | **100%** |

---

## P0 - MVP LAUNCH (MOET HEBBEN)

### ✅ 1. Homepage
**Status:** COMPLEET
**Bestand:** `src/pages/Index.tsx`
**Bevat:**
- Hero sectie met CTA's
- Impact stats bar
- How It Works sectie
- Product showcase
- TRIBE CTA

**Nog te doen:** Niets - volledig functioneel

---

### 🟡 2. GRATIS Water Product Page
**Status:** GEDEELTELIJK
**Bestand:** `src/pages/Water.tsx`
**Bevat:**
- Product hero
- Basic product info
- Image gallery

**Nog te doen:**
- [ ] Claim bottle modal/flow
- [ ] Firebase integratie voor bottle tracking
- [ ] Shipping address form
- [ ] User tier checking logic
- [ ] Detailed tabs (Details, Shipping, Impact)
- [ ] FAQ accordion

**Prioriteit:** HOOG

---

### 🟡 3. TRIBE Overview Page
**Status:** GEDEELTELIJK
**Bestand:** `src/pages/Tribe.tsx`
**Bevat:**
- Tier comparison
- Basic pricing info

**Nog te doen:**
- [ ] Interactive comparison table
- [ ] Detailed tier cards met expand functionality
- [ ] Voting explanation sectie
- [ ] Social proof testimonials
- [ ] Real-time Founder spots counter
- [ ] FAQ accordion

**Prioriteit:** HOOG

---

### ❌ 4. TRIBE Signup Flow
**Status:** NOG TE MAKEN
**Bestand:** Bestaat niet
**Locatie:** `src/pages/tribe/Signup.tsx` (nieuw)

**Te maken:**
- [ ] Multi-step signup wizard
  - Step 1: Tier selection
  - Step 2: Account creation
  - Step 3: Payment (Stripe)
  - Step 4: Confirmation
- [ ] Stripe payment integratie
- [ ] Firebase user creation
- [ ] Social login (Google, Apple)
- [ ] Form validatie
- [ ] Error handling
- [ ] Redirect logic

**Prioriteit:** KRITIEK

---

### ✅ 5. Login Page
**Status:** COMPLEET
**Bestand:** `src/pages/Auth.tsx`
**Bevat:**
- Email/password login
- Social login knoppen
- Forgot password link
- Firebase integratie

**Nog te doen:** Niets - volledig functioneel

---

### ✅ 6. Member Dashboard
**Status:** COMPLEET
**Bestand:** `src/pages/Dashboard.tsx`
**Bevat:**
- ✅ Basic dashboard layout
- ✅ User profile sectie
- ✅ Quick stats cards (tier, bottles, impact)
- ✅ Claim bottle CTA met logica
- ✅ Activity feed/timeline
- ✅ Impact summary mini-widget
- ✅ Active vote sectie
- ✅ My Bottles subpage (`/dashboard/bottles`)
- ✅ Vote subpage (`/dashboard/vote`)
- ✅ Settings subpage (`/dashboard/settings`)
  - ✅ Profile tab
  - ✅ Membership tab
  - ✅ Notifications tab
  - ✅ Security tab
- ✅ Real-time Firebase listeners

**Nieuwe bestanden gemaakt:**
- `src/components/dashboard/QuickStatsCards.tsx`
- `src/components/dashboard/ClaimBottleCTA.tsx`
- `src/components/dashboard/ClaimBottleModal.tsx`
- `src/components/dashboard/ActivityFeed.tsx`
- `src/components/dashboard/ImpactSummary.tsx`
- `src/pages/dashboard/Bottles.tsx`
- `src/pages/dashboard/Vote.tsx`
- `src/pages/dashboard/Settings.tsx`

**Nog te doen (optioneel voor volledige functionaliteit):**
- [ ] Firebase Cloud Function voor monthly bottle reset
- [ ] Email notifications (via Cloud Functions)
- [ ] Stripe Customer Portal integratie

**Prioriteit:** HOOG → **COMPLEET** ✅

---

### ❌ 7. Impact Dashboard (Public)
**Status:** NOG TE MAKEN
**Bestand:** Bestaat niet
**Locatie:** `src/pages/Impact.tsx` (nieuw)

**Te maken:**
- [ ] Hero met animated counters
- [ ] Allocation breakdown (donut chart)
- [ ] Timeline of milestones
- [ ] NGO partners grid
- [ ] Quarterly reports archive
- [ ] Personal impact sectie (logged-in)
- [ ] Live activity feed
- [ ] Real-time Firestore listeners
- [ ] Recharts donut chart
- [ ] Animated counter component

**Prioriteit:** HOOG

---

### ✅ 8. Privacy Policy
**Status:** COMPLEET
**Bestand:** `src/pages/legal/Privacy.tsx` EN `src/pages/tribe/Privacy.tsx`
**Bevat:**
- Complete legal content
- GDPR compliant
- Table of contents
- Proper formatting

**Nog te doen:** Niets - volledig functioneel

---

### ✅ 9. Terms of Service
**Status:** COMPLEET
**Bestand:** `src/pages/legal/Terms.tsx` EN `src/pages/tribe/Terms.tsx`
**Bevat:**
- Complete legal content
- Proper sectie structuur
- Table of contents

**Nog te doen:** Niets - volledig functioneel

---

## P1 - SHOULD HAVE

### 🟡 10. About/Story Page
**Status:** GEDEELTELIJK
**Bestand:** `src/pages/Gratis.tsx`
**Bevat:**
- Basic brand story
- Mission statement

**Nog te doen:**
- [ ] "The Problem" sectie
- [ ] Visual diagram (how it works)
- [ ] Three pillars detail cards
- [ ] Timeline of story
- [ ] Commitment statements
- [ ] Team teaser met links

**Prioriteit:** MEDIUM

---

### ❌ 11. FAQ Page
**Status:** NOG TE MAKEN
**Bestand:** Bestaat niet
**Locatie:** `src/pages/FAQ.tsx` (nieuw)

**Te maken:**
- [ ] Search functionaliteit
- [ ] Category filters (General, TRIBE, Bottles, Impact, Account)
- [ ] Accordion components voor Q&A
- [ ] Structured data (FAQPage schema)
- [ ] "Still have questions?" CTA
- [ ] Link naar Contact page

**Prioriteit:** MEDIUM

---

### ✅ 12. Contact Page
**Status:** COMPLEET
**Bestand:** `src/pages/Contact.tsx`
**Bevat:**
- Contact form
- Email addresses
- Office info
- Form submission

**Nog te doen:** Niets - volledig functioneel

---

### ✅ 13. NGO Partners Overview
**Status:** COMPLEET
**Bestand:** `src/pages/Partners.tsx`
**Bevat:**
- Partner grid
- Filter functionaliteit
- Partner details

**Nog te doen:** Niets - volledig functioneel

---

### 🟡 14. Donate Page
**Status:** GEDEELTELIJK
**Bestand:** `src/pages/spark/Donate.tsx`
**Bevat:**
- Basic donate form
- Payment info

**Nog te doen:**
- [ ] Stripe one-time donation integratie
- [ ] Custom amount input
- [ ] Tax-deductible info
- [ ] Impact preview calculator
- [ ] Donor recognition options
- [ ] Receipt generation

**Prioriteit:** MEDIUM

---

### 🟡 15. Products Overview
**Status:** GEDEELTELIJK
**Bestand:** `src/pages/HydrationStore.tsx`
**Bevat:**
- Product grid
- Basic filtering

**Nog te doen:**
- [ ] Enhanced product cards
- [ ] Status badges (Live/Pre-order)
- [ ] Better filtering/sorting
- [ ] Category navigation

**Prioriteit:** LOW

---

## P2 - NICE TO HAVE

### ✅ 16. GRATIS Theurgy Product Page
**Status:** COMPLEET
**Bestand:** `src/pages/Theurgy.tsx`
**Bevat:**
- Product showcase
- Pre-order functionality

**Nog te doen:** Niets - volledig functioneel

---

### ✅ 17. GRATIS F.U. Product Page
**Status:** COMPLEET
**Bestand:** `src/pages/FU.tsx`
**Bevat:**
- Product showcase
- Pre-order functionality

**Nog te doen:** Niets - volledig functioneel

---

### ❌ 18. Corporate Giving
**Status:** NOG TE MAKEN
**Bestand:** Bestaat niet
**Locatie:** `src/pages/Corporate.tsx` (nieuw)

**Te maken:**
- [ ] Corporate program uitleg
- [ ] Bulk order options
- [ ] Custom branding info
- [ ] Enterprise contact form
- [ ] Case studies
- [ ] Pricing tiers

**Prioriteit:** LOW

---

### ❌ 19. NGO Application Form
**Status:** NOG TE MAKEN
**Bestand:** Bestaat niet
**Locatie:** `src/pages/NGOApplication.tsx` (nieuw)

**Te maken:**
- [ ] Multi-step application form
- [ ] File upload (verification docs)
- [ ] Criteria checklist
- [ ] Review process info
- [ ] Firebase form submission
- [ ] Email notifications

**Prioriteit:** LOW

---

### ✅ 20. Team Page
**Status:** COMPLEET
**Bestand:** `src/pages/tribe/Team.tsx`
**Bevat:**
- Team member grid
- Role descriptions
- Contact info

**Nog te doen:** Niets - volledig functioneel

---

### ❌ 21. Press/Media Kit
**Status:** NOG TE MAKEN
**Bestand:** Bestaat niet
**Locatie:** `src/pages/Press.tsx` (nieuw)

**Te maken:**
- [ ] Press releases archive
- [ ] Media kit downloads
- [ ] Brand assets
- [ ] Press contact info
- [ ] Embargo notices
- [ ] Photo gallery

**Prioriteit:** LOW

---

### ✅ 22. Careers Page
**Status:** COMPLEET (via Contact)
**Bestand:** Contact form kan gebruikt worden
**Opmerking:** Geen dedicated careers page nodig voor MVP

---

## GLOBAL COMPONENTS

### ✅ 23. Navigation Header
**Status:** COMPLEET
**Bestand:** `src/components/layout/Header.tsx`
**Bevat:**
- Logo
- Navigation menu
- Language switcher
- Auth buttons

---

### ✅ 24. Footer
**Status:** COMPLEET
**Bestand:** `src/components/layout/Footer.tsx`
**Bevat:**
- Links structuur
- Social media
- Legal links
- Newsletter signup

---

### ✅ 25. Auth Context & Protected Routes
**Status:** COMPLEET
**Bestand:** `src/contexts/AuthContext.tsx` + `src/components/ProtectedRoute.tsx`
**Bevat:**
- Firebase Auth integratie
- User state management
- Route protection

---

### ✅ 26. Shared UI Components
**Status:** COMPLEET
**Locatie:** `src/components/ui/`
**Bevat:**
- Button, Card, Input, Modal
- Form components
- Loading states
- Error boundaries

---

# 📋 STAPPENPLAN VOOR IMPLEMENTATIE

## FASE 1: KRITIEKE MVP FUNCTIONALITEIT (Week 1-2)

### Prioriteit 1 - Authentication & Onboarding
**Doel:** Gebruikers kunnen zich aanmelden en betalen

#### Stap 1.1: TRIBE Signup Flow
```bash
# Nieuw bestand maken
src/pages/tribe/Signup.tsx
```

**Taken:**
1. [ ] Multi-step wizard component maken
2. [ ] Tier selection UI (stap 1)
3. [ ] Account creation form (stap 2)
   - Email/password validatie
   - Social login integratie
   - Terms checkbox
4. [ ] Stripe payment integratie (stap 3)
   - API route: `/api/create-checkout`
   - Stripe Elements component
   - iDEAL/SEPA opties
5. [ ] Confirmation screen (stap 4)
6. [ ] Firebase user document aanmaken
7. [ ] Webhook voor payment success: `/api/webhooks/stripe`
8. [ ] Error handling & validatie
9. [ ] URL parameter handling (?tier=)
10. [ ] Redirect naar dashboard na success

**Benodigde dependencies:**
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

**Geschatte tijd:** 2-3 dagen

---

#### Stap 1.2: Member Dashboard Uitbreiden
```bash
# Bestaand bestand uitbreiden
src/pages/Dashboard.tsx

# Nieuwe subpages maken
src/pages/dashboard/Bottles.tsx
src/pages/dashboard/Vote.tsx
src/pages/dashboard/Settings.tsx
```

**Taken:**
1. [ ] Quick stats cards component
   - Tier badge
   - Bottles this month (met progress bar)
   - Total impact
   - Next vote countdown
2. [ ] Claim bottle CTA sectie
   - Beschikbaarheid check
   - Modal trigger
3. [ ] Activity feed component
   - Firestore query (laatste 10 events)
   - Timeline UI
4. [ ] Impact summary mini-widget
5. [ ] Active vote sectie
6. [ ] Routing setup voor subpages
7. [ ] My Bottles page (`/dashboard/bottles`)
   - Order history tabel
   - Status badges
   - Tracking links
8. [ ] Vote page (`/dashboard/vote`)
   - Ballot UI
   - Vote submission
   - Results weergave
9. [ ] Settings page (`/dashboard/settings`)
   - Profile tab (form)
   - Membership tab (upgrade/cancel)
   - Notifications tab (preferences)
   - Security tab (password, 2FA, delete account)
10. [ ] Real-time listeners voor user data

**Cloud Function nodig:**
```typescript
// firebase-functions/src/index.ts
// Monthly bottle reset (1st of each month)
exports.resetMonthlyBottles = functions.pubsub
  .schedule('0 0 1 * *')
  .timeZone('Europe/Amsterdam')
  .onRun(async (context) => {
    // Reset all users' bottlesClaimed to 0
  });
```

**Geschatte tijd:** 3-4 dagen

---

#### Stap 1.3: Claim Bottle Functionaliteit
```bash
# Component maken
src/components/ClaimBottleModal.tsx

# API route
src/api/claim-bottle/route.ts (indien Next.js)
# OF
firebase-functions/src/claimBottle.ts (Cloud Function)
```

**Taken:**
1. [ ] Modal component met multi-step flow
   - Step 1: Address confirmation/edit
   - Step 2: Order confirmation
   - Step 3: Success state
2. [ ] Address form component
   - Autofill van user profile
   - Country dropdown
   - Validation
   - "Save as default" checkbox
3. [ ] Firestore operaties
   - Create order document
   - Increment user.bottlesClaimed
   - Update user.lastOrderDate
4. [ ] Bottle availability check
   - Tier limits
   - Monthly reset logica
5. [ ] Email notification trigger
6. [ ] Success state met order ID
7. [ ] Error handling
8. [ ] Loading states

**Firestore structuur:**
```typescript
// /orders/{orderId}
{
  userId: string,
  productId: 'gratis-water',
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered',
  shippingAddress: {...},
  createdAt: Timestamp,
  trackingCode?: string
}

// /users/{userId}
{
  bottlesClaimed: number,
  bottlesLimit: number, // based on tier
  tribeTier: 'explorer' | 'insider' | 'core' | 'founder',
  lastClaimDate: Timestamp
}
```

**Geschatte tijd:** 2 dagen

---

### Prioriteit 2 - Impact Transparency
**Doel:** Publiek kan impact zien, members kunnen persoonlijke impact tracken

#### Stap 2.1: Impact Dashboard (Public)
```bash
# Nieuw bestand
src/pages/Impact.tsx

# Components
src/components/AnimatedCounter.tsx
src/components/ImpactDonutChart.tsx
src/components/ImpactTimeline.tsx
```

**Taken:**
1. [ ] Page layout opzetten
2. [ ] Hero sectie met animated counters
   - Real-time Firestore listener op impact_stats
   - Animate on scroll into view
   - Number formatting (€, commas)
3. [ ] Donut chart voor allocation breakdown
   - Recharts implementatie
   - 40/30/30 split
   - Interactive legend
4. [ ] Allocation cards
   - Bedragen per categorie
   - Project counts
   - "View Projects" links
5. [ ] Timeline component
   - Milestone entries
   - Vertical layout
   - Date formatting
6. [ ] NGO partners grid
   - Top 6 partners
   - Logo placeholders
   - Amount received
   - "View All" link
7. [ ] Quarterly reports sectie
   - PDF download links
   - Publication dates
8. [ ] Personal impact sectie (logged-in users)
   - Conditional rendering
   - User-specific calculations
   - Certificate download
9. [ ] Live feed (optional)
   - Real-time activity stream
10. [ ] Meta tags & SEO
11. [ ] Loading skeletons

**Dependencies:**
```bash
npm install recharts
npm install @react-spring/web
npm install react-intersection-observer
```

**Firestore structuur:**
```typescript
// /impact_stats (single document)
{
  totalDonated: number,
  bottlesDistributed: number,
  ngosSupported: number,
  tribeMembers: number,
  breakdown: {
    water: number,
    arts: number,
    education: number
  },
  lastUpdated: Timestamp
}
```

**Geschatte tijd:** 2-3 dagen

---

### Prioriteit 3 - Product Detail Verbeteren
**Doel:** Water product page volledig functioneel

#### Stap 3.1: Water Page Uitbreiden
```bash
# Bestaand bestand uitbreiden
src/pages/Water.tsx

# Components
src/components/product/ProductTabs.tsx
src/components/product/ProductFAQ.tsx
```

**Taken:**
1. [ ] Claim bottle CTA verbeteren
   - Auth state checking
   - Tier checking
   - Bottles remaining display
   - Modal integratie
2. [ ] "How It's Free" sectie
   - 3-column layout
   - Icons
3. [ ] Product tabs implementeren
   - Details tab
   - Shipping tab
   - Impact tab
   - Tab state management
4. [ ] FAQ accordion
   - 5 vragen
   - Smooth expand/collapse
   - Single-open behavior
5. [ ] Related products sectie
   - Product cards
   - Pre-order badges
6. [ ] Specs list met icons
7. [ ] Image gallery verbeteren
   - Thumbnail selector
   - Main image state
8. [ ] CTA banner voor niet-members
9. [ ] Meta tags & structured data

**Geschatte tijd:** 1-2 dagen

---

## FASE 2: VERBETEREN & VERFIJNEN (Week 3-4)

### Stap 4: TRIBE Overview Verbeteren
```bash
# Bestaand bestand uitbreiden
src/pages/Tribe.tsx

# Components
src/components/tribe/TierComparisonTable.tsx
src/components/tribe/TierDetailCard.tsx
src/components/tribe/VotingExplainer.tsx
```

**Taken:**
1. [ ] Interactive comparison table
   - Responsive (swipeable op mobile)
   - Hover effects
   - CTA buttons per tier
2. [ ] Expandable tier detail cards
   - Full feature lists
   - Pricing details
   - Limitations
   - CTA buttons
3. [ ] Voting explanation sectie
   - Visual flow diagram
   - Example ballot
4. [ ] Social proof testimonials
   - 3 testimonial cards
   - Avatar placeholders
5. [ ] Founder spots counter
   - Real-time Firestore query
   - Countdown display
6. [ ] FAQ accordion
7. [ ] Smooth scroll to sections
8. [ ] URL parameter handling

**Geschatte tijd:** 2 dagen

---

### Stap 5: FAQ Page Maken
```bash
# Nieuw bestand
src/pages/FAQ.tsx

# Components
src/components/FAQAccordion.tsx
src/components/FAQSearch.tsx
```

**Taken:**
1. [ ] Page layout
2. [ ] Search functionaliteit
   - Input component
   - Filter logica
   - Highlight matches
3. [ ] Category filters
   - Tab/button UI
   - Filter state
4. [ ] FAQ data structuur
   - JSON of TypeScript object
   - Categorized
5. [ ] Accordion component
   - Smooth animations
   - URL anchor support
   - Single/multi-open options
6. [ ] Structured data (FAQPage schema)
7. [ ] "Still have questions?" CTA
8. [ ] Link naar Contact page
9. [ ] Meta tags

**FAQ data structuur:**
```typescript
// src/data/faqData.ts
type FAQ = {
  id: string;
  category: 'general' | 'tribe' | 'bottles' | 'impact' | 'account';
  question: string;
  answer: string;
};

export const faqs: FAQ[] = [
  // ... 20-30 items
];
```

**Geschatte tijd:** 1 dag

---

### Stap 6: About/Story Page Voltooien
```bash
# Bestaand bestand uitbreiden
src/pages/Gratis.tsx

# Components
src/components/about/ProblemSolution.tsx
src/components/about/StoryTimeline.tsx
```

**Taken:**
1. [ ] "The Problem" sectie
   - Two-column layout
   - Problem/Solution contrast
2. [ ] Visual diagram
   - How it works flow
   - Icons & arrows
3. [ ] Three pillars detail cards
   - Expand beyond homepage version
   - More context
4. [ ] Story timeline
   - 2025 → 2026 milestones
   - Visual timeline component
5. [ ] Commitment statements
   - Transparency
   - Verification
   - Community
6. [ ] Team teaser
   - 4 team members
   - Photos (placeholders)
   - Link to Team page
7. [ ] CTA banner

**Geschatte tijd:** 1-2 dagen

---

### Stap 7: Donate Page Verbeteren
```bash
# Bestaand bestand uitbreiden
src/pages/spark/Donate.tsx

# API route
src/api/create-donation-session/route.ts
```

**Taken:**
1. [ ] Stripe one-time payment integratie
   - Checkout Session API
   - Success/cancel URLs
2. [ ] Preset amounts + custom input
   - Button grid
   - Custom amount validation
3. [ ] Impact calculator
   - Show "Your €X will..."
   - Real-time preview
4. [ ] Donor recognition options
   - Anonymous checkbox
   - Public name option
5. [ ] Tax-deductible info
   - NL: ANBI status
   - US: 501(c)(3) pending
6. [ ] Receipt generation
   - Firebase Function trigger
   - Email with PDF
7. [ ] Thank you page redirect
8. [ ] Firestore donation record
9. [ ] Update impact_stats

**Geschatte tijd:** 2 dagen

---

## FASE 3: NICE TO HAVE (Week 5+)

### Stap 8: Corporate Giving Page
```bash
# Nieuw bestand
src/pages/Corporate.tsx
```

**Taken:**
1. [ ] Corporate program uitleg
2. [ ] Benefits sectie
3. [ ] Bulk order info
4. [ ] Custom branding options
5. [ ] Pricing tiers
6. [ ] Contact form
7. [ ] Case studies placeholders

**Geschatte tijd:** 1 dag

---

### Stap 9: NGO Application Form
```bash
# Nieuw bestand
src/pages/NGOApplication.tsx

# Components
src/components/ngo/ApplicationForm.tsx
```

**Taken:**
1. [ ] Multi-step form
2. [ ] File upload (Firebase Storage)
3. [ ] Criteria checklist
4. [ ] Review process info
5. [ ] Form submission (Firestore)
6. [ ] Email notification (Firebase Function)
7. [ ] Thank you page

**Geschatte tijd:** 1-2 dagen

---

### Stap 10: Press/Media Kit
```bash
# Nieuw bestand
src/pages/Press.tsx
```

**Taken:**
1. [ ] Press releases archive
2. [ ] Media kit downloads
3. [ ] Brand assets grid
4. [ ] Press contact info
5. [ ] Embargo notices
6. [ ] Photo gallery

**Geschatte tijd:** 1 dag

---

## FIREBASE CLOUD FUNCTIONS SETUP

### Functions Prioriteit
```bash
# Locatie: firebase-functions/src/index.ts
```

**Kritieke Functions:**
1. [ ] `resetMonthlyBottles` - Scheduled (1st of month)
2. [ ] `onOrderCreated` - Firestore trigger → Send email
3. [ ] `onPaymentSuccess` - Stripe webhook → Update user tier
4. [ ] `onNewUser` - Auth trigger → Create Firestore doc
5. [ ] `updateImpactStats` - Scheduled (daily) → Aggregate data

**Nice to Have Functions:**
6. [ ] `sendWelcomeEmail` - Auth trigger
7. [ ] `generateReceipt` - HTTP → PDF generation
8. [ ] `notifyVotingPeriod` - Scheduled → Email all Insiders+

**Setup commando's:**
```bash
cd firebase-functions
npm install
npm run build
firebase deploy --only functions
```

**Geschatte tijd:** 2-3 dagen voor alle functions

---

## STRIPE SETUP

### Producten & Prijzen aanmaken
```bash
# Via Stripe Dashboard of CLI
```

**Producten:**
1. TRIBE Insider (€9.99/maand)
2. TRIBE Core (€97/jaar)
3. TRIBE Founder (€247 eenmalig)
4. Donation (variable amount)

**Webhooks:**
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `payment_intent.succeeded`

**Endpoint URL:**
```
https://yourdomain.com/api/webhooks/stripe
```

**Geschatte tijd:** 1 dag voor complete setup

---

## TESTING CHECKLIST

### Authentication & Signup
- [ ] Email signup works
- [ ] Google login works
- [ ] Apple login works (iOS/Mac)
- [ ] Password reset works
- [ ] Tier selection passes through
- [ ] Stripe payment works (test mode)
- [ ] Webhook updates Firestore
- [ ] Welcome email sent
- [ ] Redirect to dashboard works

### Dashboard & Bottles
- [ ] Stats load correctly
- [ ] Claim button shows/hides based on tier
- [ ] Modal opens & closes
- [ ] Address form validates
- [ ] Order created in Firestore
- [ ] Bottle count increments
- [ ] Monthly limit respected
- [ ] Real-time updates work

### Impact Dashboard
- [ ] Stats animate on scroll
- [ ] Real-time data updates
- [ ] Chart renders correctly
- [ ] Personal impact shows for logged-in users
- [ ] Public access works

### Payments
- [ ] Test card works
- [ ] iDEAL test works (NL)
- [ ] Subscription creates
- [ ] Webhook fires
- [ ] User tier updates
- [ ] Receipt email sent

---

## DEPLOYMENT CHECKLIST

### Pre-launch
- [ ] Environment variables set (production)
- [ ] Firebase production project configured
- [ ] Stripe live mode keys added
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Analytics installed
- [ ] Error tracking (Sentry) configured
- [ ] Email service configured (Resend/SendGrid)

### Firebase Deploy
```bash
# Build frontend
npm run build

# Deploy Hosting
firebase deploy --only hosting

# Deploy Functions
firebase deploy --only functions

# Deploy Firestore Rules
firebase deploy --only firestore:rules

# Deploy Storage Rules
firebase deploy --only storage
```

### Post-launch Monitoring
- [ ] Test signup flow (real payment)
- [ ] Monitor Firestore writes
- [ ] Monitor Cloud Functions logs
- [ ] Check Stripe dashboard
- [ ] Test email delivery
- [ ] Monitor error logs
- [ ] Check page load times
- [ ] Verify SEO meta tags

---

## GESCHATTE TOTALE TIJDLIJN

| Fase | Taken | Geschatte Tijd |
|------|-------|----------------|
| **Fase 1** | Signup, Dashboard, Claim, Impact | 9-12 dagen |
| **Fase 2** | TRIBE, FAQ, About, Donate | 6-8 dagen |
| **Fase 3** | Corporate, NGO App, Press | 3-4 dagen |
| **Functions** | Cloud Functions setup | 2-3 dagen |
| **Testing** | End-to-end testing | 3-4 dagen |
| **Deploy** | Production setup & launch | 1-2 dagen |
| **TOTAAL** | | **24-33 werkdagen** |

**Met 1 developer:** ~5-7 weken
**Met 2 developers:** ~3-4 weken

---

## PRIORITEITEN VOOR LAUNCH

### MOET HEBBEN (Launch Blocker)
1. ✅ Signup flow + Stripe payment
2. ✅ Claim bottle functionaliteit
3. ✅ Dashboard basis
4. ✅ Impact dashboard (public)
5. ✅ Water product page (volledig)

### GOED OM TE HEBBEN (Week 1 post-launch)
6. TRIBE overview verbeteren
7. FAQ page
8. About page voltooien
9. Donate page verbeteren

### KAN LATER (Post-MVP)
10. Corporate giving
11. NGO application
12. Press kit

---

## VOLGENDE STAPPEN

1. **Nu beginnen met:** Signup flow (kritiek pad)
2. **Parallel werk mogelijk:**
   - Frontend: Signup + Dashboard
   - Backend: Cloud Functions + Stripe setup
3. **Testing parallel:** Terwijl je bouwt, test elke component
4. **Deploy strategy:** Staging environment eerst, dan production

**Zullen we beginnen met Stap 1.1 (TRIBE Signup Flow)?**
