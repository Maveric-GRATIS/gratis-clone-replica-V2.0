import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Globe, MapPin, Users, Calendar, Star, TrendingUp, FileText, Handshake } from "lucide-react";
import { Link } from "react-router-dom";
import { PartnershipRequirements } from "@/components/partnership/PartnershipRequirements";
import { PartnershipApplicationWizard } from "@/components/partnership/PartnershipApplicationWizard";

interface NGOPartner {
  id: string;
  organization_name: string;
  slug: string;
  description: string | null;
  mission_statement: string | null;
  logo_url: string | null;
  website: string | null;
  country: string;
  city: string | null;
  focus_area: string;
  year_partnered: number;
  annual_funding_amount: number | null;
  total_funding_received: number | null;
  beneficiaries_reached: string | null;
  featured: boolean | null;
  impact_highlights: string[] | null;
}

const focusAreaColors: Record<string, string> = {
  "Clean Water": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Education": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Environment": "bg-green-500/20 text-green-400 border-green-500/30",
  "Housing": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "Food Security": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Health": "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "default": "bg-primary/20 text-primary border-primary/30",
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function Partners() {
  const [focusFilter, setFocusFilter] = useState<string>("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [applicationOpen, setApplicationOpen] = useState(false);

  const { data: partners, isLoading } = useQuery({
    queryKey: ['ngo-partners'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('ngo_partners')
        .select('*')
        .order('featured', { ascending: false })
        .order('organization_name');

      if (error) throw error;
      return data as NGOPartner[];
    },
  });

  const focusAreas = partners
    ? [...new Set(partners.map(p => p.focus_area))].sort()
    : [];

  const countries = partners
    ? [...new Set(partners.map(p => p.country))].sort()
    : [];

  const filteredPartners = partners?.filter(partner => {
    if (focusFilter !== "all" && partner.focus_area !== focusFilter) return false;
    if (countryFilter !== "all" && partner.country !== countryFilter) return false;
    return true;
  });

  const prioritySlugs = ["black-jaguar-foundation", "free-a-girl"];
  const sortedFilteredPartners = [...(filteredPartners || [])].sort((a, b) => {
    const aPriority = prioritySlugs.indexOf(a.slug);
    const bPriority = prioritySlugs.indexOf(b.slug);

    const aRank = aPriority === -1 ? Number.MAX_SAFE_INTEGER : aPriority;
    const bRank = bPriority === -1 ? Number.MAX_SAFE_INTEGER : bPriority;

    if (aRank !== bRank) return aRank - bRank;
    if ((a.featured ? 1 : 0) !== (b.featured ? 1 : 0)) return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    return a.organization_name.localeCompare(b.organization_name);
  });

  const totalFunding = partners?.reduce((sum, p) => sum + (p.total_funding_received || 0), 0) || 0;
  const totalPartners = partners?.length || 0;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="NGO Partners - GRATIS TRIBE"
        description="Meet our verified NGO partners receiving 100% of advertising revenue. Transparent funding, measurable impact."
        canonical="/tribe/partners"
      />

      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            OUR PARTNERS
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Verified NGOs receiving 100% of our advertising revenue. Every euro tracked. Every impact measured.
          </p>

          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">{totalPartners}</div>
              <div className="text-sm text-muted-foreground">Verified Partners</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">{formatCurrency(totalFunding)}</div>
              <div className="text-sm text-muted-foreground">Total Funding Distributed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Ad Revenue Donated</div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container py-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <Select value={focusFilter} onValueChange={setFocusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Focus Area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Focus Areas</SelectItem>
                  {focusAreas.map(area => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <p className="text-sm text-muted-foreground">
              Showing {sortedFilteredPartners?.length || 0} of {totalPartners} partners
            </p>
          </div>
        </div>
      </section>

      <section className="container py-12">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-32 bg-muted/20" />
                <CardContent className="space-y-3 pt-4">
                  <div className="h-6 bg-muted/20 rounded w-3/4" />
                  <div className="h-4 bg-muted/10 rounded w-full" />
                  <div className="h-4 bg-muted/10 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sortedFilteredPartners && sortedFilteredPartners.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedFilteredPartners.map(partner => (
              <Card
                key={partner.id}
                className={`group hover:border-primary/50 transition-all duration-300 ${
                  partner.featured ? 'ring-2 ring-primary/30' : ''
                }`}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {partner.featured && (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        )}
                        <Badge
                          variant="outline"
                          className={focusAreaColors[partner.focus_area] || focusAreaColors.default}
                        >
                          {partner.focus_area}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                        {partner.organization_name}
                      </h3>
                    </div>
                    {partner.logo_url && (
                      <img
                        src={partner.logo_url}
                        alt={partner.organization_name}
                        className="w-12 h-12 rounded-lg object-contain bg-muted/20"
                      />
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {partner.city ? `${partner.city}, ` : ''}{partner.country}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Partner since {partner.year_partnered}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {partner.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 py-4 border-t border-border">
                    <div>
                      <div className="text-lg font-bold text-primary">
                        {partner.total_funding_received
                          ? formatCurrency(partner.total_funding_received)
                          : '-'}
                      </div>
                      <div className="text-xs text-muted-foreground">Funding Received</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">
                        {partner.beneficiaries_reached || '-'}
                      </div>
                      <div className="text-xs text-muted-foreground">Beneficiaries</div>
                    </div>
                  </div>

                  {partner.impact_highlights && partner.impact_highlights.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                        <TrendingUp className="h-3.5 w-3.5" />
                        Impact Highlights
                      </div>
                      <ul className="text-xs space-y-1">
                        {partner.impact_highlights.slice(0, 2).map((highlight, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                            <span className="text-muted-foreground">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link to={`/tribe/partners/${partner.slug}`}>
                        View Details
                      </Link>
                    </Button>
                    {partner.website && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={partner.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Users className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No partners found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters to see more results.
            </p>
          </div>
        )}
      </section>

      <section className="border-t border-border" id="apply">
        <div className="container py-16">
          <Tabs defaultValue="requirements" className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Become a Partner</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                GRATIS distributes 100% of advertising revenue to verified NGO partners.
                Review our requirements and apply to join the network.
              </p>
              <TabsList className="mx-auto">
                <TabsTrigger value="requirements" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Requirements
                </TabsTrigger>
                <TabsTrigger value="apply" className="gap-2">
                  <Handshake className="h-4 w-4" />
                  Apply Now
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="requirements">
              <PartnershipRequirements />
              <div className="text-center mt-8">
                <Button size="lg" onClick={() => setApplicationOpen(true)}>
                  <Handshake className="h-4 w-4 mr-2" />
                  Start Application
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="apply">
              <div className="max-w-2xl mx-auto text-center space-y-6">
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="pt-6 space-y-4">
                    <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                      <Handshake className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Ready to Apply?</h3>
                    <p className="text-muted-foreground">
                      Our 4-step application takes about 15 minutes. You'll need your organization's
                      registration details, financial information, and impact data.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">ANBI/501(c)(3) number</span>
                      <span className="flex items-center gap-1">3+ years active</span>
                      <span className="flex items-center gap-1">Audited financials</span>
                    </div>
                    <Button size="lg" onClick={() => setApplicationOpen(true)} className="mt-4">
                      <Handshake className="h-4 w-4 mr-2" />
                      Open Application Form
                    </Button>
                  </CardContent>
                </Card>

                <div className="flex flex-wrap justify-center gap-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/tribe/standards">View Our Standards</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/tribe/ethics">Ethics & Due Diligence</Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <PartnershipApplicationWizard open={applicationOpen} onOpenChange={setApplicationOpen} />
    </div>
  );
}

