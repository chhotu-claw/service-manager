import React, { useState, useEffect } from 'react';
import TunnelBar from '../components/TunnelBar';
import ServiceCard from '../components/ServiceCard';

export default function Dashboard({ onLogout }) {
  const [services, setServices] = useState({});
  const [tunnelUrl, setTunnelUrl] = useState(null);

  const refresh = () => {
    fetch('/api/services').then(r => r.json()).then(setServices).catch(() => {});
    fetch('/api/tunnel').then(r => r.json()).then(d => setTunnelUrl(d.url)).catch(() => {});
  };

  useEffect(() => { refresh(); const i = setInterval(refresh, 10000); return () => clearInterval(i); }, []);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    onLogout();
  };

  return (
    <div style={styles.container}>
      <div style={styles.top}>
        <h1 style={styles.title}>🔧 Service Manager</h1>
        <button onClick={logout} style={styles.logoutBtn}>Logout</button>
      </div>
      <TunnelBar />
      <div style={styles.grid}>
        {Object.values(services).map(svc => (
          <ServiceCard key={svc.id} svc={svc} tunnelUrl={tunnelUrl} onRefresh={refresh} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#0f172a', padding: '1.5rem', fontFamily: 'system-ui', display: 'flex', flexDirection: 'column', gap: '1rem' },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#f1f5f9', margin: 0 },
  logoutBtn: { padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #334155', background: 'transparent', color: '#94a3b8', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1rem' }
};
