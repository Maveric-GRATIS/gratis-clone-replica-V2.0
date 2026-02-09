import { useState } from "react";
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
    name: "INFERNO",
    subtitle: "Spicy Lime",
    seriesNumber: 1,
    editionSize: 500,
    remainingUnits: 342,
    price: 6.99,
    image: "/lovable-uploads/48ce1e2e-0cbc-49f2-b2d0-0a2d372b640d.png",
    description:
      "Ghost pepper meets lime. Not for the faint of heart. An explosive combination that sets your taste buds on fire while the citrus cools you down.",
    collaborator: null,
    isWinnerCreation: false,
    impactProject: "Clean Water Initiative",
  },
  {
    id: "ice-storm",
    name: "ICE STORM",
    subtitle: "Frozen Mint",
    seriesNumber: 2,
    editionSize: 500,
    remainingUnits: 500,
    price: 6.99,
    image: "/lovable-uploads/5fb80093-c88d-4f40-87ed-593974c38b11.png",
    description:
      "Cryogenic mint extraction. So cold it burns. A polar vortex in every sip that will leave you breathless.",
    collaborator: null,
    isWinnerCreation: false,
    impactProject: "Youth Education",
  },
  {
    id: "rebel-drop",
    name: "REBEL DROP",
    subtitle: "Mystery Blend",
    seriesNumber: 3,
    editionSize: 300,
    remainingUnits: 127,
    price: 9.99,
    image: "/lovable-uploads/9ac6ca6a-c33b-407e-ae9d-d71edd6d1a95.png",
    description:
      "Taste the mystery. Blind taste challenge accepted. Created with Rebel Collective for those who dare to drink differently.",
    collaborator: "Rebel Collective",
    isWinnerCreation: false,
    impactProject: "Street Art Programs",
  },
  {
    id: "winners-choice",
    name: "WINNER'S CHOICE",
    subtitle: "Community Creation",
    seriesNumber: 4,
    editionSize: 100,
    remainingUnits: 100,
    price: 14.99,
    image: "/lovable-uploads/gratis-lifestyle-drink.jpg",
    description:
      "Created by our Golden Ticket winner. Ultimate rarity. The most exclusive F.U. ever made - only 100 in existence.",
    collaborator: null,
    isWinnerCreation: true,
    impactProject: "Winner Decides",
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
      toast.error("Please select a series first");
      return;
    }

    const flavor = fuFlavors.find((f) => f.id === selectedFlavor);
    if (!flavor) return;

    if (flavor.remainingUnits === 0) {
      toast.error("This series is sold out");
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
    toast.success(`${flavor.name} added to cart!`, {
      description: `Series #${String(flavor.seriesNumber).padStart(2, "0")} • €${flavor.price}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="F.U. Collection — Ultra Limited. Fearlessly Unconventional."
        description="Collector's edition sparkling water with extreme flavors. Numbered editions created with Golden Ticket winners and sponsors. 100% profits to chosen causes."
        canonical="/fu"
      />

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 bg-gradient-to-b from-red-950/30 via-background to-background border-b border-border">
        <div className="container">
          <div className="text-center mb-8">
            <Badge variant="destructive" className="mb-4 font-black">
              ULTRA LIMITED COLLECTOR'S SERIES
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black text-foreground mb-4">
              F.U.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Fearlessly Unconventional. One-of-a-kind taste collaborations with
              Golden Ticket winners and major sponsors.
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
                  Numbered & authenticated collector's edition
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  Unique artwork by international artists
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  100% profits to {currentFlavor.impactProject}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  Golden Cap hunt included in every series
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
                    per bottle
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
                    ? "Sold Out"
                    : "Add to Cart"}
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="flex flex-col items-center text-center">
                  <Shield className="w-6 h-6 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">
                    Authenticated
                  </span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Truck className="w-6 h-6 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">
                    Insured Shipping
                  </span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Award className="w-6 h-6 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">
                    Collector Grade
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
        title="Why F.U. is Different"
        subtitle="Not just limited. Ultra-limited. Not just flavors. Experiences. Every bottle is numbered, authenticated, and funds real impact."
      />
    </div>
  );
}
