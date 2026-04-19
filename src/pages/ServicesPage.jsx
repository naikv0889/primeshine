import { useNavigate } from 'react-router-dom';
import { SERVICES, ADDONS, VEHICLE_TYPES } from '../data/services';
import { VEHICLE_ICONS } from '../data/vehicles';
import Icon from '../components/Icon';
import Button from '../components/Button';
import Eyebrow from '../components/Eyebrow';

const ServicesPage = () => {
  const navigate = useNavigate();
  const go = (r) => { navigate(`/${r}`); window.scrollTo(0,0); };
  return (
    <div className="page page-enter">
      <section className="section" style={{paddingBottom:32}}>
        <div className="container" style={{textAlign:'center', maxWidth:760, margin:'0 auto'}}>
          <Eyebrow>Services</Eyebrow>
          <h1 style={{marginTop:16, marginBottom:16}}>Choose how deep to go.</h1>
          <p style={{fontSize:17, color:'var(--text-mute)'}}>From a 45-minute express wash to a multi-day ceramic coating, our packages are built to layer. Mix any package with any add-on.</p>
        </div>
      </section>
      <section className="section" style={{paddingTop:32}}>
        <div className="container">
          <div className="tier-grid">
            {SERVICES.map(s => (
              <div key={s.id} className={`tier ${s.popular ? 'popular' : ''}`}>
                <div className="tier-name">{s.tier}</div>
                <h3 style={{fontSize:24, marginTop:4}}>{s.name}</h3>
                <div className="tier-price">${s.priceFrom}<small>/ from</small></div>
                <div style={{display:'flex', gap:12, color:'var(--text-mute)', fontSize:13, margin:'-4px 0 8px'}}>
                  <span style={{display:'inline-flex', alignItems:'center', gap:4}}><Icon name="clock" size={14}/> ~{Math.floor(s.time/60)}h {s.time%60 ? (s.time%60)+'m' : ''}</span>
                </div>
                <p className="tier-desc">{s.desc}</p>
                <ul className="tier-features">{s.features.map((f,i) => (<li key={i}><Icon name="check" size={16} color="var(--success)"/> {f}</li>))}</ul>
                <Button variant={s.popular ? 'primary' : 'secondary'} onClick={() => go('book/1')} iconRight="arrow">Book {s.name}</Button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section muted">
        <div className="container">
          <div className="section-head">
            <div><Eyebrow variant="navy">Add-ons</Eyebrow><h2 style={{marginTop:16}}>Layer on what you need.</h2></div>
            <p>Stack any of these onto any package. No upsells at the driveway. You choose in advance.</p>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16}}>
            {ADDONS.map(a => (
              <div key={a.id} className="card hover" style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:24}}>
                <div><h4 style={{fontSize:16, marginBottom:4}}>{a.name}</h4><div style={{fontSize:13, color:'var(--text-mute)'}}>+{a.time} min</div></div>
                <div style={{fontSize:22, fontWeight:700, color:'var(--navy)'}}>+${a.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div><Eyebrow>Vehicle size</Eyebrow><h2 style={{marginTop:16}}>Fair pricing by footprint.</h2></div>
            <p>Bigger vehicles take longer, so we price it honestly. See the multiplier up front on every package.</p>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16}}>
            {VEHICLE_TYPES.map(v => (
              <div key={v.id} className="card" style={{textAlign:'center'}}>
                <div style={{height:72, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--navy)', marginBottom:12}}>{VEHICLE_ICONS[v.id]}</div>
                <h4 style={{fontSize:16, marginBottom:4}}>{v.name}</h4>
                <div style={{fontSize:13, color:'var(--text-mute)', fontFamily:'var(--font-mono)'}}>×{v.multiplier.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
