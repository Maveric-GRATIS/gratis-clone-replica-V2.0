/**
 * Partner Application Page
 *
 * Public page for NGOs to apply to become a GRATIS partner.
 * Part 6 - Section 25: Partner Application System
 */

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PartnerApplicationForm } from "@/components/partners/PartnerApplicationForm";
import {
  CheckCircle,
  Users,
  TrendingUp,
  Globe,
  Heart,
  Shield,
} from "lucide-react";

export default function PartnerApplicationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Become a GRATIS Partner
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join our network of verified NGOs and amplify your impact. Connect
            with conscious consumers who want to support your mission.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
              <span>No Commission Fees</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
              <span>Direct Donations</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
            Partner Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">
                Reach New Donors
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Connect with thousands of conscious consumers actively looking
                to support impactful projects.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">
                Increase Funding
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Receive 100% of donations with no platform fees. Every euro goes
                directly to your projects.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">
                Global Visibility
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Showcase your work to an international audience and grow your
                supporter base.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">
                Impact Dashboard
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track donations, measure impact, and share updates with your
                supporters in real-time.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">
                Verified Badge
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Gain trust with our verification badge that shows donors your
                organization is legitimate.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">
                Partner Network
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Join a community of NGOs, share best practices, and collaborate
                on larger initiatives.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <PartnerApplicationForm />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 px-4 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2 dark:text-white">
                Who can apply?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Any registered non-profit organization, charity, foundation, or
                social enterprise can apply. You must have official registration
                documents and a proven track record.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2 dark:text-white">
                How long does the review process take?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Applications are typically reviewed within 5-7 business days. We
                may request additional documentation during the review process.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2 dark:text-white">
                Are there any fees?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                No! GRATIS is completely free for NGO partners. We don't charge
                any platform fees or commissions. 100% of donations go directly
                to your organization.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2 dark:text-white">
                What documents do I need?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                You'll need your registration certificate, tax exemption
                documents (if applicable), recent annual report, and financial
                statements. References from partner organizations are also
                required.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
