# Vercel Deployment Gids

## Stap 1: Vercel CLI installeren (optioneel)

```bash
npm install -g vercel
```

## Stap 2: Vercel account koppelen

1. Ga naar [vercel.com](https://vercel.com) en maak een account aan (of log in)
2. Koppel je GitHub/GitLab/Bitbucket account

## Stap 3: Project deployment

### Optie A: Via Vercel Dashboard (Aanbevolen)

1. Ga naar [vercel.com/new](https://vercel.com/new)
2. Importeer je Git repository
3. Vercel detecteert automatisch dat het een Vite project is
4. Configuratie wordt automatisch ingesteld via `vercel.json`
5. Voeg environment variables toe (zie hieronder)
6. Klik op "Deploy"

### Optie B: Via CLI

In de project root directory:

```bash
vercel
```

Volg de prompts:
- Set up and deploy: Y
- Which scope: selecteer je account
- Link to existing project: N
- Project name: [geef een naam op]
- In which directory is your code located: ./
- Want to override settings: N

## Stap 4: Environment Variables configureren

Ga naar je project in Vercel Dashboard → Settings → Environment Variables

Voeg de volgende variabelen toe voor **Production**, **Preview**, en **Development**:

### Firebase configuratie
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

### Stripe configuratie
- `VITE_STRIPE_PUBLISHABLE_KEY`

### Mux configuratie (optioneel)
- `VITE_MUX_TOKEN_ID`
- `VITE_MUX_TOKEN_SECRET`

## Stap 5: Domain configureren

1. Ga naar Project Settings → Domains
2. Voeg je custom domain toe
3. Configureer DNS records volgens de instructies van Vercel

## Stap 6: Firebase configureren voor Vercel domain

1. Ga naar Firebase Console → Authentication → Settings → Authorized domains
2. Voeg je Vercel domains toe:
   - `jouw-project.vercel.app`
   - `jouw-custom-domain.com` (als je die hebt)

## Automatische deployments

Elke push naar je main/master branch triggert automatisch een nieuwe deployment.

Preview deployments worden automatisch gemaakt voor elke pull request.

## Belangrijke opmerkingen

1. **Build command**: `npm run build` (gedefinieerd in vercel.json)
2. **Output directory**: `dist` (Vite default)
3. **Node version**: Vercel gebruikt automatisch de nieuwste LTS versie
4. **SPA routing**: Alle routes worden gerewrite naar `/index.html` voor client-side routing

## Troubleshooting

### Build fails
- Controleer of alle environment variables correct zijn ingesteld
- Bekijk de build logs in Vercel Dashboard
- Test lokaal met `npm run build`

### 404 errors op routes
- Controleer of de rewrites in `vercel.json` correct zijn
- SPA routing moet naar index.html wijzen

### Firebase errors
- Controleer of alle Firebase environment variables correct zijn
- Verifieer dat Vercel domains zijn toegevoegd aan Firebase Authorized Domains

### Environment variables werken niet
- Zorg dat variabelen beginnen met `VITE_` prefix
- Herstart de deployment na het toevoegen van nieuwe variabelen
- Controleer of variabelen zijn ingesteld voor de juiste environment (Production/Preview/Development)

## Deploy commands

```bash
# Deploy naar production
vercel --prod

# Preview deployment
vercel

# Logs bekijken
vercel logs

# Project info
vercel inspect
```

## Performance optimizations

De volgende optimalisaties zijn al geconfigureerd in `vercel.json`:

1. **Asset caching**: Images en fonts worden 1 jaar gecached
2. **Immutable assets**: Build assets in `/assets/` zijn immutable
3. **Compression**: Vercel comprimeert automatisch alle assets met gzip/brotli
4. **Edge Network**: Content wordt geserveerd via Vercel's global CDN

## Kosten

- **Hobby plan**: Gratis voor persoonlijke projecten
  - 100 GB bandwidth per maand
  - Onbeperkte sites
  - Automatische HTTPS

- **Pro plan**: $20/maand
  - 1 TB bandwidth
  - Team collaboration
  - Password protection
  - Analytics

## Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Documentation](https://vercel.com/docs)
- [Vite on Vercel](https://vercel.com/docs/frameworks/vite)
