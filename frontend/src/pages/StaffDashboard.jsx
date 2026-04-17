import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

function MyTasks() {
  return (
    <>
      <h2 style={S.welcomeTitle}>Welcome back, Technician 👋</h2>
      <p style={S.welcomeSub}>View and manage your assigned maintenance tasks and incident tickets.</p>
      <div style={S.statsGrid}>
        {[['Assigned Tickets','8'],['High Priority','4'],['Resolved Today','2'],['Avg Resolution','3.2h']].map(([l,v]) => (
          <div key={l} style={S.statCard}>
            <div style={S.statLabel}>{l}</div>
            <div style={S.statValue}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{...S.card,marginBottom:16}}>
        <div style={S.cardTitle}>My Assigned Incident Tickets</div>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
          <thead>
            <tr>{['Ticket ID','Issue','Location','Priority','Type','Status'].map(h => (
              <th key={h} style={{background:'#0D2137',color:'#A0B0C4',padding:'8px',textAlign:'left',borderBottom:'1px solid #1A3A5A'}}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {[['#TK-042','Broken projector','Lab A Block C','#f87171','High','Equipment','#3D2A00','#FFC107','In Progress'],
              ['#TK-039','AC unit failure','Room 3 Block B','#f87171','High','HVAC','#0A2A4A','#60a5fa','Assigned'],
              ['#TK-037','Leaking pipe','Bathroom Block A','#f87171','High','Plumbing','#0A2A4A','#60a5fa','Assigned'],
              ['#TK-035','Broken chairs x5','Hall B Block A','#FFC107','Med','Furniture','#3D2A00','#FFC107','In Progress'],
              ['#TK-031','Light flickering','Corridor Block D','#4ade80','Low','Electrical','#0A2A4A','#60a5fa','Assigned']].map(([id,issue,loc,pc,pri,type,bg,sc,status]) => (
              <tr key={id}>
                <td style={{padding:'8px',color:'#FFC107',borderBottom:'1px solid #1A3A5A',fontWeight:600}}>{id}</td>
                <td style={{padding:'8px',color:'#fff',borderBottom:'1px solid #1A3A5A'}}>{issue}</td>
                <td style={{padding:'8px',color:'#A0B0C4',borderBottom:'1px solid #1A3A5A'}}>{loc}</td>
                <td style={{padding:'8px',borderBottom:'1px solid #1A3A5A'}}><span style={{color:pc,fontSize:12}}>● {pri}</span></td>
                <td style={{padding:'8px',color:'#A0B0C4',borderBottom:'1px solid #1A3A5A'}}>{type}</td>
                <td style={{padding:'8px',borderBottom:'1px solid #1A3A5A'}}>
                  <span style={{background:bg,color:sc,padding:'3px 10px',borderRadius:20,fontSize:11,fontWeight:600}}>{status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={S.twoCol}>
        <div style={S.card}>
          <div style={S.cardTitle}>Quick Status Update</div>
          <div style={{marginBottom:10}}>
            <div style={{color:'#A0B0C4',fontSize:11,marginBottom:6}}>SELECT TICKET</div>
            <select style={{width:'100%',background:'#0D2137',border:'1px solid #1A3A5A',borderRadius:8,padding:'9px 12px',color:'#fff',fontSize:13}}>
              <option>#TK-042 — Broken projector</option>
              <option>#TK-039 — AC unit failure</option>
            </select>
          </div>
          <div style={{marginBottom:12}}>
            <div style={{color:'#A0B0C4',fontSize:11,marginBottom:6}}>NEW STATUS</div>
            <select style={{width:'100%',background:'#0D2137',border:'1px solid #1A3A5A',borderRadius:8,padding:'9px 12px',color:'#fff',fontSize:13}}>
              <option>In Progress</option>
              <option>Resolved</option>
              <option>Needs Parts</option>
            </select>
          </div>
          <button style={S.btnYellow}>Update Status</button>
        </div>
        <div style={S.card}>
          <div style={S.cardTitle}>Today's Schedule</div>
          {[['Inspect Lab A projector','9:00 AM — Block C F2','#3D2A00','#FFC107','Pending'],
            ['Fix AC unit Room 3','11:00 AM — Block B F1','#3A1010','#f87171','Urgent'],
            ['Check leaking pipe','2:00 PM — Block A GF','#0A2A4A','#60a5fa','Scheduled'],
            ['Replace broken chairs','4:00 PM — Block A Hall B','#0F4A2A','#4ade80','Optional']].map(([task,time,bg,color,status]) => (
            <div key={task} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid #1A3A5A'}}>
              <div>
                <div style={{color:'#fff',fontSize:13,fontWeight:500}}>{task}</div>
                <div style={{color:'#A0B0C4',fontSize:11}}>{time}</div>
              </div>
              <span style={{background:bg,color,padding:'3px 10px',borderRadius:20,fontSize:11,fontWeight:600}}>{status}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function StaffDashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState('My Tasks');
  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  const renderContent = () => {
    switch (active) {
      case 'My Tasks':    return <MyTasks />;
      case 'All Tickets': return <IncidentList />;
      case 'Completed':   return <IncidentList mode="completed" />;
      case 'Facilities':  return <Placeholder title="Facilities" member="👤 Member 1 — Facility Service" description="Connect to facility-service on port 8083 to browse campus facilities." />;
      case 'Schedule':    return <Placeholder title="My Schedule" member="👤 Member 3 — Incident Service" description="Connect to incident-service on port 8085 to view assigned task schedule." />;
      case 'Account':     return <Placeholder title="Account Settings" member="👤 Member 4 (You) — Auth Service" description="Connect to auth-service on port 8081 to manage profile and settings." />;
      default:            return <MyTasks />;
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