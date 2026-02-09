import SEO from "@/components/SEO";
import ProductHero from "@/components/ProductHero";
import ProductGrid from "@/components/ProductGrid";
import ProductFeatures from "@/components/ProductFeatures";
import { waterFeatures } from "@/data/productFeatures";
import DistributionMap from "@/components/DistributionMap";
import { useProducts } from "@/hooks/useProducts";
import { useDistributionLocations } from "@/hooks/useDistributionLocations";
import { Badge } from "@/components/ui/badge";
import bgImage from "@/assets/streetwear-bg-1.jpg";

export default function Water() {
  const { products } = useProducts('beverage');
  const { locations, loading: locationsLoading } = useDistributionLocations();

  // Convert database products to ProductHero format
  const waterProducts = products.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description || '',
    price: Number(p.price),
    originalPrice: p.original_price ? Number(p.original_price) : undefined,
    image: p.image_url || '',
    category: p.category as 'beverage' | 'merch',
    variant: { size: '500ml' }
  }));

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="GRATIS Water — Pure Power, Pure Purpose"
        description="Mountain-sourced water in sustainable tetrapacks. 100% natural, 0% artificial, infinitely recyclable."
        canonical={typeof window !== 'undefined' ? window.location.href : '/water'}
      />

      <ProductHero
        title="PURE"
        subtitle="POWER"
        description="From mountain springs to your hands — in 100% recyclable tetrapacks. No plastic. No guilt. Just pure hydration."
        ctaText="Drink with Purpose"
        products={waterProducts}
        backgroundImage={bgImage}
      />

      <ProductGrid
        category="beverage"
        title="Mountain Spring Collection"
        showTitle={true}
      />

      {/* Free Distribution Map Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-block bg-primary/20 rounded-full px-6 py-2 mb-4">
              <span className="text-primary font-bold text-sm uppercase tracking-wider">
                📍 Find Free Water
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4">
              DISTRIBUTION LOCATIONS
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              We distribute free GRATIS water at major train stations during rush hours.
              Every bottle is advertiser-funded and 100% free to you.
            </p>
          </div>

          {!locationsLoading && locations.length > 0 && (
            <DistributionMap locations={locations} height="500px" />
          )}

          <div className="grid md:grid-cols-3 gap-8 mt-12 text-center">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
              <div className="text-4xl font-black text-primary mb-2">15+</div>
              <div className="text-white font-bold mb-2">Distribution Locations</div>
              <div className="text-gray-400 text-sm">Across Europe</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
              <div className="text-4xl font-black text-primary mb-2">
                {locations.reduce((sum, loc) => sum + (loc.total_distributed || 0), 0).toLocaleString()}
              </div>
              <div className="text-white font-bold mb-2">Bottles Distributed</div>
              <div className="text-gray-400 text-sm">Since launch</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
              <div className="text-4xl font-black text-primary mb-2">Rush Hours</div>
              <div className="text-white font-bold mb-2">07:00-09:00 | 17:00-19:00</div>
              <div className="text-gray-400 text-sm">Mon-Fri distribution times</div>
            </div>
          </div>

          {/* Distribution Info Cards */}
          <div className="mt-12 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">🇳🇱 Netherlands Big 5</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Amsterdam Centraal - 45K+ bottles</li>
                <li>• Rotterdam Centraal - 32K+ bottles</li>
                <li>• Utrecht Centraal - 28K+ bottles</li>
                <li>• Den Haag Centraal - 21K+ bottles</li>
                <li>• Eindhoven Centraal - 18K+ bottles</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">🌍 European Hubs</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Paris Gare du Nord - 62K+ bottles</li>
                <li>• London King's Cross - 56K+ bottles</li>
                <li>• Berlin Hauptbahnhof - 41K+ bottles</li>
                <li>• München HBF - 38K+ bottles</li>
                <li>• Frankfurt HBF - 35K+ bottles</li>
              </ul>
            </div>
          </div>

          {/* NGO Banner */}
          <div className="mt-16 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-6 px-8 rounded-2xl max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                💧 100% ADVERTISER-FUNDED
              </Badge>
              <p className="font-bold text-base md:text-lg text-center">
                Every free bottle at these stations funds clean water access worldwide
              </p>
            </div>
          </div>
        </div>
      </section>

      <ProductFeatures
        features={waterFeatures}
        title="Why GRATIS Water?"
        subtitle="More than hydration — it's a movement towards a sustainable future."
      />

      {/* Impact Section */}
      <section className="bg-black py-20 border-t border-gray-800">
        <div className="container text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
            EVERY DROP COUNTS
          </h2>
          <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="text-5xl font-black text-primary">2.1M</div>
              <div className="text-white font-bold">Days of Clean Water Donated</div>
              <div className="text-gray-400">Since our launch in 2023</div>
            </div>
            <div className="space-y-4">
              <div className="text-5xl font-black text-primary">847K</div>
              <div className="text-white font-bold">Plastic Bottles Avoided</div>
              <div className="text-gray-400">Through tetrapack adoption</div>
            </div>
            <div className="space-y-4">
              <div className="text-5xl font-black text-primary">3.7M</div>
              <div className="text-white font-bold">Tons CO₂ Saved</div>
              <div className="text-gray-400">Compared to traditional packaging</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}