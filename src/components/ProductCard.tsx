import React from "react";
import { useCartActions } from "@/hooks/useCartActions";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { LazyImage } from "@/components/LazyImage";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const { addToCart } = useCartActions();
  const { formatPrice } = useCurrency();

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
      image: product.image_url || "/placeholder.svg",
      category: product.category as "beverage" | "merch",
      description: product.description || undefined,
      originalPrice: product.original_price || undefined,
      rating: product.rating,
      reviews: product.review_count,
    });
  };

  // Determine badge based on product properties
  const getBadge = () => {
    if (product.collaboration_brand) return "COLLABORATION";
    if (product.tier === "ultra-limited") return "ULTRA LIMITED";
    if (product.tier === "limited") return "LIMITED EDITION";
    if (product.pre_order) return "PRE-ORDER";
    return null;
  };

  const badge = getBadge();

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] touch-manipulation">
      <div className="relative aspect-square overflow-hidden bg-muted/50">
        <LazyImage
          src={product.image_url || "/placeholder.svg"}
          alt={product.name}
          aspectRatio="1/1"
          className="group-hover:scale-105 transition-transform duration-500"
          fallback="/placeholder.svg"
        />
        {badge && (
          <Badge
            className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-primary text-primary-foreground text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5"
            variant="default"
          >
            {badge}
          </Badge>
        )}
        {product.series_number && product.edition_size && (
          <Badge
            className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/80 text-white backdrop-blur-sm text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5"
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

      <CardContent className="p-3 sm:p-4">
        <div className="space-y-1.5 sm:space-y-2">
          <h3 className="font-semibold text-sm sm:text-base lg:text-lg leading-tight line-clamp-2">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 hidden sm:block">
              {product.description}
            </p>
          )}

          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
            <div className="flex items-center gap-0.5 sm:gap-1">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current text-yellow-400" />
              <span className="font-medium">{product.rating}</span>
            </div>
            <span className="text-muted-foreground text-[10px] sm:text-sm">
              ({product.review_count})
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-lg sm:text-xl lg:text-2xl font-bold">
              {formatPrice(product.price)}
            </span>
            {product.original_price &&
              product.original_price > product.price && (
                <span className="text-xs sm:text-sm text-muted-foreground line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-3 sm:p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={!product.in_stock}
          className="w-full h-10 sm:h-auto touch-manipulation text-sm sm:text-base"
          size="lg"
        >
          <ShoppingCart className="w-4 h-4 sm:w-4 sm:h-4 mr-2" />
          {product.in_stock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  );
}
