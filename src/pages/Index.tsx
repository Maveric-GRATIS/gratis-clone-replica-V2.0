import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import ProductFeatures, {
  useWaterFeatures,
} from "@/components/ProductFeatures";
import MerchCarousel from "@/components/MerchCarousel";
import AdvertisingPartnerCTA from "@/components/AdvertisingPartnerCTA";
import { ProductCarousel } from "@/components/ProductCarousel";
import { TrustIndicators } from "@/components/TrustIndicators";
import { HowItWorksCard } from "@/components/HowItWorksCard";
import { MuxVideoPlayer } from "@/components/MuxVideoPlayer";
import { LiveStatsBar } from "@/components/LiveStatsBar";
import { FadeInWhenVisible } from "@/components/ScrollAnimations";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  Droplet,
  Heart,
  Users,
  Sparkles,
  ArrowRight,
  Play,
  Check,
  Globe,
  Palette,
  GraduationCap,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

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

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  const isInView = useInView(pillarsRef, { once: true, margin: "-100px" });

  return (
    <div className="min-h-screen bg-background overflow-x-hidden max-w-full">
      <SEO
        title={t("home.seoTitle")}
        description={t("home.seoDescription")}
        canonical={typeof window !== "undefined" ? window.location.href : "/"}
      />

      {/* ===== ENTERPRISE HERO SECTION WITH PARALLAX ===== */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-jet-black via-jet-black to-background"
      >
        {/* Video Background with Parallax */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-40"
            poster="https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=1920&q=80"
          >
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-pouring-water-into-a-glass-4486-large.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-jet-black/60 via-transparent to-jet-black/80" />
        </motion.div>

        {/* Hero Content with Parallax */}
        <motion.div
          className="relative z-10 container px-4 text-center space-y-8"
          style={{ y: heroY }}
        >
          {/* Badge Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Badge className="mx-auto text-sm md:text-base px-6 py-2 bg-hot-lime text-jet-black font-bold">
              100% OF NET PROFITS DONATED
            </Badge>
          </motion.div>

          {/* Main Headline with Stagger Animation */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight"
          >
            <motion.span
              className="inline-block bg-gradient-to-r from-hot-lime via-electric-blue to-hot-magenta bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Charity Never
            </motion.span>
            <br />
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Looked This <span className="text-hot-lime">Bold</span>
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Free premium water bottles. Funded by ads. Every bottle drives
            impact.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Button
              asChild
              size="lg"
              className="text-lg px-8 py-6 bg-hot-lime text-jet-black hover:bg-hot-lime/90 font-bold group"
            >
              <Link to="/hydration">
                GET FREE WATER
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20"
            >
              <Link to="/tribe">JOIN THE TRIBE</Link>
            </Button>
          </motion.div>

          {/* Trust Indicators with Avatar Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="pt-8"
          >
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 1.6 + i * 0.1 }}
                    className="w-10 h-10 rounded-full border-2 border-jet-black bg-gradient-to-br from-hot-lime to-electric-blue flex items-center justify-center text-white font-bold"
                  >
                    {String.fromCharCode(64 + i)}
                  </motion.div>
                ))}
              </div>
              <p className="text-sm text-gray-400">
                <span className="text-hot-lime font-bold">2,847+</span> members
                making impact
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Animated Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 2,
            duration: 0.6,
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 0.5,
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        >
          <ChevronDown className="w-8 h-8 text-white/60" />
        </motion.div>
      </section>

      {/* Live Impact Stats Bar - Sticky */}
      <LiveStatsBar />

      <main className="space-y-0 overflow-x-hidden max-w-full">
        {/* ===== 4-STEP ANIMATED CARDS (HOW IT WORKS) ===== */}
        <section className="py-24 bg-background relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(114,252,253,0.1),transparent_50%)]" />
          </div>

          <div className="container relative z-10">
            <FadeInWhenVisible>
              <div className="text-center mb-16 space-y-4">
                <Badge className="mb-4 bg-electric-blue/10 text-electric-blue border-electric-blue/20">
                  HOW IT WORKS
                </Badge>
                <motion.h2
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-4xl md:text-6xl font-bold"
                >
                  4 Simple Steps to{" "}
                  <span className="text-hot-lime">Impact</span>
                </motion.h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Making charitable giving accessible, transparent, and
                  impactful
                </p>
              </div>
            </FadeInWhenVisible>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0 }}
              >
                <Link to="/hydration">
                  <HowItWorksCard
                    icon={Droplet}
                    title="Get FREE Water"
                    description="Premium spring water at no cost. Every bottle funds clean water projects globally."
                    step={1}
                    index={0}
                    color="lime"
                  />
                </Link>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link to="/theurgy">
                  <HowItWorksCard
                    icon={Palette}
                    title="Support Arts"
                    description="Your choice directly supports local artists and creative programs in communities."
                    step={2}
                    index={1}
                    color="magenta"
                  />
                </Link>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link to="/fu">
                  <HowItWorksCard
                    icon={GraduationCap}
                    title="Fund Education"
                    description="Empower the next generation with access to quality education and learning resources."
                    step={3}
                    index={2}
                    color="blue"
                  />
                </Link>
              </motion.div>

              {/* Step 4 */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Link to="/dashboard">
                  <HowItWorksCard
                    icon={Sparkles}
                    title="Track Impact"
                    description="See exactly where your impact goes with real-time dashboards and verified reports."
                    step={4}
                    index={3}
                    color="orange"
                  />
                </Link>
              </motion.div>
            </div>

            {/* Impact Summary Banner */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-hot-lime/10 via-electric-blue/10 to-hot-magenta/10 border border-hot-lime/20"
            >
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-hot-lime mb-2">
                    100%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Transparency Guaranteed
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-electric-blue mb-2">
                    2.8K+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Active TRIBE Members
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-hot-magenta mb-2">
                    €84K+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Donations Distributed
                  </div>
                </div>
              </div>
              <div className="text-center mt-8">
                <Button
                  asChild
                  variant="outline"
                  className="border-hot-lime text-hot-lime hover:bg-hot-lime/10"
                >
                  <Link to="/gratis">
                    Learn More About Our Impact{" "}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== MUX VIDEO EXPLAINER (INTEGRATED) ===== */}
        <div>
          <MuxVideoPlayer
            title="See How GRATIS Works"
            description="Watch how we're revolutionizing charitable giving with transparency, innovation, and real impact. Every view supports our mission."
            badge="2 MINUTE EXPLAINER"
          />
          <div className="container text-center -mt-8 pb-12">
            <Button asChild variant="outline" className="border-2">
              <Link to="/impact-tv">
                Watch More Videos <Play className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* ===== THREE PILLARS SECTION WITH ANIMATIONS ===== */}
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
                  OUR IMPACT PILLARS
                </Badge>
                <h2 className="text-4xl md:text-6xl font-bold">
                  Three Ways We{" "}
                  <span className="text-hot-lime">Change Lives</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Every GRATIS product supports clean water, arts & culture, and
                  education worldwide
                </p>
              </div>
            </FadeInWhenVisible>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Pillar 1: Water */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="group relative p-8 rounded-2xl bg-card border border-border hover:border-hot-lime/50 transition-all duration-300 hover:shadow-xl hover:shadow-hot-lime/20"
              >
                <div className="mb-6 w-16 h-16 rounded-full bg-hot-lime/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Droplet className="w-8 h-8 text-hot-lime" />
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-hot-lime transition-colors">
                  Clean Water Access
                </h3>
                <p className="text-muted-foreground mb-6">
                  Providing sustainable water solutions to communities in need.
                  Every bottle funds wells, filtration systems, and water
                  education.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-hot-lime" />
                    <span>47 wells funded</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-hot-lime" />
                    <span>12,000+ people served</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-hot-lime" />
                    <span>100% project completion</span>
                  </div>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full mt-4 text-hot-lime hover:text-hot-lime hover:bg-hot-lime/10"
                >
                  <Link to="/water">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>

              {/* Pillar 2: Arts */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="group relative p-8 rounded-2xl bg-card border border-border hover:border-hot-magenta/50 transition-all duration-300 hover:shadow-xl hover:shadow-hot-magenta/20"
              >
                <div className="mb-6 w-16 h-16 rounded-full bg-hot-magenta/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Palette className="w-8 h-8 text-hot-magenta" />
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-hot-magenta transition-colors">
                  Arts & Culture
                </h3>
                <p className="text-muted-foreground mb-6">
                  Empowering local artists and preserving cultural heritage.
                  Supporting creative programs that bring communities together.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-hot-magenta" />
                    <span>230+ artists supported</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-hot-magenta" />
                    <span>15 community centers</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-hot-magenta" />
                    <span>50+ exhibitions funded</span>
                  </div>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full mt-4 text-hot-magenta hover:text-hot-magenta hover:bg-hot-magenta/10"
                >
                  <Link to="/theurgy">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>

              {/* Pillar 3: Education */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="group relative p-8 rounded-2xl bg-card border border-border hover:border-electric-blue/50 transition-all duration-300 hover:shadow-xl hover:shadow-electric-blue/20"
              >
                <div className="mb-6 w-16 h-16 rounded-full bg-electric-blue/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-8 h-8 text-electric-blue" />
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-electric-blue transition-colors">
                  Education Access
                </h3>
                <p className="text-muted-foreground mb-6">
                  Breaking barriers to education worldwide. Funding
                  scholarships, resources, and programs for underserved youth.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-electric-blue" />
                    <span>1,200+ students supported</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-electric-blue" />
                    <span>8 schools built</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-electric-blue" />
                    <span>€125K in scholarships</span>
                  </div>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full mt-4 text-electric-blue hover:text-electric-blue hover:bg-electric-blue/10"
                >
                  <Link to="/fu">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
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
              <div className="text-center mt-12">
                <Button
                  asChild
                  size="lg"
                  className="bg-electric-blue text-white hover:bg-electric-blue/90"
                >
                  <Link to="/hydration">
                    Shop Water Bottles <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </FadeInWhenVisible>
          </div>
        </section>

        {/* ===== TRUST INDICATORS WITH AVATARS ===== */}
        <section className="py-16 bg-background">
          <div className="container">
            <FadeInWhenVisible>
              <div className="text-center mb-12">
                <Badge className="mb-4 bg-hot-lime/10 text-hot-lime border-hot-lime/20">
                  TRUSTED BY THOUSANDS
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Join the Movement
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Thousands of impact-driven individuals and organizations trust
                  GRATIS
                </p>
              </div>

              {/* Avatar Grid with Stats */}
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-card border border-border rounded-2xl p-8"
                >
                  {/* Main Avatar Stack */}
                  <div className="flex items-center justify-center mb-8">
                    <div className="flex -space-x-4">
                      {[
                        { bg: "from-hot-lime to-electric-blue", text: "A" },
                        { bg: "from-electric-blue to-hot-magenta", text: "B" },
                        { bg: "from-hot-magenta to-hot-lime", text: "C" },
                        { bg: "from-hot-lime to-hot-magenta", text: "D" },
                        { bg: "from-electric-blue to-hot-lime", text: "E" },
                        { bg: "from-hot-magenta to-electric-blue", text: "F" },
                      ].map((avatar, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0, x: -20 }}
                          whileInView={{ opacity: 1, scale: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                          className={`w-14 h-14 rounded-full border-4 border-background bg-gradient-to-br ${avatar.bg} flex items-center justify-center text-white font-bold shadow-lg`}
                        >
                          {avatar.text}
                        </motion.div>
                      ))}
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 0.6 }}
                        className="w-14 h-14 rounded-full border-4 border-background bg-muted flex items-center justify-center text-foreground font-bold shadow-lg"
                      >
                        +2.8K
                      </motion.div>
                    </div>
                  </div>

                  {/* Trust Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold text-hot-lime mb-1">
                        2,847
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Active Members
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-electric-blue mb-1">
                        4.9/5
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Trust Rating
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-hot-magenta mb-1">
                        100%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Transparency
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-hot-lime mb-1">
                        €84K+
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Donated
                      </div>
                    </div>
                  </div>

                  {/* Verified Partners */}
                  <div className="mt-8 pt-8 border-t border-border">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                      <Check className="w-4 h-4 text-hot-lime" />
                      <span>Verified NGO Partner</span>
                    </div>
                    <TrustIndicators />
                  </div>

                  {/* CTA Button */}
                  <div className="mt-8 text-center">
                    <Button
                      asChild
                      size="lg"
                      className="bg-hot-lime text-jet-black hover:bg-hot-lime/90"
                    >
                      <Link to="/tribe">
                        Join Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              </div>
            </FadeInWhenVisible>
          </div>
        </section>

        {/* Advertising Partner CTA */}
        <FadeInWhenVisible direction="up">
          <AdvertisingPartnerCTA />
        </FadeInWhenVisible>

        {/* Merch Collection - Compact Carousel */}
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

        {/* ===== FINAL CTA SECTION WITH PARALLAX ===== */}
        <section className="relative py-32 overflow-hidden">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-hot-lime/20 via-electric-blue/20 to-hot-magenta/20" />

          {/* Animated Background Elements */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-hot-lime/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-electric-blue/10 rounded-full blur-3xl"
          />

          <div className="container relative z-10">
            <FadeInWhenVisible>
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <Badge className="mx-auto bg-hot-lime text-jet-black px-6 py-2 text-sm font-bold">
                  JOIN 2,847+ CHANGE MAKERS
                </Badge>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
                >
                  Ready To Make{" "}
                  <span className="bg-gradient-to-r from-hot-lime via-electric-blue to-hot-magenta bg-clip-text text-transparent">
                    Real Impact
                  </span>
                  ?
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
                >
                  Join thousands of TRIBE members creating positive change with
                  every choice. 100% transparent. 100% impactful.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
                >
                  <Button
                    asChild
                    size="lg"
                    className="text-lg px-10 py-7 bg-hot-lime text-jet-black hover:bg-hot-lime/90 font-bold group"
                  >
                    <Link to="/tribe">
                      Join The TRIBE
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="text-lg px-10 py-7 border-2"
                  >
                    <Link to="/events">Explore Events</Link>
                  </Button>
                </motion.div>

                {/* Social Proof Footer */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="pt-12 flex items-center justify-center gap-8 flex-wrap text-sm text-muted-foreground"
                >
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-hot-lime" />
                    <span>No hidden costs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-hot-lime" />
                    <span>Cancel anytime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-hot-lime" />
                    <span>100% transparent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-hot-lime" />
                    <span>Verified impact</span>
                  </div>
                </motion.div>
              </div>
            </FadeInWhenVisible>
          </div>
        </section>
      </main>
    </div>
  );
}
