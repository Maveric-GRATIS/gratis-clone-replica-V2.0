// src/lib/seo/sitemap-data.ts
// Sitemap data and generation for GRATIS.NGO

import type { SitemapEntry } from '@/types/seo';

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://gratis.ngo';

// Static pages configuration
export const STATIC_PAGES: SitemapEntry[] = [
  { loc: '/', priority: 1.0, changefreq: 'daily', lastmod: new Date().toISOString() },
  { loc: '/donate', priority: 0.9, changefreq: 'daily' },
  { loc: '/projects', priority: 0.9, changefreq: 'daily' },
  { loc: '/events', priority: 0.8, changefreq: 'daily' },
  { loc: '/tribe', priority: 0.8, changefreq: 'weekly' },
  { loc: '/partners', priority: 0.7, changefreq: 'weekly' },
  { loc: '/about', priority: 0.7, changefreq: 'monthly' },
  { loc: '/blog', priority: 0.8, changefreq: 'daily' },
  { loc: '/leaderboard', priority: 0.6, changefreq: 'daily' },
  { loc: '/faq', priority: 0.5, changefreq: 'monthly' },
  { loc: '/contact', priority: 0.5, changefreq: 'monthly' },
  { loc: '/privacy', priority: 0.3, changefreq: 'yearly' },
  { loc: '/terms', priority: 0.3, changefreq: 'yearly' },
];

/**
 * Generate sitemap XML from entries
 */
export function generateSitemapXML(entries: SitemapEntry[]): string {
  const urlEntries = entries.map((entry) => {
    const loc = entry.loc.startsWith('http') ? entry.loc : `${SITE_URL}${entry.loc}`;

    let xml = `  <url>\n    <loc>${loc}</loc>\n`;

    if (entry.lastmod) {
      xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
    }
    if (entry.changefreq) {
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    }
    if (entry.priority !== undefined) {
      xml += `    <priority>${entry.priority}</priority>\n`;
    }

    if (entry.alternates) {
      for (const alt of entry.alternates) {
        xml += `    <xhtml:link rel="alternate" hreflang="${alt.hrefLang}" href="${alt.href}" />\n`;
      }
    }

    xml += `  </url>`;
    return xml;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries}
</urlset>`;
}

/**
 * Fetch dynamic sitemap entries from Firestore
 */
export async function fetchDynamicSitemapEntries(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];

  try {
    // This would be called from a server-side function or build script
    // For now, return empty array as this is client-side
    // In production, you'd call a Firebase function or API endpoint
    return entries;
  } catch (error) {
    console.error('Failed to fetch dynamic sitemap entries:', error);
    return [];
  }
}

/**
 * Get all sitemap entries (static + dynamic)
 */
export async function getAllSitemapEntries(): Promise<SitemapEntry[]> {
  const dynamicEntries = await fetchDynamicSitemapEntries();
  return [...STATIC_PAGES, ...dynamicEntries];
}
