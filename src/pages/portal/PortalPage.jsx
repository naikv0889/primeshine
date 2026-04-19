import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PORTAL_BOOKINGS, PORTAL_VEHICLES, WEATHER_FORECAST } from '../../data/reviews';
import { VEHICLE_ICONS } from '../../data/vehicles';
import Icon from '../../components/Icon';
import Button from '../../components/Button';
import Stars from '../../components/Stars';
import WxIcon from '../../components/WxIcon';

const PortalOverview = ({ navigate, setTab }) => (
  <div className="fade-in">
    <div className="dash-head">
      <div><div style={{fontSize:13, color:'var(--text-mute)', letterSpacing:'0.05em', textTransform:'uppercase', fontWeight:600}}>Welcome back</div><h1>Sam Rivera</h1></div>
      <Button variant="primary" onClick={() => navigate('/book/1')} icon="plus">Book a detail</Button>
    </div>
    <div style={{background:'linear-gradient(135deg, var(--navy) 0%, #1C3057 100%)', color:'#fff', padding:32, borderRadius:'var(--r-lg)', marginBottom:32, position:'relative', overflow:'hidden'}}>
      <div style={{position:'absolute', top:0, right:0, width:240, height:240, background:'radial-gradient(circle at 100% 0%, rgba(188,49,40,0.2), transparent 60%)'}}/>
      <div style={{position:'relative', display:'grid', gridTemplateColumns:'1fr auto', gap:32, alignItems:'center'}}>
        <div>
          <div style={{fontSize:12, letterSpacing:'0.12em', textTransform:'uppercase', opacity:0.7, fontWeight:600}}>Your next detail</div>
          <h2 style={{color:'#fff', fontSize:30, marginTop:8, marginBottom:4}}>Signature Detail · 2021 Honda Civic</h2>
          <div style={{fontSize:16, opacity:0.85, marginBottom:20}}>Friday, March 14 · 10:00 AM – 12:30 PM</div>
          <div style={{display:'flex', gap:24, flexWrap:'wrap', fontSize:13, opacity:0.85}}>
            <div style={{display:'flex', gap:8, alignItems:'center'}}><Icon name="location" size={14}/> 412 Los Robles Ave</div>
            <div style={{display:'flex', gap:8, alignItems:'center'}}><Icon name="user" size={14}/> Jason M.</div>
            <div style={{display:'flex', gap:8, alignItems:'center'}}><WxIcon type="sun" size={16}/><span>72°, sunny. Ideal conditions</span></div>
          </div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:11, opacity:0.6, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:6}}>In</div>
          <div style={{fontSize:54, fontWeight:700, letterSpacing:'-0.02em', lineHeight:1}}>2<span style={{fontSize:22, marginLeft:4, opacity:0.8}}>days</span></div>
          <div style={{display:'flex', gap:8, justifyContent:'flex-end', marginTop:20}}>
            <Button variant="on-dark" size="sm">Reschedule</Button>
            <Button variant="ghost" size="sm" onClick={() => setTab('bookings')}>Details</Button>
          </div>
        </div>
      </div>
    </div>
    <div className="kpi-grid" style={{gridTemplateColumns:'repeat(4, 1fr)'}}>
      {[{l:'Details completed',v:'14',d:'+2 this quarter'},{l:'Lifetime spend',v:'$2,180',d:'Tier: Regular'},{l:'Last review',v:'5.0',d:'Feb 22 · Express'},{l:'Loyalty credit',v:'$25',d:'Expires in 60 days'}].map((k,i) => (
        <div key={i} className="kpi"><div className="kpi-lab">{k.l}</div><div className="kpi-val">{k.v}</div><div style={{fontSize:12, color:'var(--text-mute)', marginTop:6}}>{k.d}</div></div>
      ))}
    </div>
    <div className="dash-row" style={{marginTop:24}}>
      <div className="dash-card">
        <div className="dash-card-head"><h3>Recent bookings</h3><a style={{fontSize:13, fontWeight:600, cursor:'pointer'}} onClick={() => setTab('bookings')}>View all →</a></div>
        <div className="portal-bookings">
          {PORTAL_BOOKINGS.slice(0,3).map(b => (
            <div key={b.id} className="pb-item" style={{padding:16, boxShadow:'none', border:'1px solid var(--divider-soft)'}}>
              <div className="pb-when"><div className="d">{b.day}</div><div className="m">{b.month}</div></div>
              <div className="pb-body"><div className="tt">{b.svc}</div><div className="sub">{b.vehicle} · {b.time}</div></div>
              <div><span className={`badge ${b.statusClass}`}><span className="dot"/>{b.status}</span></div>
            </div>
          ))}
        </div>
      </div>
      <div className="wx-widget" style={{padding:'var(--sp-5)'}}>
        <div className="wx-widget-head">
          <div><div style={{fontSize:12, opacity:0.85}}>Your next slot</div><div style={{fontSize:11, opacity:0.6, letterSpacing:'0.05em', textTransform:'uppercase'}}>Mar 14, 10 AM</div></div>
          <div className="wx-score ok">Ideal</div>
        </div>
        <div className="wx-widget-now"><div><div className="temp">72<sup>°</sup></div><div className="cond">Sunny</div></div><WxIcon type="sun" size={56}/></div>
        <div style={{marginTop:20, fontSize:12, opacity:0.8, lineHeight:1.5}}>Forecast holding steady. We'll text you if anything changes within 24 hours of your slot.</div>
      </div>
    </div>
  </div>
);

const PortalBookings = ({ navigate }) => (
  <div className="fade-in">
    <div className="dash-head"><div><h1>My bookings</h1><p className="muted" style={{marginTop:4}}>Upcoming and past detail jobs.</p></div><Button variant="primary" icon="plus" onClick={() => navigate('/book/1')}>New booking</Button></div>
    <div className="portal-bookings">
      {PORTAL_BOOKINGS.map(b => (
        <div key={b.id} className="pb-item">
          <div className="pb-when"><div className="d">{b.day}</div><div className="m">{b.month}</div></div>
          <div className="pb-body">
            <div style={{display:'flex', gap:10, alignItems:'center'}}><div className="tt">{b.svc}</div><span className="mono" style={{fontSize:12, color:'var(--text-mute)'}}>#{b.id}</span></div>
            <div className="sub">{b.vehicle} · {b.time} · {b.addr}</div>
            <div className="chips"><span className={`badge ${b.statusClass}`}><span className="dot"/>{b.status}</span><span className="badge pending">${b.price}</span></div>
          </div>
          <div style={{display:'flex', gap:8}}>
            {b.status === 'Confirmed' ? (<><Button variant="secondary" size="sm">Reschedule</Button><Button variant="danger" size="sm">Cancel</Button></>) : (<><Button variant="secondary" size="sm" icon="star">Review</Button><Button variant="tertiary" size="sm" icon="download">Receipt</Button></>)}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PortalVehicles = () => (
  <div className="fade-in">
    <div className="dash-head"><div><h1>My vehicles</h1><p className="muted" style={{marginTop:4}}>Save vehicles for faster booking.</p></div><Button variant="primary" icon="plus">Add vehicle</Button></div>
    <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:16}}>
      {PORTAL_VEHICLES.map(v => (
        <div key={v.id} className="dash-card" style={{display:'flex', gap:20, padding:24}}>
          <div style={{width:120, height:80, background:'var(--muted)', borderRadius:'var(--r-md)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--navy)', flexShrink:0}}>{VEHICLE_ICONS.sedan}</div>
          <div style={{flex:1}}>
            <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:2}}><h3 style={{fontSize:18}}>{v.year} {v.make} {v.model}</h3>{v.isPrimary && <span className="badge red">Primary</span>}</div>
            <div style={{fontSize:13, color:'var(--text-mute)'}}>{v.color} · {v.plate}</div>
            <div style={{display:'flex', gap:16, marginTop:14, fontSize:12, color:'var(--text-mute)'}}><div><strong style={{color:'var(--navy)', fontSize:15}}>{v.visits}</strong> visits</div><div><strong style={{color:'var(--navy)', fontSize:15}}>Mar 14</strong> next</div></div>
            <div style={{display:'flex', gap:6, marginTop:14}}><Button variant="tertiary" size="sm" icon="edit">Edit</Button><Button variant="tertiary" size="sm" icon="trash">Remove</Button></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PortalPayments = () => (
  <div className="fade-in">
    <div className="dash-head"><div><h1>Payment methods</h1><p className="muted" style={{marginTop:4}}>Managed securely through Stripe.</p></div><Button variant="primary" icon="plus">Add method</Button></div>
    <div className="dash-card" style={{padding:0}}>
      {[{brand:'VISA',bg:'#1A1F71',num:'•••• 4242',exp:'04/28',primary:true},{brand:'MC',bg:'#EB001B',num:'•••• 5591',exp:'09/26',primary:false},{brand:'Link',bg:'#00D66F',num:'415-***-2194',exp:'Saved device',primary:false}].map((p,i) => (
        <div key={i} style={{display:'flex', alignItems:'center', gap:20, padding:'20px 24px', borderBottom: i < 2 ? '1px solid var(--divider-soft)' : 'none'}}>
          <div style={{width:56, height:36, borderRadius:6, background:p.bg, color: p.brand==='Link'?'#000':'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:13}}>{p.brand}</div>
          <div style={{flex:1}}>
            <div style={{display:'flex', gap:10, alignItems:'center'}}><div style={{fontWeight:600, color:'var(--navy)'}}>{p.num}</div>{p.primary && <span className="badge red">Primary</span>}</div>
            <div style={{fontSize:13, color:'var(--text-mute)', marginTop:2}}>Expires {p.exp}</div>
          </div>
          <Button variant="tertiary" size="sm">Edit</Button><Button variant="tertiary" size="sm">Remove</Button>
        </div>
      ))}
    </div>
    <h2 style={{marginTop:40, marginBottom:16, fontSize:22}}>Receipts</h2>
    <div className="dash-card" style={{padding:0, overflow:'hidden'}}>
      <table className="table"><thead><tr><th style={{paddingLeft:24}}>Date</th><th>Service</th><th>Amount</th><th>Method</th><th style={{paddingRight:24}}></th></tr></thead>
        <tbody>
          {[{d:'Feb 22, 2025',s:'Express Shine',a:59,m:'Visa •••• 4242'},{d:'Jan 30, 2025',s:'Signature Detail',a:169,m:'Visa •••• 4242'},{d:'Dec 12, 2024',s:'Signature + Pet',a:204,m:'Link'},{d:'Oct 5, 2024',s:'Signature Detail',a:159,m:'Mastercard •••• 5591'}].map((r,i) => (
            <tr key={i}><td style={{paddingLeft:24}}>{r.d}</td><td>{r.s}</td><td className="mono">${r.a}</td><td style={{color:'var(--text-mute)'}}>{r.m}</td><td style={{paddingRight:24, textAlign:'right'}}><Button variant="tertiary" size="sm" icon="download">PDF</Button></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const PortalReviews = () => (
  <div className="fade-in">
    <div className="dash-head"><div><h1>My reviews</h1><p className="muted" style={{marginTop:4}}>Share the wins, help us improve the misses.</p></div></div>
    <div style={{display:'grid', gap:16}}>
      <div className="dash-card" style={{background:'var(--red-bg)', borderColor:'rgba(188,49,40,0.2)'}}>
        <div style={{display:'flex', gap:16, alignItems:'flex-start'}}><Icon name="star" size={24} color="var(--red)"/>
          <div style={{flex:1}}><h3 style={{marginBottom:4}}>1 review waiting</h3><p style={{color:'var(--text)', marginBottom:12}}>Your Jan 30 Signature Detail hasn't been reviewed yet. Takes 30 seconds.</p><Button variant="primary" size="sm">Leave review</Button></div>
        </div>
      </div>
      <div className="dash-card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12}}>
          <div><Stars n={5} size={18}/><h3 style={{marginTop:8}}>Express Shine · Feb 22, 2025</h3></div>
          <Button variant="tertiary" size="sm" icon="edit">Edit</Button>
        </div>
        <p style={{color:'var(--text)', lineHeight:1.6}}>"Fast, careful, and the tire shine on my Civic still looks perfect two weeks later. Jason even wiped down a scuff on the driver door without charging extra."</p>
      </div>
    </div>
  </div>
);

const PortalSettings = () => (
  <div className="fade-in">
    <div className="dash-head"><div><h1>Settings</h1></div></div>
    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:24}}>
      <div className="dash-card">
        <h3 style={{marginBottom:20}}>Profile</h3>
        <div className="field"><label>Full name</label><input defaultValue="Sam Rivera"/></div>
        <div className="field"><label>Email</label><input defaultValue="sam@example.com"/></div>
        <div className="field"><label>Phone</label><input defaultValue="(626) 555-0112"/></div>
        <div className="field"><label>Default address</label><input defaultValue="412 Los Robles Ave, Pasadena CA 91101"/></div>
        <Button variant="primary">Save changes</Button>
      </div>
      <div className="dash-card">
        <h3 style={{marginBottom:20}}>Notifications</h3>
        {[{t:'Booking confirmations',d:'Email + SMS when we confirm a slot',on:true},{t:'Arrival updates',d:'"10 min out" text from your detailer',on:true},{t:'Weather alerts',d:'Proactive rescheduling suggestions',on:true},{t:'Marketing',d:'Seasonal specials, no more than monthly',on:false}].map((n,i) => (
          <div key={i} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 0', borderBottom: i<3 ? '1px dashed var(--divider-soft)' : ''}}>
            <div><div style={{fontWeight:600, color:'var(--navy)', fontSize:14}}>{n.t}</div><div style={{fontSize:12, color:'var(--text-mute)', marginTop:2}}>{n.d}</div></div>
            <div style={{width:44, height:24, borderRadius:12, background: n.on ? 'var(--red)' : 'var(--divider)', position:'relative', cursor:'pointer', transition:'all 0.3s var(--ease)'}}>
              <div style={{position:'absolute', top:2, [n.on ? 'right' : 'left']: 2, width:20, height:20, background:'#fff', borderRadius:'50%', boxShadow:'0 1px 3px rgba(0,0,0,0.15)'}}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PortalPage = () => {
  const [tab, setTab] = useState('overview');
  const navigate = useNavigate();
  const sideItems = [
    { id: 'overview', label: 'Overview', icon: 'home' },{ id: 'bookings', label: 'Bookings', icon: 'calendar' },
    { id: 'vehicles', label: 'Vehicles', icon: 'car' },{ id: 'payments', label: 'Payments', icon: 'credit' },
    { id: 'reviews', label: 'My reviews', icon: 'star' },{ id: 'settings', label: 'Settings', icon: 'settings' },
  ];
  return (
    <div className="dash-layout">
      <aside className="dash-side">
        <h6>Account</h6>
        {sideItems.map(i => (<a key={i.id} className={tab === i.id ? 'active' : ''} onClick={() => setTab(i.id)}><Icon name={i.icon} size={17}/> {i.label}</a>))}
        <h6>Quick actions</h6>
        <a onClick={() => navigate('/book/1')}><Icon name="plus" size={17}/> Book new detail</a>
        <a onClick={() => navigate('/weather')}><Icon name="sun" size={17}/> Weather check</a>
      </aside>
      <main className="dash-main">
        {tab === 'overview' && <PortalOverview navigate={navigate} setTab={setTab}/>}
        {tab === 'bookings' && <PortalBookings navigate={navigate}/>}
        {tab === 'vehicles' && <PortalVehicles/>}
        {tab === 'payments' && <PortalPayments/>}
        {tab === 'reviews' && <PortalReviews/>}
        {tab === 'settings' && <PortalSettings/>}
      </main>
    </div>
  );
};

export default PortalPage;
