import { DonationWizard } from "@/components/donation/DonationWizard";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ArrowRight } from "lucide-react";

export default function DonateNew() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Make a Donation - GRATIS Foundation"
        description="Support our mission with a one-time or recurring donation. Every contribution creates lasting impact in communities worldwide."
        canonical={
          typeof window !== "undefined" ? window.location.href : "/spark/donate"
        }
      />

      {/* Quick Links */}
      <div className="bg-accent/30 border-b">
        <div className="container py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">
                Want to manage existing donations?
              </span>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="/spark/donate/manage">
                Manage Recurring Donations{" "}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      <DonationWizard />

      {/* Additional Info */}
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <h3 className="font-semibold mb-2">Tax Deductible</h3>
                  <p className="text-sm text-muted-foreground">
                    GRATIS Foundation is a registered 501(c)(3) nonprofit. All
                    donations are tax-deductible.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">100% Transparent</h3>
                  <p className="text-sm text-muted-foreground">
                    Track exactly where your money goes with our transparent
                    allocation system.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Secure Payment</h3>
                  <p className="text-sm text-muted-foreground">
                    All transactions are secured by Stripe with bank-level
                    encryption.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
