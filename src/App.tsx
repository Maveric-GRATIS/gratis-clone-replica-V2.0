import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { Cart } from "@/components/Cart";
import { FloatingCartButton } from "@/components/FloatingCartButton";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { CookieConsent } from "@/components/CookieConsent";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Gratis from "@/pages/Gratis";
import Water from "@/pages/Water";
import Theurgy from "@/pages/Theurgy";
import FU from "@/pages/FU";
import Arcane from "@/pages/Arcane";
import Tribe from "@/pages/Tribe";
import Heritage from "@/pages/tribe/Heritage";
import Ethics from "@/pages/tribe/Ethics";
import Team from "@/pages/tribe/Team";
import Standards from "@/pages/tribe/Standards";
import Responsibility from "@/pages/tribe/Responsibility";
import Accountability from "@/pages/tribe/Accountability";
import Transparency from "@/pages/tribe/Transparency";
import Compliance from "@/pages/tribe/Compliance";
import Terms from "@/pages/tribe/Terms";
import Privacy from "@/pages/tribe/Privacy";
import Cookies from "@/pages/tribe/Cookies";
import TribeSignup from "@/pages/tribe/Signup";
import TribeDashboard from "@/pages/tribe/Dashboard";
import TribeVoting from "@/pages/tribe/Voting";
import * as LegalPages from "@/pages/legal";
import ImpactTV from "@/pages/ImpactTV";
import Nexus from "@/pages/impactTV/Nexus";
import Yarns from "@/pages/impactTV/Yarns";
import Unveil from "@/pages/impactTV/Unveil";
import Icon from "@/pages/impactTV/Icon";
import Tales from "@/pages/impactTV/Tales";
import Spark from "@/pages/Spark";
import Donate from "@/pages/spark/Donate";
import DonateNew from "./pages/spark/DonateNew";
import ManageRecurringDonations from "./pages/spark/ManageRecurringDonations";
import Verve from "@/pages/spark/Verve";
import Infuse from "@/pages/spark/Infuse";
import Blaze from "@/pages/spark/Blaze";
import Enlist from "@/pages/spark/Enlist";
import Auth from "./pages/Auth";
import RigStore from "./pages/RigStore";
import PrimePicks from "./pages/rig/PrimePicks";
import ApexArrivals from "./pages/rig/ApexArrivals";
import ImbuedIcons from "./pages/rig/ImbuedIcons";
import DazzleDrip from "./pages/rig/DazzleDrip";
import CharmedCozies from "./pages/rig/CharmedCozies";
import OccultOriginals from "./pages/rig/OccultOriginals";
import NexusNoggin from "./pages/rig/NexusNoggin";
import NebulaNovelties from "./pages/rig/NebulaNovelties";
import HydrationStore from "./pages/HydrationStore";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutCancel from "./pages/CheckoutCancel";
import OrderConfirmation from "./pages/OrderConfirmation";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Dashboard from "./pages/Dashboard";
import DashboardBottles from "./pages/dashboard/Bottles";
import DashboardVote from "./pages/dashboard/Vote";
import DashboardSettings from "./pages/dashboard/Settings";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Videos from "./pages/Videos";
import VideoDetail from "./pages/VideoDetail";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
// New Admin Panel Pages (Part 4)
import NewAdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminUsers from "./pages/admin/Users";
import AdminVideos from "./pages/admin/Videos";
import AdminCampaigns from "./pages/admin/Campaigns";
import AdminEvents from "./pages/admin/Events";
import AdminBlogPosts from "./pages/admin/BlogPosts";
import AdminEventCheckIn from "./pages/admin/EventCheckIn";
import AdminDonations from "./pages/admin/Donations";
import AdminDonationCampaigns from "./pages/admin/DonationCampaigns";
import AdminTribeMembers from "./pages/admin/TribeMembers";
import AdminPartners from "./pages/admin/Partners";
import AdminPartnerApplications from "./pages/admin/PartnerApplications";
import AdminVoting from "./pages/admin/Voting";
import AdminVotingResults from "./pages/admin/VotingResults";
import AdminEmails from "./pages/admin/Emails";
import AdminNotifications from "./pages/admin/Notifications";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminAnalyticsTraffic from "./pages/admin/AnalyticsTraffic";
import AdminAnalyticsImpact from "./pages/admin/AnalyticsImpact";
import AdminSettings from "./pages/admin/Settings";
import AdminSettingsIntegrations from "./pages/admin/SettingsIntegrations";
import Partners from "./pages/Partners";
import CollectionDetail from "./pages/CollectionDetail";
import Corporate from "./pages/Corporate";
import Press from "./pages/Press";
import Impact from "./pages/Impact";
import NGOApplication from "./pages/NGOApplication";
import SocialDemo from "./pages/SocialDemo";
import RouteTest from "./pages/RouteTest";
import Community from "./pages/Community";
import ImpactProjects from "./pages/ImpactProjects";
import ProjectDetail from "./pages/ProjectDetail";
import Referrals from "./pages/Referrals";
import Notifications from "./pages/Notifications";
import NotificationSettings from "./pages/settings/NotificationSettings";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { analytics } from "@/lib/analytics";
import { useEffect } from "react";
import { PageTransition } from "@/components/PageTransition";
import { useLocation } from "react-router-dom";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="max-w-full">
      <ScrollProgressBar />
      <OfflineIndicator />
      <CookieConsent />
      {!isAdminPage && <Header />}
      {!isAdminPage && <Cart />}
      {!isAdminPage && <FloatingCartButton />}
      <div className="overflow-x-hidden">
        <PageTransition>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/rig" element={<RigStore />} />
            <Route path="/rig/prime-picks" element={<PrimePicks />} />
            <Route path="/rig/apex-arrivals" element={<ApexArrivals />} />
            <Route path="/rig/imbued-icons" element={<ImbuedIcons />} />
            <Route path="/rig/dazzle-drip" element={<DazzleDrip />} />
            <Route path="/rig/charmed-cozies" element={<CharmedCozies />} />
            <Route path="/rig/occult-originals" element={<OccultOriginals />} />
            <Route path="/rig/nexus-noggin" element={<NexusNoggin />} />
            <Route path="/rig/nebula-novelties" element={<NebulaNovelties />} />
            <Route
              path="/rig/collection/:slug"
              element={<CollectionDetail />}
            />
            <Route path="/rig/:slug" element={<ProductDetail />} />
            {/* Legacy route redirect */}
            <Route path="/rig-store" element={<RigStore />} />
            <Route
              path="/rig-store/collection/:slug"
              element={<CollectionDetail />}
            />
            <Route path="/rig-store/:slug" element={<ProductDetail />} />
            <Route path="/hydration" element={<HydrationStore />} />
            <Route path="/hydration/:slug" element={<ProductDetail />} />
            <Route path="/gratis" element={<Gratis />} />
            <Route path="/gratis/water" element={<Water />} />
            <Route path="/gratis/theurgy" element={<Theurgy />} />
            <Route path="/gratis/fu" element={<FU />} />
            {/* Legacy route redirects */}
            <Route path="/water" element={<Water />} />
            <Route path="/theurgy" element={<Theurgy />} />
            <Route path="/fu" element={<FU />} />
            <Route path="/arcane" element={<Arcane />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/corporate" element={<Corporate />} />
            <Route path="/press" element={<Press />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/impact/projects" element={<ImpactProjects />} />
            <Route path="/impact/projects/:slug" element={<ProjectDetail />} />
            <Route path="/ngo-application" element={<NGOApplication />} />
            <Route path="/community" element={<Community />} />
            <Route path="/social-demo" element={<SocialDemo />} />
            <Route path="/route-test" element={<RouteTest />} />
            <Route path="/tribe" element={<Tribe />} />
            <Route path="/tribe/heritage" element={<Heritage />} />
            <Route path="/tribe/ethics" element={<Ethics />} />
            <Route path="/tribe/team" element={<Team />} />
            <Route path="/tribe/standards" element={<Standards />} />
            <Route path="/tribe/responsibility" element={<Responsibility />} />
            <Route path="/tribe/accountability" element={<Accountability />} />
            <Route path="/tribe/transparency" element={<Transparency />} />
            <Route path="/tribe/compliance" element={<Compliance />} />
            <Route path="/tribe/terms" element={<Terms />} />
            <Route path="/tribe/privacy" element={<Privacy />} />
            <Route path="/tribe/cookies" element={<Cookies />} />

            {/* TRIBE Membership Routes */}
            <Route path="/tribe/signup" element={<TribeSignup />} />
            <Route
              path="/tribe/dashboard"
              element={
                <ProtectedRoute>
                  <TribeDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tribe/voting"
              element={
                <ProtectedRoute>
                  <TribeVoting />
                </ProtectedRoute>
              }
            />

            {/* Legal Pages */}
            <Route path="/legal/privacy" element={<LegalPages.Privacy />} />
            <Route path="/legal/terms" element={<LegalPages.Terms />} />
            <Route path="/legal/cookies" element={<LegalPages.Cookies />} />
            <Route
              path="/legal/donor-privacy"
              element={<LegalPages.DonorPrivacy />}
            />
            <Route
              path="/legal/accessibility"
              element={<LegalPages.Accessibility />}
            />
            <Route
              path="/legal/disclaimer"
              element={<LegalPages.Disclaimer />}
            />

            <Route path="/impact-tv" element={<ImpactTV />} />
            <Route path="/impact-tv/nexus" element={<Nexus />} />
            <Route path="/impact-tv/yarns" element={<Yarns />} />
            <Route path="/impact-tv/unveil" element={<Unveil />} />
            <Route path="/impact-tv/icon" element={<Icon />} />
            <Route path="/impact-tv/tales" element={<Tales />} />

            {/* Video Platform Routes */}
            <Route path="/videos" element={<Videos />} />
            <Route path="/videos/:slug" element={<VideoDetail />} />

            <Route path="/spark" element={<Spark />} />
            <Route path="/spark/donate" element={<DonateNew />} />
            <Route path="/spark/donate/legacy" element={<Donate />} />
            <Route
              path="/spark/donate/manage"
              element={
                <ProtectedRoute>
                  <ManageRecurringDonations />
                </ProtectedRoute>
              }
            />
            <Route path="/spark/verve" element={<Verve />} />
            <Route path="/spark/infuse" element={<Infuse />} />
            <Route path="/spark/blaze" element={<Blaze />} />
            <Route path="/spark/enlist" element={<Enlist />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/checkout/cancel" element={<CheckoutCancel />} />
            <Route
              path="/order-confirmation/:orderId"
              element={<OrderConfirmation />}
            />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:orderId" element={<OrderDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/bottles" element={<DashboardBottles />} />
            <Route path="/dashboard/vote" element={<DashboardVote />} />
            <Route path="/dashboard/settings" element={<DashboardSettings />} />
            <Route path="/referrals" element={<Referrals />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route
              path="/settings/notifications"
              element={<NotificationSettings />}
            />

            {/* Events Routes */}
            <Route path="/events" element={<Events />} />
            <Route path="/events/:slug" element={<EventDetail />} />

            {/* Admin Routes - New Admin Panel with Enhanced Layout */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <NewAdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/videos"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminVideos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/campaigns"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminCampaigns />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/events"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminEvents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/blog"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminBlogPosts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/event-checkin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminEventCheckIn />
                </ProtectedRoute>
              }
            />

            {/* Donations */}
            <Route
              path="/admin/donations"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDonations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/donations/campaigns"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDonationCampaigns />
                </ProtectedRoute>
              }
            />

            {/* Users & TRIBE */}
            <Route
              path="/admin/users/tribe"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminTribeMembers />
                </ProtectedRoute>
              }
            />

            {/* Partners */}
            <Route
              path="/admin/partners"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminPartners />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/partners/applications"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminPartnerApplications />
                </ProtectedRoute>
              }
            />

            {/* Voting */}
            <Route
              path="/admin/voting"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminVoting />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/voting/results"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminVotingResults />
                </ProtectedRoute>
              }
            />

            {/* Communications */}
            <Route
              path="/admin/emails"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminEmails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/notifications"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminNotifications />
                </ProtectedRoute>
              }
            />

            {/* Analytics */}
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics/traffic"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminAnalyticsTraffic />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics/impact"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminAnalyticsImpact />
                </ProtectedRoute>
              }
            />

            {/* Settings */}
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings/integrations"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminSettingsIntegrations />
                </ProtectedRoute>
              }
            />

            {/* Legacy Admin Routes (keep for backwards compatibility) */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/old/*"
              element={
                <ProtectedRoute requireAdmin>
                  <Admin />
                </ProtectedRoute>
              }
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </div>
      {!isAdminPage && <Footer />}
    </div>
  );
};

const App = () => {
  useEffect(() => {
    analytics.init();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          storageKey="gratis-theme"
        >
          <AuthProvider>
            <CartProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AppContent />
                </BrowserRouter>
              </TooltipProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
