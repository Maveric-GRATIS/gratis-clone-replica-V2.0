import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';

export default function AdminDashboard() {
  const { products } = useProducts();

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      description: 'Active products in catalog',
      icon: Package,
    },
    {
      title: 'Total Orders',
      value: '0',
      description: 'All time orders',
      icon: ShoppingCart,
    },
    {
      title: 'Total Users',
      value: '0',
      description: 'Registered customers',
      icon: Users,
    },
    {
      title: 'Revenue',
      value: '$0',
      description: 'Total revenue',
      icon: DollarSign,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to GRATIS Admin Panel</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ title, value, description, icon: Icon }) => (
            <Card key={title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your store</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No recent activity</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
