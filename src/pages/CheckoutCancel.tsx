import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, Mail } from "lucide-react";
import { SEO } from "@/components/SEO";

export default function CheckoutCancel() {
  return (
    <>
      <SEO title="Payment Cancelled" description="Your payment was cancelled" />

      <div className="container py-20">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
            <CardDescription>Your payment was not completed</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-muted p-6 rounded-lg text-center">
              <p className="text-muted-foreground">
                Don't worry - no charges were made to your account.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                You can try again whenever you're ready, or contact us if you
                need help.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex gap-3">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    Need Help?
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Contact our support team at{" "}
                    <a href="mailto:support@gratis.org" className="underline">
                      support@gratis.org
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full" size="lg" asChild>
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/contact">Contact Support</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
