import { useState, useMemo } from 'react';
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/useProducts";
import { useDistributionLocations } from "@/hooks/useDistributionLocations";
import { useCart } from "@/contexts/CartContext";
import { FlavorSelector } from "@/components/water/FlavorSelector";
import { SizePackSelector } from "@/components/water/SizePackSelector";
import { SeriesBadge } from "@/components/water/SeriesBadge";
import { GoldenTicketBanner } from "@/components/water/GoldenTicketBanner";
import { WaterFeatures } from "@/components/water/WaterFeatures";
import { WaterTestimonials } from "@/components/water/WaterTestimonials";
import { EnvironmentalImpact } from "@/components/water/EnvironmentalImpact";
import { WaterImageGallery } from "@/components/water/WaterImageGallery";
import DistributionMap from "@/components/DistributionMap";
import { ShoppingCart, Truck, Shield, RotateCcw, Star } from 'lucide-react';
import { toast } from 'sonner';

// Flavor options with images
const flavors = [
  {
    id: 'still',
    name: 'W.A.T.E.R',
    subtitle: 'Pure Still',
    image: '/lovable-uploads/gratis-canal-collection.jpg',
    color: '#3B82F6',
  },
  {
    id: 'sparkling',
    name: 'THEURGY',
    subtitle: 'Sparkling',
    image: '/lovable-uploads/gratis-lifestyle-drink.jpg',
    color: '#8B5CF6',
  },
  {
    id: 'flavored',
    name: 'F.U.',
    subtitle: 'Flavored',
    image: '/lovable-uploads/gratis-neon-tank.jpg',
    color: '#EC4899',
  },
];

// Size options
const sizes = [
  { value: '500ml', label: '500mL' },
  { value: '750ml', label: '750mL' },
  { value: '1L', label: '1 Liter' },
];

// Pack options with price multipliers
const packs = [
  { value: '1', label: 'Single', price: 0 },
  { value: '6', label: '6-Pack', price: 4.99 },
  { value: '12', label: '12-Pack', price: 8.99 },
  { value: '24', label: '24-Pack', price: 14.99 },
];

export default function Water() {
  const { products } = useProducts('beverage');
  const { locations, loading: locationsLoading } = useDistributionLocations();
  const { addItem } = useCart();

  // Selection state
  const [selectedFlavor, setSelectedFlavor] = useState<string>('still');
  const [selectedSize, setSelectedSize] = useState<string>('500ml');
  const [selectedPack, setSelectedPack] = useState<string>('6');

  // Get featured water product for display
  const featuredProduct = useMemo(() => {
    const product = products.find(p => p.featured) || products[0];
    return product;
  }, [products]);

  // Calculate price based on selections
  const basePrice = featuredProduct ? Number(featuredProduct.price) : 2.99;
  const packMultiplier = parseInt(selectedPack) || 1;
  const packDiscount = selectedPack === '24' ? 0.85 : selectedPack === '12' ? 0.9 : selectedPack === '6' ? 0.95 : 1;
  const totalPrice = (basePrice * packMultiplier * packDiscount).toFixed(2);

  // Get images for gallery
  const productImages = useMemo(() => {
    if (!featuredProduct) return ['/placeholder.svg'];
    const images = [featuredProduct.image_url];
    if (featuredProduct.additional_images) {
      images.push(...featuredProduct.additional_images);
    }
    return images.filter(Boolean) as string[];
  }, [featuredProduct]);

  const handleAddToCart = () => {
    if (!featuredProduct) return;

    const flavorLabel = flavors.find(f => f.id === selectedFlavor)?.name || 'Still';
    
    addItem({
      id: `${featuredProduct.id}-${selectedFlavor}-${selectedSize}-${selectedPack}`,
      name: `${featuredProduct.name} - ${flavorLabel}`,
      price: parseFloat(totalPrice),
      image: featuredProduct.image_url || '',
      category: 'beverage',
      variant: {
        size: selectedSize,
        pack: `${selectedPack}-Pack`,
        flavor: flavorLabel,
      },
    });

    toast.success(`Added ${selectedPack}x ${flavorLabel} to cart!`);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="GRATIS Water — Pure Power, Pure Purpose" 
        description="Mountain-sourced water in sustainable tetrapacks. 100% natural, 0% artificial, infinitely recyclable." 
        canonical={typeof window !== 'undefined' ? window.location.href : '/water'} 
      />

      {/* Hero Product Section - Liquid Death Style */}
      <section className="py-12 md:py-20">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: Image Gallery */}
            <div className="order-2 lg:order-1">
              <WaterImageGallery 
                images={productImages}
                productName={featuredProduct?.name || 'GRATIS Water'}
              />
            </div>

            {/* Right: Product Details */}
            <div className="order-1 lg:order-2 space-y-6">
              {/* Badge & Title */}
              <div>
                <Badge variant="secondary" className="mb-3 bg-primary/20 text-primary border-primary/30">
                  100K SERIES
                </Badge>
                <h1 className="text-4xl font-black tracking-tight md:text-5xl lg:text-6xl">
                  GRATIS WATER
                </h1>
                <p className="mt-2 text-xl text-muted-foreground">
                  Mountain Spring • Tetrapack
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  4.9 ({featuredProduct?.reviews_count || 127} reviews)
                </span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                From pristine mountain springs to your hands — in 100% recyclable tetrapacks. 
                No plastic. No guilt. Just pure hydration that funds clean water access worldwide.
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
                label="Size"
                options={sizes}
                selected={selectedSize}
                onSelect={setSelectedSize}
              />

              {/* Pack Selector */}
              <SizePackSelector
                label="Pack"
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
                      Save {Math.round((1 - packDiscount) * 100)}%
                    </Badge>
                  )}
                </div>

                <Button 
                  size="lg" 
                  className="w-full text-lg h-14"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <Truck className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Free Shipping 50€+</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <RotateCcw className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">30-Day Returns</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Secure Checkout</span>
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

      {/* Environmental Impact */}
      <EnvironmentalImpact />

      {/* Testimonials */}
      <WaterTestimonials />

      {/* Free Distribution Map Section */}
      <section className="py-20 bg-gradient-to-br from-muted/50 via-background to-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
              📍 Find Free Water
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              DISTRIBUTION LOCATIONS
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We distribute free GRATIS water at major train stations during rush hours.
              Every bottle is advertiser-funded and 100% free to you.
            </p>
          </div>
          
          {!locationsLoading && locations.length > 0 && (
            <DistributionMap locations={locations} height="500px" />
          )}
          
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-card border rounded-xl p-6 text-center">
              <div className="text-4xl font-black text-primary mb-2">15+</div>
              <div className="font-bold mb-1">Distribution Locations</div>
              <div className="text-sm text-muted-foreground">Across Europe</div>
            </div>
            <div className="bg-card border rounded-xl p-6 text-center">
              <div className="text-4xl font-black text-primary mb-2">
                {locations.reduce((sum, loc) => sum + (loc.total_distributed || 0), 0).toLocaleString()}
              </div>
              <div className="font-bold mb-1">Bottles Distributed</div>
              <div className="text-sm text-muted-foreground">Since launch</div>
            </div>
            <div className="bg-card border rounded-xl p-6 text-center">
              <div className="text-4xl font-black text-primary mb-2">Rush Hours</div>
              <div className="font-bold mb-1">07:00-09:00 | 17:00-19:00</div>
              <div className="text-sm text-muted-foreground">Mon-Fri distribution times</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
