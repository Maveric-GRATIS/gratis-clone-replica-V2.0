import { useState } from "react";
import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import TheurgyFlavorGrid from "@/components/theurgy/TheurgyFlavorGrid";
import TheurgyPackSelector from "@/components/theurgy/TheurgyPackSelector";
import TheurgyImageGallery from "@/components/theurgy/TheurgyImageGallery";
import TheurgyB2BCTA from "@/components/theurgy/TheurgyB2BCTA";
import { GoldenTicketBanner } from "@/components/water/GoldenTicketBanner";
import ProductFeatures from "@/components/ProductFeatures";
import { theurgySparks } from "@/data/productFeatures";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { ShoppingCart, Sparkles, Shield, Truck, Award } from "lucide-react";

// Flavor data
const theurgyFlavors = [
  {
    id: "citrus-carnival",
    nameKey: "products.theurgy.flavors.citrusCarnival.name",
    subtitleKey: "products.theurgy.flavors.citrusCarnival.subtitle",
    descriptionKey: "products.theurgy.flavors.citrusCarnival.description",
    image: "/lovable-uploads/gratis-lifestyle-drink.jpg",
    color: "#FFA500",
    country: "Brazil",
  },
  {
    id: "hibiscus-bloom",
    nameKey: "products.theurgy.flavors.hibiscusBloom.name",
    subtitleKey: "products.theurgy.flavors.hibiscusBloom.subtitle",
    descriptionKey: "products.theurgy.flavors.hibiscusBloom.description",
    image: "/lovable-uploads/gratis-neon-tank.jpg",
    color: "#E91E63",
    country: "India",
  },
  {
    id: "dragon-fire",
    nameKey: "products.theurgy.flavors.dragonFire.name",
    subtitleKey: "products.theurgy.flavors.dragonFire.subtitle",
    descriptionKey: "products.theurgy.flavors.dragonFire.description",
    image: "/lovable-uploads/gratis-geo-bodysuit.jpg",
    color: "#FF5722",
    country: "China",
  },
  {
    id: "variety-pack",
    nameKey: "products.theurgy.flavors.varietyPack.name",
    subtitleKey: "products.theurgy.flavors.varietyPack.subtitle",
    descriptionKey: "products.theurgy.flavors.varietyPack.description",
    image: "/lovable-uploads/gratis-canal-collection.jpg",
    color: "#9C27B0",
    country: "Global",
  },
];

// Pack options
const theurgyPacks = [
  {
    value: "6",
    label: "6-Pack",
    price: 24.99,
    savings: 0,
    descriptionKey: "products.theurgy.packs.starter",
  },
  {
    value: "12",
    label: "12-Pack",
    price: 44.99,
    savings: 10,
    descriptionKey: "products.theurgy.packs.teamSize",
  },
  {
    value: "24",
    label: "24-Pack",
    price: 79.99,
    savings: 20,
    descriptionKey: "products.theurgy.packs.eventReady",
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
  const { t } = useTranslation();
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
    const flavorName = t(currentFlavor.nameKey);
    const cartItem = {
      id: `theurgy-${selectedFlavor}-${selectedPack}-${Date.now()}`,
      name: `GRATIS Theurgy - ${flavorName}`,
      price: currentPack.price,
      image: currentImages[0],
      category: "beverage" as const,
      variant: {
        flavor: flavorName,
        pack: `${selectedPack}-Pack`,
      },
      description: t(currentFlavor.descriptionKey),
    };

    addItem(cartItem);
    toast.success(`Added ${currentPack.label} of ${flavorName} to cart!`);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={t("products.theurgy.seoTitle")}
        description={t("products.theurgy.seoDescription")}
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
              {t("products.theurgy.badge")}
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4">
              {t("products.theurgy.title")}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {t("products.theurgy.hero")}
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
                productName={t(currentFlavor.nameKey)}
                flavorColor={currentFlavor.color}
              />
            </div>

            {/* Right: Product Details */}
            <div className="space-y-8">
              {/* Title & Badge */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/30">
                    {t("products.theurgy.seriesBadge")}
                  </span>
                  <span className="px-3 py-1 bg-accent/10 text-accent-foreground text-xs font-bold rounded-full">
                    {currentFlavor.country} {t("products.theurgy.edition")}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-foreground">
                  {t(currentFlavor.nameKey)}
                </h2>
                <p className="text-lg text-muted-foreground mt-2">
                  {t(currentFlavor.descriptionKey)}
                </p>
              </div>

              {/* Flavor Grid */}
              <TheurgyFlavorGrid
                flavors={theurgyFlavors.map((f) => ({
                  ...f,
                  name: t(f.nameKey),
                  subtitle: t(f.subtitleKey),
                  description: t(f.descriptionKey),
                }))}
                selected={selectedFlavor}
                onSelect={setSelectedFlavor}
              />

              {/* Pack Selector */}
              <TheurgyPackSelector
                packs={theurgyPacks.map((p) => ({
                  ...p,
                  description: t(p.descriptionKey),
                }))}
                selected={selectedPack}
                onSelect={setSelectedPack}
              />

              {/* Price & CTA */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("products.theurgy.totalPrice")}
                    </p>
                    <p className="text-4xl font-black text-foreground">
                      €{currentPack.price.toFixed(2)}
                    </p>
                    {currentPack.savings > 0 && (
                      <p className="text-sm text-green-500 font-medium">
                        {t("products.theurgy.youSave")} {currentPack.savings}%
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {t("products.theurgy.perCan")}
                    </p>
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
                  {t("products.theurgy.addToCart", { pack: currentPack.label })}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  {t("products.theurgy.goldenTicket")}
                </p>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-card rounded-xl border border-border">
                  <Shield className="w-6 h-6 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">
                    {t("products.theurgy.b2bVerified")}
                  </p>
                </div>
                <div className="text-center p-3 bg-card rounded-xl border border-border">
                  <Truck className="w-6 h-6 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">
                    {t("products.theurgy.directDelivery")}
                  </p>
                </div>
                <div className="text-center p-3 bg-card rounded-xl border border-border">
                  <Award className="w-6 h-6 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">
                    {t("products.theurgy.customBranding")}
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
            {t("products.theurgy.storiesTitle")}
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
                  {t(flavor.nameKey)}
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  {t(flavor.subtitleKey)}
                </p>
                <p className="text-gray-300 leading-relaxed">
                  {t(flavor.descriptionKey)}
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
