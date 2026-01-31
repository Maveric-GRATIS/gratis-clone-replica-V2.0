/**
 * VideoHero Component
 *
 * Hero section with video background
 */

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
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
}: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

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
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster={posterUrl}
          loop
          muted={isMuted}
          playsInline
        >
          <source src={videoUrl} type="video/mp4" />
        </video>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container text-center text-white space-y-8 px-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight animate-fade-in-up">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 animate-fade-in-up animation-delay-200">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link to={ctaLink}>{ctaText}</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20"
          >
            <Link to={secondaryCtaLink}>{secondaryCtaText}</Link>
          </Button>
        </div>
      </div>

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

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
}
