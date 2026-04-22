import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { SERVICES, ADDONS, VEHICLE_TYPES } from '../../data/services';
import { VEHICLE_ICONS } from '../../data/vehicles';
import { getStripe } from '../../lib/stripe';
import { createBooking } from '../../lib/api';
import { useAuth } from '../../lib/AuthContext';
import Icon from '../../components/Icon';
import Button from '../../components/Button';
import Eyebrow from '../../components/Eyebrow';
import WxIcon from '../../components/WxIcon';
import StripeCheckout from '../../components/StripeCheckout';

const Stepper = ({ step }) => {
  const steps = [{ n: 1, l: 'Service' },{ n: 2, l: 'Vehicle' },{ n: 3, l: 'Schedule' },{ n: 4, l: 'Payment' }];
  return (
    <div className="stepper">
      {steps.map((s, i) => (
        <React.Fragment key={s.n}>
          <div className={`s ${step === s.n ? 'active' : ''} ${step > s.n ? 'done' : ''}`}>
            <div className="idx">{step > s.n ? <Icon name="check" size={14}/> : s.n}</div>
            <span>{s.l}</span>
          </div>
          {i < steps.length - 1 && <div className={`dash ${step > s.n ? 'done' : ''}`}/>}
        </React.Fragment>
      ))}
    </div>
  );
};

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const formatDisplayDate = (isoDate) => {
  if (!isoDate) return null;
  const d = new Date(isoDate + 'T12:00:00');
  return `${MONTH_NAMES[d.getMonth()].slice(0,3)} ${d.getDate()}, ${d.getFullYear()}`;
};

const BookingSummary = ({ state }) => {
  const svc = SERVICES.find(s => s.id === state.service);
  const vt = VEHICLE_TYPES.find(v => v.id === state.vehicleType);
  const base = svc ? Math.round(svc.priceFrom * (vt?.multiplier || 1)) : 0;
  const addonsTotal = state.addons.reduce((sum, id) => sum + (ADDONS.find(a => a.id === id)?.price || 0), 0);
  const subtotal = base + addonsTotal;
  const tax = Math.round(subtotal * 0.0975);
  const total = subtotal + tax;
  return (
    <aside className="booking-aside">
      <div className="summary">
        <div className="summary-header"><div className="sum-lab">Your order</div><h4>{svc?.name || 'Choose a service'}</h4></div>
        <div className="summary-body">
          <div className={`sum-line ${!vt ? 'empty' : ''}`}><span className="l">Vehicle</span><span className="v">{vt?.name || 'Not selected'}</span></div>
          <div className={`sum-line ${!state.date ? 'empty' : ''}`}><span className="l">When</span><span className="v">{state.date ? `${formatDisplayDate(state.date)}, ${state.time}` : 'Not selected'}</span></div>
          <div className="sum-line"><span className="l">Base</span><span className="v mono">${base}</span></div>
          {state.addons.map(id => { const a = ADDONS.find(x => x.id === id); return (<div key={id} className="sum-line"><span className="l" style={{textTransform:'none', letterSpacing:0, fontSize:13, fontWeight:500}}>+ {a.name}</span><span className="v mono">${a.price}</span></div>); })}
          <div className="sum-line"><span className="l">Tax (9.75%)</span><span className="v mono">${tax}</span></div>
        </div>
        <div className="sum-total"><span className="lab">Total</span><span className="amt mono">${total}</span></div>
        <div className="trust-row"><Icon name="lock" size={16}/><span>Secure checkout · Stripe · No charge until complete</span></div>
      </div>
    </aside>
  );
};

const BookStep1 = ({ state, setState, next }) => (
  <div className="fade-in">
    <h2 className="booking-title">Pick your package</h2>
    <p className="booking-subtitle">Start with a base service. You'll add vehicle details and timing next.</p>
    <div className="choice-grid">
      {SERVICES.map(s => (
        <div key={s.id} className={`choice ${state.service === s.id ? 'selected' : ''}`} onClick={() => setState({ ...state, service: s.id })}>
          <div className="c-head">
            <div><div className="c-title">{s.name}</div><div style={{fontSize:12, color:'var(--red)', fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase', marginTop:2}}>{s.tier}</div></div>
            {s.popular ? <div className="c-tag">Most booked</div> : <div className="radio"/>}
          </div>
          <div className="c-desc">{s.desc}</div>
          <ul style={{listStyle:'none', display:'flex', flexDirection:'column', gap:6, fontSize:13, color:'var(--text)'}}>
            {s.features.slice(0,3).map((f,i) => (<li key={i} style={{display:'flex', gap:8}}><Icon name="check" size={14} color="var(--success)"/> {f}</li>))}
          </ul>
          <div className="c-meta"><div className="c-time">~{Math.floor(s.time/60)}h {s.time%60 ? (s.time%60)+'m' : ''}</div><div className="c-price">from ${s.priceFrom}</div></div>
        </div>
      ))}
    </div>
    <div style={{marginTop:'var(--sp-7)'}}>
      <h3 style={{fontSize:16, marginBottom:12}}>Add-ons (optional)</h3>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
        {ADDONS.map(a => {
          const selected = state.addons.includes(a.id);
          return (
            <label key={a.id} style={{display:'flex', alignItems:'center', gap:12, padding:'12px 16px', border:`1.5px solid ${selected ? 'var(--red)' : 'var(--divider-soft)'}`, background: selected ? 'var(--red-bg)' : '#fff', borderRadius:'var(--r-md)', cursor:'pointer', transition:'all 0.2s var(--ease)'}}>
              <div style={{width:18, height:18, borderRadius:4, border:`1.5px solid ${selected ? 'var(--red)' : 'var(--divider)'}`, background: selected ? 'var(--red)' : '#fff', display:'flex', alignItems:'center', justifyContent:'center'}}>
                {selected && <Icon name="check" size={12} color="#fff"/>}
              </div>
              <div style={{flex:1}}><div style={{fontSize:14, fontWeight:600, color:'var(--navy)'}}>{a.name}</div><div style={{fontSize:12, color:'var(--text-mute)'}}>+{a.time} min</div></div>
              <div style={{fontSize:16, fontWeight:700, color:'var(--navy)'}}>+${a.price}</div>
              <input type="checkbox" style={{display:'none'}} checked={selected} onChange={() => { const addons = selected ? state.addons.filter(x => x !== a.id) : [...state.addons, a.id]; setState({ ...state, addons }); }}/>
            </label>
          );
        })}
      </div>
    </div>
    <div className="booking-nav"><div/><Button variant="primary" onClick={next} disabled={!state.service} iconRight="arrow">Continue to vehicle</Button></div>
  </div>
);

const BookStep2 = ({ state, setState, next, prev }) => (
  <div className="fade-in">
    <h2 className="booking-title">About your vehicle</h2>
    <p className="booking-subtitle">Price adjusts by size. Make & model help us plan the right products.</p>
    <h3 style={{fontSize:14, marginBottom:12, letterSpacing:'0.05em', textTransform:'uppercase', color:'var(--text-mute)'}}>Vehicle size</h3>
    <div className="vehicle-types" style={{marginBottom:32}}>
      {VEHICLE_TYPES.map(v => (
        <div key={v.id} className={`v-type ${state.vehicleType === v.id ? 'selected' : ''}`} onClick={() => setState({ ...state, vehicleType: v.id })}>
          {VEHICLE_ICONS[v.id]}<div className="lb">{v.name}</div>
        </div>
      ))}
    </div>
    <h3 style={{fontSize:14, marginBottom:12, letterSpacing:'0.05em', textTransform:'uppercase', color:'var(--text-mute)'}}>Details</h3>
    <div className="field-row-3">
      <div className="field"><label>Make & Model</label><input placeholder="e.g., Honda Civic" value={state.make} onChange={e => setState({ ...state, make: e.target.value })}/></div>
      <div className="field"><label>Year</label><input placeholder="2021" value={state.year} onChange={e => setState({ ...state, year: e.target.value })}/></div>
      <div className="field"><label>Color</label><input placeholder="Pearl White" value={state.color} onChange={e => setState({ ...state, color: e.target.value })}/></div>
    </div>
    <div className="field"><label>Anything we should know?</label><textarea rows="3" placeholder="Pet hair, specific stains, recent paint work, allergies, etc." value={state.notes} onChange={e => setState({ ...state, notes: e.target.value })}/></div>
    <div className="booking-nav">
      <Button variant="tertiary" onClick={prev} icon="arrowLeft">Back</Button>
      <Button variant="primary" onClick={next} disabled={!state.vehicleType} iconRight="arrow">Continue to schedule</Button>
    </div>
  </div>
);

const BookStep3 = ({ state, setState, next, prev }) => {
  const today = new Date();
  today.setHours(0,0,0,0);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const startDow = new Date(viewYear, viewMonth, 1).getDay();

  const calDays = [];
  for (let i = 0; i < startDow; i++) calDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(viewYear, viewMonth, d);
    dt.setHours(0,0,0,0);
    const iso = `${viewYear}-${String(viewMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isPast = dt < today;
    const isToday = dt.getTime() === today.getTime();
    // Simple weather heuristic based on day-of-month for visual variety
    const wx = isPast ? null : (d % 7 === 0 || d % 7 === 6) ? 'cloud' : (d % 11 === 0) ? 'rain' : 'sun';
    calDays.push({ d, iso, isPast, isToday, wx });
  }

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };
  // Don't allow navigating before current month
  const canGoPrev = viewYear > today.getFullYear() || (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  const slots = [
    { t: '8:00 AM', tag: 'Best' },{ t: '9:30 AM' },
    { t: '11:00 AM', tag: 'Best' },{ t: '12:30 PM' },
    { t: '2:00 PM' },{ t: '3:30 PM', tag: 'Last' },
  ];

  const selectedWx = calDays.find(c => c && c.iso === state.date)?.wx;
  const wxAdvisory = state.date
    ? selectedWx === 'rain'
      ? { cls: 'warn', text: `Rain is likely on ${formatDisplayDate(state.date)}. Consider picking a sunny day for best results. We\u2019ll refund if weather cancels after booking.` }
      : selectedWx === 'cloud'
        ? { cls: 'warn', text: `Overcast expected on ${formatDisplayDate(state.date)}. Detailing is fine, but sun gives the best shine.` }
        : { cls: 'good', text: `Forecast looks ideal for ${formatDisplayDate(state.date)}. This is a perfect-shine day.` }
    : null;

  return (
    <div className="fade-in">
      <h2 className="booking-title">Pick a date & time</h2>
      <p className="booking-subtitle">Weather-aware calendar: green days hold a shine, gray days don't.</p>
      <div className="schedule-grid">
        <div>
          <div className="cal-head">
            <h4>{MONTH_NAMES[viewMonth]} {viewYear}</h4>
            <div className="cal-nav">
              <button onClick={prevMonth} disabled={!canGoPrev}><Icon name="chevL" size={16}/></button>
              <button onClick={nextMonth}><Icon name="chevR" size={16}/></button>
            </div>
          </div>
          <div className="cal-grid">
            {['S','M','T','W','T','F','S'].map((d,i) => <div key={i} className="cal-dow">{d}</div>)}
            {calDays.map((c, i) => {
              if (!c) return <div key={i} className="cal-day muted"/>;
              const cls = [c.isPast ? 'disabled' : '', c.isToday ? 'today' : '', state.date === c.iso ? 'selected' : ''].filter(Boolean).join(' ');
              return (
                <div key={i} className={`cal-day ${cls}`} onClick={() => !c.isPast && setState({ ...state, day: c.d, date: c.iso })}>
                  {c.d}
                  {c.wx && !c.isPast && <div className={`wxdot ${c.wx}`}/>}
                </div>
              );
            })}
          </div>
          <div style={{display:'flex', gap:16, marginTop:16, fontSize:11, color:'var(--text-mute)', letterSpacing:'0.02em'}}>
            <div style={{display:'flex', alignItems:'center', gap:6}}><span style={{width:6, height:6, borderRadius:'50%', background:'#E8A02D'}}/>Sunny</div>
            <div style={{display:'flex', alignItems:'center', gap:6}}><span style={{width:6, height:6, borderRadius:'50%', background:'var(--navy-60)'}}/>Cloudy</div>
            <div style={{display:'flex', alignItems:'center', gap:6}}><span style={{width:6, height:6, borderRadius:'50%', background:'var(--info)'}}/>Rain</div>
          </div>
        </div>
        <div>
          <h4 style={{fontSize:16, marginBottom:12}}>{state.date ? `Times for ${formatDisplayDate(state.date)}` : 'Pick a date to see times'}</h4>
          {state.date ? (
            <>
              <div className="slots">
                {slots.map(s => (
                  <div key={s.t} className={`slot ${state.time === s.t ? 'selected' : ''}`}
                       onClick={() => setState({ ...state, time: s.t })}>
                    <span>{s.t}</span>
                    {s.tag && <span className={`slot-tag ${s.tag === 'Last' ? 'warn' : ''}`}>{s.tag}</span>}
                  </div>
                ))}
              </div>
              {wxAdvisory && (
                <div className={`wx-advisory ${wxAdvisory.cls === 'good' ? 'good' : 'warn'}`}>
                  <WxIcon type={wxAdvisory.cls === 'good' ? 'sun' : 'rain'} size={24}/>
                  <div><div style={{fontWeight:600, marginBottom:2}}>{wxAdvisory.cls === 'good' ? 'Ideal conditions' : 'Weather heads-up'}</div><div>{wxAdvisory.text}</div></div>
                </div>
              )}
            </>
          ) : (
            <div style={{padding:24, background:'var(--muted)', borderRadius:'var(--r-md)', color:'var(--text-mute)', fontSize:14}}>
              Select any day from the calendar to see available windows.
            </div>
          )}
        </div>
      </div>
      <div style={{marginTop:32}}>
        <h3 style={{fontSize:14, marginBottom:12, letterSpacing:'0.05em', textTransform:'uppercase', color:'var(--text-mute)'}}>Service address</h3>
        <div className="field"><label>Street address</label><input placeholder="412 Los Robles Ave" value={state.address} onChange={e => setState({ ...state, address: e.target.value })}/></div>
        <div className="field-row-3">
          <div className="field"><label>City</label><input placeholder="Pasadena" value={state.city} onChange={e => setState({ ...state, city: e.target.value })}/></div>
          <div className="field"><label>State</label><input placeholder="CA" value={state.st} onChange={e => setState({ ...state, st: e.target.value })}/></div>
          <div className="field"><label>ZIP</label><input placeholder="91101" value={state.zip} onChange={e => setState({ ...state, zip: e.target.value })}/></div>
        </div>
      </div>
      <div className="booking-nav">
        <Button variant="tertiary" onClick={prev} icon="arrowLeft">Back</Button>
        <Button variant="primary" onClick={next} disabled={!state.date || !state.time} iconRight="arrow">Continue to payment</Button>
      </div>
    </div>
  );
};

const BookStep4 = ({ state, setState, next, prev, total }) => {
  const [method, setMethod] = useState('card');
  const stripePromise = getStripe();

  const DemoCardForm = () => (
    <div className="stripe-frame">
      <div className="stripe-badge"><Icon name="lock" size={14}/> Powered by Stripe</div>
      <div className="card-preview">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', position:'relative', zIndex:2}}><div className="chip"/><div className="cbrand">VISA</div></div>
        <div className="cnum">4242 4242 4242 ••••</div>
        <div className="cbottom"><div><div className="clab">Cardholder</div><div className="cval">SAM RIVERA</div></div><div><div className="clab">Expires</div><div className="cval">04/28</div></div></div>
      </div>
      <div className="field"><label>Card number</label><input defaultValue="4242 4242 4242 4242"/></div>
      <div className="field-row-3">
        <div className="field"><label>Name on card</label><input defaultValue="Sam Rivera"/></div>
        <div className="field"><label>Expiry</label><input defaultValue="04 / 28"/></div>
        <div className="field"><label>CVC</label><input defaultValue="•••"/></div>
      </div>
      <div className="field"><label>Billing ZIP</label><input defaultValue="91101" style={{maxWidth:160}}/></div>
      <label style={{display:'flex', alignItems:'center', gap:10, fontSize:13, color:'var(--text)', marginTop:8}}>
        <input type="checkbox" defaultChecked/> Save this card for faster future bookings (Stripe Link)
      </label>
    </div>
  );

  return (
    <div className="fade-in">
      <h2 className="booking-title">How would you like to pay?</h2>
      <p className="booking-subtitle">No charge until the detail is complete. We'll pre-authorize to confirm the booking.</p>
      <div className="pay-methods">
        <div className={`pay-method ${method === 'card' ? 'selected' : ''}`} onClick={() => setMethod('card')}>
          <div className="radio"/><div className="brand visa">VISA</div>
          <div className="body"><div className="t">Credit or debit card</div><div className="s">Visa, Mastercard, Amex, Discover · via Stripe</div></div>
        </div>
        <div className={`pay-method ${method === 'apple' ? 'selected' : ''}`} onClick={() => setMethod('apple')}>
          <div className="radio"/><div className="brand apple">Pay</div>
          <div className="body"><div className="t">Apple Pay / Google Pay</div><div className="s">1-tap with Face ID or Touch ID</div></div>
        </div>
        <div className={`pay-method ${method === 'link' ? 'selected' : ''}`} onClick={() => setMethod('link')}>
          <div className="radio"/><div className="brand link">link</div>
          <div className="body"><div className="t">Link by Stripe</div><div className="s">Save your details for 1-click future bookings</div></div>
        </div>
      </div>
      {method === 'card' && (
        stripePromise ? (
          <Elements stripe={stripePromise}>
            <StripeCheckout total={total} serviceId={state.service} addons={state.addons} vehicleType={state.vehicleType} onSuccess={(pmId) => { setState({ ...state, paymentMethodId: pmId }); next(); }} />
          </Elements>
        ) : (
          <DemoCardForm />
        )
      )}
      {method === 'apple' && (
        <div style={{padding:40, textAlign:'center', background:'var(--muted)', borderRadius:'var(--r-lg)', marginBottom:16}}>
          <div style={{display:'inline-flex', padding:'16px 32px', background:'#000', color:'#fff', borderRadius:8, fontSize:18, fontWeight:500, alignItems:'center', gap:8}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M17.6 13c0-1.9 1.5-2.8 1.6-2.9a3.4 3.4 0 0 0-2.7-1.5c-1.1 0-2.2.7-2.8.7-.6 0-1.5-.7-2.4-.7-1.3 0-2.4.8-3.1 1.9-1.3 2.3-.3 5.7 1 7.5.6.9 1.4 1.9 2.4 1.9.9 0 1.3-.6 2.5-.6s1.4.6 2.4.6 1.7-.9 2.3-1.8c.7-1.1 1-2 1-2.1-.1-.1-2-.8-2-3zM15.6 6.2c.5-.6.9-1.5.8-2.4-.8 0-1.7.5-2.3 1.1-.5.5-1 1.5-.8 2.3.9.1 1.8-.4 2.3-1z"/></svg>
            Pay with Apple Pay
          </div>
          <p style={{marginTop:16, color:'var(--text-mute)', fontSize:14}}>Tap to confirm with Face ID on your next screen</p>
        </div>
      )}
      {method === 'link' && (
        <div style={{padding:24, background:'#F0FFF5', border:'1px solid rgba(0,214,111,0.3)', borderRadius:'var(--r-lg)', marginBottom:16, display:'flex', gap:16, alignItems:'center'}}>
          <div style={{width:48, height:48, background:'#00D66F', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', color:'#000', fontWeight:800}}>link</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:600, color:'var(--navy)', marginBottom:2}}>Continue with Link</div>
            <div style={{fontSize:13, color:'var(--text-mute)'}}>We'll text 415-***-2194 a code to confirm. Your card stays saved for next time.</div>
          </div>
        </div>
      )}
      <div className="pay-notice"><Icon name="info" size={18}/><div><strong>No charge until complete.</strong> We pre-authorize to hold the appointment. Your card is only charged after walk-around inspection. Cancel free up to 2 hours before your slot.</div></div>
      {!stripePromise && (
        <div className="booking-nav">
          <Button variant="tertiary" onClick={prev} icon="arrowLeft">Back</Button>
          <Button variant="primary" onClick={next} icon="lock">Confirm & Pre-authorize</Button>
        </div>
      )}
      {stripePromise && method !== 'card' && (
        <div className="booking-nav">
          <Button variant="tertiary" onClick={prev} icon="arrowLeft">Back</Button>
          <Button variant="primary" onClick={next} icon="lock">Confirm & Pre-authorize</Button>
        </div>
      )}
    </div>
  );
};

const BookConfirm = ({ state, navigate, bookingId }) => {
  const svc = SERVICES.find(s => s.id === state.service);
  return (
    <div className="fade-in">
      <div className="confirm">
        <div className="ring"><Icon name="check" size={44} color="#fff" strokeWidth={3}/></div>
        <Eyebrow>Booking confirmed · #{bookingId}</Eyebrow>
        <h2 style={{marginTop:16, fontSize:36}}>See you soon!</h2>
        <p>A confirmation text is on its way, and the details are in your portal. We'll arrive in the first 15 minutes of your window. Watch for a "10 min out" text.</p>
        <div className="confirm-summary">
          <div><div className="lab">Service</div><div className="val">{svc?.name || 'Signature Detail'}</div></div>
          <div><div className="lab">When</div><div className="val">{state.date ? formatDisplayDate(state.date) : 'TBD'}, {state.time || '10:00 AM'}</div></div>
          <div><div className="lab">Where</div><div className="val">{state.address || 'Your address'}</div></div>
        </div>
        <div style={{display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap'}}>
          <Button variant="primary" onClick={() => navigate('/portal')} iconRight="arrow">Open my portal</Button>
          <Button variant="secondary" onClick={() => navigate('/')}>Back to home</Button>
        </div>
      </div>
    </div>
  );
};

const BookingFlow = () => {
  const { step } = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [state, setState] = useState({ service: 'signature', vehicleType: 'sedan', addons: [], day: null, date: null, time: null, make: '', year: '', color: '', notes: '', address: '', city: '', st: 'CA', zip: '' });
  const [bookingId, setBookingId] = useState('B-2053');
  const stepNum = parseInt(step);

  const go = async (n) => {
    // When moving to confirmation (step 5), save the booking
    if (n === 5) {
      const bookingData = {
        customer_id: authUser?.id || null,
        service_id: state.service,
        addons: state.addons,
        scheduled_date: state.date,
        scheduled_time: state.time,
        address: state.address,
        city: state.city,
        state: state.st,
        zip: state.zip,
        subtotal,
        tax,
        total,
        notes: state.notes,
        payment_method: state.paymentMethodId ? 'card' : 'demo',
        stripe_payment_id: state.paymentMethodId || null,
        payment_status: state.paymentMethodId ? 'authorized' : 'pending',
      };
      const { data } = await createBooking(bookingData);
      if (data?.booking_number) setBookingId(data.booking_number);
      else if (data?.id) setBookingId(data.id.slice(0, 8));
    }
    navigate(`/book/${n}`);
    window.scrollTo(0, 0);
  };

  // Compute total for payment step
  const svc = SERVICES.find(s => s.id === state.service);
  const vt = VEHICLE_TYPES.find(v => v.id === state.vehicleType);
  const base = svc ? Math.round(svc.priceFrom * (vt?.multiplier || 1)) : 0;
  const addonsTotal = state.addons.reduce((sum, id) => sum + (ADDONS.find(a => a.id === id)?.price || 0), 0);
  const subtotal = base + addonsTotal;
  const tax = Math.round(subtotal * 0.0975);
  const total = subtotal + tax;

  return (
    <div className="page page-enter" style={{background:'var(--muted)', padding:'40px 0 80px'}}>
      <div className="container">
        <div style={{marginBottom:24}}><Button variant="tertiary" size="sm" onClick={() => navigate('/')} icon="arrowLeft">Back to home</Button></div>
        {stepNum <= 4 ? (
          <div className="booking-layout">
            <div className="booking-main">
              <Stepper step={stepNum}/>
              {stepNum === 1 && <BookStep1 state={state} setState={setState} next={() => go(2)}/>}
              {stepNum === 2 && <BookStep2 state={state} setState={setState} next={() => go(3)} prev={() => go(1)}/>}
              {stepNum === 3 && <BookStep3 state={state} setState={setState} next={() => go(4)} prev={() => go(2)}/>}
              {stepNum === 4 && <BookStep4 state={state} setState={setState} next={() => go(5)} prev={() => go(3)} total={total}/>}
            </div>
            <BookingSummary state={state}/>
          </div>
        ) : (<BookConfirm state={state} navigate={navigate} bookingId={bookingId}/>)}
      </div>
    </div>
  );
};

export default BookingFlow;
