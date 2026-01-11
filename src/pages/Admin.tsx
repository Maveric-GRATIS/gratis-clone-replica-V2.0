import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  ShoppingCart,
  Users,
  Video,
  Calendar,
  Megaphone,
  FileText,
  BarChart3,
} from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { products } = useProducts();

  const stats = [
    {
      title: "Total Products",
      value: products.length.toString(),
      description: "Active products",
      icon: Package,
      color: "text-blue-500",
    },
    {
      title: "Orders",
      value: "0",
      description: "This month",
      icon: ShoppingCart,
      color: "text-green-500",
    },
    {
      title: "Users",
      value: "0",
      description: "Registered",
      icon: Users,
      color: "text-purple-500",
    },
    {
      title: "Videos",
      value: "0",
      description: "Published",
      icon: Video,
      color: "text-red-500",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Admin Panel
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage all aspects of your GRATIS platform
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="overflow-x-auto -mx-4 px-4 pb-2">
            <TabsList className="inline-flex h-auto w-auto min-w-full lg:grid lg:grid-cols-8 lg:w-auto gap-1 p-1">
              <TabsTrigger
                value="dashboard"
                className="flex-shrink-0 flex items-center gap-2 px-3 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="whitespace-nowrap">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger
                value="products"
                className="flex-shrink-0 flex items-center gap-2 px-3 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Package className="h-4 w-4" />
                <span className="whitespace-nowrap">Products</span>
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="flex-shrink-0 flex items-center gap-2 px-3 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="whitespace-nowrap">Orders</span>
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="flex-shrink-0 flex items-center gap-2 px-3 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Users className="h-4 w-4" />
                <span className="whitespace-nowrap">Users</span>
              </TabsTrigger>
              <TabsTrigger
                value="videos"
                className="flex-shrink-0 flex items-center gap-2 px-3 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Video className="h-4 w-4" />
                <span className="whitespace-nowrap">Videos</span>
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="flex-shrink-0 flex items-center gap-2 px-3 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Calendar className="h-4 w-4" />
                <span className="whitespace-nowrap">Events</span>
              </TabsTrigger>
              <TabsTrigger
                value="campaigns"
                className="flex-shrink-0 flex items-center gap-2 px-3 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Megaphone className="h-4 w-4" />
                <span className="whitespace-nowrap">Campaigns</span>
              </TabsTrigger>
              <TabsTrigger
                value="blog"
                className="flex-shrink-0 flex items-center gap-2 px-3 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <FileText className="h-4 w-4" />
                <span className="whitespace-nowrap">Blog</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4 md:space-y-6">
            <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
              {stats.map(({ title, value, description, icon: Icon, color }) => (
                <Card key={title} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xs sm:text-sm font-medium">
                      {title}
                    </CardTitle>
                    <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${color}`} />
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-xl sm:text-2xl font-bold">{value}</div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      {description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">
                    Recent Activity
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Latest updates from your platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg bg-muted/50">
                      <Package className="h-5 w-5 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium truncate">
                          Products loaded
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          {products.length} products in catalog
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg bg-muted/50">
                      <ShoppingCart className="h-5 w-5 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium truncate">
                          Orders system ready
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          No orders yet
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg bg-muted/50">
                      <Users className="h-5 w-5 sm:h-4 sm:w-4 text-purple-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium truncate">
                          User management active
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          Firebase connected
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">
                    Quick Actions
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Common administrative tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 sm:gap-3">
                    <Button
                      onClick={() => setActiveTab("products")}
                      variant="outline"
                      className="justify-start gap-3 h-auto py-3 sm:py-2.5"
                      size="lg"
                    >
                      <Package className="h-5 w-5 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
                      <span className="text-sm sm:text-base font-medium">
                        Manage Products
                      </span>
                    </Button>
                    <Button
                      onClick={() => setActiveTab("orders")}
                      variant="outline"
                      className="justify-start gap-3 h-auto py-3 sm:py-2.5"
                      size="lg"
                    >
                      <ShoppingCart className="h-5 w-5 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm sm:text-base font-medium">
                        View Orders
                      </span>
                    </Button>
                    <Button
                      onClick={() => setActiveTab("videos")}
                      variant="outline"
                      className="justify-start gap-3 h-auto py-3 sm:py-2.5"
                      size="lg"
                    >
                      <Video className="h-5 w-5 sm:h-4 sm:w-4 text-red-500 flex-shrink-0" />
                      <span className="text-sm sm:text-base font-medium">
                        Manage Videos
                      </span>
                    </Button>
                    <Button
                      onClick={() => setActiveTab("events")}
                      variant="outline"
                      className="justify-start gap-3 h-auto py-3 sm:py-2.5"
                      size="lg"
                    >
                      <Calendar className="h-5 w-5 sm:h-4 sm:w-4 text-orange-500 flex-shrink-0" />
                      <span className="text-sm sm:text-base font-medium">
                        Create Event
                      </span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Products Management</CardTitle>
                <CardDescription>Manage your product catalog</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Product management interface coming soon...
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Total products: {products.length}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Orders Management</CardTitle>
                <CardDescription>
                  View and manage customer orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Orders management interface coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Users Management</CardTitle>
                <CardDescription>
                  Manage registered users and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  User management interface coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos">
            <Card>
              <CardHeader>
                <CardTitle>Videos Management</CardTitle>
                <CardDescription>
                  Upload and manage Impact TV videos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Video management interface coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Events Management</CardTitle>
                <CardDescription>Create and manage events</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Event management interface coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns">
            <Card>
              <CardHeader>
                <CardTitle>Campaigns Management</CardTitle>
                <CardDescription>
                  Create and manage marketing campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Campaign management interface coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog">
            <Card>
              <CardHeader>
                <CardTitle>Blog Posts Management</CardTitle>
                <CardDescription>Create and manage blog posts</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Blog management interface coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
