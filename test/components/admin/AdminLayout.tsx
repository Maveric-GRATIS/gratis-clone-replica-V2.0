import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRole } from '@/hooks/useRole';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Video, 
  Megaphone,
  Calendar,
  ArrowLeft,
  FileText
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const { isAdmin, isMarketing } = useRole();

  const adminLinks = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/admin/users', label: 'Users', icon: Users },
  ];

  const marketingLinks = [
    { path: '/admin/videos', label: 'Videos', icon: Video },
    { path: '/admin/campaigns', label: 'Campaigns', icon: Megaphone },
    { path: '/admin/events', label: 'Events', icon: Calendar },
    { path: '/admin/blog', label: 'Blog Posts', icon: FileText },
  ];

  const links = isAdmin 
    ? [...adminLinks, ...marketingLinks] 
    : isMarketing 
    ? [adminLinks[0], ...marketingLinks]
    : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r bg-card p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">GRATIS Admin</h2>
          <p className="text-sm text-muted-foreground">
            {isAdmin ? 'Administrator' : 'Marketing Team'}
          </p>
        </div>

        <nav className="space-y-2">
          {links.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link key={path} to={path}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className="w-full justify-start gap-3"
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <Link to="/">
            <Button variant="outline" className="w-full gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Store
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
};
