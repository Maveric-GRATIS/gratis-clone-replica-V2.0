import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { CheckoutSteps } from '@/components/checkout/CheckoutSteps';
import { ShippingAddressForm, ShippingFormData } from '@/components/checkout/ShippingAddressForm';
import ShippingMethodSelector from '@/components/checkout/ShippingMethodSelector';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { OrderReview } from '@/components/checkout/OrderReview';
import { StripePaymentForm } from '@/components/checkout/StripePaymentForm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SEO } from '@/components/SEO';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface ShippingOption {
  id: string;
  name: string;
  description: string | null;
  price: number;
  estimated_days_min: number | null;
  estimated_days_max: number | null;
}

// EU VAT rates by country code
const VAT_RATES: { [key: string]: number } = {
  'AT': 0.20, 'BE': 0.21, 'BG': 0.20, 'HR': 0.25, 'CY': 0.19,
  'CZ': 0.21, 'DK': 0.25, 'EE': 0.22, 'FI': 0.24, 'FR': 0.20,
  'DE': 0.19, 'GR': 0.24, 'HU': 0.27, 'IE': 0.23, 'IT': 0.22,
  'LV': 0.21, 'LT': 0.21, 'LU': 0.17, 'MT': 0.18, 'NL': 0.21,
  'PL': 0.23, 'PT': 0.23, 'RO': 0.19, 'SK': 0.20, 'SI': 0.22,
  'ES': 0.21, 'SE': 0.25,
};

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(null);
  const [shippingOption, setShippingOption] = useState<ShippingOption | null>(null);
  const [processing, setProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  if (items.length === 0 && currentStep === 1) {
    navigate('/rig-store');
    return null;
  }

  const subtotal = totalPrice;
  const shippingCost = shippingOption?.price || 0;
  const vatRate = shippingData ? (VAT_RATES[shippingData.country] || 0) : 0;
  const taxAmount = (subtotal + shippingCost) * vatRate;
  const total = subtotal + shippingCost + taxAmount;

  const handleShippingSubmit = (data: ShippingFormData) => {
    setShippingData(data);
    setCurrentStep(2);
  };

  const handleShippingSelect = (option: ShippingOption) => {
    setShippingOption(option);
    setCurrentStep(3);
  };

  const handleReviewContinue = async () => {
    setProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'Please log in to complete your order.',
          variant: 'destructive',
        });
        navigate('/auth');
        return;
      }

      if (!shippingData || !shippingOption) {
        toast({
          title: 'Missing information',
          description: 'Please complete all checkout steps.',
          variant: 'destructive',
        });
        return;
      }

      // Create order via edge function
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-order', {
        body: {
          items: items,
          shippingData: shippingData,
          shippingOption: shippingOption,
        },
      });

      if (orderError) throw orderError;
      if (!orderData.success) throw new Error(orderData.error || 'Failed to create order');

      setOrderId(orderData.order.id);

      // Create payment intent
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke('create-payment-intent', {
        body: {
          amount: total,
          orderId: orderData.order.id,
        },
      });

      if (paymentError) throw paymentError;
      if (!paymentData.clientSecret) throw new Error('Failed to create payment intent');

      setClientSecret(paymentData.clientSecret);
      setCurrentStep(4);

      toast({
        title: 'Order created',
        description: 'Please complete payment to confirm your order.',
      });
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: 'Order creation failed',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentSuccess = async () => {
    // Order confirmation email is handled by the Stripe webhook (stripe-webhook/index.ts)
    // when payment_intent.succeeded event is received
    clearCart();
    navigate(`/order-confirmation/${orderId}`);
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: 'Payment failed',
      description: error,
      variant: 'destructive',
    });
  };

  return (
    <>
      <SEO
        title="Checkout"
        description="Complete your purchase securely"
      />
      <div className="min-h-screen bg-background py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => {
              if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
              } else {
                navigate('/rig-store');
              }
            }}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-muted-foreground mb-8">Complete your order in a few simple steps</p>

          <CheckoutSteps currentStep={currentStep} />

          <div className="grid lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2">
              <Card className="p-6">
                {currentStep === 1 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
                    <ShippingAddressForm
                      onSubmit={handleShippingSubmit}
                      defaultValues={shippingData || undefined}
                    />
                  </div>
                )}

                {currentStep === 2 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Delivery Method</h2>
                    <ShippingMethodSelector
                      onSelect={handleShippingSelect}
                      selectedOption={shippingOption}
                    />
                  </div>
                )}

                {currentStep === 3 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Review Order</h2>
                    <OrderReview
                      items={items}
                      shippingData={shippingData!}
                      shippingOption={shippingOption!}
                      subtotal={subtotal}
                      shippingCost={shippingCost}
                      taxAmount={taxAmount}
                      total={total}
                      onEdit={setCurrentStep}
                      onContinue={handleReviewContinue}
                    />
                  </div>
                )}

                {currentStep === 4 && clientSecret && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Payment</h2>
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <StripePaymentForm
                        amount={total}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                      />
                    </Elements>
                  </div>
                )}
              </Card>
            </div>

            <div className="lg:col-span-1">
              <OrderSummary
                items={items}
                subtotal={subtotal}
                shippingCost={shippingCost}
                taxAmount={taxAmount}
                total={total}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
