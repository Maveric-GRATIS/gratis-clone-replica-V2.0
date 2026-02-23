# 🔥 Firebase Database Setup Guide

## ✅ Status: Firebase is al geconfigureerd!

Je Firebase project **gratis-ngo-7bb44** is al verbonden. Volg deze stappen om de database te vullen met echte data.

---

## 📋 Stap 1: Deploy Firestore Rules & Indexes

```bash
# Deploy security rules
firebase deploy --only firestore:rules

# Deploy indexes (voor complexe queries)
firebase deploy --only firestore:indexes

# Deploy storage rules
firebase deploy --only storage
```

---

## 🌱 Stap 2: Seed Database met Echte Data

### A. Maak een Service Account Key

1. Ga naar [Firebase Console](https://console.firebase.google.com/project/gratis-ngo-7bb44/settings/serviceaccounts/adminsdk)
2. Klik op **Generate New Private Key**
3. Sla het bestand op als: `scripts/service-account.json`

### B. Run Seeding Script

```bash
# Seed database met test data
npx tsx scripts/seed-database.ts

# Of clean + seed (verwijdert oude data)
npx tsx scripts/seed-database.ts --clean
```

Dit script vult je database met:
- ✅ Test gebruikers (met verschillende rollen)
- ✅ NGO partners
- ✅ Donatie projecten
- ✅ Transactie geschiedenis
- ✅ Events & registraties

---

## 🔧 Stap 3: Deploy Firebase Functions (optioneel)

Als je backend functionaliteit nodig hebt:

```bash
cd firebase-functions
npm install
cd ..
firebase deploy --only functions
```

Dit deployed:
- Stripe webhook handlers
- Email notificaties
- Mux video processing

---

## 🗄️ Stap 4: Firestore Collections Structuur

Na seeding zul je deze collections zien:

```
gratis-ngo-7bb44/
├── users/              # Gebruikers (auth + profiel)
├── partners/           # NGO partners
├── projects/          # Donatie projecten
├── donations/         # Transacties
├── events/            # Events
├── registrations/     # Event registraties
├── products/          # Merchandise
├── orders/            # Bestellingen
├── subscriptions/     # Tribe memberships
└── videos/            # Video content
```

---

## 🔍 Stap 5: Verifieer Data in Firebase Console

1. Ga naar: https://console.firebase.google.com/project/gratis-ngo-7bb44/firestore/databases/-default-/data
2. Check of deze collections bestaan met data
3. Test een query in de console

---

## 🚀 Stap 6: Test de App met Echte Data

```bash
# Start development server
npm run dev

# Open in browser
http://localhost:8080
```

De app zou nu echte Firebase data moeten tonen in plaats van mock data!

---

## 🛠️ Troubleshooting

### Probleem: "Permission denied" errors

**Oplossing:** Deploy de Firestore rules opnieuw:
```bash
firebase deploy --only firestore:rules
```

### Probleem: "Index required" errors

**Oplossing:**
1. Klik op de error link in de console
2. Of deploy indexes: `firebase deploy --only firestore:indexes`

### Probleem: No data visible

**Oplossing:** Run seeding script opnieuw:
```bash
npx tsx scripts/seed-database.ts --clean
```

---

## 📊 Firebase Blaze Plan Voordelen

Met je Blaze plan heb je:
- ✅ **Ongelimiteerde** Firestore reads/writes
- ✅ **100GB gratis** storage per maand
- ✅ **Cloud Functions** (2M invocaties gratis)
- ✅ **Firebase Hosting** (10GB gratis)
- ✅ **Custom domains**
- ✅ **Backup & restore**

---

## 🔒 Security Best Practices

1. **Never commit** `service-account.json` (already in .gitignore)
2. **Review Firestore rules** before production
3. **Enable App Check** voor extra beveiliging
4. **Monitor usage** in Firebase Console

---

## 📚 Volgende Stappen

1. ✅ Deploy rules & indexes
2. ✅ Seed database
3. ✅ Test app met echte data
4. Configure Stripe webhooks (optioneel)
5. Setup email service (SendGrid/Firebase)
6. Configure Mux voor video's
7. Deploy naar production

---

**⚡ Quick Start:**
```bash
# 1. Deploy rules
firebase deploy --only firestore:rules,firestore:indexes,storage

# 2. Seed database (na service account setup)
npx tsx scripts/seed-database.ts

# 3. Start app
npm run dev
```

Succes! 🎉
