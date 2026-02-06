import React from "react";
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
  BarChart3,
  Shield,
  CreditCard,
  DollarSign,
  Users,
  FileText,
  CheckCircle,
  TrendingUp,
  Lock,
  Activity,
  Cookie,
  RefreshCw,
  Award,
} from "lucide-react";

export default function Part11Test() {
  console.log("Part11Test component loaded!");

  const sections = [
    {
      id: "analytics",
      name: "Advanced Analytics",
      description:
        "Real-time metrics, cohort analysis, funnel tracking, and geographic distribution",
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      path: "/admin/analytics-advanced",
      features: [
        "Real-time metrics dashboard",
        "Donation funnel analysis",
        "Cohort retention tracking",
        "Geographic distribution",
        "Custom report generation",
        "Data export (CSV/JSON)",
      ],
      types: ["analytics-advanced.ts"],
    },
    {
      id: "gdpr",
      name: "GDPR Compliance",
      description: "Complete privacy and data protection management system",
      icon: Shield,
      color: "text-green-600",
      bgColor: "bg-green-50",
      path: "/privacy",
      features: [
        "Consent management",
        "Cookie tracking & control",
        "Data export requests",
        "Right to erasure (deletion)",
        "Consent history tracking",
        "ANBI-compliant retention",
      ],
      types: ["gdpr.ts"],
    },
    {
      id: "subscriptions",
      name: "Recurring Donations",
      description:
        "Subscription-based recurring donation management with Stripe",
      icon: CreditCard,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      path: "/donations/subscribe",
      features: [
        "Multiple subscription tiers",
        "Monthly/Quarterly/Yearly billing",
        "Plan changes with proration",
        "Payment method management",
        "Invoice history",
        "Cancellation flows",
      ],
      types: ["subscription.ts"],
    },
    {
      id: "payments",
      name: "Payment Processing",
      description: "Advanced payment lifecycle with refunds and tax receipts",
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      path: "/admin/refunds",
      features: [
        "Refund processing",
        "Dispute handling",
        "Tax receipt generation",
        "ANBI-compliant receipts",
        "Payment tracking",
        "Fraud detection",
      ],
      types: ["payment.ts"],
    },
    {
      id: "rbac",
      name: "Role-Based Access Control",
      description: "Comprehensive role and permission management system",
      icon: Lock,
      color: "text-red-600",
      bgColor: "bg-red-50",
      path: "/admin/roles",
      features: [
        "Hierarchical role system",
        "Granular permissions",
        "Custom role creation",
        "User role assignments",
        "Permission matrix",
        "Access audit trail",
      ],
      types: ["rbac.ts"],
    },
    {
      id: "audit",
      name: "Audit Logging",
      description: "Complete activity tracking and security monitoring",
      icon: Activity,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      path: "/admin/audit-logs",
      features: [
        "Structured event logging",
        "Security monitoring",
        "User activity feeds",
        "Filterable audit trail",
        "Compliance reporting",
        "Log export functionality",
      ],
      types: ["audit.ts"],
    },
  ];

  const stats = {
    sections: sections.length,
    pages: 7,
    types: 6,
    features: sections.reduce((sum, s) => sum + s.features.length, 0),
  };

  return (
    <div className="pt-24 pb-12 px-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Award className="w-12 h-12 text-blue-600" />
          <h1 className="text-4xl font-bold">Part 11: Enterprise Features</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Advanced analytics, GDPR compliance, subscriptions, payment
          processing, RBAC, and audit logging
        </p>
        <div className="flex items-center justify-center gap-6 text-sm">
          <Badge variant="outline" className="text-lg py-2 px-4">
            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />6 Sections
          </Badge>
          <Badge variant="outline" className="text-lg py-2 px-4">
            <FileText className="w-4 h-4 mr-2 text-blue-600" />7 Pages
          </Badge>
          <Badge variant="outline" className="text-lg py-2 px-4">
            <TrendingUp className="w-4 h-4 mr-2 text-purple-600" />
            {stats.features} Features
          </Badge>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sections</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sections}</div>
            <p className="text-xs text-muted-foreground">Enterprise modules</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pages</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pages}</div>
            <p className="text-xs text-muted-foreground">Complete dashboards</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Type Definitions
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.types}</div>
            <p className="text-xs text-muted-foreground">TypeScript types</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Features</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.features}</div>
            <p className="text-xs text-muted-foreground">
              Implemented features
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Section Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.id} className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div
                    className={`w-14 h-14 rounded-lg ${section.bgColor} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className={`w-7 h-7 ${section.color}`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">
                      {section.name}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {section.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Features */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Features:
                  </p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {section.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Types */}
                <div className="space-y-2 pt-3 border-t">
                  <p className="text-sm font-medium text-muted-foreground">
                    Type Definitions:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {section.types.map((type, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Link to={section.path} className="block pt-3 border-t">
                  <Button className="w-full" variant="default">
                    Open {section.name}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Type Definitions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Type Definitions
          </CardTitle>
          <CardDescription>
            TypeScript type definitions for all Part 11 features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                file: "analytics-advanced.ts",
                types: 16,
                description: "Analytics metrics and data structures",
              },
              {
                file: "gdpr.ts",
                types: 8,
                description: "GDPR consent and privacy types",
              },
              {
                file: "subscription.ts",
                types: 12,
                description: "Subscription and recurring donation types",
              },
              {
                file: "payment.ts",
                types: 11,
                description: "Payment, refund, and tax receipt types",
              },
              {
                file: "rbac.ts",
                types: 8,
                description: "Role and permission types",
              },
              {
                file: "audit.ts",
                types: 7,
                description: "Audit log and activity tracking types",
              },
            ].map((type, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border hover:border-primary transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <code className="text-sm font-mono text-blue-600">
                    {type.file}
                  </code>
                  <Badge variant="secondary">{type.types} types</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {type.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Implementation Summary */}
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            Implementation Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <div>
                <p className="font-medium text-green-900 mb-1">
                  Section 43: Advanced Analytics
                </p>
                <ul className="space-y-1 ml-4 text-green-800">
                  <li>✓ Real-time metrics dashboard</li>
                  <li>✓ Donation trends & funnel analysis</li>
                  <li>✓ Cohort retention tracking</li>
                  <li>✓ Geographic distribution mapping</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-green-900 mb-1">
                  Section 44: GDPR Compliance
                </p>
                <ul className="space-y-1 ml-4 text-green-800">
                  <li>✓ Cookie consent management</li>
                  <li>✓ Data export functionality</li>
                  <li>✓ Right to erasure</li>
                  <li>✓ Consent history tracking</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-green-900 mb-1">
                  Section 45: Subscriptions
                </p>
                <ul className="space-y-1 ml-4 text-green-800">
                  <li>✓ 4 subscription tiers</li>
                  <li>✓ Multiple billing intervals</li>
                  <li>✓ Payment method management</li>
                  <li>✓ Invoice history</li>
                </ul>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="font-medium text-green-900 mb-1">
                  Section 46: Payment Processing
                </p>
                <ul className="space-y-1 ml-4 text-green-800">
                  <li>✓ Refund processing workflow</li>
                  <li>✓ Dispute management</li>
                  <li>✓ ANBI tax receipts</li>
                  <li>✓ Payment tracking</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-green-900 mb-1">
                  Section 47: RBAC
                </p>
                <ul className="space-y-1 ml-4 text-green-800">
                  <li>✓ 5 system roles</li>
                  <li>✓ Permission matrix (12×7)</li>
                  <li>✓ User role assignments</li>
                  <li>✓ Custom role creation</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-green-900 mb-1">
                  Section 48: Audit Logging
                </p>
                <ul className="space-y-1 ml-4 text-green-800">
                  <li>✓ 12 event categories</li>
                  <li>✓ 4 severity levels</li>
                  <li>✓ Advanced filtering</li>
                  <li>✓ Log export functionality</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Navigation</CardTitle>
          <CardDescription>Jump to any Part 11 feature</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Link to="/admin/analytics-advanced">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </Link>
            <Link to="/privacy">
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                GDPR
              </Button>
            </Link>
            <Link to="/donations/subscribe">
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="w-4 h-4 mr-2" />
                Subscriptions
              </Button>
            </Link>
            <Link to="/admin/refunds">
              <Button variant="outline" className="w-full justify-start">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refunds
              </Button>
            </Link>
            <Link to="/admin/roles">
              <Button variant="outline" className="w-full justify-start">
                <Lock className="w-4 h-4 mr-2" />
                Roles
              </Button>
            </Link>
            <Link to="/admin/audit-logs">
              <Button variant="outline" className="w-full justify-start">
                <Activity className="w-4 h-4 mr-2" />
                Audit Logs
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
