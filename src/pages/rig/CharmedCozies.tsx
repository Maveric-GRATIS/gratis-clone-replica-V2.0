import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/ProductGrid";
import { Wind, ArrowRight } from "lucide-react";

export default function CharmedCozies() {
  const { products, loading } = useProducts("merch");

  // Filter for hoodies/sweatshirts
  const hoodieProducts = products.filter(
    (p) =>
      p.category?.toLowerCase().includes("hoodie") ||
      p.category?.toLowerCase().includes("sweatshirt") ||
      p.name.toLowerCase().includes("hoodie") ||
      p.name.toLowerCase().includes("sweatshirt"),
  );

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Charmed Cozies — RIG Store"
        description="Sweatshirts and hoodies collection. Premium comfort meets street style."
        canonical={
          typeof window !== "undefined"
            ? window.location.href
            : "/rig/charmed-cozies"
        }
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-orange-500/20 via-red-500/10 to-background">
        <div className="container relative z-10">
          <div className="max-w-4xl">
            <Badge className="mb-4 text-xl font-black px-6 py-2 bg-orange-500 text-white">
              C — PAIDCONNECT
            </Badge>

            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                CHARMED COZIES
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Sweatshirts and hoodies that feel like a warm hug. Premium
              heavyweight fabrics, oversized fits, and designs that comfort
              without compromise.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link to="/rig">
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Shop All Collections
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
              <Wind className="w-8 h-8 mx-auto text-orange-500" />
              <h3 className="font-bold">Heavyweight Fleece</h3>
              <p className="text-sm text-muted-foreground">
                400gsm premium cotton blend
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold mx-auto text-orange-500">
                📏
              </div>
              <h3 className="font-bold">Oversized Fit</h3>
              <p className="text-sm text-muted-foreground">
                Relaxed, cozy silhouette
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold mx-auto text-orange-500">
                🧵
              </div>
              <h3 className="font-bold">Reinforced Stitching</h3>
              <p className="text-sm text-muted-foreground">
                Built to last seasons
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="border-t border-border">
        <div className="container py-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Hoodies & Sweatshirts</h2>
            <p className="text-muted-foreground">
              Maximum comfort, uncompromising style.
            </p>
          </div>

          <ProductGrid
            products={hoodieProducts}
            loading={loading}
            emptyMessage="No hoodies available right now. New drops coming soon!"
          />
        </div>
      </section>
    </div>
  );
}
