/**
 * Part 10 - Section 51: Integration Marketplace
 * Third-party app integrations and connections
 */

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Star,
  Download,
  CheckCircle2,
  Settings,
  Zap,
  Mail,
  BarChart3,
  CreditCard,
  MessageSquare,
  Share2,
} from "lucide-react";

// Mock data
const availableIntegrations = [
  {
    id: "1",
    slug: "mailchimp",
    name: "Mailchimp",
    provider: "Mailchimp",
    description:
      "Sync donors with Mailchimp audiences for email marketing campaigns.",
    category: "email",
    logoUrl: "/integrations/mailchimp.svg",
    rating: 4.8,
    installCount: 1245,
    pricing: "free",
    features: [
      "Sync donors to audiences",
      "Automated welcome sequences",
      "Campaign tracking",
    ],
    isInstalled: true,
  },
  {
    id: "2",
    slug: "slack",
    name: "Slack",
    provider: "Slack",
    description:
      "Get real-time notifications about donations and milestones in Slack.",
    category: "communication",
    logoUrl: "/integrations/slack.svg",
    rating: 4.9,
    installCount: 2341,
    pricing: "free",
    features: ["Donation alerts", "Daily summaries", "Milestone celebrations"],
    isInstalled: true,
  },
  {
    id: "3",
    slug: "google-analytics",
    name: "Google Analytics",
    provider: "Google",
    description: "Track donation conversions and user behavior.",
    category: "analytics",
    logoUrl: "/integrations/ga.svg",
    rating: 4.7,
    installCount: 3456,
    pricing: "free",
    features: ["Conversion tracking", "Event tracking", "E-commerce tracking"],
    isInstalled: false,
  },
  {
    id: "4",
    slug: "stripe",
    name: "Stripe Connect",
    provider: "Stripe",
    description: "Advanced payment processing and financial reporting.",
    category: "payment",
    logoUrl: "/integrations/stripe.svg",
    rating: 4.9,
    installCount: 5678,
    pricing: "freemium",
    features: ["Multi-currency", "Subscription management", "Detailed reports"],
    isInstalled: true,
  },
  {
    id: "5",
    slug: "hubspot",
    name: "HubSpot CRM",
    provider: "HubSpot",
    description: "Manage donor relationships with HubSpot CRM.",
    category: "crm",
    logoUrl: "/integrations/hubspot.svg",
    rating: 4.6,
    installCount: 892,
    pricing: "freemium",
    features: ["Contact sync", "Deal tracking", "Activity logging"],
    isInstalled: false,
  },
  {
    id: "6",
    slug: "zapier",
    name: "Zapier",
    provider: "Zapier",
    description: "Connect GRATIS.NGO to thousands of apps with Zapier.",
    category: "automation",
    logoUrl: "/integrations/zapier.svg",
    rating: 4.8,
    installCount: 1567,
    pricing: "freemium",
    features: [
      "Trigger automations",
      "Custom workflows",
      "5000+ app connections",
    ],
    isInstalled: false,
  },
];

const installedIntegrations = availableIntegrations.filter(
  (i) => i.isInstalled,
);

const categories = [
  { id: "all", name: "All", icon: Zap },
  { id: "email", name: "Email", icon: Mail },
  { id: "analytics", name: "Analytics", icon: BarChart3 },
  { id: "payment", name: "Payment", icon: CreditCard },
  { id: "communication", name: "Communication", icon: MessageSquare },
  { id: "automation", name: "Automation", icon: Share2 },
];

export default function IntegrationMarketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredIntegrations = availableIntegrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    const cat = categories.find((c) => c.id === category);
    return cat?.icon || Zap;
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Integration Marketplace</h1>
          <p className="text-muted-foreground">
            Connect with your favorite tools and services
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Integrations
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {availableIntegrations.length}
            </div>
            <p className="text-xs text-muted-foreground">Ready to connect</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Integrations
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {installedIntegrations.length}
            </div>
            <p className="text-xs text-muted-foreground">Currently connected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Installs
            </CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {availableIntegrations
                .reduce((sum, i) => sum + i.installCount, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Across all apps</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                availableIntegrations.reduce((sum, i) => sum + i.rating, 0) /
                availableIntegrations.length
              ).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">User satisfaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="marketplace" className="space-y-4">
        <TabsList>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="installed">
            Installed ({installedIntegrations.length})
          </TabsTrigger>
        </TabsList>

        {/* Marketplace Tab */}
        <TabsContent value="marketplace" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search integrations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex gap-2 mt-4 flex-wrap">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={
                        selectedCategory === category.id ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {category.name}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Integration Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredIntegrations.map((integration) => {
              const CategoryIcon = getCategoryIcon(integration.category);
              return (
                <Card
                  key={integration.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <CategoryIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {integration.name}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground">
                            {integration.provider}
                          </p>
                        </div>
                      </div>
                      {integration.isInstalled && (
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Installed
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="line-clamp-2">
                      {integration.description}
                    </CardDescription>

                    {/* Features */}
                    <div className="space-y-1">
                      {integration.features.slice(0, 3).map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">
                            {integration.rating}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {integration.installCount.toLocaleString()} installs
                        </div>
                      </div>
                      <Badge variant="outline">{integration.pricing}</Badge>
                    </div>

                    {/* Action Button */}
                    {integration.isInstalled ? (
                      <Button variant="outline" className="w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        Configure
                      </Button>
                    ) : (
                      <Button className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Install
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Installed Tab */}
        <TabsContent value="installed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Integrations</CardTitle>
              <CardDescription>
                Manage your connected apps and services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {installedIntegrations.map((integration) => {
                  const CategoryIcon = getCategoryIcon(integration.category);
                  return (
                    <div
                      key={integration.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <CategoryIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{integration.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {integration.provider} • {integration.category}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Active
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
