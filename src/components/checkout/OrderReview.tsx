import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Edit2 } from "lucide-react";
import { useState } from "react";

interface OrderReviewProps {
  items: any[];
  shippingData: any;
  shippingOption: any;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  total: number;
  onEdit: (step: number) => void;
  onContinue: () => void;
}

export const OrderReview = ({
  items,
  shippingData,
  shippingOption,
  subtotal,
  shippingCost,
  taxAmount,
  total,
  onEdit,
  onContinue,
}: OrderReviewProps) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const { formatPrice } = useCurrency();

  return (
    <div className="space-y-6">
      {/* Order Items */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Order Items</h3>
          <Button variant="ghost" size="sm" onClick={() => onEdit(1)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                {item.variant && (
                  <p className="text-sm text-muted-foreground">
                    {Object.entries(item.variant)
                      .filter(([_, value]) => value)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(", ")}
                  </p>
                )}
                <p className="text-sm">Quantity: {item.quantity}</p>
              </div>
              <p className="font-medium">
                {formatEuro(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Shipping Address */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Shipping Address</h3>
          <Button variant="ghost" size="sm" onClick={() => onEdit(1)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
        <div className="space-y-1 text-sm">
          <p>{shippingData.fullName}</p>
          <p>{shippingData.addressLine1}</p>
          {shippingData.addressLine2 && <p>{shippingData.addressLine2}</p>}
          <p>
            {shippingData.city}, {shippingData.stateProvince}{" "}
            {shippingData.postalCode}
          </p>
          <p>{shippingData.country}</p>
          <p>{shippingData.phone}</p>
        </div>
      </Card>

      {/* Shipping Method */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Delivery Method</h3>
          <Button variant="ghost" size="sm" onClick={() => onEdit(2)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium">{shippingOption.name}</p>
            {shippingOption.description && (
              <p className="text-sm text-muted-foreground">
                {shippingOption.description}
              </p>
            )}
            {shippingOption.estimated_days_min &&
              shippingOption.estimated_days_max && (
                <p className="text-sm text-muted-foreground">
                  Estimated delivery: {shippingOption.estimated_days_min}-
                  {shippingOption.estimated_days_max} business days
                </p>
              )}
          </div>
          <p className="font-medium">{formatPrice(shippingOption.price)}</p>
        </div>
      </Card>

      {/* Order Summary */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{formatPrice(shippingCost)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>VAT</span>
            <span>{formatPrice(taxAmount)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </Card>

      {/* Terms & Newsletter */}
      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
          />
          <Label
            htmlFor="terms"
            className="text-sm leading-relaxed cursor-pointer"
          >
            I agree to the terms and conditions and privacy policy
          </Label>
        </div>
        <div className="flex items-start space-x-2">
          <Checkbox
            id="newsletter"
            checked={newsletter}
            onCheckedChange={(checked) => setNewsletter(checked as boolean)}
          />
          <Label
            htmlFor="newsletter"
            className="text-sm leading-relaxed cursor-pointer"
          >
            Subscribe to our newsletter for exclusive offers and updates
          </Label>
        </div>
      </div>

      <Button
        onClick={onContinue}
        disabled={!termsAccepted}
        className="w-full"
        size="lg"
      >
        Continue to Payment
      </Button>
    </div>
  );
};
