// src/pages/ClinicDetails.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import useUserProfile from '../hooks/useUserprofile';
import { createReminder } from '../api/reminders';
import { addClinicNote, getClinicNotes } from '../api/clinicsAdmin';

function ClinicDetails() {
  const { id } = useParams();

  // Clinic data
  const [clinic, setClinic] = useState(null);
  const [error, setError] = useState('');

  // User profile (for reminders)
  const { profile } = useUserProfile();

  // Reminder form state
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [savingReminder, setSavingReminder] = useState(false);
  const [reminderMessage, setReminderMessage] = useState('');

  // CHW notes state
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [noteMessage, setNoteMessage] = useState('');

  useEffect(() => {
    const loadClinic = async () => {
      try {
        const res = await api.get(`/clinics/${id}`);
        setClinic(res.data);
      } catch (err) {
        console.error(err);
        setError('Clinic not found.');
      }
    };

    const loadNotes = async () => {
      try {
        setNotesLoading(true);
        const data = await getClinicNotes(id);
        setNotes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setNotesLoading(false);
      }
    };

    loadClinic();
    loadNotes();
  }, [id]);

  const handleCreateReminder = async (e) => {
    e.preventDefault();

    if (!profile?.userId) {
      setReminderMessage('Please save your phone number in the Reminders page first.');
      return;
    }

    if (!date || !time) {
      setReminderMessage('Please choose both date and time.');
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

  const handleAddNote = async (e) => {
    e.preventDefault();

    if (!noteContent.trim()) {
      setNoteMessage('Please enter a note.');
      return;
    }

    try {
      setNoteMessage('');
      await addClinicNote(id, {
        authorName: 'CHW', // later this could be a real user identity
        role: 'chw',
        content: noteContent.trim()
      });

      setNoteContent('');
      const updated = await getClinicNotes(id);
      setNotes(updated);
      setNoteMessage('Note added.');
    } catch (err) {
      console.error(err);
      setNoteMessage('Unable to add note. Please try again.');
    }
  };

  if (error) return <p>{error}</p>;
  if (!clinic) return <p>Loading clinic...</p>;

  return (
    <section>
      <h2>{clinic.name}</h2>
      {clinic.address && <p>{clinic.address}</p>}
      {clinic.area && (
        <p>
          <strong>Area:</strong> {clinic.area}
        </p>
      )}
      {clinic.opening_hours && (
        <p>
          <strong>Opening hours:</strong> {clinic.opening_hours}
        </p>
      )}
      {clinic.services && clinic.services.length > 0 && (
        <p>
          <strong>Services:</strong> {clinic.services.join(', ')}
        </p>
      )}

      <hr style={{ margin: '1.5rem 0' }} />

      {/* Appointment Reminder Section */}
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
        <p style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
          {reminderMessage}
        </p>
      )}

      <p style={{ marginTop: '1rem', fontSize: '0.8rem' }}>
        In a later version, reminders will be delivered by SMS or WhatsApp using your saved contact.
      </p>

      <hr style={{ margin: '1.5rem 0' }} />

      {/* CHW Notes Section */}
      <h3>CHW field notes</h3>
      <p style={{ fontSize: '0.85rem' }}>
        For community health workers to record observations about this clinic.
      </p>

      {notesLoading && <p>Loading notes...</p>}

      <ul className="list">
        {notes.map(n => (
          <li key={n.id} className="card">
            <p style={{ fontSize: '0.9rem' }}>{n.content}</p>
            <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
              <strong>{n.authorName}</strong> ·{' '}
              {new Date(n.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>

      {!notesLoading && notes.length === 0 && (
        <p>No CHW notes for this clinic yet.</p>
      )}

      <form
        onSubmit={handleAddNote}
        className="form"
        style={{ marginTop: '1rem' }}
      >
        <label>
          Add note
          <textarea
            rows="2"
            value={noteContent}
            onChange={e => setNoteContent(e.target.value)}
            placeholder="e.g. Clinic is very busy on Mondays; advise patients to come earlier."
          />
        </label>

        <button type="submit" className="secondary-btn">
          Save note
        </button>
      </form>

      {noteMessage && (
        <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
          {noteMessage}
        </p>
      )}
    </section>
  );
}

export default ClinicDetails;
