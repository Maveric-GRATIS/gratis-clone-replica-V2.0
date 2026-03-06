import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/useProducts";
import ProductGrid from "@/components/ProductGrid";
import RigCollectionProducts from "@/components/rig/RigCollectionProducts";
import { Ruler, ArrowRight } from "lucide-react";

export default function OccultOriginals() {
  const { products, loading } = useProducts("merch");

  // Filter for bottoms (pants, shorts, joggers)
  const bottomsProducts = products.filter(
    (p) =>
      p.category?.toLowerCase().includes("bottom") ||
      p.category?.toLowerCase().includes("pant") ||
      p.category?.toLowerCase().includes("short") ||
      p.category?.toLowerCase().includes("jogger") ||
      p.name.toLowerCase().includes("pant") ||
      p.name.toLowerCase().includes("jogger"),
  );

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Occult Originals — RIG Store"
        description="Bottoms collection. Premium pants, joggers, and shorts."
        canonical={
          typeof window !== "undefined"
            ? window.location.href
            : "/rig/occult-originals"
        }
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-slate-500/20 via-gray-500/10 to-background">
        <div className="container relative z-10">
          <div className="max-w-4xl">
            <Badge className="mb-4 text-xl font-black px-6 py-2 bg-slate-500 text-white">
              O — PAIDCONNECT
            </Badge>

            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-slate-500 to-gray-500 bg-clip-text text-transparent">
                OCCULT ORIGINALS
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Bottoms collection with mysterious allure. Cargo pants, joggers,
              and shorts that blend function with street sophistication.
              Movement without limits.
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
              <Ruler className="w-8 h-8 mx-auto text-slate-500" />
              <h3 className="font-bold">Tailored Fit</h3>
              <p className="text-sm text-muted-foreground">
                Precision cuts, perfect drape
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold mx-auto text-slate-500">
                💼
              </div>
              <h3 className="font-bold">Utility Pockets</h3>
              <p className="text-sm text-muted-foreground">
                Function meets fashion
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold mx-auto text-slate-500">
                🏃
              </div>
              <h3 className="font-bold">4-Way Stretch</h3>
              <p className="text-sm text-muted-foreground">
                Unrestricted movement
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="border-t border-border">
        <div className="container py-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Pants, Joggers & Shorts</h2>
            <p className="text-muted-foreground">
              Bottoms that move with you, styled for the streets.
            </p>
          </div>

          <RigCollectionProducts collectionId="occult_originals" />
        </div>
      </section>
    </div>
  );
}
