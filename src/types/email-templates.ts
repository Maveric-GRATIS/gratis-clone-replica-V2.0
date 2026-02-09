// ============================================================================
// GRATIS.NGO — Email Template Type Definitions
// ============================================================================

export type EmailTemplateCategory =
  | 'transactional'
  | 'marketing'
  | 'notification'
  | 'onboarding'
  | 'donation'
  | 'event'
  | 'partner';

export interface EmailTemplate {
  id: string;
  name: string;
  slug: string;
  category: EmailTemplateCategory;
  subject: string;
  preheader?: string;
  htmlBody: string;
  textBody: string;
  variables: TemplateVariable[];
  tenantId?: string;          // For white-label
  isDefault: boolean;
  active: boolean;
  version: number;
  stats: TemplateStats;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateVariable {
  name: string;                // e.g. {{donor_name}}
  label: string;
  defaultValue: string;
  required: boolean;
  type: 'text' | 'number' | 'date' | 'url' | 'html';
}

export interface TemplateStats {
  sent: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
}

export interface EmailBranding {
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  headerBackground: string;
  footerText: string;
  socialLinks: { platform: string; url: string }[];
  unsubscribeUrl: string;
  privacyUrl: string;
  address: string;
}

export interface CompiledEmail {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
  headers?: Record<string, string>;
}

// Default template slugs
export const DEFAULT_TEMPLATES: { slug: string; name: string; category: EmailTemplateCategory }[] = [
  { slug: 'welcome', name: 'Welcome Email', category: 'onboarding' },
  { slug: 'email-verification', name: 'Email Verification', category: 'transactional' },
  { slug: 'password-reset', name: 'Password Reset', category: 'transactional' },
  { slug: 'donation-receipt', name: 'Donation Receipt', category: 'donation' },
  { slug: 'donation-thank-you', name: 'Donation Thank You', category: 'donation' },
  { slug: 'recurring-donation-reminder', name: 'Recurring Donation Reminder', category: 'donation' },
  { slug: 'event-registration', name: 'Event Registration Confirmation', category: 'event' },
  { slug: 'event-reminder', name: 'Event Reminder', category: 'event' },
  { slug: 'partner-application-received', name: 'Partner Application Received', category: 'partner' },
  { slug: 'partner-approved', name: 'Partner Approved', category: 'partner' },
  { slug: 'newsletter', name: 'Newsletter', category: 'marketing' },
  { slug: 'impact-report', name: 'Impact Report', category: 'marketing' },
];
