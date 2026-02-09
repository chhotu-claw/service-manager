import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw })
    });
    if (res.ok) onLogin();
    else setError('Wrong password');
  };

  return (
    <div style={styles.container}>
      <form onSubmit={submit} style={styles.form}>
        <h1 style={styles.title}>🔧 Service Manager</h1>
        <input type="password" value={pw} onChange={e => setPw(e.target.value)}
          placeholder="Password" style={styles.input} autoFocus />
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.btn}>Login</button>
      </form>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', fontFamily: 'system-ui' },
  form: { background: '#1e293b', padding: '2rem', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 300 },
  title: { color: '#f1f5f9', margin: 0, textAlign: 'center' },
  input: { padding: '0.75rem', borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', fontSize: '1rem' },
  btn: { padding: '0.75rem', borderRadius: 8, border: 'none', background: '#3b82f6', color: '#fff', fontSize: '1rem', cursor: 'pointer' },
  error: { color: '#ef4444', margin: 0, textAlign: 'center' }
};
