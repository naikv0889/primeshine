import { useNavigate } from 'react-router-dom';
import { SERVICES, VEHICLE_TYPES } from '../data/services';
import Icon from '../components/Icon';
import Button from '../components/Button';
import Eyebrow from '../components/Eyebrow';

const PricingPage = () => {
  const navigate = useNavigate();
  const go = (r) => { navigate(`/${r}`); window.scrollTo(0,0); };
  return (
    <div className="page page-enter">
      <section className="section">
        <div className="container" style={{textAlign:'center', maxWidth:760, margin:'0 auto'}}>
          <Eyebrow>Pricing</Eyebrow>
          <h1 style={{marginTop:16, marginBottom:16}}>What you see is what you pay.</h1>
          <p style={{fontSize:17, color:'var(--text-mute)'}}>No hidden fees. No driveway upsells. Prices below are the exact amount charged at checkout for each vehicle size.</p>
        </div>
      </section>
      <section className="section compact" style={{paddingTop:0}}>
        <div className="container">
          <div className="card" style={{padding:0, overflow:'hidden'}}>
            <table className="table" style={{fontSize:15}}>
              <thead style={{background:'var(--muted)'}}><tr>
                <th style={{padding:'18px 24px'}}>Package</th>
                {VEHICLE_TYPES.map(v => <th key={v.id} style={{padding:'18px 24px', textAlign:'center'}}>{v.name}</th>)}
                <th style={{padding:'18px 24px'}}>Duration</th>
              </tr></thead>
              <tbody>
                {SERVICES.map(s => (
                  <tr key={s.id}>
                    <td style={{padding:'22px 24px'}}>
                      <div style={{fontSize:16, fontWeight:600, color:'var(--navy)'}}>{s.name}</div>
                      <div style={{fontSize:13, color:'var(--text-mute)', marginTop:4, maxWidth:320}}>{s.desc.split('.')[0]}</div>
                    </td>
                    {VEHICLE_TYPES.map(v => (
                      <td key={v.id} style={{textAlign:'center', padding:'22px 24px'}}>
                        <div style={{fontSize:20, fontWeight:700, color:'var(--navy)', fontVariantNumeric:'tabular-nums'}}>${Math.round(s.priceFrom * v.multiplier)}</div>
                      </td>
                    ))}
                    <td style={{padding:'22px 24px', fontFamily:'var(--font-mono)', color:'var(--text-mute)'}}>{Math.floor(s.time/60)}h {s.time%60 ? (s.time%60)+'m' : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:32, padding:'20px 24px', background:'var(--muted)', borderRadius:'var(--r-md)'}}>
            <div style={{display:'flex', alignItems:'center', gap:12, color:'var(--text-mute)', fontSize:14}}>
              <Icon name="info" size={18} color="var(--navy)"/>
              <span>All packages include our satisfaction guarantee. Not happy? We come back free.</span>
            </div>
            <Button variant="primary" onClick={() => go('book/1')} iconRight="arrow">Start booking</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
