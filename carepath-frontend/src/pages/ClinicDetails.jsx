import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import useUserProfile from '../hooks/useUserprofile';
import { createReminder } from '../api/reminders';

function ClinicDetails() {
  const { id } = useParams();
  const [clinic, setClinic] = useState(null);
  const [error, setError] = useState('');

  const { profile } = useUserProfile();

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [savingReminder, setSavingReminder] = useState(false);
  const [reminderMessage, setReminderMessage] = useState('');

  useEffect(() => {
    const loadClinic = async () => {
      try {
        const res = await api.get(`/clinics/${id}`);
        setClinic(res.data);
      } catch (err) {
        setError('Clinic not found.');
      }
    };
    loadClinic();
  }, [id]);

  const handleCreateReminder = async (e) => {
    e.preventDefault();
    if (!profile?.userId) {
      setReminderMessage('Please save your phone number in the Reminders page first.');
      return;
    }

    if (!date || !time) {
      setReminderMessage('Please choose date and time.');
      return;
    }

    const scheduledAt = new Date(`${date}T${time}:00`);

    const message =
      note?.trim() ||
      `Clinic appointment at ${clinic?.name || 'the clinic'} on ${scheduledAt.toLocaleString()}`;

    try {
      setSavingReminder(true);
      setReminderMessage('');
      await createReminder({
        userId: profile.userId,
        type: 'appointment',
        scheduledAt: scheduledAt.toISOString(),
        message,
        metadata: { clinicId: clinic?.id }
      });
      setReminderMessage('Reminder created successfully.');
      setDate('');
      setTime('');
      setNote('');
    } catch (err) {
      console.error(err);
      setReminderMessage('Unable to create reminder. Please try again.');
    } finally {
      setSavingReminder(false);
    }
  };

  if (error) return <p>{error}</p>;
  if (!clinic) return <p>Loading...</p>;

  return (
    <section>
      <h2>{clinic.name}</h2>
      <p>{clinic.address}</p>
      <p><strong>Opening hours:</strong> {clinic.opening_hours}</p>
      <p><strong>Services:</strong> {clinic.services && clinic.services.join(', ')}</p>

      <hr style={{ margin: '1.5rem 0' }} />

      <h3>Set an appointment reminder</h3>
      {!profile && (
        <p style={{ fontSize: '0.9rem' }}>
          You haven't saved your phone number yet. Go to the{' '}
          <Link to="/reminders">Reminders page</Link> to set it up.
        </p>
      )}

      <form onSubmit={handleCreateReminder} className="form">
        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </label>

        <label>
          Time
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            required
          />
        </label>

        <label>
          Optional note
          <textarea
            rows="2"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="What should we remind you about?"
          />
        </label>

        <button type="submit" className="primary-btn" disabled={savingReminder}>
          {savingReminder ? 'Saving reminder...' : 'Create reminder'}
        </button>
      </form>

      {reminderMessage && (
        <p style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>{reminderMessage}</p>
      )}

      <p style={{ marginTop: '1rem', fontSize: '0.8rem' }}>
        In a later version, reminders will be delivered by SMS or WhatsApp using your saved contact.
      </p>
    </section>
  );
}

export default ClinicDetails;
