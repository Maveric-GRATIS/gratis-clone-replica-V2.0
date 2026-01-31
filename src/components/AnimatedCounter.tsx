import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  separator?: string;
}

export const AnimatedCounter = ({
  end,
  duration = 2000,
  prefix = "",
  suffix = "",
  decimals = 0,
  separator = ",",
}: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (inView && !hasAnimated.current) {
      hasAnimated.current = true;
      let startTime: number;
      let animationFrame: number;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(end * easeOutQuart);

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);

      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    }
  }, [inView, end, duration]);

  const formatNumber = (num: number): string => {
    const fixed = num.toFixed(decimals);
    const parts = fixed.split(".");
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return decimals > 0 ? `${integerPart}.${parts[1]}` : integerPart;
  };

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  );
};

/**
 * Compact number formatter for large numbers
 */
export const AnimatedCounterCompact = ({
  end,
  duration = 2000,
  className = "",
}: {
  end: number;
  duration?: number;
  className?: string;
}) => {
  const formatCompact = (num: number): { value: number; suffix: string } => {
    if (num >= 1000000) {
      return { value: num / 1000000, suffix: "M" };
    }
    if (num >= 1000) {
      return { value: num / 1000, suffix: "K" };
    }
    return { value: num, suffix: "" };
  };

  const { value, suffix } = formatCompact(end);

  return (
    <span className={className}>
      <AnimatedCounter
        end={value}
        duration={duration}
        decimals={value < 10 ? 1 : 0}
        suffix={suffix}
      />
    </span>
  );
};
