
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '@/firebase';
import { collection, query, where, getDocs, limit, orderBy, documentId } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Plus } from 'lucide-react';
import { useCartActions } from '@/hooks/useCartActions';
import { formatEuro } from '@/lib/currency';

// Define a TypeScript interface for the Product
interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image_url?: string;
  category: string;
  subcategory: string | null;
  in_stock: boolean;
  featured: boolean;
  colors_available?: string[];
}

interface CompleteTheLookProps {
  currentProduct: Product;
}

// Define category matching logic for outfit combinations
const getCategoryMatches = (subcategory: string | null): string[] => {
  const matches: Record<string, string[]> = {
    'TANKS + TOPS': ['BOTTOMS', 'CAPS + BEANIES', 'SWIMWEAR'],
    'HOODIES + TRACKSUITS': ['BOTTOMS', 'CAPS + BEANIES'],
    'SWIMWEAR': ['CAPS + BEANIES', 'TANKS + TOPS'],
    'BOTTOMS': ['TANKS + TOPS', 'HOODIES + TRACKSUITS', 'CAPS + BEANIES'],
    'CAPS + BEANIES': ['HOODIES + TRACKSUITS', 'TANKS + TOPS', 'BOTTOMS'],
  };
  
  return subcategory && matches[subcategory] ? matches[subcategory] : [];
};

export default function CompleteTheLook({ currentProduct }: CompleteTheLookProps) {
  const [matchingProducts, setMatchingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCartActions();

  useEffect(() => {
    const fetchMatchingProducts = async () => {
      setLoading(true);
      
      const matchingCategories = getCategoryMatches(currentProduct.subcategory);
      
      if (matchingCategories.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const productsRef = collection(db, 'products');
        const q = query(
          productsRef,
          where('category', '==', 'merch'),
          where('in_stock', '==', true),
          where('subcategory', 'in', matchingCategories),
          orderBy('featured', 'desc'),
          limit(5) // Fetch extra to filter out current product client-side
        );

        const querySnapshot = await getDocs(q);
        const fetchedProducts = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as Product))
          .filter(p => p.id !== currentProduct.id); // Exclude current product

        const sortedData = fetchedProducts.sort((a, b) => {
          const aHasMatchingColor = currentProduct.colors_available?.some(
            color => a.colors_available?.includes(color)
          );
          const bHasMatchingColor = currentProduct.colors_available?.some(
            color => b.colors_available?.includes(color)
          );
          
          if (aHasMatchingColor && !bHasMatchingColor) return -1;
          if (!aHasMatchingColor && bHasMatchingColor) return 1;
          return 0;
        });

        setMatchingProducts(sortedData.slice(0, 4));
      } catch (error) {
        console.error('Error fetching matching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchingProducts();
  }, [currentProduct.id, currentProduct.subcategory, currentProduct.colors_available]);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image_url || '',
      category: 'merch',
      variant: {},
    });
  };

  const getTotalPrice = () => {
    const currentPrice = Number(currentProduct.price);
    const matchingPrices = matchingProducts.slice(0, 2).reduce((sum, p) => sum + Number(p.price), 0);
    return currentPrice + matchingPrices;
  };

  const getOriginalTotalPrice = () => {
    const currentPrice = Number(currentProduct.original_price || currentProduct.price);
    const matchingPrices = matchingProducts.slice(0, 2).reduce(
      (sum, p) => sum + Number(p.original_price || p.price), 
      0
    );
    return currentPrice + matchingPrices;
  };

  if (loading || matchingProducts.length === 0) {
    return null;
  }

  const totalPrice = getTotalPrice();
  const originalTotal = getOriginalTotalPrice();
  const savings = originalTotal > totalPrice ? originalTotal - totalPrice : null;

  return (
    <section className="py-12 border-t">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Complete the Look</h2>
            <p className="text-muted-foreground">
              Style it together for the ultimate streetwear outfit
            </p>
          </div>
          
          {matchingProducts.length >= 2 && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Bundle price (3 items)</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-primary">{formatEuro(totalPrice)}</span>
                {savings && (
                  <>
                    <span className="text-sm text-muted-foreground line-through">
                      {formatEuro(originalTotal)}
                    </span>
                    <Badge variant="destructive" className="text-xs">
                      Save {formatEuro(savings)}
                    </Badge>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Current Product Card */}
          <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm border-2 border-primary/50 rounded-2xl overflow-hidden">
            <Badge className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground">
              Current Item
            </Badge>
            <Link to={`/rig/${currentProduct.id}`} className="block">
              <div className="aspect-square p-6 bg-gradient-to-br from-gray-900 to-gray-800">
                <img
                  src={currentProduct.image_url || ''}
                  alt={currentProduct.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-sm line-clamp-2">{currentProduct.name}</h3>
                <p className="text-lg font-bold">{formatEuro(Number(currentProduct.price))}</p>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Plus className="w-6 h-6 text-muted-foreground" />
            </div>
          </div>

          {matchingProducts.slice(0, 2).map((product, index) => (
            <>
              <div
                key={product.id}
                className="group relative bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300"
              >
                <Link to={`/rig/${product.id}`} className="block">
                  <div className="aspect-square p-6 bg-gradient-to-br from-gray-900 to-gray-800">
                    <img
                      src={product.image_url || ''}
                      alt={product.name}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm line-clamp-2 flex-1">
                        {product.name}
                      </h3>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full shrink-0"
                        onClick={(e) => handleQuickAdd(product, e)}
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-lg font-bold">{formatEuro(Number(product.price))}</p>
                      {product.original_price && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatEuro(Number(product.original_price))}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{product.subcategory}</p>
                  </div>
                </Link>
              </div>
              
              {index === 0 && matchingProducts.length > 1 && (
                <div className="hidden md:flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Plus className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
              )}
            </>
          ))}
        </div>

        {matchingProducts.length >= 2 && (
          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              className="gap-2"
              onClick={() => {
                addToCart({
                  id: currentProduct.id,
                  name: currentProduct.name,
                  price: Number(currentProduct.price),
                  image: currentProduct.image_url || '',
                  category: 'merch',
                  variant: {},
                });
                matchingProducts.slice(0, 2).forEach(p => {
                  addToCart({
                    id: p.id,
                    name: p.name,
                    price: Number(p.price),
                    image: p.image_url || '',
                    category: 'merch',
                    variant: {},
                  });
                });
              }}
            >
              <ShoppingBag className="w-5 h-5" />
              Add All 3 Items to Cart
              {savings && <span className="ml-2">• Save {formatEuro(savings)}</span>}
            </Button>
          </div>
        )}

        {matchingProducts.length > 2 && (
          <div className="text-center pt-4">
            <Link to="/rig">
              <Button variant="outline">
                View More Matching Items
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
