/**
 * Stripe Webhook Handlers
 *
 * Handle Stripe webhook events for payments, subscriptions, and tickets
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Stripe from "stripe";

// Initialize Stripe (requires Firebase config: firebase functions:config:set stripe.secret_key="sk_..." stripe.webhook_secret="whsec_...")
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-01-28.clover",
});

/**
 * Main webhook handler
 */
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    functions.logger.error("Missing stripe-signature header");
    res.status(400).send("Missing signature");
    return;
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    functions.logger.error("Webhook signature verification failed:", err);
    res.status(400).send(`Webhook Error: ${err}`);
    return;
  }

  functions.logger.info(`Processing webhook event: ${event.type}`);

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionCanceled(event.data.object as Stripe.Subscription);
        break;

      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case "payment_intent.succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      default:
        functions.logger.info(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    functions.logger.error(`Error processing webhook ${event.type}:`, error);
    res.status(500).send("Webhook handler failed");
  }
});

/**
 * Handle successful checkout session
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { client_reference_id, customer, metadata } = session;

  if (!client_reference_id) {
    functions.logger.warn("No client_reference_id in checkout session");
    return;
  }

  const db = admin.firestore();
  const userId = client_reference_id;
  const purchaseType = metadata?.type || "unknown";

  functions.logger.info(`Checkout completed for user ${userId}, type: ${purchaseType}`);

  switch (purchaseType) {
    case "membership":
      await handleMembershipPurchase(userId, session);
      break;
    case "donation":
      await handleDonationPurchase(userId, session);
      break;
    case "event_ticket":
      await handleEventTicketPurchase(userId, session);
      break;
    default:
      functions.logger.warn(`Unknown purchase type: ${purchaseType}`);
  }

  if (customer) {
    await db.collection("users").doc(userId).update({
      stripeCustomerId: customer,
      lastPurchaseAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
}

/**
 * Handle membership purchase
 */
async function handleMembershipPurchase(
  userId: string,
  session: Stripe.Checkout.Session
) {
  const db = admin.firestore();
  const tier = session.metadata?.tier || "Insider";

  await db.collection("users").doc(userId).update({
    membershipTier: tier,
    membershipStatus: "active",
    membershipStartDate: admin.firestore.FieldValue.serverTimestamp(),
  });

  functions.logger.info(`Membership activated for ${userId}: ${tier}`);
}

/**
 * Handle donation purchase
 */
async function handleDonationPurchase(
  userId: string,
  session: Stripe.Checkout.Session
) {
  const db = admin.firestore();
  const amount = session.amount_total ? session.amount_total / 100 : 0;
  const allocation = session.metadata?.allocation
    ? JSON.parse(session.metadata.allocation)
    : {};

  await db.collection("donations").add({
    userId,
    amount,
    currency: session.currency,
    allocation,
    stripeSessionId: session.id,
    status: "completed",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await db.collection("users").doc(userId).update({
    totalDonated: admin.firestore.FieldValue.increment(amount),
    lastDonationAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  functions.logger.info(`Donation recorded: ${amount} EUR from ${userId}`);
}

/**
 * Handle event ticket purchase
 */
async function handleEventTicketPurchase(
  userId: string,
  session: Stripe.Checkout.Session
) {
  const db = admin.firestore();
  const eventId = session.metadata?.eventId;
  const ticketType = session.metadata?.ticketType;
  const quantity = parseInt(session.metadata?.quantity || "1");

  if (!eventId) {
    functions.logger.error("Missing eventId in ticket purchase");
    return;
  }

  const batch = db.batch();
  const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  for (let i = 0; i < quantity; i++) {
    const ticketRef = db.collection("tickets").doc();
    batch.set(ticketRef, {
      id: ticketRef.id,
      eventId,
      userId,
      type: ticketType,
      orderNumber,
      purchasedAt: admin.firestore.FieldValue.serverTimestamp(),
      checkedIn: false,
      status: "valid",
    });
  }

  await batch.commit();
  await notifyWaitlist(eventId, quantity);

  functions.logger.info(`Created ${quantity} tickets for event ${eventId}`);
}

/**
 * Handle subscription updates
 */
async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const db = admin.firestore();

  const userQuery = await db
    .collection("users")
    .where("stripeCustomerId", "==", customerId)
    .limit(1)
    .get();

  if (userQuery.empty) {
    functions.logger.warn(`No user found for customer ${customerId}`);
    return;
  }

  const userId = userQuery.docs[0].id;
  const tier = subscription.metadata?.tier || "Insider";
  const subAny = subscription as any;

  await db.collection("users").doc(userId).update({
    membershipTier: tier,
    membershipStatus: subscription.status,
    subscriptionId: subscription.id,
    currentPeriodEnd: new Date((subAny.current_period_end || 0) * 1000),
  });

  functions.logger.info(`Subscription updated for ${userId}: ${subscription.status}`);
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const db = admin.firestore();

  const userQuery = await db
    .collection("users")
    .where("stripeCustomerId", "==", customerId)
    .limit(1)
    .get();

  if (userQuery.empty) return;

  const userId = userQuery.docs[0].id;

  await db.collection("users").doc(userId).update({
    membershipStatus: "canceled",
    membershipCanceledAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  functions.logger.info(`Subscription canceled for ${userId}`);
}

/**
 * Handle successful invoice payment
 */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const db = admin.firestore();

  await db.collection("invoices").add({
    stripeInvoiceId: invoice.id,
    customerId,
    amount: invoice.amount_paid / 100,
    currency: invoice.currency,
    status: "paid",
    paidAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  functions.logger.info(`Invoice ${invoice.id} paid`);
}

/**
 * Handle failed invoice payment
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const db = admin.firestore();

  const userQuery = await db
    .collection("users")
    .where("stripeCustomerId", "==", customerId)
    .limit(1)
    .get();

  if (userQuery.empty) return;

  const userId = userQuery.docs[0].id;

  await db.collection("users").doc(userId).update({
    membershipStatus: "past_due",
    lastPaymentFailedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  functions.logger.warn(`Payment failed for ${userId}, invoice ${invoice.id}`);
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  functions.logger.info(`Payment succeeded: ${paymentIntent.id}`);
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  functions.logger.error(`Payment failed: ${paymentIntent.id}`);
}

/**
 * Notify waitlist when tickets become available
 */
async function notifyWaitlist(eventId: string, availableTickets: number) {
  const db = admin.firestore();

  const waitlistQuery = await db
    .collection("waitlist")
    .where("eventId", "==", eventId)
    .where("notified", "==", false)
    .orderBy("createdAt", "asc")
    .limit(availableTickets)
    .get();

  const batch = db.batch();

  waitlistQuery.docs.forEach((doc) => {
    batch.update(doc.ref, {
      notified: true,
      notifiedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    functions.logger.info(`Notifying waitlist entry ${doc.id}`);
  });

  await batch.commit();
}
