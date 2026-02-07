import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  GitBranch,
  Download,
  Shield,
  FileText,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    id: "seo",
    icon: Search,
    title: "SEO & Meta Management",
    description:
      "Comprehensive SEO optimization with meta tags, structured data, and automated auditing",
    status: "complete",
    route: "/admin/seo-manager",
    items: [
      "Dynamic meta tags with react-helmet",
      "Open Graph & Twitter Card generation",
      "Schema.org structured data (JSON-LD)",
      "SEO audit tool with scoring (0-100)",
      "Sitemap generation with priorities",
      "Breadcrumb navigation components",
      "Page-specific SEO configurations",
    ],
  },
  {
    id: "ab-testing",
    icon: GitBranch,
    title: "A/B Testing & Feature Flags",
    description:
      "Advanced feature flag system with targeting, rollouts, and experiment tracking",
    status: "complete",
    route: "/admin/feature-flags",
    items: [
      "Feature flag service with caching (60s TTL)",
      "Rule-based flag evaluation (percentage/user/attributes)",
      "useFeatureFlag React hook",
      "FeatureGate conditional rendering component",
      "Admin management dashboard",
      "Context-based targeting (user/role/environment)",
      "Deterministic hash-based assignment",
    ],
  },
  {
    id: "export",
    icon: Download,
    title: "Data Export & Reporting",
    description:
      "Flexible data export system with multiple formats and scheduled reports",
    status: "complete",
    route: "/admin/data-export",
    items: [
      "Export 8 scopes: donations, users, projects, events, bottles, partners, subscriptions, audit logs",
      "4 export formats: CSV, JSON, Excel, PDF",
      "Advanced filtering with operators",
      "Status tracking (pending/processing/completed/failed)",
      "Download links with expiry",
      "Report definitions with metrics aggregation",
      "Scheduled report generation",
      "Chart data for visualizations",
    ],
  },
  {
    id: "mfa",
    icon: Shield,
    title: "2FA/MFA Authentication",
    description: "Multi-factor authentication with TOTP and backup codes",
    status: "complete",
    route: "/admin/mfa-settings",
    items: [
      "TOTP authenticator app support (Google/Microsoft/Authy)",
      "QR code generation for easy setup",
      "Backup recovery codes (10 single-use)",
      "MFA setup wizard component",
      "Admin MFA management dashboard",
      "User security settings page",
      "MFA status tracking per user",
      "Code verification with rate limiting",
    ],
  },
  {
    id: "moderation",
    icon: FileText,
    title: "Content Moderation & Auto-Review",
    description: "AI-powered content moderation with manual review queue",
    status: "complete",
    route: "/admin/moderation-queue",
    items: [
      "Auto-scoring across 8 risk categories (spam/toxicity/profanity/harassment/hate/sexual/violence/self-harm)",
      "User trust scoring system (0-100 with 4 levels)",
      "Auto-approval for low-risk content from trusted users",
      "Auto-rejection for high-risk content (score ≥85%)",
      "Manual review queue for medium-risk content",
      "Community flagging with 8 predefined reasons",
      "Pattern matching (URLs, caps, repetition, blocked terms)",
      "Admin dashboard with filters and action buttons",
      "Real-time queue updates with useModeration hook",
      "Content preview with AI analysis visualization",
    ],
  },
];

export default function Part14Test() {
  const completeCount = features.filter((f) => f.status === "complete").length;
  const totalCount = features.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-pink-950 pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4" variant="outline">
            Part 14 - Enterprise Features
          </Badge>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Advanced Enterprise Tools
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            SEO optimization, A/B testing, data exports, multi-factor
            authentication, and intelligent content moderation
          </p>

          {/* Progress */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-semibold">
                {completeCount}/{totalCount} Features Complete
              </span>
            </div>
            <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-purple-500"
                style={{ width: `${(completeCount / totalCount) * 100}%` }}
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/admin/seo-manager">
              <Button size="lg" className="gap-2">
                <Search className="w-4 h-4" />
                SEO Audit Tool
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/admin/feature-flags">
              <Button variant="outline" size="lg" className="gap-2">
                <GitBranch className="w-4 h-4" />
                Feature Flags
                <ExternalLink className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/admin/data-export">
              <Button variant="outline" size="lg" className="gap-2">
                <Download className="w-4 h-4" />
                Data Export
                <ExternalLink className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/admin/mfa-settings">
              <Button variant="outline" size="lg" className="gap-2">
                <Shield className="w-4 h-4" />
                MFA Settings
                <ExternalLink className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isComplete = feature.status === "complete";

            return (
              <Card
                key={feature.id}
                className={`relative overflow-hidden transition-all hover:shadow-lg ${
                  isComplete ? "border-green-500/50" : "border-gray-200"
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
                      <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <Badge variant={isComplete ? "default" : "secondary"}>
                      {isComplete ? "Complete" : "Planned"}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle
                          className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                            isComplete ? "text-green-600" : "text-gray-400"
                          }`}
                        />
                        <span
                          className={isComplete ? "" : "text-muted-foreground"}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {feature.route && isComplete && (
                    <Link to={feature.route} className="mt-4 inline-block">
                      <Button variant="outline" size="sm" className="gap-2">
                        View Dashboard
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Technical Details */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Implementation Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-3 text-purple-900 dark:text-purple-100">
                  Section 59: SEO & Meta Management
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• src/types/seo.ts - Type definitions</li>
                  <li>• src/lib/seo/config.ts - SEO configurations</li>
                  <li>
                    • src/lib/seo/structured-data.ts - Schema.org generators
                  </li>
                  <li>• src/components/seo/SEOHead.tsx - Helmet wrapper</li>
                  <li>• src/lib/seo/audit.ts - Audit scoring algorithm</li>
                  <li>• src/lib/seo/sitemap-data.ts - Sitemap utilities</li>
                  <li>• src/pages/admin/SEOManager.tsx - Admin dashboard</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-purple-900 dark:text-purple-100">
                  Section 60: A/B Testing & Feature Flags
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• src/types/ab-testing.ts - Flag/experiment types</li>
                  <li>
                    • src/lib/ab-testing/feature-flag-service.ts - Flag engine
                  </li>
                  <li>
                    • src/lib/ab-testing/experiment-service.ts - A/B test engine
                  </li>
                  <li>
                    • src/hooks/useFeatureFlag.ts - React hooks (flag +
                    experiment)
                  </li>
                  <li>
                    • src/components/ab-testing/FeatureGate.tsx - Conditional
                    rendering
                  </li>
                  <li>• src/pages/admin/FeatureFlagsManager.tsx - Admin UI</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-purple-900 dark:text-purple-100">
                  Section 61: Data Export & Reporting
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• src/types/export.ts - Export/report types</li>
                  <li>• src/lib/export/export-service.ts - Export engine</li>
                  <li>
                    • src/lib/export/report-generator.ts - Report generator
                  </li>
                  <li>
                    • src/hooks/useExport.ts - Export hook with status tracking
                  </li>
                  <li>• src/pages/admin/DataExportManager.tsx - Export UI</li>
                  <li>• Firebase Storage integration (7-day expiry)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-purple-900 dark:text-purple-100">
                  Section 62: 2FA/MFA Authentication
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• src/types/mfa.ts - MFA type definitions</li>
                  <li>• src/lib/auth/mfa-service.ts - MFA service layer</li>
                  <li>• src/components/auth/MFASetup.tsx - Setup wizard</li>
                  <li>• src/hooks/useMFA.ts - React hook</li>
                  <li>• src/pages/admin/MFASettings.tsx - Admin management</li>
                  <li>• src/pages/UserMFASettings.tsx - User settings</li>
                </ul>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold mb-3 text-purple-900 dark:text-purple-100">
                Section 63: Content Moderation & Auto-Review
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• src/types/moderation.ts - Moderation type definitions</li>
                <li>
                  • src/lib/moderation/moderation-service.ts - Auto-review
                  service
                </li>
                <li>• src/pages/admin/ModerationQueue.tsx - Admin queue UI</li>
                <li>
                  • src/hooks/useModeration.ts - React hook for queue operations
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Footer Navigation */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Part 14 implements Sections 59-63 from the enterprise specification
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/part12-test">
              <Button variant="ghost">← Part 12</Button>
            </Link>
            <Link to="/part13-test">
              <Button variant="ghost">Part 13</Button>
            </Link>
            <Link to="/">
              <Button variant="ghost">Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
