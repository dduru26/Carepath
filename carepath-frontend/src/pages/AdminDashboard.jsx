// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchClinics,
  createClinic,
  updateClinic,
  deleteClinic,
} from '../api/clinics';

export default function AdminDashboard() {
  const { user } = useAuth();

  const [clinics, setClinics] = useState([]);
  const [loadingClinics, setLoadingClinics] = useState(true);
  const [clinicsError, setClinicsError] = useState('');

  // Create form state
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [servicesInput, setServicesInput] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  // Edit form state
  const [editingClinicId, setEditingClinicId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editArea, setEditArea] = useState('');
  const [editServicesInput, setEditServicesInput] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');

  const [deleteBusyId, setDeleteBusyId] = useState(null);

  // Load clinics on mount
  useEffect(() => {
    const load = async () => {
      try {
        setClinicsError('');
        setLoadingClinics(true);
        const data = await fetchClinics();
        setClinics(data);
      } catch (err) {
        console.error('Error loading clinics in admin dashboard:', err);
        setClinicsError('Unable to load clinics right now.');
      } finally {
        setLoadingClinics(false);
      }
    };

    load();
  }, []);

  // CREATE clinic handler
  const handleCreateClinic = async (e) => {
    e.preventDefault();
    setCreateError('');
    if (!name.trim()) {
      setCreateError('Clinic name is required.');
      return;
    }

    const servicesArray = servicesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newClinicData = {
      name: name.trim(),
      area: area.trim() || null,
      services: servicesArray,
      isPublic: true,
    };

    try {
      setCreating(true);
      const created = await createClinic(newClinicData);
      setClinics((prev) => [created, ...prev]);
      setName('');
      setArea('');
      setServicesInput('');
    } catch (err) {
      console.error('Error creating clinic:', err);
      const msg =
        err.response?.data?.error ||
        'Unable to create clinic. Check your rights or data.';
      setCreateError(msg);
    } finally {
      setCreating(false);
    }
  };

  // When clicking "Edit" on a row
  const startEditClinic = (clinic) => {
    setEditingClinicId(clinic.id);
    setEditName(clinic.name || '');
    setEditArea(clinic.area || '');
    const servicesList = Array.isArray(clinic.services)
      ? clinic.services
      : [];
    setEditServicesInput(servicesList.join(', '));
    setEditError('');
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingClinicId(null);
    setEditName('');
    setEditArea('');
    setEditServicesInput('');
    setEditError('');
  };

  // SAVE edit
  const handleSaveClinic = async (e) => {
    e.preventDefault();
    if (!editingClinicId) return;
    setEditError('');

    if (!editName.trim()) {
      setEditError('Clinic name is required.');
      return;
    }

    const servicesArray = editServicesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const updates = {
      name: editName.trim(),
      area: editArea.trim() || null,
      services: servicesArray,
      // keep isPublic true for now
      isPublic: true,
    };

    try {
      setEditSaving(true);
      const updated = await updateClinic(editingClinicId, updates);

      setClinics((prev) =>
        prev.map((c) => (c.id === editingClinicId ? updated : c))
      );

      cancelEdit();
    } catch (err) {
      console.error('Error updating clinic:', err);
      const msg =
        err.response?.data?.error || 'Unable to save changes to this clinic.';
      setEditError(msg);
    } finally {
      setEditSaving(false);
    }
  };

  // DELETE clinic
  const handleDeleteClinic = async (clinicId) => {
    const target = clinics.find((c) => c.id === clinicId);
    const label = target ? `"${target.name}"` : 'this clinic';

    const confirmed = window.confirm(
      `Are you sure you want to delete ${label}? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setDeleteBusyId(clinicId);
      await deleteClinic(clinicId);
      setClinics((prev) => prev.filter((c) => c.id !== clinicId));

      // If we were editing this clinic, reset edit state
      if (editingClinicId === clinicId) {
        cancelEdit();
      }
    } catch (err) {
      console.error('Error deleting clinic:', err);
      alert(
        err.response?.data?.error ||
          'Unable to delete this clinic. Please try again.'
      );
    } finally {
      setDeleteBusyId(null);
    }
  };

  return (
    <main style={{ padding: '1.5rem', maxWidth: 960, margin: '0 auto' }}>
      <h1>Admin dashboard</h1>
      <p style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>
        Welcome, {user?.email || user?.phoneNumber}. Use this space to manage
        clinics and gradually tune CarePath for your community.
      </p>

      {/* Create clinic form */}
      <section
        style={{
          marginTop: '1.5rem',
          padding: '1rem',
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb',
          background: '#f9fafb',
        }}
      >
        <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
          Add a new clinic
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#4b5563', marginBottom: '0.75rem' }}>
          This will immediately show up in the clinic finder for patients in the
          matching area.
        </p>

        {createError && (
          <p
            style={{
              background: '#fee2e2',
              color: '#b91c1c',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.5rem',
              marginBottom: '0.75rem',
              fontSize: '0.85rem',
            }}
          >
            {createError}
          </p>
        )}

        <form
          onSubmit={handleCreateClinic}
          style={{ display: 'grid', gap: '0.75rem', maxWidth: 480 }}
        >
          <label style={{ display: 'grid', gap: '0.25rem' }}>
            <span>Clinic name *</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                padding: '0.5rem',
                borderRadius: 6,
                border: '1px solid #d1d5db',
              }}
              placeholder="e.g. Village C Primary Health Centre"
              required
            />
          </label>

          <label style={{ display: 'grid', gap: '0.25rem' }}>
            <span>Area / Town</span>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              style={{
                padding: '0.5rem',
                borderRadius: 6,
                border: '1px solid #d1d5db',
              }}
              placeholder="e.g. Village C"
            />
          </label>

          <label style={{ display: 'grid', gap: '0.25rem' }}>
            <span>Services (comma-separated)</span>
            <input
              type="text"
              value={servicesInput}
              onChange={(e) => setServicesInput(e.target.value)}
              style={{
                padding: '0.5rem',
                borderRadius: 6,
                border: '1px solid #d1d5db',
              }}
              placeholder="e.g. general, antenatal, immunization"
            />
          </label>

          <button
            type="submit"
            disabled={creating}
            style={{
              marginTop: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: 999,
              border: 'none',
              background: creating ? '#9ca3af' : '#2563eb',
              color: 'white',
              fontSize: '0.9rem',
              cursor: creating ? 'default' : 'pointer',
              alignSelf: 'flex-start',
            }}
          >
            {creating ? 'Saving…' : 'Add clinic'}
          </button>
        </form>
      </section>

      {/* Edit clinic panel */}
      {editingClinicId && (
        <section
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            borderRadius: '0.75rem',
            border: '1px solid #bfdbfe',
            background: '#eff6ff',
          }}
        >
          <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
            Edit clinic
          </h2>
          <p
            style={{
              fontSize: '0.85rem',
              color: '#1d4ed8',
              marginBottom: '0.75rem',
            }}
          >
            You’re editing an existing clinic record. Changes will be visible to
            patients as soon as you save.
          </p>

          {editError && (
            <p
              style={{
                background: '#fee2e2',
                color: '#b91c1c',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.5rem',
                marginBottom: '0.75rem',
                fontSize: '0.85rem',
              }}
            >
              {editError}
            </p>
          )}

          <form
            onSubmit={handleSaveClinic}
            style={{ display: 'grid', gap: '0.75rem', maxWidth: 480 }}
          >
            <label style={{ display: 'grid', gap: '0.25rem' }}>
              <span>Clinic name *</span>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                style={{
                  padding: '0.5rem',
                  borderRadius: 6,
                  border: '1px solid #d1d5db',
                }}
                required
              />
            </label>

            <label style={{ display: 'grid', gap: '0.25rem' }}>
              <span>Area / Town</span>
              <input
                type="text"
                value={editArea}
                onChange={(e) => setEditArea(e.target.value)}
                style={{
                  padding: '0.5rem',
                  borderRadius: 6,
                  border: '1px solid #d1d5db',
                }}
              />
            </label>

            <label style={{ display: 'grid', gap: '0.25rem' }}>
              <span>Services (comma-separated)</span>
              <input
                type="text"
                value={editServicesInput}
                onChange={(e) => setEditServicesInput(e.target.value)}
                style={{
                  padding: '0.5rem',
                  borderRadius: 6,
                  border: '1px solid #d1d5db',
                }}
              />
            </label>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                type="submit"
                disabled={editSaving}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: 999,
                  border: 'none',
                  background: editSaving ? '#9ca3af' : '#1d4ed8',
                  color: 'white',
                  fontSize: '0.85rem',
                  cursor: editSaving ? 'default' : 'pointer',
                }}
              >
                {editSaving ? 'Saving…' : 'Save changes'}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                disabled={editSaving}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: 999,
                  border: '1px solid #d1d5db',
                  background: 'white',
                  fontSize: '0.85rem',
                  cursor: editSaving ? 'default' : 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Clinics list */}
      <section style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>
          Clinics currently in the system
        </h2>

        {clinicsError && (
          <p
            style={{
              background: '#fee2e2',
              color: '#b91c1c',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.5rem',
              marginBottom: '0.75rem',
              fontSize: '0.85rem',
            }}
          >
            {clinicsError}
          </p>
        )}

        {loadingClinics ? (
          <p style={{ fontSize: '0.9rem' }}>Loading clinics…</p>
        ) : clinics.length === 0 ? (
          <p style={{ fontSize: '0.9rem' }}>
            No clinics found yet. Use the form above to add your first one.
          </p>
        ) : (
          <div
            style={{
              borderRadius: '0.75rem',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.9rem',
              }}
            >
              <thead style={{ background: '#f3f4f6' }}>
                <tr>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '0.5rem 0.75rem',
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    Name
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '0.5rem 0.75rem',
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    Area
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '0.5rem 0.75rem',
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    Services
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '0.5rem 0.75rem',
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    Public?
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '0.5rem 0.75rem',
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {clinics.map((clinic) => (
                  <tr key={clinic.id}>
                    <td
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderBottom: '1px solid #e5e7eb',
                      }}
                    >
                      {clinic.name}
                    </td>
                    <td
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderBottom: '1px solid #e5e7eb',
                      }}
                    >
                      {clinic.area || '—'}
                    </td>
                    <td
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderBottom: '1px solid #e5e7eb',
                      }}
                    >
                      {Array.isArray(clinic.services)
                        ? clinic.services.join(', ')
                        : ''}
                    </td>
                    <td
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderBottom: '1px solid #e5e7eb',
                      }}
                    >
                      {clinic.isPublic ? 'Yes' : 'No'}
                    </td>
                    <td
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderBottom: '1px solid #e5e7eb',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => startEditClinic(clinic)}
                          style={{
                            padding: '0.25rem 0.6rem',
                            borderRadius: 999,
                            border: '1px solid #d1d5db',
                            background: 'white',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClinic(clinic.id)}
                          disabled={deleteBusyId === clinic.id}
                          style={{
                            padding: '0.25rem 0.6rem',
                            borderRadius: 999,
                            border: '1px solid #fecaca',
                            background:
                              deleteBusyId === clinic.id ? '#fee2e2' : '#fef2f2',
                            color: '#b91c1c',
                            fontSize: '0.8rem',
                            cursor:
                              deleteBusyId === clinic.id ? 'default' : 'pointer',
                          }}
                        >
                          {deleteBusyId === clinic.id ? 'Deleting…' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
