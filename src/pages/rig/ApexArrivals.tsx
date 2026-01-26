import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/ProductGrid";
import { Zap, Calendar, ArrowRight } from "lucide-react";

export default function ApexArrivals() {
  const { products, loading } = useProducts("merch");

  // Get newest products (simulated - in real app would filter by created_at)
  const newProducts = products.slice(0, 12);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Apex Arrivals — RIG Store"
        description="Newest drops and latest releases. Fresh GRATIS RIG pieces just landed."
        canonical={
          typeof window !== "undefined"
            ? window.location.href
            : "/rig/apex-arrivals"
        }
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-background">
        <div className="container relative z-10">
          <div className="max-w-4xl">
            <Badge className="mb-4 text-xl font-black px-6 py-2 bg-cyan-500 text-black">
              A — PAIDCONNECT
            </Badge>

            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                APEX ARRIVALS
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Newest drops and latest releases. Be first to rock the freshest
              GRATIS RIG pieces. Limited quantities, maximum style.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link to="/rig">
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Explore All Collections
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* New This Week Banner */}
      <section className="border-t border-border bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
        <div className="container py-8">
          <div className="flex items-center justify-center gap-4">
            <Zap className="w-6 h-6 text-cyan-500" />
            <div className="text-center">
              <div className="text-sm font-semibold text-muted-foreground">
                NEW THIS WEEK
              </div>
              <div className="text-2xl font-bold">
                8 Fresh Drops Just Landed
              </div>
            </div>
            <Calendar className="w-6 h-6 text-cyan-500" />
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="border-t border-border">
        <div className="container py-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Latest Releases</h2>
            <p className="text-muted-foreground">
              Hot off the press. Get them before they sell out.
            </p>
          </div>

          <ProductGrid
            products={newProducts}
            loading={loading}
            emptyMessage="No new arrivals at the moment. Check back soon for fresh drops!"
          />
        </div>
      </section>

      {/* Release Schedule Teaser */}
      <section className="border-t border-border bg-muted/30">
        <div className="container py-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              Never Miss a Drop
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              New releases every Thursday at 12:00 CET. Join TRIBE Insider
              membership for early access 48 hours before public launch.
            </p>
            <Button size="lg" variant="outline" asChild>
              <Link to="/legal/terms">Learn About TRIBE Membership →</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
