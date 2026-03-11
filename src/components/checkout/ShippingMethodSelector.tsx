import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useCurrency } from "@/contexts/CurrencyContext";

export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimated_days_min: number;
  estimated_days_max: number;
}

interface ShippingMethodSelectorProps {
  selectedOption: ShippingOption | null;
  onSelect: (option: ShippingOption) => void;
}

// Hardcoded shipping options
const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: "standard",
    name: "Standard Shipping",
    description: "Delivery in 5-7 business days",
    price: 5.99,
    estimated_days_min: 5,
    estimated_days_max: 7,
  },
  {
    id: "express",
    name: "Express Shipping",
    description: "Delivery in 2-3 business days",
    price: 12.99,
    estimated_days_min: 2,
    estimated_days_max: 3,
  },
  {
    id: "overnight",
    name: "Overnight Shipping",
    description: "Next business day delivery",
    price: 24.99,
    estimated_days_min: 1,
    estimated_days_max: 1,
  },
];

export default function ShippingMethodSelector({
  selectedOption,
  onSelect,
}: ShippingMethodSelectorProps) {
  const { formatPrice } = useCurrency();
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Shipping Method</h2>

      <RadioGroup
        value={selectedOption?.id}
        onValueChange={(value) => {
          const option = SHIPPING_OPTIONS.find((opt) => opt.id === value);
          if (option) onSelect(option);
        }}
      >
        {SHIPPING_OPTIONS.map((option) => (
          <Card
            key={option.id}
            className={`relative cursor-pointer transition-all ${
              selectedOption?.id === option.id
                ? "ring-2 ring-primary"
                : "hover:border-primary/50"
            }`}
            onClick={() => onSelect(option)}
          >
            <div className="flex items-start gap-4 p-4">
              <RadioGroupItem value={option.id} id={option.id} />
              <Label
                htmlFor={option.id}
                className="flex-1 cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{option.name}</span>
                  <span className="font-bold">{formatPrice(option.price)}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </Label>
              {selectedOption?.id === option.id && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </div>
          </Card>
        ))}
      </RadioGroup>
    </div>
  );
}
