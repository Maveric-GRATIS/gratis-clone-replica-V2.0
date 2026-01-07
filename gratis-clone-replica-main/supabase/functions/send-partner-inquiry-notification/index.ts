import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { z } from "npm:zod@3.22.4";

// Rate limiting using in-memory store (resets on function cold start)
const requestLog = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // requests per window
const RATE_WINDOW = 60000; // 1 minute in milliseconds

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLog = requestLog.get(ip);

  if (!userLog || now > userLog.resetTime) {
    requestLog.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (userLog.count >= RATE_LIMIT) {
    return false;
  }

  userLog.count++;
  return true;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const partnerInquirySchema = z.object({
  company_name: z.string().min(2, "Company name too short").max(200, "Company name too long"),
  contact_person: z.string().min(2, "Contact person name too short").max(100, "Contact person name too long"),
  email: z.string().email("Invalid email address").max(255, "Email too long"),
  phone: z.string().min(7, "Phone too short").max(20, "Phone too long").optional(),
  website: z.string().url("Invalid website URL").max(500, "Website URL too long").optional(),
  industry: z.string().max(100, "Industry name too long").optional(),
  estimated_volume: z.string().max(100, "Volume estimate too long").optional(),
  campaign_goals: z.string().max(2000, "Campaign goals too long").optional(),
  preferred_start_date: z.string().max(50, "Date too long").optional(),
  additional_notes: z.string().max(2000, "Additional notes too long").optional(),
});

// HTML escape function to prevent XSS
const escapeHtml = (str: string) => 
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting based on IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
               req.headers.get('x-real-ip') || 
               'unknown';
    
    if (!checkRateLimit(ip)) {
      console.log("Rate limit exceeded for IP:", ip);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Parse and validate request body
    const rawBody = await req.json();
    const inquiry = partnerInquirySchema.parse(rawBody);
    console.log("Processing partner inquiry:", inquiry.company_name);

    // Send notification to admin
    const adminEmail = await resend.emails.send({
      from: "GRATIS Partnerships <onboarding@resend.dev>",
      to: ["partners@gratis.com"], // Replace with actual admin email
      subject: `New Partnership Inquiry: ${escapeHtml(inquiry.company_name)}`,
      html: `
        <h2>New Advertising Partnership Inquiry</h2>
        
        <h3>Company Information</h3>
        <p><strong>Company Name:</strong> ${escapeHtml(inquiry.company_name)}</p>
        <p><strong>Contact Person:</strong> ${escapeHtml(inquiry.contact_person)}</p>
        <p><strong>Email:</strong> ${escapeHtml(inquiry.email)}</p>
        ${inquiry.phone ? `<p><strong>Phone:</strong> ${escapeHtml(inquiry.phone)}</p>` : ""}
        ${inquiry.website ? `<p><strong>Website:</strong> ${escapeHtml(inquiry.website)}</p>` : ""}
        
        <h3>Campaign Details</h3>
        ${inquiry.industry ? `<p><strong>Industry:</strong> ${escapeHtml(inquiry.industry)}</p>` : ""}
        ${inquiry.estimated_volume ? `<p><strong>Estimated Volume:</strong> ${escapeHtml(inquiry.estimated_volume)}</p>` : ""}
        ${inquiry.preferred_start_date ? `<p><strong>Preferred Start Date:</strong> ${escapeHtml(inquiry.preferred_start_date)}</p>` : ""}
        
        ${inquiry.campaign_goals ? `
          <h3>Campaign Goals</h3>
          <p>${escapeHtml(inquiry.campaign_goals)}</p>
        ` : ""}
        
        ${inquiry.additional_notes ? `
          <h3>Additional Notes</h3>
          <p>${escapeHtml(inquiry.additional_notes)}</p>
        ` : ""}
        
        <hr/>
        <p><em>This inquiry was submitted via the GRATIS website advertising partnership form.</em></p>
      `,
    });

    // Send confirmation to applicant
    const confirmationEmail = await resend.emails.send({
      from: "GRATIS Partnerships <onboarding@resend.dev>",
      to: [inquiry.email],
      subject: "Thank you for your partnership interest - GRATIS",
      html: `
        <h2>Thank you for your interest, ${escapeHtml(inquiry.contact_person)}!</h2>
        
        <p>We've received your advertising partnership inquiry for <strong>${escapeHtml(inquiry.company_name)}</strong>.</p>
        
        <p>Our partnerships team will review your application and get back to you within 48 hours to discuss opportunities for collaboration.</p>
        
        <p>In the meantime, feel free to explore our brand values and impact initiatives at <a href="https://gratis.com/tribe">gratis.com/tribe</a>.</p>
        
        <p>Best regards,<br/>
        The GRATIS Partnerships Team</p>
        
        <hr/>
        <p style="font-size: 12px; color: #666;">
          If you have any immediate questions, please reply to this email or contact us at partners@gratis.com
        </p>
      `,
    });

    console.log("Emails sent successfully:", { adminEmail, confirmationEmail });

    return new Response(
      JSON.stringify({ success: true, adminEmail, confirmationEmail }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      console.error("Validation error:", error.errors);
      return new Response(
        JSON.stringify({ 
          error: "Invalid input data",
          details: errorMessage
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.error("Error in send-partner-inquiry-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
