import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/useProducts";
import ProductGrid from "@/components/ProductGrid";
import { Star, TrendingUp, ArrowRight } from "lucide-react";

export default function PrimePicks() {
  const { products, loading } = useProducts("merch");

  // Get best-selling/featured products
  const primeProducts = products.filter((p) => p.featured).slice(0, 12);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Prime Picks — RIG Store"
        description="Best sellers and fan favorites. The most-loved pieces from GRATIS RIG."
        canonical={
          typeof window !== "undefined"
            ? window.location.href
            : "/rig/prime-picks"
        }
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-background">
        <div className="container relative z-10">
          <div className="max-w-4xl">
            <Badge className="mb-4 text-xl font-black px-6 py-2 bg-amber-500 text-black">
              P — PAIDCONNECT
            </Badge>

            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                PRIME PICKS
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Best sellers and fan favorites. The pieces that define GRATIS
              RIG—proven quality, unmatched style, and the trust of thousands of
              customers worldwide.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link to="/rig">
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Shop All RIG
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-border">
        <div className="container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <div className="text-3xl font-bold">4.8</div>
              </div>
              <div className="text-sm text-muted-foreground">
                Average Rating
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-amber-500" />
                <div className="text-3xl font-bold">12K+</div>
              </div>
              <div className="text-sm text-muted-foreground">Units Sold</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">94%</div>
              <div className="text-sm text-muted-foreground">Repeat Buyers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">2.3K</div>
              <div className="text-sm text-muted-foreground">
                5-Star Reviews
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="border-t border-border">
        <div className="container py-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Most Popular Items</h2>
            <p className="text-muted-foreground">
              Handpicked by our community. These are the pieces that keep
              selling out.
            </p>
          </div>

          <ProductGrid category="merch" featured={true} showTitle={false} />
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="border-t border-border bg-muted/30">
        <div className="container py-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              Why Trust Prime Picks?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              These aren't just our favorites—they're customer-validated
              bestsellers. Real people, real purchases, real reviews. Every item
              in Prime Picks has earned its spot through consistent quality,
              style, and community love.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
