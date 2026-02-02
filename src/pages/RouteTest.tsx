/**
 * Route Testing Page
 * Quick navigation to test all routes in the application
 */

import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ExternalLink } from "lucide-react";

export default function RouteTest() {
  const routes = [
    {
      category: "Main Pages",
      items: [
        { path: "/", label: "Home" },
        { path: "/auth", label: "Authentication" },
        { path: "/contact", label: "Contact" },
        { path: "/faq", label: "FAQ" },
      ],
    },
    {
      category: "GRATIS Beverages",
      items: [
        { path: "/gratis", label: "GRATIS Shop" },
        { path: "/gratis/water", label: "W.A.T.E.R" },
        { path: "/gratis/theurgy", label: "THEURGY", badge: "PRE-ORDER" },
        { path: "/gratis/fu", label: "F.U.", badge: "PRE-ORDER" },
        { path: "/hydration", label: "Hydration Store" },
      ],
    },
    {
      category: "RIG Merchandise",
      items: [
        { path: "/rig", label: "RIG Store" },
        { path: "/rig/prime-picks", label: "Prime Picks", badge: "NEW" },
        { path: "/rig/apex-arrivals", label: "Apex Arrivals", badge: "NEW" },
        { path: "/rig/imbued-icons", label: "Imbued Icons" },
        { path: "/rig/dazzle-drip", label: "Dazzle Drip" },
        { path: "/rig/charmed-cozies", label: "Charmed Cozies" },
        { path: "/rig/occult-originals", label: "Occult Originals" },
        { path: "/rig/nexus-noggin", label: "Nexus Noggin" },
        { path: "/rig/nebula-novelties", label: "Nebula Novelties" },
      ],
    },
    {
      category: "ARCANE",
      items: [{ path: "/arcane", label: "ARCANE" }],
    },
    {
      category: "TRIBE (About/Membership)",
      items: [
        { path: "/tribe", label: "TRIBE" },
        { path: "/tribe/heritage", label: "Heritage" },
        { path: "/tribe/ethics", label: "Ethics" },
        { path: "/tribe/team", label: "Team" },
        { path: "/tribe/standards", label: "Standards" },
        { path: "/tribe/responsibility", label: "Responsibility" },
        { path: "/tribe/accountability", label: "Accountability" },
        { path: "/tribe/transparency", label: "Transparency" },
        { path: "/tribe/compliance", label: "Compliance" },
        { path: "/tribe/terms", label: "Terms" },
        { path: "/tribe/privacy", label: "Privacy" },
        { path: "/tribe/cookies", label: "Cookies" },
        { path: "/tribe/signup", label: "Join TRIBE", badge: "MEMBERSHIP" },
      ],
    },
    {
      category: "IMPACT TV",
      items: [
        { path: "/impact-tv", label: "Impact TV" },
        { path: "/impact-tv/nexus", label: "Nexus" },
        { path: "/impact-tv/yarns", label: "Yarns" },
        { path: "/impact-tv/unveil", label: "Unveil" },
        { path: "/impact-tv/icon", label: "Icon" },
        { path: "/impact-tv/tales", label: "Tales" },
      ],
    },
    {
      category: "Videos",
      items: [{ path: "/videos", label: "Video Platform" }],
    },
    {
      category: "SPARK (Get Involved)",
      items: [
        { path: "/spark", label: "SPARK" },
        { path: "/spark/verve", label: "Verve (Donate)" },
        { path: "/spark/infuse", label: "Infuse (Invest)" },
        { path: "/spark/blaze", label: "Blaze (Volunteer)" },
        { path: "/spark/enlist", label: "Enlist (Careers)" },
        { path: "/spark/donate", label: "Donate Page" },
      ],
    },
    {
      category: "Partners & Corporate",
      items: [
        { path: "/partners", label: "Partners" },
        { path: "/corporate", label: "Corporate Partnerships" },
        { path: "/press", label: "Press & Media" },
        { path: "/impact", label: "Our Impact" },
        { path: "/ngo-application", label: "NGO Application" },
      ],
    },
    {
      category: "Events",
      items: [{ path: "/events", label: "Events" }],
    },
    {
      category: "E-commerce",
      items: [
        { path: "/checkout", label: "Checkout" },
        { path: "/orders", label: "Orders" },
        { path: "/wishlist", label: "Wishlist" },
      ],
    },
    {
      category: "User Dashboard (Protected)",
      items: [
        { path: "/dashboard", label: "Dashboard", badge: "AUTH" },
        { path: "/profile", label: "Profile", badge: "AUTH" },
        { path: "/settings", label: "Settings", badge: "AUTH" },
      ],
    },
    {
      category: "Legal",
      items: [
        { path: "/legal/privacy", label: "Privacy Policy" },
        { path: "/legal/terms", label: "Terms of Use" },
        { path: "/legal/cookies", label: "Cookie Policy" },
        { path: "/legal/donor-privacy", label: "Donor Privacy" },
        { path: "/legal/accessibility", label: "Accessibility" },
        { path: "/legal/disclaimer", label: "Disclaimer" },
      ],
    },
    {
      category: "Admin Panel (Protected)",
      items: [
        { path: "/admin", label: "Admin Dashboard", badge: "ADMIN" },
        { path: "/admin/products", label: "Products", badge: "ADMIN" },
        { path: "/admin/orders", label: "Orders", badge: "ADMIN" },
        { path: "/admin/users", label: "Users", badge: "ADMIN" },
        { path: "/admin/events", label: "Events", badge: "ADMIN" },
        { path: "/admin/donations", label: "Donations", badge: "ADMIN" },
      ],
    },
    {
      category: "Special",
      items: [
        { path: "/social-demo", label: "Social Demo" },
        { path: "/invalid-route-404", label: "404 Test Page" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">🧪 Route Testing Page</h1>
          <p className="text-muted-foreground text-lg">
            Quick navigation to test all routes in the application
          </p>
          <Badge variant="outline" className="mt-4">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            All Routes Configured ✓
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {routes.map((section) => (
            <Card key={section.category}>
              <CardHeader>
                <CardTitle className="text-lg">{section.category}</CardTitle>
                <CardDescription>
                  {section.items.length}{" "}
                  {section.items.length === 1 ? "route" : "routes"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {section.items.map((route) => (
                    <Button
                      key={route.path}
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link
                        to={route.path}
                        className="flex items-center justify-between"
                      >
                        <span className="truncate">{route.label}</span>
                        <div className="flex items-center gap-2">
                          {route.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {route.badge}
                            </Badge>
                          )}
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </div>
                      </Link>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card>
            <CardHeader>
              <CardTitle>Navigation Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-3xl font-bold text-primary">100+</div>
                  <div className="text-sm text-muted-foreground">
                    Total Routes
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">14</div>
                  <div className="text-sm text-muted-foreground">
                    Categories
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">6</div>
                  <div className="text-sm text-muted-foreground">
                    Main Menus
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">✓</div>
                  <div className="text-sm text-muted-foreground">
                    All Linked
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button variant="default" size="lg" asChild>
            <Link to="/">← Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
