import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export const ProblemSolution = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {t("aboutPage.problem.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("aboutPage.problem.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* The Problem */}
          <Card className="p-8 border-2 border-destructive/20 bg-destructive/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-2xl font-bold">
                {t("aboutPage.problem.problemTitle")}
              </h3>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive mt-2 flex-shrink-0" />
                <p className="text-muted-foreground">
                  {t("aboutPage.problem.point1")}
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive mt-2 flex-shrink-0" />
                <p className="text-muted-foreground">
                  {t("aboutPage.problem.point2")}
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive mt-2 flex-shrink-0" />
                <p className="text-muted-foreground">
                  {t("aboutPage.problem.point3")}
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive mt-2 flex-shrink-0" />
                <p className="text-muted-foreground">
                  {t("aboutPage.problem.point4")}
                </p>
              </li>
            </ul>
          </Card>

          {/* The Solution */}
          <Card className="p-8 border-2 border-primary/20 bg-primary/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">
                {t("aboutPage.problem.solutionTitle")}
              </h3>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  {t("aboutPage.problem.solution1")}
                </p>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  {t("aboutPage.problem.solution2")}
                </p>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  {t("aboutPage.problem.solution3")}
                </p>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  {t("aboutPage.problem.solution4")}
                </p>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
};
