/**
 * Partner Support Page
 *
 * Help and support resources for partners.
 * Part 6 - Partner Dashboard
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  MessageCircle,
  Mail,
  Book,
  Video,
  HelpCircle,
  Send,
  ExternalLink,
} from "lucide-react";

const RESOURCES = [
  {
    id: "1",
    title: "Getting Started Guide",
    description:
      "Learn how to set up your partner account and create your first project",
    icon: Book,
    link: "#",
  },
  {
    id: "2",
    title: "Video Tutorials",
    description:
      "Watch step-by-step video guides for using the partner dashboard",
    icon: Video,
    link: "#",
  },
  {
    id: "3",
    title: "FAQs",
    description: "Find answers to commonly asked questions",
    icon: HelpCircle,
    link: "/faq",
  },
  {
    id: "4",
    title: "Contact Support",
    description: "Get in touch with our support team for personalized help",
    icon: MessageCircle,
    link: "#contact",
  },
];

const FAQ_ITEMS = [
  {
    question: "How do I create a new project?",
    answer:
      'Go to the Projects page and click the "Create Project" button. Fill in the required information and submit for review.',
  },
  {
    question: "When will I receive my donation payouts?",
    answer:
      "Payouts are processed monthly on the 1st of each month. You can configure your payout schedule in Settings > Billing.",
  },
  {
    question: "How do I update my organization information?",
    answer:
      "Visit Settings > Organization to update your details, including name, website, and contact information.",
  },
  {
    question: "Can I add team members to my account?",
    answer:
      'Yes! Go to the Team page and click "Invite Member". You can assign different roles and permissions to each team member.',
  },
];

export default function PartnerSupport() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="text-gray-600">
          Get help and find resources to maximize your impact
        </p>
      </div>

      {/* Quick Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {RESOURCES.map((resource) => {
          const Icon = resource.icon;

          return (
            <Card
              key={resource.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {resource.description}
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href={resource.link}>
                        Learn More
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Brief description of your issue"
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Describe your issue or question in detail..."
                rows={6}
              />
            </div>

            <div>
              <Label htmlFor="email">Your Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" />
            </div>

            <Button type="submit">
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-600 mb-2">
              Or email us directly at:
            </p>
            <a
              href="mailto:partners@gratis.org"
              className="text-blue-600 hover:underline font-medium flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              partners@gratis.org
            </a>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {FAQ_ITEMS.map((item, index) => (
            <div key={index} className="pb-4 border-b last:border-0">
              <h3 className="font-semibold mb-2">{item.question}</h3>
              <p className="text-gray-600">{item.answer}</p>
            </div>
          ))}

          <Button variant="outline" className="w-full" asChild>
            <a href="/faq">
              View All FAQs
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
