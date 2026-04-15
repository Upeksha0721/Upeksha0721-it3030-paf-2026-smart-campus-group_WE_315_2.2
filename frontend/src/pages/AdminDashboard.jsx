import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FacilityAdminPage from './FacilityAdminPage';
import IncidentList from './IncidentList';

const Placeholder = ({ title, member, description }) => (
  <div style={{ padding: 40, textAlign: 'center' }}>
    <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
    <div style={{ color: '#fff', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
      {title}
    </div>
    <div style={{ color: '#FFC107', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
      {member}
    </div>
    <div style={{ color: '#A0B0C4', fontSize: 14 }}>
      {description}
    </div>
  </div>
);

const NAV = [
  { label: 'Overview', icon: '📊' },
  { label: 'Booking Requests', icon: '📅' },
  { label: 'Facility Catalogue', icon: '🏢' },
  { label: 'All Incidents', icon: '🔧' },
  { label: 'User Management', icon: '👥' },
  { label: 'Reports', icon: '📈' },
  { label: 'Settings', icon: '⚙️' },
];

function Overview() {
  return (
    <>
      <h2 style={S.welcomeTitle}>Welcome back, Admin 👋</h2>
      <p style={S.welcomeSub}>
        Campus Operations Overview — manage bookings, incidents and facilities.
      </p>

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
                {['Student', 'Facility', 'Date', 'Action'].map((h) => (
                  <th
                    key={h}
                    style={{
                      background: '#0D2137',
                      color: '#A0B0C4',
                      padding: '8px',
                      textAlign: 'left',
                      borderBottom: '1px solid #1A3A5A',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['John K.', 'Lab A', 'Apr 2'],
                ['Sara M.', 'Hall B', 'Apr 3'],
                ['Mike R.', 'Room 3', 'Apr 3'],
                ['Priya S.', 'Lab C', 'Apr 4'],
              ].map(([student, facility, date]) => (
                <tr key={student}>
                  <td style={{ padding: '8px', color: '#fff', borderBottom: '1px solid #1A3A5A' }}>
                    {student}
                  </td>
                  <td style={{ padding: '8px', color: '#fff', borderBottom: '1px solid #1A3A5A' }}>
                    {facility}
                  </td>
                  <td style={{ padding: '8px', color: '#A0B0C4', borderBottom: '1px solid #1A3A5A' }}>
                    {date}
                  </td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #1A3A5A' }}>
                    <button
                      style={{
                        background: '#0F4A2A',
                        color: '#4ade80',
                        border: 'none',
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontSize: 11,
                        cursor: 'pointer',
                        marginRight: 4,
                      }}
                    >
                      Approve
                    </button>
                    <button
                      style={{
                        background: '#3A1010',
                        color: '#f87171',
                        border: 'none',
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontSize: 11,
                        cursor: 'pointer',
                      }}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={S.card}>
          <div style={S.cardTitle}>Resource Utilization</div>

          {[
            ['8AM-10AM', 45],
            ['10AM-12PM', 82],
            ['12PM-2PM', 91],
            ['2PM-4PM', 67],
            ['4PM-6PM', 38],
          ].map(([time, percent]) => (
            <div key={time} style={{ marginBottom: 10 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 12,
                  color: '#A0B0C4',
                  marginBottom: 4,
                }}
              >
                <span>{time}</span>
                <span>{percent}%</span>
              </div>

              <div style={{ background: '#1A3A5A', borderRadius: 4, height: 6 }}>
                <div
                  style={{
                    background: '#FFC107',
                    borderRadius: 4,
                    height: 6,
                    width: `${percent}%`,
                  }}
                />
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

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const renderContent = () => {
    switch (active) {
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
    }
  };

  return (
    <div style={S.page}>
      <div style={S.sidebar}>
        <div style={S.logo}>🎓 Smart Campus</div>

        {NAV.map(({ label, icon }) => (
          <div
            key={label}
            onClick={() => setActive(label)}
            style={{
              ...S.navItem,
              ...(active === label ? S.navActive : {}),
            }}
          >
            <span style={{ marginRight: 8 }}>{icon}</span>
            {label}
          </div>
        ))}
      </div>

      <div style={S.main}>
        <div style={S.topbar}>
          <input
            style={S.search}
            placeholder={
              active === 'Facility Catalogue'
                ? 'Search facilities...'
                : 'Search users, bookings...'
            }
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={S.bell}>🔔</div>
            <div style={{ ...S.avatar, background: '#2A1A0A', color: '#FFC107' }}>
              AD
            </div>
            <button onClick={handleLogout} style={S.logout}>
              Logout
            </button>
          </div>
        </div>

        <div
          style={{
            ...S.content,
            padding: active === 'Facility Catalogue' ? 0 : 20,
            background: active === 'Facility Catalogue' ? '#091A2F' : 'transparent',
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
    background: '#091A2F',
    fontFamily: 'Segoe UI, sans-serif',
  },
  sidebar: {
    width: 210,
    background: '#0D2137',
    borderRight: '1px solid #1A3A5A',
    padding: '16px 0',
    flexShrink: 0,
  },
  logo: {
    padding: '0 16px 20px',
    fontSize: 15,
    fontWeight: 700,
    color: '#FFC107',
    borderBottom: '1px solid #1A3A5A',
    marginBottom: 12,
  },
  navItem: {
    padding: '10px 16px',
    fontSize: 13,
    color: '#A0B0C4',
    cursor: 'pointer',
    borderLeft: '3px solid transparent',
    transition: 'all 0.15s',
  },
  navActive: {
    color: '#FFC107',
    borderLeftColor: '#FFC107',
    background: '#122A42',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  topbar: {
    background: '#0D2137',
    borderBottom: '1px solid #1A3A5A',
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  search: {
    background: '#122A42',
    border: '1px solid #1A3A5A',
    borderRadius: 8,
    padding: '7px 14px',
    color: '#fff',
    fontSize: 13,
    width: 220,
  },
  bell: {
    width: 32,
    height: 32,
    background: '#122A42',
    border: '1px solid #1A3A5A',
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
    background: '#1A3A5A',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 700,
  },
  logout: {
    padding: '6px 12px',
    background: 'transparent',
    border: '1px solid #1A3A5A',
    borderRadius: 8,
    color: '#A0B0C4',
    fontSize: 12,
    cursor: 'pointer',
  },
  content: {
    padding: 20,
    flex: 1,
  },
  welcomeTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 4,
  },
  welcomeSub: {
    color: '#A0B0C4',
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
    background: '#122A42',
    border: '1px solid #1A3A5A',
    borderRadius: 10,
    padding: 14,
    borderTop: '3px solid #FFC107',
  },
  statLabel: {
    color: '#A0B0C4',
    fontSize: 11,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  statValue: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 700,
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },
  card: {
    background: '#122A42',
    border: '1px solid #1A3A5A',
    borderRadius: 10,
    padding: 16,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 14,
  },
};

export default AdminDashboard;