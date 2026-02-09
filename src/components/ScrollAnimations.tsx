/**
 * ScrollAnimationSection Component
 *
 * Section with scroll-triggered reveal animations
 */

import { ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ScrollAnimationSectionProps {
  children: ReactNode;
  className?: string;
  backgroundColor?: string;
  parallax?: boolean;
}

export function ScrollAnimationSection({
  children,
  className = "",
  backgroundColor,
  parallax = false,
}: ScrollAnimationSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const yTransform = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y = parallax ? yTransform : 0;
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.section
      ref={sectionRef}
      className={className}
      style={{
        backgroundColor,
        y: parallax ? y : undefined,
      }}
    >
      <motion.div style={{ opacity }}>{children}</motion.div>
    </motion.section>
  );
}

/**
 * FadeInWhenVisible Component
 *
 * Simple fade-in animation when element enters viewport
 */
interface FadeInWhenVisibleProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}

export function FadeInWhenVisible({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: FadeInWhenVisibleProps) {
  const directionOffset = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: 40 },
    right: { y: 0, x: -40 },
  };

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        ...directionOffset[direction],
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
      }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.21, 0.45, 0.27, 0.9],
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerChildren Component
 *
 * Stagger animation for child elements
 */
interface StaggerChildrenProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerChildren({
  children,
  className = "",
  staggerDelay = 0.1,
}: StaggerChildrenProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

const staggerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.21, 0.45, 0.27, 0.9],
    },
  },
};
