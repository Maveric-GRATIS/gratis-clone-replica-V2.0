import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/ProductGrid";
import { Sparkles, ArrowRight } from "lucide-react";

export default function NebulaNovelties() {
  const { products, loading } = useProducts("merch");

  // Filter for accessories/lifestyle items
  const accessoryProducts = products.filter(
    (p) =>
      p.category?.toLowerCase().includes("accessory") ||
      p.category?.toLowerCase().includes("lifestyle") ||
      p.category?.toLowerCase().includes("bag") ||
      p.category?.toLowerCase().includes("sock") ||
      p.name.toLowerCase().includes("bag") ||
      p.name.toLowerCase().includes("sock"),
  );

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Nebula Novelties — RIG Store"
        description="Lifestyle and accessories collection. The details that make the difference."
        canonical={
          typeof window !== "undefined"
            ? window.location.href
            : "/rig/nebula-novelties"
        }
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-indigo-500/20 via-violet-500/10 to-background">
        <div className="container relative z-10">
          <div className="max-w-4xl">
            <Badge className="mb-4 text-xl font-black px-6 py-2 bg-indigo-500 text-white">
              N — PAIDCONNECT
            </Badge>

            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                NEBULA NOVELTIES
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Lifestyle and accessories that elevate every detail. Bags, socks,
              stickers, pins, and the small touches that complete your GRATIS
              aesthetic.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link to="/rig">
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Explore All RIG
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
              <Sparkles className="w-8 h-8 mx-auto text-indigo-500" />
              <h3 className="font-bold">Unique Designs</h3>
              <p className="text-sm text-muted-foreground">
                One-of-a-kind pieces you won't find elsewhere
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold mx-auto text-indigo-500">
                🎁
              </div>
              <h3 className="font-bold">Perfect Gifts</h3>
              <p className="text-sm text-muted-foreground">
                Affordable luxuries for everyone
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold mx-auto text-indigo-500">
                ✨
              </div>
              <h3 className="font-bold">Limited Editions</h3>
              <p className="text-sm text-muted-foreground">
                Collectible drops, exclusive collabs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="border-t border-border">
        <div className="container py-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Accessories & Lifestyle</h2>
            <p className="text-muted-foreground">
              The finishing touches that make all the difference.
            </p>
          </div>

          <ProductGrid
            products={accessoryProducts}
            loading={loading}
            emptyMessage="No accessories available right now. Check back for new drops!"
          />
        </div>
      </section>
    </div>
  );
}
