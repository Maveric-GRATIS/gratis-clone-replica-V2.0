import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Activity,
  BarChart3,
  PieChart,
  Globe,
  Download,
  Calendar,
  Target,
  Zap,
} from "lucide-react";

export default function AdvancedAnalyticsDashboard() {
  // Mock data - in real implementation, fetch from API
  const metrics = [
    {
      id: "total-revenue",
      label: "Total Revenue",
      value: "€245,830",
      change: 12.5,
      trend: "up" as const,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      id: "total-donors",
      label: "Total Donors",
      value: "1,845",
      change: 8.2,
      trend: "up" as const,
      icon: Users,
      color: "text-blue-600",
    },
    {
      id: "avg-donation",
      label: "Avg Donation",
      value: "€133.20",
      change: -2.4,
      trend: "down" as const,
      icon: Target,
      color: "text-purple-600",
    },
    {
      id: "active-campaigns",
      label: "Active Campaigns",
      value: "24",
      change: 4,
      trend: "up" as const,
      icon: Zap,
      color: "text-orange-600",
    },
  ];

  const timeSeriesData = [
    { month: "Jan", donations: 145, revenue: 18450 },
    { month: "Feb", donations: 167, revenue: 21340 },
    { month: "Mar", donations: 189, revenue: 24780 },
    { month: "Apr", donations: 203, revenue: 27890 },
    { month: "May", donations: 178, revenue: 23560 },
    { month: "Jun", donations: 195, revenue: 26340 },
  ];

  const topCountries = [
    {
      country: "Netherlands",
      code: "NL",
      users: 1245,
      revenue: 167890,
      flag: "🇳🇱",
    },
    { country: "Belgium", code: "BE", users: 345, revenue: 45670, flag: "🇧🇪" },
    { country: "Germany", code: "DE", users: 189, revenue: 23450, flag: "🇩🇪" },
    { country: "France", code: "FR", users: 156, revenue: 19870, flag: "🇫🇷" },
    {
      country: "United Kingdom",
      code: "UK",
      users: 98,
      revenue: 12340,
      flag: "🇬🇧",
    },
  ];

  const funnelSteps = [
    { name: "Visit Campaign Page", value: 10000, conversionRate: 100 },
    { name: "View Donation Options", value: 6500, conversionRate: 65 },
    { name: "Start Checkout", value: 3250, conversionRate: 50 },
    { name: "Complete Payment", value: 1845, conversionRate: 56.8 },
  ];

  const cohortData = [
    {
      cohort: "2024-01",
      size: 234,
      month0: 100,
      month1: 82,
      month2: 68,
      month3: 54,
    },
    {
      cohort: "2024-02",
      size: 289,
      month0: 100,
      month1: 79,
      month2: 61,
      month3: 48,
    },
    {
      cohort: "2024-03",
      size: 312,
      month0: 100,
      month1: 85,
      month2: 72,
      month3: 59,
    },
    {
      cohort: "2024-04",
      size: 267,
      month0: 100,
      month1: 81,
      month2: 67,
      month3: null,
    },
    {
      cohort: "2024-05",
      size: 298,
      month0: 100,
      month1: 87,
      month2: null,
      month3: null,
    },
    {
      cohort: "2024-06",
      size: 319,
      month0: 100,
      month1: null,
      month2: null,
      month3: null,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your platform performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 Days
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.label}
                </CardTitle>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center text-xs mt-1">
                  {metric.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                  )}
                  <span
                    className={
                      metric.trend === "up" ? "text-green-600" : "text-red-600"
                    }
                  >
                    {Math.abs(metric.change)}%
                  </span>
                  <span className="text-muted-foreground ml-1">
                    vs last period
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <Activity className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="funnel">
            <BarChart3 className="w-4 h-4 mr-2" />
            Funnel Analysis
          </TabsTrigger>
          <TabsTrigger value="cohorts">
            <Users className="w-4 h-4 mr-2" />
            Cohort Retention
          </TabsTrigger>
          <TabsTrigger value="geographic">
            <Globe className="w-4 h-4 mr-2" />
            Geographic
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Donation Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Donation Trends</CardTitle>
                <CardDescription>
                  Monthly donation volume and revenue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-end justify-around gap-2">
                  {timeSeriesData.map((data, index) => {
                    const maxRevenue = Math.max(
                      ...timeSeriesData.map((d) => d.revenue),
                    );
                    const height = (data.revenue / maxRevenue) * 100;
                    return (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center"
                      >
                        <div
                          className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                          style={{ height: `${height}%` }}
                          title={`€${data.revenue.toLocaleString()}`}
                        />
                        <p className="text-xs mt-2 text-muted-foreground">
                          {data.month}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Donor Growth */}
            <Card>
              <CardHeader>
                <CardTitle>Donor Growth</CardTitle>
                <CardDescription>
                  New donors acquired each month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-end justify-around gap-2">
                  {timeSeriesData.map((data, index) => {
                    const maxDonations = Math.max(
                      ...timeSeriesData.map((d) => d.donations),
                    );
                    const height = (data.donations / maxDonations) * 100;
                    return (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center"
                      >
                        <div
                          className="w-full bg-green-500 rounded-t transition-all hover:bg-green-600"
                          style={{ height: `${height}%` }}
                          title={`${data.donations} donors`}
                        />
                        <p className="text-xs mt-2 text-muted-foreground">
                          {data.month}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Funnel Tab */}
        <TabsContent value="funnel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Donation Funnel</CardTitle>
              <CardDescription>
                Conversion rates through the donation process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {funnelSteps.map((step, index) => {
                  const width = (step.value / funnelSteps[0].value) * 100;
                  const dropoff =
                    index > 0
                      ? ((funnelSteps[index - 1].value - step.value) /
                          funnelSteps[index - 1].value) *
                        100
                      : 0;

                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{step.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground">
                            {step.value.toLocaleString()} users
                          </span>
                          <Badge variant="secondary">
                            {step.conversionRate.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                      <div className="relative h-8 bg-muted rounded-lg overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-blue-500 flex items-center justify-center text-white text-sm font-medium transition-all"
                          style={{ width: `${width}%` }}
                        >
                          {width > 20 && `${step.value.toLocaleString()}`}
                        </div>
                      </div>
                      {dropoff > 0 && (
                        <p className="text-xs text-red-600">
                          ↓ {dropoff.toFixed(1)}% drop-off
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cohorts Tab */}
        <TabsContent value="cohorts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cohort Retention Analysis</CardTitle>
              <CardDescription>
                Donor retention rates by signup cohort
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Cohort</th>
                      <th className="text-right p-2 font-medium">Size</th>
                      <th className="text-right p-2 font-medium">Month 0</th>
                      <th className="text-right p-2 font-medium">Month 1</th>
                      <th className="text-right p-2 font-medium">Month 2</th>
                      <th className="text-right p-2 font-medium">Month 3</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cohortData.map((cohort, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{cohort.cohort}</td>
                        <td className="p-2 text-right text-muted-foreground">
                          {cohort.size}
                        </td>
                        <td className="p-2 text-right">
                          <div
                            className="inline-block px-2 py-1 rounded text-white font-medium"
                            style={{ backgroundColor: "rgb(34, 197, 94)" }}
                          >
                            {cohort.month0}%
                          </div>
                        </td>
                        <td className="p-2 text-right">
                          {cohort.month1 !== null ? (
                            <div
                              className="inline-block px-2 py-1 rounded text-white font-medium"
                              style={{
                                backgroundColor: `rgb(${255 - cohort.month1 * 2}, ${100 + cohort.month1}, 94)`,
                              }}
                            >
                              {cohort.month1}%
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="p-2 text-right">
                          {cohort.month2 !== null ? (
                            <div
                              className="inline-block px-2 py-1 rounded text-white font-medium"
                              style={{
                                backgroundColor: `rgb(${255 - cohort.month2 * 2}, ${100 + cohort.month2}, 94)`,
                              }}
                            >
                              {cohort.month2}%
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="p-2 text-right">
                          {cohort.month3 !== null ? (
                            <div
                              className="inline-block px-2 py-1 rounded text-white font-medium"
                              style={{
                                backgroundColor: `rgb(${255 - cohort.month3 * 2}, ${100 + cohort.month3}, 94)`,
                              }}
                            >
                              {cohort.month3}%
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Geographic Tab */}
        <TabsContent value="geographic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Donors and revenue by country</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topCountries.map((country, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{country.flag}</span>
                      <div>
                        <p className="font-medium">{country.country}</p>
                        <p className="text-sm text-muted-foreground">
                          {country.users.toLocaleString()} donors
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        €{country.revenue.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        €{(country.revenue / country.users).toFixed(0)} avg
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
