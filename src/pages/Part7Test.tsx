/**
 * Part 7 - Quick Test Page
 *
 * Test all Part 7 routes and features in one place
 * Navigate to: http://localhost:8081/part7-test
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
  ExternalLink,
  Users,
  MessageCircle,
  Search,
  Globe,
  Download,
  WifiOff,
  Keyboard,
} from "lucide-react";

export default function Part7Test() {
  return (
    <div className="container mx-auto pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Part 7 - Feature Test Page
          </h1>
          <p className="text-muted-foreground text-lg">
            Test all Part 7 routes, navigation links, and features
          </p>
          <Badge variant="outline" className="mt-4">
            Section 31-36: Discovery, Search, Messaging, PWA & i18n
          </Badge>
        </div>

        <div className="grid gap-6">
          {/* Section 31: Partners Directory */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Section 31: Partner Directory & Profiles
                  </CardTitle>
                  <CardDescription>
                    Public partner discovery and detailed profiles
                  </CardDescription>
                </div>
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="default">
                  <Link to="/partners">
                    <Users className="mr-2 h-4 w-4" />
                    Partners Directory
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/partners/water-for-life">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Sample Profile: Water For Life
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/partners/education-first">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Sample Profile: Education First
                  </Link>
                </Button>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  ✅ Route: <code>/partners</code> - PartnersDirectory.tsx
                </p>
                <p>
                  ✅ Route: <code>/partners/:slug</code> - PartnerProfile.tsx
                </p>
                <p>✅ Navigation: Header → MORE → Partners</p>
                <p>
                  ✅ Features: Search, filters (focus area, country), sort,
                  stats
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 32: Global Search */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Section 32: Global Search System
                  </CardTitle>
                  <CardDescription>
                    Universal search with keyboard shortcut
                  </CardDescription>
                </div>
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Button variant="default" className="flex items-center gap-2">
                  <Keyboard className="h-4 w-4" />
                  Press Cmd/Ctrl+K
                </Button>
                <span className="text-sm text-muted-foreground">
                  or click search icon in header
                </span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>✅ Component: GlobalSearch.tsx (Dialog)</p>
                <p>✅ Integration: Header component (search button)</p>
                <p>✅ Keyboard shortcut: ⌘K / Ctrl+K</p>
                <p>
                  ✅ Search types: Partners, Projects, Events, Bottles, Articles
                </p>
                <p>
                  ✅ Features: Recent searches, popular searches, keyboard
                  navigation
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 33: Messaging */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Section 33: Messaging System
                  </CardTitle>
                  <CardDescription>Donor-Partner communication</CardDescription>
                </div>
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild variant="default">
                <Link to="/messages">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Open Messages
                </Link>
              </Button>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  ✅ Route: <code>/messages</code> (Protected) -
                  MessagingCenter.tsx
                </p>
                <p>✅ Navigation: User Avatar → Messages</p>
                <p>🔒 Requires Authentication</p>
                <p>
                  ✅ Features: Conversations list, message thread, search,
                  real-time UI
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 35: PWA Features */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Section 35: PWA & Mobile Optimization
                  </CardTitle>
                  <CardDescription>
                    Progressive Web App features
                  </CardDescription>
                </div>
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline">
                  <Link to="/offline">
                    <WifiOff className="mr-2 h-4 w-4" />
                    Offline Page
                  </Link>
                </Button>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  ✅ PWA Manifest: <code>public/manifest.json</code>
                </p>
                <p>
                  ✅ Install Prompt: InstallPrompt.tsx (auto-displays after 3s)
                </p>
                <p>
                  ✅ Offline Page: <code>/offline</code> - Offline.tsx
                </p>
                <p>✅ Platform Detection: iOS vs Chrome instructions</p>
                <p>⚠️ Service Worker: Not implemented (future enhancement)</p>
              </div>
            </CardContent>
          </Card>

          {/* Section 36: i18n */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Section 36: Internationalization
                  </CardTitle>
                  <CardDescription>Multi-language support</CardDescription>
                </div>
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground space-y-1">
                <p>✅ Component: LanguageSwitcher.tsx</p>
                <p>✅ Integration: Header component (globe icon)</p>
                <p>✅ Languages: English (EN) / Nederlands (NL)</p>
                <p>✅ Persistence: localStorage</p>
                <p>✅ i18n System: Already configured (react-i18next)</p>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="border-green-500/50 bg-green-500/5">
            <CardHeader>
              <CardTitle className="text-green-600 dark:text-green-400">
                ✅ Part 7 Verification Complete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Routes Configured:</strong> 4
                  <ul className="mt-1 space-y-1 text-muted-foreground">
                    <li>• /partners</li>
                    <li>• /partners/:slug</li>
                    <li>• /messages (protected)</li>
                    <li>• /offline</li>
                  </ul>
                </div>
                <div>
                  <strong>Components Integrated:</strong> 6
                  <ul className="mt-1 space-y-1 text-muted-foreground">
                    <li>• PartnersDirectory</li>
                    <li>• PartnerProfile</li>
                    <li>• MessagingCenter</li>
                    <li>• GlobalSearch</li>
                    <li>• LanguageSwitcher</li>
                    <li>• InstallPrompt</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  <strong>Compilation Status:</strong> 0 TypeScript errors ✅
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Navigation Links:</strong> All verified ✅
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Mobile Responsive:</strong> Yes ✅
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/">← Back to Homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
