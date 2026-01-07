import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { z } from "npm:zod@3.22.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-ORDER] ${step}${detailsStr}`);
};

// Input validation schemas
const shippingSchema = z.object({
  fullName: z.string().min(2, "Name too short").max(100, "Name too long"),
  addressLine1: z.string().min(5, "Address too short").max(200, "Address too long"),
  addressLine2: z.string().max(200, "Address too long").optional(),
  city: z.string().min(2, "City too short").max(100, "City too long"),
  stateProvince: z.string().min(2, "State too short").max(100, "State too long"),
  postalCode: z.string().min(3, "Postal code too short").max(20, "Postal code too long"),
  country: z.string().length(2, "Country code must be 2 characters"),
  phone: z.string().min(7, "Phone too short").max(20, "Phone too long"),
});

const orderItemSchema = z.object({
  id: z.string().uuid("Invalid product ID"),
  name: z.string().min(1).max(200),
  price: z.number().positive("Price must be positive").max(100000, "Price too high"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(100, "Quantity too high"),
  image: z.string().max(500).optional(),
  variant: z.object({
    size: z.string().max(50).optional(),
    color: z.string().max(50).optional(),
    material: z.string().max(50).optional(),
  }).optional(),
});

const shippingOptionSchema = z.object({
  id: z.string().uuid("Invalid shipping option ID"),
  name: z.string().min(1).max(100),
  price: z.number().min(0).max(10000, "Shipping cost too high"),
});

const orderRequestSchema = z.object({
  items: z.array(orderItemSchema).min(1, "Order must have at least one item").max(50, "Too many items"),
  shippingData: shippingSchema,
  shippingOption: shippingOptionSchema,
});

// EU VAT rates by country code
const VAT_RATES: { [key: string]: number } = {
  'AT': 0.20, 'BE': 0.21, 'BG': 0.20, 'HR': 0.25, 'CY': 0.19,
  'CZ': 0.21, 'DK': 0.25, 'EE': 0.22, 'FI': 0.24, 'FR': 0.20,
  'DE': 0.19, 'GR': 0.24, 'HU': 0.27, 'IE': 0.23, 'IT': 0.22,
  'LV': 0.21, 'LT': 0.21, 'LU': 0.17, 'MT': 0.18, 'NL': 0.21,
  'PL': 0.23, 'PT': 0.23, 'RO': 0.19, 'SK': 0.20, 'SI': 0.22,
  'ES': 0.21, 'SE': 0.25,
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
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    // Parse and validate request body
    const rawBody = await req.json();
    const validatedData = orderRequestSchema.parse(rawBody);
    const { items, shippingData, shippingOption } = validatedData;
    logStep("Request data validated", { itemCount: items.length });

    // Verify product prices and stock from database
    const productIds = items.map(item => item.id);
    const { data: products, error: productsError } = await supabaseClient
      .from('products')
      .select('id, price, stock_quantity, reserved_quantity, name')
      .in('id', productIds);

    if (productsError) throw new Error(`Error fetching products: ${productsError.message}`);
    if (!products || products.length !== items.length) {
      throw new Error("Some products not found");
    }
    logStep("Products validated", { count: products.length });

    // Verify stock availability and prices
    let subtotal = 0;
    for (const item of items) {
      const product = products.find(p => p.id === item.id);
      if (!product) throw new Error(`Product ${item.id} not found`);
      
      const availableStock = product.stock_quantity - (product.reserved_quantity || 0);
      if (availableStock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}. Available: ${availableStock}`);
      }

      // Use database price, not client-provided price
      subtotal += product.price * item.quantity;
    }
    logStep("Stock verified, subtotal calculated", { subtotal });

    // Calculate VAT based on shipping country
    const vatRate = VAT_RATES[shippingData.country] || 0;
    const shippingCost = shippingOption.price;
    const subtotalWithShipping = subtotal + shippingCost;
    const taxAmount = subtotalWithShipping * vatRate;
    const total = subtotalWithShipping + taxAmount;
    logStep("VAT calculated", { vatRate, taxAmount, total });

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();

    // Create order in transaction
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        status: 'pending',
        payment_status: 'pending',
        subtotal: subtotal,
        shipping_cost: shippingCost,
        tax_amount: taxAmount,
        total: total,
        currency: 'EUR',
      })
      .select()
      .single();

    if (orderError) throw new Error(`Error creating order: ${orderError.message}`);
    logStep("Order created", { orderId: order.id, orderNumber });

    // Create order items
    const orderItems = items.map(item => {
      const product = products.find(p => p.id === item.id);
      return {
        order_id: order.id,
        product_id: item.id,
        product_name: product?.name || item.name,
        product_image: item.image,
        variant_details: item.variant,
        quantity: item.quantity,
        unit_price: product?.price || item.price,
        total_price: (product?.price || item.price) * item.quantity,
      };
    });

    const { error: itemsError } = await supabaseClient
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw new Error(`Error creating order items: ${itemsError.message}`);
    logStep("Order items created", { count: orderItems.length });

    // Create shipping address
    const { error: addressError } = await supabaseClient
      .from('shipping_addresses')
      .insert({
        order_id: order.id,
        full_name: shippingData.fullName,
        address_line1: shippingData.addressLine1,
        address_line2: shippingData.addressLine2 || null,
        city: shippingData.city,
        state_province: shippingData.stateProvince,
        postal_code: shippingData.postalCode,
        country: shippingData.country,
        phone: shippingData.phone,
      });

    if (addressError) throw new Error(`Error creating shipping address: ${addressError.message}`);
    logStep("Shipping address created");

    // Reserve stock - proper atomic increment
    for (const item of items) {
      const { data: product, error: fetchError } = await supabaseClient
        .from('products')
        .select('reserved_quantity')
        .eq('id', item.id)
        .single();

      if (!fetchError && product) {
        const { error: reserveError } = await supabaseClient
          .from('products')
          .update({ 
            reserved_quantity: (product.reserved_quantity || 0) + item.quantity 
          })
          .eq('id', item.id);

        if (reserveError) {
          logStep("Warning: Could not reserve stock", { productId: item.id, error: reserveError.message });
        }
      }
    }
    logStep("Stock reserved");

    return new Response(JSON.stringify({ 
      success: true,
      order: {
        id: order.id,
        order_number: orderNumber,
        total: total,
        tax_amount: taxAmount
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      logStep("Validation error", { errors: error.errors });
      return new Response(JSON.stringify({ 
        success: false,
        error: "Invalid input data",
        details: errorMessage
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
