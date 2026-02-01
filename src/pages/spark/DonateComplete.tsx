/**
 * Complete Donation System
 *
 * Multi-step donation flow with allocation sliders, pie chart,
 * and Stripe payment integration
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Heart,
  Droplets,
  Palette,
  GraduationCap,
  Shield,
  CreditCard,
  Lock,
  CheckCircle2,
  Share2,
  Download,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

// Validation Schema
const donationSchema = z.object({
  amount: z
    .number()
    .min(5, "Minimum donation is €5")
    .max(100000, "Maximum donation is €100,000"),
  frequency: z.enum(["one_time", "monthly", "quarterly", "annually"]),
  allocation: z
    .object({
      water: z.number().min(0).max(100),
      arts: z.number().min(0).max(100),
      education: z.number().min(0).max(100),
    })
    .refine(
      (data) => data.water + data.arts + data.education === 100,
      "Allocation must total 100%",
    ),
  donorInfo: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().optional(),
    company: z.string().optional(),
    isAnonymous: z.boolean().default(false),
  }),
  coverFees: z.boolean().default(false),
  dedication: z.object({
    enabled: z.boolean().default(false),
    type: z.enum(["in_honor", "in_memory"]).optional(),
    name: z.string().optional(),
    notifyRecipient: z.boolean().default(false),
    recipientEmail: z.string().email().optional().or(z.literal("")),
    message: z.string().optional(),
  }),
  acceptedTerms: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms"),
});

type DonationFormData = z.infer<typeof donationSchema>;

const presetAmounts = [25, 50, 100, 250, 500, 1000];

const impactExamples: Record<number, string> = {
  25: "Provides clean water for 5 people for a month",
  50: "Funds art supplies for 10 students",
  100: "Supports education for 3 children for a month",
  250: "Funds a community water well maintenance",
  500: "Sponsors a full art program for a school",
  1000: "Provides scholarships for 5 students for a year",
};

const allocationColors = {
  water: "#00AFFF",
  arts: "#FF0077",
  education: "#FF5F00",
};

export default function DonateComplete() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [customAmount, setCustomAmount] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [donationComplete, setDonationComplete] = useState(false);
  const [donationId, setDonationId] = useState("");

  const form = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: 50,
      frequency: "one_time",
      allocation: {
        water: 40,
        arts: 30,
        education: 30,
      },
      donorInfo: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        isAnonymous: false,
      },
      coverFees: false,
      dedication: {
        enabled: false,
        type: "in_honor",
        name: "",
        notifyRecipient: false,
        recipientEmail: "",
        message: "",
      },
      acceptedTerms: false,
    },
  });

  const watchedValues = form.watch();
  const processingFee = watchedValues.coverFees
    ? watchedValues.amount * 0.029 + 0.3
    : 0;
  const totalAmount = watchedValues.amount + processingFee;

  const allocationData = [
    {
      name: "Water",
      value: watchedValues.allocation.water,
      color: allocationColors.water,
    },
    {
      name: "Arts",
      value: watchedValues.allocation.arts,
      color: allocationColors.arts,
    },
    {
      name: "Education",
      value: watchedValues.allocation.education,
      color: allocationColors.education,
    },
  ];

  const handleNext = async () => {
    let isValid = false;

    if (step === 1) {
      isValid = await form.trigger(["amount", "frequency", "allocation"]);
    } else if (step === 2) {
      isValid = await form.trigger(["donorInfo"]);
    } else if (step === 3) {
      isValid = await form.trigger(["acceptedTerms"]);
    }

    if (isValid) {
      if (step < 4) {
        setStep(step + 1);
      } else {
        await handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setIsProcessing(true);

    try {
      const data = form.getValues();

      // TODO: Integrate with Stripe and Firebase
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockDonationId = `DON-${Date.now()}`;
      setDonationId(mockDonationId);
      setDonationComplete(true);

      toast({
        title: "Donation successful!",
        description: `Thank you for your €${totalAmount.toFixed(2)} donation`,
      });
    } catch (error) {
      toast({
        title: "Donation failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAllocationChange = (
    field: "water" | "arts" | "education",
    value: number,
  ) => {
    const allocation = form.getValues("allocation");
    const otherFields = Object.keys(allocation).filter(
      (k) => k !== field,
    ) as Array<"water" | "arts" | "education">;

    const remaining = 100 - value;
    const otherTotal = otherFields.reduce((sum, f) => sum + allocation[f], 0);

    if (otherTotal === 0) {
      // Distribute equally among other fields
      form.setValue("allocation", {
        ...allocation,
        [field]: value,
        [otherFields[0]]: remaining / 2,
        [otherFields[1]]: remaining / 2,
      });
    } else {
      // Distribute proportionally
      const ratio = remaining / otherTotal;
      form.setValue("allocation", {
        ...allocation,
        [field]: value,
        [otherFields[0]]: allocation[otherFields[0]] * ratio,
        [otherFields[1]]: allocation[otherFields[1]] * ratio,
      });
    }
  };

  if (donationComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <SEO title="Donation Successful | GRATIS" />
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-3xl">Thank You!</CardTitle>
            <CardDescription className="text-lg">
              Your donation of €{totalAmount.toFixed(2)} has been received
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Allocation Breakdown */}
            <div className="space-y-3">
              <h3 className="font-semibold">Your Impact Allocation:</h3>
              <div className="grid gap-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Water Programs</span>
                  </div>
                  <span className="font-bold">
                    €
                    {(
                      (watchedValues.amount * watchedValues.allocation.water) /
                      100
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-pink-50 dark:bg-pink-950/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-pink-600" />
                    <span className="font-medium">Arts Programs</span>
                  </div>
                  <span className="font-bold">
                    €
                    {(
                      (watchedValues.amount * watchedValues.allocation.arts) /
                      100
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-orange-600" />
                    <span className="font-medium">Education Programs</span>
                  </div>
                  <span className="font-bold">
                    €
                    {(
                      (watchedValues.amount *
                        watchedValues.allocation.education) /
                      100
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Donation ID:</span>
                <span className="font-mono font-medium">{donationId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Receipt:</span>
                <span className="text-primary">
                  Sent to {watchedValues.donorInfo.email}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/impact")}
            >
              <Heart className="mr-2 h-4 w-4" />
              See Your Impact
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Make a Donation | GRATIS"
        description="Support clean water, arts, and education programs worldwide"
      />

      {/* Header */}
      <div className="border-b">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Make a Donation</span>
          </div>
          <Button variant="ghost" onClick={() => navigate("/")}>
            Cancel
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="border-b bg-muted/30">
        <div className="container py-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">
                Step {step} of {totalSteps}
              </span>
              <span className="text-muted-foreground">
                {Math.round(progress)}% complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8 max-w-5xl">
        <form>
          {/* Step 1: Amount & Allocation */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Choose Your Impact</h1>
                <p className="text-muted-foreground">
                  Select amount and customize how your donation is allocated
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Donation Frequency</CardTitle>
                </CardHeader>
                <CardContent>
                  <Controller
                    name="frequency"
                    control={form.control}
                    render={({ field }) => (
                      <Tabs value={field.value} onValueChange={field.onChange}>
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="one_time">One-Time</TabsTrigger>
                          <TabsTrigger value="monthly">Monthly</TabsTrigger>
                          <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
                          <TabsTrigger value="annually">Annually</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Donation Amount</CardTitle>
                  <CardDescription>
                    {impactExamples[watchedValues.amount] ||
                      `Your €${watchedValues.amount} will make a real difference`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {presetAmounts.map((amount) => (
                      <Button
                        key={amount}
                        type="button"
                        variant={
                          watchedValues.amount === amount
                            ? "default"
                            : "outline"
                        }
                        className="h-16"
                        onClick={() => {
                          form.setValue("amount", amount);
                          setCustomAmount(null);
                        }}
                      >
                        €{amount}
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customAmount">Custom Amount</Label>
                    <Input
                      id="customAmount"
                      type="number"
                      placeholder="Enter custom amount"
                      value={customAmount || ""}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value)) {
                          setCustomAmount(value);
                          form.setValue("amount", value);
                        }
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Controller
                      name="coverFees"
                      control={form.control}
                      render={({ field }) => (
                        <Checkbox
                          id="coverFees"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Label
                      htmlFor="coverFees"
                      className="text-sm cursor-pointer"
                    >
                      Cover processing fees (€{processingFee.toFixed(2)}) so
                      100% goes to programs
                    </Label>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total:</span>
                      <span className="text-2xl font-bold">
                        €{totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Allocate Your Donation</CardTitle>
                  <CardDescription>
                    Customize how your donation supports different programs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Sliders */}
                    <div className="space-y-6">
                      {/* Water */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-2">
                            <Droplets className="h-4 w-4 text-blue-600" />
                            Water Programs
                          </Label>
                          <span
                            className="text-lg font-bold"
                            style={{ color: allocationColors.water }}
                          >
                            {watchedValues.allocation.water.toFixed(0)}%
                          </span>
                        </div>
                        <Controller
                          name="allocation.water"
                          control={form.control}
                          render={({ field }) => (
                            <Slider
                              value={[field.value]}
                              onValueChange={([value]) =>
                                handleAllocationChange("water", value)
                              }
                              max={100}
                              step={1}
                              className="[&_[role=slider]]:bg-blue-600"
                            />
                          )}
                        />
                        <p className="text-xs text-muted-foreground">
                          €
                          {(
                            (watchedValues.amount *
                              watchedValues.allocation.water) /
                            100
                          ).toFixed(2)}
                        </p>
                      </div>

                      {/* Arts */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-2">
                            <Palette className="h-4 w-4 text-pink-600" />
                            Arts Programs
                          </Label>
                          <span
                            className="text-lg font-bold"
                            style={{ color: allocationColors.arts }}
                          >
                            {watchedValues.allocation.arts.toFixed(0)}%
                          </span>
                        </div>
                        <Controller
                          name="allocation.arts"
                          control={form.control}
                          render={({ field }) => (
                            <Slider
                              value={[field.value]}
                              onValueChange={([value]) =>
                                handleAllocationChange("arts", value)
                              }
                              max={100}
                              step={1}
                              className="[&_[role=slider]]:bg-pink-600"
                            />
                          )}
                        />
                        <p className="text-xs text-muted-foreground">
                          €
                          {(
                            (watchedValues.amount *
                              watchedValues.allocation.arts) /
                            100
                          ).toFixed(2)}
                        </p>
                      </div>

                      {/* Education */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-orange-600" />
                            Education Programs
                          </Label>
                          <span
                            className="text-lg font-bold"
                            style={{ color: allocationColors.education }}
                          >
                            {watchedValues.allocation.education.toFixed(0)}%
                          </span>
                        </div>
                        <Controller
                          name="allocation.education"
                          control={form.control}
                          render={({ field }) => (
                            <Slider
                              value={[field.value]}
                              onValueChange={([value]) =>
                                handleAllocationChange("education", value)
                              }
                              max={100}
                              step={1}
                              className="[&_[role=slider]]:bg-orange-600"
                            />
                          )}
                        />
                        <p className="text-xs text-muted-foreground">
                          €
                          {(
                            (watchedValues.amount *
                              watchedValues.allocation.education) /
                            100
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="flex items-center justify-center">
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={allocationData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry) =>
                              `${entry.name}: ${entry.value.toFixed(0)}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {allocationData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Donor Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Your Information</h1>
                <p className="text-muted-foreground">
                  We'll send your receipt and impact updates to this email
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        First Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        {...form.register("donorInfo.firstName")}
                        placeholder="John"
                      />
                      {form.formState.errors.donorInfo?.firstName && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.donorInfo.firstName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">
                        Last Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        {...form.register("donorInfo.lastName")}
                        placeholder="Doe"
                      />
                      {form.formState.errors.donorInfo?.lastName && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.donorInfo.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register("donorInfo.email")}
                      placeholder="john@example.com"
                    />
                    {form.formState.errors.donorInfo?.email && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.donorInfo.email.message}
                      </p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone (optional)</Label>
                      <Input
                        id="phone"
                        {...form.register("donorInfo.phone")}
                        placeholder="+31 6 1234 5678"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Company (optional)</Label>
                      <Input
                        id="company"
                        {...form.register("donorInfo.company")}
                        placeholder="Company name"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Controller
                      name="donorInfo.isAnonymous"
                      control={form.control}
                      render={({ field }) => (
                        <Checkbox
                          id="anonymous"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Label
                      htmlFor="anonymous"
                      className="text-sm cursor-pointer"
                    >
                      Make this donation anonymous
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Dedication */}
              <Card>
                <CardHeader>
                  <CardTitle>Dedication (optional)</CardTitle>
                  <CardDescription>
                    Make this donation in honor or memory of someone
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Controller
                      name="dedication.enabled"
                      control={form.control}
                      render={({ field }) => (
                        <Checkbox
                          id="dedicationEnabled"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Label
                      htmlFor="dedicationEnabled"
                      className="text-sm cursor-pointer"
                    >
                      Add a dedication
                    </Label>
                  </div>

                  {watchedValues.dedication.enabled && (
                    <div className="space-y-4 pl-6 border-l-2">
                      <Controller
                        name="dedication.type"
                        control={form.control}
                        render={({ field }) => (
                          <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="in_honor" id="in_honor" />
                              <Label htmlFor="in_honor">In Honor Of</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="in_memory"
                                id="in_memory"
                              />
                              <Label htmlFor="in_memory">In Memory Of</Label>
                            </div>
                          </RadioGroup>
                        )}
                      />

                      <div className="space-y-2">
                        <Label htmlFor="dedicationName">Name</Label>
                        <Input
                          id="dedicationName"
                          {...form.register("dedication.name")}
                          placeholder="Person's name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dedicationMessage">
                          Message (optional)
                        </Label>
                        <Input
                          id="dedicationMessage"
                          {...form.register("dedication.message")}
                          placeholder="Your message"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Payment</h1>
                <p className="text-muted-foreground">
                  Secure payment powered by Stripe
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Donation Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Donation Amount:
                    </span>
                    <span className="font-medium">
                      €{watchedValues.amount.toFixed(2)}
                    </span>
                  </div>
                  {watchedValues.coverFees && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Processing Fee:
                      </span>
                      <span className="font-medium">
                        €{processingFee.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span>€{totalAmount.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-8 bg-muted rounded-lg text-center space-y-4">
                    <Lock className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Stripe payment integration will be added here
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      <span>256-bit SSL Encryption</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center gap-2">
                <Controller
                  name="acceptedTerms"
                  control={form.control}
                  render={({ field }) => (
                    <Checkbox
                      id="terms"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="terms" className="text-sm cursor-pointer">
                  I accept the{" "}
                  <a
                    href="/legal/terms"
                    className="text-primary hover:underline"
                  >
                    Terms & Conditions
                  </a>
                </Label>
              </div>
              {form.formState.errors.acceptedTerms && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.acceptedTerms.message}
                </p>
              )}

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-6 p-4 bg-muted/50 rounded-lg">
                <Badge variant="outline" className="gap-2">
                  <Shield className="h-4 w-4" />
                  256-bit SSL
                </Badge>
                <Badge variant="outline" className="gap-2">
                  <Lock className="h-4 w-4" />
                  PCI DSS Compliant
                </Badge>
                <Badge variant="outline" className="gap-2">
                  <Check className="h-4 w-4" />
                  100% Tax Deductible
                </Badge>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={step === 1 || isProcessing}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button
              type="button"
              onClick={handleNext}
              size="lg"
              disabled={isProcessing}
            >
              {isProcessing ? (
                "Processing..."
              ) : step === 3 ? (
                <>
                  <Heart className="mr-2 h-4 w-4" />
                  Complete Donation
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
