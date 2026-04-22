import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LOGO_FULL, LOGO_BADGE } from './Logo';
import Icon from './Icon';
import Button from './Button';

const Header = ({ user, setUser }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const route = location.pathname.replace('/', '') || 'home';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (r) => { navigate(`/${r === 'home' ? '' : r}`); setMenuOpen(false); window.scrollTo(0,0); };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services', menu: [
      { id: 'services', t: 'All services', d: 'Packages, add-ons & pricing' },
      { id: 'pricing', t: 'Pricing', d: 'Transparent rates by vehicle' },
      { id: 'weather', t: 'Weather check', d: 'Plan the perfect detail day' },
    ]},
    { id: 'about', label: 'About' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' },
  ];

  return (<>
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="site-header-inner">
        <div className="brand" onClick={() => go('home')}>
          <img src={LOGO_FULL} alt="PrimeShine Detail Co." className="logo-full"/>
          <img src={LOGO_BADGE} alt="" className="logo-compact"/>
        </div>
        <nav><ul className="nav-main">
          {navItems.map(n => (
            <li key={n.id} className={n.menu ? 'has-menu' : ''}>
              <a onClick={() => !n.menu && go(n.id)} className={route === n.id ? 'active' : ''}>
                {n.label}{n.menu && <Icon name="chevD" size={14}/>}
              </a>
              {n.menu && (
                <div className="nav-submenu">
                  {n.menu.map(m => (
                    <a key={m.id} onClick={() => go(m.id)}>
                      <span>{m.t}</span>
                      <span className="sub-desc">{m.d}</span>
                    </a>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul></nav>
        <div className="header-actions">
          {user ? (
            <>
              <Button variant="tertiary" size="sm" onClick={() => go(user.role === 'admin' ? 'admin' : 'portal')} icon="user">{user.name.split(' ')[0]}</Button>
              <Button variant="primary" size="sm" onClick={() => go('book/1')}>Book now</Button>
            </>
          ) : (
            <>
              <Button variant="tertiary" size="sm" onClick={() => go('login')}>Sign in</Button>
              <Button variant="primary" size="sm" onClick={() => go('book/1')} iconRight="arrow">Book now</Button>
            </>
          )}
          <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <Icon name={menuOpen ? 'x' : 'menu'} size={22}/>
          </button>
        </div>
      </div>
    </header>
    <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`}>
      {['home','services','pricing','weather','about','faq','contact'].map(id => (
        <a key={id} onClick={() => go(id)}>{id.charAt(0).toUpperCase()+id.slice(1)} <Icon name="arrow" size={16}/></a>
      ))}
      <div style={{display:'flex', gap:12, marginTop:24}}>
        <Button variant="secondary" onClick={() => go(user?.role === 'admin' ? 'admin' : 'portal')}>Sign in</Button>
        <Button variant="primary" onClick={() => go('book/1')}>Book now</Button>
      </div>
    </div>
  </>);
};

export default Header;
