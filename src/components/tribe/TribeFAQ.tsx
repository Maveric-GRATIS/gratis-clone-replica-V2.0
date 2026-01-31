import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function TribeFAQ() {
  const { t } = useTranslation();

  const faqs = [
    {
      id: "1",
      question: t("tribePage.faq.q1"),
      answer: t("tribePage.faq.a1"),
    },
    {
      id: "2",
      question: t("tribePage.faq.q2"),
      answer: t("tribePage.faq.a2"),
    },
    {
      id: "3",
      question: t("tribePage.faq.q3"),
      answer: t("tribePage.faq.a3"),
    },
    {
      id: "4",
      question: t("tribePage.faq.q4"),
      answer: t("tribePage.faq.a4"),
    },
    {
      id: "5",
      question: t("tribePage.faq.q5"),
      answer: t("tribePage.faq.a5"),
    },
    {
      id: "6",
      question: t("tribePage.faq.q6"),
      answer: t("tribePage.faq.a6"),
    },
    {
      id: "7",
      question: t("tribePage.faq.q7"),
      answer: t("tribePage.faq.a7"),
    },
    {
      id: "8",
      question: t("tribePage.faq.q8"),
      answer: t("tribePage.faq.a8"),
    },
  ];

  return (
    <section className="py-20">
      <div className="container max-w-4xl">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
            <HelpCircle className="mr-1 h-3 w-3" />
            {t("tribePage.faq.badge")}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            {t("tribePage.faq.title")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("tribePage.faq.subtitle")}
          </p>
        </div>

        <Card className="p-6 mb-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left font-semibold hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        {/* Still have questions CTA */}
        <Card className="p-8 text-center bg-gradient-to-br from-primary/5 to-accent/5">
          <MessageCircle className="h-12 w-12 mx-auto text-primary mb-4" />
          <h3 className="text-2xl font-bold mb-2">
            {t("tribePage.faq.stillHaveQuestions")}
          </h3>
          <p className="text-muted-foreground mb-6">
            {t("tribePage.faq.contactPrompt")}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/contact">
              <Button variant="default">{t("tribePage.faq.contactUs")}</Button>
            </Link>
            <Link to="/faq">
              <Button variant="outline">{t("tribePage.faq.viewAllFaq")}</Button>
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
}
