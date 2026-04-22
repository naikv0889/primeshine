import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import Icon from '../components/Icon';
import Button from '../components/Button';
import Eyebrow from '../components/Eyebrow';

const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'signin';
  const { signIn, signUp } = useAuth();

  const [tab, setTab] = useState(mode === 'signup' ? 'signup' : 'signin');
  const [method, setMethod] = useState('magic'); // magic | password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleMagicLink = async () => {
    if (!supabase) { setError('Demo mode: Supabase not configured'); return; }
    setLoading(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setMessage('Check your email for a magic link. Click it to sign in.');
  };

  const handlePasswordSignIn = async () => {
    setLoading(true);
    setError(null);
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) { setError(err.message); return; }
    navigate('/portal');
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    const { error: err } = await signUp(email, password, { full_name: name, phone });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setMessage('Account created! Check your email to confirm, then sign in.');
    setTab('signin');
  };

  return (
    <div className="page page-enter" style={{ background: 'var(--muted)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="card" style={{ maxWidth: 440, width: '100%', padding: 40 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Eyebrow>{tab === 'signin' ? 'Welcome back' : 'Get started'}</Eyebrow>
          <h2 style={{ marginTop: 12 }}>{tab === 'signin' ? 'Sign in to your portal' : 'Create your account'}</h2>
        </div>

        {message && (
          <div className="fade-in" style={{ padding: 16, background: 'var(--success-soft)', borderRadius: 'var(--r-md)', marginBottom: 20, fontSize: 14, color: 'var(--success)', display: 'flex', gap: 10, alignItems: 'center' }}>
            <Icon name="check" size={18} /> {message}
          </div>
        )}

        {error && (
          <div className="fade-in" style={{ padding: 16, background: 'var(--red-bg)', borderRadius: 'var(--r-md)', marginBottom: 20, fontSize: 14, color: 'var(--red)', display: 'flex', gap: 10, alignItems: 'center' }}>
            <Icon name="info" size={18} /> {error}
          </div>
        )}

        {tab === 'signin' && (
          <div className="fade-in">
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              <button onClick={() => setMethod('magic')} style={{ flex: 1, padding: '10px 0', border: `1.5px solid ${method === 'magic' ? 'var(--red)' : 'var(--divider-soft)'}`, background: method === 'magic' ? 'var(--red-bg)' : '#fff', borderRadius: 'var(--r-md)', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', color: method === 'magic' ? 'var(--red)' : 'var(--text-mute)' }}>
                Magic link
              </button>
              <button onClick={() => setMethod('password')} style={{ flex: 1, padding: '10px 0', border: `1.5px solid ${method === 'password' ? 'var(--red)' : 'var(--divider-soft)'}`, background: method === 'password' ? 'var(--red-bg)' : '#fff', borderRadius: 'var(--r-md)', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', color: method === 'password' ? 'var(--red)' : 'var(--text-mute)' }}>
                Email + password
              </button>
            </div>

            <div className="field"><label>Email</label><input type="email" placeholder="sam@example.com" value={email} onChange={e => setEmail(e.target.value)} /></div>

            {method === 'password' && (
              <div className="field"><label>Password</label><input type="password" placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} /></div>
            )}

            <Button variant="primary" style={{ width: '100%' }} onClick={method === 'magic' ? handleMagicLink : handlePasswordSignIn} disabled={loading || !email}>
              {loading ? 'Sending...' : method === 'magic' ? 'Send magic link' : 'Sign in'}
            </Button>

            <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-mute)' }}>
              New to PrimeShine? <a style={{ color: 'var(--red)', fontWeight: 600, cursor: 'pointer' }} onClick={() => { setTab('signup'); setError(null); setMessage(null); }}>Create an account</a>
            </div>
          </div>
        )}

        {tab === 'signup' && (
          <div className="fade-in">
            <div className="field"><label>Full name</label><input placeholder="Sam Rivera" value={name} onChange={e => setName(e.target.value)} /></div>
            <div className="field"><label>Email</label><input type="email" placeholder="sam@example.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
            <div className="field"><label>Phone</label><input placeholder="(626) 555-0100" value={phone} onChange={e => setPhone(e.target.value)} /></div>
            <div className="field"><label>Password</label><input type="password" placeholder="At least 6 characters" value={password} onChange={e => setPassword(e.target.value)} /></div>

            <Button variant="primary" style={{ width: '100%' }} onClick={handleSignUp} disabled={loading || !email || !password || !name}>
              {loading ? 'Creating...' : 'Create account'}
            </Button>

            <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-mute)' }}>
              Already have an account? <a style={{ color: 'var(--red)', fontWeight: 600, cursor: 'pointer' }} onClick={() => { setTab('signin'); setError(null); setMessage(null); }}>Sign in</a>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 24, paddingTop: 20, borderTop: '1px dashed var(--divider-soft)', fontSize: 12, color: 'var(--text-mute)' }}>
          Admin? <a style={{ color: 'var(--red)', cursor: 'pointer' }} onClick={() => { setMethod('password'); setTab('signin'); }}>Sign in with email + password</a>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
