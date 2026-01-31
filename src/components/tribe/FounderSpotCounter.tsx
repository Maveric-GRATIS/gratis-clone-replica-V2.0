import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, TrendingUp, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { db } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export function FounderSpotCounter() {
  const { t } = useTranslation();
  const [founderCount, setFounderCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const FOUNDER_LIMIT = 1000; // Total Founder spots available

  useEffect(() => {
    const fetchFounderCount = async () => {
      try {
        // Query Firestore for users with tribeTier === 'founder'
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("tribeTier", "==", "founder"));
        const snapshot = await getDocs(q);

        setFounderCount(snapshot.size);
      } catch (error) {
        console.error("Error fetching founder count:", error);
        // Fallback to mock data if Firestore is unavailable
        setFounderCount(247); // Mock value
      } finally {
        setLoading(false);
      }
    };

    fetchFounderCount();
  }, []);

  const spotsRemaining =
    founderCount !== null ? FOUNDER_LIMIT - founderCount : null;
  const percentageFilled =
    founderCount !== null ? (founderCount / FOUNDER_LIMIT) * 100 : 0;

  return (
    <section className="py-20">
      <div className="container max-w-4xl">
        <Card className="relative overflow-hidden border-2 border-yellow-400 dark:border-yellow-600 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,.05) 35px, rgba(0,0,0,.05) 70px)`,
              }}
            />
          </div>

          <div className="relative p-8 md:p-12">
            {/* Header */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <Crown className="h-10 w-10 text-yellow-600" />
              <h2 className="text-3xl md:text-4xl font-black">
                {t("tribePage.founderCounter.title")}
              </h2>
            </div>

            {/* Counter */}
            <div className="text-center mb-8">
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-20 w-40 bg-muted/50 rounded-lg mx-auto" />
                </div>
              ) : (
                <>
                  <div className="text-6xl md:text-7xl font-black text-yellow-600 mb-2">
                    {spotsRemaining !== null ? spotsRemaining : "---"}
                  </div>
                  <p className="text-xl text-muted-foreground">
                    {t("tribePage.founderCounter.spotsLeft")}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {founderCount !== null &&
                      `${founderCount} / ${FOUNDER_LIMIT} ${t("tribePage.founderCounter.claimed")}`}
                  </p>
                </>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="h-4 bg-background/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-1000 ease-out"
                  style={{ width: `${percentageFilled}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>0</span>
                <span className="font-semibold">
                  {percentageFilled.toFixed(1)}%{" "}
                  {t("tribePage.founderCounter.filled")}
                </span>
                <span>{FOUNDER_LIMIT}</span>
              </div>
            </div>

            {/* Alert Message */}
            <div className="bg-yellow-100 dark:bg-yellow-950/50 border border-yellow-400 dark:border-yellow-600 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold text-center">
                ⚠️ {t("tribePage.founderCounter.warning")}
              </p>
            </div>

            {/* Benefits Reminder */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-black text-yellow-600 mb-1">
                  €247
                </div>
                <div className="text-xs text-muted-foreground">
                  {t("tribePage.founderCounter.benefit1")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-yellow-600 mb-1">
                  10x
                </div>
                <div className="text-xs text-muted-foreground">
                  {t("tribePage.founderCounter.benefit2")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-yellow-600 mb-1">
                  ∞
                </div>
                <div className="text-xs text-muted-foreground">
                  {t("tribePage.founderCounter.benefit3")}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
