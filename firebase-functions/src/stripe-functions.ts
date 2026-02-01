/**
 * Stripe Payment Functions
 * Complete payment system implementation
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(functions.config().stripe?.secret_key || process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-01-28.clover",
});

/**
 * Verify admin role
 */
async function isAdmin(uid: string): Promise<boolean> {
  const userDoc = await admin.firestore().collection("users").doc(uid).get();
  return userDoc.data()?.role === "admin";
}

/**
 * Get or create Stripe customer for user
 */
async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string
): Promise<string> {
  const userDoc = await admin.firestore().collection("users").doc(userId).get();
  const userData = userDoc.data();

  // Return existing customer ID if available
  if (userData?.stripeCustomerId) {
    return userData.stripeCustomerId;
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      firebaseUID: userId,
    },
  });

  // Save customer ID to user document
  await admin.firestore().collection("users").doc(userId).update({
    stripeCustomerId: customer.id,
  });

  return customer.id;
}

/**
 * Create membership checkout session
 */
export const createMembershipCheckout = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated"
      );
    }

    try {
      const { priceId, successUrl, cancelUrl } = data;

      if (!priceId) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Price ID is required"
        );
      }

      const user = await admin.auth().getUser(context.auth.uid);
      const customerId = await getOrCreateStripeCustomer(
        context.auth.uid,
        user.email || "",
        user.displayName
      );

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "subscription",
        payment_method_types: ["card", "ideal", "bancontact"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: successUrl || `${functions.config().app?.url}/membership/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${functions.config().app?.url}/membership`,
        metadata: {
          userId: context.auth.uid,
          type: "membership",
        },
        subscription_data: {
          metadata: {
            userId: context.auth.uid,
          },
        },
        allow_promotion_codes: true,
        billing_address_collection: "required",
      });

      return {
        sessionId: session.id,
        url: session.url,
      };
    } catch (error: any) {
      console.error("Error creating membership checkout:", error);
      throw new functions.https.HttpsError(
        "internal",
        error.message || "Failed to create checkout session"
      );
    }
  }
);

/**
 * Create donation checkout session
 */
export const createDonationCheckout = functions.https.onCall(
  async (data, context) => {
    try {
      const {
        amount,
        currency = "eur",
        allocation,
        email,
        name,
        successUrl,
        cancelUrl,
        monthly = false,
      } = data;

      if (!amount || amount < 100) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Amount must be at least €1.00"
        );
      }

      // Validate allocation adds up to 100%
      if (allocation) {
        const total = Object.values(allocation).reduce(
          (sum: number, val: any) => sum + val,
          0
        );
        if (Math.abs(total - 100) > 0.01) {
          throw new functions.https.HttpsError(
            "invalid-argument",
            "Allocation must add up to 100%"
          );
        }
      }

      let customerId: string | undefined;
      if (context.auth) {
        const user = await admin.auth().getUser(context.auth.uid);
        customerId = await getOrCreateStripeCustomer(
          context.auth.uid,
          user.email || email,
          user.displayName || name
        );
      }

      const sessionConfig: Stripe.Checkout.SessionCreateParams = {
        mode: monthly ? "subscription" : "payment",
        payment_method_types: ["card", "ideal", "bancontact"],
        success_url: successUrl || `${functions.config().app?.url}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${functions.config().app?.url}/donate`,
        metadata: {
          type: "donation",
          userId: context.auth?.uid || "anonymous",
          allocation: JSON.stringify(allocation || {}),
          monthly: monthly.toString(),
        },
      };

      if (customerId) {
        sessionConfig.customer = customerId;
      } else {
        sessionConfig.customer_email = email;
      }

      if (monthly) {
        // Create a price for recurring donation
        const price = await stripe.prices.create({
          unit_amount: amount,
          currency,
          recurring: { interval: "month" },
          product_data: {
            name: "Monthly Donation",
          },
        });

        sessionConfig.line_items = [{ price: price.id, quantity: 1 }];
        sessionConfig.subscription_data = {
          metadata: {
            type: "donation",
            userId: context.auth?.uid || "anonymous",
            allocation: JSON.stringify(allocation || {}),
          },
        };
      } else {
        sessionConfig.line_items = [
          {
            price_data: {
              currency,
              unit_amount: amount,
              product_data: {
                name: "One-time Donation",
                description: `Donation of €${(amount / 100).toFixed(2)}`,
              },
            },
            quantity: 1,
          },
        ];
      }

      const session = await stripe.checkout.sessions.create(sessionConfig);

      return {
        sessionId: session.id,
        url: session.url,
      };
    } catch (error: any) {
      console.error("Error creating donation checkout:", error);
      throw new functions.https.HttpsError(
        "internal",
        error.message || "Failed to create donation checkout"
      );
    }
  }
);

/**
 * Create event ticket checkout session
 */
export const createEventTicketCheckout = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated"
      );
    }

    try {
      const {
        eventId,
        ticketTypeId,
        quantity = 1,
        attendeeInfo,
        successUrl,
        cancelUrl,
      } = data;

      if (!eventId || !ticketTypeId) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Event ID and ticket type ID are required"
        );
      }

      // Get event and ticket type
      const eventDoc = await admin
        .firestore()
        .collection("events")
        .doc(eventId)
        .get();

      if (!eventDoc.exists) {
        throw new functions.https.HttpsError(
          "not-found",
          "Event not found"
        );
      }

      const event = eventDoc.data()!;
      const ticketType = event.ticketTypes?.find(
        (t: any) => t.id === ticketTypeId
      );

      if (!ticketType) {
        throw new functions.https.HttpsError(
          "not-found",
          "Ticket type not found"
        );
      }

      // Check availability
      const soldCount = ticketType.soldCount || 0;
      if (soldCount + quantity > ticketType.quantity) {
        throw new functions.https.HttpsError(
          "failed-precondition",
          "Not enough tickets available"
        );
      }

      const user = await admin.auth().getUser(context.auth.uid);
      const customerId = await getOrCreateStripeCustomer(
        context.auth.uid,
        user.email || "",
        user.displayName
      );

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "payment",
        payment_method_types: ["card", "ideal", "bancontact"],
        line_items: [
          {
            price_data: {
              currency: "eur",
              unit_amount: ticketType.price * 100, // Convert to cents
              product_data: {
                name: `${event.title} - ${ticketType.name}`,
                description: ticketType.description,
                images: event.image ? [event.image] : [],
              },
            },
            quantity,
          },
        ],
        success_url: successUrl || `${functions.config().app?.url}/events/${eventId}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${functions.config().app?.url}/events/${eventId}`,
        metadata: {
          type: "event_ticket",
          userId: context.auth.uid,
          eventId,
          ticketTypeId,
          quantity: quantity.toString(),
          attendeeInfo: JSON.stringify(attendeeInfo || {}),
        },
      });

      return {
        sessionId: session.id,
        url: session.url,
      };
    } catch (error: any) {
      console.error("Error creating event ticket checkout:", error);
      throw new functions.https.HttpsError(
        "internal",
        error.message || "Failed to create ticket checkout"
      );
    }
  }
);

/**
 * Create customer portal session
 */
export const createCustomerPortal = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated"
      );
    }

    try {
      const { returnUrl } = data;

      const userDoc = await admin
        .firestore()
        .collection("users")
        .doc(context.auth.uid)
        .get();

      const stripeCustomerId = userDoc.data()?.stripeCustomerId;

      if (!stripeCustomerId) {
        throw new functions.https.HttpsError(
          "failed-precondition",
          "No Stripe customer found"
        );
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: returnUrl || `${functions.config().app?.url}/account/membership`,
      });

      return {
        url: session.url,
      };
    } catch (error: any) {
      console.error("Error creating customer portal:", error);
      throw new functions.https.HttpsError(
        "internal",
        error.message || "Failed to create customer portal"
      );
    }
  }
);

/**
 * Get subscription status
 */
export const getSubscriptionStatus = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated"
      );
    }

    try {
      const userDoc = await admin
        .firestore()
        .collection("users")
        .doc(context.auth.uid)
        .get();

      const userData = userDoc.data();
      const stripeCustomerId = userData?.stripeCustomerId;

      if (!stripeCustomerId) {
        return {
          hasSubscription: false,
          subscriptions: [],
        };
      }

      // Get active subscriptions
      const subscriptions = await stripe.subscriptions.list({
        customer: stripeCustomerId,
        status: "active",
        expand: ["data.items.data.price.product"],
      });

      return {
        hasSubscription: subscriptions.data.length > 0,
        subscriptions: subscriptions.data.map((sub) => {
          const subAny = sub as any;
          return {
            id: sub.id,
            status: sub.status,
            currentPeriodEnd: subAny.current_period_end,
            cancelAtPeriodEnd: subAny.cancel_at_period_end,
            items: sub.items.data.map((item) => ({
              id: item.id,
              price: item.price.unit_amount,
              interval: item.price.recurring?.interval,
              product: (item.price.product as Stripe.Product)?.name,
            })),
          };
        }),
        tier: userData?.membershipTier || null,
      };
    } catch (error: any) {
      console.error("Error getting subscription status:", error);
      throw new functions.https.HttpsError(
        "internal",
        error.message || "Failed to get subscription status"
      );
    }
  }
);

/**
 * Cancel subscription
 */
export const cancelSubscription = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated"
      );
    }

    try {
      const { subscriptionId, immediately = false } = data;

      if (!subscriptionId) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Subscription ID is required"
        );
      }

      // Verify ownership
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const userDoc = await admin
        .firestore()
        .collection("users")
        .doc(context.auth.uid)
        .get();

      if (subscription.customer !== userDoc.data()?.stripeCustomerId) {
        throw new functions.https.HttpsError(
          "permission-denied",
          "Not authorized to cancel this subscription"
        );
      }

      if (immediately) {
        await stripe.subscriptions.cancel(subscriptionId);
      } else {
        await stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true,
        });
      }

      return {
        success: true,
        canceledImmediately: immediately,
      };
    } catch (error: any) {
      console.error("Error canceling subscription:", error);
      throw new functions.https.HttpsError(
        "internal",
        error.message || "Failed to cancel subscription"
      );
    }
  }
);

/**
 * Admin: Create Stripe product and prices
 */
export const createStripeProduct = functions.https.onCall(
  async (data, context) => {
    if (!context.auth || !(await isAdmin(context.auth.uid))) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Admin access required"
      );
    }

    try {
      const { name, description, prices, metadata } = data;

      // Create product
      const product = await stripe.products.create({
        name,
        description,
        metadata: metadata || {},
      });

      // Create prices
      const createdPrices = [];
      for (const priceData of prices) {
        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: priceData.amount,
          currency: priceData.currency || "eur",
          recurring: priceData.recurring
            ? {
                interval: priceData.interval,
                interval_count: priceData.intervalCount || 1,
              }
            : undefined,
          metadata: priceData.metadata || {},
        });
        createdPrices.push(price);
      }

      return {
        product: {
          id: product.id,
          name: product.name,
          description: product.description,
        },
        prices: createdPrices.map((p) => ({
          id: p.id,
          amount: p.unit_amount,
          currency: p.currency,
          interval: p.recurring?.interval,
        })),
      };
    } catch (error: any) {
      console.error("Error creating Stripe product:", error);
      throw new functions.https.HttpsError(
        "internal",
        error.message || "Failed to create product"
      );
    }
  }
);
