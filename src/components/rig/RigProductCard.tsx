import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Star } from "lucide-react";
import type { RigProduct } from "@/hooks/useRigProducts";
import { useCartActions } from "@/hooks/useCartActions";

// Deterministic colour from a string (for placeholder backgrounds)
function stringToHsl(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 55%, 30%)`;
}

interface RigProductCardProps {
  product: RigProduct;
}

export function RigProductCard({ product }: RigProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCartActions();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.item_name,
      price: product.price,
      image: "",
      category: "merch",
      variant: selectedSize ? { size: selectedSize } : {},
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const bg = stringToHsl(product.item_name);

  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Placeholder image / colour swatch */}
      <div
        className="relative aspect-[4/5] flex items-center justify-center text-4xl select-none"
        style={{ background: `linear-gradient(135deg, ${bg} 0%, #111 100%)` }}
      >
        <span className="text-5xl">
          {product.category === "hoodie"
            ? "🧥"
            : product.category === "tshirt"
              ? "👕"
              : product.category === "pants"
                ? "👖"
                : product.category === "shorts"
                  ? "🩳"
                  : product.category === "jacket"
                    ? "🥼"
                    : product.category === "cap"
                      ? "🧢"
                      : product.category === "beanie"
                        ? "🪖"
                        : product.category === "hat"
                          ? "🎩"
                          : product.category === "set"
                            ? "👗"
                            : product.category === "top"
                              ? "👚"
                              : product.category === "coat"
                                ? "🥼"
                                : product.category === "sweatshirt"
                                  ? "👕"
                                  : product.category === "tracksuit"
                                    ? "🏃"
                                    : product.category === "pullover"
                                      ? "🧣"
                                      : product.category === "shirt"
                                        ? "👔"
                                        : product.category === "longsleeve"
                                          ? "🧥"
                                          : product.category === "accessory"
                                            ? "👜"
                                            : "🛍️"}
        </span>

        {product.featured && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-[#C1FF00] text-black text-xs font-bold flex items-center gap-1">
              <Star className="h-3 w-3 fill-black" /> FEATURED
            </Badge>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            {product.category}
          </p>
          <h3 className="font-bold text-sm leading-snug line-clamp-2">
            {product.item_name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Colour swatches */}
        {product.color_options.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.color_options.slice(0, 5).map((c) => (
              <span
                key={c}
                className="text-xs border border-border rounded px-1.5 py-0.5 text-muted-foreground"
              >
                {c}
              </span>
            ))}
            {product.color_options.length > 5 && (
              <span className="text-xs text-muted-foreground">
                +{product.color_options.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Size chips */}
        {product.sizes_available.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.sizes_available.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s === selectedSize ? null : s)}
                className={`text-xs border rounded px-2 py-0.5 transition-colors ${
                  selectedSize === s
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
          <span className="text-lg font-bold">€{product.price.toFixed(2)}</span>
          <Button
            size="sm"
            onClick={handleAddToCart}
            className={`transition-all ${added ? "bg-green-600 hover:bg-green-600" : ""}`}
          >
            <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
            {added ? "Added!" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
