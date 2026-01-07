import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export const ScrollProgressBar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let rafId: number;
    let lastScrollY = 0;

    const updateScrollProgress = () => {
      const currentScrollY = window.scrollY;
      
      // Only update if scroll changed significantly (reduce micro-updates)
      if (Math.abs(currentScrollY - lastScrollY) < 5) return;
      
      lastScrollY = currentScrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (currentScrollY / scrollHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateScrollProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1">
      <div
        className={cn(
          "h-full transition-all duration-150 ease-out",
          "bg-gradient-to-r from-primary via-accent to-brand-blue"
        )}
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};
