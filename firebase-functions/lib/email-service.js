"use strict";
/**
 * Email Service using Resend API
 * Handles transactional emails for GRATIS platform
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.emails = void 0;
exports.sendEmail = sendEmail;
const resend_1 = require("resend");
// Lazy initialize Resend
let resend = null;
function getResendClient() {
    if (!resend) {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            throw new Error('RESEND_API_KEY environment variable is not set');
        }
        resend = new resend_1.Resend(apiKey);
    }
    return resend;
}
// Main email sending function
async function sendEmail(options) {
    var _a, _b;
    try {
        const resend = getResendClient();
        const { to, subject, type, data, replyTo, attachments, tags } = options;
        // Generate HTML content based on type
        const html = generateEmailHTML(type, data);
        // Send via Resend
        const result = await resend.emails.send({
            from: process.env.EMAIL_FROM || 'GRATIS <noreply@gratis.ngo>',
            to: Array.isArray(to) ? to : [to],
            subject,
            html,
            replyTo: replyTo || 'support@gratis.ngo',
            attachments,
            tags: tags === null || tags === void 0 ? void 0 : tags.map(tag => ({ name: tag, value: 'true' })),
        });
        console.log('Email sent successfully:', (_a = result.data) === null || _a === void 0 ? void 0 : _a.id);
        return { success: true, id: (_b = result.data) === null || _b === void 0 ? void 0 : _b.id };
    }
    catch (error) {
        console.error('Email send error:', error);
        return { success: false, error: error.message };
    }
}
// Generate email HTML based on type
function generateEmailHTML(type, data) {
    // For now, return basic HTML templates
    // In production, use React Email components
    const baseStyles = `
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
      .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
      .header { padding: 32px 40px 16px; background-color: #000000; text-align: center; }
      .logo { margin: 0 auto; }
      .hero { padding: 40px; background-color: #C1FF00; text-align: center; }
      .content { padding: 40px; }
      .button { background-color: #C1FF00; border-radius: 8px; color: #000000; display: inline-block; font-size: 16px; font-weight: bold; padding: 14px 32px; text-decoration: none; margin: 16px 0; }
      .footer { padding: 32px 40px; background-color: #000000; text-align: center; color: #888888; font-size: 12px; }
    </style>
  `;
    switch (type) {
        case 'welcome':
            return `
        <!DOCTYPE html>
        <html>
          <head>${baseStyles}</head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="color: #C1FF00; margin: 0;">GRATIS</h2>
              </div>
              <div class="hero">
                <h1 style="color: #000000; margin: 0;">Welcome to GRATIS, ${data.firstName}! 🎉</h1>
              </div>
              <div class="content">
                <p>You've just joined a movement of changemakers who believe charity should be accessible, transparent, and yes—even a little bit cool.</p>
                <p>As an Explorer, you'll receive:</p>
                <ul>
                  <li>🎁 <strong>1 free premium water bottle</strong> every month</li>
                  <li>📊 <strong>Real-time impact tracking</strong> on your dashboard</li>
                  <li>📧 <strong>Weekly updates</strong> on where funds go</li>
                  <li>🌍 <strong>Community access</strong> with fellow changemakers</li>
                </ul>
                <a href="${data.dashboardUrl}" class="button">Go to Dashboard</a>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} GRATIS Foundation. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;
        case 'donation_thank_you':
            return `
        <!DOCTYPE html>
        <html>
          <head>${baseStyles}</head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="color: #C1FF00; margin: 0;">GRATIS</h2>
              </div>
              <div class="hero">
                <h1 style="color: #000000; margin: 0;">Thank you, ${data.firstName}! 💚</h1>
              </div>
              <div class="content">
                <p>Your generous donation of <strong>€${data.amount}</strong> has been received and is already making an impact.</p>
                <h3>Your Allocation:</h3>
                <ul>
                  <li>💧 Clean Water: ${data.allocation.water}%</li>
                  <li>🎨 Arts & Culture: ${data.allocation.arts}%</li>
                  <li>📚 Education: ${data.allocation.education}%</li>
                </ul>
                ${data.receiptUrl ? `<a href="${data.receiptUrl}" class="button">Download Receipt</a>` : ''}
                <a href="${data.impactUrl}" class="button">See Your Impact</a>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} GRATIS Foundation. Tax-deductible donation.</p>
              </div>
            </div>
          </body>
        </html>
      `;
        case 'order_confirmation':
            return `
        <!DOCTYPE html>
        <html>
          <head>${baseStyles}</head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="color: #C1FF00; margin: 0;">GRATIS</h2>
              </div>
              <div class="hero">
                <h1 style="color: #000000; margin: 0;">Order Confirmed! 📦</h1>
              </div>
              <div class="content">
                <p>Hi ${data.firstName},</p>
                <p>Your order <strong>#${data.orderId}</strong> has been confirmed and will be shipped soon.</p>
                <h3>Order Items:</h3>
                <ul>
                  ${data.items.map((item) => `<li>${item.name} x ${item.quantity}</li>`).join('')}
                </ul>
                ${data.trackingUrl ? `<a href="${data.trackingUrl}" class="button">Track Your Order</a>` : ''}
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} GRATIS Foundation. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;
        case 'membership_confirmation':
            return `
        <!DOCTYPE html>
        <html>
          <head>${baseStyles}</head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="color: #C1FF00; margin: 0;">GRATIS</h2>
              </div>
              <div class="hero">
                <h1 style="color: #000000; margin: 0;">Welcome to TRIBE ${data.tier}! 🌟</h1>
              </div>
              <div class="content">
                <p>Hi ${data.firstName},</p>
                <p>Your TRIBE ${data.tier} membership is now active!</p>
                <h3>Your Benefits:</h3>
                <ul>
                  ${data.benefits.map((benefit) => `<li>${benefit}</li>`).join('')}
                </ul>
                <a href="${data.dashboardUrl}" class="button">Access Dashboard</a>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} GRATIS Foundation. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;
        case 'event_registration':
            return `
        <!DOCTYPE html>
        <html>
          <head>${baseStyles}</head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="color: #C1FF00; margin: 0;">GRATIS</h2>
              </div>
              <div class="hero">
                <h1 style="color: #000000; margin: 0;">You're Registered! 📅</h1>
              </div>
              <div class="content">
                <p>Hi ${data.firstName},</p>
                <p>You're registered for <strong>${data.eventTitle}</strong></p>
                <p><strong>Date:</strong> ${new Date(data.eventDate).toLocaleDateString()}</p>
                ${data.location ? `<p><strong>Location:</strong> ${data.location}</p>` : ''}
                ${data.virtualUrl ? `<p><strong>Virtual Link:</strong> <a href="${data.virtualUrl}">${data.virtualUrl}</a></p>` : ''}
                ${data.ticketCode ? `<p><strong>Ticket Code:</strong> ${data.ticketCode}</p>` : ''}
                ${data.calendarUrl ? `<a href="${data.calendarUrl}" class="button">Add to Calendar</a>` : ''}
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} GRATIS Foundation. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;
        case 'password_reset':
            return `
        <!DOCTYPE html>
        <html>
          <head>${baseStyles}</head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="color: #C1FF00; margin: 0;">GRATIS</h2>
              </div>
              <div class="hero">
                <h1 style="color: #000000; margin: 0;">Reset Your Password</h1>
              </div>
              <div class="content">
                <p>You requested to reset your password. Click the button below to create a new password.</p>
                <a href="${data.resetUrl}" class="button">Reset Password</a>
                <p style="color: #888; font-size: 14px;">This link expires in ${data.expiresIn}. If you didn't request this, please ignore this email.</p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} GRATIS Foundation. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;
        case 'voting_reminder':
            return `
        <!DOCTYPE html>
        <html>
          <head>${baseStyles}</head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="color: #C1FF00; margin: 0;">GRATIS</h2>
              </div>
              <div class="hero">
                <h1 style="color: #000000; margin: 0;">Time to Vote! 🗳️</h1>
              </div>
              <div class="content">
                <p>Hi ${data.firstName},</p>
                <p>Don't forget to cast your vote for <strong>${data.quarterName}</strong> fund allocation!</p>
                <p>Voting ends: <strong>${new Date(data.endsAt).toLocaleDateString()}</strong></p>
                <a href="${data.voteUrl}" class="button">Vote Now</a>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} GRATIS Foundation. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;
        default:
            return '<p>Email content</p>';
    }
}
// Pre-built email senders
exports.emails = {
    sendWelcome: async (user) => {
        return sendEmail({
            to: user.email,
            subject: 'Welcome to GRATIS! 🎉',
            type: 'welcome',
            data: {
                firstName: user.firstName,
                dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://gratis.ngo'}/dashboard`,
            },
        });
    },
    sendMembershipConfirmation: async (user, tier, benefits) => {
        return sendEmail({
            to: user.email,
            subject: `Welcome to TRIBE ${tier}! 🌟`,
            type: 'membership_confirmation',
            data: {
                firstName: user.firstName,
                tier,
                benefits,
                dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://gratis.ngo'}/dashboard`,
            },
        });
    },
    sendDonationThankYou: async (donor, donation) => {
        return sendEmail({
            to: donor.email,
            subject: 'Thank you for your generous donation! 💚',
            type: 'donation_thank_you',
            data: {
                firstName: donor.firstName,
                amount: donation.amount,
                allocation: donation.allocation,
                receiptUrl: donation.receiptUrl,
                impactUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://gratis.ngo'}/impact`,
            },
        });
    },
    sendOrderConfirmation: async (customer, order) => {
        return sendEmail({
            to: customer.email,
            subject: `Order Confirmed: ${order.id}`,
            type: 'order_confirmation',
            data: {
                firstName: customer.firstName,
                orderId: order.id,
                items: order.items,
                trackingUrl: order.trackingUrl,
            },
        });
    },
    sendEventRegistration: async (attendee, event) => {
        return sendEmail({
            to: attendee.email,
            subject: `You're registered: ${event.title}`,
            type: 'event_registration',
            data: {
                firstName: attendee.firstName,
                eventTitle: event.title,
                eventDate: event.date,
                location: event.location,
                virtualUrl: event.virtualUrl,
                ticketCode: event.ticketCode,
                calendarUrl: event.calendarUrl,
            },
        });
    },
    sendPasswordReset: async (email, resetUrl) => {
        return sendEmail({
            to: email,
            subject: 'Reset Your Password',
            type: 'password_reset',
            data: {
                resetUrl,
                expiresIn: '1 hour',
            },
        });
    },
    sendVotingReminder: async (user, votingPeriod) => {
        return sendEmail({
            to: user.email,
            subject: `Don't forget to vote! ${votingPeriod.quarterName}`,
            type: 'voting_reminder',
            data: {
                firstName: user.firstName,
                quarterName: votingPeriod.quarterName,
                endsAt: votingPeriod.endsAt,
                voteUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://gratis.ngo'}/dashboard/voting`,
            },
        });
    },
};
//# sourceMappingURL=email-service.js.map