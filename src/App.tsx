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
import * as LegalPages from "@/pages/legal";
import ImpactTV from "@/pages/ImpactTV";
import Nexus from "@/pages/impactTV/Nexus";
import Yarns from "@/pages/impactTV/Yarns";
import Unveil from "@/pages/impactTV/Unveil";
import Icon from "@/pages/impactTV/Icon";
import Tales from "@/pages/impactTV/Tales";
import Spark from "@/pages/Spark";
import Donate from "@/pages/spark/Donate";
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
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Dashboard from "./pages/Dashboard";
import DashboardBottles from "./pages/dashboard/Bottles";
import DashboardVote from "./pages/dashboard/Vote";
import DashboardSettings from "./pages/dashboard/Settings";
import Wishlist from "./pages/Wishlist";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import Partners from "./pages/Partners";
import CollectionDetail from "./pages/CollectionDetail";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { analytics } from "@/lib/analytics";
import { useEffect } from "react";
import { PageTransition } from "@/components/PageTransition";

const queryClient = new QueryClient();

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
                  <Routes>
                    {/* Admin Dashboard - Separate Layout (No Header/Footer) */}
                    <Route
                      path="/admin/dashboard"
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                  <div className="max-w-full">
                    <ScrollProgressBar />
                    <OfflineIndicator />
                    <CookieConsent />
                    <Header />
                    <Cart />
                    <FloatingCartButton />
                    <div className="overflow-x-hidden">
                      <PageTransition>
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/auth" element={<Auth />} />
                          <Route path="/rig" element={<RigStore />} />
                          <Route
                            path="/rig/prime-picks"
                            element={<PrimePicks />}
                          />
                          <Route
                            path="/rig/apex-arrivals"
                            element={<ApexArrivals />}
                          />
                          <Route
                            path="/rig/imbued-icons"
                            element={<ImbuedIcons />}
                          />
                          <Route
                            path="/rig/dazzle-drip"
                            element={<DazzleDrip />}
                          />
                          <Route
                            path="/rig/charmed-cozies"
                            element={<CharmedCozies />}
                          />
                          <Route
                            path="/rig/occult-originals"
                            element={<OccultOriginals />}
                          />
                          <Route
                            path="/rig/nexus-noggin"
                            element={<NexusNoggin />}
                          />
                          <Route
                            path="/rig/nebula-novelties"
                            element={<NebulaNovelties />}
                          />
                          <Route
                            path="/rig/collection/:slug"
                            element={<CollectionDetail />}
                          />
                          <Route
                            path="/rig/:slug"
                            element={<ProductDetail />}
                          />
                          {/* Legacy route redirect */}
                          <Route path="/rig-store" element={<RigStore />} />
                          <Route
                            path="/rig-store/collection/:slug"
                            element={<CollectionDetail />}
                          />
                          <Route
                            path="/rig-store/:slug"
                            element={<ProductDetail />}
                          />
                          <Route
                            path="/hydration"
                            element={<HydrationStore />}
                          />
                          <Route
                            path="/hydration/:slug"
                            element={<ProductDetail />}
                          />
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
                          <Route path="/tribe" element={<Tribe />} />
                          <Route
                            path="/tribe/heritage"
                            element={<Heritage />}
                          />
                          <Route path="/tribe/ethics" element={<Ethics />} />
                          <Route path="/tribe/team" element={<Team />} />
                          <Route
                            path="/tribe/standards"
                            element={<Standards />}
                          />
                          <Route
                            path="/tribe/responsibility"
                            element={<Responsibility />}
                          />
                          <Route
                            path="/tribe/accountability"
                            element={<Accountability />}
                          />
                          <Route
                            path="/tribe/transparency"
                            element={<Transparency />}
                          />
                          <Route
                            path="/tribe/compliance"
                            element={<Compliance />}
                          />
                          <Route path="/tribe/terms" element={<Terms />} />
                          <Route path="/tribe/privacy" element={<Privacy />} />
                          <Route path="/tribe/cookies" element={<Cookies />} />

                          {/* Legal Pages */}
                          <Route
                            path="/legal/privacy"
                            element={<LegalPages.Privacy />}
                          />
                          <Route
                            path="/legal/terms"
                            element={<LegalPages.Terms />}
                          />
                          <Route
                            path="/legal/cookies"
                            element={<LegalPages.Cookies />}
                          />
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
                          <Route
                            path="/impact-tv/unveil"
                            element={<Unveil />}
                          />
                          <Route path="/impact-tv/icon" element={<Icon />} />
                          <Route path="/impact-tv/tales" element={<Tales />} />
                          <Route path="/spark" element={<Spark />} />
                          <Route path="/spark/donate" element={<Donate />} />
                          <Route path="/spark/verve" element={<Verve />} />
                          <Route path="/spark/infuse" element={<Infuse />} />
                          <Route path="/spark/blaze" element={<Blaze />} />
                          <Route path="/spark/enlist" element={<Enlist />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/checkout" element={<Checkout />} />
                          <Route
                            path="/order-confirmation/:orderId"
                            element={<OrderConfirmation />}
                          />
                          <Route path="/orders" element={<Orders />} />
                          <Route
                            path="/orders/:orderId"
                            element={<OrderDetail />}
                          />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route
                            path="/dashboard/bottles"
                            element={<DashboardBottles />}
                          />
                          <Route
                            path="/dashboard/vote"
                            element={<DashboardVote />}
                          />
                          <Route
                            path="/dashboard/settings"
                            element={<DashboardSettings />}
                          />
                          <Route path="/wishlist" element={<Wishlist />} />

                          {/* Admin Routes - Single Unified Panel */}
                          <Route
                            path="/admin/*"
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
                    <Footer />
                  </div>
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
