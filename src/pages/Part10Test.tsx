/**
 * Part 10 Test Page
 * Showcase all Part 10 features with navigation
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
  Package,
  FileText,
  Zap,
  Palette,
  CheckCircle2,
  ArrowRight,
  Box,
  Database,
  Warehouse,
  Receipt,
  Mail,
  Plug2,
  Globe,
} from "lucide-react";

export default function Part10Test() {
  const features = [
    {
      title: "Inventory Management",
      description:
        "Product catalog, stock tracking, warehouses, and purchase orders",
      path: "/admin/inventory",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      status: "Implemented",
      features: [
        "Product catalog with variants",
        "Real-time stock tracking",
        "Multiple warehouse management",
        "Purchase order system",
        "Stock alerts and notifications",
        "Inventory movement history",
      ],
      types: [
        "Product",
        "InventoryItem",
        "Warehouse",
        "PurchaseOrder",
        "StockAlert",
      ],
    },
    {
      title: "Tax Receipts",
      description: "Automated tax receipt generation and delivery",
      path: "/admin/tax-receipts",
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50",
      status: "Implemented",
      features: [
        "Automated receipt generation",
        "PDF template customization",
        "Email delivery system",
        "Annual receipt consolidation",
        "Receipt number tracking",
        "Tax deductibility management",
      ],
      types: [
        "TaxReceipt",
        "TaxReceiptDonation",
        "TaxReceiptTemplate",
        "TaxReceiptSettings",
      ],
    },
    {
      title: "Integration Marketplace",
      description: "Third-party app connections and integrations",
      path: "/admin/integrations",
      icon: Zap,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      status: "Implemented",
      features: [
        "App marketplace with 6+ integrations",
        "OAuth2 authentication flow",
        "API key management",
        "Webhook support",
        "Integration logs and monitoring",
        "Settings configuration schemas",
      ],
      types: [
        "Integration",
        "InstalledIntegration",
        "IntegrationLog",
        "OAuthConfig",
      ],
    },
    {
      title: "White-label Solution",
      description: "Custom branding and platform configuration",
      path: "/admin/white-label",
      icon: Palette,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      status: "Implemented",
      features: [
        "Custom branding and colors",
        "Logo and favicon upload",
        "Custom domain support",
        "Feature toggles",
        "Multi-language configuration",
        "Typography customization",
      ],
      types: [
        "WhiteLabelConfig",
        "BrandingConfig",
        "FeatureConfig",
        "LocalizationConfig",
      ],
    },
  ];

  const typeDefinitions = [
    {
      name: "inventory.ts",
      types: 8,
      description: "Product catalog, stock levels, warehouses, purchase orders",
      icon: Database,
    },
    {
      name: "tax-receipt.ts",
      types: 5,
      description: "Tax receipt generation, templates, settings",
      icon: Receipt,
    },
    {
      name: "integration.ts",
      types: 10,
      description: "Third-party integrations, OAuth, webhooks",
      icon: Plug2,
    },
    {
      name: "white-label.ts",
      types: 7,
      description: "Branding, features, localization, legal",
      icon: Globe,
    },
  ];

  const sections = [
    {
      number: 49,
      title: "Inventory Management System",
      pages: ["InventoryManagement"],
      types: 8,
      features: [
        "Product catalog",
        "Stock tracking",
        "Warehouses",
        "Purchase orders",
        "Stock alerts",
      ],
    },
    {
      number: 50,
      title: "Tax Receipt Generation",
      pages: ["TaxReceipts"],
      types: 5,
      features: [
        "Automated generation",
        "PDF templates",
        "Email delivery",
        "Annual receipts",
      ],
    },
    {
      number: 51,
      title: "Integration Marketplace",
      pages: ["IntegrationMarketplace"],
      types: 10,
      features: [
        "OAuth2",
        "API keys",
        "Webhooks",
        "App catalog",
        "Settings schemas",
      ],
    },
    {
      number: 52,
      title: "White-label Solution",
      pages: ["WhiteLabelConfig"],
      types: 7,
      features: [
        "Custom branding",
        "Domain config",
        "Feature toggles",
        "Localization",
      ],
    },
  ];

  return (
    <div className="container mx-auto pt-24 pb-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full">
          <Box className="h-5 w-5" />
          <span className="font-semibold">Part 10 Implementation</span>
        </div>
        <h1 className="text-4xl font-bold">Operations & White-label Suite</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Advanced operations management with inventory, tax receipts,
          integrations, and white-label configuration
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pages</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Admin pages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Types</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">30</div>
            <p className="text-xs text-muted-foreground">Type definitions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Components</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">20</div>
            <p className="text-xs text-muted-foreground">UI components</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Routes</CardTitle>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Admin routes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Features</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Key features</p>
          </CardContent>
        </Card>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card
              key={feature.path}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-12 w-12 ${feature.bgColor} rounded-lg flex items-center justify-center`}
                    >
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-green-600">
                    {feature.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Features List */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Key Features:</h4>
                  <div className="grid gap-2">
                    {feature.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Type Definitions */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">
                    Type Definitions:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {feature.types.map((type) => (
                      <Badge key={type} variant="outline" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Navigation Button */}
                <Link to={feature.path}>
                  <Button className="w-full" variant="default">
                    Open {feature.title}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Type Definitions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Type Definitions
          </CardTitle>
          <CardDescription>
            TypeScript type definitions for Part 10 features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {typeDefinitions.map((typeDef) => {
              const Icon = typeDef.icon;
              return (
                <div
                  key={typeDef.name}
                  className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <Icon className="h-8 w-8 text-muted-foreground" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm font-mono">
                      {typeDef.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {typeDef.description}
                    </p>
                  </div>
                  <Badge variant="secondary">{typeDef.types} types</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Implementation Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Summary</CardTitle>
          <CardDescription>
            Overview of all Part 10 sections and features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sections.map((section) => (
              <div
                key={section.number}
                className="border-l-4 border-blue-500 pl-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">
                    Section {section.number}: {section.title}
                  </h4>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      {section.pages.length} page
                      {section.pages.length > 1 ? "s" : ""}
                    </Badge>
                    <Badge variant="outline">{section.types} types</Badge>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {section.features.map((feat) => (
                    <Badge key={feat} variant="secondary" className="text-xs">
                      {feat}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Pages: {section.pages.join(", ")}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Navigation</CardTitle>
          <CardDescription>Jump directly to any Part 10 page</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.path} to={feature.path}>
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto py-3"
                  >
                    <Icon className={`mr-2 h-5 w-5 ${feature.color}`} />
                    <span className="text-left">{feature.title}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
