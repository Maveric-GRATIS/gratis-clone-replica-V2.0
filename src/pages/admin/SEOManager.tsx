// src/pages/admin/SEOManager.tsx
// Admin page for managing SEO configuration and viewing audits

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Search,
  AlertCircle,
  CheckCircle,
  Info,
  TrendingUp,
} from "lucide-react";
import { auditPageSEO } from "@/lib/seo/audit";
import type { SEOAuditResult } from "@/types/seo";

export default function SEOManager() {
  const [auditUrl, setAuditUrl] = useState("");
  const [auditResult, setAuditResult] = useState<SEOAuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleAudit = async () => {
    setIsAuditing(true);

    // Simulate page analysis (in production, this would fetch the actual page)
    setTimeout(() => {
      const mockResult = auditPageSEO({
        url: auditUrl,
        title: "GRATIS.NGO — Turning Every Bottle Into Impact",
        description:
          "Join the movement that turns recycled bottles into real-world impact. Donate, volunteer, and track your contribution to a better planet.",
        h1Count: 1,
        h2Count: 5,
        imageCount: 8,
        imagesWithAlt: 7,
        wordCount: 450,
        internalLinks: 12,
        externalLinks: 3,
        hasCanonical: true,
        hasOGTags: true,
        hasTwitterTags: true,
        hasStructuredData: true,
        loadTimeMs: 2100,
        mobileResponsive: true,
      });

      setAuditResult(mockResult);
      setIsAuditing(false);
    }, 1500);
  };

  const getIssueIcon = (type: "error" | "warning" | "info") => {
    switch (type) {
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "info":
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <AdminLayout>
      <div className="pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              SEO Manager
            </h1>
            <p className="text-muted-foreground">
              Manage SEO configuration and audit pages for search optimization
            </p>
          </div>

          {/* Page Audit Section */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Page SEO Audit
            </h2>

            <div className="flex gap-3 mb-6">
              <div className="flex-1">
                <input
                  type="url"
                  value={auditUrl}
                  onChange={(e) => setAuditUrl(e.target.value)}
                  placeholder="Enter page URL to audit (e.g., /donate)"
                  className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-foreground"
                />
              </div>
              <button
                onClick={handleAudit}
                disabled={!auditUrl || isAuditing}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                {isAuditing ? "Auditing..." : "Audit"}
              </button>
            </div>

            {/* Audit Results */}
            {auditResult && (
              <div className="space-y-6">
                {/* Score */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      SEO Score
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {auditResult.url}
                    </p>
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-5xl font-bold ${getScoreColor(auditResult.score)}`}
                    >
                      {auditResult.score}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">/ 100</div>
                  </div>
                </div>

                {/* Issues */}
                {auditResult.issues.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      Issues Found ({auditResult.issues.length})
                    </h3>
                    <div className="space-y-2">
                      {auditResult.issues.map((issue, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 bg-card border border-border rounded-lg"
                        >
                          <div className="mt-0.5">
                            {getIssueIcon(issue.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-foreground">
                                {issue.category.toUpperCase()}
                              </span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded ${
                                  issue.type === "error"
                                    ? "bg-red-100 text-red-700"
                                    : issue.type === "warning"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {issue.type}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {issue.message}
                            </p>
                            {issue.element && (
                              <code className="text-xs text-muted-foreground mt-1 block">
                                {issue.element}
                              </code>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {auditResult.suggestions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      Recommendations
                    </h3>
                    <div className="space-y-2">
                      {auditResult.suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
                          <p className="text-sm text-foreground">
                            {suggestion}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Pages Indexed
                </h3>
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-3xl font-bold text-foreground">247</p>
              <p className="text-sm text-green-600 mt-1">+12 this month</p>
            </div>

            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Avg. SEO Score
                </h3>
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-3xl font-bold text-foreground">87</p>
              <p className="text-sm text-green-600 mt-1">+5 from last audit</p>
            </div>

            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Issues Found
                </h3>
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold text-foreground">23</p>
              <p className="text-sm text-yellow-600 mt-1">
                15 warnings, 8 errors
              </p>
            </div>
          </div>

          {/* SEO Best Practices */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              SEO Best Practices
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  Title Tags
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Keep between 50-60 characters</li>
                  <li>• Include target keyword near the beginning</li>
                  <li>• Make it unique for every page</li>
                  <li>• Include brand name at the end</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  Meta Descriptions
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Aim for 150-160 characters</li>
                  <li>• Include a call-to-action</li>
                  <li>• Make it compelling and relevant</li>
                  <li>• Include target keyword naturally</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  Content Structure
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use only one H1 per page</li>
                  <li>• Create a logical heading hierarchy</li>
                  <li>• Aim for 300+ words of content</li>
                  <li>• Use internal linking strategically</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  Technical SEO
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Add canonical URLs to avoid duplicates</li>
                  <li>• Include Open Graph and Twitter Cards</li>
                  <li>• Add structured data (JSON-LD)</li>
                  <li>• Optimize images with alt text</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
