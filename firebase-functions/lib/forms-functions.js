"use strict";
/**
 * Forms & Application Email Functions
 * Handles email notifications for various forms and applications
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
exports.sendVolunteerApplicationNotification = exports.sendJobApplicationNotification = exports.sendPartnerApplicationNotification = exports.sendNGOApplicationNotification = exports.sendPartnerInquiryNotification = exports.sendContactEmail = void 0;
const functions = __importStar(require("firebase-functions"));
const email_service_1 = require("./email-service");
const admin = __importStar(require("firebase-admin"));
exports.sendContactEmail = functions.runWith({ secrets: ['RESEND_API_KEY'] }).https.onCall(async (data, context) => {
    try {
        // Validate input
        if (!data.name || !data.email || !data.subject || !data.message) {
            throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
        }
        // Send notification to admin team
        await (0, email_service_1.sendEmail)({
            to: 'hello@gratis.ngo',
            subject: `[Contact Form] ${data.subject}`,
            type: 'welcome', // Using welcome as a generic template
            data: {
                firstName: 'Team',
                customMessage: `
            <h3>New Contact Form Submission</h3>
            <p><strong>From:</strong> ${data.name} (${data.email})</p>
            <p><strong>Subject:</strong> ${data.subject}</p>
            <p><strong>Message:</strong></p>
            <p>${data.message.replace(/\n/g, '<br>')}</p>
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
                firstName: data.name,
                customMessage: `
            <p>Thank you for reaching out! We've received your message and will respond within 24-48 hours.</p>
            <p><strong>Your message:</strong></p>
            <blockquote style="border-left: 3px solid #C1FF00; padding-left: 15px; margin: 15px 0;">
              <p>${data.message.replace(/\n/g, '<br>')}</p>
            </blockquote>
          `,
            },
        });
        // Log to Firestore
        await admin.firestore().collection('contactMessages').add(Object.assign(Object.assign({}, data), { createdAt: admin.firestore.FieldValue.serverTimestamp(), status: 'pending' }));
        functions.logger.info(`Contact form submitted by ${data.email}`);
        return { success: true };
    }
    catch (error) {
        functions.logger.error('Contact form error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to send email');
    }
});
exports.sendPartnerInquiryNotification = functions.runWith({ secrets: ['RESEND_API_KEY'] }).https.onCall(async (data, context) => {
    try {
        if (!data.company_name || !data.email || !data.contact_person) {
            throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
        }
        // Send notification to admin team
        await (0, email_service_1.sendEmail)({
            to: 'partnerships@gratis.ngo',
            subject: `[Partner Inquiry] ${data.inquiry_type} - ${data.company_name}`,
            type: 'welcome',
            data: {
                firstName: 'Partnerships Team',
                customMessage: `
            <h3>New Partner Inquiry</h3>
            <p><strong>Type:</strong> ${data.inquiry_type}</p>
            <p><strong>Company:</strong> ${data.company_name}</p>
            <p><strong>Contact:</strong> ${data.contact_person}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
            ${data.website ? `<p><strong>Website:</strong> ${data.website}</p>` : ''}
            <hr>
            <p><strong>Additional Details:</strong></p>
            <pre>${JSON.stringify(data, null, 2)}</pre>
          `,
            },
            replyTo: data.email,
        });
        // Send confirmation to partner
        await (0, email_service_1.sendEmail)({
            to: data.email,
            subject: 'Thank you for your partnership inquiry - GRATIS',
            type: 'welcome',
            data: {
                firstName: data.contact_person,
                customMessage: `
            <p>Thank you for your interest in partnering with GRATIS!</p>
            <p>We've received your ${data.inquiry_type} inquiry and our partnerships team will review it shortly.</p>
            <p>We'll contact you within 48 hours to discuss next steps.</p>
            <p><strong>Your inquiry details:</strong></p>
            <ul>
              <li><strong>Company:</strong> ${data.company_name}</li>
              ${data.website ? `<li><strong>Website:</strong> ${data.website}</li>` : ''}
            </ul>
          `,
            },
        });
        functions.logger.info(`Partner inquiry submitted: ${data.inquiry_type} - ${data.company_name}`);
        return { success: true };
    }
    catch (error) {
        functions.logger.error('Partner inquiry error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to send email');
    }
});
exports.sendNGOApplicationNotification = functions.runWith({ secrets: ['RESEND_API_KEY'] }).https.onCall(async (data, context) => {
    try {
        if (!data.organizationName ||
            !data.contactEmail ||
            !data.contactName) {
            throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
        }
        // Send notification to admin team
        await (0, email_service_1.sendEmail)({
            to: 'partnerships@gratis.ngo',
            subject: `[NGO Application] ${data.organizationName}`,
            type: 'welcome',
            data: {
                firstName: 'Partnerships Team',
                customMessage: `
            <h3>New NGO Partnership Application</h3>
            <p><strong>Organization:</strong> ${data.organizationName}</p>
            <p><strong>Contact:</strong> ${data.contactName}</p>
            <p><strong>Email:</strong> ${data.contactEmail}</p>
            <p><strong>Phone:</strong> ${data.contactPhone}</p>
            <p><strong>Country:</strong> ${data.country}</p>
            ${data.website ? `<p><strong>Website:</strong> ${data.website}</p>` : ''}
            <hr>
            <p><strong>Mission:</strong></p>
            <p>${data.mission}</p>
            <hr>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://gratis-ngo-7bb44.web.app'}/admin/partners/review" style="background: #C1FF00; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Review Application</a></p>
          `,
            },
            replyTo: data.contactEmail,
        });
        // Send confirmation to applicant
        await (0, email_service_1.sendEmail)({
            to: data.contactEmail,
            subject: 'NGO Application Received - GRATIS',
            type: 'welcome',
            data: {
                firstName: data.contactName,
                customMessage: `
            <p>Thank you for applying to become a GRATIS partner NGO!</p>
            <p>We've received your application for <strong>${data.organizationName}</strong>.</p>
            <p><strong>What happens next?</strong></p>
            <ol>
              <li>Our partnerships team will review your application (5-7 business days)</li>
              <li>We may reach out for additional information or clarification</li>
              <li>If approved, we'll schedule an onboarding call to discuss next steps</li>
            </ol>
            <p>In the meantime, feel free to explore our <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://gratis-ngo-7bb44.web.app'}/partners">partner resources</a>.</p>
          `,
            },
        });
        functions.logger.info(`NGO application submitted: ${data.organizationName}`);
        return { success: true };
    }
    catch (error) {
        functions.logger.error('NGO application error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to send email');
    }
});
exports.sendPartnerApplicationNotification = functions.runWith({ secrets: ['RESEND_API_KEY'] }).https.onCall(async (data, context) => {
    var _a, _b, _c;
    try {
        if (!data.organizationName ||
            !((_a = data.primaryContact) === null || _a === void 0 ? void 0 : _a.email) ||
            !((_b = data.primaryContact) === null || _b === void 0 ? void 0 : _b.firstName)) {
            throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
        }
        const contactName = `${data.primaryContact.firstName} ${data.primaryContact.lastName}`;
        // Send notification to admin team
        await (0, email_service_1.sendEmail)({
            to: 'partnerships@gratis.ngo',
            subject: `[Partner Application] ${data.organizationName}`,
            type: 'welcome',
            data: {
                firstName: 'Partnerships Team',
                customMessage: `
            <h3>New Partner Application</h3>
            <p><strong>Organization:</strong> ${data.organizationName}</p>
            <p><strong>Type:</strong> ${data.organizationType}</p>
            <p><strong>Contact:</strong> ${contactName}</p>
            <p><strong>Email:</strong> ${data.primaryContact.email}</p>
            <p><strong>Phone:</strong> ${data.primaryContact.phone}</p>
            <p><strong>Focus Areas:</strong> ${((_c = data.focusAreas) === null || _c === void 0 ? void 0 : _c.join(', ')) || 'N/A'}</p>
            <hr>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://gratis-ngo-7bb44.web.app'}/admin/partners/review" style="background: #C1FF00; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Review Application</a></p>
          `,
            },
            replyTo: data.primaryContact.email,
        });
        // Send confirmation to applicant
        await (0, email_service_1.sendEmail)({
            to: data.primaryContact.email,
            subject: 'Partner Application Received - GRATIS',
            type: 'welcome',
            data: {
                firstName: data.primaryContact.firstName,
                customMessage: `
            <p>Thank you for applying to become a GRATIS partner!</p>
            <p>We've received your application for <strong>${data.organizationName}</strong>.</p>
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
        functions.logger.info(`Partner application submitted: ${data.organizationName}`);
        return { success: true };
    }
    catch (error) {
        functions.logger.error('Partner application error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to send email');
    }
});
exports.sendJobApplicationNotification = functions.runWith({ secrets: ['RESEND_API_KEY'] }).https.onCall(async (data, context) => {
    try {
        if (!data.position || !data.email || !data.name) {
            throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
        }
        // Send notification to HR team
        await (0, email_service_1.sendEmail)({
            to: 'careers@gratis.ngo',
            subject: `[Job Application] ${data.position} - ${data.name}`,
            type: 'welcome',
            data: {
                firstName: 'HR Team',
                customMessage: `
            <h3>New Job Application</h3>
            <p><strong>Position:</strong> ${data.position}</p>
            <p><strong>Candidate:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Location:</strong> ${data.city}</p>
            <hr>
            <p><strong>Cover Letter:</strong></p>
            <p>${data.coverLetter.replace(/\n/g, '<br>')}</p>
            ${data.resumeUrl ? `<p><strong>Resume:</strong> <a href="${data.resumeUrl}">Download</a></p>` : ''}
            <hr>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://gratis-ngo-7bb44.web.app'}/admin/careers/applications" style="background: #C1FF00; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Review Application</a></p>
          `,
            },
            replyTo: data.email,
        });
        // Send confirmation to applicant
        await (0, email_service_1.sendEmail)({
            to: data.email,
            subject: `Application Received: ${data.position} - GRATIS`,
            type: 'welcome',
            data: {
                firstName: data.name,
                customMessage: `
            <p>Thank you for applying for the <strong>${data.position}</strong> position at GRATIS!</p>
            <p>We've received your application and our team will review it within 5 business days.</p>
            <p><strong>What's Next?</strong></p>
            <ul>
              <li>Initial screening: 5-7 business days</li>
              <li>If selected, we'll reach out to schedule an interview</li>
              <li>Interview process typically takes 2-3 weeks</li>
            </ul>
            <p>We'll keep you updated on the status of your application via email.</p>
            <p>In the meantime, feel free to learn more about <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://gratis-ngo-7bb44.web.app'}/about">our mission</a> and follow us on social media!</p>
          `,
            },
        });
        functions.logger.info(`Job application submitted: ${data.position} - ${data.name}`);
        return { success: true };
    }
    catch (error) {
        functions.logger.error('Job application error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to send email');
    }
});
exports.sendVolunteerApplicationNotification = functions.runWith({ secrets: ['RESEND_API_KEY'] }).https.onCall(async (data, context) => {
    try {
        if (!data.name || !data.email || !data.motivation) {
            throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
        }
        // Send notification to volunteer coordinator
        await (0, email_service_1.sendEmail)({
            to: 'volunteers@gratis.ngo',
            subject: `[Volunteer Application] ${data.name}`,
            type: 'welcome',
            data: {
                firstName: 'Volunteer Team',
                customMessage: `
            <h3>New Volunteer Application</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Location:</strong> ${data.city}</p>
            <p><strong>Interests:</strong> ${data.interests.join(', ')}</p>
            <p><strong>Availability:</strong> ${data.availability}</p>
            <hr>
            <p><strong>Motivation:</strong></p>
            <p>${data.motivation.replace(/\n/g, '<br>')}</p>
            ${data.experience ? `
              <hr>
              <p><strong>Previous Experience:</strong></p>
              <p>${data.experience.replace(/\n/g, '<br>')}</p>
            ` : ''}
            <hr>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://gratis-ngo-7bb44.web.app'}/admin/volunteers/applications" style="background: #C1FF00; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Review Application</a></p>
          `,
            },
            replyTo: data.email,
        });
        // Send confirmation to volunteer
        await (0, email_service_1.sendEmail)({
            to: data.email,
            subject: 'Welcome to the GRATIS Crew! 🙌',
            type: 'welcome',
            data: {
                firstName: data.name,
                customMessage: `
            <p>Thank you for your interest in volunteering with GRATIS!</p>
            <p>We're excited to have you join the movement to provide free water while making a positive impact.</p>
            <p><strong>What Happens Next?</strong></p>
            <ol>
              <li>We'll review your application within 48 hours</li>
              <li>Our volunteer coordinator will reach out to schedule an orientation call</li>
              <li>You'll receive information about upcoming volunteer opportunities</li>
            </ol>
            <p><strong>Your Interests:</strong> ${data.interests.join(', ')}</p>
            <p><strong>Your Availability:</strong> ${data.availability}</p>
            <p>Keep an eye on your inbox for updates!</p>
            <p>Questions? Reply to this email or reach out to volunteers@gratis.ngo</p>
          `,
            },
        });
        functions.logger.info(`Volunteer application submitted: ${data.name}`);
        return { success: true };
    }
    catch (error) {
        functions.logger.error('Volunteer application error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to send email');
    }
});
//# sourceMappingURL=forms-functions.js.map