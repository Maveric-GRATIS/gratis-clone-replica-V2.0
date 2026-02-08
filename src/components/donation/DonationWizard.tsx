/**
 * DonationWizard Component
 * Complete multi-step donation flow with Stripe integration, allocation sliders, and PDF receipts
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CreditCard,
  Heart,
  TrendingUp,
  Download,
  DollarSign,
  Calendar,
  Droplet,
  GraduationCap,
  Users,
  Leaf,
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import jsPDF from "jspdf";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "",
);

// Step 1: Amount Selection
const amountSchema = z.object({
  amount: z.number().min(5, "Minimum donation is €5"),
  frequency: z.enum(["once", "monthly", "quarterly", "annually"]),
  isCustom: z.boolean().optional(),
});

// Step 2: Impact Allocation
const allocationSchema = z.object({
  cleanWater: z.number().min(0).max(100),
  education: z.number().min(0).max(100),
  healthcare: z.number().min(0).max(100),
  environment: z.number().min(0).max(100),
});

// Step 3: Donor Information
const donorInfoSchema = z.object({
  firstName: z.string().min(2, "First name required"),
  lastName: z.string().min(2, "Last name required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  company: z.string().optional(),
  anonymous: z.boolean().optional(),
  taxReceipt: z.boolean().optional(),
  newsletter: z.boolean().optional(),
});

// Step 4: Payment
const paymentSchema = z.object({
  acceptTerms: z.boolean().refine((val) => val === true, "Must accept terms"),
});

type AmountFormData = z.infer<typeof amountSchema>;
type AllocationFormData = z.infer<typeof allocationSchema>;
type DonorInfoFormData = z.infer<typeof donorInfoSchema>;
type PaymentFormData = z.infer<typeof paymentSchema>;

const presetAmounts = [
  { amount: 10, impact: "1 person clean water for 1 month" },
  { amount: 25, impact: "School supplies for 5 children" },
  { amount: 50, impact: "Medical supplies for a clinic" },
  { amount: 100, impact: "Water filter for a family" },
  { amount: 250, impact: "Education program for 10 students" },
  { amount: 500, impact: "Community well construction" },
];

const allocationCategories = [
  {
    id: "cleanWater",
    name: "Clean Water",
    icon: Droplet,
    color: "#3b82f6",
    description: "Provide safe drinking water and sanitation",
  },
  {
    id: "education",
    name: "Education",
    icon: GraduationCap,
    color: "#8b5cf6",
    description: "Support schools and educational programs",
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: Heart,
    color: "#ef4444",
    description: "Fund medical supplies and health initiatives",
  },
  {
    id: "environment",
    name: "Environment",
    icon: Leaf,
    color: "#10b981",
    description: "Promote sustainability and conservation",
  },
];

export function DonationWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<
    Partial<{
      amount: AmountFormData;
      allocation: AllocationFormData;
      donorInfo: DonorInfoFormData;
      payment: PaymentFormData;
    }>
  >({});
  const { toast } = useToast();

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const handleNextStep = (data: any) => {
    setFormData({ ...formData, ...data });
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Heart className="h-8 w-8 text-primary" />
          Make a Donation
        </h1>
        <p className="text-muted-foreground">
          Your contribution creates lasting impact in communities worldwide
        </p>
        <Progress value={progress} className="mt-4" />
        <p className="text-sm text-muted-foreground mt-2">
          Step {step} of {totalSteps}
        </p>
      </div>

      {step === 1 && (
        <Step1Amount onNext={handleNextStep} defaultValues={formData.amount} />
      )}
      {step === 2 && (
        <Step2Allocation
          onNext={handleNextStep}
          onBack={handlePrevStep}
          defaultValues={formData.allocation}
          amount={formData.amount?.amount || 0}
        />
      )}
      {step === 3 && (
        <Step3DonorInfo
          onNext={handleNextStep}
          onBack={handlePrevStep}
          defaultValues={formData.donorInfo}
        />
      )}
      {step === 4 && (
        <Elements stripe={stripePromise}>
          <Step4Payment
            onNext={handleNextStep}
            onBack={handlePrevStep}
            formData={formData}
          />
        </Elements>
      )}
      {step === 5 && <Step5Confirmation formData={formData} />}
    </div>
  );
}

// Step 1: Amount Selection
function Step1Amount({
  onNext,
  defaultValues,
}: {
  onNext: (data: { amount: AmountFormData }) => void;
  defaultValues?: AmountFormData;
}) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(
    defaultValues?.amount || null,
  );
  const [customAmount, setCustomAmount] = useState("");
  const [frequency, setFrequency] = useState<
    "once" | "monthly" | "quarterly" | "annually"
  >(defaultValues?.frequency || "once");

  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AmountFormData>({
    resolver: zodResolver(amountSchema),
    defaultValues,
  });

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    setValue("amount", amount);
    setValue("isCustom", false);
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setSelectedAmount(numValue);
      setValue("amount", numValue);
      setValue("isCustom", true);
    }
  };

  const onSubmit = (data: AmountFormData) => {
    if (!selectedAmount) return;
    onNext({
      amount: {
        amount: selectedAmount,
        frequency,
        isCustom: !!customAmount,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Choose Your Donation Amount
          </CardTitle>
          <CardDescription>
            Select a preset amount or enter a custom amount
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Frequency Selection */}
          <div className="space-y-3">
            <Label>Donation Frequency</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: "once", label: "One-time", icon: Heart },
                { value: "monthly", label: "Monthly", icon: Calendar },
                { value: "quarterly", label: "Quarterly", icon: Calendar },
                { value: "annually", label: "Annually", icon: Calendar },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setFrequency(value as any);
                    setValue("frequency", value as any);
                  }}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    frequency === value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Icon className="h-5 w-5 mx-auto mb-2" />
                  <p className="text-sm font-medium">{label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Preset Amounts */}
          <div className="space-y-3">
            <Label>Amount</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {presetAmounts.map(({ amount, impact }) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handleAmountSelect(amount)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    selectedAmount === amount && !customAmount
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <p className="text-2xl font-bold mb-1">€{amount}</p>
                  <p className="text-xs text-muted-foreground">{impact}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="space-y-2">
            <Label htmlFor="customAmount">Custom Amount (€)</Label>
            <Input
              id="customAmount"
              type="number"
              min="5"
              step="1"
              placeholder="Enter custom amount"
              value={customAmount}
              onChange={(e) => handleCustomAmount(e.target.value)}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Impact Preview */}
          {selectedAmount && (
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-sm mb-1">Your Impact</p>
                  {frequency === "monthly" && (
                    <p className="text-sm text-muted-foreground">
                      €{selectedAmount * 12}/year - Sustainable recurring
                      support
                    </p>
                  )}
                  {frequency === "quarterly" && (
                    <p className="text-sm text-muted-foreground">
                      €{selectedAmount * 4}/year - Quarterly impact
                    </p>
                  )}
                  {frequency === "annually" && (
                    <p className="text-sm text-muted-foreground">
                      €{selectedAmount}/year - Annual commitment
                    </p>
                  )}
                  {frequency === "once" && (
                    <p className="text-sm text-muted-foreground">
                      One-time donation of €{selectedAmount}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={!selectedAmount}
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}

// Step 2: Impact Allocation
function Step2Allocation({
  onNext,
  onBack,
  defaultValues,
  amount,
}: {
  onNext: (data: { allocation: AllocationFormData }) => void;
  onBack: () => void;
  defaultValues?: AllocationFormData;
  amount: number;
}) {
  const [allocation, setAllocation] = useState<Record<string, number>>(
    defaultValues || {
      cleanWater: 40,
      education: 30,
      healthcare: 20,
      environment: 10,
    },
  );

  const handleSliderChange = (category: string, value: number[]) => {
    const newValue = value[0];
    const currentTotal = Object.values(allocation).reduce(
      (sum, val) => sum + val,
      0,
    );
    const currentValue = allocation[category];
    const availableToAdd = 100 - (currentTotal - currentValue);

    if (newValue <= currentValue || newValue <= currentValue + availableToAdd) {
      setAllocation({ ...allocation, [category]: newValue });
    }
  };

  const normalizeAllocation = () => {
    const total = Object.values(allocation).reduce((sum, val) => sum + val, 0);
    if (total === 100) return allocation;

    const normalized = { ...allocation };
    const diff = 100 - total;
    const categories = Object.keys(normalized);
    const perCategory = Math.floor(diff / categories.length);
    let remainder = diff % categories.length;

    categories.forEach((cat) => {
      normalized[cat] += perCategory;
      if (remainder > 0) {
        normalized[cat] += 1;
        remainder--;
      }
    });

    return normalized;
  };

  const handleContinue = () => {
    const normalized = normalizeAllocation();
    onNext({
      allocation: normalized as AllocationFormData,
    });
  };

  const total = Object.values(allocation).reduce((sum, val) => sum + val, 0);
  const pieData = allocationCategories.map((cat) => ({
    name: cat.name,
    value: allocation[cat.id],
    color: cat.color,
    amount: ((allocation[cat.id] / 100) * amount).toFixed(2),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Allocate Your Impact</CardTitle>
        <CardDescription>
          Choose how your €{amount} donation will be distributed across our
          initiatives
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Real-time Pie Chart */}
        <div className="bg-accent/50 rounded-lg p-6">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name} ${value}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ payload }) => {
                  if (payload && payload[0]) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background border rounded-lg p-3 shadow-lg">
                        <p className="font-semibold">{data.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {data.value}% (€{data.amount})
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Total: {total}%{" "}
              {total !== 100 && (
                <span className="text-amber-600">(adjust to 100%)</span>
              )}
            </p>
          </div>
        </div>

        {/* Interactive Sliders */}
        <div className="space-y-6">
          {allocationCategories.map((category) => {
            const Icon = category.icon;
            const value = allocation[category.id];
            const euroAmount = ((value / 100) * amount).toFixed(2);

            return (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon
                      className="h-4 w-4"
                      style={{ color: category.color }}
                    />
                    <Label className="font-medium">{category.name}</Label>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      style={{ borderColor: category.color }}
                    >
                      {value}% - €{euroAmount}
                    </Badge>
                  </div>
                </div>
                <Slider
                  value={[value]}
                  onValueChange={(val) => handleSliderChange(category.id, val)}
                  max={100}
                  step={5}
                  className="py-4"
                  style={{
                    // @ts-expect-error - CSS custom property
                    "--slider-thumb": category.color,
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  {category.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Equal Distribution Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() =>
            setAllocation({
              cleanWater: 25,
              education: 25,
              healthcare: 25,
              environment: 25,
            })
          }
        >
          Equal Distribution (25% each)
        </Button>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button
            type="button"
            onClick={handleContinue}
            className="flex-1"
            disabled={total !== 100}
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Step 3: Donor Information
function Step3DonorInfo({
  onNext,
  onBack,
  defaultValues,
}: {
  onNext: (data: { donorInfo: DonorInfoFormData }) => void;
  onBack: () => void;
  defaultValues?: DonorInfoFormData;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<DonorInfoFormData>({
    resolver: zodResolver(donorInfoSchema),
    defaultValues: defaultValues || {
      anonymous: false,
      taxReceipt: true,
      newsletter: true,
    },
  });

  const isAnonymous = watch("anonymous");

  return (
    <form onSubmit={handleSubmit((data) => onNext({ donorInfo: data }))}>
      <Card>
        <CardHeader>
          <CardTitle>Your Information</CardTitle>
          <CardDescription>
            Help us send your receipt and stay connected
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Anonymous Donation */}
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <Checkbox {...register("anonymous")} />
            <div>
              <p className="font-medium text-sm">
                Make this donation anonymous
              </p>
              <p className="text-xs text-muted-foreground">
                Your name won't be displayed publicly
              </p>
            </div>
          </div>

          {!isAnonymous && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" {...register("firstName")} />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" {...register("lastName")} />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company/Organization (Optional)</Label>
                <Input id="company" {...register("company")} />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input id="phone" type="tel" {...register("phone")} />
          </div>

          {/* Preferences */}
          <div className="space-y-3 pt-4 border-t">
            <Label>Preferences</Label>
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent">
                <Checkbox {...register("taxReceipt")} defaultChecked />
                <div>
                  <p className="font-medium text-sm">
                    Send tax-deductible receipt
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Receive a PDF receipt for tax purposes
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent">
                <Checkbox {...register("newsletter")} defaultChecked />
                <div>
                  <p className="font-medium text-sm">
                    Subscribe to our newsletter
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Get impact updates and stories from the field
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button type="submit" className="flex-1">
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

// Step 4: Payment
function Step4Payment({
  onNext,
  onBack,
  formData,
}: {
  onNext: (data: any) => void;
  onBack: () => void;
  formData: any;
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  });
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();

  const amount = formData.amount?.amount || 0;
  const frequency = formData.amount?.frequency || "once";

  const handlePayment = async (data: PaymentFormData) => {
    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");

      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Payment Error",
          description: error.message,
        });
        setIsProcessing(false);
        return;
      }

      // Process donation (call your backend)
      const response = await fetch("/api/donations/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          amount: amount,
          frequency: frequency,
          allocation: formData.allocation,
          donorInfo: formData.donorInfo,
        }),
      });

      const result = await response.json();

      if (result.success) {
        onNext({ payment: data, donationId: result.donationId });
      } else {
        throw new Error(result.error || "Donation failed");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to process donation",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handlePayment)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Details
          </CardTitle>
          <CardDescription>Secure payment powered by Stripe</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Donation Summary */}
          <div className="bg-accent p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Amount</span>
              <span className="text-2xl font-bold">€{amount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Frequency</span>
              <span className="font-medium capitalize">{frequency}</span>
            </div>
            {frequency !== "once" && (
              <div className="text-xs text-muted-foreground pt-2 border-t">
                {frequency === "monthly" && `€${amount * 12}/year`}
                {frequency === "quarterly" && `€${amount * 4}/year`}
                {frequency === "annually" && `€${amount}/year`}
              </div>
            )}
          </div>

          {/* Allocation Preview */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Impact Allocation</Label>
            {formData.allocation &&
              allocationCategories.map((cat) => {
                const value = formData.allocation[cat.id];
                if (value > 0) {
                  return (
                    <div key={cat.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{cat.name}</span>
                      <span className="font-medium">
                        {value}% (€{((value / 100) * amount).toFixed(2)})
                      </span>
                    </div>
                  );
                }
                return null;
              })}
          </div>

          {/* Card Element */}
          <div className="space-y-2">
            <Label>Card Details *</Label>
            <div className="p-3 border rounded-lg">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Terms */}
          <label className="flex items-start gap-3">
            <Checkbox {...register("acceptTerms")} />
            <span className="text-sm">
              I accept the{" "}
              <a href="/legal/terms" className="text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/legal/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.acceptTerms && (
            <p className="text-sm text-destructive">
              {errors.acceptTerms.message}
            </p>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1"
              disabled={isProcessing}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isProcessing || !stripe}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Donate €{amount} <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

// Step 5: Confirmation
function Step5Confirmation({ formData }: { formData: any }) {
  const { toast } = useToast();
  const amount = formData.amount?.amount || 0;
  const frequency = formData.amount?.frequency || "once";

  const generatePDFReceipt = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text("GRATIS Foundation", 20, 20);
    doc.setFontSize(16);
    doc.text("Donation Receipt", 20, 30);

    // Donor Info
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
    doc.text(`Receipt ID: DON-${Date.now()}`, 20, 60);

    if (!formData.donorInfo?.anonymous) {
      doc.text(
        `Donor: ${formData.donorInfo?.firstName} ${formData.donorInfo?.lastName}`,
        20,
        70,
      );
      if (formData.donorInfo?.company) {
        doc.text(`Company: ${formData.donorInfo?.company}`, 20, 80);
      }
    }

    // Donation Details
    doc.text(`Amount: €${amount}`, 20, 100);
    doc.text(`Frequency: ${frequency}`, 20, 110);

    // Allocation
    doc.text("Impact Allocation:", 20, 130);
    let y = 140;
    allocationCategories.forEach((cat) => {
      const value = formData.allocation?.[cat.id] || 0;
      if (value > 0) {
        doc.text(
          `${cat.name}: ${value}% (€${((value / 100) * amount).toFixed(2)})`,
          30,
          y,
        );
        y += 10;
      }
    });

    // Footer
    doc.setFontSize(10);
    doc.text("Thank you for your generous support!", 20, 200);
    doc.text(
      "GRATIS Foundation is a registered 501(c)(3) nonprofit organization.",
      20,
      210,
    );
    doc.text("Tax ID: XX-XXXXXXX", 20, 220);

    doc.save(`GRATIS_Receipt_${Date.now()}.pdf`);

    toast({
      title: "Receipt Downloaded",
      description: "Your tax receipt has been saved to your downloads folder.",
    });
  };

  return (
    <Card>
      <CardContent className="pt-6 text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
          <p className="text-muted-foreground">
            Your generous donation of €{amount} has been received
          </p>
        </div>

        {/* Impact Summary */}
        <div className="bg-accent p-6 rounded-lg text-left space-y-3">
          <h3 className="font-semibold mb-3">Your Impact</h3>
          {formData.allocation &&
            allocationCategories.map((cat) => {
              const value = formData.allocation[cat.id];
              if (value > 0) {
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" style={{ color: cat.color }} />
                      <span className="text-sm">{cat.name}</span>
                    </div>
                    <span className="font-medium">
                      €{((value / 100) * amount).toFixed(2)}
                    </span>
                  </div>
                );
              }
              return null;
            })}
          {frequency !== "once" && (
            <div className="pt-3 border-t text-sm text-muted-foreground">
              <p>Recurring {frequency} donation</p>
              <p>
                Next charge:{" "}
                {new Date(
                  Date.now() + 30 * 24 * 60 * 60 * 1000,
                ).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Confirmation Email */}
        {formData.donorInfo?.email && (
          <p className="text-sm text-muted-foreground">
            A confirmation email has been sent to {formData.donorInfo.email}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {formData.donorInfo?.taxReceipt && (
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={generatePDFReceipt}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Tax Receipt (PDF)
            </Button>
          )}
          <Button size="lg" className="w-full" asChild>
            <a href="/">Return Home</a>
          </Button>
          <Button size="lg" variant="outline" className="w-full" asChild>
            <a href="/spark/donate">Make Another Donation</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
