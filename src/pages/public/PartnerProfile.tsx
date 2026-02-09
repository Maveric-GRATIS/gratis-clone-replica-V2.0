/**
 * Public Partner Profile Page
 *
 * Part 7 - Section 31: Public Partner Directory & Project Discovery
 * Displays detailed partner information and their projects
 */

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Building,
  MapPin,
  Globe,
  Mail,
  Phone,
  CheckCircle,
  Calendar,
  Users,
  TrendingUp,
  Target,
  Heart,
  ExternalLink,
} from "lucide-react";
import type {
  Partner,
  FocusArea,
  PartnerTier,
  PartnerStatus,
} from "@/types/partner";

// Simplified partner display interface for profile (not extending Partner to avoid required fields)
interface DisplayPartner {
  id: string;
  organizationName: string;
  slug: string;
  organizationType?: string;
  tier?: PartnerTier | string;
  status?: PartnerStatus | string;
  logo?: string;
  coverImage?: string;
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
  verification?: any; // Flexible for mock data
  settings?: any; // Flexible for mock data
  stats?: any; // Flexible for mock data
  createdAt?: Date;
  updatedAt?: Date;
  address?: any;
}

// Mock project data
interface Project {
  id: string;
  title: string;
  shortDescription: string;
  coverImage?: string;
  fundingGoal: number;
  currentFunding: number;
  status: "planning" | "active" | "funded" | "completed";
  location: { country: string; city: string };
  startDate: Date;
  endDate: Date;
  beneficiaries: number;
}

const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Clean Water Wells in Rural Kenya",
    shortDescription:
      "Installing 10 water wells to provide clean drinking water to 5.000 people",
    fundingGoal: 50000,
    currentFunding: 38500,
    status: "active",
    location: { country: "Kenya", city: "Kisumu" },
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-06-30"),
    beneficiaries: 5000,
  },
  {
    id: "2",
    title: "School Sanitation Facilities",
    shortDescription: "Building modern sanitation facilities for 3 schools",
    fundingGoal: 25000,
    currentFunding: 25000,
    status: "funded",
    location: { country: "Tanzania", city: "Arusha" },
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-05-31"),
    beneficiaries: 1200,
  },
  {
    id: "3",
    title: "Water Filtration Training Program",
    shortDescription:
      "Training local communities in water filtration and maintenance",
    fundingGoal: 15000,
    currentFunding: 8200,
    status: "active",
    location: { country: "Uganda", city: "Kampala" },
    startDate: new Date("2024-03-01"),
    endDate: new Date("2024-08-31"),
    beneficiaries: 2000,
  },
];

export default function PartnerProfile() {
  const { slug } = useParams<{ slug: string }>();
  const [partner, setPartner] = useState<DisplayPartner | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("projects");

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Mock partner data
      setPartner({
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
        description:
          "Water For Life Foundation is a Netherlands-based NGO dedicated to solving the global water crisis. Since 2015, we have been working tirelessly to provide clean, safe drinking water to communities across Africa and Asia. Our approach combines infrastructure development, community education, and sustainable maintenance programs to ensure long-term impact.",
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
          rating: 4.6,
          reviewCount: 156,
          totalDonors: 1250,
        },
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2024-01-15"),
      });
      setProjects(MOCK_PROJECTS);
      setIsLoading(false);
    }, 500);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading partner profile...
          </p>
        </div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 dark:text-white">
            Partner Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The partner you're looking for doesn't exist
          </p>
          <Link to="/partners">
            <Button>View All Partners</Button>
          </Link>
        </div>
      </div>
    );
  }

  const tierColors = {
    bronze: "from-orange-600 to-orange-800",
    silver: "from-gray-600 to-gray-800",
    gold: "from-yellow-600 to-yellow-800",
    platinum: "from-purple-600 to-purple-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Cover Image */}
      <div
        className={`relative h-64 md:h-80 bg-gradient-to-r ${tierColors[partner.tier]}`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Profile Header */}
      <div className="max-w-6xl mx-auto px-4 -mt-24 relative z-10">
        <Card className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo */}
            <div className="w-32 h-32 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center flex-shrink-0 border-4 border-white dark:border-gray-700">
              <Building className="w-16 h-16 text-gray-600 dark:text-gray-400" />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold dark:text-white">
                      {partner.organizationName}
                    </h1>
                    {partner.verification.verified && (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                  </div>
                  <Badge className="mb-3">
                    {partner.tier.toUpperCase()} Partner
                  </Badge>
                </div>
                <Link to="/donate">
                  <Button size="lg">
                    <Heart className="w-4 h-4 mr-2" />
                    Donate
                  </Button>
                </Link>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {partner.mission}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {partner.stats.totalProjects}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Projects
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    €{(partner.stats.totalFundsRaised / 1000).toFixed(0)}K
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Funds Raised
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {partner.stats.totalDonors.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Donors
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {partner.stats.impactScore}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Impact Score
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t dark:border-gray-700">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                {partner.address.city}, {partner.address.country}
              </span>
            </div>
            {partner.website && (
              <a
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm">Visit Website</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Founded {partner.foundedYear}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Content Tabs */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="impact">Impact</TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold dark:text-white">
                Active Projects
              </h2>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {projects.length} projects
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => {
                const progress =
                  (project.currentFunding / project.fundingGoal) * 100;
                const statusColors = {
                  planning:
                    "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
                  active:
                    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
                  funded:
                    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                  completed:
                    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
                };

                return (
                  <Card key={project.id} className="overflow-hidden">
                    <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600" />
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold dark:text-white">
                          {project.title}
                        </h3>
                        <Badge className={statusColors[project.status]}>
                          {project.status}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {project.shortDescription}
                      </p>

                      <div className="space-y-4">
                        {/* Progress */}
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600 dark:text-gray-400">
                              Progress
                            </span>
                            <span className="font-semibold dark:text-white">
                              {progress.toFixed(0)}%
                            </span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>

                        {/* Funding */}
                        <div className="flex justify-between text-sm">
                          <div>
                            <div className="font-semibold text-green-600 dark:text-green-400">
                              €{project.currentFunding.toLocaleString()}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">
                              raised
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold dark:text-white">
                              €{project.fundingGoal.toLocaleString()}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">
                              goal
                            </div>
                          </div>
                        </div>

                        {/* Location & Beneficiaries */}
                        <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {project.location.city},{" "}
                              {project.location.country}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Users className="w-4 h-4" />
                            <span>
                              {project.beneficiaries.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <Link to="/donate">
                          <Button className="w-full">
                            Support This Project
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">
                About Us
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                {partner.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 dark:text-white">
                    Operating Countries
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {partner.operatingCountries.map((country) => (
                      <Badge key={country} variant="outline">
                        {country}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 dark:text-white">
                    Focus Areas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {partner.focusAreas.map((area) => (
                      <Badge key={area} variant="outline">
                        {area.replace("_", " ")}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 dark:text-white">
                    Contact Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4" />
                      <a
                        href={`mailto:${partner.email}`}
                        className="hover:text-blue-600"
                      >
                        {partner.email}
                      </a>
                    </div>
                    {partner.phone && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Phone className="w-4 h-4" />
                        <span>{partner.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 dark:text-white">
                    Registration
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <p>Registration #: {partner.registrationNumber}</p>
                    <p>Founded: {partner.foundedYear}</p>
                    <p>
                      Verified:{" "}
                      {partner.verification.verified ? (
                        <span className="text-green-600 dark:text-green-400">
                          ✓ Yes
                        </span>
                      ) : (
                        <span className="text-gray-400">Pending</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Impact Tab */}
          <TabsContent value="impact" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {partner.stats.activeProjects}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Active Projects
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {partner.stats.completedProjects}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Completed Projects
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  {partner.stats.totalDonors.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Donors
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                  {partner.stats.impactScore}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Impact Score
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 dark:text-white">
                Impact Over Time
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Total Funds Raised
                    </span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      €{partner.stats.totalFundsRaised.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Project Success Rate
                    </span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {Math.round(
                        (partner.stats.completedProjects /
                          partner.stats.totalProjects) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      (partner.stats.completedProjects /
                        partner.stats.totalProjects) *
                      100
                    }
                    className="h-2"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
