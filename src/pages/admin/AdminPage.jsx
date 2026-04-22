import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { getAllBookings, getAllReviews, getCustomers, updateBooking, replyToReview } from '../../lib/api';
import { supabase } from '../../lib/supabase';
import { generateFollowUp } from '../../lib/ai';
import { SERVICES, ADDONS } from '../../data/services';
import { WEATHER_FORECAST, ADMIN_BOOKINGS, ADMIN_CUSTOMERS, ADMIN_REVIEWS, PORTAL_VEHICLES } from '../../data/reviews';
import Icon from '../../components/Icon';
import Button from '../../components/Button';
import Stars from '../../components/Stars';
import WxIcon from '../../components/WxIcon';
import { Sparkline, BarChart, LineChart } from '../../components/Charts';

const AdminDashboard = ({ bookings, customers, reviews, userName }) => (
  <div className="fade-in">
    <div className="dash-head">
      <div><div style={{fontSize:13, color:'var(--text-mute)', letterSpacing:'0.05em', textTransform:'uppercase', fontWeight:600}}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div><h1>Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {userName || 'Boss'}</h1></div>
      <div style={{display:'flex', gap:8}}><Button variant="ghost" icon="download" size="sm">Export</Button><Button variant="primary" size="sm" icon="plus">New booking</Button></div>
    </div>
    <div className="kpi-grid">
      {[
        {l:'Revenue this month',v:'$' + bookings.reduce((s,b) => s + (b.total || 0), 0).toLocaleString(),d:`${bookings.length} bookings`,up:true,spark:[6,7,8,7,9,10,11,13,12,14,15,18]},
        {l:'Bookings this week',v:String(bookings.length),d:'Active',up:true,spark:[5,6,7,6,8,7,9]},
        {l:'Active customers',v:String(customers.length),d:'Total',up:true,spark:[280,286,292,298,304,310,customers.length]},
        {l:'Avg rating',v: reviews.length ? (reviews.reduce((s,r) => s + (r.n || r.rating || 0), 0) / reviews.length).toFixed(2) : '4.97',d:'All time',up:true,spark:[4.95,4.96,4.98,4.98,4.97,4.98,4.97]},
      ].map((k,i) => (
        <div key={i} className="kpi"><div className="kpi-lab">{k.l}</div><div className="kpi-val">{k.v}</div><div className={`kpi-delta ${k.up ? 'up' : 'down'}`}><Icon name={k.up ? 'trend' : 'arrow'} size={14}/> {k.d}</div><div className="kpi-spark"><Sparkline values={k.spark}/></div></div>
      ))}
    </div>
    <div className="dash-row">
      <div className="dash-card">
        <div className="dash-card-head"><h3>Revenue, last 12 months</h3><div className="muted-ctrl"><button>Monthly</button><button className="active">Weekly</button><button>Daily</button></div></div>
        <LineChart data={[6200,7100,8400,7900,9200,10100,11500,12800,12400,14200,15900,18420]} labels={['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar']}/>
      </div>
      <div className="dash-card">
        <div className="dash-card-head"><h3>Service mix</h3></div>
        <div style={{display:'flex', flexDirection:'column', gap:16, marginTop:8}}>
          {[{name:'Signature Detail',pct:58,amt:'$10,680'},{name:'Express Shine',pct:22,amt:'$4,060'},{name:'Premier Ceramic',pct:16,amt:'$2,950'},{name:'Add-ons only',pct:4,amt:'$730'}].map((s,i) => (
            <div key={i}><div style={{display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:6}}><span style={{color:'var(--navy)', fontWeight:500}}>{s.name}</span><span className="mono" style={{color:'var(--text-mute)'}}>{s.amt} · {s.pct}%</span></div><div style={{height:8, background:'var(--muted)', borderRadius:4, overflow:'hidden'}}><div style={{height:'100%', width:`${s.pct}%`, background:'var(--red)'}}/></div></div>
          ))}
        </div>
      </div>
    </div>
    <div className="dash-row">
      <div className="dash-card">
        <div className="dash-card-head"><h3>Today's schedule</h3><a style={{fontSize:13, fontWeight:600, color:'var(--red)', cursor:'pointer'}}>View calendar →</a></div>
        <table className="table"><thead><tr><th>Time</th><th>Customer</th><th>Service</th><th>Tech</th><th>Status</th></tr></thead>
          <tbody>{bookings.slice(0,3).map(b => (<tr key={b.id}><td className="mono">{(b.when || '').split('·')[1]?.trim() || b.scheduled_time || ''}</td><td><strong style={{color:'var(--navy)'}}>{b.customer || b.profiles?.full_name || ''}</strong></td><td>{b.svc || SERVICES.find(s => s.id === b.service_id)?.name || ''}</td><td>{b.tech || b.assigned_to || ''}</td><td><span className={`badge ${b.statusClass || 'ok'}`}><span className="dot"/>{b.status}</span></td></tr>))}</tbody>
        </table>
      </div>
      <div className="wx-widget">
        <div className="wx-widget-head"><div><div style={{fontSize:12, opacity:0.85}}>Operations forecast</div><div style={{fontSize:11, opacity:0.6, letterSpacing:'0.05em', textTransform:'uppercase'}}>This week</div></div><div className="wx-score warn">2 rain days</div></div>
        <div style={{marginTop:16, fontSize:13, opacity:0.85}}>Saturday–Sunday show 70–80% rain. Check bookings for rescheduling.</div>
        <div className="wx-7day">
          {WEATHER_FORECAST.map((d,i) => (<div key={i} className={`d ${d.scoreClass === 'warn' ? '' : 'best'}`} style={{opacity: d.scoreClass === 'warn' ? 0.5 : 1}}><div className="dow">{d.dow.slice(0,3)}</div><WxIcon type={d.icon} size={20}/><div className="hi">{d.hi}°</div></div>))}
        </div>
        <Button variant="on-dark" size="sm">Auto-reschedule affected</Button>
      </div>
    </div>
    <div className="dash-row thirds">
      <div className="dash-card"><div className="dash-card-head"><h3>Recent reviews</h3></div>
        {reviews.slice(0,3).map((r,i) => (<div key={i} style={{padding:'12px 0', borderBottom: i < 2 ? '1px dashed var(--divider-soft)' : ''}}><div style={{display:'flex', justifyContent:'space-between', marginBottom:4}}><strong style={{color:'var(--navy)', fontSize:14}}>{r.customer || r.profiles?.full_name || ''}</strong><Stars n={r.n || r.rating || 5} size={12}/></div><div style={{fontSize:13, color:'var(--text)', lineHeight:1.5}}>{(r.text || r.body || '').slice(0, 80)}…</div></div>))}
      </div>
      <div className="dash-card"><div className="dash-card-head"><h3>Top customers</h3></div>
        {customers.filter(c => (c.tag === 'VIP') || (c.spent > 2000)).slice(0,3).map((c,i) => (<div key={i} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom: i < 1 ? '1px dashed var(--divider-soft)' : ''}}><div><div style={{fontWeight:600, color:'var(--navy)', fontSize:14}}>{c.name || c.full_name || ''}</div><div style={{fontSize:12, color:'var(--text-mute)'}}>{c.visits} visits</div></div><div className="mono" style={{fontWeight:600, color:'var(--navy)'}}>${c.spent}</div></div>))}
      </div>
      <div className="dash-card"><div className="dash-card-head"><h3>Jobs per day</h3></div><BarChart data={[4,6,7,5,8,9,3]} labels={['M','T','W','T','F','S','S']} h={170}/></div>
    </div>
  </div>
);

const AdminBookings = ({ bookings }) => (
  <div className="fade-in">
    <div className="dash-head"><div><h1>Bookings</h1><p className="muted" style={{marginTop:4}}>{bookings.length} total</p></div>
      <div style={{display:'flex', gap:8}}><Button variant="ghost" icon="filter" size="sm">Filter</Button><Button variant="ghost" icon="download" size="sm">Export</Button><Button variant="primary" size="sm" icon="plus">New booking</Button></div>
    </div>
    <div className="dash-card" style={{padding:0, overflow:'hidden'}}>
      <table className="table"><thead><tr><th style={{paddingLeft:24}}>ID</th><th>Customer</th><th>Service</th><th>When</th><th>Tech</th><th>Total</th><th>Status</th><th style={{paddingRight:24}}></th></tr></thead>
        <tbody>{bookings.map(b => (<tr key={b.id}><td style={{paddingLeft:24}} className="mono">#{b.id || b.booking_number}</td><td><strong style={{color:'var(--navy)'}}>{b.customer || b.profiles?.full_name || ''}</strong></td><td>{b.svc || SERVICES.find(s => s.id === b.service_id)?.name || ''}</td><td>{b.when || b.scheduled_date || ''}</td><td>{b.tech || b.assigned_to || ''}</td><td className="mono">${b.total}</td><td><span className={`badge ${b.statusClass || 'ok'}`}><span className="dot"/>{b.status}</span></td><td style={{paddingRight:24, textAlign:'right'}}><Button variant="tertiary" size="sm" icon="dots"/></td></tr>))}</tbody>
      </table>
    </div>
  </div>
);

const AdminCustomers = ({ customers, setDetailId, setImportOpen }) => {
  const [search, setSearch] = useState('');
  const filtered = customers.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (c.name || c.full_name || '').toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q) || (c.phone || '').includes(q);
  });

  return (
    <div className="fade-in">
      <div className="dash-head"><div><h1>Customers</h1><p className="muted" style={{marginTop:4}}>{customers.length} total</p></div>
        <div style={{display:'flex', gap:8}}><Button variant="ghost" icon="upload" size="sm" onClick={() => setImportOpen(true)}>Import CSV</Button><Button variant="primary" size="sm" icon="plus">Add customer</Button></div>
      </div>
      <div style={{display:'flex', gap:12, marginBottom:16}}>
        <div style={{position:'relative', flex:1}}>
          <input placeholder="Search by name, email, or phone…" value={search} onChange={e => setSearch(e.target.value)} style={{width:'100%', padding:'11px 14px 11px 40px', border:'1px solid var(--divider-soft)', borderRadius:'var(--r-md)', fontSize:14, fontFamily:'inherit'}}/>
          <span style={{position:'absolute', left:14, top:12, pointerEvents:'none', color:'var(--text-mute)'}}><Icon name="search" size={16}/></span>
        </div>
        <Button variant="ghost" icon="filter">Tag</Button><Button variant="ghost" icon="filter">Last visit</Button>
      </div>
      <div className="dash-card" style={{padding:0, overflow:'hidden'}}>
        <table className="table"><thead><tr><th style={{paddingLeft:24}}>Customer</th><th>Contact</th><th>Visits</th><th>Spent</th><th>Last visit</th><th>Tag</th><th style={{paddingRight:24}}></th></tr></thead>
          <tbody>{filtered.map(c => (
            <tr key={c.id} style={{cursor:'pointer'}} onClick={() => setDetailId(c.id)}>
              <td style={{paddingLeft:24}}><div style={{display:'flex', gap:12, alignItems:'center'}}><div style={{width:36, height:36, borderRadius:'50%', background:'var(--navy)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:600}}>{(c.name || c.full_name || '').split(' ').map(n=>n[0]).join('')}</div><div><div style={{fontWeight:600, color:'var(--navy)'}}>{c.name || c.full_name}</div><div className="mono" style={{fontSize:11, color:'var(--text-mute)'}}>#{c.id}</div></div></div></td>
              <td><div style={{fontSize:13}}>{c.email}</div><div style={{fontSize:12, color:'var(--text-mute)'}}>{c.phone}</div></td>
              <td className="mono">{c.visits}</td><td className="mono" style={{fontWeight:600}}>${c.spent}</td><td>{c.last || ''}</td><td><span className={`badge ${c.tagClass || 'ok'}`}>{c.tag || 'Regular'}</span></td>
              <td style={{paddingRight:24, textAlign:'right'}}><Icon name="chevR" size={16} color="var(--text-mute)"/></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
};

const AdminCustomerDetail = ({ id, customers, bookings, setDetailId }) => {
  const c = customers.find(x => x.id === id) || customers[0];
  const [followUp, setFollowUp] = useState(null);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [followUpError, setFollowUpError] = useState(null);
  const customerBookings = bookings.filter(b => (b.customer_id || b.customerId) === id);

  const handleFollowUp = async () => {
    setFollowUpLoading(true);
    setFollowUpError(null);
    const { data, error } = await generateFollowUp(id);
    setFollowUpLoading(false);
    if (error) { setFollowUpError(error.message); return; }
    setFollowUp(data);
  };

  if (!c) return null;
  return (
    <div className="fade-in">
      <Button variant="tertiary" size="sm" icon="arrowLeft" onClick={() => setDetailId(null)}>Back to customers</Button>
      <div className="dash-head" style={{marginTop:16}}>
        <div style={{display:'flex', gap:20, alignItems:'center'}}>
          <div style={{width:72, height:72, borderRadius:'50%', background:'var(--navy)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, fontWeight:600}}>{(c.name || c.full_name || '').split(' ').map(n=>n[0]).join('')}</div>
          <div><div style={{display:'flex', gap:10, alignItems:'center'}}><h1>{c.name || c.full_name}</h1><span className={`badge ${c.tagClass || 'ok'}`}>{c.tag || 'Regular'}</span></div><div style={{color:'var(--text-mute)', marginTop:4, fontSize:14}}>{c.email} · {c.phone} · #{c.id}</div></div>
        </div>
        <div style={{display:'flex', gap:8}}><Button variant="ghost" size="sm" icon="mail">Email</Button><Button variant="ghost" size="sm" icon="message">Text</Button><Button variant="primary" size="sm" icon="plus">New booking</Button></div>
      </div>
      <div className="kpi-grid">
        <div className="kpi"><div className="kpi-lab">Lifetime spend</div><div className="kpi-val">${c.spent || 0}</div></div>
        <div className="kpi"><div className="kpi-lab">Total visits</div><div className="kpi-val">{c.visits || customerBookings.length}</div></div>
        <div className="kpi"><div className="kpi-lab">Last visit</div><div className="kpi-val" style={{fontSize:22}}>{c.last || customerBookings[0]?.scheduled_date || 'N/A'}</div></div>
        <div className="kpi"><div className="kpi-lab">Avg rating left</div><div className="kpi-val">4.8</div></div>
      </div>
      <div className="dash-row">
        <div className="dash-card"><div className="dash-card-head"><h3>Booking history</h3></div>
          {customerBookings.length > 0 ? (
            <table className="table"><thead><tr><th>Date</th><th>Service</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>{customerBookings.map((b,i) => (
                <tr key={i}><td>{b.scheduled_date || b.d}</td><td>{SERVICES.find(s => s.id === b.service_id)?.name || b.svc || b.service_id}</td><td className="mono">${b.total || 0}</td><td><span className={`badge ${b.status === 'completed' ? 'info' : 'ok'}`}><span className="dot"/>{b.status}</span></td></tr>
              ))}</tbody>
            </table>
          ) : (
            <p style={{color:'var(--text-mute)', fontSize:14}}>No bookings yet.</p>
          )}
        </div>
        <div>
          <div className="dash-card">
            <div className="dash-card-head"><h3>AI follow-up</h3></div>
            <p style={{fontSize:13, color:'var(--text-mute)', marginBottom:16}}>Generate a personalized re-engagement text using AI, based on this customer's history.</p>
            {followUpError && <div style={{padding:12, background:'var(--red-bg)', borderRadius:'var(--r-sm)', fontSize:13, color:'var(--red)', marginBottom:12}}>{followUpError}</div>}
            {followUp && (
              <div className="fade-in" style={{padding:16, background:'var(--muted)', borderRadius:'var(--r-md)', marginBottom:16, fontSize:14, lineHeight:1.6, color:'var(--text)'}}>
                <div style={{fontSize:11, textTransform:'uppercase', letterSpacing:'0.08em', fontWeight:600, color:'var(--text-mute)', marginBottom:8}}>Generated message {followUp.model !== 'demo' ? '(AI)' : '(Demo)'}</div>
                "{followUp.text}"
              </div>
            )}
            <Button variant="primary" size="sm" icon="message" onClick={handleFollowUp} disabled={followUpLoading}>
              {followUpLoading ? 'Generating...' : followUp ? 'Regenerate' : 'Generate follow-up'}
            </Button>
          </div>
          <div className="dash-card" style={{marginTop:16}}><h3 style={{marginBottom:12}}>Notes</h3>
            <div style={{padding:12, background:'var(--muted)', borderRadius:'var(--r-sm)', fontSize:13, lineHeight:1.5, color:'var(--text)'}}>Prefers morning slots. Sensitive to citrus scents; use unscented protectant only.</div>
            <Button variant="tertiary" size="sm" icon="edit">Edit notes</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminReviewsTab = ({ reviews, onReply }) => {
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  const handleReply = async (reviewId) => {
    if (!replyText.trim()) return;
    setSending(true);
    await onReply(reviewId, replyText.trim());
    setSending(false);
    setReplyingId(null);
    setReplyText('');
  };

  return (
    <div className="fade-in">
      <div className="dash-head"><div><h1>Reviews</h1><p className="muted" style={{marginTop:4}}>{reviews.length ? `${(reviews.reduce((s,r) => s + (r.n || r.rating || 0), 0) / reviews.length).toFixed(2)} avg · ${reviews.length} total` : 'No reviews yet'}</p></div>
        <div style={{display:'flex', gap:8}}><Button variant="ghost" icon="filter" size="sm">All ratings</Button><Button variant="ghost" icon="filter" size="sm">Unreplied</Button></div>
      </div>
      <div className="dash-card" style={{marginBottom:24}}>
        <div style={{display:'grid', gridTemplateColumns:'auto 1fr', gap:48, alignItems:'center'}}>
          <div style={{textAlign:'center'}}><div style={{fontSize:72, fontWeight:700, color:'var(--navy)', letterSpacing:'-0.03em', lineHeight:1}}>{reviews.length ? (reviews.reduce((s,r) => s + (r.n || r.rating || 0), 0) / reviews.length).toFixed(2) : '—'}</div><Stars n={5} size={18}/><div style={{fontSize:13, color:'var(--text-mute)', marginTop:6}}>Based on {reviews.length} reviews</div></div>
          <div style={{display:'flex', flexDirection:'column', gap:8}}>
            {[5,4,3,2,1].map(s => {
              const count = reviews.filter(r => (r.n || r.rating) === s).length;
              const pct = reviews.length ? Math.round(count / reviews.length * 100) : 0;
              return (
                <div key={s} style={{display:'flex', alignItems:'center', gap:12, fontSize:13}}>
                  <div style={{width:40, display:'flex', gap:4, alignItems:'center'}}>{s}<Icon name="star" size={12} color="#E8A02D"/></div>
                  <div style={{flex:1, height:8, background:'var(--muted)', borderRadius:4, overflow:'hidden'}}><div style={{height:'100%', width:`${pct}%`, background:'#E8A02D', borderRadius:4}}/></div>
                  <div className="mono" style={{width:40, textAlign:'right', color:'var(--text-mute)'}}>{pct}%</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{display:'flex', flexDirection:'column', gap:12}}>
        {reviews.map((r,i) => (
          <div key={r.id || i} className="dash-card">
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:10}}>
              <div style={{display:'flex', gap:12, alignItems:'center'}}>
                <div style={{width:40, height:40, borderRadius:'50%', background:'var(--navy)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:600}}>{(r.customer || r.profiles?.full_name || '').split(' ').map(n=>n[0]).join('')}</div>
                <div><div style={{fontWeight:600, color:'var(--navy)'}}>{r.customer || r.profiles?.full_name}</div><div style={{fontSize:12, color:'var(--text-mute)'}}>{r.svc || ''} · {r.date || r.created_at?.slice(0,10) || ''}</div></div>
              </div>
              <div style={{display:'flex', gap:10, alignItems:'center'}}><Stars n={r.n || r.rating || 5}/>{!r.reply && <span className="badge warn"><span className="dot"/>Needs reply</span>}</div>
            </div>
            <p style={{color:'var(--text)', lineHeight:1.6, marginBottom:12}}>"{r.text || r.body}"</p>
            {r.reply ? (
              <div style={{padding:14, background:'var(--muted)', borderRadius:'var(--r-sm)', fontSize:13, borderLeft:'3px solid var(--red)'}}><div style={{fontWeight:600, color:'var(--navy)', marginBottom:4}}>Your reply</div><div style={{color:'var(--text)'}}>{r.reply}</div></div>
            ) : replyingId === r.id ? (
              <div className="fade-in">
                <textarea rows="3" placeholder="Write your reply..." value={replyText} onChange={e => setReplyText(e.target.value)} style={{width:'100%', padding:12, border:'1.5px solid var(--divider-soft)', borderRadius:'var(--r-md)', fontSize:14, fontFamily:'inherit', marginBottom:8, resize:'vertical'}}/>
                <div style={{display:'flex', gap:8}}>
                  <Button variant="primary" size="sm" onClick={() => handleReply(r.id)} disabled={sending || !replyText.trim()}>{sending ? 'Sending...' : 'Send reply'}</Button>
                  <Button variant="tertiary" size="sm" onClick={() => { setReplyingId(null); setReplyText(''); }}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div style={{display:'flex', gap:8}}>
                <Button variant="primary" size="sm" icon="message" onClick={() => setReplyingId(r.id)}>Reply</Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminServices = () => (
  <div className="fade-in">
    <div className="dash-head"><div><h1>Services & pricing</h1><p className="muted" style={{marginTop:4}}>Manage packages, add-ons, and vehicle multipliers.</p></div><Button variant="primary" size="sm" icon="plus">Add service</Button></div>
    <div className="dash-card" style={{padding:0, overflow:'hidden'}}>
      <table className="table"><thead><tr><th style={{paddingLeft:24}}>Service</th><th>Base price</th><th>Duration</th><th>Features</th><th>Status</th><th style={{paddingRight:24}}></th></tr></thead>
        <tbody>{SERVICES.map(s => (<tr key={s.id}><td style={{paddingLeft:24}}><div style={{fontWeight:600, color:'var(--navy)'}}>{s.name}</div><div style={{fontSize:12, color:'var(--text-mute)', marginTop:2}}>{s.tier}</div></td><td className="mono" style={{fontWeight:600}}>${s.priceFrom}</td><td className="mono">{Math.floor(s.time/60)}h {s.time%60 ? (s.time%60)+'m' : ''}</td><td style={{color:'var(--text-mute)', fontSize:13}}>{s.features.length} items</td><td><span className="badge ok"><span className="dot"/>Active</span></td><td style={{paddingRight:24, textAlign:'right'}}><Button variant="tertiary" size="sm" icon="edit"/></td></tr>))}</tbody>
      </table>
    </div>
    <h2 style={{marginTop:40, marginBottom:16, fontSize:22}}>Add-ons</h2>
    <div className="dash-card" style={{padding:0, overflow:'hidden'}}>
      <table className="table"><thead><tr><th style={{paddingLeft:24}}>Name</th><th>Price</th><th>Duration</th><th>Status</th><th style={{paddingRight:24}}></th></tr></thead>
        <tbody>{ADDONS.map(a => (<tr key={a.id}><td style={{paddingLeft:24}}><strong style={{color:'var(--navy)'}}>{a.name}</strong></td><td className="mono">+${a.price}</td><td className="mono">+{a.time} min</td><td><span className="badge ok"><span className="dot"/>Active</span></td><td style={{paddingRight:24, textAlign:'right'}}><Button variant="tertiary" size="sm" icon="edit"/></td></tr>))}</tbody>
      </table>
    </div>
  </div>
);

const AdminReports = () => (
  <div className="fade-in">
    <div className="dash-head"><div><h1>Reports</h1><p className="muted" style={{marginTop:4}}>Revenue, retention, and operational performance.</p></div>
      <div style={{display:'flex', gap:8}}><Button variant="ghost" size="sm">Last 30 days</Button><Button variant="ghost" icon="download" size="sm">Export</Button></div>
    </div>
    <div className="kpi-grid">
      {[{l:'Avg ticket',v:'$184',d:'+$12 vs Q4'},{l:'Repeat rate',v:'62%',d:'+4pts YoY'},{l:'No-show rate',v:'1.8%',d:'–0.6pts'},{l:'Weather cancels',v:'3.4%',d:'Seasonal'}].map((k,i) => (
        <div key={i} className="kpi"><div className="kpi-lab">{k.l}</div><div className="kpi-val">{k.v}</div><div style={{fontSize:12, color:'var(--text-mute)', marginTop:6}}>{k.d}</div></div>
      ))}
    </div>
    <div className="dash-row even">
      <div className="dash-card"><div className="dash-card-head"><h3>Bookings by day of week</h3></div><BarChart data={[23,31,34,29,42,47,18]} labels={['Mon','Tue','Wed','Thu','Fri','Sat','Sun']}/></div>
      <div className="dash-card"><div className="dash-card-head"><h3>New vs returning</h3></div><LineChart data={[42,45,48,52,58,62,68,72,75,82,88,92]} labels={['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar']}/></div>
    </div>
  </div>
);

const ImportModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [fileName, setFileName] = useState(null);
  return (
    <div style={{position:'fixed', inset:0, background:'rgba(16,33,61,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:24}} onClick={onClose}>
      <div className="fade-in" onClick={(e)=>e.stopPropagation()} style={{background:'#fff', borderRadius:'var(--r-lg)', maxWidth:640, width:'100%', boxShadow:'var(--sh-lg)', overflow:'hidden'}}>
        <div style={{padding:'20px 28px', borderBottom:'1px solid var(--divider-soft)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div><h3>Import customers from CSV</h3><div style={{fontSize:13, color:'var(--text-mute)', marginTop:2}}>Step {step} of 3</div></div>
          <button onClick={onClose} style={{all:'unset', cursor:'pointer', padding:8}}><Icon name="x" size={20}/></button>
        </div>
        <div style={{padding:28}}>
          {step === 1 && (<div>
            <p style={{color:'var(--text)', marginBottom:24, fontSize:15, lineHeight:1.6}}>Upload a CSV with headers: <code style={{background:'var(--muted)', padding:'2px 6px', borderRadius:4, fontSize:13, fontFamily:'var(--font-mono)'}}>first_name, last_name, email, phone</code>. Up to 5,000 rows.</p>
            <label style={{display:'block', padding:40, border:'2px dashed var(--divider)', borderRadius:'var(--r-md)', textAlign:'center', cursor:'pointer'}}>
              <Icon name="upload" size={36} color="var(--navy)"/>
              <div style={{fontSize:15, color:'var(--navy)', fontWeight:600, marginTop:10}}>{fileName || 'Drop your CSV or click to browse'}</div>
              <div style={{fontSize:12, color:'var(--text-mute)', marginTop:4}}>CSV up to 10MB</div>
              <input type="file" style={{display:'none'}} onChange={(e)=>setFileName(e.target.files[0]?.name || 'customers.csv')}/>
            </label>
          </div>)}
          {step === 2 && (<div>
            <h4 style={{marginBottom:6}}>Map columns</h4>
            <p style={{color:'var(--text-mute)', fontSize:14, marginBottom:20}}>We matched 4 of 4 fields automatically.</p>
            {[{col:'first_name',maps:'First name'},{col:'last_name',maps:'Last name'},{col:'email_address',maps:'Email'},{col:'phone_number',maps:'Phone'}].map((m,i) => (
              <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px dashed var(--divider-soft)'}}>
                <div><div style={{fontSize:11, color:'var(--text-mute)', letterSpacing:'0.08em', textTransform:'uppercase', fontWeight:600}}>Your CSV</div><div className="mono" style={{color:'var(--navy)'}}>{m.col}</div></div>
                <Icon name="arrow" size={16} color="var(--text-mute)"/>
                <div style={{textAlign:'right'}}><div style={{fontSize:11, color:'var(--text-mute)', letterSpacing:'0.08em', textTransform:'uppercase', fontWeight:600}}>PrimeShine</div><div style={{color:'var(--navy)', fontWeight:600}}>{m.maps}</div></div>
                <span className="badge ok"><span className="dot"/>Matched</span>
              </div>
            ))}
          </div>)}
          {step === 3 && (<div>
            <h4 style={{marginBottom:6}}>Review & confirm</h4>
            <p style={{color:'var(--text-mute)', fontSize:14, marginBottom:20}}>Importing 247 rows. 2 rows will be skipped (invalid emails).</p>
            <div style={{padding:16, background:'var(--success-soft)', borderRadius:'var(--r-md)', display:'flex', gap:12, alignItems:'center'}}><Icon name="checkCircle" size={22} color="var(--success)"/><div><div style={{fontWeight:600, color:'var(--navy)'}}>245 ready to import</div><div style={{fontSize:13, color:'var(--text-mute)', marginTop:2}}>No duplicates. All phones valid.</div></div></div>
            <div style={{padding:16, background:'var(--warn-soft)', borderRadius:'var(--r-md)', display:'flex', gap:12, alignItems:'center', marginTop:12}}><Icon name="info" size={22} color="var(--warn)"/><div><div style={{fontWeight:600, color:'var(--navy)'}}>2 rows will be skipped</div><div style={{fontSize:13, color:'var(--text-mute)', marginTop:2}}>Rows 49, 112 have invalid email format.</div></div></div>
          </div>)}
        </div>
        <div style={{padding:'16px 28px', background:'var(--muted)', display:'flex', justifyContent:'space-between'}}>
          <Button variant="tertiary" onClick={step === 1 ? onClose : () => setStep(step - 1)}>{step === 1 ? 'Cancel' : 'Back'}</Button>
          <Button variant="primary" onClick={step === 3 ? onClose : () => setStep(step + 1)} iconRight={step === 3 ? undefined : 'arrow'}>{step === 3 ? 'Import 245 customers' : 'Continue'}</Button>
        </div>
      </div>
    </div>
  );
};

const AdminPage = () => {
  const [tab, setTab] = useState('dashboard');
  const [detailId, setDetailId] = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  // Data state — mock data as defaults
  const [bookings, setBookings] = useState(ADMIN_BOOKINGS);
  const [customers, setCustomers] = useState(ADMIN_CUSTOMERS);
  const [reviews, setReviews] = useState(ADMIN_REVIEWS);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!supabase || !authUser) return;
    setLoading(true);
    const [bRes, cRes, rRes] = await Promise.all([
      getAllBookings(),
      getCustomers(),
      getAllReviews(),
    ]);
    if (bRes.data) setBookings(bRes.data);
    if (cRes.data) {
      // Transform Supabase profile shape to match admin UI expectations
      const allBookings = bRes.data || [];
      setCustomers(cRes.data.map(p => {
        const cBookings = allBookings.filter(b => b.customer_id === p.id);
        const spent = cBookings.reduce((s, b) => s + (b.total || 0), 0);
        const visits = cBookings.filter(b => b.status === 'completed').length;
        const lastBooking = cBookings[0];
        return {
          ...p,
          name: p.full_name,
          spent,
          visits,
          last: lastBooking?.scheduled_date || '',
          tag: spent >= 500 ? 'VIP' : visits >= 3 ? 'Repeat' : 'Regular',
          tagClass: spent >= 500 ? 'warn' : 'ok',
        };
      }));
    }
    if (rRes.data) setReviews(rRes.data);
    setLoading(false);
  }, [authUser]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleReplyToReview = async (reviewId, reply) => {
    await replyToReview(reviewId, reply);
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, reply, replied_at: new Date().toISOString() } : r));
  };

  const side = [{id:'dashboard',label:'Dashboard',icon:'home'},{id:'bookings',label:'Bookings',icon:'calendar'},{id:'customers',label:'Customers',icon:'users'},{id:'reviews',label:'Reviews',icon:'star'},{id:'services',label:'Services',icon:'wrench'},{id:'reports',label:'Reports',icon:'trend'},{id:'settings',label:'Settings',icon:'settings'}];

  return (
    <div className="dash-layout">
      <aside className="dash-side">
        <h6>Workspace</h6>
        {side.map(i => (<a key={i.id} className={tab === i.id ? 'active' : ''} onClick={() => { setTab(i.id); setDetailId(null); }}><Icon name={i.icon} size={17}/> {i.label}</a>))}
        <h6>Quick actions</h6>
        <a onClick={() => setImportOpen(true)}><Icon name="upload" size={17}/> Import customers</a>
        <a onClick={() => setTab('bookings')}><Icon name="plus" size={17}/> New booking</a>
      </aside>
      <main className="dash-main">
        {loading && <div style={{textAlign:'center', padding:40, color:'var(--text-mute)'}}>Loading...</div>}
        {!loading && tab === 'dashboard' && <AdminDashboard bookings={bookings} customers={customers} reviews={reviews} userName={authUser?.user_metadata?.full_name?.split(' ')[0] || ''}/>}
        {!loading && tab === 'bookings' && <AdminBookings bookings={bookings}/>}
        {!loading && tab === 'customers' && !detailId && <AdminCustomers customers={customers} setDetailId={setDetailId} setImportOpen={setImportOpen}/>}
        {!loading && tab === 'customers' && detailId && <AdminCustomerDetail id={detailId} customers={customers} bookings={bookings} setDetailId={setDetailId}/>}
        {!loading && tab === 'reviews' && <AdminReviewsTab reviews={reviews} onReply={handleReplyToReview}/>}
        {!loading && tab === 'services' && <AdminServices/>}
        {!loading && tab === 'reports' && <AdminReports/>}
        {!loading && tab === 'settings' && <div className="fade-in"><h1>Settings</h1><p className="muted" style={{marginTop:8}}>Workspace configuration.</p></div>}
      </main>
      {importOpen && <ImportModal onClose={() => setImportOpen(false)}/>}
    </div>
  );
};

export default AdminPage;
