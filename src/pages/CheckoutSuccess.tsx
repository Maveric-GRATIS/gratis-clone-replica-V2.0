import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, Download, Mail } from "lucide-react";
import { SEO } from "@/components/SEO";
import { EventTicket } from "@/components/events/EventTicket";
import { Timestamp } from "firebase/firestore";

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [checkoutData, setCheckoutData] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      // In production: fetch checkout session details from Firebase
      // const getCheckoutSession = httpsCallable(functions, 'getCheckoutSession');
      // const result = await getCheckoutSession({ sessionId });
      // setCheckoutData(result.data);

      // Simulate loading
      setTimeout(() => {
        setCheckoutData({
          type: "event_ticket", // or 'membership', 'donation'
          amount: 2500,
          currency: "eur",
          customerEmail: "user@example.com",
          customerName: "John Doe",
          ticket: {
            id: "ticket_123",
            eventId: "event_1",
            userId: "user_123",
            ticketTierId: "tier_1",
            ticketTierName: "Free Entry",
            orderNumber:
              "ORD-" +
              Math.random().toString(36).substring(2, 10).toUpperCase(),
            qrCodeData: "",
            status: "valid" as const,
            checkedIn: false,
            checkedInAt: null,
            checkedInBy: null,
            purchasedAt: Timestamp.now(),
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          },
          event: {
            id: "event_1",
            title: "Amsterdam Water Festival 2026",
            slug: "amsterdam-water-festival-2026",
            description: "Join us for a celebration of clean water",
            startDate: Timestamp.fromDate(new Date("2026-06-15T10:00:00")),
            endDate: Timestamp.fromDate(new Date("2026-06-15T18:00:00")),
            timezone: "Europe/Amsterdam",
            location: {
              name: "Vondelpark",
              address: "Vondelpark 1",
              city: "Amsterdam",
              state: "",
              postalCode: "1071 AA",
              country: "Netherlands",
            },
          },
        });
        setLoading(false);
      }, 1000);
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="container py-20">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
            <p className="text-muted-foreground">Processing your payment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!sessionId || !checkoutData) {
    return (
      <div className="container py-20">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Invalid Session</CardTitle>
            <CardDescription>
              We couldn't find your checkout session
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link to="/">Go Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Payment Successful"
        description="Your payment has been processed successfully"
      />

      <div className="container py-20">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
            <CardDescription>Thank you for your support</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-muted p-6 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-mono font-medium">{sessionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">
                  €{(checkoutData.amount / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">
                  {checkoutData.customerEmail}
                </span>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex gap-3">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    Confirmation Email Sent
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    A confirmation email with all details has been sent to{" "}
                    {checkoutData.customerEmail}
                  </p>
                </div>
              </div>
            </div>

            {checkoutData.type === "event_ticket" &&
              checkoutData.ticket &&
              checkoutData.event && (
                <div className="mt-6">
                  <EventTicket
                    ticket={checkoutData.ticket}
                    event={checkoutData.event}
                    userEmail={checkoutData.customerEmail}
                    userName={
                      checkoutData.customerName || checkoutData.customerEmail
                    }
                  />
                </div>
              )}

            {checkoutData.type === "membership" && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Your membership is now active! Enjoy your exclusive benefits.
                </p>
                <Button asChild size="lg">
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              </div>
            )}

            {checkoutData.type === "donation" && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Thank you for your generous donation! Your support helps
                  provide clean water, arts education, and opportunities to
                  communities in need.
                </p>
                <Button asChild size="lg">
                  <Link to="/impact">See Your Impact</Link>
                </Button>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Button variant="outline" className="w-full" asChild>
              <Link to="/dashboard">View My Account</Link>
            </Button>
            <Button variant="ghost" className="w-full" asChild>
              <Link to="/">Back to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
