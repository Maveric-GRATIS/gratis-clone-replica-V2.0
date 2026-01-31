import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Vote,
  BarChart3,
  Users,
  TrendingUp,
  Award,
  Shield,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export function VotingExplainer() {
  const { t } = useTranslation();

  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
            <Vote className="mr-1 h-3 w-3" />
            {t("tribePage.voting.badge")}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            {t("tribePage.voting.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t("tribePage.voting.subtitle")}
          </p>
        </div>

        {/* How Voting Works */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid gap-6">
            {/* Step 1 */}
            <Card className="p-6">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    {t("tribePage.voting.step1.title")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("tribePage.voting.step1.description")}
                  </p>
                </div>
              </div>
            </Card>

            {/* Step 2 */}
            <Card className="p-6">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    {t("tribePage.voting.step2.title")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("tribePage.voting.step2.description")}
                  </p>
                </div>
              </div>
            </Card>

            {/* Step 3 */}
            <Card className="p-6">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    {t("tribePage.voting.step3.title")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("tribePage.voting.step3.description")}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Voting Benefits */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="p-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="p-3 rounded-lg bg-primary/10">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h3 className="font-bold text-lg mb-2">
              {t("tribePage.voting.benefit1.title")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("tribePage.voting.benefit1.description")}
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h3 className="font-bold text-lg mb-2">
              {t("tribePage.voting.benefit2.title")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("tribePage.voting.benefit2.description")}
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="p-3 rounded-lg bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h3 className="font-bold text-lg mb-2">
              {t("tribePage.voting.benefit3.title")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("tribePage.voting.benefit3.description")}
            </p>
          </Card>
        </div>

        {/* Example Ballot */}
        <div className="mt-16 max-w-2xl mx-auto">
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="text-center mb-6">
              <Award className="h-12 w-12 mx-auto text-primary mb-3" />
              <h3 className="text-2xl font-bold mb-2">
                {t("tribePage.voting.example.title")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("tribePage.voting.example.subtitle")}
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-background rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">
                    {t("tribePage.voting.example.option1")}
                  </span>
                  <Badge variant="outline">45%</Badge>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600"
                    style={{ width: "45%" }}
                  />
                </div>
              </div>

              <div className="bg-background rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">
                    {t("tribePage.voting.example.option2")}
                  </span>
                  <Badge variant="outline">30%</Badge>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600"
                    style={{ width: "30%" }}
                  />
                </div>
              </div>

              <div className="bg-background rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">
                    {t("tribePage.voting.example.option3")}
                  </span>
                  <Badge variant="outline">25%</Badge>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-600"
                    style={{ width: "25%" }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                {t("tribePage.voting.example.note")}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
