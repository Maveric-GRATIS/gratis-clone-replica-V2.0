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
import NotFoundPage from "./pages/NotFoundPage";
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
// Part 6: Partner System
import PartnerApplicationPage from "./pages/partners/Apply";
import ApplicationConfirmation from "./pages/partners/ApplicationConfirmation";
import AdminApplicationsList from "./pages/admin/partners/ApplicationsList";
import AdminApplicationReview from "./pages/admin/partners/ApplicationReview";
import PartnerDashboardLayout from "./components/partner/PartnerDashboardLayout";
import PartnerDashboard from "./pages/partner/Dashboard";
import PartnerProjects from "./pages/partner/Projects";
import PartnerAnalytics from "./pages/partner/Analytics";
import PartnerDonations from "./pages/partner/Donations";
import PartnerTeam from "./pages/partner/Team";
import PartnerReports from "./pages/partner/Reports";
import PartnerSettings from "./pages/partner/Settings";
import PartnerNotifications from "./pages/partner/PartnerNotifications";
import PartnerSupport from "./pages/partner/Support";
import ProjectForm from "./pages/partner/ProjectForm";
// Part 7: Discovery, Search, Messaging, PWA
import PartnersDirectory from "./pages/public/PartnersDirectory";
import PartnerProfile from "./pages/public/PartnerProfile";
import MessagingCenter from "./pages/MessagingCenter";
import OfflinePage from "./pages/Offline";
import Part7Test from "./pages/Part7Test";
import Part8Test from "./pages/Part8Test";
import Part15Test from "./pages/Part15Test";
// Part 16 - Enterprise Backend (Sections 69-73)
import AuditLogViewer from "./pages/admin/AuditLogViewer";
import RoleManagement from "./pages/admin/RoleManagement";
import TenantManager from "./pages/admin/TenantManager";
import WebhookManager from "./pages/admin/WebhookManager";
import GraphQLExplorer from "./pages/admin/GraphQLExplorer";
// Part 8: Gamification, Support, Leaderboards
import GamificationProfile from "./pages/GamificationProfile";
import SupportTickets from "./pages/SupportTickets";
import Leaderboard from "./pages/Leaderboard";
import AdminSupportDashboard from "./pages/AdminSupportDashboard";
// Part 9: Push Notifications, A/B Testing, Analytics, Volunteers
import PushNotificationSettings from "./pages/PushNotificationSettings";
import ABTestingDashboard from "./pages/ABTestingDashboard";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import VolunteerOpportunities from "./pages/VolunteerOpportunities";
import Part9Test from "./pages/Part9Test";
// Part 10: Inventory, Tax Receipts, Integrations, White-label
import InventoryManagement from "./pages/InventoryManagement";
import TaxReceipts from "./pages/TaxReceipts";
import IntegrationMarketplace from "./pages/IntegrationMarketplace";
import WhiteLabelConfig from "./pages/WhiteLabelConfig";
import Part10Test from "./pages/Part10Test";
// Part 1-6: Foundation, Marketing, Social, Projects
import Part1Test from "./pages/Part1Test";
import Part2Test from "./pages/Part2Test";
import Part3Test from "./pages/Part3Test";
import Part4Test from "./pages/Part4Test";
import Part5Test from "./pages/Part5Test";
import Part6Test from "./pages/Part6Test";
import AdvancedAnalyticsDashboard from "./pages/AdvancedAnalyticsDashboard";
import GDPRComplianceDashboard from "./pages/GDPRComplianceDashboard";
import SubscriptionManagement from "./pages/SubscriptionManagement";
import RefundManagement from "./pages/RefundManagement";
import Part11Test from "./pages/Part11Test";
import Part12Test from "./pages/Part12Test";
import Part13Test from "./pages/Part13Test";
import Part14Test from "./pages/Part14Test";
import Part16Test from "./pages/Part16Test";
import Part17Test from "./pages/Part17Test";
import Part18Test from "./pages/Part18Test";
import Part19Test from "./pages/Part19Test";
import ActivityDemo from "./pages/ActivityDemo";
import ActivityDemoPage from "./pages/ActivityDemoPage";
import PublicStatusPage from "./pages/PublicStatusPage";
import SocialAuthCallback from "./pages/SocialAuthCallback";
import EmailLogsPage from "./pages/admin/EmailLogsPage";
import EmailTemplatesPage from "./pages/admin/EmailTemplatesPage";
import ErrorTrackingDashboard from "./pages/admin/ErrorTrackingDashboard";
import MediaManagerPage from "./pages/admin/MediaManagerPage";
import SystemMonitor from "./pages/SystemMonitor";
import HealthCheck from "./pages/HealthCheck";
import SEOManager from "./pages/admin/SEOManager";
import FeatureFlagsManager from "./pages/admin/FeatureFlagsManager";
import DataExportManager from "./pages/admin/DataExportManager";
import MFASettings from "./pages/admin/MFASettings";
import ModerationQueue from "./pages/admin/ModerationQueue";
import UserMFASettings from "./pages/UserMFASettings";
import DeveloperKeys from "./pages/admin/DeveloperKeys";
import ScheduledJobs from "./pages/admin/ScheduledJobs";
import PlatformConfig from "./pages/admin/PlatformConfig";
import Maintenance from "./pages/Maintenance";
import RateLimitsDashboard from "./pages/admin/RateLimitsDashboard";
import FileManagerPage from "./pages/admin/FileManagerPage";
import DataImportPage from "./pages/admin/DataImportPage";
import BulkOperationsPage from "./pages/admin/BulkOperationsPage";
import DashboardsPage from "./pages/admin/DashboardsPage";
import DashboardViewPage from "./pages/admin/DashboardViewPage";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { analytics } from "@/lib/analytics";
import { useEffect } from "react";
import { PageTransition } from "@/components/PageTransition";
import { useLocation } from "react-router-dom";
// Part 15: Developer APIs, Real-time, Scheduler, Testing, Platform Config
import DeveloperAPIKeys from "./pages/DeveloperAPIKeys";
import SchedulerDashboard from "./pages/SchedulerDashboard";
import PlatformSettings from "./pages/PlatformSettings";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="max-w-full">
      <ScrollProgressBar />
      <OfflineIndicator />
      <CookieConsent />
      <InstallPrompt />
      {!isAdminPage && <Header />}
      {!isAdminPage && <Cart />}
      {!isAdminPage && <FloatingCartButton />}
      <div className="overflow-x-hidden">
        <PageTransition>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/api/health" element={<HealthCheck />} />
            {/* Part Test Pages */}
            <Route path="/part1-test" element={<Part1Test />} />
            <Route path="/part2-test" element={<Part2Test />} />
            <Route path="/part3-test" element={<Part3Test />} />
            <Route path="/part4-test" element={<Part4Test />} />
            <Route path="/part5-test" element={<Part5Test />} />
            <Route path="/part6-test" element={<Part6Test />} />
            <Route path="/part11-test" element={<Part11Test />} />
            <Route path="/part12-test" element={<Part12Test />} />
            <Route path="/part13-test" element={<Part13Test />} />
            <Route path="/part14-test" element={<Part14Test />} />
            <Route path="/part16-test" element={<Part16Test />} />
            <Route path="/part17-test" element={<Part17Test />} />
            <Route path="/part18-test" element={<Part18Test />} />
            <Route path="/part19-test" element={<Part19Test />} />
            <Route path="/activity-demo" element={<ActivityDemo />} />
            <Route path="/activity-feed" element={<ActivityDemoPage />} />
            <Route path="/status" element={<PublicStatusPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<SocialAuthCallback />} />
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
            {/* Partners route moved to Part 7 section */}
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
              path="/admin/emails/logs"
              element={
                <ProtectedRoute requireAdmin>
                  <EmailLogsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/emails/templates"
              element={
                <ProtectedRoute requireAdmin>
                  <EmailTemplatesPage />
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
            <Route
              path="/admin/errors"
              element={
                <ProtectedRoute requireAdmin>
                  <ErrorTrackingDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/media"
              element={
                <ProtectedRoute requireAdmin>
                  <MediaManagerPage />
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
            <Route
              path="/admin/developer"
              element={
                <ProtectedRoute requireAdmin>
                  <DeveloperKeys />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/scheduler"
              element={
                <ProtectedRoute requireAdmin>
                  <ScheduledJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/config"
              element={
                <ProtectedRoute requireAdmin>
                  <PlatformConfig />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/rate-limits"
              element={
                <ProtectedRoute requireAdmin>
                  <RateLimitsDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/files"
              element={
                <ProtectedRoute requireAdmin>
                  <FileManagerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/import"
              element={
                <ProtectedRoute requireAdmin>
                  <DataImportPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bulk"
              element={
                <ProtectedRoute requireAdmin>
                  <BulkOperationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboards"
              element={
                <ProtectedRoute requireAdmin>
                  <DashboardsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboards/:id"
              element={
                <ProtectedRoute requireAdmin>
                  <DashboardViewPage />
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

            {/* Part 6: Partner System - Public Pages */}
            <Route
              path="/partners/apply"
              element={<PartnerApplicationPage />}
            />
            <Route
              path="/partners/apply/confirmation"
              element={<ApplicationConfirmation />}
            />

            {/* Part 6: Partner System - Admin Pages */}
            <Route
              path="/admin/partners/applications"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminApplicationsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/partners/applications/:id"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminApplicationReview />
                </ProtectedRoute>
              }
            />

            {/* Part 6: Partner Dashboard - Protected Area */}
            <Route
              path="/partner"
              element={
                <ProtectedRoute requireAuth>
                  <PartnerDashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<PartnerDashboard />} />
              <Route path="projects" element={<PartnerProjects />} />
              <Route path="projects/new" element={<ProjectForm />} />
              <Route path="projects/:id" element={<ProjectForm />} />
              <Route path="donations" element={<PartnerDonations />} />
              <Route path="analytics" element={<PartnerAnalytics />} />
              <Route path="team" element={<PartnerTeam />} />
              <Route path="reports" element={<PartnerReports />} />
              <Route path="notifications" element={<PartnerNotifications />} />
              <Route path="settings" element={<PartnerSettings />} />
              <Route path="support" element={<PartnerSupport />} />
            </Route>

            {/* Part 7: Public Partner Directory & Discovery */}
            <Route path="/partners" element={<PartnersDirectory />} />
            <Route path="/partners/:slug" element={<PartnerProfile />} />

            {/* Part 7: Messaging System */}
            <Route
              path="/messages"
              element={
                <ProtectedRoute requireAuth>
                  <MessagingCenter />
                </ProtectedRoute>
              }
            />

            {/* Part 7: PWA Offline Page */}
            <Route path="/offline" element={<OfflinePage />} />

            {/* Part 7: Test Page */}
            <Route path="/part7-test" element={<Part7Test />} />

            {/* Part 8: Gamification & Community */}
            <Route
              path="/gamification"
              element={
                <ProtectedRoute requireAuth>
                  <GamificationProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/support"
              element={
                <ProtectedRoute requireAuth>
                  <SupportTickets />
                </ProtectedRoute>
              }
            />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/part8-test" element={<Part8Test />} />
            <Route path="/part15-test" element={<Part15Test />} />
            <Route
              path="/admin/support"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminSupportDashboard />
                </ProtectedRoute>
              }
            />

            {/* Part 9: Push Notifications, A/B Testing, Analytics, Volunteers */}
            <Route
              path="/settings/push-notifications"
              element={
                <ProtectedRoute requireAuth>
                  <PushNotificationSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/experiments"
              element={
                <ProtectedRoute requireAdmin>
                  <ABTestingDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics-advanced"
              element={
                <ProtectedRoute requireAdmin>
                  <AnalyticsDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/volunteer" element={<VolunteerOpportunities />} />
            <Route path="/part9-test" element={<Part9Test />} />

            {/* Part 10: Inventory, Tax Receipts, Integrations, White-label */}
            <Route
              path="/admin/inventory"
              element="{
                <ProtectedRoute requireAdmin>
                  <InventoryManagement />
                </ProtectedRoute>
              }"
            />
            <Route
              path="/admin/tax-receipts"
              element={
                <ProtectedRoute requireAdmin>
                  <TaxReceipts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/integrations"
              element={
                <ProtectedRoute requireAdmin>
                  <IntegrationMarketplace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/white-label"
              element={
                <ProtectedRoute requireAdmin>
                  <WhiteLabelConfig />
                </ProtectedRoute>
              }
            />
            <Route path="/part10-test" element={<Part10Test />} />

            {/* PART 11 ROUTES - Enterprise Features (Sections 43-48) */}
            <Route
              path="/admin/analytics-advanced"
              element={
                <ProtectedRoute requireAdmin>
                  <AdvancedAnalyticsDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/privacy" element={<GDPRComplianceDashboard />} />
            <Route
              path="/donations/subscribe"
              element={
                <ProtectedRoute requireAuth>
                  <SubscriptionManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/refunds"
              element={
                <ProtectedRoute requireAdmin>
                  <RefundManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/monitoring"
              element={
                <ProtectedRoute requireAdmin>
                  <SystemMonitor />
                </ProtectedRoute>
              }
            />

            {/* PART 14 ROUTES - Enterprise Features (Sections 59-63) */}
            <Route
              path="/admin/seo-manager"
              element={
                <ProtectedRoute requireAdmin>
                  <SEOManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/feature-flags"
              element={
                <ProtectedRoute requireAdmin>
                  <FeatureFlagsManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/data-export"
              element={
                <ProtectedRoute requireAdmin>
                  <DataExportManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/mfa-settings"
              element={
                <ProtectedRoute requireAdmin>
                  <MFASettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/moderation-queue"
              element={
                <ProtectedRoute requireAdmin>
                  <ModerationQueue />
                </ProtectedRoute>
              }
            />

            {/* User Settings Routes */}
            <Route
              path="/settings/security"
              element={
                <ProtectedRoute requireAuth>
                  <UserMFASettings />
                </ProtectedRoute>
              }
            />

            {/* PART 15 ROUTES - Enterprise APIs & Platform Management (Sections 64-68) */}
            <Route
              path="/developer/api-keys"
              element={
                <ProtectedRoute requireAuth>
                  <DeveloperAPIKeys />
                </ProtectedRoute>
              }
            />
            {/* Scheduler route moved to Part 17 - see /admin/scheduler above */}
            <Route
              path="/admin/platform-settings"
              element={
                <ProtectedRoute requireAdmin>
                  <PlatformSettings />
                </ProtectedRoute>
              }
            />

            {/* PART 16 ROUTES - Enterprise Backend (Sections 69-73) */}
            <Route
              path="/admin/audit-logs"
              element={
                <ProtectedRoute requireAdmin>
                  <AuditLogViewer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/roles"
              element={
                <ProtectedRoute requireAdmin>
                  <RoleManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/tenants"
              element={
                <ProtectedRoute requireAdmin>
                  <TenantManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/webhooks"
              element={
                <ProtectedRoute requireAdmin>
                  <WebhookManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/graphql"
              element={
                <ProtectedRoute requireAdmin>
                  <GraphQLExplorer />
                </ProtectedRoute>
              }
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFoundPage />} />
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
                <BrowserRouter
                  future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                  }}
                >
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
