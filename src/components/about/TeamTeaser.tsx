import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Linkedin } from "lucide-react";

export const TeamTeaser = () => {
  const { t } = useTranslation();

  const teamMembers = [
    {
      name: t("aboutPage.team.member1.name"),
      role: t("aboutPage.team.member1.role"),
      bio: t("aboutPage.team.member1.bio"),
      avatar: "👨‍💼",
    },
    {
      name: t("aboutPage.team.member2.name"),
      role: t("aboutPage.team.member2.role"),
      bio: t("aboutPage.team.member2.bio"),
      avatar: "👩‍💻",
    },
    {
      name: t("aboutPage.team.member3.name"),
      role: t("aboutPage.team.member3.role"),
      bio: t("aboutPage.team.member3.bio"),
      avatar: "👨‍🎨",
    },
    {
      name: t("aboutPage.team.member4.name"),
      role: t("aboutPage.team.member4.role"),
      bio: t("aboutPage.team.member4.bio"),
      avatar: "👩‍🔬",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container">
        <div className="text-center mb-12">
          <Badge className="mb-4">{t("aboutPage.team.badge")}</Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {t("aboutPage.team.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("aboutPage.team.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
          {teamMembers.map((member, index) => (
            <Card
              key={index}
              className="p-6 text-center hover:shadow-lg transition-shadow"
            >
              {/* Avatar Placeholder */}
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-4xl">
                {member.avatar}
              </div>

              {/* Name & Role */}
              <h3 className="text-xl font-bold mb-1">{member.name}</h3>
              <p className="text-sm text-primary font-semibold mb-3">
                {member.role}
              </p>

              {/* Bio */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {member.bio}
              </p>

              {/* LinkedIn placeholder */}
              <Button variant="ghost" size="sm" className="w-full">
                <Linkedin className="w-4 h-4 mr-2" />
                Connect
              </Button>
            </Card>
          ))}
        </div>

        {/* CTA to full Team page */}
        <div className="text-center">
          <Card className="p-8 max-w-2xl mx-auto bg-background">
            <h3 className="text-2xl font-bold mb-3">
              {t("aboutPage.team.cta.title")}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t("aboutPage.team.cta.description")}
            </p>
            <Button size="lg" asChild>
              <Link to="/tribe/team">
                {t("aboutPage.team.cta.button")}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};
