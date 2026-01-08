// Dynamic sitemap generation for all routes
interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

class SitemapGenerator {
  private baseUrl = '';
  private routes: SitemapUrl[] = [];

  constructor(baseUrl: string = 'https://gratis.com') {
    this.baseUrl = baseUrl;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    const now = new Date().toISOString();
    
    // Static routes with priorities
    const staticRoutes = [
      { path: '/', priority: 1.0, changefreq: 'daily' as const },
      { path: '/rig-store', priority: 0.9, changefreq: 'daily' as const },
      { path: '/water', priority: 0.8, changefreq: 'weekly' as const },
      { path: '/theurgy', priority: 0.7, changefreq: 'weekly' as const },
      { path: '/fu', priority: 0.7, changefreq: 'weekly' as const },
      { path: '/arcane', priority: 0.7, changefreq: 'weekly' as const },
      { path: '/tribe', priority: 0.8, changefreq: 'monthly' as const },
      { path: '/tribe/heritage', priority: 0.6, changefreq: 'monthly' as const },
      { path: '/tribe/ethics', priority: 0.6, changefreq: 'monthly' as const },
      { path: '/tribe/team', priority: 0.6, changefreq: 'monthly' as const },
      { path: '/tribe/standards', priority: 0.6, changefreq: 'monthly' as const },
      { path: '/tribe/responsibility', priority: 0.6, changefreq: 'monthly' as const },
      { path: '/impact-tv', priority: 0.7, changefreq: 'weekly' as const },
      { path: '/spark', priority: 0.7, changefreq: 'weekly' as const },
      { path: '/auth', priority: 0.3, changefreq: 'yearly' as const },
    ];

    this.routes = staticRoutes.map(route => ({
      loc: `${this.baseUrl}${route.path}`,
      lastmod: now,
      changefreq: route.changefreq,
      priority: route.priority,
    }));
  }

  addDynamicRoutes(products: any[] = [], categories: string[] = []) {
    const now = new Date().toISOString();

    // Add product pages
    products.forEach(product => {
      this.routes.push({
        loc: `${this.baseUrl}/product/${product.id}`,
        lastmod: product.updated_at || now,
        changefreq: 'weekly',
        priority: 0.6,
      });
    });

    // Add category pages
    categories.forEach(category => {
      this.routes.push({
        loc: `${this.baseUrl}/category/${category}`,
        lastmod: now,
        changefreq: 'daily',
        priority: 0.7,
      });
    });
  }

  generateXML(): string {
    const urls = this.routes
      .map(url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`)
      .join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  }

  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

Sitemap: ${this.baseUrl}/sitemap.xml

# GRATIS - Drink with Purpose
# High-quality tetrapack beverages
# Sustainable hydration solutions`;
  }

  downloadSitemap() {
    if (typeof window === 'undefined') return;
    
    const xml = this.generateXML();
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  getRoutes(): SitemapUrl[] {
    return this.routes;
  }
}

export const sitemapGenerator = new SitemapGenerator();
export type { SitemapUrl };