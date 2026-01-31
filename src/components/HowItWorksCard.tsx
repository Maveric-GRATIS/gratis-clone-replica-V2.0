/**
 * HowItWorksCard Component
 *
 * Animated card with scroll-triggered animations
 */

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface HowItWorksCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  step: number;
  index: number;
}

export function HowItWorksCard({
  icon: Icon,
  title,
  description,
  step,
  index,
}: HowItWorksCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  // Parallax effect
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.8, 1, 1, 0.8],
  );

  return (
    <motion.div
      ref={cardRef}
      style={{ y, opacity, scale }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.2,
        ease: [0.21, 0.45, 0.27, 0.9],
      }}
    >
      <Card className="relative overflow-hidden group hover:shadow-glow-lime transition-all duration-300">
        {/* Step Number Background */}
        <div className="absolute top-0 right-0 text-[120px] font-bold text-muted/5 group-hover:text-primary/10 transition-colors">
          {step}
        </div>

        <CardContent className="pt-8 pb-8 relative">
          {/* Icon */}
          <motion.div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-hot-lime to-electric-blue flex items-center justify-center mb-6"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Icon className="h-8 w-8 text-jet-black" />
          </motion.div>

          {/* Content */}
          <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed">{description}</p>

          {/* Hover Border Effect */}
          <motion.div
            className="absolute inset-0 border-2 border-primary rounded-lg opacity-0 group-hover:opacity-100"
            initial={false}
            transition={{ duration: 0.3 }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
