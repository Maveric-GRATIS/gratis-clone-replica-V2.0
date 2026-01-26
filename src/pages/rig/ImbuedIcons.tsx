import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/ProductGrid";
import { Shirt, ArrowRight } from "lucide-react";

export default function ImbuedIcons() {
  const { products, loading } = useProducts("merch");

  // Filter for tees/tops
  const teeProducts = products.filter(
    (p) =>
      p.category?.toLowerCase().includes("tee") ||
      p.category?.toLowerCase().includes("shirt") ||
      p.name.toLowerCase().includes("tee"),
  );

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Imbued Icons — RIG Store"
        description="Iconic graphic tees collection. Bold designs that tell your story."
        canonical={
          typeof window !== "undefined"
            ? window.location.href
            : "/rig/imbued-icons"
        }
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-background">
        <div className="container relative z-10">
          <div className="max-w-4xl">
            <Badge className="mb-4 text-xl font-black px-6 py-2 bg-purple-500 text-white">
              I — PAIDCONNECT
            </Badge>

            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                IMBUED ICONS
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Iconic graphic tees that speak volumes. Bold designs, premium
              fabrics, and statements that last. Wear your values, rock your
              style.
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

      {/* Features */}
      <section className="border-t border-border">
        <div className="container py-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <Shirt className="w-8 h-8 mx-auto text-purple-500" />
              <h3 className="font-bold">Premium Cotton</h3>
              <p className="text-sm text-muted-foreground">
                100% organic, sustainably sourced
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold mx-auto text-purple-500">
                ♻️
              </div>
              <h3 className="font-bold">Eco-Friendly Inks</h3>
              <p className="text-sm text-muted-foreground">
                Water-based, non-toxic printing
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold mx-auto text-purple-500">
                ✨
              </div>
              <h3 className="font-bold">Artist Collabs</h3>
              <p className="text-sm text-muted-foreground">
                Designs by global street artists
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="border-t border-border">
        <div className="container py-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Graphic Tees</h2>
            <p className="text-muted-foreground">
              Statement pieces that speak louder than words.
            </p>
          </div>

          <ProductGrid
            products={teeProducts}
            loading={loading}
            emptyMessage="No tees available right now. New designs dropping soon!"
          />
        </div>
      </section>
    </div>
  );
}
