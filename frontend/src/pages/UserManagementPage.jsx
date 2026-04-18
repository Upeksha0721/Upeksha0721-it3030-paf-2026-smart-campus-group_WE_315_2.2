import { useState, useEffect, useCallback } from 'react';

const API = 'http://localhost:8081/api/users';
const ROLES = ['ADMIN', 'STAFF', 'USER'];

const ROLE_STYLE = {
  ADMIN:   { bg: 'var(--badge-bg)', color: 'var(--accent-color)', border: '#5A3A00' },
  STAFF:   { bg: '#0A1F2A', color: '#38BDF8', border: '#0A4A6A' },
  STUDENT: { bg: '#0F2A1A', color: 'var(--success-color)', border: '#0F5A2A' },
};

const EMPTY_FORM = { name: '', email: '', password: '', role: 'USER' };

const authHeaders = (json = false) => {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (json) headers['Content-Type'] = 'application/json';
  return headers;
};

// ── helpers ───────────────────────────────────────────────────────────────────
function StatusBadge({ active }) {
  return (
    <span style={{
      background: active ? '#0F2A1A' : '#2A0F0F', color: active ? 'var(--success-color)' : 'var(--danger-color)',
      border: `1px solid ${active ? '#0F5A2A' : '#5A0F0F'}`,
      borderRadius: 6, padding: '2px 10px', fontSize: 11, fontWeight: 700,
    }}>
      {active ? '● Active' : '○ Inactive'}
    </span>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 14, padding: 28, width: 460, maxWidth: '95vw', boxShadow: '0 24px 60px rgba(0,0,0,0.7)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 15 }}>{title}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function InputField({ label, type = 'text', value, onChange, placeholder, optional }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ color: 'var(--text-secondary)', fontSize: 12, display: 'block', marginBottom: 5 }}>
        {label}{optional ? <span style={{ color: '#3A5A7A', marginLeft: 4, fontSize: 11 }}>(optional)</span> : ' *'}
      </label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '9px 12px', color: 'var(--text-primary)', fontSize: 13, boxSizing: 'border-box' }}
      />
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────
export default function UserManagementPage() {
  const [users,        setUsers]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [apiError,     setApiError]     = useState('');
  const [search,       setSearch]       = useState('');
  const [filterRole,   setFilterRole]   = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [modal,        setModal]        = useState(null);
  const [selected,     setSelected]     = useState(null);
  const [form,         setForm]         = useState(EMPTY_FORM);
  const [formError,    setFormError]    = useState('');
  const [saving,       setSaving]       = useState(false);
  const [toast,        setToast]        = useState(null);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true); setApiError('');
    try {
      const res = await fetch(API, { headers: authHeaders() });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error('Your session expired or you do not have permission. Please log in again.');
        }
        throw new Error('Unable to load users from auth-service.');
      }
      setUsers(await res.json());
    } catch (e) {
      setApiError(e.message || 'Cannot reach auth-service on port 8081. Start the service and refresh.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return (
      (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
      (filterRole   === 'ALL' || u.role   === filterRole) &&
      (filterStatus === 'ALL' || (filterStatus === 'ACTIVE' ? u.active : !u.active))
    );
  });

  const openCreate = () => { setForm(EMPTY_FORM); setFormError(''); setModal('create'); };
  const openEdit   = u  => { setSelected(u); setForm({ name: u.name, email: u.email, password: '', role: u.role }); setFormError(''); setModal('edit'); };
  const openDelete = u  => { setSelected(u); setFormError(''); setModal('delete'); };
  const closeModal = () => { setModal(null); setSelected(null); setFormError(''); };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) { setFormError('Name and email are required.'); return; }
    if (modal === 'create' && !form.password.trim()) { setFormError('Password is required for new users.'); return; }
    setSaving(true); setFormError('');
    try {
      const url    = modal === 'edit' ? `${API}/${selected.id}` : API;
      const method = modal === 'edit' ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: authHeaders(true), body: JSON.stringify(form) });
      if (!res.ok) { const t = await res.text(); throw new Error(t || 'Request failed'); }
      showToast(modal === 'edit' ? 'User updated ✓' : 'User created ✓');
      closeModal(); fetchUsers();
    } catch (e) { setFormError(e.message); }
    finally     { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await fetch(`${API}/${selected.id}`, { method: 'DELETE', headers: authHeaders() });
      showToast('User deleted ✓'); closeModal(); fetchUsers();
    } catch { setFormError('Delete failed. Try again.'); }
    finally { setSaving(false); }
  };

  const handleToggle = async (u) => {
    try {
      await fetch(`${API}/${u.id}/toggle`, { method: 'PATCH', headers: authHeaders() });
      showToast(`User ${u.active ? 'deactivated' : 'activated'} ✓`); fetchUsers();
    } catch { showToast('Action failed', false); }
  };

  const handleRoleChange = async (u, newRole) => {
    try {
      await fetch(`${API}/${u.id}/role`, { method: 'PATCH', headers: authHeaders(true), body: JSON.stringify({ role: newRole }) });
      showToast('Role updated ✓'); fetchUsers();
    } catch { showToast('Role update failed', false); }
  };

  const counts = {
    total:    users.length,
    active:   users.filter(u => u.active).length,
    admins:   users.filter(u => u.role === 'ADMIN').length,
    staff:    users.filter(u => u.role === 'STAFF').length,
    students: users.filter(u => u.role === 'USER').length,
  };

  return (
    <div style={{ padding: 24, background: 'var(--bg-app)', minHeight: '100%', fontFamily: 'Segoe UI, sans-serif' }}>

      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 2000,
          background: toast.ok ? '#0F2A1A' : '#2A0F0F',
          color: toast.ok ? 'var(--success-color)' : 'var(--danger-color)',
          border: `1px solid ${toast.ok ? '#0F5A2A' : '#5A0F0F'}`,
          borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 600,
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        }}>{toast.msg}</div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h2 style={{ color: 'var(--text-primary)', fontSize: 20, fontWeight: 700, margin: 0 }}>User Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>{counts.total} total · {counts.active} active</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={fetchUsers} style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '9px 14px', fontSize: 13, cursor: 'pointer' }}>↻ Refresh</button>
          <button onClick={openCreate} style={{ background: 'var(--accent-color)', color: '#0D1117', border: 'none', borderRadius: 8, padding: '9px 18px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>+ Add User</button>
        </div>
      </div>

      {/* Summary chips */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        {[
          ['Total',    counts.total,                'var(--border-color)', 'var(--text-secondary)'],
          ['Admins',   counts.admins,               '#5A3A00', 'var(--accent-color)'],
          ['Staff',    counts.staff,                '#0A4A6A', '#38BDF8'],
          ['Users', counts.students,                '#0F5A2A', 'var(--success-color)'],
          ['Inactive', counts.total - counts.active,'#5A0F0F', 'var(--danger-color)'],
        ].map(([label, count, border, color]) => (
          <div key={label} style={{ background: 'var(--bg-card)', border: `1px solid ${border}`, borderRadius: 8, padding: '8px 16px', textAlign: 'center', minWidth: 72 }}>
            <div style={{ color, fontSize: 18, fontWeight: 700 }}>{count}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 11 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search by name or email…"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '8px 14px', color: 'var(--text-primary)', fontSize: 13, width: 250 }} />
        <div style={{ display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8, overflow: 'hidden' }}>
          {['ALL', ...ROLES].map(r => (
            <button key={r} onClick={() => setFilterRole(r)} style={{ background: filterRole === r ? 'var(--border-color)' : 'transparent', color: filterRole === r ? 'var(--accent-color)' : 'var(--text-secondary)', border: 'none', padding: '8px 14px', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
              {r === 'ALL' ? 'All' : r}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8, overflow: 'hidden' }}>
          {['ALL', 'ACTIVE', 'INACTIVE'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} style={{ background: filterStatus === s ? 'var(--border-color)' : 'transparent', color: filterStatus === s ? 'var(--accent-color)' : 'var(--text-secondary)', border: 'none', padding: '8px 14px', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
              {s === 'ALL' ? 'All' : s[0] + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* API error */}
      {apiError && (
        <div style={{ background: '#2A0F0F', border: '1px solid #5A0F0F', borderRadius: 10, padding: '16px 20px', color: 'var(--danger-color)', fontSize: 13, marginBottom: 16 }}>
          ⚠ {apiError}
        </div>
      )}

      {/* Table */}
      {!apiError && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 60, fontSize: 14 }}>Loading users…</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['#', 'User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)', padding: '12px 14px', textAlign: 'left', borderBottom: '1px solid var(--border-color)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 40 }}>No users match your filters.</td></tr>
                ) : filtered.map((u, i) => (
                  <tr key={u.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                    <td style={tdS}><span style={{ color: '#3A5A7A', fontSize: 12 }}>{i + 1}</span></td>
                    <td style={tdS}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--border-color)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                          {u.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ ...tdS, color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={tdS}>
                      <select value={u.role} onChange={e => handleRoleChange(u, e.target.value)} style={{
                        background: ROLE_STYLE[u.role]?.bg, color: ROLE_STYLE[u.role]?.color,
                        border: `1px solid ${ROLE_STYLE[u.role]?.border}`,
                        borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                      }}>
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td style={tdS}><StatusBadge active={u.active} /></td>
                    <td style={{ ...tdS, color: 'var(--text-secondary)', fontSize: 12, whiteSpace: 'nowrap' }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-GB') : '—'}
                    </td>
                    <td style={tdS}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => openEdit(u)}    style={btnS('var(--border-color)', 'var(--text-primary)')}>✏ Edit</button>
                        <button onClick={() => handleToggle(u)} style={u.active ? btnS('var(--danger-border)', 'var(--danger-color)') : btnS('#0F2A1A', 'var(--success-color)')}>
                          {u.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={() => openDelete(u)}  style={btnS('#3A0F0F', 'var(--danger-color)')}>✕</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Create / Edit Modal */}
      {(modal === 'create' || modal === 'edit') && (
        <Modal title={modal === 'create' ? '➕ Add New User' : '✏ Edit User'} onClose={closeModal}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <InputField label="Full Name"     value={form.name}     onChange={v => setForm(f => ({ ...f, name: v }))}  placeholder="John Doe" />
            <InputField label="Email Address" type="email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} placeholder="user@campus.edu" />
          </div>
          <InputField label="Password" type="password" value={form.password} onChange={v => setForm(f => ({ ...f, password: v }))}
            placeholder={modal === 'edit' ? 'Leave blank to keep current password' : 'Min. 8 characters'} optional={modal === 'edit'} />
          <div style={{ marginBottom: 20 }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: 12, display: 'block', marginBottom: 8 }}>Role *</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {ROLES.map(r => (
                <button key={r} onClick={() => setForm(f => ({ ...f, role: r }))} style={{
                  flex: 1, padding: '9px 0', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer',
                  background: form.role === r ? ROLE_STYLE[r].bg    : 'var(--bg-app)',
                  color:      form.role === r ? ROLE_STYLE[r].color  : 'var(--text-secondary)',
                  border:     `1px solid ${form.role === r ? ROLE_STYLE[r].border : 'var(--border-color)'}`,
                }}>{r}</button>
              ))}
            </div>
          </div>
          {formError && <div style={{ color: 'var(--danger-color)', fontSize: 12, marginBottom: 12, background: '#2A0F0F', padding: '8px 12px', borderRadius: 6 }}>{formError}</div>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={closeModal} style={btnS('var(--border-color)', 'var(--text-secondary)', '9px 18px')}>Cancel</button>
            <button onClick={handleSave} disabled={saving} style={{ background: 'var(--accent-color)', color: '#0D1117', border: 'none', borderRadius: 8, padding: '9px 20px', fontWeight: 700, fontSize: 13, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Saving…' : modal === 'create' ? 'Create User' : 'Save Changes'}
            </button>
          </div>
        </Modal>
      )}

      {/* Delete Modal */}
      {modal === 'delete' && (
        <Modal title="🗑 Delete User" onClose={closeModal}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 6 }}>
            Permanently delete <strong style={{ color: 'var(--text-primary)' }}>{selected?.name}</strong>?
          </p>
          <p style={{ color: 'var(--danger-color)', fontSize: 12, marginBottom: 22 }}>This action cannot be undone.</p>
          {formError && <div style={{ color: 'var(--danger-color)', fontSize: 12, marginBottom: 12 }}>{formError}</div>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={closeModal} style={btnS('var(--border-color)', 'var(--text-secondary)', '9px 18px')}>Cancel</button>
            <button onClick={handleDelete} disabled={saving} style={{ background: '#5A0F0F', color: 'var(--danger-color)', border: '1px solid #7A1F1F', borderRadius: 8, padding: '9px 20px', fontWeight: 700, fontSize: 13, cursor: saving ? 'not-allowed' : 'pointer' }}>
              {saving ? 'Deleting…' : 'Yes, Delete'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

const tdS  = { padding: '11px 14px', borderBottom: '1px solid var(--border-color)' };
const btnS = (bg, color, padding = '5px 11px') => ({
  background: bg, color, border: 'none', borderRadius: 6,
  padding, fontSize: 12, cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap',
});