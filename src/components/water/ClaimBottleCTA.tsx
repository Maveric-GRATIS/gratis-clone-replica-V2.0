import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClaimBottleModal } from "@/components/dashboard/ClaimBottleModal";
import { Gift, CheckCircle2, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface ClaimBottleCTAProps {
  userBottlesClaimed?: number;
  userBottlesLimit?: number;
  userTier?: string;
}

export function ClaimBottleCTA({
  userBottlesClaimed = 0,
  userBottlesLimit = 0,
  userTier,
}: ClaimBottleCTAProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  // Check if user can claim
  const canClaim = user && userBottlesClaimed < userBottlesLimit;
  const remainingBottles = userBottlesLimit - userBottlesClaimed;

  // Not logged in
  if (!user) {
    return (
      <section className="py-12 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="container max-w-4xl">
          <Card className="p-8 text-center border-2 border-primary/20">
            <div className="mb-4">
              <Lock className="h-12 w-12 mx-auto text-primary mb-3" />
              <h3 className="text-2xl font-bold mb-2">
                {t("waterPage.claim.nonMember.title")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t("waterPage.claim.nonMember.description")}
              </p>
            </div>
            <Link to="/tribe">
              <Button size="lg" className="text-lg">
                <Gift className="mr-2 h-5 w-5" />
                {t("waterPage.claim.nonMember.cta")}
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    );
  }

  // Logged in but no TRIBE membership
  if (!userTier || userTier === "none") {
    return (
      <section className="py-12 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="container max-w-4xl">
          <Card className="p-8 text-center border-2 border-primary/20">
            <div className="mb-4">
              <Gift className="h-12 w-12 mx-auto text-primary mb-3" />
              <h3 className="text-2xl font-bold mb-2">
                {t("waterPage.claim.noTier.title")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t("waterPage.claim.noTier.description")}
              </p>
            </div>
            <Link to="/tribe">
              <Button size="lg" className="text-lg">
                {t("waterPage.claim.noTier.cta")}
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    );
  }

  // Has membership but reached limit
  if (!canClaim) {
    return (
      <section className="py-12 bg-gradient-to-br from-muted/50 via-background to-muted/30">
        <div className="container max-w-4xl">
          <Card className="p-8 text-center">
            <div className="mb-4">
              <CheckCircle2 className="h-12 w-12 mx-auto text-green-600 mb-3" />
              <h3 className="text-2xl font-bold mb-2">
                {t("waterPage.claim.limitReached.title")}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t("waterPage.claim.limitReached.description")}
              </p>
              <Badge variant="secondary" className="text-sm">
                {t("waterPage.claim.limitReached.nextReset")}
              </Badge>
            </div>
            <Link to="/dashboard/bottles">
              <Button variant="outline" size="lg">
                {t("waterPage.claim.limitReached.viewOrders")}
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    );
  }

  // Can claim!
  return (
    <>
      <section className="py-12 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="container max-w-4xl">
          <Card className="p-8 text-center border-2 border-primary/30">
            <div className="mb-4">
              <Gift className="h-12 w-12 mx-auto text-primary mb-3" />
              <h3 className="text-2xl font-bold mb-2">
                {t("waterPage.claim.available.title")}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t("waterPage.claim.available.description")}
              </p>
              <div className="flex items-center justify-center gap-4 mb-6">
                <Badge variant="default" className="text-lg px-4 py-2">
                  {remainingBottles} {t("waterPage.claim.available.remaining")}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {userTier?.toUpperCase()}{" "}
                  {t("waterPage.claim.available.tier")}
                </Badge>
              </div>
            </div>
            <Button
              size="lg"
              className="text-lg"
              onClick={() => setIsClaimModalOpen(true)}
            >
              <Gift className="mr-2 h-5 w-5" />
              {t("waterPage.claim.available.cta")}
            </Button>
          </Card>
        </div>
      </section>

      <ClaimBottleModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
      />
    </>
  );
}
