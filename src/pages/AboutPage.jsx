import Icon from '../components/Icon';
import Eyebrow from '../components/Eyebrow';

const AboutPage = () => (
  <div className="page page-enter">
    <section className="section">
      <div className="container">
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center'}}>
          <div>
            <Eyebrow>About</Eyebrow>
            <h1 style={{marginTop:16, marginBottom:24}}>A family shop that happens to drive to you.</h1>
            <p style={{fontSize:17, color:'var(--text)', marginBottom:20, lineHeight:1.7}}>PrimeShine started in 2019 in a single-car garage in Alhambra. Jason Morales ran a detailing bay for a Mercedes dealership for nine years before deciding the real opportunity was the 98% of customers who can't spare a half-day at a shop.</p>
            <p style={{fontSize:17, color:'var(--text)', marginBottom:20, lineHeight:1.7}}>Six years and three trucks later, we still hand-wash every car. Still call you by name. Still send the same tech to your driveway if you want.</p>
            <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:24, marginTop:32, paddingTop:32, borderTop:'1px solid var(--divider-soft)'}}>
              <div><div style={{fontSize:32, fontWeight:700, color:'var(--navy)'}}>3,200+</div><div style={{fontSize:12, color:'var(--text-mute)', letterSpacing:'0.05em', textTransform:'uppercase'}}>Cars detailed</div></div>
              <div><div style={{fontSize:32, fontWeight:700, color:'var(--navy)'}}>4.97</div><div style={{fontSize:12, color:'var(--text-mute)', letterSpacing:'0.05em', textTransform:'uppercase'}}>Avg review</div></div>
              <div><div style={{fontSize:32, fontWeight:700, color:'var(--navy)'}}>62%</div><div style={{fontSize:12, color:'var(--text-mute)', letterSpacing:'0.05em', textTransform:'uppercase'}}>Repeat rate</div></div>
            </div>
          </div>
          <div style={{aspectRatio:'4/5', borderRadius:'var(--r-xl)', background:'var(--navy)', boxShadow:'var(--sh-lg)', position:'relative', overflow:'hidden'}}>
            <div style={{position:'absolute', inset:0, background:'repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0 10px, rgba(255,255,255,0.04) 10px 20px)'}}/>
            <div style={{position:'absolute', left:24, bottom:24, right:24, background:'rgba(255,255,255,0.96)', padding:24, borderRadius:'var(--r-lg)'}}>
              <div style={{fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--red)', fontWeight:600}}>Founder</div>
              <h3 style={{marginTop:4}}>Jason Morales</h3>
              <p style={{fontSize:14, marginTop:8, color:'var(--text-mute)'}}>"If I wouldn't park my own car next to yours, we're not done."</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="section muted">
      <div className="container">
        <div className="section-head">
          <div><Eyebrow variant="navy">Why mobile</Eyebrow><h2 style={{marginTop:16}}>The case for driveway detailing.</h2></div>
          <p>Fixed-location detail shops charge for the building. We charge for the work.</p>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16}}>
          {[
            { t: 'You don\'t move', d: 'Zero drive time, zero waiting-room coffee. Keep working, we handle the car.', icon: 'home' },
            { t: 'We bring it all', d: 'Our van carries 40 gallons of filtered water, two 200-amp outlets, and a full wax-deck.', icon: 'zap' },
            { t: 'One tech, every time', d: 'Regulars get the same detailer on every visit. They know which spot your 4-year-old hits.', icon: 'users' },
          ].map((f,i) => (
            <div key={i} className="card">
              <div style={{width:44, height:44, background:'var(--red-bg)', borderRadius:'var(--r-md)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--red)', marginBottom:16}}>
                <Icon name={f.icon} size={22}/>
              </div>
              <h3 style={{fontSize:18, marginBottom:8}}>{f.t}</h3>
              <p style={{fontSize:14, lineHeight:1.6}}>{f.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default AboutPage;
