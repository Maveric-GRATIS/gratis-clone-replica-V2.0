import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, Receipt, Crown, AlertCircle } from "lucide-react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Subscription {
  id: string;
  tier: string;
  status: string;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

export default function CustomerPortal() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState<boolean>(true);
  const [portalLoading, setPortalLoading] = useState<boolean>(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [userData, setUserData] = useState<any>(null);

  const loadUserData = useCallback(async () => {
    if (!user) return;

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);

        if (data.stripeSubscriptionId) {
          // Load subscription data
          const functions = getFunctions();
          const getSubscription = httpsCallable(
            functions,
            "getSubscriptionStatus",
          );
          const result = await getSubscription();
          const subData = result.data as any;

          if (subData.subscription) {
            setSubscription({
              id: subData.subscription.id,
              tier: data.membershipTier || "insider",
              status: subData.subscription.status,
              currentPeriodEnd: new Date(
                subData.subscription.current_period_end * 1000,
              ),
              cancelAtPeriodEnd: subData.subscription.cancel_at_period_end,
            });
          }
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const openCustomerPortal = async () => {
    setPortalLoading(true);

    try {
      const functions = getFunctions();
      const createPortal = httpsCallable(functions, "createCustomerPortal");

      const result = await createPortal({
        returnUrl: window.location.href,
      });

      const { url } = result.data as { url: string };
      window.location.href = url;
    } catch (error: any) {
      console.error("Portal error:", error);
      toast({
        title: t("error.portalFailed", "Portal Access Failed"),
        description:
          error.message || t("error.tryAgain", "Please try again later"),
        variant: "destructive",
      });
      setPortalLoading(false);
    }
  };

  const cancelSubscription = async () => {
    if (!subscription) return;

    const confirmed = window.confirm(
      t(
        "subscription.confirmCancel",
        "Are you sure you want to cancel your subscription? You'll still have access until the end of your billing period.",
      ),
    );

    if (!confirmed) return;

    try {
      const functions = getFunctions();
      const cancel = httpsCallable(functions, "cancelSubscription");

      await cancel({ immediately: false });

      toast({
        title: t("subscription.cancelled", "Subscription Cancelled"),
        description: t(
          "subscription.cancelledDescription",
          "Your subscription will end at the end of the current period.",
        ),
      });

      loadUserData();
    } catch (error: any) {
      console.error("Cancel error:", error);
      toast({
        title: t("error.cancelFailed", "Cancellation Failed"),
        description:
          error.message || t("error.tryAgain", "Please try again later"),
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          {t("portal.title", "Billing Portal")}
        </h1>

        <div className="grid gap-6">
          {/* Current Subscription */}
          {subscription && (
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Crown className="w-5 h-5 text-primary" />
                    {t("portal.currentPlan", "Current Plan")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t(
                      "portal.managePlan",
                      "Manage your subscription and billing",
                    )}
                  </p>
                </div>
                <Badge
                  variant={
                    subscription.status === "active"
                      ? "default"
                      : subscription.status === "past_due"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {subscription.status}
                </Badge>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("portal.tier", "Tier")}
                  </span>
                  <span className="font-medium capitalize">
                    {subscription.tier}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("portal.renewalDate", "Next Renewal")}
                  </span>
                  <span className="font-medium">
                    {subscription.currentPeriodEnd.toLocaleDateString()}
                  </span>
                </div>
                {subscription.cancelAtPeriodEnd && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      {t("portal.willCancel", "Your subscription will end on")}{" "}
                      {subscription.currentPeriodEnd.toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={openCustomerPortal}
                  disabled={portalLoading}
                  className="flex-1"
                >
                  {portalLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t("common.loading", "Loading...")}
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      {t("portal.manageBilling", "Manage Billing")}
                    </>
                  )}
                </Button>
                {!subscription.cancelAtPeriodEnd && (
                  <Button
                    onClick={cancelSubscription}
                    variant="outline"
                    className="flex-1"
                  >
                    {t("portal.cancel", "Cancel Plan")}
                  </Button>
                )}
              </div>
            </Card>
          )}

          {/* Donation History */}
          {userData && (
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                {t("portal.donationHistory", "Donation History")}
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("portal.totalDonated", "Total Donated")}
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    €{(userData.totalDonated || 0).toFixed(2)}
                  </span>
                </div>
                {userData.lastDonationAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("portal.lastDonation", "Last Donation")}
                    </span>
                    <span className="font-medium">
                      {userData.lastDonationAt.toDate().toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <Button
                onClick={openCustomerPortal}
                disabled={portalLoading}
                variant="outline"
                className="w-full"
              >
                {portalLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("common.loading", "Loading...")}
                  </>
                ) : (
                  <>
                    <Receipt className="w-4 h-4 mr-2" />
                    {t("portal.viewInvoices", "View Invoices")}
                  </>
                )}
              </Button>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">
              {t("portal.quickActions", "Quick Actions")}
            </h3>

            <div className="space-y-3">
              <Button
                onClick={openCustomerPortal}
                disabled={portalLoading}
                variant="outline"
                className="w-full justify-start"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {t("portal.updatePayment", "Update Payment Method")}
              </Button>
              <Button
                onClick={openCustomerPortal}
                disabled={portalLoading}
                variant="outline"
                className="w-full justify-start"
              >
                <Receipt className="w-4 h-4 mr-2" />
                {t("portal.downloadInvoices", "Download Invoices")}
              </Button>
            </div>
          </Card>

          {/* Help Section */}
          <Card className="p-6 bg-muted">
            <h3 className="font-semibold mb-2">
              {t("portal.needHelp", "Need Help?")}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t(
                "portal.helpDescription",
                "If you have any questions about your subscription or billing, please contact our support team.",
              )}
            </p>
            <Button variant="outline" size="sm">
              {t("portal.contactSupport", "Contact Support")}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
