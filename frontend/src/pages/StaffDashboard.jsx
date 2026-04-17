import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import incidentService from '../services/incidentService';
import IncidentList from './IncidentList';

const Placeholder = ({ title, member, description }) => (
  <div style={{ padding: 40, textAlign: 'center' }}>
    <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
    <div style={{ color: '#fff', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{title}</div>
    <div style={{ color: '#FFC107', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{member}</div>
    <div style={{ color: '#A0B0C4', fontSize: 14 }}>{description}</div>
  </div>
);

const NAV = [
  { label: 'My Tasks',    icon: '✅' },
  { label: 'All Tickets', icon: '🎫' },
  { label: 'Completed',   icon: '🏁' },
  { label: 'Facilities',  icon: '🏢' },
  { label: 'Schedule',    icon: '📆' },
  { label: 'Account',     icon: '👤' },
];

function MyTasks({ tickets, loading, refreshData }) {
  const [updateData, setUpdateData] = useState({ ticketId: '', status: 'IN_PROGRESS' });
  const [updating, setUpdating] = useState(false);

  // Filter for active tickets
  const activeTickets = tickets.filter(t => !['RESOLVED', 'CLOSED', 'REJECTED'].includes(t.status));
  
  // Calculate dynamic stats
  const stats = [
    ['Assigned Tickets', activeTickets.length.toString()],
    ['High Priority', activeTickets.filter(t => t.priority === 'HIGH').length.toString()],
    ['Resolved Total', tickets.filter(t => t.status === 'RESOLVED').length.toString()],
    ['Current Load', activeTickets.length > 5 ? 'High' : 'Normal']
  ];

  const handleQuickUpdate = async () => {
    if (!updateData.ticketId) return;
    try {
      setUpdating(true);
      await incidentService.updateStatus(updateData.ticketId, { status: updateData.status });
      refreshData();
      setUpdateData({ ticketId: '', status: 'IN_PROGRESS' });
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div style={{ color: '#fff', padding: 20 }}>Refreshing your tasks...</div>;

  return (
    <>
      <h2 style={S.welcomeTitle}>Welcome back, Technician 👋</h2>
      <p style={S.welcomeSub}>View and manage your assigned maintenance tasks and incident tickets.</p>
      
      <div style={S.statsGrid}>
        {stats.map(([l,v]) => (
          <div key={l} style={S.statCard}>
            <div style={S.statLabel}>{l}</div>
            <div style={S.statValue}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{...S.card, marginBottom: 16}}>
        <div style={S.cardTitle}>My Assigned Incident Tickets</div>
        {activeTickets.length === 0 ? (
          <div style={{ padding: 20, color: '#A0B0C4', textAlign: 'center' }}>No active assignments!</div>
        ) : (
          <table style={{width:'100%', borderCollapse:'collapse', fontSize:12}}>
            <thead>
              <tr>{['Ticket ID', 'Issue', 'Priority', 'Status', 'Last Update'].map(h => (
                <th key={h} style={{background:'#0D2137', color:'#A0B0C4', padding:'8px', textAlign:'left', borderBottom:'1px solid #1A3A5A'}}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {activeTickets.map((t) => (
                <tr key={t.id}>
                  <td style={{padding:'8px', color:'#FFC107', borderBottom:'1px solid #1A3A5A', fontWeight:600}}>#{t.id}</td>
                  <td style={{padding:'8px', color:'#fff', borderBottom:'1px solid #1A3A5A'}}>{t.category}</td>
                  <td style={{padding:'8px', borderBottom:'1px solid #1A3A5A'}}>
                    <span style={{color: t.priority === 'HIGH' ? '#f87171' : t.priority === 'MEDIUM' ? '#FFC107' : '#4ade80', fontSize:12}}>
                      ● {t.priority}
                    </span>
                  </td>
                  <td style={{padding:'8px', borderBottom:'1px solid #1A3A5A'}}>
                    <span style={{
                      background: t.status === 'IN_PROGRESS' ? '#3D2A00' : '#0A2A4A',
                      color: t.status === 'IN_PROGRESS' ? '#FFC107' : '#60a5fa',
                      padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600
                    }}>
                      {t.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{padding:'8px', color:'#A0B0C4', borderBottom:'1px solid #1A3A5A'}}>
                    {new Date(t.updatedAt || t.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={S.twoCol}>
        <div style={S.card}>
          <div style={S.cardTitle}>Quick Status Update</div>
          <div style={{marginBottom:10}}>
            <div style={{color:'#A0B0C4', fontSize:11, marginBottom:6}}>SELECT TICKET</div>
            <select 
              value={updateData.ticketId}
              onChange={(e) => setUpdateData({...updateData, ticketId: e.target.value})}
              style={{width:'100%', background:'#0D2137', border:'1px solid #1A3A5A', borderRadius:8, padding:'9px 12px', color:'#fff', fontSize:13}}
            >
              <option value="">Choose a ticket...</option>
              {activeTickets.map(t => (
                <option key={t.id} value={t.id}>#{t.id} — {t.category}</option>
              ))}
            </select>
          </div>
          <div style={{marginBottom:12}}>
            <div style={{color:'#A0B0C4', fontSize:11, marginBottom:6}}>NEW STATUS</div>
            <select 
              value={updateData.status}
              onChange={(e) => setUpdateData({...updateData, status: e.target.value})}
              style={{width:'100%', background:'#0D2137', border:'1px solid #1A3A5A', borderRadius:8, padding:'9px 12px', color:'#fff', fontSize:13}}
            >
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
          <button 
            onClick={handleQuickUpdate}
            disabled={updating || !updateData.ticketId}
            style={{...S.btnYellow, opacity: (updating || !updateData.ticketId) ? 0.6 : 1}}
          >
            {updating ? 'Updating...' : 'Update Status'}
          </button>
        </div>
        <div style={S.card}>
          <div style={S.cardTitle}>Notifications & Alerts</div>
          <div style={{ padding: '10px 0', color: '#A0B0C4', fontSize: 13 }}>
            {activeTickets.length > 0 ? (
              <div>You have {activeTickets.length} active tasks that need attention.</div>
            ) : (
              <div>All caught up! No urgent alerts.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function StaffDashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState('My Tasks');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await incidentService.getTickets();
      setTickets(data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          email: decoded.sub,
          role: decoded.role
        });
      } catch (e) {
        console.error('Error decoding token:', e);
      }
    }
    fetchTickets();
  }, [fetchTickets]);

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  const renderContent = () => {
    switch (active) {
      case 'My Tasks':    return <MyTasks tickets={tickets} loading={loading} refreshData={fetchTickets} />;
      case 'All Tickets': return <IncidentList />;
      case 'Completed':   return <IncidentList mode="completed" />;
      case 'Facilities':  return <Placeholder title="Facilities" member="👤 Member 1 — Facility Service" description="Connect to facility-service on port 8083 to browse campus facilities." />;
      case 'Schedule':    return <Placeholder title="My Schedule" member="👤 Member 3 — Incident Service" description="Connect to incident-service on port 8085 to view assigned task schedule." />;
      case 'Account':     return <Placeholder title="Account Settings" member="👤 Member 4 (You) — Auth Service" description="Connect to auth-service on port 8081 to manage profile and settings." />;
      default:            return <MyTasks tickets={tickets} loading={loading} refreshData={fetchTickets} />;
    }
  };

  return (
    <div style={S.page}>
      <div style={S.sidebar}>
        <div style={S.logo}>🎓 Smart Campus</div>
        {NAV.map(({ label, icon }) => (
          <div key={label}
            onClick={() => setActive(label)}
            style={{...S.navItem, ...(active === label ? S.navActive : {})}}>
            <span style={{marginRight:8}}>{icon}</span>{label}
          </div>
        ))}
      </div>
      <div style={S.main}>
        <div style={S.topbar}>
          <input style={S.search} placeholder="Search tickets, locations..." />
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div style={S.bell}>🔔</div>
            <div style={{...S.avatar,background:'#0A2A1A',color:'#4ade80'}}>TK</div>
            <button onClick={handleLogout} style={S.logout}>Logout</button>
          </div>
        </div>
        <div style={S.content}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

const S = {
  page:{display:'flex',minHeight:'100vh',background:'#091A2F',fontFamily:'Segoe UI,sans-serif'},
  sidebar:{width:210,background:'#0D2137',borderRight:'1px solid #1A3A5A',padding:'16px 0',flexShrink:0},
  logo:{padding:'0 16px 20px',fontSize:15,fontWeight:700,color:'#FFC107',borderBottom:'1px solid #1A3A5A',marginBottom:12},
  navItem:{padding:'10px 16px',fontSize:13,color:'#A0B0C4',cursor:'pointer',borderLeft:'3px solid transparent',transition:'all 0.15s'},
  navActive:{color:'#FFC107',borderLeftColor:'#FFC107',background:'#122A42'},
  main:{flex:1,display:'flex',flexDirection:'column'},
  topbar:{background:'#0D2137',borderBottom:'1px solid #1A3A5A',padding:'12px 20px',display:'flex',alignItems:'center',justifyContent:'space-between'},
  search:{background:'#122A42',border:'1px solid #1A3A5A',borderRadius:8,padding:'7px 14px',color:'#fff',fontSize:13,width:220},
  bell:{width:32,height:32,background:'#122A42',border:'1px solid #1A3A5A',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:16},
  avatar:{width:32,height:32,background:'#1A3A5A',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700},
  logout:{padding:'6px 12px',background:'transparent',border:'1px solid #1A3A5A',borderRadius:8,color:'#A0B0C4',fontSize:12,cursor:'pointer'},
  content:{padding:20,flex:1},
  welcomeTitle:{color:'#fff',fontSize:20,fontWeight:600,marginBottom:4},
  welcomeSub:{color:'#A0B0C4',fontSize:13,marginBottom:20},
  statsGrid:{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:20},
  statCard:{background:'#122A42',border:'1px solid #1A3A5A',borderRadius:10,padding:14,borderTop:'3px solid #FFC107'},
  statLabel:{color:'#A0B0C4',fontSize:11,marginBottom:6,textTransform:'uppercase'},
  statValue:{color:'#fff',fontSize:22,fontWeight:700},
  twoCol:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16},
  card:{background:'#122A42',border:'1px solid #1A3A5A',borderRadius:10,padding:16},
  cardTitle:{color:'#fff',fontSize:13,fontWeight:600,marginBottom:14},
  btnYellow:{background:'#FFC107',color:'#091A2F',border:'none',padding:'9px 16px',borderRadius:8,fontSize:12,fontWeight:700,cursor:'pointer',width:'100%'},
};

export default StaffDashboard;