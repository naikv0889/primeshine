import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

let stripePromise = null;

export const getStripe = () => {
  if (!stripeKey) {
    console.warn('Stripe key missing — running in demo mode. Set VITE_STRIPE_PUBLISHABLE_KEY in .env');
    return null;
  }
  if (!stripePromise) {
    stripePromise = loadStripe(stripeKey);
  }
  return stripePromise;
};

/**
 * Create a PaymentIntent via Supabase Edge Function.
 * Price is calculated server-side — never trust the client.
 */
export const createPaymentIntent = async ({ serviceId, addons = [], vehicleType = 'sedan' }) => {
  if (!supabase || !SUPABASE_URL) {
    return { data: null, error: { message: 'Demo mode — no real payments' } };
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token || ''}`,
      },
      body: JSON.stringify({ serviceId, addons, vehicleType }),
    });

    const result = await response.json();
    if (result.error) return { data: null, error: { message: result.error } };
    return { data: result, error: null };
  } catch (err) {
    return { data: null, error: { message: err.message } };
  }
};
