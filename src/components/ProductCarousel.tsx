import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

const products = [
  {
    id: "water-500ml",
    name: "W.A.T.E.R",
    subtitleKey: "products.carousel.water.subtitle",
    descriptionKey: "products.carousel.water.description",
    price: 4.97,
    size: "500ML",
    image: "/lovable-uploads/Gratis_water_500ml.png",
  },
  {
    id: "theurgy-20oz",
    name: "THEURGY",
    subtitleKey: "products.carousel.theurgy.subtitle",
    descriptionKey: "products.carousel.theurgy.description",
    price: 5.97,
    size: "20OZ",
    image: "/lovable-uploads/Gratis_water_570ml.png",
  },
  {
    id: "fu-1gal",
    name: "F.U.",
    subtitleKey: "products.carousel.fu.subtitle",
    descriptionKey: "products.carousel.fu.description",
    price: 12.97,
    size: "1 GAL",
    image: "/lovable-uploads/Gratis_water_1gal.png",
  },
  {
    id: "squeezed-death-12oz",
    name: "SQUEEZED TO DEATH",
    subtitleKey: "products.carousel.squeezed.subtitle",
    descriptionKey: "products.carousel.squeezed.description",
    price: 3.97,
    size: "12OZ",
    image: "/lovable-uploads/c51ea472-b223-4a6a-934c-74b38370615e.png",
  },
  {
    id: "mango-chainsaw-16oz",
    name: "MANGO CHAINSAW",
    subtitleKey: "products.carousel.mango.subtitle",
    descriptionKey: "products.carousel.mango.description",
    price: 4.47,
    size: "16OZ",
    image: "/lovable-uploads/cdefb4a2-d74d-4f9f-be84-9100cb927d52.png",
  },
  {
    id: "blueberry-buzzsaw-16oz",
    name: "BLUEBERRY BUZZSAW",
    subtitleKey: "products.carousel.blueberry.subtitle",
    descriptionKey: "products.carousel.blueberry.description",
    price: 4.47,
    size: "16OZ",
    image: "/lovable-uploads/5fb80093-c88d-4f40-87ed-593974c38b11.png",
  },
  {
    id: "grave-fruit-12oz",
    name: "GRAVE FRUIT",
    subtitleKey: "products.carousel.grave.subtitle",
    descriptionKey: "products.carousel.grave.description",
    price: 3.97,
    size: "12OZ",
    image: "/lovable-uploads/c51ea472-b223-4a6a-934c-74b38370615e.png",
  },
  {
    id: "root-beer-wrath-16oz",
    name: "ROOTBEER WRATH",
    subtitleKey: "products.carousel.rootbeer.subtitle",
    descriptionKey: "products.carousel.rootbeer.description",
    price: 4.47,
    size: "16OZ",
    image: "/lovable-uploads/cdefb4a2-d74d-4f9f-be84-9100cb927d52.png",
  },
  {
    id: "green-guillotine-16oz",
    name: "GREEN GUILLOTINE",
    subtitleKey: "products.carousel.green.subtitle",
    descriptionKey: "products.carousel.green.description",
    price: 4.47,
    size: "16OZ",
    image: "/lovable-uploads/5fb80093-c88d-4f40-87ed-593974c38b11.png",
  },
];

export const ProductCarousel = () => {
  const { addItem } = useCart();
  const { t } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Track active slide based on scroll position
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollLeft = scrollContainer.scrollLeft;
      const itemWidth = 280 + 24; // card width + gap
      const newIndex = Math.round(scrollLeft / itemWidth);
      setActiveIndex(Math.min(newIndex, products.length - 1));
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let scrollInterval: NodeJS.Timeout;

    const startAutoScroll = () => {
      if (isPaused) return;

      scrollInterval = setInterval(() => {
        if (!scrollContainer) return;

        const itemWidth = 280 + 24; // card width + gap
        const currentScroll = scrollContainer.scrollLeft;
        const maxScroll =
          scrollContainer.scrollWidth - scrollContainer.clientWidth;

        // If at the end, reset to start
        if (currentScroll >= maxScroll - 10) {
          scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollContainer.scrollTo({
            left: currentScroll + itemWidth,
            behavior: "smooth",
          });
        }
      }, 3500); // Auto-scroll every 3.5 seconds
    };

    startAutoScroll();

    return () => {
      clearInterval(scrollInterval);
    };
  }, [isPaused]);

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

  const scrollToIndex = (index: number) => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const itemWidth = 280 + 24; // card width + gap
    scrollContainer.scrollTo({
      left: itemWidth * index,
      behavior: "smooth",
    });
  };

  const scrollPrev = () => {
    const newIndex = Math.max(0, activeIndex - 1);
    scrollToIndex(newIndex);
  };

  const scrollNext = () => {
    const newIndex = Math.min(products.length - 1, activeIndex + 1);
    scrollToIndex(newIndex);
  };

  // Drag to scroll functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    setIsDragging(true);
    setStartX(e.pageX - scrollContainer.offsetLeft);
    setScrollLeft(scrollContainer.scrollLeft);
    scrollContainer.style.cursor = "grabbing";
    scrollContainer.style.scrollBehavior = "auto";
  };

  const handleMouseLeave = () => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    setIsDragging(false);
    scrollContainer.style.cursor = "grab";
    scrollContainer.style.scrollBehavior = "smooth";
  };

  const handleMouseUp = () => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    setIsDragging(false);
    scrollContainer.style.cursor = "grab";
    scrollContainer.style.scrollBehavior = "smooth";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    e.preventDefault();
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const x = e.pageX - scrollContainer.offsetLeft;
    const walk = (x - startX) * 2; // Multiply for faster scroll
    scrollContainer.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="bg-background py-20 overflow-hidden">
      <div className="w-full">
        {/* Section Title */}
        <div className="text-center mb-16 px-4">
          <h2
            className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase text-foreground tracking-tight"
            style={{ letterSpacing: "-0.05em" }}
          >
            {t("products.carousel.title")}
          </h2>
        </div>

        {/* Horizontal Scroll Container - Full Width */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={scrollPrev}
            disabled={activeIndex === 0}
            className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm hover:bg-black/80 transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-2xl"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-7 h-7 text-white" />
          </button>

          <button
            onClick={scrollNext}
            disabled={activeIndex === products.length - 1}
            className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm hover:bg-black/80 transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-2xl"
            aria-label="Next slide"
          >
            <ChevronRight className="w-7 h-7 text-white" />
          </button>

          {/* Scrollable Product Container */}
          <div
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsPaused(true)}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-8 pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth cursor-grab active:cursor-grabbing select-none"
          >
            {products.map((product, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[360px] snap-start group"
              >
                {/* Product Card - Simpler, cleaner design */}
                <Link
                  to={`/rig/${product.id}`}
                  className="block"
                  onClick={(e) => {
                    if (isDragging) {
                      e.preventDefault();
                    }
                  }}
                  draggable={false}
                >
                  <div className="relative bg-card rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                    {/* Product Image Container - Larger, more prominent */}
                    <div className="relative aspect-[3/4] bg-gradient-to-br from-muted/20 to-background overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110 pointer-events-none"
                        draggable={false}
                      />

                      {/* Size Badge - Top Right */}
                      <div className="absolute top-4 right-4 bg-foreground/90 text-background px-3 py-1 rounded-md text-xs font-black uppercase">
                        {product.size}
                      </div>
                    </div>

                    {/* Product Info - Centered, minimal */}
                    <div className="p-6 text-center">
                      {/* Product Name */}
                      <h3 className="text-xl font-black uppercase tracking-tight text-foreground mb-2 leading-tight">
                        {product.name}
                      </h3>

                      {/* Subtitle - More prominent */}
                      <p className="text-sm text-muted-foreground mb-3 font-medium">
                        {t(product.subtitleKey)}
                      </p>

                      {/* Calories */}
                      <p className="text-xs text-muted-foreground/70 mb-4">
                        {t(product.descriptionKey)}
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Add to Cart Button - Below card */}
                <Button
                  onClick={() => handleAddToCart(product)}
                  className="w-full mt-4 font-bold uppercase text-sm h-12"
                  variant="default"
                >
                  ${product.price.toFixed(2)} • {t("products.addToCart")}
                </Button>
              </div>
            ))}
          </div>

          {/* Scroll Indicators - Centered below */}
          <div className="flex justify-center gap-2 mt-8">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? "bg-foreground w-8"
                    : "bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
