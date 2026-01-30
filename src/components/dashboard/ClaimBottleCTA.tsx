import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Calendar } from "lucide-react";
import { useState } from "react";
import { ClaimBottleModal } from "./ClaimBottleModal";

interface ClaimBottleCTAProps {
  bottlesAvailable: number;
  nextResetDate: Date;
  userTier: "explorer" | "insider" | "core" | "founder";
}

export function ClaimBottleCTA({
  bottlesAvailable,
  nextResetDate,
  userTier,
}: ClaimBottleCTAProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasBottlesAvailable = bottlesAvailable > 0 || userTier === "founder";

  // Calculate days until reset
  const now = new Date();
  const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const daysUntilReset = Math.ceil(
    (resetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (hasBottlesAvailable) {
    return (
      <>
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Gift className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold">
                    You have{" "}
                    {userTier === "founder" ? "unlimited" : bottlesAvailable}{" "}
                    bottle{bottlesAvailable !== 1 ? "s" : ""} to claim!
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {userTier === "founder"
                    ? "As a Founder member, claim as many bottles as you need"
                    : `Resets in ${daysUntilReset} day${daysUntilReset !== 1 ? "s" : ""}`}
                </p>
              </div>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90"
                onClick={() => setIsModalOpen(true)}
              >
                Claim Your Bottle
              </Button>
            </div>
          </CardContent>
        </Card>

        <ClaimBottleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </>
    );
  }

  return (
    <Card className="bg-muted/50">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-muted-foreground" />
              <h3 className="text-xl font-semibold">
                You've claimed all bottles this month
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Next bottle available:{" "}
              {resetDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          {userTier !== "founder" && (
            <Button size="lg" variant="outline" asChild>
              <a href="/tribe">Upgrade for More</a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
