import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/useProducts";
import ProductGrid from "@/components/ProductGrid";
import { Coffee, ArrowRight } from "lucide-react";

export default function DazzleDrip() {
  const { products, loading } = useProducts("merch");

  // Filter for drinkware/accessories
  const drinkwareProducts = products.filter(
    (p) =>
      p.category?.toLowerCase().includes("drinkware") ||
      p.category?.toLowerCase().includes("bottle") ||
      p.category?.toLowerCase().includes("cup") ||
      p.name.toLowerCase().includes("bottle") ||
      p.name.toLowerCase().includes("cup"),
  );

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Dazzle Drip — RIG Store"
        description="Drinkware and accessories collection. Stay hydrated in style."
        canonical={
          typeof window !== "undefined"
            ? window.location.href
            : "/rig/dazzle-drip"
        }
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-background">
        <div className="container relative z-10">
          <div className="max-w-4xl">
            <Badge className="mb-4 text-xl font-black px-6 py-2 bg-blue-500 text-white">
              D — PAIDCONNECT
            </Badge>

            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                DAZZLE DRIP
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Drinkware and accessories that elevate every sip. Premium quality
              meets sustainable design. Stay hydrated, stay stylish.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link to="/rig">
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Explore Collections
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
              <Coffee className="w-8 h-8 mx-auto text-blue-500" />
              <h3 className="font-bold">Insulated Steel</h3>
              <p className="text-sm text-muted-foreground">
                24hr cold, 12hr hot retention
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold mx-auto text-blue-500">♻️</div>
              <h3 className="font-bold">Zero Plastic</h3>
              <p className="text-sm text-muted-foreground">
                100% recyclable materials
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold mx-auto text-blue-500">✓</div>
              <h3 className="font-bold">Lifetime Guarantee</h3>
              <p className="text-sm text-muted-foreground">
                Built to last, backed forever
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="border-t border-border">
        <div className="container py-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Drinkware & Accessories</h2>
            <p className="text-muted-foreground">
              Premium bottles, cups, and gear for hydration on the move.
            </p>
          </div>

          <ProductGrid category="merch" showTitle={false} />
        </div>
      </section>
    </div>
  );
}
