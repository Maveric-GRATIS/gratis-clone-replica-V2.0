/**
 * Part 9 Test Page
 * Showcase all Part 9 features with navigation
 */

import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Beaker,
  BarChart3,
  Heart,
  Smartphone,
  TrendingUp,
  Users,
  Globe,
  Target,
  Award,
  CheckCircle2,
} from "lucide-react";

export default function Part9Test() {
  const features = [
    {
      title: "Push Notifications",
      description: "Manage push notification preferences and channels",
      path: "/settings/push-notifications",
      icon: Bell,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      status: "Implemented",
      features: [
        "7 notification channels (donations, impact, events, etc.)",
        "Quiet hours configuration",
        "Device management",
        "Frequency preferences (all/important/minimal)",
        "FCM token management",
      ],
    },
    {
      title: "A/B Testing Dashboard",
      description: "Run experiments and analyze results",
      path: "/admin/experiments",
      icon: Beaker,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      status: "Implemented",
      features: [
        "Experiment management",
        "Variant configuration",
        "Traffic allocation",
        "Statistical significance testing",
        "Winner detection with confidence intervals",
      ],
    },
    {
      title: "Analytics Dashboard",
      description: "Advanced analytics and reporting",
      path: "/admin/analytics-advanced",
      icon: BarChart3,
      color: "text-green-600",
      bgColor: "bg-green-50",
      status: "Implemented",
      features: [
        "Key metrics overview",
        "Traffic analysis",
        "Top pages tracking",
        "User segmentation (planned)",
        "Funnel & cohort analysis (planned)",
      ],
    },
    {
      title: "Volunteer Opportunities",
      description: "Browse and apply for volunteer positions",
      path: "/volunteer",
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50",
      status: "Implemented",
      features: [
        "Opportunity browsing and search",
        "Type filters (event/ongoing/project/virtual)",
        "Skill level filtering",
        "Location and date information",
        "Application system",
      ],
    },
  ];

  const typeDefinitions = [
    {
      name: "push-notification.ts",
      types: [
        "PushNotification",
        "UserPushSettings",
        "FCMToken",
        "NotificationTemplate",
        "DeepLinkConfig",
      ],
      description: "Push notification system types",
    },
    {
      name: "experiments.ts",
      types: [
        "Experiment",
        "ExperimentVariant",
        "ExperimentResults",
        "FeatureFlag",
        "MetricResult",
      ],
      description: "A/B testing and feature flag types",
    },
    {
      name: "analytics.ts",
      types: [
        "AnalyticsEvent",
        "FunnelAnalysis",
        "CohortAnalysis",
        "UserSegment",
        "Report",
      ],
      description: "Analytics and reporting types",
    },
    {
      name: "volunteer.ts",
      types: [
        "Volunteer",
        "VolunteerOpportunity",
        "VolunteerShift",
        "ShiftAssignment",
        "VolunteerHourLog",
      ],
      description: "Volunteer management types",
    },
  ];

  const stats = {
    pages: 4,
    types: 4,
    components: 15,
    routes: 4,
    features: 20,
  };

  return (
    <div className="container mx-auto pt-24 pb-12 px-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">
          Part 9: Mobile Push, A/B Testing, Analytics & Volunteer
        </h1>
        <p className="text-lg text-muted-foreground mb-4">
          Advanced features for engagement, experimentation, and insights
        </p>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-sm">
            Section 43: Push Notifications
          </Badge>
          <Badge variant="secondary" className="text-sm">
            Section 44: A/B Testing
          </Badge>
          <Badge variant="secondary" className="text-sm">
            Section 45: Analytics
          </Badge>
          <Badge variant="secondary" className="text-sm">
            Section 46: Volunteers
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-primary mb-1">
              {stats.pages}
            </div>
            <p className="text-sm text-muted-foreground">Pages</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-primary mb-1">
              {stats.types}
            </div>
            <p className="text-sm text-muted-foreground">Type Files</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-primary mb-1">
              {stats.components}
            </div>
            <p className="text-sm text-muted-foreground">Components</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-primary mb-1">
              {stats.routes}
            </div>
            <p className="text-sm text-muted-foreground">Routes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-primary mb-1">
              {stats.features}
            </div>
            <p className="text-sm text-muted-foreground">Features</p>
          </CardContent>
        </Card>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-6 mb-8">
        {features.map((feature) => (
          <Card key={feature.path} className="overflow-hidden">
            <CardHeader className={`${feature.bgColor} border-b`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg bg-white ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {feature.description}
                    </CardDescription>
                  </div>
                </div>
                <Badge className="bg-green-600">{feature.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Features Implemented:
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <Button asChild>
                  <Link to={feature.path}>Open {feature.title}</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to={feature.path}>View Demo</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Type Definitions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Type Definitions Created</CardTitle>
          <CardDescription>
            TypeScript interfaces for Part 9 features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {typeDefinitions.map((file) => (
              <div key={file.name} className="p-4 rounded-lg border bg-card">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {file.name}
                  </code>
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {file.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {file.types.map((type) => (
                    <Badge key={type} variant="secondary" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Implementation Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Summary</CardTitle>
          <CardDescription>Part 9 technical overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">
                Section 43: Push Notifications
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                Complete push notification management system with FCM
                integration, channel preferences, quiet hours, and device
                management.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">FCM Tokens</Badge>
                <Badge variant="outline">Deep Links</Badge>
                <Badge variant="outline">Quiet Hours</Badge>
                <Badge variant="outline">7 Channels</Badge>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Section 44: A/B Testing</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Experimentation platform with variant management, statistical
                analysis, and automated winner detection.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Experiments</Badge>
                <Badge variant="outline">Variants</Badge>
                <Badge variant="outline">Metrics</Badge>
                <Badge variant="outline">Statistical Tests</Badge>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Section 45: Analytics</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Advanced analytics dashboard with traffic, user, and conversion
                tracking. Foundation for funnel and cohort analysis.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Events</Badge>
                <Badge variant="outline">Funnels</Badge>
                <Badge variant="outline">Cohorts</Badge>
                <Badge variant="outline">Reports</Badge>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Section 46: Volunteers</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Volunteer opportunity management with search, filtering, and
                application system. Support for events, ongoing, and virtual
                opportunities.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Opportunities</Badge>
                <Badge variant="outline">Applications</Badge>
                <Badge variant="outline">Shifts</Badge>
                <Badge variant="outline">Hour Tracking</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Footer */}
      <div className="mt-8 p-6 rounded-lg border bg-card">
        <h3 className="font-semibold mb-4">Quick Navigation</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {features.map((feature) => (
            <Button
              key={feature.path}
              variant="outline"
              asChild
              className="h-auto py-3"
            >
              <Link to={feature.path}>
                <div className="flex flex-col items-center gap-2">
                  <feature.icon className={`h-5 w-5 ${feature.color}`} />
                  <span className="text-xs text-center">{feature.title}</span>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
