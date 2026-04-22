import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createPaymentIntent } from '../lib/stripe';
import Button from './Button';
import Icon from './Icon';

const cardStyle = {
  style: {
    base: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '16px',
      color: '#0A1424',
      '::placeholder': { color: '#6B7A90' },
    },
    invalid: { color: '#BC3128' },
  },
};

const StripeCheckout = ({ onSuccess, total, serviceId, addons, vehicleType }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;
    setProcessing(true);
    setError(null);

    // 1. Create PaymentIntent via Edge Function (server calculates price)
    const { data: piData, error: piError } = await createPaymentIntent({
      serviceId,
      addons,
      vehicleType,
    });

    if (piError || !piData?.clientSecret) {
      // Fallback: if Edge Function unavailable, just collect card info (demo mode)
      const card = elements.getElement(CardElement);
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card });
      if (pmError) { setError(pmError.message); setProcessing(false); return; }
      onSuccess(paymentMethod.id);
      setProcessing(false);
      return;
    }

    // 2. Confirm payment with the client secret from server
    const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
      piData.clientSecret,
      { payment_method: { card: elements.getElement(CardElement) } }
    );

    if (confirmError) {
      setError(confirmError.message);
      setProcessing(false);
      return;
    }

    // 3. Payment confirmed — pass the PaymentIntent ID back
    onSuccess(paymentIntent.id);
    setProcessing(false);
  };

  return (
    <div className="stripe-frame">
      <div className="stripe-badge"><Icon name="lock" size={14}/> Powered by Stripe</div>
      <div style={{ padding: '16px', border: '1.5px solid var(--divider-soft)', borderRadius: 'var(--r-md)', background: '#fff', marginBottom: 16 }}>
        <CardElement options={cardStyle} />
      </div>
      {error && <div style={{ color: 'var(--red)', fontSize: 13, marginBottom: 12 }}>{error}</div>}
      <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text)', marginBottom: 16 }}>
        <input type="checkbox" defaultChecked /> Save this card for faster future bookings
      </label>
      <Button variant="primary" onClick={handleSubmit} disabled={!stripe || processing} icon="lock">
        {processing ? 'Processing…' : `Pre-authorize $${total}`}
      </Button>
    </div>
  );
};

export default StripeCheckout;
