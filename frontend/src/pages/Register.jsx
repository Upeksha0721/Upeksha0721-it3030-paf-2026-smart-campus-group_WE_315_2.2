import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:8081/api/auth/register', {
        name, email, password
      });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Email may already exist.');
    } finally {
      setLoading(false);
    }
  };

  const S = {
    page: { display: 'flex', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' },
    left: { flex: 1, background: 'var(--bg-sidebar)', padding: '48px 40px',
      display: 'flex', flexDirection: 'column', justifyContent: 'center' },
    brand: { color: 'var(--accent-color)', fontSize: 32, fontWeight: 700, marginBottom: 6 },
    sub: { color: 'var(--text-secondary)', fontSize: 15, marginBottom: 36 },
    feat: { display: 'flex', flexDirection: 'column', gap: 10 },
    featItem: { background: '#111f38', border: '1px solid #1e2d4a',
      borderRadius: 8, padding: '10px 14px', color: '#94a3b8', fontSize: 14 },
    right: { flex: 1, background: '#111f38', padding: '48px 40px',
      display: 'flex', flexDirection: 'column', justifyContent: 'center' },
    title: { color: 'var(--text-primary)', fontSize: 26, fontWeight: 700, marginBottom: 6 },
    subtitle: { color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 },
    errorBox: { background: '#1f0f0f', border: '1px solid var(--danger-color)',
      color: 'var(--danger-color)', padding: '12px 14px', borderRadius: 8,
      marginBottom: 18, fontSize: 13 },
    label: { display: 'block', color: '#94a3b8', fontSize: 13,
      fontWeight: 500, marginBottom: 6 },
    input: { width: '100%', padding: '11px 14px', background: 'var(--bg-sidebar)',
      border: '1px solid #1e2d4a', borderRadius: 8, color: '#e2e8f0',
      fontSize: 14, marginBottom: 16, boxSizing: 'border-box', outline: 'none' },
    btn: { width: '100%', padding: 13, background: 'var(--accent-color)',
      color: 'var(--bg-sidebar)', border: 'none', borderRadius: 8, fontSize: 15,
      fontWeight: 700, cursor: 'pointer', marginBottom: 14 },
    divider: { textAlign: 'center', color: '#334155', fontSize: 12,
      margin: '4px 0 14px' },
    googleBtn: { width: '100%', padding: 12, background: 'var(--text-primary)',
      border: '1px solid #dadce0', borderRadius: 8, color: '#3c4043',
      fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex',
      alignItems: 'center', justifyContent: 'center', gap: 10,
      textDecoration: 'none', boxSizing: 'border-box' },
    googleIcon: { width: 20, height: 20 },
    loginLink: { textAlign: 'center', marginTop: 20, color: 'var(--text-secondary)', fontSize: 13 },
    link: { color: 'var(--accent-color)', cursor: 'pointer', fontWeight: 600,
      textDecoration: 'none' },
  };

  // Real Google SVG icon
  const GoogleIcon = () => (
    <svg style={S.googleIcon} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );

  return (
    <div style={S.page}>
      {/* Left Panel */}
      <div style={S.left}>
        <div style={S.brand}>🎓 Smart Campus</div>
        <div style={S.sub}>Operations Hub</div>
        <div style={S.feat}>
          {[
            '🏢 Book facilities instantly',
            '🔔 Real-time notifications',
            '📅 Manage all bookings',
            '🔧 Report incidents',
          ].map(f => (
            <div key={f} style={S.featItem}>{f}</div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div style={S.right}>
        <div style={S.title}>Create Account</div>
        <div style={S.subtitle}>Join Smart Campus today</div>

        {error && <div style={S.errorBox}>⚠️ {error}</div>}

        <form onSubmit={handleRegister}>
          <label style={S.label}>Full Name</label>
          <input style={S.input} type="text" placeholder="Your full name"
            value={name} onChange={e => setName(e.target.value)} required />

          <label style={S.label}>Email Address</label>
          <input style={S.input} type="email" placeholder="you@university.edu"
            value={email} onChange={e => setEmail(e.target.value)} required />

          <label style={S.label}>Password</label>
          <input style={S.input} type="password" placeholder="Min 6 characters"
            value={password} onChange={e => setPassword(e.target.value)}
            minLength={6} required />

          <label style={S.label}>Confirm Password</label>
          <input style={S.input} type="password" placeholder="Repeat your password"
            value={confirm} onChange={e => setConfirm(e.target.value)} required />

          <button style={{ ...S.btn, opacity: loading ? 0.7 : 1 }}
            type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <div style={S.divider}>─── or continue with ───</div>

        <a href="http://localhost:8081/oauth2/authorization/google" style={S.googleBtn}>
          <GoogleIcon />
          Sign up with Google
        </a>

        <div style={S.loginLink}>
          Already have an account?{' '}
          <a href="/login" style={S.link}>Sign In</a>
        </div>
      </div>
    </div>
  );
}

export default Register;