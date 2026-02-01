/**
 * VideoHero Component
 *
 * Enterprise-grade hero section with parallax scroll effects
 */

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";

interface VideoHeroProps {
  videoUrl: string;
  posterUrl?: string;
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  badge?: string;
}

export function VideoHero({
  videoUrl,
  posterUrl,
  title,
  subtitle,
  ctaText = "Join TRIBE",
  ctaLink = "/tribe",
  secondaryCtaText = "Learn More",
  secondaryCtaLink = "/gratis",
  badge = "CHARITY NEVER LOOKED THIS BOLD",
}: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Autoplay video when loaded
    video.play().catch((err) => {
      console.log("Autoplay prevented:", err);
      setIsPlaying(false);
    });

    const handleCanPlay = () => {
      setIsVideoLoaded(true);
    };

    video.addEventListener("canplay", handleCanPlay);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section
      ref={heroRef}
      className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* Video Background with reduced opacity */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover opacity-40"
          poster={posterUrl}
          loop
          muted={isMuted}
          playsInline
        >
          <source src={videoUrl} type="video/mp4" />
        </video>

        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      </div>

      {/* Content with Parallax */}
      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative z-10 container text-center text-white space-y-8 px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 max-w-4xl mx-auto"
        >
          {/* Badge */}
          <Badge
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 text-sm font-semibold tracking-wide"
          >
            {badge}
          </Badge>

          {/* Title with gradient */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight">
            <span className="block">{title.split(" ")[0]}</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-purple-400">
              {title.split(" ").slice(1).join(" ")}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* CTA Buttons with stagger animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button asChild size="lg" className="text-lg px-8 py-6 group">
            <Link to={ctaLink}>
              {ctaText}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20"
          >
            <Link to={secondaryCtaLink}>{secondaryCtaText}</Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Video Controls */}
      {isVideoLoaded && (
        <div className="absolute bottom-8 right-8 z-10 flex gap-2">
          <Button
            size="icon"
            variant="secondary"
            onClick={togglePlay}
            className="bg-white/10 backdrop-blur hover:bg-white/20 text-white"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
          <Button
            size="icon"
            variant="secondary"
            onClick={toggleMute}
            className="bg-white/10 backdrop-blur hover:bg-white/20 text-white"
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
        </div>
      )}

      {/* Animated Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.8,
          duration: 0.6,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 0.5,
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-white/70 uppercase tracking-wider">
            Scroll
          </span>
          <ChevronDown className="h-6 w-6 text-white/70" />
        </div>
      </motion.div>
    </section>
  );
}
