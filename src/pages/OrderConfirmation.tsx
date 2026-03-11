import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "@/firebase";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Loader2 } from "lucide-react";
import { SEO } from "@/components/SEO";

interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: Timestamp;
}

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const orderRef = doc(db, "orders", orderId);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          const data = orderSnap.data();
          setOrder({
            id: orderSnap.id,
            order_number: data.order_number,
            status: data.status,
            total: data.total,
            created_at: data.created_at,
          } as Order);
        } else {
          console.error("No such order!");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Order not found</p>
          <Button onClick={() => navigate("/rig")}>Return to Store</Button>
        </Card>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Order Confirmation"
        description="Your order has been confirmed"
      />
      <div className="min-h-screen bg-background py-12">
        <div className="container max-w-2xl mx-auto px-4">
          <Card className="p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
              <p className="text-muted-foreground">
                Thank you for your purchase. We've sent a confirmation email
                with your order details.
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-6 mb-6">
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Number</span>
                  <span className="font-semibold">{order.order_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Date</span>
                  <span className="font-semibold">
                    {order.created_at.toDate().toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="font-semibold">
                    {formatPrice(order.total)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-semibold capitalize">
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => navigate(`/orders/${order.id}`)}
                className="w-full"
                size="lg"
              >
                <Package className="mr-2 h-4 w-4" />
                View Order Details
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/rig")}
                className="w-full"
              >
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
