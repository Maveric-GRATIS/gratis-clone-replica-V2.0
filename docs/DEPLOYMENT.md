# 🚀 GRATIS Platform - Deployment Guide

## Prerequisites

- Node.js 18+
- Firebase CLI: `npm install -g firebase-tools`
- Firebase project created
- Firebase Authentication enabled
- Firestore Database created
- Firebase Storage enabled

---

## 📋 Initial Setup

### 1. Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your Firebase credentials
# Get these from Firebase Console > Project Settings > Your apps > Web app
```

### 2. Install Dependencies

```bash
# Install main project dependencies
npm install

# Install Cloud Functions dependencies
cd firebase-functions
npm install
cd ..
```

### 3. Firebase Login

```bash
firebase login
firebase use --add  # Select your Firebase project
```

---

## 🔥 Deploy to Firebase

### Option 1: Full Deployment

```bash
# Deploy everything at once
firebase deploy
```

### Option 2: Selective Deployment

```bash
# Deploy only hosting (frontend)
npm run build
firebase deploy --only hosting

# Deploy only Firestore rules (REQUIRED)
firebase deploy --only firestore:rules

# Deploy only Storage rules (REQUIRED)
firebase deploy --only storage

# Deploy Cloud Functions (OPTIONAL - requires Blaze plan)
cd firebase-functions
npm run deploy
```

**Note:** Cloud Functions require Firebase Blaze (pay-as-you-go) plan. The app is fully secured with just Firestore and Storage rules deployed.

---

## 🔒 Security Setup (CRITICAL)

### 1. Deploy Security Rules

```bash
# Deploy Firestore security rules
firebase deploy --only firestore:rules

# Deploy Storage security rules
firebase deploy --only storage
```

### 2. Verify Rules in Firebase Console

1. Go to Firebase Console > Firestore Database > Rules
2. Verify rules are active
3. Test in Rules Playground:
   - Anonymous user trying to write: ❌ Should fail
   - Customer reading own data: ✅ Should succeed
   - Customer reading other user's data: ❌ Should fail
   - Admin reading any data: ✅ Should succeed

### 3. Enable App Check (Recommended)

1. Go to Firebase Console > App Check
2. Click "Get Started"
3. Select "reCAPTCHA v3"
4. Add your domain
5. Copy site key to environment variables

---

## 🧪 Testing Deployment

### Local Testing

```bash
# Run locally with production env
npm run dev

# Test Cloud Functions locally
cd firebase-functions
npm run serve
```

### Production Testing Checklist

- [ ] Homepage loads correctly
- [ ] User can sign up
- [ ] User can log in
- [ ] Products display correctly
- [ ] User can add items to cart
- [ ] Checkout process works
- [ ] Admin dashboard accessible (admin user only)
- [ ] Non-admin cannot access admin routes
- [ ] Images load from Firebase Storage
- [ ] Analytics tracking works

---

## 📊 Monitoring Setup

### 1. Enable Firebase Analytics

Already configured in code. Verify in Firebase Console > Analytics.

### 2. Set Up Alerts

1. Go to Firebase Console > Alerts
2. Create alerts for:
   - Cloud Function errors (> 10 in 5 min)
   - Failed auth attempts (> 50 in 5 min)
   - Hosting bandwidth spike (> 1GB in 1 hour)

### 3. Error Tracking (Optional)

```bash
# Install Sentry for advanced error tracking
npm install @sentry/react @sentry/vite-plugin
```

Add to `vite.config.ts`:
```typescript
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig({
  plugins: [
    sentryVitePlugin({
      org: "your-org",
      project: "gratis-platform"
    })
  ]
});
```

---

## 🔄 CI/CD Setup (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
          VITE_FIREBASE_MEASUREMENT_ID: ${{ secrets.VITE_FIREBASE_MEASUREMENT_ID }}

      - name: Deploy to Firebase
        uses: w9jds/firebase-action@master
        with:
          args: deploy --only hosting
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

---

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Firebase Deploy Permission Error

```bash
# Re-authenticate
firebase logout
firebase login
firebase use --add
```

### Firestore Rules Not Working

1. Check rules syntax in Firebase Console
2. Verify deployment: `firebase deploy --only firestore:rules`
3. Test in Rules Playground
4. Check Cloud Functions logs: `firebase functions:log`

### Images Not Loading

1. Verify Storage rules deployed: `firebase deploy --only storage`
2. Check CORS configuration
3. Verify image URLs in Firestore
4. Check Firebase Storage usage quota

---

## 📈 Performance Optimization

### 1. Enable Caching

In `firebase.json`:
```json
{
  "hosting": {
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### 2. Enable Compression

Already handled by Firebase Hosting.

### 3. Image Optimization

Use WebP format for images:
```bash
# Convert images to WebP
npm install sharp
node scripts/convert-to-webp.js
```

---

## 🔐 Environment Variables Reference

### Required for Production

```bash
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=

# Optional
VITE_MAPBOX_PUBLIC_TOKEN=
```

### Where to Get Values

All Firebase values: Firebase Console > Project Settings > Your apps > Web app

---

## 📞 Support

For deployment issues:
1. Check Firebase Console logs
2. Check Cloud Functions logs: `firebase functions:log`
3. Review [SECURITY.md](./SECURITY.md)
4. Contact team lead

---

**Last Updated:** January 13, 2026
**Deployment Status:** ✅ Ready for Production
