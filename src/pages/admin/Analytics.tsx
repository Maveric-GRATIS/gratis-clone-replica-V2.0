import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  Heart,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  LineChart,
  Line,
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
import { format, subDays } from "date-fns";

export default function AdminAnalytics() {
  const { data: users } = useQuery({
    queryKey: ["analytics-users"],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, "users"));
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
  });

  const { data: donations } = useQuery({
    queryKey: ["analytics-donations"],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, "donations"));
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
  });

  const { data: orders } = useQuery({
    queryKey: ["analytics-orders"],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, "orders"));
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
  });

  const { data: videos } = useQuery({
    queryKey: ["analytics-videos"],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, "videos"));
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
  });

  const { data: events } = useQuery({
    queryKey: ["analytics-events"],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, "events"));
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
  });

  const isLoading = !users || !donations || !orders || !videos || !events;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner />
        </div>
      </AdminLayout>
    );
  }

  // Calculate metrics
  const totalUsers = users.length;
  const totalDonations =
    donations.reduce(
      (sum: number, d: any) =>
        sum + (d.status === "completed" ? d.amount || 0 : 0),
      0,
    ) / 100;
  const totalRevenue =
    orders.reduce(
      (sum: number, o: any) =>
        sum + (o.status !== "cancelled" ? o.total || 0 : 0),
      0,
    ) /
      100 +
    totalDonations;
  const totalViews = videos.reduce(
    (sum: number, v: any) => sum + (v.views || 0),
    0,
  );
  const totalEventRegistrations = events.reduce(
    (sum: number, e: any) => sum + (e.registered || 0),
    0,
  );

  // User growth over last 30 days
  const userGrowthData = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const dateStr = date.toISOString().split("T")[0];

    const dayUsers = users.filter((u: any) => {
      const uDate =
        u.createdAt?.toDate?.() || new Date(u.createdAt?.seconds * 1000);
      return uDate.toISOString().split("T")[0] === dateStr;
    }).length;

    return {
      date: format(date, "MMM dd"),
      users: dayUsers,
    };
  });

  // Category distribution
  const categoryData = [
    { name: "Products", value: orders.length, color: "#00AFFF" },
    { name: "Donations", value: donations.length, color: "#FF0077" },
    { name: "Events", value: totalEventRegistrations, color: "#C1FF00" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold">Analytics Overview</h1>
            <p className="text-muted-foreground">
              Platform performance and insights
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                €{totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">All sources</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Donations</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                €{totalDonations.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {donations.length} donations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Video Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalViews.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {videos.length} videos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Event Registrations
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalEventRegistrations}
              </div>
              <p className="text-xs text-muted-foreground">
                {events.length} events
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* User Growth */}
          <Card>
            <CardHeader>
              <CardTitle>User Growth (30 Days)</CardTitle>
              <CardDescription>New user registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowthData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#00AFFF"
                      strokeWidth={2}
                      name="New Users"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Activity Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Distribution</CardTitle>
              <CardDescription>Platform engagement breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
