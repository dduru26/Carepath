// src/pages/Reminders.jsx
import { useEffect, useState } from 'react';
import useUserProfile from '../hooks/useUserProfile';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Reminders() {
  // Logged-in user
  const { user } = useAuth();

  // Profile-related state via your existing hook
  const {
    profile,
    updateProfile,
    saving: savingProfile,
    error: profileError,
  } = useUserProfile();

  const [phone, setPhone] = useState('');
  const [channel, setChannel] = useState('SMS');
  const [language, setLanguage] = useState('English');
  const [profileMessage, setProfileMessage] = useState('');

  // Reminders list state
  const [reminders, setReminders] = useState([]);
  const [remindersLoading, setRemindersLoading] = useState(false);
  const [remindersError, setRemindersError] = useState('');

  // Hydrate profile form when profile loads
  useEffect(() => {
    if (profile) {
      setPhone(profile.phoneNumber || '');
      setChannel(profile.preferredChannel || 'SMS');
      setLanguage(profile.language || 'English');
    }
  }, [profile]);

  // Load reminders for the *logged in user* (via JWT)
  useEffect(() => {
    const loadReminders = async () => {
      if (!user?.id) {
        // not logged in or still restoring session
        return;
      }

      try {
        setRemindersLoading(true);
        setRemindersError('');

        // backend now reads user from token, so no need to send userId
        const res = await api.get('/reminders');
        setReminders(res.data || []);
      } catch (err) {
        console.error(err);
        setRemindersError('Unable to load reminders.');
      } finally {
        setRemindersLoading(false);
      }
    };

    loadReminders();
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileMessage('');

    try {
      await updateProfile({
        phoneNumber: phone,
        preferredChannel: channel,
        language,
      });
      setProfileMessage('Profile saved.');
    } catch (err) {
      // error message already handled by hook
    }
  };

  return (
    <section>
      <h2>Reminders &amp; Profile</h2>
      <p>
        Save your phone number and how you’d like to receive reminders. Below
        you’ll see any upcoming reminders you’ve set.
      </p>

      <form onSubmit={handleSaveProfile} className="form">
        <label>
          Phone number
          <input
            type="tel"
            placeholder="+250..."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>

        <label>
          Channel
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
          >
            <option value="SMS">SMS</option>
            <option value="WhatsApp">WhatsApp</option>
          </select>
        </label>

        <label>
          Language (optional)
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="English">English</option>
            <option value="Kinyarwanda">Kinyarwanda</option>
            <option value="French">French</option>
          </select>
        </label>

        {profileError && (
          <p className="error" style={{ marginTop: '0.5rem' }}>
            {profileError}
          </p>
        )}
        {profileMessage && (
          <p
            style={{
              marginTop: '0.5rem',
              color: '#059669',
              fontSize: '0.9rem',
            }}
          >
            {profileMessage}
          </p>
        )}

        <button type="submit" className="primary-btn" disabled={savingProfile}>
          {savingProfile ? 'Saving…' : 'Save profile'}
        </button>
      </form>

      <hr style={{ margin: '2rem 0' }} />

      <h3>Your reminders</h3>

      {remindersLoading && <p>Loading your reminders…</p>}
      {remindersError && <p className="error">{remindersError}</p>}

      {!remindersLoading && !remindersError && reminders.length === 0 && (
        <p>No reminders yet. Set one from a clinic page.</p>
      )}

      {!remindersLoading && reminders.length > 0 && (
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            marginTop: '1rem',
            maxWidth: '40rem',
          }}
        >
          {reminders.map((r) => (
            <li
              key={r.id}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                marginBottom: '0.75rem',
                background: '#fafafa',
              }}
            >
              <div style={{ fontWeight: 600 }}>
                {r.clinic?.name || (r.clinicId ? `Clinic #${r.clinicId}` : 'Visit reminder')}
              </div>

              {r.clinic?.area && (
                <div
                  style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.1rem' }}
                >
                  Area: {r.clinic.area}
                </div>
              )}

              <div style={{ fontSize: '0.9rem', marginTop: '0.3rem' }}>
                {r.type === 'medication' ? 'Medication' : 'Visit'} •{' '}
                {new Date(r.scheduledFor).toLocaleString()}
              </div>

              <div
                style={{
                  fontSize: '0.8rem',
                  marginTop: '0.15rem',
                  color: '#6b7280',
                }}
              >
                Channel: {r.channel} • Status: {r.status}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
