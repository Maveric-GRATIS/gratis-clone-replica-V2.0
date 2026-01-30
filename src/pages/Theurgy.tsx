import { useState } from "react";
import SEO from "@/components/SEO";
import TheurgyFlavorGrid from "@/components/theurgy/TheurgyFlavorGrid";
import TheurgyPackSelector from "@/components/theurgy/TheurgyPackSelector";
import TheurgyImageGallery from "@/components/theurgy/TheurgyImageGallery";
import TheurgyB2BCTA from "@/components/theurgy/TheurgyB2BCTA";
import { GoldenTicketBanner } from "@/components/water/GoldenTicketBanner";
import ProductFeatures, { theurgySparks } from "@/components/ProductFeatures";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { ShoppingCart, Sparkles, Shield, Truck, Award } from "lucide-react";

// Flavor data
const theurgyFlavors = [
  {
    id: "citrus-carnival",
    name: "Citrus Carnival",
    subtitle: "Brazil Edition",
    description:
      "Explosive citrus blend inspired by Rio's Carnival. Real Brazilian lime and sweet orange essences dance together like samba rhythms.",
    image: "/lovable-uploads/gratis-lifestyle-drink.jpg",
    color: "#FFA500",
    country: "Brazil",
  },
  {
    id: "hibiscus-bloom",
    name: "Hibiscus Bloom",
    subtitle: "India Edition",
    description:
      "A tribute to Diwali's festival of lights. Delicate hibiscus flowers and rose water create a floral symphony.",
    image: "/lovable-uploads/gratis-neon-tank.jpg",
    color: "#E91E63",
    country: "India",
  },
  {
    id: "dragon-fire",
    name: "Dragon Fire",
    subtitle: "China Edition",
    description:
      "Celebrates Lunar New Year with exotic dragonfruit and lychee. Luck and prosperity in every sip.",
    image: "/lovable-uploads/gratis-geo-bodysuit.jpg",
    color: "#FF5722",
    country: "China",
  },
  {
    id: "variety-pack",
    name: "Variety Pack",
    subtitle: "World Tour",
    description:
      "Experience all three cultural celebrations in one pack. The complete GRATIS Theurgy experience.",
    image: "/lovable-uploads/gratis-canal-collection.jpg",
    color: "#9C27B0",
    country: "Global",
  },
];

// Pack options (no singles - B2B minimum 6)
const theurgyPacks = [
  {
    value: "6",
    label: "6-Pack",
    price: 24.99,
    savings: 0,
    description: "Starter",
  },
  {
    value: "12",
    label: "12-Pack",
    price: 44.99,
    savings: 10,
    description: "Team Size",
  },
  {
    value: "24",
    label: "24-Pack",
    price: 79.99,
    savings: 20,
    description: "Event Ready",
  },
];

// Product images by flavor
const flavorImages: Record<string, string[]> = {
  "citrus-carnival": [
    "/lovable-uploads/gratis-lifestyle-drink.jpg",
    "/lovable-uploads/gratis-street-duo.jpg",
  ],
  "hibiscus-bloom": [
    "/lovable-uploads/gratis-neon-tank.jpg",
    "/lovable-uploads/gratis-squad-look.jpg",
  ],
  "dragon-fire": [
    "/lovable-uploads/gratis-geo-bodysuit.jpg",
    "/lovable-uploads/gratis-colorblock-squad.jpg",
  ],
  "variety-pack": [
    "/lovable-uploads/gratis-canal-collection.jpg",
    "/lovable-uploads/gratis-studio-crew.jpg",
  ],
};

export default function Theurgy() {
  const [selectedFlavor, setSelectedFlavor] =
    useState<string>("citrus-carnival");
  const [selectedPack, setSelectedPack] = useState<string>("6");
  const { addItem } = useCart();

  const currentFlavor =
    theurgyFlavors.find((f) => f.id === selectedFlavor) || theurgyFlavors[0];
  const currentPack =
    theurgyPacks.find((p) => p.value === selectedPack) || theurgyPacks[0];
  const currentImages =
    flavorImages[selectedFlavor] || flavorImages["citrus-carnival"];

  const handleAddToCart = () => {
    const cartItem = {
      id: `theurgy-${selectedFlavor}-${selectedPack}-${Date.now()}`,
      name: `GRATIS Theurgy - ${currentFlavor.name}`,
      price: currentPack.price,
      image: currentImages[0],
      category: "beverage" as const,
      variant: {
        flavor: currentFlavor.name,
        pack: `${selectedPack}-Pack`,
      },
      description: currentFlavor.description,
    };

    addItem(cartItem);
    toast.success(
      `Added ${currentPack.label} of ${currentFlavor.name} to cart!`,
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="GRATIS Theurgy — Limited Edition Flavored Sparkling"
        description="Premium flavored sparkling water for B2B partnerships. Citrus, Hibiscus, Dragonfruit - cultural celebrations in sustainable tetrapacks."
        canonical={
          typeof window !== "undefined" ? window.location.href : "/theurgy"
        }
      />

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-24 pb-8 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, ${currentFlavor.color}30 0%, transparent 50%)`,
            }}
          />
        </div>
        <div className="container relative z-10">
          <div className="text-center">
            <span className="inline-block px-4 py-1 bg-primary/20 text-primary text-sm font-bold rounded-full mb-4 animate-pulse">
              LIMITED EDITION • B2B EXCLUSIVE
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4">
              THEURGY
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Premium flavored sparkling rituals for hospitality, corporate
              wellness, and partnership programs.
            </p>
          </div>
        </div>
      </section>

      {/* Two-Column Product Section */}
      <section className="py-12 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: Image Gallery */}
            <div className="sticky top-24">
              <TheurgyImageGallery
                images={currentImages}
                productName={currentFlavor.name}
                flavorColor={currentFlavor.color}
              />
            </div>

            {/* Right: Product Details */}
            <div className="space-y-8">
              {/* Title & Badge */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/30">
                    100K SERIES
                  </span>
                  <span className="px-3 py-1 bg-accent/10 text-accent-foreground text-xs font-bold rounded-full">
                    {currentFlavor.country} EDITION
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-foreground">
                  {currentFlavor.name}
                </h2>
                <p className="text-lg text-muted-foreground mt-2">
                  {currentFlavor.description}
                </p>
              </div>

              {/* Flavor Grid */}
              <TheurgyFlavorGrid
                flavors={theurgyFlavors}
                selected={selectedFlavor}
                onSelect={setSelectedFlavor}
              />

              {/* Pack Selector */}
              <TheurgyPackSelector
                packs={theurgyPacks}
                selected={selectedPack}
                onSelect={setSelectedPack}
              />

              {/* Price & CTA */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Price</p>
                    <p className="text-4xl font-black text-foreground">
                      €{currentPack.price.toFixed(2)}
                    </p>
                    {currentPack.savings > 0 && (
                      <p className="text-sm text-green-500 font-medium">
                        You save {currentPack.savings}%
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Per can</p>
                    <p className="text-lg font-bold text-foreground">
                      €{(currentPack.price / parseInt(selectedPack)).toFixed(2)}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="w-full text-lg h-14 font-bold"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add {currentPack.label} to Cart
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  Golden Ticket prizes hidden in every production run
                </p>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-card rounded-xl border border-border">
                  <Shield className="w-6 h-6 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">B2B Verified</p>
                </div>
                <div className="text-center p-3 bg-card rounded-xl border border-border">
                  <Truck className="w-6 h-6 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">
                    Direct Delivery
                  </p>
                </div>
                <div className="text-center p-3 bg-card rounded-xl border border-border">
                  <Award className="w-6 h-6 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">
                    Custom Branding
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Golden Ticket Banner */}
      <GoldenTicketBanner />

      {/* Flavor Stories */}
      <section className="bg-gradient-to-br from-gray-900 to-black py-20">
        <div className="container">
          <h2 className="text-4xl md:text-6xl font-black text-white text-center mb-16">
            STORIES IN EVERY SIP
          </h2>

          <div className="grid lg:grid-cols-3 gap-12">
            {theurgyFlavors.slice(0, 3).map((flavor) => (
              <div
                key={flavor.id}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 hover:scale-105 transition-all duration-500"
                style={{ borderColor: `${flavor.color}30` }}
              >
                <div
                  className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center text-3xl"
                  style={{ backgroundColor: `${flavor.color}20` }}
                >
                  {flavor.country === "Brazil" && "🎭"}
                  {flavor.country === "India" && "🪔"}
                  {flavor.country === "China" && "🐉"}
                </div>
                <h3
                  className="text-2xl font-bold text-white mb-2"
                  style={{ color: flavor.color }}
                >
                  {flavor.name}
                </h3>
                <p className="text-sm text-gray-400 mb-4">{flavor.subtitle}</p>
                <p className="text-gray-300 leading-relaxed">
                  {flavor.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B2B Partnership CTA */}
      <TheurgyB2BCTA />

      {/* Product Features */}
      <ProductFeatures
        features={theurgySparks}
        title="Cultural Sparkling Water"
        subtitle="Real flavors inspired by real traditions. Every can supports art & music programs globally."
      />
    </div>
  );
}
