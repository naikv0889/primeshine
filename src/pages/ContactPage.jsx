import { useState } from 'react';
import Icon from '../components/Icon';
import Button from '../components/Button';
import Eyebrow from '../components/Eyebrow';

const ContactPage = () => {
  const [form, setForm] = useState({ first: '', last: '', email: '', phone: '', topic: '', message: '' });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});
  const set = (k, v) => { setForm({ ...form, [k]: v }); setErrors({ ...errors, [k]: undefined }); };

  const validate = () => {
    const e = {};
    if (!form.first.trim()) e.first = true;
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = true;
    if (!form.topic) e.topic = true;
    if (!form.message.trim()) e.message = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    setSent(true);
  };

  return (
    <div className="page page-enter">
      <section className="section">
        <div className="container">
          <div style={{display:'grid', gridTemplateColumns:'1fr 1.2fr', gap:48}}>
            <div>
              <Eyebrow>Contact</Eyebrow>
              <h1 style={{marginTop:16, marginBottom:16}}>Say hi.</h1>
              <p style={{fontSize:16, color:'var(--text)', marginBottom:32}}>The fastest way to us is text or the booking flow. For fleet inquiries, custom packages, or questions, reach out below.</p>
              <div style={{display:'flex', flexDirection:'column', gap:20}}>
                {[
                  { icn:'phone', l:'Call / text', v:'(626) 555-0189' },
                  { icn:'mail', l:'Email', v:'hello@primeshine.co' },
                  { icn:'location', l:'Shop base', v:'1142 N Atlantic Blvd, Alhambra CA 91801' },
                  { icn:'clock', l:'Hours', v:'Mon–Sat · 7:00a – 6:00p · Sun by request' },
                ].map((c,i) => (
                  <div key={i} style={{display:'flex', gap:16, alignItems:'flex-start'}}>
                    <div style={{width:44, height:44, background:'var(--red-bg)', borderRadius:'var(--r-md)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--red)', flexShrink:0}}><Icon name={c.icn} size={20}/></div>
                    <div>
                      <div style={{fontSize:12, color:'var(--text-mute)', letterSpacing:'0.08em', textTransform:'uppercase', fontWeight:600}}>{c.l}</div>
                      <div style={{fontSize:16, color:'var(--navy)', fontWeight:500, marginTop:2}}>{c.v}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card" style={{padding:32}}>
              {sent ? (
                <div className="fade-in" style={{textAlign:'center', padding:'40px 0'}}>
                  <div style={{width:64, height:64, borderRadius:'50%', background:'var(--success)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px'}}><Icon name="check" size={32} color="#fff"/></div>
                  <h3 style={{marginBottom:8}}>Message sent!</h3>
                  <p style={{color:'var(--text-mute)', maxWidth:320, margin:'0 auto'}}>Thanks, {form.first}. We'll get back to you within one business day.</p>
                </div>
              ) : (
                <>
                  <h3 style={{marginBottom:4}}>Send a message</h3>
                  <p style={{color:'var(--text-mute)', fontSize:14, marginBottom:24}}>We reply to every message within one business day.</p>
                  <div className="field-row">
                    <div className="field"><label>First name *</label><input placeholder="Sam" value={form.first} onChange={e => set('first', e.target.value)} style={errors.first ? {borderColor:'var(--red)'} : {}}/></div>
                    <div className="field"><label>Last name</label><input placeholder="Rivera" value={form.last} onChange={e => set('last', e.target.value)}/></div>
                  </div>
                  <div className="field"><label>Email *</label><input type="email" placeholder="sam@example.com" value={form.email} onChange={e => set('email', e.target.value)} style={errors.email ? {borderColor:'var(--red)'} : {}}/></div>
                  <div className="field"><label>Phone</label><input placeholder="(626) 555-0100" value={form.phone} onChange={e => set('phone', e.target.value)}/></div>
                  <div className="field"><label>How can we help? *</label>
                    <select value={form.topic} onChange={e => set('topic', e.target.value)} style={errors.topic ? {borderColor:'var(--red)'} : {}}>
                      <option value="" disabled>Select one…</option><option>Book a service</option><option>Question about packages</option><option>Fleet / commercial</option><option>Reschedule existing booking</option><option>Other</option>
                    </select>
                  </div>
                  <div className="field"><label>Message *</label><textarea rows="5" placeholder="Tell us about your vehicle and what you're hoping for." value={form.message} onChange={e => set('message', e.target.value)} style={errors.message ? {borderColor:'var(--red)'} : {}}/></div>
                  <Button variant="primary" iconRight="arrow" onClick={submit}>Send message</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
