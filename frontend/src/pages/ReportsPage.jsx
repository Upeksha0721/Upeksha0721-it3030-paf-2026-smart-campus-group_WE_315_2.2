import { useState, useEffect, useCallback } from 'react';

const SERVICES = {
  auth:     'http://localhost:8081/api/users/stats',
  booking:  'http://localhost:8084/api/bookings/stats',
  facility: 'http://localhost:8083/api/facilities/stats',
  incident: '',
};

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ── Mini bar chart (pure CSS) ────────────────────────────────────────────────
function BarChart({ data, color = 'var(--accent-color)' }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80, marginTop: 12 }}>
      {data.map(({ label, value }) => (
        <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: 10 }}>{value}</span>
          <div style={{
            width: '100%', background: 'var(--border-color)', borderRadius: '4px 4px 0 0',
            height: `${(value / max) * 60}px`, minHeight: 4,
            background: `linear-gradient(180deg, ${color} 0%, ${color}99 100%)`,
            transition: 'height 0.6s ease',
          }} />
          <span style={{ color: 'var(--text-secondary)', fontSize: 10, textAlign: 'center' }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Donut chart (SVG) ────────────────────────────────────────────────────────
function DonutChart({ segments, size = 100 }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  let offset = 0;
  const r = 36, cx = 50, cy = 50, circumference = 2 * Math.PI * r;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke='var(--border-color)' strokeWidth={14} />
        {segments.map(({ value, color }, i) => {
          const pct = value / total;
          const dash = pct * circumference;
          const gap  = circumference - dash;
          const el = (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={color} strokeWidth={14}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset * circumference}
              style={{ transition: 'stroke-dasharray 0.6s ease' }}
              transform="rotate(-90 50 50)"
            />
          );
          offset += pct;
          return el;
        })}
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column',
      }}>
        <span style={{ color: 'var(--text-primary)', fontSize: 16, fontWeight: 700 }}>{total}</span>
        <span style={{ color: 'var(--text-secondary)', fontSize: 9 }}>total</span>
      </div>
    </div>
  );
}

// ── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, accent = 'var(--accent-color)', icon }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border-color)',
      borderTop: `3px solid ${accent}`, borderRadius: 10,
      padding: '14px 16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{label}</div>
          <div style={{ color: 'var(--text-primary)', fontSize: 26, fontWeight: 700 }}>{value ?? '—'}</div>
        </div>
        <span style={{ fontSize: 22 }}>{icon}</span>
      </div>
    </div>
  );
}

// ── Section card ─────────────────────────────────────────────────────────────
function Section({ title, icon, accent, loading, error, children }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border-color)',
      borderLeft: `3px solid ${accent}`, borderRadius: 10, padding: 20,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 14 }}>{icon} {title}</span>
        {loading && <span style={{ color: 'var(--text-secondary)', fontSize: 11 }}>Loading…</span>}
        {error   && <span style={{ color: 'var(--danger-color)', fontSize: 11 }}>⚠ Service offline</span>}
      </div>
      {!loading && !error && children}
      {error && (
        <div style={{ color: 'var(--text-secondary)', fontSize: 12, background: '#2A0F0F', borderRadius: 8, padding: '10px 14px' }}>
          Could not reach service. Start it to see live data.
        </div>
      )}
    </div>
  );
}

// ── Legend dot ───────────────────────────────────────────────────────────────
function Legend({ items }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', marginTop: 12 }}>
      {items.map(({ label, color, value }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
          <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{label}</span>
          {value !== undefined && <span style={{ color: 'var(--text-primary)', fontSize: 12, fontWeight: 600 }}>{value}</span>}
        </div>
      ))}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function ReportsPage() {
  const [userStats,     setUserStats]     = useState(null);
  const [bookingStats,  setBookingStats]  = useState(null);
  const [facilityStats, setFacilityStats] = useState(null);
  const [incidentStats, setIncidentStats] = useState(null);

  const [loadingU, setLoadingU] = useState(true);
  const [loadingB, setLoadingB] = useState(true);
  const [loadingF, setLoadingF] = useState(true);
  const [loadingI, setLoadingI] = useState(true);

  const [errorU, setErrorU] = useState(false);
  const [errorB, setErrorB] = useState(false);
  const [errorF, setErrorF] = useState(false);
  const [errorI, setErrorI] = useState(false);

  const safe = async (url, setData, setLoading, setError) => {
    if (!url) {
      setError(true);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(url, { headers: authHeaders() });
      if (!res.ok) throw new Error();
      setData(await res.json());
    } catch { setError(true); }
    finally   { setLoading(false); }
  };

  const fetchAll = useCallback(() => {
    setLoadingU(true); setLoadingB(true); setLoadingF(true); setLoadingI(true);
    setErrorU(false);  setErrorB(false);  setErrorF(false);  setErrorI(false);
    safe(SERVICES.auth,     setUserStats,     setLoadingU, setErrorU);
    safe(SERVICES.booking,  setBookingStats,  setLoadingB, setErrorB);
    safe(SERVICES.facility, setFacilityStats, setLoadingF, setErrorF);
    safe(SERVICES.incident, setIncidentStats, setLoadingI, setErrorI);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── derived values with safe fallbacks ─────────────────────────────────────
  const u = userStats     || {};
  const b = bookingStats  || {};
  const f = facilityStats || {};
  const inc = incidentStats || {};

  return (
    <div style={{ padding: 24, background: 'var(--bg-app)', minHeight: '100%', fontFamily: 'Segoe UI, sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ color: 'var(--text-primary)', fontSize: 20, fontWeight: 700, margin: 0 }}>Reports & Analytics</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
            Live data aggregated from all campus services
          </p>
        </div>
        <button onClick={fetchAll} style={{
          background: 'var(--bg-card)', color: 'var(--accent-color)',
          border: '1px solid var(--border-color)', borderRadius: 8,
          padding: '8px 16px', fontSize: 13, cursor: 'pointer', fontWeight: 600,
        }}>
          ↻ Refresh
        </button>
      </div>

      {/* Top KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        <StatCard icon="👥" label="Total Users"        value={u.total}             accent='var(--accent-color)' />
        <StatCard icon="📅" label="Total Bookings"     value={(b.approved ?? 0) + (b.pending ?? 0) + (b.rejected ?? 0)} accent="#38BDF8" />
        <StatCard icon="🏢" label="Total Facilities"   value={f.total}             accent="#A78BFA" />
        <StatCard icon="🔧" label="Open Incidents"     value={inc.open}            accent='var(--danger-color)' />
      </div>

      {/* 2-col grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* ── Users ────────────────────────────────────────────────────────── */}
        <Section title="User Statistics" icon="👥" accent='var(--accent-color)' loading={loadingU} error={errorU}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <DonutChart size={110} segments={[
              { value: u.admins   || 0, color: 'var(--accent-color)' },
              { value: u.staff    || 0, color: '#38BDF8' },
              { value: u.students || 0, color: 'var(--success-color)' },
            ]} />
            <div style={{ flex: 1 }}>
              {[
                ['Admins',   u.admins,   'var(--accent-color)'],
                ['Staff',    u.staff,    '#38BDF8'],
                ['Students', u.students, 'var(--success-color)'],
              ].map(([label, val, color]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                    <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{label}</span>
                  </div>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 13 }}>{val ?? '—'}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 8, marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Active / Inactive</span>
                <span style={{ color: 'var(--text-primary)', fontSize: 12, fontWeight: 700 }}>
                  {u.active ?? '—'} / {u.inactive ?? '—'}
                </span>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Bookings ─────────────────────────────────────────────────────── */}
        <Section title="Booking Statistics" icon="📅" accent="#38BDF8" loading={loadingB} error={errorB}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <DonutChart size={110} segments={[
              { value: b.approved || 0, color: 'var(--success-color)' },
              { value: b.pending  || 0, color: 'var(--accent-color)' },
              { value: b.rejected || 0, color: 'var(--danger-color)' },
            ]} />
            <div style={{ flex: 1 }}>
              {[
                ['Approved', b.approved, 'var(--success-color)'],
                ['Pending',  b.pending,  'var(--accent-color)'],
                ['Rejected', b.rejected, 'var(--danger-color)'],
              ].map(([label, val, color]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                    <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{label}</span>
                  </div>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 13 }}>{val ?? '—'}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Facilities ───────────────────────────────────────────────────── */}
        <Section title="Facility Utilization" icon="🏢" accent="#A78BFA" loading={loadingF} error={errorF}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            {[
              ['Total Facilities', f.total,     '#A78BFA'],
              ['Available',        f.available, 'var(--success-color)'],
              ['Under Maintenance',f.maintenance,'var(--danger-color)'],
              ['Booked Today',     f.bookedToday,'#38BDF8'],
            ].map(([label, val, color]) => (
              <div key={label} style={{
                background: 'var(--bg-app)', border: `1px solid var(--border-color)`,
                borderRadius: 8, padding: '10px 12px',
              }}>
                <div style={{ color, fontSize: 18, fontWeight: 700 }}>{val ?? '—'}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 11, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
          {f.utilizationByHour && (
            <BarChart color="#A78BFA" data={f.utilizationByHour.map(h => ({ label: h.hour, value: h.count }))} />
          )}
        </Section>

        {/* ── Incidents ────────────────────────────────────────────────────── */}
        <Section title="Incident Statistics" icon="🔧" accent='var(--danger-color)' loading={loadingI} error={errorI}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <DonutChart size={110} segments={[
              { value: inc.open       || 0, color: 'var(--danger-color)' },
              { value: inc.inProgress || 0, color: 'var(--accent-color)' },
              { value: inc.resolved   || 0, color: 'var(--success-color)' },
            ]} />
            <div style={{ flex: 1 }}>
              {[
                ['Open',        inc.open,       'var(--danger-color)'],
                ['In Progress', inc.inProgress, 'var(--accent-color)'],
                ['Resolved',    inc.resolved,   'var(--success-color)'],
              ].map(([label, val, color]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                    <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{label}</span>
                  </div>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 13 }}>{val ?? '—'}</span>
                </div>
              ))}
              {inc.avgResolutionHours !== undefined && (
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 8, marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Avg Resolution</span>
                  <span style={{ color: 'var(--text-primary)', fontSize: 12, fontWeight: 700 }}>{inc.avgResolutionHours}h</span>
                </div>
              )}
            </div>
          </div>
        </Section>
      </div>

      {/* Footer note */}
      <p style={{ color: '#3A5A7A', fontSize: 11, textAlign: 'center', marginTop: 8 }}>
        ⚠ Sections showing "Service offline" will populate once the respective Spring Boot service is running.
      </p>
    </div>
  );
}