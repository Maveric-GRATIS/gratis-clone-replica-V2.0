/**
 * Public Partners Directory
 *
 * Part 7 - Section 31: Public Partner Directory & Project Discovery
 * Allows users to discover and filter verified NGO partners
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building,
  MapPin,
  TrendingUp,
  Users,
  Globe,
  CheckCircle,
  Search,
  Filter,
} from "lucide-react";
import type {
  Partner,
  FocusArea,
  PartnerTier,
  PartnerStatus,
} from "@/types/partner";

// Simplified partner display interface for directory (not extending Partner to avoid required fields)
interface DisplayPartner {
  id: string;
  organizationName: string;
  slug: string;
  organizationType?: string;
  tier?: PartnerTier | string;
  status?: PartnerStatus | string;
  logo?: string;
  mission?: string;
  description?: string;
  focusAreas?: FocusArea[];
  operatingCountries?: string[];
  website?: string;
  email?: string;
  phone?: string;
  registrationNumber?: string;
  taxId?: string;
  foundedYear?: number;
  verification?: {
    verified: boolean;
    verifiedAt?: Date;
    verifiedBy?: string;
    badge?: string;
  };
  settings?: any; // Flexible for mock data
  stats?: any; // Flexible for mock data
  createdAt?: Date;
  updatedAt?: Date;
  coverImage?: string;
  address?: any;
}

const FOCUS_AREAS: { value: FocusArea; label: string; icon: string }[] = [
  { value: "clean_water", label: "Clean Water", icon: "💧" },
  { value: "sanitation", label: "Sanitation", icon: "🚿" },
  { value: "education", label: "Education", icon: "📚" },
  { value: "healthcare", label: "Healthcare", icon: "🏥" },
  { value: "food_security", label: "Food Security", icon: "🌾" },
  { value: "environment", label: "Environment", icon: "🌍" },
  { value: "disaster_relief", label: "Disaster Relief", icon: "🆘" },
  { value: "poverty_reduction", label: "Poverty Reduction", icon: "🏠" },
  { value: "gender_equality", label: "Gender Equality", icon: "⚖️" },
  { value: "youth_development", label: "Youth Development", icon: "👦" },
];

const COUNTRIES = [
  "All Countries",
  "Netherlands",
  "Germany",
  "Belgium",
  "France",
  "United Kingdom",
  "Spain",
  "Italy",
  "Poland",
  "Sweden",
  "Kenya",
  "India",
  "Bangladesh",
  "Philippines",
];

// Mock data for development
const MOCK_PARTNERS: DisplayPartner[] = [
  {
    id: "1",
    organizationName: "Water For Life Foundation",
    slug: "water-for-life",
    organizationType: "ngo",
    registrationNumber: "NL123456",
    taxId: "TAX123",
    mission:
      "Providing clean water access to underserved communities in Africa and Asia",
    foundedYear: 2015,
    website: "https://waterforlife.org",
    email: "contact@waterforlife.org",
    phone: "+31 20 1234567",
    logo: "/placeholder-logo.png",
    coverImage: "/placeholder-cover.png",
    address: {
      street: "Keizersgracht 100",
      city: "Amsterdam",
      region: "Noord-Holland",
      postalCode: "1015 CT",
      country: "Netherlands",
    },
    operatingCountries: ["Kenya", "Tanzania", "Uganda"],
    focusAreas: ["clean_water", "sanitation"],
    tier: "gold",
    status: "approved",
    verification: {
      verified: true,
      verifiedAt: new Date("2023-01-15"),
      verifiedBy: "admin1",
      badge: "gold",
    },
    settings: {
      publicProfile: true,
      showOnPartnerPage: true,
      allowDirectDonations: true,
      notificationPreferences: {
        email: true,
        projectUpdates: true,
        donationAlerts: true,
        monthlyReports: true,
      },
    },
    stats: {
      totalProjects: 12,
      activeProjects: 5,
      completedProjects: 7,
      totalFundsRaised: 250000,
      totalBeneficiaries: 5000,
      impactScore: 92,
      rating: 4.8,
      reviewCount: 125,
    },
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    organizationName: "Education First Initiative",
    slug: "education-first",
    organizationType: "ngo",
    registrationNumber: "NL234567",
    taxId: "TAX234",
    mission:
      "Building schools and providing quality education in developing regions",
    foundedYear: 2012,
    website: "https://educationfirst.org",
    email: "info@educationfirst.org",
    phone: "+31 20 2345678",
    logo: "/placeholder-logo.png",
    coverImage: "/placeholder-cover.png",
    address: {
      street: "Prinsengracht 200",
      city: "Amsterdam",
      region: "Noord-Holland",
      postalCode: "1016 HG",
      country: "Netherlands",
    },
    operatingCountries: ["India", "Bangladesh", "Philippines"],
    focusAreas: ["education", "youth_development"],
    tier: "platinum",
    status: "approved",
    verification: {
      verified: true,
      verifiedAt: new Date("2023-02-20"),
      verifiedBy: "admin1",
      badge: "platinum",
    },
    settings: {
      publicProfile: true,
      showOnPartnerPage: true,
      allowDirectDonations: true,
      notificationPreferences: {
        email: true,
        projectUpdates: true,
        donationAlerts: true,
        monthlyReports: true,
      },
    },
    stats: {
      totalProjects: 18,
      activeProjects: 8,
      completedProjects: 10,
      totalFundsRaised: 450000,
      totalBeneficiaries: 50000,
      impactScore: 98,
      rating: 4.8,
      reviewCount: 234,
      totalDonors: 3200,
    },
    createdAt: new Date("2023-02-01"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "3",
    organizationName: "Green Earth Alliance",
    slug: "green-earth",
    organizationType: "ngo",
    registrationNumber: "NL345678",
    taxId: "TAX345",
    mission:
      "Environmental conservation and sustainable development projects worldwide",
    foundedYear: 2018,
    website: "https://greenearth.org",
    email: "contact@greenearth.org",
    phone: "+31 20 3456789",
    logo: "/placeholder-logo.png",
    coverImage: "/placeholder-cover.png",
    address: {
      street: "Herengracht 300",
      city: "Amsterdam",
      region: "Noord-Holland",
      postalCode: "1016 BX",
      country: "Netherlands",
    },
    operatingCountries: ["Kenya", "Brazil", "Indonesia"],
    focusAreas: ["environment", "clean_water"],
    tier: "silver",
    status: "approved",
    verification: {
      verified: true,
      verifiedAt: new Date("2023-03-10"),
      verifiedBy: "admin1",
      badge: "silver",
    },
    settings: {
      publicProfile: true,
      showOnPartnerPage: true,
      allowDirectDonations: true,
      notificationPreferences: {
        email: true,
        projectUpdates: true,
        donationAlerts: true,
        monthlyReports: true,
      },
    },
    stats: {
      totalProjects: 8,
      activeProjects: 3,
      completedProjects: 5,
      totalFundsRaised: 180000,
      totalBeneficiaries: 15000,
      impactScore: 88,
      rating: 4.5,
      reviewCount: 89,
      totalDonors: 850,
    },
    createdAt: new Date("2023-03-01"),
    updatedAt: new Date("2024-01-10"),
  },
];

export default function PartnersDirectory() {
  const [partners, setPartners] = useState<DisplayPartner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<DisplayPartner[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [focusArea, setFocusArea] = useState<string>("all");
  const [country, setCountry] = useState<string>("All Countries");
  const [sortBy, setSortBy] = useState<string>("impact");

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPartners(MOCK_PARTNERS);
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    filterPartners();
  }, [partners, search, focusArea, country, sortBy]);

  const filterPartners = () => {
    let result = [...partners];

    // Search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.organizationName.toLowerCase().includes(searchLower) ||
          p.mission.toLowerCase().includes(searchLower),
      );
    }

    // Focus area
    if (focusArea !== "all") {
      result = result.filter((p) =>
        p.focusAreas.includes(focusArea as FocusArea),
      );
    }

    // Country
    if (country !== "All Countries") {
      result = result.filter((p) => p.operatingCountries.includes(country));
    }

    // Sort
    switch (sortBy) {
      case "impact":
        result.sort((a, b) => b.stats.impactScore - a.stats.impactScore);
        break;
      case "projects":
        result.sort((a, b) => b.stats.totalProjects - a.stats.totalProjects);
        break;
      case "raised":
        result.sort(
          (a, b) => b.stats.totalFundsRaised - a.stats.totalFundsRaised,
        );
        break;
      case "name":
        result.sort((a, b) =>
          a.organizationName.localeCompare(b.organizationName),
        );
        break;
    }

    setFilteredPartners(result);
  };

  const tierColors = {
    bronze: "border-orange-300 bg-orange-50 dark:bg-orange-950/30",
    silver: "border-gray-300 bg-gray-50 dark:bg-gray-950/30",
    gold: "border-yellow-400 bg-yellow-50 dark:bg-yellow-950/30",
    platinum: "border-purple-400 bg-purple-50 dark:bg-purple-950/30",
  };

  const tierBadgeColors = {
    bronze:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    silver: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    gold: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    platinum:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  };

  const totalStats = partners.reduce(
    (acc, p) => ({
      projects: acc.projects + p.stats.totalProjects,
      raised: acc.raised + p.stats.totalFundsRaised,
      donors: acc.donors + p.stats.totalDonors,
    }),
    { projects: 0, raised: 0, donors: 0 },
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Partners</h1>
          <p className="text-xl text-blue-100 mb-2">
            Discover verified NGO partners making a difference worldwide
          </p>
          <p className="text-blue-200">
            All partners are thoroughly vetted and verified for transparency and
            impact
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {partners.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Verified Partners
            </div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {totalStats.projects}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Active Projects
            </div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              €{(totalStats.raised / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Funds Raised
            </div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {(totalStats.donors / 1000).toFixed(1)}K
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Donors
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search partners..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Focus Area */}
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

            {/* Country */}
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="impact">Impact Score</SelectItem>
                <SelectItem value="projects">Most Projects</SelectItem>
                <SelectItem value="raised">Funds Raised</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Focus Area Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={focusArea === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFocusArea("all")}
          >
            All
          </Button>
          {FOCUS_AREAS.map((area) => (
            <Button
              key={area.value}
              variant={focusArea === area.value ? "default" : "outline"}
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
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mb-4" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              </Card>
            ))}
          </div>
        ) : filteredPartners.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 dark:text-white">
              No partners found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPartners.map((partner) => (
              <Link key={partner.id} to={`/partners/${partner.slug}`}>
                <Card
                  className={`p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 ${
                    tierColors[partner.tier]
                  }`}
                >
                  {/* Logo & Verification */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <Building className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                    </div>
                    {partner.verification.verified && (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                  </div>

                  {/* Name & Tier */}
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">
                    {partner.organizationName}
                  </h3>
                  <Badge className={`mb-3 ${tierBadgeColors[partner.tier]}`}>
                    {partner.tier.toUpperCase()}
                  </Badge>

                  {/* Mission */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {partner.mission}
                  </p>

                  {/* Focus Areas */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {partner.focusAreas.slice(0, 3).map((area) => {
                      const areaData = FOCUS_AREAS.find(
                        (a) => a.value === area,
                      );
                      return (
                        <span
                          key={area}
                          className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded"
                        >
                          {areaData?.icon} {areaData?.label}
                        </span>
                      );
                    })}
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {partner.operatingCountries.slice(0, 2).join(", ")}
                    </span>
                    {partner.operatingCountries.length > 2 && (
                      <span>+{partner.operatingCountries.length - 2}</span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t dark:border-gray-700">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        {partner.stats.totalProjects}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Projects
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                        €{(partner.stats.totalFundsRaised / 1000).toFixed(0)}K
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Raised
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                        {partner.stats.impactScore}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Impact
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Become a Partner CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Are you an NGO?</h2>
          <p className="text-blue-100 mb-6">
            Join our network of verified partners and amplify your impact
          </p>
          <Link to="/partners/apply">
            <Button size="lg" variant="secondary">
              Become a Partner
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
