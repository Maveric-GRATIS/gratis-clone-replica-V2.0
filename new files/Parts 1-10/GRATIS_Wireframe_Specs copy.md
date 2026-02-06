# GRATIS.NGO - Complete Wireframe Specifications
## Engineering Blueprint for MVP Launch (February 14, 2026)

**Version:** 1.0  
**Last Updated:** January 14, 2025  
**Prepared for:** Engineering Team (Firebase Studio)  
**Prepared by:** MAV€RIC / Claude AI  

---

## TABLE OF CONTENTS

1. [Global Components](#1-global-components)
2. [Home Page](#2-home-page)
3. [GRATIS Products](#3-gratis-products)
4. [RIG Merch Store](#4-rig-merch-store)
5. [ARCANE Events](#5-arcane-events)
6. [TRIBE Community](#6-tribe-community)
7. [IMPACT TV Media](#7-impact-tv-media)
8. [SPARK Action Hub](#8-spark-action-hub)
9. [Authentication & Account](#9-authentication--account)
10. [E-commerce System](#10-e-commerce-system)
11. [Legal Pages](#11-legal-pages)
12. [Footer Pages](#12-footer-pages)

---

## DESIGN SYSTEM REFERENCE

### Color Palette (Locked)
```css
--hot-lime-green: #C1FF00;
--electric-blue: #00AFFF;
--hot-magenta: #FF0077;
--solar-orange: #FF5F00;
--jet-black: #000000;
--pure-white: #FFFFFF;
--dark-gray: #1A1A1A;
--medium-gray: #333333;
```

### Typography
```css
/* Headlines */
font-family: 'Space Grotesk', sans-serif;
/* OR */
font-family: 'Clash Display', sans-serif;

/* Body */
font-family: 'Inter', sans-serif;
/* OR */
font-family: 'Plus Jakarta Sans', sans-serif;
```

### Spacing System
```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;
--space-4xl: 96px;
```

### Breakpoints
```css
--mobile: 320px;
--tablet: 768px;
--desktop: 1024px;
--wide: 1440px;
--ultrawide: 1920px;
```

---

## 1. GLOBAL COMPONENTS

### 1.1 Navigation Bar (Navbar)

**Component:** `<Navbar />`  
**Position:** Fixed top, full width  
**Height:** 72px desktop / 64px mobile  
**Background:** Jet Black with 95% opacity blur  

#### Desktop Layout (≥1024px)
```
┌────────────────────────────────────────────────────────────────────────────┐
│  [LOGO]     GRATIS  RIG  ARCANE  TRIBE  IMPACT TV  SPARK    🔍  👤  🛒    │
└────────────────────────────────────────────────────────────────────────────┘
```

#### Mobile Layout (<1024px)
```
┌────────────────────────────────────────────────────────────────────────────┐
│  [☰]                         [LOGO]                              👤  🛒   │
└────────────────────────────────────────────────────────────────────────────┘
```

#### Navbar Elements

| Element | Type | Behavior | Notes |
|---------|------|----------|-------|
| Logo | Image/SVG | Click → Home | Animated on hover |
| GRATIS | Dropdown | Hover → Mega menu | Products submenu |
| RIG | Dropdown | Hover → Mega menu | 11 collection items |
| ARCANE | Link | Click → /arcane | No submenu |
| TRIBE | Dropdown | Hover → Mega menu | 5 HEART items |
| IMPACT TV | Dropdown | Hover → Mega menu | 5 UNITY items |
| SPARK | Dropdown | Hover → Mega menu | 4 VIBE items |
| Search | Icon button | Click → Search modal | Magnifying glass |
| Account | Icon button | Click → /signin or /account | User icon |
| Cart | Icon button | Click → Cart drawer | Badge with count |

#### Mega Menu Structure (Example: GRATIS)
```
┌─────────────────────────────────────────────────────────────────┐
│  GRATIS                                                         │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  [IMG]           [IMG]           [IMG]                         │
│  WATER           THEURGY         F.U.                          │
│  Pure hydration  Functional      Rebellious                    │
│  for impact      wellness        energy                        │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  [Shop All Products →]                                          │
└─────────────────────────────────────────────────────────────────┘
```

#### Data Requirements
```typescript
interface NavItem {
  label: string;
  href: string;
  acrosticLetter?: string;
  children?: NavItem[];
  image?: string;
  description?: string;
}

const navigation: NavItem[] = [
  {
    label: "GRATIS",
    href: "/gratis",
    children: [
      { label: "Water", href: "/gratis/water", image: "/images/water-nav.jpg", description: "Pure hydration for impact" },
      { label: "Theurgy", href: "/gratis/theurgy", image: "/images/theurgy-nav.jpg", description: "Functional wellness" },
      { label: "F.U.", href: "/gratis/fu", image: "/images/fu-nav.jpg", description: "Rebellious energy" }
    ]
  },
  // ... etc
];
```

---

### 1.2 Footer

**Component:** `<Footer />`  
**Background:** Jet Black  
**Padding:** 64px top, 32px bottom  

#### Desktop Layout
```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│  [LOGO]                                                                    │
│                                                                            │
│  Charity Never Looked This Bold                                            │
│                                                                            │
│  ─────────────────────────────────────────────────────────────────────────│
│                                                                            │
│  FOLLOW GRATIS    GIVING         REPORTS        ACCREDITATION             │
│  ○ TikTok         ○ Corporate    ○ Policies     ○ Compliance              │
│  ○ Instagram      ○ Honor &      ○ Annual       ○ Leadership              │
│  ○ Pinterest        Memorial       Reports      ○ EIN                     │
│  ○ X              ○ All Ways     ○ In-Kind      ○ ANBI Status             │
│  ○ Facebook       ○ Monthly      ○ Donation     ○ Rating                  │
│  ○ LinkedIn       ○ Phone/Mail/    Policies                               │
│  ○ YouTube          Crypto                                                │
│                                                                            │
│  TRANSPARENCY     INFORMATION                                              │
│  ○ Terms of Use   ○ Contact                                               │
│  ○ Rights         ○ Organization                                          │
│  ○ User Privacy   ○ News                                                  │
│  ○ Tracking       ○ Network                                               │
│  ○ Help           ○ Employment                                            │
│  ○ Safety         ○ Communications                                        │
│                   ○ Team                                                  │
│                                                                            │
│  ─────────────────────────────────────────────────────────────────────────│
│                                                                            │
│  NEWSLETTER                                                                │
│  ┌─────────────────────────────────────────┐  ┌──────────┐                │
│  │ Enter your email                        │  │ SUBSCRIBE│                │
│  └─────────────────────────────────────────┘  └──────────┘                │
│                                                                            │
│  ─────────────────────────────────────────────────────────────────────────│
│                                                                            │
│  © 2026 GRATIS.NGO | Stichting GRATIS | KVK: XXXXXXXX                     │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

#### Footer Data Structure
```typescript
interface FooterSection {
  title: string;
  acrostic?: string;
  links: {
    label: string;
    href: string;
    external?: boolean;
    acrosticLetter?: string;
  }[];
}

const footerSections: FooterSection[] = [
  {
    title: "Follow GRATIS",
    links: [
      { label: "TikTok", href: "https://tiktok.com/@gratis.ngo", external: true },
      { label: "Instagram", href: "https://instagram.com/gratis.ngo", external: true },
      // ...
    ]
  },
  {
    title: "Giving",
    acrostic: "CHAMP",
    links: [
      { label: "Corporate Giving", href: "/giving/corporate", acrosticLetter: "C" },
      { label: "Honor & Memorial Gifts", href: "/giving/honor-memorial", acrosticLetter: "H" },
      // ...
    ]
  },
  // ...
];
```

---

### 1.3 Cookie Consent Banner

**Component:** `<CookieConsent />`  
**Position:** Fixed bottom  
**Behavior:** Shows on first visit, remembers preference  

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│  🍪 We use cookies to enhance your experience.                             │
│                                                                            │
│  [Manage Preferences]    [Reject All]    [Accept All]                      │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

#### Cookie Categories
- **Essential:** Always on (authentication, cart)
- **Analytics:** Google Analytics, Hotjar
- **Marketing:** Social media pixels, retargeting

---

### 1.4 Search Modal

**Component:** `<SearchModal />`  
**Trigger:** Click search icon in navbar  
**Animation:** Fade in from top  

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                              [✕ Close]     │
│                                                                            │
│         ┌─────────────────────────────────────────────────────────┐        │
│         │ 🔍 Search products, collections, and more...            │        │
│         └─────────────────────────────────────────────────────────┘        │
│                                                                            │
│         POPULAR SEARCHES                                                   │
│         Water  •  Hoodie  •  Limited Edition  •  Theurgy                  │
│                                                                            │
│         TRENDING PRODUCTS                                                  │
│         [IMG] GRATIS Water 500ml                                          │
│         [IMG] Charmed Cozies Hoodie                                       │
│         [IMG] Dazzle Drip Tumbler                                         │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

### 1.5 Cart Drawer

**Component:** `<CartDrawer />`  
**Position:** Slides in from right  
**Width:** 420px desktop / Full width mobile  

```
┌──────────────────────────────────────┐
│  YOUR CART (3)              [✕]     │
│  ─────────────────────────────────  │
│                                      │
│  [IMG]  GRATIS Water 500ml           │
│         Variant: Classic             │
│         €2.50                        │
│         [−] 2 [+]         [Remove]   │
│                                      │
│  [IMG]  Charmed Cozies Hoodie        │
│         Size: M / Black              │
│         €89.00                       │
│         [−] 1 [+]         [Remove]   │
│                                      │
│  ─────────────────────────────────  │
│                                      │
│  Subtotal               €94.00       │
│  Shipping               Calculated   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │      CHECKOUT (€94.00)       │   │
│  └──────────────────────────────┘   │
│                                      │
│  [Continue Shopping]                 │
│                                      │
│  ─────────────────────────────────  │
│  🎁 Free shipping on orders €50+    │
│                                      │
└──────────────────────────────────────┘
```

---

### 1.6 Toast Notifications

**Component:** `<Toast />`  
**Position:** Bottom right (desktop) / Bottom center (mobile)  
**Duration:** 4 seconds auto-dismiss  

```
Types:
✅ Success: "Added to cart!"
⚠️ Warning: "Only 3 left in stock"
❌ Error: "Payment failed. Please try again."
ℹ️ Info: "Pre-orders ship March 2026"
```

---

## 2. HOME PAGE

**URL:** `/`  
**Purpose:** Landing page introducing GRATIS mission, products, and impact  
**Priority:** P0 (Must have for MVP)  

### 2.1 Page Structure

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              [NAVBAR]                                      │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                           HERO SECTION                                     │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                         IMPACT STATS BAR                                   │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                      THREE PILLARS SECTION                                 │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                      PRODUCT SHOWCASE                                      │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                      HOW IT WORKS                                          │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                      TRIBE CTA SECTION                                     │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                      PARTNER LOGOS                                         │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                      TESTIMONIALS                                          │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                              [FOOTER]                                      │
└────────────────────────────────────────────────────────────────────────────┘
```

---

### 2.2 Hero Section

**Component:** `<HeroSection />`  
**Height:** 100vh (full viewport)  
**Background:** Video or animated gradient mesh  

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│                    [VIDEO/ANIMATION BACKGROUND]                            │
│                                                                            │
│                                                                            │
│                         G R A T I S                                        │
│                                                                            │
│              Giving Resources to Achieve                                   │
│         Transformative and Impactful Change                                │
│                                                                            │
│                                                                            │
│           Charity Never Looked This Bold                                   │
│                                                                            │
│                                                                            │
│      ┌─────────────────┐    ┌─────────────────┐                           │
│      │   SHOP NOW      │    │   JOIN TRIBE    │                           │
│      └─────────────────┘    └─────────────────┘                           │
│                                                                            │
│                                                                            │
│                           [↓ SCROLL]                                       │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

#### Hero Data
```typescript
interface HeroContent {
  headline: string;          // "G R A T I S"
  subheadline: string;       // "Giving Resources to Achieve..."
  tagline: string;           // "Charity Never Looked This Bold"
  primaryCTA: {
    label: string;           // "SHOP NOW"
    href: string;            // "/shop"
  };
  secondaryCTA: {
    label: string;           // "JOIN TRIBE"
    href: string;            // "/tribe"
  };
  backgroundVideo?: string;  // URL to video
  backgroundImage?: string;  // Fallback image
}
```

#### Animation Notes
- Logo letters animate in one by one (stagger 100ms)
- Gradient mesh animates slowly in background
- Scroll indicator pulses
- CTAs have hover glow effect (lime green)

---

### 2.3 Impact Stats Bar

**Component:** `<ImpactStatsBar />`  
**Background:** Hot Lime Green (#C1FF00)  
**Text:** Jet Black  

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│      127K+              254K+              89               100%           │
│    € DONATED         LITERS PROVIDED    COMMUNITIES      TO CHARITY       │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

#### Stats Data
```typescript
interface ImpactStat {
  value: string;        // "127K+"
  label: string;        // "€ DONATED"
  animate?: boolean;    // Count up animation
}

const impactStats: ImpactStat[] = [
  { value: "127K+", label: "€ DONATED", animate: true },
  { value: "254K+", label: "LITERS PROVIDED", animate: true },
  { value: "89", label: "COMMUNITIES", animate: true },
  { value: "100%", label: "TO CHARITY", animate: false }
];
```

---

### 2.4 Three Pillars Section

**Component:** `<ThreePillars />`  
**Background:** Jet Black  
**Layout:** 3-column grid (stacks on mobile)  

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│                    THE GRATIS DIFFERENCE                                   │
│                                                                            │
│    ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐       │
│    │                  │  │                  │  │                  │       │
│    │      [ICON]      │  │      [ICON]      │  │      [ICON]      │       │
│    │        💧        │  │        ♻️        │  │        ❤️        │       │
│    │                  │  │                  │  │                  │       │
│    │   PURE WATER     │  │   SUSTAINABLE    │  │     SOCIAL       │       │
│    │                  │  │    PACKAGING     │  │     IMPACT       │       │
│    │                  │  │                  │  │                  │       │
│    │  Premium spring  │  │  100% recyclable │  │  100% of net     │       │
│    │  water from      │  │  Tetra Pak with  │  │  profits fund    │       │
│    │  protected       │  │  plant-based     │  │  education,      │       │
│    │  sources         │  │  materials       │  │  water, & arts   │       │
│    │                  │  │                  │  │                  │       │
│    └──────────────────┘  └──────────────────┘  └──────────────────┘       │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

#### Pillars Data
```typescript
interface Pillar {
  icon: string;         // Emoji or icon component
  title: string;
  description: string;
}

const pillars: Pillar[] = [
  {
    icon: "💧",
    title: "PURE WATER",
    description: "Premium spring water from protected sources"
  },
  {
    icon: "♻️",
    title: "SUSTAINABLE PACKAGING",
    description: "100% recyclable Tetra Pak with plant-based materials"
  },
  {
    icon: "❤️",
    title: "SOCIAL IMPACT",
    description: "100% of net profits fund education, water, & arts"
  }
];
```

---

### 2.5 Product Showcase

**Component:** `<ProductShowcase />`  
**Background:** Dark gradient  
**Layout:** Horizontal scroll on mobile, grid on desktop  

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│                         OUR PRODUCTS                                       │
│                                                                            │
│    ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐       │
│    │                  │  │                  │  │                  │       │
│    │    [PRODUCT      │  │    [PRODUCT      │  │    [PRODUCT      │       │
│    │     IMAGE]       │  │     IMAGE]       │  │     IMAGE]       │       │
│    │                  │  │                  │  │                  │       │
│    │      WATER       │  │     THEURGY      │  │       F.U.       │       │
│    │                  │  │                  │  │                  │       │
│    │   Pure Impact    │  │  Wellness Magic  │  │  Rebellious      │       │
│    │                  │  │                  │  │  Energy          │       │
│    │     €2.50        │  │   COMING SOON    │  │   COMING SOON    │       │
│    │                  │  │                  │  │                  │       │
│    │   [SHOP NOW]     │  │   [PRE-ORDER]    │  │   [PRE-ORDER]    │       │
│    │                  │  │                  │  │                  │       │
│    └──────────────────┘  └──────────────────┘  └──────────────────┘       │
│                                                                            │
│                       [VIEW ALL PRODUCTS →]                                │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

#### Product Card Data
```typescript
interface ProductCard {
  id: string;
  name: string;
  tagline: string;
  price?: number;
  image: string;
  href: string;
  status: 'available' | 'preorder' | 'coming_soon';
  ctaLabel: string;
}
```

---

### 2.6 How It Works

**Component:** `<HowItWorks />`  
**Background:** White or very light gray  
**Layout:** 4-step horizontal flow  

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│                        HOW GRATIS WORKS                                    │
│                                                                            │
│      ①              ②              ③              ④                       │
│      │              │              │              │                       │
│    [ICON]        [ICON]        [ICON]        [ICON]                       │
│                                                                            │
│   BRANDS PAY    WE PRODUCE     YOU GET      PROFITS GO                    │
│   TO ADVERTISE  FREE WATER     FREE WATER   TO CHARITY                    │
│                                                                            │
│   Premium ad    High-quality   Pick up at   100% of net                   │
│   space on      sustainable    distribution profits fund                  │
│   our packs     packaging      points       global causes                 │
│                                                                            │
│              ─────────────→─────────────→─────────────→                   │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

### 2.7 TRIBE CTA Section

**Component:** `<TribeCTA />`  
**Background:** Gradient (Magenta to Blue)  
**Purpose:** Drive membership signups  

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│  ████████████████████████████████████████████████████████████████████████  │
│  █                                                                      █  │
│  █                    JOIN THE TRIBE                                    █  │
│  █                                                                      █  │
│  █         Become a founding member and get exclusive                   █  │
│  █         access to drops, events, and the movement.                   █  │
│  █                                                                      █  │
│  █                                                                      █  │
│  █     ✓ Free shipping on all orders                                    █  │
│  █     ✓ Early access to limited editions                               █  │
│  █     ✓ Exclusive events and experiences                               █  │
│  █     ✓ Voting rights on NGO partnerships                              █  │
│  █                                                                      █  │
│  █                                                                      █  │
│  █              ┌─────────────────────────────┐                         █  │
│  █              │   BECOME A FOUNDER (€247)   │                         █  │
│  █              └─────────────────────────────┘                         █  │
│  █                                                                      █  │
│  █              [Or start free →]                                       █  │
│  █                                                                      █  │
│  ████████████████████████████████████████████████████████████████████████  │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

### 2.8 Partner Logos

**Component:** `<PartnerLogos />`  
**Background:** White  
**Layout:** Logo carousel or grid  

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│                    TRUSTED BY LEADING BRANDS                               │
│                                                                            │
│     [Netflix]   [Nike]   [KLM]   [Ben & Jerry's]   [Free a Girl]          │
│                                                                            │
│                    [Black Jaguar Foundation]                               │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

### 2.9 Testimonials

**Component:** `<Testimonials />`  
**Background:** Jet Black  
**Layout:** Carousel with 3 visible cards  

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│                     WHAT PEOPLE ARE SAYING                                 │
│                                                                            │
│  [←]  ┌────────────┐  ┌────────────┐  ┌────────────┐  [→]                 │
│       │            │  │            │  │            │                       │
│       │  "GRATIS   │  │  "Finally  │  │  "Love     │                       │
│       │  changed   │  │  a brand   │  │  that my   │                       │
│       │  how I     │  │  that      │  │  purchase  │                       │
│       │  think     │  │  walks     │  │  actually  │                       │
│       │  about     │  │  the       │  │  means     │                       │
│       │  giving."  │  │  talk."    │  │  something"│                       │
│       │            │  │            │  │            │                       │
│       │  — Sarah   │  │  — Mike    │  │  — Aisha   │                       │
│       │  Amsterdam │  │  London    │  │  Dubai     │                       │
│       │            │  │            │  │            │                       │
│       └────────────┘  └────────────┘  └────────────┘                       │
│                                                                            │
│                         ● ○ ○ ○ ○                                          │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. GRATIS PRODUCTS

### 3.1 GRATIS Landing Page

**URL:** `/gratis`  
**Purpose:** Product category landing for all beverage lines  
**Priority:** P0  

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              [NAVBAR]                                      │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                         GRATIS BEVERAGES                                   │
│                                                                            │
│              Drink Bold. Give Bigger.                                      │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│    ┌──────────────────────────────────────────────────────────────────┐   │
│    │                                                                  │   │
│    │                    [LARGE HERO IMAGE]                            │   │
│    │                                                                  │   │
│    │                         WATER                                    │   │
│    │                                                                  │   │
│    │              Pure hydration. Pure impact.                        │   │
│    │                                                                  │   │
│    │                    [SHOP WATER →]                                │   │
│    │                                                                  │   │
│    └──────────────────────────────────────────────────────────────────┘   │
│                                                                            │
│    ┌──────────────────────────┐  ┌──────────────────────────┐            │
│    │                          │  │                          │            │
│    │      [HERO IMAGE]        │  │      [HERO IMAGE]        │            │
│    │                          │  │                          │            │
│    │        THEURGY           │  │          F.U.            │            │
│    │                          │  │                          │            │
│    │   Functional wellness    │  │   Rebellious energy      │            │
│    │                          │  │                          │            │
│    │   [PRE-ORDER →]          │  │   [PRE-ORDER →]          │            │
│    │                          │  │                          │            │
│    │   ⏰ Coming March 2026   │  │   ⏰ Coming April 2026   │            │
│    │                          │  │                          │            │
│    └──────────────────────────┘  └──────────────────────────┘            │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                       THE GRATIS PROMISE                                   │
│                                                                            │
│     💧 Premium Quality     ♻️ Sustainable     ❤️ 100% Profits Donated      │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                              [FOOTER]                                      │
└────────────────────────────────────────────────────────────────────────────┘
```

---

### 3.2 Water Product Page

**URL:** `/gratis/water`  
**Purpose:** Main product page with variants (sizes, packages, colors)  
**Priority:** P0  

#### Page Structure
```
┌────────────────────────────────────────────────────────────────────────────┐
│                              [NAVBAR]                                      │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌─────────────────────────────────┐  ┌────────────────────────────────┐  │
│  │                                 │  │                                │  │
│  │                                 │  │  GRATIS WATER                  │  │
│  │                                 │  │                                │  │
│  │                                 │  │  ★★★★★ (127 reviews)           │  │
│  │       [MAIN PRODUCT IMAGE]      │  │                                │  │
│  │                                 │  │  €2.50                         │  │
│  │                                 │  │                                │  │
│  │                                 │  │  Pure spring water in          │  │
│  │                                 │  │  sustainable packaging.        │  │
│  │                                 │  │  100% of profits go to         │  │
│  │                                 │  │  charity.                      │  │
│  │                                 │  │                                │  │
│  ├─────────────────────────────────┤  │  ─────────────────────────────│  │
│  │ [thumb] [thumb] [thumb] [thumb] │  │                                │  │
│  └─────────────────────────────────┘  │  SIZE                          │  │
│                                       │  ┌─────┐ ┌─────┐ ┌─────┐      │  │
│                                       │  │330ml│ │500ml│ │1L   │      │  │
│                                       │  └─────┘ └─────┘ └─────┘      │  │
│                                       │                                │  │
│                                       │  PACKAGE                       │  │
│                                       │  ┌─────────┐ ┌─────────┐      │  │
│                                       │  │ Single  │ │ 6-Pack  │      │  │
│                                       │  └─────────┘ └─────────┘      │  │
│                                       │  ┌─────────┐ ┌─────────┐      │  │
│                                       │  │ 12-Pack │ │ 24-Pack │      │  │
│                                       │  └─────────┘ └─────────┘      │  │
│                                       │                                │  │
│                                       │  DESIGN                        │  │
│                                       │  ┌───────┐ ┌───────┐ ┌───────┐│  │
│                                       │  │Classic│ │Urban  │ │Artist ││  │
│                                       │  └───────┘ └───────┘ └───────┘│  │
│                                       │                                │  │
│                                       │  QUANTITY                      │  │
│                                       │  ┌───┐                         │  │
│                                       │  │ 1 │  [−] [+]               │  │
│                                       │  └───┘                         │  │
│                                       │                                │  │
│                                       │  ┌────────────────────────────┐│  │
│                                       │  │     ADD TO CART - €2.50   ││  │
│                                       │  └────────────────────────────┘│  │
│                                       │                                │  │
│                                       │  ❤️ Add to Wishlist            │  │
│                                       │                                │  │
│                                       │  ─────────────────────────────│  │
│                                       │                                │  │
│                                       │  🚚 Free shipping on €50+      │  │
│                                       │  ♻️ 100% recyclable packaging   │  │
│                                       │  ❤️ 100% profits to charity    │  │
│                                       │                                │  │
│                                       └────────────────────────────────┘  │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  [TABS: Details | Ingredients | Sustainability | Reviews]                  │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                                                                      │ │
│  │  DETAILS                                                             │ │
│  │                                                                      │ │
│  │  GRATIS Water is premium spring water sourced from protected         │ │
│  │  aquifers in the Netherlands. Every bottle sold funds education,     │ │
│  │  clean water access, and arts programs worldwide.                    │ │
│  │                                                                      │ │
│  │  • Source: Protected Dutch springs                                   │ │
│  │  • pH Level: 7.2 (naturally balanced)                               │ │
│  │  • Packaging: Tetra Pak with plant-based cap                        │ │
│  │  • Shelf Life: 12 months                                            │ │
│  │                                                                      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                         YOUR IMPACT                                        │
│                                                                            │
│       1 Bottle = 1 Child's Daily Water     │     12-Pack = 1 School Kit   │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                       YOU MIGHT ALSO LIKE                                  │
│                                                                            │
│    [Product Card]  [Product Card]  [Product Card]  [Product Card]         │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                              [FOOTER]                                      │
└────────────────────────────────────────────────────────────────────────────┘
```

#### Product Data Structure
```typescript
interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  variants: ProductVariant[];
  status: 'available' | 'preorder' | 'coming_soon' | 'sold_out';
  tags: string[];
  category: 'water' | 'theurgy' | 'fu' | 'merch';
  rating: number;
  reviewCount: number;
  impactStatement: string;
}

interface ProductVariant {
  id: string;
  name: string;
  type: 'size' | 'package' | 'design' | 'color' | 'flavor';
  options: {
    value: string;
    label: string;
    priceModifier: number;
    available: boolean;
    image?: string;
  }[];
}

// Example Water product
const waterProduct: Product = {
  id: "water-001",
  slug: "gratis-water",
  name: "GRATIS Water",
  description: "Premium spring water in sustainable packaging...",
  shortDescription: "Pure spring water. 100% profits to charity.",
  price: 2.50,
  images: [
    "/images/water-main.jpg",
    "/images/water-angle.jpg",
    "/images/water-back.jpg",
    "/images/water-lifestyle.jpg"
  ],
  variants: [
    {
      id: "size",
      name: "Size",
      type: "size",
      options: [
        { value: "330ml", label: "330ml", priceModifier: -0.50, available: true },
        { value: "500ml", label: "500ml", priceModifier: 0, available: true },
        { value: "1L", label: "1L", priceModifier: 1.00, available: true }
      ]
    },
    {
      id: "package",
      name: "Package",
      type: "package",
      options: [
        { value: "single", label: "Single", priceModifier: 0, available: true },
        { value: "6pack", label: "6-Pack", priceModifier: 12.00, available: true },
        { value: "12pack", label: "12-Pack", priceModifier: 24.00, available: true },
        { value: "24pack", label: "24-Pack", priceModifier: 45.00, available: true }
      ]
    },
    {
      id: "design",
      name: "Design",
      type: "design",
      options: [
        { value: "classic", label: "Classic", priceModifier: 0, available: true, image: "/images/design-classic.jpg" },
        { value: "urban", label: "Urban", priceModifier: 0, available: true, image: "/images/design-urban.jpg" },
        { value: "artist", label: "Artist Edition", priceModifier: 0.50, available: true, image: "/images/design-artist.jpg" }
      ]
    }
  ],
  status: "available",
  tags: ["water", "sustainable", "charity"],
  category: "water",
  rating: 4.8,
  reviewCount: 127,
  impactStatement: "1 bottle = 1 child's daily water access"
};
```

---

### 3.3 Theurgy Product Page

**URL:** `/gratis/theurgy`  
**Purpose:** Functional wellness water line - PRE-ORDER  
**Priority:** P1  

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              [NAVBAR]                                      │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ████████████████████████████████████████████████████████████████████████  │
│  █                                                                      █  │
│  █                         [MYSTIC HERO IMAGE]                          █  │
│  █                                                                      █  │
│  █                           T H E U R G Y                              █  │
│  █                                                                      █  │
│  █                    Functional Water. Ancient Wisdom.                 █  │
│  █                                                                      █  │
│  █                        COMING MARCH 2026                             █  │
│  █                                                                      █  │
│  ████████████████████████████████████████████████████████████████████████  │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                          CHOOSE YOUR PATH                                  │
│                                                                            │
│    ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐       │
│    │                  │  │                  │  │                  │       │
│    │   [CALM IMAGE]   │  │  [ENERGY IMAGE]  │  │   [MIND IMAGE]   │       │
│    │                  │  │                  │  │                  │       │
│    │      CALM        │  │      ENERGY      │  │       MIND       │       │
│    │                  │  │                  │  │                  │       │
│    │   Magnesium      │  │   Caffeine       │  │   Nootropics     │       │
│    │   L-Theanine     │  │   B-Vitamins     │  │   Lion's Mane    │       │
│    │   Chamomile      │  │   Electrolytes   │  │   Alpha-GPC      │       │
│    │                  │  │                  │  │                  │       │
│    │   Find peace.    │  │   Ignite fire.   │  │   Unlock focus.  │       │
│    │                  │  │                  │  │                  │       │
│    │   €4.50          │  │   €4.50          │  │   €5.00          │       │
│    │                  │  │                  │  │                  │       │
│    │  [PRE-ORDER]     │  │  [PRE-ORDER]     │  │  [PRE-ORDER]     │       │
│    │                  │  │                  │  │                  │       │
│    └──────────────────┘  └──────────────────┘  └──────────────────┘       │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                         THE RITUAL                                         │
│                                                                            │
│  Each Theurgy bottle features a unique sigil - collect all 12 in the      │
│  first edition series. Limited to 5,000 of each design.                   │
│                                                                            │
│  [SIGIL GALLERY - 12 MYSTICAL SYMBOLS]                                    │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                    ┌────────────────────────────────┐                      │
│                    │                                │                      │
│                    │   PRE-ORDER NOW                │                      │
│                    │                                │                      │
│                    │   Be among the first to        │                      │
│                    │   experience Theurgy.          │                      │
│                    │                                │                      │
│                    │   ┌────────────────────────┐   │                      │
│                    │   │ JOIN THE WAITLIST      │   │                      │
│                    │   └────────────────────────┘   │                      │
│                    │                                │                      │
│                    │   ⏰ Expected: March 2026     │                      │
│                    │   📦 Ships to: EU, UK, US     │                      │
│                    │                                │                      │
│                    └────────────────────────────────┘                      │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                              [FOOTER]                                      │
└────────────────────────────────────────────────────────────────────────────┘
```

#### Theurgy Variants
```typescript
const theurgyVariants = [
  {
    id: "calm",
    name: "CALM",
    tagline: "Find peace.",
    ingredients: ["Magnesium", "L-Theanine", "Chamomile", "Passionflower"],
    color: "#7B68EE", // Medium slate blue
    price: 4.50,
    benefits: "Stress relief, better sleep, mental clarity"
  },
  {
    id: "energy",
    name: "ENERGY",
    tagline: "Ignite fire.",
    ingredients: ["Natural Caffeine", "B-Vitamins", "Electrolytes", "Ginseng"],
    color: "#FF5F00", // Solar orange
    price: 4.50,
    benefits: "Clean energy, no crash, sustained performance"
  },
  {
    id: "mind",
    name: "MIND",
    tagline: "Unlock focus.",
    ingredients: ["Nootropics", "Lion's Mane", "Alpha-GPC", "Bacopa"],
    color: "#00AFFF", // Electric blue
    price: 5.00,
    benefits: "Enhanced focus, memory support, cognitive boost"
  }
];
```

---

### 3.4 F.U. Product Page

**URL:** `/gratis/fu`  
**Purpose:** Rebellious functional water line - PRE-ORDER  
**Priority:** P1  

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              [NAVBAR]                                      │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ████████████████████████████████████████████████████████████████████████  │
│  █                                                                      █  │
│  █                      [GRAFFITI/EDGY HERO]                            █  │
│  █                                                                      █  │
│  █                            F . U .                                   █  │
│  █                                                                      █  │
│  █                  Functional. Unapologetic.                           █  │
│  █                                                                      █  │
│  █                       COMING APRIL 2026                              █  │
│  █                                                                      █  │
│  ████████████████████████████████████████████████████████████████████████  │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                        THE F.U. MANIFESTO                                  │
│                                                                            │
│   "F.U. to boring water. F.U. to fake energy drinks.                      │
│    F.U. to brands that don't give back.                                   │
│    This is water with attitude. This is hydration with purpose.           │
│    This is your middle finger to the status quo."                         │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                          THE LINEUP                                        │
│                                                                            │
│    ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐       │
│    │                  │  │                  │  │                  │       │
│    │   [FURY IMAGE]   │  │  [FLASH IMAGE]   │  │  [FOCUS IMAGE]   │       │
│    │                  │  │                  │  │                  │       │
│    │      FURY        │  │      FLASH       │  │      FOCUS       │       │
│    │                  │  │                  │  │                  │       │
│    │   200mg Caffeine │  │   Electrolytes   │  │   Creatine       │       │
│    │   Taurine        │  │   Coconut Water  │  │   Nootropics     │       │
│    │   Beta-Alanine   │  │   Sea Salt       │  │   B-Vitamins     │       │
│    │                  │  │                  │  │                  │       │
│    │   Chili-Lime     │  │   Bitter Lemon   │  │   Black Cherry   │       │
│    │                  │  │                  │  │                  │       │
│    │   €5.00          │  │   €4.50          │  │   €5.50          │       │
│    │                  │  │                  │  │                  │       │
│    │  [PRE-ORDER]     │  │  [PRE-ORDER]     │  │  [PRE-ORDER]     │       │
│    │                  │  │                  │  │                  │       │
│    └──────────────────┘  └──────────────────┘  └──────────────────┘       │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                        LIMITED DROPS                                       │
│                                                                            │
│   F.U. releases in limited drops with artist collaborations.              │
│   Each batch features exclusive graffiti-style packaging.                 │
│   Once they're gone, they're gone.                                        │
│                                                                            │
│                   ┌────────────────────────┐                               │
│                   │ GET DROP NOTIFICATIONS │                               │
│                   └────────────────────────┘                               │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                              [FOOTER]                                      │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. RIG MERCH STORE

### 4.1 RIG Landing Page

**URL:** `/rig`  
**Purpose:** Luxury streetwear merchandise store landing  
**Priority:** P0  

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              [NAVBAR]                                      │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ████████████████████████████████████████████████████████████████████████  │
│  █                                                                      █  │
│  █                       [LIFESTYLE HERO]                               █  │
│  █                                                                      █  │
│  █                            R I G                                     █  │
│  █                                                                      █  │
│  █                   Wear the Movement.                                 █  │
│  █                                                                      █  │
│  █                      [SHOP ALL →]                                    █  │
│  █                                                                      █  │
│  ████████████████████████████████████████████████████████████████████████  │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                         COLLECTIONS                                        │
│                                                                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│  │         │ │         │ │         │ │         │ │         │ │         │ │
│  │ [IMG]   │ │ [IMG]   │ │ [IMG]   │ │ [IMG]   │ │ [IMG]   │ │ [IMG]   │ │
│  │         │ │         │ │         │ │         │ │         │ │         │ │
│  │ Prime   │ │ Apex    │ │ Imbued  │ │ Dazzle  │ │ Charmed │ │ Occult  │ │
│  │ Picks   │ │ Arrivals│ │ Icons   │ │ Drip    │ │ Cozies  │ │ Original│ │
│  │         │ │         │ │         │ │         │ │         │ │         │ │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ │
│                                                                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐             │
│  │         │ │         │ │         │ │         │ │         │             │
│  │ [IMG]   │ │ [IMG]   │ │ [IMG]   │ │ [IMG]   │ │ [IMG]   │             │
│  │         │ │         │ │         │ │         │ │         │             │
│  │ Nexus   │ │ Nebula  │ │Enchanted│ │ Cursed  │ │Thaumat- │             │
│  │ Noggin  │ │Novelties│ │Exclusiv.│ │Countdown│ │ urge    │             │
│  │         │ │         │ │         │ │         │             │             │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘             │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                        FEATURED PRODUCTS                                   │
│                                                                            │
│  [ProductCard] [ProductCard] [ProductCard] [ProductCard]                  │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                        NEW ARRIVALS                                        │
│                                                                            │
│  [ProductCard] [ProductCard] [ProductCard] [ProductCard]                  │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                              [FOOTER]                                      │
└────────────────────────────────────────────────────────────────────────────┘
```

#### RIG Collection Data
```typescript
interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  acrosticLetter: string;
  productCount: number;
  mvpStatus: 'YES' | 'PHASE 2';
}

const rigCollections: Collection[] = [
  { id: "prime-picks", name: "Prime Picks", slug: "prime-picks", description: "Best sellers and fan favorites", image: "/images/collections/prime-picks.jpg", acrosticLetter: "P", productCount: 12, mvpStatus: "YES" },
  { id: "apex-arrivals", name: "Apex Arrivals", slug: "apex-arrivals", description: "Newest drops and latest releases", image: "/images/collections/apex-arrivals.jpg", acrosticLetter: "A", productCount: 8, mvpStatus: "YES" },
  { id: "imbued-icons", name: "Imbued Icons", slug: "imbued-icons", description: "Iconic graphic tees collection", image: "/images/collections/imbued-icons.jpg", acrosticLetter: "I", productCount: 15, mvpStatus: "YES" },
  { id: "dazzle-drip", name: "Dazzle Drip", slug: "dazzle-drip", description: "Drinkware and accessories", image: "/images/collections/dazzle-drip.jpg", acrosticLetter: "D", productCount: 10, mvpStatus: "YES" },
  { id: "charmed-cozies", name: "Charmed Cozies", slug: "charmed-cozies", description: "Sweatshirts and hoodies", image: "/images/collections/charmed-cozies.jpg", acrosticLetter: "C", productCount: 8, mvpStatus: "YES" },
  { id: "occult-originals", name: "Occult Originals", slug: "occult-originals", description: "Bottoms collection", image: "/images/collections/occult-originals.jpg", acrosticLetter: "O", productCount: 6, mvpStatus: "YES" },
  { id: "nexus-noggin", name: "Nexus Noggin", slug: "nexus-noggin", description: "Hats and headwear", image: "/images/collections/nexus-noggin.jpg", acrosticLetter: "N", productCount: 10, mvpStatus: "YES" },
  { id: "nebula-novelties", name: "Nebula Novelties", slug: "nebula-novelties", description: "Lifestyle and accessories", image: "/images/collections/nebula-novelties.jpg", acrosticLetter: "N", productCount: 12, mvpStatus: "YES" },
  { id: "enchanted-exclusives", name: "Enchanted Exclusives", slug: "enchanted-exclusives", description: "Limited editions and special releases", image: "/images/collections/enchanted-exclusives.jpg", acrosticLetter: "E", productCount: 0, mvpStatus: "PHASE 2" },
  { id: "cursed-countdown", name: "Cursed Countdown", slug: "cursed-countdown", description: "Last chance items", image: "/images/collections/cursed-countdown.jpg", acrosticLetter: "C", productCount: 0, mvpStatus: "PHASE 2" },
  { id: "thaumaturge-trove", name: "Thaumaturge Trove", slug: "thaumaturge-trove", description: "Artist collaborations", image: "/images/collections/thaumaturge-trove.jpg", acrosticLetter: "T", productCount: 0, mvpStatus: "PHASE 2" }
];
```

---

### 4.2 Collection Page Template

**URL:** `/rig/[collection-slug]`  
**Purpose:** Display products in a specific collection  
**Priority:** P1  

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              [NAVBAR]                                      │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  RIG / CHARMED COZIES                                                      │
│                                                                            │
│  ─────────────────────────────────────────────────────────────────────────│
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                                                                      │ │
│  │                    [COLLECTION HERO IMAGE]                           │ │
│  │                                                                      │ │
│  │                      CHARMED COZIES                                  │ │
│  │                                                                      │ │
│  │              Comfort meets cause. Hoodies and sweatshirts            │ │
│  │              that feel as good as they do good.                      │ │
│  │                                                                      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌────────────────┐                                                        │
│  │ FILTERS        │    Showing 8 products           [Sort by: Newest ▼]   │
│  │                │                                                        │
│  │ Size           │    ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ □ XS           │    │          │  │          │  │          │          │
│  │ □ S            │    │  [IMG]   │  │  [IMG]   │  │  [IMG]   │          │
│  │ □ M            │    │          │  │          │  │          │          │
│  │ □ L            │    │ Classic  │  │ Bold     │  │ Minimal  │          │
│  │ □ XL           │    │ Hoodie   │  │ Crew     │  │ Zip      │          │
│  │ □ XXL          │    │          │  │          │  │          │          │
│  │                │    │ €89.00   │  │ €69.00   │  │ €79.00   │          │
│  │ Color          │    │          │  │          │  │          │          │
│  │ ● Black        │    └──────────┘  └──────────┘  └──────────┘          │
│  │ ● White        │                                                        │
│  │ ● Gray         │    ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ ● Navy         │    │          │  │          │  │          │          │
│  │                │    │  [IMG]   │  │  [IMG]   │  │  [IMG]   │          │
│  │ Price          │    │          │  │          │  │          │          │
│  │ €0 ────●── €150│    │ Oversiz. │  │ Cropped  │  │ Quarter  │          │
│  │                │    │ Hoodie   │  │ Crew     │  │ Zip      │          │
│  │ [Clear All]    │    │          │  │          │  │          │          │
│  │                │    │ €99.00   │  │ €59.00   │  │ €75.00   │          │
│  └────────────────┘    │          │  │          │  │          │          │
│                        └──────────┘  └──────────┘  └──────────┘          │
│                                                                            │
│                        [LOAD MORE]                                         │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                              [FOOTER]                                      │
└────────────────────────────────────────────────────────────────────────────┘
```

---

### 4.3 Merch Product Page

**URL:** `/rig/[collection]/[product-slug]`  
**Purpose:** Individual merch product detail page  
**Priority:** P1  

Same structure as Water product page but with:
- Size selector (XS, S, M, L, XL, XXL)
- Color selector with swatches
- Size guide modal
- Material/care information tab

#### Size Guide Component
```typescript
interface SizeGuide {
  category: string;
  measurements: {
    size: string;
    chest: string;
    length: string;
    sleeve?: string;
    waist?: string;
    hips?: string;
  }[];
}

const hoodiesSizeGuide: SizeGuide = {
  category: "Hoodies & Sweatshirts",
  measurements: [
    { size: "XS", chest: "86-91cm", length: "64cm", sleeve: "62cm" },
    { size: "S", chest: "91-97cm", length: "66cm", sleeve: "63cm" },
    { size: "M", chest: "97-102cm", length: "69cm", sleeve: "64cm" },
    { size: "L", chest: "102-107cm", length: "72cm", sleeve: "65cm" },
    { size: "XL", chest: "107-112cm", length: "74cm", sleeve: "66cm" },
    { size: "XXL", chest: "112-117cm", length: "76cm", sleeve: "67cm" }
  ]
};
```

---

## 5. ARCANE EVENTS

**URL:** `/arcane`  
**Purpose:** Events hub - festivals, activations, community gatherings  
**Priority:** P0  

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              [NAVBAR]                                      │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ████████████████████████████████████████████████████████████████████████  │
│  █                                                                      █  │
│  █                    [FEATURED EVENT HERO]                             █  │
│  █                                                                      █  │
│  █                         A R C A N E                                  █  │
│  █                                                                      █  │
│  █                  Where the TRIBE gathers.                            █  │
│  █                                                                      █  │
│  █          NEXT EVENT: GRATIS LAUNCH PARTY                             █  │
│  █          February 14, 2026 • Amsterdam Central                       █  │
│  █                                                                      █  │
│  █                      [GET TICKETS →]                                 █  │
│  █                                                                      █  │
│  ████████████████████████████████████████████████████████████████████████  │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐              │
│  │    UPCOMING     │ │      PAST       │ │   OUR EVENTS    │              │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘              │
│                                                                            │
│  ─────────────────────────────────────────────────────────────────────────│
│                                                                            │
│                         UPCOMING EVENTS                                    │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                                                                      │ │
│  │  FEB 14    GRATIS LAUNCH PARTY                                       │ │
│  │  2026      Amsterdam Central Station                                 │ │
│  │            🎫 Free entry • TRIBE members early access                │ │
│  │                                                    [RSVP →]          │ │
│  │                                                                      │ │
│  │  MAR 20    ADE AFTERPARTY                                            │ │
│  │  2026      De School, Amsterdam                                      │ │
│  │            🎫 €25 / Free for TRIBE                                   │ │
│  │                                                    [GET TICKETS →]   │ │
│  │                                                                      │ │
│  │  MAY 05    LIBERATION DAY ACTIVATION                                 │ │
│  │  2026      Museumplein, Amsterdam                                    │ │
│  │            🎫 Free                                                   │ │
│  │                                                    [RSVP →]          │ │
│  │                                                                      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                    EVENTS WE SUPPORT                                       │
│                                                                            │
│  Find GRATIS at these festivals and gatherings:                           │
│                                                                            │
│  ┌───────┐  ┌───────┐  ┌───────┐  ┌───────┐  ┌───────┐  ┌───────┐       │
│  │[LOGO] │  │[LOGO] │  │[LOGO] │  │[LOGO] │  │[LOGO] │  │[LOGO] │       │
│  │       │  │       │  │       │  │       │  │       │  │       │       │
│  │Burning│  │Coachel│  │Latin  │  │Lowland│  │ADE    │  │Sziget │       │
│  │Man    │  │la     │  │Village│  │s      │  │       │  │       │       │
│  └───────┘  └───────┘  └───────┘  └───────┘  └───────┘  └───────┘       │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                    GALLERY FROM PAST EVENTS                                │
│                                                                            │
│  [IMG] [IMG] [IMG] [IMG] [IMG] [IMG] [IMG] [IMG]                          │
│                                                                            │
│                        [VIEW ALL PHOTOS →]                                 │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                              [FOOTER]                                      │
└────────────────────────────────────────────────────────────────────────────┘
```

#### Events Data Structure
```typescript
interface Event {
  id: string;
  title: string;
  date: Date;
  endDate?: Date;
  location: {
    name: string;
    address: string;
    city: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
  type: 'gratis_event' | 'partner_event' | 'festival';
  status: 'upcoming' | 'ongoing' | 'past';
  ticketInfo: {
    price: number | 'free';
    tribeMemberPrice?: number | 'free';
    ticketUrl?: string;
    rsvpUrl?: string;
    capacity?: number;
    spotsLeft?: number;
  };
  image: string;
  description: string;
  gallery?: string[];
}
```

---

## 6. TRIBE COMMUNITY

### 6.1 TRIBE Landing Page

**URL:** `/tribe`  
**Purpose:** Community and membership hub  
**Priority:** P0  

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              [NAVBAR]                                      │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ████████████████████████████████████████████████████████████████████████  │
│  █                                                                      █  │
│  █                    [COMMUNITY HERO VIDEO]                            █  │
│  █                                                                      █  │
│  █                         T R I B E                                    █  │
│  █                                                                      █  │
│  █                 More than members. Family.                           █  │
│  █                                                                      █  │
│  █                     [JOIN THE TRIBE →]                               █  │
│  █                                                                      █  │
│  ████████████████████████████████████████████████████████████████████████  │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                         MEMBERSHIP TIERS                                   │
│                                                                            │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ │
│  │               │ │               │ │               │ │   ⭐ BEST     │ │
│  │   EXPLORER    │ │   INSIDER     │ │     CORE      │ │   FOUNDER     │ │
│  │               │ │               │ │               │ │               │ │
│  │     FREE      │ │  €9.99/month  │ │   €97/year    │ │   €247 once   │ │
│  │               │ │               │ │               │ │               │ │
│  │ ─────────────│ │ ─────────────│ │ ─────────────│ │ ─────────────│ │
│  │               │ │               │ │               │ │               │ │
│  │ ✓ Newsletter  │ │ ✓ Everything  │ │ ✓ Everything  │ │ ✓ Everything  │ │
│  │ ✓ Shop access │ │   in Explorer │ │   in Insider  │ │   in Core     │ │
│  │ ✓ Basic       │ │ ✓ Free ship-  │ │ ✓ 2 months    │ │ ✓ LIFETIME    │ │
│  │   account     │ │   ping        │ │   free        │ │   benefits    │ │
│  │               │ │ ✓ Early drops │ │ ✓ Annual      │ │ ✓ Website     │ │
│  │               │ │ ✓ Pre-orders  │ │   merch drop  │ │   recognition │ │
│  │               │ │ ✓ Event       │ │ ✓ Exclusive   │ │ ✓ Launch      │ │
│  │               │ │   access      │ │   events      │ │   party VIP   │ │
│  │               │ │ ✓ Voting      │ │               │ │ ✓ Limited     │ │
│  │               │ │   rights      │ │               │ │   edition #   │ │
│  │               │ │               │ │               │ │               │ │
│  │  [JOIN FREE]  │ │ [SUBSCRIBE]   │ │  [JOIN NOW]   │ │ [BECOME       │ │
│  │               │ │               │ │               │ │  FOUNDER]     │ │
│  │               │ │               │ │               │ │               │ │
│  └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘ │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                        TRIBE COMMUNITY                                     │
│                                                                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐             │
│  │         │ │         │ │         │ │         │ │         │             │
│  │ [IMG]   │ │ [IMG]   │ │ [IMG]   │ │ [IMG]   │ │ [IMG]   │             │
│  │         │ │         │ │         │ │         │ │         │             │
│  │Heritage │ │ Ethics  │ │Account- │ │Respons- │ │Transpar-│             │
│  │         │ │         │ │ability  │ │ibility  │ │ency     │             │
│  │         │ │         │ │         │ │         │ │         │             │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘             │
│                                                                            │
│           H    E    A    R    T    = Our foundation                        │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                       MEMBER TESTIMONIALS                                  │
│                                                                            │
│  [Testimonial Carousel]                                                    │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                              [FOOTER]                                      │
└────────────────────────────────────────────────────────────────────────────┘
```

#### Membership Data
```typescript
interface MembershipTier {
  id: string;
  name: string;
  price: number | 'free';
  billingPeriod: 'monthly' | 'yearly' | 'once';
  stripePriceId?: string;
  benefits: string[];
  highlighted?: boolean;
  badge?: string;
  ctaLabel: string;
}

const membershipTiers: MembershipTier[] = [
  {
    id: "explorer",
    name: "TRIBE Explorer",
    price: "free",
    billingPeriod: "once",
    benefits: [
      "Newsletter subscription",
      "Full shop access",
      "Basic account features"
    ],
    ctaLabel: "JOIN FREE"
  },
  {
    id: "insider",
    name: "TRIBE Insider",
    price: 9.99,
    billingPeriod: "monthly",
    stripePriceId: "price_xxx_insider_monthly",
    benefits: [
      "Everything in Explorer",
      "Free shipping on all orders",
      "Early access to drops",
      "Pre-order access",
      "Exclusive event access",
      "Voting rights on NGO partners"
    ],
    ctaLabel: "SUBSCRIBE"
  },
  {
    id: "core",
    name: "TRIBE Core",
    price: 97,
    billingPeriod: "yearly",
    stripePriceId: "price_xxx_core_yearly",
    benefits: [
      "Everything in Insider",
      "2 months free (vs monthly)",
      "Annual exclusive merch drop",
      "VIP event experiences"
    ],
    ctaLabel: "JOIN NOW"
  },
  {
    id: "founder",
    name: "TRIBE Founder",
    price: 247,
    billingPeriod: "once",
    stripePriceId: "price_xxx_founder_lifetime",
    benefits: [
      "Everything in Core",
      "LIFETIME membership",
      "Website recognition",
      "Launch party VIP invite",
      "Limited edition bottle #XXX"
    ],
    highlighted: true,
    badge: "⭐ BEST VALUE",
    ctaLabel: "BECOME FOUNDER"
  }
];
```

---

### 6.2 TRIBE Sub-Pages (HEART)

Each sub-page follows this template structure:

**URLs:**
- `/tribe/heritage` (H)
- `/tribe/ethics` (E)
- `/tribe/accountability` (A)
- `/tribe/responsibility` (R)
- `/tribe/transparency` (T)

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              [NAVBAR]                                      │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  TRIBE / HERITAGE                                                          │
│                                                                            │
│  ─────────────────────────────────────────────────────────────────────────│
│                                                                            │
│  ████████████████████████████████████████████████████████████████████████  │
│  █                                                                      █  │
│  █                       [PAGE HERO IMAGE]                              █  │
│  █                                                                      █  │
│  █                         HERITAGE                                     █  │
│  █                                                                      █  │
│  █                    Our story. Our why.                               █  │
│  █                                                                      █  │
│  ████████████████████████████████████████████████████████████████████████  │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  [Rich content area - Markdown/CMS content]                               │
│                                                                            │
│  Timeline, stories, founder vision, mission statement, values, etc.       │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                      EXPLORE THE HEART                                     │
│                                                                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐             │
│  │Heritage │ │ Ethics  │ │Account- │ │Respons- │ │Transpar-│             │
│  │ (here)  │ │         │ │ability  │ │ibility  │ │ency     │             │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘             │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                              [FOOTER]                                      │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. IMPACT TV MEDIA

### 7.1 IMPACT TV Landing Page

**URL:** `/impact-tv`  
**Purpose:** Video content hub landing  
**Priority:** P0  

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              [NAVBAR]                                      │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ████████████████████████████████████████████████████████████████████████  │
│  █                                                                      █  │
│  █                      [FEATURED VIDEO HERO]                           █  │
│  █                         ▶ PLAY                                       █  │
│  █                                                                      █  │
│  █                       IMPACT TV                                      █  │
│  █                                                                      █  │
│  █                 Stories that move you.                               █  │
│  █                                                                      █  │
│  ████████████████████████████████████████████████████████████████████████  │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                          EXPLORE                                           │
│                                                                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐         │
│  │             │ │             │ │             │ │             │         │
│  │   UNVEIL    │ │    NEXUS    │ │    ICON     │ │    TALES    │         │
│  │             │ │             │ │             │ │             │         │
│  │ Feature     │ │ Global      │ │ Series &    │ │ Short       │         │
│  │ Films       │ │ Stories     │ │ Shows       │ │ Clips       │         │
│  │             │ │             │ │             │ │             │         │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘         │
│                                                                            │
│                          ┌─────────────┐                                   │
│                          │             │                                   │
│                          │    YARNS    │                                   │
│                          │             │                                   │
│                          │ Live &      │                                   │
│                          │ Replays     │                                   │
│                          │             │                                   │
│                          └─────────────┘                                   │
│                                                                            │
│                 U    N    I    T    Y    = Our content                     │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                         TRENDING NOW                                       │
│                                                                            │
│  [VideoCard] [VideoCard] [VideoCard] [VideoCard]                          │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                        LATEST UPLOADS                                      │
│                                                                            │
│  [VideoCard] [VideoCard] [VideoCard] [VideoCard]                          │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                              [FOOTER]                                      │
└────────────────────────────────────────────────────────────────────────────┘
```

#### Video Data Structure
```typescript
interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string; // YouTube/Vimeo embed URL
  duration: number; // in seconds
  category: 'unveil' | 'nexus' | 'icon' | 'tales' | 'yarns';
  tags: string[];
  publishedAt: Date;
  viewCount: number;
  featured: boolean;
  series?: {
    id: string;
    name: string;
    episode: number;
  };
}

interface VideoCard {
  video: Video;
  size: 'small' | 'medium' | 'large' | 'featured';
}
```

---

### 7.2 Content Section Pages (UNITY)

**URLs:**
- `/impact-tv/unveil` (U) - Feature-length documentaries
- `/impact-tv/nexus` (N) - Global stories
- `/impact-tv/icon` (I) - Series and shows
- `/impact-tv/tales` (T) - Short clips
- `/impact-tv/yarns` (Y) - Live streams and replays

Each follows this template:

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              [NAVBAR]                                      │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  IMPACT TV / UNVEIL                                                        │
│                                                                            │
│  ─────────────────────────────────────────────────────────────────────────│
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                                                                      │ │
│  │                     [FEATURED VIDEO HERO]                            │ │
│  │                          ▶ PLAY                                      │ │
│  │                                                                      │ │
│  │  THE WATER CRISIS: A GRATIS DOCUMENTARY                              │ │
│  │  Runtime: 47 min • 2024                                              │ │
│  │                                                                      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  Filter: [All] [Education] [Water] [Arts] [Environment]                   │
│                                                                            │
│  ─────────────────────────────────────────────────────────────────────────│
│                                                                            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐          │
│  │            │  │            │  │            │  │            │          │
│  │  [THUMB]   │  │  [THUMB]   │  │  [THUMB]   │  │  [THUMB]   │          │
│  │   ▶ 23:45  │  │   ▶ 45:12  │  │   ▶ 32:00  │  │   ▶ 28:30  │          │
│  │            │  │            │  │            │  │            │          │
│  │  Title     │  │  Title     │  │  Title     │  │  Title     │          │
│  │  Topic     │  │  Topic     │  │  Topic     │  │  Topic     │          │
│  │            │  │            │  │            │  │            │          │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘          │
│                                                                            │
│  [LOAD MORE]                                                               │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                              [FOOTER]                                      │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. SPARK ACTION HUB

### 8.1 SPARK Landing Page

**URL:** `/spark`  
**Purpose:** Engagement hub - donate, invest, volunteer, work  
**Priority:** P0  

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              [NAVBAR]                                      │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ████████████████████████████████████████████████████████████████████████  │
│  █                                                                      █  │
│  █                      [IMPACT HERO IMAGE]                             █  │
│  █                                                                      █  │
│  █                         S P A R K                                    █  │
│  █                                                                      █  │
│  █                 Ignite change. Take action.                          █  │
│  █                                                                      █  │
│  ████████████████████████████████████████████████████████████████████████  │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                        CHOOSE YOUR PATH                                    │
│                                                                            │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌───────────┐│
│  │                 │ │                 │ │                 │ │           ││
│  │     [IMG]       │ │     [IMG]       │ │     [IMG]       │ │   [IMG]   ││
│  │                 │ │                 │ │                 │ │           ││
│  │     VERVE       │ │     INFUSE      │ │     BLAZE       │ │  ENLIST   ││
│  │                 │ │                 │ │                 │ │           ││
│  │   💚 Donate     │ │   💰 Invest     │ │   🔥 Volunteer  │ │  💼 Work  ││
│  │                 │ │                 │ │                 │ │           ││
│  │  Give to fund   │ │  Fund scholar-  │ │  Join our       │ │  Build    ││
│  │  impact         │ │  ships & micro- │ │  community      │ │  your     ││
│  │  programs       │ │  credit         │ │  action team    │ │  career   ││
│  │                 │ │                 │ │                 │ │           ││
│  │  [DONATE NOW →] │ │  [INVEST NOW →] │ │  [JOIN NOW →]   │ │ [APPLY →] ││
│  │                 │ │                 │ │                 │ │           ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ └───────────┘│
│                                                                            │
│                 V    I    B    E    = Our energy                           │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                         IMPACT TRACKER                                     │
│                                                                            │
│     €127,000+          254,000+            89                342+          │
│     Donated            Liters              Communities       Volunteers    │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                              [FOOTER]                                      │
└────────────────────────────────────────────────────────────────────────────┘
```

---

### 8.2 Verve (Donate) Page

**URL:** `/spark/verve`  
**Purpose:** Donations - one-time, monthly, crypto  
**Priority:** P0  

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              [NAVBAR]                                      │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  SPARK / VERVE                                                             │
│                                                                            │
│  ─────────────────────────────────────────────────────────────────────────│
│                                                                            │
│  ████████████████████████████████████████████████████████████████████████  │
│  █                                                                      █  │
│  █                         V E R V E                                    █  │
│  █                                                                      █  │
│  █              Give with passion. Create impact.                       █  │
│  █                                                                      █  │
│  ████████████████████████████████████████████████████████████████████████  │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                                                                      │ │
│  │  WHERE YOUR DONATION GOES                                            │ │
│  │                                                                      │ │
│  │  [PIE CHART]                                                         │ │
│  │                                                                      │ │
│  │  █████████████████████████████ 40% Water Projects                    │ │
│  │  ██████████████████████ 30% Arts & Culture                           │ │
│  │  ██████████████████████ 30% Education                                │ │
│  │  ░░░░░░░░░░░░░░░░░░░░░ 0% Administration (covered by partners)       │ │
│  │                                                                      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                                                                    │   │
│  │  MAKE A DONATION                                                   │   │
│  │                                                                    │   │
│  │  ┌──────────────────┐  ┌──────────────────┐                       │   │
│  │  │   ONE-TIME       │  │   MONTHLY        │                       │   │
│  │  └──────────────────┘  └──────────────────┘                       │   │
│  │                                                                    │   │
│  │  SELECT AMOUNT                                                     │   │
│  │                                                                    │   │
│  │  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐               │   │
│  │  │ €10   │ │ €25   │ │ €50   │ │ €100  │ │ €250  │               │   │
│  │  └───────┘ └───────┘ └───────┘ └───────┘ └───────┘               │   │
│  │                                                                    │   │
│  │  Or enter custom amount:                                           │   │
│  │  ┌─────────────────────────────────────────┐                      │   │
│  │  │ € ___                                   │                      │   │
│  │  └─────────────────────────────────────────┘                      │   │
│  │                                                                    │   │
│  │  PAYMENT METHOD                                                    │   │
│  │                                                                    │   │
│  │  ○ Credit Card  ○ iDEAL  ○ PayPal  ○ Crypto                       │   │
│  │                                                                    │   │
│  │  [DONATE NOW - €50]                                                │   │
│  │                                                                    │   │
│  │  🔒 Secure payment via Stripe                                      │   │
│  │                                                                    │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                        YOUR IMPACT                                         │
│                                                                            │
│  €10 = 1 week of clean water for a family                                 │
│  €25 = Art supplies for 5 students                                        │
│  €50 = 1 month of education for a child                                   │
│  €100 = Complete water filter for a household                             │
│  €250 = Scholarship fund contribution                                     │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                              [FOOTER]                                      │
└────────────────────────────────────────────────────────────────────────────┘
```

#### Donation Form Data
```typescript
interface DonationFormData {
  type: 'one-time' | 'monthly';
  amount: number;
  customAmount?: number;
  paymentMethod: 'card' | 'ideal' | 'paypal' | 'crypto';
  donorInfo: {
    email: string;
    firstName?: string;
    lastName?: string;
    anonymous?: boolean;
  };
  designation?: 'water' | 'arts' | 'education' | 'where-needed';
  giftInfo?: {
    inHonorOf?: string;
    inMemoryOf?: string;
    notifyEmail?: string;
  };
}
```

---

### 8.3 Infuse (Invest) Page

**URL:** `/spark/infuse`  
**Purpose:** Scholarships and microcredit investments  
**Priority:** P1  

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              [NAVBAR]                                      │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  SPARK / INFUSE                                                            │
│                                                                            │
│  ─────────────────────────────────────────────────────────────────────────│
│                                                                            │
│  ████████████████████████████████████████████████████████████████████████  │
│  █                                                                      █  │
│  █                         I N F U S E                                  █  │
│  █                                                                      █  │
│  █             Invest in potential. Multiply impact.                    █  │
│  █                                                                      █  │
│  ████████████████████████████████████████████████████████████████████████  │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                      INVESTMENT OPTIONS                                    │
│                                                                            │
│  ┌─────────────────────────────────┐ ┌─────────────────────────────────┐  │
│  │                                 │ │                                 │  │
│  │       SCHOLARSHIP FUND          │ │       MICROCREDIT PROGRAM       │  │
│  │                                 │ │                                 │  │
│  │  🎓 Fund education for         │ │  💼 Provide startup capital    │  │
│  │     underprivileged students    │ │     for entrepreneurs          │  │
│  │                                 │ │                                 │  │
│  │  €500 = Full-year tuition      │ │  €100 = Business startup kit   │  │
│  │  + mentorship program           │ │  + skills training             │  │
│  │                                 │ │                                 │  │
│  │  127 scholarships funded       │ │  €43,000 deployed              │  │
│  │  98% graduation rate           │ │  95% repayment rate            │  │
│  │                                 │ │                                 │  │
│  │  [FUND A SCHOLARSHIP →]        │ │  [INVEST IN ENTREPRENEUR →]    │  │
│  │                                 │ │                                 │  │
│  └─────────────────────────────────┘ └─────────────────────────────────┘  │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                      IMPACT DASHBOARD                                      │
│                                                                            │
│  Track your investment's impact in real-time                               │
│                                                                            │
│  [Login to view your dashboard →]                                          │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                              [FOOTER]                                      │
└────────────────────────────────────────────────────────────────────────────┘
```

---

### 8.4 Blaze (Volunteer) Page

**URL:** `/spark/blaze`  
**Purpose:** Volunteer opportunities and community action  
**Priority:** P1  

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              [NAVBAR]                                      │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  SPARK / BLAZE                                                             │
│                                                                            │
│  ─────────────────────────────────────────────────────────────────────────│
│                                                                            │
│  ████████████████████████████████████████████████████████████████████████  │
│  █                                                                      █  │
│  █                         B L A Z E                                    █  │
│  █                                                                      █  │
│  █                Light the fire. Spread the word.                      █  │
│  █                                                                      █  │
│  ████████████████████████████████████████████████████████████████████████  │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                     VOLUNTEER OPPORTUNITIES                                │
│                                                                            │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────┐ │
│  │                │ │                │ │                │ │            │ │
│  │ EVENT SUPPORT  │ │    STREET      │ │  FUNDRAISING   │ │ AMBASSADOR │ │
│  │                │ │ DISTRIBUTION   │ │                │ │            │ │
│  │ 🎪             │ │ 🚶             │ │ 📢             │ │ 🌟         │ │
│  │                │ │                │ │                │ │            │ │
│  │ 1-3 days/event │ │ 2-4 hrs/week  │ │ Flexible       │ │ Ongoing    │ │
│  │                │ │                │ │                │ │            │ │
│  │ Help at        │ │ Distribute     │ │ Support our    │ │ Represent  │ │
│  │ festivals and  │ │ free water in  │ │ campaigns and  │ │ GRATIS in  │ │
│  │ activations    │ │ your city      │ │ events         │ │ your       │ │
│  │                │ │                │ │                │ │ community  │ │
│  │ [APPLY →]      │ │ [APPLY →]      │ │ [APPLY →]      │ │ [APPLY →]  │ │
│  │                │ │                │ │                │ │            │ │
│  └────────────────┘ └────────────────┘ └────────────────┘ └────────────┘ │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                      VOLUNTEER STATS                                       │
│                                                                            │
│        342+                1,200+              12                 48hr     │
│     Active Volunteers    Hours Given       Countries         Response Time │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                                                                      │ │
│  │  VOLUNTEER APPLICATION                                               │ │
│  │                                                                      │ │
│  │  Name: ___________________                                           │ │
│  │  Email: ___________________                                          │ │
│  │  City: ___________________                                           │ │
│  │  Country: [Dropdown]                                                 │ │
│  │                                                                      │ │
│  │  Which opportunity interests you?                                    │ │
│  │  □ Event Support  □ Street Distribution  □ Fundraising  □ Ambassador │ │
│  │                                                                      │ │
│  │  Tell us about yourself:                                             │ │
│  │  ┌──────────────────────────────────────────────────────────────┐   │ │
│  │  │                                                              │   │ │
│  │  │                                                              │   │ │
│  │  └──────────────────────────────────────────────────────────────┘   │ │
│  │                                                                      │ │
│  │  [SUBMIT APPLICATION]                                                │ │
│  │                                                                      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                              [FOOTER]                                      │
└────────────────────────────────────────────────────────────────────────────┘
```

---

### 8.5 Enlist (Careers) Page

**URL:** `/spark/enlist`  
**Purpose:** Job openings and applications  
**Priority:** P0  

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              [NAVBAR]                                      │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  SPARK / ENLIST                                                            │
│                                                                            │
│  ─────────────────────────────────────────────────────────────────────────│
│                                                                            │
│  ████████████████████████████████████████████████████████████████████████  │
│  █                                                                      █  │
│  █                         E N L I S T                                  █  │
│  █                                                                      █  │
│  █               Join the movement. Build your career.                  █  │
│  █                                                                      █  │
│  ████████████████████████████████████████████████████████████████████████  │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                      CURRENT OPENINGS                                      │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │ ▼ Operations Manager                                                 │ │
│  │   📍 Amsterdam, Netherlands • Full-time • €3,200-4,000/month         │ │
│  │                                                                      │ │
│  │   We're looking for an Operations Manager to oversee day-to-day      │ │
│  │   logistics, distribution, and team coordination.                    │ │
│  │                                                                      │ │
│  │   Requirements:                                                      │ │
│  │   • 3+ years operations experience                                   │ │
│  │   • Strong organizational skills                                     │ │
│  │   • Dutch + English fluency                                          │ │
│  │                                                                      │ │
│  │   [APPLY NOW →]                                                      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │ ▶ Partnerships Manager                                               │ │
│  │   📍 Amsterdam, Netherlands • Full-time • €3,500-4,500/month         │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │ ▶ Event Coordinator                                                  │ │
│  │   📍 Various Locations • Contract • €150/day                         │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │ ▶ Marketing Intern                                                   │ │
│  │   📍 Remote/Amsterdam • Internship • €500/month                      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │ ▶ Brand Ambassador                                                   │ │
│  │   📍 Multiple Cities • Part-time • €100-150/event + free products    │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                        WHY GRATIS?                                         │
│                                                                            │
│  ✓ Purpose-driven work         ✓ Flexible environment                     │
│  ✓ Competitive compensation    ✓ Growth opportunities                     │
│  ✓ Free TRIBE membership       ✓ Impact you can see                       │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                              [FOOTER]                                      │
└────────────────────────────────────────────────────────────────────────────┘
```

#### Job Data Structure
```typescript
interface JobPosting {
  id: string;
  title: string;
  location: string;
  locationType: 'onsite' | 'remote' | 'hybrid';
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  compensation: {
    min: number;
    max?: number;
    period: 'hourly' | 'daily' | 'monthly' | 'yearly' | 'per-event';
    currency: string;
    additionalBenefits?: string[];
  };
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  applicationDeadline?: Date;
  startDate?: Date;
  status: 'open' | 'closed' | 'filled';
}
```

---

## 9. AUTHENTICATION & ACCOUNT

### 9.1 Sign In Page

**URL:** `/signin`  
**Purpose:** User login  
**Priority:** P0  

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              [NAVBAR]                                      │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                                                                            │
│                    ┌────────────────────────────────────┐                  │
│                    │                                    │                  │
│                    │          [GRATIS LOGO]             │                  │
│                    │                                    │                  │
│                    │         WELCOME BACK               │                  │
│                    │                                    │                  │
│                    │  Email                             │                  │
│                    │  ┌──────────────────────────────┐  │                  │
│                    │  │                              │  │                  │
│                    │  └──────────────────────────────┘  │                  │
│                    │                                    │                  │
│                    │  Password                          │                  │
│                    │  ┌──────────────────────────────┐  │                  │
│                    │  │                          👁   │  │                  │
│                    │  └──────────────────────────────┘  │                  │
│                    │                                    │                  │
│                    │  [Forgot password?]                │                  │
│                    │                                    │                  │
│                    │  ┌──────────────────────────────┐  │                  │
│                    │  │         SIGN IN              │  │                  │
│                    │  └──────────────────────────────┘  │                  │
│                    │                                    │                  │
│                    │  ────────── OR ──────────         │                  │
│                    │                                    │                  │
│                    │  ┌──────────────────────────────┐  │                  │
│                    │  │ [G] Continue with Google     │  │                  │
│                    │  └──────────────────────────────┘  │                  │
│                    │                                    │                  │
│                    │  Don't have an account?            │                  │
│                    │  [Create one →]                    │                  │
│                    │                                    │                  │
│                    └────────────────────────────────────┘                  │
│                                                                            │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                              [FOOTER]                                      │
└────────────────────────────────────────────────────────────────────────────┘
```

---

### 9.2 Sign Up Page

**URL:** `/signup`  
**Purpose:** User registration with TRIBE tier selection  
**Priority:** P0  

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              [NAVBAR]                                      │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                    ┌────────────────────────────────────┐                  │
│                    │                                    │                  │
│                    │          [GRATIS LOGO]             │                  │
│                    │                                    │                  │
│                    │       JOIN THE TRIBE               │                  │
│                    │                                    │                  │
│                    │  ──────── Step 1 of 2 ────────    │                  │
│                    │                                    │                  │
│                    │  First Name                        │                  │
│                    │  ┌──────────────────────────────┐  │                  │
│                    │  │                              │  │                  │
│                    │  └──────────────────────────────┘  │                  │
│                    │                                    │                  │
│                    │  Last Name                         │                  │
│                    │  ┌──────────────────────────────┐  │                  │
│                    │  │                              │  │                  │
│                    │  └──────────────────────────────┘  │                  │
│                    │                                    │                  │
│                    │  Email                             │                  │
│                    │  ┌──────────────────────────────┐  │                  │
│                    │  │                              │  │                  │
│                    │  └──────────────────────────────┘  │                  │
│                    │                                    │                  │
│                    │  Password                          │                  │
│                    │  ┌──────────────────────────────┐  │                  │
│                    │  │                          👁   │  │                  │
│                    │  └──────────────────────────────┘  │                  │
│                    │  Min. 8 characters                 │                  │
│                    │                                    │                  │
│                    │  □ I agree to the Terms of Use     │                  │
│                    │    and Privacy Policy              │                  │
│                    │                                    │                  │
│                    │  ┌──────────────────────────────┐  │                  │
│                    │  │      CONTINUE TO STEP 2      │  │                  │
│                    │  └──────────────────────────────┘  │                  │
│                    │                                    │                  │
│                    │  Already have an account?          │                  │
│                    │  [Sign in →]                       │                  │
│                    │                                    │                  │
│                    └────────────────────────────────────┘                  │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                              [FOOTER]                                      │
└────────────────────────────────────────────────────────────────────────────┘
```

**Step 2: Membership Selection** (same layout as TRIBE pricing table)

---

### 9.3 Account Dashboard

**URL:** `/account`  
**Purpose:** User dashboard - orders, membership, settings  
**Priority:** P0  

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              [NAVBAR]                                      │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  MY ACCOUNT                                            [Sign Out]          │
│                                                                            │
│  ─────────────────────────────────────────────────────────────────────────│
│                                                                            │
│  ┌────────────────┐  ┌──────────────────────────────────────────────────┐ │
│  │                │  │                                                  │ │
│  │  NAVIGATION    │  │  OVERVIEW                                        │ │
│  │                │  │                                                  │ │
│  │  ○ Overview    │  │  Welcome back, Eric!                             │ │
│  │  ○ Orders      │  │                                                  │ │
│  │  ○ Membership  │  │  ┌─────────────────┐  ┌─────────────────┐       │ │
│  │  ○ Wishlist    │  │  │                 │  │                 │       │ │
│  │  ○ Addresses   │  │  │  TRIBE FOUNDER  │  │   3 ORDERS      │       │ │
│  │  ○ Settings    │  │  │  #000127        │  │   €243.50 total │       │ │
│  │                │  │  │                 │  │                 │       │ │
│  │                │  │  │  [MANAGE →]     │  │  [VIEW ALL →]   │       │ │
│  │                │  │  │                 │  │                 │       │ │
│  │                │  │  └─────────────────┘  └─────────────────┘       │ │
│  │                │  │                                                  │ │
│  │                │  │  RECENT ORDERS                                   │ │
│  │                │  │                                                  │ │
│  │                │  │  ┌──────────────────────────────────────────┐   │ │
│  │                │  │  │ Order #12345 • Jan 10, 2026              │   │ │
│  │                │  │  │ 2 items • €89.00 • Shipped               │   │ │
│  │                │  │  │ [Track Order]                            │   │ │
│  │                │  │  └──────────────────────────────────────────┘   │ │
│  │                │  │                                                  │ │
│  │                │  │  ┌──────────────────────────────────────────┐   │ │
│  │                │  │  │ Order #12340 • Jan 5, 2026               │   │ │
│  │                │  │  │ 1 item • €2.50 • Delivered               │   │ │
│  │                │  │  │ [View Details]                           │   │ │
│  │                │  │  └──────────────────────────────────────────┘   │ │
│  │                │  │                                                  │ │
│  └────────────────┘  └──────────────────────────────────────────────────┘ │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                              [FOOTER]                                      │
└────────────────────────────────────────────────────────────────────────────┘
```

#### Account Sections
- **Overview:** Dashboard summary
- **Orders:** Order history with tracking
- **Membership:** TRIBE tier management, upgrade options
- **Wishlist:** Saved products
- **Addresses:** Shipping addresses
- **Settings:** Profile info, password, preferences

---

## 10. E-COMMERCE SYSTEM

### 10.1 Cart Page

**URL:** `/cart`  
**Purpose:** Full shopping cart page (alternative to drawer)  
**Priority:** P0  

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              [NAVBAR]                                      │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  YOUR CART (3 items)                                                       │
│                                                                            │
│  ─────────────────────────────────────────────────────────────────────────│
│                                                                            │
│  ┌──────────────────────────────────────────────────┐  ┌────────────────┐ │
│  │                                                  │  │                │ │
│  │  ┌──────┐  GRATIS Water 500ml           €2.50   │  │  ORDER SUMMARY │ │
│  │  │[IMG] │  Classic                              │  │                │ │
│  │  │      │  [−] 2 [+]          Total: €5.00     │  │  Subtotal:     │ │
│  │  └──────┘                      [Remove]         │  │  €96.50        │ │
│  │                                                  │  │                │ │
│  │  ───────────────────────────────────────────── │  │  Shipping:     │ │
│  │                                                  │  │  FREE          │ │
│  │  ┌──────┐  Charmed Cozies Hoodie       €89.00  │  │                │ │
│  │  │[IMG] │  Size: M / Black                      │  │  ─────────────│ │
│  │  │      │  [−] 1 [+]          Total: €89.00    │  │                │ │
│  │  └──────┘                      [Remove]         │  │  TOTAL:        │ │
│  │                                                  │  │  €96.50        │ │
│  │  ───────────────────────────────────────────── │  │                │ │
│  │                                                  │  │  ┌────────────┐│ │
│  │  ┌──────┐  Dazzle Drip Tumbler          €2.50  │  │  │  CHECKOUT  ││ │
│  │  │[IMG] │  Lime Green                           │  │  └────────────┘│ │
│  │  │      │  [−] 1 [+]          Total: €2.50     │  │                │ │
│  │  └──────┘                      [Remove]         │  │  🔒 Secure     │ │
│  │                                                  │  │  checkout      │ │
│  │                                                  │  │                │ │
│  │                                                  │  │  ────────────│ │
│  │  [CONTINUE SHOPPING]                            │  │                │ │
│  │                                                  │  │  HAVE A CODE? │ │
│  │                                                  │  │  ┌──────────┐ │ │
│  │                                                  │  │  │          │ │ │
│  │                                                  │  │  └──────────┘ │ │
│  │                                                  │  │  [APPLY]     │ │
│  │                                                  │  │                │ │
│  └──────────────────────────────────────────────────┘  └────────────────┘ │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                       YOU MIGHT ALSO LIKE                                  │
│                                                                            │
│  [ProductCard] [ProductCard] [ProductCard] [ProductCard]                  │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                              [FOOTER]                                      │
└────────────────────────────────────────────────────────────────────────────┘
```

---

### 10.2 Shop All Page

**URL:** `/shop`  
**Purpose:** Browse all products (Water + RIG combined)  
**Priority:** P0  

Same structure as Collection Page but with:
- All products from all categories
- Category filter (Water, Theurgy, F.U., RIG)
- Sub-category filters (Tees, Hoodies, Drinkware, etc.)

---

### 10.3 Checkout Flow

**Note:** Using Stripe Checkout (hosted page) for MVP. Custom checkout in Phase 2.

```typescript
// Stripe Checkout Session Creation
interface CheckoutSession {
  lineItems: {
    priceId: string;
    quantity: number;
  }[];
  customerEmail?: string;
  metadata: {
    userId?: string;
    cartId?: string;
  };
  successUrl: string;
  cancelUrl: string;
  shippingAddressCollection: {
    allowedCountries: ['NL', 'BE', 'DE', 'FR', 'UK', 'US'];
  };
}
```

---

## 11. LEGAL PAGES

### 11.1 Privacy Policy

**URL:** `/legal/privacy`  
**Priority:** P0 (Required for launch)

### 11.2 Terms of Use

**URL:** `/legal/terms`  
**Priority:** P0 (Required for launch)

### 11.3 Cookie Policy

**URL:** `/legal/cookies`  
**Priority:** P0 (Required for launch)

### 11.4 Accessibility

**URL:** `/legal/accessibility`  
**Priority:** P1

### 11.5 Brand Protection

**URL:** `/legal/brand-protection`  
**Priority:** P1

### 11.6 Disclaimer

**URL:** `/legal/disclaimer`  
**Priority:** P1

**All legal pages follow this template:**

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              [NAVBAR]                                      │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  PRIVACY POLICY                                                            │
│                                                                            │
│  Last updated: January 14, 2026                                            │
│                                                                            │
│  ─────────────────────────────────────────────────────────────────────────│
│                                                                            │
│  ┌────────────────┐  ┌──────────────────────────────────────────────────┐ │
│  │                │  │                                                  │ │
│  │  TABLE OF      │  │  1. INTRODUCTION                                 │ │
│  │  CONTENTS      │  │                                                  │ │
│  │                │  │  Stichting GRATIS ("we", "us", "our") is        │ │
│  │  1. Intro      │  │  committed to protecting your privacy...        │ │
│  │  2. Collection │  │                                                  │ │
│  │  3. Use        │  │  [Full legal text continues...]                 │ │
│  │  4. Sharing    │  │                                                  │ │
│  │  5. Retention  │  │                                                  │ │
│  │  6. Security   │  │  2. DATA WE COLLECT                             │ │
│  │  7. Rights     │  │                                                  │ │
│  │  8. Contact    │  │  [Content...]                                   │ │
│  │                │  │                                                  │ │
│  └────────────────┘  └──────────────────────────────────────────────────┘ │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                              [FOOTER]                                      │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 12. FOOTER PAGES

All footer pages (Giving, Reports, Accreditation, Information) follow similar content page templates. These are lower priority for MVP but should have placeholder pages.

**Priority for MVP:**
- P0: Contact, Privacy, Terms, Cookies
- P1: All other footer links (can show "Coming Soon" or redirect to main sections)

---

## APPENDIX A: FIREBASE DATA STRUCTURES

```typescript
// Firestore Collections

// users
interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  membershipTier: 'explorer' | 'insider' | 'core' | 'founder';
  membershipStatus: 'active' | 'canceled' | 'expired';
  stripeCustomerId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// products
interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  variants: ProductVariant[];
  category: string;
  status: 'active' | 'draft' | 'archived';
  inventory: number;
  createdAt: Timestamp;
}

// orders
interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'canceled';
  shippingAddress: Address;
  stripePaymentIntentId: string;
  createdAt: Timestamp;
}

// donations
interface Donation {
  id: string;
  userId?: string;
  email: string;
  amount: number;
  type: 'one-time' | 'monthly';
  designation?: string;
  stripeSubscriptionId?: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: Timestamp;
}

// events
interface Event {
  id: string;
  title: string;
  date: Timestamp;
  location: Location;
  type: 'gratis_event' | 'partner_event' | 'festival';
  ticketInfo: TicketInfo;
  image: string;
  description: string;
  status: 'upcoming' | 'ongoing' | 'past';
}

// videos
interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: number;
  category: 'unveil' | 'nexus' | 'icon' | 'tales' | 'yarns';
  publishedAt: Timestamp;
  viewCount: number;
  featured: boolean;
}

// jobs
interface JobPosting {
  id: string;
  title: string;
  location: string;
  type: string;
  compensation: Compensation;
  description: string;
  requirements: string[];
  status: 'open' | 'closed';
  createdAt: Timestamp;
}

// volunteer_applications
interface VolunteerApplication {
  id: string;
  name: string;
  email: string;
  city: string;
  country: string;
  interests: string[];
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp;
}

// newsletter_subscribers
interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: Timestamp;
  status: 'active' | 'unsubscribed';
}
```

---

## APPENDIX B: API ENDPOINTS (Firebase Functions)

```typescript
// Stripe Integration
POST /api/checkout/create-session
POST /api/checkout/webhook
POST /api/subscriptions/create
POST /api/subscriptions/cancel
POST /api/donations/create

// Products
GET /api/products
GET /api/products/:slug
GET /api/collections/:slug

// Orders
POST /api/orders/create
GET /api/orders/:id
GET /api/orders/user/:userId

// Users
POST /api/users/create
GET /api/users/:id
PUT /api/users/:id

// Newsletter
POST /api/newsletter/subscribe
POST /api/newsletter/unsubscribe

// Applications
POST /api/applications/volunteer
POST /api/applications/job
POST /api/applications/ngo
```

---

## APPENDIX C: MVP LAUNCH CHECKLIST

### Must Have (P0)
- [ ] Home page complete
- [ ] GRATIS landing + Water product page
- [ ] Theurgy + F.U. pre-order pages
- [ ] RIG landing + at least 3 collections
- [ ] ARCANE events page
- [ ] TRIBE landing with membership tiers
- [ ] IMPACT TV landing
- [ ] SPARK landing + Verve (donate) + Enlist (careers)
- [ ] Sign In / Sign Up / Account
- [ ] Cart + Checkout (Stripe)
- [ ] Privacy Policy, Terms, Cookies
- [ ] Cookie consent banner
- [ ] Mobile responsive
- [ ] SSL certificate

### Should Have (P1)
- [ ] All RIG collection pages
- [ ] All TRIBE sub-pages (HEART)
- [ ] All IMPACT TV sub-pages (UNITY)
- [ ] Infuse + Blaze pages
- [ ] Search functionality
- [ ] Wishlist
- [ ] Order tracking
- [ ] Email notifications

### Nice to Have (P2)
- [ ] Ambassador nominations
- [ ] NGO applications
- [ ] Scholarship applications
- [ ] Crypto donations
- [ ] Reviews system
- [ ] Loyalty points

---

**END OF WIREFRAME SPECIFICATIONS**

Document prepared by Claude AI for GRATIS.NGO engineering team.
For questions: Contact Eric Burnik (MAV€RIC)
