/**
 * Image utility functions for progressive loading and optimization
 */

/**
 * Generate a tiny placeholder data URL for blur-up effect
 * This creates a 1x1 colored pixel as a placeholder
 * In a real application, you would generate actual low-quality thumbnails
 */
export const generatePlaceholder = (color: string = '#1a1a1a'): string => {
  // Create a 1x1 pixel data URL with the specified color
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    return canvas.toDataURL();
  }
  
  // Fallback: return a data URL for a 1x1 transparent pixel
  return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
};

/**
 * Extract dominant color from image URL (simplified version)
 * In production, you'd want to do this server-side or use a service
 */
export const getDominantColor = (imageUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve('#1a1a1a');
        return;
      }
      
      canvas.width = 1;
      canvas.height = 1;
      
      ctx.drawImage(img, 0, 0, 1, 1);
      
      try {
        const data = ctx.getImageData(0, 0, 1, 1).data;
        const rgb = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
        resolve(rgb);
      } catch (e) {
        resolve('#1a1a1a');
      }
    };
    
    img.onerror = () => resolve('#1a1a1a');
    img.src = imageUrl;
  });
};

/**
 * Check if image is cached in browser
 */
export const isImageCached = (src: string): boolean => {
  const img = new Image();
  img.src = src;
  return img.complete;
};

/**
 * Preload images
 */
export const preloadImages = (urls: string[]): Promise<void[]> => {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = url;
        })
    )
  );
};
