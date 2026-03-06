import { useState, useMemo, useEffect } from "react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/useProducts";
import { useDistributionLocations } from "@/hooks/useDistributionLocations";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { GoldenTicketBanner } from "@/components/water/GoldenTicketBanner";
import { WaterFeatures } from "@/components/water/WaterFeatures";
import { WaterTestimonials } from "@/components/water/WaterTestimonials";
import { EnvironmentalImpact } from "@/components/water/EnvironmentalImpact";
import { ClaimBottleCTA } from "@/components/water/ClaimBottleCTA";
import { ProductTabs } from "@/components/water/ProductTabs";
import { ProductFAQ } from "@/components/water/ProductFAQ";
import DistributionMap from "@/components/DistributionMap";
import TheurgyFlavorGrid from "@/components/theurgy/TheurgyFlavorGrid";
import TheurgyPackSelector from "@/components/theurgy/TheurgyPackSelector";
import TheurgyImageGallery from "@/components/theurgy/TheurgyImageGallery";
import { ShoppingCart, Truck, Award, Sparkles, Droplets } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

// Water variants
const waterVariants = [
  {
    id: "still",
    nameKey: "waterPage.variants.still.name",
    subtitleKey: "waterPage.variants.still.subtitle",
    descriptionKey: "waterPage.variants.still.description",
    image: "/lovable-uploads/gratis-canal-collection.jpg",
    color: "#3B82F6",
    country: "Pure",
  },
  {
    id: "mineral",
    nameKey: "waterPage.variants.mineral.name",
    subtitleKey: "waterPage.variants.mineral.subtitle",
    descriptionKey: "waterPage.variants.mineral.description",
    image: "/lovable-uploads/gratis-street-duo.jpg",
    color: "#06B6D4",
    country: "Mineral",
  },
  {
    id: "sparkling",
    nameKey: "waterPage.variants.sparkling.name",
    subtitleKey: "waterPage.variants.sparkling.subtitle",
    descriptionKey: "waterPage.variants.sparkling.description",
    image: "/lovable-uploads/gratis-lifestyle-drink.jpg",
    color: "#8B5CF6",
    country: "Sparkling",
  },
  {
    id: "spring",
    nameKey: "waterPage.variants.spring.name",
    subtitleKey: "waterPage.variants.spring.subtitle",
    descriptionKey: "waterPage.variants.spring.description",
    image: "/lovable-uploads/gratis-studio-crew.jpg",
    color: "#10B981",
    country: "Spring",
  },
];

// Pack options
const waterPacks = [
  { value: "6",  label: "6-Pack",  price: 11.94, savings: 0,  descriptionKey: "waterPage.packs.starter" },
  { value: "12", label: "12-Pack", price: 21.49, savings: 10, descriptionKey: "waterPage.packs.family"  },
  { value: "24", label: "24-Pack", price: 38.99, savings: 20, descriptionKey: "waterPage.packs.bulk"    },
];

// Gallery images per variant
const variantImages: Record<string, string[]> = {
  still:    ["/lovable-uploads/gratis-canal-collection.jpg", "/lovable-uploads/c51ea472-b223-4a6a-934c-74b38370615e.png"],
  mineral:  ["/lovable-uploads/gratis-street-duo.jpg",       "/lovable-uploads/gratis-squad-look.jpg"],
  sparkling:["/lovable-uploads/gratis-lifestyle-drink.jpg",  "/lovable-uploads/gratis-colorblock-squad.jpg"],
  spring:   ["/lovable-uploads/gratis-studio-crew.jpg",      "/lovable-uploads/gratis-geo-bodysuit.jpg"],
};

// Fallback texts if i18n keys are missing
const FALLBACKS: Record<string, Record<string, string>> = {
  still:    { name: "Still",    subtitle: "Pure & Clean",        description: "Puur bronwater zonder poespas. Helder, fris en toewijding aan kwaliteit." },
  mineral:  { name: "Mineral",  subtitle: "Natural Minerals",    description: "Verrijkt met essentiële mineralen voor optimale hydratatie." },
  sparkling:{ name: "Sparkling",subtitle: "Light Carbonation",   description: "Licht bruisend bronwater. De perfecte balans tussen stijl en frisheid." },
  spring:   { name: "Spring",   subtitle: "Mountain Source",     description: "Maagdelijk bergwater direct van de bron. Voor wie het beste verdient." },
};

export default function Water() {
  const { t } = useTranslation();
  const { products } = useProducts("beverage");
  const { locations, loading: locationsLoading } = useDistributionLocations();
  const { addItem } = useCart();
  const { user } = useAuth();

  const [selectedVariant, setSelectedVariant] = useState<string>("still");
  const [selectedPack, setSelectedPack] = useState<string>("6");
  const [userTribeData, setUserTribeData] = useState<{ tier: string; bottlesClaimed: number; bottlesLimit: number } | null>(null);

  useEffect(() => {
    if (!user) { setUserTribeData(null); return; }
    getDoc(doc(db, "users", user.uid)).then((snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setUserTribeData({ tier: d.tribeTier || "none", bottlesClaimed: d.bottlesClaimed || 0, bottlesLimit: d.bottlesLimit || 0 });
      }
    }).catch(console.error);
  }, [user]);

  const currentVariant = waterVariants.find((v) => v.id === selectedVariant) || waterVariants[0];
  const currentPack    = waterPacks.find((p) => p.value === selectedPack) || waterPacks[0];
  const currentImages  = variantImages[selectedVariant] || variantImages["still"];

  // Safe translate: falls back to hardcoded text when key is missing
  const tx = (key: string, id: string, field: "name" | "subtitle" | "description") => {
    const val = t(key);
    return val === key ? FALLBACKS[id]?.[field] ?? key : val;
  };

  const packLabels: Record<string, string> = {
    "waterPage.packs.starter": "Starter Pack",
    "waterPage.packs.family":  "Family Size",
    "waterPage.packs.bulk":    "Bulk Deal",
  };
  const tPack = (key: string) => { const v = t(key); return v === key ? (packLabels[key] ?? key) : v; };

  // Not used but kept so useProducts hook is not tree-shaken
  void useMemo(() => products.find((p) => p.featured) || products[0], [products]);

  const handleAddToCart = () => {
    const name = tx(currentVariant.nameKey, currentVariant.id, "name");
    addItem({
      id: `water-${selectedVariant}-${selectedPack}-${Date.now()}`,
      name: `GRATIS W.A.T.E.R - ${name}`,
      price: currentPack.price,
      image: currentImages[0],
      category: "beverage" as const,
      variant: { type: name, pack: `${selectedPack}-Pack` },
      description: tx(currentVariant.descriptionKey, currentVariant.id, "description"),
    });
    toast.success(`${currentPack.label} ${name} toegevoegd aan winkelwagen!`);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={t("waterPage.seoTitle", { defaultValue: "GRATIS W.A.T.E.R — Pure. Still. Free." })}
        description={t("waterPage.seoDescription", { defaultValue: "Premium bronwater in duurzame tetrapacks. Elke fles financiert gratis water voor iedereen." })}
        canonical={typeof window !== "undefined" ? window.location.href : "/water"}
      />

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-24 pb-8 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 20% 50%, ${currentVariant.color}30 0%, transparent 50%)` }} />
        </div>
        <div className="container relative z-10 text-center">
          <span className="inline-block px-4 py-1 bg-primary/20 text-primary text-sm font-bold rounded-full mb-4 animate-pulse">
            {t("waterPage.product.badge", { defaultValue: "100K NEDERLAND SERIE" })}
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4">W.A.T.E.R</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {t("waterPage.product.subtitle", { defaultValue: "Pure. Still. Vrij. Elke fles financiert toegang tot schoon water voor iedereen." })}
          </p>
        </div>
      </section>

      {/* Two-Column Product Section */}
      <section className="py-12 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-start">

            {/* Left: Sticky Image Gallery */}
            <div className="sticky top-24">
              <TheurgyImageGallery
                images={currentImages}
                productName={tx(currentVariant.nameKey, currentVariant.id, "name")}
                flavorColor={currentVariant.color}
              />
            </div>

            {/* Right: Product Details */}
            <div className="space-y-8">
              {/* Title & Badges */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/30">
                    100K SERIE
                  </span>
                  <span className="px-3 py-1 bg-accent/10 text-accent-foreground text-xs font-bold rounded-full">
                    {currentVariant.country} {t("waterPage.product.edition", { defaultValue: "EDITIE" })}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-foreground">
                  {tx(currentVariant.nameKey, currentVariant.id, "name")}
                </h2>
                <p className="text-lg text-muted-foreground mt-2">
                  {tx(currentVariant.descriptionKey, currentVariant.id, "description")}
                </p>
              </div>

              {/* Variant Selector */}
              <TheurgyFlavorGrid
                flavors={waterVariants.map((v) => ({
                  ...v,
                  name:        tx(v.nameKey,        v.id, "name"),
                  subtitle:    tx(v.subtitleKey,    v.id, "subtitle"),
                  description: tx(v.descriptionKey, v.id, "description"),
                }))}
                selected={selectedVariant}
                onSelect={setSelectedVariant}
              />

              {/* Pack Selector */}
              <TheurgyPackSelector
                packs={waterPacks.map((p) => ({ ...p, description: tPack(p.descriptionKey) }))}
                selected={selectedPack}
                onSelect={setSelectedPack}
              />

              {/* Price & CTA */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("waterPage.pricing.total", { defaultValue: "Totaalprijs" })}</p>
                    <p className="text-4xl font-black text-foreground">€{currentPack.price.toFixed(2)}</p>
                    {currentPack.savings > 0 && (
                      <p className="text-sm text-green-500 font-medium">
                        {t("waterPage.pricing.save", { defaultValue: "Je bespaart" })} {currentPack.savings}%
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{t("waterPage.pricing.perBottle", { defaultValue: "Per fles" })}</p>
                    <p className="text-lg font-bold text-foreground">
                      €{(currentPack.price / parseInt(selectedPack)).toFixed(2)}
                    </p>
                  </div>
                </div>

                <Button onClick={handleAddToCart} size="lg" className="w-full text-lg h-14 font-bold">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {t("waterPage.addToCart", { defaultValue: `Voeg ${currentPack.label} toe aan Winkelwagen` })}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  {t("waterPage.goldenTicket", { defaultValue: "Golden Ticket prijzen verborgen in elke productie run" })}
                </p>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-card rounded-xl border border-border">
                  <Droplets className="w-6 h-6 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">{t("waterPage.trustBadges.pure", { defaultValue: "100% Puur" })}</p>
                </div>
                <div className="text-center p-3 bg-card rounded-xl border border-border">
                  <Truck className="w-6 h-6 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">{t("waterPage.trustBadges.freeShipping", { defaultValue: "Gratis Verzending" })}</p>
                </div>
                <div className="text-center p-3 bg-card rounded-xl border border-border">
                  <Award className="w-6 h-6 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">{t("waterPage.trustBadges.impact", { defaultValue: "Impact Certified" })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Golden Ticket Banner */}
      <GoldenTicketBanner />

      {/* TRIBE Claim CTA */}
      <ClaimBottleCTA
        userBottlesClaimed={userTribeData?.bottlesClaimed}
        userBottlesLimit={userTribeData?.bottlesLimit}
        userTier={userTribeData?.tier}
      />

      {/* Impact Stories — dark section (same style as Theurgy) */}
      <section className="bg-gradient-to-br from-gray-900 to-black py-20">
        <div className="container">
          <h2 className="text-4xl md:text-6xl font-black text-white text-center mb-16">
            {t("waterPage.storiesTitle", { defaultValue: "WATER VERANDERT ALLES" })}
          </h2>
          <div className="grid lg:grid-cols-3 gap-12">
            {[
              { emoji: "💧", color: "#3B82F6", title: "Schoon Water", subtitle: "Voor Iedereen",  body: "Elke fles W.A.T.E.R die je koopt financiert directe toegang tot schoon drinkwater in ondervoorziene gemeenschappen." },
              { emoji: "♻️", color: "#10B981", title: "Zero Plastic",  subtitle: "100% Duurzaam", body: "Onze tetrapacks zijn volledig recyclebaar. Geen plastic oceaanvervuiling. Geen compromis op kwaliteit." },
              { emoji: "🌍", color: "#8B5CF6", title: "Globale Impact", subtitle: "Lokale Actie",  body: "15+ distributiepunten in Nederland. Elke golden ticket winnaar bepaalt mee waar de volgende waterput komt." },
            ].map((story) => (
              <div key={story.title}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 hover:scale-105 transition-all duration-500"
                style={{ borderColor: `${story.color}30` }}
              >
                <div className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center text-3xl" style={{ backgroundColor: `${story.color}20` }}>
                  {story.emoji}
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: story.color }}>{story.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{story.subtitle}</p>
                <p className="text-gray-300 leading-relaxed">{story.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Water Features */}
      <WaterFeatures />

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

      {/* FAQ */}
      <ProductFAQ />

      {/* Distribution Map */}
      <section className="py-20 bg-gradient-to-br from-muted/50 via-background to-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
              {t("waterPage.distributionSection.badge", { defaultValue: "GRATIS DISTRIBUTIE" })}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              {t("waterPage.distributionSection.title", { defaultValue: "Vind GRATIS Water Bij Jou Buurt" })}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t("waterPage.distributionSection.description", { defaultValue: "Haal gratis een fles op bij een van onze distributiepunten. Geen aankoop vereist." })}
            </p>
          </div>

          {!locationsLoading && locations.length > 0 && (
            <DistributionMap locations={locations} height="500px" />
          )}

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-card border rounded-xl p-6 text-center">
              <div className="text-4xl font-black text-primary mb-2">15+</div>
              <div className="font-bold mb-1">{t("waterPage.distributionSection.stats.locations", { defaultValue: "Distributiepunten" })}</div>
              <div className="text-sm text-muted-foreground">{t("waterPage.distributionSection.stats.locationsSubtitle", { defaultValue: "Door heel Nederland" })}</div>
            </div>
            <div className="bg-card border rounded-xl p-6 text-center">
              <div className="text-4xl font-black text-primary mb-2">
                {locations.reduce((s, l) => s + (l.total_distributed || 0), 0).toLocaleString() || "10K+"}
              </div>
              <div className="font-bold mb-1">{t("waterPage.distributionSection.stats.bottles", { defaultValue: "Flessen Uitgedeeld" })}</div>
              <div className="text-sm text-muted-foreground">{t("waterPage.distributionSection.stats.bottlesSubtitle", { defaultValue: "En groeit elke dag" })}</div>
            </div>
            <div className="bg-card border rounded-xl p-6 text-center">
              <div className="text-4xl font-black text-primary mb-2">{t("waterPage.distributionSection.stats.rushHours", { defaultValue: "11-14u" })}</div>
              <div className="font-bold mb-1">{t("waterPage.distributionSection.stats.rushHoursTime", { defaultValue: "Drukste Uren" })}</div>
              <div className="text-sm text-muted-foreground">{t("waterPage.distributionSection.stats.rushHoursSubtitle", { defaultValue: "Kom vroeg voor de beste plekken" })}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
