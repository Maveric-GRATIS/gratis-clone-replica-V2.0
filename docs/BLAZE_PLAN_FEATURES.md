# 🚀 Firebase Blaze Plan - Nieuwe Mogelijkheden

## ✨ Wat Je Nu Kunt Doen

Met de upgrade naar het Blaze (pay-as-you-go) plan heb je toegang tot:

### 1. ☁️ Cloud Functions (Hoogste Prioriteit)

Je hebt al Cloud Functions klaarstaan in `firebase-functions/src/`:

#### ✅ Beschikbare Functions:
- **stripe-webhooks.ts** - Stripe betalingen verwerken
- **stripe-functions.ts** - Stripe API calls
- **email-service.ts** - Email notificaties (via Resend)
- **notification-service.ts** - Push notificaties
- **admin-helpers.ts** - Admin taken automatiseren
- **mux-functions.ts** - Video processing met Mux

#### 🚀 Deploy Commands:

```bash
# Alle functions deployen
cd firebase-functions
npm run build
npm run deploy

# Of alleen specifieke function deployen
firebase deploy --only functions:stripeWebhook
firebase deploy --only functions:sendEmail
```

#### 💰 Kosten Schatting:
- **2 miljoen invocaties/maand GRATIS**
- Daarna: $0.40 per miljoen invocaties
- Voor een NGO platform: ~$2-5/maand naar verwachting

---

### 2. 🛡️ Firebase App Check (Sterk Aanbevolen)

Beschermt je app tegen bots en abuse.

#### Setup in 5 minuten:

1. **Firebase Console**:
   ```
   Project Settings > App Check > Register
   ```

2. **reCAPTCHA v3 voor Web**:
   - Ga naar [Google reCAPTCHA](https://www.google.com/recaptcha/admin)
   - Maak nieuwe site aan (v3)
   - Voeg domein toe (bijv. gratis-ngo.web.app)
   - Kopieer Site Key en Secret Key

3. **Voeg toe aan je app**:

```bash
npm install firebase/app-check
```

```typescript
// src/config/firebase.ts
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// Na Firebase initialisatie:
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('YOUR_RECAPTCHA_SITE_KEY'),
  isTokenAutoRefreshEnabled: true
});
```

4. **Activeer in Firebase Console**:
   - App Check > Firestore: Enable enforcement
   - App Check > Storage: Enable enforcement
   - App Check > Cloud Functions: Enable enforcement

#### 💰 Kosten:
- **Volledig GRATIS** (1 miljoen verifications/maand included)

---

### 3. 🔥 Firebase Extensions

Premium extensions die je nu kunt gebruiken:

#### Nuttig voor jouw platform:

1. **Resize Images** (Automatisch)
   ```bash
   firebase ext:install storage-resize-images
   ```
   - Auto-resize product afbeeldingen
   - WebP conversie
   - Kosten: ~$0.02 per 100 images

2. **Trigger Email** (met SendGrid/Mailgun)
   ```bash
   firebase ext:install firestore-send-email
   ```
   - Emails via Firestore triggers
   - Alternative voor jouw Resend setup

3. **Delete User Data** (GDPR compliance)
   ```bash
   firebase ext:install delete-user-data
   ```
   - Auto-cleanup bij account verwijdering

#### 💰 Kosten:
- Meeste extensions: gratis of minimaal (<$1/maand)

---

### 4. 📊 Increased Limits

| Feature | Spark (was) | Blaze (nu) |
|---------|-------------|------------|
| Cloud Functions | ❌ Niet beschikbaar | ✅ Ongelimiteerd |
| Function calls | 0 | 2M gratis/maand |
| Firestore reads | 50K/dag | 50K gratis/dag* |
| Firestore writes | 20K/dag | 20K gratis/dag* |
| Storage | 5 GB | 5 GB gratis* |
| Bandwidth | 1 GB/maand | 1 GB gratis/maand* |

*Daarna pay-as-you-go (meestal $5-20/maand voor kleine apps)

---

## 🎯 Aanbevolen Implementatie Volgorde

### Week 1: Cloud Functions Deploy ⚡

**Prioriteit 1: Stripe Webhooks**
```bash
cd firebase-functions
npm install
npm run build
firebase deploy --only functions:stripeWebhook
```

**Test:**
- Start een test betaling
- Check Stripe Dashboard > Webhooks
- Verify order status updates in Firestore

**Prioriteit 2: Email Service**
```bash
firebase deploy --only functions:sendEmail
```

**Test:**
- Trigger welkom email bij nieuwe user
- Test order confirmation emails

---

### Week 2: App Check Setup 🛡️

1. Register reCAPTCHA v3
2. Install app-check package
3. Update firebase.ts config
4. Deploy nieuwe versie
5. Enable enforcement in Firebase Console
6. Test in production

---

### Week 3: Extensions (Optioneel) 🔌

1. Install image resize extension
2. Test met nieuwe product uploads
3. Monitor kosten in Firebase Console

---

## 📈 Kosten Monitoring

### Dashboard Setup:

1. **Firebase Console > Usage and Billing**
   - Set budget alert: bijv. €10/maand
   - Email notificaties bij 50%, 90%, 100%

2. **Google Cloud Console > Billing**
   - Detailed breakdown
   - Set budget alerts

### Verwachte Kosten (NGO platform):

| Service | Verwacht Gebruik | Kosten |
|---------|-----------------|--------|
| Cloud Functions | ~100K calls/maand | Gratis |
| Firestore | ~500K reads/maand | ~$1-2 |
| Storage | 10 GB | ~$0.50 |
| Bandwidth | 5 GB | ~$0.60 |
| **Total** | | **~$2-5/maand** |

---

## 🚨 Belangrijke Aantekeningen

### Security First:
- ✅ Je Firestore rules zijn al goed beveiligd
- ✅ Storage rules zijn actief
- ⚠️ Deploy App Check binnen 2 weken (anti-abuse)

### Cloud Functions Best Practices:

```typescript
// Altijd error handling
export const myFunction = functions.https.onCall(async (data, context) => {
  try {
    // Verify authentication
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated'
      );
    }

    // Your logic here
    return { success: true };

  } catch (error) {
    console.error('Error:', error);
    throw new functions.https.HttpsError('internal', 'Operation failed');
  }
});
```

### Environment Variables:

```bash
# Set secrets voor Cloud Functions
firebase functions:secrets:set STRIPE_SECRET_KEY
firebase functions:secrets:set RESEND_API_KEY
firebase functions:secrets:set MUX_TOKEN_ID
```

---

## 🎉 Quick Start Checklist

- [ ] Deploy Cloud Functions (stripe webhooks + email)
- [ ] Test Stripe betalingen end-to-end
- [ ] Setup App Check (reCAPTCHA v3)
- [ ] Set budget alerts (€10/maand)
- [ ] Update SECURITY.md document
- [ ] Test email notifications
- [ ] Monitor first week costs
- [ ] Install image resize extension (optioneel)

---

## 📞 Support

### Als er problemen zijn:

1. **Cloud Functions logs:**
   ```bash
   firebase functions:log
   ```

2. **Real-time logs:**
   ```bash
   firebase emulators:start --only functions
   ```

3. **Firebase Console:**
   - Functions > Dashboard > Logs
   - Error reporting met stacktraces

### Common Issues:

**"Billing account not configured"**
- Ga naar Firebase Console > Usage & Billing
- Link je billing account

**"Function deployment failed"**
- Check Node version (18, 20, of 22)
- Run `npm run build` lokaal eerst
- Check firebase-functions package versie

**"Stripe webhook not receiving events"**
- Check webhook URL in Stripe Dashboard
- Verify function is deployed: `firebase functions:list`
- Check function logs voor errors

---

## 🎓 Resources

- [Firebase Blaze Pricing](https://firebase.google.com/pricing)
- [Cloud Functions Docs](https://firebase.google.com/docs/functions)
- [App Check Setup](https://firebase.google.com/docs/app-check)
- [Firebase Extensions](https://firebase.google.com/products/extensions)

---

**Volgende stap:** Begin met deployen van Stripe webhooks voor betalingen! 🚀
