/**
 * Cloud Functions for location-based pricing with Stripe integration
 * - getPriceByLocation: Gets correct Stripe price ID based on user location
 * - getLocationPricing: Detects user location and returns currency info
 * - updateProductStripePrices: Admin function to batch update stripe prices
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CallableContext } from 'firebase-functions/v1/https';

// In-memory rate limiting map (for production, use Firestore or Redis)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

/**
 * Rate limiter helper
 */
function checkRateLimit(
  key: string,
  maxRequests = 100,
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
 * Detect user's country from IP address using ipapi.co
 */
async function detectCountryFromIp(
  ipAddress?: string,
): Promise<{ country: string; countryCode: string }> {
  try {
    const url = ipAddress
      ? `https://ipapi.co/${ipAddress}/json/`
      : `https://ipapi.co/json/`;

    const response = await fetch(url, {
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    return {
      country: data.country || 'Unknown',
      countryCode: data.country_code || 'XX',
    };
  } catch (error) {
    functions.logger.warn('IP geolocation failed:', error);
    // Fallback to default
    return {
      country: 'Unknown',
      countryCode: 'XX',
    };
  }
}

/**
 * Determine currency based on country code
 */
function getCurrencyForCountry(countryCode: string): 'USD' | 'EUR' {
  // US → USD
  if (countryCode === 'US') {
    return 'USD';
  }

  // EU countries → EUR
  const euCountries = [
    'AT', 'BE', 'CY', 'EE', 'FI', 'FR', 'DE', 'GR', 'IE', 'IT',
    'LV', 'LT', 'LU', 'MT', 'NL', 'PT', 'SK', 'SI', 'ES', 'XX', // XX is fallback
  ];

  if (euCountries.includes(countryCode)) {
    return 'EUR';
  }

  // Default to EUR for rest of world
  return 'EUR';
}

/**
 * ===========================================================================
 * PUBLIC FUNCTIONS (accessible from frontend)
 * ===========================================================================
 */

/**
 * Get user's location and preferred currency
 * Called automatically on app load to detect location
 *
 * Returns: { currency: 'USD' | 'EUR', country: string, countryCode: string }
 */
export const getLocationPricing = functions.https.onCall(
  async (
    data: { ipAddress?: string },
    context: CallableContext,
  ) => {
    try {
      // Rate limiting by IP (allow 100 requests per minute)
      const clientIp = context.rawRequest?.ip || 'unknown';
      if (!checkRateLimit(`location_${clientIp}`, 100, 60000)) {
        throw new functions.https.HttpsError(
          'resource-exhausted',
          'Too many requests. Please try again later.',
        );
      }

      const { country, countryCode } = await detectCountryFromIp(
        data?.ipAddress,
      );

      const currency = getCurrencyForCountry(countryCode);

      functions.logger.info(
        `Location detected: ${country} (${countryCode}) → ${currency}`,
      );

      return {
        currency,
        country,
        countryCode,
      };
    } catch (error: any) {
      functions.logger.error('Location pricing error:', error);

      if (error.code === 'resource-exhausted') {
        throw error;
      }

      // Fallback to EUR on error
      return {
        currency: 'EUR',
        country: 'Unknown',
        countryCode: 'XX',
      };
    }
  },
);

/**
 * Get location-based Stripe price for a product
 *
 * Input: { productId: string, userIp?: string, forceRefresh?: boolean }
 * Returns: { productId, country, currency, stripePriceId, amount, displayPrice }
 *
 * Flow:
 * 1. Detect user location (or use provided IP)
 * 2. Query Firestore for stripe_prices collection
 * 3. Return correct Stripe price ID based on currency
 */
export const getPriceByLocation = functions.https.onCall(
  async (
    data: {
      productId: string;
      userIp?: string;
      forceRefresh?: boolean;
    },
    context: CallableContext,
  ) => {
    try {
      if (!data.productId) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'productId is required',
        );
      }

      // Rate limiting
      const clientIp = context.rawRequest?.ip || 'unknown';
      if (!checkRateLimit(`price_${clientIp}`, 200, 60000)) {
        throw new functions.https.HttpsError(
          'resource-exhausted',
          'Too many requests. Please try again later.',
        );
      }

      // Detect location
      const { country, countryCode } = await detectCountryFromIp(
        data.userIp,
      );
      const currency = getCurrencyForCountry(countryCode);

      // Query Firestore for stripe prices
      const stripePricesCollection = admin
        .firestore()
        .collection('stripe_prices');

      // Build query for product + currency
      const query = stripePricesCollection
        .where('productId', '==', data.productId)
        .where('currency', '==', currency)
        .limit(1);

      const snapshot = await query.get();

      if (snapshot.empty) {
        functions.logger.warn(
          `No stripe price found for product ${data.productId} in ${currency}`,
        );
        throw new functions.https.HttpsError(
          'not-found',
          `Price not available for this product in ${currency}`,
        );
      }

      const priceDoc = snapshot.docs[0];
      const priceData = priceDoc.data();

      // Calculate display price (amount is in cents)
      const displayPrice = priceData.amount / 100;

      return {
        productId: data.productId,
        country,
        currency,
        stripePriceId: priceData.stripePriceId,
        amount: priceData.amount, // in cents for Stripe
        displayPrice, // decimal for display
      };
    } catch (error: any) {
      functions.logger.error('Get price by location error:', error);

      if (
        error.code === 'invalid-argument' ||
        error.code === 'resource-exhausted' ||
        error.code === 'not-found'
      ) {
        throw error;
      }

      // Generic error response
      throw new functions.https.HttpsError(
        'internal',
        'Failed to fetch pricing information',
      );
    }
  },
);

/**
 * ===========================================================================
 * ADMIN FUNCTIONS (protected with RBAC)
 * ===========================================================================
 */

/**
 * Verify user has admin role
 */
async function checkAdminRole(uid: string): Promise<boolean> {
  try {
    const userDoc = await admin
      .firestore()
      .collection('users')
      .doc(uid)
      .get();
    const userData = userDoc.data();

    if (!userData || userData.role !== 'admin') {
      return false;
    }

    return true;
  } catch (error) {
    functions.logger.error('Admin check error:', error);
    return false;
  }
}

/**
 * Update Stripe prices for a product (Admin only)
 *
 * Input: Array of {
 *   productId: string,
 *   stripePriceIdUSD: string,
 *   stripePriceIdEUR: string,
 *   amountUSD: number (in cents),
 *   amountEUR: number (in cents),
 * }
 */
export const updateProductStripePrices = functions.https.onCall(
  async (
    data: {
      updates: Array<{
        productId: string;
        stripePriceIdUSD: string;
        stripePriceIdEUR: string;
        amountUSD: number;
        amountEUR: number;
      }>;
    },
    context: CallableContext,
  ) => {
    // Authentication check
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated',
      );
    }

    const uid = context.auth.uid;

    // Admin role check
    const isAdmin = await checkAdminRole(uid);
    if (!isAdmin) {
      functions.logger.warn(
        `Unauthorized stripe price update attempt by ${uid}`,
      );
      throw new functions.https.HttpsError(
        'permission-denied',
        'Only admins can update stripe prices',
      );
    }

    // Rate limiting
    if (!checkRateLimit(`price_update_${uid}`, 10, 60000)) {
      throw new functions.https.HttpsError(
        'resource-exhausted',
        'Too many requests. Please try again later.',
      );
    }

    // Input validation
    if (!Array.isArray(data.updates) || data.updates.length === 0) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'updates must be a non-empty array',
      );
    }

    if (data.updates.length > 100) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Cannot update more than 100 products at once',
      );
    }

    try {
      const batch = admin.firestore().batch();
      const stripePricesCollection = admin
        .firestore()
        .collection('stripe_prices');

      for (const update of data.updates) {
        // Validate update object
        if (
          !update.productId ||
          !update.stripePriceIdUSD ||
          !update.stripePriceIdEUR ||
          typeof update.amountUSD !== 'number' ||
          typeof update.amountEUR !== 'number'
        ) {
          throw new functions.https.HttpsError(
            'invalid-argument',
            'Each update must have productId, stripePriceIdUSD, stripePriceIdEUR, amountUSD, amountEUR',
          );
        }

        // USD price
        const usdDocId = `${update.productId}_USD`;
        batch.set(
          stripePricesCollection.doc(usdDocId),
          {
            productId: update.productId,
            currency: 'USD',
            stripePriceId: update.stripePriceIdUSD,
            amount: update.amountUSD,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedBy: uid,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true },
        );

        // EUR price
        const eurDocId = `${update.productId}_EUR`;
        batch.set(
          stripePricesCollection.doc(eurDocId),
          {
            productId: update.productId,
            currency: 'EUR',
            stripePriceId: update.stripePriceIdEUR,
            amount: update.amountEUR,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedBy: uid,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true },
        );
      }

      await batch.commit();

      functions.logger.info(
        `Updated ${data.updates.length} product stripe prices by ${uid}`,
      );

      return {
        success: true,
        updatedCount: data.updates.length,
      };
    } catch (error: any) {
      functions.logger.error('Update stripe prices error:', error);

      if (error.code === 'invalid-argument') {
        throw error;
      }

      throw new functions.https.HttpsError(
        'internal',
        'Failed to update stripe prices',
      );
    }
  },
);
