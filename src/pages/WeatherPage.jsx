import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WEATHER_FORECAST } from '../data/reviews';
import Icon from '../components/Icon';
import Button from '../components/Button';
import Eyebrow from '../components/Eyebrow';
import WxIcon from '../components/WxIcon';

const WeatherPage = () => {
  const navigate = useNavigate();
  const go = (r) => { navigate(`/${r}`); window.scrollTo(0,0); };
  const [zip, setZip] = useState('91801');
  return (
    <div className="page page-enter">
      <section className="section">
        <div className="container">
          <div style={{textAlign:'center', maxWidth:760, margin:'0 auto var(--sp-8)'}}>
            <Eyebrow>Weather check</Eyebrow>
            <h1 style={{marginTop:16, marginBottom:16}}>Is today a wash day?</h1>
            <p style={{fontSize:17, color:'var(--text-mute)'}}>We check every forecast factor that matters: precip, wind, pollen, and dew point. Green days = perfect shine conditions.</p>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1.5fr', gap:32, alignItems:'flex-start'}}>
            <div className="wx-widget">
              <div className="wx-widget-head">
                <div>
                  <div style={{display:'flex', alignItems:'center', gap:6, opacity:0.85, marginBottom:4}}><Icon name="location" size={14}/><span style={{fontSize:12}}>Alhambra, CA · {zip}</span></div>
                  <div style={{fontSize:11, opacity:0.6, letterSpacing:'0.05em', textTransform:'uppercase'}}>Tuesday · 2:14 PM</div>
                </div>
                <div className="wx-score ok">Perfect</div>
              </div>
              <div className="wx-widget-now">
                <div><div className="temp">72<sup>°F</sup></div><div className="cond">Sunny · feels like 74°</div></div>
                <WxIcon type="sun" size={76}/>
              </div>
              <div className="wx-widget-metrics">
                <div className="m"><div className="v">0%</div><div className="l">Precip</div></div>
                <div className="m"><div className="v">6 mph</div><div className="l">Wind</div></div>
                <div className="m"><div className="v">42%</div><div className="l">Humidity</div></div>
              </div>
              <div style={{marginTop:24, padding:'14px', background:'rgba(255,255,255,0.08)', borderRadius:8, display:'flex', gap:10, alignItems:'flex-start', fontSize:13, lineHeight:1.55}}>
                <Icon name="checkCircle" size={18} color="#4ADE80"/>
                <div>All four detail conditions are ideal. Perfect day to lock in a Signature Detail. Next 4 hours are the sweet spot.</div>
              </div>
            </div>
            <div className="card" style={{padding:0, overflow:'hidden'}}>
              <div style={{padding:'var(--sp-6)', borderBottom:'1px solid var(--divider-soft)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div><h3 style={{marginBottom:4}}>7-day detail forecast</h3><div style={{fontSize:13, color:'var(--text-mute)'}}>Green = ideal · Yellow = acceptable · Red = skip</div></div>
                <div style={{position:'relative'}}>
                  <input className="mono" value={zip} onChange={(e)=>setZip(e.target.value)} style={{padding:'8px 12px 8px 34px', border:'1px solid var(--divider-soft)', borderRadius:'var(--r-sm)', fontSize:14, width:120}} />
                  <span style={{position:'absolute', left:10, top:11, pointerEvents:'none'}}><Icon name="search" size={14} color="var(--text-mute)"/></span>
                </div>
              </div>
              <table className="table">
                <thead><tr><th style={{paddingLeft:24}}>Day</th><th></th><th>Hi / Lo</th><th>Precip</th><th>Wind</th><th>Humidity</th><th>Verdict</th><th style={{paddingRight:24}}></th></tr></thead>
                <tbody>
                  {WEATHER_FORECAST.map((d,i) => (
                    <tr key={i}>
                      <td style={{paddingLeft:24}}><div style={{fontWeight:600, color:'var(--navy)'}}>{d.dow}</div><div style={{fontSize:12, color:'var(--text-mute)'}}>{d.date}</div></td>
                      <td><WxIcon type={d.icon} size={28}/></td>
                      <td className="mono">{d.hi}° / {d.lo}°</td>
                      <td className="mono">{d.precip}%</td>
                      <td className="mono">{d.wind} mph</td>
                      <td className="mono">{d.humidity}%</td>
                      <td><span className={`badge ${d.scoreClass === 'ok' ? 'ok' : d.scoreClass === 'warn' ? 'warn' : 'pending'}`}><span className="dot"></span>{d.score}</span></td>
                      <td style={{paddingRight:24, textAlign:'right'}}>
                        {d.scoreClass === 'ok' ? <Button variant="tertiary" size="sm" onClick={() => go('book/1')} iconRight="arrow">Book</Button> : <span style={{color:'var(--text-mute)', fontSize:13}}>·</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WeatherPage;
