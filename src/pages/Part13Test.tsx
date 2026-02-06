/**
 * Part 13 Test Page
 * Showcase all Part 13 enterprise infrastructure features
 * Sections 54-58: Email, Media, Migration, Error Handling & Deployment
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
  Mail,
  Image,
  Database,
  AlertCircle,
  Rocket,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Shield,
  Zap,
} from "lucide-react";

export default function Part13Test() {
  // Feature status tracking
  const features = [
    {
      id: 54,
      title: "Email Templates & System",
      icon: Mail,
      description: "Transactional emails, queue management, tracking",
      status: "complete" as const,
      progress: 100,
      route: "/admin/emails/logs",
      features: [
        "✅ Email service with templates",
        "✅ Email queue system",
        "✅ Open/click tracking",
        "✅ Email logs dashboard",
        "✅ Template manager UI",
        "✅ Search & filtering",
      ],
    },
    {
      id: 55,
      title: "Media Management",
      icon: Image,
      description: "Upload, organize, optimize images and videos",
      status: "complete" as const,
      progress: 100,
      route: "/admin/media",
      features: [
        "✅ Media upload manager",
        "✅ Media browser UI (Grid/List)",
        "✅ Folder organization",
        "✅ Search functionality",
        "✅ File operations (view, download, delete)",
        "✅ Stats display",
      ],
    },
    {
      id: 56,
      title: "Migration Tools",
      icon: Database,
      description: "Data import, seeding, and backup scripts",
      status: "complete" as const,
      progress: 100,
      route: null,
      features: [
        "✅ Legacy data migration",
        "✅ Database seeding",
        "✅ Backup functionality",
        "✅ CSV/JSON parsers",
        "✅ Data transformation",
        "✅ Verification tools",
      ],
    },
    {
      id: 57,
      title: "Error Handling & Monitoring",
      icon: AlertCircle,
      description: "Sentry integration, error tracking, alerting",
      status: "complete" as const,
      progress: 100,
      route: "/admin/errors",
      features: [
        "✅ Error tracking dashboard",
        "✅ Sentry integration setup",
        "✅ Error grouping & status",
        "✅ Web Vitals monitoring",
        "✅ User impact tracking",
        "✅ Severity levels",
      ],
    },
    {
      id: 58,
      title: "Deployment & CI/CD",
      icon: Rocket,
      description: "GitHub Actions, automated deployment pipelines",
      status: "complete" as const,
      progress: 100,
      route: null,
      features: [
        "✅ GitHub Actions CI/CD",
        "✅ Automated testing (lint, test, build)",
        "✅ Multi-environment deployment",
        "✅ Security scanning (Snyk)",
        "✅ Performance tests (Lighthouse)",
        "✅ Slack notifications",
      ],
    },
  ];

  const completedCount = features.filter((f) => f.status === "complete").length;
  const totalCount = features.length;
  const overallProgress = Math.round(
    features.reduce((sum, f) => sum + f.progress, 0) / features.length
  );

  const getStatusBadge = (status: string, progress: number) => {
    if (status === "complete") {
      return (
        <Badge className="bg-green-500 text-white flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Complete
        </Badge>
      );
    } else if (status === "partial") {
      return (
        <Badge className="bg-yellow-500 text-white flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {progress}% Complete
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-gray-50 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Planned
        </Badge>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Part 13 - Enterprise Infrastructure</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Email, Media, Migration, Errors & Deployment
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Production-ready infrastructure features for enterprise-scale operations
          </p>
          
          {/* Progress Overview */}
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-lg px-4 py-2">
                Sections {completedCount}/{totalCount}
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">
                Overall: {overallProgress}%
              </Badge>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isAccessible = feature.route && feature.progress > 0;

            return (
              <Card
                key={feature.id}
                className={`relative overflow-hidden transition-all hover:shadow-lg ${
                  feature.status === "complete"
                    ? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/30"
                    : feature.status === "partial"
                    ? "border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-950/30"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    {getStatusBadge(feature.status, feature.progress)}
                  </div>
                  <CardTitle className="text-xl">
                    Section {feature.id}: {feature.title}
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{feature.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          feature.status === "complete"
                            ? "bg-green-500 dark:bg-green-600"
                            : feature.status === "partial"
                            ? "bg-yellow-500 dark:bg-yellow-600"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                        style={{ width: `${feature.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-1 text-sm">
                    {feature.features.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  {isAccessible ? (
                    <Link to={feature.route!}>
                      <Button className="w-full gap-2" variant="outline">
                        View Dashboard
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Button className="w-full" variant="outline" disabled>
                      {feature.route ? "Coming Soon" : "Scripts Only"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Technical Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Technical Implementation
            </CardTitle>
            <CardDescription>
              Infrastructure components and architectural decisions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-3">Section 54: Email System</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• SendGrid & Resend dual integration</li>
                  <li>• 25+ branded email templates</li>
                  <li>• Queue system with retry logic</li>
                  <li>• Open/click tracking & analytics</li>
                  <li>• Template editor with preview</li>
                  <li>• Scheduled email delivery</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Section 55: Media Management</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Drag-drop upload interface</li>
                  <li>• WebP image optimization</li>
                  <li>• Video transcoding (Mux)</li>
                  <li>• CDN integration (Cloudflare)</li>
                  <li>• Folder organization & tags</li>
                  <li>• Bulk operations & permissions</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Section 56: Migration Tools</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Legacy data migration scripts</li>
                  <li>• Database seeding utilities</li>
                  <li>• Bulk user import (CSV)</li>
                  <li>• Data transformation pipelines</li>
                  <li>• Rollback & recovery tools</li>
                  <li>• Progress tracking & logging</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Section 57: Error Monitoring</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Sentry SDK integration</li>
                  <li>• Error tracking dashboard</li>
                  <li>• Web Vitals monitoring</li>
                  <li>• Automated Slack/Email alerts</li>
                  <li>• Error grouping & deduplication</li>
                  <li>• Source map support</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link to="/part12-test">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Part 12: DevOps
            </Button>
          </Link>
          <Link to="/admin">
            <Button variant="outline" className="gap-2">
              Admin Dashboard
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
