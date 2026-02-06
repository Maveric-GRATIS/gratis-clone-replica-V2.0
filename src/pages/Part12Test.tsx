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
  Activity,
  Shield,
  Container,
  GitBranch,
  Gauge,
  Lock,
  Server,
  Zap,
  CheckCircle,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

const features = [
  {
    id: "monitoring",
    icon: Activity,
    title: "System Monitoring",
    description:
      "Real-time health checks, metrics tracking, and performance monitoring",
    status: "complete",
    route: "/admin/monitoring",
    items: [
      "Health check API endpoint (/api/health)",
      "Dependency health monitoring (Firebase, external services)",
      "System metrics (memory, CPU, requests, errors)",
      "Real-time dashboard with auto-refresh",
      "Alert system for degraded services",
    ],
  },
  {
    id: "docker",
    icon: Container,
    title: "Docker & Containers",
    description: "Production-ready containerization with multi-stage builds",
    status: "complete",
    items: [
      "Multi-stage Dockerfile (deps → builder → runner)",
      "Alpine Linux for minimal image size",
      "Non-root user security configuration",
      "Docker Compose for local development",
      "Redis integration for caching",
      "Health check integration",
    ],
  },
  {
    id: "security",
    icon: Shield,
    title: "Security Hardening",
    description: "Enterprise-grade security middleware and protections",
    status: "complete",
    items: [
      "Content Security Policy (CSP) headers",
      "CORS configuration with origin whitelisting",
      "XSS protection and input sanitization",
      "CSRF token generation and validation",
      "Security headers (HSTS, X-Frame-Options, etc.)",
      "Request validation and IP extraction",
    ],
  },
  {
    id: "rate-limiting",
    icon: Gauge,
    title: "Rate Limiting",
    description: "Advanced rate limiting with tiered access controls",
    status: "complete",
    items: [
      "Sliding window algorithm",
      "Tiered limits: Public (60/min), Auth (300/min), Admin (1000/min)",
      "Automatic blocking for abuse",
      "In-memory storage with Redis support",
      "Rate limit headers in responses",
      "Client-side rate limit hooks",
    ],
  },
  {
    id: "environment",
    icon: Lock,
    title: "Environment Validation",
    description: "Runtime validation of configuration and secrets",
    status: "complete",
    items: [
      "Firebase configuration validation",
      "Stripe API key format checking",
      "URL validation for endpoints",
      "Startup enforcement with clear errors",
      "Type-safe environment access",
      "Development vs production helpers",
    ],
  },
  {
    id: "cicd",
    icon: GitBranch,
    title: "CI/CD Pipeline",
    description: "Automated testing and deployment workflows",
    status: "planned",
    items: [
      "GitHub Actions workflows",
      "Automated testing on PR",
      "Build and deploy to Vercel",
      "Docker image building and publishing",
      "Environment-specific deployments",
      "Automated security scanning",
    ],
  },
];

export default function Part12Test() {
  const completeCount = features.filter((f) => f.status === "complete").length;
  const totalCount = features.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950 pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4" variant="outline">
            Part 12 - DevOps & Infrastructure
          </Badge>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Enterprise Infrastructure
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Production-grade monitoring, security, containerization, and
            deployment automation
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
                className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                style={{ width: `${(completeCount / totalCount) * 100}%` }}
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex items-center justify-center gap-4">
            <Link to="/admin/monitoring">
              <Button size="lg" className="gap-2">
                <Activity className="w-4 h-4" />
                View System Monitor
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/api/health">
              <Button variant="outline" size="lg" className="gap-2">
                <Server className="w-4 h-4" />
                Health Check API
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
                    <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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
                    <Link to={feature.route} className="mt-4 block">
                      <Button variant="outline" className="w-full gap-2">
                        View Dashboard
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Technical Implementation Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Technical Implementation
            </CardTitle>
            <CardDescription>
              Key architectural decisions and technologies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Infrastructure</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Docker multi-stage builds with Alpine Linux</li>
                  <li>• Docker Compose for local development</li>
                  <li>• Redis for caching and rate limiting</li>
                  <li>• Health check endpoints for orchestrators</li>
                  <li>• Non-root container execution</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Security</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Content Security Policy with strict directives</li>
                  <li>• CORS with origin whitelisting</li>
                  <li>• Input sanitization and XSS prevention</li>
                  <li>• CSRF token validation</li>
                  <li>• HSTS and security headers</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Monitoring</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Real-time health check API</li>
                  <li>• System metrics (memory, CPU, requests)</li>
                  <li>• Dependency health monitoring</li>
                  <li>• Error rate tracking</li>
                  <li>• Auto-refresh dashboard</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Rate Limiting</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Sliding window algorithm</li>
                  <li>• Tiered access controls</li>
                  <li>• Automatic abuse blocking</li>
                  <li>• Redis-backed storage (production)</li>
                  <li>• Rate limit response headers</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Files Created */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Files Created</CardTitle>
            <CardDescription>New files added for Part 12</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-sm">
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded">
                src/types/monitoring.ts
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded">
                src/app/api/health/route.ts
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded">
                src/pages/SystemMonitor.tsx
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded">
                src/lib/security/env-validation.ts
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded">
                src/lib/security/rate-limiter.ts
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded">
                src/middleware/security.ts
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded">
                Dockerfile
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded">
                docker-compose.yml
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded">
                .dockerignore
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded">
                src/pages/Part12Test.tsx
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
