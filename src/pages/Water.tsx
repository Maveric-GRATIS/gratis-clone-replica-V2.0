import { useState, useMemo, useEffect } from "react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/useProducts";
import { useDistributionLocations } from "@/hooks/useDistributionLocations";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { FlavorSelector } from "@/components/water/FlavorSelector";
import { SizePackSelector } from "@/components/water/SizePackSelector";
import { SeriesBadge } from "@/components/water/SeriesBadge";
import { GoldenTicketBanner } from "@/components/water/GoldenTicketBanner";
import { WaterFeatures } from "@/components/water/WaterFeatures";
import { WaterTestimonials } from "@/components/water/WaterTestimonials";
import { EnvironmentalImpact } from "@/components/water/EnvironmentalImpact";
import { WaterImageGallery } from "@/components/water/WaterImageGallery";
import { ClaimBottleCTA } from "@/components/water/ClaimBottleCTA";
import { ProductTabs } from "@/components/water/ProductTabs";
import { ProductFAQ } from "@/components/water/ProductFAQ";
import DistributionMap from "@/components/DistributionMap";
import { ShoppingCart, Truck, Shield, RotateCcw, Star } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

// Flavor options with images (static data)
const flavorOptions = [
  {
    id: "still",
    name: "W.A.T.E.R",
    subtitleKey: "waterPage.flavors.still",
    image: "/lovable-uploads/gratis-canal-collection.jpg",
    color: "#3B82F6",
  },
  {
    id: "sparkling",
    name: "THEURGY",
    subtitleKey: "waterPage.flavors.sparkling",
    image: "/lovable-uploads/gratis-lifestyle-drink.jpg",
    color: "#8B5CF6",
  },
  {
    id: "flavored",
    name: "F.U.",
    subtitleKey: "waterPage.flavors.flavored",
    image: "/lovable-uploads/gratis-neon-tank.jpg",
    color: "#EC4899",
  },
];

export default function Water() {
  const { t } = useTranslation();
  const { products } = useProducts("beverage");
  const { locations, loading: locationsLoading } = useDistributionLocations();
  const { addItem } = useCart();
  const { user } = useAuth();

  // User TRIBE data
  const [userTribeData, setUserTribeData] = useState<{
    tier: string;
    bottlesClaimed: number;
    bottlesLimit: number;
  } | null>(null);

  // Fetch user TRIBE data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setUserTribeData(null);
        return;
      }

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserTribeData({
            tier: data.tribeTier || "none",
            bottlesClaimed: data.bottlesClaimed || 0,
            bottlesLimit: data.bottlesLimit || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user]);

  // Translated arrays
  const flavors = flavorOptions.map((f) => ({
    ...f,
    subtitle: t(f.subtitleKey),
  }));

  const sizes = [
    { value: "500ml", label: t("waterPage.sizes.500ml") },
    { value: "750ml", label: t("waterPage.sizes.750ml") },
    { value: "1L", label: t("waterPage.sizes.1L") },
  ];

  const packs = [
    { value: "1", label: t("waterPage.packs.single"), price: 0 },
    { value: "6", label: t("waterPage.packs.sixPack"), price: 4.99 },
    { value: "12", label: t("waterPage.packs.twelvePack"), price: 8.99 },
    { value: "24", label: t("waterPage.packs.twentyFourPack"), price: 14.99 },
  ];

  // Selection state
  const [selectedFlavor, setSelectedFlavor] = useState<string>("still");
  const [selectedSize, setSelectedSize] = useState<string>("500ml");
  const [selectedPack, setSelectedPack] = useState<string>("6");

  // Get featured water product for display - with fallback
  const featuredProduct = useMemo(() => {
    const product = products.find((p) => p.featured) || products[0];

    // Fallback product if Firestore has no products
    if (!product) {
      return {
        id: "water-default",
        name: "GRATIS Water",
        price: 2.99,
        image_url: "/lovable-uploads/c51ea472-b223-4a6a-934c-74b38370615e.png",
        category: "beverage",
        in_stock: true,
        featured: true,
      };
    }

    return product;
  }, [products]);

  // Calculate price based on selections
  const basePrice = featuredProduct ? Number(featuredProduct.price) : 2.99;
  const packMultiplier = parseInt(selectedPack) || 1;
  const packDiscount =
    selectedPack === "24"
      ? 0.85
      : selectedPack === "12"
        ? 0.9
        : selectedPack === "6"
          ? 0.95
          : 1;
  const totalPrice = (basePrice * packMultiplier * packDiscount).toFixed(2);

  // Get images for gallery
  const productImages = useMemo(() => {
    if (!featuredProduct) return ["/placeholder.svg"];
    const images = [featuredProduct.image_url];
    if (featuredProduct.additional_images) {
      images.push(...featuredProduct.additional_images);
    }
    return images.filter(Boolean) as string[];
  }, [featuredProduct]);

  const handleAddToCart = () => {
    if (!featuredProduct) {
      toast.error(t("waterPage.errors.notAvailable"));
      console.error("No featured product available");
      return;
    }

    const flavorLabel =
      flavors.find((f) => f.id === selectedFlavor)?.name || "Still";

    const cartItem = {
      id: `${featuredProduct.id}-${selectedFlavor}-${selectedSize}-${selectedPack}`,
      name: `${featuredProduct.name} - ${flavorLabel}`,
      price: parseFloat(totalPrice),
      image: featuredProduct.image_url || "",
      category: "beverage" as const,
      variant: {
        size: selectedSize,
        pack: `${selectedPack}-Pack`,
        flavor: flavorLabel,
      },
    };

    console.log("Adding to cart:", cartItem);

    try {
      addItem(cartItem);
      toast.success(
        `${t("common.success")} ${selectedPack}x ${flavorLabel} ${t("waterPage.success.addedToCart")}`,
      );
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(t("waterPage.errors.addToCartFailed"));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={t("waterPage.seoTitle")}
        description={t("waterPage.seoDescription")}
        canonical={
          typeof window !== "undefined" ? window.location.href : "/water"
        }
      />

      {/* Hero Product Section - Liquid Death Style */}
      <section className="py-12 md:py-20">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: Image Gallery */}
            <div className="order-2 lg:order-1">
              <WaterImageGallery
                images={productImages}
                productName={featuredProduct?.name || "GRATIS Water"}
              />
            </div>

            {/* Right: Product Details */}
            <div className="order-1 lg:order-2 space-y-6">
              {/* Badge & Title */}
              <div>
                <Badge
                  variant="secondary"
                  className="mb-3 bg-primary/20 text-primary border-primary/30"
                >
                  {t("waterPage.product.badge")}
                </Badge>
                <h1 className="text-4xl font-black tracking-tight md:text-5xl lg:text-6xl">
                  {t("waterPage.product.title")}
                </h1>
                <p className="mt-2 text-xl text-muted-foreground">
                  {t("waterPage.product.subtitle")}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-5 w-5 fill-yellow-500 text-yellow-500"
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  4.9 ({featuredProduct?.reviews_count || 127}{" "}
                  {t("waterPage.product.reviews")})
                </span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {t("waterPage.product.description")}
              </p>

              {/* Series Badge (Limited Edition) */}
              <SeriesBadge
                seriesName="100K Netherlands"
                seriesCountry="Netherlands"
                seriesMilestone={100000}
                partnershipBrand="Dutch Water Alliance"
              />

              {/* Flavor Selector */}
              <FlavorSelector
                flavors={flavors}
                selected={selectedFlavor}
                onSelect={setSelectedFlavor}
              />

              {/* Size Selector */}
              <SizePackSelector
                label={t("waterPage.sizes.label")}
                options={sizes}
                selected={selectedSize}
                onSelect={setSelectedSize}
              />

              {/* Pack Selector */}
              <SizePackSelector
                label={t("waterPage.packs.label")}
                options={packs}
                selected={selectedPack}
                onSelect={setSelectedPack}
              />

              {/* Price & Add to Cart */}
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black">€{totalPrice}</span>
                  {packMultiplier > 1 && (
                    <span className="text-sm text-muted-foreground line-through">
                      €{(basePrice * packMultiplier).toFixed(2)}
                    </span>
                  )}
                  {packMultiplier > 1 && (
                    <Badge variant="destructive" className="text-xs">
                      {t("waterPage.pricing.save")}{" "}
                      {Math.round((1 - packDiscount) * 100)}%
                    </Badge>
                  )}
                </div>

                <Button
                  size="lg"
                  className="w-full text-lg h-14"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {t("waterPage.addToCart")}
                </Button>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <Truck className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {t("waterPage.trustBadges.freeShipping")}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <RotateCcw className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {t("waterPage.trustBadges.returns")}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {t("waterPage.trustBadges.secure")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Features */}
              <WaterFeatures />
            </div>
          </div>
        </div>
      </section>

      {/* Golden Ticket Banner */}
      <section className="py-8">
        <div className="container">
          <GoldenTicketBanner />
        </div>
      </section>

      {/* TRIBE Member Claim Bottle CTA */}
      <ClaimBottleCTA
        userBottlesClaimed={userTribeData?.bottlesClaimed}
        userBottlesLimit={userTribeData?.bottlesLimit}
        userTier={userTribeData?.tier}
      />

      {/* Product Details Tabs */}
      <section className="py-20">
        <div className="container max-w-6xl">
          <ProductTabs />
        </div>
      </section>

      {/* Environmental Impact */}
      <EnvironmentalImpact />

      {/* Testimonials */}
      <WaterTestimonials />

      {/* FAQ Section */}
      <ProductFAQ />

      {/* Free Distribution Map Section */}
      <section className="py-20 bg-gradient-to-br from-muted/50 via-background to-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
              {t("waterPage.distributionSection.badge")}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              {t("waterPage.distributionSection.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t("waterPage.distributionSection.description")}
            </p>
          </div>

          {!locationsLoading && locations.length > 0 && (
            <DistributionMap locations={locations} height="500px" />
          )}

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-card border rounded-xl p-6 text-center">
              <div className="text-4xl font-black text-primary mb-2">15+</div>
              <div className="font-bold mb-1">
                {t("waterPage.distributionSection.stats.locations")}
              </div>
              <div className="text-sm text-muted-foreground">
                {t("waterPage.distributionSection.stats.locationsSubtitle")}
              </div>
            </div>
            <div className="bg-card border rounded-xl p-6 text-center">
              <div className="text-4xl font-black text-primary mb-2">
                {locations
                  .reduce((sum, loc) => sum + (loc.total_distributed || 0), 0)
                  .toLocaleString()}
              </div>
              <div className="font-bold mb-1">
                {t("waterPage.distributionSection.stats.bottles")}
              </div>
              <div className="text-sm text-muted-foreground">
                {t("waterPage.distributionSection.stats.bottlesSubtitle")}
              </div>
            </div>
            <div className="bg-card border rounded-xl p-6 text-center">
              <div className="text-4xl font-black text-primary mb-2">
                {t("waterPage.distributionSection.stats.rushHours")}
              </div>
              <div className="font-bold mb-1">
                {t("waterPage.distributionSection.stats.rushHoursTime")}
              </div>
              <div className="text-sm text-muted-foreground">
                {t("waterPage.distributionSection.stats.rushHoursSubtitle")}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
