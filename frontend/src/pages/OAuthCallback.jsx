import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

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
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f1729', color: 'white', fontSize: '18px' }}>
      ⏳ Completing Google login...
    </div>
  );
}

export default OAuthCallback;