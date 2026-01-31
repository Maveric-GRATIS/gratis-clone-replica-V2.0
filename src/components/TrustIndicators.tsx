/**
 * TrustIndicators Component
 *
 * Social proof with member avatars and ratings
 */

import { motion } from "framer-motion";
import { Star, Users } from "lucide-react";
import { AnimatedCounterCompact } from "./AnimatedCounter";

interface TrustIndicatorsProps {
  memberCount?: number;
  rating?: number;
  reviewCount?: number;
}

export function TrustIndicators({
  memberCount = 12000,
  rating = 4.9,
  reviewCount = 2500,
}: TrustIndicatorsProps) {
  // Mock member avatars (in production: fetch from Firestore)
  const memberAvatars = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      {/* Member Avatars */}
      <motion.div
        className="flex items-center"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex -space-x-3">
          {memberAvatars.map((avatar, i) => (
            <motion.div
              key={i}
              className="relative"
              initial={{ scale: 0, x: -20 }}
              whileInView={{ scale: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: i * 0.1,
                type: "spring",
                stiffness: 300,
              }}
              whileHover={{ scale: 1.1, zIndex: 10 }}
            >
              <img
                src={avatar}
                alt={`Member ${i + 1}`}
                className="w-12 h-12 rounded-full border-2 border-background object-cover"
              />
            </motion.div>
          ))}
          <motion.div
            className="w-12 h-12 rounded-full border-2 border-background bg-primary flex items-center justify-center text-sm font-semibold"
            initial={{ scale: 0, x: -20 }}
            whileInView={{ scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.4,
              delay: memberAvatars.length * 0.1,
              type: "spring",
              stiffness: 300,
            }}
            whileHover={{ scale: 1.1, zIndex: 10 }}
          >
            <Users className="h-5 w-5" />
          </motion.div>
        </div>

        <div className="ml-4">
          <div className="text-sm font-semibold">
            <AnimatedCounterCompact
              end={memberCount}
              className="text-foreground"
            />{" "}
            members
          </div>
          <div className="text-xs text-muted-foreground">Join the TRIBE</div>
        </div>
      </motion.div>

      {/* Divider */}
      <div className="hidden sm:block h-12 w-px bg-border" />

      {/* Rating */}
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: 0.5 + i * 0.1,
                type: "spring",
                stiffness: 200,
              }}
            >
              <Star
                className={`h-5 w-5 ${
                  i < Math.floor(rating)
                    ? "fill-solar-orange text-solar-orange"
                    : "text-muted"
                }`}
              />
            </motion.div>
          ))}
        </div>

        <div>
          <div className="text-sm font-semibold">{rating} rating</div>
          <div className="text-xs text-muted-foreground">
            from {reviewCount.toLocaleString()} reviews
          </div>
        </div>
      </motion.div>
    </div>
  );
}
