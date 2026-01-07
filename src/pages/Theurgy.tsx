import SEO from "@/components/SEO";
import ProductHero from "@/components/ProductHero";
import ProductGrid from "@/components/ProductGrid";
import ProductFeatures, { theurgySparks } from "@/components/ProductFeatures";
import { useProducts } from "@/hooks/useProducts";
import bgImage from "@/assets/streetwear-bg-2.jpg";

export default function Theurgy() {
  const { products } = useProducts('beverage');
  
  // Convert database products to ProductHero format
  const theurgySparkling = products.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description || '',
    price: Number(p.price),
    originalPrice: p.original_price ? Number(p.original_price) : undefined,
    image: p.image_url || '',
    category: p.category as 'beverage' | 'merch',
    variant: { size: '500ml', flavor: p.name }
  }));

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="GRATIS Theurgy — Flavor That Moves Worlds" 
        description="Flavored sparkling rituals in sustainable tetrapacks. Real fruit, real culture, real impact." 
        canonical={typeof window !== 'undefined' ? window.location.href : '/theurgy'} 
      />

      <ProductHero
        title="FLAVOR"
        subtitle="RITUALS"
        description="Citrus. Hibiscus. Dragonfruit. Not just drinks — cultural celebrations in every sip."
        ctaText="Taste the Magic"
        products={theurgySparkling}
        backgroundImage={bgImage}
      />

      <ProductGrid
        category="beverage"
        title="Global Flavor Rituals"
        showTitle={true}
      />

      <ProductFeatures
        features={theurgySparks}
        title="Cultural Sparkling Water"
        subtitle="Real flavors inspired by real traditions. Every can supports art & music programs globally."
      />

      {/* Cultural Stories Section */}
      <section className="bg-gradient-to-br from-gray-900 to-black py-20">
        <div className="container">
          <h2 className="text-4xl md:text-6xl font-black text-white text-center mb-16">
            STORIES IN EVERY SIP
          </h2>
          
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 hover-scale transition-all duration-500">
              <div className="text-6xl mb-4">🎭</div>
              <h3 className="text-2xl font-bold text-primary mb-4">Citrus Carnival</h3>
              <p className="text-gray-300 leading-relaxed">
                Inspired by Brazil's Carnival, this explosive citrus blend captures the energy of Rio's streets. 
                Real Brazilian lime and sweet orange essences dance together like samba rhythms.
              </p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 hover-scale transition-all duration-500">
              <div className="text-6xl mb-4">🪔</div>
              <h3 className="text-2xl font-bold text-primary mb-4">Hibiscus Bloom</h3>
              <p className="text-gray-300 leading-relaxed">
                A tribute to Diwali's festival of lights. Delicate hibiscus flowers and rose water create 
                a floral symphony as beautiful as floating diyas on the Ganges.
              </p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 hover-scale transition-all duration-500">
              <div className="text-6xl mb-4">🐉</div>
              <h3 className="text-2xl font-bold text-primary mb-4">Dragon Fire</h3>
              <p className="text-gray-300 leading-relaxed">
                Celebrates Lunar New Year with exotic dragonfruit and lychee. Each sip brings the luck 
                and prosperity of a thousand paper lanterns lighting up the night sky.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}