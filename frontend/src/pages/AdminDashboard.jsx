import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FacilityAdminPage from './FacilityAdminPage';
<<<<<<< HEAD
import IncidentList from './IncidentList';
=======
import BookingAdminPage from './BookingAdminPage';
import UserManagementPage from './UserManagementPage';
import ReportsPage from './ReportsPage';
import SettingsPage from './SettingsPage';
>>>>>>> f1f8f56 (Clean repo, add .gitignore, remove build files, and update backend + frontend)

const Placeholder = ({ title, member, description }) => (
  <div style={{ padding: 40, textAlign: 'center' }}>
    <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
    <div style={{ color: 'var(--text-primary)', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{title}</div>
    <div style={{ color: 'var(--accent-color)', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{member}</div>
    <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{description}</div>
  </div>
);

const NAV = [
  { label: 'Overview',          icon: '📊' },
  { label: 'Booking Requests',  icon: '📅' },
  { label: 'Facility Catalogue',icon: '🏢' },
  { label: 'All Incidents',     icon: '🔧' },
  { label: 'User Management',   icon: '👥' },
  { label: 'Reports',           icon: '📈' },
  { label: 'Settings',          icon: '⚙️' },
];

function Overview() {
  return (
    <>
      <h2 style={S.welcomeTitle}>Welcome back, Admin 👋</h2>
      <p style={S.welcomeSub}>Campus Operations Overview — manage bookings, incidents and facilities.</p>
      <div style={S.statsGrid}>
        {[
          ['Pending Bookings', '50'],
          ['Unassigned Tickets', '12'],
          ['Active Users', '120'],
          ['Total Facilities', '18'],
        ].map(([label, value]) => (
          <div key={label} style={S.statCard}>
            <div style={S.statLabel}>{label}</div>
            <div style={S.statValue}>{value}</div>
          </div>
        ))}
      </div>
      <div style={S.twoCol}>
        <div style={S.card}>
          <div style={S.cardTitle}>New Booking Requests</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr>
                {['Student', 'Facility', 'Date', 'Action'].map(h => (
                  <th key={h} style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)', padding: '8px', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[['John K.', 'Lab A', 'Apr 2'], ['Sara M.', 'Hall B', 'Apr 3'], ['Mike R.', 'Room 3', 'Apr 3'], ['Priya S.', 'Lab C', 'Apr 4']].map(([student, facility, date]) => (
                <tr key={student}>
                  <td style={{ padding: '8px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)' }}>{student}</td>
                  <td style={{ padding: '8px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)' }}>{facility}</td>
                  <td style={{ padding: '8px', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>{date}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid var(--border-color)' }}>
                    <button style={{ background: '#0F4A2A', color: 'var(--success-color)', border: 'none', padding: '4px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer', marginRight: 4 }}>Approve</button>
                    <button style={{ background: 'var(--danger-border)', color: 'var(--danger-color)', border: 'none', padding: '4px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={S.card}>
          <div style={S.cardTitle}>Resource Utilization</div>
          {[['8AM-10AM', 45], ['10AM-12PM', 82], ['12PM-2PM', 91], ['2PM-4PM', 67], ['4PM-6PM', 38]].map(([time, percent]) => (
            <div key={time} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                <span>{time}</span><span>{percent}%</span>
              </div>
              <div style={{ background: 'var(--border-color)', borderRadius: 4, height: 6 }}>
                <div style={{ background: 'var(--accent-color)', borderRadius: 4, height: 6, width: `${percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState('Overview');

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  const renderContent = () => {
    switch (active) {
<<<<<<< HEAD
      case 'Overview':
        return <Overview />;

      case 'Booking Requests':
        return (
          <Placeholder
            title="Booking Requests"
            member="👤 Member 2 — Booking Service"
            description="Connect to booking-service on port 8084 to approve or reject booking requests."
          />
        );

      case 'Facility Catalogue':
        return <FacilityAdminPage />;

      case 'All Incidents':
        return <IncidentList />;

      case 'User Management':
        return (
          <Placeholder
            title="User Management"
            member="👤 Member 4 — Auth Service"
            description="Connect to auth-service on port 8081 to manage users and roles."
          />
        );

      case 'Reports':
        return (
          <Placeholder
            title="Reports & Analytics"
            member="👤 Member 4 — All Services"
            description="Aggregate data from all services to show reports and usage analytics."
          />
        );

      case 'Settings':
        return (
          <Placeholder
            title="Settings"
            member="👤 Member 4 — Auth Service"
            description="System settings and configuration."
          />
        );

      default:
        return <Overview />;
=======
      case 'Overview':           return <Overview />;
      case 'Booking Requests':   return <BookingAdminPage />;
      case 'Facility Catalogue': return <FacilityAdminPage />;
      case 'All Incidents':      return <Placeholder title="All Incidents"      member="👤 Member 3 — Incident Service"  description="Connect to incident-service on port 8085 to manage all incident tickets." />;
      case 'User Management':    return <UserManagementPage />;
      case 'Reports':            return <ReportsPage />;
      case 'Settings':           return <SettingsPage />;
      default:                   return <Overview />;
>>>>>>> f1f8f56 (Clean repo, add .gitignore, remove build files, and update backend + frontend)
    }
  };

  // pages that manage their own padding
  const selfPadded = ['Facility Catalogue', 'User Management', 'Reports', 'Settings'];
  const noPad = selfPadded.includes(active);

  return (
    <div style={S.page}>
      <div style={S.sidebar}>
        <div style={S.logo}>🎓 Smart Campus</div>
        {NAV.map(({ label, icon }) => (
          <div key={label} onClick={() => setActive(label)} style={{ ...S.navItem, ...(active === label ? S.navActive : {}) }}>
            <span style={{ marginRight: 8 }}>{icon}</span>{label}
          </div>
        ))}
      </div>

      <div style={S.main}>
        <div style={S.topbar}>
          <input style={S.search} placeholder={active === 'Facility Catalogue' ? 'Search facilities...' : 'Search users, bookings...'} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={S.bell}>🔔</div>
            <div style={{ ...S.avatar, background: 'var(--badge-bg)', color: 'var(--accent-color)' }}>AD</div>
            <button onClick={handleLogout} style={S.logout}>Logout</button>
          </div>
        </div>

        <div style={{ ...S.content, padding: noPad ? 0 : 20, background: noPad ? 'var(--bg-app)' : 'transparent' }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

const S = {
  page:        { display: 'flex', minHeight: '100vh', background: 'var(--bg-app)', fontFamily: 'Segoe UI, sans-serif' },
  sidebar:     { width: 210, background: 'var(--bg-input)', borderRight: '1px solid var(--border-color)', padding: '16px 0', flexShrink: 0 },
  logo:        { padding: '0 16px 20px', fontSize: 15, fontWeight: 700, color: 'var(--accent-color)', borderBottom: '1px solid var(--border-color)', marginBottom: 12 },
  navItem:     { padding: '10px 16px', fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer', borderLeft: '3px solid transparent', transition: 'all 0.15s' },
  navActive:   { color: 'var(--accent-color)', borderLeftColor: 'var(--accent-color)', background: 'var(--bg-card)' },
  main:        { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  topbar:      { background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  search:      { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '7px 14px', color: 'var(--text-primary)', fontSize: 13, width: 220 },
  bell:        { width: 32, height: 32, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16 },
  avatar:      { width: 32, height: 32, background: 'var(--border-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 },
  logout:      { padding: '6px 12px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: 8, color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer' },
  content:     { padding: 20, flex: 1, overflowY: 'auto' },
  welcomeTitle:{ color: 'var(--text-primary)', fontSize: 20, fontWeight: 600, marginBottom: 4 },
  welcomeSub:  { color: 'var(--text-secondary)', fontSize: 13, marginBottom: 20 },
  statsGrid:   { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 },
  statCard:    { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 10, padding: 14, borderTop: '3px solid var(--accent-color)' },
  statLabel:   { color: 'var(--text-secondary)', fontSize: 11, marginBottom: 6, textTransform: 'uppercase' },
  statValue:   { color: 'var(--text-primary)', fontSize: 22, fontWeight: 700 },
  twoCol:      { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  card:        { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 10, padding: 16 },
  cardTitle:   { color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, marginBottom: 14 },
};

export default AdminDashboard;