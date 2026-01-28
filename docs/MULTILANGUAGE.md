# Meertalige Ondersteuning / Multi-language Support

## Overzicht / Overview

De website ondersteunt nu twee talen:
- **Nederlands (NL)** - Standaard taal / Default language
- **Engels (EN)** - Secundaire taal / Secondary language

---

## Functies / Features

✅ Nederlands als standaardtaal bij eerste bezoek
✅ Automatische taaldetectie op basis van browser instellingen
✅ Taalvoorkeur wordt opgeslagen in localStorage
✅ Taalwisselaar in de header naast het theme-icoon
✅ Vertaalde navigatie, homepage, winkelwagen en footer
✅ Gemakkelijk uitbreidbaar voor meer talen

---

## Hoe te Gebruiken / How to Use

### Taal Wisselen / Switching Language

1. Klik op het **Globe icoon** (🌐) in de header
2. Selecteer je gewenste taal (Nederlands 🇳🇱 of English 🇬🇧)
3. De website laadt meteen in de gekozen taal
4. Je keuze wordt onthouden voor volgende bezoeken

---

## Voor Ontwikkelaars / For Developers

### Structuur / Structure

```
src/
├── i18n/
│   ├── config.ts              # i18n configuratie
│   └── locales/
│       ├── nl.json            # Nederlandse vertalingen
│       └── en.json            # Engelse vertalingen
└── components/
    └── LanguageSwitcher.tsx   # Taalwisselaar component
```

### Vertalingen Toevoegen / Adding Translations

#### Stap 1: Voeg vertaalsleutels toe aan JSON bestanden

**nl.json:**
```json
{
  "newSection": {
    "title": "Nederlandse titel",
    "description": "Nederlandse beschrijving"
  }
}
```

**en.json:**
```json
{
  "newSection": {
    "title": "English title",
    "description": "English description"
  }
}
```

#### Stap 2: Gebruik vertalingen in je component

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('newSection.title')}</h1>
      <p>{t('newSection.description')}</p>
    </div>
  );
}
```

### Belangrijke Opmerkingen / Important Notes

- De standaardtaal is **Nederlands (NL)**
- Fallback taal is ook Nederlands
- Taalvoorkeur wordt opgeslagen in localStorage onder de key: `i18nextLng`
- De taaldetectie gebruikt eerst localStorage, daarna browser instellingen

### Meer Talen Toevoegen / Adding More Languages

1. Maak een nieuw bestand in `src/i18n/locales/` (bijv. `de.json` voor Duits)
2. Kopieer de structuur van `nl.json` of `en.json`
3. Voeg de vertaling toe aan `config.ts`:

```typescript
import de from './locales/de.json';

i18n.init({
  resources: {
    nl: { translation: nl },
    en: { translation: en },
    de: { translation: de },  // Nieuw
  },
  // ...
});
```

4. Update de `LanguageSwitcher.tsx` component om de nieuwe taal weer te geven

---

## Beschikbare Vertalingen / Available Translations

### Navigatie / Navigation
- Home, Gratis, Water, Theurgy, FU, Arcane, Tribe, ImpactTV, Spark
- Login/Logout, Profiel, Admin, Winkelwagen

### Homepage
- Hero sectie (titel, ondertitel, CTA knoppen)
- Product features sectie

### Winkelwagen / Shopping Cart
- Volledige vertaling van alle cart functionaliteit
- Lege cart berichten
- Checkout knoppen

### Footer
- Alle footer secties en links

---

## Testing

Bezoek http://localhost:8080 en:
1. Verifieer dat de site in het Nederlands laadt
2. Klik op de taalwisselaar (Globe icoon)
3. Selecteer Engels en controleer of alle teksten veranderen
4. Ververs de pagina - de gekozen taal blijft behouden
5. Test de winkelwagen functionaliteit in beide talen

---

## Technische Details

**Gebruikte Libraries:**
- `i18next` - Internationalisatie framework
- `react-i18next` - React bindings voor i18next
- `i18next-browser-languagedetector` - Automatische taaldetectie

**Configuratie:**
- Standaard taal: `nl`
- Fallback taal: `nl`
- Detectie volgorde: localStorage → browser instellingen
- Cache: localStorage

---

## Volgende Stappen / Next Steps

Om de volledige website te vertalen:

1. ✅ Vertaal alle pagina's (Gratis, Water, Theurgy, FU, etc.)
2. ✅ Vertaal alle forms (Contact, Newsletter, etc.)
3. ✅ Vertaal product beschrijvingen
4. ✅ Vertaal error berichten
5. ✅ Vertaal admin panel
6. ✅ Voeg meer talen toe indien gewenst (Duits, Frans, etc.)

Voor vragen of problemen, raadpleeg de [i18next documentatie](https://www.i18next.com/).
