import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [authed, setAuthed] = useState(null);

  useEffect(() => {
    fetch('/api/auth/status').then(r => r.json()).then(d => setAuthed(d.authenticated));
  }, []);

  if (authed === null) return <div style={styles.loading}>Loading...</div>;
  if (!authed) return <Login onLogin={() => setAuthed(true)} />;
  return <Dashboard onLogout={() => setAuthed(false)} />;
}

const styles = {
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2rem', fontFamily: 'system-ui' }
};
