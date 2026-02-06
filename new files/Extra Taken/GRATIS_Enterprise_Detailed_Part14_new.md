# GRATIS.NGO — Enterprise Detailed Build Guide — PART 12
## Sections 59–63: SEO & Meta, A/B Testing, Data Export, 2FA/MFA, Content Moderation

> **Continues from Part 11 (Sections 54–58)**
> Total so far: Parts 1–11 = 58 sections, ~271 files, ~1,411KB

---

## SECTION 59 — SEO & META MANAGEMENT SYSTEM

### File 59-1: `src/types/seo.ts`

```typescript
// src/types/seo.ts
// SEO types and meta tag definitions for GRATIS.NGO

export interface MetaTag {
  name?: string;
  property?: string;
  content: string;
}

export interface OpenGraphMeta {
  title: string;
  description: string;
  type: 'website' | 'article' | 'profile' | 'event';
  url: string;
  image: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  siteName: string;
  locale: string;
  localeAlternate?: string[];
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
}

export interface TwitterMeta {
  card: 'summary' | 'summary_large_image' | 'app' | 'player';
  site: string;
  creator?: string;
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: unknown;
}

export interface SEOConfig {
  title: string;
  titleTemplate?: string;
  description: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  openGraph: OpenGraphMeta;
  twitter: TwitterMeta;
  structuredData?: StructuredData[];
  alternateLanguages?: { hrefLang: string; href: string }[];
  additionalMeta?: MetaTag[];
}

export interface PageSEO {
  id: string;
  path: string;
  seo: SEOConfig;
  lastModified: string;
  priority: number;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}

export interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
  alternates?: { hrefLang: string; href: string }[];
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface SEOAuditResult {
  url: string;
  score: number;
  issues: SEOIssue[];
  suggestions: string[];
  timestamp: string;
}

export interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  category: 'meta' | 'content' | 'structure' | 'performance' | 'accessibility';
  message: string;
  element?: string;
}
```

### File 59-2: `src/lib/seo/config.ts`

```typescript
// src/lib/seo/config.ts
// Global SEO configuration and defaults

import type { SEOConfig, OpenGraphMeta, TwitterMeta } from '@/types/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gratis.ngo';
const SITE_NAME = 'GRATIS.NGO';

export const DEFAULT_SEO: SEOConfig = {
  title: 'GRATIS.NGO — Turning Every Bottle Into Impact',
  titleTemplate: '%s | GRATIS.NGO',
  description:
    'Join the movement that turns recycled bottles into real-world impact. Donate, volunteer, and track your contribution to a better planet.',
  canonical: SITE_URL,
  openGraph: {
    title: 'GRATIS.NGO — Turning Every Bottle Into Impact',
    description:
      'Join the movement that turns recycled bottles into real-world impact.',
    type: 'website',
    url: SITE_URL,
    image: `${SITE_URL}/images/og-default.jpg`,
    imageAlt: 'GRATIS.NGO — Bottles for Impact',
    imageWidth: 1200,
    imageHeight: 630,
    siteName: SITE_NAME,
    locale: 'en_US',
    localeAlternate: ['nl_NL', 'de_DE', 'fr_FR', 'es_ES'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@gratisngo',
    title: 'GRATIS.NGO — Turning Every Bottle Into Impact',
    description:
      'Join the movement that turns recycled bottles into real-world impact.',
    image: `${SITE_URL}/images/twitter-default.jpg`,
    imageAlt: 'GRATIS.NGO — Bottles for Impact',
  },
  structuredData: [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/images/logo.png`,
      description:
        'Non-profit turning recycled bottles into real-world impact.',
      sameAs: [
        'https://twitter.com/gratisngo',
        'https://facebook.com/gratisngo',
        'https://instagram.com/gratisngo',
        'https://linkedin.com/company/gratisngo',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'hello@gratis.ngo',
        contactType: 'customer service',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export function buildPageTitle(pageTitle: string, template?: string): string {
  const tpl = template || DEFAULT_SEO.titleTemplate || '%s';
  return tpl.replace('%s', pageTitle);
}

export function buildCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

export function buildPageSEO(
  overrides: Partial<SEOConfig> & { title: string; description: string }
): SEOConfig {
  const title = buildPageTitle(overrides.title);
  const canonical = overrides.canonical || buildCanonicalUrl('');

  return {
    ...DEFAULT_SEO,
    ...overrides,
    title,
    canonical,
    openGraph: {
      ...DEFAULT_SEO.openGraph,
      ...overrides.openGraph,
      title: overrides.openGraph?.title || overrides.title,
      description:
        overrides.openGraph?.description || overrides.description,
      url: canonical,
    } as OpenGraphMeta,
    twitter: {
      ...DEFAULT_SEO.twitter,
      ...overrides.twitter,
      title: overrides.twitter?.title || overrides.title,
      description:
        overrides.twitter?.description || overrides.description,
    } as TwitterMeta,
  };
}

// Page-specific SEO configs
export const PAGE_SEO: Record<string, Partial<SEOConfig>> = {
  home: {
    title: 'Home',
    description: 'Turn every bottle into real-world impact with GRATIS.NGO.',
  },
  donate: {
    title: 'Donate',
    description:
      'Make a donation and see your impact in real-time. Every cent goes directly to projects.',
  },
  projects: {
    title: 'Impact Projects',
    description:
      'Explore our impact projects around the world. See how your bottles create change.',
  },
  events: {
    title: 'Events',
    description:
      'Join GRATIS.NGO events in your area. Volunteer, collect bottles, and make friends.',
  },
  tribe: {
    title: 'TRIBE',
    description:
      'Join the GRATIS TRIBE — our premium community of changemakers. Exclusive perks and deeper impact.',
  },
  partners: {
    title: 'Partners',
    description:
      'Partner with GRATIS.NGO to amplify your social impact. Corporate partnerships that matter.',
  },
  about: {
    title: 'About Us',
    description:
      'Learn about the GRATIS.NGO mission, team, and our journey from bottles to global impact.',
  },
  blog: {
    title: 'Blog',
    description:
      'Stories, insights, and updates from the GRATIS.NGO community.',
  },
};
```

### File 59-3: `src/lib/seo/structured-data.ts`

```typescript
// src/lib/seo/structured-data.ts
// Schema.org structured data generators for different page types

import type { StructuredData, BreadcrumbItem } from '@/types/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gratis.ngo';

export function generateBreadcrumbSchema(
  items: BreadcrumbItem[]
): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function generateArticleSchema(article: {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  modifiedAt?: string;
  author: string;
  tags?: string[];
}): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: article.url,
    image: article.image,
    datePublished: article.publishedAt,
    dateModified: article.modifiedAt || article.publishedAt,
    author: {
      '@type': 'Organization',
      name: 'GRATIS.NGO',
    },
    publisher: {
      '@type': 'Organization',
      name: 'GRATIS.NGO',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo.png` },
    },
    keywords: article.tags?.join(', '),
  };
}

export function generateEventSchema(event: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  address?: string;
  image?: string;
  url: string;
  organizer?: string;
  price?: number;
  currency?: string;
  availability?: 'InStock' | 'SoldOut' | 'PreOrder';
}): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    location: {
      '@type': 'Place',
      name: event.location,
      address: event.address
        ? { '@type': 'PostalAddress', streetAddress: event.address }
        : undefined,
    },
    image: event.image,
    url: event.url,
    organizer: {
      '@type': 'Organization',
      name: event.organizer || 'GRATIS.NGO',
      url: SITE_URL,
    },
    offers: event.price !== undefined
      ? {
          '@type': 'Offer',
          price: event.price,
          priceCurrency: event.currency || 'EUR',
          availability: `https://schema.org/${event.availability || 'InStock'}`,
          url: event.url,
        }
      : {
          '@type': 'Offer',
          price: 0,
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
          description: 'Free event',
        },
  };
}

export function generateProjectSchema(project: {
  name: string;
  description: string;
  url: string;
  image?: string;
  goalAmount: number;
  currentAmount: number;
  currency: string;
  startDate: string;
  endDate?: string;
  location?: string;
}): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'DonateAction',
    name: project.name,
    description: project.description,
    url: project.url,
    image: project.image,
    recipient: {
      '@type': 'Organization',
      name: 'GRATIS.NGO',
    },
    target: {
      '@type': 'EntryPoint',
      urlTemplate: project.url,
      actionPlatform: [
        'http://schema.org/DesktopWebPlatform',
        'http://schema.org/MobileWebPlatform',
      ],
    },
    potentialAction: {
      '@type': 'DonateAction',
      target: project.url,
    },
  };
}

export function generateFAQSchema(
  faqs: { question: string; answer: string }[]
): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateNonprofitSchema(): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: 'GRATIS.NGO',
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    description:
      'Non-profit organization turning recycled bottles into real-world impact through community-driven projects.',
    foundingDate: '2024',
    nonprofitStatus: 'Nonprofit501c3',
    areaServed: {
      '@type': 'Place',
      name: 'Worldwide',
    },
    knowsAbout: [
      'Recycling',
      'Sustainability',
      'Community Impact',
      'Charitable Giving',
    ],
  };
}
```

### File 59-4: `src/components/seo/SEOHead.tsx`

```tsx
// src/components/seo/SEOHead.tsx
// Reusable SEO head component for all pages

import type { Metadata } from 'next';
import type { SEOConfig, StructuredData } from '@/types/seo';
import { DEFAULT_SEO, buildPageTitle, buildCanonicalUrl } from '@/lib/seo/config';

/**
 * Generate Next.js Metadata from SEOConfig
 */
export function generateSEOMetadata(
  config: Partial<SEOConfig> & { title: string; description: string },
  path?: string
): Metadata {
  const title = config.titleTemplate
    ? buildPageTitle(config.title, config.titleTemplate)
    : buildPageTitle(config.title);

  const description = config.description || DEFAULT_SEO.description;
  const canonical = config.canonical || (path ? buildCanonicalUrl(path) : undefined);
  const og = { ...DEFAULT_SEO.openGraph, ...config.openGraph };
  const tw = { ...DEFAULT_SEO.twitter, ...config.twitter };

  return {
    title,
    description,
    robots: {
      index: !config.noindex,
      follow: !config.nofollow,
      googleBot: {
        index: !config.noindex,
        follow: !config.nofollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical,
      languages: config.alternateLanguages?.reduce(
        (acc, lang) => ({ ...acc, [lang.hrefLang]: lang.href }),
        {} as Record<string, string>
      ),
    },
    openGraph: {
      title: og.title,
      description: og.description,
      type: og.type as 'website',
      url: og.url,
      siteName: og.siteName,
      locale: og.locale,
      images: [
        {
          url: og.image,
          alt: og.imageAlt || og.title,
          width: og.imageWidth || 1200,
          height: og.imageHeight || 630,
        },
      ],
    },
    twitter: {
      card: tw.card,
      site: tw.site,
      creator: tw.creator,
      title: tw.title,
      description: tw.description,
      images: [tw.image],
    },
    other: config.additionalMeta?.reduce(
      (acc, meta) => ({
        ...acc,
        [meta.name || meta.property || '']: meta.content,
      }),
      {} as Record<string, string>
    ),
  };
}

/**
 * JSON-LD structured data component
 */
export function JsonLd({ data }: { data: StructuredData | StructuredData[] }) {
  const items = Array.isArray(data) ? data : [data];

  return (
    <>
      {items.map((item, index) => (
        <script
          key={`jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}

/**
 * Breadcrumb component with schema
 */
export function Breadcrumbs({
  items,
}: {
  items: { name: string; href: string }[];
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gratis.ngo';
  const schemaItems = items.map((item, index) => ({
    '@type': 'ListItem' as const,
    position: index + 1,
    name: item.name,
    item: item.href.startsWith('http') ? item.href : `${siteUrl}${item.href}`,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: schemaItems,
          }),
        }}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-4">
        <ol className="flex items-center gap-1.5 flex-wrap">
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center gap-1.5">
              {index > 0 && (
                <span className="text-gray-300" aria-hidden="true">
                  /
                </span>
              )}
              {index === items.length - 1 ? (
                <span className="text-gray-700 font-medium" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <a
                  href={item.href}
                  className="hover:text-emerald-600 transition-colors"
                >
                  {item.name}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
```

### File 59-5: `src/app/sitemap.ts`

```typescript
// src/app/sitemap.ts
// Dynamic sitemap generation for GRATIS.NGO

import { MetadataRoute } from 'next';
import { adminDb } from '@/lib/firebase/admin';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gratis.ngo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  const staticPages = [
    { path: '/', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/donate', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/projects', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/events', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/tribe', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/partners', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/blog', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/leaderboard', priority: 0.6, changeFrequency: 'daily' as const },
    { path: '/faq', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
  ];

  for (const page of staticPages) {
    entries.push({
      url: `${SITE_URL}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    });
  }

  // Dynamic: Projects
  try {
    const projectsSnap = await adminDb
      .collection('projects')
      .where('status', '==', 'active')
      .orderBy('updatedAt', 'desc')
      .get();

    for (const doc of projectsSnap.docs) {
      const data = doc.data();
      entries.push({
        url: `${SITE_URL}/projects/${doc.id}`,
        lastModified: data.updatedAt?.toDate() || new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  } catch (error) {
    console.error('Sitemap: Failed to fetch projects', error);
  }

  // Dynamic: Events
  try {
    const eventsSnap = await adminDb
      .collection('events')
      .where('status', '==', 'published')
      .orderBy('startDate', 'desc')
      .limit(100)
      .get();

    for (const doc of eventsSnap.docs) {
      const data = doc.data();
      entries.push({
        url: `${SITE_URL}/events/${doc.id}`,
        lastModified: data.updatedAt?.toDate() || new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  } catch (error) {
    console.error('Sitemap: Failed to fetch events', error);
  }

  // Dynamic: Blog posts
  try {
    const blogSnap = await adminDb
      .collection('blog_posts')
      .where('status', '==', 'published')
      .orderBy('publishedAt', 'desc')
      .limit(200)
      .get();

    for (const doc of blogSnap.docs) {
      const data = doc.data();
      entries.push({
        url: `${SITE_URL}/blog/${data.slug || doc.id}`,
        lastModified: data.updatedAt?.toDate() || data.publishedAt?.toDate() || new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  } catch (error) {
    console.error('Sitemap: Failed to fetch blog posts', error);
  }

  // Dynamic: Partner pages
  try {
    const partnersSnap = await adminDb
      .collection('partners')
      .where('status', '==', 'active')
      .get();

    for (const doc of partnersSnap.docs) {
      const data = doc.data();
      entries.push({
        url: `${SITE_URL}/partners/${data.slug || doc.id}`,
        lastModified: data.updatedAt?.toDate() || new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      });
    }
  } catch (error) {
    console.error('Sitemap: Failed to fetch partners', error);
  }

  return entries;
}
```

### File 59-6: `src/app/robots.ts`

```typescript
// src/app/robots.ts
// Robots.txt generation

import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gratis.ngo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/settings/',
          '/auth/',
          '/_next/',
          '/private/',
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
```

### File 59-7: `src/lib/seo/audit.ts`

```typescript
// src/lib/seo/audit.ts
// SEO audit utility for admin dashboard

import type { SEOAuditResult, SEOIssue } from '@/types/seo';

export function auditPageSEO(params: {
  url: string;
  title?: string;
  description?: string;
  h1Count: number;
  h2Count: number;
  imageCount: number;
  imagesWithAlt: number;
  wordCount: number;
  internalLinks: number;
  externalLinks: number;
  hasCanonical: boolean;
  hasOGTags: boolean;
  hasTwitterTags: boolean;
  hasStructuredData: boolean;
  loadTimeMs?: number;
  mobileResponsive?: boolean;
}): SEOAuditResult {
  const issues: SEOIssue[] = [];
  const suggestions: string[] = [];
  let score = 100;

  // Title checks
  if (!params.title) {
    issues.push({ type: 'error', category: 'meta', message: 'Missing page title' });
    score -= 15;
  } else {
    if (params.title.length < 30) {
      issues.push({
        type: 'warning',
        category: 'meta',
        message: `Title too short (${params.title.length} chars). Aim for 50-60 characters.`,
      });
      score -= 5;
    }
    if (params.title.length > 60) {
      issues.push({
        type: 'warning',
        category: 'meta',
        message: `Title too long (${params.title.length} chars). Will be truncated in search results.`,
      });
      score -= 3;
    }
  }

  // Description checks
  if (!params.description) {
    issues.push({ type: 'error', category: 'meta', message: 'Missing meta description' });
    score -= 15;
  } else {
    if (params.description.length < 120) {
      issues.push({
        type: 'warning',
        category: 'meta',
        message: `Description too short (${params.description.length} chars). Aim for 150-160.`,
      });
      score -= 5;
    }
    if (params.description.length > 160) {
      issues.push({
        type: 'warning',
        category: 'meta',
        message: `Description too long (${params.description.length} chars). May be truncated.`,
      });
      score -= 2;
    }
  }

  // Heading structure
  if (params.h1Count === 0) {
    issues.push({ type: 'error', category: 'structure', message: 'No H1 tag found' });
    score -= 10;
  } else if (params.h1Count > 1) {
    issues.push({
      type: 'warning',
      category: 'structure',
      message: `Multiple H1 tags found (${params.h1Count}). Use only one H1 per page.`,
    });
    score -= 5;
  }

  if (params.h2Count === 0) {
    issues.push({
      type: 'info',
      category: 'structure',
      message: 'No H2 tags. Consider adding subheadings for better structure.',
    });
    score -= 2;
  }

  // Image alt text
  if (params.imageCount > 0) {
    const missingAlt = params.imageCount - params.imagesWithAlt;
    if (missingAlt > 0) {
      issues.push({
        type: 'warning',
        category: 'accessibility',
        message: `${missingAlt} of ${params.imageCount} images missing alt text`,
      });
      score -= Math.min(missingAlt * 2, 10);
    }
  }

  // Content length
  if (params.wordCount < 300) {
    issues.push({
      type: 'warning',
      category: 'content',
      message: `Thin content (${params.wordCount} words). Aim for 300+ words for SEO.`,
    });
    score -= 5;
  }

  // Links
  if (params.internalLinks < 2) {
    suggestions.push('Add more internal links to improve site structure and page authority.');
  }

  // Technical SEO
  if (!params.hasCanonical) {
    issues.push({ type: 'warning', category: 'meta', message: 'Missing canonical URL' });
    score -= 5;
  }

  if (!params.hasOGTags) {
    issues.push({ type: 'warning', category: 'meta', message: 'Missing Open Graph tags' });
    score -= 5;
  }

  if (!params.hasTwitterTags) {
    issues.push({ type: 'info', category: 'meta', message: 'Missing Twitter Card tags' });
    score -= 2;
  }

  if (!params.hasStructuredData) {
    issues.push({
      type: 'info',
      category: 'structure',
      message: 'No structured data (JSON-LD). Consider adding for rich search results.',
    });
    score -= 3;
  }

  // Performance
  if (params.loadTimeMs && params.loadTimeMs > 3000) {
    issues.push({
      type: 'warning',
      category: 'performance',
      message: `Slow load time (${(params.loadTimeMs / 1000).toFixed(1)}s). Aim for under 3s.`,
    });
    score -= 5;
  }

  // Suggestions
  if (score >= 90) {
    suggestions.push('Excellent SEO! Consider A/B testing titles and descriptions for CTR optimization.');
  } else if (score >= 70) {
    suggestions.push('Good foundation. Focus on fixing errors first, then address warnings.');
  } else {
    suggestions.push('Significant SEO improvements needed. Prioritize error-level issues.');
  }

  return {
    url: params.url,
    score: Math.max(0, score),
    issues,
    suggestions,
    timestamp: new Date().toISOString(),
  };
}
```

---

## SECTION 60 — A/B TESTING & FEATURE FLAGS

### File 60-1: `src/types/ab-testing.ts`

```typescript
// src/types/ab-testing.ts
// A/B testing and feature flag types

export type FeatureFlagStatus = 'active' | 'inactive' | 'archived';
export type ExperimentStatus = 'draft' | 'running' | 'paused' | 'completed' | 'archived';
export type VariantAllocation = 'equal' | 'weighted' | 'custom';

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  status: FeatureFlagStatus;
  enabled: boolean;
  rules: FeatureFlagRule[];
  defaultValue: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags: string[];
}

export interface FeatureFlagRule {
  id: string;
  type: 'percentage' | 'userIds' | 'userAttribute' | 'environment';
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'in';
  attribute?: string;
  value: string | number | boolean | string[];
  percentage?: number;
  enabled: boolean;
}

export interface Experiment {
  id: string;
  key: string;
  name: string;
  description: string;
  hypothesis: string;
  status: ExperimentStatus;
  variants: ExperimentVariant[];
  targetAudience: TargetAudience;
  metrics: ExperimentMetric[];
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  results?: ExperimentResults;
  winner?: string;
}

export interface ExperimentVariant {
  id: string;
  key: string;
  name: string;
  description?: string;
  weight: number; // 0-100, must sum to 100
  isControl: boolean;
  config: Record<string, unknown>;
}

export interface TargetAudience {
  percentage: number; // 0-100 traffic percentage
  filters: AudienceFilter[];
}

export interface AudienceFilter {
  attribute: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'in' | 'greaterThan' | 'lessThan';
  value: string | number | string[];
}

export interface ExperimentMetric {
  id: string;
  name: string;
  type: 'conversion' | 'revenue' | 'engagement' | 'custom';
  eventName: string;
  isPrimary: boolean;
  minimumSampleSize?: number;
}

export interface ExperimentResults {
  totalParticipants: number;
  variantResults: VariantResult[];
  statisticalSignificance: number;
  confidenceLevel: number;
  isSignificant: boolean;
  startDate: string;
  endDate: string;
  duration: number;
}

export interface VariantResult {
  variantId: string;
  variantKey: string;
  participants: number;
  conversions: number;
  conversionRate: number;
  revenue?: number;
  averageRevenue?: number;
  improvement?: number; // vs control
  confidenceInterval: [number, number];
}

export interface ExperimentEvent {
  experimentId: string;
  variantId: string;
  userId: string;
  sessionId: string;
  eventType: 'exposure' | 'conversion' | 'revenue';
  eventName?: string;
  value?: number;
  metadata?: Record<string, unknown>;
  timestamp: string;
}
```

### File 60-2: `src/lib/ab-testing/feature-flag-service.ts`

```typescript
// src/lib/ab-testing/feature-flag-service.ts
// Feature flag evaluation engine

import type { FeatureFlag, FeatureFlagRule } from '@/types/ab-testing';
import { db } from '@/lib/firebase/config';
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

// In-memory cache for feature flags
let flagCache: Map<string, FeatureFlag> = new Map();
let cacheTimestamp = 0;
const CACHE_TTL = 60_000; // 1 minute

export class FeatureFlagService {
  /**
   * Evaluate a feature flag for a specific user context
   */
  static async isEnabled(
    flagKey: string,
    context: {
      userId?: string;
      email?: string;
      role?: string;
      plan?: string;
      country?: string;
      attributes?: Record<string, string | number | boolean>;
    } = {}
  ): Promise<boolean> {
    const flag = await this.getFlag(flagKey);
    if (!flag || flag.status !== 'active') return false;
    if (!flag.enabled) return flag.defaultValue;

    // Evaluate rules in order, first match wins
    for (const rule of flag.rules) {
      if (!rule.enabled) continue;
      const result = this.evaluateRule(rule, context);
      if (result !== null) return result;
    }

    return flag.defaultValue;
  }

  /**
   * Get all flags for a user context (bulk evaluation)
   */
  static async getAllFlags(
    context: {
      userId?: string;
      email?: string;
      role?: string;
      plan?: string;
      country?: string;
      attributes?: Record<string, string | number | boolean>;
    } = {}
  ): Promise<Record<string, boolean>> {
    await this.refreshCache();
    const results: Record<string, boolean> = {};

    for (const [key, flag] of flagCache) {
      if (flag.status !== 'active') continue;
      results[key] = await this.isEnabled(key, context);
    }

    return results;
  }

  /**
   * Get a single flag definition
   */
  static async getFlag(flagKey: string): Promise<FeatureFlag | null> {
    await this.refreshCache();
    return flagCache.get(flagKey) || null;
  }

  /**
   * Create or update a feature flag
   */
  static async upsertFlag(
    flag: Omit<FeatureFlag, 'createdAt' | 'updatedAt'>
  ): Promise<void> {
    const ref = doc(db, 'feature_flags', flag.id);
    const existing = await getDoc(ref);

    if (existing.exists()) {
      await updateDoc(ref, {
        ...flag,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(ref, {
        ...flag,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    // Invalidate cache
    cacheTimestamp = 0;
  }

  /**
   * Toggle a flag on/off
   */
  static async toggleFlag(flagId: string, enabled: boolean): Promise<void> {
    await updateDoc(doc(db, 'feature_flags', flagId), {
      enabled,
      updatedAt: serverTimestamp(),
    });
    cacheTimestamp = 0;
  }

  // -- Private helpers --

  private static evaluateRule(
    rule: FeatureFlagRule,
    context: Record<string, unknown>
  ): boolean | null {
    switch (rule.type) {
      case 'percentage':
        return this.evaluatePercentage(rule, context);
      case 'userIds':
        return this.evaluateUserIds(rule, context);
      case 'userAttribute':
        return this.evaluateAttribute(rule, context);
      case 'environment':
        return this.evaluateEnvironment(rule);
      default:
        return null;
    }
  }

  private static evaluatePercentage(
    rule: FeatureFlagRule,
    context: Record<string, unknown>
  ): boolean | null {
    const userId = (context.userId as string) || 'anonymous';
    const hash = this.hashString(`${rule.id}:${userId}`);
    const percentage = hash % 100;
    return percentage < (rule.percentage || 0);
  }

  private static evaluateUserIds(
    rule: FeatureFlagRule,
    context: Record<string, unknown>
  ): boolean | null {
    const userId = context.userId as string;
    if (!userId) return null;
    const allowedIds = Array.isArray(rule.value) ? rule.value : [rule.value];
    return allowedIds.includes(userId) ? true : null;
  }

  private static evaluateAttribute(
    rule: FeatureFlagRule,
    context: Record<string, unknown>
  ): boolean | null {
    const attr = rule.attribute;
    if (!attr) return null;

    const value = context[attr] ?? context.attributes?.[attr as keyof typeof context.attributes];
    if (value === undefined) return null;

    switch (rule.operator) {
      case 'equals':
        return value === rule.value ? true : null;
      case 'contains':
        return typeof value === 'string' && value.includes(String(rule.value))
          ? true
          : null;
      case 'in':
        return Array.isArray(rule.value) && rule.value.includes(String(value))
          ? true
          : null;
      case 'greaterThan':
        return typeof value === 'number' && value > Number(rule.value)
          ? true
          : null;
      case 'lessThan':
        return typeof value === 'number' && value < Number(rule.value)
          ? true
          : null;
      default:
        return null;
    }
  }

  private static evaluateEnvironment(rule: FeatureFlagRule): boolean | null {
    const env = process.env.NODE_ENV || 'development';
    return env === rule.value ? true : null;
  }

  private static hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // 32-bit int
    }
    return Math.abs(hash);
  }

  private static async refreshCache(): Promise<void> {
    if (Date.now() - cacheTimestamp < CACHE_TTL) return;

    try {
      const snap = await getDocs(
        query(collection(db, 'feature_flags'), where('status', '!=', 'archived'))
      );

      const newCache = new Map<string, FeatureFlag>();
      snap.forEach((d) => {
        const data = d.data() as FeatureFlag;
        newCache.set(data.key, { ...data, id: d.id });
      });

      flagCache = newCache;
      cacheTimestamp = Date.now();
    } catch (error) {
      console.error('Failed to refresh feature flag cache:', error);
    }
  }
}
```

### File 60-3: `src/lib/ab-testing/experiment-service.ts`

```typescript
// src/lib/ab-testing/experiment-service.ts
// A/B experiment assignment and tracking

import type {
  Experiment,
  ExperimentVariant,
  ExperimentEvent,
  ExperimentResults,
  VariantResult,
} from '@/types/ab-testing';
import { db } from '@/lib/firebase/config';
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  collection,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
} from 'firebase/firestore';

// Session-level variant assignments
const assignments = new Map<string, string>();

export class ExperimentService {
  /**
   * Get variant assignment for a user in an experiment
   */
  static async getVariant(
    experimentKey: string,
    userId: string,
    attributes?: Record<string, unknown>
  ): Promise<ExperimentVariant | null> {
    // Check session cache
    const cacheKey = `${experimentKey}:${userId}`;
    const cached = assignments.get(cacheKey);
    if (cached) {
      const experiment = await this.getExperiment(experimentKey);
      return experiment?.variants.find((v) => v.id === cached) || null;
    }

    const experiment = await this.getExperiment(experimentKey);
    if (!experiment || experiment.status !== 'running') return null;

    // Check audience targeting
    if (!this.matchesAudience(experiment, attributes)) return null;

    // Check for existing assignment in Firestore
    const assignmentRef = doc(
      db,
      'experiment_assignments',
      `${experimentKey}_${userId}`
    );
    const existingAssignment = await getDoc(assignmentRef);

    if (existingAssignment.exists()) {
      const variantId = existingAssignment.data().variantId;
      assignments.set(cacheKey, variantId);
      return experiment.variants.find((v) => v.id === variantId) || null;
    }

    // Assign new variant based on weights
    const variant = this.assignVariant(experiment, userId);
    if (!variant) return null;

    // Persist assignment
    await setDoc(assignmentRef, {
      experimentId: experiment.id,
      experimentKey,
      variantId: variant.id,
      variantKey: variant.key,
      userId,
      assignedAt: serverTimestamp(),
    });

    // Track exposure
    await this.trackEvent({
      experimentId: experiment.id,
      variantId: variant.id,
      userId,
      sessionId: this.getSessionId(),
      eventType: 'exposure',
      timestamp: new Date().toISOString(),
    });

    // Update counters
    await updateDoc(doc(db, 'experiments', experiment.id), {
      [`variantCounts.${variant.id}`]: increment(1),
    });

    assignments.set(cacheKey, variant.id);
    return variant;
  }

  /**
   * Track a conversion event for an experiment
   */
  static async trackConversion(
    experimentKey: string,
    userId: string,
    eventName: string,
    value?: number,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    const cacheKey = `${experimentKey}:${userId}`;
    const variantId = assignments.get(cacheKey);
    if (!variantId) return;

    const experiment = await this.getExperiment(experimentKey);
    if (!experiment) return;

    await this.trackEvent({
      experimentId: experiment.id,
      variantId,
      userId,
      sessionId: this.getSessionId(),
      eventType: value !== undefined ? 'revenue' : 'conversion',
      eventName,
      value,
      metadata,
      timestamp: new Date().toISOString(),
    });

    // Update conversion counter
    await updateDoc(doc(db, 'experiments', experiment.id), {
      [`conversionCounts.${variantId}`]: increment(1),
      ...(value !== undefined
        ? { [`revenueSums.${variantId}`]: increment(value) }
        : {}),
    });
  }

  /**
   * Calculate experiment results with statistical significance
   */
  static async calculateResults(experimentId: string): Promise<ExperimentResults | null> {
    const expRef = doc(db, 'experiments', experimentId);
    const expDoc = await getDoc(expRef);
    if (!expDoc.exists()) return null;

    const experiment = expDoc.data() as Experiment;
    const variantCounts = (expDoc.data().variantCounts || {}) as Record<string, number>;
    const conversionCounts = (expDoc.data().conversionCounts || {}) as Record<string, number>;
    const revenueSums = (expDoc.data().revenueSums || {}) as Record<string, number>;

    const totalParticipants = Object.values(variantCounts).reduce((a, b) => a + b, 0);
    const control = experiment.variants.find((v) => v.isControl);

    const controlRate = control
      ? (conversionCounts[control.id] || 0) / (variantCounts[control.id] || 1)
      : 0;

    const variantResults: VariantResult[] = experiment.variants.map((variant) => {
      const participants = variantCounts[variant.id] || 0;
      const conversions = conversionCounts[variant.id] || 0;
      const revenue = revenueSums[variant.id] || 0;
      const conversionRate = participants > 0 ? conversions / participants : 0;
      const improvement = controlRate > 0
        ? ((conversionRate - controlRate) / controlRate) * 100
        : 0;

      // Wilson score interval for confidence interval
      const ci = this.wilsonInterval(conversions, participants, 0.95);

      return {
        variantId: variant.id,
        variantKey: variant.key,
        participants,
        conversions,
        conversionRate,
        revenue: revenue > 0 ? revenue : undefined,
        averageRevenue: conversions > 0 ? revenue / conversions : undefined,
        improvement: variant.isControl ? 0 : improvement,
        confidenceInterval: ci,
      };
    });

    // Chi-squared test for significance
    const significance = this.chiSquaredTest(variantResults);

    const results: ExperimentResults = {
      totalParticipants,
      variantResults,
      statisticalSignificance: significance,
      confidenceLevel: 0.95,
      isSignificant: significance >= 0.95,
      startDate: experiment.startDate || experiment.createdAt,
      endDate: new Date().toISOString(),
      duration: Math.floor(
        (Date.now() - new Date(experiment.startDate || experiment.createdAt).getTime()) /
          (1000 * 60 * 60 * 24)
      ),
    };

    // Store results
    await updateDoc(expRef, { results, updatedAt: serverTimestamp() });

    return results;
  }

  // -- Private helpers --

  private static async getExperiment(key: string): Promise<Experiment | null> {
    const snap = await getDocs(
      query(
        collection(db, 'experiments'),
        where('key', '==', key),
        where('status', '==', 'running')
      )
    );
    if (snap.empty) return null;
    return { ...snap.docs[0].data(), id: snap.docs[0].id } as Experiment;
  }

  private static assignVariant(
    experiment: Experiment,
    userId: string
  ): ExperimentVariant | null {
    const hash = this.hashString(`${experiment.id}:${userId}`);
    const normalizedHash = (hash % 10000) / 100; // 0-99.99

    // Check if user falls within traffic allocation
    if (normalizedHash >= experiment.targetAudience.percentage) return null;

    // Weighted assignment
    let cumulative = 0;
    const roll = (hash % 100);
    for (const variant of experiment.variants) {
      cumulative += variant.weight;
      if (roll < cumulative) return variant;
    }

    return experiment.variants[experiment.variants.length - 1];
  }

  private static matchesAudience(
    experiment: Experiment,
    attributes?: Record<string, unknown>
  ): boolean {
    if (!attributes || experiment.targetAudience.filters.length === 0) return true;

    return experiment.targetAudience.filters.every((filter) => {
      const value = attributes[filter.attribute];
      if (value === undefined) return false;

      switch (filter.operator) {
        case 'equals':
          return value === filter.value;
        case 'notEquals':
          return value !== filter.value;
        case 'contains':
          return typeof value === 'string' && value.includes(String(filter.value));
        case 'in':
          return Array.isArray(filter.value) && filter.value.includes(String(value));
        case 'greaterThan':
          return Number(value) > Number(filter.value);
        case 'lessThan':
          return Number(value) < Number(filter.value);
        default:
          return true;
      }
    });
  }

  private static async trackEvent(event: ExperimentEvent): Promise<void> {
    try {
      await addDoc(collection(db, 'experiment_events'), {
        ...event,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Failed to track experiment event:', error);
    }
  }

  private static wilsonInterval(
    successes: number,
    trials: number,
    confidence: number
  ): [number, number] {
    if (trials === 0) return [0, 0];

    const z = confidence === 0.95 ? 1.96 : confidence === 0.99 ? 2.576 : 1.645;
    const p = successes / trials;
    const denominator = 1 + z * z / trials;
    const centre = (p + z * z / (2 * trials)) / denominator;
    const margin =
      (z * Math.sqrt((p * (1 - p) + z * z / (4 * trials)) / trials)) /
      denominator;

    return [Math.max(0, centre - margin), Math.min(1, centre + margin)];
  }

  private static chiSquaredTest(variants: VariantResult[]): number {
    const total = variants.reduce((s, v) => s + v.participants, 0);
    const totalConversions = variants.reduce((s, v) => s + v.conversions, 0);
    if (total === 0 || totalConversions === 0) return 0;

    const expectedRate = totalConversions / total;
    let chiSquared = 0;

    for (const v of variants) {
      const expectedConversions = v.participants * expectedRate;
      const expectedNonConversions = v.participants * (1 - expectedRate);
      if (expectedConversions > 0) {
        chiSquared += Math.pow(v.conversions - expectedConversions, 2) / expectedConversions;
      }
      const nonConversions = v.participants - v.conversions;
      if (expectedNonConversions > 0) {
        chiSquared +=
          Math.pow(nonConversions - expectedNonConversions, 2) / expectedNonConversions;
      }
    }

    // Approximate p-value from chi-squared (df = variants.length - 1)
    const df = variants.length - 1;
    if (df <= 0) return 0;

    // Simplified significance calculation
    // chi-squared > 3.84 for df=1 at 95%, > 5.99 for df=2
    const criticalValues: Record<number, number> = {
      1: 3.841,
      2: 5.991,
      3: 7.815,
      4: 9.488,
    };
    const critical = criticalValues[df] || 3.841;
    return chiSquared >= critical ? 0.95 : chiSquared / critical * 0.95;
  }

  private static hashString(str: string): number {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) + hash + str.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  private static getSessionId(): string {
    if (typeof window === 'undefined') return 'server';
    let sessionId = sessionStorage.getItem('gratis_session_id');
    if (!sessionId) {
      sessionId = `s_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      sessionStorage.setItem('gratis_session_id', sessionId);
    }
    return sessionId;
  }
}
```

### File 60-4: `src/hooks/useFeatureFlag.ts`

```typescript
// src/hooks/useFeatureFlag.ts
// React hooks for feature flags and A/B tests

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { FeatureFlagService } from '@/lib/ab-testing/feature-flag-service';
import { ExperimentService } from '@/lib/ab-testing/experiment-service';
import type { ExperimentVariant } from '@/types/ab-testing';

/**
 * Check if a feature flag is enabled
 */
export function useFeatureFlag(flagKey: string): {
  enabled: boolean;
  loading: boolean;
} {
  const { user } = useAuth();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function evaluate() {
      try {
        const result = await FeatureFlagService.isEnabled(flagKey, {
          userId: user?.uid,
          email: user?.email || undefined,
          role: user?.role,
          plan: user?.subscriptionTier,
        });
        if (mounted) setEnabled(result);
      } catch (error) {
        console.error(`Feature flag evaluation failed for "${flagKey}":`, error);
        if (mounted) setEnabled(false);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    evaluate();
    return () => { mounted = false; };
  }, [flagKey, user?.uid, user?.email, user?.role, user?.subscriptionTier]);

  return { enabled, loading };
}

/**
 * Get all feature flags for current user
 */
export function useAllFeatureFlags(): {
  flags: Record<string, boolean>;
  loading: boolean;
  refresh: () => Promise<void>;
} {
  const { user } = useAuth();
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const result = await FeatureFlagService.getAllFlags({
        userId: user?.uid,
        email: user?.email || undefined,
        role: user?.role,
      });
      setFlags(result);
    } catch (error) {
      console.error('Failed to load feature flags:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, user?.email, user?.role]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { flags, loading, refresh };
}

/**
 * Get assigned variant for an A/B experiment
 */
export function useExperiment(experimentKey: string): {
  variant: ExperimentVariant | null;
  loading: boolean;
  trackConversion: (eventName: string, value?: number) => Promise<void>;
} {
  const { user } = useAuth();
  const [variant, setVariant] = useState<ExperimentVariant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadVariant() {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        const result = await ExperimentService.getVariant(
          experimentKey,
          user.uid,
          {
            role: user.role,
            plan: user.subscriptionTier,
            country: user.country,
          }
        );
        if (mounted) setVariant(result);
      } catch (error) {
        console.error(`Experiment "${experimentKey}" assignment failed:`, error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadVariant();
    return () => { mounted = false; };
  }, [experimentKey, user?.uid, user?.role, user?.subscriptionTier, user?.country]);

  const trackConversion = useCallback(
    async (eventName: string, value?: number) => {
      if (!user?.uid || !variant) return;
      await ExperimentService.trackConversion(
        experimentKey,
        user.uid,
        eventName,
        value
      );
    },
    [experimentKey, user?.uid, variant]
  );

  return { variant, loading, trackConversion };
}
```

### File 60-5: `src/components/ab-testing/FeatureGate.tsx`

```tsx
// src/components/ab-testing/FeatureGate.tsx
// Conditional rendering based on feature flags

'use client';

import { ReactNode } from 'react';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';

interface FeatureGateProps {
  flag: string;
  children: ReactNode;
  fallback?: ReactNode;
  loading?: ReactNode;
}

export function FeatureGate({
  flag,
  children,
  fallback = null,
  loading: loadingContent = null,
}: FeatureGateProps) {
  const { enabled, loading } = useFeatureFlag(flag);

  if (loading) return <>{loadingContent}</>;
  if (!enabled) return <>{fallback}</>;

  return <>{children}</>;
}

/**
 * A/B Test variant renderer
 */
interface ABTestProps {
  experimentKey: string;
  variants: Record<string, ReactNode>;
  fallback?: ReactNode;
  loading?: ReactNode;
  onExposure?: (variantKey: string) => void;
}

export function ABTest({
  experimentKey,
  variants,
  fallback = null,
  loading: loadingContent = null,
  onExposure,
}: ABTestProps) {
  const { variant, loading } = useFeatureFlag(experimentKey);

  // Track exposure via custom hook would go here
  // This is a simplified version using FeatureGate pattern

  if (loading) return <>{loadingContent}</>;

  // Find variant in variants map
  // This would use useExperiment in real implementation
  return <>{fallback}</>;
}

// Full A/B test component using experiment service
import { useExperiment } from '@/hooks/useFeatureFlag';
import { useEffect } from 'react';

interface ExperimentRendererProps {
  experimentKey: string;
  variants: Record<string, ReactNode>;
  fallback?: ReactNode;
  loading?: ReactNode;
}

export function ExperimentRenderer({
  experimentKey,
  variants,
  fallback = null,
  loading: loadingContent = null,
}: ExperimentRendererProps) {
  const { variant, loading } = useExperiment(experimentKey);

  if (loading) return <>{loadingContent}</>;
  if (!variant) return <>{fallback}</>;

  const content = variants[variant.key];
  return <>{content || fallback}</>;
}
```

### File 60-6: `src/app/api/admin/experiments/route.ts`

```typescript
// src/app/api/admin/experiments/route.ts
// Admin API for managing experiments

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAuth } from '@/lib/auth/verify';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || !['admin', 'super_admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let q = adminDb.collection('experiments').orderBy('createdAt', 'desc');
    if (status) {
      q = q.where('status', '==', status);
    }

    const snap = await q.limit(50).get();
    const experiments = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    return NextResponse.json({ experiments });
  } catch (error) {
    console.error('GET /api/admin/experiments error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || !['admin', 'super_admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { key, name, description, hypothesis, variants, targetAudience, metrics } = body;

    if (!key || !name || !variants?.length) {
      return NextResponse.json(
        { error: 'key, name, and variants are required' },
        { status: 400 }
      );
    }

    // Validate variant weights sum to 100
    const totalWeight = variants.reduce((s: number, v: { weight: number }) => s + v.weight, 0);
    if (totalWeight !== 100) {
      return NextResponse.json(
        { error: `Variant weights must sum to 100, got ${totalWeight}` },
        { status: 400 }
      );
    }

    // Check for existing key
    const existing = await adminDb
      .collection('experiments')
      .where('key', '==', key)
      .limit(1)
      .get();

    if (!existing.empty) {
      return NextResponse.json(
        { error: `Experiment key "${key}" already exists` },
        { status: 409 }
      );
    }

    const experiment = {
      key,
      name,
      description: description || '',
      hypothesis: hypothesis || '',
      status: 'draft',
      variants,
      targetAudience: targetAudience || { percentage: 100, filters: [] },
      metrics: metrics || [],
      variantCounts: {},
      conversionCounts: {},
      revenueSums: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user.uid,
    };

    const ref = await adminDb.collection('experiments').add(experiment);

    return NextResponse.json(
      { id: ref.id, ...experiment },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/admin/experiments error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### File 60-7: `src/app/api/admin/feature-flags/route.ts`

```typescript
// src/app/api/admin/feature-flags/route.ts
// Admin API for managing feature flags

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAuth } from '@/lib/auth/verify';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || !['admin', 'super_admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const snap = await adminDb
      .collection('feature_flags')
      .orderBy('updatedAt', 'desc')
      .get();

    const flags = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ flags });
  } catch (error) {
    console.error('GET /api/admin/feature-flags error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || !['admin', 'super_admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { key, name, description, rules, defaultValue, tags } = body;

    if (!key || !name) {
      return NextResponse.json(
        { error: 'key and name are required' },
        { status: 400 }
      );
    }

    // Validate key format
    if (!/^[a-z][a-z0-9_]*$/.test(key)) {
      return NextResponse.json(
        { error: 'Key must be lowercase alphanumeric with underscores' },
        { status: 400 }
      );
    }

    // Check for duplicate key
    const existing = await adminDb
      .collection('feature_flags')
      .where('key', '==', key)
      .limit(1)
      .get();

    if (!existing.empty) {
      return NextResponse.json(
        { error: `Feature flag key "${key}" already exists` },
        { status: 409 }
      );
    }

    const flag = {
      key,
      name,
      description: description || '',
      status: 'active',
      enabled: false,
      rules: rules || [],
      defaultValue: defaultValue ?? false,
      tags: tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user.uid,
    };

    const ref = await adminDb.collection('feature_flags').add(flag);
    return NextResponse.json({ id: ref.id, ...flag }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/feature-flags error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || !['admin', 'super_admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    // Prevent key changes
    delete updates.key;
    delete updates.createdAt;
    delete updates.createdBy;

    await adminDb
      .collection('feature_flags')
      .doc(id)
      .update({ ...updates, updatedAt: new Date().toISOString() });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PATCH /api/admin/feature-flags error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

---

## SECTION 61 — DATA EXPORT & REPORTING ENGINE

### File 61-1: `src/types/export.ts`

```typescript
// src/types/export.ts
// Data export and reporting types

export type ExportFormat = 'csv' | 'json' | 'xlsx' | 'pdf';
export type ExportStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'expired';
export type ExportScope = 'donations' | 'users' | 'projects' | 'events' | 'bottles' | 'partners' | 'subscriptions' | 'audit_logs';

export interface ExportRequest {
  id: string;
  scope: ExportScope;
  format: ExportFormat;
  filters: ExportFilter[];
  columns?: string[];
  dateRange?: { start: string; end: string };
  requestedBy: string;
  status: ExportStatus;
  fileUrl?: string;
  fileSize?: number;
  rowCount?: number;
  error?: string;
  createdAt: string;
  completedAt?: string;
  expiresAt?: string;
}

export interface ExportFilter {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains';
  value: string | number | boolean | string[];
}

export interface ReportDefinition {
  id: string;
  name: string;
  description: string;
  type: 'summary' | 'detail' | 'comparison' | 'trend';
  scope: ExportScope[];
  metrics: ReportMetric[];
  groupBy?: string[];
  schedule?: ReportSchedule;
  recipients?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportMetric {
  field: string;
  aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max' | 'distinct';
  label: string;
  format?: 'number' | 'currency' | 'percentage';
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  time: string; // HH:mm
  timezone: string;
  enabled: boolean;
  lastRun?: string;
  nextRun?: string;
}

export interface ReportResult {
  reportId: string;
  title: string;
  generatedAt: string;
  dateRange: { start: string; end: string };
  summary: Record<string, number | string>;
  data: Record<string, unknown>[];
  charts?: ChartData[];
}

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'area';
  title: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
  }[];
}

export interface ExportColumn {
  key: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'currency';
  format?: string;
}
```

### File 61-2: `src/lib/export/export-service.ts`

```typescript
// src/lib/export/export-service.ts
// Data export processing engine

import type {
  ExportRequest,
  ExportFilter,
  ExportFormat,
  ExportScope,
  ExportColumn,
} from '@/types/export';
import { adminDb, adminStorage } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

// Column definitions per scope
const SCOPE_COLUMNS: Record<ExportScope, ExportColumn[]> = {
  donations: [
    { key: 'id', label: 'Donation ID', type: 'string' },
    { key: 'donorName', label: 'Donor Name', type: 'string' },
    { key: 'donorEmail', label: 'Donor Email', type: 'string' },
    { key: 'amount', label: 'Amount', type: 'currency' },
    { key: 'currency', label: 'Currency', type: 'string' },
    { key: 'projectName', label: 'Project', type: 'string' },
    { key: 'type', label: 'Type', type: 'string' },
    { key: 'status', label: 'Status', type: 'string' },
    { key: 'paymentMethod', label: 'Payment Method', type: 'string' },
    { key: 'isRecurring', label: 'Recurring', type: 'boolean' },
    { key: 'createdAt', label: 'Date', type: 'date' },
  ],
  users: [
    { key: 'id', label: 'User ID', type: 'string' },
    { key: 'displayName', label: 'Name', type: 'string' },
    { key: 'email', label: 'Email', type: 'string' },
    { key: 'role', label: 'Role', type: 'string' },
    { key: 'bottleCount', label: 'Bottles', type: 'number' },
    { key: 'totalDonated', label: 'Total Donated', type: 'currency' },
    { key: 'isTribeMember', label: 'TRIBE Member', type: 'boolean' },
    { key: 'referralCount', label: 'Referrals', type: 'number' },
    { key: 'createdAt', label: 'Joined', type: 'date' },
    { key: 'lastActive', label: 'Last Active', type: 'date' },
  ],
  projects: [
    { key: 'id', label: 'Project ID', type: 'string' },
    { key: 'name', label: 'Name', type: 'string' },
    { key: 'status', label: 'Status', type: 'string' },
    { key: 'goalAmount', label: 'Goal', type: 'currency' },
    { key: 'currentAmount', label: 'Raised', type: 'currency' },
    { key: 'donorCount', label: 'Donors', type: 'number' },
    { key: 'category', label: 'Category', type: 'string' },
    { key: 'location', label: 'Location', type: 'string' },
    { key: 'startDate', label: 'Start Date', type: 'date' },
    { key: 'endDate', label: 'End Date', type: 'date' },
  ],
  events: [
    { key: 'id', label: 'Event ID', type: 'string' },
    { key: 'title', label: 'Title', type: 'string' },
    { key: 'status', label: 'Status', type: 'string' },
    { key: 'startDate', label: 'Start Date', type: 'date' },
    { key: 'endDate', label: 'End Date', type: 'date' },
    { key: 'location', label: 'Location', type: 'string' },
    { key: 'registrationCount', label: 'Registrations', type: 'number' },
    { key: 'attendeeCount', label: 'Attendees', type: 'number' },
    { key: 'bottlesCollected', label: 'Bottles Collected', type: 'number' },
  ],
  bottles: [
    { key: 'id', label: 'Bottle ID', type: 'string' },
    { key: 'userId', label: 'User ID', type: 'string' },
    { key: 'userName', label: 'User Name', type: 'string' },
    { key: 'count', label: 'Count', type: 'number' },
    { key: 'source', label: 'Source', type: 'string' },
    { key: 'verificationStatus', label: 'Verified', type: 'string' },
    { key: 'createdAt', label: 'Date', type: 'date' },
  ],
  partners: [
    { key: 'id', label: 'Partner ID', type: 'string' },
    { key: 'name', label: 'Name', type: 'string' },
    { key: 'type', label: 'Type', type: 'string' },
    { key: 'status', label: 'Status', type: 'string' },
    { key: 'totalDonations', label: 'Total Donations', type: 'currency' },
    { key: 'projectCount', label: 'Projects', type: 'number' },
    { key: 'joinedAt', label: 'Joined', type: 'date' },
  ],
  subscriptions: [
    { key: 'id', label: 'Subscription ID', type: 'string' },
    { key: 'userId', label: 'User ID', type: 'string' },
    { key: 'userEmail', label: 'Email', type: 'string' },
    { key: 'plan', label: 'Plan', type: 'string' },
    { key: 'status', label: 'Status', type: 'string' },
    { key: 'amount', label: 'Amount', type: 'currency' },
    { key: 'interval', label: 'Interval', type: 'string' },
    { key: 'startDate', label: 'Start Date', type: 'date' },
    { key: 'nextBillingDate', label: 'Next Billing', type: 'date' },
  ],
  audit_logs: [
    { key: 'id', label: 'Log ID', type: 'string' },
    { key: 'action', label: 'Action', type: 'string' },
    { key: 'userId', label: 'User ID', type: 'string' },
    { key: 'userEmail', label: 'Email', type: 'string' },
    { key: 'resource', label: 'Resource', type: 'string' },
    { key: 'resourceId', label: 'Resource ID', type: 'string' },
    { key: 'ipAddress', label: 'IP Address', type: 'string' },
    { key: 'createdAt', label: 'Timestamp', type: 'date' },
  ],
};

export class ExportService {
  /**
   * Create and process an export request
   */
  static async createExport(params: {
    scope: ExportScope;
    format: ExportFormat;
    filters?: ExportFilter[];
    columns?: string[];
    dateRange?: { start: string; end: string };
    requestedBy: string;
  }): Promise<ExportRequest> {
    const exportReq: Omit<ExportRequest, 'id'> = {
      scope: params.scope,
      format: params.format,
      filters: params.filters || [],
      columns: params.columns,
      dateRange: params.dateRange,
      requestedBy: params.requestedBy,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const ref = await adminDb.collection('exports').add(exportReq);
    const id = ref.id;

    // Process asynchronously
    this.processExport(id).catch((error) => {
      console.error(`Export ${id} failed:`, error);
      adminDb.collection('exports').doc(id).update({
        status: 'failed',
        error: error.message,
      });
    });

    return { id, ...exportReq };
  }

  /**
   * Get export status and download URL
   */
  static async getExport(exportId: string): Promise<ExportRequest | null> {
    const doc = await adminDb.collection('exports').doc(exportId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as ExportRequest;
  }

  /**
   * Get available columns for a scope
   */
  static getColumns(scope: ExportScope): ExportColumn[] {
    return SCOPE_COLUMNS[scope] || [];
  }

  /**
   * Process the export (query data, format, upload)
   */
  private static async processExport(exportId: string): Promise<void> {
    await adminDb.collection('exports').doc(exportId).update({ status: 'processing' });

    const exportDoc = await adminDb.collection('exports').doc(exportId).get();
    const exportReq = exportDoc.data() as ExportRequest;

    // Fetch data
    const data = await this.fetchData(exportReq);

    // Filter columns
    const columns = exportReq.columns?.length
      ? SCOPE_COLUMNS[exportReq.scope].filter((c) =>
          exportReq.columns!.includes(c.key)
        )
      : SCOPE_COLUMNS[exportReq.scope];

    // Format output
    let content: Buffer;
    let contentType: string;
    let extension: string;

    switch (exportReq.format) {
      case 'csv':
        content = Buffer.from(this.toCSV(data, columns));
        contentType = 'text/csv';
        extension = 'csv';
        break;
      case 'json':
        content = Buffer.from(JSON.stringify(data, null, 2));
        contentType = 'application/json';
        extension = 'json';
        break;
      default:
        content = Buffer.from(this.toCSV(data, columns));
        contentType = 'text/csv';
        extension = 'csv';
    }

    // Upload to storage
    const fileName = `exports/${exportReq.scope}_${exportId}_${Date.now()}.${extension}`;
    const bucket = adminStorage.bucket();
    const file = bucket.file(fileName);

    await file.save(content, {
      metadata: { contentType },
    });

    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    await adminDb.collection('exports').doc(exportId).update({
      status: 'completed',
      fileUrl: url,
      fileSize: content.length,
      rowCount: data.length,
      completedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  /**
   * Fetch data from Firestore based on scope and filters
   */
  private static async fetchData(
    exportReq: ExportRequest
  ): Promise<Record<string, unknown>[]> {
    const collectionMap: Record<ExportScope, string> = {
      donations: 'donations',
      users: 'users',
      projects: 'projects',
      events: 'events',
      bottles: 'bottle_submissions',
      partners: 'partners',
      subscriptions: 'subscriptions',
      audit_logs: 'audit_logs',
    };

    const collectionName = collectionMap[exportReq.scope];
    let q: FirebaseFirestore.Query = adminDb.collection(collectionName);

    // Apply date range
    if (exportReq.dateRange) {
      q = q
        .where('createdAt', '>=', exportReq.dateRange.start)
        .where('createdAt', '<=', exportReq.dateRange.end);
    }

    // Apply filters (Firestore has limits on compound queries)
    for (const filter of exportReq.filters.slice(0, 3)) {
      const op = this.mapOperator(filter.operator);
      if (op) {
        q = q.where(filter.field, op, filter.value);
      }
    }

    // Fetch in batches (max 10k per export)
    const results: Record<string, unknown>[] = [];
    let lastDoc: FirebaseFirestore.QueryDocumentSnapshot | null = null;
    const batchSize = 500;
    const maxRows = 10_000;

    while (results.length < maxRows) {
      let batchQuery = q.limit(batchSize);
      if (lastDoc) {
        batchQuery = batchQuery.startAfter(lastDoc);
      }

      const snap = await batchQuery.get();
      if (snap.empty) break;

      for (const doc of snap.docs) {
        results.push({ id: doc.id, ...doc.data() });
      }

      lastDoc = snap.docs[snap.docs.length - 1];
      if (snap.docs.length < batchSize) break;
    }

    return results;
  }

  /**
   * Convert data to CSV
   */
  private static toCSV(
    data: Record<string, unknown>[],
    columns: ExportColumn[]
  ): string {
    if (data.length === 0) return columns.map((c) => c.label).join(',');

    const header = columns.map((c) => `"${c.label}"`).join(',');
    const rows = data.map((row) =>
      columns
        .map((col) => {
          const value = row[col.key];
          if (value === null || value === undefined) return '';
          if (col.type === 'date' && value) {
            return `"${new Date(value as string).toISOString()}"`;
          }
          if (col.type === 'currency') {
            return Number(value).toFixed(2);
          }
          if (typeof value === 'string') {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return String(value);
        })
        .join(',')
    );

    return [header, ...rows].join('\n');
  }

  private static mapOperator(
    op: ExportFilter['operator']
  ): FirebaseFirestore.WhereFilterOp | null {
    const map: Record<string, FirebaseFirestore.WhereFilterOp> = {
      eq: '==',
      neq: '!=',
      gt: '>',
      gte: '>=',
      lt: '<',
      lte: '<=',
      in: 'in',
      contains: '==', // Firestore doesn't have native contains
    };
    return map[op] || null;
  }
}
```

### File 61-3: `src/app/api/admin/exports/route.ts`

```typescript
// src/app/api/admin/exports/route.ts
// Admin API for data exports

import { NextRequest, NextResponse } from 'next/server';
import { ExportService } from '@/lib/export/export-service';
import { verifyAuth } from '@/lib/auth/verify';
import { adminDb } from '@/lib/firebase/admin';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || !['admin', 'super_admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const exportId = searchParams.get('id');

    if (exportId) {
      const exportReq = await ExportService.getExport(exportId);
      if (!exportReq) {
        return NextResponse.json({ error: 'Export not found' }, { status: 404 });
      }
      return NextResponse.json({ export: exportReq });
    }

    // List recent exports
    const snap = await adminDb
      .collection('exports')
      .where('requestedBy', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();

    const exports = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ exports });
  } catch (error) {
    console.error('GET /api/admin/exports error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || !['admin', 'super_admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { scope, format, filters, columns, dateRange } = body;

    if (!scope || !format) {
      return NextResponse.json(
        { error: 'scope and format are required' },
        { status: 400 }
      );
    }

    const validScopes = [
      'donations', 'users', 'projects', 'events',
      'bottles', 'partners', 'subscriptions', 'audit_logs',
    ];
    if (!validScopes.includes(scope)) {
      return NextResponse.json(
        { error: `Invalid scope. Must be one of: ${validScopes.join(', ')}` },
        { status: 400 }
      );
    }

    const validFormats = ['csv', 'json', 'xlsx', 'pdf'];
    if (!validFormats.includes(format)) {
      return NextResponse.json(
        { error: `Invalid format. Must be one of: ${validFormats.join(', ')}` },
        { status: 400 }
      );
    }

    const exportReq = await ExportService.createExport({
      scope,
      format,
      filters,
      columns,
      dateRange,
      requestedBy: user.uid,
    });

    return NextResponse.json({ export: exportReq }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/exports error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### File 61-4: `src/app/api/admin/exports/columns/route.ts`

```typescript
// src/app/api/admin/exports/columns/route.ts
// Get available export columns for a scope

import { NextRequest, NextResponse } from 'next/server';
import { ExportService } from '@/lib/export/export-service';
import { verifyAuth } from '@/lib/auth/verify';
import type { ExportScope } from '@/types/export';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || !['admin', 'super_admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope') as ExportScope;

    if (!scope) {
      return NextResponse.json({ error: 'scope parameter required' }, { status: 400 });
    }

    const columns = ExportService.getColumns(scope);
    return NextResponse.json({ columns });
  } catch (error) {
    console.error('GET /api/admin/exports/columns error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### File 61-5: `src/lib/export/report-generator.ts`

```typescript
// src/lib/export/report-generator.ts
// Scheduled report generation engine

import type { ReportDefinition, ReportResult, ChartData } from '@/types/export';
import { adminDb } from '@/lib/firebase/admin';

export class ReportGenerator {
  /**
   * Generate a report from definition
   */
  static async generate(
    definition: ReportDefinition,
    dateRange: { start: string; end: string }
  ): Promise<ReportResult> {
    const summary: Record<string, number | string> = {};
    const data: Record<string, unknown>[] = [];
    const charts: ChartData[] = [];

    for (const scope of definition.scope) {
      const collectionName = this.scopeToCollection(scope);
      const snap = await adminDb
        .collection(collectionName)
        .where('createdAt', '>=', dateRange.start)
        .where('createdAt', '<=', dateRange.end)
        .get();

      const records = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      // Calculate metrics
      for (const metric of definition.metrics) {
        const key = `${scope}_${metric.field}_${metric.aggregation}`;
        const values = records
          .map((r) => Number(r[metric.field] || 0))
          .filter((v) => !isNaN(v));

        switch (metric.aggregation) {
          case 'sum':
            summary[key] = values.reduce((a, b) => a + b, 0);
            break;
          case 'avg':
            summary[key] =
              values.length > 0
                ? values.reduce((a, b) => a + b, 0) / values.length
                : 0;
            break;
          case 'count':
            summary[key] = records.length;
            break;
          case 'min':
            summary[key] = values.length > 0 ? Math.min(...values) : 0;
            break;
          case 'max':
            summary[key] = values.length > 0 ? Math.max(...values) : 0;
            break;
          case 'distinct':
            summary[key] = new Set(records.map((r) => r[metric.field])).size;
            break;
        }
      }

      // Group data if specified
      if (definition.groupBy?.length) {
        const grouped = this.groupData(records, definition.groupBy[0]);
        for (const [group, items] of Object.entries(grouped)) {
          const row: Record<string, unknown> = { group };
          for (const metric of definition.metrics) {
            const vals = (items as Record<string, unknown>[])
              .map((r) => Number(r[metric.field] || 0))
              .filter((v) => !isNaN(v));

            switch (metric.aggregation) {
              case 'sum':
                row[metric.label] = vals.reduce((a, b) => a + b, 0);
                break;
              case 'avg':
                row[metric.label] =
                  vals.length > 0
                    ? vals.reduce((a, b) => a + b, 0) / vals.length
                    : 0;
                break;
              case 'count':
                row[metric.label] = (items as unknown[]).length;
                break;
              default:
                row[metric.label] = vals.length;
            }
          }
          data.push(row);
        }

        // Generate chart data
        if (data.length > 0 && data.length <= 20) {
          const metric = definition.metrics[0];
          charts.push({
            type: 'bar',
            title: `${metric.label} by ${definition.groupBy[0]}`,
            labels: data.map((d) => String(d.group)),
            datasets: [
              {
                label: metric.label,
                data: data.map((d) => Number(d[metric.label] || 0)),
                color: '#10b981',
              },
            ],
          });
        }
      } else {
        data.push(...records.slice(0, 1000));
      }
    }

    return {
      reportId: definition.id,
      title: definition.name,
      generatedAt: new Date().toISOString(),
      dateRange,
      summary,
      data,
      charts,
    };
  }

  private static groupData(
    records: Record<string, unknown>[],
    field: string
  ): Record<string, Record<string, unknown>[]> {
    const groups: Record<string, Record<string, unknown>[]> = {};
    for (const record of records) {
      const key = String(record[field] || 'Unknown');
      if (!groups[key]) groups[key] = [];
      groups[key].push(record);
    }
    return groups;
  }

  private static scopeToCollection(scope: string): string {
    const map: Record<string, string> = {
      donations: 'donations',
      users: 'users',
      projects: 'projects',
      events: 'events',
      bottles: 'bottle_submissions',
      partners: 'partners',
      subscriptions: 'subscriptions',
      audit_logs: 'audit_logs',
    };
    return map[scope] || scope;
  }
}
```

---

## SECTION 62 — TWO-FACTOR AUTHENTICATION (2FA / MFA)

### File 62-1: `src/types/mfa.ts`

```typescript
// src/types/mfa.ts
// Multi-Factor Authentication types

export type MFAMethod = 'totp' | 'sms' | 'email' | 'backup_codes';
export type MFAStatus = 'disabled' | 'pending_setup' | 'enabled';

export interface MFAConfig {
  userId: string;
  status: MFAStatus;
  methods: MFAMethodConfig[];
  backupCodes: BackupCode[];
  lastVerifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MFAMethodConfig {
  method: MFAMethod;
  enabled: boolean;
  primary: boolean;
  verifiedAt?: string;
  metadata?: Record<string, string>;
}

export interface TOTPSetup {
  secret: string;
  uri: string;
  qrCode: string; // base64 data URL
  backupCodes: string[];
}

export interface BackupCode {
  code: string;
  usedAt?: string;
}

export interface MFAChallenge {
  id: string;
  userId: string;
  method: MFAMethod;
  expiresAt: string;
  verified: boolean;
  attempts: number;
  maxAttempts: number;
  createdAt: string;
}

export interface MFAVerifyRequest {
  challengeId: string;
  code: string;
  method: MFAMethod;
}

export interface MFAVerifyResponse {
  success: boolean;
  token?: string;
  error?: string;
  remainingAttempts?: number;
}
```

### File 62-2: `src/lib/auth/mfa-service.ts`

```typescript
// src/lib/auth/mfa-service.ts
// Multi-Factor Authentication service

import type {
  MFAConfig,
  TOTPSetup,
  BackupCode,
  MFAChallenge,
  MFAVerifyResponse,
} from '@/types/mfa';
import { adminDb } from '@/lib/firebase/admin';
import { authenticator } from 'otplib';
import * as crypto from 'crypto';

// Configure TOTP
authenticator.options = {
  window: 1, // Allow 1 step tolerance (30 seconds)
  step: 30,
};

export class MFAService {
  /**
   * Initialize TOTP setup for a user
   */
  static async setupTOTP(userId: string, userEmail: string): Promise<TOTPSetup> {
    const secret = authenticator.generateSecret(32);
    const uri = authenticator.keyuri(userEmail, 'GRATIS.NGO', secret);

    // Generate backup codes
    const backupCodes = this.generateBackupCodes(10);

    // Store pending setup (not yet verified)
    await adminDb.collection('mfa_configs').doc(userId).set(
      {
        userId,
        status: 'pending_setup',
        pendingSecret: this.encrypt(secret),
        backupCodes: backupCodes.map((code) => ({
          code: this.hashCode(code),
          usedAt: null,
        })),
        methods: [
          {
            method: 'totp',
            enabled: false,
            primary: true,
          },
        ],
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // Generate QR code as SVG data URL
    const qrCode = await this.generateQRDataUrl(uri);

    return {
      secret,
      uri,
      qrCode,
      backupCodes,
    };
  }

  /**
   * Verify TOTP setup with initial code
   */
  static async verifySetup(
    userId: string,
    code: string
  ): Promise<{ success: boolean; error?: string }> {
    const configDoc = await adminDb.collection('mfa_configs').doc(userId).get();
    if (!configDoc.exists) {
      return { success: false, error: 'MFA not configured' };
    }

    const config = configDoc.data()!;
    if (config.status !== 'pending_setup') {
      return { success: false, error: 'MFA already enabled or not in setup' };
    }

    const secret = this.decrypt(config.pendingSecret);
    const isValid = authenticator.verify({ token: code, secret });

    if (!isValid) {
      return { success: false, error: 'Invalid verification code' };
    }

    // Activate MFA
    await adminDb.collection('mfa_configs').doc(userId).update({
      status: 'enabled',
      secret: config.pendingSecret, // Keep encrypted
      pendingSecret: null,
      methods: [
        {
          method: 'totp',
          enabled: true,
          primary: true,
          verifiedAt: new Date().toISOString(),
        },
      ],
      lastVerifiedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Update user profile
    await adminDb.collection('users').doc(userId).update({
      mfaEnabled: true,
      updatedAt: new Date().toISOString(),
    });

    return { success: true };
  }

  /**
   * Create an MFA challenge for login
   */
  static async createChallenge(userId: string): Promise<MFAChallenge | null> {
    const configDoc = await adminDb.collection('mfa_configs').doc(userId).get();
    if (!configDoc.exists || configDoc.data()?.status !== 'enabled') {
      return null;
    }

    const challenge: Omit<MFAChallenge, 'id'> = {
      userId,
      method: 'totp',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
      verified: false,
      attempts: 0,
      maxAttempts: 5,
      createdAt: new Date().toISOString(),
    };

    const ref = await adminDb.collection('mfa_challenges').add(challenge);
    return { id: ref.id, ...challenge };
  }

  /**
   * Verify an MFA challenge with user code
   */
  static async verifyChallenge(
    challengeId: string,
    code: string
  ): Promise<MFAVerifyResponse> {
    const challengeRef = adminDb.collection('mfa_challenges').doc(challengeId);
    const challengeDoc = await challengeRef.get();

    if (!challengeDoc.exists) {
      return { success: false, error: 'Challenge not found' };
    }

    const challenge = challengeDoc.data() as MFAChallenge;

    // Check expiration
    if (new Date(challenge.expiresAt) < new Date()) {
      await challengeRef.delete();
      return { success: false, error: 'Challenge expired' };
    }

    // Check attempts
    if (challenge.attempts >= challenge.maxAttempts) {
      await challengeRef.delete();
      return { success: false, error: 'Too many attempts', remainingAttempts: 0 };
    }

    // Increment attempts
    await challengeRef.update({
      attempts: challenge.attempts + 1,
    });

    // Try TOTP first
    const configDoc = await adminDb.collection('mfa_configs').doc(challenge.userId).get();
    if (!configDoc.exists) {
      return { success: false, error: 'MFA configuration not found' };
    }

    const config = configDoc.data()!;
    const secret = this.decrypt(config.secret);

    // Check TOTP code
    const isValidTOTP = authenticator.verify({ token: code, secret });
    if (isValidTOTP) {
      await challengeRef.update({ verified: true });

      // Generate MFA verification token
      const token = this.generateVerificationToken();
      await adminDb.collection('mfa_tokens').doc(token).set({
        userId: challenge.userId,
        challengeId,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 min
      });

      return { success: true, token };
    }

    // Check backup codes
    const backupCodeIndex = config.backupCodes.findIndex(
      (bc: BackupCode) => !bc.usedAt && this.verifyHashedCode(code, bc.code)
    );

    if (backupCodeIndex >= 0) {
      // Mark backup code as used
      const updatedCodes = [...config.backupCodes];
      updatedCodes[backupCodeIndex].usedAt = new Date().toISOString();
      await adminDb.collection('mfa_configs').doc(challenge.userId).update({
        backupCodes: updatedCodes,
      });

      await challengeRef.update({ verified: true });

      const token = this.generateVerificationToken();
      await adminDb.collection('mfa_tokens').doc(token).set({
        userId: challenge.userId,
        challengeId,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      });

      return { success: true, token };
    }

    const remaining = challenge.maxAttempts - challenge.attempts - 1;
    return {
      success: false,
      error: 'Invalid code',
      remainingAttempts: remaining,
    };
  }

  /**
   * Disable MFA for a user
   */
  static async disableMFA(userId: string): Promise<void> {
    await adminDb.collection('mfa_configs').doc(userId).update({
      status: 'disabled',
      methods: [],
      updatedAt: new Date().toISOString(),
    });

    await adminDb.collection('users').doc(userId).update({
      mfaEnabled: false,
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Check if user has MFA enabled
   */
  static async isMFAEnabled(userId: string): Promise<boolean> {
    const doc = await adminDb.collection('mfa_configs').doc(userId).get();
    return doc.exists && doc.data()?.status === 'enabled';
  }

  /**
   * Regenerate backup codes
   */
  static async regenerateBackupCodes(userId: string): Promise<string[]> {
    const codes = this.generateBackupCodes(10);

    await adminDb.collection('mfa_configs').doc(userId).update({
      backupCodes: codes.map((code) => ({
        code: this.hashCode(code),
        usedAt: null,
      })),
      updatedAt: new Date().toISOString(),
    });

    return codes;
  }

  // -- Private helpers --

  private static generateBackupCodes(count: number): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      codes.push(`${code.slice(0, 4)}-${code.slice(4)}`);
    }
    return codes;
  }

  private static hashCode(code: string): string {
    return crypto
      .createHash('sha256')
      .update(code.replace(/[-\s]/g, '').toLowerCase())
      .digest('hex');
  }

  private static verifyHashedCode(input: string, hash: string): boolean {
    const inputHash = this.hashCode(input);
    return crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(hash));
  }

  private static encrypt(text: string): string {
    const key = process.env.MFA_ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(key, 'hex'),
      iv
    );
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  }

  private static decrypt(encryptedText: string): string {
    const key = process.env.MFA_ENCRYPTION_KEY || '';
    const [ivHex, encrypted] = encryptedText.split(':');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(key, 'hex'),
      Buffer.from(ivHex, 'hex')
    );
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  private static generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private static async generateQRDataUrl(uri: string): Promise<string> {
    // Simple QR generation using a public API or local library
    // In production, use a library like 'qrcode'
    const encodedUri = encodeURIComponent(uri);
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedUri}`;
  }
}
```

### File 62-3: `src/app/api/auth/mfa/setup/route.ts`

```typescript
// src/app/api/auth/mfa/setup/route.ts
// MFA setup endpoints

import { NextRequest, NextResponse } from 'next/server';
import { MFAService } from '@/lib/auth/mfa-service';
import { verifyAuth } from '@/lib/auth/verify';

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const setup = await MFAService.setupTOTP(user.uid, user.email || '');

    return NextResponse.json({
      qrCode: setup.qrCode,
      secret: setup.secret,
      backupCodes: setup.backupCodes,
      message:
        'Scan the QR code with your authenticator app, then verify with a code.',
    });
  } catch (error) {
    console.error('MFA setup error:', error);
    return NextResponse.json({ error: 'Failed to setup MFA' }, { status: 500 });
  }
}
```

### File 62-4: `src/app/api/auth/mfa/verify/route.ts`

```typescript
// src/app/api/auth/mfa/verify/route.ts
// MFA verification endpoints (setup completion + login challenge)

import { NextRequest, NextResponse } from 'next/server';
import { MFAService } from '@/lib/auth/mfa-service';
import { verifyAuth } from '@/lib/auth/verify';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, code, challengeId } = body;

    if (action === 'setup') {
      // Verify initial TOTP setup
      const user = await verifyAuth(request);
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const result = await MFAService.verifySetup(user.uid, code);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: 'MFA enabled successfully',
      });
    }

    if (action === 'challenge') {
      // Verify login MFA challenge
      if (!challengeId || !code) {
        return NextResponse.json(
          { error: 'challengeId and code are required' },
          { status: 400 }
        );
      }

      const result = await MFAService.verifyChallenge(challengeId, code);

      if (!result.success) {
        return NextResponse.json(
          {
            error: result.error,
            remainingAttempts: result.remainingAttempts,
          },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        token: result.token,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('MFA verify error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
```

### File 62-5: `src/app/api/auth/mfa/disable/route.ts`

```typescript
// src/app/api/auth/mfa/disable/route.ts
// Disable MFA for authenticated user

import { NextRequest, NextResponse } from 'next/server';
import { MFAService } from '@/lib/auth/mfa-service';
import { verifyAuth } from '@/lib/auth/verify';

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { code } = body;

    // Require current TOTP code to disable
    if (!code) {
      return NextResponse.json(
        { error: 'Current TOTP code required to disable MFA' },
        { status: 400 }
      );
    }

    // Create and verify a challenge first
    const challenge = await MFAService.createChallenge(user.uid);
    if (!challenge) {
      return NextResponse.json(
        { error: 'MFA is not enabled' },
        { status: 400 }
      );
    }

    const verifyResult = await MFAService.verifyChallenge(challenge.id, code);
    if (!verifyResult.success) {
      return NextResponse.json(
        { error: 'Invalid code' },
        { status: 401 }
      );
    }

    await MFAService.disableMFA(user.uid);

    return NextResponse.json({
      success: true,
      message: 'MFA has been disabled',
    });
  } catch (error) {
    console.error('MFA disable error:', error);
    return NextResponse.json({ error: 'Failed to disable MFA' }, { status: 500 });
  }
}
```

### File 62-6: `src/components/auth/MFASetup.tsx`

```tsx
// src/components/auth/MFASetup.tsx
// MFA setup wizard component

'use client';

import { useState } from 'react';
import { Shield, Copy, Check, AlertTriangle, Loader2 } from 'lucide-react';

interface MFASetupProps {
  onComplete: () => void;
  onCancel: () => void;
}

type Step = 'intro' | 'qr' | 'verify' | 'backup' | 'done';

export function MFASetup({ onComplete, onCancel }: MFASetupProps) {
  const [step, setStep] = useState<Step>('intro');
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);

  const startSetup = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/mfa/setup', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setQrCode(data.qrCode);
      setSecret(data.secret);
      setBackupCodes(data.backupCodes);
      setStep('qr');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Setup failed');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (code.length < 6) {
      setError('Enter a 6-digit code');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setup', code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStep('backup');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: 'secret' | 'codes') => {
    await navigator.clipboard.writeText(text);
    if (type === 'secret') setCopiedSecret(true);
    else setCopiedCodes(true);
    setTimeout(() => {
      if (type === 'secret') setCopiedSecret(false);
      else setCopiedCodes(false);
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <Shield className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Two-Factor Authentication
          </h2>
          <p className="text-sm text-gray-500">
            {step === 'intro' && 'Add an extra layer of security'}
            {step === 'qr' && 'Scan with your authenticator app'}
            {step === 'verify' && 'Enter verification code'}
            {step === 'backup' && 'Save your backup codes'}
            {step === 'done' && 'Setup complete!'}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Step: Intro */}
      {step === 'intro' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Two-factor authentication adds an extra layer of security to your
            account. You&#39;ll need an authenticator app like Google Authenticator,
            Authy, or 1Password.
          </p>
          <div className="flex gap-3">
            <button
              onClick={startSetup}
              disabled={loading}
              className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Get Started
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Step: QR Code */}
      {step === 'qr' && (
        <div className="space-y-4">
          <div className="flex justify-center">
            <img
              src={qrCode}
              alt="QR Code for authenticator app"
              className="w-48 h-48 border rounded-lg"
            />
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">
              Can&#39;t scan? Enter this key manually:
            </p>
            <div className="flex items-center gap-2">
              <code className="text-xs font-mono bg-white px-2 py-1 rounded border flex-1 break-all">
                {secret}
              </code>
              <button
                onClick={() => copyToClipboard(secret, 'secret')}
                className="p-1.5 text-gray-400 hover:text-gray-600"
              >
                {copiedSecret ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            onClick={() => setStep('verify')}
            className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700"
          >
            I&#39;ve Scanned the Code
          </button>
        </div>
      )}

      {/* Step: Verify */}
      {step === 'verify' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Enter the 6-digit code from your authenticator app to complete setup.
          </p>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="000000"
            className="w-full text-center text-2xl tracking-widest font-mono py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            autoFocus
          />
          <button
            onClick={verifyCode}
            disabled={loading || code.length < 6}
            className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Verify & Enable
          </button>
        </div>
      )}

      {/* Step: Backup Codes */}
      {step === 'backup' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
            <p className="text-sm text-amber-800 font-medium">
              Save these backup codes in a safe place
            </p>
            <p className="text-xs text-amber-600 mt-1">
              If you lose access to your authenticator app, you can use these
              codes to sign in. Each code can only be used once.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg font-mono text-sm">
            {backupCodes.map((c, i) => (
              <div key={i} className="text-center py-1">
                {c}
              </div>
            ))}
          </div>

          <button
            onClick={() => copyToClipboard(backupCodes.join('\n'), 'codes')}
            className="w-full flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
          >
            {copiedCodes ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy All Codes
              </>
            )}
          </button>

          <button
            onClick={() => {
              setStep('done');
              onComplete();
            }}
            className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700"
          >
            I&#39;ve Saved My Codes
          </button>
        </div>
      )}

      {/* Step: Done */}
      {step === 'done' && (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>
          <p className="text-gray-700">
            Two-factor authentication is now enabled. You&#39;ll be asked for a code
            each time you sign in.
          </p>
        </div>
      )}
    </div>
  );
}
```

---

## SECTION 63 — CONTENT MODERATION & AUTO-REVIEW

### File 63-1: `src/types/moderation.ts`

```typescript
// src/types/moderation.ts
// Content moderation types

export type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'flagged' | 'auto_approved';
export type ModerationAction = 'approve' | 'reject' | 'flag' | 'escalate' | 'delete';
export type ContentType = 'comment' | 'bio' | 'project_description' | 'event_description' | 'message' | 'review' | 'image' | 'report';
export type FlagReason = 'spam' | 'harassment' | 'hate_speech' | 'violence' | 'sexual_content' | 'misinformation' | 'copyright' | 'other';

export interface ModerationItem {
  id: string;
  contentType: ContentType;
  contentId: string;
  content: string;
  authorId: string;
  authorName: string;
  status: ModerationStatus;
  autoScore?: ModerationScore;
  flags: ContentFlag[];
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNote?: string;
  action?: ModerationAction;
  createdAt: string;
  updatedAt: string;
}

export interface ModerationScore {
  overall: number; // 0-1, higher = more likely problematic
  categories: {
    spam: number;
    toxicity: number;
    profanity: number;
    harassment: number;
    hate_speech: number;
    sexual_content: number;
    violence: number;
    self_harm: number;
  };
  language: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  autoDecision: 'approve' | 'reject' | 'review';
  confidence: number;
}

export interface ContentFlag {
  id: string;
  reporterId: string;
  reporterName: string;
  reason: FlagReason;
  details?: string;
  createdAt: string;
}

export interface ModerationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  type: 'keyword' | 'regex' | 'score_threshold' | 'flag_count' | 'user_trust';
  config: Record<string, unknown>;
  action: ModerationAction;
  priority: number;
  createdAt: string;
}

export interface ModerationStats {
  pending: number;
  approved: number;
  rejected: number;
  flagged: number;
  autoApproved: number;
  totalToday: number;
  averageReviewTime: number;
  topReasons: { reason: string; count: number }[];
}

export interface UserTrustScore {
  userId: string;
  score: number; // 0-100
  level: 'new' | 'basic' | 'trusted' | 'verified';
  totalContent: number;
  approvedContent: number;
  rejectedContent: number;
  flagCount: number;
  lastUpdated: string;
}
```

### File 63-2: `src/lib/moderation/moderation-service.ts`

```typescript
// src/lib/moderation/moderation-service.ts
// Content moderation engine with auto-review

import type {
  ModerationItem,
  ModerationScore,
  ModerationAction,
  ContentType,
  FlagReason,
  UserTrustScore,
} from '@/types/moderation';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

// Banned words/patterns (basic list, extend as needed)
const BLOCKED_PATTERNS = [
  /\b(scam|phishing|free money|click here to win)\b/i,
  /https?:\/\/[^\s]+\.(tk|ml|ga|cf)\b/i, // Suspicious TLDs
  /(buy now|limited offer|act fast|congratulations you won)/i,
];

const PROFANITY_LIST = new Set([
  // Add your profanity list here — keeping it minimal for the codebase
  'placeholder_bad_word',
]);

// Score thresholds
const AUTO_APPROVE_THRESHOLD = 0.15;
const AUTO_REJECT_THRESHOLD = 0.85;
const FLAG_REVIEW_THRESHOLD = 0.5;

export class ModerationService {
  /**
   * Submit content for moderation
   */
  static async submitForReview(params: {
    contentType: ContentType;
    contentId: string;
    content: string;
    authorId: string;
    authorName: string;
  }): Promise<ModerationItem> {
    // Run auto-scoring
    const autoScore = await this.analyzeContent(params.content);

    // Get user trust score
    const trustScore = await this.getUserTrustScore(params.authorId);

    // Determine auto-decision
    let status: ModerationItem['status'] = 'pending';
    let action: ModerationAction | undefined;

    if (autoScore.overall <= AUTO_APPROVE_THRESHOLD && trustScore.level !== 'new') {
      status = 'auto_approved';
      action = 'approve';
    } else if (autoScore.overall >= AUTO_REJECT_THRESHOLD) {
      status = 'rejected';
      action = 'reject';
    } else if (autoScore.overall >= FLAG_REVIEW_THRESHOLD) {
      status = 'flagged';
    }

    const item: Omit<ModerationItem, 'id'> = {
      contentType: params.contentType,
      contentId: params.contentId,
      content: params.content,
      authorId: params.authorId,
      authorName: params.authorName,
      status,
      autoScore,
      flags: [],
      action,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const ref = await adminDb.collection('moderation_queue').add(item);

    // Update trust score stats
    if (status === 'auto_approved') {
      await this.updateTrustScore(params.authorId, 'approved');
    } else if (status === 'rejected') {
      await this.updateTrustScore(params.authorId, 'rejected');
    }

    return { id: ref.id, ...item };
  }

  /**
   * Review a moderation item (admin action)
   */
  static async review(
    itemId: string,
    action: ModerationAction,
    reviewerId: string,
    note?: string
  ): Promise<void> {
    const ref = adminDb.collection('moderation_queue').doc(itemId);
    const doc = await ref.get();
    if (!doc.exists) throw new Error('Moderation item not found');

    const item = doc.data() as ModerationItem;

    const statusMap: Record<ModerationAction, ModerationItem['status']> = {
      approve: 'approved',
      reject: 'rejected',
      flag: 'flagged',
      escalate: 'flagged',
      delete: 'rejected',
    };

    await ref.update({
      status: statusMap[action],
      action,
      reviewedBy: reviewerId,
      reviewedAt: new Date().toISOString(),
      reviewNote: note || null,
      updatedAt: new Date().toISOString(),
    });

    // Update user trust score
    if (action === 'approve') {
      await this.updateTrustScore(item.authorId, 'approved');
    } else if (action === 'reject' || action === 'delete') {
      await this.updateTrustScore(item.authorId, 'rejected');
    }

    // If content is approved, update the original content status
    if (action === 'approve') {
      await this.publishContent(item.contentType, item.contentId);
    } else if (action === 'reject' || action === 'delete') {
      await this.hideContent(item.contentType, item.contentId);
    }
  }

  /**
   * Flag content by a user
   */
  static async flagContent(
    itemId: string,
    reporterId: string,
    reporterName: string,
    reason: FlagReason,
    details?: string
  ): Promise<void> {
    const ref = adminDb.collection('moderation_queue').doc(itemId);

    await ref.update({
      flags: FieldValue.arrayUnion({
        id: `flag_${Date.now()}`,
        reporterId,
        reporterName,
        reason,
        details: details || null,
        createdAt: new Date().toISOString(),
      }),
      status: 'flagged',
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Analyze content for moderation scoring
   */
  static async analyzeContent(content: string): Promise<ModerationScore> {
    const text = content.toLowerCase().trim();
    const scores = {
      spam: 0,
      toxicity: 0,
      profanity: 0,
      harassment: 0,
      hate_speech: 0,
      sexual_content: 0,
      violence: 0,
      self_harm: 0,
    };

    // Pattern matching for spam
    for (const pattern of BLOCKED_PATTERNS) {
      if (pattern.test(text)) {
        scores.spam = Math.min(scores.spam + 0.4, 1);
      }
    }

    // URL density check (high URL count = likely spam)
    const urlCount = (text.match(/https?:\/\//g) || []).length;
    if (urlCount > 3) scores.spam = Math.min(scores.spam + 0.3, 1);

    // Profanity check
    const words = text.split(/\s+/);
    const profanityCount = words.filter((w) =>
      PROFANITY_LIST.has(w.replace(/[^a-z]/g, ''))
    ).length;
    if (profanityCount > 0) {
      scores.profanity = Math.min(profanityCount * 0.2, 1);
    }

    // All caps detection (shouting)
    const upperRatio =
      content.replace(/[^A-Za-z]/g, '').length > 0
        ? (content.match(/[A-Z]/g) || []).length /
          content.replace(/[^A-Za-z]/g, '').length
        : 0;
    if (upperRatio > 0.7 && content.length > 20) {
      scores.toxicity = Math.min(scores.toxicity + 0.2, 1);
    }

    // Repetition detection
    const uniqueWords = new Set(words);
    if (words.length > 5 && uniqueWords.size / words.length < 0.3) {
      scores.spam = Math.min(scores.spam + 0.3, 1);
    }

    // Calculate overall score
    const overall =
      Object.values(scores).reduce((a, b) => a + b, 0) /
      Object.keys(scores).length;

    // Determine auto-decision
    let autoDecision: 'approve' | 'reject' | 'review' = 'review';
    if (overall <= AUTO_APPROVE_THRESHOLD) autoDecision = 'approve';
    else if (overall >= AUTO_REJECT_THRESHOLD) autoDecision = 'reject';

    // Simple sentiment
    const positiveWords = ['thank', 'great', 'amazing', 'love', 'wonderful', 'excellent'];
    const negativeWords = ['hate', 'terrible', 'awful', 'worst', 'disgusting'];
    const posCount = words.filter((w) => positiveWords.includes(w)).length;
    const negCount = words.filter((w) => negativeWords.includes(w)).length;
    const sentiment =
      posCount > negCount ? 'positive' : negCount > posCount ? 'negative' : 'neutral';

    return {
      overall: Math.min(overall, 1),
      categories: scores,
      language: 'en',
      sentiment,
      autoDecision,
      confidence: overall > 0.7 || overall < 0.3 ? 0.9 : 0.6,
    };
  }

  /**
   * Get user trust score
   */
  static async getUserTrustScore(userId: string): Promise<UserTrustScore> {
    const doc = await adminDb.collection('user_trust_scores').doc(userId).get();

    if (doc.exists) {
      return doc.data() as UserTrustScore;
    }

    // Default for new users
    return {
      userId,
      score: 50,
      level: 'new',
      totalContent: 0,
      approvedContent: 0,
      rejectedContent: 0,
      flagCount: 0,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Update user trust score based on moderation outcome
   */
  private static async updateTrustScore(
    userId: string,
    outcome: 'approved' | 'rejected'
  ): Promise<void> {
    const ref = adminDb.collection('user_trust_scores').doc(userId);
    const doc = await ref.get();

    let score: UserTrustScore;
    if (doc.exists) {
      score = doc.data() as UserTrustScore;
    } else {
      score = {
        userId,
        score: 50,
        level: 'new',
        totalContent: 0,
        approvedContent: 0,
        rejectedContent: 0,
        flagCount: 0,
        lastUpdated: new Date().toISOString(),
      };
    }

    score.totalContent++;
    if (outcome === 'approved') {
      score.approvedContent++;
      score.score = Math.min(100, score.score + 2);
    } else {
      score.rejectedContent++;
      score.score = Math.max(0, score.score - 10);
    }

    // Determine trust level
    if (score.score >= 80 && score.approvedContent >= 20) {
      score.level = 'verified';
    } else if (score.score >= 60 && score.approvedContent >= 5) {
      score.level = 'trusted';
    } else if (score.score >= 30) {
      score.level = 'basic';
    } else {
      score.level = 'new';
    }

    score.lastUpdated = new Date().toISOString();
    await ref.set(score);
  }

  private static async publishContent(
    contentType: ContentType,
    contentId: string
  ): Promise<void> {
    const collectionMap: Record<ContentType, string> = {
      comment: 'comments',
      bio: 'users',
      project_description: 'projects',
      event_description: 'events',
      message: 'messages',
      review: 'reviews',
      image: 'media',
      report: 'reports',
    };

    const col = collectionMap[contentType];
    if (!col) return;

    try {
      await adminDb.collection(col).doc(contentId).update({
        moderationStatus: 'approved',
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`Failed to publish ${contentType} ${contentId}:`, error);
    }
  }

  private static async hideContent(
    contentType: ContentType,
    contentId: string
  ): Promise<void> {
    const collectionMap: Record<ContentType, string> = {
      comment: 'comments',
      bio: 'users',
      project_description: 'projects',
      event_description: 'events',
      message: 'messages',
      review: 'reviews',
      image: 'media',
      report: 'reports',
    };

    const col = collectionMap[contentType];
    if (!col) return;

    try {
      await adminDb.collection(col).doc(contentId).update({
        moderationStatus: 'rejected',
        visible: false,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`Failed to hide ${contentType} ${contentId}:`, error);
    }
  }
}
```

### File 63-3: `src/app/api/moderation/flag/route.ts`

```typescript
// src/app/api/moderation/flag/route.ts
// User-facing content flagging endpoint

import { NextRequest, NextResponse } from 'next/server';
import { ModerationService } from '@/lib/moderation/moderation-service';
import { verifyAuth } from '@/lib/auth/verify';
import { adminDb } from '@/lib/firebase/admin';
import type { FlagReason } from '@/types/moderation';

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { contentType, contentId, reason, details } = body;

    if (!contentType || !contentId || !reason) {
      return NextResponse.json(
        { error: 'contentType, contentId, and reason are required' },
        { status: 400 }
      );
    }

    const validReasons: FlagReason[] = [
      'spam', 'harassment', 'hate_speech', 'violence',
      'sexual_content', 'misinformation', 'copyright', 'other',
    ];
    if (!validReasons.includes(reason)) {
      return NextResponse.json(
        { error: `Invalid reason. Must be one of: ${validReasons.join(', ')}` },
        { status: 400 }
      );
    }

    // Find or create moderation item
    const existing = await adminDb
      .collection('moderation_queue')
      .where('contentType', '==', contentType)
      .where('contentId', '==', contentId)
      .limit(1)
      .get();

    let itemId: string;

    if (!existing.empty) {
      itemId = existing.docs[0].id;
    } else {
      // Create new moderation item for this content
      const item = await ModerationService.submitForReview({
        contentType,
        contentId,
        content: `[Flagged content - ${contentType}:${contentId}]`,
        authorId: 'unknown',
        authorName: 'Unknown',
      });
      itemId = item.id;
    }

    await ModerationService.flagContent(
      itemId,
      user.uid,
      user.displayName || 'Anonymous',
      reason,
      details
    );

    return NextResponse.json({
      success: true,
      message: 'Content has been flagged for review. Thank you for helping keep our community safe.',
    });
  } catch (error) {
    console.error('POST /api/moderation/flag error:', error);
    return NextResponse.json({ error: 'Failed to flag content' }, { status: 500 });
  }
}
```

### File 63-4: `src/app/api/admin/moderation/route.ts`

```typescript
// src/app/api/admin/moderation/route.ts
// Admin moderation queue management

import { NextRequest, NextResponse } from 'next/server';
import { ModerationService } from '@/lib/moderation/moderation-service';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAuth } from '@/lib/auth/verify';
import type { ModerationAction } from '@/types/moderation';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || !['admin', 'super_admin', 'moderator'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);

    const snap = await adminDb
      .collection('moderation_queue')
      .where('status', '==', status)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Get stats
    const pendingSnap = await adminDb
      .collection('moderation_queue')
      .where('status', '==', 'pending')
      .count()
      .get();

    const flaggedSnap = await adminDb
      .collection('moderation_queue')
      .where('status', '==', 'flagged')
      .count()
      .get();

    return NextResponse.json({
      items,
      stats: {
        pending: pendingSnap.data().count,
        flagged: flaggedSnap.data().count,
      },
    });
  } catch (error) {
    console.error('GET /api/admin/moderation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || !['admin', 'super_admin', 'moderator'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { itemId, action, note } = body;

    if (!itemId || !action) {
      return NextResponse.json(
        { error: 'itemId and action are required' },
        { status: 400 }
      );
    }

    const validActions: ModerationAction[] = [
      'approve', 'reject', 'flag', 'escalate', 'delete',
    ];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: `Invalid action. Must be: ${validActions.join(', ')}` },
        { status: 400 }
      );
    }

    await ModerationService.review(itemId, action, user.uid, note);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST /api/admin/moderation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

---

### PART 12 SUMMARY

| Section | Title | Files | Lines (approx) |
|---------|-------|-------|-----------------|
| 59 | SEO & Meta Management | 7 | ~750 |
| 60 | A/B Testing & Feature Flags | 7 | ~950 |
| 61 | Data Export & Reporting Engine | 5 | ~650 |
| 62 | Two-Factor Authentication | 6 | ~750 |
| 63 | Content Moderation & Auto-Review | 4 | ~550 |
| **TOTAL** | | **29 files** | **~3,650 lines** |

---

*End of Part 12 — Sections 59–63*
*Continues in Part 13 — Sections 64–68*
