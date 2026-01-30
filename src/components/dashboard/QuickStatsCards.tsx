import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { Crown, Droplet, Heart, Vote } from "lucide-react";
import { formatEuro } from "@/lib/currency";

interface UserData {
  tribeTier: "explorer" | "insider" | "core" | "founder";
  bottlesClaimed: number;
  bottlesLimit: number;
  totalImpact: number;
  nextVoteDate?: Date;
}

interface QuickStatsCardsProps {
  userData: UserData;
}

const tierInfo = {
  explorer: { label: "Explorer", color: "bg-gray-500", limit: 1 },
  insider: { label: "Insider", color: "bg-blue-500", limit: 2 },
  core: { label: "Core", color: "bg-magenta-500", limit: 4 },
  founder: { label: "Founder", color: "bg-orange-500", limit: 999 },
};

export function QuickStatsCards({ userData }: QuickStatsCardsProps) {
  const tier = tierInfo[userData.tribeTier];
  const bottlesRemaining = userData.bottlesLimit - userData.bottlesClaimed;
  const bottleProgress =
    (userData.bottlesClaimed / userData.bottlesLimit) * 100;

  // Calculate days until next vote (example: Q1 2026 vote on April 1)
  const nextVote = userData.nextVoteDate || new Date(2026, 3, 1); // April 1, 2026
  const daysUntilVote = Math.ceil(
    (nextVote.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Tier Card */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Your Tier</CardTitle>
          <Crown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            <Badge className={`${tier.color} text-white`}>
              {tier.label.toUpperCase()}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {userData.tribeTier === "founder"
              ? "Lifetime Member"
              : "Active Membership"}
          </p>
          {userData.tribeTier !== "founder" && (
            <Link to="/tribe">
              <Button variant="link" size="sm" className="px-0 mt-2">
                Upgrade →
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>

      {/* Bottles This Month Card */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Bottles This Month
          </CardTitle>
          <Droplet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">
            {userData.bottlesClaimed} /{" "}
            {userData.bottlesLimit === 999 ? "∞" : userData.bottlesLimit}
          </div>
          {userData.bottlesLimit !== 999 && (
            <Progress value={bottleProgress} className="mb-2" />
          )}
          <p className="text-xs text-muted-foreground">
            {bottlesRemaining > 0 || userData.bottlesLimit === 999
              ? `${bottlesRemaining === 999 ? "Unlimited" : bottlesRemaining} remaining`
              : "Resets in " +
                (new Date().getDate() > 1
                  ? 32 - new Date().getDate() + " days"
                  : "1 day")}
          </p>
        </CardContent>
      </Card>

      {/* Total Impact Card */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Impact</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">
            {formatEuro(userData.totalImpact)}
          </div>
          <p className="text-xs text-muted-foreground">
            Your contribution to date
          </p>
          <Link to="/impact">
            <Button variant="link" size="sm" className="px-0 mt-2">
              View Details →
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Next Vote Card */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Next Vote</CardTitle>
          <Vote className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {userData.tribeTier === "explorer" ? (
            <>
              <div className="text-2xl font-bold mb-2">—</div>
              <p className="text-xs text-muted-foreground">
                Upgrade to vote on fund allocation
              </p>
              <Link to="/tribe">
                <Button variant="link" size="sm" className="px-0 mt-2">
                  Upgrade →
                </Button>
              </Link>
            </>
          ) : daysUntilVote <= 0 ? (
            <>
              <div className="text-2xl font-bold mb-2 text-primary">
                Vote Now!
              </div>
              <p className="text-xs text-muted-foreground">
                Q1 2026 Allocation
              </p>
              <Link to="/dashboard/vote">
                <Button variant="link" size="sm" className="px-0 mt-2">
                  Cast Vote →
                </Button>
              </Link>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold mb-2">
                {daysUntilVote} days
              </div>
              <p className="text-xs text-muted-foreground">
                Q1 2026 Allocation
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
