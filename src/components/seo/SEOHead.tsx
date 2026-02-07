// src/components/seo/SEOHead.tsx
// Reusable SEO head component for React pages

import { Helmet } from "react-helmet";
import type { SEOConfig, StructuredData } from "@/types/seo";
import {
  DEFAULT_SEO,
  buildPageTitle,
  buildCanonicalUrl,
} from "@/lib/seo/config";

interface SEOHeadProps {
  config: Partial<SEOConfig> & { title: string; description: string };
  path?: string;
}

/**
 * SEO Head component that injects meta tags
 */
export function SEOHead({ config, path }: SEOHeadProps) {
  const title = config.titleTemplate
    ? buildPageTitle(config.title, config.titleTemplate)
    : buildPageTitle(config.title);

  const description = config.description || DEFAULT_SEO.description;
  const canonical =
    config.canonical || (path ? buildCanonicalUrl(path) : undefined);
  const og = { ...DEFAULT_SEO.openGraph, ...config.openGraph };
  const tw = { ...DEFAULT_SEO.twitter, ...config.twitter };

  const robotsContent = [
    config.noindex ? "noindex" : "index",
    config.nofollow ? "nofollow" : "follow",
  ].join(",");

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robotsContent} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={og.title} />
      <meta property="og:description" content={og.description} />
      <meta property="og:type" content={og.type} />
      <meta property="og:url" content={og.url} />
      <meta property="og:image" content={og.image} />
      {og.imageAlt && <meta property="og:image:alt" content={og.imageAlt} />}
      {og.imageWidth && (
        <meta property="og:image:width" content={String(og.imageWidth)} />
      )}
      {og.imageHeight && (
        <meta property="og:image:height" content={String(og.imageHeight)} />
      )}
      <meta property="og:site_name" content={og.siteName} />
      <meta property="og:locale" content={og.locale} />
      {og.localeAlternate?.map((locale) => (
        <meta key={locale} property="og:locale:alternate" content={locale} />
      ))}

      {/* Twitter Card */}
      <meta name="twitter:card" content={tw.card} />
      <meta name="twitter:site" content={tw.site} />
      {tw.creator && <meta name="twitter:creator" content={tw.creator} />}
      <meta name="twitter:title" content={tw.title} />
      <meta name="twitter:description" content={tw.description} />
      <meta name="twitter:image" content={tw.image} />
      {tw.imageAlt && <meta name="twitter:image:alt" content={tw.imageAlt} />}

      {/* Alternate Languages */}
      {config.alternateLanguages?.map((lang) => (
        <link
          key={lang.hrefLang}
          rel="alternate"
          hrefLang={lang.hrefLang}
          href={lang.href}
        />
      ))}

      {/* Additional Meta Tags */}
      {config.additionalMeta?.map((meta, index) => {
        if (meta.property) {
          return (
            <meta
              key={`meta-${index}`}
              property={meta.property}
              content={meta.content}
            />
          );
        }
        return (
          <meta key={`meta-${index}`} name={meta.name} content={meta.content} />
        );
      })}

      {/* Structured Data */}
      {config.structuredData?.map((data, index) => (
        <script
          key={`jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </Helmet>
  );
}

/**
 * JSON-LD structured data component
 */
export function JsonLd({ data }: { data: StructuredData | StructuredData[] }) {
  const items = Array.isArray(data) ? data : [data];

  return (
    <Helmet>
      {items.map((item, index) => (
        <script
          key={`jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </Helmet>
  );
}

/**
 * Breadcrumb component with schema
 */
interface BreadcrumbsProps {
  items: { name: string; href: string }[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const siteUrl = import.meta.env.VITE_SITE_URL || "https://gratis.ngo";
  const schemaItems = items.map((item, index) => ({
    "@type": "ListItem" as const,
    position: index + 1,
    name: item.name,
    item: item.href.startsWith("http") ? item.href : `${siteUrl}${item.href}`,
  }));

  return (
    <>
      <Helmet>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: schemaItems,
            }),
          }}
        />
      </Helmet>
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
