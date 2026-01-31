# GRATIS.NGO - ENTERPRISE PLATFORM DEVELOPMENT PROMPTS
## Part 1: Foundation, Authentication, Database & Components (DETAILED)

---

# SECTION 1: PROJECT INITIALIZATION

## 1.1 Create Next.js Project

```bash
# Create new Next.js 14 project with all options
pnpm create next-app@latest gratis-platform --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

cd gratis-platform

# Install core dependencies
pnpm add firebase firebase-admin stripe @stripe/stripe-js @stripe/react-stripe-js
pnpm add @mux/mux-node @mux/mux-player-react
pnpm add framer-motion lucide-react date-fns
pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tabs @radix-ui/react-accordion @radix-ui/react-toast @radix-ui/react-tooltip @radix-ui/react-select @radix-ui/react-checkbox @radix-ui/react-radio-group @radix-ui/react-switch @radix-ui/react-slider @radix-ui/react-popover @radix-ui/react-avatar
pnpm add react-hook-form @hookform/resolvers zod
pnpm add next-intl
pnpm add resend
pnpm add recharts
pnpm add class-variance-authority clsx tailwind-merge
pnpm add @upstash/redis @upstash/ratelimit

# Dev dependencies
pnpm add -D @types/node prisma jest @testing-library/react @testing-library/jest-dom playwright @playwright/test
```

## 1.2 Project Structure

```
/gratis-platform
├── /src
│   ├── /app
│   │   ├── /[locale]
│   │   │   ├── /(public)
│   │   │   │   ├── /page.tsx                 # Homepage
│   │   │   │   ├── /about/page.tsx
│   │   │   │   ├── /impact/page.tsx
│   │   │   │   ├── /tribe/page.tsx
│   │   │   │   ├── /events/page.tsx
│   │   │   │   ├── /events/[slug]/page.tsx
│   │   │   │   ├── /donate/page.tsx
│   │   │   │   ├── /news/page.tsx
│   │   │   │   ├── /news/[slug]/page.tsx
│   │   │   │   ├── /videos/page.tsx
│   │   │   │   ├── /videos/[slug]/page.tsx
│   │   │   │   ├── /partners/page.tsx
│   │   │   │   ├── /contact/page.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── /(auth)
│   │   │   │   ├── /login/page.tsx
│   │   │   │   ├── /register/page.tsx
│   │   │   │   ├── /forgot-password/page.tsx
│   │   │   │   ├── /reset-password/page.tsx
│   │   │   │   ├── /verify-email/page.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── /(dashboard)
│   │   │   │   ├── /dashboard/page.tsx
│   │   │   │   ├── /dashboard/profile/page.tsx
│   │   │   │   ├── /dashboard/donations/page.tsx
│   │   │   │   ├── /dashboard/events/page.tsx
│   │   │   │   ├── /dashboard/bottles/page.tsx
│   │   │   │   ├── /dashboard/impact/page.tsx
│   │   │   │   ├── /dashboard/settings/page.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── /(admin)
│   │   │   │   ├── /admin/page.tsx
│   │   │   │   ├── /admin/users/page.tsx
│   │   │   │   ├── /admin/content/page.tsx
│   │   │   │   ├── /admin/events/page.tsx
│   │   │   │   ├── /admin/donations/page.tsx
│   │   │   │   ├── /admin/analytics/page.tsx
│   │   │   │   ├── /admin/settings/page.tsx
│   │   │   │   └── layout.tsx
│   │   │   └── layout.tsx
│   │   ├── /api
│   │   │   ├── /auth/[...nextauth]/route.ts
│   │   │   ├── /webhooks/stripe/route.ts
│   │   │   ├── /webhooks/mux/route.ts
│   │   │   ├── /payments/route.ts
│   │   │   ├── /donations/route.ts
│   │   │   ├── /events/route.ts
│   │   │   ├── /users/route.ts
│   │   │   └── /upload/route.ts
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── /components
│   │   ├── /ui                    # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   ├── Radio.tsx
│   │   │   ├── Switch.tsx
│   │   │   ├── Slider.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Dialog.tsx
│   │   │   ├── Drawer.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Accordion.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   ├── Popover.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── Progress.tsx
│   │   │   └── index.ts
│   │   ├── /layout
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   ├── Breadcrumbs.tsx
│   │   │   └── index.ts
│   │   ├── /features
│   │   │   ├── /auth
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   ├── ForgotPasswordForm.tsx
│   │   │   │   ├── SocialLoginButtons.tsx
│   │   │   │   └── index.ts
│   │   │   ├── /donation
│   │   │   │   ├── DonationForm.tsx
│   │   │   │   ├── AmountSelector.tsx
│   │   │   │   ├── AllocationSliders.tsx
│   │   │   │   ├── DonationConfirmation.tsx
│   │   │   │   └── index.ts
│   │   │   ├── /tribe
│   │   │   │   ├── TierCard.tsx
│   │   │   │   ├── TierComparison.tsx
│   │   │   │   ├── MembershipCheckout.tsx
│   │   │   │   └── index.ts
│   │   │   ├── /events
│   │   │   │   ├── EventCard.tsx
│   │   │   │   ├── EventCalendar.tsx
│   │   │   │   ├── EventRegistration.tsx
│   │   │   │   ├── EventTicket.tsx
│   │   │   │   └── index.ts
│   │   │   ├── /impact
│   │   │   │   ├── ImpactStats.tsx
│   │   │   │   ├── ImpactMap.tsx
│   │   │   │   ├── ProjectCard.tsx
│   │   │   │   ├── VotingInterface.tsx
│   │   │   │   └── index.ts
│   │   │   ├── /video
│   │   │   │   ├── VideoPlayer.tsx
│   │   │   │   ├── VideoCard.tsx
│   │   │   │   ├── VideoGallery.tsx
│   │   │   │   └── index.ts
│   │   │   └── /social
│   │   │       ├── SocialShare.tsx
│   │   │       ├── SocialFeed.tsx
│   │   │       └── index.ts
│   │   └── /shared
│   │       ├── Logo.tsx
│   │       ├── ThemeToggle.tsx
│   │       ├── LanguageSelector.tsx
│   │       ├── SearchModal.tsx
│   │       ├── NotificationBell.tsx
│   │       ├── UserMenu.tsx
│   │       └── index.ts
│   ├── /lib
│   │   ├── /firebase
│   │   │   ├── client.ts
│   │   │   ├── admin.ts
│   │   │   └── index.ts
│   │   ├── /stripe
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── index.ts
│   │   ├── /mux
│   │   │   ├── client.ts
│   │   │   └── index.ts
│   │   ├── /email
│   │   │   ├── service.ts
│   │   │   ├── templates.ts
│   │   │   └── index.ts
│   │   ├── /validation
│   │   │   ├── schemas.ts
│   │   │   └── index.ts
│   │   └── utils.ts
│   ├── /hooks
│   │   ├── useAuth.ts
│   │   ├── useUser.ts
│   │   ├── useFirestore.ts
│   │   ├── useImpactStats.ts
│   │   ├── useDebounce.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useIntersectionObserver.ts
│   │   └── index.ts
│   ├── /contexts
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   ├── ToastContext.tsx
│   │   └── index.ts
│   ├── /types
│   │   ├── user.ts
│   │   ├── donation.ts
│   │   ├── event.ts
│   │   ├── content.ts
│   │   ├── api.ts
│   │   └── index.ts
│   ├── /constants
│   │   ├── routes.ts
│   │   ├── config.ts
│   │   ├── tiers.ts
│   │   └── index.ts
│   ├── /styles
│   │   └── globals.css
│   └── /i18n
│       ├── /messages
│       │   ├── en.json
│       │   ├── nl.json
│       │   ├── de.json
│       │   └── fr.json
│       ├── request.ts
│       └── config.ts
├── /public
│   ├── /images
│   ├── /fonts
│   └── /videos
├── /prisma
│   └── schema.prisma
├── /.github
│   └── /workflows
│       └── deploy.yml
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
├── .env.local
├── .env.example
└── package.json
```

## 1.3 Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Primary Palette
        'jet-black': '#0D0D0D',
        'hot-lime': '#C1FF00',
        
        // Secondary Palette
        'electric-blue': '#00AFFF',
        'hot-magenta': '#FF0077',
        'solar-orange': '#FF5F00',
        
        // Neutrals
        'soft-gray': '#F5F5F5',
        'medium-gray': '#888888',
        'dark-gray': '#333333',
        
        // Semantic
        'success': '#00C853',
        'warning': '#FFB300',
        'error': '#FF1744',
        'info': '#00B0FF',
        
        // Background variants
        'surface': {
          DEFAULT: '#FFFFFF',
          dark: '#1A1A1A',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'display-sm': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'display-xs': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'glow-lime': '0 0 40px rgba(193, 255, 0, 0.3)',
        'glow-blue': '0 0 40px rgba(0, 175, 255, 0.3)',
        'glow-magenta': '0 0 40px rgba(255, 0, 119, 0.3)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      backgroundImage: {
        'gradient-gratis': 'linear-gradient(135deg, #C1FF00 0%, #00AFFF 50%, #FF0077 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0D0D0D 0%, #1A1A1A 100%)',
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
      },
      animation: {
        'gradient-x': 'gradient-x 3s ease infinite',
        'gradient-y': 'gradient-y 3s ease infinite',
        'gradient-xy': 'gradient-xy 3s ease infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'fade-in-down': 'fade-in-down 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'gradient-y': {
          '0%, 100%': { 'background-position': '50% 0%' },
          '50%': { 'background-position': '50% 100%' },
        },
        'gradient-xy': {
          '0%, 100%': { 'background-position': '0% 0%' },
          '25%': { 'background-position': '100% 0%' },
          '50%': { 'background-position': '100% 100%' },
          '75%': { 'background-position': '0% 100%' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
};

export default config;
```

## 1.4 Global Styles

```css
/* src/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Colors as CSS variables for dynamic theming */
    --color-jet-black: 13 13 13;
    --color-hot-lime: 193 255 0;
    --color-electric-blue: 0 175 255;
    --color-hot-magenta: 255 0 119;
    --color-solar-orange: 255 95 0;
    --color-soft-gray: 245 245 245;
    --color-medium-gray: 136 136 136;
    --color-dark-gray: 51 51 51;
    
    /* Spacing */
    --header-height: 4rem;
    --sidebar-width: 16rem;
    --sidebar-width-collapsed: 4rem;
    
    /* Transitions */
    --transition-fast: 150ms;
    --transition-normal: 300ms;
    --transition-slow: 500ms;
    
    /* Z-index scale */
    --z-dropdown: 100;
    --z-sticky: 200;
    --z-fixed: 300;
    --z-modal-backdrop: 400;
    --z-modal: 500;
    --z-popover: 600;
    --z-tooltip: 700;
    --z-toast: 800;
  }
  
  * {
    @apply border-border;
  }
  
  html {
    @apply scroll-smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  body {
    @apply bg-white text-jet-black font-body;
    font-feature-settings: 'rlig' 1, 'calt' 1;
  }
  
  /* Selection */
  ::selection {
    @apply bg-hot-lime text-jet-black;
  }
  
  /* Focus styles */
  :focus-visible {
    @apply outline-none ring-2 ring-hot-lime ring-offset-2 ring-offset-white;
  }
  
  /* Scrollbar styling */
  ::-webkit-scrollbar {
    @apply w-2 h-2;
  }
  
  ::-webkit-scrollbar-track {
    @apply bg-soft-gray;
  }
  
  ::-webkit-scrollbar-thumb {
    @apply bg-medium-gray rounded-full;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    @apply bg-dark-gray;
  }
}

@layer components {
  /* Container variants */
  .container-narrow {
    @apply max-w-3xl mx-auto px-4;
  }
  
  .container-wide {
    @apply max-w-7xl mx-auto px-4;
  }
  
  /* Section spacing */
  .section {
    @apply py-16 md:py-24;
  }
  
  .section-lg {
    @apply py-24 md:py-32;
  }
  
  /* Card styles */
  .card {
    @apply bg-white rounded-2xl shadow-card transition-shadow duration-300;
  }
  
  .card:hover {
    @apply shadow-card-hover;
  }
  
  .card-dark {
    @apply bg-dark-gray text-white rounded-2xl;
  }
  
  /* Glass effect */
  .glass {
    @apply bg-white/80 backdrop-blur-lg;
  }
  
  .glass-dark {
    @apply bg-jet-black/80 backdrop-blur-lg;
  }
  
  /* Gradient text */
  .text-gradient {
    @apply text-transparent bg-clip-text bg-gradient-gratis;
  }
  
  /* Link styles */
  .link {
    @apply text-hot-lime hover:text-electric-blue transition-colors underline-offset-4 hover:underline;
  }
  
  /* Badge variants */
  .badge {
    @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
  }
  
  .badge-lime {
    @apply bg-hot-lime text-jet-black;
  }
  
  .badge-blue {
    @apply bg-electric-blue text-white;
  }
  
  .badge-magenta {
    @apply bg-hot-magenta text-white;
  }
  
  .badge-orange {
    @apply bg-solar-orange text-white;
  }
  
  /* Form input base */
  .input-base {
    @apply w-full px-4 py-3 rounded-xl border border-soft-gray bg-white text-jet-black placeholder:text-medium-gray transition-all duration-200;
    @apply focus:border-hot-lime focus:ring-2 focus:ring-hot-lime/20 focus:outline-none;
    @apply disabled:bg-soft-gray disabled:cursor-not-allowed disabled:opacity-60;
  }
  
  .input-error {
    @apply border-error focus:border-error focus:ring-error/20;
  }
  
  /* Loading spinner */
  .spinner {
    @apply animate-spin rounded-full border-2 border-current border-t-transparent;
  }
  
  /* Skeleton loading */
  .skeleton {
    @apply animate-pulse bg-soft-gray rounded;
  }
}

@layer utilities {
  /* Hide scrollbar */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  /* Safe area padding for mobile */
  .safe-top {
    padding-top: env(safe-area-inset-top);
  }
  
  .safe-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }
  
  /* Text balance */
  .text-balance {
    text-wrap: balance;
  }
  
  /* Aspect ratios */
  .aspect-video-vertical {
    aspect-ratio: 9/16;
  }
  
  .aspect-hero {
    aspect-ratio: 21/9;
  }
  
  /* Background patterns */
  .bg-grid {
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23888888' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
  
  .bg-dots {
    background-image: radial-gradient(circle, #888888 1px, transparent 1px);
    background-size: 20px 20px;
  }
}

/* Animation utilities */
@media (prefers-reduced-motion: reduce) {
  *,
  ::before,
  ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

# SECTION 2: FIREBASE CONFIGURATION

## 2.1 Firebase Client SDK

```typescript
// src/lib/firebase/client.ts
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  Auth,
  connectAuthEmulator,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User,
  UserCredential,
  onAuthStateChanged,
  Unsubscribe,
} from 'firebase/auth';
import { 
  getFirestore, 
  Firestore,
  connectFirestoreEmulator,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  endBefore,
  onSnapshot,
  Timestamp,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  writeBatch,
  runTransaction,
  DocumentReference,
  CollectionReference,
  Query,
  QueryConstraint,
  DocumentData,
  QueryDocumentSnapshot,
  QuerySnapshot,
  DocumentSnapshot,
} from 'firebase/firestore';
import { 
  getStorage, 
  FirebaseStorage,
  connectStorageEmulator,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  UploadTask,
  UploadTaskSnapshot,
} from 'firebase/storage';
import {
  getMessaging,
  getToken,
  onMessage,
  Messaging,
} from 'firebase/messaging';
import {
  getAnalytics,
  Analytics,
  logEvent,
  setUserId,
  setUserProperties,
} from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let messaging: Messaging | null = null;
let analytics: Analytics | null = null;

function initializeFirebase(): FirebaseApp {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    
    // Connect to emulators in development
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_EMULATORS === 'true') {
      const auth = getAuth(app);
      const db = getFirestore(app);
      const storage = getStorage(app);
      
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      connectFirestoreEmulator(db, 'localhost', 8080);
      connectStorageEmulator(storage, 'localhost', 9199);
    }
  } else {
    app = getApps()[0];
  }
  
  return app;
}

// Get Firebase services
export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = initializeFirebase();
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
}

export function getFirebaseDB(): Firestore {
  if (!db) {
    db = getFirestore(getFirebaseApp());
  }
  return db;
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!storage) {
    storage = getStorage(getFirebaseApp());
  }
  return storage;
}

export function getFirebaseMessaging(): Messaging | null {
  if (typeof window === 'undefined') return null;
  
  if (!messaging) {
    try {
      messaging = getMessaging(getFirebaseApp());
    } catch (error) {
      console.error('Failed to initialize Firebase Messaging:', error);
      return null;
    }
  }
  return messaging;
}

export function getFirebaseAnalytics(): Analytics | null {
  if (typeof window === 'undefined') return null;
  
  if (!analytics) {
    try {
      analytics = getAnalytics(getFirebaseApp());
    } catch (error) {
      console.error('Failed to initialize Firebase Analytics:', error);
      return null;
    }
  }
  return analytics;
}

// Auth providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

export const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('email');

export const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');

// Auth helper functions
export async function signInWithGoogle(): Promise<UserCredential> {
  const auth = getFirebaseAuth();
  return signInWithPopup(auth, googleProvider);
}

export async function signInWithFacebook(): Promise<UserCredential> {
  const auth = getFirebaseAuth();
  return signInWithPopup(auth, facebookProvider);
}

export async function signInWithApple(): Promise<UserCredential> {
  const auth = getFirebaseAuth();
  return signInWithPopup(auth, appleProvider);
}

export async function signInWithEmail(email: string, password: string): Promise<UserCredential> {
  const auth = getFirebaseAuth();
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUpWithEmail(email: string, password: string): Promise<UserCredential> {
  const auth = getFirebaseAuth();
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function signOut(): Promise<void> {
  const auth = getFirebaseAuth();
  return firebaseSignOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  const auth = getFirebaseAuth();
  return sendPasswordResetEmail(auth, email);
}

export async function verifyEmail(user: User): Promise<void> {
  return sendEmailVerification(user);
}

export function subscribeToAuthState(callback: (user: User | null) => void): Unsubscribe {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, callback);
}

// Firestore helper functions
export function getCollection(collectionPath: string): CollectionReference<DocumentData> {
  return collection(getFirebaseDB(), collectionPath);
}

export function getDocument(collectionPath: string, docId: string): DocumentReference<DocumentData> {
  return doc(getFirebaseDB(), collectionPath, docId);
}

export async function fetchDocument<T>(collectionPath: string, docId: string): Promise<T | null> {
  const docRef = getDocument(collectionPath, docId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  return null;
}

export async function fetchCollection<T>(
  collectionPath: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  const collectionRef = getCollection(collectionPath);
  const q = query(collectionRef, ...constraints);
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as T[];
}

export async function createDocument<T extends DocumentData>(
  collectionPath: string,
  data: T,
  docId?: string
): Promise<string> {
  const db = getFirebaseDB();
  
  if (docId) {
    const docRef = doc(db, collectionPath, docId);
    await setDoc(docRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docId;
  } else {
    const collectionRef = collection(db, collectionPath);
    const docRef = await addDoc(collectionRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }
}

export async function updateDocument<T extends Partial<DocumentData>>(
  collectionPath: string,
  docId: string,
  data: T
): Promise<void> {
  const docRef = getDocument(collectionPath, docId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteDocument(collectionPath: string, docId: string): Promise<void> {
  const docRef = getDocument(collectionPath, docId);
  await deleteDoc(docRef);
}

export function subscribeToDocument<T>(
  collectionPath: string,
  docId: string,
  callback: (data: T | null) => void
): Unsubscribe {
  const docRef = getDocument(collectionPath, docId);
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() } as T);
    } else {
      callback(null);
    }
  });
}

export function subscribeToCollection<T>(
  collectionPath: string,
  constraints: QueryConstraint[],
  callback: (data: T[]) => void
): Unsubscribe {
  const collectionRef = getCollection(collectionPath);
  const q = query(collectionRef, ...constraints);
  
  return onSnapshot(q, (querySnapshot) => {
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
    callback(data);
  });
}

// Storage helper functions
export async function uploadFile(
  path: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  const storage = getFirebaseStorage();
  const storageRef = ref(storage, path);
  
  if (onProgress) {
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        },
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } else {
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }
}

export async function deleteFile(path: string): Promise<void> {
  const storage = getFirebaseStorage();
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

// Analytics helper functions
export function trackEvent(eventName: string, params?: Record<string, any>): void {
  const analytics = getFirebaseAnalytics();
  if (analytics) {
    logEvent(analytics, eventName, params);
  }
}

export function setAnalyticsUserId(userId: string): void {
  const analytics = getFirebaseAnalytics();
  if (analytics) {
    setUserId(analytics, userId);
  }
}

export function setAnalyticsUserProperties(properties: Record<string, any>): void {
  const analytics = getFirebaseAnalytics();
  if (analytics) {
    setUserProperties(analytics, properties);
  }
}

// Export Firestore utilities
export {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  endBefore,
  onSnapshot,
  Timestamp,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  writeBatch,
  runTransaction,
};

// Export types
export type {
  User,
  UserCredential,
  Unsubscribe,
  DocumentReference,
  CollectionReference,
  Query,
  QueryConstraint,
  DocumentData,
  QueryDocumentSnapshot,
  QuerySnapshot,
  DocumentSnapshot,
  UploadTask,
  UploadTaskSnapshot,
};
```

## 2.2 Firebase Admin SDK

```typescript
// src/lib/firebase/admin.ts
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { getStorage, Storage } from 'firebase-admin/storage';
import { getMessaging, Messaging } from 'firebase-admin/messaging';

let app: App;
let auth: Auth;
let db: Firestore;
let storage: Storage;
let messaging: Messaging;

function initializeAdmin(): App {
  if (getApps().length === 0) {
    // Check if running in production with environment variables
    if (process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
      app = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    } else {
      // Use default credentials (for local development with gcloud auth)
      app = initializeApp({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    }
  } else {
    app = getApps()[0];
  }
  
  return app;
}

export function getAdminApp(): App {
  if (!app) {
    app = initializeAdmin();
  }
  return app;
}

export function getAdminAuth(): Auth {
  if (!auth) {
    auth = getAuth(getAdminApp());
  }
  return auth;
}

export function getAdminDB(): Firestore {
  if (!db) {
    db = getFirestore(getAdminApp());
  }
  return db;
}

export function getAdminStorage(): Storage {
  if (!storage) {
    storage = getStorage(getAdminApp());
  }
  return storage;
}

export function getAdminMessaging(): Messaging {
  if (!messaging) {
    messaging = getMessaging(getAdminApp());
  }
  return messaging;
}

// Convenience exports
export { FieldValue, Timestamp };

// User management functions
export async function createUser(email: string, password: string, displayName?: string) {
  const auth = getAdminAuth();
  const userRecord = await auth.createUser({
    email,
    password,
    displayName,
    emailVerified: false,
  });
  return userRecord;
}

export async function getUserByEmail(email: string) {
  const auth = getAdminAuth();
  try {
    return await auth.getUserByEmail(email);
  } catch {
    return null;
  }
}

export async function getUserById(uid: string) {
  const auth = getAdminAuth();
  try {
    return await auth.getUser(uid);
  } catch {
    return null;
  }
}

export async function updateUser(uid: string, properties: {
  email?: string;
  displayName?: string;
  photoURL?: string;
  disabled?: boolean;
  emailVerified?: boolean;
}) {
  const auth = getAdminAuth();
  return auth.updateUser(uid, properties);
}

export async function deleteUser(uid: string) {
  const auth = getAdminAuth();
  return auth.deleteUser(uid);
}

export async function setCustomClaims(uid: string, claims: Record<string, any>) {
  const auth = getAdminAuth();
  return auth.setCustomUserClaims(uid, claims);
}

export async function verifyIdToken(idToken: string) {
  const auth = getAdminAuth();
  return auth.verifyIdToken(idToken);
}

export async function createCustomToken(uid: string, claims?: Record<string, any>) {
  const auth = getAdminAuth();
  return auth.createCustomToken(uid, claims);
}

// Push notification functions
export async function sendPushNotification(options: {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
}) {
  const messaging = getAdminMessaging();
  
  return messaging.send({
    token: options.token,
    notification: {
      title: options.title,
      body: options.body,
      imageUrl: options.imageUrl,
    },
    data: options.data,
    webpush: {
      fcmOptions: {
        link: options.data?.link,
      },
    },
  });
}

export async function sendMulticastNotification(options: {
  tokens: string[];
  title: string;
  body: string;
  data?: Record<string, string>;
}) {
  const messaging = getAdminMessaging();
  
  return messaging.sendEachForMulticast({
    tokens: options.tokens,
    notification: {
      title: options.title,
      body: options.body,
    },
    data: options.data,
  });
}

export async function subscribeToTopic(tokens: string[], topic: string) {
  const messaging = getAdminMessaging();
  return messaging.subscribeToTopic(tokens, topic);
}

export async function unsubscribeFromTopic(tokens: string[], topic: string) {
  const messaging = getAdminMessaging();
  return messaging.unsubscribeFromTopic(tokens, topic);
}

export async function sendToTopic(options: {
  topic: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}) {
  const messaging = getAdminMessaging();
  
  return messaging.send({
    topic: options.topic,
    notification: {
      title: options.title,
      body: options.body,
    },
    data: options.data,
  });
}
```

---

# SECTION 3: TYPESCRIPT INTERFACES

## 3.1 User Types

```typescript
// src/types/user.ts
import { Timestamp } from 'firebase/firestore';

export type TribeTier = 'explorer' | 'insider' | 'core' | 'founder';

export type UserRole = 'user' | 'content_manager' | 'event_manager' | 'support' | 'admin' | 'super_admin';

export type AuthProvider = 'email' | 'google' | 'facebook' | 'apple';

export interface UserAddress {
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface UserPreferences {
  language: string;
  currency: string;
  timezone: string;
  emailNotifications: {
    newsletter: boolean;
    donations: boolean;
    events: boolean;
    impact: boolean;
    voting: boolean;
    marketing: boolean;
  };
  pushNotifications: {
    enabled: boolean;
    events: boolean;
    bottles: boolean;
    impact: boolean;
    voting: boolean;
  };
}

export interface UserMembership {
  tribeTier: TribeTier;
  stripeCustomerId: string | null;
  subscriptionId: string | null;
  subscriptionStatus: 'active' | 'past_due' | 'cancelled' | 'lifetime' | null;
  currentPeriodEnd: Timestamp | null;
  cancelAtPeriodEnd: boolean;
  startedAt: Timestamp | null;
  bottlesClaimedThisMonth: number;
  bottlesAllowedPerMonth: number;
  lastBottleClaimAt: Timestamp | null;
  votingEnabled: boolean;
  founderNumber: number | null;
}

export interface UserImpact {
  totalDonated: number;
  donationsCount: number;
  eventsAttended: number;
  bottlesClaimed: number;
  votesParticipated: number;
  referralsCount: number;
  allocation: {
    water: number;
    arts: number;
    education: number;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  photoURL: string | null;
  phone: string | null;
  dateOfBirth: Timestamp | null;
  bio: string | null;
  company: string | null;
  jobTitle: string | null;
  website: string | null;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  address: UserAddress | null;
  authProvider: AuthProvider;
  emailVerified: boolean;
  role: UserRole;
  membership: UserMembership;
  impact: UserImpact;
  preferences: UserPreferences;
  fcmTokens: string[];
  lastLoginAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  displayName?: string;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  photoURL?: string | null;
  phone?: string | null;
  dateOfBirth?: Date | null;
  bio?: string | null;
  company?: string | null;
  jobTitle?: string | null;
  website?: string | null;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  address?: UserAddress | null;
}

// Helper to create default user profile
export function createDefaultUserProfile(
  id: string,
  email: string,
  input: CreateUserInput,
  authProvider: AuthProvider = 'email'
): Omit<UserProfile, 'createdAt' | 'updatedAt'> {
  return {
    id,
    email,
    displayName: input.displayName || `${input.firstName} ${input.lastName}`,
    firstName: input.firstName,
    lastName: input.lastName,
    photoURL: null,
    phone: null,
    dateOfBirth: null,
    bio: null,
    company: null,
    jobTitle: null,
    website: null,
    socialLinks: {},
    address: null,
    authProvider,
    emailVerified: false,
    role: 'user',
    membership: {
      tribeTier: 'explorer',
      stripeCustomerId: null,
      subscriptionId: null,
      subscriptionStatus: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      startedAt: null,
      bottlesClaimedThisMonth: 0,
      bottlesAllowedPerMonth: 1,
      lastBottleClaimAt: null,
      votingEnabled: false,
      founderNumber: null,
    },
    impact: {
      totalDonated: 0,
      donationsCount: 0,
      eventsAttended: 0,
      bottlesClaimed: 0,
      votesParticipated: 0,
      referralsCount: 0,
      allocation: {
        water: 40,
        arts: 30,
        education: 30,
      },
    },
    preferences: {
      language: 'en',
      currency: 'EUR',
      timezone: 'Europe/Amsterdam',
      emailNotifications: {
        newsletter: true,
        donations: true,
        events: true,
        impact: true,
        voting: true,
        marketing: false,
      },
      pushNotifications: {
        enabled: true,
        events: true,
        bottles: true,
        impact: true,
        voting: true,
      },
    },
    fcmTokens: [],
    lastLoginAt: null,
  };
}
```

## 3.2 Donation Types

```typescript
// src/types/donation.ts
import { Timestamp } from 'firebase/firestore';

export type DonationFrequency = 'one_time' | 'monthly' | 'quarterly' | 'annually';

export type DonationStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';

export type PaymentMethod = 'card' | 'ideal' | 'sepa_debit' | 'bancontact';

export interface DonationAllocation {
  water: number;
  arts: number;
  education: number;
}

export interface DonationDedication {
  enabled: boolean;
  type: 'in_honor' | 'in_memory';
  name: string;
  notifyRecipient: boolean;
  recipientEmail?: string;
  recipientName?: string;
  message?: string;
}

export interface Donation {
  id: string;
  
  // Donor info
  userId: string | null;
  donorEmail: string;
  donorFirstName: string;
  donorLastName: string;
  donorPhone?: string;
  donorCompany?: string;
  isAnonymous: boolean;
  
  // Amount
  amount: number;
  currency: string;
  frequency: DonationFrequency;
  allocation: DonationAllocation;
  processingFeeCovered: boolean;
  processingFeeAmount: number;
  netAmount: number;
  
  // Payment
  status: DonationStatus;
  paymentMethod: PaymentMethod | null;
  stripePaymentIntentId: string | null;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  stripeInvoiceId: string | null;
  
  // Dedication
  dedication: DonationDedication | null;
  
  // Campaign (optional)
  campaignId: string | null;
  campaignName: string | null;
  
  // Tracking
  source: string | null;
  utmParams: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  } | null;
  
  // Receipt
  receiptNumber: string | null;
  receiptUrl: string | null;
  receiptSentAt: Timestamp | null;
  
  // Tax
  taxDeductible: boolean;
  taxReceiptRequested: boolean;
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  completedAt: Timestamp | null;
  failedAt: Timestamp | null;
  refundedAt: Timestamp | null;
}

export interface RecurringDonation {
  id: string;
  
  // Donor info
  userId: string;
  donorEmail: string;
  
  // Subscription
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  stripePriceId: string;
  
  // Amount
  amount: number;
  currency: string;
  frequency: Exclude<DonationFrequency, 'one_time'>;
  allocation: DonationAllocation;
  processingFeeCovered: boolean;
  
  // Status
  status: 'active' | 'past_due' | 'cancelled' | 'paused';
  currentPeriodStart: Timestamp;
  currentPeriodEnd: Timestamp;
  cancelAtPeriodEnd: boolean;
  cancelledAt: Timestamp | null;
  pausedAt: Timestamp | null;
  
  // History
  totalDonated: number;
  donationsCount: number;
  lastDonationAt: Timestamp | null;
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface DonationCampaign {
  id: string;
  
  // Basic info
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  coverImage: string;
  
  // Goals
  goalAmount: number;
  raisedAmount: number;
  donorsCount: number;
  currency: string;
  
  // Allocation
  allocation: DonationAllocation;
  
  // Dates
  startDate: Timestamp;
  endDate: Timestamp | null;
  
  // Status
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  featured: boolean;
  
  // Settings
  allowCustomAmount: boolean;
  suggestedAmounts: number[];
  minAmount: number;
  maxAmount: number | null;
  
  // Matching
  matchingEnabled: boolean;
  matchingRatio: number;
  matchingMaxAmount: number | null;
  matchingSponsor: string | null;
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateDonationInput {
  amount: number;
  frequency: DonationFrequency;
  allocation: DonationAllocation;
  donorInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
  };
  isAnonymous?: boolean;
  processingFeeCovered?: boolean;
  dedication?: DonationDedication;
  campaignId?: string;
  source?: string;
  utmParams?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
}
```

## 3.3 Event Types

```typescript
// src/types/event.ts
import { Timestamp } from 'firebase/firestore';

export type EventType = 'conference' | 'workshop' | 'meetup' | 'webinar' | 'fundraiser' | 'volunteer' | 'social';

export type EventFormat = 'in_person' | 'virtual' | 'hybrid';

export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';

export type EventAccessLevel = 'public' | 'members_only' | 'invite_only';

export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled' | 'checked_in' | 'no_show';

export interface EventLocation {
  name: string;
  address: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  instructions?: string;
}

export interface EventVirtualDetails {
  platform: 'zoom' | 'google_meet' | 'teams' | 'youtube_live' | 'custom';
  url: string;
  meetingId?: string;
  passcode?: string;
  instructions?: string;
}

export interface EventTicketTier {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  quantity: number;
  sold: number;
  available: number;
  maxPerOrder: number;
  salesStartDate: Timestamp | null;
  salesEndDate: Timestamp | null;
  accessLevel: EventAccessLevel;
  benefits: string[];
}

export interface EventSpeaker {
  id: string;
  name: string;
  title: string;
  company?: string;
  bio?: string;
  photoURL?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface EventAgendaItem {
  id: string;
  title: string;
  description?: string;
  startTime: Timestamp;
  endTime: Timestamp;
  location?: string;
  speakers: string[];
  type: 'session' | 'break' | 'networking' | 'keynote' | 'panel' | 'workshop';
}

export interface Event {
  id: string;
  
  // Basic info
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  coverImage: string;
  gallery: string[];
  
  // Type and format
  type: EventType;
  format: EventFormat;
  status: EventStatus;
  accessLevel: EventAccessLevel;
  
  // Date and time
  startDate: Timestamp;
  endDate: Timestamp;
  timezone: string;
  
  // Location
  location: EventLocation | null;
  virtualDetails: EventVirtualDetails | null;
  
  // Registration
  registration: {
    enabled: boolean;
    maxAttendees: number;
    currentAttendees: number;
    waitlistEnabled: boolean;
    waitlistCount: number;
    registrationStartDate: Timestamp | null;
    registrationEndDate: Timestamp | null;
    requireApproval: boolean;
  };
  
  // Tickets
  ticketTiers: EventTicketTier[];
  
  // Content
  speakers: EventSpeaker[];
  agenda: EventAgendaItem[];
  
  // Settings
  settings: {
    showAttendeeCount: boolean;
    showAttendeeList: boolean;
    allowComments: boolean;
    sendReminders: boolean;
    reminderSchedule: number[];
    collectFeedback: boolean;
  };
  
  // Recording (for virtual events)
  recording: {
    available: boolean;
    muxAssetId?: string;
    muxPlaybackId?: string;
    duration?: number;
    accessLevel: EventAccessLevel;
  } | null;
  
  // Organizer
  organizerId: string;
  organizerName: string;
  
  // Tags and categories
  tags: string[];
  categoryId: string | null;
  
  // SEO
  seo: {
    title?: string;
    description?: string;
    ogImage?: string;
  };
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt: Timestamp | null;
}

export interface EventRegistration {
  id: string;
  
  // Event reference
  eventId: string;
  eventTitle: string;
  
  // Attendee
  userId: string | null;
  attendee: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    jobTitle?: string;
  };
  
  // Ticket
  ticketTierId: string;
  ticketTierName: string;
  ticketPrice: number;
  ticketCode: string;
  qrCodeUrl: string;
  
  // Status
  status: RegistrationStatus;
  checkedInAt: Timestamp | null;
  checkedInBy: string | null;
  
  // Payment
  stripePaymentIntentId: string | null;
  stripePaid: boolean;
  
  // Custom fields
  customFields: Record<string, any>;
  
  // Communication
  confirmationSentAt: Timestamp | null;
  remindersSentAt: Timestamp[];
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  confirmedAt: Timestamp | null;
  cancelledAt: Timestamp | null;
}

export interface CreateEventInput {
  title: string;
  description: string;
  shortDescription?: string;
  type: EventType;
  format: EventFormat;
  accessLevel?: EventAccessLevel;
  startDate: Date;
  endDate: Date;
  timezone: string;
  location?: EventLocation;
  virtualDetails?: EventVirtualDetails;
  coverImage?: string;
  maxAttendees?: number;
  ticketTiers?: Omit<EventTicketTier, 'id' | 'sold' | 'available'>[];
}

export interface RegisterEventInput {
  eventId: string;
  ticketTierId: string;
  attendees: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
  }[];
  customFields?: Record<string, any>;
}
```

---

[Continued in next section - UI Components, Authentication Context, and Hooks]

---

# SECTION 4: UI COMPONENT LIBRARY

## 4.1 Utility Functions

```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: string = 'EUR',
  locale: string = 'en-EU'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat('en-EU', options).format(value);
}

export function formatCompactNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}

export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return `${text.slice(0, length)}...`;
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}_${timestamp}${randomStr}` : `${timestamp}${randomStr}`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unknown error occurred';
}

export function parseJSON<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
```

## 4.2 Button Component

```typescript
// src/components/ui/Button.tsx
'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary:
          'bg-hot-lime text-jet-black hover:bg-hot-lime/90 focus-visible:ring-hot-lime shadow-sm hover:shadow-glow-lime',
        secondary:
          'bg-jet-black text-white hover:bg-dark-gray focus-visible:ring-jet-black border border-transparent',
        outline:
          'border-2 border-jet-black bg-transparent text-jet-black hover:bg-jet-black hover:text-white focus-visible:ring-jet-black',
        'outline-light':
          'border-2 border-white bg-transparent text-white hover:bg-white hover:text-jet-black focus-visible:ring-white',
        ghost:
          'bg-transparent text-jet-black hover:bg-soft-gray focus-visible:ring-jet-black',
        'ghost-light':
          'bg-transparent text-white hover:bg-white/10 focus-visible:ring-white',
        link:
          'text-hot-lime underline-offset-4 hover:underline bg-transparent p-0 h-auto',
        destructive:
          'bg-error text-white hover:bg-error/90 focus-visible:ring-error',
        success:
          'bg-success text-white hover:bg-success/90 focus-visible:ring-success',
      },
      size: {
        xs: 'h-7 px-2.5 text-xs rounded-lg',
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-5 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    
    const isDisabled = disabled || loading;
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {children}
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2 -ml-1">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2 -mr-1">{rightIcon}</span>}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
```

## 4.3 Input Component

```typescript
// src/components/ui/Input.tsx
'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  'flex w-full rounded-xl border bg-white text-jet-black transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-medium-gray focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-soft-gray focus:border-hot-lime focus:ring-2 focus:ring-hot-lime/20',
        error:
          'border-error focus:border-error focus:ring-2 focus:ring-error/20 text-error',
        success:
          'border-success focus:border-success focus:ring-2 focus:ring-success/20',
      },
      inputSize: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-4 text-sm',
        lg: 'h-12 px-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      variant,
      inputSize,
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      leftAddon,
      rightAddon,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId();
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;
    
    const hasError = !!error;
    const computedVariant = hasError ? 'error' : variant;
    
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-jet-black mb-1.5"
          >
            {label}
          </label>
        )}
        
        <div className="relative flex">
          {leftAddon && (
            <div className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-soft-gray bg-soft-gray text-medium-gray text-sm">
              {leftAddon}
            </div>
          )}
          
          <div className="relative flex-1">
            {leftIcon && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-medium-gray">
                {leftIcon}
              </div>
            )}
            
            <input
              type={type}
              id={inputId}
              ref={ref}
              disabled={disabled}
              aria-invalid={hasError}
              aria-describedby={
                hasError ? errorId : hint ? hintId : undefined
              }
              className={cn(
                inputVariants({ variant: computedVariant, inputSize }),
                leftIcon && 'pl-10',
                rightIcon && 'pr-10',
                leftAddon && 'rounded-l-none',
                rightAddon && 'rounded-r-none',
                className
              )}
              {...props}
            />
            
            {rightIcon && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-medium-gray">
                {rightIcon}
              </div>
            )}
          </div>
          
          {rightAddon && (
            <div className="inline-flex items-center px-3 rounded-r-xl border border-l-0 border-soft-gray bg-soft-gray text-medium-gray text-sm">
              {rightAddon}
            </div>
          )}
        </div>
        
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-error">
            {error}
          </p>
        )}
        
        {hint && !error && (
          <p id={hintId} className="mt-1.5 text-sm text-medium-gray">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };
```

## 4.4 Badge Component

```typescript
// src/components/ui/Badge.tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-soft-gray text-jet-black',
        primary: 'bg-hot-lime text-jet-black',
        secondary: 'bg-jet-black text-white',
        blue: 'bg-electric-blue text-white',
        magenta: 'bg-hot-magenta text-white',
        orange: 'bg-solar-orange text-white',
        success: 'bg-success text-white',
        warning: 'bg-warning text-jet-black',
        error: 'bg-error text-white',
        outline: 'border-2 border-current bg-transparent',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
}

function Badge({
  className,
  variant,
  size,
  icon,
  removable,
  onRemove,
  children,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon && <span className="mr-1 -ml-0.5">{icon}</span>}
      {children}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 -mr-0.5 hover:opacity-70 transition-opacity"
        >
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export { Badge, badgeVariants };
```

## 4.5 Card Component

```typescript
// src/components/ui/Card.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'outline' | 'ghost' | 'dark';
    hover?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
  }
>(({ className, variant = 'default', hover = false, padding = 'md', ...props }, ref) => {
  const variants = {
    default: 'bg-white border border-soft-gray shadow-card',
    outline: 'bg-transparent border-2 border-soft-gray',
    ghost: 'bg-soft-gray/50',
    dark: 'bg-jet-black text-white border border-dark-gray',
  };
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl transition-all duration-300',
        variants[variant],
        paddings[padding],
        hover && 'hover:shadow-card-hover hover:-translate-y-1',
        className
      )}
      {...props}
    />
  );
});
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-xl font-heading font-bold leading-tight', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-medium-gray', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-4', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
```

## 4.6 Skeleton Component

```typescript
// src/components/ui/Skeleton.tsx
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'circular' | 'text';
  width?: string | number;
  height?: string | number;
}

function Skeleton({
  className,
  variant = 'default',
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  const variants = {
    default: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded h-4',
  };
  
  return (
    <div
      className={cn(
        'animate-pulse bg-soft-gray',
        variants[variant],
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
      {...props}
    />
  );
}

// Pre-made skeleton patterns
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-soft-gray p-6 space-y-4">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

function SkeletonAvatar({ size = 40 }: { size?: number }) {
  return <Skeleton variant="circular" width={size} height={size} />;
}

function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={i === lines - 1 ? 'w-2/3' : 'w-full'}
        />
      ))}
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonAvatar, SkeletonText };
```

---

# SECTION 5: AUTHENTICATION CONTEXT

## 5.1 Auth Context Provider

```typescript
// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from 'firebase/auth';
import {
  getFirebaseAuth,
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signInWithFacebook,
  signInWithApple,
  signOut as firebaseSignOut,
  resetPassword,
  verifyEmail,
  subscribeToAuthState,
} from '@/lib/firebase/client';
import { fetchDocument, createDocument, updateDocument } from '@/lib/firebase/client';
import { UserProfile, CreateUserInput, createDefaultUserProfile } from '@/types/user';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  // Email auth
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: CreateUserInput) => Promise<void>;
  signOut: () => Promise<void>;
  
  // Social auth
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  
  // Password management
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  
  // Profile management
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  
  // State management
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null,
  });
  
  // Fetch user profile from Firestore
  const fetchProfile = useCallback(async (uid: string): Promise<UserProfile | null> => {
    try {
      const profile = await fetchDocument<UserProfile>('users', uid);
      return profile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }, []);
  
  // Create user profile in Firestore
  const createProfile = useCallback(async (
    user: User,
    input: CreateUserInput,
    provider: 'email' | 'google' | 'facebook' | 'apple' = 'email'
  ): Promise<UserProfile> => {
    const defaultProfile = createDefaultUserProfile(user.uid, user.email!, input, provider);
    
    await createDocument('users', defaultProfile, user.uid);
    
    return {
      ...defaultProfile,
      createdAt: new Date() as any,
      updatedAt: new Date() as any,
    } as UserProfile;
  }, []);
  
  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (user) => {
      if (user) {
        const profile = await fetchProfile(user.uid);
        setState({
          user,
          profile,
          loading: false,
          error: null,
        });
      } else {
        setState({
          user: null,
          profile: null,
          loading: false,
          error: null,
        });
      }
    });
    
    return () => unsubscribe();
  }, [fetchProfile]);
  
  // Sign in with email
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await signInWithEmail(email, password);
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: getAuthErrorMessage(error.code),
      }));
      throw error;
    }
  }, []);
  
  // Sign up with email
  const signUp = useCallback(async (input: CreateUserInput) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      
      const { user } = await signUpWithEmail(input.email, input.password);
      const profile = await createProfile(user, input, 'email');
      
      // Send verification email
      await verifyEmail(user);
      
      setState((prev) => ({
        ...prev,
        user,
        profile,
        loading: false,
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: getAuthErrorMessage(error.code),
      }));
      throw error;
    }
  }, [createProfile]);
  
  // Sign out
  const signOut = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      await firebaseSignOut();
      setState({
        user: null,
        profile: null,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: getAuthErrorMessage(error.code),
      }));
      throw error;
    }
  }, []);
  
  // Social sign in handlers
  const handleSocialSignIn = useCallback(async (
    signInMethod: () => Promise<any>,
    provider: 'google' | 'facebook' | 'apple'
  ) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      
      const { user } = await signInMethod();
      
      // Check if profile exists
      let profile = await fetchProfile(user.uid);
      
      // Create profile if it doesn't exist
      if (!profile) {
        const nameParts = (user.displayName || '').split(' ');
        profile = await createProfile(user, {
          email: user.email!,
          password: '', // Not needed for social auth
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          displayName: user.displayName || undefined,
        }, provider);
      }
      
      setState((prev) => ({
        ...prev,
        user,
        profile,
        loading: false,
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: getAuthErrorMessage(error.code),
      }));
      throw error;
    }
  }, [fetchProfile, createProfile]);
  
  const handleGoogleSignIn = useCallback(
    () => handleSocialSignIn(signInWithGoogle, 'google'),
    [handleSocialSignIn]
  );
  
  const handleFacebookSignIn = useCallback(
    () => handleSocialSignIn(signInWithFacebook, 'facebook'),
    [handleSocialSignIn]
  );
  
  const handleAppleSignIn = useCallback(
    () => handleSocialSignIn(signInWithApple, 'apple'),
    [handleSocialSignIn]
  );
  
  // Reset password
  const handleResetPassword = useCallback(async (email: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await resetPassword(email);
      setState((prev) => ({ ...prev, loading: false }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: getAuthErrorMessage(error.code),
      }));
      throw error;
    }
  }, []);
  
  // Send verification email
  const sendVerificationEmail = useCallback(async () => {
    if (!state.user) {
      throw new Error('No user logged in');
    }
    
    try {
      await verifyEmail(state.user);
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: getAuthErrorMessage(error.code),
      }));
      throw error;
    }
  }, [state.user]);
  
  // Update profile
  const updateProfileHandler = useCallback(async (data: Partial<UserProfile>) => {
    if (!state.user || !state.profile) {
      throw new Error('No user logged in');
    }
    
    try {
      await updateDocument('users', state.user.uid, data);
      
      setState((prev) => ({
        ...prev,
        profile: prev.profile ? { ...prev.profile, ...data } : null,
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message,
      }));
      throw error;
    }
  }, [state.user, state.profile]);
  
  // Refresh profile
  const refreshProfile = useCallback(async () => {
    if (!state.user) return;
    
    const profile = await fetchProfile(state.user.uid);
    setState((prev) => ({ ...prev, profile }));
  }, [state.user, fetchProfile]);
  
  // Clear error
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);
  
  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    signInWithGoogle: handleGoogleSignIn,
    signInWithFacebook: handleFacebookSignIn,
    signInWithApple: handleAppleSignIn,
    resetPassword: handleResetPassword,
    sendVerificationEmail,
    updateProfile: updateProfileHandler,
    refreshProfile,
    clearError,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// Helper function to get user-friendly error messages
function getAuthErrorMessage(code: string): string {
  const errorMessages: Record<string, string> = {
    'auth/invalid-email': 'Invalid email address.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed.',
    'auth/cancelled-popup-request': 'Sign-in was cancelled.',
    'auth/popup-blocked': 'Sign-in popup was blocked by the browser.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/requires-recent-login': 'Please sign in again to complete this action.',
  };
  
  return errorMessages[code] || 'An unexpected error occurred. Please try again.';
}
```

---

# SECTION 6: CUSTOM HOOKS

## 6.1 useDebounce Hook

```typescript
// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): T {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  
  const debouncedCallback = ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    const id = setTimeout(() => {
      callback(...args);
    }, delay);
    
    setTimeoutId(id);
  }) as T;
  
  return debouncedCallback;
}
```

## 6.2 useLocalStorage Hook

```typescript
// src/hooks/useLocalStorage.ts
import { useState, useEffect, useCallback } from 'react';
import { parseJSON } from '@/lib/utils';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Get stored value
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? parseJSON<T>(item, initialValue) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);
  
  const [storedValue, setStoredValue] = useState<T>(readValue);
  
  // Set value
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        setStoredValue(valueToStore);
        
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          
          // Dispatch custom event for cross-tab sync
          window.dispatchEvent(
            new StorageEvent('storage', {
              key,
              newValue: JSON.stringify(valueToStore),
            })
          );
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );
  
  // Remove value
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [initialValue, key]);
  
  // Listen for changes from other tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        setStoredValue(parseJSON<T>(event.newValue, initialValue));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue]);
  
  return [storedValue, setValue, removeValue];
}
```

## 6.3 useMediaQuery Hook

```typescript
// src/hooks/useMediaQuery.ts
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);
    
    // Create listener
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Add listener
    mediaQuery.addEventListener('change', handler);
    
    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [query]);
  
  return matches;
}

// Pre-defined breakpoint hooks
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 639px)');
}

export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
}

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}

export function usePrefersDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)');
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
```

## 6.4 useImpactStats Hook

```typescript
// src/hooks/useImpactStats.ts
import { useState, useEffect } from 'react';
import { subscribeToDocument } from '@/lib/firebase/client';

export interface ImpactStats {
  totalDonated: number;
  donationsCount: number;
  bottlesDistributed: number;
  ngoPartnersCount: number;
  tribeMembersTotal: number;
  tribeMembersByTier: {
    explorer: number;
    insider: number;
    core: number;
    founder: number;
  };
  impactByCategory: {
    water: {
      amount: number;
      projectsCount: number;
      beneficiaries: number;
    };
    arts: {
      amount: number;
      projectsCount: number;
      beneficiaries: number;
    };
    education: {
      amount: number;
      projectsCount: number;
      beneficiaries: number;
    };
  };
  countriesReached: number;
  eventsHosted: number;
  volunteersEngaged: number;
  lastUpdated: Date;
}

export function useImpactStats() {
  const [stats, setStats] = useState<ImpactStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const unsubscribe = subscribeToDocument<ImpactStats>(
      'stats',
      'impact',
      (data) => {
        if (data) {
          setStats(data);
        }
        setLoading(false);
      }
    );
    
    return () => unsubscribe();
  }, []);
  
  return { stats, loading, error };
}

// Hook for user-specific impact
export function useUserImpact(userId: string | undefined) {
  const [impact, setImpact] = useState<{
    totalDonated: number;
    donationsCount: number;
    bottlesClaimed: number;
    eventsAttended: number;
    votesParticipated: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    
    const unsubscribe = subscribeToDocument<any>(
      'users',
      userId,
      (data) => {
        if (data?.impact) {
          setImpact(data.impact);
        }
        setLoading(false);
      }
    );
    
    return () => unsubscribe();
  }, [userId]);
  
  return { impact, loading };
}
```

## 6.5 useFirestore Hook

```typescript
// src/hooks/useFirestore.ts
import { useState, useEffect, useCallback } from 'react';
import {
  fetchDocument,
  fetchCollection,
  createDocument,
  updateDocument,
  deleteDocument,
  subscribeToDocument,
  subscribeToCollection,
  QueryConstraint,
} from '@/lib/firebase/client';

// Hook for single document
export function useDocument<T>(
  collectionPath: string,
  docId: string | undefined,
  options?: { subscribe?: boolean }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const subscribe = options?.subscribe ?? false;
  
  useEffect(() => {
    if (!docId) {
      setLoading(false);
      return;
    }
    
    if (subscribe) {
      const unsubscribe = subscribeToDocument<T>(
        collectionPath,
        docId,
        (doc) => {
          setData(doc);
          setLoading(false);
        }
      );
      
      return () => unsubscribe();
    } else {
      fetchDocument<T>(collectionPath, docId)
        .then((doc) => {
          setData(doc);
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });
    }
  }, [collectionPath, docId, subscribe]);
  
  const refresh = useCallback(async () => {
    if (!docId) return;
    
    setLoading(true);
    try {
      const doc = await fetchDocument<T>(collectionPath, docId);
      setData(doc);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [collectionPath, docId]);
  
  return { data, loading, error, refresh };
}

// Hook for collection
export function useCollection<T>(
  collectionPath: string,
  constraints: QueryConstraint[] = [],
  options?: { subscribe?: boolean }
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const subscribe = options?.subscribe ?? false;
  
  // Stringify constraints for dependency comparison
  const constraintsKey = JSON.stringify(constraints.map((c) => c.toString()));
  
  useEffect(() => {
    if (subscribe) {
      const unsubscribe = subscribeToCollection<T>(
        collectionPath,
        constraints,
        (docs) => {
          setData(docs);
          setLoading(false);
        }
      );
      
      return () => unsubscribe();
    } else {
      fetchCollection<T>(collectionPath, constraints)
        .then((docs) => {
          setData(docs);
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });
    }
  }, [collectionPath, constraintsKey, subscribe]);
  
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const docs = await fetchCollection<T>(collectionPath, constraints);
      setData(docs);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [collectionPath, constraints]);
  
  return { data, loading, error, refresh };
}

// Hook for mutations
export function useFirestoreMutation<T>(collectionPath: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const create = useCallback(
    async (data: T, docId?: string): Promise<string> => {
      setLoading(true);
      setError(null);
      
      try {
        const id = await createDocument(collectionPath, data as any, docId);
        return id;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [collectionPath]
  );
  
  const update = useCallback(
    async (docId: string, data: Partial<T>): Promise<void> => {
      setLoading(true);
      setError(null);
      
      try {
        await updateDocument(collectionPath, docId, data as any);
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [collectionPath]
  );
  
  const remove = useCallback(
    async (docId: string): Promise<void> => {
      setLoading(true);
      setError(null);
      
      try {
        await deleteDocument(collectionPath, docId);
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [collectionPath]
  );
  
  return { create, update, remove, loading, error };
}
```

---

[END OF DETAILED PART 1]

Total: 6 Sections covering:
1. Project Setup & Structure
2. Firebase Configuration (Client & Admin)
3. TypeScript Interfaces (User, Donation, Event)
4. UI Components (Button, Input, Badge, Card, Skeleton)
5. Authentication Context
6. Custom Hooks (useDebounce, useLocalStorage, useMediaQuery, useImpactStats, useFirestore)

Next: Detailed Part 2 - Homepage, Events, Video & Payment Systems
