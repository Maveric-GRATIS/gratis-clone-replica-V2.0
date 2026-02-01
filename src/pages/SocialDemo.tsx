/**
 * Social Media Integration Demo Page
 *
 * Demonstrates SocialShare and SocialFeed components
 */

import { SEO } from "@/components/SEO";
import { SocialShare } from "@/components/features/SocialShare";
import { SocialFeed } from "@/components/features/SocialFeed";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Share2, Hash } from "lucide-react";

export default function SocialDemo() {
  const currentUrl =
    typeof window !== "undefined" ? window.location.href : "https://gratis.ngo";

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Social Media Integration | GRATIS"
        description="Follow GRATIS on social media and share our impact with your network"
        canonical={currentUrl}
      />

      {/* Hero */}
      <section className="relative py-16 px-4 overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <Badge className="mb-2">
            <Hash className="mr-1 h-3 w-3" />
            Social Integration
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold">
            Connect with <span className="text-primary">GRATIS</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Follow our journey, share our impact, and join the conversation
            across all platforms
          </p>
        </div>
      </section>

      {/* Demo Sections */}
      <section className="container py-12 max-w-6xl space-y-8">
        {/* Social Share Demo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Social Share Component
            </CardTitle>
            <CardDescription>
              Multi-platform sharing with QR codes and analytics tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="dropdown" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="dropdown">Dropdown</TabsTrigger>
                <TabsTrigger value="modal">Modal</TabsTrigger>
                <TabsTrigger value="icon">Icon</TabsTrigger>
                <TabsTrigger value="outline">Outline</TabsTrigger>
              </TabsList>

              <TabsContent value="dropdown" className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-4">
                    Default dropdown variant with all sharing options
                  </p>
                  <SocialShare
                    url="https://gratis.ngo/impact"
                    title="GRATIS Impact Report 2026"
                    description="See how your water bottle purchases have made a difference in 23 countries"
                    variant="dropdown"
                  />
                </div>
              </TabsContent>

              <TabsContent value="modal" className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-4">
                    Full-featured modal with QR code generation
                  </p>
                  <SocialShare
                    url="https://gratis.ngo/events/amsterdam-water-festival"
                    title="Amsterdam Water Festival 2026"
                    description="Join us for a day celebrating clean water access"
                    variant="modal"
                    showQRCode={true}
                  />
                </div>
              </TabsContent>

              <TabsContent value="icon" className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-4">
                    Minimal icon-only variant (uses native share on mobile)
                  </p>
                  <SocialShare
                    url="https://gratis.ngo"
                    title="GRATIS - Free Water, Real Impact"
                    variant="icon"
                  />
                </div>
              </TabsContent>

              <TabsContent value="outline" className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-4">
                    Outline button variant
                  </p>
                  <SocialShare
                    url="https://gratis.ngo/tribe"
                    title="Join the GRATIS TRIBE"
                    description="Become a member and amplify your impact"
                    variant="outline"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="p-4 bg-muted rounded-lg space-y-2">
              <h4 className="font-semibold text-sm">Features:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  ✅ 8 platforms: Facebook, Twitter, LinkedIn, WhatsApp,
                  Telegram, Email, Reddit, Pinterest
                </li>
                <li>✅ Native share API support for mobile devices</li>
                <li>✅ QR code generation with download</li>
                <li>✅ Copy link to clipboard</li>
                <li>✅ Analytics tracking for each share</li>
                <li>✅ Multiple variants: dropdown, modal, icon, buttons</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Social Feed Demo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Social Feed Component
            </CardTitle>
            <CardDescription>
              Aggregated social media posts with filtering and layouts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="grid" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
                <TabsTrigger value="carousel">Carousel</TabsTrigger>
                <TabsTrigger value="masonry">Masonry</TabsTrigger>
              </TabsList>

              <TabsContent value="grid">
                <SocialFeed layout="grid" showFilters={true} maxPosts={6} />
              </TabsContent>

              <TabsContent value="list">
                <SocialFeed layout="list" showFilters={true} maxPosts={4} />
              </TabsContent>

              <TabsContent value="carousel">
                <SocialFeed
                  layout="carousel"
                  showFilters={false}
                  maxPosts={6}
                />
              </TabsContent>

              <TabsContent value="masonry">
                <SocialFeed layout="masonry" showFilters={true} maxPosts={6} />
              </TabsContent>
            </Tabs>

            <div className="p-4 bg-muted rounded-lg space-y-2">
              <h4 className="font-semibold text-sm">Features:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  ✅ Platform filtering (Twitter, Instagram, Facebook, YouTube,
                  LinkedIn)
                </li>
                <li>✅ 4 layout options: Grid, List, Carousel, Masonry</li>
                <li>✅ Auto-refresh functionality</li>
                <li>✅ Post stats: likes, comments, shares</li>
                <li>✅ Media support (images and videos)</li>
                <li>✅ Relative timestamps with date-fns</li>
                <li>✅ Follow CTA with platform links</li>
                <li>✅ Loading skeletons and empty states</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Usage Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Examples</CardTitle>
            <CardDescription>
              How to integrate these components in your pages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Event Detail Page:</h4>
              <pre className="p-4 bg-muted rounded-lg text-xs overflow-x-auto">
                {`<SocialShare
  url={eventUrl}
  title={event.title}
  description={event.description}
  variant="outline"
  showQRCode={true}
/>`}
              </pre>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Blog Post:</h4>
              <pre className="p-4 bg-muted rounded-lg text-xs overflow-x-auto">
                {`<SocialShare
  url={postUrl}
  title={post.title}
  description={post.excerpt}
  variant="dropdown"
  trackAnalytics={true}
/>`}
              </pre>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Homepage Feed:</h4>
              <pre className="p-4 bg-muted rounded-lg text-xs overflow-x-auto">
                {`<SocialFeed
  layout="grid"
  showFilters={true}
  autoRefresh={true}
  refreshInterval={60000}
  maxPosts={9}
/>`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
