import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatEuro } from '@/lib/currency';
import { Loader2, ArrowLeft, Package, MapPin } from 'lucide-react';
import { SEO } from '@/components/SEO';

interface OrderItem {
  id: string;
  product_name: string;
  product_image: string | null;
  variants: any;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface ShippingAddress {
  full_name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  created_at: string;
}

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [address, setAddress] = useState<ShippingAddress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single();

      if (orderError) {
        console.error('Error fetching order:', orderError);
        setLoading(false);
        return;
      }

      setOrder(orderData);

      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (!itemsError) {
        setItems(itemsData || []);
      }

      const { data: addressData, error: addressError } = await supabase
        .from('shipping_addresses')
        .select('*')
        .eq('order_id', orderId)
        .single();

      if (!addressError) {
        setAddress(addressData);
      }

      setLoading(false);
    };

    fetchOrderDetails();
  }, [orderId, navigate]);

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
          <Button onClick={() => navigate('/orders')}>Back to Orders</Button>
        </Card>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`Order ${order.order_number}`}
        description="View your order details"
      />
      <div className="min-h-screen bg-background py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/orders')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Order {order.order_number}</h1>
              <p className="text-muted-foreground">
                Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <Badge className="text-base px-4 py-2 capitalize">
              {order.status}
            </Badge>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <Card className="md:col-span-2 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.product_image || '/placeholder.svg'}
                      alt={item.product_name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.product_name}</h3>
                      {item.variants && typeof item.variants === 'object' && Object.keys(item.variants).length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          {(item.variants as any).size && `Size: ${(item.variants as any).size}`}
                          {(item.variants as any).color && ` • Color: ${(item.variants as any).color}`}
                        </p>
                      )}
                      <p className="text-sm mt-1">
                        Qty: {item.quantity} × {formatEuro(item.unit_price)}
                      </p>
                    </div>
                    <p className="font-semibold">{formatEuro(item.total_price)}</p>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatEuro(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{formatEuro(order.shipping_cost)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatEuro(order.total)}</span>
                </div>
              </div>
            </Card>

            <div className="space-y-6">
              {address && (
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </h2>
                  <div className="text-sm space-y-1">
                    <p className="font-semibold">{address.full_name}</p>
                    <p>{address.address_line1}</p>
                    {address.address_line2 && <p>{address.address_line2}</p>}
                    <p>
                      {address.city}, {address.state} {address.postal_code}
                    </p>
                    <p>{address.country}</p>
                    <p className="mt-2">{address.phone}</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
