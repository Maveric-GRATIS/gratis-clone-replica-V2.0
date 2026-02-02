/**
 * Integration Examples for Part 5 Utilities
 *
 * This file demonstrates how to use the API utilities, security helpers,
 * and notification service in real-world scenarios.
 */

import { handleFirebaseError, retryOperation, apiCache, getCacheKey } from '@/lib/api/client';
import { rateLimiter, validate, sanitize, xss, csrf, secureStorage } from '@/lib/security/utils';
import { notificationService } from '@/lib/services/notificationService';
import { collection, getDocs, query, where, addDoc, updateDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '@/firebase';

// =============================================================================
// EXAMPLE 1: User Registration with Validation & Rate Limiting
// =============================================================================

export async function registerUser(email: string, password: string, username: string) {
  try {
    // 1. Rate limiting - prevent spam registrations
    if (rateLimiter.isRateLimited('registration', 5, 60 * 60 * 1000)) {
      throw new Error('Too many registration attempts. Please try again later.');
    }

    // 2. Input sanitization
    const sanitizedEmail = sanitize.email(email);
    const sanitizedUsername = sanitize.username(username);

    // 3. Input validation
    if (!validate.email(sanitizedEmail)) {
      throw new Error('Invalid email address');
    }

    const passwordValidation = validate.password(password);
    if (!passwordValidation.valid) {
      throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
    }

    // 4. Create user account (Firebase Auth)
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      sanitizedEmail,
      password
    );

    // 5. Create user document in Firestore
    await addDoc(collection(db, 'users'), {
      uid: userCredential.user.uid,
      email: sanitizedEmail,
      username: sanitizedUsername,
      createdAt: new Date(),
      role: 'user',
    });

    // 6. Send welcome notification
    await notificationService.createFromTemplate(
      userCredential.user.uid,
      'system.welcome',
      { username: sanitizedUsername }
    );

    return { success: true, user: userCredential.user };

  } catch (error) {
    throw handleFirebaseError(error);
  }
}

// =============================================================================
// EXAMPLE 2: Fetching Projects with Caching & Retry Logic
// =============================================================================

export async function getActiveProjects(refresh = false) {
  const cacheKey = getCacheKey('projects', { status: 'active' });

  // Check cache first (unless refresh requested)
  if (!refresh) {
    const cached = apiCache.get(cacheKey);
    if (cached) {
      console.log('Returning cached projects');
      return cached;
    }
  }

  // Fetch with retry logic
  const projects = await retryOperation(async () => {
    try {
      const q = query(
        collection(db, 'projects'),
        where('status', '==', 'active')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

    } catch (error) {
      throw handleFirebaseError(error);
    }
  });

  // Cache results for 5 minutes
  apiCache.set(cacheKey, projects, 5 * 60 * 1000);

  return projects;
}

// =============================================================================
// EXAMPLE 3: Donation with CSRF Protection & Notifications
// =============================================================================

export async function createDonation(
  userId: string,
  amount: number,
  projectId: string,
  paymentMethodId: string
) {
  try {
    // 1. Validate CSRF token
    const csrfToken = csrf.getToken();
    if (!csrfToken) {
      throw new Error('Invalid request. Please refresh the page.');
    }

    // 2. Validate amount
    if (amount < 5) {
      throw new Error('Minimum donation amount is €5');
    }

    // 3. Rate limiting - prevent duplicate donations
    const rateLimitKey = `donation:${userId}`;
    if (rateLimiter.isRateLimited(rateLimitKey, 10, 60 * 1000)) {
      throw new Error('Too many donation attempts. Please wait a moment.');
    }

    // 4. Create donation record
    const donationRef = await addDoc(collection(db, 'donations'), {
      userId,
      projectId,
      amount,
      paymentMethodId,
      status: 'pending',
      createdAt: new Date(),
      csrfToken,
    });

    // 5. Process payment (Stripe integration)
    // const paymentResult = await processStripePayment(amount, paymentMethodId);

    // 6. Update donation status
    await updateDoc(donationRef, {
      status: 'completed',
      completedAt: new Date(),
    });

    // 7. Send notification
    await notificationService.createFromTemplate(
      userId,
      'donation.success',
      { amount: `€${amount}` },
      {
        actionUrl: `/donations/${donationRef.id}`,
        priority: 'high',
      }
    );

    // 8. Clear CSRF token after use
    csrf.clearToken();

    return {
      success: true,
      donationId: donationRef.id,
    };

  } catch (error) {
    throw handleFirebaseError(error);
  }
}

// =============================================================================
// EXAMPLE 4: User Profile Update with XSS Prevention
// =============================================================================

export async function updateUserProfile(
  userId: string,
  data: {
    displayName?: string;
    bio?: string;
    website?: string;
    phone?: string;
  }
) {
  try {
    // 1. Validate user is authenticated
    const currentUser = auth.currentUser;
    if (!currentUser || currentUser.uid !== userId) {
      throw new Error('Unauthorized');
    }

    // 2. Sanitize inputs
    const sanitizedData: any = {};

    if (data.displayName) {
      sanitizedData.displayName = sanitize.html(data.displayName);
    }

    if (data.bio) {
      // Remove any malicious scripts but keep basic formatting
      sanitizedData.bio = xss.sanitizeContent(data.bio);
    }

    if (data.website) {
      const sanitizedUrl = sanitize.url(data.website);
      if (sanitizedUrl && validate.url(sanitizedUrl)) {
        sanitizedData.website = sanitizedUrl;
      } else {
        throw new Error('Invalid website URL');
      }
    }

    if (data.phone) {
      const sanitizedPhone = sanitize.phone(data.phone);
      if (validate.phone(sanitizedPhone)) {
        sanitizedData.phone = sanitizedPhone;
      } else {
        throw new Error('Invalid phone number');
      }
    }

    // 3. Update Firestore document
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...sanitizedData,
      updatedAt: new Date(),
    });

    // 4. Clear cache for this user
    apiCache.delete(getCacheKey('user', { userId }));

    return { success: true };

  } catch (error) {
    throw handleFirebaseError(error);
  }
}

// =============================================================================
// EXAMPLE 5: Secure Session Storage for Checkout Flow
// =============================================================================

export class CheckoutSession {
  private static STORAGE_KEY = 'checkout_session';

  static save(data: {
    items: any[];
    shippingAddress?: any;
    billingAddress?: any;
    paymentMethodId?: string;
  }) {
    // Store checkout data securely (base64 encoded)
    secureStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  static load(): any | null {
    const stored = secureStorage.getItem(this.STORAGE_KEY);
    if (!stored) return null;

    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  static clear() {
    secureStorage.removeItem(this.STORAGE_KEY);
  }

  static validateCheckoutData(data: any): boolean {
    if (!data || !data.items || data.items.length === 0) {
      return false;
    }

    // Validate shipping address if provided
    if (data.shippingAddress) {
      const { street, city, postalCode, country } = data.shippingAddress;

      if (!street || !city || !postalCode || !country) {
        return false;
      }

      // Validate postal code format
      if (!validate.postalCode(postalCode, country)) {
        return false;
      }
    }

    return true;
  }
}

// =============================================================================
// EXAMPLE 6: Form Validation Helper
// =============================================================================

export function validateContactForm(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  const errors: Record<string, string> = {};

  // Name validation
  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  // Email validation
  if (!validate.email(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Phone validation (optional)
  if (data.phone && !validate.phone(data.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  // Message validation
  if (!data.message || data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

// =============================================================================
// EXAMPLE 7: Real-time Notifications in React Component
// =============================================================================

/*
// In your AuthContext or App component:

import { notificationService } from '@/lib/services/notificationService';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

function App() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Initialize notification service
      notificationService.initialize(user.uid);

      // Cleanup on logout
      return () => {
        notificationService.cleanup();
      };
    }
  }, [user]);

  return (
    <div>
      // Your app content
    </div>
  );
}

// In your Header component to show notification count:

import { notificationService } from '@/lib/services/notificationService';
import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';

function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const loadCount = async () => {
      const count = await notificationService.getUnreadCount(user.uid);
      setUnreadCount(count);
    };

    loadCount();

    // Refresh count every 30 seconds
    const interval = setInterval(loadCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <button className="relative">
      <Bell size={20} />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </button>
  );
}
*/

// =============================================================================
// EXAMPLE 8: Credit Card Validation (Client-side only, never store)
// =============================================================================

export function validateCreditCardPreview(cardNumber: string) {
  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s-]/g, '');

  // Validate using Luhn algorithm
  if (!validate.creditCard(cleaned)) {
    return {
      valid: false,
      error: 'Invalid card number',
    };
  }

  // Detect card type (basic detection)
  let cardType = 'Unknown';
  if (/^4/.test(cleaned)) cardType = 'Visa';
  else if (/^5[1-5]/.test(cleaned)) cardType = 'Mastercard';
  else if (/^3[47]/.test(cleaned)) cardType = 'American Express';

  // Get last 4 digits for display
  const last4 = cleaned.slice(-4);

  return {
    valid: true,
    cardType,
    last4,
    // Never return the full card number
  };
}

// =============================================================================
// EXAMPLE 9: Batch Operations with Rate Limiting
// =============================================================================

export async function sendBulkNotifications(
  userIds: string[],
  templateKey: string,
  variables: Record<string, string>
) {
  // Rate limit bulk operations
  if (rateLimiter.isRateLimited('bulk_notifications', 1, 60 * 1000)) {
    throw new Error('Please wait before sending more notifications');
  }

  // Process in batches of 10
  const BATCH_SIZE = 10;
  const results = [];

  for (let i = 0; i < userIds.length; i += BATCH_SIZE) {
    const batch = userIds.slice(i, i + BATCH_SIZE);

    const batchResults = await Promise.allSettled(
      batch.map(userId =>
        notificationService.createFromTemplate(userId, templateKey as any, variables)
      )
    );

    results.push(...batchResults);

    // Small delay between batches to avoid overwhelming Firestore
    if (i + BATCH_SIZE < userIds.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  return {
    total: userIds.length,
    successful,
    failed,
  };
}

// =============================================================================
// USAGE NOTES
// =============================================================================

/*
These examples demonstrate:

1. ✅ Proper error handling with handleFirebaseError()
2. ✅ Rate limiting to prevent abuse
3. ✅ Input validation and sanitization
4. ✅ Caching with automatic expiration
5. ✅ Retry logic for transient failures
6. ✅ CSRF protection for state-changing operations
7. ✅ XSS prevention for user-generated content
8. ✅ Secure storage for sensitive data
9. ✅ Real-time notifications with Firestore
10. ✅ Batch operations with Firebase

Remember:
- Always validate and sanitize user input
- Use rate limiting for all public endpoints
- Cache expensive operations
- Handle errors gracefully
- Never store sensitive data client-side
- Use HTTPS in production
- Implement proper authentication checks
- Follow the principle of least privilege
*/
