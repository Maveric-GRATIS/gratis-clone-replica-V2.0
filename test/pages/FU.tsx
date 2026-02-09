import SEO from "@/components/SEO";
import ProductHero from "@/components/ProductHero";
import ProductGrid from "@/components/ProductGrid";
import ProductFeatures from "@/components/ProductFeatures";
import { fuFeatures } from "@/data/productFeatures";
import { useProducts } from "@/hooks/useProducts";
import { Badge } from "@/components/ui/badge";
import bgImage from "@/assets/streetwear-bg-3.jpg";

export default function FU() {
  const { products } = useProducts({ category: 'beverage', tier: 'ultra-limited' });

  // Convert database products to ProductHero format
  const fuProducts = products.map(p => ({
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
        title="F.U. Collection — Ultra Limited. Fearlessly Unconventional."
        description="Extreme flavors. Numbered editions. Brand collaborations. 100% profits fund clean water globally. €6.99-€9.99 per bottle."
        canonical={typeof window !== 'undefined' ? window.location.href : '/fu'}
      />

      <ProductHero
        title="ULTRA"
        subtitle="LIMITED"
        description="Fearlessly Unconventional. Numbered editions. Extreme flavors. Brand collabs you won't believe. 100% profits to NGOs."
        ctaText="Pre-Order Now"
        products={fuProducts}
        backgroundImage={bgImage}
      />

      <ProductGrid
        category="beverage"
        tier="ultra-limited"
        title="F.U. Series Collection"
        showTitle={true}
      />

      <ProductFeatures
        features={fuFeatures}
        title="Why F.U. is Different"
        subtitle="Not just limited. Ultra-limited. Not just flavors. Experiences. Every bottle is numbered, authenticated, and funds real impact."
      />

      {/* Series Showcase Section */}
      <section className="bg-gradient-to-br from-red-950/50 via-gray-900 to-black py-20 border-t border-gray-800">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-block bg-red-500/20 rounded-full px-6 py-2 mb-4">
              <span className="text-red-300 font-bold text-sm uppercase tracking-wider">
                🔥 Limited Series
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4">
              COLLECTOR'S EDITIONS
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Each F.U. series is released in batches of 300-1000 units. Once they're gone, they're gone forever.
              Every bottle is numbered and authenticated.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-red-700/50 rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300">
              <Badge variant="destructive" className="mb-4">Series #01</Badge>
              <h3 className="text-2xl font-black text-white mb-2">Inferno</h3>
              <p className="text-gray-400 mb-4">Spicy Lime • 500 Units</p>
              <div className="text-sm text-red-400 font-bold">Limited Edition</div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-blue-700/50 rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300">
              <Badge variant="secondary" className="mb-4 bg-blue-500">Series #02</Badge>
              <h3 className="text-2xl font-black text-white mb-2">Ice Storm</h3>
              <p className="text-gray-400 mb-4">Frozen Mint • 500 Units</p>
              <div className="text-sm text-blue-400 font-bold">Pre-Order</div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-700/50 rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300">
              <Badge variant="secondary" className="mb-4 bg-purple-500">Series #03</Badge>
              <h3 className="text-2xl font-black text-white mb-2">Collab Drop</h3>
              <p className="text-gray-400 mb-4">Mystery • 300 Units</p>
              <div className="text-sm text-purple-400 font-bold">Coming Soon</div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm italic">
              * Each series features unique artwork by international street artists
            </p>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="bg-black py-20 border-t border-gray-800">
        <div className="container text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
            EVERY F.U. COUNTS
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Premium products, premium impact. €6.99-€9.99 per bottle means more funding for clean water projects worldwide.
          </p>
          <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="text-5xl font-black text-primary">€25K+</div>
              <div className="text-white font-bold">Clean Water Projects Funded</div>
              <div className="text-gray-400">From F.U. sales alone</div>
            </div>
            <div className="space-y-4">
              <div className="text-5xl font-black text-primary">12</div>
              <div className="text-white font-bold">Artist Collaborations</div>
              <div className="text-gray-400">Supporting creative communities</div>
            </div>
            <div className="space-y-4">
              <div className="text-5xl font-black text-primary">3,000</div>
              <div className="text-white font-bold">Collectors Worldwide</div>
              <div className="text-gray-400">Building the F.U. tribe</div>
            </div>
          </div>

          {/* NGO Impact Banner */}
          <div className="mt-16 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-6 px-8 rounded-2xl max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                💧 100% PROFITS → NGOs
              </Badge>
              <p className="font-bold text-base md:text-lg">
                Every F.U. purchase directly funds clean water access for communities in need
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
