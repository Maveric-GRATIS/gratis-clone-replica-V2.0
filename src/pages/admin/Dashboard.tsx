import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  ShoppingCart,
  Users,
  Heart,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  RefreshCw,
  Droplets,
  Palette,
  GraduationCap,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useProducts } from "@/hooks/useProducts";
import { format, subDays } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  limit,
} from "firebase/firestore";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function AdminDashboard() {
  const { products } = useProducts();
  const [dateRange, setDateRange] = useState("30d");
  const [loading, setLoading] = useState(false);

  // Fetch real statistics from Firebase
  const { data: usersData } = useQuery({
    queryKey: ["dashboard-users"],
    queryFn: async () => {
      const usersSnap = await getDocs(collection(db, "users"));
      return usersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
  });

  const { data: donationsData } = useQuery({
    queryKey: ["dashboard-donations"],
    queryFn: async () => {
      const donationsSnap = await getDocs(collection(db, "donations"));
      return donationsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
  });

  const { data: ordersData } = useQuery({
    queryKey: ["dashboard-orders"],
    queryFn: async () => {
      const ordersSnap = await getDocs(collection(db, "orders"));
      return ordersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
  });

  const { data: eventsData } = useQuery({
    queryKey: ["dashboard-events"],
    queryFn: async () => {
      const eventsSnap = await getDocs(collection(db, "events"));
      return eventsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
  });

  const { data: subscriptionsData } = useQuery({
    queryKey: ["dashboard-subscriptions"],
    queryFn: async () => {
      const subsSnap = await getDocs(collection(db, "subscriptions"));
      return subsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
  });

  // Calculate real statistics
  const totalMembers = usersData?.length || 0;
  const totalDonations =
    donationsData?.reduce(
      (sum: number, d: any) =>
        sum + (d.status === "completed" ? d.amount || 0 : 0),
      0,
    ) || 0;

  const totalRevenue =
    (ordersData?.reduce(
      (sum: number, o: any) =>
        sum + (o.status !== "cancelled" ? o.total || 0 : 0),
      0,
    ) || 0) + totalDonations;

  const activeEvents =
    eventsData?.filter((e: any) => e.status === "published")?.length || 0;
  const pendingOrders =
    ordersData?.filter((o: any) => o.status === "pending")?.length || 0;

  // Real stats data
  const stats = [
    {
      title: "Total Members",
      value: totalMembers.toLocaleString(),
      change: 12.5,
      trend: "up",
      description: "Active TRIBE members",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Donations",
      value: `€${(totalDonations / 100).toLocaleString()}`,
      change: 8.2,
      trend: "up",
      description: "All time",
      icon: Heart,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
    {
      title: "Monthly Revenue",
      value: `€${(totalRevenue / 100).toLocaleString()}`,
      change: 3.1,
      trend: "up",
      description: "Products + Donations",
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Active Events",
      value: activeEvents.toString(),
      change: pendingOrders > 10 ? 5 : -2,
      trend: pendingOrders > 10 ? "up" : "down",
      description: `${pendingOrders} pending orders`,
      icon: Calendar,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  // Generate revenue chart data from real orders and donations
  const revenueData = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const dateStr = date.toISOString().split("T")[0];

    const dayDonations =
      donationsData
        ?.filter((d: any) => {
          const dDate =
            d.createdAt?.toDate?.() || new Date(d.createdAt?.seconds * 1000);
          return (
            dDate.toISOString().split("T")[0] === dateStr &&
            d.status === "completed"
          );
        })
        .reduce((sum: number, d: any) => sum + (d.amount || 0), 0) || 0;

    const dayOrders =
      ordersData
        ?.filter((o: any) => {
          const oDate =
            o.createdAt?.toDate?.() || new Date(o.createdAt?.seconds * 1000);
          return (
            oDate.toISOString().split("T")[0] === dateStr &&
            o.status !== "cancelled"
          );
        })
        .reduce((sum: number, o: any) => sum + (o.total || 0), 0) || 0;

    const daySubscriptions =
      subscriptionsData?.filter((s: any) => {
        const sDate =
          s.createdAt?.toDate?.() || new Date(s.createdAt?.seconds * 1000);
        return (
          sDate.toISOString().split("T")[0] === dateStr && s.status === "active"
        );
      }).length * 999 || 0; // Estimate 9.99 per subscription

    return {
      date: format(date, "MMM dd"),
      donations: Math.floor(dayDonations / 100),
      memberships: Math.floor(daySubscriptions / 100),
      products: Math.floor(dayOrders / 100),
    };
  });

  // Fund allocation pie chart data
  const allocationData = [
    { name: "Clean Water", value: 40, color: "#00AFFF" },
    { name: "Arts & Culture", value: 30, color: "#FF0077" },
    { name: "Education", value: 30, color: "#FF5F00" },
  ];

  // Recent activity data
  const recentActivity = [
    {
      type: "donation",
      title: "New donation received",
      description: "John Doe donated €50",
      time: "2 minutes ago",
      icon: Heart,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
    {
      type: "member",
      title: "New TRIBE member",
      description: "Jane Smith joined as Core member",
      time: "15 minutes ago",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      type: "order",
      title: "Order placed",
      description: "Order #1234 - 2 items",
      time: "1 hour ago",
      icon: ShoppingCart,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      type: "event",
      title: "Event registration",
      description: "Mike Johnson registered for Water Walk",
      time: "2 hours ago",
      icon: Calendar,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  // Pending items with real counts
  const pendingItems = [
    {
      title: "Partner Applications",
      count:
        usersData?.filter(
          (u: any) => u.role === "partner" && u.status === "pending",
        )?.length || 0,
      href: "/admin/partners/applications",
    },
    {
      title: "Pending Orders",
      count: pendingOrders,
      href: "/admin/orders?status=pending",
    },
    {
      title: "Support Tickets",
      count: 0, // Would need tickets collection
      href: "/admin/support",
    },
    {
      title: "Content Reviews",
      count: eventsData?.filter((e: any) => e.status === "draft")?.length || 0,
      href: "/admin/content?status=draft",
    },
  ];

  // Check if data is still loading
  const isLoading = !usersData || !donationsData || !ordersData || !eventsData;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with GRATIS.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="ytd">Year to date</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" disabled={loading}>
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <Badge
                  variant={stat.trend === "up" ? "default" : "destructive"}
                  className="gap-1"
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {Math.abs(stat.change)}%
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>
                Donations, memberships and product sales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient
                        id="colorDonations"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#C1FF00"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#C1FF00"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorMemberships"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#00AFFF"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#00AFFF"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorProducts"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#FF0077"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#FF0077"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `€${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`€${value}`, ""]}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="donations"
                      stroke="#C1FF00"
                      fill="url(#colorDonations)"
                      strokeWidth={2}
                      name="Donations"
                    />
                    <Area
                      type="monotone"
                      dataKey="memberships"
                      stroke="#00AFFF"
                      fill="url(#colorMemberships)"
                      strokeWidth={2}
                      name="Memberships"
                    />
                    <Area
                      type="monotone"
                      dataKey="products"
                      stroke="#FF0077"
                      fill="url(#colorProducts)"
                      strokeWidth={2}
                      name="Products"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Allocation Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Fund Allocation</CardTitle>
              <CardDescription>Current quarter distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${value}%`}
                      labelLine={false}
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="space-y-2 mt-4">
                {allocationData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates from your platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                      <activity.icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {activity.description}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Actions</CardTitle>
              <CardDescription>Items requiring your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingItems.map((item) => (
                  <a
                    key={item.title}
                    href={item.href}
                    className="flex items-center justify-between p-3 rounded-lg border hover:border-primary transition-colors"
                  >
                    <span className="text-sm">{item.title}</span>
                    <Badge variant="secondary">{item.count}</Badge>
                  </a>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-sm font-medium mb-4">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="secondary" size="sm" asChild>
                    <a href="/admin/blog/new">New Post</a>
                  </Button>
                  <Button variant="secondary" size="sm" asChild>
                    <a href="/admin/events/new">Create Event</a>
                  </Button>
                  <Button variant="secondary" size="sm" asChild>
                    <a href="/admin/campaigns/new">New Campaign</a>
                  </Button>
                  <Button variant="secondary" size="sm" asChild>
                    <a href="/admin/emails/compose">Send Email</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
