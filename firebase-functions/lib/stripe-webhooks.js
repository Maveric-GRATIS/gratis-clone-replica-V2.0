"use strict";
/**
 * Stripe Webhook Handlers
 *
 * Handle Stripe webhook events for payments, subscriptions, and tickets
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhook = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const stripe_1 = __importDefault(require("stripe"));
// Initialize Stripe
const stripe = new stripe_1.default(((_a = functions.config().stripe) === null || _a === void 0 ? void 0 : _a.secret_key) || process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2026-01-28.clover",
});
/**
 * Main webhook handler
 */
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
    var _a;
    const sig = req.headers["stripe-signature"];
    if (!sig) {
        functions.logger.error("Missing stripe-signature header");
        res.status(400).send("Missing signature");
        return;
    }
    let event;
    try {
        const webhookSecret = ((_a = functions.config().stripe) === null || _a === void 0 ? void 0 : _a.webhook_secret) || process.env.STRIPE_WEBHOOK_SECRET;
        event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret || "");
    }
    catch (err) {
        functions.logger.error("Webhook signature verification failed:", err);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    functions.logger.info(`Processing webhook event: ${event.type}`);
    try {
        switch (event.type) {
            case "checkout.session.completed":
                await handleCheckoutCompleted(event.data.object);
                break;
            case "customer.subscription.created":
            case "customer.subscription.updated":
                await handleSubscriptionUpdate(event.data.object);
                break;
            case "customer.subscription.deleted":
                await handleSubscriptionCanceled(event.data.object);
                break;
            case "invoice.paid":
                await handleInvoicePaid(event.data.object);
                break;
            case "invoice.payment_failed":
                await handleInvoicePaymentFailed(event.data.object);
                break;
            case "payment_intent.succeeded":
                await handlePaymentSucceeded(event.data.object);
                break;
            case "payment_intent.payment_failed":
                await handlePaymentFailed(event.data.object);
                break;
            default:
                functions.logger.info(`Unhandled event type: ${event.type}`);
        }
        res.json({ received: true });
    }
    catch (error) {
        functions.logger.error(`Error processing webhook ${event.type}:`, error);
        res.status(500).send("Webhook handler failed");
    }
});
/**
 * Handle successful checkout session
 */
async function handleCheckoutCompleted(session) {
    const { customer, metadata } = session;
    const userId = metadata === null || metadata === void 0 ? void 0 : metadata.userId;
    if (!userId || userId === "anonymous") {
        functions.logger.warn("No userId in checkout session");
        // Still process anonymous donations
        if ((metadata === null || metadata === void 0 ? void 0 : metadata.type) === "donation") {
            await handleAnonymousDonation(session);
        }
        return;
    }
    const db = admin.firestore();
    const purchaseType = (metadata === null || metadata === void 0 ? void 0 : metadata.type) || "unknown";
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
async function handleMembershipPurchase(userId, session) {
    var _a, _b, _c;
    const db = admin.firestore();
    // Get subscription to determine tier
    let tier = "insider";
    if (session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription, { expand: ["items.data.price.product"] });
        const product = (_b = (_a = subscription.items.data[0]) === null || _a === void 0 ? void 0 : _a.price) === null || _b === void 0 ? void 0 : _b.product;
        tier = ((_c = product === null || product === void 0 ? void 0 : product.metadata) === null || _c === void 0 ? void 0 : _c.tier) || "insider";
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
async function handleDonationPurchase(userId, session) {
    var _a, _b;
    const db = admin.firestore();
    const amount = session.amount_total ? session.amount_total / 100 : 0;
    const allocation = ((_a = session.metadata) === null || _a === void 0 ? void 0 : _a.allocation)
        ? JSON.parse(session.metadata.allocation)
        : {};
    const isMonthly = ((_b = session.metadata) === null || _b === void 0 ? void 0 : _b.monthly) === "true";
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
async function handleAnonymousDonation(session) {
    var _a, _b, _c;
    const db = admin.firestore();
    const amount = session.amount_total ? session.amount_total / 100 : 0;
    const allocation = ((_a = session.metadata) === null || _a === void 0 ? void 0 : _a.allocation)
        ? JSON.parse(session.metadata.allocation)
        : {};
    await db.collection("donations").add({
        userId: "anonymous",
        email: ((_b = session.customer_details) === null || _b === void 0 ? void 0 : _b.email) || null,
        amount,
        currency: session.currency,
        allocation,
        stripeSessionId: session.id,
        status: "completed",
        recurring: ((_c = session.metadata) === null || _c === void 0 ? void 0 : _c.monthly) === "true",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    functions.logger.info(`Anonymous donation recorded: €${amount}`);
}
/**
 * Handle event ticket purchase
 */
async function handleEventTicketPurchase(userId, session) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const db = admin.firestore();
    const eventId = (_a = session.metadata) === null || _a === void 0 ? void 0 : _a.eventId;
    const ticketTypeId = (_b = session.metadata) === null || _b === void 0 ? void 0 : _b.ticketTypeId;
    const quantity = parseInt(((_c = session.metadata) === null || _c === void 0 ? void 0 : _c.quantity) || "1");
    const attendeeInfo = ((_d = session.metadata) === null || _d === void 0 ? void 0 : _d.attendeeInfo)
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
    const ticketType = (_e = event === null || event === void 0 ? void 0 : event.ticketTypes) === null || _e === void 0 ? void 0 : _e.find((t) => t.id === ticketTypeId);
    // Create tickets
    const ticketIds = [];
    for (let i = 0; i < quantity; i++) {
        const ticketRef = db.collection("event_registrations").doc();
        const ticketNumber = `${orderNumber}-${i + 1}`;
        batch.set(ticketRef, {
            id: ticketRef.id,
            eventId,
            userId,
            ticketNumber,
            orderNumber,
            ticketType: (ticketType === null || ticketType === void 0 ? void 0 : ticketType.name) || "General",
            ticketTypeId,
            price: (ticketType === null || ticketType === void 0 ? void 0 : ticketType.price) || 0,
            status: "valid",
            attendee: attendeeInfo[i] || {
                firstName: ((_g = (_f = session.customer_details) === null || _f === void 0 ? void 0 : _f.name) === null || _g === void 0 ? void 0 : _g.split(" ")[0]) || "",
                lastName: ((_j = (_h = session.customer_details) === null || _h === void 0 ? void 0 : _h.name) === null || _j === void 0 ? void 0 : _j.split(" ").slice(1).join(" ")) || "",
                email: ((_k = session.customer_details) === null || _k === void 0 ? void 0 : _k.email) || "",
            },
            purchasedAt: admin.firestore.FieldValue.serverTimestamp(),
            checkedIn: false,
            stripeSessionId: session.id,
        });
        ticketIds.push(ticketRef.id);
    }
    // Update ticket sold count
    const eventRef = db.collection("events").doc(eventId);
    const ticketTypes = (event === null || event === void 0 ? void 0 : event.ticketTypes) || [];
    const updatedTicketTypes = ticketTypes.map((t) => {
        if (t.id === ticketTypeId) {
            return Object.assign(Object.assign({}, t), { soldCount: (t.soldCount || 0) + quantity });
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
async function handleSubscriptionUpdate(subscription) {
    var _a;
    const customerId = subscription.customer;
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
        const price = await stripe.prices.retrieve(subscription.items.data[0].price.id, { expand: ["product"] });
        const product = price.product;
        tier = ((_a = product.metadata) === null || _a === void 0 ? void 0 : _a.tier) || "insider";
    }
    const currentPeriodEnd = subscription.current_period_end;
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
async function handleSubscriptionCanceled(subscription) {
    const customerId = subscription.customer;
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
async function handleInvoicePaid(invoice) {
    var _a, _b;
    const customerId = invoice.customer;
    const db = admin.firestore();
    const subscriptionId = invoice.subscription;
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
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            if (((_a = subscription.metadata) === null || _a === void 0 ? void 0 : _a.type) === "donation") {
                const amount = invoice.amount_paid / 100;
                const allocation = ((_b = subscription.metadata) === null || _b === void 0 ? void 0 : _b.allocation)
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
async function handleInvoicePaymentFailed(invoice) {
    const customerId = invoice.customer;
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
async function handlePaymentSucceeded(paymentIntent) {
    functions.logger.info(`Payment succeeded: ${paymentIntent.id}, amount: ${paymentIntent.amount / 100}`);
    // Additional logic if needed
}
/**
 * Handle failed payment intent
 */
async function handlePaymentFailed(paymentIntent) {
    functions.logger.warn(`Payment failed: ${paymentIntent.id}`);
    // Additional logic if needed
}
/**
 * Notify waitlist when tickets become available (unused - for future use)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function notifyWaitlist(eventId, availableTickets) {
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
//# sourceMappingURL=stripe-webhooks.js.map