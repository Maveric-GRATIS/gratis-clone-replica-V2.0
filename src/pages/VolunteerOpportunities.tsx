/**
 * Volunteer Opportunities Page
 * Part 9 - Section 46: Browse and apply for volunteer positions
 */

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Heart,
  MapPin,
  Clock,
  Users,
  Calendar,
  Search,
  Filter,
  Globe,
  CheckCircle2,
} from "lucide-react";
import type { VolunteerOpportunity } from "@/types/volunteer";

const MOCK_OPPORTUNITIES: VolunteerOpportunity[] = [
  {
    id: "1",
    title: "Food Bank Distribution Assistant",
    description:
      "Help distribute food packages to families in need. Tasks include organizing donations, packing boxes, and assisting with distribution.",
    type: "ongoing",
    organization: "Local Food Bank",
    location: {
      address: "123 Main Street",
      city: "Amsterdam",
      country: "Netherlands",
    },
    isVirtual: false,
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    requiredSkills: ["Organization", "Physical fitness", "Customer service"],
    skillLevel: "beginner",
    numberOfVolunteers: 0,
    volunteersNeeded: 8,
    volunteersAssigned: 3,
    hoursPerWeek: 4,
    commitment: "4 hours per week, flexible schedule",
    benefits: ["Free meals", "Training provided", "Certificate of service"],
    imageUrl:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=400&fit=crop",
    contactPerson: {
      name: "Sarah Johnson",
      email: "sarah@foodbank.org",
      phone: "+31 20 123 4567",
    },
    status: "published",
    tags: ["food", "community", "recurring"],
    createdBy: "org-1",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    title: "Environmental Clean-up Event",
    description:
      "Join us for a weekend beach and park clean-up initiative. Help protect our environment and marine life.",
    type: "event",
    organization: "Green Earth Foundation",
    location: {
      address: "Zandvoort Beach",
      city: "Zandvoort",
      country: "Netherlands",
    },
    isVirtual: false,
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    requiredSkills: ["Teamwork", "Environmental awareness"],
    skillLevel: "beginner",
    numberOfVolunteers: 0,
    volunteersNeeded: 50,
    volunteersAssigned: 32,
    commitment: "1 weekend (Saturday-Sunday)",
    benefits: ["T-shirt", "Lunch provided", "Community impact"],
    imageUrl:
      "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&h=400&fit=crop",
    contactPerson: {
      name: "Mike Green",
      email: "mike@greenearth.org",
    },
    status: "published",
    tags: ["environment", "outdoor", "event"],
    createdBy: "org-2",
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "3",
    title: "Online Tutoring for Children",
    description:
      "Provide virtual tutoring support to underprivileged children in math, science, or languages.",
    type: "virtual",
    organization: "Education for All",
    isVirtual: true,
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    requiredSkills: ["Teaching", "Patience", "Communication"],
    skillLevel: "intermediate",
    numberOfVolunteers: 0,
    volunteersNeeded: 20,
    volunteersAssigned: 12,
    hoursPerWeek: 3,
    commitment: "3 hours per week, minimum 3 months",
    benefits: ["Teaching experience", "References", "Online training"],
    imageUrl:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop",
    contactPerson: {
      name: "Emma Davis",
      email: "emma@educationforall.org",
    },
    status: "published",
    tags: ["education", "virtual", "children"],
    createdBy: "org-3",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

export default function VolunteerOpportunities() {
  const [opportunities] = useState(MOCK_OPPORTUNITIES);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [skillFilter, setSkillFilter] = useState<string>("all");

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || opp.type === typeFilter;
    const matchesSkill =
      skillFilter === "all" || opp.skillLevel === skillFilter;

    return matchesSearch && matchesType && matchesSkill;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "event":
        return "📅";
      case "ongoing":
        return "🔄";
      case "project":
        return "🎯";
      case "virtual":
        return "💻";
      default:
        return "📋";
    }
  };

  const getSkillBadge = (level: string) => {
    const colors = {
      beginner: "bg-green-100 text-green-800",
      intermediate: "bg-blue-100 text-blue-800",
      advanced: "bg-orange-100 text-orange-800",
      expert: "bg-purple-100 text-purple-800",
    };
    return (
      <Badge className={colors[level as keyof typeof colors] || ""}>
        {level}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Heart className="h-8 w-8 text-red-600" />
          Volunteer Opportunities
        </h1>
        <p className="text-muted-foreground">
          Find meaningful ways to give back to your community
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="virtual">Virtual</SelectItem>
              </SelectContent>
            </Select>

            <Select value={skillFilter} onValueChange={setSkillFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Skill Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{opportunities.length}</p>
                <p className="text-sm text-muted-foreground">
                  Active Opportunities
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {opportunities.reduce(
                    (sum, o) => sum + o.volunteersAssigned,
                    0,
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  Volunteers Engaged
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-purple-100">
                <Globe className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {opportunities.filter((o) => o.isVirtual).length}
                </p>
                <p className="text-sm text-muted-foreground">
                  Virtual Opportunities
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Opportunities List */}
      <div className="grid gap-6">
        {filteredOpportunities.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No opportunities found matching your criteria
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredOpportunities.map((opportunity) => (
            <Card
              key={opportunity.id}
              className="overflow-hidden hover:shadow-lg transition"
            >
              <div className="md:flex">
                {opportunity.imageUrl && (
                  <div className="md:w-1/3">
                    <img
                      src={opportunity.imageUrl}
                      alt={opportunity.title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                )}
                <div className="md:w-2/3 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">
                          {getTypeIcon(opportunity.type)}
                        </span>
                        <h3 className="text-xl font-bold">
                          {opportunity.title}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {opportunity.organization}
                      </p>
                    </div>
                    {getSkillBadge(opportunity.skillLevel)}
                  </div>

                  <p className="text-sm mb-4 line-clamp-2">
                    {opportunity.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {opportunity.isVirtual ? (
                        <>
                          <Globe className="h-4 w-4" />
                          <span>Virtual / Remote</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="h-4 w-4" />
                          <span>
                            {opportunity.location?.city},{" "}
                            {opportunity.location?.country}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Starts {opportunity.startDate.toLocaleDateString()}
                      </span>
                    </div>

                    {opportunity.hoursPerWeek && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{opportunity.hoursPerWeek} hours/week</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>
                        {opportunity.volunteersAssigned}/
                        {opportunity.volunteersNeeded} volunteers
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {opportunity.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <Button>Apply Now</Button>
                    <Button variant="outline">Learn More</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
