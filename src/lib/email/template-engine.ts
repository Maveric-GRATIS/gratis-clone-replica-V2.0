// ============================================================================
// GRATIS.NGO — Email Template Compilation & Rendering Engine
// ============================================================================

import { db } from '@/firebase';
import { doc, setDoc, getDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { EmailTemplate, EmailBranding, CompiledEmail, TemplateVariable } from '@/types/email-templates';

const TEMPLATES_COL = 'email_templates';
const BRANDING_COL = 'email_branding';

// ── Template CRUD ────────────────────────────────────────────────────────────

export async function createTemplate(params: Omit<EmailTemplate, 'id' | 'stats' | 'createdAt' | 'updatedAt'>): Promise<EmailTemplate> {
  const id = `tpl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const template: EmailTemplate = {
    ...params,
    id,
    stats: { sent: 0, opened: 0, clicked: 0, bounced: 0, unsubscribed: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await setDoc(doc(db, TEMPLATES_COL, id), template);
  return template;
}

export async function getTemplate(slug: string, tenantId?: string): Promise<EmailTemplate | null> {
  // Try tenant-specific first
  if (tenantId) {
    const tq = query(collection(db, TEMPLATES_COL), where('slug', '==', slug), where('tenantId', '==', tenantId), where('active', '==', true));
    const tsnap = await getDocs(tq);
    if (!tsnap.empty) return tsnap.docs[0].data() as EmailTemplate;
  }

  // Fall back to default
  const q = query(collection(db, TEMPLATES_COL), where('slug', '==', slug), where('isDefault', '==', true), where('active', '==', true));
  const snap = await getDocs(q);
  return snap.empty ? null : (snap.docs[0].data() as EmailTemplate);
}

export async function listTemplates(tenantId?: string): Promise<EmailTemplate[]> {
  let q = query(collection(db, TEMPLATES_COL));
  if (tenantId) q = query(q, where('tenantId', '==', tenantId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as EmailTemplate).sort((a, b) => a.name.localeCompare(b.name));
}

export async function updateTemplate(id: string, updates: Partial<EmailTemplate>): Promise<void> {
  await updateDoc(doc(db, TEMPLATES_COL, id), { ...updates, updatedAt: new Date().toISOString() });
}

// ── Branding ─────────────────────────────────────────────────────────────────

export async function getBranding(tenantId?: string): Promise<EmailBranding> {
  const id = tenantId || 'default';
  const snap = await getDoc(doc(db, BRANDING_COL, id));
  if (snap.exists()) return snap.data() as EmailBranding;

  // Default branding
  return {
    logoUrl: 'https://gratis.ngo/logo.png',
    primaryColor: '#10b981',
    secondaryColor: '#064e3b',
    fontFamily: "'Inter', Arial, sans-serif",
    headerBackground: '#0f172a',
    footerText: '© 2026 GRATIS.NGO — Making generosity borderless',
    socialLinks: [
      { platform: 'twitter', url: 'https://x.com/gratisngo' },
      { platform: 'linkedin', url: 'https://linkedin.com/company/gratis-ngo' },
      { platform: 'instagram', url: 'https://instagram.com/gratis.ngo' },
    ],
    unsubscribeUrl: 'https://gratis.ngo/unsubscribe',
    privacyUrl: 'https://gratis.ngo/privacy',
    address: 'GRATIS Foundation • Amsterdam, Netherlands',
  };
}

export async function saveBranding(branding: EmailBranding, tenantId?: string): Promise<void> {
  const id = tenantId || 'default';
  await setDoc(doc(db, BRANDING_COL, id), branding);
}

// ── Template Compilation ─────────────────────────────────────────────────────

export function compileTemplate(
  template: EmailTemplate,
  variables: Record<string, string>,
  branding: EmailBranding
): CompiledEmail {
  let html = template.htmlBody;
  let text = template.textBody;
  let subject = template.subject;

  // Replace template variables {{variable_name}}
  const allVars = {
    ...Object.fromEntries(template.variables.map((v) => [v.name, v.defaultValue])),
    ...variables,
    // System variables
    logo_url: branding.logoUrl,
    primary_color: branding.primaryColor,
    secondary_color: branding.secondaryColor,
    font_family: branding.fontFamily,
    footer_text: branding.footerText,
    unsubscribe_url: branding.unsubscribeUrl,
    privacy_url: branding.privacyUrl,
    address: branding.address,
    current_year: String(new Date().getFullYear()),
  };

  for (const [key, value] of Object.entries(allVars)) {
    const pattern = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
    html = html.replace(pattern, value || '');
    text = text.replace(pattern, value || '');
    subject = subject.replace(pattern, value || '');
  }

  // Wrap in master layout if not already wrapped
  if (!html.includes('<!DOCTYPE')) {
    html = wrapInMasterLayout(html, branding);
  }

  return {
    to: variables.recipient_email || '',
    from: `GRATIS.NGO <noreply@gratis.ngo>`,
    replyTo: variables.reply_to || 'hello@gratis.ngo',
    subject,
    html,
    text,
  };
}

// ── Master Email Layout ──────────────────────────────────────────────────────

function wrapInMasterLayout(bodyHtml: string, branding: EmailBranding): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: ${branding.fontFamily}; background-color: #f4f4f5; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background-color: ${branding.headerBackground}; padding: 24px; text-align: center; }
    .header img { max-height: 40px; }
    .body { padding: 32px 24px; color: #1f2937; line-height: 1.6; }
    .footer { background-color: #f9fafb; padding: 24px; text-align: center; font-size: 12px; color: #6b7280; }
    .btn { display: inline-block; padding: 12px 32px; background-color: ${branding.primaryColor}; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; }
    .social-links { margin-top: 16px; }
    .social-links a { display: inline-block; margin: 0 8px; color: #6b7280; text-decoration: none; }
    a { color: ${branding.primaryColor}; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${branding.logoUrl}" alt="GRATIS.NGO" />
    </div>
    <div class="body">
      ${bodyHtml}
    </div>
    <div class="footer">
      <p>${branding.footerText}</p>
      <div class="social-links">
        ${branding.socialLinks.map((s) => `<a href="${s.url}">${s.platform}</a>`).join(' • ')}
      </div>
      <p style="margin-top: 12px; font-size: 11px;">
        <a href="${branding.unsubscribeUrl}">Unsubscribe</a> •
        <a href="${branding.privacyUrl}">Privacy Policy</a>
      </p>
      <p style="font-size: 11px;">${branding.address}</p>
    </div>
  </div>
</body>
</html>`;
}

// ── Quick Send ───────────────────────────────────────────────────────────────

export async function sendTemplatedEmail(
  slug: string,
  variables: Record<string, string>,
  tenantId?: string
): Promise<CompiledEmail> {
  const template = await getTemplate(slug, tenantId);
  if (!template) throw new Error(`Template "${slug}" not found`);

  const branding = await getBranding(tenantId);
  const compiled = compileTemplate(template, variables, branding);

  // Update stats
  await updateDoc(doc(db, TEMPLATES_COL, template.id), {
    'stats.sent': (template.stats.sent || 0) + 1,
  });

  // In production, send via Resend/SendGrid/SES here
  console.log(`[Email] Sending "${compiled.subject}" to ${compiled.to}`);

  return compiled;
}
