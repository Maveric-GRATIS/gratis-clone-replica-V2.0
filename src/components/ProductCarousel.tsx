import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const products = [
  {
    id: "water-500ml",
    name: "W.A.T.E.R",
    subtitleKey: "products.carousel.water.subtitle",
    descriptionKey: "products.carousel.water.description",
    price: 4.97,
    size: "500ML",
    image: "/lovable-uploads/c51ea472-b223-4a6a-934c-74b38370615e.png",
  },
  {
    id: "theurgy-20oz",
    name: "THEURGY",
    subtitleKey: "products.carousel.theurgy.subtitle",
    descriptionKey: "products.carousel.theurgy.description",
    price: 5.97,
    size: "20OZ",
    image: "/lovable-uploads/cdefb4a2-d74d-4f9f-be84-9100cb927d52.png",
  },
  {
    id: "fu-1gal",
    name: "F.U.",
    subtitleKey: "products.carousel.fu.subtitle",
    descriptionKey: "products.carousel.fu.description",
    price: 12.97,
    size: "1 GAL",
    image: "/lovable-uploads/5fb80093-c88d-4f40-87ed-593974c38b11.png",
  },
];

export const ProductCarousel = () => {
  const { addItem } = useCart();
  const { t } = useTranslation();

  const handleAddToCart = (product: (typeof products)[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: "beverage",
    });
    toast.success(`${product.name} ${t("products.carousel.addedToCart")}`);
  };

  return (
    <section className="bg-background py-16 px-0 overflow-hidden">
      <div className="max-w-[1600px] mx-auto">
        {/* Section Title */}
        <div className="text-center mb-12 px-4">
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase text-foreground mb-3"
            style={{ letterSpacing: "-0.03em" }}
          >
            {t("products.carousel.title")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("products.carousel.subtitle")}
          </p>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="relative">
          {/* Scrollable Product Container */}
          <div className="flex gap-8 overflow-x-auto snap-x snap-mandatory px-4 lg:px-8 pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {products.map((product, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[85vw] sm:w-[45vw] lg:w-[380px] snap-center group"
              >
                {/* Product Card */}
                <Card className="border-border/50 bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--brand-pink)/0.2)]">
                  <CardContent className="p-0">
                    {/* Product Image Container */}
                    <div className="relative aspect-[3/4] bg-gradient-to-b from-muted/30 to-card overflow-hidden rounded-t-lg">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Size Badge */}
                      <Badge className="absolute top-4 right-4 bg-foreground text-background font-bold text-xs uppercase rounded-sm">
                        {product.size}
                      </Badge>
                    </div>

                    {/* Product Info */}
                    <div className="text-center p-6">
                      {/* Product Name */}
                      <h3 className="text-2xl lg:text-3xl font-black uppercase tracking-tight text-foreground mb-2">
                        {product.name}
                      </h3>

                      {/* Subtitle */}
                      <p className="text-sm text-muted-foreground font-medium mb-2">
                        {t(product.subtitleKey)}
                      </p>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground/70 mb-4 min-h-[40px]">
                        {t(product.descriptionKey)}
                      </p>

                      {/* Price + CTA */}
                      <div className="flex flex-col gap-3 items-center">
                        <div className="text-2xl font-black text-foreground">
                          ${product.price.toFixed(2)}
                        </div>
                        <Button
                          onClick={() => handleAddToCart(product)}
                          className="w-full font-bold uppercase text-sm"
                        >
                          {t("products.addToCart")}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Scroll Indicator (Mobile) */}
          <div className="flex justify-center gap-2 mt-6 lg:hidden">
            {products.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-muted-foreground/30"
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 px-4">
          <Button variant="hero" size="lg" asChild>
            <Link to="/rig?category=beverage">
              {t("products.carousel.shopAll")}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
