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
    left: { flex: 1, background: '#0a1628', padding: '48px 40px',
      display: 'flex', flexDirection: 'column', justifyContent: 'center' },
    brand: { color: '#f5c400', fontSize: 32, fontWeight: 700, marginBottom: 6 },
    sub: { color: '#64748b', fontSize: 15, marginBottom: 36 },
    feat: { display: 'flex', flexDirection: 'column', gap: 10 },
    featItem: { background: '#111f38', border: '1px solid #1e2d4a',
      borderRadius: 8, padding: '10px 14px', color: '#94a3b8', fontSize: 14 },
    right: { flex: 1, background: '#111f38', padding: '48px 40px',
      display: 'flex', flexDirection: 'column', justifyContent: 'center' },
    title: { color: 'white', fontSize: 26, fontWeight: 700, marginBottom: 6 },
    subtitle: { color: '#64748b', fontSize: 14, marginBottom: 24 },
    errorBox: { background: '#1f0f0f', border: '1px solid #ef4444',
      color: '#ef4444', padding: '12px 14px', borderRadius: 8,
      marginBottom: 18, fontSize: 13 },
    label: { display: 'block', color: '#94a3b8', fontSize: 13,
      fontWeight: 500, marginBottom: 6 },
    input: { width: '100%', padding: '11px 14px', background: '#0a1628',
      border: '1px solid #1e2d4a', borderRadius: 8, color: '#e2e8f0',
      fontSize: 14, marginBottom: 16, boxSizing: 'border-box', outline: 'none' },
    btn: { width: '100%', padding: 13, background: '#f5c400',
      color: '#0a1628', border: 'none', borderRadius: 8, fontSize: 15,
      fontWeight: 700, cursor: 'pointer', marginBottom: 14 },
    divider: { textAlign: 'center', color: '#334155', fontSize: 12,
      margin: '4px 0 14px' },
    googleBtn: { width: '100%', padding: 12, background: 'transparent',
      border: '1px solid #1e2d4a', borderRadius: 8, color: '#94a3b8',
      fontSize: 14, cursor: 'pointer', display: 'flex',
      alignItems: 'center', justifyContent: 'center', gap: 8,
      textDecoration: 'none' },
    loginLink: { textAlign: 'center', marginTop: 20, color: '#64748b', fontSize: 13 },
    link: { color: '#f5c400', cursor: 'pointer', fontWeight: 600,
      textDecoration: 'none' },
  };

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

        <a href="http://localhost:8081/oauth2/authorization/google"
          style={S.googleBtn}>
          🔵 Sign up with Google
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