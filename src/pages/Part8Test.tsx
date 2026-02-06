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
  Trophy,
  Headphones,
  TrendingUp,
  Webhook,
  Shield,
  Award,
  Star,
  Target,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";

export default function Part8Test() {
  const features = [
    {
      title: "Gamification Profile",
      description: "View achievements, badges, levels, and streaks",
      path: "/gamification",
      icon: Trophy,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      status: "Implemented",
      features: [
        "Badge showcase with 18+ badges",
        "10-level progression system",
        "Login & donation streaks",
        "XP tracking and rewards",
        "Secret badges",
      ],
    },
    {
      title: "Support Tickets",
      description: "Customer support ticket system",
      path: "/support",
      icon: Headphones,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      status: "Implemented",
      features: [
        "Create support tickets",
        "Filter by status & priority",
        "Search tickets",
        "Ticket categories",
        "Message thread",
      ],
    },
    {
      title: "Leaderboard",
      description: "Rankings and competitions",
      path: "/leaderboard",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      status: "Implemented",
      features: [
        "Top 3 spotlight",
        "Full rankings table",
        "Multiple leaderboard types",
        "Timeframe filters",
        "Rank change indicators",
      ],
    },
    {
      title: "Admin Support Dashboard",
      description: "Manage customer support tickets (Admin only)",
      path: "/admin/support",
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      status: "Implemented",
      features: [
        "Ticket management",
        "Agent assignment",
        "Canned responses",
        "Support statistics",
        "Priority handling",
      ],
    },
  ];

  const services = [
    {
      name: "Gamification Service",
      description: "Badge awarding, XP management, streak tracking",
      status: "Implemented",
      endpoints: [
        "initializeUserProfile()",
        "getUserStats()",
        "addXP()",
        "awardBadge()",
        "checkAndAwardBadges()",
        "updateStreak()",
        "getLeaderboard()",
        "getActiveChallenges()",
      ],
    },
    {
      name: "Webhook Service",
      description: "External integrations and event notifications",
      status: "Implemented",
      endpoints: [
        "registerWebhook()",
        "triggerWebhook()",
        "queueWebhookDelivery()",
        "verifySignature()",
        "getDeliveryHistory()",
        "retryDelivery()",
        "getWebhookStats()",
      ],
    },
  ];

  const apiRoutes = [
    {
      path: "/api/gamification/profile/:userId",
      method: "GET",
      description: "Get user gamification profile",
    },
    {
      path: "/api/gamification/xp",
      method: "POST",
      description: "Add XP to user",
    },
    {
      path: "/api/gamification/badges/award",
      method: "POST",
      description: "Award badge to user",
    },
    {
      path: "/api/gamification/badges/check",
      method: "POST",
      description: "Check and award badges",
    },
    {
      path: "/api/leaderboard",
      method: "GET",
      description: "Get leaderboard data",
    },
    {
      path: "/api/webhooks/register",
      method: "POST",
      description: "Register new webhook",
    },
    {
      path: "/api/webhooks/:webhookId",
      method: "PUT",
      description: "Update webhook configuration",
    },
    {
      path: "/api/webhooks/:webhookId/test",
      method: "POST",
      description: "Test webhook endpoint",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 bg-clip-text text-transparent">
            Part 8 Implementation Test
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Gamification, Support, Webhooks & Leaderboards
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge className="bg-green-500 text-white">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              All Features Implemented
            </Badge>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${feature.bgColor}`}>
                        <Icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <div>
                        <CardTitle>{feature.title}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-600"
                    >
                      {feature.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to={feature.path}>
                    <Button className="w-full">Visit Page</Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Services Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Backend Services
            </CardTitle>
            <CardDescription>
              Core service implementations for Part 8 features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-600"
                    >
                      {service.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{service.description}</p>
                  <div className="space-y-1">
                    {service.endpoints.map((endpoint, idx) => (
                      <div
                        key={idx}
                        className="text-xs font-mono bg-gray-100 px-2 py-1 rounded"
                      >
                        {endpoint}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* API Routes Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="h-5 w-5" />
              API Routes
            </CardTitle>
            <CardDescription>
              RESTful API endpoints for Part 8 features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {apiRoutes.map((route, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Badge
                    variant="outline"
                    className={
                      route.method === "GET"
                        ? "text-blue-600 border-blue-600"
                        : route.method === "POST"
                          ? "text-green-600 border-green-600"
                          : route.method === "PUT"
                            ? "text-orange-600 border-orange-600"
                            : "text-red-600 border-red-600"
                    }
                  >
                    {route.method}
                  </Badge>
                  <code className="text-sm font-mono flex-1">{route.path}</code>
                  <span className="text-sm text-gray-600">
                    {route.description}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Implementation Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Implementation Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-blue-600">18+</div>
                <div className="text-sm text-gray-600">Badges Implemented</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-cyan-600">10</div>
                <div className="text-sm text-gray-600">Level System</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-purple-600">3</div>
                <div className="text-sm text-gray-600">Streak Types</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-green-600">8</div>
                <div className="text-sm text-gray-600">Ticket Categories</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-orange-600">9</div>
                <div className="text-sm text-gray-600">Webhook Events</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-pink-600">4</div>
                <div className="text-sm text-gray-600">Leaderboard Types</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Navigation</CardTitle>
            <CardDescription>Access all Part 8 features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link to="/gamification">
                <Button variant="outline" className="w-full">
                  <Trophy className="mr-2 h-4 w-4" />
                  Gamification
                </Button>
              </Link>
              <Link to="/support">
                <Button variant="outline" className="w-full">
                  <Headphones className="mr-2 h-4 w-4" />
                  Support
                </Button>
              </Link>
              <Link to="/leaderboard">
                <Button variant="outline" className="w-full">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Leaderboard
                </Button>
              </Link>
              <Link to="/admin/support">
                <Button variant="outline" className="w-full">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Support
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
