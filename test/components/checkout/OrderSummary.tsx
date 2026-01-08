import { formatEuro } from '@/lib/currency';
import { CartItem } from '@/types/cart';
import { Separator } from '@/components/ui/separator';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  taxAmount?: number;
  total: number;
}

export const OrderSummary = ({ items, subtotal, shippingCost, taxAmount = 0, total }: OrderSummaryProps) => {
  return (
    <div className="bg-muted/50 rounded-lg p-6 space-y-4">
      <h3 className="font-semibold text-lg">Order Summary</h3>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{item.name}</p>
              {item.variant && (
                <p className="text-xs text-muted-foreground">
                  {item.variant.size && `Size: ${item.variant.size}`}
                  {item.variant.color && ` • ${item.variant.color}`}
                </p>
              )}
              <p className="text-sm mt-1">
                Qty: {item.quantity} × {formatEuro(item.price)}
              </p>
            </div>
            <p className="font-semibold text-sm">
              {formatEuro(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{formatEuro(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>{shippingCost === 0 ? 'FREE' : formatEuro(shippingCost)}</span>
        </div>
        {taxAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span>VAT</span>
            <span>{formatEuro(taxAmount)}</span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>{formatEuro(total)}</span>
        </div>
      </div>
    </div>
  );
};
