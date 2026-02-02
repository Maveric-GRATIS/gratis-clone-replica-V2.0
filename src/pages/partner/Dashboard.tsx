/**
 * Partner Dashboard Overview
 *
 * Main dashboard page for partner organizations.
 * Part 6 - Section 27: Partner Dashboard
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  DollarSign,
  Users,
  Heart,
  Plus,
  Eye,
  ArrowUpRight,
  Clock,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock data - in real app, this would come from Firebase based on authenticated partner
const MOCK_DASHBOARD_DATA = {
  partner: {
    name: "Clean Water Foundation",
    tier: "gold",
    verified: true,
    memberSince: "2024-01-01",
  },
  stats: {
    activeProjects: 8,
    totalFunding: 245000,
    totalDonors: 1234,
    beneficiariesReached: 50000,
  },
  recentProjects: [
    {
      id: "1",
      title: "Clean Water for Rural Kenya",
      status: "active",
      fundingGoal: 50000,
      fundingCurrent: 42000,
      donors: 234,
      views: 5432,
    },
    {
      id: "2",
      title: "School Sanitation Program Uganda",
      status: "active",
      fundingGoal: 30000,
      fundingCurrent: 18500,
      donors: 156,
      views: 3210,
    },
    {
      id: "3",
      title: "Emergency Water Relief Tanzania",
      status: "completed",
      fundingGoal: 25000,
      fundingCurrent: 25000,
      donors: 198,
      views: 2876,
    },
  ],
  recentDonations: [
    {
      id: "1",
      donorName: "Anonymous",
      amount: 500,
      projectTitle: "Clean Water for Rural Kenya",
      date: new Date("2024-01-20"),
    },
    {
      id: "2",
      donorName: "Sarah M.",
      amount: 100,
      projectTitle: "School Sanitation Program Uganda",
      date: new Date("2024-01-19"),
    },
    {
      id: "3",
      donorName: "Michael K.",
      amount: 250,
      projectTitle: "Clean Water for Rural Kenya",
      date: new Date("2024-01-19"),
    },
  ],
  notifications: [
    {
      id: "1",
      type: "donation",
      message: "New donation of €500 received",
      time: "2 hours ago",
    },
    {
      id: "2",
      type: "milestone",
      message: "Project milestone completed",
      time: "5 hours ago",
    },
    {
      id: "3",
      type: "update",
      message: "Monthly report is due in 3 days",
      time: "1 day ago",
    },
  ],
};

export default function PartnerDashboard() {
  const { partner, stats, recentProjects, recentDonations, notifications } =
    MOCK_DASHBOARD_DATA;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {partner.name}!</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="default" className="bg-yellow-500">
              {partner.tier.toUpperCase()} TIER
            </Badge>
            {partner.verified && (
              <Badge variant="default" className="flex items-center gap-1">
                <span className="text-xs">✓</span> Verified Partner
              </Badge>
            )}
          </div>
        </div>
        <Button asChild size="lg">
          <Link to="/partner/projects/new">
            <Plus className="w-5 h-5 mr-2" />
            Create New Project
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Projects</p>
                <p className="text-3xl font-bold">{stats.activeProjects}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +2 this month
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Funding</p>
                <p className="text-3xl font-bold">
                  €{(stats.totalFunding / 1000).toFixed(0)}K
                </p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +15% this month
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Donors</p>
                <p className="text-3xl font-bold">
                  {stats.totalDonors.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +87 this month
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Beneficiaries</p>
                <p className="text-3xl font-bold">
                  {(stats.beneficiariesReached / 1000).toFixed(0)}K
                </p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +5.2K this month
                </p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Projects</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/partner/projects">View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentProjects.map((project) => {
                const progress =
                  (project.fundingCurrent / project.fundingGoal) * 100;

                return (
                  <div key={project.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{project.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Badge
                            variant={
                              project.status === "active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {project.status}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {project.views.toLocaleString()} views
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/partner/projects/${project.id}`}>
                          Manage
                        </Link>
                      </Button>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">
                          €{project.fundingCurrent.toLocaleString()} raised
                        </span>
                        <span className="font-medium">
                          {progress.toFixed(0)}% of €
                          {project.fundingGoal.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {project.donors} donors
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Donations */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Donations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentDonations.map((donation) => (
                <div
                  key={donation.id}
                  className="flex items-start gap-3 pb-3 border-b last:border-0"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">€{donation.amount}</p>
                    <p className="text-sm text-gray-600 truncate">
                      {donation.donorName} •{" "}
                      {donation.projectTitle.substring(0, 30)}...
                    </p>
                    <p className="text-xs text-gray-500">
                      {donation.date.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/partner/donations">View All Donations</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-3 pb-3 border-b last:border-0"
                >
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.time}
                    </p>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/partner/notifications">View All</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
