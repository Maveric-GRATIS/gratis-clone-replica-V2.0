import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Video,
  Calendar,
  Megaphone,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  TrendingUp,
  DollarSign,
  Eye,
  Mail,
  UserCog,
  Image,
} from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useAllProducts } from "@/hooks/useAllProducts";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import logoGratis from "@/assets/logo-gratis.png";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { products, loading: productsLoading } = useAllProducts();
  const { users, loading: usersLoading } = useUsers();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const stats = [
    {
      title: "Total Revenue",
      value: "€12.345",
      change: "+20.1%",
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Orders",
      value: "145",
      change: "+12.5%",
      icon: ShoppingCart,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Products",
      value: products.length.toString(),
      change: "+3",
      icon: Package,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Users",
      value: users.length.toString(),
      change: `+${users.length}`,
      icon: Users,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  const menuItems = [
    { icon: LayoutDashboard, label: "Overview", value: "overview" },
    { icon: Package, label: "Products", value: "products" },
    { icon: ShoppingCart, label: "Orders", value: "orders" },
    { icon: Users, label: "Users", value: "users" },
    { icon: Video, label: "Videos", value: "videos" },
    { icon: Calendar, label: "Events", value: "events" },
    { icon: Megaphone, label: "Campaigns", value: "campaigns" },
    { icon: FileText, label: "Blog", value: "blog" },
  ];

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString("nl-NL", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95">
        <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logoGratis}
              alt="GRATIS"
              loading="eager"
              className="h-8 w-auto"
            />
            <span className="font-bold text-lg hidden sm:inline">Admin</span>
          </Link>

          {/* Spacer */}
          <div className="flex-1" />

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Site
              </Button>
            </Link>
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <div className="text-right">
                <p className="font-medium">
                  {user?.displayName || user?.email}
                </p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 border-r bg-background transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } top-16 lg:static lg:top-0`}
        >
          <div className="flex h-full flex-col gap-2 p-4">
            <nav className="flex-1 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.value}
                  onClick={() => {
                    setActiveTab(item.value);
                    setSidebarOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    activeTab === item.value
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="border-t pt-4">
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === "settings"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="overview" className="space-y-6 mt-0">
              <div>
                <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
                <p className="text-muted-foreground">
                  Welcome back! Here's what's happening with your store.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">
                        {stat.title}
                      </CardTitle>
                      <div className={`rounded-full p-2 ${stat.bgColor}`}>
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3" />
                        <span className="text-green-500">{stat.change}</span>
                        <span>from last month</span>
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Users</CardTitle>
                    <CardDescription>Latest registered users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {usersLoading ? (
                      <p className="text-sm text-muted-foreground">
                        Loading users...
                      </p>
                    ) : users.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No users yet
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {users.slice(0, 5).map((userData) => (
                          <div
                            key={userData.id}
                            className="flex items-center justify-between border-b pb-3 last:border-0"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Users className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {userData.displayName || "No name"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {userData.email}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant={
                                userData.role === "admin"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {userData.role || "customer"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Latest customer orders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-3">
                        <div>
                          <p className="font-medium">Order #1234</p>
                          <p className="text-sm text-muted-foreground">
                            2 items • €45.99
                          </p>
                        </div>
                        <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-full">
                          Completed
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b pb-3">
                        <div>
                          <p className="font-medium">Order #1233</p>
                          <p className="text-sm text-muted-foreground">
                            5 items • €125.50
                          </p>
                        </div>
                        <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-1 rounded-full">
                          Processing
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Order #1232</p>
                          <p className="text-sm text-muted-foreground">
                            1 item • €15.99
                          </p>
                        </div>
                        <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-full">
                          Pending
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Products</CardTitle>
                    <CardDescription>
                      Best selling items this month
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {products.slice(0, 3).map((product, index) => (
                        <div
                          key={product.id}
                          className="flex items-center gap-3"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                            #{index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              €{product.price.toFixed(2)}
                            </p>
                          </div>
                          <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Users Tab - Full Table */}
            <TabsContent value="users" className="space-y-6 mt-0">
              <div>
                <h1 className="text-3xl font-bold mb-2">Users Management</h1>
                <p className="text-muted-foreground">
                  View and manage all registered users from Firestore.
                </p>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>All Users ({users.length})</CardTitle>
                  <CardDescription>
                    Complete list of registered users in the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <div className="flex items-center justify-center p-12">
                      <div className="text-center space-y-3">
                        <Users className="h-12 w-12 mx-auto text-muted-foreground animate-pulse" />
                        <p className="text-muted-foreground">
                          Loading users...
                        </p>
                      </div>
                    </div>
                  ) : users.length === 0 ? (
                    <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg">
                      <div className="text-center space-y-3">
                        <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="text-muted-foreground">
                          No users registered yet
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Users will appear here once they create accounts
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-md border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Registered</TableHead>
                            <TableHead>Last Login</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map((userData) => (
                            <TableRow key={userData.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Users className="h-4 w-4 text-primary" />
                                  </div>
                                  <span className="truncate">
                                    {userData.displayName || "No name"}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                  <span className="truncate">
                                    {userData.email}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    userData.role === "admin"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  <UserCog className="h-3 w-3 mr-1" />
                                  {userData.role || "customer"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground whitespace-nowrap">
                                {formatDate(userData.createdAt)}
                              </TableCell>
                              <TableCell className="text-muted-foreground whitespace-nowrap">
                                {formatDate(userData.lastLogin)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Products Tab - Full Table */}
            <TabsContent value="products" className="space-y-6 mt-0">
              <div>
                <h1 className="text-3xl font-bold mb-2">Products Management</h1>
                <p className="text-muted-foreground">
                  View and manage all products from Firestore.
                </p>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>All Products ({products.length})</CardTitle>
                  <CardDescription>
                    Complete list of products in the store
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {productsLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <p className="text-muted-foreground">
                        Loading products...
                      </p>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg">
                      <div className="text-center space-y-3">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="text-muted-foreground">No products yet</p>
                        <p className="text-sm text-muted-foreground">
                          Run the addProducts script to populate the database
                        </p>
                        <Button variant="outline">
                          npx tsx scripts/addProducts.ts
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-md border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Featured</TableHead>
                            <TableHead>Tier</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {products.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                  <div className="h-12 w-12 rounded bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {product.image_url ? (
                                      <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <Image className="h-6 w-6 text-muted-foreground" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-medium truncate">
                                      {product.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                      {product.description || "No description"}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize">
                                  {product.category}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-semibold">
                                    €{product.price.toFixed(2)}
                                  </span>
                                  {product.original_price && (
                                    <span className="text-xs text-muted-foreground line-through">
                                      €{product.original_price.toFixed(2)}
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    product.in_stock ? "default" : "destructive"
                                  }
                                >
                                  {product.in_stock
                                    ? "In Stock"
                                    : "Out of Stock"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {product.featured ? (
                                  <Badge variant="secondary">⭐ Featured</Badge>
                                ) : (
                                  <span className="text-muted-foreground text-sm">
                                    -
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="capitalize">
                                <Badge variant="outline">
                                  {product.tier || "standard"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Placeholder tabs */}
            {menuItems
              .filter(
                (item) =>
                  item.value !== "users" &&
                  item.value !== "overview" &&
                  item.value !== "products",
              )
              .map((item) => (
                <TabsContent
                  key={item.value}
                  value={item.value}
                  className="space-y-6 mt-0"
                >
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{item.label}</h1>
                    <p className="text-muted-foreground">
                      Manage your {item.label.toLowerCase()} here.
                    </p>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>{item.label} Management</CardTitle>
                      <CardDescription>
                        This section is under development. Full{" "}
                        {item.label.toLowerCase()} management features coming
                        soon.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg">
                        <div className="text-center space-y-3">
                          <item.icon className="h-12 w-12 mx-auto text-muted-foreground" />
                          <p className="text-muted-foreground">
                            No {item.label.toLowerCase()} yet
                          </p>
                          <Button>Add {item.label}</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}

            <TabsContent value="settings" className="space-y-6 mt-0">
              <div>
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-muted-foreground">
                  Manage your store settings and preferences.
                </p>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Store Settings</CardTitle>
                  <CardDescription>
                    Configure your store preferences and options.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Settings panel coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
