import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { Cart } from "@/components/Cart";
import { FloatingCartButton } from "@/components/FloatingCartButton";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { CookieConsent } from "@/components/CookieConsent";
import { ThemeProvider } from "next-themes";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import NotFoundPage from "./pages/NotFoundPage";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Core pages - loaded immediately
import Gratis from "@/pages/Gratis";
import Water from "@/pages/Water";
import Theurgy from "@/pages/Theurgy";
import FU from "@/pages/FU";
import Auth from "./pages/Auth";
import Checkout from "./pages/Checkout";

// Lazy-loaded pages - split into chunks
const Arcane = lazy(() => import("@/pages/Arcane"));
const Tribe = lazy(() => import("@/pages/Tribe"));
const Heritage = lazy(() => import("@/pages/tribe/Heritage"));
const Ethics = lazy(() => import("@/pages/tribe/Ethics"));
const Team = lazy(() => import("@/pages/tribe/Team"));
const Standards = lazy(() => import("@/pages/tribe/Standards"));
const Responsibility = lazy(() => import("@/pages/tribe/Responsibility"));
const Accountability = lazy(() => import("@/pages/tribe/Accountability"));
const Transparency = lazy(() => import("@/pages/tribe/Transparency"));
const Compliance = lazy(() => import("@/pages/tribe/Compliance"));
const Terms = lazy(() => import("@/pages/tribe/Terms"));
const Privacy = lazy(() => import("@/pages/tribe/Privacy"));
const Cookies = lazy(() => import("@/pages/tribe/Cookies"));
const TransparencyBrandProtection = lazy(
  () => import("@/pages/transparency/BrandProtection"),
);
const TransparencySafety = lazy(() => import("@/pages/transparency/Safety"));
const TribeSignup = lazy(() => import("@/pages/tribe/Signup"));
const TribeDashboard = lazy(() => import("@/pages/tribe/Dashboard"));
const TribeVoting = lazy(() => import("@/pages/tribe/Voting"));
const LegalPages = {
  Privacy: lazy(() =>
    import("@/pages/legal").then((m) => ({ default: m.Privacy })),
  ),
  Terms: lazy(() =>
    import("@/pages/legal").then((m) => ({ default: m.Terms })),
  ),
  Cookies: lazy(() =>
    import("@/pages/legal").then((m) => ({ default: m.Cookies })),
  ),
  DonorPrivacy: lazy(() =>
    import("@/pages/legal").then((m) => ({ default: m.DonorPrivacy })),
  ),
  Accessibility: lazy(() =>
    import("@/pages/legal").then((m) => ({ default: m.Accessibility })),
  ),
  Disclaimer: lazy(() =>
    import("@/pages/legal").then((m) => ({ default: m.Disclaimer })),
  ),
  PartnerCodeOfConduct: lazy(() =>
    import("@/pages/legal").then((m) => ({ default: m.PartnerCodeOfConduct })),
  ),
};
const ImpactTV = lazy(() => import("@/pages/ImpactTV"));
const Nexus = lazy(() => import("@/pages/impactTV/Nexus"));
const Yarns = lazy(() => import("@/pages/impactTV/Yarns"));
const Unveil = lazy(() => import("@/pages/impactTV/Unveil"));
const Icon = lazy(() => import("@/pages/impactTV/Icon"));
const Tales = lazy(() => import("@/pages/impactTV/Tales"));
const Spark = lazy(() => import("@/pages/Spark"));
const Donate = lazy(() => import("@/pages/spark/Donate"));
const DonateNew = lazy(() => import("./pages/spark/DonateNew"));
const CorporateGiving = lazy(() => import("@/pages/spark/CorporateGiving"));
const HonorMemorialGifts = lazy(
  () => import("@/pages/spark/HonorMemorialGifts"),
);
const AllWaysToGive = lazy(() => import("@/pages/spark/AllWaysToGive"));
const MonthlyGiving = lazy(() => import("@/pages/spark/MonthlyGiving"));
const FinancialPolicies = lazy(
  () => import("@/pages/reports/FinancialPolicies"),
);
const AnnualReports = lazy(() => import("@/pages/reports/AnnualReports"));
const InKindValuation = lazy(() => import("@/pages/reports/InKindValuation"));
const DonationPolicies = lazy(() => import("@/pages/reports/DonationPolicies"));
const AccreditationLeadership = lazy(
  () => import("@/pages/accreditation/Leadership"),
);
const AccreditationEIN = lazy(() => import("@/pages/accreditation/EIN"));
const AccreditationANBI = lazy(
  () => import("@/pages/accreditation/ANBIStatus"),
);
const AccreditationCharityRating = lazy(
  () => import("@/pages/accreditation/CharityRating"),
);
const ManageRecurringDonations = lazy(
  () => import("./pages/spark/ManageRecurringDonations"),
);
const Verve = lazy(() => import("@/pages/spark/Verve"));
const Infuse = lazy(() => import("@/pages/spark/Infuse"));
const Blaze = lazy(() => import("@/pages/spark/Blaze"));
const Enlist = lazy(() => import("@/pages/spark/Enlist"));
const RigStore = lazy(() => import("./pages/RigStore"));
const PrimePicks = lazy(() => import("./pages/rig/PrimePicks"));
const ApexArrivals = lazy(() => import("./pages/rig/ApexArrivals"));
const ImbuedIcons = lazy(() => import("./pages/rig/ImbuedIcons"));
const DazzleDrip = lazy(() => import("./pages/rig/DazzleDrip"));
const CharmedCozies = lazy(() => import("./pages/rig/CharmedCozies"));
const OccultOriginals = lazy(() => import("./pages/rig/OccultOriginals"));
const NexusNoggin = lazy(() => import("./pages/rig/NexusNoggin"));
const NebulaNovelties = lazy(() => import("./pages/rig/NebulaNovelties"));
const HydrationStore = lazy(() => import("./pages/HydrationStore"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess"));
const CheckoutCancel = lazy(() => import("./pages/CheckoutCancel"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderDetail = lazy(() => import("./pages/OrderDetail"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DashboardBottles = lazy(() => import("./pages/dashboard/Bottles"));
const DashboardVote = lazy(() => import("./pages/dashboard/Vote"));
const DashboardSettings = lazy(() => import("./pages/dashboard/Settings"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const Events = lazy(() => import("./pages/Events"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const Videos = lazy(() => import("./pages/Videos"));
const VideoDetail = lazy(() => import("./pages/VideoDetail"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
// Admin Panel Pages (Part 4) - ALL lazy loaded for bundle splitting
const NewAdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminProducts = lazy(() => import("./pages/admin/Products"));
const AdminOrders = lazy(() => import("./pages/admin/Orders"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminVideos = lazy(() => import("./pages/admin/Videos"));
const AdminCampaigns = lazy(() => import("./pages/admin/Campaigns"));
const AdminEvents = lazy(() => import("./pages/admin/Events"));
const AdminBlogPosts = lazy(() => import("./pages/admin/BlogPosts"));
const AdminEventCheckIn = lazy(() => import("./pages/admin/EventCheckIn"));
const AdminDonations = lazy(() => import("./pages/admin/Donations"));
const AdminDonationCampaigns = lazy(
  () => import("./pages/admin/DonationCampaigns"),
);
const AdminTribeMembers = lazy(() => import("./pages/admin/TribeMembers"));
const AdminPartners = lazy(() => import("./pages/admin/Partners"));
const PartnersTest = lazy(() => import("./pages/admin/PartnersTest"));
const AdminPartnerApplications = lazy(
  () => import("./pages/admin/PartnerApplications"),
);
const AdminVoting = lazy(() => import("./pages/admin/Voting"));
const AdminVotingResults = lazy(() => import("./pages/admin/VotingResults"));
const AdminEmails = lazy(() => import("./pages/admin/Emails"));
const AdminNotifications = lazy(() => import("./pages/admin/Notifications"));
const AdminAnalytics = lazy(() => import("./pages/admin/Analytics"));
const AdminAnalyticsTraffic = lazy(
  () => import("./pages/admin/AnalyticsTraffic"),
);
const AdminAnalyticsImpact = lazy(
  () => import("./pages/admin/AnalyticsImpact"),
);
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const AdminSettingsIntegrations = lazy(
  () => import("./pages/admin/SettingsIntegrations"),
);
const Partners = lazy(() => import("./pages/Partners"));
const InformationPartners = lazy(() => import("./pages/tribe/Partners"));
const CollectionDetail = lazy(() => import("./pages/CollectionDetail"));
const Corporate = lazy(() => import("./pages/Corporate"));
const Press = lazy(() => import("./pages/Press"));
const InformationPress = lazy(() => import("./pages/tribe/Press"));
const Impact = lazy(() => import("./pages/Impact"));
const NGOApplication = lazy(() => import("./pages/NGOApplication"));
const SocialDemo = lazy(() => import("./pages/SocialDemo"));
const RouteTest = lazy(() => import("./pages/RouteTest"));
const Community = lazy(() => import("./pages/Community"));
const ImpactProjects = lazy(() => import("./pages/ImpactProjects"));
const Blog = lazy(() => import("./pages/Blog"));
const Campaigns = lazy(() => import("./pages/Campaigns"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const Referrals = lazy(() => import("./pages/Referrals"));
const Notifications = lazy(() => import("./pages/Notifications"));
const NotificationSettings = lazy(
  () => import("./pages/settings/NotificationSettings"),
);
// Part 6: Partner System - lazy loaded
const PartnerApplicationPage = lazy(() => import("./pages/partners/Apply"));
const ApplicationConfirmation = lazy(
  () => import("./pages/partners/ApplicationConfirmation"),
);
const AdminApplicationsList = lazy(
  () => import("./pages/admin/partners/ApplicationsList"),
);
const AdminApplicationReview = lazy(
  () => import("./pages/admin/partners/ApplicationReview"),
);
const PartnerDashboardLayout = lazy(
  () => import("./components/partner/PartnerDashboardLayout"),
);
const PartnerDashboard = lazy(() => import("./pages/partner/Dashboard"));
const PartnerProjects = lazy(() => import("./pages/partner/Projects"));
const PartnerAnalytics = lazy(() => import("./pages/partner/Analytics"));
const PartnerDonations = lazy(() => import("./pages/partner/Donations"));
const PartnerTeam = lazy(() => import("./pages/partner/Team"));
const PartnerReports = lazy(() => import("./pages/partner/Reports"));
const PartnerSettings = lazy(() => import("./pages/partner/Settings"));
const PartnerNotifications = lazy(
  () => import("./pages/partner/PartnerNotifications"),
);
const PartnerSupport = lazy(() => import("./pages/partner/Support"));
const ProjectForm = lazy(() => import("./pages/partner/ProjectForm"));
// Part 7: Discovery, Search, Messaging, PWA - lazy loaded
const PartnersDirectory = lazy(
  () => import("./pages/public/PartnersDirectory"),
);
const PartnerProfile = lazy(() => import("./pages/public/PartnerProfile"));
const MessagingCenter = lazy(() => import("./pages/MessagingCenter"));
const OfflinePage = lazy(() => import("./pages/Offline"));
const Part7Test = lazy(() => import("./pages/Part7Test"));
const Part8Test = lazy(() => import("./pages/Part8Test"));
const Part15Test = lazy(() => import("./pages/Part15Test"));
// Part 16 - Enterprise Backend - lazy loaded
const AuditLogViewer = lazy(() => import("./pages/admin/AuditLogViewer"));
const RoleManagement = lazy(() => import("./pages/admin/RoleManagement"));
const TenantManager = lazy(() => import("./pages/admin/TenantManager"));
const WebhookManager = lazy(() => import("./pages/admin/WebhookManager"));
const GraphQLExplorer = lazy(() => import("./pages/admin/GraphQLExplorer"));
// Part 8: Gamification, Support, Leaderboards - lazy loaded
const GamificationProfile = lazy(() => import("./pages/GamificationProfile"));
const SupportTickets = lazy(() => import("./pages/SupportTickets"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const AdminSupportDashboard = lazy(
  () => import("./pages/AdminSupportDashboard"),
);
// Part 9: Push Notifications, A/B Testing, Analytics, Volunteers - lazy loaded
const PushNotificationSettings = lazy(
  () => import("./pages/PushNotificationSettings"),
);
const ABTestingDashboard = lazy(() => import("./pages/ABTestingDashboard"));
const AnalyticsDashboard = lazy(() => import("./pages/AnalyticsDashboard"));
const VolunteerOpportunities = lazy(
  () => import("./pages/VolunteerOpportunities"),
);
const Part9Test = lazy(() => import("./pages/Part9Test"));
// Part 10: Inventory, Tax Receipts, Integrations, White-label - lazy loaded
const InventoryManagement = lazy(() => import("./pages/InventoryManagement"));
const TaxReceipts = lazy(() => import("./pages/TaxReceipts"));
const IntegrationMarketplace = lazy(
  () => import("./pages/IntegrationMarketplace"),
);
const WhiteLabelConfig = lazy(() => import("./pages/WhiteLabelConfig"));
const Part10Test = lazy(() => import("./pages/Part10Test"));
// Part 1-6: Test pages - lazy loaded
const Part1Test = lazy(() => import("./pages/Part1Test"));
const Part2Test = lazy(() => import("./pages/Part2Test"));
const Part3Test = lazy(() => import("./pages/Part3Test"));
const Part4Test = lazy(() => import("./pages/Part4Test"));
const Part5Test = lazy(() => import("./pages/Part5Test"));
const Part6Test = lazy(() => import("./pages/Part6Test"));
const AdvancedAnalyticsDashboard = lazy(
  () => import("./pages/AdvancedAnalyticsDashboard"),
);
const GDPRComplianceDashboard = lazy(
  () => import("./pages/GDPRComplianceDashboard"),
);
const SubscriptionManagement = lazy(
  () => import("./pages/SubscriptionManagement"),
);
const RefundManagement = lazy(() => import("./pages/RefundManagement"));
const Part11Test = lazy(() => import("./pages/Part11Test"));
const Part12Test = lazy(() => import("./pages/Part12Test"));
const Part13Test = lazy(() => import("./pages/Part13Test"));
const Part14Test = lazy(() => import("./pages/Part14Test"));
const Part16Test = lazy(() => import("./pages/Part16Test"));
const Part17Test = lazy(() => import("./pages/Part17Test"));
const Part18Test = lazy(() => import("./pages/Part18Test"));
const Part19Test = lazy(() => import("./pages/Part19Test"));
const ActivityDemo = lazy(() => import("./pages/ActivityDemo"));
const ActivityDemoPage = lazy(() => import("./pages/ActivityDemoPage"));
const PublicStatusPage = lazy(() => import("./pages/PublicStatusPage"));
const SocialAuthCallback = lazy(() => import("./pages/SocialAuthCallback"));
const EmailLogsPage = lazy(() => import("./pages/admin/EmailLogsPage"));
const EmailTemplatesPage = lazy(
  () => import("./pages/admin/EmailTemplatesPage"),
);
const ErrorTrackingDashboard = lazy(
  () => import("./pages/admin/ErrorTrackingDashboard"),
);
const MediaManagerPage = lazy(() => import("./pages/admin/MediaManagerPage"));
const SystemMonitor = lazy(() => import("./pages/SystemMonitor"));
const HealthCheck = lazy(() => import("./pages/HealthCheck"));
const SEOManager = lazy(() => import("./pages/admin/SEOManager"));
const FeatureFlagsManager = lazy(
  () => import("./pages/admin/FeatureFlagsManager"),
);
const DataExportManager = lazy(() => import("./pages/admin/DataExportManager"));
const MFASettings = lazy(() => import("./pages/admin/MFASettings"));
const ModerationQueue = lazy(() => import("./pages/admin/ModerationQueue"));
const UserMFASettings = lazy(() => import("./pages/UserMFASettings"));
const DeveloperKeys = lazy(() => import("./pages/admin/DeveloperKeys"));
const ScheduledJobs = lazy(() => import("./pages/admin/ScheduledJobs"));
const PlatformConfig = lazy(() => import("./pages/admin/PlatformConfig"));
const Maintenance = lazy(() => import("./pages/Maintenance"));
const RateLimitsDashboard = lazy(
  () => import("./pages/admin/RateLimitsDashboard"),
);
const FileManagerPage = lazy(() => import("./pages/admin/FileManagerPage"));
const DataImportPage = lazy(() => import("./pages/admin/DataImportPage"));
const BulkOperationsPage = lazy(
  () => import("./pages/admin/BulkOperationsPage"),
);
const DashboardsPage = lazy(() => import("./pages/admin/DashboardsPage"));
const DashboardViewPage = lazy(() => import("./pages/admin/DashboardViewPage"));
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { analytics } from "@/lib/analytics";
import { useEffect } from "react";
import { PageTransition } from "@/components/PageTransition";
import { useLocation } from "react-router-dom";
// Part 15: Developer APIs, Real-time, Scheduler, Testing, Platform Config - lazy loaded
const DeveloperAPIKeys = lazy(() => import("./pages/DeveloperAPIKeys"));
const SchedulerDashboard = lazy(() => import("./pages/SchedulerDashboard"));
const PlatformSettings = lazy(() => import("./pages/PlatformSettings"));

// Page loading fallback
const PageLoader = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="text-sm text-muted-foreground">Laden...</p>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minuten
      gcTime: 10 * 60 * 1000, // 10 minuten cache
      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

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
          <ErrorBoundary resetKeys={[location.pathname]}>
            <Suspense fallback={<PageLoader />}>
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
                <Route
                  path="/rig/occult-originals"
                  element={<OccultOriginals />}
                />
                <Route path="/rig/nexus-noggin" element={<NexusNoggin />} />
                <Route
                  path="/rig/nebula-novelties"
                  element={<NebulaNovelties />}
                />
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
                <Route
                  path="/impact/projects/:slug"
                  element={<ProjectDetail />}
                />
                <Route path="/ngo-application" element={<NGOApplication />} />
                <Route path="/community" element={<Community />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/campaigns" element={<Campaigns />} />
                <Route path="/social-demo" element={<SocialDemo />} />
                <Route path="/route-test" element={<RouteTest />} />
                <Route path="/tribe" element={<Tribe />} />
                <Route path="/tribe/heritage" element={<Heritage />} />
                <Route path="/tribe/ethics" element={<Ethics />} />
                <Route path="/tribe/team" element={<Team />} />
                <Route path="/tribe/standards" element={<Standards />} />
                <Route
                  path="/tribe/responsibility"
                  element={<Responsibility />}
                />
                <Route
                  path="/tribe/accountability"
                  element={<Accountability />}
                />
                <Route path="/tribe/transparency" element={<Transparency />} />
                <Route path="/tribe/compliance" element={<Compliance />} />
                <Route path="/tribe/terms" element={<Terms />} />
                <Route path="/transparency/terms" element={<Terms />} />
                <Route
                  path="/transparency/brand-protection"
                  element={<TransparencyBrandProtection />}
                />
                <Route
                  path="/accreditation/compliance"
                  element={<Compliance />}
                />
                <Route
                  path="/accreditation/leadership"
                  element={<AccreditationLeadership />}
                />
                <Route
                  path="/accreditation/ein"
                  element={<AccreditationEIN />}
                />
                <Route
                  path="/accreditation/anbi-status"
                  element={<AccreditationANBI />}
                />
                <Route
                  path="/accreditation/charity-rating"
                  element={<AccreditationCharityRating />}
                />
                <Route path="/tribe/privacy" element={<Privacy />} />
                <Route path="/tribe/cookies" element={<Cookies />} />
                <Route path="/transparency/privacy" element={<Privacy />} />
                <Route path="/transparency/cookies" element={<Cookies />} />
                <Route
                  path="/transparency/accessibility"
                  element={<LegalPages.Accessibility />}
                />
                <Route
                  path="/transparency/safety"
                  element={<TransparencySafety />}
                />

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
                <Route
                  path="/legal/partner-code-of-conduct"
                  element={<LegalPages.PartnerCodeOfConduct />}
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
                <Route
                  path="/spark/corporate-giving"
                  element={<CorporateGiving />}
                />
                <Route
                  path="/spark/honor-memorial"
                  element={<HonorMemorialGifts />}
                />
                <Route
                  path="/spark/all-ways-to-give"
                  element={<AllWaysToGive />}
                />
                <Route
                  path="/spark/monthly-giving"
                  element={<MonthlyGiving />}
                />
                <Route path="/spark/donate" element={<Donate />} />
                <Route path="/giving/corporate" element={<CorporateGiving />} />
                <Route
                  path="/giving/honor-memorial"
                  element={<HonorMemorialGifts />}
                />
                <Route path="/giving/ways-to-give" element={<AllWaysToGive />} />
                <Route path="/giving/monthly" element={<MonthlyGiving />} />
                <Route path="/giving/other-ways" element={<Donate />} />
                <Route path="/spark/donate/legacy" element={<DonateNew />} />
                <Route
                  path="/reports/financial-policies"
                  element={<FinancialPolicies />}
                />
                <Route
                  path="/reports/annual-reports"
                  element={<AnnualReports />}
                />
                <Route
                  path="/reports/in-kind-valuation"
                  element={<InKindValuation />}
                />
                <Route
                  path="/reports/donation-policies"
                  element={<DonationPolicies />}
                />
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
                <Route path="/information/contact" element={<Contact />} />
                <Route path="/information/organization" element={<Tribe />} />
                <Route path="/information/news" element={<Blog />} />
                <Route
                  path="/information/ngo-partners"
                  element={<InformationPartners />}
                />
                <Route path="/information/employment" element={<Enlist />} />
                <Route path="/information/press" element={<InformationPress />} />
                <Route path="/information/team" element={<Team />} />
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
                <Route
                  path="/dashboard/bottles"
                  element={<DashboardBottles />}
                />
                <Route path="/dashboard/vote" element={<DashboardVote />} />
                <Route
                  path="/dashboard/settings"
                  element={<DashboardSettings />}
                />
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
                <Route path="/events/:id" element={<EventDetail />} />

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
                  <Route
                    path="notifications"
                    element={<PartnerNotifications />}
                  />
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
            </Suspense>
          </ErrorBoundary>
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
              <CurrencyProvider>
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
              </CurrencyProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
