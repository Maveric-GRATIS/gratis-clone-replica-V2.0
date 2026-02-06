# GRATIS.NGO - Complete Page-by-Page Development Prompts
## Copy-Paste Ready for Firebase Studio Vibecoding

**Project:** GRATIS Foundation Website
**Stack:** React/Next.js + TypeScript + Tailwind CSS + Firebase (Auth, Firestore, Hosting) + Stripe
**Launch:** February 14, 2026 (Amsterdam), March 15, 2026 (USA)

---

# TABLE OF CONTENTS

## P0 - MVP LAUNCH (Must Have)
1. [Homepage](#1-homepage)
2. [GRATIS Water Product Page](#2-gratis-water-product-page)
3. [TRIBE Overview Page](#3-tribe-overview-page)
4. [TRIBE Signup Flow](#4-tribe-signup-flow)
5. [Login Page](#5-login-page)
6. [Member Dashboard](#6-member-dashboard)
7. [Impact Dashboard](#7-impact-dashboard)
8. [Privacy Policy](#8-privacy-policy)
9. [Terms of Service](#9-terms-of-service)

## P1 - Should Have
10. [About/Story Page](#10-aboutstory-page)
11. [FAQ Page](#11-faq-page)
12. [Contact Page](#12-contact-page)
13. [NGO Partners Overview](#13-ngo-partners-overview)
14. [Donate Page](#14-donate-page)
15. [Products Overview](#15-products-overview)

## P2 - Nice to Have
16. [GRATIS Theurgy Product Page](#16-gratis-theurgy-product-page)
17. [GRATIS F.U. Product Page](#17-gratis-fu-product-page)
18. [Corporate Giving](#18-corporate-giving)
19. [NGO Application Form](#19-ngo-application-form)
20. [Team Page](#20-team-page)
21. [Press/Media Kit](#21-pressmedia-kit)
22. [Careers Page](#22-careers-page)

## Global Components
23. [Navigation Header](#23-navigation-header)
24. [Footer](#24-footer)
25. [Auth Context & Protected Routes](#25-auth-context--protected-routes)
26. [Shared UI Components](#26-shared-ui-components)

---

# GLOBAL SETUP PROMPT (RUN FIRST)

```
You are building the GRATIS.NGO website - a Dutch charitable foundation (Stichting) that gives away free premium water bottles funded by advertising, with 100% of net profits donated to NGOs.

## PROJECT SETUP

Create a Next.js 14 project with TypeScript and the following configuration:

### Tech Stack:
- Next.js 14 (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- Firebase (Auth, Firestore, Storage, Hosting)
- Stripe (payments)
- Framer Motion (animations)

### Install Dependencies:
```bash
npx create-next-app@latest gratis-ngo --typescript --tailwind --app --src-dir
cd gratis-ngo
npm install firebase stripe @stripe/stripe-js framer-motion lucide-react
npm install -D @types/node
```

### Brand Colors (tailwind.config.ts):
```typescript
colors: {
  'hot-lime': '#C1FF00',
  'electric-blue': '#00AFFF',
  'hot-magenta': '#FF0077',
  'solar-orange': '#FF5F00',
  'jet-black': '#000000',
  'pure-white': '#FFFFFF',
  'soft-gray': '#F5F5F5',
  'medium-gray': '#888888',
}
```

### Typography:
- Headlines: Space Grotesk (Google Fonts)
- Body: Inter (Google Fonts)

### Firebase Config (src/lib/firebase.ts):
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### Firestore Collections Structure:
```
/users/{userId}
  - email: string
  - firstName: string
  - lastName: string
  - tribeTier: 'explorer' | 'insider' | 'core' | 'founder'
  - bottlesClaimed: number
  - joinedAt: timestamp
  - stripeCustomerId: string

/orders/{orderId}
  - userId: string
  - productId: string
  - status: 'pending' | 'shipped' | 'delivered'
  - shippingAddress: object
  - createdAt: timestamp

/products/{productId}
  - name: string
  - slug: string
  - description: string
  - status: 'live' | 'preorder' | 'coming_soon'
  - imageUrl: string

/donations/{donationId}
  - userId: string (optional)
  - amount: number
  - allocation: 'water' | 'arts' | 'education' | 'general'
  - isAnonymous: boolean
  - createdAt: timestamp

/impact_stats (single document)
  - totalDonated: number
  - bottlesDistributed: number
  - ngosSupported: number
  - tribeMembers: number
  - lastUpdated: timestamp

/ngo_partners/{ngoId}
  - name: string
  - description: string
  - category: 'water' | 'arts' | 'education'
  - logoUrl: string
  - website: string
  - fundsReceived: number
```

Create the folder structure and initialize Firebase. Confirm when ready.
```

---

# P0 - MVP LAUNCH PAGES

---

## 1. HOMEPAGE

```
Build the GRATIS.NGO homepage with the following sections. This is a charity that gives away FREE premium water bottles funded by advertising, with 100% of net profits going to NGOs.

## PAGE: Homepage (src/app/page.tsx)

### SECTION 1: Hero
Full viewport height, jet-black background with subtle animated gradient overlay.

Content:
- Pre-headline badge (hot-lime background, black text): "100% OF NET PROFITS DONATED"
- Main headline (white, 72px desktop / 48px mobile, Space Grotesk): "Charity Never Looked This Bold"
- Subheadline (medium-gray, 24px desktop / 18px mobile): "Free premium water bottles. Funded by ads. Every bottle drives impact."
- Two CTA buttons side by side:
  - Primary (hot-lime background, black text): "GET FREE WATER" → links to /products/water
  - Secondary (transparent, white border, white text): "JOIN THE TRIBE" → links to /tribe
- Background: Subtle particle animation or gradient mesh

### SECTION 2: Impact Stats Bar
Sticky bar that appears after scrolling past hero. Hot-lime background, black text.

Four animated counters (use Framer Motion number animation):
- "€0" with label "Donated" (pulls from Firestore impact_stats.totalDonated)
- "0" with label "Bottles Distributed" (pulls from impact_stats.bottlesDistributed)
- "0" with label "NGOs Supported" (pulls from impact_stats.ngosSupported)
- "0" with label "TRIBE Members" (pulls from impact_stats.tribeMembers)

Numbers should animate up when scrolled into view.

### SECTION 3: How It Works
White background, centered content.

Headline: "How GRATIS Works" (jet-black, 48px)
Subheadline: "Three steps to impact" (medium-gray, 20px)

Three cards in a row (stack on mobile):

Card 1:
- Icon: Gift icon (lucide-react)
- Number: "01"
- Title: "Join Free"
- Description: "Sign up for TRIBE membership. It costs nothing. Get your first bottle free."

Card 2:
- Icon: Droplet icon
- Number: "02"
- Title: "Get Your Bottle"
- Description: "Receive premium water bottles with rotating brand sponsors. Free to you."

Card 3:
- Icon: Heart icon
- Number: "03"
- Title: "Drive Impact"
- Description: "100% of net advertising profits go to verified NGOs. You choose where."

### SECTION 4: Three Pillars
Soft-gray background.

Headline: "Where Your Impact Goes" (jet-black, 48px)
Subheadline: "100% of net profits support three causes" (medium-gray)

Three large cards with hover effects:

Card 1 (electric-blue accent):
- Icon: 💧 Water droplet
- Percentage: "40%"
- Title: "Clean Water"
- Description: "Bringing safe drinking water to communities in need through verified water.org partnerships."

Card 2 (hot-magenta accent):
- Icon: 🎨 Palette
- Percentage: "30%"
- Title: "Arts & Culture"
- Description: "Funding artists, museums, and cultural programs that enrich communities worldwide."

Card 3 (solar-orange accent):
- Icon: 📚 Book
- Percentage: "30%"
- Title: "Education"
- Description: "Supporting schools, scholarships, and learning initiatives for underserved youth."

### SECTION 5: Product Showcase
White background.

Headline: "The GRATIS Collection"

Three product cards in a row:

Product 1 - GRATIS WATER:
- Image placeholder (500x500)
- Badge: "LIVE NOW" (hot-lime)
- Name: "GRATIS Water"
- Tagline: "Pure. Simple. Impactful."
- Description: "Our flagship bottle. Clean design, premium quality, zero cost to you."
- CTA Button: "GET FREE" → /products/water

Product 2 - GRATIS THEURGY:
- Image placeholder
- Badge: "PRE-ORDER" (electric-blue)
- Name: "GRATIS Theurgy"
- Tagline: "Mystical. Elevated. Transformative."
- Description: "Infused with trace adaptogens. For those who seek more."
- CTA Button: "JOIN WAITLIST" → /products/theurgy

Product 3 - GRATIS F.U.:
- Image placeholder
- Badge: "PRE-ORDER" (solar-orange)
- Name: "GRATIS F.U."
- Tagline: "Free & Unfiltered."
- Description: "Natural caffeine boost. Bold design. Unapologetic energy."
- CTA Button: "JOIN WAITLIST" → /products/fu

### SECTION 6: TRIBE CTA
Jet-black background with hot-lime accent elements.

Headline: "Join the TRIBE" (white, 48px)
Subheadline: "More than members. Movement makers." (medium-gray)

Four tier preview cards:
- EXPLORER: "Free forever" - 1 bottle/month
- INSIDER: "€9.99/mo" - 2 bottles/month + voting
- CORE: "€97/year" - 4 bottles/month + events
- FOUNDER: "€247 once" - Unlimited + lifetime perks

CTA: "EXPLORE MEMBERSHIP" (hot-lime button) → /tribe

### SECTION 7: Trust Bar
White background, logos in grayscale (color on hover).

Text: "Trusted Partners & Supporters"
Placeholder for 6 partner logos (200x80 each)

### SECTION 8: Final CTA
Hot-lime background, jet-black text.

Headline: "Ready to Make Impact?"
Subheadline: "Join thousands choosing charity that doesn't cost a thing."
CTA: "GET YOUR FREE BOTTLE" (black button, white text) → /tribe/signup

### TECHNICAL REQUIREMENTS:
1. Fetch impact_stats from Firestore on page load
2. Use Framer Motion for:
   - Hero text fade-in on load
   - Stats counter animation
   - Card hover effects
   - Section fade-in on scroll
3. Implement smooth scroll for anchor links
4. Add meta tags for SEO:
   - Title: "GRATIS | Free Water Bottles, 100% Charity"
   - Description: "Get free premium water bottles funded by advertising. 100% of net profits donated to verified NGOs supporting clean water, arts, and education."
5. Mobile responsive: stack cards vertically, adjust font sizes
6. Add loading skeleton while Firestore data loads

Build this complete page with all sections. Use TypeScript interfaces for all data types.
```

---

## 2. GRATIS WATER PRODUCT PAGE

```
Build the GRATIS Water product page - our flagship FREE water bottle.

## PAGE: /products/water (src/app/products/water/page.tsx)

### SECTION 1: Product Hero
Split layout: Image left (60%), Content right (40%).

Left side:
- Large product image placeholder (800x800)
- Image gallery thumbnails below (4 images)
- Click thumbnail to change main image

Right side:
- Breadcrumb: "Products / GRATIS Water"
- Badge: "AVAILABLE NOW" (hot-lime background)
- Product name: "GRATIS Water" (48px, Space Grotesk)
- Tagline: "Pure. Simple. Impactful." (24px, medium-gray)
- Price display: 
  - Strikethrough: "€24.99" (medium-gray, line-through)
  - Actual: "FREE" (hot-lime, 36px, bold)
  - Note: "for TRIBE members"

Product specs list (icons + text):
- 💧 500ml capacity
- ♻️ BPA-Free Tritan™ plastic
- 🔒 Leak-proof flip-top lid
- 📐 22cm height × 7cm diameter
- ⚖️ 85g empty weight

CTA section:
- If user NOT logged in:
  - Button: "JOIN TRIBE TO GET FREE" (hot-lime, full width) → /tribe/signup
  - Text below: "Already a member? Log in"
  
- If user IS logged in:
  - Show remaining bottles this month: "You have X bottles remaining this month"
  - Button: "CLAIM YOUR BOTTLE" (hot-lime, full width) → triggers claim flow
  - Or if no bottles remaining: "Next bottle available [date]" (disabled button)

### SECTION 2: How It's Free
White background with electric-blue accent.

Headline: "Yes, It's Actually Free"
Three-column explanation:

Column 1:
- Icon: Megaphone
- Title: "Brand Sponsors"
- Text: "Premium brands pay to feature their message on our bottles. They get visibility. You get free bottles."

Column 2:
- Icon: Shield Check
- Title: "Curated Partners"
- Text: "We only work with brands aligned with our values. No tobacco, alcohol, gambling, or harmful products."

Column 3:
- Icon: Heart Handshake
- Title: "100% to Charity"
- Text: "After covering bottle costs, every cent of profit goes to verified NGOs. Transparent. Audited. Real impact."

### SECTION 3: Product Details Tabs
Tabbed interface with three tabs:

TAB 1: "Details"
```
The GRATIS Water bottle is designed for everyday hydration with premium materials and thoughtful engineering.

**Materials:**
- Body: BPA-free Tritan™ copolyester
- Lid: Food-grade polypropylene
- Seal: Silicone gasket

**Care Instructions:**
- Dishwasher safe (top rack)
- Hand wash recommended for longevity
- Do not microwave
- Do not freeze when full

**What's Included:**
- 1× GRATIS Water bottle
- 1× Silicone carry loop
- 1× Welcome card with impact tracking code
```

TAB 2: "Shipping"
```
**Netherlands:**
- Free shipping on all orders
- Delivery: 2-4 business days
- Carrier: PostNL

**European Union:**
- Free shipping on all orders
- Delivery: 5-10 business days
- Carrier: DHL/PostNL

**United States:** (Available March 15, 2026)
- Free shipping on all orders
- Delivery: 7-14 business days
- Carrier: USPS/UPS

**Rest of World:**
- Coming soon. Join waitlist for updates.

All orders include tracking. You'll receive email updates at each stage.
```

TAB 3: "Impact"
```
**Every GRATIS Water bottle drives real change:**

When you claim this bottle:
- €2.40 average contribution to our NGO fund
- Counted toward our clean water initiatives
- Your vote determines fund allocation

**Cumulative Impact:**
- [X] bottles distributed (live counter)
- [X] liters of clean water funded
- [X] communities reached

Track your personal impact in your TRIBE dashboard.
```

### SECTION 4: FAQ Accordion
Expandable FAQ items:

Q: "Is this really free?"
A: "Yes. TRIBE members receive bottles at no cost. Brands sponsor the bottles, covering all manufacturing and shipping costs. You pay nothing."

Q: "What's the catch?"
A: "No catch. The bottle features a small, tasteful brand message from our sponsors. That's it. No subscriptions, no hidden fees, no data selling."

Q: "How many can I get?"
A: "Depends on your TRIBE tier: Explorer (1/month), Insider (2/month), Core (4/month), Founder (unlimited)."

Q: "Do I have to keep the brand message?"
A: "The brand message is printed on the bottle and cannot be removed. We ensure all sponsors align with our values."

Q: "Can I choose which brand?"
A: "Bottle designs rotate based on active sponsors. You'll be surprised with quality brands each time."

### SECTION 5: Related Products
Horizontal scroll on mobile.

Headline: "Complete Your Collection"

Two cards:
- GRATIS Theurgy (pre-order badge)
- GRATIS F.U. (pre-order badge)

### SECTION 6: CTA Banner
Hot-lime background.

"Not a TRIBE member yet?"
Button: "JOIN FREE TODAY" → /tribe/signup

### TECHNICAL REQUIREMENTS:
1. Check auth state to show appropriate CTA
2. If logged in, fetch user's tribeTier and bottlesClaimed from Firestore
3. Calculate remaining bottles based on tier limits
4. Image gallery with state management
5. Tab component with lazy loading
6. FAQ accordion with smooth animations
7. Meta tags:
   - Title: "GRATIS Water | Free Premium Water Bottle"
   - Description: "Get your free 500ml BPA-free water bottle. No cost to you. 100% of profits to charity."
8. Structured data for product (JSON-LD)
9. Mobile: Stack hero vertically, full-width buttons

### CLAIM BOTTLE FLOW (Modal):
When user clicks "CLAIM YOUR BOTTLE":
1. Open modal with shipping address form
2. Pre-fill from user profile if exists
3. Fields: Street, City, Postal Code, Country (dropdown: NL, DE, BE, FR, US)
4. Confirm button
5. Create order in Firestore /orders collection
6. Update user's bottlesClaimed count
7. Show success message with order number
8. Send confirmation email (Firebase Function trigger)

Build complete page with all functionality.
```

---

## 3. TRIBE OVERVIEW PAGE

```
Build the TRIBE membership overview page - explaining all membership tiers and benefits.

## PAGE: /tribe (src/app/tribe/page.tsx)

### SECTION 1: Hero
Jet-black background with hot-lime accent graphics.

Badge: "THE MOVEMENT" (hot-lime)
Headline: "Join the TRIBE" (white, 56px)
Subheadline: "More than members. Movement makers. Get free bottles. Vote on impact. Change the world." (medium-gray, 24px)

CTA: "START FREE" (hot-lime button) → /tribe/signup

### SECTION 2: Tier Comparison Table
White background.

Headline: "Choose Your Level"
Subheadline: "Every tier gets free bottles. Higher tiers unlock more impact."

Create a responsive comparison table:

| Feature | EXPLORER | INSIDER | CORE | FOUNDER |
|---------|----------|---------|------|---------|
| **Price** | FREE | €9.99/mo | €97/yr | €247 once |
| | forever | cancel anytime | best value | lifetime |
| **Bottles/Month** | 1 | 2 | 4 | Unlimited |
| **Impact Dashboard** | Basic | Full | Full | Full |
| **Voting Power** | ❌ | ✅ | ✅ | ✅ (2× weight) |
| **Quarterly Reports** | ❌ | ✅ | ✅ | ✅ |
| **Exclusive Events** | ❌ | ❌ | ✅ | ✅ + VIP |
| **Website Recognition** | ❌ | ❌ | ✅ | Founder Wall |
| **Early Access** | ❌ | ✅ | ✅ | ✅ |
| **Founding Member Badge** | ❌ | ❌ | ❌ | ✅ |

Each column has a CTA button at bottom:
- EXPLORER: "JOIN FREE" (outline button)
- INSIDER: "START INSIDER" (electric-blue)
- CORE: "GO CORE" (hot-magenta)
- FOUNDER: "BECOME FOUNDER" (solar-orange) - "MOST EXCLUSIVE" badge

All buttons → /tribe/signup?tier=[tier]

### SECTION 3: Tier Detail Cards
Four expandable cards with full details:

CARD 1 - EXPLORER (Free):
```
Icon: Compass
Color accent: medium-gray

"Start Your Journey"

Perfect for: Anyone curious about GRATIS

What you get:
✓ 1 free bottle per month
✓ Basic impact dashboard
✓ Newsletter updates
✓ Community access

Limitations:
- No voting on fund allocation
- Standard shipping only
- No event access

Price: FREE forever
No credit card required.
```

CARD 2 - INSIDER (€9.99/mo):
```
Icon: Users
Color accent: electric-blue

"Amplify Your Voice"

Perfect for: Active supporters who want influence

Everything in Explorer, plus:
✓ 2 free bottles per month
✓ Full impact dashboard with analytics
✓ Vote on quarterly fund allocation
✓ Detailed quarterly impact reports
✓ Early access to new products
✓ Priority customer support

Price: €9.99/month
Cancel anytime. No long-term commitment.
```

CARD 3 - CORE (€97/year):
```
Icon: Star
Color accent: hot-magenta
Badge: "BEST VALUE - Save €22/year vs monthly"

"Lead the Movement"

Perfect for: Committed advocates

Everything in Insider, plus:
✓ 4 free bottles per month
✓ Exclusive member events (virtual & in-person)
✓ Name on website supporters page
✓ Annual impact certificate
✓ Direct line to GRATIS team
✓ Exclusive Core-only merchandise

Price: €97/year (just €8.08/month)
```

CARD 4 - FOUNDER (€247 one-time):
```
Icon: Crown
Color accent: solar-orange
Badge: "LIMITED - Only 1,000 spots"

"Shape the Future"

Perfect for: True believers who want lasting legacy

Everything in Core, plus:
✓ UNLIMITED bottles for life
✓ 2× voting weight on all decisions
✓ Permanent Founder Wall recognition
✓ VIP access to all events forever
✓ Founding Member badge & certificate
✓ Direct input on strategic decisions
✓ Exclusive Founder-only merchandise
✓ Early investor opportunity updates

Price: €247 one-time payment
Lifetime membership. Never pay again.

[X]/1000 Founder spots remaining
```

### SECTION 4: How Voting Works
Soft-gray background.

Headline: "Your Voice, Real Impact"

Visual flow diagram:
1. "Every quarter, we pool net profits" (icon: piggy bank)
2. "TRIBE members vote on allocation" (icon: ballot box)
3. "Funds distributed to winning causes" (icon: heart)
4. "Full transparency report published" (icon: document)

Example ballot preview:
```
Q4 2026 Allocation Vote

How should we distribute €50,000?

Option A: 50% Water / 30% Arts / 20% Education
Option B: 40% Water / 40% Education / 20% Arts
Option C: Equal split (33.3% each)
Option D: 60% Water / 20% Arts / 20% Education

Your vote matters. Founders count 2×.
```

### SECTION 5: Social Proof
White background.

Headline: "Trusted by [X] TRIBE Members"

Three testimonial cards (placeholder content):
```
"Finally, a charity that doesn't feel like charity. I get something, they give everything."
— [Name], CORE Member since 2026

"The transparency is unreal. I can see exactly where my support goes."
— [Name], INSIDER Member

"Becoming a Founder was a no-brainer. Unlimited bottles AND lifetime impact? Done."
— [Name], Founding Member #47
```

### SECTION 6: FAQ
Accordion format:

Q: "Can I upgrade my tier later?"
A: "Absolutely. Upgrade anytime from your dashboard. You'll be prorated for any payments."

Q: "What if I want to cancel?"
A: "Explorer is always free. Insider and Core can cancel anytime—you keep access until period ends. Founder is one-time and non-refundable but lasts forever."

Q: "How do I claim my bottles?"
A: "Log into your dashboard, click 'Claim Bottle,' enter shipping address, done. We handle the rest."

Q: "Do unused bottles roll over?"
A: "No, bottle allowances reset monthly. Use them or lose them—keeps things fair for sponsors."

Q: "What happens to my data?"
A: "We collect minimal data. Never sold. See our Privacy Policy for details."

### SECTION 7: Final CTA
Jet-black background.

Headline: "Ready to Join?"
Subheadline: "Start free. Upgrade when ready. Impact immediately."

Large button: "CREATE FREE ACCOUNT" (hot-lime) → /tribe/signup

Small text below: "No credit card required for Explorer tier"

### TECHNICAL REQUIREMENTS:
1. Query Firestore for current Founder count (1000 - actual founders)
2. Pass tier parameter to signup page via URL
3. Comparison table responsive:
   - Desktop: full table
   - Mobile: swipeable cards or stacked comparison
4. Smooth scroll to tier cards when clicking table buttons
5. Accordion with single-open behavior
6. Meta tags:
   - Title: "TRIBE Membership | GRATIS"
   - Description: "Join GRATIS TRIBE. Get free water bottles, vote on charity allocation, drive real impact. Start free or go premium."

Build complete page with all components.
```

---

## 4. TRIBE SIGNUP FLOW

```
Build the TRIBE signup flow - a multi-step registration with tier selection and payment integration.

## PAGE: /tribe/signup (src/app/tribe/signup/page.tsx)

### FLOW OVERVIEW:
Step 1: Choose Tier
Step 2: Create Account
Step 3: Payment (if paid tier)
Step 4: Confirmation

### STEP 1: Choose Tier
If ?tier= parameter exists, pre-select that tier.

Headline: "Choose Your TRIBE Tier"

Four tier cards (same as overview but simplified):

EXPLORER (FREE):
- 1 bottle/month
- Basic dashboard
- Radio button to select

INSIDER (€9.99/mo):
- 2 bottles/month
- Full dashboard + voting
- Radio button to select

CORE (€97/year):
- 4 bottles/month
- Events + recognition
- "BEST VALUE" badge
- Radio button to select

FOUNDER (€247 once):
- Unlimited bottles
- Lifetime perks
- "[X] spots left" counter
- Radio button to select

Button: "CONTINUE" (hot-lime) → Step 2

### STEP 2: Create Account
Headline: "Create Your Account"
Subheadline: "Already have an account? Log in"

Form fields:
```
First Name *
[text input, required, min 2 chars]

Last Name *
[text input, required, min 2 chars]

Email Address *
[email input, required, valid email format]

Password *
[password input, required, min 8 chars, 1 uppercase, 1 number]
[show/hide password toggle]
[password strength indicator: weak/medium/strong]

Confirm Password *
[password input, must match]

☐ I agree to the Terms of Service and Privacy Policy *
[checkbox, required, links open in new tab]

☐ Send me updates about GRATIS impact and news (optional)
[checkbox, optional, default unchecked]
```

Divider: "Or continue with"

Social login buttons:
- "Continue with Google" (Google icon)
- "Continue with Apple" (Apple icon)

Button: "CREATE ACCOUNT" (hot-lime)

Validation:
- Real-time field validation
- Show errors inline below fields
- Disable button until all required fields valid

### STEP 3: Payment (Skip for Explorer)
Only shown for INSIDER, CORE, FOUNDER tiers.

Headline: "Complete Your Membership"

Order summary box:
```
[Tier Name] Membership
[Price] / [period]

Subtotal: €[amount]
VAT (21%): €[amount] (NL only)
─────────────────────
Total: €[amount]
```

Payment form (Stripe Elements):
```
Card Number
[Stripe card element]

Expiry Date          CVC
[MM/YY]              [CVC]

Name on Card
[text input]

☐ Save card for future renewals (INSIDER/CORE only)
```

Alternative payment methods:
- "Pay with iDEAL" (NL) → Stripe redirect
- "Pay with SEPA Direct Debit" → Stripe setup
- "Pay with Crypto" → Coinbase Commerce

Button: "COMPLETE PURCHASE" (hot-lime)

Security badges below: "🔒 Secured by Stripe" | "256-bit encryption"

### STEP 4: Confirmation
Success state with animation (confetti or check mark).

Headline: "Welcome to the TRIBE! 🎉"

Confirmation box:
```
You're now a [TIER] member!

Membership ID: GRATIS-[random 8 chars]
Email: [user email]
Tier: [tier name]
Bottles/Month: [amount]

What's next:
1. Check your email for confirmation
2. Visit your dashboard to claim your first bottle
3. Start making impact!
```

Buttons:
- "GO TO DASHBOARD" (hot-lime) → /dashboard
- "CLAIM FIRST BOTTLE" (outline) → /dashboard with claim modal

### TECHNICAL IMPLEMENTATION:

**Firebase Auth Setup:**
```typescript
// Create user with email/password
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const handleSignup = async (formData: SignupFormData, tier: TribeTier) => {
  // 1. Create Firebase Auth user
  const userCredential = await createUserWithEmailAndPassword(
    auth, 
    formData.email, 
    formData.password
  );
  
  // 2. Create Firestore user document
  await setDoc(doc(db, 'users', userCredential.user.uid), {
    email: formData.email,
    firstName: formData.firstName,
    lastName: formData.lastName,
    tribeTier: tier,
    bottlesClaimed: 0,
    joinedAt: serverTimestamp(),
    newsletterOptIn: formData.newsletter,
  });
  
  // 3. If paid tier, create Stripe checkout session
  if (tier !== 'explorer') {
    const checkoutSession = await createCheckoutSession(tier, userCredential.user.uid);
    // Redirect to Stripe
  }
};
```

**Stripe Integration:**
```typescript
// API route: src/app/api/create-checkout/route.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRICE_IDS = {
  insider: 'price_insider_monthly_id',
  core: 'price_core_yearly_id',
  founder: 'price_founder_onetime_id',
};

export async function POST(request: Request) {
  const { tier, userId } = await request.json();
  
  const session = await stripe.checkout.sessions.create({
    mode: tier === 'founder' ? 'payment' : 'subscription',
    payment_method_types: ['card', 'ideal', 'sepa_debit'],
    line_items: [{
      price: PRICE_IDS[tier],
      quantity: 1,
    }],
    success_url: `${process.env.NEXT_PUBLIC_URL}/tribe/signup/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/tribe/signup?tier=${tier}`,
    metadata: { userId, tier },
  });
  
  return Response.json({ sessionId: session.id, url: session.url });
}
```

**Webhook for Payment Success:**
```typescript
// API route: src/app/api/webhooks/stripe/route.ts
// Handle checkout.session.completed event
// Update user's tribeTier in Firestore
// Send welcome email
```

**Social Login:**
```typescript
import { signInWithPopup, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';

const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

const handleGoogleSignup = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  // Check if user exists in Firestore, if not create
};
```

### ERROR HANDLING:
- Email already in use → "This email is already registered. Log in instead?"
- Weak password → Show strength requirements
- Payment failed → "Payment unsuccessful. Please try again or use a different method."
- Network error → "Connection lost. Your progress is saved. Please try again."

### MOBILE OPTIMIZATION:
- Single column layout
- Large touch targets (min 44px)
- Sticky footer with CTA button
- Keyboard-aware form scrolling

Build complete multi-step signup flow with all states and error handling.
```

---

## 5. LOGIN PAGE

```
Build the GRATIS login page with email/password and social login options.

## PAGE: /login (src/app/login/page.tsx)

### LAYOUT:
Split screen on desktop:
- Left 50%: Jet-black background with brand messaging
- Right 50%: White background with login form

Mobile: Form only, full width.

### LEFT SIDE (Desktop only):
Background: Jet-black with subtle hot-lime gradient accent

Content (centered):
- GRATIS logo (white)
- Tagline: "Charity Never Looked This Bold" (white, 32px)
- Three bullet points (hot-lime checkmarks):
  - "Free premium water bottles"
  - "100% profits to charity"
  - "Your impact, your choice"

### RIGHT SIDE (Login Form):
Headline: "Welcome Back" (jet-black, 36px)
Subheadline: "Log in to your TRIBE account" (medium-gray)

Form:
```
Email Address
[email input]
[validation: required, valid email format]

Password
[password input with show/hide toggle]
[validation: required]

[Forgot password?] link → /forgot-password

☐ Remember me for 30 days
[checkbox]

[LOG IN] button (hot-lime, full width)
```

Divider: "─── Or continue with ───"

Social buttons (full width, stacked):
```
[G] Continue with Google
[🍎] Continue with Apple
```

Footer text:
"Don't have an account? [Sign up free] → /tribe/signup"

### FORGOT PASSWORD PAGE (/forgot-password):
Headline: "Reset Your Password"
Subheadline: "Enter your email and we'll send reset instructions"

Form:
```
Email Address
[email input]

[SEND RESET LINK] button
```

Success state:
"Check your inbox! We've sent password reset instructions to [email]. Didn't receive it? [Resend] or [Try different email]"

### TECHNICAL IMPLEMENTATION:

```typescript
// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      switch (err.code) {
        case 'auth/user-not-found':
          setError('No account found with this email');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password');
          break;
        case 'auth/too-many-requests':
          setError('Too many attempts. Please try again later.');
          break;
        default:
          setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (err) {
      setError('Google login failed');
    }
  };

  return (
    // ... JSX
  );
}
```

**Password Reset:**
```typescript
import { sendPasswordResetEmail } from 'firebase/auth';

const handlePasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email, {
      url: `${process.env.NEXT_PUBLIC_URL}/login`,
    });
    // Show success message
  } catch (err) {
    // Handle error
  }
};
```

### ERROR STATES:
- Invalid email format: "Please enter a valid email address"
- User not found: "No account found with this email. [Sign up instead?]"
- Wrong password: "Incorrect password. [Forgot password?]"
- Too many attempts: "Account temporarily locked. Try again in 15 minutes."
- Network error: "Connection failed. Check your internet and try again."

### REDIRECT LOGIC:
- If user already logged in, redirect to /dashboard
- After successful login, redirect to intended page (if ?redirect= param exists) or /dashboard
- Store intended destination before redirecting to login

### SECURITY:
- Rate limit login attempts (Firebase handles this)
- CSRF protection
- Secure password field (no autocomplete on sensitive fields)
- HTTPS only

### META TAGS:
- Title: "Log In | GRATIS"
- noindex (don't index login pages)

Build complete login page with all functionality and error handling.
```

---

## 6. MEMBER DASHBOARD

```
Build the TRIBE member dashboard - the central hub for logged-in users.

## PAGE: /dashboard (src/app/dashboard/page.tsx)

### ROUTE PROTECTION:
This page requires authentication. Redirect to /login if not authenticated.

```typescript
// src/app/dashboard/layout.tsx
import { redirect } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function DashboardLayout({ children }) {
  // Check auth state, redirect if not logged in
  // Show loading skeleton while checking
}
```

### DASHBOARD LAYOUT:
Left sidebar (desktop) / Bottom nav (mobile) with:
- Dashboard (home icon) - active
- My Bottles (droplet icon)
- Impact (heart icon)
- Vote (ballot icon) - badge if vote active
- Settings (gear icon)

Top bar:
- "Welcome back, [First Name]!" 
- Notification bell (with badge count)
- Profile dropdown (avatar, name, tier badge, logout)

### MAIN DASHBOARD CONTENT:

#### SECTION 1: Quick Stats Cards (4 cards in row)
```
Card 1: "Your Tier"
[TIER BADGE with color]
"[Tier Name]"
[Upgrade] link (if not Founder)

Card 2: "Bottles This Month"
[X] / [limit]
Progress bar showing usage
[Claim Bottle] button if available

Card 3: "Total Impact"
€[amount]
"Your contribution to date"

Card 4: "Next Vote"
[X] days
"Q1 2026 Allocation"
Or: "Vote Now!" if active
```

#### SECTION 2: Claim Bottle CTA (prominent)
If bottles available:
```
┌─────────────────────────────────────┐
│ 🎉 You have [X] bottles to claim!   │
│                                      │
│ [CLAIM YOUR BOTTLE] (hot-lime btn)  │
│                                      │
│ Resets in [X] days                  │
└─────────────────────────────────────┘
```

If no bottles available:
```
┌─────────────────────────────────────┐
│ You've claimed all bottles this     │
│ month. Next bottle available:       │
│ [Date]                              │
│                                      │
│ [UPGRADE FOR MORE] (if not max)     │
└─────────────────────────────────────┘
```

#### SECTION 3: Recent Activity Feed
```
Timeline format:

• Today
  ✓ Logged in to dashboard

• Jan 10, 2026
  📦 Bottle shipped - Track: [tracking link]
  
• Jan 5, 2026  
  🎁 Claimed GRATIS Water bottle
  
• Jan 1, 2026
  🗳️ Voted in Q4 allocation
  
• Dec 15, 2025
  🎉 Joined TRIBE as Explorer
```

#### SECTION 4: Impact Summary
Mini version of impact dashboard:
```
Your Impact Breakdown:

💧 Clean Water: €[X] contributed
🎨 Arts & Culture: €[X] contributed
📚 Education: €[X] contributed

[VIEW FULL IMPACT →]
```

#### SECTION 5: Active Vote (if voting period open)
```
┌─────────────────────────────────────┐
│ 🗳️ Q1 2026 Allocation Vote         │
│                                      │
│ Cast your vote before [date]        │
│                                      │
│ [VOTE NOW] button                   │
│                                      │
│ [X] members have voted              │
└─────────────────────────────────────┘
```

### MY BOTTLES PAGE (/dashboard/bottles):
List of all claimed bottles with status:

```
| Bottle | Status | Claimed | Tracking |
|--------|--------|---------|----------|
| GRATIS Water #47 | Delivered | Jan 5 | [View] |
| GRATIS Water #46 | Shipped | Dec 10 | [Track] |
| GRATIS Water #45 | Delivered | Nov 5 | [View] |
```

Filter: All | Pending | Shipped | Delivered

### CLAIM BOTTLE MODAL:
When user clicks "Claim Bottle":

```
Step 1: Confirm Address

Shipping Address:
[Street Address]
[City]
[Postal Code]
[Country dropdown]

☐ Save as default address

[CONTINUE]

Step 2: Confirm Order

You're claiming:
• 1× GRATIS Water Bottle

Shipping to:
[Address display]

Delivery estimate: 3-5 business days

[CONFIRM CLAIM] (hot-lime)

Step 3: Success!

🎉 Bottle claimed!

Order #: GRT-[ID]
Estimated delivery: [date range]

You'll receive tracking info at [email]

[CLOSE] [TRACK ORDER]
```

### VOTE PAGE (/dashboard/vote):
If vote active:
```
Q1 2026 Profit Allocation

Total pool: €[amount]

How should we distribute funds?

○ Option A: 50% Water / 30% Arts / 20% Education
○ Option B: 40% Water / 40% Education / 20% Arts  
○ Option C: Equal (33.3% each)
○ Option D: 60% Water / 20% Arts / 20% Education

Your voting power: [1× or 2× for Founders]

[SUBMIT VOTE]

Vote closes: [date/time]
```

If no active vote:
```
No Active Vote

Next voting period: Q2 2026
Opens: April 1, 2026

Previous Results:
• Q4 2025: Option A won (42% of votes)
• Q3 2025: Option C won (38% of votes)
```

### SETTINGS PAGE (/dashboard/settings):
Tabs: Profile | Membership | Notifications | Security

**Profile Tab:**
```
First Name: [input]
Last Name: [input]
Email: [input] (verified badge)
Phone: [input] (optional)

Default Shipping Address:
[Full address form]

[SAVE CHANGES]
```

**Membership Tab:**
```
Current Tier: [TIER BADGE]
Member since: [date]
Bottles claimed: [total]

[UPGRADE MEMBERSHIP] (if not Founder)
[MANAGE SUBSCRIPTION] → Stripe portal (if Insider/Core)
[CANCEL MEMBERSHIP] (warning modal)
```

**Notifications Tab:**
```
Email Notifications:
☐ Bottle shipped updates
☐ Voting period reminders  
☐ Impact reports
☐ GRATIS news & updates

Push Notifications: (if supported)
☐ Enable browser notifications
```

**Security Tab:**
```
Password:
[CHANGE PASSWORD] → modal

Two-Factor Authentication:
Status: Not enabled
[ENABLE 2FA]

Sessions:
Current session: [browser] [location]
[LOG OUT ALL DEVICES]

Danger Zone:
[DELETE ACCOUNT] (red, confirmation required)
```

### TECHNICAL REQUIREMENTS:

**Data Fetching:**
```typescript
// Fetch user data from Firestore
const userData = await getDoc(doc(db, 'users', userId));

// Fetch user's orders
const ordersQuery = query(
  collection(db, 'orders'),
  where('userId', '==', userId),
  orderBy('createdAt', 'desc'),
  limit(10)
);
const orders = await getDocs(ordersQuery);

// Calculate impact (aggregate from orders)
// Fetch active vote status
```

**Real-time Updates:**
```typescript
// Listen to user document for real-time updates
onSnapshot(doc(db, 'users', userId), (doc) => {
  setUserData(doc.data());
});
```

**Bottle Claiming Logic:**
```typescript
const claimBottle = async (userId: string, address: ShippingAddress) => {
  const userRef = doc(db, 'users', userId);
  const userData = await getDoc(userRef);
  
  const tierLimits = { explorer: 1, insider: 2, core: 4, founder: 999 };
  const limit = tierLimits[userData.tribeTier];
  
  if (userData.bottlesClaimed >= limit) {
    throw new Error('Monthly limit reached');
  }
  
  // Create order
  await addDoc(collection(db, 'orders'), {
    userId,
    productId: 'gratis-water',
    status: 'pending',
    shippingAddress: address,
    createdAt: serverTimestamp(),
  });
  
  // Increment claimed count
  await updateDoc(userRef, {
    bottlesClaimed: increment(1),
  });
};
```

**Monthly Reset (Cloud Function):**
```typescript
// Scheduled function to reset bottlesClaimed on 1st of month
exports.resetMonthlyBottles = functions.pubsub
  .schedule('0 0 1 * *')
  .onRun(async () => {
    const usersRef = collection(db, 'users');
    const batch = writeBatch(db);
    const users = await getDocs(usersRef);
    
    users.forEach((user) => {
      batch.update(user.ref, { bottlesClaimed: 0 });
    });
    
    await batch.commit();
  });
```

Build complete dashboard with all pages and functionality.
```

---

## 7. IMPACT DASHBOARD

```
Build the public Impact Dashboard showing real-time charitable impact metrics.

## PAGE: /impact (src/app/impact/page.tsx)

This page is PUBLIC (no auth required) but shows more detail if logged in.

### SECTION 1: Hero Stats
Full-width section with animated counters.

Background: Gradient from jet-black to dark gray

Four large stat displays:
```
€[TOTAL]          [BOTTLES]         [NGOs]           [MEMBERS]
Total Donated     Bottles Given     Partners         TRIBE Size

(Numbers animate on scroll into view)
(Pull from Firestore impact_stats document)
```

Last updated timestamp: "Updated live • Last sync: [time]"

### SECTION 2: Allocation Breakdown
Visual representation of fund allocation.

Headline: "Where The Money Goes"

Large donut chart showing:
- 💧 Clean Water: 40% (electric-blue)
- 🎨 Arts & Culture: 30% (hot-magenta)
- 📚 Education: 30% (solar-orange)

Next to chart, three cards with actual amounts:
```
Clean Water
€[amount] distributed
[X] projects funded
[View Projects →]

Arts & Culture  
€[amount] distributed
[X] artists supported
[View Projects →]

Education
€[amount] distributed
[X] scholarships given
[View Projects →]
```

### SECTION 3: Timeline of Impact
Chronological feed of major milestones.

Headline: "Our Journey"

```
Timeline (vertical, most recent first):

● February 2026
  🚀 GRATIS launches in Amsterdam
  First 100 bottles distributed
  
● March 2026
  🇺🇸 USA expansion begins
  First NGO partnership signed
  
● Q2 2026
  💰 First €10,000 donated
  [X] TRIBE members reached

(Continue with milestones)
```

### SECTION 4: NGO Partners Grid
Showcase of partner organizations.

Headline: "Our Verified Partners"
Subheadline: "Every organization is vetted and audited"

Grid of NGO cards (3 columns desktop, 1 mobile):
```
[Logo]
Organization Name
Category badge (Water/Arts/Education)
"€[amount] received"
Brief description (50 words max)
[Visit Website →]
```

Show 6 partners, then "View All Partners" button → /impact/partners

### SECTION 5: Quarterly Reports
Archive of transparency reports.

Headline: "Full Transparency"
Subheadline: "Quarterly reports audited by [Auditor Name]"

List of downloadable reports:
```
📄 Q1 2026 Impact Report
   Published: April 15, 2026
   [Download PDF]
   
📄 Q4 2025 Impact Report
   Published: January 15, 2026
   [Download PDF]
```

### SECTION 6: Your Personal Impact (Logged-in users only)
If user is authenticated, show personalized section:

```
┌─────────────────────────────────────┐
│ Your Personal Impact, [Name]       │
│                                      │
│ Since joining on [date], you've     │
│ contributed to:                      │
│                                      │
│ 💧 €[X] to Clean Water             │
│ 🎨 €[X] to Arts & Culture          │
│ 📚 €[X] to Education               │
│                                      │
│ Total: €[X] in charitable impact    │
│                                      │
│ [DOWNLOAD YOUR CERTIFICATE]         │
└─────────────────────────────────────┘
```

If not logged in:
```
┌─────────────────────────────────────┐
│ Track Your Personal Impact          │
│                                      │
│ Join TRIBE to see exactly how your  │
│ membership drives change.           │
│                                      │
│ [JOIN FREE →]                       │
└─────────────────────────────────────┘
```

### SECTION 7: Live Feed (Optional)
Real-time activity feed (if we have volume):

```
Live Activity:

🎁 Someone in Amsterdam claimed a bottle (2 min ago)
💰 €50 donated by Anonymous (5 min ago)
🗳️ 47 new votes cast for Q1 allocation (1 hour ago)
👋 New TRIBE member joined from Berlin (2 hours ago)
```

### TECHNICAL IMPLEMENTATION:

**Firestore Structure:**
```typescript
// /impact_stats (single document, updated by Cloud Functions)
{
  totalDonated: 15420.50,
  bottlesDistributed: 2847,
  ngosSupported: 12,
  tribeMembers: 1893,
  allocation: {
    water: 6168.20,
    arts: 4626.15,
    education: 4626.15
  },
  lastUpdated: Timestamp
}

// /ngo_partners collection
{
  name: "Water.org",
  category: "water",
  description: "...",
  logoUrl: "...",
  website: "...",
  fundsReceived: 3500.00,
  projectsCount: 5
}
```

**Real-time Listener:**
```typescript
'use client';

import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useImpactStats() {
  const [stats, setStats] = useState<ImpactStats | null>(null);
  
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'impact_stats', 'current'),
      (doc) => {
        setStats(doc.data() as ImpactStats);
      }
    );
    
    return () => unsubscribe();
  }, []);
  
  return stats;
}
```

**Animated Counter Component:**
```typescript
import { useSpring, animated } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';

function AnimatedCounter({ value, prefix = '', suffix = '' }) {
  const [ref, inView] = useInView({ triggerOnce: true });
  
  const { number } = useSpring({
    from: { number: 0 },
    number: inView ? value : 0,
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 },
  });
  
  return (
    <span ref={ref}>
      {prefix}
      <animated.span>
        {number.to((n) => n.toFixed(0))}
      </animated.span>
      {suffix}
    </span>
  );
}
```

**Donut Chart (use Recharts):**
```typescript
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#00AFFF', '#FF0077', '#FF5F00'];

const data = [
  { name: 'Water', value: 40 },
  { name: 'Arts', value: 30 },
  { name: 'Education', value: 30 },
];

<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={data}
      innerRadius={80}
      outerRadius={120}
      dataKey="value"
    >
      {data.map((entry, index) => (
        <Cell key={index} fill={COLORS[index]} />
      ))}
    </Pie>
  </PieChart>
</ResponsiveContainer>
```

### META TAGS:
- Title: "Impact Dashboard | GRATIS"
- Description: "See exactly where GRATIS donations go. Real-time tracking of charitable impact across clean water, arts, and education initiatives."
- Open Graph image: Dynamic image with current stats

### PERFORMANCE:
- Use ISR (Incremental Static Regeneration) for SEO with revalidate: 60
- Real-time updates for logged-in users only
- Lazy load charts and images below fold
- Skeleton loading states for all async data

Build complete Impact Dashboard with all sections and real-time functionality.
```

---

## 8. PRIVACY POLICY

```
Build the Privacy Policy page with proper legal formatting.

## PAGE: /privacy (src/app/privacy/page.tsx)

### LAYOUT:
Clean, readable legal document layout.
- Max width: 800px, centered
- Generous line height (1.8)
- Clear section hierarchy
- Table of contents with anchor links
- Last updated date prominent
- Print-friendly styles

### CONTENT:

```
PRIVACY POLICY

Last Updated: [Date]
Effective Date: [Date]

TABLE OF CONTENTS
1. Introduction
2. Information We Collect
3. How We Use Your Information
4. Information Sharing
5. Data Retention
6. Your Rights (GDPR)
7. Cookies
8. Security
9. International Transfers
10. Children's Privacy
11. Changes to This Policy
12. Contact Us

---

1. INTRODUCTION

GRATIS Foundation ("GRATIS," "we," "us," or "our") is a Dutch Stichting (foundation) registered under KVK number [NUMBER]. We are committed to protecting your privacy and handling your personal data transparently.

This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website gratis.ngo, use our mobile application, or interact with our services.

**Data Controller:**
GRATIS Foundation
[Address]
[City, Netherlands]
Email: privacy@gratis.ngo

---

2. INFORMATION WE COLLECT

**2.1 Information You Provide:**
- Account information (name, email, password)
- Profile information (shipping address, phone number)
- Payment information (processed by Stripe; we don't store card numbers)
- Communications (emails, support requests)
- Survey responses and feedback

**2.2 Information Collected Automatically:**
- Device information (browser type, operating system)
- Log data (IP address, access times, pages viewed)
- Cookies and similar technologies (see Section 7)
- Location data (country/region level only)

**2.3 Information from Third Parties:**
- Social login providers (Google, Apple) if you choose to connect
- Payment processors (transaction confirmations only)

---

3. HOW WE USE YOUR INFORMATION

We use your information for:

**Service Delivery:**
- Processing your TRIBE membership
- Shipping water bottles to you
- Managing your account and preferences
- Processing donations and votes

**Communication:**
- Sending order confirmations and shipping updates
- Responding to your inquiries
- Sending newsletters (with your consent)
- Notifying you of voting periods

**Improvement:**
- Analyzing usage patterns to improve our services
- Conducting research and analytics
- Preventing fraud and abuse

**Legal Compliance:**
- Meeting regulatory obligations
- Responding to legal requests
- Protecting our rights and safety

---

4. INFORMATION SHARING

We do NOT sell your personal data. Ever.

We may share information with:

**Service Providers:**
- Stripe (payment processing)
- Firebase/Google Cloud (hosting and database)
- Email service providers (transactional emails)
- Shipping carriers (to deliver your bottles)

**Legal Requirements:**
- When required by law
- To protect rights and safety
- In response to valid legal process

**Business Transfers:**
- In connection with merger, acquisition, or asset sale

All service providers are bound by data processing agreements.

---

5. DATA RETENTION

We retain your data for:
- Account data: Duration of membership + 7 years (legal requirement)
- Transaction records: 7 years (tax/legal requirement)
- Communication logs: 3 years
- Analytics data: 26 months (anonymized thereafter)

You may request deletion at any time (see Section 6).

---

6. YOUR RIGHTS (GDPR)

As a data subject, you have the right to:

**Access:** Request a copy of your personal data
**Rectification:** Correct inaccurate data
**Erasure:** Request deletion of your data ("right to be forgotten")
**Restriction:** Limit how we process your data
**Portability:** Receive your data in a portable format
**Objection:** Object to certain processing activities
**Withdraw Consent:** Revoke consent at any time

**To exercise your rights:**
Email: privacy@gratis.ngo
Response time: Within 30 days

**Supervisory Authority:**
You may lodge a complaint with:
Autoriteit Persoonsgegevens (Dutch DPA)
www.autoriteitpersoonsgegevens.nl

---

7. COOKIES

We use cookies for:

**Essential Cookies:** Required for site functionality
**Analytics Cookies:** Help us understand usage (Google Analytics)
**Preference Cookies:** Remember your settings

You can manage cookies through our Cookie Settings or your browser.

For details, see our [Cookie Policy](/cookies).

---

8. SECURITY

We implement:
- SSL/TLS encryption for all data transmission
- Encrypted data storage
- Regular security audits
- Access controls and authentication
- Employee training on data protection

No system is 100% secure. We cannot guarantee absolute security.

---

9. INTERNATIONAL TRANSFERS

Your data may be transferred to:
- United States (Firebase/Google Cloud servers)
- European Union (primary operations)

Transfers outside EEA are protected by:
- Standard Contractual Clauses (SCCs)
- Adequacy decisions where applicable

---

10. CHILDREN'S PRIVACY

Our services are not directed to children under 16. We do not knowingly collect data from children. If you believe we have collected data from a child, contact us immediately.

---

11. CHANGES TO THIS POLICY

We may update this policy periodically. Changes will be posted here with updated date. Material changes will be notified via email.

---

12. CONTACT US

**Privacy Questions:**
Email: privacy@gratis.ngo

**General Inquiries:**
GRATIS Foundation
[Address]
[City, Netherlands]
Email: hello@gratis.ngo

---

© 2026 GRATIS Foundation. All rights reserved.
```

### TECHNICAL REQUIREMENTS:
1. Render as clean HTML with proper heading hierarchy
2. Table of contents with smooth scroll anchor links
3. Print stylesheet for clean printing
4. Last updated date pulled from CMS or hardcoded
5. "Download PDF" button option
6. Language selector if supporting multiple languages

### META TAGS:
- Title: "Privacy Policy | GRATIS"
- noindex optional (some prefer to index legal pages)

Build complete Privacy Policy page with proper formatting and navigation.
```

---

## 9. TERMS OF SERVICE

```
Build the Terms of Service page with proper legal formatting.

## PAGE: /terms (src/app/terms/page.tsx)

### LAYOUT:
Same clean legal document layout as Privacy Policy.
- Max width: 800px, centered
- Clear section hierarchy with numbering
- Table of contents
- Last updated date
- Print-friendly

### CONTENT:

```
TERMS OF SERVICE

Last Updated: [Date]
Effective Date: [Date]

PLEASE READ THESE TERMS CAREFULLY BEFORE USING OUR SERVICES.

TABLE OF CONTENTS
1. Agreement to Terms
2. Description of Services
3. TRIBE Membership
4. User Accounts
5. Acceptable Use
6. Intellectual Property
7. Third-Party Services
8. Disclaimers
9. Limitation of Liability
10. Indemnification
11. Dispute Resolution
12. Termination
13. Governing Law
14. Changes to Terms
15. Contact Information

---

1. AGREEMENT TO TERMS

By accessing or using the services provided by GRATIS Foundation ("GRATIS," "we," "us"), a Dutch Stichting registered under KVK [NUMBER], you agree to be bound by these Terms of Service ("Terms").

If you do not agree to these Terms, do not use our services.

"Services" includes our website (gratis.ngo), mobile applications, TRIBE membership program, and all related features.

---

2. DESCRIPTION OF SERVICES

GRATIS provides:
- Free premium water bottles to TRIBE members
- A platform for charitable giving
- Voting mechanisms for fund allocation
- Impact tracking and reporting

Our bottles are funded by brand advertising. 100% of net profits are donated to verified NGO partners.

We reserve the right to modify, suspend, or discontinue services at any time.

---

3. TRIBE MEMBERSHIP

**3.1 Membership Tiers:**
- Explorer (Free): 1 bottle/month, basic features
- Insider (€9.99/month): 2 bottles/month, voting rights
- Core (€97/year): 4 bottles/month, full benefits
- Founder (€247 one-time): Unlimited bottles, lifetime benefits

**3.2 Bottle Allowances:**
- Bottles do not roll over month-to-month
- We reserve the right to limit orders for abuse prevention
- Shipping availability varies by region

**3.3 Payments:**
- Paid tiers are billed via Stripe
- Subscriptions auto-renew unless cancelled
- No refunds for partial periods after cancellation
- Founder membership is non-refundable

**3.4 Cancellation:**
- Cancel anytime via account settings
- Access continues until end of billing period
- Explorer tier remains available after cancellation

---

4. USER ACCOUNTS

**4.1 Registration:**
- You must provide accurate, complete information
- You are responsible for maintaining account security
- One account per person

**4.2 Account Security:**
- Keep your password confidential
- Notify us immediately of unauthorized access
- We are not liable for unauthorized account use

**4.3 Account Termination:**
We may suspend or terminate accounts for:
- Violation of these Terms
- Fraudulent activity
- Abuse of the bottle program
- Extended inactivity (12+ months)

---

5. ACCEPTABLE USE

You agree NOT to:
- Resell or commercially exploit bottles received
- Create multiple accounts to exceed bottle limits
- Provide false information
- Interfere with service operation
- Attempt to access unauthorized areas
- Use services for illegal purposes
- Harass other users or staff
- Scrape or data-mine our platform

Violation may result in immediate termination.

---

6. INTELLECTUAL PROPERTY

**6.1 Our Content:**
GRATIS name, logo, bottle designs, website content, and branding are our intellectual property. You may not use without permission.

**6.2 User Content:**
By submitting content (reviews, testimonials, etc.), you grant us a non-exclusive, royalty-free license to use, display, and distribute such content.

**6.3 Brand Messages:**
Bottles feature sponsor brand messages. These remain the property of respective brands.

---

7. THIRD-PARTY SERVICES

Our services integrate with:
- Stripe (payments)
- Google (authentication, analytics)
- Shipping carriers

These services have their own terms. We are not responsible for third-party services.

---

8. DISCLAIMERS

**8.1 "AS IS" Basis:**
Services are provided "as is" without warranties of any kind, express or implied.

**8.2 No Guarantee:**
We do not guarantee:
- Uninterrupted service availability
- Specific bottle designs or brands
- Delivery timeframes
- That services will meet your expectations

**8.3 Charitable Impact:**
While we commit to donating 100% of net profits, actual impact depends on various factors. We provide transparency reports but make no specific guarantees about outcomes.

---

9. LIMITATION OF LIABILITY

TO THE MAXIMUM EXTENT PERMITTED BY LAW:

- GRATIS shall not be liable for indirect, incidental, special, or consequential damages
- Our total liability shall not exceed the amount paid by you in the 12 months preceding the claim
- These limitations apply regardless of the theory of liability

Some jurisdictions do not allow certain limitations. In such cases, limitations apply to the fullest extent permitted.

---

10. INDEMNIFICATION

You agree to indemnify and hold harmless GRATIS, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from:
- Your use of services
- Your violation of these Terms
- Your violation of any third-party rights

---

11. DISPUTE RESOLUTION

**11.1 Informal Resolution:**
Before filing any claim, contact us at legal@gratis.ngo. We will attempt to resolve disputes informally within 30 days.

**11.2 Governing Law:**
These Terms are governed by the laws of the Netherlands.

**11.3 Jurisdiction:**
Disputes shall be resolved in the courts of Amsterdam, Netherlands.

**11.4 Class Action Waiver:**
You agree to resolve disputes individually, not as part of any class action.

---

12. TERMINATION

**12.1 By You:**
You may terminate your account at any time via settings or by contacting us.

**12.2 By Us:**
We may terminate your access for violation of Terms or at our discretion with notice.

**12.3 Effect of Termination:**
Upon termination:
- Your access to services ceases
- Pending orders may be cancelled
- Certain provisions survive (Sections 6, 9, 10, 11)

---

13. GOVERNING LAW

These Terms are governed by Dutch law. The United Nations Convention on Contracts for the International Sale of Goods does not apply.

---

14. CHANGES TO TERMS

We may modify these Terms at any time. Changes are effective upon posting. Continued use after changes constitutes acceptance.

Material changes will be notified via email to registered users.

---

15. CONTACT INFORMATION

**Legal Matters:**
Email: legal@gratis.ngo

**General Inquiries:**
GRATIS Foundation
[Address]
[City, Netherlands]
Email: hello@gratis.ngo

---

By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms.

© 2026 GRATIS Foundation. All rights reserved.
```

### TECHNICAL REQUIREMENTS:
1. Same layout/styling as Privacy Policy for consistency
2. Anchor link navigation
3. Print stylesheet
4. "I agree" checkbox reference for signup flow
5. Version history or changelog (optional)

### META TAGS:
- Title: "Terms of Service | GRATIS"

Build complete Terms of Service page matching Privacy Policy format.
```

---

# P1 - SHOULD HAVE PAGES

---

## 10. ABOUT/STORY PAGE

```
Build the About/Story page telling the GRATIS origin and mission.

## PAGE: /about (src/app/about/page.tsx)

### SECTION 1: Hero
Headline: "Charity Never Looked This Bold"
Subheadline: "We're not just giving away water bottles. We're proving that generosity can be sustainable, scalable, and stylish."

Background: Team photo or brand imagery

### SECTION 2: The Problem
Headline: "The Broken Charity Model"

Two-column layout:
Left (problem):
"Traditional charity asks you to give without getting. Donation fatigue is real. Trust is eroding. People want to help but feel disconnected from impact."

Right (solution):
"What if charity gave back? What if every act of generosity came with something tangible? What if you could see exactly where your impact goes?"

### SECTION 3: Our Solution
Headline: "How GRATIS Works"

Visual diagram:
[Brands] → Pay for visibility → [GRATIS] → Free bottles to you → [100% profits] → [NGOs]

Explanation:
"We partnered with premium brands who want to reach conscious consumers. They fund the bottles. You get them free. We donate every cent of profit to verified NGOs. Everyone wins."

### SECTION 4: Our Pillars
Three cards showing impact areas (same as homepage but with more detail):

💧 **Clean Water (40%)**
"Access to clean water is a human right. We partner with water.org and local initiatives to bring safe drinking water to communities in need."

🎨 **Arts & Culture (30%)**
"Art enriches communities and preserves heritage. We fund artists, museums, and cultural programs that might otherwise go unsupported."

📚 **Education (30%)**
"Education breaks cycles. We support schools, scholarships, and learning programs that give young people a fighting chance."

### SECTION 5: Our Story
Timeline format:

**2025**
"The idea was born. Why do promotional products create waste? Why can't giveaways drive good?"

**Early 2026**
"GRATIS Foundation is established as a Dutch Stichting. Legal structure ensures 100% profit donation commitment."

**February 14, 2026**
"Soft launch in Amsterdam. First bottles distributed. First impact made."

**March 15, 2026**
"USA expansion begins. The movement goes global."

### SECTION 6: Our Commitment
Three pillars of trust:

**Transparency**
"Every euro is tracked. Quarterly reports are published. Audited annually."

**Verification**
"All NGO partners are vetted. Impact is measured. No greenwashing."

**Community**
"TRIBE members vote on allocation. Your voice shapes our giving."

### SECTION 7: Team Teaser
Headline: "The People Behind GRATIS"

Show 3-4 key team members with photos:
- [Name], Chairman
- [Name], Director
- [Name], Board Member
- [Name], Board Member

Link: "Meet the full team →" /team

### SECTION 8: CTA
"Ready to join the movement?"
Button: "BECOME A TRIBE MEMBER" → /tribe

### META TAGS:
- Title: "Our Story | GRATIS"
- Description: "Learn how GRATIS is revolutionizing charity with free premium water bottles. 100% of net profits donated to verified NGOs."

Build complete About page with all sections.
```

---

## 11. FAQ PAGE

```
Build a comprehensive FAQ page with categorized questions.

## PAGE: /faq (src/app/faq/page.tsx)

### LAYOUT:
- Search bar at top
- Category tabs/filters
- Accordion-style Q&As
- "Still have questions?" CTA at bottom

### CATEGORIES & QUESTIONS:

**CATEGORY: General**

Q: What is GRATIS?
A: GRATIS is a Dutch charitable foundation (Stichting) that gives away free premium water bottles funded by brand advertising. 100% of our net profits are donated to verified NGOs supporting clean water, arts & culture, and education.

Q: Is this really free?
A: Yes, genuinely free for TRIBE members. Brands pay for visibility on our bottles, which covers all costs. You receive premium bottles without paying anything.

Q: What's the catch?
A: No catch. The bottles feature a small, tasteful brand message from our sponsors. That's the only "cost" to you—carrying a message from brands we've vetted and approve.

Q: How do you make money?
A: We don't—we're a non-profit foundation. Revenue comes from brand sponsorships. After covering bottle production and shipping, 100% of remaining funds go to NGOs.

Q: Is my donation tax-deductible?
A: In the Netherlands, we've applied for ANBI status which would make donations tax-deductible. In the USA, we're filing for 501(c)(3) status. Check your local tax laws.

---

**CATEGORY: TRIBE Membership**

Q: How do I join?
A: Visit gratis.ngo/tribe and create a free account. You can start as an Explorer (free forever) or choose a premium tier.

Q: What are the membership tiers?
A: 
- Explorer (Free): 1 bottle/month, basic dashboard
- Insider (€9.99/mo): 2 bottles/month, voting rights
- Core (€97/year): 4 bottles/month, events, recognition
- Founder (€247 once): Unlimited bottles, lifetime perks

Q: Can I upgrade or downgrade?
A: Yes, anytime from your dashboard. Upgrades are immediate; downgrades take effect at the next billing cycle.

Q: Do unused bottles roll over?
A: No, bottle allowances reset monthly. This keeps things fair for our sponsors and sustainable for us.

Q: How do I cancel?
A: Go to Settings > Membership in your dashboard. Cancel anytime—you'll keep access until the end of your billing period.

---

**CATEGORY: Bottles & Shipping**

Q: How do I get my bottle?
A: Log into your dashboard, click "Claim Bottle," confirm your shipping address, and we'll send it your way.

Q: Where do you ship?
A: Currently Netherlands and EU. USA shipping starts March 15, 2026. More regions coming soon.

Q: How long does shipping take?
A: Netherlands: 2-4 business days. EU: 5-10 business days. USA: 7-14 business days.

Q: Is shipping really free?
A: Yes, shipping is included for all TRIBE members.

Q: What if my bottle arrives damaged?
A: Contact support@gratis.ngo with photos. We'll send a replacement immediately.

Q: Can I choose which brand is on my bottle?
A: Bottle designs rotate based on active sponsors. You'll be surprised with different quality brands each time.

---

**CATEGORY: Impact & Donations**

Q: How does voting work?
A: Each quarter, TRIBE members (Insider tier and above) vote on how to allocate that quarter's funds across our three cause areas. Founders get 2× voting weight.

Q: How do I know my impact is real?
A: We publish quarterly transparency reports, audited annually. Every NGO partner is vetted. You can track your personal contribution in your dashboard.

Q: Can I donate directly?
A: Yes! Visit gratis.ngo/donate to make additional contributions. 100% goes to our NGO fund.

Q: Which NGOs do you support?
A: We partner with verified organizations in clean water (like Water.org), arts & culture, and education. See the full list at gratis.ngo/impact/partners.

---

**CATEGORY: Account & Security**

Q: How do I reset my password?
A: Click "Forgot password" on the login page. You'll receive an email with reset instructions.

Q: How do I delete my account?
A: Go to Settings > Security > Delete Account. This action is permanent.

Q: Is my data safe?
A: Yes. We use industry-standard encryption, never sell your data, and comply with GDPR. See our Privacy Policy for details.

Q: Can I have multiple accounts?
A: No, one account per person. Multiple accounts may be terminated.

---

### SEARCH FUNCTIONALITY:
```typescript
const [searchQuery, setSearchQuery] = useState('');
const [activeCategory, setActiveCategory] = useState('all');

const filteredFAQs = faqs.filter(faq => {
  const matchesSearch = 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
  const matchesCategory = 
    activeCategory === 'all' || faq.category === activeCategory;
  return matchesSearch && matchesCategory;
});
```

### BOTTOM CTA:
"Still have questions?"
"Our support team is here to help."
Email: support@gratis.ngo
Button: "CONTACT US" → /contact

### STRUCTURED DATA:
Add FAQPage schema for SEO:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is GRATIS?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "GRATIS is a Dutch charitable foundation..."
      }
    }
  ]
}
```

### META TAGS:
- Title: "FAQ | GRATIS"
- Description: "Frequently asked questions about GRATIS free water bottles, TRIBE membership, shipping, and charitable impact."

Build complete FAQ page with search and filtering.
```

---

## 12. CONTACT PAGE

```
Build the Contact page with form and contact information.

## PAGE: /contact (src/app/contact/page.tsx)

### LAYOUT:
Two-column on desktop:
- Left: Contact form
- Right: Contact information & office details

### LEFT COLUMN: Contact Form

Headline: "Get in Touch"
Subheadline: "Have a question, partnership idea, or just want to say hi? We'd love to hear from you."

Form fields:
```
Name *
[text input]

Email *
[email input]

Subject *
[dropdown]
- General Inquiry
- Membership Support
- Shipping Issue
- Partnership Opportunity
- Press/Media
- NGO Partnership
- Feedback
- Other

Message *
[textarea, min 50 characters]

☐ I agree to the Privacy Policy

[SEND MESSAGE] button
```

Success state:
"Message sent! We typically respond within 24-48 hours. Check your email for confirmation."

### RIGHT COLUMN: Contact Information

**Email Contacts:**
- General: hello@gratis.ngo
- Support: support@gratis.ngo
- Press: press@gratis.ngo
- Partnerships: partners@gratis.ngo
- Legal: legal@gratis.ngo

**Office Address:**
GRATIS Foundation
[Street Address]
[Postal Code] [City]
Netherlands

**Response Times:**
- General inquiries: 24-48 hours
- Support issues: Same business day
- Partnership requests: 3-5 business days

**Office Hours:**
Monday - Friday: 9:00 - 17:00 CET
Closed weekends and Dutch holidays

**Social Media:**
- Instagram: @gratis.ngo
- LinkedIn: GRATIS Foundation
- Twitter/X: @gratisngo

### MAP (Optional):
Embed Google Maps showing office location (if public)

### FAQ LINK:
"Looking for quick answers? Check our FAQ →"

### FORM SUBMISSION:
```typescript
// API route: src/app/api/contact/route.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { name, email, subject, message } = await request.json();
  
  // Send to team
  await resend.emails.send({
    from: 'GRATIS Contact <noreply@gratis.ngo>',
    to: 'hello@gratis.ngo',
    subject: `[Contact Form] ${subject}: ${name}`,
    html: `
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  });
  
  // Send confirmation to user
  await resend.emails.send({
    from: 'GRATIS <hello@gratis.ngo>',
    to: email,
    subject: 'We received your message',
    html: `
      <p>Hi ${name},</p>
      <p>Thanks for reaching out! We've received your message and will respond within 24-48 hours.</p>
      <p>Best,<br>The GRATIS Team</p>
    `,
  });
  
  return Response.json({ success: true });
}
```

### META TAGS:
- Title: "Contact Us | GRATIS"
- Description: "Get in touch with GRATIS. Questions about membership, partnerships, or impact? We're here to help."

Build complete Contact page with working form submission.
```

---

## 13. NGO PARTNERS OVERVIEW

```
Build the NGO Partners directory page showing all verified partner organizations.

## PAGE: /impact/partners (src/app/impact/partners/page.tsx)

### SECTION 1: Hero
Headline: "Our NGO Partners"
Subheadline: "Every organization is vetted, verified, and committed to measurable impact."

Stats bar:
- [X] Partner Organizations
- €[X] Total Distributed
- [X] Countries Reached

### SECTION 2: Filters
Filter bar:
- Category: All | Clean Water | Arts & Culture | Education
- Region: All | Netherlands | Europe | Global
- Sort: Most Funded | Newest | Alphabetical

### SECTION 3: Partner Grid
Cards for each NGO partner (3 columns desktop, 1 mobile):

```
[Organization Logo - 200x100]

[Organization Name]
[Category Badge]
[Region Badge]

"Brief description of the organization and their mission." (100 chars max)

Funded: €[amount]
Projects: [X]

[LEARN MORE →] → individual partner page
[VISIT WEBSITE →] (external link)
```

### SECTION 4: Partner Details Modal/Page
When clicking "Learn More":

```
[Large Logo]

[Organization Name]
[Category] | [Region]

Mission Statement:
"Full organization mission statement here..."

Impact with GRATIS:
- Total received: €[amount]
- Projects funded: [X]
- People reached: [X]

Current Projects:
- Project Name 1 (Status: Active)
- Project Name 2 (Status: Complete)

Verification:
✓ 501(c)(3) / ANBI Verified
✓ Annual audit published
✓ Impact reports provided

Website: [link]
Contact: [email]
```

### SECTION 5: Become a Partner CTA
Headline: "Are You an NGO Making Impact?"
Subheadline: "Apply to become a GRATIS partner and receive funding for your mission."
Button: "APPLY NOW" → /impact/partners/apply

### DATA STRUCTURE:
```typescript
// Firestore: /ngo_partners/{id}
interface NGOPartner {
  id: string;
  name: string;
  logo: string;
  category: 'water' | 'arts' | 'education';
  region: 'netherlands' | 'europe' | 'global';
  description: string;
  missionStatement: string;
  website: string;
  email: string;
  fundsReceived: number;
  projectsCount: number;
  peopleReached: number;
  verificationStatus: {
    taxExempt: boolean;
    auditPublished: boolean;
    impactReported: boolean;
  };
  projects: Array<{
    name: string;
    status: 'active' | 'complete';
    description: string;
  }>;
  joinedAt: Timestamp;
}
```

### META TAGS:
- Title: "NGO Partners | GRATIS Impact"
- Description: "Meet the verified NGOs receiving GRATIS funding. Clean water, arts, and education organizations creating real impact."

Build complete NGO Partners directory with filtering.
```

---

## 14. DONATE PAGE

```
Build the Donate page for direct monetary contributions.

## PAGE: /donate (src/app/donate/page.tsx)

### SECTION 1: Hero
Headline: "Amplify Your Impact"
Subheadline: "Already a TRIBE member? Go further. Every euro donated goes directly to our NGO partners."

Note: "TRIBE membership already contributes through our bottle program. This is for additional giving."

### SECTION 2: Donation Form

**Amount Selection:**
```
Choose Amount:

[€10] [€25] [€50] [€100] [€250] [Custom]

Custom: €[______]
```

**Allocation Choice:**
```
Where should your donation go?

○ Let GRATIS Decide (based on current needs)
○ Clean Water (40% default)
○ Arts & Culture (30% default)  
○ Education (30% default)
○ Split Equally (33.3% each)
```

**Frequency:**
```
○ One-time donation
○ Monthly recurring
```

**Donor Information:**
```
First Name
[input]

Last Name
[input]

Email
[input]

☐ Make my donation anonymous
  (Your name won't appear in public recognition)

☐ I'm donating on behalf of a company
  [Company Name if checked]
```

**Payment:**
Stripe Elements:
```
Card Number
[Stripe element]

Or pay with:
[iDEAL] [SEPA] [Crypto]
```

**Order Summary:**
```
Donation: €[amount]
Frequency: [One-time/Monthly]
Allocation: [Choice]
───────────────
Total: €[amount]

[COMPLETE DONATION]
```

### SECTION 3: Circle of Impact (Donor Recognition)
"Join our Circle of Impact"

Tier recognition for cumulative donations:
- **Friend** (€1-99): Name on Impact page
- **Supporter** (€100-499): Name + badge
- **Champion** (€500-999): Name + badge + quarterly call
- **Guardian** (€1,000-4,999): All above + annual report mention
- **Benefactor** (€5,000+): All above + permanent recognition + VIP access

### SECTION 4: Tax Information
```
Tax-Deductible Donations:

🇳🇱 Netherlands: ANBI status applied for. Donations may be tax-deductible.
🇺🇸 United States: 501(c)(3) filing in progress. Donations may be tax-deductible.
🌍 Other: Check your local tax laws for charitable donation deductions.

We provide receipts for all donations.
```

### SECTION 5: Trust Signals
- "100% of donations go to NGO partners"
- "Audited quarterly by [Auditor]"
- "Detailed reports on fund allocation"
- [View Impact Dashboard →]

### CONFIRMATION PAGE:
```
Thank You for Your Generosity! 🎉

Donation confirmed: €[amount]
Allocation: [choice]
Reference: DON-[ID]

A receipt has been sent to [email].

Your impact:
This donation will fund approximately:
- [X] liters of clean water, or
- [X] arts supplies for students, or
- [X] educational materials

[VIEW YOUR IMPACT] [SHARE ON SOCIAL]
```

### STRIPE INTEGRATION:
```typescript
// API route for donations
export async function POST(request: Request) {
  const { amount, allocation, frequency, donorInfo } = await request.json();
  
  const session = await stripe.checkout.sessions.create({
    mode: frequency === 'monthly' ? 'subscription' : 'payment',
    line_items: [{
      price_data: {
        currency: 'eur',
        product_data: {
          name: `GRATIS Donation - ${allocation}`,
        },
        unit_amount: amount * 100,
        ...(frequency === 'monthly' && {
          recurring: { interval: 'month' }
        }),
      },
      quantity: 1,
    }],
    metadata: {
      type: 'donation',
      allocation,
      donorName: donorInfo.anonymous ? 'Anonymous' : `${donorInfo.firstName} ${donorInfo.lastName}`,
      donorEmail: donorInfo.email,
    },
    success_url: `${process.env.NEXT_PUBLIC_URL}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/donate`,
  });
  
  return Response.json({ url: session.url });
}
```

### META TAGS:
- Title: "Donate | GRATIS"
- Description: "Make a direct donation to GRATIS NGO partners. 100% of your contribution supports clean water, arts, and education initiatives."

Build complete Donate page with Stripe integration.
```

---

## 15. PRODUCTS OVERVIEW

```
Build the Products overview page showing all GRATIS bottle options.

## PAGE: /products (src/app/products/page.tsx)

### SECTION 1: Hero
Headline: "The GRATIS Collection"
Subheadline: "Premium bottles. Zero cost. 100% impact."

### SECTION 2: Product Grid
Three product cards (equal sizing):

**GRATIS WATER** [LIVE]
- Large image (500x500)
- Badge: "AVAILABLE NOW" (hot-lime)
- Name: "GRATIS Water"
- Tagline: "Pure. Simple. Impactful."
- Price: "FREE" (with strikethrough €24.99)
- Brief: "Our flagship bottle. Clean design, premium quality."
- CTA: "GET FREE" → /products/water

**GRATIS THEURGY** [PRE-ORDER]
- Large image placeholder
- Badge: "COMING SOON" (electric-blue)
- Name: "GRATIS Theurgy"
- Tagline: "Mystical. Elevated. Transformative."
- Price: "FREE" 
- Brief: "Infused with trace adaptogens. For seekers."
- CTA: "JOIN WAITLIST" → /products/theurgy

**GRATIS F.U.** [PRE-ORDER]
- Large image placeholder
- Badge: "COMING SOON" (solar-orange)
- Name: "GRATIS F.U."
- Tagline: "Free & Unfiltered."
- Price: "FREE"
- Brief: "Natural caffeine. Bold design. Pure energy."
- CTA: "JOIN WAITLIST" → /products/fu

### SECTION 3: Comparison Table
```
| Feature | Water | Theurgy | F.U. |
|---------|-------|---------|------|
| Status | Live | Pre-order | Pre-order |
| Capacity | 500ml | 500ml | 500ml |
| Material | Tritan | Tritan | Tritan |
| Special | Classic | Adaptogens | Caffeine |
| Design | Clean | Gradient | Street Art |
```

### SECTION 4: How It Works
Brief explanation:
"All bottles are free for TRIBE members. Brands sponsor the bottles. You get premium products. 100% of profits go to charity."

Diagram: [Brand Sponsors] → [GRATIS] → [Free to You] → [Charity]

### SECTION 5: CTA
"Not a TRIBE member yet?"
"Join free and start claiming bottles today."
Button: "JOIN TRIBE" → /tribe

### META TAGS:
- Title: "Products | GRATIS"
- Description: "Explore the GRATIS collection. Free premium water bottles including GRATIS Water, Theurgy, and F.U. Join TRIBE to claim yours."

Build complete Products overview page.
```

---

# P2 - NICE TO HAVE PAGES

---

## 16. GRATIS THEURGY PRODUCT PAGE

```
Build the GRATIS Theurgy product page - our premium adaptogen-infused bottle (pre-order).

## PAGE: /products/theurgy (src/app/products/theurgy/page.tsx)

### Same structure as GRATIS Water page but with:

**Product Details:**
- Name: GRATIS Theurgy
- Tagline: "Mystical. Elevated. Transformative."
- Status: PRE-ORDER (launching Q2 2026)
- Design: Gradient hot-magenta to electric-blue
- Special: 99.99% pure water + trace adaptogens
- Adaptogens: Ashwagandha, Rhodiola, Lion's Mane (trace amounts)

**Waitlist Flow:**
Instead of "Claim Bottle":
```
Be First to Experience Theurgy

Join the waitlist for exclusive early access.

Email: [input]
☐ Notify me when available

[JOIN WAITLIST]

[X] people on waitlist
```

**Unique Content:**
- Section about adaptogens and their benefits
- "Designed for seekers" messaging
- Disclaimer: "These statements have not been evaluated by health authorities."

Build complete Theurgy page with waitlist functionality.
```

---

## 17. GRATIS F.U. PRODUCT PAGE

```
Build the GRATIS F.U. product page - our energy/caffeine bottle (pre-order).

## PAGE: /products/fu (src/app/products/fu/page.tsx)

### Same structure as GRATIS Water page but with:

**Product Details:**
- Name: GRATIS F.U. (Free & Unfiltered)
- Tagline: "Free & Unfiltered."
- Status: PRE-ORDER (launching Q3 2026)
- Design: Solar-orange + jet-black, street art aesthetic
- Special: Natural caffeine (50mg from green tea)
- Vibe: Bold, unapologetic, energetic

**Unique Content:**
- Caffeine content comparison chart
- "For those who don't hold back" messaging
- Energy without the crash positioning

Build complete F.U. page with waitlist functionality.
```

---

## 18. CORPORATE GIVING

```
Build the Corporate Giving page for business partnerships and bulk donations.

## PAGE: /donate/corporate (src/app/donate/corporate/page.tsx)

### Content:
- Corporate partnership tiers
- Bulk donation options
- Employee engagement programs
- Tax benefits for businesses
- Contact form for corporate inquiries
- Case studies/testimonials from corporate partners

### Partnership Tiers:
- **Bronze** (€5,000/year): Logo on website, 50 bottles for team
- **Silver** (€15,000/year): Above + event sponsorship, 200 bottles
- **Gold** (€50,000/year): Above + named project, 500 bottles
- **Platinum** (€100,000+/year): Custom partnership, unlimited benefits

Build complete Corporate Giving page with inquiry form.
```

---

## 19. NGO APPLICATION FORM

```
Build the NGO Application page for organizations wanting to become partners.

## PAGE: /impact/partners/apply (src/app/impact/partners/apply/page.tsx)

### Multi-step application form:

**Step 1: Organization Info**
- Organization name
- Legal structure
- Registration number
- Country
- Website
- Year founded

**Step 2: Mission & Impact**
- Mission statement
- Primary cause area (Water/Arts/Education)
- Geographic focus
- Annual budget
- People served annually

**Step 3: Verification**
- Tax-exempt status proof (upload)
- Most recent audit report (upload)
- Annual report (upload)
- Key contact person

**Step 4: Review & Submit**
- Summary of application
- Terms agreement
- Submit

Build complete NGO application with file uploads.
```

---

## 20. TEAM PAGE

```
Build the Team page showing GRATIS leadership and board.

## PAGE: /about/team (src/app/about/team/page.tsx)

### Content:
- Leadership section with photos, bios, LinkedIn links
- Board of Directors section
- Advisory Board (if any)
- Join Us CTA for careers

### Team Members:
- Eric Burnik, Chairman
- [Name], Director
- Dr. Sofia van Raalte, Board Member
- Mr. Amir Chaudhry, Board Member

Build complete Team page with professional layout.
```

---

## 21. PRESS/MEDIA KIT

```
Build the Press/Media Kit page for journalists and media.

## PAGE: /press (src/app/press/page.tsx)

### Content:
- Press releases (downloadable)
- Brand assets (logos, images)
- Fact sheet
- Founder bio
- Contact for press inquiries
- Featured coverage

### Downloads:
- Logo pack (ZIP)
- Press release (PDF)
- Fact sheet (PDF)
- High-res photos (ZIP)
- Brand guidelines (PDF)

Build complete Press page with download links.
```

---

## 22. CAREERS PAGE

```
Build the Careers page for job listings.

## PAGE: /careers (src/app/careers/page.tsx)

### Content:
- "Join our mission" hero
- Company culture section
- Benefits overview
- Current openings (or "No openings" state)
- Application process
- Contact for inquiries

Build complete Careers page.
```

---

# GLOBAL COMPONENTS

---

## 23. NAVIGATION HEADER

```
Build the global navigation header component.

## COMPONENT: src/components/layout/Header.tsx

### Desktop Navigation:
```
[GRATIS Logo]  [GRATIS ▼] [TRIBE ▼] [IMPACT ▼] [ABOUT ▼]  [Search] [Login/Dashboard] [CTA Button]
```

**Dropdown Menus:**

GRATIS:
- All Products
- GRATIS Water (Live)
- GRATIS Theurgy (Coming Soon)
- GRATIS F.U. (Coming Soon)

TRIBE:
- Overview
- Membership Tiers
- Dashboard (if logged in)

IMPACT:
- Impact Dashboard
- NGO Partners
- Donate
- Reports

ABOUT:
- Our Story
- Team
- FAQ
- Press
- Careers
- Contact

### Mobile Navigation:
- Hamburger menu
- Full-screen overlay
- Accordion-style dropdowns

### States:
- Default (logged out): Show "Log In" and "Join Free" buttons
- Logged in: Show avatar dropdown with Dashboard, Settings, Logout

### Styling:
- Transparent on hero sections, solid on scroll
- Sticky positioning
- Smooth transitions

Build complete Header component with all states.
```

---

## 24. FOOTER

```
Build the global footer component.

## COMPONENT: src/components/layout/Footer.tsx

### Structure:
```
─────────────────────────────────────────────────────────
[GRATIS Logo]          GRATIS        COMMUNITY      COMPANY       LEGAL
Charity Never          Water         TRIBE          About         Privacy
Looked This Bold       Theurgy       Impact         Team          Terms
                       F.U.          NGOs           Press         Cookies
                                     Donate         Careers       Accessibility
                                                    Contact

[Instagram] [LinkedIn] [Twitter]     [Newsletter Signup]

─────────────────────────────────────────────────────────
© 2026 GRATIS Foundation. Stichting registered in Netherlands.
KVK: [Number] | ANBI: [Pending]
```

### Newsletter Signup:
```
Stay Updated
[Email input] [Subscribe]
```

### Styling:
- Jet-black background
- White/gray text
- Hot-lime accents on hover

Build complete Footer component.
```

---

## 25. AUTH CONTEXT & PROTECTED ROUTES

```
Build the authentication context and route protection system.

## FILES:
- src/contexts/AuthContext.tsx
- src/components/auth/ProtectedRoute.tsx
- src/hooks/useAuth.ts

### AuthContext:
```typescript
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  tribeTier: 'explorer' | 'insider' | 'core' | 'founder';
  bottlesClaimed: number;
  joinedAt: Date;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await auth.signOut();
    setUser(null);
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### ProtectedRoute:
```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=' + window.location.pathname);
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
```

Build complete auth system with all hooks and components.
```

---

## 26. SHARED UI COMPONENTS

```
Build shared UI components used across the site.

## COMPONENTS TO BUILD:

### Button (src/components/ui/Button.tsx)
Variants: primary, secondary, ghost, danger
Sizes: sm, md, lg
States: default, hover, active, disabled, loading

### Input (src/components/ui/Input.tsx)
Types: text, email, password, textarea
States: default, focus, error, disabled
With label, helper text, error message

### Card (src/components/ui/Card.tsx)
Variants: default, elevated, outlined
With optional header, footer, image

### Badge (src/components/ui/Badge.tsx)
Variants: live (hot-lime), preorder (electric-blue), coming (solar-orange)

### Modal (src/components/ui/Modal.tsx)
With header, body, footer
Close on overlay click or ESC
Focus trap for accessibility

### Accordion (src/components/ui/Accordion.tsx)
Single or multi-open modes
Smooth animation
Icon rotation

### Tabs (src/components/ui/Tabs.tsx)
Horizontal tabs with content panels
Keyboard navigation

### Toast (src/components/ui/Toast.tsx)
Variants: success, error, warning, info
Auto-dismiss with progress bar
Stackable

### Loading States
- Spinner
- Skeleton
- Progress bar

### Form Components
- Checkbox
- Radio
- Select/Dropdown
- Toggle switch

Build all shared components with TypeScript interfaces and Tailwind styling.
```

---

# DEPLOYMENT CHECKLIST

```
## Pre-Launch Checklist for Firebase Studio

### Environment Variables (.env.local):
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

NEXT_PUBLIC_URL=https://gratis.ngo
```

### Firebase Setup:
1. Create Firebase project
2. Enable Authentication (Email/Password, Google, Apple)
3. Create Firestore database with security rules
4. Set up Firebase Hosting
5. Deploy Cloud Functions for webhooks

### Stripe Setup:
1. Create Stripe account
2. Add products (Insider, Core, Founder)
3. Configure webhook endpoint
4. Test in test mode first

### Domain Setup:
1. Verify gratis.ngo domain
2. Configure DNS for Firebase Hosting
3. Enable SSL

### Testing:
1. Test all auth flows
2. Test payment flows in Stripe test mode
3. Test bottle claiming
4. Test on mobile devices
5. Run Lighthouse audit
6. Check accessibility (WCAG 2.1 AA)

### Launch:
1. Switch Stripe to live mode
2. Update environment variables
3. Deploy to production
4. Monitor error tracking
5. Set up analytics
```

---

**END OF PROMPTS**

Total: 26 comprehensive prompts covering all pages and components.
Each prompt is self-contained and copy-paste ready for Firebase Studio.
```
