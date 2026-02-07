// src/lib/seo/structured-data.ts
// Schema.org structured data generators for different page types

import type { StructuredData, BreadcrumbItem } from '@/types/seo';

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://gratis.ngo';

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
