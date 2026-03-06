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
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import {
  Package,
  Heart,
  Droplet,
  Leaf,
  ShoppingBag,
  User,
  Vote,
  Settings as SettingsIcon,
} from "lucide-react";
import { format } from "date-fns";
import { formatEuro } from "@/lib/currency";
import { SEO } from "@/components/SEO";
import { PageHero } from "@/components/PageHero";
import { EmptyState } from "@/components/EmptyState";
import { QuickStatsCards } from "@/components/dashboard/QuickStatsCards";
import { ClaimBottleCTA } from "@/components/dashboard/ClaimBottleCTA";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { ImpactSummary } from "@/components/dashboard/ImpactSummary";
import { SubscriptionManagement } from "@/components/subscription/SubscriptionManagement";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { useEffect, useState } from "react";

interface Order {
  id: string;
  order_number?: string;
  total: number;
  status: string;
  createdAt: Timestamp;
}

interface UserData {
  tribeTier: "explorer" | "insider" | "core" | "founder";
  bottlesClaimed: number;
  bottlesLimit: number;
  totalImpact: number;
  nextVoteDate?: Date;
  firstName?: string;
  lastName?: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData>({
    tribeTier: "explorer",
    bottlesClaimed: 0,
    bottlesLimit: 1,
    totalImpact: 0,
    nextVoteDate: new Date(2026, 3, 1), // April 1, 2026
    firstName: "",
    lastName: "",
  });

  // Real-time listener for user data
  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();

        // Set bottle limit based on tier
        const tierLimits = {
          explorer: 1,
          insider: 2,
          core: 4,
          founder: 999,
        };

        setUserData({
          tribeTier: data.tribeTier || "explorer",
          bottlesClaimed: data.bottlesClaimed || 0,
          bottlesLimit:
            tierLimits[data.tribeTier as keyof typeof tierLimits] || 1,
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          totalImpact: data.totalImpact || 0,
          nextVoteDate: data.nextVoteDate?.toDate() || new Date(2026, 3, 1),
        });
      }
    });

    return () => unsubscribe();
  }, [user]);

  const { data: orders } = useQuery<Order[], Error>({
    queryKey: ["user-orders", user?.uid],
    queryFn: async () => {
      if (!user) return [];

      const ordersRef = collection(db, "orders");
      const q = query(
        ordersRef,
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(5),
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Order,
      );
    },
    enabled: !!user,
  });

  const { data: wishlistCount } = useQuery<number, Error>({
    queryKey: ["wishlist-count", user?.uid],
    queryFn: async () => {
      if (!user) return 0;

      const wishlistRef = collection(db, "wishlists");
      const q = query(wishlistRef, where("user_id", "==", user.uid));
      const snapshot = await getDocs(q);

      return snapshot.size;
    },
    enabled: !!user,
  });

  // Calculate bottles remaining and next reset date
  const bottlesRemaining =
    userData.bottlesLimit === 999
      ? 999
      : userData.bottlesLimit - userData.bottlesClaimed;
  const now = new Date();
  const nextResetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  if (!user) {
    return (
      <>
        <SEO title="Dashboard" description="Sign in to view your dashboard" />
        <PageHero title="Dashboard" subtitle="Track your impact and activity" />
        <div className="container max-w-4xl mx-auto px-4 pb-16">
          <EmptyState
            icon={User}
            title="Sign In Required"
            description="Please sign in to view your dashboard and track your impact"
            actionLabel="Sign In"
            actionHref="/auth"
          />
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="My Dashboard"
        description="View your orders, impact metrics, and manage your TRIBE membership"
      />

      <PageHero
        title={`Welcome Back${userData.firstName ? ", " + userData.firstName : ""}!`}
        subtitle="Your GRATIS Impact Dashboard"
      />
      <DashboardNav />
      <div className="bg-background pb-16">
        <div className="container max-w-6xl mx-auto px-4 space-y-8">
          {/* Quick Stats Cards */}
          <QuickStatsCards userData={userData} />

          {/* Claim Bottle CTA */}
          <ClaimBottleCTA
            bottlesAvailable={bottlesRemaining}
            nextResetDate={nextResetDate}
            userTier={userData.tribeTier}
          />

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Activity Feed */}
            <ActivityFeed />

            {/* Impact Summary */}
            <ImpactSummary totalImpact={userData.totalImpact} />
          </div>

          {/* Subscription Management - Show for paid tiers */}
          {userData.tribeTier !== "explorer" && user && (
            <SubscriptionManagement userId={user.uid} />
          )}

          {/* Active Vote Section (if voting period is active) */}
          {userData.tribeTier !== "explorer" && (
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Vote className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        Q1 2026 Allocation Vote
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Cast your vote before April 1, 2026
                      </p>
                    </div>
                  </div>
                  <Link to="/dashboard/vote">
                    <Button size="lg">Vote Now</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Links */}
          <div className="grid gap-4 md:grid-cols-4">
            <Link to="/dashboard/bottles">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">My Bottles</CardTitle>
                  </div>
                  <CardDescription>Track your orders</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/dashboard/vote">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Vote className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Vote</CardTitle>
                  </div>
                  <CardDescription>
                    {userData.tribeTier === "explorer"
                      ? "Upgrade to vote"
                      : "Shape our impact"}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/dashboard/settings">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <SettingsIcon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Settings</CardTitle>
                  </div>
                  <CardDescription>Manage account</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/impact">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Full Impact</CardTitle>
                  </div>
                  <CardDescription>See global metrics</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
          {/* Recent Orders Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>
                    Your latest purchases from The Rig Store
                  </CardDescription>
                </div>
                <Link to="/orders">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {orders && orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <Link key={order.id} to={`/orders/${order.id}`}>
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <ShoppingBag className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">
                              Order #
                              {order.order_number ??
                                order.id.slice(-8).toUpperCase()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.createdAt?.toDate
                                ? format(
                                    order.createdAt.toDate(),
                                    "MMM dd, yyyy",
                                  )
                                : "—"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatEuro(order.total)}
                          </p>
                          <Badge
                            variant={
                              order.status === "completed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    No store orders yet
                  </p>
                  <Link to="/rig">
                    <Button>Explore The Rig Store</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
