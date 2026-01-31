import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import ProductFeatures, {
  useWaterFeatures,
} from "@/components/ProductFeatures";
import MerchCarousel from "@/components/MerchCarousel";
import AdvertisingPartnerCTA from "@/components/AdvertisingPartnerCTA";
import { ProductCarousel } from "@/components/ProductCarousel";
import { VideoHero } from "@/components/VideoHero";
import { TrustIndicators } from "@/components/TrustIndicators";
import { HowItWorksCard } from "@/components/HowItWorksCard";
import { FadeInWhenVisible } from "@/components/ScrollAnimations";
import { motion } from "framer-motion";
import { Droplet, Heart, Users, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Index() {
  const { t } = useTranslation();
  const waterFeatures = useWaterFeatures();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden max-w-full">
      <SEO
        title={t("home.seoTitle")}
        description={t("home.seoDescription")}
        canonical={typeof window !== "undefined" ? window.location.href : "/"}
      />

      {/* Video Hero Section */}
      <VideoHero
        videoUrl="https://assets.mixkit.co/videos/preview/mixkit-people-pouring-a-warm-drink-around-a-campfire-513-large.mp4"
        posterUrl="https://images.unsplash.com/photo-1541167760496-1628856ab772?w=1920&q=80"
        title={t("home.heroTitle1") + " " + t("home.heroTitle2")}
        subtitle={t("home.heroSubtitle")}
        ctaText={t("home.heroCTA")}
        ctaLink="/hydration"
        secondaryCtaText={t("hero.learnMore")}
        secondaryCtaLink="/water"
      />

      {/* Trust Indicators */}
      <FadeInWhenVisible>
        <section className="py-12 bg-muted/30">
          <div className="container">
            <div className="flex justify-center">
              <TrustIndicators />
            </div>
          </div>
        </section>
      </FadeInWhenVisible>

      <main className="space-y-0 overflow-x-hidden max-w-full">
        {/* How It Works Section with Scroll Animations */}
        <section className="py-20 bg-background">
          <div className="container">
            <FadeInWhenVisible>
              <div className="text-center mb-16 space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold">
                  How GRATIS Works
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Making impact accessible through innovation
                </p>
              </div>
            </FadeInWhenVisible>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <HowItWorksCard
                icon={Droplet}
                title="Get GRATIS Water"
                description="Receive premium spring water with no upfront costs. Every bottle funds clean water projects."
                step={1}
                index={0}
              />
              <HowItWorksCard
                icon={Heart}
                title="Support Arts & Education"
                description="Your purchase directly supports local artists and educational programs in underserved communities."
                step={2}
                index={1}
              />
              <HowItWorksCard
                icon={Users}
                title="Join The TRIBE"
                description="Become part of a movement. Access exclusive content, events, and impact reports."
                step={3}
                index={2}
              />
              <HowItWorksCard
                icon={Sparkles}
                title="Create Lasting Impact"
                description="Track your personal impact dashboard. See exactly how your choices create change."
                step={4}
                index={3}
              />
            </div>
          </div>
        </section>

        {/* Product Carousel - Primary Focus */}
        <ProductCarousel />

        {/* Product Features with Stagger Animation */}
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <FadeInWhenVisible>
              <ProductFeatures
                features={waterFeatures}
                title={t("home.whyChoose")}
                subtitle={t("home.whyChooseSubtitle")}
              />
            </FadeInWhenVisible>
          </div>
        </section>

        {/* Impact Video Section */}
        <FadeInWhenVisible>
          <section className="py-20 bg-gradient-to-b from-background to-muted/30">
            <div className="container">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-4xl md:text-5xl font-bold mb-4">
                    See The Impact In Action
                  </h2>
                  <p className="text-xl text-muted-foreground mb-8">
                    Watch how GRATIS is transforming communities worldwide
                  </p>
                  <Button asChild size="lg" variant="default">
                    <Link to="/videos">Watch Impact Stories →</Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </section>
        </FadeInWhenVisible>

        {/* Advertising Partner CTA */}
        <FadeInWhenVisible direction="up">
          <AdvertisingPartnerCTA />
        </FadeInWhenVisible>

        {/* Merch Collection - Compact Carousel */}
        <FadeInWhenVisible direction="up">
          <MerchCarousel />
        </FadeInWhenVisible>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-br from-hot-lime/10 via-electric-blue/10 to-hot-magenta/10">
          <div className="container">
            <FadeInWhenVisible>
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold">
                  Ready To Make An Impact?
                </h2>
                <p className="text-xl text-muted-foreground">
                  Join thousands of TRIBE members creating positive change with
                  every choice.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button asChild size="lg" className="text-lg">
                    <Link to="/tribe">Join The TRIBE</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="text-lg"
                  >
                    <Link to="/events">Explore Events</Link>
                  </Button>
                </div>
                <div className="pt-8">
                  <TrustIndicators />
                </div>
              </div>
            </FadeInWhenVisible>
          </div>
        </section>
      </main>
    </div>
  );
}
