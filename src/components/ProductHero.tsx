import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/data/products";
import { useCurrency } from "@/contexts/CurrencyContext";

interface ProductHeroProps {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  products: Product[];
  backgroundImage: string;
}

export default function ProductHero({
  title,
  subtitle,
  description,
  ctaText,
  products,
  backgroundImage,
}: ProductHeroProps) {
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />

      {/* Animated Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-primary/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-accent/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 container min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Column - Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none tracking-tight">
                <span className="block">{title}</span>
                <span className="block text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {subtitle}
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 max-w-2xl font-medium">
                {description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                variant="hero"
                size="xl"
                className="text-lg font-bold hover-scale transform transition-all duration-300"
                onClick={() => products[0] && addItem(products[0])}
              >
                {ctaText}
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="text-lg font-bold border-primary/50 text-foreground hover:bg-primary/20"
              >
                Learn More
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-800">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-black text-primary">100%</div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">
                  Natural
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-black text-primary">0</div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">
                  Artificial
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-black text-primary">∞</div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">
                  Recyclable
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Product Showcase */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
              {products.slice(0, 4).map((product, index) => (
                <div
                  key={product.id}
                  className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover-scale transition-all duration-500"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="aspect-square relative overflow-hidden rounded-xl bg-gray-800">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="mt-4 space-y-2">
                    <h3 className="font-bold text-white text-lg">
                      {product.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {product.variant?.size}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-primary">
                        {formatEuro(product.price)}
                      </span>
                      <Button
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onClick={() => addItem(product)}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
