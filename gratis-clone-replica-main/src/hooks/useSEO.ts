import { useEffect } from 'react';
import { SEOData, updateMetaTags, generateSEO } from '@/lib/seo';

export const useSEO = (seoData: Partial<SEOData>) => {
  useEffect(() => {
    const seo = generateSEO(seoData);
    updateMetaTags(seo);
  }, [seoData]);
};