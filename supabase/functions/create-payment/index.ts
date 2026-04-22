import { corsHeaders } from "../_shared/cors.ts";

const PRICES: Record<string, number> = {
  express: 5900,
  signature: 15900,
  premier: 48900,
};

const ADDON_PRICES: Record<string, number> = {
  "interior-deep": 4900,
  "engine-bay": 3900,
  "headlight": 5900,
  "clay-bar": 2900,
  "tire-shine": 1900,
  "pet-hair": 3900,
  "odor": 4900,
};

const VEHICLE_MULTIPLIERS: Record<string, number> = {
  sedan: 1.0,
  suv: 1.15,
  truck: 1.2,
  van: 1.25,
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      return new Response(
        JSON.stringify({ error: "Stripe not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { serviceId, addons = [], vehicleType = "sedan" } = await req.json();

    if (!serviceId || !PRICES[serviceId]) {
      return new Response(
        JSON.stringify({ error: "Invalid service" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate price server-side — never trust the client
    const basePrice = PRICES[serviceId];
    const multiplier = VEHICLE_MULTIPLIERS[vehicleType] || 1.0;
    const addonTotal = addons.reduce((sum: number, id: string) => sum + (ADDON_PRICES[id] || 0), 0);
    const subtotal = Math.round(basePrice * multiplier) + addonTotal;
    const tax = Math.round(subtotal * 0.07); // 7% GA sales tax
    const total = subtotal + tax;

    // Create PaymentIntent via Stripe API
    const params = new URLSearchParams();
    params.append("amount", String(total));
    params.append("currency", "usd");
    params.append("automatic_payment_methods[enabled]", "true");
    params.append("metadata[service]", serviceId);
    params.append("metadata[vehicle_type]", vehicleType);
    params.append("metadata[addons]", addons.join(","));

    const stripeRes = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const paymentIntent = await stripeRes.json();

    if (paymentIntent.error) {
      return new Response(
        JSON.stringify({ error: paymentIntent.error.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        subtotal,
        tax,
        total,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
