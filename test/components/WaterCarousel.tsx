import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { beverageProducts } from '@/data/products';
import { useCartActions } from '@/hooks/useCartActions';
import { LazyImage } from '@/components/LazyImage';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from '@/components/ui/carousel';

export const WaterCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [quantities, setQuantities] = useState<Record<string, number>>(
    beverageProducts.reduce((acc, p) => ({ ...acc, [p.id]: 1 }), {})
  );
  const [isVisible, setIsVisible] = useState(false);
  const { addToCart } = useCartActions();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    const carouselElement = document.querySelector('[data-carousel="water"]');
    if (carouselElement) {
      observer.observe(carouselElement);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!api || !isVisible) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 6000);

    return () => clearInterval(interval);
  }, [api, isVisible]);

  const handleQuantityChange = (productId: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta),
    }));
  };

  const handleAddToCart = (product: typeof beverageProducts[0]) => {
    const quantity = quantities[product.id];
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setQuantities((prev) => ({ ...prev, [product.id]: 1 }));
  };

  return (
    <div className="w-full overflow-hidden" data-carousel="water">
      <div className="relative px-4 md:px-8">
        <Carousel
          setApi={setApi}
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full max-w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
          {beverageProducts.map((product) => (
            <CarouselItem
              key={product.id}
              className="pl-4 md:pl-6 basis-full md:basis-1/2 lg:basis-1/3"
            >
              <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:-translate-y-1 hover:shadow-xl transition-transform duration-300 h-full will-change-transform contain-paint">
                <LazyImage
                  src={product.image}
                  alt={product.name}
                  aspectRatio="1/1"
                  className="w-full"
                />
                {product.originalPrice && (
                  <Badge className="absolute top-4 right-4 bg-primary z-10">
                    Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </Badge>
                )}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      {product.variant?.size}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {product.description}
                    </p>
                  </div>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground">
                      €{product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        €{product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(product.id, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-semibold">
                        {quantities[product.id]}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(product.id, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 gap-2 hover:scale-[1.02] transition-transform"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 md:-left-12" />
        <CarouselNext className="right-0 md:-right-12" />
      </Carousel>
      </div>
    </div>
  );
};
