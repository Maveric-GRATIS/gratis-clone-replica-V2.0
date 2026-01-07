export interface SEOData {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  keywords?: string[];
}

export const defaultSEO: SEOData = {
  title: "GRATIS - Premium Streetwear & Water",
  description: "GRATIS brings you premium water and authentic streetwear inspired by street culture. Discover our collections of water, beverages, and lifestyle products.",
  keywords: ["streetwear", "premium water", "lifestyle", "gratis", "street culture", "fashion"]
};

export const generateSEO = (page: Partial<SEOData>): SEOData => ({
  ...defaultSEO,
  ...page,
  title: page.title ? `${page.title} | GRATIS` : defaultSEO.title
});

export const updateMetaTags = (seo: SEOData) => {
  // Update title
  document.title = seo.title;

  // Update or create meta tags
  const updateMeta = (name: string, content: string) => {
    let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    if (!element) {
      element = document.createElement('meta');
      element.name = name;
      document.head.appendChild(element);
    }
    element.content = content;
  };

  const updateProperty = (property: string, content: string) => {
    let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute('property', property);
      document.head.appendChild(element);
    }
    element.content = content;
  };

  // Standard meta tags
  updateMeta('description', seo.description);
  if (seo.keywords) {
    updateMeta('keywords', seo.keywords.join(', '));
  }

  // Open Graph tags
  updateProperty('og:title', seo.title);
  updateProperty('og:description', seo.description);
  updateProperty('og:type', 'website');
  
  if (seo.ogImage) {
    updateProperty('og:image', seo.ogImage);
  }

  // Twitter tags
  updateMeta('twitter:card', 'summary_large_image');
  updateMeta('twitter:title', seo.title);
  updateMeta('twitter:description', seo.description);

  // Canonical URL
  if (seo.canonical) {
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = seo.canonical;
  }
};