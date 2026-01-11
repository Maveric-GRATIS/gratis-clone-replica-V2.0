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
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
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
import Compliance from "@/pages/tribe/Compliance";
import Terms from "@/pages/tribe/Terms";
import Privacy from "@/pages/tribe/Privacy";
import Cookies from "@/pages/tribe/Cookies";
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
import HydrationStore from "./pages/HydrationStore";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Dashboard from "./pages/Dashboard";
import Wishlist from "./pages/Wishlist";
import Admin from "./pages/Admin";
import Partners from "./pages/Partners";
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
          defaultTheme="dark"
          enableSystem={false}
          storageKey="gratis-theme"
        >
          <AuthProvider>
            <CartProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <div className="max-w-full">
                    <ScrollProgressBar />
                    <OfflineIndicator />
                    <Header />
                    <Cart />
                    <FloatingCartButton />
                    <div className="overflow-x-hidden">
                      <PageTransition>
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/auth" element={<Auth />} />
                          <Route path="/rig-store" element={<RigStore />} />
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
                            path="/tribe/compliance"
                            element={<Compliance />}
                          />
                          <Route path="/tribe/terms" element={<Terms />} />
                          <Route path="/tribe/privacy" element={<Privacy />} />
                          <Route path="/tribe/cookies" element={<Cookies />} />
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
