import React, { useState, useEffect } from 'react';
import { getUserByEmail, updateUser } from '../services/userService';

function AccountPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    fetchProfile();
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const fetchProfile = async () => {
    setLoading(true);
    const email = localStorage.getItem('userName');
    
    if (!email) {
      setMessage({ text: 'User email not found in local storage. Please login again.', type: 'error' });
      setLoading(false);
      return;
    }

    try {
      const userData = await getUserByEmail(email);
      setUser(userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        password: '' // Keep password empty initially
      });
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Failed to load profile. Ensure auth-service is running on port 8081.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    
    if (!user || !user.id) return;

    try {
      // Build update payload
      const updateData = {
        name: formData.name,
        email: formData.email
      };
      
      // Only send password if user typed a new one
      if (formData.password.trim() !== '') {
        updateData.password = formData.password;
      }

      const updatedUser = await updateUser(user.id, updateData);
      setUser(updatedUser);
      setFormData(prev => ({ ...prev, password: '' })); // clear password field
      
      // Update local storage if email changed
      if (formData.email !== localStorage.getItem('userName')) {
        localStorage.setItem('userName', formData.email);
      }
      
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Failed to update profile.', type: 'error' });
    }
  };

  if (loading) {
    return <div style={{ color: 'var(--text-secondary)', padding: 24 }}>Loading profile...</div>;
  }

  return (
    <div style={S.wrapper}>
      <div style={S.headerCard}>
        <div>
          <h2 style={S.pageTitle}>Account Settings</h2>
          <p style={S.pageSubtitle}>Manage your personal profile and preferences</p>
        </div>
        {user && (
          <div style={S.badge}>{user.role}</div>
        )}
      </div>

      {message.text && (
        <div style={{ ...S.message, border: message.type === 'error' ? '1px solid var(--danger-color)' : '1px solid var(--success-color)', color: message.type === 'error' ? 'var(--danger-color)' : 'var(--success-color)' }}>
          {message.text}
        </div>
      )}

      <div style={S.sectionCard}>
        <div style={S.sectionHeader}>
          <h3 style={S.sectionTitle}>Profile Information</h3>
        </div>

        {user ? (
          <form onSubmit={handleSubmit} style={S.formGrid}>
            <div style={S.formGroup}>
              <label style={S.label}>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={S.input}
                required
              />
            </div>
            
            <div style={S.formGroup}>
              <label style={S.label}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={S.input}
                required
              />
            </div>

            <div style={S.formGroup}>
              <label style={S.label}>New Password (leave blank to keep current)</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={S.input}
                placeholder="••••••••"
              />
            </div>

            <div style={{ gridColumn: '1 / -1', marginTop: 12 }}>
              <button type="submit" style={S.submitBtn}>
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div style={{ color: 'var(--text-secondary)' }}>No profile data available.</div>
        )}
      </div>

      <div style={{ ...S.sectionCard, marginTop: 24 }}>
        <div style={S.sectionHeader}>
          <h3 style={S.sectionTitle}>Preferences</h3>
        </div>
        <div style={S.formGroup}>
          <label style={S.label}>Theme Appearance</label>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button 
              onClick={() => handleThemeChange('dark')}
              style={{
                ...S.themeBtn,
                background: theme === 'dark' ? 'var(--bg-input)' : 'transparent',
                borderColor: theme === 'dark' ? 'var(--accent-color)' : 'var(--border-color)',
                color: theme === 'dark' ? 'var(--accent-color)' : 'var(--text-primary)'
              }}
            >
              🌙 Dark Mode
            </button>
            <button 
              onClick={() => handleThemeChange('light')}
              style={{
                ...S.themeBtn,
                background: theme === 'light' ? 'var(--bg-input)' : 'transparent',
                borderColor: theme === 'light' ? 'var(--accent-color)' : 'var(--border-color)',
                color: theme === 'light' ? 'var(--accent-color)' : 'var(--text-primary)'
              }}
            >
              ☀️ Light Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  wrapper: {
    padding: '20px',
    background: 'var(--bg-app)',
    color: 'var(--text-primary)',
    minHeight: '100%',
    fontFamily: 'Segoe UI, sans-serif'
  },
  headerCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px'
  },
  pageTitle: {
    margin: 0,
    fontSize: '26px',
    fontWeight: 700,
    color: 'var(--text-primary)'
  },
  pageSubtitle: {
    marginTop: '8px',
    marginBottom: 0,
    color: 'var(--text-secondary)',
    fontSize: '14px'
  },
  badge: {
    background: 'var(--badge-bg)',
    color: 'var(--accent-color)',
    padding: '8px 16px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 700,
    whiteSpace: 'nowrap'
  },
  message: {
    background: 'var(--bg-card)',
    padding: '12px 16px',
    borderRadius: '10px',
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: 500
  },
  sectionCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '24px'
  },
  sectionHeader: {
    marginBottom: '20px',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '16px'
  },
  sectionTitle: {
    margin: 0,
    color: 'var(--text-primary)',
    fontSize: '20px',
    fontWeight: 600
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '20px',
    maxWidth: '500px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    color: 'var(--text-secondary)',
    fontSize: '14px',
    fontWeight: 500
  },
  input: {
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    background: 'var(--bg-input)',
    color: 'var(--text-primary)',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.2s'
  },
  submitBtn: {
    background: 'var(--accent-color)',
    color: 'var(--text-primary)',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'opacity 0.2s'
  },
  themeBtn: {
    padding: '12px 20px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s'
  }
};

export default AccountPage;
