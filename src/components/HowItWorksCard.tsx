/**
 * HowItWorksCard Component - Enterprise Grade
 *
 * Premium animated card with scroll-triggered animations and hover effects
 */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface HowItWorksCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  step: number;
  index: number;
  color?: string;
}

const colorClasses = {
  lime: "from-hot-lime to-hot-lime/70",
  blue: "from-electric-blue to-electric-blue/70",
  magenta: "from-hot-magenta to-hot-magenta/70",
  orange: "from-solar-orange to-solar-orange/70",
};

export function HowItWorksCard({
  icon: Icon,
  title,
  description,
  step,
  index,
  color = "lime",
}: HowItWorksCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  const gradientClass =
    colorClasses[color as keyof typeof colorClasses] || colorClasses.lime;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.21, 0.45, 0.27, 0.9],
      }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 h-full border-2 border-transparent hover:border-primary/20">
        {/* Animated Background Gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.5 }}
        />

        {/* Step Number Badge */}
        <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-jet-black to-jet-black/80 text-white flex items-center justify-center font-bold text-lg shadow-lg z-10">
          {step}
        </div>

        {/* Large Step Number Background */}
        <div className="absolute top-4 right-4 text-[100px] font-bold text-muted/5 leading-none pointer-events-none">
          {step}
        </div>

        <CardContent className="pt-12 pb-8 px-6 relative">
          {/* Animated Icon */}
          <motion.div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradientClass} flex items-center justify-center mb-6 shadow-lg`}
            whileHover={{
              scale: 1.1,
              rotate: [0, -5, 5, -5, 0],
              transition: { duration: 0.5 },
            }}
          >
            <Icon className="h-8 w-8 text-white" strokeWidth={2.5} />
          </motion.div>

          {/* Content */}
          <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            {description}
          </p>

          {/* Hover Arrow Indicator */}
          <motion.div
            className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100"
            initial={false}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
