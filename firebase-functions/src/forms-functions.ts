/**
 * Forms & Application Email Functions
 * Handles email notifications for various forms and applications
 *
 * SECURITY: All inputs sanitized, rate-limited, and validated before use.
 */

import * as functions from 'firebase-functions';
import { sendEmail } from './email-service';
import * as admin from 'firebase-admin';

// ── Security helpers ──────────────────────────────────────────────────────────

/** Escape HTML metacharacters to prevent XSS in email templates */
function sanitize(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/** Basic email format check */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email));
}

/**
 * Sliding-window rate limiter backed by Firestore.
 * Throws HttpsError('resource-exhausted') when limit is exceeded.
 */
async function checkRateLimit(
  key: string,
  maxCalls: number,
  windowMs: number,
): Promise<void> {
  const db  = admin.firestore();
  const ref = db.collection('rateLimits').doc(key);
  const now = Date.now();

  await db.runTransaction(async (tx) => {
    const snap       = await tx.get(ref);
    const timestamps = ((snap.data()?.timestamps as number[]) || [])
      .filter((t) => t > now - windowMs);

    if (timestamps.length >= maxCalls) {
      throw new functions.https.HttpsError(
        'resource-exhausted',
        'Too many requests – please try again later.',
      );
    }
    timestamps.push(now);
    tx.set(ref, { timestamps }, { merge: true });
  });
}

const APP_URL = 'https://gratis-ngo-7bb44.web.app';

// ============================================================================
// CONTACT FORM
// ============================================================================

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendContactEmail = functions.runWith({ secrets: ['RESEND_API_KEY'] }).https.onCall(
  async (data: ContactFormData, context) => {
    try {
      // Rate limit: 3 submissions per hour per IP
      const rateLimitKey = `contact_${context.rawRequest?.ip ?? 'unknown'}`;
      await checkRateLimit(rateLimitKey, 3, 60 * 60 * 1000);

      // Validate required fields
      if (!data.name || !data.email || !data.subject || !data.message) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
      }
      if (!isValidEmail(data.email)) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid email address');
      }
      // Enforce maximum lengths to prevent abuse
      if (data.name.length > 100 || data.subject.length > 200 || data.message.length > 5000) {
        throw new functions.https.HttpsError('invalid-argument', 'Input exceeds maximum allowed length');
      }

      // Sanitize all user-supplied strings before placing in HTML
      const safeName    = sanitize(data.name);
      const safeEmail   = sanitize(data.email);
      const safeSubject = sanitize(data.subject);
      const safeMessage = sanitize(data.message);

      // Send notification to admin team
      await sendEmail({
        to: 'hello@gratis.ngo',
        subject: `[Contact Form] ${safeSubject}`,
        type: 'welcome',
        data: {
          firstName: 'Team',
          customMessage: `
            <h3>New Contact Form Submission</h3>
            <p><strong>From:</strong> ${safeName} (${safeEmail})</p>
            <p><strong>Subject:</strong> ${safeSubject}</p>
            <p><strong>Message:</strong></p>
            <p style="background:#f5f5f5;padding:12px;border-radius:6px;">${safeMessage.replace(/\n/g, '<br>')}</p>
          `,
        },
        replyTo: data.email,
      });

      // Send confirmation to user
      await sendEmail({
        to: data.email,
        subject: "We've received your message - GRATIS",
        type: 'welcome',
        data: {
          firstName: safeName,
          customMessage: `
            <p>Thank you for reaching out! We've received your message and will respond within 24-48 hours.</p>
            <p><strong>Your message:</strong></p>
            <blockquote style="border-left: 3px solid #C1FF00; padding-left: 15px; margin: 15px 0;">
              <p>${safeMessage.replace(/\n/g, '<br>')}</p>
            </blockquote>
          `,
        },
      });

      // Persist sanitized fields only — never spread raw user input
      await admin.firestore().collection('contactMessages').add({
        name:      safeName,
        email:     data.email,   // original for reply-to
        subject:   safeSubject,
        message:   safeMessage,
        uid:       context.auth?.uid ?? null,
        ip:        context.rawRequest?.ip ?? null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status:    'pending',
      });

      functions.logger.info(`Contact form submitted by ${data.email}`);
      return { success: true };
    } catch (error) {
      // Re-throw HttpsErrors as-is so the client receives the correct error code
      if (error instanceof functions.https.HttpsError) throw error;
      functions.logger.error('Contact form error:', error);
      throw new functions.https.HttpsError('internal', 'Failed to send email');
    }
  }
);

// ============================================================================
// PARTNER INQUIRY (FU Sponsor / Advertising Partner)
// ============================================================================

interface PartnerInquiryData {
  company_name: string;
  contact_person: string;
  email: string;
  phone?: string;
  website?: string;
  inquiry_type: string;
  [key: string]: any;
}

const VALID_INQUIRY_TYPES = ['advertising', 'sponsorship', 'distribution', 'co-branding', 'event', 'other'];

export const sendPartnerInquiryNotification = functions.runWith({ secrets: ['RESEND_API_KEY'] }).https.onCall(
  async (data: PartnerInquiryData, context) => {
    try {
      // Rate limit: 5 per day per user/IP
      const limitKey = `partner_${context.auth?.uid ?? context.rawRequest?.ip ?? 'unknown'}`;
      await checkRateLimit(limitKey, 5, 24 * 60 * 60 * 1000);

      if (!data.company_name || !data.email || !data.contact_person) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
      }
      if (!isValidEmail(data.email)) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid email address');
      }
      if (!VALID_INQUIRY_TYPES.includes(String(data.inquiry_type).toLowerCase())) {
        throw new functions.https.HttpsError('invalid-argument', `Invalid inquiry_type. Allowed: ${VALID_INQUIRY_TYPES.join(', ')}`);
      }

      const safeCompany  = sanitize(data.company_name);
      const safeContact  = sanitize(data.contact_person);
      const safeEmail    = sanitize(data.email);
      const safeType     = sanitize(data.inquiry_type);
      const safePhone    = data.phone   ? sanitize(data.phone)   : null;
      const safeWebsite  = data.website ? sanitize(data.website) : null;

      await sendEmail({
        to: 'partnerships@gratis.ngo',
        subject: `[Partner Inquiry] ${safeType} - ${safeCompany}`,
        type: 'welcome',
        data: {
          firstName: 'Partnerships Team',
          customMessage: `
            <h3>New Partner Inquiry</h3>
            <p><strong>Type:</strong> ${safeType}</p>
            <p><strong>Company:</strong> ${safeCompany}</p>
            <p><strong>Contact:</strong> ${safeContact}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            ${safePhone   ? `<p><strong>Phone:</strong> ${safePhone}</p>` : ''}
            ${safeWebsite ? `<p><strong>Website:</strong> ${safeWebsite}</p>` : ''}
          `,
        },
        replyTo: data.email,
      });

      await sendEmail({
        to: data.email,
        subject: 'Thank you for your partnership inquiry - GRATIS',
        type: 'welcome',
        data: {
          firstName: safeContact,
          customMessage: `
            <p>Thank you for your interest in partnering with GRATIS!</p>
            <p>We've received your <strong>${safeType}</strong> inquiry and our partnerships team will review it shortly.</p>
            <p>We'll contact you within 48 hours to discuss next steps.</p>
          `,
        },
      });

      await admin.firestore().collection('partnerInquiries').add({
        company_name:   safeCompany,
        contact_person: safeContact,
        email:          data.email,
        phone:          safePhone,
        website:        safeWebsite,
        inquiry_type:   safeType,
        uid:            context.auth?.uid ?? null,
        ip:             context.rawRequest?.ip ?? null,
        createdAt:      admin.firestore.FieldValue.serverTimestamp(),
        status:         'pending',
      });

      functions.logger.info(`Partner inquiry: ${safeType} - ${safeCompany}`);
      return { success: true };
    } catch (error) {
      if (error instanceof functions.https.HttpsError) throw error;
      functions.logger.error('Partner inquiry error:', error);
      throw new functions.https.HttpsError('internal', 'Failed to send email');
    }
  }
);

// ============================================================================
// NGO APPLICATION
// ============================================================================

interface NGOApplicationData {
  organizationName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  country: string;
  website: string;
  mission: string;
  [key: string]: any;
}

export const sendNGOApplicationNotification = functions.runWith({ secrets: ['RESEND_API_KEY'] }).https.onCall(
  async (data: NGOApplicationData, context) => {
    try {
      // Rate limit: 2 NGO apps per day per user/IP
      const limitKey = `ngo_${context.auth?.uid ?? context.rawRequest?.ip ?? 'unknown'}`;
      await checkRateLimit(limitKey, 2, 24 * 60 * 60 * 1000);

      if (!data.organizationName || !data.contactEmail || !data.contactName) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
      }
      if (!isValidEmail(data.contactEmail)) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid email address');
      }
      if (data.mission?.length > 3000) {
        throw new functions.https.HttpsError('invalid-argument', 'Mission description too long (max 3000 chars)');
      }

      const safeOrg     = sanitize(data.organizationName);
      const safeContact = sanitize(data.contactName);
      const safeMission = sanitize(data.mission ?? '');
      const safeCountry = sanitize(data.country ?? '');
      const safeWebsite = data.website ? sanitize(data.website) : null;
      const safePhone   = data.contactPhone ? sanitize(data.contactPhone) : '';

      await sendEmail({
        to: 'partnerships@gratis.ngo',
        subject: `[NGO Application] ${safeOrg}`,
        type: 'welcome',
        data: {
          firstName: 'Partnerships Team',
          customMessage: `
            <h3>New NGO Partnership Application</h3>
            <p><strong>Organization:</strong> ${safeOrg}</p>
            <p><strong>Contact:</strong> ${safeContact}</p>
            <p><strong>Email:</strong> ${sanitize(data.contactEmail)}</p>
            <p><strong>Phone:</strong> ${safePhone}</p>
            <p><strong>Country:</strong> ${safeCountry}</p>
            ${safeWebsite ? `<p><strong>Website:</strong> ${safeWebsite}</p>` : ''}
            <hr>
            <p><strong>Mission:</strong></p>
            <p style="background:#f5f5f5;padding:12px;border-radius:6px;">${safeMission}</p>
            <hr>
            <p><a href="${APP_URL}/admin/partners/review" style="background:#C1FF00;color:#000;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;font-weight:bold;">Review Application</a></p>
          `,
        },
        replyTo: data.contactEmail,
      });

      await sendEmail({
        to: data.contactEmail,
        subject: 'NGO Application Received - GRATIS',
        type: 'welcome',
        data: {
          firstName: safeContact,
          customMessage: `
            <p>Thank you for applying to become a GRATIS partner NGO!</p>
            <p>We've received your application for <strong>${safeOrg}</strong>.</p>
            <p><strong>What happens next?</strong></p>
            <ol>
              <li>Our partnerships team will review your application (5-7 business days)</li>
              <li>We may reach out for additional information or clarification</li>
              <li>If approved, we'll schedule an onboarding call to discuss next steps</li>
            </ol>
            <p>Feel free to explore our <a href="${APP_URL}/partners">partner resources</a>.</p>
          `,
        },
      });

      await admin.firestore().collection('ngoApplications').add({
        organizationName: safeOrg,
        contactName:      safeContact,
        contactEmail:     data.contactEmail,
        contactPhone:     safePhone,
        country:          safeCountry,
        website:          safeWebsite,
        mission:          safeMission,
        uid:              context.auth?.uid ?? null,
        ip:               context.rawRequest?.ip ?? null,
        createdAt:        admin.firestore.FieldValue.serverTimestamp(),
        status:           'pending',
      });

      functions.logger.info(`NGO application submitted: ${safeOrg}`);
      return { success: true };
    } catch (error) {
      if (error instanceof functions.https.HttpsError) throw error;
      functions.logger.error('NGO application error:', error);
      throw new functions.https.HttpsError('internal', 'Failed to send email');
    }
  }
);

// ============================================================================
// PARTNER APPLICATION
// ============================================================================

interface PartnerApplicationData {
  organizationName: string;
  primaryContact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  organizationType: string;
  focusAreas: string[];
  [key: string]: any;
}

// Covers all values from ORGANIZATION_TYPES in src/types/partner.ts
// plus legacy / alternative values that may arrive from older form versions.
const VALID_ORG_TYPES = [
  // Values used by the live PartnerApplicationForm (src/types/partner.ts)
  'ngo', 'charity', 'foundation', 'social_enterprise', 'corporate',
  'government', 'educational',
  // Legacy / alternative spellings kept for backwards compatibility
  'company', 'startup', 'university', 'individual', 'other',
  'nonprofit', 'social-enterprise', 'cooperative', 'association',
  'institute', 'network', 'alliance',
];

export const sendPartnerApplicationNotification = functions.runWith({ secrets: ['RESEND_API_KEY'] }).https.onCall(
  async (data: PartnerApplicationData, context) => {
    try {
      // Require authentication for partner applications
      if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Must be logged in to submit a partner application');
      }

      // Rate limit: 3 per day per user
      await checkRateLimit(`partnerapp_${context.auth.uid}`, 3, 24 * 60 * 60 * 1000);

      if (!data.organizationName || !data.primaryContact?.email || !data.primaryContact?.firstName) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
      }
      if (!isValidEmail(data.primaryContact.email)) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid email address');
      }
      if (!VALID_ORG_TYPES.includes(String(data.organizationType).toLowerCase().trim())) {
        throw new functions.https.HttpsError('invalid-argument', `Invalid organizationType. Allowed: ${VALID_ORG_TYPES.join(', ')}`);
      }
      if (!Array.isArray(data.focusAreas) || data.focusAreas.some((a) => typeof a !== 'string' || a.length > 100)) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid focusAreas');
      }

      const safeOrg   = sanitize(data.organizationName);
      const safeFirst = sanitize(data.primaryContact.firstName);
      const safeLast  = sanitize(data.primaryContact.lastName ?? '');
      const safeName  = `${safeFirst} ${safeLast}`.trim();
      const safeType  = sanitize(String(data.organizationType).toLowerCase().trim());
      const safeAreas = data.focusAreas.map(sanitize).join(', ');

      await sendEmail({
        to: 'partnerships@gratis.ngo',
        subject: `[Partner Application] ${safeOrg}`,
        type: 'welcome',
        data: {
          firstName: 'Partnerships Team',
          customMessage: `
            <h3>New Partner Application</h3>
            <p><strong>Organization:</strong> ${safeOrg}</p>
            <p><strong>Type:</strong> ${safeType}</p>
            <p><strong>Contact:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${sanitize(data.primaryContact.email)}</p>
            <p><strong>Phone:</strong> ${sanitize(data.primaryContact.phone ?? '')}</p>
            <p><strong>Focus Areas:</strong> ${safeAreas}</p>
            <hr>
            <p><a href="${APP_URL}/admin/partners/review" style="background:#C1FF00;color:#000;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;font-weight:bold;">Review Application</a></p>
          `,
        },
        replyTo: data.primaryContact.email,
      });

      await sendEmail({
        to: data.primaryContact.email,
        subject: 'Partner Application Received - GRATIS',
        type: 'welcome',
        data: {
          firstName: safeFirst,
          customMessage: `
            <p>Thank you for applying to become a GRATIS partner!</p>
            <p>We've received your application for <strong>${safeOrg}</strong>.</p>
            <p><strong>Application Review Timeline:</strong></p>
            <ul>
              <li>Initial review: 5-7 business days</li>
              <li>Additional information requests (if needed): 2-3 days</li>
              <li>Final decision: 10-14 business days</li>
            </ul>
            <p>You'll receive updates at each stage of the review process.</p>
          `,
        },
      });

      await admin.firestore().collection('partnerApplications').add({
        organizationName: safeOrg,
        organizationType: safeType,
        focusAreas:       data.focusAreas,
        primaryContact: {
          firstName: safeFirst,
          lastName:  safeLast,
          email:     data.primaryContact.email,
          phone:     data.primaryContact.phone ?? '',
        },
        uid:       context.auth.uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status:    'pending',
      });

      functions.logger.info(`Partner application: ${safeOrg} uid=${context.auth.uid}`);
      return { success: true };
    } catch (error) {
      if (error instanceof functions.https.HttpsError) throw error;
      functions.logger.error('Partner application error:', error);
      throw new functions.https.HttpsError('internal', 'Failed to send email');
    }
  }
);

// ============================================================================
// JOB APPLICATION
// ============================================================================

interface JobApplicationData {
  position: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  coverLetter: string;
  resumeUrl?: string;
  [key: string]: any;
}

export const sendJobApplicationNotification = functions.runWith({ secrets: ['RESEND_API_KEY'] }).https.onCall(
  async (data: JobApplicationData, context) => {
    try {
      // Rate limit: 10 per day per user/IP
      const limitKey = `job_${context.auth?.uid ?? context.rawRequest?.ip ?? 'unknown'}`;
      await checkRateLimit(limitKey, 10, 24 * 60 * 60 * 1000);

      if (!data.position || !data.email || !data.name) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
      }
      if (!isValidEmail(data.email)) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid email address');
      }
      if (data.coverLetter?.length > 5000) {
        throw new functions.https.HttpsError('invalid-argument', 'Cover letter too long (max 5000 chars)');
      }
      // Validate resume URL is from Firebase Storage only
      if (data.resumeUrl) {
        try {
          const url = new URL(data.resumeUrl);
          const allowed = ['firebasestorage.googleapis.com', 'storage.googleapis.com'];
          if (!allowed.some((d) => url.hostname.endsWith(d))) {
            throw new functions.https.HttpsError('invalid-argument', 'Resume must be hosted on GRATIS storage');
          }
        } catch {
          throw new functions.https.HttpsError('invalid-argument', 'Invalid resume URL');
        }
      }

      const safeName     = sanitize(data.name);
      const safePosition = sanitize(data.position);
      const safeCity     = sanitize(data.city ?? '');
      const safeLetter   = sanitize(data.coverLetter ?? '');

      await sendEmail({
        to: 'careers@gratis.ngo',
        subject: `[Job Application] ${safePosition} - ${safeName}`,
        type: 'welcome',
        data: {
          firstName: 'HR Team',
          customMessage: `
            <h3>New Job Application</h3>
            <p><strong>Position:</strong> ${safePosition}</p>
            <p><strong>Candidate:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${sanitize(data.email)}</p>
            <p><strong>Phone:</strong> ${sanitize(data.phone ?? '')}</p>
            <p><strong>Location:</strong> ${safeCity}</p>
            <hr>
            <p><strong>Cover Letter:</strong></p>
            <p style="background:#f5f5f5;padding:12px;border-radius:6px;">${safeLetter.replace(/\n/g, '<br>')}</p>
            ${data.resumeUrl ? `<p><strong>Resume:</strong> <a href="${data.resumeUrl}">Download</a></p>` : ''}
            <hr>
            <p><a href="${APP_URL}/admin/careers/applications" style="background:#C1FF00;color:#000;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;font-weight:bold;">Review Application</a></p>
          `,
        },
        replyTo: data.email,
      });

      await sendEmail({
        to: data.email,
        subject: `Application Received: ${safePosition} - GRATIS`,
        type: 'welcome',
        data: {
          firstName: safeName,
          customMessage: `
            <p>Thank you for applying for the <strong>${safePosition}</strong> position at GRATIS!</p>
            <p>We've received your application and our team will review it within 5 business days.</p>
            <p><strong>What's Next?</strong></p>
            <ul>
              <li>Initial screening: 5-7 business days</li>
              <li>If selected, we'll reach out to schedule an interview</li>
              <li>Interview process typically takes 2-3 weeks</li>
            </ul>
          `,
        },
      });

      await admin.firestore().collection('jobApplications').add({
        position:    safePosition,
        name:        safeName,
        email:       data.email,
        phone:       data.phone ?? '',
        city:        safeCity,
        coverLetter: safeLetter,
        resumeUrl:   data.resumeUrl ?? null,
        uid:         context.auth?.uid ?? null,
        ip:          context.rawRequest?.ip ?? null,
        createdAt:   admin.firestore.FieldValue.serverTimestamp(),
        status:      'pending',
      });

      functions.logger.info(`Job application: ${safePosition} - ${safeName}`);
      return { success: true };
    } catch (error) {
      if (error instanceof functions.https.HttpsError) throw error;
      functions.logger.error('Job application error:', error);
      throw new functions.https.HttpsError('internal', 'Failed to send email');
    }
  }
);

// ============================================================================
// VOLUNTEER APPLICATION
// ============================================================================

interface VolunteerApplicationData {
  name: string;
  email: string;
  phone: string;
  city: string;
  interests: string[];
  availability: string;
  motivation: string;
  [key: string]: any;
}

const VALID_INTERESTS     = ['events','social-media','fundraising','education','logistics','photography','design','community','other'];
const VALID_AVAILABILITY  = ['weekdays','weekends','evenings','full-time','part-time','flexible'];

export const sendVolunteerApplicationNotification = functions.runWith({ secrets: ['RESEND_API_KEY'] }).https.onCall(
  async (data: VolunteerApplicationData, context) => {
    try {
      // Rate limit: 2 volunteer apps per day per user/IP
      const limitKey = `volunteer_${context.auth?.uid ?? context.rawRequest?.ip ?? 'unknown'}`;
      await checkRateLimit(limitKey, 2, 24 * 60 * 60 * 1000);

      if (!data.name || !data.email || !data.motivation) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
      }
      if (!isValidEmail(data.email)) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid email address');
      }
      if (!Array.isArray(data.interests) || data.interests.some((i) => !VALID_INTERESTS.includes(String(i).toLowerCase()))) {
        throw new functions.https.HttpsError('invalid-argument', `Invalid interests. Allowed: ${VALID_INTERESTS.join(', ')}`);
      }
      if (!VALID_AVAILABILITY.includes(String(data.availability).toLowerCase())) {
        throw new functions.https.HttpsError('invalid-argument', `Invalid availability. Allowed: ${VALID_AVAILABILITY.join(', ')}`);
      }
      if (data.motivation?.length > 3000) {
        throw new functions.https.HttpsError('invalid-argument', 'Motivation too long (max 3000 chars)');
      }

      const safeName       = sanitize(data.name);
      const safeCity       = sanitize(data.city ?? '');
      const safeMotivation = sanitize(data.motivation);
      const safeExperience = data.experience ? sanitize(data.experience) : null;
      const safeInterests  = data.interests.map(sanitize).join(', ');

      await sendEmail({
        to: 'volunteers@gratis.ngo',
        subject: `[Volunteer Application] ${safeName}`,
        type: 'welcome',
        data: {
          firstName: 'Volunteer Team',
          customMessage: `
            <h3>New Volunteer Application</h3>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${sanitize(data.email)}</p>
            <p><strong>Phone:</strong> ${sanitize(data.phone ?? '')}</p>
            <p><strong>Location:</strong> ${safeCity}</p>
            <p><strong>Interests:</strong> ${safeInterests}</p>
            <p><strong>Availability:</strong> ${sanitize(data.availability)}</p>
            <hr>
            <p><strong>Motivation:</strong></p>
            <p style="background:#f5f5f5;padding:12px;border-radius:6px;">${safeMotivation.replace(/\n/g, '<br>')}</p>
            ${safeExperience ? `
              <hr>
              <p><strong>Previous Experience:</strong></p>
              <p style="background:#f5f5f5;padding:12px;border-radius:6px;">${safeExperience.replace(/\n/g, '<br>')}</p>
            ` : ''}
            <hr>
            <p><a href="${APP_URL}/admin/volunteers/applications" style="background:#C1FF00;color:#000;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;font-weight:bold;">Review Application</a></p>
          `,
        },
        replyTo: data.email,
      });

      await sendEmail({
        to: data.email,
        subject: 'Welcome to the GRATIS Crew! 🙌',
        type: 'welcome',
        data: {
          firstName: safeName,
          customMessage: `
            <p>Thank you for your interest in volunteering with GRATIS!</p>
            <p>We're excited to have you join the movement.</p>
            <p><strong>What Happens Next?</strong></p>
            <ol>
              <li>We'll review your application within 48 hours</li>
              <li>Our volunteer coordinator will reach out to schedule an orientation call</li>
              <li>You'll receive information about upcoming volunteer opportunities</li>
            </ol>
            <p><strong>Your Interests:</strong> ${safeInterests}</p>
            <p><strong>Your Availability:</strong> ${sanitize(data.availability)}</p>
            <p>Questions? Reply to this email or reach out to volunteers@gratis.ngo</p>
          `,
        },
      });

      await admin.firestore().collection('volunteerApplications').add({
        name:         safeName,
        email:        data.email,
        phone:        data.phone ?? '',
        city:         safeCity,
        interests:    data.interests,
        availability: data.availability,
        motivation:   safeMotivation,
        experience:   safeExperience,
        uid:          context.auth?.uid ?? null,
        ip:           context.rawRequest?.ip ?? null,
        createdAt:    admin.firestore.FieldValue.serverTimestamp(),
        status:       'pending',
      });

      functions.logger.info(`Volunteer application: ${safeName}`);
      return { success: true };
    } catch (error) {
      if (error instanceof functions.https.HttpsError) throw error;
      functions.logger.error('Volunteer application error:', error);
      throw new functions.https.HttpsError('internal', 'Failed to send email');
    }
  }
);

// ============================================================================
// APPLICATION ACTION EMAIL
// Called by AdminApplicationReview when admin approves / rejects / requests info
// Only callable by authenticated admins (role verified against Firestore).
// ============================================================================

interface ApplicationActionData {
  to:               string;
  contactName:      string;
  organizationName: string;
  action:           'approve' | 'reject' | 'info';
  message:          string;
  applicationType:  'partner' | 'ngo';
}

export const sendApplicationActionEmail = functions
  .runWith({ secrets: ['RESEND_API_KEY'] })
  .https.onCall(async (data: ApplicationActionData, context) => {
    try {
      // Require authenticated caller
      if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
      }

      // Verify admin role in Firestore
      const profileSnap = await admin.firestore().doc(`users/${context.auth.uid}`).get();
      const role = profileSnap.data()?.role;
      if (role !== 'admin') {
        throw new functions.https.HttpsError('permission-denied', 'Admin role required');
      }

      // Validate inputs
      if (!data.to || !isValidEmail(data.to)) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid recipient email');
      }
      if (!['approve', 'reject', 'info'].includes(data.action)) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid action');
      }
      if ((data.message?.length ?? 0) > 5000) {
        throw new functions.https.HttpsError('invalid-argument', 'Message too long (max 5000 chars)');
      }

      const safeName    = sanitize(data.contactName    ?? '');
      const safeOrg     = sanitize(data.organizationName ?? '');
      const safeMessage = sanitize(data.message ?? '');

      const subjects: Record<string, string> = {
        approve: `Welcome to GRATIS — ${safeOrg} 🎉`,
        reject:  `Update on your GRATIS partner application — ${safeOrg}`,
        info:    `Additional information needed — ${safeOrg}`,
      };

      await sendEmail({
        to:      data.to,
        subject: subjects[data.action],
        type:    'welcome',
        data: {
          firstName: safeName || 'Applicant',
          customMessage: `
            <p>${safeMessage.replace(/\n/g, '<br>')}</p>
            <hr style="margin:24px 0;border-color:#333;">
            <p style="font-size:12px;color:#888;">
              This message was sent by the GRATIS partnerships team.<br>
              Questions? Contact us at
              <a href="mailto:partnerships@gratis.ngo" style="color:#C1FF00;">partnerships@gratis.ngo</a>
            </p>
          `,
        },
        replyTo: 'partnerships@gratis.ngo',
      });

      // Audit log
      await admin.firestore().collection('adminActionLog').add({
        adminUid:         context.auth.uid,
        action:           data.action,
        applicationType:  data.applicationType,
        recipientEmail:   data.to,
        organizationName: safeOrg,
        createdAt:        admin.firestore.FieldValue.serverTimestamp(),
      });

      functions.logger.info(
        `Admin ${context.auth.uid} sent '${data.action}' to ${data.to} for ${safeOrg}`
      );
      return { success: true };
    } catch (error) {
      if (error instanceof functions.https.HttpsError) throw error;
      functions.logger.error('Application action email error:', error);
      throw new functions.https.HttpsError('internal', 'Failed to send email');
    }
  });

