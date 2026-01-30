import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/PageHero";
import { SEO } from "@/components/SEO";
import { Package, Truck, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface BottleOrder {
  id: string;
  productName: string;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  createdAt: Timestamp;
  trackingCode?: string;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "bg-yellow-500",
    variant: "secondary" as const,
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    color: "bg-blue-500",
    variant: "secondary" as const,
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    color: "bg-purple-500",
    variant: "default" as const,
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    color: "bg-green-500",
    variant: "default" as const,
  },
};

export default function MyBottles() {
  const { user } = useAuth();

  const { data: bottles, isLoading } = useQuery<BottleOrder[]>({
    queryKey: ["user-bottles", user?.uid],
    queryFn: async () => {
      if (!user) return [];

      const ordersQuery = query(
        collection(db, "orders"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
      );

      const snapshot = await getDocs(ordersQuery);
      return snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as BottleOrder,
      );
    },
    enabled: !!user,
  });

  return (
    <>
      <SEO
        title="My Bottles | Dashboard"
        description="Track your GRATIS bottle orders and shipping status"
      />

      <PageHero
        title="My Bottles"
        subtitle="Track all your GRATIS Water bottle orders"
      />

      <div className="bg-background pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Filters */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                All
              </Button>
              <Button variant="ghost" size="sm">
                Pending
              </Button>
              <Button variant="ghost" size="sm">
                Shipped
              </Button>
              <Button variant="ghost" size="sm">
                Delivered
              </Button>
            </div>
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                ← Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Bottles List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : bottles && bottles.length > 0 ? (
            <div className="space-y-4">
              {bottles.map((bottle) => {
                const status = statusConfig[bottle.status];
                const StatusIcon = status.icon;

                return (
                  <Card
                    key={bottle.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">
                            {bottle.productName || "GRATIS Water Bottle"}
                          </CardTitle>
                          <CardDescription>
                            Claimed on{" "}
                            {format(bottle.createdAt.toDate(), "MMMM dd, yyyy")}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={status.variant}
                          className="flex items-center gap-1"
                        >
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Shipping Address */}
                        <div>
                          <h4 className="text-sm font-medium mb-2">
                            Shipping to:
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {bottle.shippingAddress.street}
                            <br />
                            {bottle.shippingAddress.postalCode}{" "}
                            {bottle.shippingAddress.city}
                            <br />
                            {bottle.shippingAddress.country}
                          </p>
                        </div>

                        {/* Tracking Info */}
                        {bottle.trackingCode && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">
                              Tracking:
                            </h4>
                            <div className="flex items-center gap-2">
                              <code className="text-sm bg-muted px-2 py-1 rounded">
                                {bottle.trackingCode}
                              </code>
                              <Button variant="outline" size="sm">
                                Track Package
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Status Timeline */}
                        <div className="pt-4 border-t">
                          <div className="flex items-center gap-4">
                            <div
                              className={`flex items-center gap-2 ${bottle.status === "pending" || bottle.status === "confirmed" || bottle.status === "shipped" || bottle.status === "delivered" ? "text-primary" : "text-muted-foreground"}`}
                            >
                              <Clock className="h-4 w-4" />
                              <span className="text-xs">Pending</span>
                            </div>
                            <div className="flex-1 h-px bg-border" />
                            <div
                              className={`flex items-center gap-2 ${bottle.status === "confirmed" || bottle.status === "shipped" || bottle.status === "delivered" ? "text-primary" : "text-muted-foreground"}`}
                            >
                              <Package className="h-4 w-4" />
                              <span className="text-xs">Confirmed</span>
                            </div>
                            <div className="flex-1 h-px bg-border" />
                            <div
                              className={`flex items-center gap-2 ${bottle.status === "shipped" || bottle.status === "delivered" ? "text-primary" : "text-muted-foreground"}`}
                            >
                              <Truck className="h-4 w-4" />
                              <span className="text-xs">Shipped</span>
                            </div>
                            <div className="flex-1 h-px bg-border" />
                            <div
                              className={`flex items-center gap-2 ${bottle.status === "delivered" ? "text-primary" : "text-muted-foreground"}`}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              <span className="text-xs">Delivered</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  No bottles claimed yet
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Claim your first free GRATIS Water bottle to get started
                </p>
                <Link to="/dashboard">
                  <Button>Go to Dashboard</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
