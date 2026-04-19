import { useNavigate } from 'react-router-dom';
import { SERVICES } from '../data/services';
import { REVIEWS, WEATHER_FORECAST } from '../data/reviews';
import Icon from '../components/Icon';
import Button from '../components/Button';
import Eyebrow from '../components/Eyebrow';
import WxIcon from '../components/WxIcon';
import Stars from '../components/Stars';

const HomePage = () => {
  const navigate = useNavigate();
  const go = (r) => { navigate(`/${r}`); window.scrollTo(0,0); };
  return (
    <div className="page page-enter">
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <Eyebrow>Mobile · San Gabriel Valley · Since 2019</Eyebrow>
              <h1 className="fade-up">The shine your car deserves, <span className="accent">in your driveway.</span></h1>
              <p className="hero-sub fade-up d1">Fully mobile auto detailing. We arrive with water, power, and 12 years of experience. You stay on the couch. Book in 90 seconds.</p>
              <div className="hero-ctas fade-up d2">
                <Button variant="primary" size="lg" onClick={() => go('book/1')} iconRight="arrow">Book a detail</Button>
                <Button variant="secondary" size="lg" onClick={() => go('services')}>View services</Button>
              </div>
              <div className="hero-trust fade-up d3">
                <div className="t-item"><div className="t-num">4.97</div><div className="t-lab">AVG RATING · 840+ REVIEWS</div></div>
                <div className="t-item"><div className="t-num">12+</div><div className="t-lab">YEARS EXPERIENCE</div></div>
                <div className="t-item"><div className="t-num">3,200</div><div className="t-lab">CARS DETAILED</div></div>
              </div>
            </div>
            <div className="hero-visual fade-up d2">
              <div className="photo">
                <svg className="car-big" viewBox="0 0 300 160" fill="none">
                  <ellipse cx="150" cy="140" rx="130" ry="8" fill="rgba(0,0,0,0.3)"/>
                  <path d="M30 110 L50 70 Q60 55 80 52 L220 52 Q240 55 250 70 L270 110 Z" fill="#BC3128"/>
                  <path d="M70 72 L90 55 L210 55 L230 72 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                  <rect x="30" y="108" width="240" height="8" fill="#1C2E4B"/>
                  <circle cx="80" cy="118" r="18" fill="#0A1424" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                  <circle cx="80" cy="118" r="8" fill="#4A5570"/>
                  <circle cx="220" cy="118" r="18" fill="#0A1424" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                  <circle cx="220" cy="118" r="8" fill="#4A5570"/>
                  <ellipse cx="200" cy="85" rx="30" ry="10" fill="rgba(255,255,255,0.08)"/>
                </svg>
              </div>
              <div className="badge">Same-day available</div>
              <div className="stat-chip">
                <div><div className="s-val">90<span style={{fontSize:13, color:'var(--text-mute)'}}>s</span></div><div className="s-lab">Book time</div></div>
                <div><div className="s-val">2hr</div><div className="s-lab">Avg detail</div></div>
                <div><div className="s-val">100%</div><div className="s-lab">Mobile</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section muted">
        <div className="container">
          <div className="section-head">
            <div><Eyebrow variant="navy">How it works</Eyebrow><h2 style={{marginTop:16}}>Four steps, zero friction.</h2></div>
            <p>No phone calls, no back-and-forth. Pick a package, share your address, we handle the rest.</p>
          </div>
          <div className="steps">
            {[
              { n:'01', t:'Pick a package', d:'Three tiers for every budget, from 45-min refresh to full ceramic coat.' },
              { n:'02', t:'Tell us when', d:'Pick any open slot. We show the 7-day weather on the calendar.' },
              { n:'03', t:'We come to you', d:'Our van arrives with its own water and power. Stay indoors.' },
              { n:'04', t:'Pay when it shines', d:'Review the work, then tap to pay through Stripe. Simple.' },
            ].map(s => (
              <div className="step card" key={s.n}><div className="snum">{s.n}</div><h3>{s.t}</h3><p>{s.d}</p></div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div><Eyebrow>Service packages</Eyebrow><h2 style={{marginTop:16}}>Three tiers. One obsessive standard.</h2></div>
            <p>Every package, no matter the price, starts with the same pre-inspection and ends with a walk-around with you.</p>
          </div>
          <div className="tier-grid">
            {SERVICES.map((s) => (
              <div key={s.id} className={`tier ${s.popular ? 'popular' : ''}`}>
                <div className="tier-name">{s.tier}</div>
                <h3 style={{fontSize:24, marginTop:4}}>{s.name}</h3>
                <div className="tier-price">${s.priceFrom}<small>/ from</small></div>
                <p className="tier-desc">{s.desc}</p>
                <ul className="tier-features">
                  {s.features.slice(0,5).map((f, i) => (<li key={i}><Icon name="check" size={16} color="var(--success)"/> {f}</li>))}
                </ul>
                <Button variant={s.popular ? 'primary' : 'secondary'} onClick={() => go('book/1')} iconRight="arrow">Book {s.name}</Button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section muted">
        <div className="container">
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'center'}}>
            <div>
              <Eyebrow variant="navy">Weather-aware booking</Eyebrow>
              <h2 style={{marginTop:16, marginBottom:16}}>We won't wash your car in the rain.</h2>
              <p style={{fontSize:16, color:'var(--text)', marginBottom:24, maxWidth:460}}>Our booking calendar checks the 7-day forecast for your zip code and flags days that won't hold a shine. If weather shifts after you book, we reschedule at no cost.</p>
              <div style={{display:'flex', gap:12, flexWrap:'wrap'}}>
                <Button variant="primary" onClick={() => go('weather')} iconRight="arrow">See your forecast</Button>
                <Button variant="tertiary" onClick={() => go('book/1')}>Book around the weather</Button>
              </div>
            </div>
            <div className="wx-widget">
              <div className="wx-widget-head">
                <div>
                  <div style={{display:'flex', alignItems:'center', gap:6, opacity:0.85, marginBottom:4}}><Icon name="location" size={14}/><span style={{fontSize:12}}>Alhambra, CA · 91801</span></div>
                  <div style={{fontSize:11, opacity:0.6, letterSpacing:'0.05em', textTransform:'uppercase'}}>Tuesday · 2:14 PM</div>
                </div>
                <div className="wx-score ok">Perfect day to wash</div>
              </div>
              <div className="wx-widget-now">
                <div><div className="temp">72<sup>°F</sup></div><div className="cond">Sunny · feels like 74°</div></div>
                <WxIcon type="sun" size={72}/>
              </div>
              <div className="wx-widget-metrics">
                <div className="m"><div className="v">0%</div><div className="l">Precip</div></div>
                <div className="m"><div className="v">6 mph</div><div className="l">Wind</div></div>
                <div className="m"><div className="v">42%</div><div className="l">Humidity</div></div>
              </div>
              <div className="wx-7day">
                {WEATHER_FORECAST.slice(0,7).map((d,i) => (
                  <div key={i} className={`d ${d.scoreClass==='ok' && i < 3 ? 'best' : ''}`}>
                    <div className="dow">{d.dow.slice(0,3)}</div>
                    <WxIcon type={d.icon} size={22}/>
                    <div className="hi">{d.hi}°</div>
                    <div className="lo">{d.lo}°</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div><Eyebrow>Customer stories</Eyebrow><h2 style={{marginTop:16}}>4.97 from 840+ detail jobs.</h2></div>
            <p>Every review is from a verified, paid booking. No incentives, no edits.</p>
          </div>
          <div className="reviews-grid">
            {REVIEWS.map((r,i) => (
              <div key={i} className="review">
                <Stars n={r.n}/>
                <p className="quote">"{r.q}"</p>
                <div className="who">
                  <div className="av">{r.av}</div>
                  <div className="meta"><div className="nm">{r.name}</div><div className="sub">{r.sub}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section compact dark">
        <div className="container" style={{textAlign:'center'}}>
          <Eyebrow variant="on-dark">Ready to book?</Eyebrow>
          <h2 style={{marginTop:16, marginBottom:16, fontSize:42}}>Your driveway. Our shine.</h2>
          <p style={{color:'rgba(255,255,255,0.72)', maxWidth:480, margin:'0 auto 32px', fontSize:17}}>Next available slot is tomorrow at 8:30 AM. Book now and we'll be in your driveway before your coffee's cold.</p>
          <div style={{display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap'}}>
            <Button variant="on-dark" size="lg" onClick={() => go('book/1')} iconRight="arrow">Book in 90 seconds</Button>
            <Button variant="tertiary" size="lg" onClick={() => go('services')}>See all services</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
