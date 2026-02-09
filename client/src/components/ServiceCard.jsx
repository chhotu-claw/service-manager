import React, { useState } from 'react';

export default function ServiceCard({ svc, tunnelUrl, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState(null);

  const action = async (act) => {
    setLoading(true);
    try {
      await fetch(`/api/services/${svc.id}/${act}`, { method: 'POST' });
      setTimeout(() => { onRefresh(); setLoading(false); }, 2000);
    } catch { setLoading(false); }
  };

  const viewLogs = async () => {
    if (logs !== null) { setLogs(null); return; }
    const res = await fetch(`/api/services/${svc.id}/logs`);
    const data = await res.json();
    setLogs(data.logs || 'No logs');
  };

  const statusIcon = svc.systemdStatus === 'active' ? '🟢' : svc.systemdStatus === 'inactive' ? '🔴' : '🟡';
  const healthIcon = svc.healthy === true ? '💚' : svc.healthy === false ? '💔' : '';
  const extUrl = svc.route && svc.expose && tunnelUrl ? `${tunnelUrl}${svc.route}` : null;

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.status}>{statusIcon} {healthIcon}</span>
        <h3 style={styles.name}>{svc.name}</h3>
        <span style={styles.port}>:{svc.port}</span>
      </div>
      <p style={styles.desc}>{svc.description}</p>
      {extUrl && <a href={extUrl} target="_blank" rel="noreferrer" style={styles.link}>{svc.route}</a>}
      {svc.systemd && (
        <div style={styles.actions}>
          <button onClick={() => action('start')} disabled={loading} style={styles.btn}>▶ Start</button>
          <button onClick={() => action('stop')} disabled={loading} style={styles.btn}>⏹ Stop</button>
          <button onClick={() => action('restart')} disabled={loading} style={styles.btn}>🔄 Restart</button>
          <button onClick={viewLogs} style={styles.btn}>📋 Logs</button>
        </div>
      )}
      {!svc.systemd && <p style={styles.manual}>Manual service</p>}
      {logs && <pre style={styles.logs}>{logs}</pre>}
    </div>
  );
}

const styles = {
  card: { background: '#1e293b', borderRadius: 12, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  header: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  status: { fontSize: '1rem' },
  name: { color: '#f1f5f9', margin: 0, flex: 1, fontSize: '1.1rem' },
  port: { color: '#64748b', fontSize: '0.85rem', fontFamily: 'monospace' },
  desc: { color: '#94a3b8', margin: 0, fontSize: '0.85rem' },
  link: { color: '#60a5fa', fontSize: '0.85rem' },
  actions: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' },
  btn: { padding: '0.35rem 0.7rem', borderRadius: 6, border: '1px solid #334155', background: 'transparent', color: '#cbd5e1', cursor: 'pointer', fontSize: '0.8rem' },
  manual: { color: '#64748b', fontSize: '0.8rem', fontStyle: 'italic', margin: 0 },
  logs: { background: '#0f172a', color: '#94a3b8', padding: '0.75rem', borderRadius: 8, fontSize: '0.75rem', overflow: 'auto', maxHeight: 300, whiteSpace: 'pre-wrap', margin: 0 }
};
