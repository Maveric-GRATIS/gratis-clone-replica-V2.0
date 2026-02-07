import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { db } from "@/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { ImpactDonutChart } from "@/components/ImpactDonutChart";
import { ImpactTimeline } from "@/components/ImpactTimeline";
import { NGOPartnersGrid } from "@/components/NGOPartnersGrid";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Droplets,
  Users,
  HandHeart,
  TrendingUp,
  Download,
  FileText,
  Activity,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";

interface ImpactStats {
  totalDonated: number;
  bottlesDistributed: number;
  ngosSupported: number;
  tribeMembers: number;
  breakdown: {
    water: number;
    arts: number;
    education: number;
  };
  lastUpdated: Date;
}

interface QuarterlyReport {
  id: string;
  quarter: string;
  year: number;
  title: string;
  publishDate: string;
  url: string;
}

interface UserImpact {
  totalContributed: number;
  bottlesClaimed: number;
  memberSince: Date;
  impactShare: {
    water: number;
    arts: number;
    education: number;
  };
}

export default function Impact() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [impactStats, setImpactStats] = useState<ImpactStats | null>(null);
  const [userImpact, setUserImpact] = useState<UserImpact | null>(null);
  const [loading, setLoading] = useState(true);

  // Quarterly reports (will come from Firestore in production)
  const quarterlyReports: QuarterlyReport[] = [
    {
      id: "1",
      quarter: "Q4",
      year: 2025,
      title: t("impactPage.reports.q4_2025"),
      publishDate: "2026-01-15",
      url: "/reports/2025-q4.pdf",
    },
    {
      id: "2",
      quarter: "Q3",
      year: 2025,
      title: t("impactPage.reports.q3_2025"),
      publishDate: "2025-10-15",
      url: "/reports/2025-q3.pdf",
    },
  ];

  useEffect(() => {
    const fetchImpactData = async () => {
      try {
        // Fetch global impact stats
        const statsDoc = await getDoc(doc(db, "impact_stats", "global"));

        if (statsDoc.exists()) {
          const data = statsDoc.data();
          setImpactStats({
            totalDonated: data.totalDonated || 0,
            bottlesDistributed: data.bottlesDistributed || 0,
            ngosSupported: data.ngosSupported || 0,
            tribeMembers: data.tribeMembers || 0,
            breakdown: {
              water: data.breakdown?.water || 0,
              arts: data.breakdown?.arts || 0,
              education: data.breakdown?.education || 0,
            },
            lastUpdated: data.lastUpdated?.toDate() || new Date(),
          });
        } else {
          // Mock data for development
          setImpactStats({
            totalDonated: 250000,
            bottlesDistributed: 15420,
            ngosSupported: 28,
            tribeMembers: 5234,
            breakdown: {
              water: 100000,
              arts: 75000,
              education: 75000,
            },
            lastUpdated: new Date(),
          });
        }

        // Fetch user-specific impact if logged in
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();

            // Calculate user's impact based on tier and membership duration
            const memberSince = userData.createdAt?.toDate() || new Date();
            const monthsActive = Math.max(
              1,
              Math.floor(
                (Date.now() - memberSince.getTime()) /
                  (1000 * 60 * 60 * 24 * 30),
              ),
            );

            let monthlyContribution = 0;
            switch (userData.tribeTier) {
              case "insider":
                monthlyContribution = 9.99;
                break;
              case "core":
                monthlyContribution = 97 / 12; // Annual divided by 12
                break;
              case "founder":
                monthlyContribution = 247 / 12; // One-time divided by 12
                break;
              default:
                monthlyContribution = 0;
            }

            const totalContributed = monthlyContribution * monthsActive;

            setUserImpact({
              totalContributed,
              bottlesClaimed: userData.bottlesClaimed || 0,
              memberSince,
              impactShare: {
                water: totalContributed * 0.4,
                arts: totalContributed * 0.3,
                education: totalContributed * 0.3,
              },
            });
          }
        }
      } catch (error) {
        console.error("Error fetching impact data:", error);
        // Use mock data on error
        setImpactStats({
          totalDonated: 250000,
          bottlesDistributed: 15420,
          ngosSupported: 28,
          tribeMembers: 5234,
          breakdown: {
            water: 100000,
            arts: 75000,
            education: 75000,
          },
          lastUpdated: new Date(),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchImpactData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t("impactPage.meta.title")}</title>
        <meta name="description" content={t("impactPage.meta.description")} />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section with Animated Counters */}
        <section className="bg-gradient-to-br from-primary/5 via-accent/5 to-background py-20">
          <div className="container">
            <div className="text-center mb-12">
              <Badge className="mb-4" variant="secondary">
                <Activity className="w-4 h-4 mr-2" />
                {t("impactPage.hero.badge")}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {t("impactPage.hero.title")}
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t("impactPage.hero.subtitle")}
              </p>
            </div>

            {/* Impact Counter Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-4xl font-bold mb-2 text-primary">
                  <AnimatedCounter
                    end={impactStats?.totalDonated || 0}
                    prefix="€"
                    duration={2500}
                  />
                </div>
                <p className="text-muted-foreground">
                  {t("impactPage.stats.totalDonated")}
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 mb-4">
                  <Droplets className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-4xl font-bold mb-2 text-primary">
                  <AnimatedCounter
                    end={impactStats?.bottlesDistributed || 0}
                    duration={2500}
                  />
                </div>
                <p className="text-muted-foreground">
                  {t("impactPage.stats.bottlesDistributed")}
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/10 mb-4">
                  <HandHeart className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-4xl font-bold mb-2 text-primary">
                  <AnimatedCounter
                    end={impactStats?.ngosSupported || 0}
                    duration={2500}
                  />
                </div>
                <p className="text-muted-foreground">
                  {t("impactPage.stats.ngosSupported")}
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/10 mb-4">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-4xl font-bold mb-2 text-primary">
                  <AnimatedCounter
                    end={impactStats?.tribeMembers || 0}
                    duration={2500}
                  />
                </div>
                <p className="text-muted-foreground">
                  {t("impactPage.stats.tribeMembers")}
                </p>
              </Card>
            </div>

            {/* Last updated */}
            <p className="text-center text-sm text-muted-foreground mt-8">
              {t("impactPage.lastUpdated")}{" "}
              {impactStats?.lastUpdated.toLocaleDateString(t("common.locale"), {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </section>

        {/* Allocation Breakdown */}
        <section className="py-20 bg-background">
          <div className="container max-w-4xl">
            {impactStats && (
              <ImpactDonutChart
                waterAmount={impactStats.breakdown.water}
                artsAmount={impactStats.breakdown.arts}
                educationAmount={impactStats.breakdown.education}
              />
            )}
          </div>
        </section>

        {/* Personal Impact Section (Logged-in Users) */}
        {user && userImpact && (
          <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="container max-w-4xl">
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-8 h-8 text-primary" />
                  <h2 className="text-3xl font-bold">
                    {t("impactPage.personal.title")}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {t("impactPage.personal.totalContributed")}
                    </p>
                    <p className="text-3xl font-bold text-primary">
                      €{userImpact.totalContributed.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {t("impactPage.personal.bottlesClaimed")}
                    </p>
                    <p className="text-3xl font-bold">
                      {userImpact.bottlesClaimed}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {t("impactPage.personal.memberSince")}
                    </p>
                    <p className="text-xl font-semibold">
                      {userImpact.memberSince.toLocaleDateString(
                        t("common.locale"),
                        {
                          year: "numeric",
                          month: "short",
                        },
                      )}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">
                    {t("impactPage.personal.yourImpact")}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg">
                      <span>{t("impactPage.allocation.water")}</span>
                      <span className="font-bold">
                        €{userImpact.impactShare.water.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg">
                      <span>{t("impactPage.allocation.arts")}</span>
                      <span className="font-bold">
                        €{userImpact.impactShare.arts.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                      <span>{t("impactPage.allocation.education")}</span>
                      <span className="font-bold">
                        €{userImpact.impactShare.education.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <Button asChild>
                    <Link to="/dashboard">
                      {t("impactPage.personal.viewDashboard")}
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* Timeline of Milestones */}
        <section className="py-20 bg-background">
          <div className="container max-w-4xl">
            <ImpactTimeline />
          </div>
        </section>

        {/* NGO Partners Grid */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <NGOPartnersGrid />
          </div>
        </section>

        {/* Quarterly Reports */}
        <section className="py-20 bg-background">
          <div className="container max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-2">
                {t("impactPage.reports.title")}
              </h2>
              <p className="text-muted-foreground">
                {t("impactPage.reports.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quarterlyReports.map((report) => (
                <Card
                  key={report.id}
                  className="p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 flex-shrink-0">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {report.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {new Date(report.publishDate).toLocaleDateString(
                          t("common.locale"),
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={report.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          {t("impactPage.reports.download")}
                        </a>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {!user && (
          <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/10">
            <div className="container text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t("impactPage.cta.title")}
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                {t("impactPage.cta.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/tribe">{t("impactPage.cta.joinTribe")}</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/spark/donate">
                    {t("impactPage.cta.makedonation")}
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
