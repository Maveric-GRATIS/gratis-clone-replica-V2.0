import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SEO } from "@/components/SEO";
import { PageHero } from "@/components/PageHero";
import {
  Users,
  Clock,
  CheckCircle,
  Gift,
  Copy,
  Check,
  Mail,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { toast } from "sonner";
import type {
  Referral,
  ReferralStats,
  ReferralStatus,
  RewardTier,
} from "@/types/referral";

// Status configurations
const statusConfig: Record<
  ReferralStatus,
  { label: string; color: string; icon: typeof Clock }
> = {
  pending: {
    label: "Pending",
    color: "bg-gray-100 text-gray-700",
    icon: Clock,
  },
  registered: {
    label: "Registered",
    color: "bg-blue-100 text-blue-700",
    icon: Users,
  },
  qualified: {
    label: "Qualified",
    color: "bg-yellow-100 text-yellow-700",
    icon: TrendingUp,
  },
  rewarded: {
    label: "Rewarded",
    color: "bg-green-100 text-green-700",
    icon: Gift,
  },
  expired: {
    label: "Expired",
    color: "bg-red-100 text-red-700",
    icon: Clock,
  },
};

// Reward tiers
const rewardTiers: RewardTier[] = [
  { referrals: 1, reward: "Free Bottle", icon: "🍶", unlocked: true },
  { referrals: 5, reward: "€10 Shop Credit", icon: "💰", unlocked: true },
  {
    referrals: 10,
    reward: "Limited Edition Bottle",
    icon: "⭐",
    unlocked: false,
  },
  {
    referrals: 25,
    reward: "TRIBE Supporter Month",
    icon: "👑",
    unlocked: false,
  },
  { referrals: 50, reward: "VIP Event Access", icon: "🎉", unlocked: false },
  { referrals: 100, reward: "Legend Status", icon: "🏆", unlocked: false },
];

// Format currency
const formatCurrency = (cents: number, currency: string) => {
  const amount = cents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

// Mock data
const mockReferrals: Referral[] = [
  {
    id: "r1",
    referrerId: "user1",
    referrerCode: "SARAH2026",
    referredUserId: "u2",
    referredEmail: "jan@example.com",
    referredName: "Jan de Vries",
    status: "rewarded",
    clickCount: 3,
    qualificationCriteria: {
      hasOrdered: true,
      hasJoinedTribe: true,
      hasDonated: false,
      spentAmount: 2500,
    },
    referrerReward: { type: "bottle", value: 1, claimed: true },
    referredReward: { type: "discount", value: 1000, claimed: true },
    invitedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    registeredAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
    qualifiedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    rewardedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    id: "r2",
    referrerId: "user1",
    referrerCode: "SARAH2026",
    referredUserId: "u3",
    referredEmail: "emma@example.com",
    referredName: "Emma Jansen",
    status: "qualified",
    clickCount: 2,
    qualificationCriteria: {
      hasOrdered: true,
      hasJoinedTribe: false,
      hasDonated: true,
      spentAmount: 5000,
    },
    referrerReward: { type: "discount", value: 1000, claimed: false },
    invitedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    registeredAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    qualifiedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
  },
  {
    id: "r3",
    referrerId: "user1",
    referrerCode: "SARAH2026",
    referredEmail: "michael@example.com",
    status: "pending",
    clickCount: 5,
    qualificationCriteria: {
      hasOrdered: false,
      hasJoinedTribe: false,
      hasDonated: false,
      spentAmount: 0,
    },
    invitedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 85 * 24 * 60 * 60 * 1000),
  },
];

const mockStats: ReferralStats = {
  totalReferrals: 12,
  pendingReferrals: 3,
  qualifiedReferrals: 7,
  rewardedReferrals: 5,
  totalRewardsEarned: 5000, // €50
  currentStreak: 3,
  bestStreak: 5,
};

export default function ReferralsPage() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [inviteEmails, setInviteEmails] = useState("");

  const referralCode = "SARAH2026";
  const referralLink = `https://gratis.ngo/join?ref=${referralCode}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success("Referral link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleSendInvites = () => {
    if (!inviteEmails.trim()) {
      toast.error("Please enter at least one email address");
      return;
    }
    toast.success("Invitations sent successfully!");
    setInviteEmails("");
  };

  const shareOnSocial = (platform: string) => {
    const text = encodeURIComponent(
      "Join GRATIS.NGO and make an impact with every purchase! 🌍",
    );
    const url = encodeURIComponent(referralLink);

    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], "_blank", "width=600,height=400");
    }
  };

  // Calculate next tier
  const currentTier = rewardTiers
    .filter((t) => t.unlocked)
    .sort((a, b) => b.referrals - a.referrals)[0];
  const nextTier = rewardTiers.find((t) => !t.unlocked);
  const progressToNext = nextTier
    ? (mockStats.totalReferrals / nextTier.referrals) * 100
    : 100;

  return (
    <>
      <SEO
        title="Referral Program"
        description="Invite friends and earn rewards with the GRATIS referral program"
      />

      <PageHero
        title="Referral Program"
        subtitle="Share GRATIS with friends and earn amazing rewards together"
      />

      <div className="container py-12 space-y-8">
        {/* Share Card */}
        <Card>
          <CardHeader>
            <CardTitle>Share Your Referral Link</CardTitle>
            <CardDescription>
              Invite friends to join GRATIS and you'll both earn rewards!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Referral Link */}
            <div>
              <Label htmlFor="referral-link">Your Unique Link</Label>
              <div className="flex gap-2 mt-2">
                <div className="relative flex-1">
                  <Input
                    id="referral-link"
                    value={referralLink}
                    readOnly
                    className="pr-20"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={copyToClipboard}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span className="ml-2">{copied ? "Copied!" : "Copy"}</span>
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Your referral code:{" "}
                <span className="font-mono font-bold">{referralCode}</span>
              </p>
            </div>

            {/* Social Share */}
            <div>
              <Label>Share on Social Media</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => shareOnSocial("facebook")}
                >
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => shareOnSocial("twitter")}
                >
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => shareOnSocial("linkedin")}
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => shareOnSocial("whatsapp")}
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Email Invites */}
            <div>
              <Label htmlFor="invite-emails">Invite by Email</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="invite-emails"
                  placeholder="friend1@example.com, friend2@example.com"
                  value={inviteEmails}
                  onChange={(e) => setInviteEmails(e.target.value)}
                />
                <Button onClick={handleSendInvites}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {mockStats.totalReferrals}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total Referrals
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {mockStats.pendingReferrals}
                  </p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {mockStats.qualifiedReferrals}
                  </p>
                  <p className="text-xs text-muted-foreground">Qualified</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Gift className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {formatCurrency(mockStats.totalRewardsEarned, "EUR")}
                  </p>
                  <p className="text-xs text-muted-foreground">Earned</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress to Next Tier */}
        {nextTier && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Progress to Next Reward</span>
                <Badge variant="outline">
                  {currentTier ? currentTier.reward : "Getting Started"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">
                    {mockStats.totalReferrals} / {nextTier.referrals} referrals
                  </span>
                  <span className="text-muted-foreground">
                    {nextTier.referrals - mockStats.totalReferrals} more to go!
                  </span>
                </div>
                <Progress value={progressToNext} className="h-3" />
                <p className="text-sm text-muted-foreground">
                  Next reward:{" "}
                  <span className="font-semibold">{nextTier.reward}</span>{" "}
                  {nextTier.icon}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reward Tiers */}
        <Card>
          <CardHeader>
            <CardTitle>Reward Tiers</CardTitle>
            <CardDescription>
              Unlock amazing rewards as you refer more friends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewardTiers.map((tier, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-4 border rounded-lg ${
                    tier.unlocked
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{tier.icon}</span>
                    {tier.unlocked && (
                      <Badge className="bg-green-600">Unlocked</Badge>
                    )}
                  </div>
                  <p className="font-semibold">{tier.reward}</p>
                  <p className="text-sm text-muted-foreground">
                    {tier.referrals} referral{tier.referrals > 1 ? "s" : ""}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Referrals Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Referrals</CardTitle>
            <CardDescription>
              Track the status of all your referrals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Friend</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Reward</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockReferrals.map((referral) => {
                  const StatusIcon = statusConfig[referral.status].icon;
                  return (
                    <TableRow key={referral.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={undefined} />
                            <AvatarFallback>
                              {(referral.referredName ||
                                referral.referredEmail)[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {referral.referredName || referral.referredEmail}
                            </p>
                            {referral.referredName && (
                              <p className="text-sm text-muted-foreground">
                                {referral.referredEmail}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={statusConfig[referral.status].color}
                          variant="secondary"
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig[referral.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(referral.invitedAt)}
                      </TableCell>
                      <TableCell>
                        {referral.referrerReward ? (
                          <span className="text-sm font-medium text-green-600">
                            {referral.referrerReward.type === "bottle"
                              ? "Free Bottle"
                              : formatCurrency(
                                  referral.referrerReward.value,
                                  "EUR",
                                )}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Pending
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
