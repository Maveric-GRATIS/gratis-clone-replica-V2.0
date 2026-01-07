import React from 'react';
import { useCartActions } from '@/hooks/useCartActions';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { LazyImage } from '@/components/LazyImage';
import { formatEuro } from '@/lib/currency';

interface ProductCardProps {
  product?: {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    original_price?: number | null;
    category: string;
    image_url?: string | null;
    tier?: string | null;
    pre_order?: boolean | null;
    collaboration_brand?: string | null;
    series_number?: number | null;
    edition_size?: number | null;
    rating: number;
    review_count: number;
    in_stock: boolean;
  };
  loading?: boolean;
}

export default function ProductCard({ product, loading }: ProductCardProps) {
  const { addToCart } = useCartActions();

  if (loading || !product) {
    return (
      <Card className="overflow-hidden">
        <div className="aspect-square">
          <Skeleton className="w-full h-full" />
        </div>
        <CardContent className="p-4">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-full mb-4" />
          <Skeleton className="h-6 w-1/2" />
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || '/placeholder.svg',
      category: product.category as 'beverage' | 'merch',
      description: product.description || undefined,
      originalPrice: product.original_price || undefined,
      rating: product.rating,
      reviews: product.review_count,
    });
  };

  // Determine badge based on product properties
  const getBadge = () => {
    if (product.collaboration_brand) return 'COLLABORATION';
    if (product.tier === 'ultra-limited') return 'ULTRA LIMITED';
    if (product.tier === 'limited') return 'LIMITED EDITION';
    if (product.pre_order) return 'PRE-ORDER';
    return null;
  };

  const badge = getBadge();

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <div className="relative aspect-square overflow-hidden bg-muted/50">
        <LazyImage
          src={product.image_url || '/placeholder.svg'}
          alt={product.name}
          aspectRatio="1/1"
          className="group-hover:scale-105 transition-transform duration-500"
          fallback="/placeholder.svg"
        />
        {badge && (
          <Badge 
            className="absolute top-3 left-3 bg-primary text-primary-foreground"
            variant="default"
          >
            {badge}
          </Badge>
        )}
        {product.series_number && product.edition_size && (
          <Badge 
            className="absolute top-3 right-3 bg-black/80 text-white backdrop-blur-sm"
            variant="secondary"
          >
            #{product.series_number} • {product.edition_size} units
          </Badge>
        )}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive">Out of Stock</Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
          
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          )}
          
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-current text-yellow-400" />
              <span className="font-medium">{product.rating}</span>
            </div>
            <span className="text-muted-foreground">
              ({product.review_count} reviews)
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{formatEuro(product.price)}</span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatEuro(product.original_price)}
              </span>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleAddToCart}
          disabled={!product.in_stock}
          className="w-full"
          size="lg"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardFooter>
    </Card>
  );
}