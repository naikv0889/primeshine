import { loadStripe } from '@stripe/stripe-js';

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

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
