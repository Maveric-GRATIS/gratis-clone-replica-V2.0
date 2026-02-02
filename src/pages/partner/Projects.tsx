/**
 * Partner Projects List
 *
 * List of all projects for the authenticated partner.
 * Part 6 - Section 28: Partner Project Creation & Management
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  MoreVertical,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react";

// Mock data
const MOCK_PROJECTS = [
  {
    id: "1",
    title: "Clean Water for Rural Kenya",
    status: "active",
    category: "clean_water",
    fundingGoal: 50000,
    fundingCurrent: 42000,
    donors: 234,
    views: 5432,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
  },
  {
    id: "2",
    title: "School Sanitation Program Uganda",
    status: "active",
    category: "sanitation",
    fundingGoal: 30000,
    fundingCurrent: 18500,
    donors: 156,
    views: 3210,
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-11-30"),
  },
  {
    id: "3",
    title: "Emergency Water Relief Tanzania",
    status: "completed",
    category: "clean_water",
    fundingGoal: 25000,
    fundingCurrent: 25000,
    donors: 198,
    views: 2876,
    startDate: new Date("2023-09-01"),
    endDate: new Date("2023-12-31"),
  },
  {
    id: "4",
    title: "Water Well Construction Ethiopia",
    status: "draft",
    category: "clean_water",
    fundingGoal: 40000,
    fundingCurrent: 0,
    donors: 0,
    views: 0,
    startDate: new Date("2024-03-01"),
    endDate: new Date("2024-12-31"),
  },
];

const STATUS_CONFIG = {
  draft: { label: "Draft", variant: "secondary" as const },
  pending_review: { label: "Pending Review", variant: "outline" as const },
  active: { label: "Active", variant: "default" as const },
  paused: { label: "Paused", variant: "outline" as const },
  completed: { label: "Completed", variant: "secondary" as const },
  cancelled: { label: "Cancelled", variant: "destructive" as const },
};

export default function PartnerProjectsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredProjects = MOCK_PROJECTS.filter((project) => {
    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: MOCK_PROJECTS.length,
    active: MOCK_PROJECTS.filter((p) => p.status === "active").length,
    draft: MOCK_PROJECTS.filter((p) => p.status === "draft").length,
    completed: MOCK_PROJECTS.filter((p) => p.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-gray-600">Manage your fundraising projects</p>
        </div>
        <Button asChild size="lg">
          <Link to="/partner/projects/new">
            <Plus className="w-5 h-5 mr-2" />
            Create Project
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Projects</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {stats.active}
          </div>
          <div className="text-sm text-gray-600">Active</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
          <div className="text-sm text-gray-600">Drafts</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {stats.completed}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </Card>

      {/* Projects List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => {
          const progress =
            project.fundingGoal > 0
              ? (project.fundingCurrent / project.fundingGoal) * 100
              : 0;
          const statusConfig =
            STATUS_CONFIG[project.status as keyof typeof STATUS_CONFIG];

          return (
            <Card key={project.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge variant={statusConfig.variant}>
                      {statusConfig.label}
                    </Badge>
                    <Badge variant="outline">
                      {project.category.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>

              {project.status !== "draft" && (
                <>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">
                        €{project.fundingCurrent.toLocaleString()} raised
                      </span>
                      <span className="font-medium">
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 py-3 border-t border-b">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <p className="text-lg font-semibold">
                        €{project.fundingGoal.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600">Goal</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                        <Users className="w-4 h-4" />
                      </div>
                      <p className="text-lg font-semibold">{project.donors}</p>
                      <p className="text-xs text-gray-600">Donors</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                        <Eye className="w-4 h-4" />
                      </div>
                      <p className="text-lg font-semibold">
                        {project.views.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600">Views</p>
                    </div>
                  </div>
                </>
              )}

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {project.startDate.toLocaleDateString()} -{" "}
                    {project.endDate.toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" className="flex-1" asChild>
                  <Link to={`/partner/projects/${project.id}`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Manage
                  </Link>
                </Button>
                {project.status === "active" && (
                  <Button variant="outline" asChild>
                    <Link to={`/projects/${project.id}`} target="_blank">
                      <Eye className="w-4 h-4 mr-2" />
                      View Public
                    </Link>
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
