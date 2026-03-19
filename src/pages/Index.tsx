import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import ProductFeatures from "@/components/ProductFeatures";
import { useWaterFeatures } from "@/hooks/useWaterFeatures";
import MerchCarousel from "@/components/MerchCarousel";
import AdvertisingPartnerCTA from "@/components/AdvertisingPartnerCTA";
import { ProductCarousel } from "@/components/ProductCarousel";
import { TrustIndicators } from "@/components/TrustIndicators";
import { HowItWorksCard } from "@/components/HowItWorksCard";
import { FadeInWhenVisible } from "@/components/ScrollAnimations";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  Droplet,
  Heart,
  Users,
  Sparkles,
  ArrowRight,
  Check,
  Globe,
  Palette,
  GraduationCap,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import gratisMcdonalds from "@/assets/gratis-mcdonalds.jpg";
import gratisAmsterdamCanal from "@/assets/gratis-amsterdam-canal.jpg";

export default function Index() {
  const { t } = useTranslation();
  const waterFeatures = useWaterFeatures();

  // Refs for scroll animations
  const heroRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);

  // Parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  const isInView = useInView(pillarsRef, { once: true, margin: "-100px" });

  const heroImages = [
    gratisMcdonalds,
    gratisAmsterdamCanal,
    "/lovable-uploads/gratis-colorblock-squad.jpg",
    "/lovable-uploads/gratis-canal-collection.jpg",
    "/lovable-uploads/gratis-street-duo.jpg",
    "/lovable-uploads/gratis-studio-crew.jpg",
    "/lovable-uploads/gratis-amsterdam-crewneck.jpg",
  ];
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(
      () => setHeroImageIndex((prev) => (prev + 1) % heroImages.length),
      4000,
    );
    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden max-w-full">
      <SEO
        title={t("home.seoTitle")}
        description={t("home.seoDescription")}
        canonical={typeof window !== "undefined" ? window.location.href : "/"}
      />

      {/* ===== HERO SECTION ===== */}
      <section
        ref={heroRef}
        className="relative w-full overflow-hidden bg-black flex items-center min-h-screen"
        style={{ minHeight: "100svh" }}
      >
        {/* Background images */}
        {heroImages.map((img, i) => (
          <img
            key={img}
            src={img}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out pointer-events-none select-none"
            style={{
              objectFit: "contain",
              objectPosition: "center",
              transform: "scale(0.9)",
              opacity: i === heroImageIndex ? 1 : 0,
            }}
          />
        ))}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)",
          }}
        />

        <div className="container relative z-20 px-6 md:px-10 py-20">
          <div className="max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-6"
            >
              <span className="block text-white">Pure Power,</span>
              <span className="block">
                <span className="text-hot-lime">Pure </span>
                <span className="text-hot-magenta">Purpose</span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-lg text-gray-200 mb-10 max-w-md leading-relaxed"
            >
              From mountain springs to your hands — in 100% recyclable
              tetrapacks.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                asChild
                size="lg"
                className="text-base px-8 py-6 bg-gradient-to-r from-hot-magenta to-electric-blue text-white font-bold hover:opacity-90 border-0"
              >
                <Link to="/hydration">Drink with Purpose</Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="text-base px-8 py-6 bg-white/10 backdrop-blur-md text-white font-bold hover:bg-white/20 border-0"
              >
                <Link to="/gratis">Learn More</Link>
              </Button>
            </motion.div>
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
        >
          <ChevronDown className="w-8 h-8 text-white/60" />
        </motion.div>
      </section>

      <main className="space-y-0 overflow-x-hidden max-w-full">
        {/* ===== THIRST HAS NO BORDERS - PRODUCT CAROUSEL ===== */}
        <ProductCarousel />

        {/* ===== WHY CHOOSE GRATIS - Product Features ===== */}
        <section className="bg-background py-20">
          <div className="container mx-auto px-4">
            <FadeInWhenVisible>
              <ProductFeatures
                features={waterFeatures}
                title={t("home.whyChoose")}
                subtitle={t("home.whyChooseSubtitle")}
              />
              <div className="text-center mt-12">
                <Button
                  asChild
                  size="lg"
                  className="bg-electric-blue text-white hover:bg-electric-blue/90"
                >
                  <Link to="/hydration">
                    {t("home.shopWaterBottles")}{" "}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </FadeInWhenVisible>
          </div>
        </section>

        {/* ===== MORE THAN ADVERTISING - Advertising Partner CTA ===== */}
        <FadeInWhenVisible direction="up">
          <AdvertisingPartnerCTA />
        </FadeInWhenVisible>

        {/* ===== RIG COLLECTIONS - Merch Carousel ===== */}
        <FadeInWhenVisible direction="up">
          <MerchCarousel />
          <div className="container text-center mt-8 mb-12">
            <Button asChild size="lg" variant="outline" className="border-2">
              <Link to="/rig">
                Browse All Merch <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </FadeInWhenVisible>

        {/* ===== THREE PILLARS SECTION ===== */}
        <section
          ref={pillarsRef}
          className="py-24 bg-muted/30 relative overflow-hidden"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-hot-lime rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-electric-blue rounded-full blur-3xl" />
          </div>

          <div className="container relative z-10">
            <FadeInWhenVisible>
              <div className="text-center mb-16 space-y-4">
                <Badge className="mb-4 bg-hot-magenta/10 text-hot-magenta border-hot-magenta/20">
                  {t("home.impactPillarsBadge")}
                </Badge>
                <h2 className="text-4xl md:text-6xl font-bold">
                  {t("home.threeWaysTitle")}{" "}
                  <span className="text-hot-lime">
                    {t("home.threeWaysTitleBold")}
                  </span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  {t("home.threeWaysSubtitle")}
                </p>
              </div>
            </FadeInWhenVisible>

            <div className="grid md:grid-cols-3 gap-8">
              <PillarCard
                icon={Droplet}
                title={t("home.pillar1Title")}
                desc={t("home.pillar1Description")}
                stats={[
                  t("home.pillar1Stat1"),
                  t("home.pillar1Stat2"),
                  t("home.pillar1Stat3"),
                ]}
                color="lime"
                link="/water"
                isInView={isInView}
                delay={0.2}
              />
              <PillarCard
                icon={Palette}
                title={t("home.pillar2Title")}
                desc={t("home.pillar2Description")}
                stats={[
                  t("home.pillar2Stat1"),
                  t("home.pillar2Stat2"),
                  t("home.pillar2Stat3"),
                ]}
                color="magenta"
                link="/theurgy"
                isInView={isInView}
                delay={0.4}
              />
              <PillarCard
                icon={GraduationCap}
                title={t("home.pillar3Title")}
                desc={t("home.pillar3Description")}
                stats={[
                  t("home.pillar3Stat1"),
                  t("home.pillar3Stat2"),
                  t("home.pillar3Stat3"),
                ]}
                color="blue"
                link="/fu"
                isInView={isInView}
                delay={0.6}
              />
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-24 bg-background relative overflow-hidden">
          <div className="container relative z-10">
            <FadeInWhenVisible>
              <div className="text-center mb-16 space-y-4">
                <Badge className="mb-4 bg-electric-blue/10 text-electric-blue border-electric-blue/20">
                  {t("home.howItWorksBadge")}
                </Badge>
                <h2 className="text-4xl md:text-6xl font-bold">
                  {t("home.howItWorksTitle")}{" "}
                  <span className="text-hot-lime">
                    {t("home.howItWorksTitleBold")}
                  </span>
                </h2>
              </div>
            </FadeInWhenVisible>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              <Link to="/hydration">
                <HowItWorksCard
                  icon={Droplet}
                  title={t("home.step1Title")}
                  description={t("home.step1Description")}
                  step={1}
                  index={0}
                  color="lime"
                />
              </Link>
              <Link to="/theurgy">
                <HowItWorksCard
                  icon={Palette}
                  title={t("home.step2Title")}
                  description={t("home.step2Description")}
                  step={2}
                  index={1}
                  color="magenta"
                />
              </Link>
              <Link to="/fu">
                <HowItWorksCard
                  icon={GraduationCap}
                  title={t("home.step3Title")}
                  description={t("home.step3Description")}
                  step={3}
                  index={2}
                  color="blue"
                />
              </Link>
              <Link to="/dashboard">
                <HowItWorksCard
                  icon={Sparkles}
                  title={t("home.step4Title")}
                  description={t("home.step4Description")}
                  step={4}
                  index={3}
                  color="orange"
                />
              </Link>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative py-32 overflow-hidden bg-black text-white">
          <div className="container relative z-10 text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              {t("home.finalCtaTitle1")}{" "}
              <span className="text-hot-lime">{t("home.finalCtaTitle2")}</span>?
            </h2>
            <Button
              asChild
              size="lg"
              className="bg-hot-lime text-black font-bold text-xl px-12 py-8 h-auto"
            >
              <Link to="/tribe">{t("home.joinTheTribe")}</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}

function PillarCard({
  icon: Icon,
  title,
  desc,
  stats,
  color,
  link,
  isInView,
  delay,
}: any) {
  const colorClass =
    color === "lime"
      ? "hot-lime"
      : color === "magenta"
        ? "hot-magenta"
        : "electric-blue";
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className={`group p-8 rounded-2xl bg-card border border-border hover:border-${colorClass}/50 transition-all`}
    >
      <div
        className={`mb-6 w-16 h-16 rounded-full bg-${colorClass}/10 flex items-center justify-center`}
      >
        <Icon className={`w-8 h-8 text-${colorClass}`} />
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-muted-foreground mb-6">{desc}</p>
      <div className="space-y-2 mb-6">
        {stats.map((stat: string, i: number) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <Check className={`w-4 h-4 text-${colorClass}`} />
            <span>{stat}</span>
          </div>
        ))}
      </div>
      <Button
        asChild
        variant="ghost"
        className={`w-full text-${colorClass} hover:bg-${colorClass}/10`}
      >
        <Link to={link}>
          Learn More <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </motion.div>
  );
}
