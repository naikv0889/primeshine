import Icon from '../components/Icon';
import Button from '../components/Button';
import Eyebrow from '../components/Eyebrow';

const ContactPage = () => (
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
            <h3 style={{marginBottom:4}}>Send a message</h3>
            <p style={{color:'var(--text-mute)', fontSize:14, marginBottom:24}}>We reply to every message within one business day.</p>
            <div className="field-row">
              <div className="field"><label>First name</label><input placeholder="Sam"/></div>
              <div className="field"><label>Last name</label><input placeholder="Rivera"/></div>
            </div>
            <div className="field"><label>Email</label><input type="email" placeholder="sam@example.com"/></div>
            <div className="field"><label>Phone</label><input placeholder="(626) 555-0100"/></div>
            <div className="field"><label>How can we help?</label>
              <select defaultValue=""><option value="" disabled>Select one…</option><option>Book a service</option><option>Question about packages</option><option>Fleet / commercial</option><option>Reschedule existing booking</option><option>Other</option></select>
            </div>
            <div className="field"><label>Message</label><textarea rows="5" placeholder="Tell us about your vehicle and what you're hoping for."/></div>
            <Button variant="primary" iconRight="arrow">Send message</Button>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default ContactPage;
