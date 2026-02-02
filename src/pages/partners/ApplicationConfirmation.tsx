/**
 * Partner Application Confirmation Page
 *
 * Displays confirmation message after successful application submission.
 * Part 6 - Section 25: Partner Application System
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, Mail, FileText, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function ApplicationConfirmation() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Application Submitted Successfully!
          </h1>

          <p className="text-xl text-gray-600">
            Thank you for applying to become a GRATIS partner. We've received
            your application and will review it carefully.
          </p>
        </div>

        {/* What Happens Next */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-6">What Happens Next?</h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Email Confirmation
                  </h3>
                  <p className="text-gray-600">
                    You'll receive a confirmation email with your application
                    reference number within the next few minutes.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Application Review
                  </h3>
                  <p className="text-gray-600">
                    Our team will review your application, verify your
                    organization's details, and check all submitted documents.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Decision Timeline
                  </h3>
                  <p className="text-gray-600">
                    We typically respond within{" "}
                    <strong>5-7 business days</strong>. If we need additional
                    information, we'll contact you via email.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg mb-3">
              Important Information
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Check your spam folder if you don't receive the confirmation
                  email
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Keep your registration documents ready in case we need
                  additional verification
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  We may contact your references to verify your organization's
                  standing
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Once approved, you'll receive login credentials to access your
                  partner dashboard
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default" size="lg">
            <Link to="/">
              <Home className="w-5 h-5 mr-2" />
              Return to Homepage
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link to="/projects">Browse Projects</Link>
          </Button>
        </div>

        {/* Contact Information */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-2">
            Have questions about your application?
          </p>
          <a
            href="mailto:partners@gratis.org"
            className="text-blue-600 hover:underline font-medium"
          >
            partners@gratis.org
          </a>
        </div>
      </div>
    </div>
  );
}
