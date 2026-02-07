// src/lib/seo/config.ts
// Global SEO configuration and defaults

import type { SEOConfig, OpenGraphMeta, TwitterMeta } from '@/types/seo';

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://gratis.ngo';
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
