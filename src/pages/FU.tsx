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

// F.U. Flavors Data
const fuFlavors = [
  {
    id: "inferno",
    nameKey: "products.carousel.fu.flavors.inferno.name",
    subtitleKey: "products.carousel.fu.flavors.inferno.subtitle",
    descriptionKey: "products.carousel.fu.flavors.inferno.description",
    projectKey: "products.carousel.fu.flavors.inferno.project",
    seriesNumber: 1,
    editionSize: 500,
    remainingUnits: 342,
    price: 6.99,
    image: "/lovable-uploads/48ce1e2e-0cbc-49f2-b2d0-0a2d372b640d.png",
    collaborator: null,
    isWinnerCreation: false,
  },
  {
    id: "ice-storm",
    nameKey: "products.carousel.fu.flavors.iceStorm.name",
    subtitleKey: "products.carousel.fu.flavors.iceStorm.subtitle",
    descriptionKey: "products.carousel.fu.flavors.iceStorm.description",
    projectKey: "products.carousel.fu.flavors.iceStorm.project",
    seriesNumber: 2,
    editionSize: 500,
    remainingUnits: 500,
    price: 6.99,
    image: "/lovable-uploads/5fb80093-c88d-4f40-87ed-593974c38b11.png",
    collaborator: null,
    isWinnerCreation: false,
  },
  {
    id: "rebel-drop",
    nameKey: "products.carousel.fu.flavors.rebelDrop.name",
    subtitleKey: "products.carousel.fu.flavors.rebelDrop.subtitle",
    descriptionKey: "products.carousel.fu.flavors.rebelDrop.description",
    projectKey: "products.carousel.fu.flavors.rebelDrop.project",
    seriesNumber: 3,
    editionSize: 300,
    remainingUnits: 127,
    price: 9.99,
    image: "/lovable-uploads/9ac6ca6a-c33b-407e-ae9d-d71edd6d1a95.png",
    collaborator: "Rebel Collective",
    isWinnerCreation: false,
  },
  {
    id: "winners-choice",
    nameKey: "products.carousel.fu.flavors.winnersChoice.name",
    subtitleKey: "products.carousel.fu.flavors.winnersChoice.subtitle",
    descriptionKey: "products.carousel.fu.flavors.winnersChoice.description",
    projectKey: "products.carousel.fu.flavors.winnersChoice.project",
    seriesNumber: 4,
    editionSize: 100,
    remainingUnits: 100,
    price: 14.99,
    image: "/lovable-uploads/gratis-lifestyle-drink.jpg",
    collaborator: null,
    isWinnerCreation: true,
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

export default function FU() {
  const { t } = useTranslation();
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(
    "inferno",
  );
  const { addItem } = useCart();

  const currentFlavor =
    fuFlavors.find((f) => f.id === selectedFlavor) || fuFlavors[0];
  const currentImages = selectedFlavor
    ? flavorImages[selectedFlavor] || [currentFlavor.image]
    : [fuFlavors[0].image];

  const handleAddToCart = () => {
    if (!selectedFlavor) {
      toast.error(t("products.carousel.fu.selectSeries"));
      return;
    }

    const flavor = fuFlavors.find((f) => f.id === selectedFlavor);
    if (!flavor) return;

    if (flavor.remainingUnits === 0) {
      toast.error(t("products.carousel.fu.seriesOut"));
      return;
    }

    const flavorName = t(flavor.nameKey);
    const cartItem = {
      id: `fu-${flavor.id}-${Date.now()}`,
      name: `F.U. ${flavorName}`,
      price: flavor.price,
      quantity: 1,
      image: flavor.image,
      category: "beverage" as const,
      variant: {
        flavor: flavorName,
        series: `#${String(flavor.seriesNumber).padStart(2, "0")}`,
      },
    };

    addItem(cartItem);
    toast.success(t("products.carousel.fu.addedToCart", { name: flavorName }), {
      description: `Series #${String(flavor.seriesNumber).padStart(2, "0")} • €${flavor.price}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={t("products.carousel.fu.seoTitle")}
        description={t("products.carousel.fu.seoDescription")}
        canonical="/fu"
      />

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 bg-gradient-to-b from-red-950/30 via-background to-background border-b border-border">
        <div className="container">
          <div className="text-center mb-8">
            <Badge variant="destructive" className="mb-4 font-black">
              {t("products.carousel.fu.badge")}
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black text-foreground mb-4">
              {t("products.carousel.fu.title")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("products.carousel.fu.hero")}
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
              productName={t(currentFlavor.nameKey)}
              seriesNumber={currentFlavor.seriesNumber}
              isWinnerCreation={currentFlavor.isWinnerCreation}
            />

            {/* Right: Product Details */}
            <div className="space-y-6">
              {/* Title & Description */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl md:text-4xl font-black text-foreground">
                    {t(currentFlavor.nameKey)}
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
                  {t(currentFlavor.descriptionKey)}
                </p>
              </div>

              {/* Features List */}
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  {t("products.carousel.fu.numbered")}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  {t("products.carousel.fu.uniqueArt")}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  {t("products.carousel.fu.profitsTo", {
                    project: t(currentFlavor.projectKey),
                  })}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  {t("products.carousel.fu.goldenCap")}
                </li>
              </ul>

              {/* Flavor Selector */}
              <FUFlavorGrid
                flavors={fuFlavors.map((f) => ({
                  ...f,
                  name: t(f.nameKey),
                  subtitle: t(f.subtitleKey),
                  description: t(f.descriptionKey),
                  impactProject: t(f.projectKey),
                }))}
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
                impactProject={t(currentFlavor.projectKey)}
              />

              {/* Price & Add to Cart */}
              <div className="flex items-center justify-between p-4 bg-card border border-border rounded-xl">
                <div>
                  <div className="text-3xl font-black text-foreground">
                    €{currentFlavor.price}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("products.carousel.fu.perBottle")}
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
                    ? t("products.carousel.fu.soldOut")
                    : "Add to Cart"}
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="flex flex-col items-center text-center">
                  <Shield className="w-6 h-6 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">
                    {t("products.carousel.fu.authenticated")}
                  </span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Truck className="w-6 h-6 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">
                    {t("products.carousel.fu.insuredShipping")}
                  </span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Award className="w-6 h-6 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">
                    {t("products.carousel.fu.collectorGrade")}
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
        title={t("products.carousel.fu.featuresTitle")}
        subtitle={t("products.carousel.fu.featuresSubtitle")}
      />
    </div>
  );
}
