import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { NotificationCenter } from "@/components/NotificationCenter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Video,
  Megaphone,
  Calendar,
  ArrowLeft,
  FileText,
  QrCode,
  Heart,
  Building,
  Vote,
  Mail,
  BarChart3,
  Settings,
  Shield,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Search,
  Bell,
  Globe,
  LogOut,
  Moon,
  Sun,
  Flask,
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

interface NavSection {
  name: string;
  icon: any;
  href?: string;
  children?: { name: string; href: string }[];
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const { isAdmin, isMarketing } = useRole();
  const { user, profile, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "Dashboard",
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  // Only render theme toggle after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Navigation structure
  const navigation: NavSection[] = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
    },
    {
      name: "Content",
      icon: FileText,
      children: [
        { name: "Blog Posts", href: "/admin/blog" },
        { name: "Videos", href: "/admin/videos" },
        { name: "Campaigns", href: "/admin/campaigns" },
      ],
    },
    {
      name: "Products",
      icon: Package,
      children: [
        { name: "All Products", href: "/admin/products" },
        { name: "Orders", href: "/admin/orders" },
      ],
    },
    {
      name: "Donations",
      icon: Heart,
      children: [
        { name: "All Donations", href: "/admin/donations" },
        { name: "Campaigns", href: "/admin/donations/campaigns" },
      ],
    },
    {
      name: "Events",
      icon: Calendar,
      children: [
        { name: "All Events", href: "/admin/events" },
        { name: "Check-In", href: "/admin/event-checkin" },
      ],
    },
    {
      name: "Users & Members",
      icon: Users,
      children: [
        { name: "All Users", href: "/admin/users" },
        { name: "TRIBE Members", href: "/admin/users/tribe" },
      ],
    },
    {
      name: "NGO Partners",
      icon: Building,
      children: [
        { name: "All Partners", href: "/admin/partners" },
        { name: "Applications", href: "/admin/partners/applications" },
      ],
    },
    {
      name: "Voting",
      icon: Vote,
      children: [
        { name: "Current Period", href: "/admin/voting" },
        { name: "Results", href: "/admin/voting/results" },
      ],
    },
    {
      name: "Communications",
      icon: Mail,
      children: [
        { name: "Email Campaigns", href: "/admin/emails" },
        { name: "Email Logs", href: "/admin/emails/logs" },
        { name: "Email Templates", href: "/admin/emails/templates" },
        { name: "Notifications", href: "/admin/notifications" },
      ],
    },
    {
      name: "Analytics",
      icon: BarChart3,
      children: [
        { name: "Overview", href: "/admin/analytics" },
        { name: "Traffic", href: "/admin/analytics/traffic" },
        { name: "Impact", href: "/admin/analytics/impact" },
        { name: "Advanced Analytics", href: "/admin/analytics-advanced" },
        { name: "Experiments", href: "/admin/experiments" },
      ],
    },
    {
      name: "Operations",
      icon: Settings,
      children: [
        { name: "Inventory", href: "/admin/inventory" },
        { name: "Tax Receipts", href: "/admin/tax-receipts" },
        { name: "Integrations", href: "/admin/integrations" },
        { name: "White-label", href: "/admin/white-label" },
      ],
    },
    {
      name: "Enterprise",
      icon: Shield,
      children: [
        { name: "Refund Manager", href: "/admin/refunds" },
        { name: "Role Manager", href: "/admin/roles" },
        { name: "Audit Logs", href: "/admin/audit-logs" },
        { name: "System Monitor", href: "/admin/monitoring" },
        { name: "Error Tracking", href: "/admin/errors" },
        { name: "Media Manager", href: "/admin/media" },
        { name: "SEO Manager", href: "/admin/seo-manager" },
        { name: "Feature Flags", href: "/admin/feature-flags" },
        { name: "Data Export", href: "/admin/data-export" },
        { name: "MFA Settings", href: "/admin/mfa-settings" },
        { name: "Moderation Queue", href: "/admin/moderation-queue" },
        { name: "API Keys", href: "/admin/developer" },
        { name: "Scheduler", href: "/admin/scheduler" },
        { name: "Platform Config", href: "/admin/config" },
        { name: "Tenant Manager", href: "/admin/tenants" },
        { name: "Webhook Manager", href: "/admin/webhooks" },
        { name: "GraphQL Explorer", href: "/admin/graphql" },
        { name: "Rate Limits", href: "/admin/rate-limits" },
        { name: "File Manager", href: "/admin/files" },
        { name: "Data Import", href: "/admin/import" },
        { name: "Bulk Operations", href: "/admin/bulk" },
        { name: "Dashboards", href: "/admin/dashboards" },
      ],
    },
    {
      name: "Development",
      icon: Flask,
      children: [{ name: "Part 18 Test", href: "/part18-test" }],
    },
    {
      name: "Settings",
      icon: Settings,
      children: [
        { name: "General", href: "/admin/settings" },
        { name: "Integrations", href: "/admin/settings/integrations" },
      ],
    },
  ];

  // Filter navigation based on role
  const filteredNavigation = isAdmin
    ? navigation
    : navigation.filter((item) =>
        ["Dashboard", "Content", "Events"].includes(item.name),
      );

  // Toggle section expansion
  const toggleSection = (sectionName: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionName)
        ? prev.filter((s) => s !== sectionName)
        : [...prev, sectionName],
    );
  };

  // Check if path is active
  const isActive = (href: string) => location.pathname === href;
  const isParentActive = (children?: { href: string }[]) =>
    children?.some((child) => location.pathname.startsWith(child.href)) ||
    false;

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-card border-r
          flex flex-col
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b flex-shrink-0">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="font-bold text-primary-foreground">G</span>
            </div>
            <span className="font-bold text-lg">GRATIS Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded hover:bg-accent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 min-h-0">
          {filteredNavigation.map((item) => (
            <div key={item.name}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleSection(item.name)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-lg
                      text-sm font-medium transition-colors
                      ${
                        isParentActive(item.children)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        expandedSections.includes(item.name) ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expandedSections.includes(item.name) && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className={`
                            flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                            transition-colors
                            ${
                              isActive(child.href)
                                ? "bg-primary text-primary-foreground font-medium"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            }
                          `}
                        >
                          <ChevronRight className="w-4 h-4" />
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.href!}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                    transition-colors
                    ${
                      isActive(item.href!)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t flex-shrink-0">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.photoURL || undefined} />
              <AvatarFallback>
                {profile?.firstName?.[0]}
                {profile?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {profile?.firstName} {profile?.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {isAdmin ? "Administrator" : "Marketing"}
              </p>
            </div>
            <button
              onClick={() => signOut()}
              className="p-2 rounded-lg hover:bg-accent text-muted-foreground"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-card border-b flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-accent"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search */}
            <div className="hidden sm:block w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              disabled={!mounted}
              className="p-2 rounded-lg hover:bg-accent disabled:opacity-50 transition-all"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {!mounted ? (
                <Sun className="w-5 h-5 text-muted-foreground" />
              ) : theme === "dark" ? (
                <Sun className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Moon className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            {/* Notifications */}
            <NotificationCenter />

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
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};
