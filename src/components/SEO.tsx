import { useEffect } from "react";
import { useTranslation } from "react-i18next";

type SEOProps = {
  title: string;
  description?: string;
  canonical?: string;
  image?: string;
};

export const SEO = ({ title, description, canonical, image }: SEOProps) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.title = title;
    document.documentElement.lang = i18n.language;

    const ensureMeta = (name: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    if (description) {
      ensureMeta("description", description);
      // Open Graph / Twitter mirrors
      const ogDesc = document.querySelector(
        'meta[property="og:description"]',
      ) as HTMLMetaElement | null;
      if (ogDesc) ogDesc.setAttribute("content", description);
    }

    const ogTitle = document.querySelector(
      'meta[property="og:title"]',
    ) as HTMLMetaElement | null;
    if (ogTitle) ogTitle.setAttribute("content", title);

    if (image) {
      const ogImage = document.querySelector(
        'meta[property="og:image"]',
      ) as HTMLMetaElement | null;
      if (ogImage) ogImage.setAttribute("content", image);

      const twitterImage = document.querySelector(
        'meta[name="twitter:image"]',
      ) as HTMLMetaElement | null;
      if (twitterImage) twitterImage.setAttribute("content", image);
    }

    if (canonical) {
      let link = document.querySelector<HTMLLinkElement>(
        'link[rel="canonical"]',
      );
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
    }
  }, [title, description, canonical, image, i18n.language]);

  return null;
};

export default SEO;
