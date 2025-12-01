// src/pages/Signup.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup, authError, setAuthError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [channel, setChannel] = useState('SMS');
  const [language, setLanguage] = useState('English');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setSubmitting(true);

    try {
      await signup({ email, phoneNumber, password, channel, language });
      navigate('/clinic-finder');
    } catch (err) {
      // authError already set
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main
      style={{
        padding: '2rem',
        maxWidth: '420px',
        margin: '0 auto',
      }}
    >
      <h2 style={{ marginBottom: '0.75rem' }}>Create your CarePath account</h2>
      <p
        style={{
          fontSize: '0.9rem',
          color: '#4b5563',
          marginBottom: '1.5rem',
        }}
      >
        Save your clinic preferences and reminders so you don’t lose track of
        important visits.
      </p>

      <form onSubmit={handleSubmit} className="form">
        <label>
          Email address
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>

        <label>
          Phone number (for SMS/WhatsApp)
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+250..."
          />
        </label>

        <label>
          Password
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </label>

        <label>
          Preferred channel
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
          >
            <option value="SMS">SMS</option>
            <option value="WhatsApp">WhatsApp</option>
          </select>
        </label>

        <label>
          Language
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="English">English</option>
            <option value="Kinyarwanda">Kinyarwanda</option>
            <option value="French">French</option>
          </select>
        </label>

        {authError && (
          <p
            className="error"
            style={{
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
              fontSize: '0.85rem',
              color: '#b91c1c',
            }}
          >
            {authError}
          </p>
        )}

        <button
          type="submit"
          className="primary-btn"
          disabled={submitting}
          style={{ marginTop: '0.5rem' }}
        >
          {submitting ? 'Creating account…' : 'Sign up'}
        </button>
      </form>

      <p style={{ fontSize: '0.85rem', marginTop: '1rem' }}>
        Already have an account?{' '}
        <Link
          to="/login"
          style={{ color: '#2563eb', textDecoration: 'underline' }}
        >
          Log in
        </Link>
      </p>
    </main>
  );
}
