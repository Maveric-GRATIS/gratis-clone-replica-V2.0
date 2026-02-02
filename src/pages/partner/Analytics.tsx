/**
 * Partner Analytics Dashboard
 *
 * Analytics and insights for partner organizations.
 * Part 6 - Section 29: Partner Analytics & Payouts
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  DollarSign,
  Users,
  Eye,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// Mock analytics data
const ANALYTICS_DATA = {
  overview: {
    totalRevenue: 245000,
    revenueGrowth: 15.3,
    totalDonors: 1234,
    donorsGrowth: 12.5,
    avgDonation: 198,
    avgDonationGrowth: 8.2,
    totalViews: 45320,
    viewsGrowth: -3.1,
  },
  monthlyRevenue: [
    { month: "Jan", revenue: 18000 },
    { month: "Feb", revenue: 22000 },
    { month: "Mar", revenue: 19000 },
    { month: "Apr", revenue: 25000 },
    { month: "May", revenue: 28000 },
    { month: "Jun", revenue: 32000 },
  ],
  topProjects: [
    { name: "Clean Water for Rural Kenya", revenue: 85000, donors: 542 },
    { name: "School Sanitation Program", revenue: 62000, donors: 398 },
    { name: "Emergency Water Relief", revenue: 45000, donors: 294 },
  ],
  donorDemographics: {
    byCountry: [
      { country: "Netherlands", percentage: 45, count: 555 },
      { country: "Germany", percentage: 25, count: 309 },
      { country: "United Kingdom", percentage: 15, count: 185 },
      { country: "Belgium", percentage: 10, count: 123 },
      { country: "Other", percentage: 5, count: 62 },
    ],
    byDonationType: [
      { type: "One-time", percentage: 70, count: 864 },
      { type: "Recurring", percentage: 30, count: 370 },
    ],
  },
};

export default function PartnerAnalytics() {
  const { overview, monthlyRevenue, topProjects, donorDemographics } =
    ANALYTICS_DATA;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-gray-600">Track your performance and growth</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Revenue</span>
              <DollarSign className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold mb-1">
              €{(overview.totalRevenue / 1000).toFixed(0)}K
            </p>
            <div className="flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">
                +{overview.revenueGrowth}% vs last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Donors</span>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold mb-1">
              {overview.totalDonors.toLocaleString()}
            </p>
            <div className="flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">
                +{overview.donorsGrowth}% vs last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Avg Donation</span>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold mb-1">€{overview.avgDonation}</p>
            <div className="flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">
                +{overview.avgDonationGrowth}% vs last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Views</span>
              <Eye className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold mb-1">
              {overview.totalViews.toLocaleString()}
            </p>
            <div className="flex items-center gap-1">
              <ArrowDownRight className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-600">
                {overview.viewsGrowth}% vs last period
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {monthlyRevenue.map((data, index) => {
                const maxRevenue = Math.max(
                  ...monthlyRevenue.map((d) => d.revenue),
                );
                const percentage = (data.revenue / maxRevenue) * 100;

                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{data.month}</span>
                      <span className="text-sm font-semibold">
                        €{(data.revenue / 1000).toFixed(1)}K
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topProjects.map((project, index) => (
              <div key={index} className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary"># {index + 1}</Badge>
                    <span className="font-medium text-sm">{project.name}</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {project.donors} donors
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    €{(project.revenue / 1000).toFixed(0)}K
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Donor Demographics by Country */}
        <Card>
          <CardHeader>
            <CardTitle>Donors by Country</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {donorDemographics.byCountry.map((data, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{data.country}</span>
                  <span className="text-sm text-gray-600">
                    {data.count} ({data.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${data.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Donation Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Donation Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {donorDemographics.byDonationType.map((data, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-semibold">{data.type}</p>
                  <p className="text-sm text-gray-600">{data.count} donors</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{data.percentage}%</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Period Selector */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <span className="font-medium">Viewing data for:</span>
            <Badge variant="outline">Last 6 Months</Badge>
          </div>
          <div className="text-sm text-gray-600">
            Updated: {new Date().toLocaleDateString()}{" "}
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </Card>
    </div>
  );
}
