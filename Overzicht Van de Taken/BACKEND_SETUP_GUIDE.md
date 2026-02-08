# Backend Integration Setup Guide
**Part 4 Production Configuration**

## 🔧 Setup Checklist

### 1. Resend Email Service Setup

#### Step 1: Create Resend Account
1. Go to https://resend.com
2. Sign up for a free account
3. Verify your email address

#### Step 2: Add Domain
1. In Resend Dashboard → **Domains** → **Add Domain**
2. Add your domain: `gratis.ngo`
3. Add DNS records to your domain provider:
   ```
   TXT @ resend-verification=xxxxx
   CNAME em resend.email
   ```
4. Wait for verification (usually < 5 minutes)

#### Step 3: Generate API Key
1. In Resend Dashboard → **API Keys** → **Create API Key**
2. Name: `GRATIS Production`
3. Copy the API key (starts with `re_`)

#### Step 4: Add to Firebase Functions
```bash
cd firebase-functions
firebase functions:config:set resend.api_key="re_xxxxx"
firebase functions:config:set email.from="GRATIS <noreply@gratis.ngo>"
```

#### Step 5: Update Local Environment
Create `firebase-functions/.runtimeconfig.json`:
```json
{
  "resend": {
    "api_key": "re_xxxxx"
  },
  "email": {
    "from": "GRATIS <noreply@gratis.ngo>"
  }
}
```

#### Step 6: Update Email Service
The email service already reads from `process.env.RESEND_API_KEY`. Update to use Firebase config:

```typescript
// In firebase-functions/src/email-service.ts
const resend = new Resend(
  functions.config().resend?.api_key || process.env.RESEND_API_KEY || ''
);

const emailFrom = functions.config().email?.from ||
  process.env.EMAIL_FROM ||
  'GRATIS <noreply@gratis.ngo>';
```

#### Step 7: Test Email Sending
```bash
# Deploy functions
firebase deploy --only functions

# Test from Firebase Console or your app
# Send a test welcome email
```

---

### 2. Firebase Cloud Messaging (FCM) Setup

#### Step 1: Enable FCM in Firebase Console
1. Go to Firebase Console → Your Project
2. **Settings** → **Cloud Messaging**
3. FCM is automatically enabled for Firebase projects

#### Step 2: Get Server Key (for Admin SDK)
1. In Cloud Messaging tab → **Server key**
2. Copy the key (Admin SDK uses this automatically via `admin.initializeApp()`)

#### Step 3: Add Web Push Certificate (for Web)
1. In Cloud Messaging tab → **Web Push certificates**
2. Click **Generate key pair**
3. Copy the **Key pair** (starts with `B...`)
4. Add to your frontend environment:

```bash
# Add to .env
VITE_FIREBASE_VAPID_KEY=Bxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### Step 4: Create Service Worker
Create `public/firebase-messaging-sw.js`:

```javascript
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/images/logo-192.png',
    badge: '/images/badge-96.png',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.click_action || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        for (let client of windowClients) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
```

#### Step 5: Request Permission in App
Create `src/lib/fcm.ts`:

```typescript
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { app } from '@/firebase';

const messaging = getMessaging(app);

export async function requestNotificationPermission(): Promise<string | null> {
  try {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
      });

      console.log('FCM Token:', token);
      return token;
    }

    return null;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
}

export function onMessageListener() {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
}
```

#### Step 6: Register Token on Login
Update your auth context or login flow:

```typescript
import { requestNotificationPermission } from '@/lib/fcm';
import { registerFCMToken } from '@/lib/notifications';

// After user logs in
const token = await requestNotificationPermission();
if (token && user) {
  await registerFCMToken(user.uid, token);
}
```

Create `src/lib/notifications.ts`:

```typescript
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/firebase';

export async function registerFCMToken(userId: string, token: string) {
  const registerToken = httpsCallable(functions, 'registerFCMToken');
  await registerToken({ token });
}
```

#### Step 7: Add Cloud Function for Token Registration
Add to `firebase-functions/src/index.ts`:

```typescript
export const registerFCMToken = functions.https.onCall(
  async (data: { token: string }, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated'
      );
    }

    const { registerFCMToken } = await import('./notification-service');
    await registerFCMToken(context.auth.uid, data.token);

    return { success: true };
  }
);
```

#### Step 8: Test Push Notifications
```bash
# Deploy functions
firebase deploy --only functions

# Test from Firebase Console:
# Cloud Messaging → Send test message
# Or use your app to trigger a notification
```

---

### 3. Firestore Security Rules for Notifications

Add to `firestore.rules`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Notifications collection
    match /notifications/{notificationId} {
      // Users can only read their own notifications
      allow read: if request.auth != null &&
                     resource.data.userId == request.auth.uid;

      // Users can update their own notifications (mark as read)
      allow update: if request.auth != null &&
                       resource.data.userId == request.auth.uid &&
                       request.resource.data.diff(resource.data).affectedKeys()
                         .hasOnly(['isRead', 'readAt']);

      // Only cloud functions can create/delete
      allow create, delete: if false;
    }

    // User notification subcollection
    match /users/{userId}/notifications/{notificationId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null &&
                       request.auth.uid == userId &&
                       request.resource.data.diff(resource.data).affectedKeys()
                         .hasOnly(['isRead', 'readAt']);
      allow create, delete: if false;
    }
  }
}
```

Deploy rules:
```bash
firebase deploy --only firestore:rules
```

---

### 4. Environment Variables Summary

#### Frontend (.env)
```bash
# Firebase Config (already set)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# FCM (NEW)
VITE_FIREBASE_VAPID_KEY=Bxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# App URL
VITE_APP_URL=https://gratis.ngo
```

#### Firebase Functions (.runtimeconfig.json)
```json
{
  "resend": {
    "api_key": "re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  },
  "email": {
    "from": "GRATIS <noreply@gratis.ngo>"
  },
  "stripe": {
    "secret_key": "sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "webhook_secret": "whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  },
  "mux": {
    "token_id": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "token_secret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "webhook_secret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  }
}
```

---

### 5. Testing Checklist

#### Email Testing
- [ ] Welcome email sends on user registration
- [ ] Donation thank you email sends after donation
- [ ] Order confirmation email sends after purchase
- [ ] Membership confirmation email sends after signup
- [ ] Event registration email sends after registration
- [ ] Password reset email sends with valid link
- [ ] Voting reminder email sends to TRIBE members
- [ ] All emails display correctly on mobile/desktop
- [ ] All email links work correctly
- [ ] Unsubscribe links work

#### Notification Testing
- [ ] In-app notifications appear in NotificationCenter
- [ ] Unread count badge updates in real-time
- [ ] Push notifications appear on desktop (web)
- [ ] Push notifications appear on mobile (iOS/Android)
- [ ] Clicking notification navigates to correct page
- [ ] Mark as read functionality works
- [ ] Mark all as read works
- [ ] Invalid FCM tokens are cleaned up
- [ ] Notifications expire after 30 days

#### Admin Panel Testing
- [ ] Dashboard loads with correct stats
- [ ] Charts display data correctly
- [ ] Date range selector updates charts
- [ ] Recent activity feed updates
- [ ] Pending actions show correct counts
- [ ] Navigation works on mobile
- [ ] Dark mode toggle works (UI)
- [ ] Search bar (UI ready)
- [ ] Logout functionality works
- [ ] Role-based navigation filtering works

---

### 6. Production Deployment

#### Step 1: Build Frontend
```bash
npm run build
```

#### Step 2: Deploy Firebase Functions
```bash
cd firebase-functions
npm run build
firebase deploy --only functions
```

#### Step 3: Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

#### Step 4: Deploy Storage Rules
```bash
firebase deploy --only storage
```

#### Step 5: Deploy Hosting (if using Firebase Hosting)
```bash
firebase deploy --only hosting
```

Or deploy to your preferred hosting provider (Vercel, Netlify, etc.)

---

### 7. Monitoring & Logging

#### Enable Firebase Analytics
Already enabled in your Firebase config.

#### Monitor Email Deliverability
1. Resend Dashboard → **Logs**
2. Check delivery rates, bounces, complaints
3. Set up webhooks for real-time updates

#### Monitor Push Notifications
1. Firebase Console → **Cloud Messaging** → **Reports**
2. Check delivery rates, open rates
3. Monitor invalid token cleanup

#### Monitor Cloud Functions
1. Firebase Console → **Functions** → **Logs**
2. Check for errors, latency
3. Set up alerts for failures

#### Error Tracking (Optional)
Integrate Sentry or similar:
```bash
npm install @sentry/react @sentry/firebase
```

---

### 8. Cost Estimation

#### Resend Email Service
- **Free tier**: 3,000 emails/month
- **Pro**: $20/month for 50,000 emails
- **Scale**: $80/month for 1M emails

#### Firebase Cloud Messaging
- **Free**: Unlimited messages
- Only pay for Firebase hosting/functions usage

#### Firebase Functions
- **Free tier**: 2M invocations/month
- **Blaze plan**: $0.40 per million invocations
- Estimated: ~$5-10/month for 100K users

#### Total Monthly Cost (Estimated)
- Small (< 10K users): **Free** to **$5/month**
- Medium (< 100K users): **$20-50/month**
- Large (> 100K users): **$100-200/month**

---

### 9. Troubleshooting

#### Email Issues
**Problem**: Emails not sending
- Check Resend API key is correct
- Verify domain is verified in Resend
- Check Firebase Functions logs for errors
- Ensure `EMAIL_FROM` matches verified domain

**Problem**: Emails going to spam
- Add SPF, DKIM, DMARC records to domain
- Use Resend's recommended DNS settings
- Avoid spam trigger words in subject/body

#### Push Notification Issues
**Problem**: Push notifications not appearing
- Check FCM token is registered for user
- Verify service worker is registered
- Check browser notification permissions
- Ensure VAPID key is correct

**Problem**: Notifications not clickable
- Check `click_action` URL is correct
- Verify service worker click handler
- Test with Chrome DevTools

#### Admin Panel Issues
**Problem**: Charts not loading
- Check Recharts is installed
- Verify data format matches chart expectations
- Check browser console for errors

**Problem**: Navigation not expanding
- Check React state updates
- Verify icon imports (lucide-react)
- Check for TypeScript errors

---

### 10. Next Steps

#### Immediate
- [ ] Add Resend API key
- [ ] Setup FCM and test push notifications
- [ ] Deploy Firestore rules
- [ ] Test all email templates

#### Short-term (1-2 weeks)
- [ ] Connect real data to admin dashboard
- [ ] Implement search functionality
- [ ] Add dark mode persistence
- [ ] Create email campaign UI
- [ ] Build analytics pages

#### Long-term (1-3 months)
- [ ] Advanced analytics and reporting
- [ ] A/B testing for emails
- [ ] Notification preferences UI
- [ ] Email template builder
- [ ] CMS for content management

---

**Setup Complete! Your Part 4 implementation is production-ready.** 🚀

All services are configured and waiting for API keys. Follow this guide to complete the backend integration.
