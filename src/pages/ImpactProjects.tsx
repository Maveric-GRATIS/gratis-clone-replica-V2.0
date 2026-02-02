import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SEO } from "@/components/SEO";
import { PageHero } from "@/components/PageHero";
import {
  Search,
  Droplet,
  Utensils,
  GraduationCap,
  Trees,
  Heart,
  Building2,
  Users,
  Euro,
  Check,
  MapPin,
  Calendar,
  TrendingUp,
} from "lucide-react";
import type {
  ImpactProject,
  ProjectStatus,
  ImpactCategory,
} from "@/types/impact";

// Impact category configurations
const IMPACT_CATEGORIES: Record<
  ImpactCategory,
  { label: string; icon: typeof Droplet; color: string; description: string }
> = {
  clean_water: {
    label: "Clean Water",
    icon: Droplet,
    color: "text-blue-600",
    description: "Access to safe drinking water",
  },
  sanitation: {
    label: "Sanitation",
    icon: Building2,
    color: "text-cyan-600",
    description: "Proper sanitation facilities",
  },
  education: {
    label: "Education",
    icon: GraduationCap,
    color: "text-purple-600",
    description: "Quality education access",
  },
  reforestation: {
    label: "Reforestation",
    icon: Trees,
    color: "text-green-600",
    description: "Tree planting and forest restoration",
  },
  food_security: {
    label: "Food Security",
    icon: Utensils,
    color: "text-orange-600",
    description: "Sustainable food access",
  },
  healthcare: {
    label: "Healthcare",
    icon: Heart,
    color: "text-red-600",
    description: "Medical care and support",
  },
};

// Status configurations
const statusConfig: Record<
  ProjectStatus,
  { label: string; color: string; bgColor: string }
> = {
  proposed: {
    label: "Proposed",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
  },
  voting: {
    label: "Voting",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  approved: {
    label: "Approved",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  in_progress: {
    label: "In Progress",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  completed: {
    label: "Completed",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
};

// Mock projects data
const mockProjects: ImpactProject[] = [
  {
    id: "1",
    title: "Clean Water Wells in Kenya",
    slug: "clean-water-wells-kenya",
    description:
      "Building sustainable water wells in rural Kenyan communities to provide clean drinking water access to over 5,000 people.",
    shortDescription:
      "Providing clean water access to 5,000+ people in rural Kenya",
    category: "clean_water",
    tags: ["water", "africa", "infrastructure"],
    location: { country: "Kenya", region: "Turkana County" },
    coverImage:
      "https://images.unsplash.com/photo-1578489758854-f134a358f08b?w=800&h=600&fit=crop",
    gallery: [],
    fundingGoal: 5000000, // €50,000
    fundingRaised: 3750000, // €37,500
    currency: "EUR",
    donorCount: 342,
    impactMetrics: [
      { metric: "People Served", value: 5000, unit: "people", icon: "users" },
      { metric: "Wells Built", value: 10, unit: "wells", icon: "droplet" },
    ],
    beneficiaries: { count: 5000, description: "Community members in Turkana" },
    status: "in_progress",
    isFeatured: true,
    updates: [],
    milestones: [],
    topDonors: [],
    createdAt: new Date("2025-06-01"),
    updatedAt: new Date("2026-01-15"),
  },
  {
    id: "2",
    title: "School Supplies for Syrian Refugee Children",
    slug: "school-supplies-syria",
    description:
      "Providing educational materials and school supplies to Syrian refugee children in Lebanon camps.",
    shortDescription: "Education support for 1,000+ refugee children",
    category: "education",
    tags: ["education", "refugees", "children"],
    location: { country: "Lebanon", region: "Bekaa Valley" },
    coverImage:
      "https://images.unsplash.com/photo-1497375988099-1f3e4e26279e?w=800&h=600&fit=crop",
    gallery: [],
    fundingGoal: 2500000, // €25,000
    fundingRaised: 2100000, // €21,000
    currency: "EUR",
    donorCount: 198,
    impactMetrics: [
      {
        metric: "Children Helped",
        value: 1200,
        unit: "children",
        icon: "users",
      },
      {
        metric: "Schools Supported",
        value: 8,
        unit: "schools",
        icon: "building",
      },
    ],
    beneficiaries: { count: 1200, description: "Refugee children in camps" },
    status: "in_progress",
    isFeatured: true,
    updates: [],
    milestones: [],
    topDonors: [],
    createdAt: new Date("2025-08-15"),
    updatedAt: new Date("2026-01-20"),
  },
  {
    id: "3",
    title: "Reforestation Project in Amazon Rainforest",
    slug: "amazon-reforestation",
    description:
      "Planting 100,000 native trees in deforested areas of the Amazon to restore biodiversity and combat climate change.",
    shortDescription: "Planting 100,000 trees in the Amazon",
    category: "reforestation",
    tags: ["environment", "trees", "climate"],
    location: { country: "Brazil", region: "Pará State" },
    coverImage:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop",
    gallery: [],
    fundingGoal: 7500000, // €75,000
    fundingRaised: 4200000, // €42,000
    currency: "EUR",
    donorCount: 521,
    impactMetrics: [
      { metric: "Trees Planted", value: 56000, unit: "trees", icon: "trees" },
      { metric: "Area Restored", value: 50, unit: "hectares", icon: "map" },
    ],
    beneficiaries: { count: 0, description: "Global climate impact" },
    status: "in_progress",
    isFeatured: true,
    updates: [],
    milestones: [],
    topDonors: [],
    createdAt: new Date("2025-05-01"),
    updatedAt: new Date("2026-01-25"),
  },
  {
    id: "4",
    title: "Community Food Garden in South Africa",
    slug: "community-food-garden-sa",
    description:
      "Establishing sustainable community gardens in townships to improve food security and nutrition.",
    shortDescription: "Creating food gardens for 500+ families",
    category: "food_security",
    tags: ["food", "agriculture", "community"],
    location: { country: "South Africa", region: "Eastern Cape" },
    coverImage:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop",
    gallery: [],
    fundingGoal: 3000000, // €30,000
    fundingRaised: 2700000, // €27,000
    currency: "EUR",
    donorCount: 156,
    impactMetrics: [
      {
        metric: "Families Served",
        value: 500,
        unit: "families",
        icon: "users",
      },
      { metric: "Gardens Created", value: 12, unit: "gardens", icon: "flower" },
    ],
    beneficiaries: { count: 2000, description: "Community members" },
    status: "in_progress",
    isFeatured: false,
    updates: [],
    milestones: [],
    topDonors: [],
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date("2026-01-18"),
  },
  {
    id: "5",
    title: "Mobile Health Clinic for Rural India",
    slug: "mobile-health-india",
    description:
      "Deploying mobile health clinics to provide medical care to remote villages in rural India.",
    shortDescription: "Healthcare access for 10,000+ rural residents",
    category: "healthcare",
    tags: ["health", "medical", "rural"],
    location: { country: "India", region: "Bihar" },
    coverImage:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&h=600&fit=crop",
    gallery: [],
    fundingGoal: 10000000, // €100,000
    fundingRaised: 6500000, // €65,000
    currency: "EUR",
    donorCount: 423,
    impactMetrics: [
      {
        metric: "Patients Treated",
        value: 8500,
        unit: "patients",
        icon: "heart",
      },
      {
        metric: "Villages Served",
        value: 45,
        unit: "villages",
        icon: "map-pin",
      },
    ],
    beneficiaries: { count: 10000, description: "Rural villagers" },
    status: "in_progress",
    isFeatured: true,
    updates: [],
    milestones: [],
    topDonors: [],
    createdAt: new Date("2025-07-01"),
    updatedAt: new Date("2026-01-22"),
  },
  {
    id: "6",
    title: "Sanitation Facilities in Bangladesh",
    slug: "sanitation-bangladesh",
    description:
      "Building proper sanitation facilities and toilets in rural Bangladeshi communities.",
    shortDescription: "Sanitation access for 3,000+ people",
    category: "sanitation",
    tags: ["sanitation", "infrastructure", "health"],
    location: { country: "Bangladesh", region: "Sylhet Division" },
    coverImage:
      "https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=800&h=600&fit=crop",
    gallery: [],
    fundingGoal: 4000000, // €40,000
    fundingRaised: 4000000, // €40,000
    currency: "EUR",
    donorCount: 287,
    impactMetrics: [
      {
        metric: "Facilities Built",
        value: 85,
        unit: "toilets",
        icon: "building",
      },
      { metric: "People Served", value: 3400, unit: "people", icon: "users" },
    ],
    beneficiaries: { count: 3400, description: "Community residents" },
    status: "completed",
    isFeatured: false,
    updates: [],
    milestones: [],
    topDonors: [],
    createdAt: new Date("2024-11-01"),
    updatedAt: new Date("2025-12-15"),
  },
];

// Format currency
const formatCurrency = (cents: number, currency: string) => {
  const amount = cents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format number
const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-US").format(num);
};

export default function ImpactProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");

  // Calculate stats
  const stats = useMemo(() => {
    return {
      activeProjects: mockProjects.filter((p) => p.status === "in_progress")
        .length,
      totalRaised: mockProjects.reduce((sum, p) => sum + p.fundingRaised, 0),
      totalDonors: mockProjects.reduce((sum, p) => sum + p.donorCount, 0),
      completedProjects: mockProjects.filter((p) => p.status === "completed")
        .length,
    };
  }, []);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = [...mockProjects];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((p) => p.status === selectedStatus);
    }

    // Sort
    switch (sortBy) {
      case "featured":
        filtered.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
        break;
      case "funding":
        filtered.sort((a, b) => b.fundingRaised - a.fundingRaised);
        break;
      case "donors":
        filtered.sort((a, b) => b.donorCount - a.donorCount);
        break;
      case "newest":
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedStatus, sortBy]);

  return (
    <>
      <SEO
        title="Impact Projects"
        description="Explore and support our global impact projects making a difference worldwide"
      />

      <PageHero
        title="Impact Projects"
        subtitle="Support real change. Every project is democratically chosen by our TRIBE members."
      />

      <div className="container py-12 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.activeProjects}</p>
                  <p className="text-xs text-muted-foreground">
                    Active Projects
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Euro className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {formatCurrency(stats.totalRaised, "EUR")}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Raised</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {formatNumber(stats.totalDonors)}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Donors</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Check className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {stats.completedProjects}
                  </p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category */}
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(IMPACT_CATEGORIES).map(([key, cat]) => (
                    <SelectItem key={key} value={key}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status */}
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full lg:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full lg:w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="funding">Most Funded</SelectItem>
                  <SelectItem value="donors">Most Donors</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          {filteredProjects.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <p className="text-lg text-muted-foreground">
                No projects found matching your criteria.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProjects.map((project, index) => {
                const Icon = IMPACT_CATEGORIES[project.category].icon;
                const fundingPercent =
                  (project.fundingRaised / project.fundingGoal) * 100;

                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={project.coverImage}
                          alt={project.title}
                          className="object-cover w-full h-full"
                        />
                        {project.isFeatured && (
                          <Badge className="absolute top-2 left-2 bg-[hsl(var(--brand-yellow))] text-black">
                            Featured
                          </Badge>
                        )}
                        <Badge
                          className={`absolute top-2 right-2 ${statusConfig[project.status].bgColor} ${statusConfig[project.status].color}`}
                        >
                          {statusConfig[project.status].label}
                        </Badge>
                      </div>

                      <CardHeader>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Icon
                            className={`h-4 w-4 ${IMPACT_CATEGORIES[project.category].color}`}
                          />
                          <span>
                            {IMPACT_CATEGORIES[project.category].label}
                          </span>
                          <span>•</span>
                          <MapPin className="h-3 w-3" />
                          <span>{project.location.country}</span>
                        </div>
                        <CardTitle className="line-clamp-2">
                          {project.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                          {project.shortDescription}
                        </p>
                      </CardHeader>

                      <CardContent className="flex-1">
                        <div className="space-y-4">
                          {/* Funding Progress */}
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="font-semibold">
                                {formatCurrency(
                                  project.fundingRaised,
                                  project.currency,
                                )}
                              </span>
                              <span className="text-muted-foreground">
                                {formatCurrency(
                                  project.fundingGoal,
                                  project.currency,
                                )}
                              </span>
                            </div>
                            <Progress value={fundingPercent} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-1">
                              {fundingPercent.toFixed(0)}% funded •{" "}
                              {formatNumber(project.donorCount)} donors
                            </p>
                          </div>

                          {/* Impact Metrics */}
                          <div className="grid grid-cols-2 gap-2">
                            {project.impactMetrics
                              .slice(0, 2)
                              .map((metric, i) => (
                                <div
                                  key={i}
                                  className="text-center p-2 bg-muted rounded-lg"
                                >
                                  <p className="font-bold text-lg">
                                    {formatNumber(metric.value)}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {metric.metric}
                                  </p>
                                </div>
                              ))}
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="gap-2">
                        <Button asChild className="flex-1">
                          <Link to={`/impact/projects/${project.slug}`}>
                            View Project
                          </Link>
                        </Button>
                        <Button asChild variant="outline">
                          <Link to={`/spark/donate?project=${project.id}`}>
                            Donate
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
