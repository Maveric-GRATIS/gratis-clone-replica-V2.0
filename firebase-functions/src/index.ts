import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { CallableContext } from "firebase-functions/v1/https";
import Stripe from "stripe";

admin.initializeApp();

// Export Mux functions
export * from "./mux-functions";

// Export Stripe functions
export * from "./stripe-functions";
export * from "./stripe-webhooks";

// Export Email and Notification services (available for import in other functions)
export * from "./email-service";
export * from "./notification-service";

// Initialize Stripe
const stripe = new Stripe(functions.config().stripe.secret_key, {
  apiVersion: "2023-10-16",
});

// Rate limiting map (in-memory, for production use Redis/Firestore)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

/**
 * Rate limiter helper
 * @param key - Unique identifier (uid, IP, etc.)
 * @param maxRequests - Maximum requests allowed
 * @param windowMs - Time window in milliseconds
 */
function checkRateLimit(
  key: string,
  maxRequests = 10,
  windowMs = 60000
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

/**
 * Verify user has required role
 */
async function checkRole(
  uid: string,
  requiredRoles: string[]
): Promise<boolean> {
  try {
    const userDoc = await admin.firestore().collection("users").doc(uid).get();
    const userData = userDoc.data();

    if (!userData || !userData.role) {
      return false;
    }

    return requiredRoles.includes(userData.role);
  } catch (error) {
    console.error("Role check error:", error);
    return false;
  }
}

/**
 * Input validation helper
 */
function validateInput(
  data: any,
  schema: { [key: string]: { type: string; required?: boolean; maxLength?: number } }
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];

    if (rules.required && (value === undefined || value === null || value === "")) {
      errors.push(`${field} is required`);
      continue;
    }

    if (value !== undefined && value !== null) {
      if (rules.type === "string" && typeof value !== "string") {
        errors.push(`${field} must be a string`);
      }
      if (rules.type === "number" && typeof value !== "number") {
        errors.push(`${field} must be a number`);
      }
      if (rules.maxLength && typeof value === "string" && value.length > rules.maxLength) {
        errors.push(`${field} exceeds maximum length of ${rules.maxLength}`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

// ============================================================================
// ADMIN FUNCTIONS - Protected with RBAC
// ============================================================================

/**
 * Create or update product (Admin only)
 */
export const manageProduct = functions.https.onCall(
  async (
    data: {
      productId?: string;
      name: string;
      description: string;
      price: number;
      category: string;
    },
    context: CallableContext
  ) => {
    // Authentication check
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated"
      );
    }

    const uid = context.auth.uid;

    // Rate limiting
    if (!checkRateLimit(`product_${uid}`, 20, 60000)) {
      throw new functions.https.HttpsError(
        "resource-exhausted",
        "Too many requests. Please try again later."
      );
    }

    // RBAC check
    const hasPermission = await checkRole(uid, ["admin"]);
    if (!hasPermission) {
      functions.logger.warn(`Unauthorized product access attempt by ${uid}`);
      throw new functions.https.HttpsError(
        "permission-denied",
        "User does not have permission to manage products"
      );
    }

    // Input validation
    const validation = validateInput(data, {
      name: { type: "string", required: true, maxLength: 200 },
      description: { type: "string", required: true, maxLength: 2000 },
      price: { type: "number", required: true },
      category: { type: "string", required: true, maxLength: 100 },
    });

    if (!validation.valid) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        `Validation failed: ${validation.errors.join(", ")}`
      );
    }

    try {
      const productData = {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedBy: uid,
      };

      if (data.productId) {
        // Update existing product
        await admin
          .firestore()
          .collection("products")
          .doc(data.productId)
          .update(productData);

        functions.logger.info(`Product ${data.productId} updated by ${uid}`);
        return { success: true, productId: data.productId };
      } else {
        // Create new product
        const docRef = await admin
          .firestore()
          .collection("products")
          .add({
            ...productData,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            createdBy: uid,
          });

        functions.logger.info(`Product ${docRef.id} created by ${uid}`);
        return { success: true, productId: docRef.id };
      }
    } catch (error: any) {
      functions.logger.error("Product management error:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to manage product"
      );
    }
  }
);

/**
 * Update user role (Admin only)
 */
export const updateUserRole = functions.https.onCall(
  async (
    data: { targetUserId: string; newRole: "customer" | "admin" | "marketing" },
    context: CallableContext
  ) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated"
      );
    }

    const uid = context.auth.uid;

    // Rate limiting
    if (!checkRateLimit(`role_${uid}`, 5, 60000)) {
      throw new functions.https.HttpsError(
        "resource-exhausted",
        "Too many requests"
      );
    }

    // RBAC check
    const hasPermission = await checkRole(uid, ["admin"]);
    if (!hasPermission) {
      functions.logger.warn(`Unauthorized role change attempt by ${uid}`);
      throw new functions.https.HttpsError(
        "permission-denied",
        "Only admins can change user roles"
      );
    }

    // Validate input
    if (!["customer", "admin", "marketing"].includes(data.newRole)) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid role specified"
      );
    }

    try {
      await admin
        .firestore()
        .collection("users")
        .doc(data.targetUserId)
        .update({
          role: data.newRole,
          roleUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
          roleUpdatedBy: uid,
        });

      // Audit log
      await admin.firestore().collection("auditLogs").add({
        action: "role_change",
        actor: uid,
        target: data.targetUserId,
        oldRole: null, // TODO: fetch old role if needed
        newRole: data.newRole,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      functions.logger.info(
        `Role changed for ${data.targetUserId} to ${data.newRole} by ${uid}`
      );
      return { success: true };
    } catch (error) {
      functions.logger.error("Role update error:", error);
      throw new functions.https.HttpsError("internal", "Failed to update role");
    }
  }
);

// ============================================================================
// SECURITY RULES VALIDATION TRIGGER
// ============================================================================

/**
 * Validate and enforce data integrity on Firestore writes
 */
export const validateUserWrite = functions.firestore
  .document("users/{userId}")
  .onWrite(async (change, context) => {
    const after = change.after.data();
    const userId = context.params.userId;

    if (!after) return; // Document deleted

    // Ensure role field exists
    if (!after.role) {
      functions.logger.warn(`User ${userId} missing role field`);
      await change.after.ref.update({ role: "customer" });
    }

    // Validate role value
    const validRoles = ["customer", "admin", "marketing"];
    if (!validRoles.includes(after.role)) {
      functions.logger.error(`Invalid role for user ${userId}: ${after.role}`);
      await change.after.ref.update({ role: "customer" });
    }
  });
