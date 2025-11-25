// src/pages/Reminders.jsx
import { useEffect, useState } from 'react';
import useUserProfile from '../hooks/useUserprofile';
import { getReminders } from '../api/reminders';

function Reminders() {
  const {
    profile,
    updateProfile,
    saving,
    error: profileError
  } = useUserProfile();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [channel, setChannel] = useState('sms');
  const [language, setLanguage] = useState('en');

  const [reminders, setReminders] = useState([]);
  const [loadingReminders, setLoadingReminders] = useState(false);
  const [remindersError, setRemindersError] = useState('');
  const [message, setMessage] = useState('');

  // When profile loads/changes, sync form + load reminders
  useEffect(() => {
    if (profile) {
      setPhoneNumber(profile.phoneNumber || '');
      setChannel(profile.channel || 'sms');
      setLanguage(profile.language || 'en');

      if (profile.userId) {
        loadReminders(profile.userId);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.userId]);

  const loadReminders = async (userId) => {
    if (!userId) return;
    try {
      setLoadingReminders(true);
      setRemindersError('');
      const data = await getReminders(userId);
      setReminders(data);
    } catch (err) {
      console.error(err);
      setRemindersError('Unable to load reminders.');
    } finally {
      setLoadingReminders(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const user = await updateProfile({
        phoneNumber,
        channel,
        language
      });
      setMessage('Profile saved successfully.');
      // user.id is the backend user id; profile in hook already updated
      if (user && user.id) {
        await loadReminders(user.id);
      }
    } catch (err) {
      // error message already handled in hook as profileError
    }
  };

  return (
    <section>
      <h2>Reminders & Profile</h2>
      <p style={{ fontSize: '0.9rem' }}>
        Save your phone number and how you’d like to receive reminders.
      </p>

      <form onSubmit={handleSaveProfile} className="form">
        <label>
          Phone number
          <input
            type="tel"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            placeholder="+234..."
            required
          />
        </label>

        <label>
          Channel
          <select
            value={channel}
            onChange={e => setChannel(e.target.value)}
          >
            <option value="sms">SMS</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </label>

        <label>
          Language (optional)
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            {/* Future: add more languages here */}
          </select>
        </label>

        {profileError && (
          <p className="error" style={{ marginTop: '0.5rem' }}>
            {profileError}
          </p>
        )}

        {message && !profileError && (
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
            {message}
          </p>
        )}

        <button
          type="submit"
          className="primary-btn"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save profile'}
        </button>
      </form>

      <hr style={{ margin: '1.5rem 0' }} />

      <h3>Your reminders</h3>

      {loadingReminders && <p>Loading reminders...</p>}
      {remindersError && (
        <p className="error">{remindersError}</p>
      )}

      {!loadingReminders && reminders.length === 0 && (
        <p>No reminders yet. Set one from a clinic page.</p>
      )}

      <ul className="list">
        {reminders.map(r => (
          <li key={r.id} className="card">
            <p>
              <strong>Type:</strong> {r.type}
            </p>
            <p>
              <strong>When:</strong>{' '}
              {new Date(r.scheduledAt).toLocaleString()}
            </p>
            <p>
              <strong>Message:</strong> {r.message}
            </p>
            <p>
              <strong>Status:</strong> {r.status}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Reminders;
