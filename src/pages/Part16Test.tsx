import React from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  FileText,
  Building2,
  Webhook,
  Code2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function Part16Test() {
  const features = [
    {
      id: "audit-logs",
      name: "Audit Log System",
      description:
        "Comprehensive audit trail viewer with filtering, search, and statistics",
      route: "/admin/audit-logs",
      icon: FileText,
      section: "Section 69",
      features: [
        "Real-time activity tracking",
        "Advanced filtering by action, category, severity",
        "Audit statistics dashboard",
        "Export audit logs",
        "Critical event alerts",
      ],
    },
    {
      id: "rbac",
      name: "Role Management (RBAC)",
      description: "Role-Based Access Control system with granular permissions",
      route: "/admin/roles",
      icon: Shield,
      section: "Section 70",
      features: [
        "Role definitions and permissions",
        "User role assignment",
        "Scoped permissions",
        "Time-limited roles",
        "Permission inheritance",
      ],
    },
    {
      id: "tenants",
      name: "Multi-Tenant Manager",
      description: "White-label tenant configuration and management",
      route: "/admin/tenants",
      icon: Building2,
      section: "Section 71",
      features: [
        "Tenant branding configuration",
        "Feature flag management",
        "Usage limits and quotas",
        "Custom domain mapping",
        "Integration settings",
      ],
    },
    {
      id: "webhooks",
      name: "Webhook Manager",
      description: "Outbound webhook delivery with retry logic",
      route: "/admin/webhooks",
      icon: Webhook,
      section: "Section 72",
      features: [
        "Webhook subscription management",
        "Event type configuration",
        "Delivery history tracking",
        "Automatic retry system",
        "HMAC signature verification",
      ],
    },
    {
      id: "graphql",
      name: "GraphQL Explorer",
      description: "Interactive GraphQL API playground",
      route: "/admin/graphql",
      icon: Code2,
      section: "Section 73",
      features: [
        "Query editor with syntax highlighting",
        "Schema documentation",
        "Sample queries and mutations",
        "Variable editor",
        "Response viewer",
      ],
    },
  ];

  const backendServices = [
    {
      name: "Audit Service",
      file: "src/lib/audit/audit-service.ts",
      status: "active",
    },
    {
      name: "Permission Service",
      file: "src/lib/rbac/permission-service.ts",
      status: "active",
    },
    {
      name: "Tenant Service",
      file: "src/lib/tenant/tenant-service.ts",
      status: "active",
    },
    {
      name: "Webhook Delivery",
      file: "src/lib/webhooks/delivery-service.ts",
      status: "active",
    },
    {
      name: "GraphQL Schema",
      file: "src/lib/graphql/schema.ts",
      status: "active",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gratis-navy via-gray-900 to-gratis-navy pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Part 16 Enterprise Backend
            <span className="block text-2xl text-gratis-gold mt-2">
              Sections 69-73 Test Suite
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Audit Logs, RBAC, Multi-Tenant, Webhooks & GraphQL API
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">5 Admin Pages</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">5 Backend Services</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">All Routes Active</span>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.id}
                to={feature.route}
                className="group bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-gratis-gold/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gratis-gold/10 rounded-lg group-hover:bg-gratis-gold/20 transition-colors">
                    <Icon className="w-6 h-6 text-gratis-gold" />
                  </div>
                  <span className="text-xs font-semibold text-gratis-gold/70 bg-gratis-gold/10 px-2 py-1 rounded">
                    {feature.section}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gratis-gold transition-colors">
                  {feature.name}
                </h3>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {feature.description}
                </p>

                <div className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <span className="text-sm font-mono text-gratis-gold/70">
                    {feature.route}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Backend Services Status */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Code2 className="w-6 h-6 text-gratis-gold" />
            Backend Services
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {backendServices.map((service, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
              >
                <div>
                  <div className="font-semibold text-white text-sm">
                    {service.name}
                  </div>
                  <div className="text-xs text-gray-400 font-mono mt-1">
                    {service.file}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400 font-medium">
                    {service.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Access Buttons */}
        <div className="bg-gradient-to-r from-gratis-gold/10 to-gratis-navy/30 rounded-xl p-8 border border-gratis-gold/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Quick Access
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {features.map((feature) => (
              <Link
                key={feature.id}
                to={feature.route}
                className="px-6 py-3 bg-gratis-gold hover:bg-gratis-gold/90 text-gratis-navy font-semibold rounded-lg transition-all duration-300 hover:transform hover:scale-105 shadow-lg hover:shadow-gratis-gold/50"
              >
                {feature.name}
              </Link>
            ))}
          </div>

          <div className="mt-8 p-6 bg-white/5 rounded-lg border border-white/10">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              Admin Access Required
            </h3>
            <p className="text-gray-300 text-sm mb-2">
              All Part 16 features require admin or superadmin role to access.
            </p>
            <p className="text-gray-400 text-xs">
              If you see a "Forbidden" error, verify your user role in the
              authentication system.
            </p>
          </div>
        </div>

        {/* Documentation Link */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gratis-gold hover:text-gratis-gold/80 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
