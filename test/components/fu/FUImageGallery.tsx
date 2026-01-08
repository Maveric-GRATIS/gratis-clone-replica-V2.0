import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FUImageGalleryProps {
  images: string[];
  productName: string;
  seriesNumber?: number;
  isWinnerCreation?: boolean;
}

export const FUImageGallery = ({ 
  images, 
  productName, 
  seriesNumber = 1,
  isWinnerCreation = false 
}: FUImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const displayImages = images.length > 0 ? images : ['/placeholder.svg'];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-700 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Series Badge */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <Badge 
            variant="secondary" 
            className={`font-black text-sm ${
              isWinnerCreation 
                ? 'bg-yellow-500 text-black' 
                : 'bg-red-500 text-white'
            }`}
          >
            SERIES #{String(seriesNumber).padStart(2, '0')}
          </Badge>
        </div>

        {/* Ultra Limited Badge */}
        <div className="absolute top-4 right-4 z-20">
          <Badge variant="outline" className="bg-black/80 border-primary text-primary font-bold">
            <Shield className="w-3 h-3 mr-1" />
            ULTRA LIMITED
          </Badge>
        </div>

        {/* Main Image with zoom effect */}
        <img
          src={displayImages[currentIndex]}
          alt={productName}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/80 border border-gray-600 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black hover:border-primary"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/80 border border-gray-600 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black hover:border-primary"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Zoom Icon */}
        <button className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-black/80 border border-gray-600 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black hover:border-primary">
          <ZoomIn className="w-5 h-5" />
        </button>

        {/* Image Counter */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-4 left-4 bg-black/80 border border-gray-600 rounded-full px-3 py-1">
            <span className="text-xs font-medium text-white">
              {currentIndex + 1} / {displayImages.length}
            </span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 justify-center">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                currentIndex === index
                  ? 'border-primary ring-2 ring-primary/30'
                  : 'border-gray-700 hover:border-gray-500'
              }`}
            >
              <img
                src={image}
                alt={`${productName} view ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
