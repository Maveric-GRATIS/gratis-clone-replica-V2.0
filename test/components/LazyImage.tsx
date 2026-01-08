import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

/**
 * Progressive Image Loading Component with Blur-Up Effect
 * 
 * Features:
 * - Lazy loading with Intersection Observer
 * - Progressive image loading (low-quality placeholder → full resolution)
 * - Blur-up effect for smooth transitions
 * - Automatic aspect ratio handling
 * - Error fallback support
 * 
 * Usage:
 * ```tsx
 * <LazyImage
 *   src="/images/product-full.jpg"
 *   lowQualitySrc="/images/product-tiny.jpg"  // Optional: 10-50kb thumbnail
 *   alt="Product name"
 *   aspectRatio="16/9"
 * />
 * ```
 * 
 * Note: For best results, generate low-quality thumbnails (10-50kb) of your images.
 * You can use tools like:
 * - Sharp (Node.js): .resize(20, 20).blur().jpeg({ quality: 20 })
 * - ImageMagick: convert input.jpg -resize 20x20 -blur 0x2 -quality 20 output.jpg
 * - Or use a CDN service like Cloudinary with transformations
 */

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  placeholder?: React.ReactNode;
  className?: string;
  lowQualitySrc?: string; // Low-quality placeholder for blur-up effect
  aspectRatio?: string; // e.g., "16/9" or "1/1"
}

export const LazyImage = ({ 
  src, 
  alt, 
  fallback = '/placeholder.svg',
  placeholder,
  lowQualitySrc,
  aspectRatio,
  className,
  ...props 
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [placeholderLoaded, setPlaceholderLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const fullImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' } // Start loading slightly before visible
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Preload full image when in view
  useEffect(() => {
    if (isInView && !hasError) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setIsLoaded(true);
        setHasError(false);
      };
      img.onerror = () => {
        setHasError(true);
        setIsLoaded(false);
      };
      fullImgRef.current = img;
    }
  }, [isInView, src]);

  const handlePlaceholderLoad = () => {
    setPlaceholderLoaded(true);
  };

  return (
    <div 
      ref={imgRef} 
      className={cn("relative overflow-hidden bg-muted/20", className)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Animated background for before loading */}
      {!isInView && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted/40 via-muted/20 to-muted/40 animate-pulse" />
      )}
      
      {isInView && (
        <>
          {/* Low-quality blurred placeholder - loads first */}
          {lowQualitySrc && !isLoaded && (
            <img
              src={lowQualitySrc}
              alt={`${alt} placeholder`}
              onLoad={handlePlaceholderLoad}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-700",
                placeholderLoaded ? "opacity-100" : "opacity-0"
              )}
              style={{
                filter: 'blur(20px)',
                transform: 'scale(1.1)', // Prevent blur edges showing
              }}
              aria-hidden="true"
            />
          )}
          
          {/* Loading spinner/placeholder */}
          {!isLoaded && !hasError && !lowQualitySrc && (
            <div className="absolute inset-0 bg-gradient-to-br from-muted/40 via-muted/20 to-muted/40 animate-pulse flex items-center justify-center">
              {placeholder || <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />}
            </div>
          )}
          
          {/* Full resolution image - fades in when loaded */}
          <img
            src={hasError ? fallback : src}
            alt={alt}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-700 ease-out",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
            loading="lazy"
            {...props}
          />
        </>
      )}
    </div>
  );
};