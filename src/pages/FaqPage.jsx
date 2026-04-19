import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import Button from '../components/Button';
import Eyebrow from '../components/Eyebrow';

const FaqPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(0);
  const faqs = [
    { q: 'Do I need to be home during the detail?', a: 'No, as long as we have driveway access and someone can confirm the car is available at the scheduled time, you can be anywhere. Most of our Signature bookings happen while customers are at work or running errands.' },
    { q: 'What if it rains on my appointment?', a: 'We check NOAA forecast 24 hours out. If precipitation exceeds 40%, we proactively text you to reschedule, free, any time. You can also manually reschedule up to 2 hours before your slot in the customer portal.' },
    { q: 'Do you bring your own water and power?', a: 'Yes. Our vans carry 40-gallon water tanks (pre-filtered and softened) plus dual 2,500W inverters. We never need to plug in or hook up to your hose unless you want us to.' },
    { q: 'How do I pay? Is there a deposit?', a: 'No deposit required. You pay after the walk-around inspection: Apple Pay, Google Pay, card, or saved ACH. Everything runs through Stripe with full receipts in your portal.' },
    { q: 'Can you remove pet hair or deep stains?', a: 'Yes. Add the Pet Hair Removal ($35) or Ozone Treatment ($60) add-on. For set-in stains, we recommend Signature Detail or higher so we have time to steam and extract properly.' },
    { q: 'Is the ceramic coating really 3 years?', a: 'Yes, with a written guarantee. We use Gtechniq Crystal Serum Light applied over a corrected base. Return every 6 months for a courtesy top-up wash and your warranty stays active for the full term.' },
    { q: 'What areas do you serve?', a: 'San Gabriel Valley: Alhambra, San Marino, Pasadena, South Pasadena, Monterey Park, Rosemead, Arcadia, Temple City. If you\'re near the edge, enter your zip at booking and we\'ll confirm.' },
    { q: 'Do you detail EVs / Teslas?', a: 'All day, every day. We carry EV-safe tire dressing and a plastic-preservation wrap for your charge port. Ceramic coating on Model Y and Model 3 is one of our most-booked Premiers.' },
  ];
  return (
    <div className="page page-enter">
      <section className="section">
        <div className="container">
          <div style={{textAlign:'center', maxWidth:700, margin:'0 auto var(--sp-8)'}}>
            <Eyebrow>FAQ</Eyebrow>
            <h1 style={{marginTop:16, marginBottom:16}}>Quick answers to real questions.</h1>
            <p style={{fontSize:17, color:'var(--text-mute)'}}>The ones we actually get asked, every week.</p>
          </div>
          <div style={{maxWidth:820, margin:'0 auto', display:'flex', flexDirection:'column', gap:12}}>
            {faqs.map((f,i) => (
              <div key={i} className="card" style={{padding:0, overflow:'hidden'}}>
                <button onClick={() => setOpen(open === i ? -1 : i)} style={{all:'unset', cursor:'pointer', padding:'20px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%', fontFamily:'inherit'}}>
                  <span style={{fontSize:16, fontWeight:600, color:'var(--navy)'}}>{f.q}</span>
                  <Icon name={open === i ? 'x' : 'plus'} size={20} color="var(--navy)"/>
                </button>
                {open === i && (
                  <div className="fade-in" style={{padding:'0 24px 22px', fontSize:15, lineHeight:1.65, color:'var(--text)', borderTop:'1px dashed var(--divider-soft)', paddingTop:18}}>{f.a}</div>
                )}
              </div>
            ))}
          </div>
          <div style={{textAlign:'center', marginTop:48, padding:32, background:'var(--muted)', borderRadius:'var(--r-lg)'}}>
            <h3 style={{marginBottom:8}}>Still have questions?</h3>
            <p style={{marginBottom:16, color:'var(--text-mute)'}}>Text us. We usually reply within 10 minutes during business hours.</p>
            <Button variant="primary" onClick={() => navigate('/contact')} icon="message">Send a message</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FaqPage;
