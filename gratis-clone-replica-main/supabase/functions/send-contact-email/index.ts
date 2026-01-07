import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// HTML escape function to prevent XSS
const escapeHtml = (str: string): string =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message }: ContactEmailRequest = await req.json();

    // Validate input
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Sanitize inputs (basic length limits)
    const sanitizedName = escapeHtml(name.slice(0, 100));
    const sanitizedSubject = escapeHtml(subject.slice(0, 200));
    const sanitizedMessage = escapeHtml(message.slice(0, 5000));
    const sanitizedEmail = escapeHtml(email);

    console.log(`Processing contact form from ${email} - Subject: ${subject.slice(0, 200)}`);

    // Send notification to support team
    const supportEmailResponse = await resend.emails.send({
      from: "GRATIS Contact <onboarding@resend.dev>",
      to: ["hello@gratis.com"],
      replyTo: email,
      subject: `Contact Form: ${sanitizedSubject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${sanitizedName} (${sanitizedEmail})</p>
        <p><strong>Subject:</strong> ${sanitizedSubject}</p>
        <hr />
        <h3>Message:</h3>
        <p>${sanitizedMessage.replace(/\n/g, '<br>')}</p>
        <hr />
        <p style="color: #666; font-size: 12px;">
          This message was sent via the GRATIS website contact form.
        </p>
      `,
    });

    console.log("Support email sent:", supportEmailResponse);

    // Send confirmation to the user
    const userEmailResponse = await resend.emails.send({
      from: "GRATIS <onboarding@resend.dev>",
      to: [email],
      subject: "We received your message - GRATIS",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Thank you for contacting us, ${sanitizedName}!</h1>
          <p>We have received your message regarding:</p>
          <blockquote style="border-left: 3px solid #ccc; padding-left: 15px; margin: 20px 0; color: #555;">
            ${sanitizedSubject}
          </blockquote>
          <p>Our team will review your message and get back to you within 24-48 hours.</p>
          <hr style="margin: 30px 0;" />
          <p style="color: #666; font-size: 14px;">
            Best regards,<br>
            <strong>The GRATIS Team</strong>
          </p>
          <p style="color: #999; font-size: 12px;">
            G.R.A.T.I.S. - Empower Change with Every Pack
          </p>
        </div>
      `,
    });

    console.log("User confirmation email sent:", userEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Emails sent successfully" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send email" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
