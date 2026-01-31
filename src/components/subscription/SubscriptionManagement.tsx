/**
 * Subscription Management Component
 *
 * Manage TRIBE membership subscriptions
 */

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreditCard,
  Calendar,
  TrendingUp,
  Download,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface Subscription {
  id: string;
  status: "active" | "past_due" | "canceled" | "incomplete";
  tier: "Explorer" | "Insider" | "Core" | "Founder";
  amount: number;
  currency: string;
  interval: "month" | "year";
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  paymentMethod?: {
    brand: string;
    last4: string;
    expiryMonth: number;
    expiryYear: number;
  };
}

interface SubscriptionManagementProps {
  userId: string;
}

export function SubscriptionManagement({
  userId,
}: SubscriptionManagementProps) {
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChangingPlan, setIsChangingPlan] = useState(false);

  const openCustomerPortal = () => {
    // In production: Get Stripe customer portal URL from backend
    toast({
      title: "Opening Customer Portal",
      description: "Redirecting to Stripe payment management...",
    });
    // In production: window.location.href = stripeCustomerPortalUrl;
  };

  // Mock subscription data (in production: fetch from Firestore/Stripe)
  useEffect(() => {
    const fetchSubscription = async () => {
      setIsLoading(true);
      try {
        // Mock data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setSubscription({
          id: "sub_mock123",
          status: "active",
          tier: "Insider",
          amount: 15,
          currency: "EUR",
          interval: "month",
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          cancelAtPeriodEnd: false,
          paymentMethod: {
            brand: "visa",
            last4: "4242",
            expiryMonth: 12,
            expiryYear: 2025,
          },
        });
      } catch (error) {
        console.error("Failed to fetch subscription:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, [userId]);

  const handleChangePlan = async (newTier: string) => {
    setIsChangingPlan(true);
    try {
      // In production: Call Stripe API to update subscription
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Plan updated!",
        description: `Your subscription has been changed to ${newTier}`,
      });

      // Refresh subscription data
      // fetchSubscription();
    } catch (error) {
      console.error("Failed to change plan:", error);
      toast({
        title: "Error",
        description: "Failed to update subscription",
        variant: "destructive",
      });
    } finally {
      setIsChangingPlan(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription?")) {
      return;
    }

    try {
      // In production: Call Stripe API to cancel subscription
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Subscription canceled",
        description:
          "Your subscription will remain active until the end of the current billing period",
      });

      if (subscription) {
        setSubscription({
          ...subscription,
          cancelAtPeriodEnd: true,
        });
      }
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription",
        variant: "destructive",
      });
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      // In production: Call Stripe API to reactivate subscription
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Subscription reactivated!",
        description: "Your subscription will continue automatically",
      });

      if (subscription) {
        setSubscription({
          ...subscription,
          cancelAtPeriodEnd: false,
        });
      }
    } catch (error) {
      console.error("Failed to reactivate subscription:", error);
      toast({
        title: "Error",
        description: "Failed to reactivate subscription",
        variant: "destructive",
      });
    }
  };

  const handleDownloadInvoices = () => {
    // In production: Redirect to Stripe customer portal
    // For now: Open a mock portal
    toast({
      title: "Opening Customer Portal",
      description: "Redirecting to payment management...",
    });
    // In production: window.location.href = stripeCustomerPortalUrl;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Loading subscription...</p>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Active Subscription</CardTitle>
          <CardDescription>
            Join TRIBE to support GRATIS and unlock exclusive benefits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <a href="/tribe">Explore TRIBE Membership</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const statusColors = {
    active: "bg-green-500",
    past_due: "bg-yellow-500",
    canceled: "bg-red-500",
    incomplete: "bg-gray-500",
  };

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>TRIBE {subscription.tier}</CardTitle>
              <CardDescription>
                {subscription.interval === "month" ? "Monthly" : "Annual"}{" "}
                Membership
              </CardDescription>
            </div>
            <Badge
              variant={
                subscription.status === "active" ? "default" : "destructive"
              }
              className={statusColors[subscription.status]}
            >
              {subscription.status.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Subscription Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="text-2xl font-bold">
                €{subscription.amount}
                <span className="text-sm text-muted-foreground">
                  /{subscription.interval}
                </span>
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Next Billing Date</p>
              <p className="font-medium">
                {format(subscription.currentPeriodEnd, "MMMM dd, yyyy")}
              </p>
            </div>
          </div>

          {/* Payment Method */}
          {subscription.paymentMethod && (
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">
                  {subscription.paymentMethod.brand.toUpperCase()} ****{" "}
                  {subscription.paymentMethod.last4}
                </p>
                <p className="text-sm text-muted-foreground">
                  Expires {subscription.paymentMethod.expiryMonth}/
                  {subscription.paymentMethod.expiryYear}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={openCustomerPortal}>
                Update
              </Button>
            </div>
          )}

          {/* Cancellation Notice */}
          {subscription.cancelAtPeriodEnd && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Your subscription will be canceled on{" "}
                {format(subscription.currentPeriodEnd, "MMMM dd, yyyy")}. You'll
                retain access until then.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Change Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Change Plan
          </CardTitle>
          <CardDescription>
            Upgrade or downgrade your membership tier
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            value={subscription.tier}
            onValueChange={handleChangePlan}
            disabled={isChangingPlan}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Explorer">Explorer - Free</SelectItem>
              <SelectItem value="Insider">Insider - €15/month</SelectItem>
              <SelectItem value="Core">Core - €50/month</SelectItem>
              <SelectItem value="Founder">Founder - €250/month</SelectItem>
            </SelectContent>
          </Select>

          <p className="text-sm text-muted-foreground">
            Changes will be prorated and reflected in your next billing cycle
          </p>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Subscription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={openCustomerPortal}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Update Payment Method
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleDownloadInvoices}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Invoices
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={openCustomerPortal}
          >
            <Calendar className="h-4 w-4 mr-2" />
            View Billing History
          </Button>

          {subscription.cancelAtPeriodEnd ? (
            <Button
              variant="default"
              className="w-full justify-start"
              onClick={handleReactivateSubscription}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Reactivate Subscription
            </Button>
          ) : (
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={handleCancelSubscription}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Cancel Subscription
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
