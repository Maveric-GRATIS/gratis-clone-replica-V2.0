import { ReactNode } from "react";
import { FadeInWhenVisible } from "@/components/ScrollAnimations";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
}

export function ScrollReveal({
  children,
  direction = "up",
}: ScrollRevealProps) {
  return (
    <FadeInWhenVisible direction={direction}>{children}</FadeInWhenVisible>
  );
}
