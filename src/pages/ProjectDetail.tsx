import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SEO } from "@/components/SEO";
import {
  Droplet,
  Utensils,
  GraduationCap,
  Trees,
  Heart,
  Building2,
  MapPin,
  Calendar,
  Users,
  Check,
  Clock,
  Share2,
  Bookmark,
  ArrowLeft,
  Euro,
} from "lucide-react";
import type { ImpactProject, ImpactCategory } from "@/types/impact";

// Category configurations (same as ImpactProjects)
const IMPACT_CATEGORIES: Record<
  ImpactCategory,
  { label: string; icon: typeof Droplet; color: string }
> = {
  clean_water: { label: "Clean Water", icon: Droplet, color: "text-blue-600" },
  sanitation: { label: "Sanitation", icon: Building2, color: "text-cyan-600" },
  education: {
    label: "Education",
    icon: GraduationCap,
    color: "text-purple-600",
  },
  reforestation: {
    label: "Reforestation",
    icon: Trees,
    color: "text-green-600",
  },
  food_security: {
    label: "Food Security",
    icon: Utensils,
    color: "text-orange-600",
  },
  healthcare: { label: "Healthcare", icon: Heart, color: "text-red-600" },
};

// Mock project data (would come from API/database)
const mockProject: ImpactProject = {
  id: "1",
  title: "Clean Water Wells in Kenya",
  slug: "clean-water-wells-kenya",
  description: `Building sustainable water wells in rural Kenyan communities to provide clean drinking water access to over 5.000 people.

## The Challenge

In Turkana County, Kenya, many communities lack access to clean drinking water. People must walk several kilometers daily to collect water from contaminated sources, leading to waterborne diseases and lost time for education and economic activities.

## Our Solution

We're constructing 10 deep-bore water wells equipped with solar-powered pumps. Each well serves approximately 500 people and includes:

- Deep-bore drilling to reach clean aquifers
- Solar-powered pumping systems for sustainability
- Storage tanks for consistent supply
- Community training for maintenance
- Water quality monitoring systems

## Long-term Impact

These wells will provide:
- Clean water access for 5.000+ people
- Reduced waterborne disease rates
- More time for education and work
- Sustainable community-managed infrastructure
- Improved quality of life for entire communities`,
  shortDescription:
    "Providing clean water access to 5.000+ people in rural Kenya",
  category: "clean_water",
  tags: ["water", "africa", "infrastructure", "sustainability"],
  location: {
    country: "Kenya",
    region: "Turkana County",
    coordinates: { lat: 3.1167, lng: 35.6 },
  },
  coverImage:
    "https://images.unsplash.com/photo-1578489758854-f134a358f08b?w=1200&h=600&fit=crop",
  gallery: [
    "https://images.unsplash.com/photo-1578489758854-f134a358f08b?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1594398901394-4e34939a4fd0?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1509099863731-ef4bff19e808?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
  ],
  videoUrl: "https://www.youtube.com/watch?v=example",
  fundingGoal: 5000000, // €50.000
  fundingRaised: 3750000, // €37.500
  currency: "EUR",
  donorCount: 342,
  startDate: new Date("2025-06-01"),
  estimatedCompletion: new Date("2026-12-31"),
  impactMetrics: [
    { metric: "People Served", value: 5000, unit: "people", icon: "users" },
    { metric: "Wells Built", value: 10, unit: "wells", icon: "droplet" },
    { metric: "Liters/Day", value: 50000, unit: "liters", icon: "droplet" },
    {
      metric: "Villages Reached",
      value: 12,
      unit: "villages",
      icon: "map-pin",
    },
  ],
  beneficiaries: {
    count: 5000,
    description: "Community members in Turkana County",
  },
  partner: {
    id: "water-org",
    name: "Water.org",
    logo: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=100&h=100&fit=crop",
    website: "https://water.org",
  },
  status: "in_progress",
  isFeatured: true,
  milestones: [
    { name: "Site Assessment & Planning", date: "June 2025", completed: true },
    { name: "Drilling Well 1-3", date: "September 2025", completed: true },
    { name: "Drilling Well 4-7", date: "March 2026", completed: true },
    { name: "Drilling Well 8-10", date: "September 2026", completed: false },
    { name: "Community Training", date: "November 2026", completed: false },
    { name: "Project Completion", date: "December 2026", completed: false },
  ],
  updates: [
    {
      id: "u1",
      projectId: "1",
      title: "Wells 4-7 Completed Successfully!",
      content:
        "We're thrilled to announce that wells 4 through 7 have been completed ahead of schedule. These wells are now serving over 2.000 additional community members with clean water. The solar pumps are working efficiently, and local maintenance teams have been trained.",
      images: [
        "https://images.unsplash.com/photo-1594398901394-4e34939a4fd0?w=800&h=400&fit=crop",
        "https://images.unsplash.com/photo-1509099863731-ef4bff19e808?w=800&h=400&fit=crop",
      ],
      createdAt: new Date("2026-01-15"),
    },
    {
      id: "u2",
      projectId: "1",
      title: "Community Celebration for First Wells",
      content:
        "The communities celebrated as the first three wells began providing clean water. Attendance at local schools has increased by 30% as children no longer need to spend hours fetching water. Health workers report a significant decrease in waterborne illness cases.",
      images: [
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop",
      ],
      createdAt: new Date("2025-10-01"),
    },
    {
      id: "u3",
      projectId: "1",
      title: "Project Kickoff and Site Assessment",
      content:
        "Our team has completed the initial site assessment in Turkana County. We've identified optimal drilling locations for all 10 wells, working closely with community leaders to ensure maximum impact and accessibility.",
      images: [],
      createdAt: new Date("2025-06-15"),
    },
  ],
  topDonors: [
    {
      name: "Sarah Johnson",
      amount: 50000,
      avatar: "https://i.pravatar.cc/150?u=sarah",
      date: new Date("2025-11-20"),
    },
    {
      name: "Marcus Chen",
      amount: 30000,
      avatar: "https://i.pravatar.cc/150?u=marcus",
      date: new Date("2025-12-05"),
    },
    {
      name: "Emma Rodriguez",
      amount: 25000,
      avatar: "https://i.pravatar.cc/150?u=emma",
      date: new Date("2025-08-10"),
    },
    {
      name: "David Thompson",
      amount: 20000,
      date: new Date("2025-09-15"),
    },
    {
      name: "Lisa Anderson",
      amount: 15000,
      date: new Date("2026-01-05"),
    },
  ],
  createdAt: new Date("2025-06-01"),
  updatedAt: new Date("2026-01-15"),
};

const formatCurrency = (cents: number, currency: string) => {
  const amount = cents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-US").format(num);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // In a real app, fetch project by slug
  const project = mockProject;

  if (!project) {
    return (
      <div className="container py-12 text-center">
        <p className="text-lg text-muted-foreground">Project not found.</p>
        <Button asChild className="mt-4">
          <Link to="/impact/projects">Back to Projects</Link>
        </Button>
      </div>
    );
  }

  const Icon = IMPACT_CATEGORIES[project.category].icon;
  const fundingProgress = (project.fundingRaised / project.fundingGoal) * 100;

  // Parse description paragraphs
  const descriptionParagraphs = project.description.split("\n");

  return (
    <>
      <SEO
        title={project.title}
        description={project.shortDescription}
        image={project.coverImage}
      />

      <div className="min-h-screen">
        {/* Hero Image */}
        <div className="relative h-[400px] w-full overflow-hidden">
          <img
            src={project.coverImage}
            alt={project.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Back Button */}
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-4 left-4"
            onClick={() => navigate("/impact/projects")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="container">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-5 w-5" />
                <span className="text-sm">
                  {IMPACT_CATEGORIES[project.category].label}
                </span>
                <span>•</span>
                <MapPin className="h-4 w-4" />
                <span className="text-sm">
                  {project.location.region}, {project.location.country}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
              <p className="text-lg opacity-90">{project.shortDescription}</p>
            </div>
          </div>
        </div>

        <div className="container py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Impact Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {project.impactMetrics.map((metric, i) => (
                  <Card key={i}>
                    <CardContent className="p-4 text-center">
                      <p className="text-3xl font-bold text-[hsl(var(--brand-blue))]">
                        {formatNumber(metric.value)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {metric.metric}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Tabs */}
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="updates">
                    Updates ({project.updates.length})
                  </TabsTrigger>
                  <TabsTrigger value="gallery">
                    Gallery ({project.gallery.length})
                  </TabsTrigger>
                  <TabsTrigger value="donors">
                    Donors ({project.topDonors.length}+)
                  </TabsTrigger>
                </TabsList>

                {/* About Tab */}
                <TabsContent value="about" className="mt-6 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About This Project</CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-sm max-w-none">
                      {descriptionParagraphs.map((paragraph, i) => {
                        if (paragraph.startsWith("## ")) {
                          return (
                            <h3
                              key={i}
                              className="text-lg font-semibold mt-6 mb-3"
                            >
                              {paragraph.replace("## ", "")}
                            </h3>
                          );
                        }
                        if (paragraph.startsWith("- ")) {
                          return (
                            <li key={i} className="ml-4">
                              {paragraph.replace("- ", "")}
                            </li>
                          );
                        }
                        if (paragraph.trim()) {
                          return (
                            <p key={i} className="text-muted-foreground mb-4">
                              {paragraph}
                            </p>
                          );
                        }
                        return null;
                      })}
                    </CardContent>
                  </Card>

                  {/* Timeline */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {project.milestones.map((milestone, i) => (
                          <div key={i} className="flex items-start gap-4">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                milestone.completed
                                  ? "bg-green-100"
                                  : "bg-gray-100"
                              }`}
                            >
                              {milestone.completed ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <Clock className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{milestone.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {milestone.completed ? "Completed" : "Expected"}
                                : {milestone.date}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Updates Tab */}
                <TabsContent value="updates" className="mt-6 space-y-4">
                  {project.updates.map((update) => (
                    <Card key={update.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Calendar className="h-4 w-4" />
                          {formatDate(update.createdAt)}
                        </div>
                        <h3 className="font-semibold text-lg mb-2">
                          {update.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {update.content}
                        </p>
                        {update.images.length > 0 && (
                          <div className="mt-4 grid grid-cols-3 gap-2">
                            {update.images.map((img, i) => (
                              <div
                                key={i}
                                className="relative aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => setSelectedImage(img)}
                              >
                                <img
                                  src={img}
                                  alt=""
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {/* Gallery Tab */}
                <TabsContent value="gallery" className="mt-6">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {project.gallery.map((image, i) => (
                      <div
                        key={i}
                        className="relative aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setSelectedImage(image)}
                      >
                        <img
                          src={image}
                          alt=""
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Donors Tab */}
                <TabsContent value="donors" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {project.topDonors.map((donor, i) => (
                          <div key={i} className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 font-bold text-sm">
                              {i + 1}
                            </div>
                            <Avatar>
                              <AvatarImage src={donor.avatar} />
                              <AvatarFallback>{donor.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium">{donor.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(donor.date)}
                              </p>
                            </div>
                            <p className="font-semibold text-[hsl(var(--brand-blue))]">
                              {formatCurrency(donor.amount, "EUR")}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Funding Card */}
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-3xl font-bold">
                        {formatCurrency(
                          project.fundingRaised,
                          project.currency,
                        )}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        of{" "}
                        {formatCurrency(project.fundingGoal, project.currency)}
                      </span>
                    </div>
                    <Progress
                      value={Math.min(fundingProgress, 100)}
                      className="h-3"
                    />
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-muted-foreground">
                        {Math.round(fundingProgress)}% funded
                      </span>
                      <span className="text-muted-foreground">
                        {project.donorCount} donors
                      </span>
                    </div>
                  </div>

                  {/* Donate Button */}
                  <Button asChild className="w-full mb-4" size="lg">
                    <Link to={`/spark/donate?project=${project.id}`}>
                      <Heart className="mr-2 h-5 w-5" />
                      Support This Project
                    </Link>
                  </Button>

                  {/* Share */}
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" size="sm">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                    <Button variant="outline" size="icon">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>

                  <Separator className="my-6" />

                  {/* Partner */}
                  {project.partner && (
                    <>
                      <div>
                        <p className="text-sm font-medium mb-3">
                          Implementing Partner
                        </p>
                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <img
                            src={project.partner.logo}
                            alt={project.partner.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {project.partner.name}
                            </p>
                            {project.partner.website && (
                              <a
                                href={project.partner.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-[hsl(var(--brand-blue))] hover:underline"
                              >
                                Visit Website
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      <Separator className="my-6" />
                    </>
                  )}

                  {/* Timeline */}
                  <div className="space-y-3 text-sm">
                    {project.startDate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Started</span>
                        <span>{formatDate(project.startDate)}</span>
                      </div>
                    )}
                    {project.estimatedCompletion && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Est. Completion
                        </span>
                        <span>{formatDate(project.estimatedCompletion)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Beneficiaries
                      </span>
                      <span className="font-medium">
                        {formatNumber(project.beneficiaries.count)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt=""
            className="max-w-full max-h-full object-contain"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </Button>
        </div>
      )}
    </>
  );
}
