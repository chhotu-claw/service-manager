import React, { useState, useEffect } from 'react';

export default function TunnelBar() {
  const [info, setInfo] = useState({ url: null, status: 'unknown', uptime: 0 });

  const refresh = () => fetch('/api/tunnel').then(r => r.json()).then(setInfo).catch(() => {});
  useEffect(() => { refresh(); const i = setInterval(refresh, 5000); return () => clearInterval(i); }, []);

  const action = async (act) => {
    await fetch(`/api/tunnel/${act}`, { method: 'POST' });
    setTimeout(refresh, 2000);
  };

  const statusColor = info.status === 'connected' ? '#22c55e' : info.status === 'starting' ? '#eab308' : '#ef4444';
  const upStr = info.uptime > 0 ? `${Math.floor(info.uptime / 60)}m` : '';

  return (
    <div style={styles.bar}>
      <span style={{ ...styles.dot, background: statusColor }} />
      <span style={styles.label}>Tunnel: {info.status}</span>
      {info.url && <a href={info.url} target="_blank" rel="noreferrer" style={styles.url}>{info.url}</a>}
      {upStr && <span style={styles.uptime}>{upStr}</span>}
      <div style={styles.actions}>
        <button onClick={() => action('start')} style={styles.btn}>Start</button>
        <button onClick={() => action('stop')} style={styles.btn}>Stop</button>
        <button onClick={() => action('restart')} style={styles.btn}>Restart</button>
      </div>
    </div>
  );
}

const styles = {
  bar: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: '#1e293b', borderRadius: 8, flexWrap: 'wrap' },
  dot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0 },
  label: { color: '#94a3b8', fontWeight: 500 },
  url: { color: '#60a5fa', fontSize: '0.85rem', wordBreak: 'break-all' },
  uptime: { color: '#64748b', fontSize: '0.8rem' },
  actions: { marginLeft: 'auto', display: 'flex', gap: '0.5rem' },
  btn: { padding: '0.3rem 0.6rem', borderRadius: 6, border: '1px solid #334155', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: '0.8rem' }
};
