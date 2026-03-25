import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem('userName') || 'Student';

  const modules = [
    { icon: '🏢', title: 'Facilities', desc: 'Browse and book campus rooms', color: '#f5c400', path: '/facilities' },
    { icon: '📅', title: 'Bookings', desc: 'View and manage your reservations', color: '#3b82f6', path: '/bookings' },
    { icon: '🔧', title: 'Incidents', desc: 'Report maintenance issues', color: '#ef4444', path: '/incidents' },
    { icon: '🔔', title: 'Notifications', desc: 'Your alerts and updates', color: '#f5c400', path: '/notifications' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0d1b2e', fontFamily: 'Segoe UI, sans-serif' }}>

      {/* Navbar */}
      <nav style={{ background: '#0a1628', height: 56, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 28px', borderBottom: '2px solid #f5c400' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>🎓</span>
          <span style={{ color: '#f5c400', fontSize: 17, fontWeight: 600 }}>Smart Campus</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: '#94a3b8', fontSize: 13 }}>👤 {name}</span>
          <button onClick={handleLogout}
            style={{ padding: '6px 16px', background: 'transparent', color: '#f5c400',
              border: '1px solid #f5c400', borderRadius: 20, cursor: 'pointer', fontSize: 13 }}>
            Logout
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: '#0a1628', padding: '28px 28px 36px',
        borderBottom: '1px solid #1e2d4a' }}>
        <h1 style={{ color: 'white', fontSize: 24, fontWeight: 600, marginBottom: 4 }}>
          Welcome back, <span style={{ color: '#f5c400' }}>{name}</span> 👋
        </h1>
        <p style={{ color: '#64748b', fontSize: 14 }}>Smart Campus Operations Hub</p>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          {[['3','Unread Alerts'],['2','Active Bookings'],['1','Open Incidents'],['5','Facilities']].map(([n,l]) => (
            <div key={l} style={{ flex: 1, background: '#111f38', border: '1px solid #1e2d4a',
              borderRadius: 10, padding: '12px 16px' }}>
              <div style={{ color: '#f5c400', fontSize: 22, fontWeight: 600 }}>{n}</div>
              <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16, padding: 28 }}>
        {modules.map((mod) => (
          <div key={mod.title} onClick={() => navigate(mod.path)}
            style={{ background: '#111f38', border: `1px solid #1e2d4a`, borderRadius: 12,
              padding: '20px 18px', cursor: 'pointer', position: 'relative', overflow: 'hidden',
              transition: 'border-color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = mod.color}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#1e2d4a'}>
            {/* Top accent bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0,
              height: 3, background: mod.color }} />
            <div style={{ fontSize: 24, marginBottom: 12, marginTop: 4 }}>{mod.icon}</div>
            <h3 style={{ color: 'white', fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{mod.title}</h3>
            <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.5, marginBottom: 14 }}>{mod.desc}</p>
            <span style={{ color: mod.color, fontSize: 13, fontWeight: 600 }}>Open →</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;