"use strict";
/**
 * Forms & Application Email Functions
 * Handles email notifications for various forms and applications
 *
 * SECURITY: All inputs sanitized, rate-limited, and validated before use.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendApplicationActionEmail = exports.sendVolunteerApplicationNotification = exports.sendJobApplicationNotification = exports.sendPartnerApplicationNotification = exports.sendNGOApplicationNotification = exports.sendPartnerInquiryNotification = exports.sendContactEmail = exports.savePartnerProject = exports.submitInvestmentPledge = exports.submitDonationPledge = void 0;
const functions = __importStar(require("firebase-functions"));
const email_service_1 = require("./email-service");
const admin = __importStar(require("firebase-admin"));
// ── Security helpers ──────────────────────────────────────────────────────────
/** Escape HTML metacharacters to prevent XSS in email templates */
function sanitize(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}
/** Basic email format check */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email));
}
/**
 * Sliding-window rate limiter backed by Firestore.
 * Throws HttpsError('resource-exhausted') when limit is exceeded.
 */
async function checkRateLimit(key, maxCalls, windowMs) {
    const db = admin.firestore();
    const ref = db.collection('rateLimits').doc(key);
    const now = Date.now();
    await db.runTransaction(async (tx) => {
        var _a;
        const snap = await tx.get(ref);
        const timestamps = (((_a = snap.data()) === null || _a === void 0 ? void 0 : _a.timestamps) || [])
            .filter((t) => t > now - windowMs);
        if (timestamps.length >= maxCalls) {
            throw new functions.https.HttpsError('resource-exhausted', 'Too many requests – please try again later.');
        }
        timestamps.push(now);
        tx.set(ref, { timestamps }, { merge: true });
    });
}
const APP_URL = 'https://gratis-ngo-7bb44.web.app';
exports.submitDonationPledge = functions.https.onCall(async (data, context) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    try {
        const limitKey = `donation_${(_d = (_b = (_a = context.auth) === null || _a === void 0 ? void 0 : _a.uid) !== null && _b !== void 0 ? _b : (_c = context.rawRequest) === null || _c === void 0 ? void 0 : _c.ip) !== null && _d !== void 0 ? _d : 'unknown'}`;
        await checkRateLimit(limitKey, 10, 60 * 60 * 1000);
        if (!data.name || !data.email || !data.donationType || typeof data.amount !== 'number') {
            throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
        }
        if (!isValidEmail(data.email)) {
            throw new functions.https.HttpsError('invalid-argument', 'Invalid email address');
        }
        if (!['one-time', 'monthly'].includes(String(data.donationType))) {
            throw new functions.https.HttpsError('invalid-argument', 'Invalid donation type');
        }
        if (!Number.isFinite(data.amount) || data.amount < 5 || data.amount > 100000) {
            throw new functions.https.HttpsError('invalid-argument', 'Donation amount must be between 5 and 100000');
        }
        if (((_f = (_e = data.message) === null || _e === void 0 ? void 0 : _e.length) !== null && _f !== void 0 ? _f : 0) > 2000) {
            throw new functions.https.HttpsError('invalid-argument', 'Message too long (max 2000 chars)');
        }
        const safeName = sanitize(data.name);
        const safeMessage = data.message ? sanitize(data.message) : null;
        const ref = await admin.firestore().collection('donationPledges').add({
            name: safeName,
            email: data.email,
            donationType: data.donationType,
            amount: data.amount,
            message: safeMessage,
            uid: (_h = (_g = context.auth) === null || _g === void 0 ? void 0 : _g.uid) !== null && _h !== void 0 ? _h : null,
            ip: (_k = (_j = context.rawRequest) === null || _j === void 0 ? void 0 : _j.ip) !== null && _k !== void 0 ? _k : null,
            source: 'spark_donation_form',
            status: 'pending_payment',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return { success: true, pledgeId: ref.id };
    }
    catch (error) {
        if (error instanceof functions.https.HttpsError)
            throw error;
        functions.logger.error('Donation pledge error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to submit donation pledge');
    }
});
exports.submitInvestmentPledge = functions.https.onCall(async (data, context) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    try {
        const limitKey = `investment_${(_d = (_b = (_a = context.auth) === null || _a === void 0 ? void 0 : _a.uid) !== null && _b !== void 0 ? _b : (_c = context.rawRequest) === null || _c === void 0 ? void 0 : _c.ip) !== null && _d !== void 0 ? _d : 'unknown'}`;
        await checkRateLimit(limitKey, 10, 60 * 60 * 1000);
        if (!data.name || !data.email || !data.country || !data.investmentType || !data.commitment || typeof data.amount !== 'number') {
            throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
        }
        if (!isValidEmail(data.email)) {
            throw new functions.https.HttpsError('invalid-argument', 'Invalid email address');
        }
        if (!['scholarship', 'microcredit'].includes(String(data.investmentType))) {
            throw new functions.https.HttpsError('invalid-argument', 'Invalid investment type');
        }
        if (!['one-time', 'annual'].includes(String(data.commitment))) {
            throw new functions.https.HttpsError('invalid-argument', 'Invalid commitment type');
        }
        if (!Number.isFinite(data.amount) || data.amount < 100 || data.amount > 1000000) {
            throw new functions.https.HttpsError('invalid-argument', 'Investment amount must be between 100 and 1000000');
        }
        if (((_f = (_e = data.motivation) === null || _e === void 0 ? void 0 : _e.length) !== null && _f !== void 0 ? _f : 0) > 3000) {
            throw new functions.https.HttpsError('invalid-argument', 'Motivation too long (max 3000 chars)');
        }
        const safeName = sanitize(data.name);
        const safeCountry = sanitize(data.country);
        const safeMotivation = data.motivation ? sanitize(data.motivation) : null;
        const ref = await admin.firestore().collection('investmentPledges').add({
            name: safeName,
            email: data.email,
            country: safeCountry,
            investmentType: data.investmentType,
            amount: data.amount,
            commitment: data.commitment,
            motivation: safeMotivation,
            uid: (_h = (_g = context.auth) === null || _g === void 0 ? void 0 : _g.uid) !== null && _h !== void 0 ? _h : null,
            ip: (_k = (_j = context.rawRequest) === null || _j === void 0 ? void 0 : _j.ip) !== null && _k !== void 0 ? _k : null,
            source: 'spark_investment_form',
            status: 'pending_review',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return { success: true, pledgeId: ref.id };
    }
    catch (error) {
        if (error instanceof functions.https.HttpsError)
            throw error;
        functions.logger.error('Investment pledge error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to submit investment pledge');
    }
});
async function isAdminUser(uid) {
    var _a;
    const snap = await admin.firestore().doc(`users/${uid}`).get();
    return ((_a = snap.data()) === null || _a === void 0 ? void 0 : _a.role) === 'admin';
}
exports.savePartnerProject = functions.https.onCall(async (data, context) => {
    var _a, _b, _c, _d, _e;
    try {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Must be logged in to manage projects');
        }
        await checkRateLimit(`project_${context.auth.uid}`, 30, 60 * 60 * 1000);
        if (!data.title || !data.description || !data.category || !data.country || typeof data.fundingGoal !== 'number') {
            throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
        }
        if (((_b = (_a = data.title) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) > 200 || ((_d = (_c = data.description) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0) > 8000) {
            throw new functions.https.HttpsError('invalid-argument', 'Project title/description exceeds max length');
        }
        if (!Number.isFinite(data.fundingGoal) || data.fundingGoal <= 0 || data.fundingGoal > 100000000) {
            throw new functions.https.HttpsError('invalid-argument', 'Funding goal must be between 1 and 100000000');
        }
        if (!['EUR', 'USD', 'GBP'].includes(String(data.currency))) {
            throw new functions.https.HttpsError('invalid-argument', 'Invalid currency');
        }
        if (data.targetBeneficiaries !== undefined) {
            if (!Number.isFinite(data.targetBeneficiaries) || data.targetBeneficiaries < 0 || data.targetBeneficiaries > 100000000) {
                throw new functions.https.HttpsError('invalid-argument', 'Invalid target beneficiaries value');
            }
        }
        const safePayload = {
            title: sanitize(data.title),
            slug: sanitize(data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')),
            description: sanitize(data.description),
            category: sanitize(data.category),
            country: sanitize(data.country),
            region: data.region ? sanitize(data.region) : '',
            city: data.city ? sanitize(data.city) : '',
            fundingGoal: data.fundingGoal,
            currency: data.currency,
            startDate: data.startDate || null,
            endDate: data.endDate || null,
            targetBeneficiaries: (_e = data.targetBeneficiaries) !== null && _e !== void 0 ? _e : null,
            coverImage: data.coverImage ? sanitize(data.coverImage) : '',
        };
        const db = admin.firestore();
        const isAdmin = await isAdminUser(context.auth.uid);
        if (data.projectId) {
            const ref = db.collection('partnerProjects').doc(data.projectId);
            const snap = await ref.get();
            if (!snap.exists) {
                throw new functions.https.HttpsError('not-found', 'Project not found');
            }
            const existing = snap.data();
            if (!isAdmin && (existing === null || existing === void 0 ? void 0 : existing.createdBy) !== context.auth.uid) {
                throw new functions.https.HttpsError('permission-denied', 'Not allowed to edit this project');
            }
            await ref.update(Object.assign(Object.assign({}, safePayload), { updatedAt: admin.firestore.FieldValue.serverTimestamp(), updatedBy: context.auth.uid }));
            return { success: true, projectId: ref.id, action: 'updated' };
        }
        const createdRef = await db.collection('partnerProjects').add(Object.assign(Object.assign({}, safePayload), { status: 'draft', fundingCurrent: 0, donors: 0, views: 0, createdBy: context.auth.uid, createdAt: admin.firestore.FieldValue.serverTimestamp(), updatedAt: admin.firestore.FieldValue.serverTimestamp() }));
        return { success: true, projectId: createdRef.id, action: 'created' };
    }
    catch (error) {
        if (error instanceof functions.https.HttpsError)
            throw error;
        functions.logger.error('savePartnerProject error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to save project');
    }
});
exports.sendContactEmail = functions.runWith({ secrets: ['RESEND_API_KEY'] }).https.onCall(async (data, context) => {
    var _a, _b, _c, _d, _e, _f;
    try {
        // Rate limit: 3 submissions per hour per IP
        const rateLimitKey = `contact_${(_b = (_a = context.rawRequest) === null || _a === void 0 ? void 0 : _a.ip) !== null && _b !== void 0 ? _b : 'unknown'}`;
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
        const safeName = sanitize(data.name);
        const safeEmail = sanitize(data.email);
        const safeSubject = sanitize(data.subject);
        const safeMessage = sanitize(data.message);
        // Send notification to admin team
        await (0, email_service_1.sendEmail)({
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
        await (0, email_service_1.sendEmail)({
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
            name: safeName,
            email: data.email, // original for reply-to
            subject: safeSubject,
            message: safeMessage,
            uid: (_d = (_c = context.auth) === null || _c === void 0 ? void 0 : _c.uid) !== null && _d !== void 0 ? _d : null,
            ip: (_f = (_e = context.rawRequest) === null || _e === void 0 ? void 0 : _e.ip) !== null && _f !== void 0 ? _f : null,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            status: 'pending',
        });
        functions.logger.info(`Contact form submitted by ${data.email}`);
        return { success: true };
    }
    catch (error) {
        // Re-throw HttpsErrors as-is so the client receives the correct error code
        if (error instanceof functions.https.HttpsError)
            throw error;
        functions.logger.error('Contact form error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to send email');
    }
});
const VALID_INQUIRY_TYPES = ['advertising', 'sponsorship', 'distribution', 'co-branding', 'event', 'other'];
exports.sendPartnerInquiryNotification = functions.runWith({ secrets: ['RESEND_API_KEY'] }).https.onCall(async (data, context) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    try {
        // Rate limit: 5 per day per user/IP
        const limitKey = `partner_${(_d = (_b = (_a = context.auth) === null || _a === void 0 ? void 0 : _a.uid) !== null && _b !== void 0 ? _b : (_c = context.rawRequest) === null || _c === void 0 ? void 0 : _c.ip) !== null && _d !== void 0 ? _d : 'unknown'}`;
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
        const safeCompany = sanitize(data.company_name);
        const safeContact = sanitize(data.contact_person);
        const safeEmail = sanitize(data.email);
        const safeType = sanitize(data.inquiry_type);
        const safePhone = data.phone ? sanitize(data.phone) : null;
        const safeWebsite = data.website ? sanitize(data.website) : null;
        await (0, email_service_1.sendEmail)({
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
            ${safePhone ? `<p><strong>Phone:</strong> ${safePhone}</p>` : ''}
            ${safeWebsite ? `<p><strong>Website:</strong> ${safeWebsite}</p>` : ''}
          `,
            },
            replyTo: data.email,
        });
        await (0, email_service_1.sendEmail)({
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
            company_name: safeCompany,
            contact_person: safeContact,
            email: data.email,
            phone: safePhone,
            website: safeWebsite,
            inquiry_type: safeType,
            uid: (_f = (_e = context.auth) === null || _e === void 0 ? void 0 : _e.uid) !== null && _f !== void 0 ? _f : null,
            ip: (_h = (_g = context.rawRequest) === null || _g === void 0 ? void 0 : _g.ip) !== null && _h !== void 0 ? _h : null,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            status: 'pending',
        });
        functions.logger.info(`Partner inquiry: ${safeType} - ${safeCompany}`);
        return { success: true };
    }
    catch (error) {
        if (error instanceof functions.https.HttpsError)
            throw error;
        functions.logger.error('Partner inquiry error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to send email');
    }
});
exports.sendNGOApplicationNotification = functions.runWith({ secrets: ['RESEND_API_KEY'] }).https.onCall(async (data, context) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    try {
        // Rate limit: 2 NGO apps per day per user/IP
        const limitKey = `ngo_${(_d = (_b = (_a = context.auth) === null || _a === void 0 ? void 0 : _a.uid) !== null && _b !== void 0 ? _b : (_c = context.rawRequest) === null || _c === void 0 ? void 0 : _c.ip) !== null && _d !== void 0 ? _d : 'unknown'}`;
        await checkRateLimit(limitKey, 2, 24 * 60 * 60 * 1000);
        if (!data.organizationName || !data.contactEmail || !data.contactName) {
            throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
        }
        if (!isValidEmail(data.contactEmail)) {
            throw new functions.https.HttpsError('invalid-argument', 'Invalid email address');
        }
        if (((_e = data.mission) === null || _e === void 0 ? void 0 : _e.length) > 3000) {
            throw new functions.https.HttpsError('invalid-argument', 'Mission description too long (max 3000 chars)');
        }
        const safeOrg = sanitize(data.organizationName);
        const safeContact = sanitize(data.contactName);
        const safeMission = sanitize((_f = data.mission) !== null && _f !== void 0 ? _f : '');
        const safeCountry = sanitize((_g = data.country) !== null && _g !== void 0 ? _g : '');
        const safeWebsite = data.website ? sanitize(data.website) : null;
        const safePhone = data.contactPhone ? sanitize(data.contactPhone) : '';
        await (0, email_service_1.sendEmail)({
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
        await (0, email_service_1.sendEmail)({
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
            contactName: safeContact,
            contactEmail: data.contactEmail,
            contactPhone: safePhone,
            country: safeCountry,
            website: safeWebsite,
            mission: safeMission,
            uid: (_j = (_h = context.auth) === null || _h === void 0 ? void 0 : _h.uid) !== null && _j !== void 0 ? _j : null,
            ip: (_l = (_k = context.rawRequest) === null || _k === void 0 ? void 0 : _k.ip) !== null && _l !== void 0 ? _l : null,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            status: 'pending',
        });
        functions.logger.info(`NGO application submitted: ${safeOrg}`);
        return { success: true };
    }
    catch (error) {
        if (error instanceof functions.https.HttpsError)
            throw error;
        functions.logger.error('NGO application error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to send email');
    }
});
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
exports.sendPartnerApplicationNotification = functions.runWith({ secrets: ['RESEND_API_KEY'] }).https.onCall(async (data, context) => {
    var _a, _b, _c, _d, _e;
    try {
        // Require authentication for partner applications
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Must be logged in to submit a partner application');
        }
        // Rate limit: 3 per day per user
        await checkRateLimit(`partnerapp_${context.auth.uid}`, 3, 24 * 60 * 60 * 1000);
        if (!data.organizationName || !((_a = data.primaryContact) === null || _a === void 0 ? void 0 : _a.email) || !((_b = data.primaryContact) === null || _b === void 0 ? void 0 : _b.firstName)) {
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
        const safeOrg = sanitize(data.organizationName);
        const safeFirst = sanitize(data.primaryContact.firstName);
        const safeLast = sanitize((_c = data.primaryContact.lastName) !== null && _c !== void 0 ? _c : '');
        const safeName = `${safeFirst} ${safeLast}`.trim();
        const safeType = sanitize(String(data.organizationType).toLowerCase().trim());
        const safeAreas = data.focusAreas.map(sanitize).join(', ');
        await (0, email_service_1.sendEmail)({
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
            <p><strong>Phone:</strong> ${sanitize((_d = data.primaryContact.phone) !== null && _d !== void 0 ? _d : '')}</p>
            <p><strong>Focus Areas:</strong> ${safeAreas}</p>
            <hr>
            <p><a href="${APP_URL}/admin/partners/review" style="background:#C1FF00;color:#000;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;font-weight:bold;">Review Application</a></p>
          `,
            },
            replyTo: data.primaryContact.email,
        });
        await (0, email_service_1.sendEmail)({
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
            focusAreas: data.focusAreas,
            primaryContact: {
                firstName: safeFirst,
                lastName: safeLast,
                email: data.primaryContact.email,
                phone: (_e = data.primaryContact.phone) !== null && _e !== void 0 ? _e : '',
            },
            uid: context.auth.uid,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            status: 'pending',
        });
        functions.logger.info(`Partner application: ${safeOrg} uid=${context.auth.uid}`);
        return { success: true };
    }
    catch (error) {
        if (error instanceof functions.https.HttpsError)
            throw error;
        functions.logger.error('Partner application error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to send email');
    }
});
exports.sendJobApplicationNotification = functions.runWith({ secrets: ['RESEND_API_KEY'] }).https.onCall(async (data, context) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    try {
        // Rate limit: 10 per day per user/IP
        const limitKey = `job_${(_d = (_b = (_a = context.auth) === null || _a === void 0 ? void 0 : _a.uid) !== null && _b !== void 0 ? _b : (_c = context.rawRequest) === null || _c === void 0 ? void 0 : _c.ip) !== null && _d !== void 0 ? _d : 'unknown'}`;
        await checkRateLimit(limitKey, 10, 24 * 60 * 60 * 1000);
        if (!data.position || !data.email || !data.name) {
            throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
        }
        if (!isValidEmail(data.email)) {
            throw new functions.https.HttpsError('invalid-argument', 'Invalid email address');
        }
        if (((_e = data.coverLetter) === null || _e === void 0 ? void 0 : _e.length) > 5000) {
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
            }
            catch (_q) {
                throw new functions.https.HttpsError('invalid-argument', 'Invalid resume URL');
            }
        }
        const safeName = sanitize(data.name);
        const safePosition = sanitize(data.position);
        const safeCity = sanitize((_f = data.city) !== null && _f !== void 0 ? _f : '');
        const safeLetter = sanitize((_g = data.coverLetter) !== null && _g !== void 0 ? _g : '');
        await (0, email_service_1.sendEmail)({
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
            <p><strong>Phone:</strong> ${sanitize((_h = data.phone) !== null && _h !== void 0 ? _h : '')}</p>
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
        await (0, email_service_1.sendEmail)({
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
            position: safePosition,
            name: safeName,
            email: data.email,
            phone: (_j = data.phone) !== null && _j !== void 0 ? _j : '',
            city: safeCity,
            coverLetter: safeLetter,
            resumeUrl: (_k = data.resumeUrl) !== null && _k !== void 0 ? _k : null,
            uid: (_m = (_l = context.auth) === null || _l === void 0 ? void 0 : _l.uid) !== null && _m !== void 0 ? _m : null,
            ip: (_p = (_o = context.rawRequest) === null || _o === void 0 ? void 0 : _o.ip) !== null && _p !== void 0 ? _p : null,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            status: 'pending',
        });
        functions.logger.info(`Job application: ${safePosition} - ${safeName}`);
        return { success: true };
    }
    catch (error) {
        if (error instanceof functions.https.HttpsError)
            throw error;
        functions.logger.error('Job application error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to send email');
    }
});
const VALID_INTERESTS = ['events', 'social-media', 'fundraising', 'education', 'logistics', 'photography', 'design', 'community', 'other'];
const VALID_AVAILABILITY = ['weekdays', 'weekends', 'evenings', 'full-time', 'part-time', 'flexible'];
exports.sendVolunteerApplicationNotification = functions.runWith({ secrets: ['RESEND_API_KEY'] }).https.onCall(async (data, context) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    try {
        // Rate limit: 2 volunteer apps per day per user/IP
        const limitKey = `volunteer_${(_d = (_b = (_a = context.auth) === null || _a === void 0 ? void 0 : _a.uid) !== null && _b !== void 0 ? _b : (_c = context.rawRequest) === null || _c === void 0 ? void 0 : _c.ip) !== null && _d !== void 0 ? _d : 'unknown'}`;
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
        if (((_e = data.motivation) === null || _e === void 0 ? void 0 : _e.length) > 3000) {
            throw new functions.https.HttpsError('invalid-argument', 'Motivation too long (max 3000 chars)');
        }
        const safeName = sanitize(data.name);
        const safeCity = sanitize((_f = data.city) !== null && _f !== void 0 ? _f : '');
        const safeMotivation = sanitize(data.motivation);
        const safeExperience = data.experience ? sanitize(data.experience) : null;
        const safeInterests = data.interests.map(sanitize).join(', ');
        await (0, email_service_1.sendEmail)({
            to: 'volunteers@gratis.ngo',
            subject: `[Volunteer Application] ${safeName}`,
            type: 'welcome',
            data: {
                firstName: 'Volunteer Team',
                customMessage: `
            <h3>New Volunteer Application</h3>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${sanitize(data.email)}</p>
            <p><strong>Phone:</strong> ${sanitize((_g = data.phone) !== null && _g !== void 0 ? _g : '')}</p>
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
        await (0, email_service_1.sendEmail)({
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
            name: safeName,
            email: data.email,
            phone: (_h = data.phone) !== null && _h !== void 0 ? _h : '',
            city: safeCity,
            interests: data.interests,
            availability: data.availability,
            motivation: safeMotivation,
            experience: safeExperience,
            uid: (_k = (_j = context.auth) === null || _j === void 0 ? void 0 : _j.uid) !== null && _k !== void 0 ? _k : null,
            ip: (_m = (_l = context.rawRequest) === null || _l === void 0 ? void 0 : _l.ip) !== null && _m !== void 0 ? _m : null,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            status: 'pending',
        });
        functions.logger.info(`Volunteer application: ${safeName}`);
        return { success: true };
    }
    catch (error) {
        if (error instanceof functions.https.HttpsError)
            throw error;
        functions.logger.error('Volunteer application error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to send email');
    }
});
exports.sendApplicationActionEmail = functions
    .runWith({ secrets: ['RESEND_API_KEY'] })
    .https.onCall(async (data, context) => {
    var _a, _b, _c, _d, _e, _f;
    try {
        // Require authenticated caller
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
        }
        // Verify admin role in Firestore
        const profileSnap = await admin.firestore().doc(`users/${context.auth.uid}`).get();
        const role = (_a = profileSnap.data()) === null || _a === void 0 ? void 0 : _a.role;
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
        if (((_c = (_b = data.message) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0) > 5000) {
            throw new functions.https.HttpsError('invalid-argument', 'Message too long (max 5000 chars)');
        }
        const safeName = sanitize((_d = data.contactName) !== null && _d !== void 0 ? _d : '');
        const safeOrg = sanitize((_e = data.organizationName) !== null && _e !== void 0 ? _e : '');
        const safeMessage = sanitize((_f = data.message) !== null && _f !== void 0 ? _f : '');
        const subjects = {
            approve: `Welcome to GRATIS — ${safeOrg} 🎉`,
            reject: `Update on your GRATIS partner application — ${safeOrg}`,
            info: `Additional information needed — ${safeOrg}`,
        };
        await (0, email_service_1.sendEmail)({
            to: data.to,
            subject: subjects[data.action],
            type: 'welcome',
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
            adminUid: context.auth.uid,
            action: data.action,
            applicationType: data.applicationType,
            recipientEmail: data.to,
            organizationName: safeOrg,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        functions.logger.info(`Admin ${context.auth.uid} sent '${data.action}' to ${data.to} for ${safeOrg}`);
        return { success: true };
    }
    catch (error) {
        if (error instanceof functions.https.HttpsError)
            throw error;
        functions.logger.error('Application action email error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to send email');
    }
});
//# sourceMappingURL=forms-functions.js.map