import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      // 1. Store the raw token for API calls
      localStorage.setItem('token', token);

      try {
        // 2. Simple Base64 decode to get user info (Sub, Role)
        const payload = JSON.parse(atob(token.split('.')[1]));
        localStorage.setItem('user', JSON.stringify({
          email: payload.sub,
          role: payload.role // This supports your "ADMIN/USER" requirement 
        }));

        console.log("Login Successful. Role:", payload.role);
        navigate('/dashboard');
      } catch (error) {
        console.error("Invalid Token Format", error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Authenticating with Smart Campus Hub...</h2>
      <p>Please wait while we secure your session.</p>
    </div>
  );
}

export default OAuthCallback;