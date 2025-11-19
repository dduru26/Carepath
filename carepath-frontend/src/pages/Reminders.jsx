import { useEffect, useState } from 'react';
import useUserProfile from '../hooks/useUserprofile';
import { getReminders } from '../api/reminders';

function Reminders() {
  const { profile, updateProfile, saving, error: profileError } = useUserProfile();
  const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber || '');
  const [channel, setChannel] = useState(profile?.channel || 'sms');
  const [language, setLanguage] = useState(profile?.language || 'en');

  const [reminders, setReminders] = useState([]);
  const [loadingReminders, setLoadingReminders] = useState(false);
  const [remindersError, setRemindersError] = useState('');

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateProfile({ phoneNumber, channel, language });
      // After saving profile, load reminders
      loadReminders(updated.userId);
    } catch (err) {
      // already handled in hook
    }
  };

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

  useEffect(() => {
    if (profile?.userId) {
      loadReminders(profile.userId);
    }
  }, [profile?.userId]);

  return (
    <section>
      <h2>Reminders & Profile</h2>
      <p>Save your phone number and how you’d like to receive reminders.</p>

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
          <select value={channel} onChange={e => setChannel(e.target.value)}>
            <option value="sms">SMS</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </label>

        <label>
          Language (optional)
          <select value={language} onChange={e => setLanguage(e.target.value)}>
            <option value="en">English</option>
          </select>
        </label>

        {profileError && <p className="error">{profileError}</p>}

        <button type="submit" className="primary-btn" disabled={saving}>
          {saving ? 'Saving...' : 'Save profile'}
        </button>
      </form>

      <hr style={{ margin: '1.5rem 0' }} />

      <h3>Your reminders</h3>
      {loadingReminders && <p>Loading reminders...</p>}
      {remindersError && <p className="error">{remindersError}</p>}

      {reminders.length === 0 && !loadingReminders && (
        <p>No reminders yet. Set one from a clinic page.</p>
      )}

      <ul className="list">
        {reminders.map(r => (
          <li key={r.id} className="card">
            <p><strong>Type:</strong> {r.type}</p>
            <p><strong>When:</strong> {new Date(r.scheduledAt).toLocaleString()}</p>
            <p><strong>Message:</strong> {r.message}</p>
            <p><strong>Status:</strong> {r.status}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Reminders;
