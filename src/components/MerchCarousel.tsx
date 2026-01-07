import { useProducts } from '@/hooks/useProducts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { LazyImage } from '@/components/LazyImage';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';

export default function MerchCarousel() {
  const { products, loading } = useProducts('merch');
  const { addItem } = useCart();

  const addToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || '/placeholder.svg',
      category: product.category,
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (loading) {
    return (
      <section className="py-12">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-muted-foreground">Complete the Look</h3>
        </div>
        <div className="flex gap-4 justify-center">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="w-64 h-80 animate-pulse bg-muted" />
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-12 bg-muted/30 overflow-hidden">
      <div className="container px-4 overflow-x-hidden">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-muted-foreground mb-2">Complete the Look</h3>
          <p className="text-sm text-muted-foreground">Express your street style with GRATIS merch</p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {products.map((product) => (
              <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-transform duration-300 will-change-transform contain-paint">
                  <Link to={`/rig-store/${product.id}`}>
                    <LazyImage
                      src={product.image_url || '/placeholder.svg'}
                      alt={product.name}
                      aspectRatio="1/1"
                      className="hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <div className="p-4">
                    <Link to={`/rig-store/${product.id}`}>
                      <h4 className="font-semibold mb-1 hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                      </h4>
                    </Link>
                    <p className="text-lg font-bold mb-3">€{product.price}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => addToCart(product)}
                      disabled={!product.in_stock}
                    >
                      {product.in_stock ? 'Quick Add' : 'Out of Stock'}
                    </Button>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        <div className="text-center mt-8">
          <Button variant="ghost" asChild>
            <Link to="/rig-store?category=merch">
              View All Merch <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
