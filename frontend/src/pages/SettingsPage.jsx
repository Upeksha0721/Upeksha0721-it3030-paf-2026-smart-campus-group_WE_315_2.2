import { useState } from 'react';

const API = 'http://localhost:8081/api';

// ── reusable field ────────────────────────────────────────────────────────────
function Field({ label, type = 'text', value, onChange, placeholder, hint }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ color: 'var(--text-secondary)', fontSize: 12, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', background: 'var(--bg-app)', border: '1px solid var(--border-color)',
          borderRadius: 8, padding: '10px 14px', color: 'var(--text-primary)', fontSize: 13,
          boxSizing: 'border-box', outline: 'none',
          transition: 'border-color 0.2s',
        }}
        onFocus={e  => (e.target.style.borderColor = 'var(--accent-color)')}
        onBlur={e   => (e.target.style.borderColor = 'var(--border-color)')}
      />
      {hint && <div style={{ color: '#3A5A7A', fontSize: 11, marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

// ── toggle switch ─────────────────────────────────────────────────────────────
function Toggle({ label, description, checked, onChange }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '14px 0', borderBottom: '1px solid var(--border-color)',
    }}>
      <div>
        <div style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{label}</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{description}</div>
      </div>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 44, height: 24, borderRadius: 12, cursor: 'pointer',
          background: checked ? 'var(--accent-color)' : 'var(--border-color)',
          position: 'relative', transition: 'background 0.2s', flexShrink: 0,
        }}
      >
        <div style={{
          position: 'absolute', top: 3, left: checked ? 23 : 3,
          width: 18, height: 18, borderRadius: '50%',
          background: checked ? '#0D1117' : 'var(--text-secondary)',
          transition: 'left 0.2s',
        }} />
      </div>
    </div>
  );
}

// ── section wrapper ───────────────────────────────────────────────────────────
function Card({ title, icon, children }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border-color)',
      borderRadius: 12, overflow: 'hidden', marginBottom: 16,
    }}>
      <div style={{
        padding: '14px 20px', borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-input)', display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 14 }}>{title}</span>
      </div>
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  );
}

function SaveBtn({ onClick, saving, label = 'Save Changes' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
      <button onClick={onClick} disabled={saving} style={{
        background: 'var(--accent-color)', color: '#0D1117', border: 'none',
        borderRadius: 8, padding: '9px 22px', fontWeight: 700,
        fontSize: 13, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1,
      }}>
        {saving ? 'Saving…' : label}
      </button>
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  // ── Admin profile ──────────────────────────────────────────────────────────
  const [profile, setProfile] = useState({ name: 'Campus Admin', email: 'admin@smartcampus.edu', currentPassword: '', newPassword: '', confirmPassword: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  // ── System info ────────────────────────────────────────────────────────────
  const [system, setSystem] = useState({ campusName: 'Smart Campus University', contactEmail: 'info@smartcampus.edu', contactPhone: '+94 11 234 5678', address: '123 University Ave, Colombo, Sri Lanka', timezone: 'Asia/Colombo' });
  const [savingSystem, setSavingSystem] = useState(false);

  // ── Notifications ──────────────────────────────────────────────────────────
  const [notif, setNotif] = useState({
    emailOnBooking:   true,
    emailOnIncident:  true,
    emailOnUserReg:   false,
    dashboardAlerts:  true,
    weeklyReport:     false,
  });
  const [savingNotif, setSavingNotif] = useState(false);

  // ── Toast ──────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState('');
  const showToast = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(''), 3000);
  };

  // ── Save handlers ──────────────────────────────────────────────────────────
  const saveProfile = async () => {
    if (profile.newPassword && profile.newPassword !== profile.confirmPassword) {
      showToast('New passwords do not match', true); return;
    }
    setSavingProfile(true);
    try {
      // PUT /api/auth/profile  (wire up when backend is ready)
      await new Promise(r => setTimeout(r, 800)); // mock delay
      showToast('Profile updated successfully ✓');
      setProfile(p => ({ ...p, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch { showToast('Failed to save profile', true); }
    finally   { setSavingProfile(false); }
  };

  const saveSystem = async () => {
    setSavingSystem(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      showToast('System settings saved ✓');
    } catch { showToast('Failed to save settings', true); }
    finally   { setSavingSystem(false); }
  };

  const saveNotif = async () => {
    setSavingNotif(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      showToast('Notification preferences saved ✓');
    } catch { showToast('Failed to save preferences', true); }
    finally   { setSavingNotif(false); }
  };

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: 24, background: 'var(--bg-app)', minHeight: '100%', fontFamily: 'Segoe UI, sans-serif', maxWidth: 780 }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 2000,
          background: toast.isError ? '#2A0F0F' : '#0F2A1A',
          color: toast.isError ? 'var(--danger-color)' : 'var(--success-color)',
          border: `1px solid ${toast.isError ? '#5A0F0F' : '#0F5A2A'}`,
          borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 600,
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: 20, fontWeight: 700, margin: 0 }}>Settings</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>Manage your account and campus configuration</p>
      </div>

      {/* ── Admin Profile ──────────────────────────────────────────────────── */}
      <Card title="Admin Profile" icon="👤">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'var(--badge-bg)', border: '2px solid var(--accent-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent-color)', fontSize: 20, fontWeight: 700, flexShrink: 0,
          }}>
            {profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div>
            <div style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 15 }}>{profile.name}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{profile.email}</div>
            <div style={{
              background: 'var(--badge-bg)', color: 'var(--accent-color)',
              border: '1px solid #5A3A00', borderRadius: 6,
              padding: '2px 10px', fontSize: 11, fontWeight: 700,
              display: 'inline-block', marginTop: 4,
            }}>ADMIN</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
          <Field label="Full Name" value={profile.name}
            onChange={v => setProfile(p => ({ ...p, name: v }))} placeholder="Admin name" />
          <Field label="Email Address" type="email" value={profile.email}
            onChange={v => setProfile(p => ({ ...p, email: v }))} placeholder="admin@campus.edu" />
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 18, marginTop: 4, marginBottom: 4 }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Change Password
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 16px' }}>
            <Field label="Current Password" type="password" value={profile.currentPassword}
              onChange={v => setProfile(p => ({ ...p, currentPassword: v }))} placeholder="••••••••" />
            <Field label="New Password" type="password" value={profile.newPassword}
              onChange={v => setProfile(p => ({ ...p, newPassword: v }))} placeholder="••••••••"
              hint="Min. 8 characters" />
            <Field label="Confirm Password" type="password" value={profile.confirmPassword}
              onChange={v => setProfile(p => ({ ...p, confirmPassword: v }))} placeholder="••••••••" />
          </div>
        </div>
        <SaveBtn onClick={saveProfile} saving={savingProfile} />
      </Card>

      {/* ── System Info ────────────────────────────────────────────────────── */}
      <Card title="System Information" icon="🏫">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
          <Field label="Campus Name" value={system.campusName}
            onChange={v => setSystem(s => ({ ...s, campusName: v }))} />
          <Field label="Contact Email" type="email" value={system.contactEmail}
            onChange={v => setSystem(s => ({ ...s, contactEmail: v }))} />
          <Field label="Contact Phone" value={system.contactPhone}
            onChange={v => setSystem(s => ({ ...s, contactPhone: v }))} />
          <Field label="Timezone" value={system.timezone}
            onChange={v => setSystem(s => ({ ...s, timezone: v }))}
            hint="e.g. Asia/Colombo, Asia/Kuala_Lumpur" />
        </div>
        <Field label="Address" value={system.address}
          onChange={v => setSystem(s => ({ ...s, address: v }))} />
        <SaveBtn onClick={saveSystem} saving={savingSystem} />
      </Card>

      {/* ── Notifications ─────────────────────────────────────────────────── */}
      <Card title="Notification Preferences" icon="🔔">
        {[
          ['emailOnBooking',  'Booking Requests',       'Receive email when a new booking is submitted'],
          ['emailOnIncident', 'Incident Reports',       'Receive email when a new incident is logged'],
          ['emailOnUserReg',  'New User Registrations', 'Receive email when a new user registers'],
          ['dashboardAlerts', 'Dashboard Alerts',       'Show real-time alerts in the dashboard'],
          ['weeklyReport',    'Weekly Summary Email',   'Receive a weekly analytics summary every Monday'],
        ].map(([key, label, desc]) => (
          <Toggle key={key} label={label} description={desc}
            checked={notif[key]}
            onChange={v => setNotif(n => ({ ...n, [key]: v }))}
          />
        ))}
        <SaveBtn onClick={saveNotif} saving={savingNotif} label="Save Preferences" />
      </Card>

      {/* ── About ─────────────────────────────────────────────────────────── */}
      <Card title="About" icon="ℹ️">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            ['Application',   'Smart Campus Management System'],
            ['Version',        'v2.2.0'],
            ['Build',          'Spring Boot 3 · React 18'],
            ['Group',          'WE_315 — Group 2.2'],
            ['Auth Service',   'Port 8081'],
            ['Booking Service','Port 8084'],
            ['Facility Service','Port 8083'],
            ['Incident Service','Port 8085'],
          ].map(([label, value]) => (
            <div key={label} style={{
              background: 'var(--bg-app)', border: '1px solid var(--border-color)',
              borderRadius: 8, padding: '10px 14px',
            }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: 11, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
              <div style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 600 }}>{value}</div>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 16, background: 'var(--bg-app)', border: '1px solid var(--border-color)',
          borderLeft: '3px solid var(--accent-color)', borderRadius: 8, padding: '12px 16px',
        }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
            📘 Member 4 — Auth Service · User Management · Reports & Analytics · Settings
          </div>
        </div>
      </Card>
    </div>
  );
}