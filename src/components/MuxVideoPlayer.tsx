/**
 * MuxVideoPlayer Component
 *
 * Enterprise video player with Mux integration
 */

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Play, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MuxVideoPlayerProps {
  playbackId?: string;
  title?: string;
  description?: string;
  posterUrl?: string;
  autoPlay?: boolean;
  badge?: string;
}

export function MuxVideoPlayer({
  playbackId,
  title = "How GRATIS Works",
  description = "Watch how GRATIS is revolutionizing charitable giving in just 2 minutes.",
  posterUrl = "https://images.unsplash.com/photo-1532619187608-e5375cab36aa?w=1200&q=80",
  autoPlay = false,
  badge = "HOW IT WORKS",
}: MuxVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const handlePlay = () => {
    setIsLoading(true);
    setIsPlaying(true);
    // In production, this would trigger Mux player
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-12"
        >
          {badge && (
            <Badge
              variant="outline"
              className="mb-4 border-primary text-primary"
            >
              {badge}
            </Badge>
          )}
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground">{description}</p>
        </motion.div>

        {/* Video Player */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative aspect-video max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl"
        >
          {!isPlaying ? (
            // Poster with Play Button
            <div
              className="relative w-full h-full group cursor-pointer"
              onClick={handlePlay}
            >
              <img
                src={posterUrl}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-[0_0_40px_rgba(193,255,0,0.5)] group-hover:shadow-[0_0_60px_rgba(193,255,0,0.8)] transition-shadow duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-10 h-10 text-jet-black animate-spin" />
                  ) : (
                    <Play
                      className="w-10 h-10 text-jet-black ml-1"
                      fill="currentColor"
                    />
                  )}
                </motion.button>
              </div>

              {/* Duration Badge */}
              <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur text-white text-sm font-medium">
                2:30
              </div>
            </div>
          ) : (
            // Video Player (Mux or fallback)
            <div className="w-full h-full bg-black flex items-center justify-center">
              {playbackId ? (
                // Mux Player - would be imported dynamically
                <div className="text-white">
                  {/* In production: <MuxPlayer playbackId={playbackId} /> */}
                  <p>Mux Player: {playbackId}</p>
                </div>
              ) : (
                // Fallback HTML5 Video
                <video
                  className="w-full h-full"
                  controls
                  autoPlay={autoPlay}
                  poster={posterUrl}
                >
                  <source
                    src="https://assets.mixkit.co/videos/preview/mixkit-people-pouring-a-warm-drink-around-a-campfire-18566-large.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}
        </motion.div>

        {/* Video Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>15K+ views</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
          <span>Average rating: 4.9/5</span>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
          <span>Duration: 2:30</span>
        </motion.div>
      </div>
    </section>
  );
}
