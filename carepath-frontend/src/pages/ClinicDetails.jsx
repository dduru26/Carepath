// src/pages/ClinicDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import { fetchClinicNotes, addClinicNote } from '../api/clinicNotes';
import { useAuth } from '../context/AuthContext';

export default function ClinicDetails() {
  const { id } = useParams(); // clinic id from URL
  const clinicId = Number(id);

  const { user, isAdmin, isChw } = useAuth();

  const [clinic, setClinic] = useState(null);
  const [clinicLoading, setClinicLoading] = useState(true);
  const [clinicError, setClinicError] = useState('');

  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [notesError, setNotesError] = useState('');

  // New note state (for CHW/admin)
  const [noteContent, setNoteContent] = useState('');
  const [noteSubmitting, setNoteSubmitting] = useState(false);
  const [noteSubmitError, setNoteSubmitError] = useState('');

  const canAddNotes = isAdmin || isChw;

  // NEW: reminder state (with date + time picker)
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('09:00');
  const [savingReminder, setSavingReminder] = useState(false);
  const [reminderMsg, setReminderMsg] = useState('');
  const [reminderError, setReminderError] = useState('');

  // Set default reminder date to "tomorrow at 09:00"
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );

    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');

    setReminderDate(`${yyyy}-${mm}-${dd}`);
    setReminderTime('09:00');
  }, []);

  // Load clinic details
  useEffect(() => {
    const loadClinic = async () => {
      try {
        setClinicError('');
        setClinicLoading(true);
        const res = await api.get(`/clinics/${clinicId}`);
        setClinic(res.data);
      } catch (err) {
        console.error('Error loading clinic details:', err);
        setClinicError('Unable to load this clinic right now.');
      } finally {
        setClinicLoading(false);
      }
    };

    if (!Number.isNaN(clinicId)) {
      loadClinic();
    } else {
      setClinicError('Invalid clinic id.');
      setClinicLoading(false);
    }
  }, [clinicId]);

  // Load clinic notes
  useEffect(() => {
    const loadNotes = async () => {
      try {
        setNotesError('');
        setNotesLoading(true);
        const data = await fetchClinicNotes(clinicId);
        setNotes(data);
      } catch (err) {
        console.error('Error loading clinic notes:', err);
        setNotesError('Unable to load field notes for this clinic.');
      } finally {
        setNotesLoading(false);
      }
    };

    if (!Number.isNaN(clinicId)) {
      loadNotes();
    }
  }, [clinicId]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    setNoteSubmitError('');

    if (!noteContent.trim()) {
      setNoteSubmitError('Please write a short note before submitting.');
      return;
    }

    try {
      setNoteSubmitting(true);

      const payload = {
        authorName: user?.email || user?.phoneNumber || null,
        // role is optional; backend defaults to 'chw' if not provided
        content: noteContent.trim(),
      };

      const created = await addClinicNote(clinicId, payload);

      // Prepend new note to the list
      setNotes((prev) => [created, ...prev]);
      setNoteContent('');
    } catch (err) {
      console.error('Error adding clinic note:', err);
      const msg =
        err.response?.data?.error ||
        'Unable to save note. Check your access or try again.';
      setNoteSubmitError(msg);
    } finally {
      setNoteSubmitting(false);
    }
  };

  // NEW: reminder creator using chosen date + time
  const handleSetReminder = async (e) => {
    e.preventDefault();
    setReminderError('');
    setReminderMsg('');

    if (!reminderDate || !reminderTime) {
      setReminderError('Please choose a date and time for your reminder.');
      return;
    }

    if (!clinic) {
      setReminderError('Clinic information is missing.');
      return;
    }

    try {
      setSavingReminder(true);

      // Parse date & time into a JS Date
      const [yearStr, monthStr, dayStr] = reminderDate.split('-');
      const [hourStr, minuteStr] = reminderTime.split(':');
      const year = Number(yearStr);
      const month = Number(monthStr) - 1; // JS months = 0–11
      const day = Number(dayStr);
      const hour = Number(hourStr);
      const minute = Number(minuteStr);

      const scheduled = new Date(year, month, day, hour, minute, 0);

      await api.post('/reminders', {
        clinicId,
        type: 'visit',
        channel: 'SMS', // or infer from profile later
        scheduledFor: scheduled.toISOString(),
      });

      setReminderMsg(
        `Reminder created for ${scheduled.toLocaleString()} for this clinic.`
      );
    } catch (err) {
      console.error('Error creating reminder:', err);
      setReminderError('Unable to create reminder right now. Please try again.');
    } finally {
      setSavingReminder(false);
    }
  };

  return (
    <main style={{ padding: '1.5rem', maxWidth: 960, margin: '0 auto' }}>
      <Link
        to="/clinic-finder"
        style={{
          display: 'inline-block',
          marginBottom: '1rem',
          fontSize: '0.85rem',
          color: '#2563eb',
        }}
      >
        ← Back to clinic finder
      </Link>

      {/* Clinic info */}
      {clinicLoading ? (
        <p>Loading clinic details…</p>
      ) : clinicError ? (
        <p
          style={{
            background: '#fee2e2',
            color: '#b91c1c',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            fontSize: '0.9rem',
          }}
        >
          {clinicError}
        </p>
      ) : !clinic ? (
        <p>Clinic not found.</p>
      ) : (
        <>
          <section
            style={{
              padding: '1rem',
              borderRadius: '0.75rem',
              border: '1px solid #e5e7eb',
              marginBottom: '1.5rem',
            }}
          >
            <h1 style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>
              {clinic.name}
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#4b5563' }}>
              {clinic.address || clinic.area || 'Location details coming soon.'}
            </p>

            {clinic.openingHours && (
              <p
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.85rem',
                  color: '#374151',
                }}
              >
                <strong>Opening hours: </strong>
                {clinic.openingHours}
              </p>
            )}

            {clinic.services && (
              <p
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.85rem',
                  color: '#374151',
                }}
              >
                <strong>Services: </strong>
                {clinic.services}
              </p>
            )}

            {/* NEW: reminder form */}
            <div
              style={{
                marginTop: '1rem',
                paddingTop: '0.75rem',
                borderTop: '1px dashed #e5e7eb',
              }}
            >
              <h3
                style={{
                  fontSize: '0.95rem',
                  marginBottom: '0.5rem',
                }}
              >
                Set a visit reminder for this clinic
              </h3>

              <form
                onSubmit={handleSetReminder}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  alignItems: 'center',
                }}
              >
                <label style={{ fontSize: '0.85rem' }}>
                  Date
                  <input
                    type="date"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                    style={{
                      display: 'block',
                      marginTop: '0.25rem',
                      padding: '0.25rem 0.4rem',
                      fontSize: '0.9rem',
                      borderRadius: 6,
                      border: '1px solid #d1d5db',
                    }}
                  />
                </label>

                <label style={{ fontSize: '0.85rem' }}>
                  Time
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    style={{
                      display: 'block',
                      marginTop: '0.25rem',
                      padding: '0.25rem 0.4rem',
                      fontSize: '0.9rem',
                      borderRadius: 6,
                      border: '1px solid #d1d5db',
                    }}
                  />
                </label>

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={savingReminder}
                  style={{ marginTop: '1.25rem' }}
                >
                  {savingReminder ? 'Setting reminder…' : 'Save reminder'}
                </button>
              </form>

              {reminderError && (
                <p
                  style={{
                    marginTop: '0.5rem',
                    fontSize: '0.85rem',
                    color: '#b91c1c',
                  }}
                >
                  {reminderError}
                </p>
              )}

              {reminderMsg && (
                <p
                  style={{
                    marginTop: '0.5rem',
                    fontSize: '0.85rem',
                    color: '#059669',
                  }}
                >
                  {reminderMsg}
                </p>
              )}
            </div>
          </section>
        </>
      )}

      {/* Notes section */}
      <section>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
          Field notes from health workers
        </h2>
        <p
          style={{
            fontSize: '0.85rem',
            color: '#4b5563',
            marginBottom: '0.75rem',
          }}
        >
          Short updates from community health workers about how this clinic is
          functioning (e.g. peak days, common issues, tips for patients).
        </p>

        {/* CHW/Admin note form */}
        {canAddNotes && (
          <div
            style={{
              marginBottom: '1rem',
              padding: '0.75rem',
              borderRadius: '0.75rem',
              border: '1px solid #e5e7eb',
              background: '#f9fafb',
            }}
          >
            <h3
              style={{
                fontSize: '0.95rem',
                marginBottom: '0.5rem',
              }}
            >
              Add a new note
            </h3>

            {noteSubmitError && (
              <p
                style={{
                  background: '#fee2e2',
                  color: '#b91c1c',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.5rem',
                  marginBottom: '0.5rem',
                  fontSize: '0.85rem',
                }}
              >
                {noteSubmitError}
              </p>
            )}

            <form
              onSubmit={handleAddNote}
              style={{ display: 'grid', gap: '0.5rem' }}
            >
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={3}
                placeholder="Share a short note about peak days, patient flow, staff availability, or anything that helps patients plan better."
                style={{
                  padding: '0.5rem',
                  borderRadius: 6,
                  border: '1px solid #d1d5db',
                  fontSize: '0.9rem',
                }}
              />

              <button
                type="submit"
                disabled={noteSubmitting}
                style={{
                  alignSelf: 'flex-start',
                  padding: '0.35rem 0.9rem',
                  borderRadius: 999,
                  border: 'none',
                  background: noteSubmitting ? '#9ca3af' : '#2563eb',
                  color: 'white',
                  fontSize: '0.85rem',
                  cursor: noteSubmitting ? 'default' : 'pointer',
                }}
              >
                {noteSubmitting ? 'Saving…' : 'Post note'}
              </button>
            </form>
          </div>
        )}

        {/* Notes list */}
        {notesLoading ? (
          <p style={{ fontSize: '0.9rem' }}>Loading notes…</p>
        ) : notesError ? (
          <p
            style={{
              background: '#fee2e2',
              color: '#b91c1c',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.5rem',
              fontSize: '0.85rem',
            }}
          >
            {notesError}
          </p>
        ) : notes.length === 0 ? (
          <p style={{ fontSize: '0.9rem', color: '#4b5563' }}>
            No notes have been added for this clinic yet.
          </p>
        ) : (
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              display: 'grid',
              gap: '0.75rem',
            }}
          >
            {notes.map((note) => (
              <li
                key={note.id}
                style={{
                  borderRadius: '0.75rem',
                  border: '1px solid #e5e7eb',
                  padding: '0.75rem',
                }}
              >
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  {note.content}
                </p>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>
                    {note.author || 'Health worker'}{' '}
                    {note.role ? `(${note.role})` : ''}
                  </span>
                  {note.createdAt && (
                    <span>
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
