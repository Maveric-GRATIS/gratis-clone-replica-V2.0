# GRATIS.NGO Enterprise Development Prompts - PART 7
## Public Directory, Search, Messaging, Reports & PWA (Sections 31-36)
### Total Estimated Size: ~50,000 tokens | Complexity: HIGH

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 31: PUBLIC PARTNER DIRECTORY & PROJECT DISCOVERY
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 31.1: Create Public Partner Directory

```
Create the public-facing partner directory where users can discover verified NGO partners.

### FILE: src/app/(public)/partners/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import { PartnerDirectory } from '@/components/public/PartnerDirectory';

export const metadata: Metadata = {
  title: 'Our Partners | GRATIS.NGO',
  description: 'Discover verified NGO partners making a difference worldwide.',
};

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Partners</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Discover verified NGOs and organizations creating lasting impact around the world
          </p>
        </div>
      </section>

      {/* Directory */}
      <Suspense fallback={<div className="p-8 text-center">Loading partners...</div>}>
        <PartnerDirectory />
      </Suspense>
    </div>
  );
}

### FILE: src/components/public/PartnerDirectory.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Icons } from '@/components/shared/Icons';
import { formatNumber, formatCurrency } from '@/lib/utils';
import type { Partner, FocusArea } from '@/types/partner';

const FOCUS_AREAS: { value: FocusArea; label: string; icon: string }[] = [
  { value: 'clean_water', label: 'Clean Water', icon: '💧' },
  { value: 'sanitation', label: 'Sanitation', icon: '🚿' },
  { value: 'education', label: 'Education', icon: '📚' },
  { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { value: 'food_security', label: 'Food Security', icon: '🌾' },
  { value: 'environment', label: 'Environment', icon: '🌍' },
  { value: 'disaster_relief', label: 'Disaster Relief', icon: '🆘' },
  { value: 'poverty_reduction', label: 'Poverty Reduction', icon: '🏠' },
  { value: 'gender_equality', label: 'Gender Equality', icon: '⚖️' },
  { value: 'youth_development', label: 'Youth Development', icon: '👦' },
];

const COUNTRIES = [
  'All Countries', 'Netherlands', 'Germany', 'Belgium', 'France', 'United Kingdom',
  'Spain', 'Italy', 'Poland', 'Sweden', 'Kenya', 'India', 'Bangladesh', 'Philippines'
];

export function PartnerDirectory() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [focusArea, setFocusArea] = useState<string>('all');
  const [country, setCountry] = useState<string>('All Countries');
  const [sortBy, setSortBy] = useState<string>('impact');

  useEffect(() => {
    fetchPartners();
  }, []);

  useEffect(() => {
    filterPartners();
  }, [partners, search, focusArea, country, sortBy]);

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/public/partners');
      const data = await response.json();
      setPartners(data.partners);
    } catch (error) {
      console.error('Failed to fetch partners:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPartners = () => {
    let result = [...partners];

    // Search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.organizationName.toLowerCase().includes(searchLower) ||
          p.mission.toLowerCase().includes(searchLower)
      );
    }

    // Focus area
    if (focusArea !== 'all') {
      result = result.filter((p) => p.focusAreas.includes(focusArea as FocusArea));
    }

    // Country
    if (country !== 'All Countries') {
      result = result.filter((p) => p.operatingCountries.includes(country));
    }

    // Sort
    switch (sortBy) {
      case 'impact':
        result.sort((a, b) => b.stats.impactScore - a.stats.impactScore);
        break;
      case 'projects':
        result.sort((a, b) => b.stats.totalProjects - a.stats.totalProjects);
        break;
      case 'raised':
        result.sort((a, b) => b.stats.totalFundsRaised - a.stats.totalFundsRaised);
        break;
      case 'name':
        result.sort((a, b) => a.organizationName.localeCompare(b.organizationName));
        break;
    }

    setFilteredPartners(result);
  };

  const tierColors = {
    bronze: 'border-orange-300 bg-orange-50',
    silver: 'border-gray-300 bg-gray-50',
    gold: 'border-yellow-400 bg-yellow-50',
    platinum: 'border-purple-400 bg-purple-50',
  };

  const tierBadgeColors = {
    bronze: 'bg-orange-100 text-orange-800',
    silver: 'bg-gray-100 text-gray-800',
    gold: 'bg-yellow-100 text-yellow-800',
    platinum: 'bg-purple-100 text-purple-800',
  };

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <p className="text-3xl font-bold text-blue-600">{partners.length}</p>
            <p className="text-sm text-gray-500">Verified Partners</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <p className="text-3xl font-bold text-green-600">
              {formatNumber(partners.reduce((sum, p) => sum + p.stats.totalProjects, 0))}
            </p>
            <p className="text-sm text-gray-500">Active Projects</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <p className="text-3xl font-bold text-purple-600">
              {formatCurrency(partners.reduce((sum, p) => sum + p.stats.totalFundsRaised, 0))}
            </p>
            <p className="text-sm text-gray-500">Funds Raised</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <p className="text-3xl font-bold text-pink-600">
              {formatNumber(partners.reduce((sum, p) => sum + p.stats.totalBeneficiaries, 0))}
            </p>
            <p className="text-sm text-gray-500">Lives Impacted</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Icons.search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search partners..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={focusArea} onValueChange={setFocusArea}>
              <SelectTrigger>
                <SelectValue placeholder="Focus Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Focus Areas</SelectItem>
                {FOCUS_AREAS.map((area) => (
                  <SelectItem key={area.value} value={area.value}>
                    {area.icon} {area.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="impact">Highest Impact</SelectItem>
                <SelectItem value="projects">Most Projects</SelectItem>
                <SelectItem value="raised">Most Raised</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Focus Area Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={focusArea === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFocusArea('all')}
          >
            All
          </Button>
          {FOCUS_AREAS.map((area) => (
            <Button
              key={area.value}
              variant={focusArea === area.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFocusArea(area.value)}
            >
              {area.icon} {area.label}
            </Button>
          ))}
        </div>

        {/* Partners Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg h-64 animate-pulse" />
            ))}
          </div>
        ) : filteredPartners.length === 0 ? (
          <div className="text-center py-12">
            <Icons.search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No partners found</h3>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPartners.map((partner) => (
              <Link key={partner.id} href={`/partners/${partner.slug}`}>
                <Card className={`h-full hover:shadow-lg transition-shadow border-2 ${tierColors[partner.tier]}`}>
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-lg bg-white border flex items-center justify-center flex-shrink-0">
                        {partner.logo ? (
                          <img src={partner.logo} alt={partner.organizationName} className="w-12 h-12 object-contain" />
                        ) : (
                          <Icons.building className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{partner.organizationName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={tierBadgeColors[partner.tier]}>
                            {partner.tier.charAt(0).toUpperCase() + partner.tier.slice(1)}
                          </Badge>
                          {partner.stats.rating > 0 && (
                            <span className="flex items-center text-sm text-yellow-600">
                              <Icons.star className="w-4 h-4 fill-current mr-1" />
                              {partner.stats.rating.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Mission */}
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{partner.mission}</p>

                    {/* Focus Areas */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {partner.focusAreas.slice(0, 3).map((area) => {
                        const areaInfo = FOCUS_AREAS.find((f) => f.value === area);
                        return (
                          <span key={area} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {areaInfo?.icon} {areaInfo?.label}
                          </span>
                        );
                      })}
                      {partner.focusAreas.length > 3 && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          +{partner.focusAreas.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 pt-4 border-t">
                      <div className="text-center">
                        <p className="font-semibold text-blue-600">{partner.stats.totalProjects}</p>
                        <p className="text-xs text-gray-500">Projects</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-green-600">
                          {formatCurrency(partner.stats.totalFundsRaised, { compact: true })}
                        </p>
                        <p className="text-xs text-gray-500">Raised</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-purple-600">
                          {formatNumber(partner.stats.totalBeneficiaries, { compact: true })}
                        </p>
                        <p className="text-xs text-gray-500">Helped</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Become a Partner CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Are you an NGO?</h2>
          <p className="text-blue-100 mb-6">Join our network and amplify your impact</p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/partners/apply">Apply to Become a Partner</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

### FILE: src/app/(public)/partners/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/lib/firebase/admin';
import { PartnerProfile } from '@/components/public/PartnerProfile';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const partner = await getPartner(params.slug);
  if (!partner) return { title: 'Partner Not Found' };

  return {
    title: `${partner.organizationName} | GRATIS.NGO Partners`,
    description: partner.mission,
    openGraph: {
      title: partner.organizationName,
      description: partner.mission,
      images: partner.coverImage ? [partner.coverImage] : [],
    },
  };
}

async function getPartner(slug: string) {
  const snapshot = await db.collection('partners')
    .where('slug', '==', slug)
    .where('status', '==', 'approved')
    .where('settings.publicProfile', '==', true)
    .limit(1)
    .get();

  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
}

export default async function PartnerProfilePage({ params }: Props) {
  const partner = await getPartner(params.slug);
  if (!partner) notFound();

  return <PartnerProfile partner={partner as any} />;
}

### FILE: src/components/public/PartnerProfile.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Icons } from '@/components/shared/Icons';
import { formatCurrency, formatNumber } from '@/lib/utils';
import type { Partner, PartnerProject } from '@/types/partner';

interface PartnerProfileProps {
  partner: Partner;
}

export function PartnerProfile({ partner }: PartnerProfileProps) {
  const [projects, setProjects] = useState<PartnerProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, [partner.id]);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`/api/public/partners/${partner.id}/projects`);
      const data = await response.json();
      setProjects(data.projects);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 bg-gradient-to-r from-blue-600 to-blue-800">
        {partner.coverImage && (
          <img
            src={partner.coverImage}
            alt={partner.organizationName}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Profile Header */}
      <div className="max-w-6xl mx-auto px-4 -mt-24 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-xl bg-white border-4 border-white shadow-lg flex items-center justify-center -mt-20">
                {partner.logo ? (
                  <img src={partner.logo} alt={partner.organizationName} className="w-24 h-24 object-contain" />
                ) : (
                  <Icons.building className="w-16 h-16 text-gray-400" />
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {partner.organizationName}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge className="bg-green-100 text-green-800">
                      <Icons.checkCircle className="w-3 h-3 mr-1" />
                      Verified Partner
                    </Badge>
                    <Badge variant="outline">
                      {partner.tier.charAt(0).toUpperCase() + partner.tier.slice(1)} Tier
                    </Badge>
                    {partner.stats.rating > 0 && (
                      <span className="flex items-center text-yellow-600">
                        <Icons.star className="w-4 h-4 fill-current mr-1" />
                        {partner.stats.rating.toFixed(1)} ({partner.stats.reviewCount} reviews)
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Icons.share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button size="sm">
                    <Icons.heart className="w-4 h-4 mr-2" />
                    Donate
                  </Button>
                </div>
              </div>

              <p className="text-gray-600 mt-4">{partner.mission}</p>

              {/* Quick Links */}
              <div className="flex flex-wrap gap-4 mt-4">
                {partner.website && (
                  <a href={partner.website} target="_blank" rel="noopener" className="text-sm text-blue-600 hover:underline flex items-center">
                    <Icons.globe className="w-4 h-4 mr-1" />
                    Website
                  </a>
                )}
                {partner.socialLinks?.facebook && (
                  <a href={partner.socialLinks.facebook} target="_blank" rel="noopener" className="text-gray-500 hover:text-blue-600">
                    <Icons.facebook className="w-5 h-5" />
                  </a>
                )}
                {partner.socialLinks?.twitter && (
                  <a href={partner.socialLinks.twitter} target="_blank" rel="noopener" className="text-gray-500 hover:text-blue-400">
                    <Icons.twitter className="w-5 h-5" />
                  </a>
                )}
                {partner.socialLinks?.instagram && (
                  <a href={partner.socialLinks.instagram} target="_blank" rel="noopener" className="text-gray-500 hover:text-pink-600">
                    <Icons.instagram className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8 pt-6 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{partner.stats.totalProjects}</p>
              <p className="text-sm text-gray-500">Projects</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{formatCurrency(partner.stats.totalFundsRaised)}</p>
              <p className="text-sm text-gray-500">Funds Raised</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{formatNumber(partner.stats.totalBeneficiaries)}</p>
              <p className="text-sm text-gray-500">Beneficiaries</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{partner.stats.completedProjects}</p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-pink-600">{partner.stats.impactScore}</p>
              <p className="text-sm text-gray-500">Impact Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">Projects ({projects.length})</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="impact">Impact</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                [1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse h-64" />
                ))
              ) : projects.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Icons.folderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No active projects yet</p>
                </div>
              ) : (
                projects.map((project) => (
                  <Link key={project.id} href={`/projects/${project.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <div className="aspect-video relative">
                        {project.coverImage ? (
                          <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover rounded-t-lg" />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-t-lg">
                            <Icons.image className="w-12 h-12 text-gray-300" />
                          </div>
                        )}
                        <Badge className="absolute top-2 right-2">{project.category.replace('_', ' ')}</Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 line-clamp-1">{project.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{project.shortDescription}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{formatCurrency(project.currentFunding)}</span>
                            <span className="text-gray-500">{Math.round((project.currentFunding / project.fundingGoal) * 100)}%</span>
                          </div>
                          <Progress value={(project.currentFunding / project.fundingGoal) * 100} className="h-2" />
                          <p className="text-xs text-gray-500">{project.donorCount} donors</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="about">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">About {partner.organizationName}</h3>
                  <p className="text-gray-600 whitespace-pre-line">{partner.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Focus Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {partner.focusAreas.map((area) => (
                      <Badge key={area} variant="outline">{area.replace('_', ' ')}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Operating Countries</h3>
                  <div className="flex flex-wrap gap-2">
                    {partner.operatingCountries.map((country) => (
                      <Badge key={country} variant="secondary">{country}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="impact">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Impact Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Icons.droplet className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">2.5M</p>
                    <p className="text-sm text-gray-600">Liters of Water</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Icons.tree className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">15K</p>
                    <p className="text-sm text-gray-600">Trees Planted</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Icons.graduationCap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-600">5K</p>
                    <p className="text-sm text-gray-600">Students Educated</p>
                  </div>
                  <div className="text-center p-4 bg-pink-50 rounded-lg">
                    <Icons.heart className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-pink-600">{formatNumber(partner.stats.totalBeneficiaries)}</p>
                    <p className="text-sm text-gray-600">Lives Impacted</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="updates">
            <Card>
              <CardContent className="p-6 text-center py-12">
                <Icons.megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No updates yet</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 32: GLOBAL SEARCH & DISCOVERY
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 32.1: Create Global Search System

```
Create a comprehensive global search across all content types.

### FILE: src/components/search/GlobalSearch.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchResult {
  id: string;
  type: 'partner' | 'project' | 'event' | 'bottle' | 'article';
  title: string;
  description: string;
  image?: string;
  url: string;
  metadata?: Record<string, any>;
}

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const typeIcons: Record<string, React.ElementType> = {
  partner: Icons.building,
  project: Icons.globe,
  event: Icons.calendar,
  bottle: Icons.bottle,
  article: Icons.fileText,
};

const typeLabels: Record<string, string> = {
  partner: 'Partner',
  project: 'Project',
  event: 'Event',
  bottle: 'Bottle',
  article: 'Article',
};

const typeColors: Record<string, string> = {
  partner: 'bg-blue-100 text-blue-800',
  project: 'bg-green-100 text-green-800',
  event: 'bg-purple-100 text-purple-800',
  bottle: 'bg-orange-100 text-orange-800',
  article: 'bg-gray-100 text-gray-800',
};

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>('all');

  const debouncedQuery = useDebounce(query, 300);

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [open]);

  // Search when query changes
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery, filter]);

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        ...(filter !== 'all' && { type: filter }),
      });
      
      const response = await fetch(`/api/search?${params}`);
      const data = await response.json();
      setResults(data.results);
      setSelectedIndex(0);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveRecentSearch = (searchQuery: string) => {
    const updated = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSelect = (result: SearchResult) => {
    saveRecentSearch(query);
    onOpenChange(false);
    router.push(result.url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        onOpenChange(false);
        break;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center border-b px-4">
          <Icons.search className="w-5 h-5 text-gray-400" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search partners, projects, events, bottles..."
            className="border-0 focus-visible:ring-0 text-lg py-6"
          />
          {isLoading && <Icons.spinner className="w-5 h-5 animate-spin text-gray-400" />}
          <kbd className="hidden md:inline-flex h-6 px-2 items-center gap-1 rounded border bg-gray-100 text-xs text-gray-500">
            ESC
          </kbd>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 px-4 py-2 border-b overflow-x-auto">
          {['all', 'partner', 'project', 'event', 'bottle', 'article'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={cn(
                'px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors',
                filter === type
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              {type === 'all' ? 'All' : typeLabels[type] + 's'}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto">
          {query.length < 2 ? (
            // Recent Searches
            <div className="p-4">
              {recentSearches.length > 0 && (
                <>
                  <p className="text-xs font-medium text-gray-500 mb-2">RECENT SEARCHES</p>
                  <div className="space-y-1">
                    {recentSearches.map((search, i) => (
                      <button
                        key={i}
                        onClick={() => setQuery(search)}
                        className="flex items-center gap-2 w-full px-2 py-1.5 rounded hover:bg-gray-100 text-left"
                      >
                        <Icons.clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{search}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
              
              {/* Quick Links */}
              <p className="text-xs font-medium text-gray-500 mt-4 mb-2">QUICK LINKS</p>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/partners" onClick={() => onOpenChange(false)} className="flex items-center gap-2 p-3 rounded-lg border hover:bg-gray-50">
                  <Icons.building className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium">Browse Partners</span>
                </Link>
                <Link href="/projects" onClick={() => onOpenChange(false)} className="flex items-center gap-2 p-3 rounded-lg border hover:bg-gray-50">
                  <Icons.globe className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium">View Projects</span>
                </Link>
                <Link href="/events" onClick={() => onOpenChange(false)} className="flex items-center gap-2 p-3 rounded-lg border hover:bg-gray-50">
                  <Icons.calendar className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium">Upcoming Events</span>
                </Link>
                <Link href="/bottles" onClick={() => onOpenChange(false)} className="flex items-center gap-2 p-3 rounded-lg border hover:bg-gray-50">
                  <Icons.bottle className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium">Bottle Gallery</span>
                </Link>
              </div>
            </div>
          ) : results.length === 0 && !isLoading ? (
            // No Results
            <div className="p-8 text-center">
              <Icons.search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No results found for "{query}"</p>
              <p className="text-sm text-gray-400 mt-1">Try different keywords</p>
            </div>
          ) : (
            // Results List
            <AnimatePresence>
              {results.map((result, index) => {
                const Icon = typeIcons[result.type];
                return (
                  <motion.button
                    key={result.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onClick={() => handleSelect(result)}
                    className={cn(
                      'flex items-center gap-4 w-full p-4 text-left transition-colors',
                      selectedIndex === index ? 'bg-blue-50' : 'hover:bg-gray-50'
                    )}
                  >
                    {/* Image/Icon */}
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {result.image ? (
                        <img src={result.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Icon className="w-6 h-6 text-gray-400" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium truncate">{result.title}</span>
                        <Badge className={cn('text-xs', typeColors[result.type])}>
                          {typeLabels[result.type]}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{result.description}</p>
                    </div>

                    {/* Arrow */}
                    <Icons.chevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </motion.button>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border bg-white">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded border bg-white">↓</kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border bg-white">↵</kbd>
              to select
            </span>
          </div>
          <span>Powered by GRATIS.NGO</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

### FILE: src/app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const results: any[] = [];

    // Search Partners
    if (!type || type === 'partner') {
      const partnersSnapshot = await db.collection('partners')
        .where('status', '==', 'approved')
        .where('settings.publicProfile', '==', true)
        .limit(limit)
        .get();

      partnersSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (
          data.organizationName.toLowerCase().includes(query) ||
          data.mission.toLowerCase().includes(query)
        ) {
          results.push({
            id: doc.id,
            type: 'partner',
            title: data.organizationName,
            description: data.mission,
            image: data.logo,
            url: `/partners/${data.slug}`,
          });
        }
      });
    }

    // Search Projects
    if (!type || type === 'project') {
      const projectsSnapshot = await db.collection('partnerProjects')
        .where('status', 'in', ['active', 'funded', 'completed'])
        .where('visibility', '==', 'public')
        .limit(limit)
        .get();

      projectsSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (
          data.title.toLowerCase().includes(query) ||
          data.shortDescription.toLowerCase().includes(query)
        ) {
          results.push({
            id: doc.id,
            type: 'project',
            title: data.title,
            description: data.shortDescription,
            image: data.coverImage,
            url: `/projects/${data.slug}`,
          });
        }
      });
    }

    // Search Events
    if (!type || type === 'event') {
      const eventsSnapshot = await db.collection('events')
        .where('status', '==', 'published')
        .where('startDate', '>=', new Date())
        .limit(limit)
        .get();

      eventsSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (
          data.title.toLowerCase().includes(query) ||
          data.description.toLowerCase().includes(query)
        ) {
          results.push({
            id: doc.id,
            type: 'event',
            title: data.title,
            description: data.description?.slice(0, 100),
            image: data.coverImage,
            url: `/events/${data.slug}`,
          });
        }
      });
    }

    // Search Bottles
    if (!type || type === 'bottle') {
      const bottlesSnapshot = await db.collection('bottles')
        .where('inStock', '==', true)
        .limit(limit)
        .get();

      bottlesSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (
          data.name.toLowerCase().includes(query) ||
          data.description.toLowerCase().includes(query)
        ) {
          results.push({
            id: doc.id,
            type: 'bottle',
            title: data.name,
            description: data.description,
            image: data.images?.[0],
            url: `/bottles?design=${doc.id}`,
          });
        }
      });
    }

    // Sort by relevance (exact match first)
    results.sort((a, b) => {
      const aExact = a.title.toLowerCase() === query;
      const bExact = b.title.toLowerCase() === query;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return 0;
    });

    return NextResponse.json({ results: results.slice(0, limit) });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}

### FILE: src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

### FILE: src/components/layout/SearchTrigger.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/shared/Icons';
import { GlobalSearch } from '@/components/search/GlobalSearch';

export function SearchTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full md:w-64 justify-start text-gray-500"
        onClick={() => setIsOpen(true)}
      >
        <Icons.search className="mr-2 h-4 w-4" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border bg-gray-100 px-1.5 text-[10px] font-medium text-gray-500">
          ⌘K
        </kbd>
      </Button>
      
      <GlobalSearch open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 33: IN-APP MESSAGING SYSTEM
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 33.1: Create Messaging System for Donors & Partners

```
Create a messaging system for communication between donors and partners.

### FILE: src/types/message.ts
import type { Timestamp } from 'firebase/firestore';

export interface Conversation {
  id: string;
  participants: {
    id: string;
    type: 'user' | 'partner';
    name: string;
    avatar?: string;
  }[];
  lastMessage?: {
    text: string;
    senderId: string;
    sentAt: Timestamp;
  };
  unreadCount: Record<string, number>;
  projectId?: string;
  donationId?: string;
  status: 'active' | 'archived' | 'blocked';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'user' | 'partner';
  content: {
    type: 'text' | 'image' | 'file' | 'donation_thank_you';
    text?: string;
    imageUrl?: string;
    fileUrl?: string;
    fileName?: string;
    donationAmount?: number;
  };
  readBy: string[];
  createdAt: Timestamp;
}

### FILE: src/app/(dashboard)/messages/page.tsx
import { Suspense } from 'react';
import { MessagingCenter } from '@/components/messages/MessagingCenter';

export default function MessagesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MessagingCenter />
    </Suspense>
  );
}

### FILE: src/components/messages/MessagingCenter.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { format, isToday, isYesterday } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth/AuthContext';
import type { Conversation, Message } from '@/types/message';

export function MessagingCenter() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/messages/conversations');
      const data = await response.json();
      setConversations(data.conversations);
      if (data.conversations.length > 0 && !selectedConversation) {
        setSelectedConversation(data.conversations[0]);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/messages/conversations/${conversationId}/messages`);
      const data = await response.json();
      setMessages(data.messages);
      
      // Mark as read
      await fetch(`/api/messages/conversations/${conversationId}/read`, { method: 'POST' });
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || isSending) return;

    setIsSending(true);
    try {
      const response = await fetch(`/api/messages/conversations/${selectedConversation.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: { type: 'text', text: newMessage } }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, data.message]);
      setNewMessage('');
      
      // Update conversation list
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedConversation.id
            ? { ...c, lastMessage: { text: newMessage, senderId: user!.id, sentAt: new Date() as any } }
            : c
        )
      );
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatMessageDate = (date: any) => {
    const d = date.toDate ? date.toDate() : new Date(date);
    if (isToday(d)) return format(d, 'HH:mm');
    if (isYesterday(d)) return 'Yesterday ' + format(d, 'HH:mm');
    return format(d, 'MMM d, HH:mm');
  };

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find((p) => p.id !== user?.id);
  };

  return (
    <div className="h-[calc(100vh-8rem)]">
      <Card className="h-full flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-80 border-r flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-lg">Messages</h2>
          </div>
          
          <ScrollArea className="flex-1">
            {isLoading ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center">
                <Icons.mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No conversations yet</p>
              </div>
            ) : (
              conversations.map((conversation) => {
                const other = getOtherParticipant(conversation);
                const unread = conversation.unreadCount[user?.id || ''] || 0;
                
                return (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={cn(
                      'w-full p-4 flex gap-3 text-left hover:bg-gray-50 transition-colors',
                      selectedConversation?.id === conversation.id && 'bg-blue-50'
                    )}
                  >
                    <Avatar>
                      <AvatarImage src={other?.avatar} />
                      <AvatarFallback>{other?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={cn('font-medium truncate', unread > 0 && 'text-blue-600')}>
                          {other?.name}
                        </span>
                        {conversation.lastMessage && (
                          <span className="text-xs text-gray-400">
                            {formatMessageDate(conversation.lastMessage.sentAt)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className={cn(
                          'text-sm truncate',
                          unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'
                        )}>
                          {conversation.lastMessage?.text || 'No messages yet'}
                        </p>
                        {unread > 0 && (
                          <Badge className="ml-2 bg-blue-600">{unread}</Badge>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </ScrollArea>
        </div>

        {/* Messages Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={getOtherParticipant(selectedConversation)?.avatar} />
                  <AvatarFallback>
                    {getOtherParticipant(selectedConversation)?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">
                    {getOtherParticipant(selectedConversation)?.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {getOtherParticipant(selectedConversation)?.type === 'partner' ? 'Partner' : 'Supporter'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Icons.info className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Icons.moreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => {
                  const isOwn = message.senderId === user?.id;
                  const showDate = index === 0 || 
                    formatMessageDate(messages[index - 1].createdAt) !== formatMessageDate(message.createdAt);
                  
                  return (
                    <React.Fragment key={message.id}>
                      {showDate && (
                        <div className="flex justify-center my-4">
                          <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                            {formatMessageDate(message.createdAt)}
                          </span>
                        </div>
                      )}
                      <div className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}>
                        <div
                          className={cn(
                            'max-w-[70%] rounded-2xl px-4 py-2',
                            isOwn
                              ? 'bg-blue-600 text-white rounded-br-md'
                              : 'bg-gray-100 text-gray-900 rounded-bl-md'
                          )}
                        >
                          {message.content.type === 'text' && (
                            <p className="whitespace-pre-wrap">{message.content.text}</p>
                          )}
                          {message.content.type === 'image' && (
                            <img
                              src={message.content.imageUrl}
                              alt=""
                              className="max-w-full rounded-lg"
                            />
                          )}
                          {message.content.type === 'donation_thank_you' && (
                            <div className="text-center">
                              <Icons.heart className="w-8 h-8 mx-auto mb-2" />
                              <p className="font-medium">Thank you for your donation!</p>
                              <p className="text-sm opacity-80">
                                €{message.content.donationAmount}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Icons.paperclip className="w-5 h-5" />
                </Button>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={!newMessage.trim() || isSending}>
                  {isSending ? (
                    <Icons.spinner className="w-5 h-5 animate-spin" />
                  ) : (
                    <Icons.send className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Icons.mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Select a conversation</h3>
              <p className="text-gray-500">Choose from your existing conversations</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

### FILE: src/app/api/messages/conversations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { db } from '@/lib/firebase/admin';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get conversations where user is a participant
    const snapshot = await db.collection('conversations')
      .where('participantIds', 'array-contains', userId)
      .where('status', '==', 'active')
      .orderBy('updatedAt', 'desc')
      .get();

    const conversations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new conversation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { recipientId, recipientType, projectId, initialMessage } = await request.json();

    // Check if conversation already exists
    const existing = await db.collection('conversations')
      .where('participantIds', 'array-contains', session.user.id)
      .get();

    const existingConv = existing.docs.find((doc) => {
      const data = doc.data();
      return data.participantIds.includes(recipientId);
    });

    if (existingConv) {
      return NextResponse.json({ conversation: { id: existingConv.id, ...existingConv.data() } });
    }

    // Get recipient info
    let recipientInfo;
    if (recipientType === 'partner') {
      const partnerDoc = await db.collection('partners').doc(recipientId).get();
      recipientInfo = {
        id: recipientId,
        type: 'partner',
        name: partnerDoc.data()?.organizationName,
        avatar: partnerDoc.data()?.logo,
      };
    } else {
      const userDoc = await db.collection('users').doc(recipientId).get();
      recipientInfo = {
        id: recipientId,
        type: 'user',
        name: `${userDoc.data()?.firstName} ${userDoc.data()?.lastName}`,
        avatar: userDoc.data()?.avatar,
      };
    }

    // Create conversation
    const conversation = {
      participants: [
        {
          id: session.user.id,
          type: 'user',
          name: `${session.user.firstName} ${session.user.lastName}`,
          avatar: session.user.avatar,
        },
        recipientInfo,
      ],
      participantIds: [session.user.id, recipientId],
      projectId,
      unreadCount: { [recipientId]: 1 },
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const convRef = await db.collection('conversations').add(conversation);

    // Add initial message if provided
    if (initialMessage) {
      await db.collection('conversations').doc(convRef.id).collection('messages').add({
        senderId: session.user.id,
        senderType: 'user',
        content: { type: 'text', text: initialMessage },
        readBy: [session.user.id],
        createdAt: new Date(),
      });

      await convRef.update({
        lastMessage: {
          text: initialMessage,
          senderId: session.user.id,
          sentAt: new Date(),
        },
      });
    }

    return NextResponse.json({ conversation: { id: convRef.id, ...conversation } }, { status: 201 });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 34: IMPACT REPORTS & PDF GENERATION
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 34.1: Create Impact Report Generator

```
Create a system to generate PDF impact reports for donors and partners.

### FILE: src/lib/reports/generator.ts
import PDFDocument from 'pdfkit';
import { db } from '@/lib/firebase/admin';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface ReportData {
  user?: {
    name: string;
    email: string;
    memberSince: Date;
  };
  partner?: {
    name: string;
    logo?: string;
  };
  period: {
    start: Date;
    end: Date;
  };
  donations: {
    total: number;
    count: number;
    byProject: { name: string; amount: number }[];
  };
  impact: {
    waterLiters: number;
    treesPlanted: number;
    mealsProvided: number;
    beneficiaries: number;
  };
  projects: {
    name: string;
    status: string;
    progress: number;
    fundsRaised: number;
  }[];
}

export async function generateDonorReport(userId: string, year: number): Promise<Buffer> {
  // Fetch user data
  const userDoc = await db.collection('users').doc(userId).get();
  const userData = userDoc.data();

  // Fetch donations for the year
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31, 23, 59, 59);

  const donationsSnapshot = await db.collection('donations')
    .where('userId', '==', userId)
    .where('status', '==', 'completed')
    .where('createdAt', '>=', startDate)
    .where('createdAt', '<=', endDate)
    .get();

  const donations = donationsSnapshot.docs.map((doc) => doc.data());
  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);

  // Calculate impact
  const impact = calculateImpact(totalDonated);

  // Group by project
  const byProject: Record<string, number> = {};
  for (const donation of donations) {
    if (donation.projectId) {
      const projectDoc = await db.collection('partnerProjects').doc(donation.projectId).get();
      const projectName = projectDoc.data()?.title || 'General Fund';
      byProject[projectName] = (byProject[projectName] || 0) + donation.amount;
    }
  }

  const reportData: ReportData = {
    user: {
      name: `${userData?.firstName} ${userData?.lastName}`,
      email: userData?.email,
      memberSince: userData?.createdAt.toDate(),
    },
    period: { start: startDate, end: endDate },
    donations: {
      total: totalDonated,
      count: donations.length,
      byProject: Object.entries(byProject).map(([name, amount]) => ({ name, amount })),
    },
    impact,
    projects: [],
  };

  return generatePDF(reportData);
}

export async function generatePartnerReport(partnerId: string, year: number): Promise<Buffer> {
  const partnerDoc = await db.collection('partners').doc(partnerId).get();
  const partnerData = partnerDoc.data();

  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31, 23, 59, 59);

  // Fetch projects
  const projectsSnapshot = await db.collection('partnerProjects')
    .where('partnerId', '==', partnerId)
    .get();

  const projects = projectsSnapshot.docs.map((doc) => doc.data());

  // Calculate totals
  const totalRaised = projects.reduce((sum, p) => sum + p.currentFunding, 0);
  const totalBeneficiaries = projects.reduce((sum, p) => sum + p.actualBeneficiaries, 0);

  const reportData: ReportData = {
    partner: {
      name: partnerData?.organizationName,
      logo: partnerData?.logo,
    },
    period: { start: startDate, end: endDate },
    donations: {
      total: totalRaised,
      count: projects.reduce((sum, p) => sum + p.donorCount, 0),
      byProject: projects.map((p) => ({ name: p.title, amount: p.currentFunding })),
    },
    impact: calculateImpact(totalRaised),
    projects: projects.map((p) => ({
      name: p.title,
      status: p.status,
      progress: (p.currentFunding / p.fundingGoal) * 100,
      fundsRaised: p.currentFunding,
    })),
  };

  return generatePDF(reportData);
}

function calculateImpact(totalDonated: number) {
  return {
    waterLiters: Math.round(totalDonated * 50),
    treesPlanted: Math.round(totalDonated / 10),
    mealsProvided: Math.round(totalDonated / 2),
    beneficiaries: Math.round(totalDonated / 25),
  };
}

function generatePDF(data: ReportData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc.fontSize(24).font('Helvetica-Bold').fillColor('#1E40AF')
      .text('GRATIS.NGO', { align: 'center' });
    doc.fontSize(16).font('Helvetica').fillColor('#333')
      .text('Impact Report', { align: 'center' });
    doc.moveDown();

    // Period
    doc.fontSize(12).fillColor('#666')
      .text(`${data.period.start.toLocaleDateString()} - ${data.period.end.toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(2);

    // User/Partner Info
    if (data.user) {
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#333')
        .text(`Dear ${data.user.name},`);
      doc.moveDown();
      doc.fontSize(11).font('Helvetica').fillColor('#666')
        .text('Thank you for your generous support. Here\'s a summary of the impact you\'ve made.');
    } else if (data.partner) {
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#333')
        .text(data.partner.name);
      doc.moveDown();
      doc.fontSize(11).font('Helvetica').fillColor('#666')
        .text('Annual Impact Summary');
    }
    doc.moveDown(2);

    // Key Stats
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#1E40AF')
      .text('Your Impact at a Glance');
    doc.moveDown();

    const statsY = doc.y;
    const statWidth = 120;
    const stats = [
      { label: 'Total Donated', value: formatCurrency(data.donations.total) },
      { label: 'Water Provided', value: `${formatNumber(data.impact.waterLiters)} L` },
      { label: 'Trees Planted', value: formatNumber(data.impact.treesPlanted) },
      { label: 'Lives Impacted', value: formatNumber(data.impact.beneficiaries) },
    ];

    stats.forEach((stat, i) => {
      const x = 50 + (i * statWidth);
      doc.fontSize(18).font('Helvetica-Bold').fillColor('#1E40AF')
        .text(stat.value, x, statsY, { width: statWidth - 10, align: 'center' });
      doc.fontSize(10).font('Helvetica').fillColor('#666')
        .text(stat.label, x, statsY + 22, { width: statWidth - 10, align: 'center' });
    });

    doc.y = statsY + 60;
    doc.moveDown(2);

    // Donations by Project
    if (data.donations.byProject.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#1E40AF')
        .text('Donations by Project');
      doc.moveDown();

      data.donations.byProject.slice(0, 10).forEach((project) => {
        doc.fontSize(11).font('Helvetica').fillColor('#333')
          .text(`${project.name}: ${formatCurrency(project.amount)}`);
      });
      doc.moveDown(2);
    }

    // Projects (for partner reports)
    if (data.projects.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#1E40AF')
        .text('Project Summary');
      doc.moveDown();

      data.projects.slice(0, 10).forEach((project) => {
        doc.fontSize(11).font('Helvetica-Bold').fillColor('#333')
          .text(project.name);
        doc.fontSize(10).font('Helvetica').fillColor('#666')
          .text(`Status: ${project.status} | Progress: ${Math.round(project.progress)}% | Raised: ${formatCurrency(project.fundsRaised)}`);
        doc.moveDown(0.5);
      });
    }

    // Footer
    doc.fontSize(10).font('Helvetica').fillColor('#999')
      .text('Generated by GRATIS.NGO', 50, doc.page.height - 50, { align: 'center' });

    doc.end();
  });
}

### FILE: src/app/api/reports/donor/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { generateDonorReport } from '@/lib/reports/generator';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

    const pdfBuffer = await generateDonorReport(session.user.id, year);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="GRATIS_Impact_Report_${year}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}

### FILE: src/app/api/reports/partner/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { generatePartnerReport } from '@/lib/reports/generator';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== 'partner') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

    const pdfBuffer = await generatePartnerReport(session.user.partnerId, year);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Partner_Impact_Report_${year}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 35: PWA & MOBILE OPTIMIZATION
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 35.1: Create PWA Configuration

```
Configure the app as a Progressive Web App with offline support.

### FILE: public/manifest.json
{
  "name": "GRATIS.NGO",
  "short_name": "GRATIS",
  "description": "Make an impact with every bottle",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1E40AF",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/home.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    },
    {
      "src": "/screenshots/mobile.png",
      "sizes": "750x1334",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ],
  "categories": ["charity", "social", "lifestyle"],
  "prefer_related_applications": false
}

### FILE: public/sw.js
const CACHE_NAME = 'gratis-v1';
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip API requests
  if (url.pathname.startsWith('/api/')) return;

  // Network-first for navigation
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || caches.match('/offline');
          });
        })
    );
    return;
  }

  // Cache-first for static assets
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff2?)$/)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
          return response;
        });
      })
    );
    return;
  }

  // Network-first for everything else
  event.respondWith(
    fetch(request)
      .then((response) => {
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
    },
    actions: data.actions || [],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

### FILE: src/app/offline/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/shared/Icons';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icons.wifiOff className="w-12 h-12 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">You're Offline</h1>
        <p className="text-gray-600 mb-6">
          It looks like you've lost your internet connection. 
          Some features may not be available until you're back online.
        </p>
        <div className="space-y-3">
          <Button onClick={() => window.location.reload()} className="w-full">
            <Icons.refresh className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/">Go to Homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

### FILE: src/components/pwa/InstallPrompt.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/shared/Icons';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // Check if dismissed recently
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed) {
      const dismissedTime = new Date(dismissed).getTime();
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) { // 7 days
        return;
      }
    }

    // Check for iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    if (isIOSDevice) {
      // Show iOS instructions after delay
      setTimeout(() => setShowPrompt(true), 5000);
      return;
    }

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', new Date().toISOString());
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-xl shadow-2xl border p-4 z-50"
        >
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            <Icons.x className="w-5 h-5" />
          </button>

          <div className="flex gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icons.smartphone className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Install GRATIS.NGO</h3>
              <p className="text-sm text-gray-600 mt-1">
                {isIOS
                  ? 'Tap the share button and select "Add to Home Screen"'
                  : 'Add to your home screen for quick access'}
              </p>
            </div>
          </div>

          {!isIOS && (
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={handleDismiss} className="flex-1">
                Not Now
              </Button>
              <Button size="sm" onClick={handleInstall} className="flex-1">
                Install
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

### FILE: src/hooks/useOnlineStatus.ts
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 36: INTERNATIONALIZATION (i18n) BASICS
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 36.1: Setup Internationalization

```
Setup i18n for multi-language support targeting EU markets.

### FILE: src/lib/i18n/config.ts
export const locales = ['en', 'nl', 'de', 'fr', 'es'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  nl: 'Nederlands',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  nl: '🇳🇱',
  de: '🇩🇪',
  fr: '🇫🇷',
  es: '🇪🇸',
};

### FILE: src/lib/i18n/dictionaries.ts
import type { Locale } from './config';

const dictionaries: Record<Locale, () => Promise<Record<string, any>>> = {
  en: () => import('@/locales/en.json').then((m) => m.default),
  nl: () => import('@/locales/nl.json').then((m) => m.default),
  de: () => import('@/locales/de.json').then((m) => m.default),
  fr: () => import('@/locales/fr.json').then((m) => m.default),
  es: () => import('@/locales/es.json').then((m) => m.default),
};

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}

### FILE: src/locales/en.json
{
  "common": {
    "loading": "Loading...",
    "error": "Something went wrong",
    "save": "Save",
    "cancel": "Cancel",
    "submit": "Submit",
    "back": "Back",
    "next": "Next",
    "search": "Search",
    "filter": "Filter",
    "sort": "Sort",
    "all": "All",
    "none": "None",
    "yes": "Yes",
    "no": "No"
  },
  "nav": {
    "home": "Home",
    "bottles": "Bottles",
    "partners": "Partners",
    "projects": "Projects",
    "events": "Events",
    "donate": "Donate",
    "login": "Log In",
    "signup": "Sign Up",
    "dashboard": "Dashboard",
    "profile": "Profile",
    "settings": "Settings",
    "logout": "Log Out"
  },
  "home": {
    "hero": {
      "title": "Make an Impact with Every Bottle",
      "subtitle": "Get premium water bottles for free. Funded by ads. All profits go to clean water projects worldwide.",
      "cta": "Get Your Free Bottle"
    },
    "stats": {
      "bottles": "Bottles Distributed",
      "raised": "Funds Raised",
      "projects": "Projects Funded",
      "lives": "Lives Impacted"
    }
  },
  "auth": {
    "login": {
      "title": "Welcome Back",
      "subtitle": "Sign in to your account",
      "email": "Email",
      "password": "Password",
      "remember": "Remember me",
      "forgot": "Forgot password?",
      "submit": "Sign In",
      "noAccount": "Don't have an account?",
      "signUp": "Sign up"
    },
    "register": {
      "title": "Create Account",
      "subtitle": "Join our mission",
      "firstName": "First Name",
      "lastName": "Last Name",
      "email": "Email",
      "password": "Password",
      "confirmPassword": "Confirm Password",
      "terms": "I agree to the Terms of Service and Privacy Policy",
      "submit": "Create Account",
      "hasAccount": "Already have an account?",
      "signIn": "Sign in"
    }
  },
  "bottles": {
    "title": "Bottle Gallery",
    "subtitle": "Choose your perfect bottle design",
    "filters": {
      "category": "Category",
      "color": "Color",
      "tier": "Tier Required"
    },
    "card": {
      "order": "Order Now",
      "outOfStock": "Out of Stock",
      "limited": "Limited Edition",
      "ordered": "ordered"
    }
  },
  "partners": {
    "title": "Our Partners",
    "subtitle": "Verified NGOs making a difference",
    "apply": "Become a Partner",
    "stats": {
      "projects": "Projects",
      "raised": "Raised",
      "helped": "Helped"
    }
  },
  "donate": {
    "title": "Make a Donation",
    "subtitle": "Your contribution creates lasting impact",
    "amount": "Donation Amount",
    "custom": "Custom Amount",
    "monthly": "Monthly",
    "oneTime": "One-time",
    "project": "Support a Project",
    "general": "General Fund",
    "submit": "Donate Now",
    "thankYou": "Thank you for your donation!"
  },
  "dashboard": {
    "welcome": "Welcome back",
    "stats": {
      "bottles": "Bottles Used",
      "donated": "Total Donated",
      "impact": "Impact Score",
      "referrals": "Referrals"
    },
    "quickActions": {
      "title": "Quick Actions",
      "orderBottle": "Order Bottle",
      "donate": "Donate",
      "refer": "Refer a Friend",
      "viewImpact": "View Impact"
    }
  },
  "footer": {
    "mission": "Making clean water accessible to everyone, one bottle at a time.",
    "links": {
      "about": "About Us",
      "contact": "Contact",
      "careers": "Careers",
      "press": "Press"
    },
    "legal": {
      "terms": "Terms of Service",
      "privacy": "Privacy Policy",
      "cookies": "Cookie Policy"
    },
    "social": "Follow Us",
    "newsletter": {
      "title": "Stay Updated",
      "placeholder": "Enter your email",
      "submit": "Subscribe"
    },
    "copyright": "© {year} GRATIS.NGO. All rights reserved."
  }
}

### FILE: src/locales/nl.json
{
  "common": {
    "loading": "Laden...",
    "error": "Er is iets misgegaan",
    "save": "Opslaan",
    "cancel": "Annuleren",
    "submit": "Versturen",
    "back": "Terug",
    "next": "Volgende",
    "search": "Zoeken",
    "filter": "Filter",
    "sort": "Sorteren",
    "all": "Alles",
    "none": "Geen",
    "yes": "Ja",
    "no": "Nee"
  },
  "nav": {
    "home": "Home",
    "bottles": "Flessen",
    "partners": "Partners",
    "projects": "Projecten",
    "events": "Evenementen",
    "donate": "Doneren",
    "login": "Inloggen",
    "signup": "Registreren",
    "dashboard": "Dashboard",
    "profile": "Profiel",
    "settings": "Instellingen",
    "logout": "Uitloggen"
  },
  "home": {
    "hero": {
      "title": "Maak Impact met Elke Fles",
      "subtitle": "Ontvang gratis premium waterflessen. Gefinancierd door advertenties. Alle winst gaat naar schoon water projecten wereldwijd.",
      "cta": "Bestel Je Gratis Fles"
    },
    "stats": {
      "bottles": "Flessen Verspreid",
      "raised": "Fondsen Opgehaald",
      "projects": "Projecten Gefinancierd",
      "lives": "Levens Beïnvloed"
    }
  },
  "auth": {
    "login": {
      "title": "Welkom Terug",
      "subtitle": "Log in op je account",
      "email": "E-mail",
      "password": "Wachtwoord",
      "remember": "Onthoud mij",
      "forgot": "Wachtwoord vergeten?",
      "submit": "Inloggen",
      "noAccount": "Nog geen account?",
      "signUp": "Registreer"
    }
  },
  "donate": {
    "title": "Maak een Donatie",
    "subtitle": "Jouw bijdrage creëert blijvende impact",
    "amount": "Donatiebedrag",
    "custom": "Aangepast Bedrag",
    "monthly": "Maandelijks",
    "oneTime": "Eenmalig",
    "submit": "Doneer Nu",
    "thankYou": "Bedankt voor je donatie!"
  },
  "footer": {
    "mission": "Schoon water toegankelijk maken voor iedereen, één fles tegelijk.",
    "copyright": "© {year} GRATIS.NGO. Alle rechten voorbehouden."
  }
}

### FILE: src/components/layout/LanguageSwitcher.tsx
'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/shared/Icons';
import { locales, localeNames, localeFlags, type Locale } from '@/lib/i18n/config';

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: Locale) => {
    // Remove current locale from pathname and add new one
    const segments = pathname.split('/');
    if (locales.includes(segments[1] as Locale)) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    router.push(segments.join('/'));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <span>{localeFlags[currentLocale]}</span>
          <span className="hidden md:inline">{localeNames[currentLocale]}</span>
          <Icons.chevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => switchLocale(locale)}
            className={locale === currentLocale ? 'bg-gray-100' : ''}
          >
            <span className="mr-2">{localeFlags[locale]}</span>
            {localeNames[locale]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

### FILE: src/hooks/useTranslation.ts
'use client';

import { useCallback } from 'react';

type NestedKeyOf<T> = T extends object
  ? { [K in keyof T]: K extends string ? K | `${K}.${NestedKeyOf<T[K]>}` : never }[keyof T]
  : never;

export function useTranslation(dictionary: Record<string, any>) {
  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const keys = key.split('.');
      let value: any = dictionary;

      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) {
          console.warn(`Translation key not found: ${key}`);
          return key;
        }
      }

      if (typeof value !== 'string') {
        console.warn(`Translation key is not a string: ${key}`);
        return key;
      }

      // Replace parameters
      if (params) {
        return Object.entries(params).reduce((str, [paramKey, paramValue]) => {
          return str.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue));
        }, value);
      }

      return value;
    },
    [dictionary]
  );

  return { t };
}
```

---

## PART 7 SUMMARY

| Section | Feature | Components |
|---------|---------|------------|
| 31 | Public Partner Directory | Directory page, Partner cards, Partner profile, Projects tab |
| 32 | Global Search | Search dialog, Multi-type search, Recent searches, Keyboard shortcuts |
| 33 | Messaging System | Conversations list, Message thread, Real-time messaging, Attachments |
| 34 | Impact Reports | PDF generator, Donor reports, Partner reports, Impact calculations |
| 35 | PWA Features | Manifest, Service worker, Offline page, Install prompt, Push notifications |
| 36 | Internationalization | 5 languages (EN/NL/DE/FR/ES), Dictionary system, Language switcher |

---

## COMPLETE SYSTEM OVERVIEW (Parts 1-7)

| Part | Sections | Focus | Est. Size |
|------|----------|-------|-----------|
| 1 | 1-5 | Foundation | ~72KB |
| 2 | 6-10 | Core Features | ~159KB |
| 3 | 11-13 | Community & Payments | ~69KB |
| 4 | 14-18 | Admin & Analytics | ~128KB |
| 5 | 19-24 | Infrastructure | ~49KB |
| 6 | 25-30 | Partner System | ~123KB |
| **7** | **31-36** | **Discovery, Messaging, PWA** | **~55KB** |

**Grand Total: ~655KB across 36 sections**

---

## What's Still Recommended:

1. **Gamification System** - Badges, achievements, streaks, challenges
2. **Support Tickets** - Help desk for user/partner support
3. **Affiliate Marketing** - Commission-based referral system
4. **A/B Testing** - Feature flags and experiment tracking
5. **Advanced Analytics** - Cohort analysis, funnel tracking
6. **Webhook System** - External integrations for partners
