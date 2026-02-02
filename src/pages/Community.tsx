import SEO from "@/components/SEO";
import { PageHero } from "@/components/PageHero";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CommunityActivityFeed } from "@/components/social/CommunityActivityFeed";
import { Leaderboard } from "@/components/social/Leaderboard";
import { Users, Trophy, Activity, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Community() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Community | GRATIS.NGO"
        description="Join our global community of water champions. See what others are achieving, compete on leaderboards, and make an impact together."
        canonical={
          typeof window !== "undefined" ? window.location.href : "/community"
        }
      />

      <PageHero
        title="Community"
        subtitle="Connect with water champions around the world"
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <p className="text-3xl font-bold">12,459</p>
              <p className="text-sm text-muted-foreground">Active Members</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Activity className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="text-3xl font-bold">234</p>
              <p className="text-sm text-muted-foreground">Activities Today</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-3xl font-bold">1,842</p>
              <p className="text-sm text-muted-foreground">
                Achievements Unlocked
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Sparkles className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <p className="text-3xl font-bold">€248K</p>
              <p className="text-sm text-muted-foreground">Community Impact</p>
            </CardContent>
          </Card>
        </div>

        {/* TRIBE Member CTA */}
        {!user || !user.emailVerified || user.isAnonymous ? (
          <Card className="mb-12 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Trophy className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      Join TRIBE for Exclusive Access
                    </h3>
                    <p className="text-muted-foreground">
                      Unlock special community features, early access to events,
                      and amplify your impact
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  {!user && (
                    <Link to="/auth">
                      <Button variant="outline">Sign In</Button>
                    </Link>
                  )}
                  <Link to="/tribe">
                    <Button>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Explore TRIBE
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity Feed - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Community Activity
                </CardTitle>
                <CardDescription>
                  See what water champions around the world are achieving
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CommunityActivityFeed filter="all" />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <Leaderboard type="impact" timeframe="monthly" limit={10} />

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/events">
                  <Button variant="ghost" className="w-full justify-start">
                    Upcoming Events
                  </Button>
                </Link>
                <Link to="/tribe">
                  <Button variant="ghost" className="w-full justify-start">
                    Join TRIBE
                  </Button>
                </Link>
                <Link to="/impact">
                  <Button variant="ghost" className="w-full justify-start">
                    View Global Impact
                  </Button>
                </Link>
                <Link to="/dashboard/vote">
                  <Button variant="ghost" className="w-full justify-start">
                    Vote on Projects
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Community Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">
                    1
                  </Badge>
                  <p>Be respectful and supportive of all members</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">
                    2
                  </Badge>
                  <p>Share authentic impact stories and achievements</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">
                    3
                  </Badge>
                  <p>Celebrate collective progress and milestones</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">
                    4
                  </Badge>
                  <p>Report any inappropriate content or behavior</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
