import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { Resend } from "npm:resend@2.0.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2025-08-27.basil",
});

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Webhook request received");

    // Get the signature from headers
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      logStep("ERROR: Missing stripe-signature header");
      return new Response(JSON.stringify({ error: "Missing signature" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Get the raw body
    const body = await req.text();
    
    // Verify webhook signature
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      logStep("ERROR: STRIPE_WEBHOOK_SECRET not configured");
      return new Response(JSON.stringify({ error: "Webhook secret not configured" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      logStep("Webhook signature verified", { type: event.type });
    } catch (err) {
      logStep("ERROR: Webhook signature verification failed", { error: err.message });
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Handle payment_intent.succeeded event
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      logStep("Payment intent succeeded", { 
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency
      });

      // Find the order by payment intent ID
      const { data: order, error: orderError } = await supabaseClient
        .from('orders')
        .select(`
          *,
          order_items(*),
          shipping_addresses(*)
        `)
        .eq('payment_intent_id', paymentIntent.id)
        .single();

      if (orderError || !order) {
        logStep("ERROR: Order not found", { paymentIntentId: paymentIntent.id, error: orderError });
        // Still return 200 to acknowledge webhook receipt
        return new Response(JSON.stringify({ received: true, warning: "Order not found" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      logStep("Order found", { orderId: order.id, orderNumber: order.order_number });

      // Update order status to processing and payment_status to paid
      const { error: updateError } = await supabaseClient
        .from('orders')
        .update({ 
          status: 'processing',
          payment_status: 'paid'
        })
        .eq('id', order.id);

      if (updateError) {
        logStep("ERROR: Failed to update order", { error: updateError });
        throw new Error(`Failed to update order: ${updateError.message}`);
      }
      logStep("Order status updated to processing/paid");

      // Get user email
      const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserById(order.user_id);
      if (userError || !userData.user?.email) {
        logStep("WARNING: Could not retrieve user email", { error: userError });
        // Still return success as order was updated
        return new Response(JSON.stringify({ received: true, warning: "Could not send email" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
      const userEmail = userData.user.email;
      logStep("User email retrieved", { email: userEmail });

      // HTML escape function to prevent XSS
      const escapeHtml = (str: string) => 
        String(str)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');

      // Format order items for email with HTML escaping
      const itemsList = order.order_items.map((item: any) => 
        `<li>${escapeHtml(item.product_name)} x ${item.quantity} - €${item.total_price.toFixed(2)}</li>`
      ).join('');

      const shippingAddress = order.shipping_addresses[0];
      const addressHtml = `
        ${escapeHtml(shippingAddress.full_name)}<br/>
        ${escapeHtml(shippingAddress.address_line1)}<br/>
        ${shippingAddress.address_line2 ? `${escapeHtml(shippingAddress.address_line2)}<br/>` : ''}
        ${escapeHtml(shippingAddress.city)}, ${escapeHtml(shippingAddress.state_province)} ${escapeHtml(shippingAddress.postal_code)}<br/>
        ${escapeHtml(shippingAddress.country)}
      `;

      const emailHtml = `
        <h1>Order Confirmation - ${order.order_number}</h1>
        <p>Thank you for your order!</p>
        
        <h2>Order Details</h2>
        <ul>${itemsList}</ul>
        
        <h2>Shipping Address</h2>
        <p>${addressHtml}</p>
        
        <h2>Order Summary</h2>
        <table>
          <tr><td>Subtotal:</td><td>€${order.subtotal.toFixed(2)}</td></tr>
          <tr><td>Shipping:</td><td>€${order.shipping_cost.toFixed(2)}</td></tr>
          <tr><td>VAT:</td><td>€${order.tax_amount.toFixed(2)}</td></tr>
          <tr><td><strong>Total:</strong></td><td><strong>€${order.total.toFixed(2)}</strong></td></tr>
        </table>
        
        <p>We'll send you another email when your order ships.</p>
        <p>Thank you for shopping with us!</p>
      `;

      // Send confirmation email
      try {
        const emailResponse = await resend.emails.send({
          from: "Orders <onboarding@resend.dev>",
          to: [userEmail],
          subject: `Order Confirmation - ${order.order_number}`,
          html: emailHtml,
        });
        logStep("Email sent successfully", { messageId: emailResponse.id });
      } catch (emailError) {
        logStep("WARNING: Failed to send email", { error: emailError });
        // Still return success as order was updated
      }
    } else {
      logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
