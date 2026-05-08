import { useEffect } from 'react';

const SITE_URL = 'https://mercybridge.find-true-north.net';
const SITE_NAME = 'MercyBridge';
const DEFAULT_IMAGE = '/icons/icon-512.png';

interface SEOProps {
  title: string;
  description?: string;
  canonical?: string;
  type?: 'website' | 'article';
  image?: string;
  publishedTime?: string;
  author?: string;
  tags?: string[];
  noindex?: boolean;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
}

function resolveUrl(value?: string): string {
  if (!value) {
    return `${SITE_URL}/`;
  }

  if (value.startsWith('http')) {
    return value;
  }

  return new URL(value, `${SITE_URL}/`).toString();
}

export function SEO({ 
  title, 
  description, 
  canonical, 
  type = 'website',
  image,
  publishedTime,
  author,
  tags,
  noindex = false,
  structuredData,
}: SEOProps) {
  useEffect(() => {
    const canonicalUrl = resolveUrl(canonical || window.location.pathname);
    const imageUrl = resolveUrl(image || DEFAULT_IMAGE);
    
    // Title
    document.title = title;

    // Helper function to set or create meta tags
    const setMeta = (selector: string, content: string, property?: string) => {
      let meta = document.querySelector(selector) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', property);
        } else {
          meta.setAttribute('name', selector.replace('meta[name="', '').replace('"]', ''));
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Basic meta description
    if (description) {
      setMeta('meta[name="description"]', description);
    }

    setMeta('meta[name="robots"]', noindex ? 'noindex, nofollow' : 'index, follow');

    // Canonical URL
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalUrl);

    // Open Graph tags
    setMeta('meta[property="og:title"]', title, 'og:title');
    setMeta('meta[property="og:type"]', type, 'og:type');
    setMeta('meta[property="og:url"]', canonicalUrl, 'og:url');
    setMeta('meta[property="og:site_name"]', SITE_NAME, 'og:site_name');
    
    if (description) {
      setMeta('meta[property="og:description"]', description, 'og:description');
    }
    
    setMeta('meta[property="og:image"]', imageUrl, 'og:image');

    // Twitter Card tags
    setMeta('meta[name="twitter:card"]', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', title);
    if (description) {
      setMeta('meta[name="twitter:description"]', description);
    }
    setMeta('meta[name="twitter:image"]', imageUrl);

    // Article-specific meta tags
    document.querySelectorAll('meta[property="article:tag"]').forEach(el => el.remove());
    document.querySelector('meta[property="article:published_time"]')?.remove();
    document.querySelector('meta[property="article:author"]')?.remove();

    if (type === 'article') {
      if (publishedTime) {
        setMeta('meta[property="article:published_time"]', publishedTime, 'article:published_time');
      }
      if (author) {
        setMeta('meta[property="article:author"]', author, 'article:author');
      }
      tags?.forEach((tag) => {
        const existingTag = document.querySelector(`meta[property="article:tag"][content="${tag}"]`);
        if (!existingTag) {
          const meta = document.createElement('meta');
          meta.setAttribute('property', 'article:tag');
          meta.setAttribute('content', tag);
          document.head.appendChild(meta);
        }
      });
    }

    document.getElementById('truenorth-static-structured-data')?.remove();
    document.querySelectorAll('script[data-seo-structured-data="true"]').forEach(el => el.remove());
    if (structuredData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.seoStructuredData = 'true';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    // Cleanup function to remove article tags when component unmounts or changes
    return () => {
      if (type === 'article') {
        document.querySelectorAll('meta[property="article:tag"]').forEach(el => el.remove());
        document.querySelector('meta[property="article:published_time"]')?.remove();
        document.querySelector('meta[property="article:author"]')?.remove();
      }
      document.querySelectorAll('script[data-seo-structured-data="true"]').forEach(el => el.remove());
    };
  }, [title, description, canonical, type, image, publishedTime, author, tags, noindex, structuredData]);

  return null;
}
