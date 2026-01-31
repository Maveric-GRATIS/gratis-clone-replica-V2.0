# GRATIS.NGO - ENTERPRISE PLATFORM DEVELOPMENT PROMPTS
## Part 4: Admin Panel, CMS, Analytics & Notification Systems

---

# 18. COMPLETE ADMIN PANEL

```
Build a comprehensive admin panel for managing all aspects of the GRATIS.NGO platform.

## ADMIN LAYOUT (src/app/[locale]/(admin)/admin/layout.tsx)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Package,
  Calendar,
  Heart,
  FileText,
  Settings,
  BarChart3,
  Bell,
  Mail,
  Shield,
  Globe,
  Video,
  MessageSquare,
  Building,
  Gift,
  Vote,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Search,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

// Navigation structure
const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Users & Members',
    icon: Users,
    children: [
      { name: 'All Users', href: '/admin/users' },
      { name: 'TRIBE Members', href: '/admin/users/tribe' },
      { name: 'Roles & Permissions', href: '/admin/users/roles' },
    ],
  },
  {
    name: 'Content',
    icon: FileText,
    children: [
      { name: 'Pages', href: '/admin/content/pages' },
      { name: 'Blog Posts', href: '/admin/content/blog' },
      { name: 'News', href: '/admin/content/news' },
      { name: 'FAQ', href: '/admin/content/faq' },
      { name: 'Media Library', href: '/admin/content/media' },
    ],
  },
  {
    name: 'Products',
    icon: Package,
    children: [
      { name: 'All Products', href: '/admin/products' },
      { name: 'Inventory', href: '/admin/products/inventory' },
      { name: 'Orders', href: '/admin/products/orders' },
    ],
  },
  {
    name: 'Donations',
    icon: Heart,
    children: [
      { name: 'All Donations', href: '/admin/donations' },
      { name: 'Campaigns', href: '/admin/donations/campaigns' },
      { name: 'Recurring', href: '/admin/donations/recurring' },
      { name: 'Reports', href: '/admin/donations/reports' },
    ],
  },
  {
    name: 'Events',
    icon: Calendar,
    children: [
      { name: 'All Events', href: '/admin/events' },
      { name: 'Registrations', href: '/admin/events/registrations' },
      { name: 'Check-In', href: '/admin/events/checkin' },
    ],
  },
  {
    name: 'Videos',
    icon: Video,
    children: [
      { name: 'Video Library', href: '/admin/videos' },
      { name: 'Upload', href: '/admin/videos/upload' },
      { name: 'Live Streams', href: '/admin/videos/live' },
    ],
  },
  {
    name: 'NGO Partners',
    icon: Building,
    children: [
      { name: 'All Partners', href: '/admin/partners' },
      { name: 'Applications', href: '/admin/partners/applications' },
      { name: 'Fund Allocation', href: '/admin/partners/allocation' },
    ],
  },
  {
    name: 'Voting',
    icon: Vote,
    children: [
      { name: 'Current Period', href: '/admin/voting' },
      { name: 'Results', href: '/admin/voting/results' },
      { name: 'History', href: '/admin/voting/history' },
    ],
  },
  {
    name: 'Communications',
    icon: Mail,
    children: [
      { name: 'Email Campaigns', href: '/admin/emails' },
      { name: 'Templates', href: '/admin/emails/templates' },
      { name: 'Notifications', href: '/admin/notifications' },
    ],
  },
  {
    name: 'Analytics',
    icon: BarChart3,
    children: [
      { name: 'Overview', href: '/admin/analytics' },
      { name: 'Traffic', href: '/admin/analytics/traffic' },
      { name: 'Conversions', href: '/admin/analytics/conversions' },
      { name: 'Impact', href: '/admin/analytics/impact' },
    ],
  },
  {
    name: 'Settings',
    icon: Settings,
    children: [
      { name: 'General', href: '/admin/settings' },
      { name: 'Branding', href: '/admin/settings/branding' },
      { name: 'Integrations', href: '/admin/settings/integrations' },
      { name: 'API Keys', href: '/admin/settings/api' },
      { name: 'Security', href: '/admin/settings/security' },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, isAdmin, signOut } = useAuth();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  
  // Check admin access
  useEffect(() => {
    if (!isAdmin) {
      router.push('/unauthorized');
    }
  }, [isAdmin, router]);
  
  // Toggle section expansion
  const toggleSection = (sectionName: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionName)
        ? prev.filter((s) => s !== sectionName)
        : [...prev, sectionName]
    );
  };
  
  // Check if path is active
  const isActive = (href: string) => pathname === href;
  const isParentActive = (children: { href: string }[]) =>
    children.some((child) => pathname.startsWith(child.href));
  
  // Auto-expand active sections
  useEffect(() => {
    navigation.forEach((item) => {
      if (item.children && isParentActive(item.children)) {
        if (!expandedSections.includes(item.name)) {
          setExpandedSections((prev) => [...prev, item.name]);
        }
      }
    });
  }, [pathname]);
  
  if (!isAdmin) {
    return null;
  }
  
  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b dark:border-gray-700">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-hot-lime rounded-lg flex items-center justify-center">
              <span className="font-bold text-jet-black">G</span>
            </div>
            <span className="font-heading font-bold text-lg dark:text-white">
              GRATIS Admin
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleSection(item.name)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 rounded-lg
                        text-sm font-medium transition-colors
                        ${isParentActive(item.children)
                          ? 'bg-hot-lime/10 text-hot-lime'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        {item.name}
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          expandedSections.includes(item.name) ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    <AnimatePresence>
                      {expandedSections.includes(item.name) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="ml-4 mt-1 space-y-1"
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`
                                flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                                transition-colors
                                ${isActive(child.href)
                                  ? 'bg-hot-lime text-jet-black font-medium'
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }
                              `}
                            >
                              <ChevronRight className="w-4 h-4" />
                              {child.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                      transition-colors
                      ${isActive(item.href)
                        ? 'bg-hot-lime text-jet-black'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </nav>
        
        {/* User Section */}
        <div className="p-4 border-t dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Avatar
              src={profile?.photoURL}
              fallback={`${profile?.firstName?.[0]}${profile?.lastName?.[0]}`}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate dark:text-white">
                {profile?.firstName} {profile?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {profile?.role}
              </p>
            </div>
            <button
              onClick={signOut}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Search */}
            <div className="hidden sm:block w-64">
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-gray-400" />}
                className="h-9"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-gray-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-500" />
              )}
            </button>
            
            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <Bell className="w-5 h-5 text-gray-500" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            
            {/* View Site */}
            <Button variant="secondary" size="sm" asChild>
              <a href="/" target="_blank" rel="noopener noreferrer">
                <Globe className="w-4 h-4 mr-2" />
                View Site
              </a>
            </Button>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

## ADMIN DASHBOARD (src/app/[locale]/(admin)/admin/page.tsx)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Heart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  RefreshCw,
} from 'lucide-react';
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
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

interface DashboardStats {
  totalMembers: number;
  memberGrowth: number;
  totalDonations: number;
  donationGrowth: number;
  totalRevenue: number;
  revenueGrowth: number;
  activeEvents: number;
  pendingOrders: number;
}

interface RecentActivity {
  id: string;
  type: 'member' | 'donation' | 'order' | 'event';
  title: string;
  description: string;
  timestamp: Date;
  amount?: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Fetch dashboard data
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        
        const [statsRes, activityRes, chartRes] = await Promise.all([
          fetch(`/api/admin/stats?range=${dateRange}`),
          fetch('/api/admin/activity?limit=10'),
          fetch(`/api/admin/chart-data?range=${dateRange}`),
        ]);
        
        const [statsData, activityData, chartData] = await Promise.all([
          statsRes.json(),
          activityRes.json(),
          chartRes.json(),
        ]);
        
        setStats(statsData);
        setRecentActivity(activityData);
        setChartData(chartData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDashboardData();
  }, [dateRange]);
  
  // Stats cards configuration
  const statsCards = [
    {
      title: 'Total Members',
      value: stats?.totalMembers.toLocaleString() || '0',
      change: stats?.memberGrowth || 0,
      icon: Users,
      color: 'text-electric-blue',
      bgColor: 'bg-electric-blue/10',
    },
    {
      title: 'Total Donations',
      value: `€${(stats?.totalDonations || 0).toLocaleString()}`,
      change: stats?.donationGrowth || 0,
      icon: Heart,
      color: 'text-hot-magenta',
      bgColor: 'bg-hot-magenta/10',
    },
    {
      title: 'Monthly Revenue',
      value: `€${(stats?.totalRevenue || 0).toLocaleString()}`,
      change: stats?.revenueGrowth || 0,
      icon: DollarSign,
      color: 'text-hot-lime',
      bgColor: 'bg-hot-lime/10',
    },
    {
      title: 'Active Events',
      value: stats?.activeEvents.toString() || '0',
      subtext: `${stats?.pendingOrders || 0} pending orders`,
      icon: Calendar,
      color: 'text-solar-orange',
      bgColor: 'bg-solar-orange/10',
    },
  ];
  
  // Allocation pie chart data
  const allocationData = [
    { name: 'Clean Water', value: 40, color: '#00AFFF' },
    { name: 'Arts & Culture', value: 30, color: '#FF0077' },
    { name: 'Education', value: 30, color: '#FF5F00' },
  ];
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Welcome back! Here's what's happening with GRATIS.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select
            value={dateRange}
            onValueChange={setDateRange}
            options={[
              { value: '7d', label: 'Last 7 days' },
              { value: '30d', label: 'Last 30 days' },
              { value: '90d', label: 'Last 90 days' },
              { value: 'ytd', label: 'Year to date' },
            ]}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              {loading ? (
                <StatCardSkeleton />
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${card.bgColor}`}>
                      <card.icon className={`w-5 h-5 ${card.color}`} />
                    </div>
                    {card.change !== undefined && (
                      <Badge
                        variant={card.change >= 0 ? 'success' : 'destructive'}
                        size="sm"
                      >
                        {card.change >= 0 ? (
                          <ArrowUpRight className="w-3 h-3 mr-1" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 mr-1" />
                        )}
                        {Math.abs(card.change)}%
                      </Badge>
                    )}
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {card.value}
                    </h3>
                    <p className="text-sm text-gray-500">{card.title}</p>
                    {card.subtext && (
                      <p className="text-xs text-gray-400 mt-1">{card.subtext}</p>
                    )}
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-bold text-gray-900 dark:text-white">
              Revenue Overview
            </h3>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
          
          {loading ? (
            <Skeleton className="h-64" />
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C1FF00" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#C1FF00" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorMemberships" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00AFFF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00AFFF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    tickFormatter={(value) => `€${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`€${value}`, '']}
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
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
        
        {/* Allocation Pie Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-bold text-gray-900 dark:text-white">
              Fund Allocation
            </h3>
          </div>
          
          {loading ? (
            <Skeleton className="h-64" />
          ) : (
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
                    label={({ name, value }) => `${name}: ${value}%`}
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
          )}
          
          {/* Legend */}
          <div className="space-y-2 mt-4">
            {allocationData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      
      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-bold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
            <Button variant="ghost" size="sm" asChild>
              <a href="/admin/activity">View All</a>
            </Button>
          </div>
          
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          )}
        </Card>
        
        {/* Quick Actions & Pending Items */}
        <Card className="p-6">
          <h3 className="font-heading font-bold text-gray-900 dark:text-white mb-6">
            Pending Actions
          </h3>
          
          <div className="space-y-4">
            <PendingItem
              title="Partner Applications"
              count={3}
              href="/admin/partners/applications"
              color="text-electric-blue"
            />
            <PendingItem
              title="Pending Orders"
              count={12}
              href="/admin/products/orders?status=pending"
              color="text-solar-orange"
            />
            <PendingItem
              title="Support Tickets"
              count={7}
              href="/admin/support"
              color="text-hot-magenta"
            />
            <PendingItem
              title="Content Reviews"
              count={2}
              href="/admin/content?status=draft"
              color="text-hot-lime"
            />
          </div>
          
          {/* Quick Actions */}
          <div className="mt-8 pt-6 border-t">
            <h4 className="text-sm font-medium text-gray-500 mb-4">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" size="sm" asChild>
                <a href="/admin/content/blog/new">New Blog Post</a>
              </Button>
              <Button variant="secondary" size="sm" asChild>
                <a href="/admin/events/new">Create Event</a>
              </Button>
              <Button variant="secondary" size="sm" asChild>
                <a href="/admin/donations/campaigns/new">New Campaign</a>
              </Button>
              <Button variant="secondary" size="sm" asChild>
                <a href="/admin/emails/compose">Send Email</a>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Activity Item Component
function ActivityItem({ activity }: { activity: RecentActivity }) {
  const iconMap = {
    member: Users,
    donation: Heart,
    order: Package,
    event: Calendar,
  };
  
  const colorMap = {
    member: 'text-electric-blue bg-electric-blue/10',
    donation: 'text-hot-magenta bg-hot-magenta/10',
    order: 'text-solar-orange bg-solar-orange/10',
    event: 'text-hot-lime bg-hot-lime/10',
  };
  
  const Icon = iconMap[activity.type];
  
  return (
    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <div className={`p-2 rounded-lg ${colorMap[activity.type]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {activity.title}
        </p>
        <p className="text-xs text-gray-500 truncate">{activity.description}</p>
      </div>
      <div className="text-right">
        {activity.amount && (
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            €{activity.amount}
          </p>
        )}
        <p className="text-xs text-gray-500">
          {format(new Date(activity.timestamp), 'HH:mm')}
        </p>
      </div>
    </div>
  );
}

// Pending Item Component
function PendingItem({
  title,
  count,
  href,
  color,
}: {
  title: string;
  count: number;
  href: string;
  color: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center justify-between p-3 rounded-lg border hover:border-gray-300 dark:border-gray-700 transition-colors"
    >
      <span className="text-sm text-gray-600 dark:text-gray-400">{title}</span>
      <Badge variant="secondary" className={color}>
        {count}
      </Badge>
    </a>
  );
}

function StatCardSkeleton() {
  return (
    <>
      <div className="flex items-center justify-between">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <Skeleton className="w-16 h-5" />
      </div>
      <div className="mt-4">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-20 mt-2" />
      </div>
    </>
  );
}
```

## USERS MANAGEMENT (src/app/[locale]/(admin)/admin/users/page.tsx)

Build complete users management with:
- Users list with filtering, sorting, pagination
- User detail view and editing
- Role assignment
- Membership management
- User activity log
- Export functionality
- Bulk actions (enable/disable, change role)

## CONTENT MANAGEMENT (CMS)

Build complete CMS with:
- Rich text editor (TipTap)
- Page builder with blocks
- Media library with upload
- SEO settings per page
- Version history
- Draft/publish workflow
- Scheduled publishing
- Content localization

## DONATIONS MANAGEMENT

Build complete donations admin with:
- Donations list and filtering
- Individual donation details
- Recurring donation management
- Campaign performance
- Donor management
- Receipt generation
- Refund processing
- Financial reports and exports

## EVENTS MANAGEMENT

Build complete events admin with:
- Event creation wizard
- Registration management
- Ticket scanning interface
- Attendee communication
- Event analytics
- Post-event surveys
- Recording management

All admin pages must include proper loading states, error handling, pagination, and real-time updates where appropriate.
```

---

# 19. EMAIL & NOTIFICATION SYSTEM

```
Build a comprehensive email and notification system using Resend for transactional emails.

## EMAIL SERVICE (src/lib/email/service.ts)

```typescript
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { db } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

// Import email templates
import { WelcomeEmail } from './templates/WelcomeEmail';
import { MembershipConfirmationEmail } from './templates/MembershipConfirmationEmail';
import { DonationThankYouEmail } from './templates/DonationThankYouEmail';
import { OrderConfirmationEmail } from './templates/OrderConfirmationEmail';
import { EventRegistrationEmail } from './templates/EventRegistrationEmail';
import { PasswordResetEmail } from './templates/PasswordResetEmail';
import { NewsletterEmail } from './templates/NewsletterEmail';
import { VotingReminderEmail } from './templates/VotingReminderEmail';
import { ImpactReportEmail } from './templates/ImpactReportEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

// Email types
export type EmailType =
  | 'welcome'
  | 'membership_confirmation'
  | 'donation_thank_you'
  | 'order_confirmation'
  | 'order_shipped'
  | 'event_registration'
  | 'event_reminder'
  | 'password_reset'
  | 'email_verification'
  | 'newsletter'
  | 'voting_reminder'
  | 'impact_report'
  | 'payment_failed'
  | 'subscription_renewal'
  | 'custom';

// Email sending options
interface SendEmailOptions {
  to: string | string[];
  subject: string;
  type: EmailType;
  data: Record<string, any>;
  replyTo?: string;
  attachments?: {
    filename: string;
    content: Buffer | string;
  }[];
  scheduledAt?: Date;
  tags?: string[];
}

// Main email sending function
export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const { to, subject, type, data, replyTo, attachments, scheduledAt, tags } = options;
    
    // Render email template
    const html = await renderEmailTemplate(type, data);
    
    // Send via Resend
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      replyTo: replyTo || 'support@gratis.ngo',
      attachments,
      scheduledAt: scheduledAt?.toISOString(),
      tags: tags?.map(tag => ({ name: tag, value: 'true' })),
    });
    
    // Log email send
    await logEmailSend({
      to: Array.isArray(to) ? to : [to],
      subject,
      type,
      status: 'sent',
      resendId: result.id,
      timestamp: new Date(),
    });
    
    return { success: true, id: result.id };
  } catch (error) {
    console.error('Email send error:', error);
    
    // Log failure
    await logEmailSend({
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      type: options.type,
      status: 'failed',
      error: (error as Error).message,
      timestamp: new Date(),
    });
    
    return { success: false, error: (error as Error).message };
  }
}

// Render email template based on type
async function renderEmailTemplate(type: EmailType, data: Record<string, any>): Promise<string> {
  switch (type) {
    case 'welcome':
      return render(WelcomeEmail(data));
    case 'membership_confirmation':
      return render(MembershipConfirmationEmail(data));
    case 'donation_thank_you':
      return render(DonationThankYouEmail(data));
    case 'order_confirmation':
      return render(OrderConfirmationEmail(data));
    case 'event_registration':
      return render(EventRegistrationEmail(data));
    case 'password_reset':
      return render(PasswordResetEmail(data));
    case 'newsletter':
      return render(NewsletterEmail(data));
    case 'voting_reminder':
      return render(VotingReminderEmail(data));
    case 'impact_report':
      return render(ImpactReportEmail(data));
    default:
      throw new Error(`Unknown email type: ${type}`);
  }
}

// Log email send to Firestore
async function logEmailSend(log: {
  to: string[];
  subject: string;
  type: EmailType;
  status: 'sent' | 'failed';
  resendId?: string;
  error?: string;
  timestamp: Date;
}) {
  try {
    await db.collection('email_logs').add({
      ...log,
      timestamp: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Failed to log email:', error);
  }
}

// Batch email sending (for newsletters, campaigns)
export async function sendBatchEmails(
  recipients: { email: string; data: Record<string, any> }[],
  subject: string,
  type: EmailType,
  options?: {
    batchSize?: number;
    delayBetweenBatches?: number;
  }
): Promise<{ sent: number; failed: number }> {
  const batchSize = options?.batchSize || 100;
  const delayMs = options?.delayBetweenBatches || 1000;
  
  let sent = 0;
  let failed = 0;
  
  // Process in batches
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    
    const results = await Promise.allSettled(
      batch.map((recipient) =>
        sendEmail({
          to: recipient.email,
          subject,
          type,
          data: recipient.data,
        })
      )
    );
    
    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value.success) {
        sent++;
      } else {
        failed++;
      }
    });
    
    // Delay between batches to avoid rate limits
    if (i + batchSize < recipients.length) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  
  return { sent, failed };
}

// Pre-built email senders for common scenarios
export const emails = {
  // Welcome email for new users
  sendWelcome: async (user: { email: string; firstName: string }) => {
    return sendEmail({
      to: user.email,
      subject: 'Welcome to GRATIS! 🎉',
      type: 'welcome',
      data: {
        firstName: user.firstName,
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      },
    });
  },
  
  // Membership confirmation
  sendMembershipConfirmation: async (
    user: { email: string; firstName: string },
    tier: string,
    expiresAt?: Date
  ) => {
    return sendEmail({
      to: user.email,
      subject: `Welcome to TRIBE ${tier}! 🌟`,
      type: 'membership_confirmation',
      data: {
        firstName: user.firstName,
        tier,
        expiresAt,
        benefits: getMembershipBenefits(tier),
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      },
    });
  },
  
  // Donation thank you
  sendDonationThankYou: async (
    donor: { email: string; firstName: string },
    donation: {
      amount: number;
      currency: string;
      allocation: { water: number; arts: number; education: number };
      receiptUrl?: string;
    }
  ) => {
    return sendEmail({
      to: donor.email,
      subject: 'Thank you for your generous donation! 💚',
      type: 'donation_thank_you',
      data: {
        firstName: donor.firstName,
        amount: donation.amount,
        currency: donation.currency,
        allocation: donation.allocation,
        receiptUrl: donation.receiptUrl,
        impactUrl: `${process.env.NEXT_PUBLIC_APP_URL}/impact`,
      },
    });
  },
  
  // Order confirmation
  sendOrderConfirmation: async (
    customer: { email: string; firstName: string },
    order: {
      id: string;
      items: { name: string; quantity: number }[];
      shippingAddress: any;
      estimatedDelivery?: Date;
    }
  ) => {
    return sendEmail({
      to: customer.email,
      subject: `Order Confirmed: ${order.id}`,
      type: 'order_confirmation',
      data: {
        firstName: customer.firstName,
        orderId: order.id,
        items: order.items,
        shippingAddress: order.shippingAddress,
        estimatedDelivery: order.estimatedDelivery,
        trackingUrl: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}`,
      },
    });
  },
  
  // Event registration confirmation
  sendEventRegistration: async (
    attendee: { email: string; firstName: string },
    event: {
      id: string;
      title: string;
      date: Date;
      location?: string;
      virtualUrl?: string;
      ticketCode: string;
    }
  ) => {
    return sendEmail({
      to: attendee.email,
      subject: `You're registered: ${event.title}`,
      type: 'event_registration',
      data: {
        firstName: attendee.firstName,
        eventTitle: event.title,
        eventDate: event.date,
        location: event.location,
        virtualUrl: event.virtualUrl,
        ticketCode: event.ticketCode,
        calendarUrl: generateCalendarUrl(event),
        eventUrl: `${process.env.NEXT_PUBLIC_APP_URL}/events/${event.id}`,
      },
    });
  },
  
  // Password reset
  sendPasswordReset: async (email: string, resetUrl: string) => {
    return sendEmail({
      to: email,
      subject: 'Reset Your Password',
      type: 'password_reset',
      data: {
        resetUrl,
        expiresIn: '1 hour',
      },
    });
  },
  
  // Voting reminder
  sendVotingReminder: async (
    user: { email: string; firstName: string },
    votingPeriod: { endsAt: Date; quarterName: string }
  ) => {
    return sendEmail({
      to: user.email,
      subject: `Don't forget to vote! ${votingPeriod.quarterName} allocation`,
      type: 'voting_reminder',
      data: {
        firstName: user.firstName,
        quarterName: votingPeriod.quarterName,
        endsAt: votingPeriod.endsAt,
        voteUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/voting`,
      },
    });
  },
  
  // Monthly impact report
  sendImpactReport: async (
    user: { email: string; firstName: string },
    report: {
      month: string;
      totalDonated: number;
      projectsSupported: number;
      beneficiariesReached: number;
      highlights: string[];
    }
  ) => {
    return sendEmail({
      to: user.email,
      subject: `Your Impact Report: ${report.month}`,
      type: 'impact_report',
      data: {
        firstName: user.firstName,
        ...report,
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/impact`,
      },
    });
  },
};

// Helper functions
function getMembershipBenefits(tier: string): string[] {
  const benefits: Record<string, string[]> = {
    explorer: ['1 free bottle/month', 'Impact dashboard', 'Newsletter'],
    insider: ['3 free bottles/month', 'Quarterly voting', 'Member events'],
    core: ['6 free bottles/month', 'Exclusive merchandise', 'Priority support'],
    founder: ['Unlimited bottles', 'Founding member status', 'Direct allocation'],
  };
  return benefits[tier] || benefits.explorer;
}

function generateCalendarUrl(event: { title: string; date: Date; location?: string }): string {
  const startDate = event.date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const endDate = new Date(event.date.getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${endDate}&location=${encodeURIComponent(event.location || '')}`;
}
```

## EMAIL TEMPLATES (src/lib/email/templates/WelcomeEmail.tsx)

```typescript
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface WelcomeEmailProps {
  firstName: string;
  dashboardUrl: string;
}

export function WelcomeEmail({ firstName, dashboardUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to GRATIS - Charity Never Looked This Bold</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoSection}>
            <Img
              src="https://gratis.ngo/images/logo.png"
              width="120"
              height="40"
              alt="GRATIS"
              style={logo}
            />
          </Section>
          
          {/* Hero */}
          <Section style={heroSection}>
            <Heading style={h1}>Welcome to the TRIBE, {firstName}! 🎉</Heading>
          </Section>
          
          {/* Main Content */}
          <Section style={contentSection}>
            <Text style={text}>
              You've just joined a movement of changemakers who believe charity
              should be accessible, transparent, and yes—even a little bit cool.
            </Text>
            
            <Text style={text}>
              As an Explorer, you'll receive:
            </Text>
            
            <ul style={list}>
              <li style={listItem}>🎁 <strong>1 free premium water bottle</strong> every month</li>
              <li style={listItem}>📊 <strong>Real-time impact tracking</strong> on your dashboard</li>
              <li style={listItem}>📧 <strong>Weekly updates</strong> on where funds go</li>
              <li style={listItem}>🌍 <strong>Community access</strong> with fellow changemakers</li>
            </ul>
            
            <Text style={text}>
              Ready to claim your first bottle?
            </Text>
            
            <Button style={button} href={dashboardUrl}>
              Go to Dashboard
            </Button>
          </Section>
          
          {/* Upgrade CTA */}
          <Section style={upgradeSection}>
            <Heading as="h2" style={h2}>
              Want to Make a Bigger Impact?
            </Heading>
            <Text style={upgradeText}>
              Upgrade to <strong>Insider</strong> (€9.99/mo) for 3 bottles/month and
              voting rights, or become a <strong>Founder</strong> (€247 lifetime) for
              unlimited bottles and exclusive perks.
            </Text>
            <Link href="https://gratis.ngo/tribe" style={link}>
              Explore Membership Options →
            </Link>
          </Section>
          
          <Hr style={hr} />
          
          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              GRATIS Foundation<br />
              Making charity accessible to everyone
            </Text>
            <Text style={footerLinks}>
              <Link href="https://gratis.ngo" style={footerLink}>Website</Link>
              {' • '}
              <Link href="https://gratis.ngo/impact" style={footerLink}>Impact</Link>
              {' • '}
              <Link href="https://gratis.ngo/privacy" style={footerLink}>Privacy</Link>
              {' • '}
              <Link href="https://gratis.ngo/unsubscribe" style={footerLink}>Unsubscribe</Link>
            </Text>
            <Text style={footerText}>
              © {new Date().getFullYear()} GRATIS Foundation. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f5f5f5',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  maxWidth: '600px',
};

const logoSection = {
  padding: '32px 40px 16px',
  backgroundColor: '#000000',
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto',
};

const heroSection = {
  padding: '40px',
  backgroundColor: '#C1FF00',
  textAlign: 'center' as const,
};

const h1 = {
  color: '#000000',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
  lineHeight: '1.3',
};

const contentSection = {
  padding: '40px',
};

const text = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px',
};

const list = {
  margin: '16px 0 24px',
  paddingLeft: '0',
  listStyleType: 'none',
};

const listItem = {
  color: '#333333',
  fontSize: '15px',
  lineHeight: '1.8',
  margin: '8px 0',
};

const button = {
  backgroundColor: '#C1FF00',
  borderRadius: '8px',
  color: '#000000',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 'bold',
  padding: '14px 32px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  margin: '16px 0',
};

const upgradeSection = {
  padding: '32px 40px',
  backgroundColor: '#f9f9f9',
};

const h2 = {
  color: '#000000',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 12px',
};

const upgradeText = {
  color: '#555555',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 12px',
};

const link = {
  color: '#00AFFF',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: 'bold',
};

const hr = {
  borderColor: '#e5e5e5',
  margin: '0',
};

const footer = {
  padding: '32px 40px',
  backgroundColor: '#000000',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#888888',
  fontSize: '12px',
  lineHeight: '1.6',
  margin: '8px 0',
};

const footerLinks = {
  margin: '16px 0',
};

const footerLink = {
  color: '#C1FF00',
  textDecoration: 'none',
  fontSize: '12px',
};

export default WelcomeEmail;
```

## PUSH NOTIFICATION SYSTEM (src/lib/notifications/service.ts)

```typescript
import { db } from '@/lib/firebase/admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';

// Notification types
export type NotificationType =
  | 'system'
  | 'order'
  | 'event'
  | 'donation'
  | 'membership'
  | 'campaign'
  | 'voting'
  | 'impact';

interface CreateNotificationOptions {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  data?: Record<string, any>;
  channels?: ('app' | 'email' | 'push' | 'sms')[];
  expiresAt?: Date;
}

interface BulkNotificationOptions {
  userIds?: string[];
  userFilter?: {
    tribeTier?: string[];
    hasOptedIn?: boolean;
  };
  notification: Omit<CreateNotificationOptions, 'userId'>;
}

// Create a notification for a user
export async function createNotification(options: CreateNotificationOptions): Promise<string> {
  const {
    userId,
    type,
    title,
    message,
    actionUrl,
    actionLabel,
    data,
    channels = ['app'],
    expiresAt,
  } = options;
  
  // Create notification document
  const notificationRef = db.collection('notifications').doc();
  
  await notificationRef.set({
    id: notificationRef.id,
    userId,
    type,
    title,
    message,
    actionUrl,
    actionLabel,
    data,
    channels,
    deliveredVia: [],
    isRead: false,
    readAt: null,
    createdAt: FieldValue.serverTimestamp(),
    expiresAt: expiresAt ? Timestamp.fromDate(expiresAt) : null,
  });
  
  // Also add to user's notifications subcollection for easy querying
  await db.collection('users').doc(userId).collection('notifications').doc(notificationRef.id).set({
    notificationId: notificationRef.id,
    isRead: false,
    createdAt: FieldValue.serverTimestamp(),
  });
  
  // Send via requested channels
  const deliveryPromises: Promise<boolean>[] = [];
  
  if (channels.includes('push')) {
    deliveryPromises.push(sendPushNotification(userId, { title, message, data }));
  }
  
  if (channels.includes('email')) {
    deliveryPromises.push(sendEmailNotification(userId, { title, message, actionUrl }));
  }
  
  // Track which channels were delivered
  const deliveryResults = await Promise.allSettled(deliveryPromises);
  const deliveredVia: string[] = [];
  
  deliveryResults.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value) {
      deliveredVia.push(channels[index + 1] || 'app'); // +1 because 'app' is always first
    }
  });
  
  // Update delivered channels
  if (deliveredVia.length > 0) {
    await notificationRef.update({ deliveredVia });
  }
  
  return notificationRef.id;
}

// Send push notification via FCM
async function sendPushNotification(
  userId: string,
  notification: { title: string; message: string; data?: Record<string, any> }
): Promise<boolean> {
  try {
    // Get user's FCM tokens
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    const fcmTokens = userData?.fcmTokens || [];
    
    if (fcmTokens.length === 0) {
      return false;
    }
    
    // Send to all user's devices
    const message: admin.messaging.MulticastMessage = {
      notification: {
        title: notification.title,
        body: notification.message,
      },
      data: notification.data ? Object.fromEntries(
        Object.entries(notification.data).map(([k, v]) => [k, String(v)])
      ) : undefined,
      tokens: fcmTokens,
      webpush: {
        fcmOptions: {
          link: notification.data?.actionUrl,
        },
      },
      apns: {
        payload: {
          aps: {
            badge: 1,
            sound: 'default',
          },
        },
      },
    };
    
    const response = await admin.messaging().sendEachForMulticast(message);
    
    // Clean up invalid tokens
    const invalidTokens: string[] = [];
    response.responses.forEach((resp, idx) => {
      if (!resp.success && resp.error?.code === 'messaging/registration-token-not-registered') {
        invalidTokens.push(fcmTokens[idx]);
      }
    });
    
    if (invalidTokens.length > 0) {
      await db.collection('users').doc(userId).update({
        fcmTokens: FieldValue.arrayRemove(...invalidTokens),
      });
    }
    
    return response.successCount > 0;
  } catch (error) {
    console.error('Push notification error:', error);
    return false;
  }
}

// Send email notification
async function sendEmailNotification(
  userId: string,
  notification: { title: string; message: string; actionUrl?: string }
): Promise<boolean> {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    
    // Check if user has email notifications enabled
    if (!userData?.preferences?.notifications?.email?.transactional) {
      return false;
    }
    
    // Import email service dynamically to avoid circular dependency
    const { sendEmail } = await import('./email/service');
    
    const result = await sendEmail({
      to: userData.email,
      subject: notification.title,
      type: 'custom',
      data: {
        firstName: userData.firstName,
        title: notification.title,
        message: notification.message,
        actionUrl: notification.actionUrl,
      },
    });
    
    return result.success;
  } catch (error) {
    console.error('Email notification error:', error);
    return false;
  }
}

// Mark notification as read
export async function markNotificationRead(
  userId: string,
  notificationId: string
): Promise<void> {
  const now = FieldValue.serverTimestamp();
  
  await Promise.all([
    db.collection('notifications').doc(notificationId).update({
      isRead: true,
      readAt: now,
    }),
    db.collection('users').doc(userId).collection('notifications').doc(notificationId).update({
      isRead: true,
      readAt: now,
    }),
  ]);
}

// Mark all notifications as read
export async function markAllNotificationsRead(userId: string): Promise<void> {
  const batch = db.batch();
  const now = FieldValue.serverTimestamp();
  
  // Get all unread notifications
  const snapshot = await db
    .collection('users')
    .doc(userId)
    .collection('notifications')
    .where('isRead', '==', false)
    .get();
  
  snapshot.docs.forEach((doc) => {
    batch.update(doc.ref, { isRead: true, readAt: now });
    batch.update(db.collection('notifications').doc(doc.id), { isRead: true, readAt: now });
  });
  
  await batch.commit();
}

// Get user's notifications
export async function getUserNotifications(
  userId: string,
  options?: {
    limit?: number;
    unreadOnly?: boolean;
    types?: NotificationType[];
  }
): Promise<any[]> {
  let query = db
    .collection('notifications')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc');
  
  if (options?.unreadOnly) {
    query = query.where('isRead', '==', false);
  }
  
  if (options?.types && options.types.length > 0) {
    query = query.where('type', 'in', options.types);
  }
  
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  
  const snapshot = await query.get();
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    readAt: doc.data().readAt?.toDate(),
    expiresAt: doc.data().expiresAt?.toDate(),
  }));
}

// Get unread count
export async function getUnreadCount(userId: string): Promise<number> {
  const snapshot = await db
    .collection('users')
    .doc(userId)
    .collection('notifications')
    .where('isRead', '==', false)
    .count()
    .get();
  
  return snapshot.data().count;
}

// Delete old notifications (scheduled job)
export async function cleanupOldNotifications(daysOld: number = 30): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  const snapshot = await db
    .collection('notifications')
    .where('createdAt', '<', Timestamp.fromDate(cutoffDate))
    .where('isRead', '==', true)
    .limit(500) // Process in batches
    .get();
  
  if (snapshot.empty) {
    return 0;
  }
  
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  
  await batch.commit();
  
  return snapshot.size;
}

// Pre-built notification creators
export const notifications = {
  orderShipped: (userId: string, orderId: string, trackingUrl: string) =>
    createNotification({
      userId,
      type: 'order',
      title: 'Your order has shipped! 📦',
      message: `Order ${orderId} is on its way. Track your delivery.`,
      actionUrl: trackingUrl,
      actionLabel: 'Track Order',
      channels: ['app', 'push', 'email'],
    }),
  
  votingOpen: (userId: string, quarterName: string) =>
    createNotification({
      userId,
      type: 'voting',
      title: `${quarterName} Voting is Now Open! 🗳️`,
      message: 'Help decide where GRATIS funds go this quarter.',
      actionUrl: '/dashboard/voting',
      actionLabel: 'Vote Now',
      channels: ['app', 'push', 'email'],
    }),
  
  donationReceived: (userId: string, amount: number) =>
    createNotification({
      userId,
      type: 'donation',
      title: 'Thank you for your donation! 💚',
      message: `Your €${amount} donation has been received and is making an impact.`,
      actionUrl: '/dashboard/impact',
      actionLabel: 'See Your Impact',
      channels: ['app'],
    }),
  
  eventReminder: (userId: string, eventTitle: string, eventId: string, hoursUntil: number) =>
    createNotification({
      userId,
      type: 'event',
      title: `Event Starting ${hoursUntil === 1 ? 'in 1 hour' : `in ${hoursUntil} hours`}! 📅`,
      message: eventTitle,
      actionUrl: `/events/${eventId}`,
      actionLabel: 'View Event',
      channels: ['app', 'push'],
    }),
  
  membershipRenewal: (userId: string, daysUntil: number) =>
    createNotification({
      userId,
      type: 'membership',
      title: `Membership renews in ${daysUntil} days`,
      message: 'Your TRIBE membership will automatically renew.',
      actionUrl: '/dashboard/membership',
      actionLabel: 'Manage Membership',
      channels: ['app', 'email'],
    }),
};
```

Build complete notification system including:
- In-app notification center
- Push notifications (FCM)
- Email notifications with templates
- SMS notifications (Twilio)
- Notification preferences management
- Scheduled notifications
- Notification analytics

All notification components must handle offline scenarios, respect user preferences, and support multiple channels.
```

---

[CONTINUED IN PART 5: Analytics, Testing, Deployment...]
