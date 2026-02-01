# Quick Start: Test Emails Locally

## Local Email Testing (Without Resend)

While setting up Resend, you can test the email service locally using a mock implementation.

### Option 1: Console Logging (Immediate)

Update `firebase-functions/src/email-service.ts` to add a mock mode:

```typescript
const MOCK_MODE = !process.env.RESEND_API_KEY;

export async function sendEmail(options: SendEmailOptions) {
  if (MOCK_MODE) {
    // Mock mode - just log emails
    console.log('📧 MOCK EMAIL:', {
      to: options.to,
      subject: options.subject,
      type: options.type,
      data: options.data
    });
    return { success: true, id: 'mock-' + Date.now() };
  }

  // Real implementation...
}
```

### Option 2: MailHog (Docker)

Run a local email server:

```bash
docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog
```

Update email service to use MailHog:

```typescript
// Use nodemailer instead of Resend for local testing
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 1025,
  secure: false
});
```

View emails at: http://localhost:8025

### Option 3: Mailtrap (Free Online)

1. Sign up at https://mailtrap.io
2. Get SMTP credentials
3. Use with nodemailer in development

## Test All Email Templates

Create a test script `firebase-functions/test-emails.ts`:

```typescript
import { emails } from './src/email-service';

async function testAllEmails() {
  const testUser = {
    email: 'test@example.com',
    firstName: 'John'
  };

  console.log('Testing Welcome Email...');
  await emails.sendWelcome(testUser);

  console.log('Testing Donation Thank You...');
  await emails.sendDonationThankYou(testUser, {
    amount: 50,
    allocation: { water: 40, arts: 30, education: 30 },
    receiptUrl: 'https://example.com/receipt'
  });

  console.log('Testing Order Confirmation...');
  await emails.sendOrderConfirmation(testUser, {
    id: 'ORD-123',
    items: [
      { name: 'Water Bottle', quantity: 2 },
      { name: 'T-Shirt', quantity: 1 }
    ]
  });

  console.log('✅ All email tests complete!');
}

testAllEmails();
```

Run with:
```bash
cd firebase-functions
npx ts-node test-emails.ts
```

## Test Notifications Locally

### 1. Create Test Notification Function

Add to `firebase-functions/src/index.ts`:

```typescript
export const testNotification = functions.https.onCall(
  async (data: { userId: string; type: string }, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
    }

    const { notifications } = await import('./notification-service');

    switch (data.type) {
      case 'donation':
        await notifications.donationReceived(data.userId, 50);
        break;
      case 'order':
        await notifications.orderShipped(data.userId, 'ORD-123', '/orders/123');
        break;
      case 'voting':
        await notifications.votingOpen(data.userId, 'Q1 2026');
        break;
      case 'event':
        await notifications.eventReminder(data.userId, 'Water Walk', 'evt-123', 24);
        break;
      default:
        throw new functions.https.HttpsError('invalid-argument', 'Unknown type');
    }

    return { success: true };
  }
);
```

### 2. Call from Frontend

Create a test page `src/pages/TestNotifications.tsx`:

```tsx
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/firebase';

export default function TestNotifications() {
  const { user } = useAuth();

  const sendTest = async (type: string) => {
    if (!user) return;

    const testNotification = httpsCallable(functions, 'testNotification');
    await testNotification({ userId: user.uid, type });
    alert(`Test ${type} notification sent!`);
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Test Notifications</h1>
      <div className="space-y-2">
        <Button onClick={() => sendTest('donation')}>Test Donation</Button>
        <Button onClick={() => sendTest('order')}>Test Order</Button>
        <Button onClick={() => sendTest('voting')}>Test Voting</Button>
        <Button onClick={() => sendTest('event')}>Test Event</Button>
      </div>
    </div>
  );
}
```

Add route in your router.

### 3. Test Real-time Sync

1. Deploy functions: `firebase deploy --only functions`
2. Open app in two browser windows
3. Trigger notification in one window
4. Watch it appear in real-time in the other

## Check Firebase Emulator

Run Firebase emulators locally:

```bash
firebase emulators:start
```

This starts:
- Firestore emulator (localhost:8080)
- Functions emulator (localhost:5001)
- Auth emulator (localhost:9099)

Update your frontend to use emulators in development:

```typescript
// src/firebase.ts
if (import.meta.env.DEV) {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectFunctionsEmulator(functions, 'localhost', 5001);
}
```

## Verify Everything Works

### ✅ Checklist

- [ ] Email service logs emails in console (mock mode)
- [ ] Notification service creates Firestore documents
- [ ] NotificationCenter shows new notifications in real-time
- [ ] Unread count updates immediately
- [ ] Mark as read functionality works
- [ ] Admin dashboard loads without errors
- [ ] Charts render with mock data
- [ ] Navigation expands/collapses correctly
- [ ] Dark mode toggle changes UI
- [ ] Mobile responsive layout works

### 🐛 Common Issues

**Issue**: "Cannot find module 'resend'"
- Solution: Run `npm install` in firebase-functions folder

**Issue**: Notifications not appearing
- Check Firestore rules allow read access
- Verify user is logged in
- Check browser console for errors

**Issue**: Charts not rendering
- Verify recharts is installed
- Check data format matches chart expectations

**Issue**: "Auth emulator not running"
- Start emulators: `firebase emulators:start`
- Or comment out emulator connections for now

---

**Ready for Development! Start testing all features locally before adding production API keys.**
