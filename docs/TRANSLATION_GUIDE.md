# Gids voor het Toevoegen van Vertalingen / Translation Guide

## Snelle Start / Quick Start

### 1. Voeg Vertalingen Toe aan JSON Bestanden / Add Translations to JSON Files

**Nederlands (`src/i18n/locales/nl.json`):**
```json
{
  "myComponent": {
    "title": "Mijn Titel",
    "button": "Klik Hier",
    "description": "Dit is een beschrijving"
  }
}
```

**Engels (`src/i18n/locales/en.json`):**
```json
{
  "myComponent": {
    "title": "My Title",
    "button": "Click Here",
    "description": "This is a description"
  }
}
```

---

## 2. Gebruik Vertalingen in je Component / Use Translations in Your Component

```tsx
import { useTranslation } from 'react-i18next';

export default function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('myComponent.title')}</h1>
      <p>{t('myComponent.description')}</p>
      <button>{t('myComponent.button')}</button>
    </div>
  );
}
```

---

## 3. Vertalingen met Variabelen / Translations with Variables

**JSON:**
```json
{
  "welcome": "Welkom, {{name}}!",
  "itemCount": "Je hebt {{count}} items"
}
```

**Component:**
```tsx
<h1>{t('welcome', { name: 'Jan' })}</h1>
<p>{t('itemCount', { count: 5 })}</p>
```

---

## 4. Meervoud / Pluralization

**JSON:**
```json
{
  "items_one": "{{count}} item",
  "items_other": "{{count}} items"
}
```

**Component:**
```tsx
<p>{t('items', { count: 1 })}</p>  // "1 item"
<p>{t('items', { count: 5 })}</p>  // "5 items"
```

---

## Voorbeelden per Component Type / Examples by Component Type

### Formulieren / Forms

```tsx
import { useTranslation } from 'react-i18next';

export function MyForm() {
  const { t } = useTranslation();

  return (
    <form>
      <label>{t('form.name')}</label>
      <input placeholder={t('form.namePlaceholder')} />

      <label>{t('form.email')}</label>
      <input placeholder={t('form.emailPlaceholder')} />

      <button type="submit">{t('form.submit')}</button>
    </form>
  );
}
```

### Pagina's met SEO / Pages with SEO

```tsx
import SEO from '@/components/SEO';
import { useTranslation } from 'react-i18next';

export default function MyPage() {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title={t('myPage.title')}
        description={t('myPage.description')}
      />
      <h1>{t('myPage.heading')}</h1>
    </>
  );
}
```

### Toasts en Meldingen / Toasts and Notifications

```tsx
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

export function MyComponent() {
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSuccess = () => {
    toast({
      title: t('notifications.success'),
      description: t('notifications.successMessage'),
    });
  };

  const handleError = () => {
    toast({
      title: t('notifications.error'),
      description: t('notifications.errorMessage'),
      variant: 'destructive',
    });
  };
}
```

### Knoppen en CTAs / Buttons and CTAs

```tsx
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export function MyButtons() {
  const { t } = useTranslation();

  return (
    <>
      <Button>{t('buttons.submit')}</Button>
      <Button variant="outline">{t('buttons.cancel')}</Button>
      <Button variant="destructive">{t('buttons.delete')}</Button>
    </>
  );
}
```

---

## Beste Praktijken / Best Practices

### ✅ Doe Dit / Do This

1. **Gebruik duidelijke, geneste sleutels:**
   ```json
   {
     "products": {
       "addToCart": "Toevoegen aan Winkelwagen",
       "buyNow": "Nu Kopen"
     }
   }
   ```

2. **Groepeer gerelateerde vertalingen:**
   ```json
   {
     "cart": {
       "title": "Winkelwagen",
       "empty": "Je winkelwagen is leeg",
       "checkout": "Afrekenen"
     }
   }
   ```

3. **Gebruik beschrijvende namen:**
   ```json
   {
     "auth": {
       "signInButton": "Inloggen",
       "signUpButton": "Registreren"
     }
   }
   ```

### ❌ Vermijd Dit / Avoid This

1. **Geen platte structuur:**
   ```json
   {
     "button1": "Klik hier",
     "button2": "Submit"
   }
   ```

2. **Geen onduidelijke namen:**
   ```json
   {
     "text1": "Welkom",
     "btn": "OK"
   }
   ```

3. **Geen harde code strings in componenten:**
   ```tsx
   // ❌ Fout
   <button>Klik Hier</button>

   // ✅ Goed
   <button>{t('buttons.click')}</button>
   ```

---

## Taal Wisselen Programmatisch / Switch Language Programmatically

```tsx
import { useTranslation } from 'react-i18next';

export function LanguageButton() {
  const { i18n } = useTranslation();

  const switchToEnglish = () => {
    i18n.changeLanguage('en');
  };

  const switchToDutch = () => {
    i18n.changeLanguage('nl');
  };

  return (
    <>
      <button onClick={switchToDutch}>Nederlands</button>
      <button onClick={switchToEnglish}>English</button>
    </>
  );
}
```

---

## Huidige Taal Ophalen / Get Current Language

```tsx
import { useTranslation } from 'react-i18next';

export function CurrentLanguage() {
  const { i18n } = useTranslation();

  return (
    <div>
      Huidige taal: {i18n.language}
    </div>
  );
}
```

---

## Controleer of een Taal Beschikbaar is / Check if Language is Available

```tsx
const availableLanguages = ['nl', 'en'];
const currentLang = i18n.language;

if (availableLanguages.includes(currentLang)) {
  console.log('Taal is beschikbaar');
}
```

---

## Veelvoorkomende Vertaalsleutels / Common Translation Keys

```json
{
  "common": {
    "loading": "Laden...",
    "error": "Er is een fout opgetreden",
    "success": "Succes!",
    "cancel": "Annuleren",
    "save": "Opslaan",
    "edit": "Bewerken",
    "delete": "Verwijderen",
    "confirm": "Bevestigen",
    "back": "Terug",
    "next": "Volgende",
    "submit": "Verzenden"
  }
}
```

Gebruik deze in je componenten:
```tsx
<button>{t('common.cancel')}</button>
<button>{t('common.save')}</button>
```

---

## Debugging Tips

### 1. Ontbrekende Vertalingen Zien / See Missing Translations

Open browser console:
```
i18next::translator: missingKey nl translation myComponent.title
```

### 2. Controleer Huidige Taal / Check Current Language

In browser console:
```javascript
console.log(i18n.language); // "nl" of "en"
```

### 3. Test Alle Talen / Test All Languages

```tsx
const { i18n } = useTranslation();

// Test Nederlands
i18n.changeLanguage('nl');

// Test Engels
i18n.changeLanguage('en');
```

---

## Checklist voor Nieuwe Componenten / Checklist for New Components

- [ ] Import `useTranslation` hook
- [ ] Voeg vertaalsleutels toe aan `nl.json`
- [ ] Voeg vertaalsleutels toe aan `en.json`
- [ ] Vervang alle hardcoded teksten met `t('key')`
- [ ] Test in beide talen
- [ ] Controleer console voor missing keys

---

## Hulp Nodig? / Need Help?

Bekijk de officiële documentatie:
- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Documentation](https://react.i18next.com/)
