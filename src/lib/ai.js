import { supabase } from './supabase';

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

/**
 * Generate a follow-up text for a customer based on their job history.
 * Grounded: the model only sees THIS customer's data via RLS.
 */
export const generateFollowUp = async (customerId) => {
  if (!supabase || !ANTHROPIC_API_KEY) {
    return {
      data: {
        text: "Hey! It's been a while since your last detail. Ready to book your next shine? Reply YES and I'll send you open slots this week.",
        model: 'demo',
      },
      error: null,
    };
  }

  // Fetch customer profile + job history (RLS-scoped)
  const [profileRes, bookingsRes, vehiclesRes] = await Promise.all([
    supabase.from('profiles').select('full_name, phone').eq('id', customerId).single(),
    supabase.from('bookings').select('service_id, scheduled_date, status, total, notes').eq('customer_id', customerId).order('scheduled_date', { ascending: false }).limit(10),
    supabase.from('vehicles').select('make, model, year, color').eq('owner_id', customerId),
  ]);

  const profile = profileRes.data;
  const bookings = bookingsRes.data || [];
  const vehicles = vehiclesRes.data || [];

  if (!profile) {
    return { data: null, error: { message: 'Customer not found' } };
  }

  const prompt = `You are a follow-up text message writer for PrimeShine Detail Co., a mobile auto detailing business in Forsyth County, GA. Write a short, friendly follow-up text (2-3 sentences max) to re-engage this customer. Be specific to their history. No emojis. No em dashes. Keep it under 160 characters if possible.

Customer: ${profile.full_name}
Vehicles: ${vehicles.map(v => `${v.year} ${v.make} ${v.model} (${v.color})`).join(', ') || 'Unknown'}
Job history (most recent first):
${bookings.length ? bookings.map(b => `- ${b.scheduled_date}: ${b.service_id} ($${b.total}) [${b.status}]${b.notes ? ' Note: ' + b.notes : ''}`).join('\n') : 'No previous jobs'}
Last visit: ${bookings[0]?.scheduled_date || 'Never'}

Write ONLY the text message. No quotes, no labels, no explanation.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const result = await response.json();
    const text = result.content?.[0]?.text || '';

    // Save the follow-up to the most recent booking
    if (bookings[0]) {
      await supabase.from('bookings').update({
        ai_followup_text: text,
        ai_followup_sent_at: new Date().toISOString(),
      }).eq('customer_id', customerId).order('scheduled_date', { ascending: false }).limit(1);
    }

    return { data: { text, model: 'claude-haiku-4-5' }, error: null };
  } catch (err) {
    return { data: null, error: { message: err.message } };
  }
};
