import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { z } from "npm:zod@3.22.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-PAYMENT-INTENT] ${step}${detailsStr}`);
};

// Input validation schema
const paymentRequestSchema = z.object({
  amount: z.number()
    .positive("Amount must be positive")
    .max(1000000, "Amount exceeds maximum limit")
    .refine(val => Number.isFinite(val), "Amount must be a finite number"),
  orderId: z.string().uuid("Invalid order ID"),
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Parse and validate request body
    const rawBody = await req.json();
    const { amount, orderId } = paymentRequestSchema.parse(rawBody);
    logStep("Request data validated", { amount, orderId });

    // Verify order exists and belongs to user
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select('id, user_id, total, payment_status')
      .eq('id', orderId)
      .single();

    if (orderError) throw new Error(`Order not found: ${orderError.message}`);
    if (order.user_id !== user.id) throw new Error("Unauthorized: Order does not belong to user");
    if (order.payment_status === 'paid') throw new Error("Order already paid");
    
    // Verify amount matches order total
    if (Math.abs(amount - Number(order.total)) > 0.01) {
      throw new Error("Payment amount does not match order total");
    }
    logStep("Order verified", { orderId: order.id });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id }
      });
      customerId = customer.id;
      logStep("Created new customer", { customerId });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "eur",
      customer: customerId,
      metadata: {
        order_id: orderId,
        user_id: user.id
      }
    });
    logStep("Payment intent created", { paymentIntentId: paymentIntent.id });

    // Update order with payment intent ID for webhook matching
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({ payment_intent_id: paymentIntent.id })
      .eq('id', orderId);

    if (updateError) {
      logStep("ERROR: Failed to update order with payment_intent_id", { error: updateError });
      throw new Error(`Failed to update order: ${updateError.message}`);
    }
    logStep("Order updated with payment_intent_id");

    return new Response(JSON.stringify({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      logStep("Validation error", { errors: error.errors });
      return new Response(JSON.stringify({ 
        error: "Invalid input data",
        details: errorMessage
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
