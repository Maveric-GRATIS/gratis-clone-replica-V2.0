import React from "react";
import { Routes, Route } from "react-router-dom";

// Import payment components
import MembershipCheckout from "@/components/checkout/MembershipCheckout";
import DonationCheckout from "@/components/checkout/DonationCheckout";
import EventTicketCheckout from "@/components/checkout/EventTicketCheckout";
import CustomerPortal from "@/components/checkout/CustomerPortal";

/**
 * Payment routes for the application
 * Add these routes to your main App.tsx or router configuration
 */

export function PaymentRoutes() {
  return (
    <Routes>
      {/* Membership Routes */}
      <Route path="/membership" element={<MembershipCheckout />} />
      <Route path="/membership/success" element={<MembershipSuccessPage />} />

      {/* Donation Routes */}
      <Route path="/donate" element={<DonationCheckout />} />
      <Route path="/donate/success" element={<DonationSuccessPage />} />

      {/* Event Ticket Routes */}
      <Route
        path="/events/:eventId/checkout"
        element={<EventTicketCheckout />}
      />
      <Route
        path="/events/:eventId/confirmation"
        element={<TicketConfirmationPage />}
      />

      {/* Customer Portal */}
      <Route path="/portal" element={<CustomerPortal />} />
      <Route path="/billing" element={<CustomerPortal />} />
    </Routes>
  );
}

/**
 * Success page for membership checkout
 */
function MembershipSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4">Welcome to GRATIS!</h1>
          <p className="text-xl text-muted-foreground">
            Thank you for becoming a member. Your subscription is now active.
          </p>
        </div>

        <div className="bg-muted rounded-lg p-6 mb-8">
          <h3 className="font-semibold mb-2">What's Next?</h3>
          <ul className="text-left space-y-2 text-muted-foreground">
            <li>✓ Check your email for confirmation</li>
            <li>✓ Access exclusive member content</li>
            <li>✓ Manage your subscription in the portal</li>
          </ul>
        </div>

        <div className="flex gap-4 justify-center">
          <a
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Go to Dashboard
          </a>
          <a
            href="/portal"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent"
          >
            Manage Billing
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * Success page for donation
 */
function DonationSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4">Thank You!</h1>
          <p className="text-xl text-muted-foreground">
            Your donation has been received and will make a real difference.
          </p>
        </div>

        <div className="bg-muted rounded-lg p-6 mb-8">
          <h3 className="font-semibold mb-2">Your Impact</h3>
          <p className="text-muted-foreground mb-4">
            Your donation has been allocated according to your preferences and
            will support:
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-left">
              <div className="font-medium">Healthcare</div>
              <div className="font-medium">Housing</div>
            </div>
            <div className="text-left">
              <div className="font-medium">Education</div>
              <div className="font-medium">Community</div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 mb-8">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            📧 A tax receipt has been sent to your email address.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Return Home
          </a>
          <a
            href="/impact"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent"
          >
            View Impact
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * Confirmation page for event tickets
 */
function TicketConfirmationPage() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4">Tickets Confirmed!</h1>
          <p className="text-xl text-muted-foreground">
            Your tickets have been purchased successfully.
          </p>
        </div>

        <div className="bg-muted rounded-lg p-6 mb-8">
          <h3 className="font-semibold mb-2">What's Next?</h3>
          <ul className="text-left space-y-2 text-muted-foreground">
            <li>✓ Check your email for tickets with QR codes</li>
            <li>✓ Save tickets to your mobile wallet</li>
            <li>✓ Show QR code at event check-in</li>
            <li>✓ Event details and reminders will be sent</li>
          </ul>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950 rounded-lg p-4 mb-8">
          <p className="text-sm text-amber-900 dark:text-amber-100">
            📱 Don't forget to bring your QR code to the event!
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <a
            href="/events"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Browse Events
          </a>
          <a
            href="/tickets"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent"
          >
            View My Tickets
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * Example: How to integrate into main App.tsx
 *
 * import { PaymentRoutes } from "./routes/PaymentRoutes";
 *
 * function App() {
 *   return (
 *     <BrowserRouter>
 *       <Routes>
 *         <Route path="/" element={<HomePage />} />
 *         <Route path="/about" element={<AboutPage />} />
 *         {/* Add payment routes *\/}
 *         <Route path="/*" element={<PaymentRoutes />} />
 *       </Routes>
 *     </BrowserRouter>
 *   );
 * }
 */

/**
 * Example: Direct navigation links
 */
export function PaymentNavigationExamples() {
  return (
    <>
      {/* Membership CTA */}
      <a href="/membership" className="btn-primary">
        Become a Member
      </a>

      {/* Donate Button */}
      <a href="/donate" className="btn-secondary">
        Make a Donation
      </a>

      {/* Event Ticket Link */}
      <a href="/events/EVENT_ID/checkout" className="btn-outline">
        Buy Tickets
      </a>

      {/* Customer Portal Link */}
      <a href="/portal" className="btn-ghost">
        Manage Billing
      </a>
    </>
  );
}
