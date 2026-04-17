import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function OAuthCallback() {
  const navigate = useNavigate();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return; // prevent double run
    handled.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    console.log('OAuth callback hit, token:', token);

    if (token && token.length > 0) {
      localStorage.setItem('token', token);

      try {
        const decoded = jwtDecode(token);
        if (decoded?.role) {
          localStorage.setItem('role', decoded.role);
        }
        if (decoded?.sub) {
          localStorage.setItem('userName', decoded.sub);
        }
      } catch {
        // Ignore decode errors and continue with token only.
      }

      navigate('/dashboard', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f1729', color: 'var(--text-primary)', fontSize: '18px' }}>
      ⏳ Completing Google login...
    </div>
  );
}

export default OAuthCallback;