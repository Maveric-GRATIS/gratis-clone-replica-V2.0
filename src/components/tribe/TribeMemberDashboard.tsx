/**
 * TRIBE Member Dashboard
 * Complete membership management, bottle claiming, stats, and voting
 */

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Bottle,
  Calendar,
  TrendingUp,
  Award,
  Heart,
  Users,
  Sparkles,
  QrCode,
  Check,
  Download,
  CreditCard,
  Settings,
  Gift,
  Vote,
  Crown,
} from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import QRCodeLib from "qrcode";
import { useToast } from "@/hooks/use-toast";

interface MemberData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  tier: "monthly" | "quarterly" | "annual";
  memberSince: Date;
  bottlesClaimedTotal: number;
  bottlesAvailable: number;
  nextBottleDate: Date;
  impactScore: number;
  votingCredits: number;
  referrals: number;
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ec4899"];

export function TribeMemberDashboard() {
  const [memberData, setMemberData] = useState<MemberData>({
    id: "TRIBE-2024-1234",
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex@example.com",
    tier: "quarterly",
    memberSince: new Date("2024-01-15"),
    bottlesClaimedTotal: 8,
    bottlesAvailable: 1,
    nextBottleDate: new Date("2024-04-01"),
    impactScore: 2450,
    votingCredits: 3,
    referrals: 2,
  });

  const [qrCode, setQrCode] = useState<string>("");
  const { toast } = useToast();

  // Generate QR code for bottle claiming
  useEffect(() => {
    QRCodeLib.toDataURL(
      JSON.stringify({
        memberId: memberData.id,
        type: "bottle_claim",
        timestamp: Date.now(),
      }),
      {
        width: 200,
        margin: 2,
      },
    ).then(setQrCode);
  }, [memberData.id]);

  // Mock impact data
  const impactData = [
    { month: "Jan", bottles: 3, impact: 45 },
    { month: "Feb", bottles: 3, impact: 45 },
    { month: "Mar", bottles: 2, impact: 30 },
  ];

  const allocationData = [
    { name: "Clean Water", value: 40, color: "#10b981" },
    { name: "Education", value: 30, color: "#3b82f6" },
    { name: "Healthcare", value: 20, color: "#f59e0b" },
    { name: "Environment", value: 10, color: "#ec4899" },
  ];

  const handleClaimBottle = () => {
    toast({
      title: "Bottle Claimed!",
      description:
        "Your bottle is ready for pickup. Show your QR code at any collection point.",
    });
    setMemberData((prev) => ({
      ...prev,
      bottlesAvailable: prev.bottlesAvailable - 1,
      bottlesClaimedTotal: prev.bottlesClaimedTotal + 1,
    }));
  };

  const tierInfo = {
    monthly: { name: "Monthly TRIBE", icon: Bottle, color: "text-blue-600" },
    quarterly: {
      name: "Quarterly TRIBE",
      icon: Sparkles,
      color: "text-purple-600",
    },
    annual: { name: "Annual TRIBE", icon: Crown, color: "text-amber-600" },
  };

  const currentTier = tierInfo[memberData.tier];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={memberData.avatar} />
            <AvatarFallback className="text-xl">
              {memberData.firstName[0]}
              {memberData.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {memberData.firstName}!
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <currentTier.icon className={`h-4 w-4 ${currentTier.color}`} />
              <span className="text-sm text-muted-foreground">
                {currentTier.name} Member
              </span>
              <Badge variant="outline" className="ml-2">
                {memberData.id}
              </Badge>
            </div>
          </div>
        </div>
        <Button variant="outline" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bottles Claimed</p>
                <p className="text-3xl font-bold">
                  {memberData.bottlesClaimedTotal}
                </p>
              </div>
              <Bottle className="h-10 w-10 text-primary opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Impact Score</p>
                <p className="text-3xl font-bold">{memberData.impactScore}</p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Voting Credits</p>
                <p className="text-3xl font-bold">{memberData.votingCredits}</p>
              </div>
              <Vote className="h-10 w-10 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Referrals</p>
                <p className="text-3xl font-bold">{memberData.referrals}</p>
              </div>
              <Users className="h-10 w-10 text-purple-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bottles" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="bottles">Bottles</TabsTrigger>
          <TabsTrigger value="impact">Impact</TabsTrigger>
          <TabsTrigger value="voting">Voting</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Bottles Tab */}
        <TabsContent value="bottles" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Claim Bottle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bottle className="h-5 w-5" />
                  Claim Your Bottle
                </CardTitle>
                <CardDescription>
                  You have {memberData.bottlesAvailable} bottle(s) available
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {memberData.bottlesAvailable > 0 ? (
                  <>
                    <div className="flex justify-center p-4 bg-white rounded-lg">
                      {qrCode && (
                        <img src={qrCode} alt="QR Code" loading="lazy" className="w-48 h-48" />
                      )}
                    </div>
                    <p className="text-sm text-center text-muted-foreground">
                      Show this QR code at any GRATIS collection point
                    </p>
                    <Button className="w-full" onClick={handleClaimBottle}>
                      <Check className="mr-2 h-4 w-4" />
                      Mark as Claimed
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download QR Code
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Bottle className="h-16 w-16 mx-auto text-muted-foreground opacity-20 mb-4" />
                    <p className="font-medium mb-2">
                      No bottles available right now
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your next bottle will be ready on{" "}
                      {memberData.nextBottleDate.toLocaleDateString()}
                    </p>
                    <Progress value={75} className="max-w-xs mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">
                      23 days until next bottle
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Collection Points */}
            <Card>
              <CardHeader>
                <CardTitle>Nearby Collection Points</CardTitle>
                <CardDescription>
                  Find a location to claim your bottle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Central Station", distance: "0.5 km", open: true },
                    { name: "City Mall", distance: "1.2 km", open: true },
                    {
                      name: "University Campus",
                      distance: "2.3 km",
                      open: false,
                    },
                  ].map((point) => (
                    <div
                      key={point.name}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{point.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {point.distance} away
                        </p>
                      </div>
                      <Badge variant={point.open ? "default" : "secondary"}>
                        {point.open ? "Open" : "Closed"}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Locations
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Bottle History */}
          <Card>
            <CardHeader>
              <CardTitle>Bottle Claim History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  {
                    date: "2024-03-15",
                    location: "Central Station",
                    impact: "+30 pts",
                  },
                  {
                    date: "2024-02-28",
                    location: "City Mall",
                    impact: "+30 pts",
                  },
                  {
                    date: "2024-02-10",
                    location: "University Campus",
                    impact: "+30 pts",
                  },
                ].map((claim, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 border-b last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bottle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{claim.location}</p>
                        <p className="text-sm text-muted-foreground">
                          {claim.date}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-600">
                      {claim.impact}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Impact Tab */}
        <TabsContent value="impact" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Impact Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Your Impact Over Time</CardTitle>
                <CardDescription>
                  Bottles claimed and impact generated
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={impactData}>
                    <defs>
                      <linearGradient
                        id="colorImpact"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="impact"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorImpact)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Impact Allocation */}
            <Card>
              <CardHeader>
                <CardTitle>Impact Allocation</CardTitle>
                <CardDescription>Where your contributions go</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {allocationData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">
                        {item.name} ({item.value}%)
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Impact Badges */}
          <Card>
            <CardHeader>
              <CardTitle>Impact Achievements</CardTitle>
              <CardDescription>Milestones you've reached</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "First Bottle", icon: Bottle, unlocked: true },
                  { name: "5 Bottles", icon: Gift, unlocked: true },
                  { name: "Voter", icon: Vote, unlocked: true },
                  { name: "Referrer", icon: Users, unlocked: true },
                  { name: "10 Bottles", icon: Award, unlocked: false },
                  { name: "Champion", icon: Crown, unlocked: false },
                ].map((badge) => (
                  <div
                    key={badge.name}
                    className={`p-4 border-2 rounded-lg text-center ${
                      badge.unlocked
                        ? "border-primary bg-primary/5"
                        : "border-border opacity-50"
                    }`}
                  >
                    <badge.icon
                      className={`h-10 w-10 mx-auto mb-2 ${
                        badge.unlocked
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                    <p className="text-sm font-medium">{badge.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Voting Tab */}
        <TabsContent value="voting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quarterly Voting</CardTitle>
              <CardDescription>
                Use your {memberData.votingCredits} voting credits to influence
                our initiatives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "Solar Panel Installation",
                    description:
                      "Install 100 solar panels in rural communities",
                    votes: 234,
                    myVotes: 0,
                  },
                  {
                    title: "School Water Filters",
                    description: "Provide clean water filters to 50 schools",
                    votes: 189,
                    myVotes: 2,
                  },
                  {
                    title: "Community Garden Project",
                    description:
                      "Build 20 community gardens for local food production",
                    votes: 156,
                    myVotes: 1,
                  },
                ].map((initiative) => (
                  <div key={initiative.title} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">
                          {initiative.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {initiative.description}
                        </p>
                      </div>
                      {initiative.myVotes > 0 && (
                        <Badge variant="outline" className="ml-2">
                          {initiative.myVotes} votes
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Progress
                          value={(initiative.votes / 300) * 100}
                          className="mb-2"
                        />
                        <p className="text-xs text-muted-foreground">
                          {initiative.votes} total votes
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-4"
                        disabled={memberData.votingCredits === 0}
                      >
                        <Vote className="mr-2 h-4 w-4" />
                        Vote
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-accent rounded-lg">
                <p className="text-sm">
                  <strong>Voting ends:</strong> March 31, 2024
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Results will be announced in the next quarterly report
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Referral Program</CardTitle>
              <CardDescription>Invite friends and earn rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                  <div>
                    <p className="font-semibold">Your Referral Code</p>
                    <p className="text-2xl font-bold text-primary mt-1">
                      ALEX-2024
                    </p>
                  </div>
                  <Button variant="outline">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 border rounded-lg">
                    <p className="text-3xl font-bold">{memberData.referrals}</p>
                    <p className="text-sm text-muted-foreground">Referrals</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-3xl font-bold">
                      €{memberData.referrals * 5}
                    </p>
                    <p className="text-sm text-muted-foreground">Earned</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-3xl font-bold">
                      {memberData.referrals * 2}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Bonus Bottles
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Membership Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Current Plan</p>
                  <p className="text-sm text-muted-foreground">
                    {currentTier.name}
                  </p>
                </div>
                <Button variant="outline">Change Plan</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Payment Method</p>
                  <p className="text-sm text-muted-foreground">•••• 4242</p>
                </div>
                <Button variant="outline">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Update
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Next Billing Date</p>
                  <p className="text-sm text-muted-foreground">
                    April 15, 2024
                  </p>
                </div>
                <Button variant="outline">View Invoices</Button>
              </div>
              <Button variant="destructive" className="w-full">
                Cancel Membership
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
