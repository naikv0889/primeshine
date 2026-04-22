import { supabase } from './supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

/**
 * Generate a follow-up text for a customer based on their job history.
 * Calls Supabase Edge Function — API key stays server-side.
 */
export const generateFollowUp = async (customerId) => {
  if (!supabase || !SUPABASE_URL) {
    return {
      data: {
        text: "Hey! It's been a while since your last detail. Ready to book your next shine? Reply YES and I'll send you open slots this week.",
        model: 'demo',
      },
      error: null,
    };
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-followup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token || ''}`,
      },
      body: JSON.stringify({ customerId }),
    });

    const result = await response.json();
    if (result.error) return { data: null, error: { message: result.error } };
    return { data: result.data, error: null };
  } catch (err) {
    return { data: null, error: { message: err.message } };
  }
};
