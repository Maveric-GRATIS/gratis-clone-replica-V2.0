import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatEuro } from "@/lib/currency";
import { Loader2, Package, ChevronRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { PageHero } from "@/components/PageHero";
import { EmptyState } from "@/components/EmptyState";

interface Order {
  id: string;
  order_number?: string;
  status: string;
  total: number;
  createdAt: Timestamp;
}

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const ordersRef = collection(db, "orders");
          const q = query(
            ordersRef,
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc"),
          );

          const querySnapshot = await getDocs(q);
          const fetchedOrders = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              order_number: data.order_number,
              status: data.status,
              total: data.total,
              createdAt: data.createdAt,
            } as Order;
          });

          setOrders(fetchedOrders);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        navigate("/auth");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "processing":
        return "bg-blue-500";
      case "shipped":
        return "bg-purple-500";
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <SEO title="My Orders" description="View your order history" />

      <PageHero
        title="My Orders"
        subtitle="View and track your order history"
      />

      <div className="bg-background pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="flex justify-end mb-6">
            <Button onClick={() => navigate("/rig")}>Continue Shopping</Button>
          </div>

          {orders.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No orders yet"
              description="Start shopping to see your orders here"
              actionLabel="Browse Products"
              actionHref="/rig"
            />
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card
                  key={order.id}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">
                          {order.order_number ??
                            `#${order.id.slice(-8).toUpperCase()}`}
                        </h3>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Placed on{" "}
                        {order.createdAt?.toDate
                          ? order.createdAt
                              .toDate()
                              .toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                          : "—"}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-lg font-semibold">
                          {formatEuro(order.total)}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
