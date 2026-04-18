import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FacilityStudentPage from './FacilityStudentPage';
<<<<<<< HEAD
import IncidentList from './IncidentList';
=======
import BookingStudentPage from './BookingStudentPage';
>>>>>>> f1f8f56 (Clean repo, add .gitignore, remove build files, and update backend + frontend)

// ── Placeholder pages for teammates ──────────────────────────────────────────
const Placeholder = ({ title, member, description }) => (
  <div style={{ padding: 40, textAlign: 'center' }}>
    <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
    <div style={{ color: 'var(--text-primary)', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
      {title}
    </div>
    <div style={{ color: 'var(--accent-color)', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
      {member}
    </div>
    <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
      {description}
    </div>
  </div>
);

const NAV = [
  { label: 'Dashboard', icon: '🏠' },
  { label: 'My Bookings', icon: '📅' },
  { label: 'Facilities', icon: '🏢' },
  { label: 'Incidents', icon: '🔧' },
  { label: 'Notifications', icon: '🔔' },
  { label: 'Account', icon: '👤' },
];

// ── Main overview content ─────────────────────────────────────────────────────
function Overview({ name, setActive }) {
  return (
    <>
      <h2 style={S.welcomeTitle}>Welcome back, {name} 👋</h2>
      <p style={S.welcomeSub}>
        Manage your campus life — bookings, incidents, and notifications.
      </p>

      <div style={S.statsGrid}>
        {[
          ['Active Bookings', '3'],
          ['Open Incidents', '2'],
          ['Available Facilities', '5'],
          ['Notifications', '3'],
        ].map(([label, value]) => (
          <div key={label} style={S.statCard}>
            <div style={S.statLabel}>{label}</div>
            <div style={S.statValue}>{value}</div>
          </div>
        ))}
      </div>

      <div style={S.twoCol}>
        <div style={S.card}>
          <div style={S.cardTitle}>Quick Actions</div>

          <button style={S.btnYellow}>+ New Booking Request</button>
          <button style={S.btnOutline} onClick={() => setActive('Incidents')}>+ Report Incident</button>
          <button style={S.btnOutline} onClick={() => setActive('Facilities')}>
            View All Facilities
          </button>
        </div>

        <div style={S.card}>
          <div style={S.cardTitle}>Upcoming Bookings</div>

          {[
            ['Computer Lab A', 'Today 2:00–4:00 PM', '#0F4A2A', 'var(--success-color)', 'Confirmed'],
            ['Meeting Room 3', 'Tomorrow 10:00 AM', '#3D2A00', 'var(--accent-color)', 'Pending'],
            ['Sports Hall B', 'Fri 4:00 PM', '#0F4A2A', 'var(--success-color)', 'Confirmed'],
          ].map(([name, time, bg, color, status]) => (
            <div key={name} style={S.bookingItem}>
              <div>
                <div style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 500 }}>{name}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 11 }}>{time}</div>
              </div>
              <span
                style={{
                  background: bg,
                  color,
                  padding: '3px 10px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
function StudentDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem('userName') || 'Student';
  const [active, setActive] = useState('Dashboard');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const renderContent = () => {
    switch (active) {
      case 'Dashboard':
        return <Overview name={name} setActive={setActive} />;

      case 'My Bookings':
        return <BookingStudentPage />;

      case 'Facilities':
        return <FacilityStudentPage />;

      case 'Incidents':
        return <IncidentList />;

      case 'Notifications':
        return (
          <Placeholder
            title="Notifications"
            member="👤 Member 4 — Notification Service"
            description="Connect to notification-service on port 8082 to show user notifications."
          />
        );

      case 'Account':
        return (
          <Placeholder
            title="Account Settings"
            member="👤 Member 4 — Auth Service"
            description="Connect to auth-service on port 8081 to manage user profile and settings."
          />
        );

      default:
        return <Overview name={name} setActive={setActive} />;
    }
  };

  return (
    <div style={S.page}>
      {/* Sidebar */}
      <div style={S.sidebar}>
        <div style={S.logo}>🎓 Smart Campus</div>

        {NAV.map(({ label, icon }) => (
          <div
            key={label}
            onClick={() => setActive(label)}
            style={{ ...S.navItem, ...(active === label ? S.navActive : {}) }}
          >
            <span style={{ marginRight: 8 }}>{icon}</span>
            {label}
          </div>
        ))}
      </div>

      {/* Main */}
      <div style={S.main}>
        <div style={S.topbar}>
          <input
            style={S.search}
            placeholder={active === 'Facilities' ? 'Search facilities...' : 'Search facilities, bookings...'}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={S.bell} onClick={() => setActive('Notifications')}>
              🔔
            </div>
            <div style={S.avatar}>ST</div>
            <button onClick={handleLogout} style={S.logout}>
              Logout
            </button>
          </div>
        </div>

        <div
          style={{
            ...S.content,
            padding: active === 'Facilities' ? 0 : 20,
            background: active === 'Facilities' ? 'var(--bg-app)' : 'transparent',
          }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

const S = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    background: 'var(--bg-app)',
    fontFamily: 'Segoe UI, sans-serif',
  },
  sidebar: {
    width: 210,
    background: 'var(--bg-input)',
    borderRight: '1px solid var(--border-color)',
    padding: '16px 0',
    flexShrink: 0,
  },
  logo: {
    padding: '0 16px 20px',
    fontSize: 15,
    fontWeight: 700,
    color: 'var(--accent-color)',
    borderBottom: '1px solid var(--border-color)',
    marginBottom: 12,
  },
  navItem: {
    padding: '10px 16px',
    fontSize: 13,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    borderLeft: '3px solid transparent',
    transition: 'all 0.15s',
  },
  navActive: {
<<<<<<< HEAD
    color: '#FFC107',
    borderLeft: '3px solid #FFC107',
    background: '#122A42',
=======
    color: 'var(--accent-color)',
    borderLeftColor: 'var(--accent-color)',
    background: 'var(--bg-card)',
>>>>>>> f1f8f56 (Clean repo, add .gitignore, remove build files, and update backend + frontend)
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  topbar: {
    background: 'var(--bg-input)',
    borderBottom: '1px solid var(--border-color)',
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  search: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 8,
    padding: '7px 14px',
    color: 'var(--text-primary)',
    fontSize: 13,
    width: 220,
  },
  bell: {
    width: 32,
    height: 32,
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: 16,
  },
  avatar: {
    width: 32,
    height: 32,
    background: 'var(--border-color)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 700,
    color: 'var(--accent-color)',
  },
  logout: {
    padding: '6px 12px',
    background: 'transparent',
    border: '1px solid var(--border-color)',
    borderRadius: 8,
    color: 'var(--text-secondary)',
    fontSize: 12,
    cursor: 'pointer',
  },
  content: {
    padding: 20,
    flex: 1,
  },
  welcomeTitle: {
    color: 'var(--text-primary)',
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 4,
  },
  welcomeSub: {
    color: 'var(--text-secondary)',
    fontSize: 13,
    marginBottom: 20,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 10,
    padding: 14,
    borderTop: '3px solid var(--accent-color)',
  },
  statLabel: {
    color: 'var(--text-secondary)',
    fontSize: 11,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  statValue: {
    color: 'var(--text-primary)',
    fontSize: 22,
    fontWeight: 700,
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 10,
    padding: 16,
  },
  cardTitle: {
    color: 'var(--text-primary)',
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 14,
  },
  btnYellow: {
    background: 'var(--accent-color)',
    color: 'var(--bg-app)',
    border: 'none',
    padding: '9px 16px',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    width: '100%',
    marginBottom: 8,
  },
  btnOutline: {
    background: 'transparent',
    color: 'var(--accent-color)',
    border: '1px solid var(--accent-color)',
    padding: '9px 16px',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
    marginBottom: 8,
  },
  bookingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid var(--border-color)',
  },
};

export default StudentDashboard;