import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/useProducts";
import ProductGrid from "@/components/ProductGrid";
import { Crown, ArrowRight } from "lucide-react";

export default function NexusNoggin() {
  const { products, loading } = useProducts("merch");

  // Filter for hats/headwear
  const hatProducts = products.filter(
    (p) =>
      p.category?.toLowerCase().includes("hat") ||
      p.category?.toLowerCase().includes("cap") ||
      p.category?.toLowerCase().includes("beanie") ||
      p.name.toLowerCase().includes("hat") ||
      p.name.toLowerCase().includes("cap"),
  );

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Nexus Noggin — RIG Store"
        description="Hats and headwear collection. Crown your style."
        canonical={
          typeof window !== "undefined"
            ? window.location.href
            : "/rig/nexus-noggin"
        }
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-yellow-500/20 via-amber-500/10 to-background">
        <div className="container relative z-10">
          <div className="max-w-4xl">
            <Badge className="mb-4 text-xl font-black px-6 py-2 bg-yellow-500 text-black">
              N — PAIDCONNECT
            </Badge>

            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent">
                NEXUS NOGGIN
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Hats and headwear that complete the fit. From snapbacks to
              beanies, bucket hats to dad caps— crown your look with GRATIS
              style.
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
              <Crown className="w-8 h-8 mx-auto text-yellow-500" />
              <h3 className="font-bold">Premium Fabrics</h3>
              <p className="text-sm text-muted-foreground">
                Cotton twill, wool blends, performance materials
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold mx-auto text-yellow-500">
                🧢
              </div>
              <h3 className="font-bold">Adjustable Fit</h3>
              <p className="text-sm text-muted-foreground">
                Snapbacks, strapbacks, stretchy beanies
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold mx-auto text-yellow-500">
                🎨
              </div>
              <h3 className="font-bold">Embroidered Details</h3>
              <p className="text-sm text-muted-foreground">
                High-quality stitching, lasting designs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="border-t border-border">
        <div className="container py-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Hats & Headwear</h2>
            <p className="text-muted-foreground">
              The finishing touch that makes the outfit.
            </p>
          </div>

          <ProductGrid category="merch" showTitle={false} />
        </div>
      </section>
    </div>
  );
}
