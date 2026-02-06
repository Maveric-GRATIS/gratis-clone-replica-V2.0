import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Package, TrendingUp, ShoppingCart, Clock, Eye } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/firebase';
import { collection, getDocs, doc, updateDoc, orderBy, query } from 'firebase/firestore';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Order {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  items: { productId: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: { seconds: number; nanoseconds: number };
  shippingAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export default function AdminOrders() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: orders, isLoading } = useQuery<Order[], Error>({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const ordersCollection = collection(db, 'orders');
      const q = query(ordersCollection, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Order);
    }
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: Order['status'] }) => {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status, updatedAt: new Date() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Order status updated');
    },
    onError: () => {
      toast.error('Failed to update order status');
    }
  });

  const filteredOrders = orders?.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders?.length || 0,
    pending: orders?.filter(o => o.status === 'pending').length || 0,
    processing: orders?.filter(o => o.status === 'processing').length || 0,
    delivered: orders?.filter(o => o.status === 'delivered').length || 0,
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered': return 'default';
      case 'shipped': return 'default';
      case 'processing': return 'secondary';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Management</CardTitle>
            <CardDescription>View and manage all customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">Loading orders...</p>
            ) : filteredOrders?.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No orders found</p>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders?.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">
                          #{order.id.slice(0, 8)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.userName || 'Unknown'}</div>
                            <div className="text-sm text-muted-foreground">{order.userEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>{order.items?.length || 0} items</TableCell>
                        <TableCell className="font-semibold">€{order.total?.toFixed(2) || '0.00'}</TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(status) => updateOrderStatus.mutate({
                              orderId: order.id,
                              status: status as Order['status']
                            })}
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue>
                                <Badge variant={getStatusColor(order.status)}>
                                  {order.status}
                                </Badge>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {format(new Date(order.createdAt.seconds * 1000), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" title="View details">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
