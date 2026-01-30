import { useState, useMemo } from "react";
import { PageHero } from "@/components/PageHero";
import { SEO } from "@/components/SEO";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Search, MessageCircle, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import {
  faqs,
  categoryLabels,
  categoryDescriptions,
  FAQCategory,
} from "@/data/faqData";

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | "all">(
    "all",
  );

  // Filter FAQs based on search and category
  const filteredFAQs = useMemo(() => {
    let filtered = faqs;

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((faq) => faq.category === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  // Count FAQs per category
  const categoryCounts = useMemo(() => {
    const counts: Record<FAQCategory, number> = {
      general: 0,
      tribe: 0,
      bottles: 0,
      impact: 0,
      account: 0,
    };
    faqs.forEach((faq) => {
      counts[faq.category]++;
    });
    return counts;
  }, []);

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <SEO
        title="FAQ - Frequently Asked Questions"
        description="Find answers to common questions about GRATIS Water, TRIBE membership, bottle claims, impact transparency, and account management."
      />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <PageHero
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about GRATIS"
      />

      <div className="bg-background pb-16">
        <div className="container max-w-5xl mx-auto px-4">
          {/* Search Bar */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All ({faqs.length})
            </Button>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <Button
                key={key}
                variant={selectedCategory === key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(key as FAQCategory)}
              >
                {label} ({categoryCounts[key as FAQCategory]})
              </Button>
            ))}
          </div>

          {/* Results Count */}
          {searchQuery && (
            <div className="mb-4 text-sm text-muted-foreground">
              Found {filteredFAQs.length} result
              {filteredFAQs.length !== 1 ? "s" : ""} for "{searchQuery}"
            </div>
          )}

          {/* FAQ Accordion */}
          {filteredFAQs.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedCategory === "all"
                    ? "All Questions"
                    : categoryLabels[selectedCategory]}
                </CardTitle>
                {selectedCategory !== "all" && (
                  <CardDescription>
                    {categoryDescriptions[selectedCategory]}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left hover:no-underline">
                        <div className="flex items-start gap-2 pr-4">
                          {selectedCategory === "all" && (
                            <Badge variant="secondary" className="mt-0.5">
                              {categoryLabels[faq.category]}
                            </Badge>
                          )}
                          <span className="font-semibold">{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2 pb-4 text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Try a different search term or browse all categories
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                >
                  Clear filters
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Still Have Questions CTA */}
          <Card className="mt-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="py-12 text-center">
              <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Can't find what you're looking for? Our support team is here to
                help.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/contact">
                  <Button size="lg">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Us
                  </Button>
                </Link>
                <a href="mailto:support@gratis.ngo">
                  <Button variant="outline" size="lg">
                    Email Support
                  </Button>
                </a>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Response time: Within 24 hours on business days
              </p>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="grid gap-4 md:grid-cols-3 mt-8">
            <Link to="/tribe">
              <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="text-base">TRIBE Membership</CardTitle>
                  <CardDescription>
                    Learn about tiers and benefits
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link to="/impact">
              <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="text-base">Impact Dashboard</CardTitle>
                  <CardDescription>See where your support goes</CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link to="/water">
              <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="text-base">GRATIS Water</CardTitle>
                  <CardDescription>Learn about our product</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
