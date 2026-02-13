"use strict";
/**
 * Stripe Payment Functions
 * Complete payment system implementation
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStripeProduct = exports.cancelSubscription = exports.getSubscriptionStatus = exports.createCustomerPortal = exports.createEventTicketCheckout = exports.createDonationCheckout = exports.createMembershipCheckout = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const stripe_1 = __importDefault(require("stripe"));
// Lazy initialize Stripe
let stripe = null;
function getStripeClient() {
    var _a;
    if (!stripe) {
        const config = functions.config();
        const apiKey = ((_a = config.stripe) === null || _a === void 0 ? void 0 : _a.secret_key) || process.env.STRIPE_SECRET_KEY;
        if (!apiKey) {
            throw new functions.https.HttpsError("failed-precondition", "Stripe is not configured. Set stripe.secret_key or STRIPE_SECRET_KEY env variable");
        }
        stripe = new stripe_1.default(apiKey, {
            apiVersion: "2026-01-28.clover",
        });
    }
    return stripe;
}
/**
 * Verify admin role
 */
async function isAdmin(uid) {
    var _a;
    const userDoc = await admin.firestore().collection("users").doc(uid).get();
    return ((_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.role) === "admin";
}
/**
 * Get or create Stripe customer for user
 */
async function getOrCreateStripeCustomer(userId, email, name) {
    const stripe = getStripeClient();
    const userDoc = await admin.firestore().collection("users").doc(userId).get();
    const userData = userDoc.data();
    // Return existing customer ID if available
    if (userData === null || userData === void 0 ? void 0 : userData.stripeCustomerId) {
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
exports.createMembershipCheckout = functions.https.onCall(async (data, context) => {
    var _a, _b;
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
    }
    try {
        const stripe = getStripeClient();
        const { priceId, successUrl, cancelUrl } = data;
        if (!priceId) {
            throw new functions.https.HttpsError("invalid-argument", "Price ID is required");
        }
        const user = await admin.auth().getUser(context.auth.uid);
        const customerId = await getOrCreateStripeCustomer(context.auth.uid, user.email || "", user.displayName);
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
            success_url: successUrl || `${(_a = functions.config().app) === null || _a === void 0 ? void 0 : _a.url}/membership/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl || `${(_b = functions.config().app) === null || _b === void 0 ? void 0 : _b.url}/membership`,
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
    }
    catch (error) {
        console.error("Error creating membership checkout:", error);
        throw new functions.https.HttpsError("internal", error.message || "Failed to create checkout session");
    }
});
/**
 * Create donation checkout session
 */
exports.createDonationCheckout = functions.https.onCall(async (data, context) => {
    var _a, _b, _c, _d;
    try {
        const stripe = getStripeClient();
        const { amount, currency = "eur", allocation, email, name, successUrl, cancelUrl, monthly = false, } = data;
        if (!amount || amount < 100) {
            throw new functions.https.HttpsError("invalid-argument", "Amount must be at least €1.00");
        }
        // Validate allocation adds up to 100%
        if (allocation) {
            const total = Object.values(allocation).reduce((sum, val) => sum + val, 0);
            if (Math.abs(total - 100) > 0.01) {
                throw new functions.https.HttpsError("invalid-argument", "Allocation must add up to 100%");
            }
        }
        let customerId;
        if (context.auth) {
            const user = await admin.auth().getUser(context.auth.uid);
            customerId = await getOrCreateStripeCustomer(context.auth.uid, user.email || email, user.displayName || name);
        }
        const sessionConfig = {
            mode: monthly ? "subscription" : "payment",
            payment_method_types: ["card", "ideal", "bancontact"],
            success_url: successUrl || `${(_a = functions.config().app) === null || _a === void 0 ? void 0 : _a.url}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl || `${(_b = functions.config().app) === null || _b === void 0 ? void 0 : _b.url}/donate`,
            metadata: {
                type: "donation",
                userId: ((_c = context.auth) === null || _c === void 0 ? void 0 : _c.uid) || "anonymous",
                allocation: JSON.stringify(allocation || {}),
                monthly: monthly.toString(),
            },
        };
        if (customerId) {
            sessionConfig.customer = customerId;
        }
        else {
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
                    userId: ((_d = context.auth) === null || _d === void 0 ? void 0 : _d.uid) || "anonymous",
                    allocation: JSON.stringify(allocation || {}),
                },
            };
        }
        else {
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
    }
    catch (error) {
        console.error("Error creating donation checkout:", error);
        throw new functions.https.HttpsError("internal", error.message || "Failed to create donation checkout");
    }
});
/**
 * Create event ticket checkout session
 */
exports.createEventTicketCheckout = functions.https.onCall(async (data, context) => {
    var _a, _b, _c;
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
    }
    try {
        const stripe = getStripeClient();
        const { eventId, ticketTypeId, quantity = 1, attendeeInfo, successUrl, cancelUrl, } = data;
        if (!eventId || !ticketTypeId) {
            throw new functions.https.HttpsError("invalid-argument", "Event ID and ticket type ID are required");
        }
        // Get event and ticket type
        const eventDoc = await admin
            .firestore()
            .collection("events")
            .doc(eventId)
            .get();
        if (!eventDoc.exists) {
            throw new functions.https.HttpsError("not-found", "Event not found");
        }
        const event = eventDoc.data();
        const ticketType = (_a = event.ticketTypes) === null || _a === void 0 ? void 0 : _a.find((t) => t.id === ticketTypeId);
        if (!ticketType) {
            throw new functions.https.HttpsError("not-found", "Ticket type not found");
        }
        // Check availability
        const soldCount = ticketType.soldCount || 0;
        if (soldCount + quantity > ticketType.quantity) {
            throw new functions.https.HttpsError("failed-precondition", "Not enough tickets available");
        }
        const user = await admin.auth().getUser(context.auth.uid);
        const customerId = await getOrCreateStripeCustomer(context.auth.uid, user.email || "", user.displayName);
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
            success_url: successUrl || `${(_b = functions.config().app) === null || _b === void 0 ? void 0 : _b.url}/events/${eventId}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl || `${(_c = functions.config().app) === null || _c === void 0 ? void 0 : _c.url}/events/${eventId}`,
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
    }
    catch (error) {
        console.error("Error creating event ticket checkout:", error);
        throw new functions.https.HttpsError("internal", error.message || "Failed to create ticket checkout");
    }
});
/**
 * Create customer portal session
 */
exports.createCustomerPortal = functions.https.onCall(async (data, context) => {
    var _a, _b;
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
    }
    try {
        const stripe = getStripeClient();
        const { returnUrl } = data;
        const userDoc = await admin
            .firestore()
            .collection("users")
            .doc(context.auth.uid)
            .get();
        const stripeCustomerId = (_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.stripeCustomerId;
        if (!stripeCustomerId) {
            throw new functions.https.HttpsError("failed-precondition", "No Stripe customer found");
        }
        const session = await stripe.billingPortal.sessions.create({
            customer: stripeCustomerId,
            return_url: returnUrl || `${(_b = functions.config().app) === null || _b === void 0 ? void 0 : _b.url}/account/membership`,
        });
        return {
            url: session.url,
        };
    }
    catch (error) {
        console.error("Error creating customer portal:", error);
        throw new functions.https.HttpsError("internal", error.message || "Failed to create customer portal");
    }
});
/**
 * Get subscription status
 */
exports.getSubscriptionStatus = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
    }
    try {
        const stripe = getStripeClient();
        const userDoc = await admin
            .firestore()
            .collection("users")
            .doc(context.auth.uid)
            .get();
        const userData = userDoc.data();
        const stripeCustomerId = userData === null || userData === void 0 ? void 0 : userData.stripeCustomerId;
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
                const subAny = sub;
                return {
                    id: sub.id,
                    status: sub.status,
                    currentPeriodEnd: subAny.current_period_end,
                    cancelAtPeriodEnd: subAny.cancel_at_period_end,
                    items: sub.items.data.map((item) => {
                        var _a, _b;
                        return ({
                            id: item.id,
                            price: item.price.unit_amount,
                            interval: (_a = item.price.recurring) === null || _a === void 0 ? void 0 : _a.interval,
                            product: (_b = item.price.product) === null || _b === void 0 ? void 0 : _b.name,
                        });
                    }),
                };
            }),
            tier: (userData === null || userData === void 0 ? void 0 : userData.membershipTier) || null,
        };
    }
    catch (error) {
        console.error("Error getting subscription status:", error);
        throw new functions.https.HttpsError("internal", error.message || "Failed to get subscription status");
    }
});
/**
 * Cancel subscription
 */
exports.cancelSubscription = functions.https.onCall(async (data, context) => {
    var _a;
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
    }
    try {
        const stripe = getStripeClient();
        const { subscriptionId, immediately = false } = data;
        if (!subscriptionId) {
            throw new functions.https.HttpsError("invalid-argument", "Subscription ID is required");
        }
        // Verify ownership
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const userDoc = await admin
            .firestore()
            .collection("users")
            .doc(context.auth.uid)
            .get();
        if (subscription.customer !== ((_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.stripeCustomerId)) {
            throw new functions.https.HttpsError("permission-denied", "Not authorized to cancel this subscription");
        }
        if (immediately) {
            await stripe.subscriptions.cancel(subscriptionId);
        }
        else {
            await stripe.subscriptions.update(subscriptionId, {
                cancel_at_period_end: true,
            });
        }
        return {
            success: true,
            canceledImmediately: immediately,
        };
    }
    catch (error) {
        console.error("Error canceling subscription:", error);
        throw new functions.https.HttpsError("internal", error.message || "Failed to cancel subscription");
    }
});
/**
 * Admin: Create Stripe product and prices
 */
exports.createStripeProduct = functions.https.onCall(async (data, context) => {
    if (!context.auth || !(await isAdmin(context.auth.uid))) {
        throw new functions.https.HttpsError("permission-denied", "Admin access required");
    }
    try {
        const stripe = getStripeClient();
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
            prices: createdPrices.map((p) => {
                var _a;
                return ({
                    id: p.id,
                    amount: p.unit_amount,
                    currency: p.currency,
                    interval: (_a = p.recurring) === null || _a === void 0 ? void 0 : _a.interval,
                });
            }),
        };
    }
    catch (error) {
        console.error("Error creating Stripe product:", error);
        throw new functions.https.HttpsError("internal", error.message || "Failed to create product");
    }
});
//# sourceMappingURL=stripe-functions.js.map