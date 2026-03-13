import { SEO } from "@/components/SEO";
import { PageHero } from "@/components/PageHero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Download, Globe, MessageSquare, FileText, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const ASSET_ICONS: Record<string, typeof FileText> = {
  'media-kit': FileText,
  'brand-guidelines': FileText,
  'logos': Download,
  'photos': Download,
  'fact-sheet': FileText,
  'other': FileText,
};

export default function Press() {
  const [releases, setReleases] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [relRes, assetRes] = await Promise.all([
        (supabase as any).from('press_releases').select('*').eq('published', true).order('published_date', { ascending: false }).limit(12),
        (supabase as any).from('press_assets').select('*').eq('published', true).order('sort_order', { ascending: true }),
      ]);
      setReleases(relRes.data || []);
      setAssets(assetRes.data || []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <>
      <SEO
        title="Press & Media | GRATIS"
        description="GRATIS press releases, media assets, and contact information for journalists and media professionals."
      />

      <PageHero
        title="Press & Media"
        subtitle="News, resources, and contact information for media professionals"
      />

      <div className="container py-16 space-y-20">
        <section className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">Media Contact</h2>
          <p className="text-muted-foreground text-lg">
            For press inquiries, interview requests, and media partnerships, reach out to our communications team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2" asChild>
              <a href="mailto:press@gratis.com">
                <Mail className="h-4 w-4" />
                press@gratis.com
              </a>
            </Button>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <a href="/contact">
                <MessageSquare className="h-4 w-4" />
                General Inquiries
              </a>
            </Button>
          </div>
        </section>

        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Latest Press Releases</h2>
            <p className="text-muted-foreground">Stay up to date with GRATIS news and announcements.</p>
          </div>
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : releases.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No press releases published yet.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {releases.map((pr) => (
                <Card key={pr.id} className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-[hsl(var(--brand-pink))]/40 transition-colors">
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit text-xs">
                      {new Date(pr.published_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </Badge>
                    <CardTitle className="text-lg leading-snug mt-2">{pr.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{pr.excerpt}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Media Kit</h2>
            <p className="text-muted-foreground">Download brand assets and resources for your coverage.</p>
          </div>
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : assets.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Media kit coming soon.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
              {assets.map((asset) => {
                const Icon = ASSET_ICONS[asset.asset_category] || FileText;
                return (
                  <a key={asset.id} href={asset.file_url} target="_blank" rel="noopener noreferrer" className="block">
                    <Card className="border-border/50 bg-card/50 hover:border-[hsl(var(--brand-yellow))]/40 transition-colors cursor-pointer group h-full">
                      <CardContent className="flex items-center gap-3 p-5">
                        <Icon className="h-5 w-5 text-[hsl(var(--brand-yellow))] shrink-0 group-hover:scale-110 transition-transform" />
                        <div>
                          <span className="text-sm font-medium block">{asset.label}</span>
                          {asset.description && <span className="text-xs text-muted-foreground">{asset.description}</span>}
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                );
              })}
            </div>
          )}
        </section>

        <section className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Our Reach</h2>
            <p className="text-muted-foreground">GRATIS impact at a glance.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { stat: "12+", label: "Countries" },
              { stat: "500K+", label: "Trees Planted" },
              { stat: "1M+", label: "Liters Funded" },
              { stat: "50+", label: "Events Hosted" },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <p className="text-4xl font-bold text-[hsl(var(--brand-yellow))]">{item.stat}</p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto space-y-6 border border-border/50 rounded-lg p-8 bg-card/30">
          <div className="flex items-center gap-3">
            <Globe className="h-6 w-6 text-[hsl(var(--brand-blue))]" />
            <h2 className="text-2xl font-bold">Editorial Guidelines</h2>
          </div>
          <ul className="space-y-3 text-muted-foreground text-sm list-disc list-inside">
            <li>Our official name is <strong className="text-foreground">G.R.A.T.I.S.</strong> - always capitalize all letters when using the acronym.</li>
            <li>When referencing the brand casually, <strong className="text-foreground">GRATIS</strong> is acceptable.</li>
            <li>Please use approved imagery from our media kit for all publications.</li>
            <li>For quotes or statements, contact our communications team for approval.</li>
            <li>GRATIS is a registered trademark. Unauthorized use is prohibited.</li>
          </ul>
        </section>
      </div>
    </>
  );
}

