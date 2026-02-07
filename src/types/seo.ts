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
