/**
 * TRIBE Membership Signup Wizard
 * Multi-step form with validation, payment integration, and confirmation
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
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CreditCard,
  User,
  Sparkles,
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "",
);

// Step 1: Membership Tier Selection
const tierSchema = z.object({
  tier: z.enum(["monthly", "quarterly", "annual"]),
});

// Step 2: Personal Information
const personalInfoSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(4, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
});

// Step 3: Preferences
const preferencesSchema = z.object({
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  newsletter: z.boolean(),
  impactUpdates: z.boolean(),
  volunteerOpportunities: z.boolean(),
});

// Step 4: Payment
const paymentSchema = z.object({
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms"),
  acceptPrivacy: z
    .boolean()
    .refine((val) => val === true, "You must accept the privacy policy"),
});

type TierFormData = z.infer<typeof tierSchema>;
type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
type PreferencesFormData = z.infer<typeof preferencesSchema>;
type PaymentFormData = z.infer<typeof paymentSchema>;

const membershipTiers = [
  {
    id: "monthly",
    name: "Monthly TRIBE",
    price: 15,
    interval: "month",
    features: [
      "1 premium bottle per month",
      "Quarterly voting rights",
      "Impact dashboard access",
      "Member-only events",
      "Community forum access",
    ],
  },
  {
    id: "quarterly",
    name: "Quarterly TRIBE",
    price: 40,
    interval: "3 months",
    popular: true,
    features: [
      "3 premium bottles per quarter",
      "Quarterly voting rights",
      "Impact dashboard access",
      "Member-only events",
      "Community forum access",
      "Priority support",
      "10% discount (save €5)",
    ],
  },
  {
    id: "annual",
    name: "Annual TRIBE",
    price: 150,
    interval: "year",
    features: [
      "12 premium bottles per year",
      "Quarterly voting rights",
      "Impact dashboard access",
      "Member-only events",
      "Community forum access",
      "Priority support",
      "Exclusive merchandise",
      "VIP event access",
      "20% discount (save €30)",
    ],
  },
];

const interests = [
  "Environmental sustainability",
  "Social justice",
  "Community development",
  "Education & youth",
  "Health & wellness",
  "Arts & culture",
];

export function TribeSignupWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<
    Partial<{
      tier: string;
      personalInfo: PersonalInfoFormData;
      preferences: PreferencesFormData;
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
        <h1 className="text-3xl font-bold mb-2">Join TRIBE Membership</h1>
        <p className="text-muted-foreground">
          Become a TRIBE member and make a recurring impact
        </p>
        <Progress value={progress} className="mt-4" />
        <p className="text-sm text-muted-foreground mt-2">
          Step {step} of {totalSteps}
        </p>
      </div>

      {step === 1 && (
        <Step1TierSelection
          onNext={handleNextStep}
          defaultValues={
            formData.tier ? { tier: formData.tier as any } : undefined
          }
        />
      )}
      {step === 2 && (
        <Step2PersonalInfo
          onNext={handleNextStep}
          onBack={handlePrevStep}
          defaultValues={formData.personalInfo}
        />
      )}
      {step === 3 && (
        <Step3Preferences
          onNext={handleNextStep}
          onBack={handlePrevStep}
          defaultValues={formData.preferences}
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

// Step 1: Tier Selection
function Step1TierSelection({
  onNext,
  defaultValues,
}: {
  onNext: (data: TierFormData) => void;
  defaultValues?: TierFormData;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TierFormData>({
    resolver: zodResolver(tierSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onNext)}>
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Membership Tier</CardTitle>
          <CardDescription>
            Select the membership plan that works best for you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup defaultValue={defaultValues?.tier} className="grid gap-4">
            {membershipTiers.map((tier) => (
              <label
                key={tier.id}
                className={`relative flex cursor-pointer rounded-lg border-2 p-6 transition-all hover:border-primary ${
                  tier.popular ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <input
                  type="radio"
                  value={tier.id}
                  {...register("tier")}
                  className="sr-only"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{tier.name}</h3>
                    {tier.popular && (
                      <span className="flex items-center gap-1 text-xs font-medium text-primary">
                        <Sparkles className="h-3 w-3" />
                        Most Popular
                      </span>
                    )}
                  </div>
                  <p className="text-3xl font-bold mb-4">
                    €{tier.price}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{tier.interval}
                    </span>
                  </p>
                  <ul className="space-y-2">
                    {tier.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </label>
            ))}
          </RadioGroup>
          {errors.tier && (
            <p className="text-sm text-destructive mt-2">
              {errors.tier.message}
            </p>
          )}
          <Button type="submit" className="w-full mt-6" size="lg">
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}

// Step 2: Personal Information
function Step2PersonalInfo({
  onNext,
  onBack,
  defaultValues,
}: {
  onNext: (data: PersonalInfoFormData) => void;
  onBack: () => void;
  defaultValues?: PersonalInfoFormData;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit((data) => onNext({ personalInfo: data } as any))}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Tell us about yourself to create your member profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <Label htmlFor="email">Email Address *</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" type="tel" {...register("phone")} />
              {errors.phone && (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register("dateOfBirth")}
              />
              {errors.dateOfBirth && (
                <p className="text-sm text-destructive">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Street Address *</Label>
            <Input id="address" {...register("address")} />
            {errors.address && (
              <p className="text-sm text-destructive">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input id="city" {...register("city")} />
              {errors.city && (
                <p className="text-sm text-destructive">
                  {errors.city.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code *</Label>
              <Input id="postalCode" {...register("postalCode")} />
              {errors.postalCode && (
                <p className="text-sm text-destructive">
                  {errors.postalCode.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input id="country" {...register("country")} />
              {errors.country && (
                <p className="text-sm text-destructive">
                  {errors.country.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
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

// Step 3: Preferences
function Step3Preferences({
  onNext,
  onBack,
  defaultValues,
}: {
  onNext: (data: PreferencesFormData) => void;
  onBack: () => void;
  defaultValues?: PreferencesFormData;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: defaultValues || {
      interests: [],
      newsletter: true,
      impactUpdates: true,
      volunteerOpportunities: false,
    },
  });

  const selectedInterests = watch("interests") || [];

  const handleInterestToggle = (interest: string) => {
    const newInterests = selectedInterests.includes(interest)
      ? selectedInterests.filter((i) => i !== interest)
      : [...selectedInterests, interest];
    setValue("interests", newInterests);
  };

  return (
    <form
      onSubmit={handleSubmit((data) => onNext({ preferences: data } as any))}
    >
      <Card>
        <CardHeader>
          <CardTitle>Your Preferences</CardTitle>
          <CardDescription>
            Help us personalize your TRIBE experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Areas of Interest * (Select at least one)</Label>
            <div className="grid grid-cols-2 gap-3">
              {interests.map((interest) => (
                <label
                  key={interest}
                  className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedInterests.includes(interest)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Checkbox
                    checked={selectedInterests.includes(interest)}
                    onCheckedChange={() => handleInterestToggle(interest)}
                  />
                  <span className="text-sm">{interest}</span>
                </label>
              ))}
            </div>
            {errors.interests && (
              <p className="text-sm text-destructive">
                {errors.interests.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label>Communication Preferences</Label>
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent">
                <Checkbox {...register("newsletter")} defaultChecked />
                <div className="flex-1">
                  <p className="font-medium text-sm">Monthly Newsletter</p>
                  <p className="text-xs text-muted-foreground">
                    Get updates on our impact, stories, and upcoming events
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent">
                <Checkbox {...register("impactUpdates")} defaultChecked />
                <div className="flex-1">
                  <p className="font-medium text-sm">Impact Reports</p>
                  <p className="text-xs text-muted-foreground">
                    Quarterly reports showing how your contribution makes a
                    difference
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent">
                <Checkbox {...register("volunteerOpportunities")} />
                <div className="flex-1">
                  <p className="font-medium text-sm">Volunteer Opportunities</p>
                  <p className="text-xs text-muted-foreground">
                    Be notified about local volunteering and community events
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
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

  const selectedTier = membershipTiers.find((t) => t.id === formData.tier);

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

      // Create subscription (call your backend)
      const response = await fetch("/api/tribe/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          tier: formData.tier,
          personalInfo: formData.personalInfo,
          preferences: formData.preferences,
        }),
      });

      const result = await response.json();

      if (result.success) {
        onNext({ payment: data, subscriptionId: result.subscriptionId });
      } else {
        throw new Error(result.error || "Subscription failed");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to process payment",
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
            Payment Information
          </CardTitle>
          <CardDescription>Secure payment powered by Stripe</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Summary */}
          <div className="bg-accent p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">{selectedTier?.name}</span>
              <span className="font-bold">€{selectedTier?.price}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Billed {selectedTier?.interval}ly
            </div>
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

          {/* Terms & Privacy */}
          <div className="space-y-3">
            <label className="flex items-start gap-3">
              <Checkbox {...register("acceptTerms")} />
              <span className="text-sm">
                I accept the{" "}
                <a href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </a>
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="text-sm text-destructive">
                {errors.acceptTerms.message}
              </p>
            )}
            <label className="flex items-start gap-3">
              <Checkbox {...register("acceptPrivacy")} />
              <span className="text-sm">
                I accept the{" "}
                <a href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.acceptPrivacy && (
              <p className="text-sm text-destructive">
                {errors.acceptPrivacy.message}
              </p>
            )}
          </div>

          <div className="flex gap-3 mt-6">
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
                  Complete Payment <ArrowRight className="ml-2 h-4 w-4" />
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
  const selectedTier = membershipTiers.find((t) => t.id === formData.tier);

  return (
    <Card>
      <CardContent className="pt-6 text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Welcome to TRIBE!</h2>
          <p className="text-muted-foreground">
            Your membership has been activated successfully
          </p>
        </div>
        <div className="bg-accent p-6 rounded-lg text-left space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Membership</span>
            <span className="font-medium">{selectedTier?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Member</span>
            <span className="font-medium">
              {formData.personalInfo?.firstName}{" "}
              {formData.personalInfo?.lastName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{formData.personalInfo?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Next billing</span>
            <span className="font-medium">
              {new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000,
              ).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            A confirmation email has been sent to {formData.personalInfo?.email}
          </p>
          <div className="flex flex-col gap-2">
            <Button size="lg" className="w-full" asChild>
              <a href="/tribe/dashboard">Go to Dashboard</a>
            </Button>
            <Button size="lg" variant="outline" className="w-full" asChild>
              <a href="/">Return Home</a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
