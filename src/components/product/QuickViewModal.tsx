import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LazyImage } from '@/components/LazyImage';
import { ShoppingBag, Star, X } from 'lucide-react';
import { formatEuro } from '@/lib/currency';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  original_price?: number | null;
  image_url: string;
  category: string;
  rating?: number | null;
  reviews_count?: number | null;
  sizes_available?: string[] | null;
  colors_available?: string[] | null;
}

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, variant: { size?: string; color?: string }) => void;
}

export function QuickViewModal({ product, isOpen, onClose, onAddToCart }: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);

  // Reset selections when product changes
  React.useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes_available?.[0] || null);
      setSelectedColor(product.colors_available?.[0] || null);
    }
  }, [product]);

  if (!product) return null;

  const discount = product.original_price 
    ? Math.round(((Number(product.original_price) - Number(product.price)) / Number(product.original_price)) * 100)
    : 0;

  const handleAddToCart = () => {
    onAddToCart(product, { size: selectedSize || undefined, color: selectedColor || undefined });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-0 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Product Image */}
          <div className="relative aspect-square bg-gradient-to-br from-gray-800 to-gray-900 p-8">
            <LazyImage
              src={product.image_url}
              alt={product.name}
              aspectRatio="1/1"
              className="w-full h-full object-contain"
            />
            {discount > 0 && (
              <Badge className="absolute top-4 left-4 bg-destructive text-white font-bold">
                -{discount}% OFF
              </Badge>
            )}
          </div>

          {/* Product Details */}
          <div className="p-8 flex flex-col">
            <DialogHeader className="text-left mb-4">
              <DialogTitle className="text-2xl font-black text-white">
                {product.name}
              </DialogTitle>
            </DialogHeader>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2 mb-4">
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
                <span className="text-yellow-400 text-sm font-bold">
                  {Number(product.rating).toFixed(1)}
                </span>
                <span className="text-gray-500 text-sm">
                  ({product.reviews_count || 0} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-black text-primary">
                {formatEuro(Number(product.price))}
              </span>
              {product.original_price && (
                <span className="text-xl text-gray-500 line-through">
                  {formatEuro(Number(product.original_price))}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Size Selector */}
            {product.sizes_available && product.sizes_available.length > 0 && (
              <div className="mb-6">
                <label className="text-sm font-bold text-gray-400 mb-2 block">SIZE</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes_available.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200 ${
                        selectedSize === size
                          ? 'bg-primary text-black'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.colors_available && product.colors_available.length > 0 && (
              <div className="mb-6">
                <label className="text-sm font-bold text-gray-400 mb-2 block">COLOR</label>
                <div className="flex flex-wrap gap-2">
                  {product.colors_available.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200 ${
                        selectedColor === color
                          ? 'bg-primary text-black'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-auto space-y-3">
              <Button
                onClick={handleAddToCart}
                className="w-full bg-primary text-black font-bold hover:bg-primary/90 transform-gpu transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                size="lg"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                size="lg"
              >
                <Link to={`/rig-store/${product.id}`} onClick={onClose}>
                  View Full Details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
