import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export function ProductFAQ() {
  const { t } = useTranslation();

  const faqs = [
    {
      id: "1",
      question: t("waterPage.faq.q1"),
      answer: t("waterPage.faq.a1"),
    },
    {
      id: "2",
      question: t("waterPage.faq.q2"),
      answer: t("waterPage.faq.a2"),
    },
    {
      id: "3",
      question: t("waterPage.faq.q3"),
      answer: t("waterPage.faq.a3"),
    },
    {
      id: "4",
      question: t("waterPage.faq.q4"),
      answer: t("waterPage.faq.a4"),
    },
    {
      id: "5",
      question: t("waterPage.faq.q5"),
      answer: t("waterPage.faq.a5"),
    },
  ];

  return (
    <section className="py-20">
      <div className="container max-w-4xl">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
            <HelpCircle className="mr-1 h-3 w-3" />
            {t("waterPage.faq.badge")}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            {t("waterPage.faq.title")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("waterPage.faq.subtitle")}
          </p>
        </div>

        <Card className="p-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </div>
    </section>
  );
}
