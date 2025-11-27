// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@carepath.test');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login({ email, password });
      // After login, send admin to some useful page
      navigate('/clinic-finder');
    } catch (err) {
      console.error('Login failed:', err);
      const message =
        err.response?.data?.error || 'Unable to log in. Check your details.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ padding: '1.5rem', maxWidth: 480, margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1rem' }}>Sign in to CarePath</h1>
      <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
        Use your admin or CHW account to manage clinics and field notes.
      </p>

      {error && (
        <p
          style={{
            background: '#fee2e2',
            color: '#b91c1c',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
        <label style={{ display: 'grid', gap: '0.25rem' }}>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc' }}
            required
          />
        </label>

        <label style={{ display: 'grid', gap: '0.25rem' }}>
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc' }}
            required
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          style={{
            marginTop: '0.5rem',
            padding: '0.6rem 1rem',
            borderRadius: 6,
            border: 'none',
            background: submitting ? '#9ca3af' : '#2563eb',
            color: 'white',
            cursor: submitting ? 'default' : 'pointer',
          }}
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}
