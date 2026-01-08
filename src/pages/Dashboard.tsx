import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { db } from '@/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { useUserImpact } from '@/hooks/useUserImpact';
import { Package, Heart, Droplet, Leaf, ShoppingBag, User } from 'lucide-react';
import { format } from 'date-fns';
import { formatEuro } from '@/lib/currency';
import SEO from '@/components/SEO';
import { PageHero } from '@/components/PageHero';
import { EmptyState } from '@/components/EmptyState';

interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data: impact } = useUserImpact();

  const { data: orders } = useQuery({
    queryKey: ['user-orders', user?.uid],
    queryFn: async () => {
      if (!user) return [];
      
      const q = query(collection(db, 'orders'), where('user_id', '==', user.uid), orderBy('created_at', 'desc'), limit(5));
      const querySnapshot = await getDocs(q);
      const orders: Order[] = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() } as Order);
      });
      return orders;
    },
    enabled: !!user
  });

  const { data: wishlistCount } = useQuery({
    queryKey: ['wishlist-count', user?.uid],
    queryFn: async () => {
      if (!user) return 0;
      
      const q = query(collection(db, 'wishlists'), where('user_id', '==', user.uid));
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    },
    enabled: !!user
  });

  if (!user) {
    return (
      <>
        <PageHero 
          title="Dashboard" 
          subtitle="Track your impact and activity"
        />
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
        description="View your orders, impact metrics, and wishlist"
      />
      
      <PageHero 
        title="Welcome Back!" 
        subtitle="Track your impact and activity with GRATIS"
      />
      
      <div className="bg-background pb-16">
        <div className="container max-w-6xl mx-auto px-4 space-y-8">
          {/* Impact Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{impact?.orders_count || 0}</div>
                <p className="text-xs text-muted-foreground">Total orders placed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Liters Funded</CardTitle>
                <Droplet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{impact?.liters_funded || 0}L</div>
                <p className="text-xs text-muted-foreground">Clean water distributed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Carbon Saved</CardTitle>
                <Leaf className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{impact?.carbon_saved?.toFixed(1) || 0}kg</div>
                <p className="text-xs text-muted-foreground">CO₂ equivalent</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Wishlist</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{wishlistCount}</div>
                <p className="text-xs text-muted-foreground">Saved items</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Your latest purchases</CardDescription>
                </div>
                <Link to="/orders">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {orders && orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Link key={order.id} to={`/orders/${order.id}`}>
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <ShoppingBag className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Order #{order.order_number}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(order.created_at), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatEuro(order.total)}</p>
                          <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No orders yet</p>
                  <Link to="/rig-store">
                    <Button>Start Shopping</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow">
              <Link to="/rig-store">
                <CardHeader>
                  <CardTitle className="text-lg">Shop Products</CardTitle>
                  <CardDescription>Browse our latest collection</CardDescription>
                </CardHeader>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <Link to="/wishlist">
                <CardHeader>
                  <CardTitle className="text-lg">My Wishlist</CardTitle>
                  <CardDescription>View your saved items</CardDescription>
                </CardHeader>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <Link to="/impact-tv">
                <CardHeader>
                  <CardTitle className="text-lg">Watch Impact TV</CardTitle>
                  <CardDescription>See your impact in action</CardDescription>
                </CardHeader>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
