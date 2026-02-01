/**
 * TribeDashboard Component
 *
 * Member dashboard with stats, bottle claiming, and membership management
 */

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Crown,
  Droplets,
  TrendingUp,
  Calendar,
  Award,
  Settings,
  Vote,
  Gift,
  Download,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Link } from "react-router-dom";

// Mock membership data
const mockMemberData = {
  tier: "insider",
  tierName: "Insider",
  joinDate: "2025-11-15",
  bottlesPerMonth: 3,
  bottlesClaimed: 8,
  bottlesAvailable: 1,
  nextBottleRefresh: "2026-02-15",
  totalImpact: {
    waterLiters: 1250,
    ngosFunded: 12,
    communitiesReached: 3,
  },
  votingPower: 3,
  upcomingEvents: [
    {
      id: "1",
      title: "Amsterdam Impact Visit",
      date: "2026-03-20",
      location: "Amsterdam, NL",
    },
    {
      id: "2",
      title: "Virtual Q&A with Founders",
      date: "2026-02-28",
      location: "Online",
    },
  ],
  recentActivity: [
    {
      id: "1",
      type: "bottle_claimed",
      description: "Claimed 2 premium bottles",
      date: "2026-01-28",
    },
    {
      id: "2",
      type: "vote_cast",
      description: "Voted in Q1 2026 funding round",
      date: "2026-01-15",
    },
    {
      id: "3",
      type: "impact_milestone",
      description: "Reached 1,000 liters milestone",
      date: "2026-01-10",
    },
  ],
};

const tierBenefits = {
  explorer: [
    "1 bottle/month",
    "Impact dashboard",
    "Newsletter",
    "Community forum",
  ],
  insider: [
    "3 bottles/month",
    "Quarterly voting",
    "Member events",
    "10% discount",
  ],
  core: [
    "6 bottles/month",
    "Exclusive merch",
    "Priority support",
    "15% discount",
  ],
  founder: [
    "Unlimited bottles",
    "Founder status",
    "Name on wall",
    "Direct allocation",
  ],
};

export default function TribeDashboard() {
  const { user } = useAuth();
  const [claimingBottle, setClaimingBottle] = useState(false);

  const handleClaimBottle = async () => {
    setClaimingBottle(true);
    // TODO: Integrate with backend
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setClaimingBottle(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to view your dashboard
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/auth/login">Sign In</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="TRIBE Dashboard | GRATIS"
        description="Manage your TRIBE membership and track your impact"
      />

      {/* Header */}
      <div className="border-b bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.photoURL || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || "M"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">
                  {user.displayName || "TRIBE Member"}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="gap-1">
                    <Crown className="h-3 w-3" />
                    {mockMemberData.tierName}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Member since{" "}
                    {new Date(mockMemberData.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link to="/tribe/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bottles">Bottles</TabsTrigger>
            <TabsTrigger value="impact">Impact</TabsTrigger>
            <TabsTrigger value="voting">Voting</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Bottles Available</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {mockMemberData.bottlesAvailable}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    of {mockMemberData.bottlesPerMonth}/month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Impact</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    <AnimatedCounter
                      end={mockMemberData.totalImpact.waterLiters}
                    />
                    L
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Clean water provided
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>NGOs Funded</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {mockMemberData.totalImpact.ngosFunded}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Organizations supported
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Voting Power</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">
                    {mockMemberData.votingPower}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Votes available
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Bottle Claiming */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5" />
                  Claim Your Bottles
                </CardTitle>
                <CardDescription>
                  You have {mockMemberData.bottlesAvailable} bottle(s) ready to
                  claim
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">Monthly Allocation</p>
                    <p className="text-sm text-muted-foreground">
                      {mockMemberData.bottlesClaimed} of{" "}
                      {mockMemberData.bottlesPerMonth * 3} claimed this quarter
                    </p>
                  </div>
                  <div className="w-32">
                    <Progress
                      value={
                        (mockMemberData.bottlesClaimed /
                          (mockMemberData.bottlesPerMonth * 3)) *
                        100
                      }
                    />
                  </div>
                </div>

                {mockMemberData.bottlesAvailable > 0 && (
                  <Button
                    onClick={handleClaimBottle}
                    disabled={claimingBottle}
                    className="w-full"
                    size="lg"
                  >
                    {claimingBottle
                      ? "Processing..."
                      : `Claim ${mockMemberData.bottlesAvailable} Bottle(s)`}
                  </Button>
                )}

                <p className="text-sm text-muted-foreground text-center">
                  Next bottles available:{" "}
                  {new Date(
                    mockMemberData.nextBottleRefresh,
                  ).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockMemberData.upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.date).toLocaleDateString()} •{" "}
                        {event.location}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/events/${event.id}`}>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/events">View All Events</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockMemberData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-primary/10 mt-1">
                        {activity.type === "bottle_claimed" && (
                          <Droplets className="h-4 w-4 text-blue-600" />
                        )}
                        {activity.type === "vote_cast" && (
                          <Vote className="h-4 w-4 text-purple-600" />
                        )}
                        {activity.type === "impact_milestone" && (
                          <Award className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bottles Tab */}
          <TabsContent value="bottles" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bottle Management</CardTitle>
                <CardDescription>
                  Track and claim your monthly bottle allocation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-8 border-2 border-dashed rounded-lg">
                  <Droplets className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">
                    Bottle Claiming System
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Detailed bottle claiming interface will be implemented here
                  </p>
                  <Button>Claim Bottles</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Impact Tab */}
          <TabsContent value="impact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Impact</CardTitle>
                <CardDescription>
                  See the difference you're making through TRIBE
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-8">
                  <Award className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">
                    Impact Dashboard
                  </h3>
                  <p className="text-muted-foreground">
                    Detailed impact metrics and visualizations coming soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Voting Tab */}
          <TabsContent value="voting" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quarterly Voting</CardTitle>
                <CardDescription>
                  Vote on which NGO projects receive funding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-8">
                  <Vote className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                  <h3 className="text-lg font-semibold mb-2">
                    Voting Interface
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Next voting period starts March 1, 2026
                  </p>
                  <Button variant="outline">View Previous Results</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Membership Upgrade CTA */}
        {mockMemberData.tier !== "founder" && (
          <Card className="mt-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                Upgrade Your Impact
              </CardTitle>
              <CardDescription>
                Get more benefits and amplify your contribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {tierBenefits[
                  mockMemberData.tier === "insider" ? "core" : "founder"
                ].map((benefit) => (
                  <Badge key={benefit} variant="secondary">
                    {benefit}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link to="/tribe/upgrade">
                  Upgrade Membership
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
