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
