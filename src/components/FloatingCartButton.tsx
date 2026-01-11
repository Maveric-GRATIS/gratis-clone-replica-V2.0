import { ShoppingCart, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export const FloatingCartButton = () => {
  const { items, totalItems, totalPrice, openCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  if (totalItems === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end gap-2 max-w-[calc(100vw-2rem)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
    >
      {/* Mini Cart Preview */}
      <div
        className={cn(
          "bg-card border border-border rounded-lg shadow-elegant p-3 sm:p-4 w-72 sm:w-80 transition-all duration-300 origin-bottom-right",
          isHovered
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h3 className="font-semibold text-sm sm:text-base text-foreground">
            Your Cart
          </h3>
          <span className="text-xs sm:text-sm text-muted-foreground">
            {totalItems} items
          </span>
        </div>

        <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto mb-2 sm:mb-3">
          {items.slice(0, 3).map((item) => (
            <div key={item.id} className="flex gap-2 sm:gap-3 items-start">
              <img
                src={item.image}
                alt={item.name}
                className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                  {item.name}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  {item.quantity} × €{item.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
          {items.length > 3 && (
            <p className="text-xs text-muted-foreground text-center pt-2">
              +{items.length - 3} more items
            </p>
          )}
        </div>

        <div className="border-t border-border pt-3 space-y-2">
          <div className="flex justify-between items-center font-semibold">
            <span className="text-foreground">Total</span>
            <span className="text-primary">€{totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={openCart}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              View Cart
            </Button>
            <Button
              onClick={() => navigate("/checkout")}
              size="sm"
              className="flex-1"
            >
              Checkout
            </Button>
          </div>
        </div>
      </div>

      {/* FAB Button */}
      <Button
        onClick={openCart}
        size="lg"
        className="h-14 w-14 rounded-full shadow-glow hover:scale-110 transition-all duration-300 relative"
      >
        <ShoppingCart className="h-6 w-6" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </Button>
    </div>
  );
};
