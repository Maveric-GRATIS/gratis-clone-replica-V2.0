import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartActions } from '@/hooks/useCartActions';
import { useProducts } from '@/hooks/useProducts';
import { ShoppingBag, Filter, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatEuro } from '@/lib/currency';

// GRATIS streetwear merchandise categories
const merchCategories = [
  'SHOP ALL', 'BEST SELLERS', 'NEW DROPS', 'DRINKWARE', 
  'TANKS + TOPS', 'HOODIES + TRACKSUITS', 'SWIMWEAR', 
  'BOTTOMS', 'CAPS + BEANIES', 'LIFESTYLE', 'COLLABS'
];

export default function RigStore() {
  const [selectedCategory, setSelectedCategory] = useState('SHOP ALL');
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const { addToCart } = useCartActions();
  const { products, loading, error } = useProducts('merch');

  // Filter products based on selected category
  const filteredProducts = React.useMemo(() => {
    if (selectedCategory === 'SHOP ALL') {
      return products;
    }
    
    // Map category names to badge values or other filters
    const categoryMap: Record<string, (product: any) => boolean> = {
      'BEST SELLERS': (p) => p.badge === 'BESTSELLER',
      'NEW DROPS': (p) => p.badge === 'NEW DROP',
      'DRINKWARE': (p) => p.subcategory === 'DRINKWARE' || p.name.toLowerCase().includes('bottle') || p.name.toLowerCase().includes('cup'),
      'TANKS + TOPS': (p) => p.subcategory === 'TANKS + TOPS' || p.name.toLowerCase().includes('tank'),
      'HOODIES + TRACKSUITS': (p) => p.subcategory === 'HOODIES + TRACKSUITS' || p.name.toLowerCase().includes('hoodie') || p.name.toLowerCase().includes('tracksuit'),
      'SWIMWEAR': (p) => p.subcategory === 'SWIMWEAR' || p.name.toLowerCase().includes('swim'),
      'BOTTOMS': (p) => p.subcategory === 'BOTTOMS' || p.name.toLowerCase().includes('short') || p.name.toLowerCase().includes('pant'),
      'CAPS + BEANIES': (p) => p.subcategory === 'CAPS + BEANIES' || p.name.toLowerCase().includes('cap') || p.name.toLowerCase().includes('hat') || p.name.toLowerCase().includes('beanie'),
      'LIFESTYLE': (p) => p.badge === 'LIFESTYLE' || p.subcategory === 'LIFESTYLE',
      'COLLABS': (p) => p.badge === 'COLLAB' || p.subcategory === 'COLLABS',
    };

    const filterFn = categoryMap[selectedCategory];
    return filterFn ? products.filter(filterFn) : products;
  }, [products, selectedCategory]);

  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case 'BESTSELLER': return 'default';
      case 'NEW DROP': return 'secondary';
      case 'LIMITED': return 'destructive';
      case 'SALE': return 'outline';
      case 'ECO': return 'secondary';
      case 'CREW PACK': return 'default';
      case 'RETRO': return 'secondary';
      case 'LOCATION': return 'outline';
      case 'PREMIUM': return 'default';
      case 'SUMMER': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 to-black py-20">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-primary/20 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-accent/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="container relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
              GRATIS <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">STORE</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Bold streetwear. Vibrant energy. Premium quality that makes a statement.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold">
                FREE SHIPPING ON €100+
              </Badge>
              <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold">
                30-DAY RETURNS
              </Badge>
              <Badge className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold">
                PREMIUM STREETWEAR
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 sticky top-[72px] z-50">
        <div className="container py-4">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
            <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
            {merchCategories.map((category) => {
              const count = category === 'SHOP ALL' 
                ? products.length 
                : products.filter((p) => {
                    const categoryMap: Record<string, (product: any) => boolean> = {
                      'BEST SELLERS': (p) => p.badge === 'BESTSELLER',
                      'NEW DROPS': (p) => p.badge === 'NEW DROP',
                      'DRINKWARE': (p) => p.subcategory === 'DRINKWARE' || p.name.toLowerCase().includes('bottle') || p.name.toLowerCase().includes('cup'),
                      'TANKS + TOPS': (p) => p.subcategory === 'TANKS + TOPS' || p.name.toLowerCase().includes('tank'),
                      'HOODIES + TRACKSUITS': (p) => p.subcategory === 'HOODIES + TRACKSUITS' || p.name.toLowerCase().includes('hoodie') || p.name.toLowerCase().includes('tracksuit'),
                      'SWIMWEAR': (p) => p.subcategory === 'SWIMWEAR' || p.name.toLowerCase().includes('swim'),
                      'BOTTOMS': (p) => p.subcategory === 'BOTTOMS' || p.name.toLowerCase().includes('short') || p.name.toLowerCase().includes('pant'),
                      'CAPS + BEANIES': (p) => p.subcategory === 'CAPS + BEANIES' || p.name.toLowerCase().includes('cap') || p.name.toLowerCase().includes('hat') || p.name.toLowerCase().includes('beanie'),
                      'LIFESTYLE': (p) => p.badge === 'LIFESTYLE' || p.subcategory === 'LIFESTYLE',
                      'COLLABS': (p) => p.badge === 'COLLAB' || p.subcategory === 'COLLABS',
                    };
                    const filterFn = categoryMap[category];
                    return filterFn ? filterFn(p) : false;
                  }).length;

              return (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`whitespace-nowrap font-bold text-xs tracking-wide transition-all ${
                    selectedCategory === category 
                      ? 'bg-primary text-black' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {category} {!loading && `(${count})`}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="bg-black py-20">
        <div className="container">
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">Error loading products: {error}</p>
            </div>
          )}
          
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-900 rounded-3xl overflow-hidden">
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold text-white mb-4">No products found</h3>
              <p className="text-gray-400 mb-8">
                No products match the "{selectedCategory}" category yet. Check back soon for new drops!
              </p>
              <Button 
                variant="outline"
                onClick={() => setSelectedCategory('SHOP ALL')}
                className="border-primary text-primary hover:bg-primary hover:text-black"
              >
                View All Products
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
              <Link
                key={product.id}
                to={`/rig-store/${product.id}`}
                className="group relative bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-3xl overflow-hidden hover-scale transition-all duration-500 block"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 p-8">
                  <img
                    src={product.image_url || ''}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6"
                  />

                  {/* Floating Action Button */}
                  <Button
                    size="sm"
                    className={`absolute top-4 right-4 rounded-full transition-all duration-300 ${
                      hoveredProduct === product.id 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-2'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: Number(product.price),
                          image: product.image_url || '',
                          category: product.category as 'merch' | 'beverage',
                          variant: {}
                        });
                    }}
                  >
                    <ShoppingBag className="w-4 h-4 mr-1" />
                    Add
                  </Button>

                  {/* Discount Badge */}
                  {product.original_price && (
                    <div className="absolute top-4 right-20 bg-destructive text-white px-3 py-1 rounded-full text-sm font-bold">
                      -{Math.round(((Number(product.original_price) - Number(product.price)) / Number(product.original_price)) * 100)}%
                    </div>
                  )}

                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Product Info */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-300">
                      {product.name}
                    </h3>
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
                    {product.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < Math.floor(Number(product.rating || 0)) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-600'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-yellow-400 text-sm font-bold">{Number(product.rating || 0).toFixed(1)}</span>
                    <span className="text-gray-500 text-sm">({product.reviews_count || 0})</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-primary">
                          {formatEuro(Number(product.price))}
                        </span>
                        {product.original_price && (
                          <span className="text-lg text-gray-500 line-through">
                            {formatEuro(Number(product.original_price))}
                          </span>
                        )}
                      </div>
                    </div>

                    <Button 
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-black transition-all duration-300"
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: Number(product.price),
                          image: product.image_url || '',
                          category: product.category as 'merch' | 'beverage',
                          variant: {}
                        });
                      }}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>

                {/* Animated Border */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-primary via-accent to-primary bg-clip-border opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                     style={{ 
                       background: 'linear-gradient(45deg, transparent, transparent), linear-gradient(45deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))',
                       backgroundClip: 'padding-box, border-box',
                       backgroundOrigin: 'border-box'
                     }} 
                 />
              </Link>
            ))}
            </div>
          )}

          {/* Load More */}
          <div className="text-center mt-16">
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-black font-bold"
            >
              Load More Brutal Gear
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 py-16">
        <div className="container text-center">
          <h2 className="text-4xl font-black text-black mb-4">
            JOIN THE GRATIS TRIBE
          </h2>
          <p className="text-black/80 mb-8 max-w-2xl mx-auto">
            Get exclusive drops, vibrant deals, and be the first to know about our newest streetwear collections. 
            Stay connected with the boldest community in streetwear.
          </p>
          <div className="flex max-w-md mx-auto gap-4">
            <input 
              type="email" 
              placeholder="your@email.com" 
              className="flex-1 px-4 py-3 rounded-lg bg-black/20 text-black placeholder:text-black/60 border border-black/30 focus:outline-none focus:border-black"
            />
            <Button className="bg-black text-white hover:bg-black/80 px-8 font-bold">
              GET GRATIS
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}