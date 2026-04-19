import { useNavigate } from 'react-router-dom';
import { LOGO_FULL } from './Logo';
import Icon from './Icon';

const Footer = () => {
  const navigate = useNavigate();
  const go = (r) => { navigate(`/${r === 'home' ? '' : r}`); window.scrollTo(0,0); };
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src={LOGO_FULL} className="logo-full" alt="PrimeShine Detail Co."/>
            <p>Mobile auto detailing serving the San Gabriel Valley since 2019. We bring the shine to you: driveway, office, or curbside.</p>
            <div style={{display:'flex', gap:12, marginTop:20}}>
              <a href="#" style={{color:'rgba(255,255,255,0.55)'}}><Icon name="mail" size={18}/></a>
              <a href="#" style={{color:'rgba(255,255,255,0.55)'}}><Icon name="phone" size={18}/></a>
              <a href="#" style={{color:'rgba(255,255,255,0.55)'}}><Icon name="location" size={18}/></a>
            </div>
          </div>
          <div>
            <h5>Services</h5>
            <ul>
              <li><a onClick={()=>go('services')}>Express wash</a></li>
              <li><a onClick={()=>go('services')}>Full detail</a></li>
              <li><a onClick={()=>go('services')}>Ceramic coat</a></li>
              <li><a onClick={()=>go('services')}>Interior reset</a></li>
              <li><a onClick={()=>go('pricing')}>Pricing</a></li>
            </ul>
          </div>
          <div>
            <h5>Company</h5>
            <ul>
              <li><a onClick={()=>go('about')}>About</a></li>
              <li><a onClick={()=>go('faq')}>FAQ</a></li>
              <li><a onClick={()=>go('contact')}>Contact</a></li>
              <li><a onClick={()=>go('weather')}>Weather check</a></li>
            </ul>
          </div>
          <div>
            <h5>Account</h5>
            <ul>
              <li><a onClick={()=>go('portal')}>Customer portal</a></li>
              <li><a onClick={()=>go('book/1')}>Book now</a></li>
              <li><a onClick={()=>go('admin')}>Admin (demo)</a></li>
            </ul>
          </div>
          <div>
            <h5>Contact</h5>
            <ul>
              <li style={{color:'rgba(255,255,255,0.72)', fontSize:14}}>(626) 555-0189</li>
              <li style={{color:'rgba(255,255,255,0.72)', fontSize:14}}>hello@primeshine.co</li>
              <li style={{color:'rgba(255,255,255,0.72)', fontSize:14}}>Mon–Sat · 7a–6p</li>
              <li style={{color:'rgba(255,255,255,0.72)', fontSize:14}}>Alhambra, CA</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div>&copy; 2025 PrimeShine Detail Co. · All rights reserved.</div>
          <div style={{display:'flex', gap:24}}>
            <a style={{color:'inherit'}}>Terms</a>
            <a style={{color:'inherit'}}>Privacy</a>
            <a style={{color:'inherit'}}>Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
