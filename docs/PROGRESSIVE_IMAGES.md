# Progressive Image Loading Guide

The application uses progressive image loading with blur-up effect for optimal performance and user experience.

## How It Works

1. **Initial State**: A subtle animated gradient placeholder appears
2. **Low-Quality Load**: If provided, a tiny blurred image (10-50kb) loads first
3. **Full Resolution**: The full image loads in the background and fades in smoothly
4. **Lazy Loading**: Images only load when they're about to enter the viewport

## Usage

### Basic Usage
```tsx
import { LazyImage } from '@/components/LazyImage';

<LazyImage
  src="/images/product-full.jpg"
  alt="Product name"
  aspectRatio="1/1"
/>
```

### With Blur-Up Effect
```tsx
<LazyImage
  src="/images/product-full.jpg"
  lowQualitySrc="/images/product-tiny.jpg"  // 10-50kb thumbnail
  alt="Product name"
  aspectRatio="16/9"
/>
```

### With Custom Fallback
```tsx
<LazyImage
  src="/images/product.jpg"
  fallback="/images/placeholder.svg"
  alt="Product name"
/>
```

## Generating Low-Quality Placeholders

### Option 1: Sharp (Node.js)
```javascript
const sharp = require('sharp');

sharp('input.jpg')
  .resize(20, 20)
  .blur(2)
  .jpeg({ quality: 20 })
  .toFile('output-tiny.jpg');
```

### Option 2: ImageMagick (CLI)
```bash
convert input.jpg \
  -resize 20x20 \
  -blur 0x2 \
  -quality 20 \
  output-tiny.jpg
```

### Option 3: Cloudinary
```
https://res.cloudinary.com/demo/image/upload/w_20,h_20,q_20,e_blur:1000/sample.jpg
```

### Option 4: imgix
```
https://assets.imgix.net/image.jpg?w=20&h=20&blur=200&q=20
```

## Best Practices

### 1. Placeholder Size
- Generate thumbnails at 10-50px width
- Keep file size under 5-10kb
- Use aggressive blur (10-20px radius)
- Reduce quality (20-30%)

### 2. Aspect Ratios
Use consistent aspect ratios to prevent layout shifts:
- Product images: `"1/1"` (square)
- Hero images: `"16/9"` (widescreen)
- Portraits: `"3/4"` or `"2/3"`

### 3. Performance Tips
- Inline data URLs for very small placeholders (<2kb)
- Use WebP format for better compression
- Implement on critical above-the-fold images first
- Consider using a CDN with automatic image optimization

### 4. Accessibility
- Always provide descriptive `alt` text
- Ensure color contrast in placeholders
- Support prefers-reduced-motion

## Implementation Example

```tsx
// Product Card with Progressive Loading
<Card>
  <LazyImage
    src={product.imageUrl}
    lowQualitySrc={product.thumbnailUrl}
    alt={product.name}
    aspectRatio="1/1"
    className="hover:scale-105 transition-transform duration-500"
  />
  <CardContent>
    <h3>{product.name}</h3>
    <p>{product.price}</p>
  </CardContent>
</Card>
```

## Current Implementation

Progressive image loading is currently active in:
- ✅ Product cards (`ProductCard.tsx`)
- ✅ Product carousels (`WaterCarousel.tsx`, `MerchCarousel.tsx`)
- ✅ Image galleries (`ImageGallery.tsx`)
- ✅ All pages using `LazyImage` component

## Future Enhancements

Consider implementing:
1. Automatic thumbnail generation on upload
2. CDN integration for on-the-fly optimization
3. Native lazy loading fallback
4. AVIF format support for even better compression
5. Blur hash generation for placeholders
