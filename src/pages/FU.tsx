import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ShoppingCart, Truck, Shield, Award } from "lucide-react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

import { FUFlavorGrid } from "@/components/fu/FUFlavorGrid";
import { FUEditionBadge } from "@/components/fu/FUEditionBadge";
import { FUImageGallery } from "@/components/fu/FUImageGallery";
import { FUCollabStories } from "@/components/fu/FUCollabStories";
import { FUImpactDecision } from "@/components/fu/FUImpactDecision";
import { FUCollectorShowcase } from "@/components/fu/FUCollectorShowcase";
import { FUSponsorCTA } from "@/components/fu/FUSponsorCTA";
import { FUGoldenTicketBanner } from "@/components/fu/FUGoldenTicketBanner";
import FUWinnersHallOfFame from "@/components/fu/FUWinnersHallOfFame";
import ProductFeatures from "@/components/ProductFeatures";
import { fuFeatures } from "@/data/productFeatures";

export default function FU() {
  const { t } = useTranslation();
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(
    "inferno",
  );
  const { addItem } = useCart();

  // F.U. Flavors Data with translations
  const fuFlavors = [
    {
      id: "inferno",
      name: t("products.fu.flavors.inferno.name"),
      subtitle: t("products.fu.flavors.inferno.subtitle"),
      seriesNumber: 1,
      editionSize: 500,
      remainingUnits: 342,
      price: 6.99,
      image: "/lovable-uploads/48ce1e2e-0cbc-49f2-b2d0-0a2d372b640d.png",
      description: t("products.fu.flavors.inferno.description"),
      collaborator: null,
      isWinnerCreation: false,
      impactProject: t("products.fu.flavors.inferno.project"),
    },
    {
      id: "ice-storm",
      name: t("products.fu.flavors.iceStorm.name"),
      subtitle: t("products.fu.flavors.iceStorm.subtitle"),
      seriesNumber: 2,
      editionSize: 500,
      remainingUnits: 500,
      price: 6.99,
      image: "/lovable-uploads/5fb80093-c88d-4f40-87ed-593974c38b11.png",
      description: t("products.fu.flavors.iceStorm.description"),
      collaborator: null,
      isWinnerCreation: false,
      impactProject: t("products.fu.flavors.iceStorm.project"),
    },
    {
      id: "rebel-drop",
      name: t("products.fu.flavors.rebelDrop.name"),
      subtitle: t("products.fu.flavors.rebelDrop.subtitle"),
      seriesNumber: 3,
      editionSize: 300,
      remainingUnits: 127,
      price: 9.99,
      image: "/lovable-uploads/9ac6ca6a-c33b-407e-ae9d-d71edd6d1a95.png",
      description: t("products.fu.flavors.rebelDrop.description"),
      collaborator: "Rebel Collective",
      isWinnerCreation: false,
      impactProject: t("products.fu.flavors.rebelDrop.project"),
    },
    {
      id: "winners-choice",
      name: t("products.fu.flavors.winnersChoice.name"),
      subtitle: t("products.fu.flavors.winnersChoice.subtitle"),
      seriesNumber: 4,
      editionSize: 100,
      remainingUnits: 100,
      price: 14.99,
      image: "/lovable-uploads/gratis-lifestyle-drink.jpg",
      description: t("products.fu.flavors.winnersChoice.description"),
      collaborator: null,
      isWinnerCreation: true,
      impactProject: t("products.fu.flavors.winnersChoice.project"),
    },
  ];

  // Flavor images mapping
  const flavorImages: Record<string, string[]> = {
    inferno: [
      "/lovable-uploads/48ce1e2e-0cbc-49f2-b2d0-0a2d372b640d.png",
      "/lovable-uploads/gratis-lifestyle-drink.jpg",
    ],
    "ice-storm": [
      "/lovable-uploads/5fb80093-c88d-4f40-87ed-593974c38b11.png",
      "/lovable-uploads/gratis-neon-tank.jpg",
    ],
    "rebel-drop": [
      "/lovable-uploads/9ac6ca6a-c33b-407e-ae9d-d71edd6d1a95.png",
      "/lovable-uploads/gratis-geo-bodysuit.jpg",
    ],
    "winners-choice": [
      "/lovable-uploads/gratis-lifestyle-drink.jpg",
      "/lovable-uploads/gratis-canal-collection.jpg",
    ],
  };

  const currentFlavor =
    fuFlavors.find((f) => f.id === selectedFlavor) || fuFlavors[0];
  const currentImages = selectedFlavor
    ? flavorImages[selectedFlavor] || [currentFlavor.image]
    : [fuFlavors[0].image];

  const handleAddToCart = () => {
    if (!selectedFlavor) {
      toast.error(t("products.fu.selectSeries"));
      return;
    }

    const flavor = fuFlavors.find((f) => f.id === selectedFlavor);
    if (!flavor) return;

    if (flavor.remainingUnits === 0) {
      toast.error(t("products.fu.seriesOut"));
      return;
    }

    const cartItem = {
      id: `fu-${flavor.id}-${Date.now()}`,
      name: `F.U. ${flavor.name}`,
      price: flavor.price,
      quantity: 1,
      image: flavor.image,
      category: "beverage" as const,
      variant: {
        flavor: flavor.name,
        series: `#${String(flavor.seriesNumber).padStart(2, "0")}`,
      },
    };

    addItem(cartItem);
    toast.success(t("products.fu.addedToCart", { name: flavor.name }), {
      description: `Series #${String(flavor.seriesNumber).padStart(2, "0")} • €${flavor.price}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={t("products.fu.seoTitle")}
        description={t("products.fu.seoDescription")}
        canonical="/fu"
      />

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 bg-gradient-to-b from-red-950/30 via-background to-background border-b border-border">
        <div className="container">
          <div className="text-center mb-8">
            <Badge variant="destructive" className="mb-4 font-black">
              {t("products.fu.badge")}
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black text-foreground mb-4">
              {t("products.fu.title")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("products.fu.hero")}
            </p>
          </div>
        </div>
      </section>

      {/* Product Detail Section */}
      <section className="py-12 md:py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Left: Image Gallery */}
            <FUImageGallery
              images={currentImages}
              productName={currentFlavor.name}
              seriesNumber={currentFlavor.seriesNumber}
              isWinnerCreation={currentFlavor.isWinnerCreation}
            />

            {/* Right: Product Details */}
            <div className="space-y-6">
              {/* Title & Description */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl md:text-4xl font-black text-foreground">
                    {currentFlavor.name}
                  </h2>
                  {currentFlavor.collaborator && (
                    <Badge
                      variant="secondary"
                      className="bg-purple-500 text-white"
                    >
                      × {currentFlavor.collaborator}
                    </Badge>
                  )}
                </div>
                <p className="text-lg text-muted-foreground">
                  {currentFlavor.description}
                </p>
              </div>

              {/* Features List */}
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  {t("products.fu.numbered")}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  {t("products.fu.uniqueArt")}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  {t("products.fu.profitsTo", {
                    project: currentFlavor.impactProject,
                  })}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  {t("products.fu.goldenCap")}
                </li>
              </ul>

              {/* Flavor Selector */}
              <FUFlavorGrid
                flavors={fuFlavors}
                selected={selectedFlavor}
                onSelect={setSelectedFlavor}
              />

              {/* Edition Badge */}
              <FUEditionBadge
                seriesNumber={currentFlavor.seriesNumber}
                editionSize={currentFlavor.editionSize}
                remainingUnits={currentFlavor.remainingUnits}
                collaborator={currentFlavor.collaborator}
                isWinnerCreation={currentFlavor.isWinnerCreation}
                impactProject={currentFlavor.impactProject}
              />

              {/* Price & Add to Cart */}
              <div className="flex items-center justify-between p-4 bg-card border border-border rounded-xl">
                <div>
                  <div className="text-3xl font-black text-foreground">
                    €{currentFlavor.price}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("products.fu.perBottle")}
                  </div>
                </div>
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={currentFlavor.remainingUnits === 0}
                  className="font-bold"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {currentFlavor.remainingUnits === 0
                    ? t("products.fu.soldOut")
                    : "Add to Cart"}
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="flex flex-col items-center text-center">
                  <Shield className="w-6 h-6 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">
                    {t("products.fu.authenticated")}
                  </span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Truck className="w-6 h-6 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">
                    {t("products.fu.insuredShipping")}
                  </span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Award className="w-6 h-6 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">
                    {t("products.fu.collectorGrade")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Golden Ticket Banner */}
      <FUGoldenTicketBanner />

      {/* Winners Hall of Fame */}
      <FUWinnersHallOfFame />

      {/* Collaboration Stories */}
      <FUCollabStories />

      {/* Decide the Impact */}
      <FUImpactDecision />

      {/* Collector's Showcase */}
      <FUCollectorShowcase />

      {/* Sponsor CTA */}
      <FUSponsorCTA />

      {/* Product Features */}
      <ProductFeatures
        features={fuFeatures}
        title={t("products.fu.featuresTitle")}
        subtitle={t("products.fu.featuresSubtitle")}
      />
    </div>
  );
}
