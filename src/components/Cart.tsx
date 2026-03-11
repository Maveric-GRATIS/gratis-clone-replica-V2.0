import { ShoppingCart, X, Minus, Plus, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Cart = () => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    totalPrice,
    totalItems,
  } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            {t("cart.title")} ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t("cart.empty")}</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {t("cart.emptyDescription")}
            </p>
            <Button onClick={closeCart}>{t("cart.continueShopping")}</Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 sm:gap-4 bg-card p-3 sm:p-4 rounded-lg border touch-manipulation"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-xs sm:text-sm truncate">
                      {item.name}
                    </h4>
                    {item.variant && (
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                        {item.variant.size && `Size: ${item.variant.size}`}
                        {item.variant.color &&
                          ` • Color: ${item.variant.color}`}
                      </p>
                    )}
                    <p className="text-sm sm:text-base font-semibold mt-1">
                      {formatPrice(item.price)}
                    </p>

                    <div className="flex items-center gap-1.5 sm:gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 sm:h-7 sm:w-7 touch-manipulation"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3.5 w-3.5 sm:h-3 sm:w-3" />
                      </Button>
                      <span className="text-sm w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 sm:h-7 sm:w-7 touch-manipulation"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3.5 w-3.5 sm:h-3 sm:w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 sm:h-7 sm:w-7 ml-auto touch-manipulation"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 sm:h-3 sm:w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t("cart.subtotal")}</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{t("cart.shipping")}</span>
                  <span>{t("cart.shippingCalculated")}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-semibold">
                  <span>{t("cart.total")}</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full" size="lg" onClick={handleCheckout}>
                  {t("cart.checkout")}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={closeCart}
                >
                  {t("cart.continueShopping")}
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
