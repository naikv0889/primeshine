import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { customerId } = await req.json();
    if (!customerId) {
      return new Response(JSON.stringify({ error: "customerId required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");

    if (!anthropicKey) {
      return new Response(
        JSON.stringify({
          data: {
            text: "Hey! It's been a while since your last detail. Ready to book your next shine? Reply YES and I'll send you open slots this week.",
            model: "demo",
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use service role to bypass RLS — this is server-side, safe
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const [profileRes, bookingsRes, vehiclesRes] = await Promise.all([
      supabase.from("profiles").select("full_name, phone").eq("id", customerId).single(),
      supabase
        .from("bookings")
        .select("service_id, scheduled_date, status, total, notes")
        .eq("customer_id", customerId)
        .order("scheduled_date", { ascending: false })
        .limit(10),
      supabase.from("vehicles").select("make, model, year, color").eq("owner_id", customerId),
    ]);

    const profile = profileRes.data;
    const bookings = bookingsRes.data || [];
    const vehicles = vehiclesRes.data || [];

    if (!profile) {
      return new Response(JSON.stringify({ error: "Customer not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `You are a follow-up text message writer for PrimeShine Detail Co., a mobile auto detailing business in Forsyth County, GA. Write a short, friendly follow-up text (2-3 sentences max) to re-engage this customer. Be specific to their history. No emojis. No em dashes. Keep it under 160 characters if possible.

Customer: ${profile.full_name}
Vehicles: ${vehicles.map((v: any) => `${v.year} ${v.make} ${v.model} (${v.color})`).join(", ") || "Unknown"}
Job history (most recent first):
${bookings.length ? bookings.map((b: any) => `- ${b.scheduled_date}: ${b.service_id} ($${b.total}) [${b.status}]${b.notes ? " Note: " + b.notes : ""}`).join("\n") : "No previous jobs"}
Last visit: ${bookings[0]?.scheduled_date || "Never"}

Write ONLY the text message. No quotes, no labels, no explanation.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 200,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const result = await response.json();
    const text = result.content?.[0]?.text || "";

    // Save follow-up to most recent booking
    if (bookings[0]) {
      await supabase
        .from("bookings")
        .update({
          ai_followup_text: text,
          ai_followup_sent_at: new Date().toISOString(),
        })
        .eq("customer_id", customerId)
        .order("scheduled_date", { ascending: false })
        .limit(1);
    }

    return new Response(
      JSON.stringify({ data: { text, model: "claude-haiku-4-5" } }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
