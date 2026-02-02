# Deployment Guide

## Overview

This guide covers deploying the GRATIS NGO platform to production using Vercel (frontend) and Firebase (backend).

---

## 🚀 Pre-Deployment Checklist

### 1. Code Quality
- ✅ All TypeScript errors resolved
- ✅ No ESLint warnings in production code
- ✅ All tests passing
- ✅ Code reviewed and approved

### 2. Environment Variables
- ✅ Production Firebase credentials configured
- ✅ Production Stripe keys configured
- ✅ All required environment variables set
- ✅ Sensitive data not committed to repository

### 3. Security
- ✅ Firebase Security Rules configured
- ✅ CORS policies configured
- ✅ API rate limiting enabled
- ✅ HTTPS enforced

### 4. Performance
- ✅ Images optimized (WebP format)
- ✅ Code splitting implemented
- ✅ Lazy loading configured
- ✅ Bundle size analyzed

### 5. Monitoring
- ✅ Error tracking configured (Sentry recommended)
- ✅ Analytics enabled (Firebase Analytics)
- ✅ Performance monitoring enabled
- ✅ Uptime monitoring configured

---

## 📦 Vercel Deployment (Frontend)

### 1. Initial Setup

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link project to Vercel
vercel link
```

### 2. Environment Variables

In Vercel Dashboard (`vercel.com` > Your Project > Settings > Environment Variables):

```env
# Firebase
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=gratis-ngo.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=gratis-ngo
VITE_FIREBASE_STORAGE_BUCKET=gratis-ngo.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-ABC123

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# App
VITE_APP_URL=https://gratis.ngo
VITE_API_URL=/api

# Features
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_SENTRY=true
VITE_ENABLE_SERVICE_WORKER=true
```

### 3. Vercel Configuration (`vercel.json`)

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    },
    {
      "source": "/(.*)\\.(js|css|woff|woff2|ttf|otf)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/home",
      "destination": "/",
      "permanent": true
    }
  ]
}
```

### 4. Deploy to Production

```bash
# Deploy to production
vercel --prod

# Or push to main branch (if auto-deploy is configured)
git push origin main
```

### 5. Custom Domain Setup

In Vercel Dashboard:
1. Go to Settings > Domains
2. Add your domain: `gratis.ngo`
3. Add www subdomain: `www.gratis.ngo`
4. Configure DNS records as instructed

**DNS Configuration**:
```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

---

## 🔥 Firebase Deployment (Backend)

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project (if not done)
firebase init
```

### 2. Firebase Configuration (`firebase.json`)

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|webp|svg)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  },
  "functions": {
    "source": "firebase-functions",
    "runtime": "nodejs18",
    "ignore": [
      "node_modules",
      ".git",
      "firebase-debug.log",
      "firebase-debug.*.log"
    ]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

### 3. Firestore Security Rules (`firestore.rules`)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isAdmin() {
      return isAuthenticated() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isOwner(userId);
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }

    // Orders collection
    match /orders/{orderId} {
      allow read: if isOwner(resource.data.userId) || isAdmin();
      allow create: if isAuthenticated();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }

    // Donations collection
    match /donations/{donationId} {
      allow read: if isOwner(resource.data.userId) || isAdmin();
      allow create: if isAuthenticated();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }

    // Projects collection
    match /projects/{projectId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Events collection
    match /events/{eventId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Notifications collection
    match /notifications/{notificationId} {
      allow read: if isOwner(resource.data.userId);
      allow create: if isAuthenticated();
      allow update: if isOwner(resource.data.userId);
      allow delete: if isOwner(resource.data.userId);
    }

    // Blog posts
    match /posts/{postId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Comments
    match /comments/{commentId} {
      allow read: if true;
      allow create: if isAuthenticated();
      allow update: if isOwner(resource.data.userId) || isAdmin();
      allow delete: if isOwner(resource.data.userId) || isAdmin();
    }
  }
}
```

### 4. Storage Security Rules (`storage.rules`)

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // User avatars
    match /avatars/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId
        && request.resource.size < 5 * 1024 * 1024  // 5MB max
        && request.resource.contentType.matches('image/.*');
    }

    // Project images
    match /projects/{projectId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
        && request.resource.size < 10 * 1024 * 1024  // 10MB max
        && request.resource.contentType.matches('image/.*');
    }

    // Event images
    match /events/{eventId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
        && request.resource.size < 10 * 1024 * 1024;
    }

    // Blog post images
    match /posts/{postId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
        && request.resource.size < 10 * 1024 * 1024;
    }
  }
}
```

### 5. Firebase Functions Environment

```bash
# Set environment variables for functions
firebase functions:config:set stripe.secret_key="sk_live_..."
firebase functions:config:set stripe.webhook_secret="whsec_..."
firebase functions:config:set email.api_key="..."

# View current config
firebase functions:config:get
```

### 6. Deploy Firebase

```bash
# Deploy everything
firebase deploy

# Deploy only functions
firebase deploy --only functions

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Deploy only Storage rules
firebase deploy --only storage:rules

# Deploy only hosting
firebase deploy --only hosting
```

---

## 🔐 Security Configuration

### 1. Firebase Authentication

Enable authentication methods in Firebase Console:
- ✅ Email/Password
- ✅ Google OAuth
- ✅ Facebook OAuth (optional)

Configure authorized domains:
- `gratis.ngo`
- `www.gratis.ngo`
- `localhost` (for development)

### 2. CORS Configuration

In Firebase Functions, add CORS headers:

```typescript
import * as cors from 'cors';

const corsHandler = cors({ origin: true });

export const myFunction = functions.https.onRequest((req, res) => {
  corsHandler(req, res, () => {
    // Function logic
  });
});
```

### 3. API Key Restrictions

In Google Cloud Console:
1. Go to Credentials
2. Restrict Firebase API key to:
   - HTTP referrers: `gratis.ngo/*`, `www.gratis.ngo/*`
   - APIs: Firebase, Firestore, Storage

---

## 📊 Monitoring & Analytics

### 1. Firebase Analytics

Already configured in `src/firebase.ts`. Events are automatically tracked:
- Page views
- User engagement
- Conversions
- Custom events

### 2. Sentry (Recommended)

```bash
# Install Sentry
npm install @sentry/react @sentry/vite-plugin

# Configure in src/main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://...@sentry.io/...',
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

### 3. Vercel Analytics

Enable in Vercel Dashboard > Analytics > Enable

### 4. Uptime Monitoring

Use services like:
- UptimeRobot (free)
- Pingdom
- StatusCake

Configure alerts for:
- Website downtime
- Slow response times (>2s)
- Certificate expiration

---

## 🚀 Performance Optimization

### 1. Code Splitting

Already implemented with React.lazy():
```typescript
const Dashboard = lazy(() => import('@/pages/Dashboard'));
```

### 2. Image Optimization

Use WebP format and lazy loading:
```typescript
<img
  src="/images/hero.webp"
  loading="lazy"
  alt="Hero"
/>
```

### 3. Bundle Analysis

```bash
# Analyze bundle size
npm run build -- --mode production

# View bundle report
npx vite-bundle-visualizer
```

### 4. Lighthouse Score Goals

Aim for scores of 90+ in all categories:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

---

## 🔄 CI/CD Pipeline

### GitHub Actions (`.github/workflows/deploy.yml`)

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:run
      - run: npm run lint

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

  deploy-firebase:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - name: Deploy to Firebase
        uses: w9jds/firebase-action@master
        with:
          args: deploy --only functions,firestore,storage
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

---

## 📱 Mobile App (Future)

### React Native Expo (Recommended)

```bash
# Install Expo CLI
npm install -g expo-cli

# Create new project
npx create-expo-app gratis-mobile

# Install dependencies
npm install @react-native-firebase/app @react-native-firebase/auth
```

### PWA (Progressive Web App)

Add service worker support:

```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'GRATIS NGO',
        short_name: 'GRATIS',
        description: 'Online shop supporting NGOs',
        theme_color: '#10b981',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
```

---

## 🆘 Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules dist .vercel
npm install
npm run build
```

### Firebase Functions Errors

```bash
# View logs
firebase functions:log

# Test locally
cd firebase-functions
npm run serve
```

### Environment Variables Not Working

- Ensure variables are prefixed with `VITE_`
- Restart dev server after adding variables
- Check Vercel dashboard for production variables

---

## 📞 Support Contacts

- **Frontend Issues**: Vercel Support
- **Backend Issues**: Firebase Support
- **Domain Issues**: DNS Provider Support
- **Payment Issues**: Stripe Support

---

**Deployment Status**: Ready for Production 🚀

