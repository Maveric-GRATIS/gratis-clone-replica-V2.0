import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Vote,
  Settings,
  ShoppingBag,
  Heart,
  User,
  Droplet,
} from "lucide-react";

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    to: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    to: "/profile",
    label: "Profile",
    icon: User,
  },
  {
    to: "/dashboard/bottles",
    label: "My Bottles",
    icon: Package,
  },
  {
    to: "/orders",
    label: "Orders",
    icon: ShoppingBag,
  },
  {
    to: "/dashboard/vote",
    label: "Voting",
    icon: Vote,
    badge: "TRIBE",
  },
  {
    to: "/impact",
    label: "Impact",
    icon: Heart,
  },
  {
    to: "/wishlist",
    label: "Wishlist",
    icon: Droplet,
  },
  {
    to: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
  },
];

export function DashboardNav() {
  const location = useLocation();

  return (
    <nav className="border-b border-border bg-muted/30 sticky top-[72px] z-40">
      <div className="container">
        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded bg-hot-lime text-jet-black font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
