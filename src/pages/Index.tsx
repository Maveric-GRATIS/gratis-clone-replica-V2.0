import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import ProductFeatures, { waterFeatures } from "@/components/ProductFeatures";
import MerchCarousel from "@/components/MerchCarousel";
import AdvertisingPartnerCTA from "@/components/AdvertisingPartnerCTA";
import { ProductCarousel } from "@/components/ProductCarousel";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import gratisAmsterdamCanal from "@/assets/gratis-amsterdam-canal.jpg";
import gratisAmsterdamStreet from "@/assets/gratis-amsterdam-street.jpg";
import gratisMcdonalds from "@/assets/gratis-mcdonalds.jpg";
import gratisStudioBlack from "@/assets/gratis-studio-black.jpg";
import gratisStudioBlock from "@/assets/gratis-studio-block.jpg";
import gratisTimesSquare from "@/assets/gratis-times-square.jpg";

const backgroundImages = [
  gratisAmsterdamCanal,
  gratisAmsterdamStreet,
  gratisMcdonalds,
  gratisStudioBlack,
  gratisStudioBlock,
  gratisTimesSquare,
];

export default function Index() {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    // Preload first image immediately
    const firstImg = new Image();
    firstImg.src = backgroundImages[0];

    // Lazy load remaining images after first paint
    const loadRemainingImages = () => {
      backgroundImages.forEach((src, index) => {
        if (index === 0) return; // Skip first image, already loaded

        const img = new Image();
        img.src = src;
        img.onload = () => {
          setLoadedImages((prev) => new Set([...prev, index]));
        };
      });
    };

    // Delay loading of remaining images
    const timeoutId = setTimeout(loadRemainingImages, 1000);

    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    let rafId: number;
    let lastScrollY = 0;

    const updateParallax = () => {
      const currentScrollY = window.scrollY;

      // Only update every 10px for smoother performance
      if (Math.abs(currentScrollY - lastScrollY) < 10) return;

      lastScrollY = currentScrollY;
      setScrollY(currentScrollY);
    };

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden max-w-full">
      <SEO
        title="GRATIS — Pure Power, Pure Purpose"
        description="Pure hydration in 100% recyclable tetrapacks."
        canonical={typeof window !== "undefined" ? window.location.href : "/"}
      />

      <section className="relative overflow-hidden min-h-screen max-w-full contain-layout">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
          style={{
            backgroundImage: `url(${backgroundImages[currentBgIndex]})`,
            transform: `translate3d(0, ${scrollY * 0.15}px, 0)`,
            filter: loadedImages.has(currentBgIndex)
              ? "blur(0px)"
              : "blur(20px)",
            opacity: loadedImages.has(currentBgIndex) ? 1 : 0.7,
            left: 0,
            right: 0,
          }}
        >
          <div className="absolute inset-0 bg-black/70" />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/5 to-background" />

        <div className="relative container min-h-screen flex items-center">
          <div className="grid md:grid-cols-2 items-center gap-10">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight">
                <span className="block text-white">Pure Power,</span>
                <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Pure Purpose
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-prose">
                From mountain springs to your hands — in 100% recyclable
                tetrapacks.
              </p>
              <div className="flex gap-4">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/hydration">Drink with Purpose</Link>
                </Button>
                <Button variant="outline" size="xl" asChild>
                  <Link to="/water">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="space-y-0 overflow-x-hidden max-w-full">
        {/* Product Carousel - Primary Focus */}
        <ProductCarousel />

        {/* Product Features */}
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <ProductFeatures
              features={waterFeatures}
              title="Why Choose GRATIS?"
              subtitle="Pure hydration meets street culture"
            />
          </div>
        </section>

        {/* Advertising Partner CTA */}
        <AdvertisingPartnerCTA />

        {/* Merch Collection - Compact Carousel */}
        <MerchCarousel />
      </main>
    </div>
  );
}
