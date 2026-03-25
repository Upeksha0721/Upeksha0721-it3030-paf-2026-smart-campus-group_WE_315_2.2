import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function OAuthCallback() {
  const navigate = useNavigate();

 useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  if (token) {
    localStorage.setItem('token', token);
    navigate('/dashboard');
  } else {
    navigate('/login');
  }
}, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Authenticating with Smart Campus Hub...</h2>
      <p>Please wait while we secure your session.</p>
    </div>
  );
}

export default OAuthCallback;