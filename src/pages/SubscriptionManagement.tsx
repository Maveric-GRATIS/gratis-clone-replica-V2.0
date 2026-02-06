import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard,
  Check,
  Star,
  TrendingUp,
  Calendar,
  DollarSign,
  Award,
  Heart,
  Shield,
  Zap,
  Crown,
  FileText,
  AlertCircle,
} from "lucide-react";

export default function SubscriptionManagement() {
  const [selectedInterval, setSelectedInterval] = useState<
    "month" | "quarter" | "year"
  >("month");

  const plans = [
    {
      id: "supporter",
      name: "Supporter",
      icon: Heart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      pricing: {
        monthly: 10,
        quarterly: 27, // 10% discount
        yearly: 100, // 17% discount
      },
      features: [
        "10 virtual bottles per month",
        "Monthly newsletter",
        "Tax receipt",
        "Community access",
        "Impact reports",
      ],
      benefits: {
        bottles: 10,
        taxReceipt: true,
        newsletter: true,
        exclusiveContent: false,
        votingPower: 1,
      },
    },
    {
      id: "champion",
      name: "Champion",
      icon: Award,
      color: "text-green-600",
      bgColor: "bg-green-50",
      popular: true,
      pricing: {
        monthly: 25,
        quarterly: 68, // 10% discount
        yearly: 250, // 17% discount
      },
      features: [
        "30 virtual bottles per month",
        "Priority newsletter",
        "Tax receipt",
        "Exclusive content access",
        "Project voting rights",
        "Recognition on website",
      ],
      benefits: {
        bottles: 30,
        taxReceipt: true,
        newsletter: true,
        exclusiveContent: true,
        votingPower: 2,
      },
    },
    {
      id: "guardian",
      name: "Guardian",
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      pricing: {
        monthly: 50,
        quarterly: 135, // 10% discount
        yearly: 500, // 17% discount
      },
      features: [
        "60 virtual bottles per month",
        "Premium newsletter",
        "Tax receipt",
        "All exclusive content",
        "Enhanced voting power",
        "Partner recognition",
        "Quarterly impact call",
      ],
      benefits: {
        bottles: 60,
        taxReceipt: true,
        newsletter: true,
        exclusiveContent: true,
        votingPower: 3,
      },
    },
    {
      id: "patron",
      name: "Patron",
      icon: Crown,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      pricing: {
        monthly: 100,
        quarterly: 270, // 10% discount
        yearly: 1000, // 17% discount
      },
      features: [
        "150 virtual bottles per month",
        "VIP newsletter",
        "Tax receipt",
        "All premium content",
        "Maximum voting power",
        "Executive recognition",
        "Monthly strategy calls",
        "Custom impact reporting",
      ],
      benefits: {
        bottles: 150,
        taxReceipt: true,
        newsletter: true,
        exclusiveContent: true,
        votingPower: 5,
      },
    },
  ];

  const currentSubscription = {
    id: "sub_123",
    planId: "champion",
    status: "active",
    interval: "month" as const,
    amount: 25,
    currentPeriodEnd: "2024-07-15",
    cancelAtPeriodEnd: false,
  };

  const paymentMethods = [
    {
      id: "pm_1",
      type: "card" as const,
      isDefault: true,
      card: {
        brand: "Visa",
        last4: "4242",
        expMonth: 12,
        expYear: 2025,
      },
    },
    {
      id: "pm_2",
      type: "sepa_debit" as const,
      isDefault: false,
      sepa: {
        last4: "3000",
        bankCode: "ABNANL2A",
      },
    },
  ];

  const invoices = [
    {
      id: "inv_1",
      amount: 25,
      status: "paid",
      periodStart: "2024-06-01",
      periodEnd: "2024-07-01",
      paidAt: "2024-06-01",
      invoiceUrl: "#",
    },
    {
      id: "inv_2",
      amount: 25,
      status: "paid",
      periodStart: "2024-05-01",
      periodEnd: "2024-06-01",
      paidAt: "2024-05-01",
      invoiceUrl: "#",
    },
  ];

  const calculateSavings = (
    price: number,
    interval: typeof selectedInterval,
  ) => {
    if (interval === "month") return 0;
    const months = interval === "quarter" ? 3 : 12;
    const monthlyTotal = price * months;
    const discountedPrice =
      interval === "quarter"
        ? price * months * 0.9 // 10% discount
        : price * months * 0.83; // 17% discount
    return ((monthlyTotal - discountedPrice) / monthlyTotal) * 100;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subscription Management</h1>
          <p className="text-muted-foreground">
            Choose a plan that matches your generosity
          </p>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList>
          <TabsTrigger value="plans">
            <Star className="w-4 h-4 mr-2" />
            Plans
          </TabsTrigger>
          <TabsTrigger value="current">
            <TrendingUp className="w-4 h-4 mr-2" />
            Current Subscription
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="w-4 h-4 mr-2" />
            Payment Methods
          </TabsTrigger>
          <TabsTrigger value="invoices">
            <FileText className="w-4 h-4 mr-2" />
            Invoices
          </TabsTrigger>
        </TabsList>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          {/* Interval Selector */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant={selectedInterval === "month" ? "default" : "outline"}
                  onClick={() => setSelectedInterval("month")}
                >
                  Monthly
                </Button>
                <Button
                  variant={
                    selectedInterval === "quarter" ? "default" : "outline"
                  }
                  onClick={() => setSelectedInterval("quarter")}
                >
                  Quarterly
                  <Badge variant="secondary" className="ml-2">
                    Save 10%
                  </Badge>
                </Button>
                <Button
                  variant={selectedInterval === "year" ? "default" : "outline"}
                  onClick={() => setSelectedInterval("year")}
                >
                  Yearly
                  <Badge variant="secondary" className="ml-2">
                    Save 17%
                  </Badge>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const price =
                plan.pricing[
                  selectedInterval === "quarter"
                    ? "quarterly"
                    : selectedInterval === "year"
                      ? "yearly"
                      : "monthly"
                ];
              const monthlyEquivalent =
                selectedInterval === "quarter"
                  ? price / 3
                  : selectedInterval === "year"
                    ? price / 12
                    : price;

              const savings = calculateSavings(
                plan.pricing.monthly,
                selectedInterval,
              );

              return (
                <Card
                  key={plan.id}
                  className={`relative ${
                    plan.popular ? "border-2 border-primary shadow-lg" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div
                      className={`w-12 h-12 rounded-lg ${plan.bgColor} flex items-center justify-center mb-3`}
                    >
                      <Icon className={`w-6 h-6 ${plan.color}`} />
                    </div>
                    <CardTitle>{plan.name}</CardTitle>
                    <div className="pt-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">€{price}</span>
                        <span className="text-muted-foreground">
                          /
                          {selectedInterval === "month"
                            ? "mo"
                            : selectedInterval === "quarter"
                              ? "qtr"
                              : "yr"}
                        </span>
                      </div>
                      {selectedInterval !== "month" && (
                        <p className="text-sm text-muted-foreground mt-1">
                          €{monthlyEquivalent.toFixed(2)}/month
                        </p>
                      )}
                      {savings > 0 && (
                        <Badge variant="secondary" className="mt-2">
                          Save {savings.toFixed(0)}%
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm"
                        >
                          <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {currentSubscription?.planId === plan.id
                        ? "Current Plan"
                        : "Select Plan"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Current Subscription Tab */}
        <TabsContent value="current" className="space-y-4">
          {currentSubscription ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Active Subscription</CardTitle>
                      <CardDescription>
                        Your current plan and billing information
                      </CardDescription>
                    </div>
                    <Badge
                      variant="default"
                      className={
                        currentSubscription.status === "active"
                          ? "bg-green-600"
                          : "bg-yellow-600"
                      }
                    >
                      {currentSubscription.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Current Plan
                      </p>
                      <p className="text-xl font-bold capitalize">
                        {currentSubscription.planId}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="text-xl font-bold">
                        €{currentSubscription.amount}/
                        {currentSubscription.interval}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Next Billing Date
                      </p>
                      <p className="text-xl font-bold flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        {currentSubscription.currentPeriodEnd}
                      </p>
                    </div>
                  </div>

                  {currentSubscription.cancelAtPeriodEnd && (
                    <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-800">
                          Subscription will be canceled
                        </p>
                        <p className="text-sm text-yellow-700">
                          Your subscription will end on{" "}
                          {currentSubscription.currentPeriodEnd}. You can
                          reactivate before this date.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t">
                    <Button variant="outline" className="flex-1">
                      Change Plan
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Update Payment Method
                    </Button>
                    <Button variant="destructive" className="flex-1">
                      {currentSubscription.cancelAtPeriodEnd
                        ? "Reactivate Subscription"
                        : "Cancel Subscription"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Benefits</CardTitle>
                  <CardDescription>
                    What you get with your current subscription
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Zap className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">30 Bottles</p>
                          <p className="text-sm text-muted-foreground">
                            per month
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Tax Receipts</p>
                          <p className="text-sm text-muted-foreground">
                            Automatic
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                          <Star className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">Voting Power</p>
                          <p className="text-sm text-muted-foreground">
                            2x weight
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No Active Subscription
                </h3>
                <p className="text-muted-foreground mb-6">
                  Subscribe to support our mission with recurring donations
                </p>
                <Button>Browse Plans</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Payment Methods Tab */}
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    <div>
                      {method.type === "card" && method.card && (
                        <>
                          <p className="font-medium">
                            {method.card.brand} •••• {method.card.last4}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Expires {method.card.expMonth}/{method.card.expYear}
                          </p>
                        </>
                      )}
                      {method.type === "sepa_debit" && method.sepa && (
                        <>
                          <p className="font-medium">
                            SEPA •••• {method.sepa.last4}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {method.sepa.bankCode}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {method.isDefault && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      Remove
                    </Button>
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full">
                <CreditCard className="w-4 h-4 mr-2" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice History</CardTitle>
              <CardDescription>Download your past invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          Invoice for €{invoice.amount}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {invoice.periodStart} - {invoice.periodEnd}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          invoice.status === "paid" ? "default" : "secondary"
                        }
                        className={
                          invoice.status === "paid" ? "bg-green-600" : ""
                        }
                      >
                        {invoice.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
