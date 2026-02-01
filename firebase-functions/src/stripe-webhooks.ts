/**
 * Stripe Webhook Handlers
 *
 * Handle Stripe webhook events for payments, subscriptions, and tickets
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(functions.config().stripe?.secret_key || process.env.STRIPE_SECRET_KEY || "", {
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
    const webhookSecret = functions.config().stripe?.webhook_secret || process.env.STRIPE_WEBHOOK_SECRET;
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      webhookSecret || ""
    );
  } catch (err: any) {
    functions.logger.error("Webhook signature verification failed:", err);
    res.status(400).send(`Webhook Error: ${err.message}`);
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
  const { customer, metadata } = session;

  const userId = metadata?.userId;
  if (!userId || userId === "anonymous") {
    functions.logger.warn("No userId in checkout session");
    // Still process anonymous donations
    if (metadata?.type === "donation") {
      await handleAnonymousDonation(session);
    }
    return;
  }

  const db = admin.firestore();
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

  // Get subscription to determine tier
  let tier = "insider";
  if (session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
      { expand: ["items.data.price.product"] }
    );

    const product = subscription.items.data[0]?.price?.product as Stripe.Product;
    tier = product?.metadata?.tier || "insider";
  }

  await db.collection("users").doc(userId).update({
    membershipTier: tier,
    membershipStatus: "active",
    membershipStartDate: admin.firestore.FieldValue.serverTimestamp(),
    stripeSubscriptionId: session.subscription || null,
  });

  // Create membership record
  await db.collection("memberships").add({
    userId,
    tier,
    status: "active",
    stripeSessionId: session.id,
    stripeSubscriptionId: session.subscription,
    startDate: admin.firestore.FieldValue.serverTimestamp(),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
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
  const isMonthly = session.metadata?.monthly === "true";

  const donationData = {
    userId,
    amount,
    currency: session.currency,
    allocation,
    stripeSessionId: session.id,
    stripeSubscriptionId: session.subscription || null,
    status: "completed",
    recurring: isMonthly,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await db.collection("donations").add(donationData);

  await db.collection("users").doc(userId).update({
    totalDonated: admin.firestore.FieldValue.increment(amount),
    lastDonationAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  functions.logger.info(`Donation recorded: €${amount} from ${userId}`);
}

/**
 * Handle anonymous donation
 */
async function handleAnonymousDonation(session: Stripe.Checkout.Session) {
  const db = admin.firestore();
  const amount = session.amount_total ? session.amount_total / 100 : 0;
  const allocation = session.metadata?.allocation
    ? JSON.parse(session.metadata.allocation)
    : {};

  await db.collection("donations").add({
    userId: "anonymous",
    email: session.customer_details?.email || null,
    amount,
    currency: session.currency,
    allocation,
    stripeSessionId: session.id,
    status: "completed",
    recurring: session.metadata?.monthly === "true",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  functions.logger.info(`Anonymous donation recorded: €${amount}`);
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
  const ticketTypeId = session.metadata?.ticketTypeId;
  const quantity = parseInt(session.metadata?.quantity || "1");
  const attendeeInfo = session.metadata?.attendeeInfo
    ? JSON.parse(session.metadata.attendeeInfo)
    : {};

  if (!eventId || !ticketTypeId) {
    functions.logger.error("Missing eventId or ticketTypeId in ticket purchase");
    return;
  }

  const batch = db.batch();
  const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  // Get event and ticket type details
  const eventDoc = await db.collection("events").doc(eventId).get();
  const event = eventDoc.data();
  const ticketType = event?.ticketTypes?.find((t: any) => t.id === ticketTypeId);

  // Create tickets
  const ticketIds: string[] = [];
  for (let i = 0; i < quantity; i++) {
    const ticketRef = db.collection("event_registrations").doc();
    const ticketNumber = `${orderNumber}-${i + 1}`;

    batch.set(ticketRef, {
      id: ticketRef.id,
      eventId,
      userId,
      ticketNumber,
      orderNumber,
      ticketType: ticketType?.name || "General",
      ticketTypeId,
      price: ticketType?.price || 0,
      status: "valid",
      attendee: attendeeInfo[i] || {
        firstName: session.customer_details?.name?.split(" ")[0] || "",
        lastName: session.customer_details?.name?.split(" ").slice(1).join(" ") || "",
        email: session.customer_details?.email || "",
      },
      purchasedAt: admin.firestore.FieldValue.serverTimestamp(),
      checkedIn: false,
      stripeSessionId: session.id,
    });

    ticketIds.push(ticketRef.id);
  }

  // Update ticket sold count
  const eventRef = db.collection("events").doc(eventId);
  const ticketTypes = event?.ticketTypes || [];
  const updatedTicketTypes = ticketTypes.map((t: any) => {
    if (t.id === ticketTypeId) {
      return {
        ...t,
        soldCount: (t.soldCount || 0) + quantity,
      };
    }
    return t;
  });

  batch.update(eventRef, { ticketTypes: updatedTicketTypes });

  await batch.commit();

  functions.logger.info(`${quantity} ticket(s) created for event ${eventId}, user ${userId}`);
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

  // Determine tier from product metadata
  let tier = "insider";
  if (subscription.items.data[0]) {
    const price = await stripe.prices.retrieve(
      subscription.items.data[0].price.id,
      { expand: ["product"] }
    );
    const product = price.product as Stripe.Product;
    tier = product.metadata?.tier || "insider";
  }

  const currentPeriodEnd = (subscription as any).current_period_end;

  await db.collection("users").doc(userId).update({
    membershipTier: tier,
    membershipStatus: subscription.status,
    stripeSubscriptionId: subscription.id,
    currentPeriodEnd: currentPeriodEnd
      ? admin.firestore.Timestamp.fromDate(new Date(currentPeriodEnd * 1000))
      : null,
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

  if (userQuery.empty) {
    functions.logger.warn(`No user found for customer ${customerId}`);
    return;
  }

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
  const subscriptionId = (invoice as any).subscription;

  if (subscriptionId) {
    // Recurring payment
    const userQuery = await db
      .collection("users")
      .where("stripeCustomerId", "==", customerId)
      .limit(1)
      .get();

    if (!userQuery.empty) {
      const userId = userQuery.docs[0].id;

      // Check if it's a donation subscription
      const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);
      if (subscription.metadata?.type === "donation") {
        const amount = invoice.amount_paid / 100;
        const allocation = subscription.metadata?.allocation
          ? JSON.parse(subscription.metadata.allocation)
          : {};

        await db.collection("donations").add({
          userId,
          amount,
          currency: invoice.currency,
          allocation,
          stripeInvoiceId: invoice.id,
          stripeSubscriptionId: subscription.id,
          status: "completed",
          recurring: true,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        await db.collection("users").doc(userId).update({
          totalDonated: admin.firestore.FieldValue.increment(amount),
          lastDonationAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        functions.logger.info(`Recurring donation processed: €${amount} from ${userId}`);
      }
    }
  }

  functions.logger.info(`Invoice paid: ${invoice.id}`);
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

  if (!userQuery.empty) {
    const userId = userQuery.docs[0].id;

    await db.collection("users").doc(userId).update({
      paymentFailedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // TODO: Send email notification about payment failure
    functions.logger.warn(`Payment failed for user ${userId}, invoice ${invoice.id}`);
  }
}

/**
 * Handle successful payment intent
 */
async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  functions.logger.info(`Payment succeeded: ${paymentIntent.id}, amount: ${paymentIntent.amount / 100}`);
  // Additional logic if needed
}

/**
 * Handle failed payment intent
 */
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  functions.logger.warn(`Payment failed: ${paymentIntent.id}`);
  // Additional logic if needed
}

/**
 * Notify waitlist when tickets become available (unused - for future use)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
