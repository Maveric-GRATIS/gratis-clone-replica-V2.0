/**
 * Part 2 - Quick Test Page
 *
 * Test all Part 2 marketing and dashboard features
 * Navigate to: http://localhost:8080/part2-test
 */

import { Link } from "react-router-dom";
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
  CheckCircle2,
  Home,
  LayoutDashboard,
  Calendar,
  ShoppingCart,
  Video,
} from "lucide-react";

export default function Part2Test() {
  return (
    <div className="container mx-auto pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Part 2 - Marketing & Dashboard Test Page
          </h1>
          <p className="text-muted-foreground text-lg">
            Test all Part 2 marketing pages, dashboard, and events
          </p>
          <Badge variant="outline" className="mt-4">
            Sections 6-10: Homepage, Marketing, Dashboard, Shop & Events
          </Badge>
        </div>

        <div className="grid gap-6">
          {/* Section 6: Homepage */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Section 6: Homepage & Marketing Pages
                  </CardTitle>
                  <CardDescription>
                    Hero, Features, Stats, Testimonials, FAQ, CTA
                  </CardDescription>
                </div>
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="default">
                  <Link to="/">Homepage</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/gratis">About GRATIS</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/impact">Impact</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/contact">Contact</Link>
                </Button>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>✅ Route: / - Homepage with Hero section</p>
                <p>✅ Impact stats with animated counters</p>
                <p>✅ How it works (3-step process)</p>
                <p>✅ Features showcase with icons</p>
                <p>✅ Testimonials & social proof</p>
                <p>✅ Partner logos section</p>
                <p>✅ FAQ accordion</p>
                <p>✅ CTA sections throughout</p>
              </div>
            </CardContent>
          </Card>

          {/* Section 7: Dashboard */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <LayoutDashboard className="h-5 w-5" />
                    Section 7: User Dashboard
                  </CardTitle>
                  <CardDescription>
                    Personal dashboard with stats and activity
                  </CardDescription>
                </div>
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="default">
                  <Link to="/dashboard">My Dashboard</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/profile">My Profile</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/orders">My Orders</Link>
                </Button>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>✅ Route: /dashboard - Personal dashboard</p>
                <p>✅ Activity tracking & stats</p>
                <p>✅ Recent orders & donations</p>
                <p>✅ Impact metrics visualization</p>
                <p>✅ Quick actions widget</p>
                <p>✅ Profile management</p>
              </div>
            </CardContent>
          </Card>

          {/* Section 8: Product Shop */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Section 8: Product Shop & E-commerce
                  </CardTitle>
                  <CardDescription>
                    Water bottles, merchandise, and shopping cart
                  </CardDescription>
                </div>
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="default">
                  <Link to="/water">Water Bottles</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/theurgy">All Products</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/checkout">Checkout</Link>
                </Button>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>✅ Route: /water - Reusable bottles catalog</p>
                <p>✅ Route: /theurgy - Full merchandise shop</p>
                <p>✅ Product listing with filters & search</p>
                <p>✅ Product detail pages</p>
                <p>✅ Shopping cart with persistence</p>
                <p>✅ Checkout flow with Stripe</p>
                <p>✅ Order confirmation & tracking</p>
              </div>
            </CardContent>
          </Card>

          {/* Section 9: Events */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Section 9: Events & Calendar
                  </CardTitle>
                  <CardDescription>
                    Community events, registrations, and calendar
                  </CardDescription>
                </div>
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="default">
                  <Link to="/events">Events Calendar</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/events/beach-cleanup-2024">Sample Event</Link>
                </Button>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>✅ Route: /events - Event listing/calendar</p>
                <p>✅ Route: /events/:id - Event details</p>
                <p>✅ Event registration & RSVP</p>
                <p>✅ Calendar view integration</p>
                <p>✅ Location & maps</p>
                <p>✅ Attendee tracking</p>
                <p>✅ Email reminders</p>
              </div>
            </CardContent>
          </Card>

          {/* Section 10: Videos */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Section 10: Video Platform (ImpactTV)
                  </CardTitle>
                  <CardDescription>
                    Video library with Mux integration
                  </CardDescription>
                </div>
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="default">
                  <Link to="/impact-tv">ImpactTV Home</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/videos">Video Library</Link>
                </Button>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>✅ Route: /impact-tv - Video platform homepage</p>
                <p>✅ Route: /videos - Video library</p>
                <p>✅ Route: /videos/:id - Video player</p>
                <p>✅ Mux video streaming integration</p>
                <p>✅ Video categories & playlists</p>
                <p>✅ View tracking & analytics</p>
                <p>✅ Comments & engagement</p>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Part 2 Summary</CardTitle>
              <CardDescription>Marketing & User Experience Complete</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Status:</strong> ✅ All 5 sections implemented
                </p>
                <p>
                  <strong>Key Routes:</strong> /, /dashboard, /water, /events, /impact-tv
                </p>
                <p>
                  <strong>Features:</strong> Shop, Cart, Events, Video Platform
                </p>
                <p>
                  <strong>Integrations:</strong> Stripe Checkout, Mux Video
                </p>
                <p>
                  <strong>Ready for:</strong> Social features and memberships (Part 3)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/">Back to Homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
