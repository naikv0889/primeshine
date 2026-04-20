import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { getBookings, getVehicles, getReviews, updateBooking, createVehicle, deleteVehicle } from '../../lib/api';
import { supabase } from '../../lib/supabase';
import { PORTAL_BOOKINGS, PORTAL_VEHICLES, WEATHER_FORECAST } from '../../data/reviews';
import { SERVICES } from '../../data/services';
import { VEHICLE_ICONS } from '../../data/vehicles';
import Icon from '../../components/Icon';
import Button from '../../components/Button';
import Stars from '../../components/Stars';
import WxIcon from '../../components/WxIcon';

// Format a booking from Supabase shape to display shape
const fmtBooking = (b) => {
  const d = new Date(b.scheduled_date);
  const svc = SERVICES.find(s => s.id === b.service_id);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return {
    id: b.booking_number || b.id,
    date: `${months[d.getMonth()]} ${d.getDate()}`,
    day: d.getDate(),
    month: months[d.getMonth()],
    time: b.scheduled_time,
    svc: svc?.name || b.service_id,
    vehicle: b.vehicles ? `${b.vehicles.year} ${b.vehicles.make} ${b.vehicles.model}` : '',
    status: b.status.charAt(0).toUpperCase() + b.status.slice(1),
    statusClass: b.status === 'confirmed' ? 'ok' : b.status === 'completed' ? 'info' : b.status === 'cancelled' ? 'red' : 'pending',
    addr: b.address || '',
    price: b.total || 0,
    _raw: b,
  };
};

const PortalOverview = ({ navigate, setTab, bookings, userName }) => {
  const next = bookings.find(b => b.status === 'Confirmed');
  return (
    <div className="fade-in">
      <div className="dash-head">
        <div><div style={{fontSize:13, color:'var(--text-mute)', letterSpacing:'0.05em', textTransform:'uppercase', fontWeight:600}}>Welcome back</div><h1>{userName}</h1></div>
        <Button variant="primary" onClick={() => navigate('/book/1')} icon="plus">Book a detail</Button>
      </div>
      {next && (
        <div style={{background:'linear-gradient(135deg, var(--navy) 0%, #1C3057 100%)', color:'#fff', padding:32, borderRadius:'var(--r-lg)', marginBottom:32, position:'relative', overflow:'hidden'}}>
          <div style={{position:'absolute', top:0, right:0, width:240, height:240, background:'radial-gradient(circle at 100% 0%, rgba(188,49,40,0.2), transparent 60%)'}}/>
          <div style={{position:'relative', display:'grid', gridTemplateColumns:'1fr auto', gap:32, alignItems:'center'}}>
            <div>
              <div style={{fontSize:12, letterSpacing:'0.12em', textTransform:'uppercase', opacity:0.7, fontWeight:600}}>Your next detail</div>
              <h2 style={{color:'#fff', fontSize:30, marginTop:8, marginBottom:4}}>{next.svc} · {next.vehicle}</h2>
              <div style={{fontSize:16, opacity:0.85, marginBottom:20}}>{next.date} · {next.time}</div>
              <div style={{display:'flex', gap:24, flexWrap:'wrap', fontSize:13, opacity:0.85}}>
                {next.addr && <div style={{display:'flex', gap:8, alignItems:'center'}}><Icon name="location" size={14}/> {next.addr}</div>}
                <div style={{display:'flex', gap:8, alignItems:'center'}}><WxIcon type="sun" size={16}/><span>Ideal conditions</span></div>
              </div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{display:'flex', gap:8, justifyContent:'flex-end', marginTop:20}}>
                <Button variant="on-dark" size="sm">Reschedule</Button>
                <Button variant="ghost" size="sm" onClick={() => setTab('bookings')}>Details</Button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="kpi-grid" style={{gridTemplateColumns:'repeat(4, 1fr)'}}>
        {[
          {l:'Details completed', v: String(bookings.filter(b => b.status === 'Completed').length), d: 'All time'},
          {l:'Lifetime spend', v: '$' + bookings.reduce((s,b) => s + b.price, 0).toLocaleString(), d: 'Total'},
          {l:'Last review', v: '5.0', d: 'Keep it up'},
          {l:'Loyalty credit', v: '$25', d: 'Expires in 60 days'},
        ].map((k,i) => (
          <div key={i} className="kpi"><div className="kpi-lab">{k.l}</div><div className="kpi-val">{k.v}</div><div style={{fontSize:12, color:'var(--text-mute)', marginTop:6}}>{k.d}</div></div>
        ))}
      </div>
      <div className="dash-row" style={{marginTop:24}}>
        <div className="dash-card">
          <div className="dash-card-head"><h3>Recent bookings</h3><a style={{fontSize:13, fontWeight:600, cursor:'pointer'}} onClick={() => setTab('bookings')}>View all →</a></div>
          <div className="portal-bookings">
            {bookings.slice(0,3).map(b => (
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
            <div><div style={{fontSize:12, opacity:0.85}}>Your next slot</div><div style={{fontSize:11, opacity:0.6, letterSpacing:'0.05em', textTransform:'uppercase'}}>{next ? `${next.date}, ${next.time}` : 'None booked'}</div></div>
            <div className="wx-score ok">Ideal</div>
          </div>
          <div className="wx-widget-now"><div><div className="temp">72<sup>°</sup></div><div className="cond">Sunny</div></div><WxIcon type="sun" size={56}/></div>
          <div style={{marginTop:20, fontSize:12, opacity:0.8, lineHeight:1.5}}>Forecast holding steady. We'll text you if anything changes within 24 hours of your slot.</div>
        </div>
      </div>
    </div>
  );
};

const PortalBookings = ({ navigate, bookings, onCancel }) => (
  <div className="fade-in">
    <div className="dash-head"><div><h1>My bookings</h1><p className="muted" style={{marginTop:4}}>Upcoming and past detail jobs.</p></div><Button variant="primary" icon="plus" onClick={() => navigate('/book/1')}>New booking</Button></div>
    <div className="portal-bookings">
      {bookings.map(b => (
        <div key={b.id} className="pb-item">
          <div className="pb-when"><div className="d">{b.day}</div><div className="m">{b.month}</div></div>
          <div className="pb-body">
            <div style={{display:'flex', gap:10, alignItems:'center'}}><div className="tt">{b.svc}</div><span className="mono" style={{fontSize:12, color:'var(--text-mute)'}}>#{b.id}</span></div>
            <div className="sub">{b.vehicle} · {b.time} · {b.addr}</div>
            <div className="chips"><span className={`badge ${b.statusClass}`}><span className="dot"/>{b.status}</span><span className="badge pending">${b.price}</span></div>
          </div>
          <div style={{display:'flex', gap:8}}>
            {b.status === 'Confirmed' ? (
              <>
                <Button variant="secondary" size="sm">Reschedule</Button>
                <Button variant="danger" size="sm" onClick={() => onCancel(b)}>Cancel</Button>
              </>
            ) : (
              <>
                <Button variant="secondary" size="sm" icon="star">Review</Button>
                <Button variant="tertiary" size="sm" icon="download">Receipt</Button>
              </>
            )}
          </div>
        </div>
      ))}
      {bookings.length === 0 && (
        <div style={{textAlign:'center', padding:40, color:'var(--text-mute)'}}>
          <p>No bookings yet.</p>
          <Button variant="primary" onClick={() => navigate('/book/1')} style={{marginTop:16}}>Book your first detail</Button>
        </div>
      )}
    </div>
  </div>
);

const PortalVehicles = ({ vehicles, onAdd, onDelete }) => {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ make: '', model: '', year: '', color: '', plate: '' });

  const handleAdd = async () => {
    if (!form.make || !form.model) return;
    await onAdd({ ...form, year: parseInt(form.year) || null, vehicle_type: 'sedan', is_primary: vehicles.length === 0 });
    setForm({ make: '', model: '', year: '', color: '', plate: '' });
    setAdding(false);
  };

  return (
    <div className="fade-in">
      <div className="dash-head"><div><h1>My vehicles</h1><p className="muted" style={{marginTop:4}}>Save vehicles for faster booking.</p></div><Button variant="primary" icon="plus" onClick={() => setAdding(true)}>Add vehicle</Button></div>
      {adding && (
        <div className="dash-card fade-in" style={{marginBottom:16}}>
          <h3 style={{marginBottom:16}}>New vehicle</h3>
          <div className="field-row">
            <div className="field"><label>Make</label><input placeholder="Honda" value={form.make} onChange={e => setForm({...form, make: e.target.value})}/></div>
            <div className="field"><label>Model</label><input placeholder="Civic" value={form.model} onChange={e => setForm({...form, model: e.target.value})}/></div>
          </div>
          <div className="field-row">
            <div className="field"><label>Year</label><input placeholder="2021" value={form.year} onChange={e => setForm({...form, year: e.target.value})}/></div>
            <div className="field"><label>Color</label><input placeholder="Pearl White" value={form.color} onChange={e => setForm({...form, color: e.target.value})}/></div>
            <div className="field"><label>Plate</label><input placeholder="7ABC123" value={form.plate} onChange={e => setForm({...form, plate: e.target.value})}/></div>
          </div>
          <div style={{display:'flex', gap:8}}>
            <Button variant="primary" onClick={handleAdd} disabled={!form.make || !form.model}>Save vehicle</Button>
            <Button variant="tertiary" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </div>
      )}
      <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:16}}>
        {vehicles.map(v => (
          <div key={v.id} className="dash-card" style={{display:'flex', gap:20, padding:24}}>
            <div style={{width:120, height:80, background:'var(--muted)', borderRadius:'var(--r-md)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--navy)', flexShrink:0}}>{VEHICLE_ICONS[v.vehicle_type || 'sedan']}</div>
            <div style={{flex:1}}>
              <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:2}}>
                <h3 style={{fontSize:18}}>{v.year} {v.make} {v.model}</h3>
                {v.isPrimary && <span className="badge red">Primary</span>}
                {v.is_primary && <span className="badge red">Primary</span>}
              </div>
              <div style={{fontSize:13, color:'var(--text-mute)'}}>{v.color}{v.plate ? ` · ${v.plate}` : ''}</div>
              <div style={{display:'flex', gap:6, marginTop:14}}>
                <Button variant="tertiary" size="sm" icon="edit">Edit</Button>
                <Button variant="tertiary" size="sm" icon="trash" onClick={() => onDelete(v.id)}>Remove</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

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

const PortalSettings = ({ userName }) => {
  const { user: authUser, profile } = useAuth();
  const [profileForm, setProfileForm] = useState({
    name: profile?.full_name || userName || 'Sam Rivera',
    email: profile?.email || 'sam@example.com',
    phone: profile?.phone || '(626) 555-0112',
    address: profile?.default_address || '412 Los Robles Ave, Pasadena CA 91101',
  });
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState([true, true, true, false]);
  const toggleNotif = (idx) => { const n = [...notifs]; n[idx] = !n[idx]; setNotifs(n); };

  const saveProfile = async () => {
    if (supabase && authUser) {
      await supabase.from('profiles').update({
        full_name: profileForm.name,
        phone: profileForm.phone,
        default_address: profileForm.address,
      }).eq('id', authUser.id);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const notifItems = [
    {t:'Booking confirmations',d:'Email + SMS when we confirm a slot'},
    {t:'Arrival updates',d:'"10 min out" text from your detailer'},
    {t:'Weather alerts',d:'Proactive rescheduling suggestions'},
    {t:'Marketing',d:'Seasonal specials, no more than monthly'},
  ];

  return (
    <div className="fade-in">
      <div className="dash-head"><div><h1>Settings</h1></div></div>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:24}}>
        <div className="dash-card">
          <h3 style={{marginBottom:20}}>Profile</h3>
          <div className="field"><label>Full name</label><input value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})}/></div>
          <div className="field"><label>Email</label><input value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})}/></div>
          <div className="field"><label>Phone</label><input value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})}/></div>
          <div className="field"><label>Default address</label><input value={profileForm.address} onChange={e => setProfileForm({...profileForm, address: e.target.value})}/></div>
          <div style={{display:'flex', gap:12, alignItems:'center'}}>
            <Button variant="primary" onClick={saveProfile}>Save changes</Button>
            {saved && <span className="fade-in" style={{fontSize:13, color:'var(--success)', fontWeight:600}}>Saved!</span>}
          </div>
        </div>
        <div className="dash-card">
          <h3 style={{marginBottom:20}}>Notifications</h3>
          {notifItems.map((n,i) => (
            <div key={i} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 0', borderBottom: i<3 ? '1px dashed var(--divider-soft)' : ''}}>
              <div><div style={{fontWeight:600, color:'var(--navy)', fontSize:14}}>{n.t}</div><div style={{fontSize:12, color:'var(--text-mute)', marginTop:2}}>{n.d}</div></div>
              <div onClick={() => toggleNotif(i)} style={{width:44, height:24, borderRadius:12, background: notifs[i] ? 'var(--red)' : 'var(--divider)', position:'relative', cursor:'pointer', transition:'all 0.3s var(--ease)'}}>
                <div style={{position:'absolute', top:2, [notifs[i] ? 'right' : 'left']: 2, width:20, height:20, background:'#fff', borderRadius:'50%', boxShadow:'0 1px 3px rgba(0,0,0,0.15)', transition:'all 0.3s var(--ease)'}}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PortalPage = () => {
  const [tab, setTab] = useState('overview');
  const navigate = useNavigate();
  const { user: authUser, profile } = useAuth();

  // Data state — starts with mock data, replaced by live data if Supabase is configured
  const [bookings, setBookings] = useState(PORTAL_BOOKINGS);
  const [vehicles, setVehicles] = useState(PORTAL_VEHICLES);
  const [loading, setLoading] = useState(false);

  const userName = profile?.full_name || 'Sam Rivera';

  const loadData = useCallback(async () => {
    if (!supabase || !authUser) return;
    setLoading(true);
    const [bRes, vRes] = await Promise.all([
      getBookings(authUser.id),
      getVehicles(authUser.id),
    ]);
    if (bRes.data?.length) setBookings(bRes.data.map(fmtBooking));
    if (vRes.data?.length) setVehicles(vRes.data);
    setLoading(false);
  }, [authUser]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCancel = async (booking) => {
    if (booking._raw) {
      await updateBooking(booking._raw.id, { status: 'cancelled' });
    }
    setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: 'Cancelled', statusClass: 'red' } : b));
  };

  const handleAddVehicle = async (v) => {
    if (supabase && authUser) {
      const { data } = await createVehicle({ ...v, owner_id: authUser.id });
      if (data) { await loadData(); return; }
    }
    setVehicles(prev => [...prev, { ...v, id: 'V' + Date.now(), visits: 0 }]);
  };

  const handleDeleteVehicle = async (id) => {
    await deleteVehicle(id);
    setVehicles(prev => prev.filter(v => v.id !== id));
  };

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
        {loading && <div style={{textAlign:'center', padding:40, color:'var(--text-mute)'}}>Loading...</div>}
        {!loading && tab === 'overview' && <PortalOverview navigate={navigate} setTab={setTab} bookings={bookings} userName={userName}/>}
        {!loading && tab === 'bookings' && <PortalBookings navigate={navigate} bookings={bookings} onCancel={handleCancel}/>}
        {!loading && tab === 'vehicles' && <PortalVehicles vehicles={vehicles} onAdd={handleAddVehicle} onDelete={handleDeleteVehicle}/>}
        {!loading && tab === 'payments' && <PortalPayments/>}
        {!loading && tab === 'reviews' && <PortalReviews/>}
        {!loading && tab === 'settings' && <PortalSettings userName={userName}/>}
      </main>
    </div>
  );
};

export default PortalPage;
