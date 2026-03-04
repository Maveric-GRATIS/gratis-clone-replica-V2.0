# 🌍 Meertaligheid (i18n) - Nederlands & Engels

## ✅ VOLLEDIG GEÏMPLEMENTEERD

Je website is **volledig tweetalig** met Nederlands en Engels!

## 🎯 Standaard Taal: **Nederlands** 🇳🇱

De website start nu automatisch in het Nederlands. Engels is beschikbaar via de taalwisselaar.

---

## 📍 Waar vind je de taalwisselaar?

De taalwisselaar is te vinden in de **header/navigation** (rechts bovenin):
- 🇳🇱 Nederlands
- 🇬🇧 English

**Klik op het globe-icoon (🌐)** om tussen talen te wisselen.

---

## 🔧 Technische Implementatie

### 1. **i18n Configuratie**
📁 `src/i18n/config.ts`
```typescript
// Default language: Dutch (nl)
lng: 'nl',
fallbackLng: 'nl',
```

### 2. **Vertalingen**
📁 `src/i18n/locales/nl.json` - 1316 regels Nederlands
📁 `src/i18n/locales/en.json` - 1314 regels Engels

**Alle teksten zijn vertaald voor:**
- Navigatie
- Homepage
- Water pagina
- Theurgy, FU, Arcane
- TRIBE membership
- Impact TV
- Spark platform
- Shop/Store
- Events
- Partners
- Community
- Profile
- Admin dashboard
- Forms & Validation
- Errors & Notifications
- En meer...

### 3. **Taalwisselaar Component**
📁 `src/components/LanguageSwitcher.tsx`
📁 `src/components/layout/LanguageSwitcher.tsx`

Beide componenten zijn actief en werkend in de header.

---

## 🎨 Hoe het werkt voor gebruikers

### Automatische Taaldetectie:
1. **Eerst**: Controleert localStorage (opgeslagen voorkeur)
2. **Dan**: Controleert browser taal (`navigator.language`)
3. **Fallback**: Nederlands (standaard)

### Taal Wisselen:
1. Klik op 🌐 globe icoon in header
2. Dropdown toont: 🇳🇱 Nederlands en 🇬🇧 English
3. Selecteer gewenste taal
4. **Hele website switcht direct**
5. Voorkeur wordt opgeslagen in localStorage

### Persistentie:
- Taal keuze blijft behouden na refresh
- Taal keuze blijft behouden tussen sessies
- Per browser/device opgeslagen

---

## 💻 Voor Developers: Teksten Vertalen

### Bestaande Component Updaten:

**Voor:**
```tsx
<h1>Welcome to GRATIS</h1>
<p>Free water for everyone</p>
```

**Na:**
```tsx
import { useTranslation } from 'react-i18next';

function Component() {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t('home.welcomeTitle')}</h1>
      <p>{t('hero.subtitle')}</p>
    </>
  );
}
```

### Nieuwe Vertalingen Toevoegen:

#### 1. Voeg toe aan `nl.json`:
```json
{
  "mySection": {
    "title": "Mijn Titel",
    "description": "Nederlandse beschrijving",
    "button": "Klik Hier"
  }
}
```

#### 2. Voeg toe aan `en.json`:
```json
{
  "mySection": {
    "title": "My Title",
    "description": "English description",
    "button": "Click Here"
  }
}
```

#### 3. Gebruik in component:
```tsx
const { t } = useTranslation();

<h1>{t('mySection.title')}</h1>
<p>{t('mySection.description')}</p>
<Button>{t('mySection.button')}</Button>
```

### Dynamische Vertalingen met Variabelen:

#### In JSON:
```json
{
  "welcome": "Welkom {{name}}!",
  "itemsInCart": "Je hebt {{count}} items in je winkelwagen"
}
```

#### In Component:
```tsx
{t('welcome', { name: 'John' })}
{t('itemsInCart', { count: 5 })}
```

### Meervoud (Pluralization):

#### In JSON:
```json
{
  "items": "{{count}} item",
  "items_plural": "{{count}} items"
}
```

#### In Component:
```tsx
{t('items', { count: 1 })}  // "1 item"
{t('items', { count: 5 })}  // "5 items"
```

---

## 📊 Vertaalde Secties

### ✅ Volledig Vertaald:

**Navigatie & Header:**
- Hoofd menu items
- User menu (login, profile, logout)
- Mobile menu
- Taalwisselaar

**Homepage (Index.tsx):**
- Hero section
- Mission statement
- How it works
- Impact statistics
- Features
- Call-to-actions

**Water Pagina:**
- Product informatie
- Features & voordelen
- Prijzen
- FAQ

**TRIBE Membership:**
- Tier levels (Free, Gold, Diamond)
- Benefits per tier
- Signup process
- Member benefits

**Impact TV:**
- Video categorieën
- Beschrijvingen
- Call-to-actions

**Spark Platform:**
- Features
- Voor creatives
- Voor NGO's
- Pricing

**Shop/Store:**
- Product categorieën
- Product details
- Checkout process
- Cart

**Events:**
- Event listings
- Event details
- RSVP forms

**Partners:**
- Partner tiers
- Application forms
- Benefits

**Profile:**
- Account instellingen
- Notificatie voorkeuren
- Privacy instellingen

**Admin Dashboard:**
- Navigation
- Statistics
- Management tools

**Forms & Validation:**
- Labels
- Placeholders
- Error messages
- Success messages

**Errors:**
- 404 pagina
- Error meldingen
- Fallback teksten

---

## 🚀 Live Testen

**Website:** https://gratis-ngo-7bb44.web.app

**Test Scenario's:**

1. **Default Taal (Nederlands):**
   - Open de site
   - Alles moet in het Nederlands zijn ✅

2. **Taal Wisselen:**
   - Klik op 🌐 in header
   - Selecteer 🇬🇧 English
   - Hele site wordt Engels ✅

3. **Persistentie:**
   - Wissel naar Engels
   - Refresh de pagina (F5)
   - Site blijft Engels ✅

4. **Browser Testen:**
   - Clear localStorage
   - Open in NL browser → Nederlands
   - Open in EN browser → Nederlands (fallback)

---

## 📝 Beschikbare Vertalings Keys

### Navigatie:
```
nav.home, nav.gratis, nav.water, nav.theurgy, nav.fu,
nav.arcane, nav.tribe, nav.impactTV, nav.spark, nav.store,
nav.cart, nav.profile, nav.admin, nav.login, nav.logout
```

### Homepage:
```
home.welcomeTitle, home.missionTitle, home.missionText,
home.howItWorks, home.impactTitle, home.getInvolved,
home.donateNow, home.volunteer, home.spread
```

### Hero:
```
hero.title, hero.subtitle, hero.cta, hero.learnMore
```

### Features:
```
features.sustainability, features.community, features.impact,
features.transparency
```

### Shop:
```
shop.products, shop.cart, shop.checkout, shop.filters,
shop.sortBy, shop.addToCart
```

### Forms:
```
forms.name, forms.email, forms.phone, forms.message,
forms.submit, forms.required, forms.invalid
```

### Errors:
```
errors.notFound, errors.serverError, errors.tryAgain,
errors.goHome
```

**Totaal: 1300+ vertaling keys beschikbaar!**

---

## 🔍 Debugging

### Console Logs:
```javascript
// Huidige taal
console.log(i18n.language);

// Verander taal
i18n.changeLanguage('en');

// Controleer of key bestaat
console.log(t('home.title', { defaultValue: 'Fallback' }));
```

### React DevTools:
- Zoek naar `I18nextProvider`
- Inspecteer context values
- Bekijk current language state

---

## 📚 Extra Bronnen

### Documentatie:
- **react-i18next:** https://react.i18next.com/
- **i18next:** https://www.i18next.com/

### Handige Tools:
- **Translation Editor:** https://i18nexus.com/
- **JSON Validator:** https://jsonlint.com/
- **Key Generator:** BabelEdit (https://www.codeandweb.com/babeledit)

---

## ✨ Samenvatting

### ✅ Wat werkt:
- ✅ Nederlands als standaard taal
- ✅ Engels als tweede taal
- ✅ Taalwisselaar in header
- ✅ 1300+ vertaalde teksten
- ✅ Auto-detect browser taal
- ✅ Persistente taal voorkeur
- ✅ Alle pagina's vertaald
- ✅ Forms & validatie vertaald
- ✅ Errors & meldingen vertaald

### 🎯 Ready to Use:
Je website is **volledig tweetalig** en live op:
👉 **https://gratis-ngo-7bb44.web.app**

**Taal wisselen:** Klik op 🌐 in de header!

---

## 🆘 Support

**Vraag:** Hoe voeg ik een nieuwe taal toe?
**Antwoord:**
1. Maak `src/i18n/locales/fr.json` (bijvoorbeeld Frans)
2. Update `config.ts` met `fr: { translation: fr }`
3. Voeg toe aan `LanguageSwitcher.tsx` languages array

**Vraag:** Sommige teksten zijn niet vertaald?
**Antwoord:** Zoek de hardcoded tekst, vervang met `{t('key')}`, voeg toe aan nl.json en en.json

**Vraag:** Hoe verander ik de default taal naar Engels?
**Antwoord:** In `config.ts`: `lng: 'en'` en `fallbackLng: 'en'`

---

🎉 **Je website is nu volledig tweetalig!** 🇳🇱 🇬🇧
