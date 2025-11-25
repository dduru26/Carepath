import { useEffect, useState } from 'react';
import api from '../api/client';
import { createClinic, updateClinic, deleteClinic } from '../api/clinicsAdmin';

function AdminDashboard() {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    id: null,
    name: '',
    address: '',
    area: '',
    opening_hours: '',
    services: '',
    is_public: true
  });

  const loadClinics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/clinics'); // same endpoint, returns all
      setClinics(res.data);
    } catch (err) {
      console.error(err);
      setError('Unable to load clinics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClinics();
  }, []);

  const resetForm = () => {
    setForm({
      id: null,
      name: '',
      address: '',
      area: '',
      opening_hours: '',
      services: '',
      is_public: true
    });
  };

  const handleEdit = (clinic) => {
    setForm({
      id: clinic.id,
      name: clinic.name || '',
      address: clinic.address || '',
      area: clinic.area || '',
      opening_hours: clinic.opening_hours || '',
      services: (clinic.services || []).join(', '),
      is_public: clinic.is_public
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteClinic(id);
      await loadClinics();
    } catch (err) {
      console.error(err);
      setError('Unable to delete clinic.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');

      const payload = {
        name: form.name,
        address: form.address,
        area: form.area,
        opening_hours: form.opening_hours,
        services: form.services
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
        is_public: form.is_public
      };

      if (form.id) {
        await updateClinic(form.id, payload);
      } else {
        await createClinic(payload);
      }

      resetForm();
      await loadClinics();
    } catch (err) {
      console.error(err);
      setError('Unable to save clinic.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <h2>Admin: Clinics Management</h2>
      <p style={{ fontSize: '0.9rem' }}>
        This screen is for internal use only (admins/CHWs). It lets you manage clinic records.
      </p>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        <h3>{form.id ? 'Edit clinic' : 'Add new clinic'}</h3>

        <label>
          Name
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>

        <label>
          Address
          <input
            type="text"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
          />
        </label>

        <label>
          Area
          <input
            type="text"
            value={form.area}
            onChange={e => setForm({ ...form, area: e.target.value })}
          />
        </label>

        <label>
          Opening hours
          <input
            type="text"
            value={form.opening_hours}
            onChange={e =>
              setForm({ ...form, opening_hours: e.target.value })
            }
          />
        </label>

        <label>
          Services (comma-separated)
          <input
            type="text"
            value={form.services}
            onChange={e => setForm({ ...form, services: e.target.value })}
            placeholder="general, antenatal, immunization"
          />
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={form.is_public}
            onChange={e => setForm({ ...form, is_public: e.target.checked })}
          />
          Public facility
        </label>

        <button type="submit" className="primary-btn" disabled={saving}>
          {saving ? 'Saving...' : form.id ? 'Update clinic' : 'Create clinic'}
        </button>

        {form.id && (
          <button
            type="button"
            className="secondary-btn"
            onClick={resetForm}
            style={{ marginLeft: '0.5rem' }}
          >
            Cancel edit
          </button>
        )}
      </form>

      <hr style={{ margin: '1.5rem 0' }} />

      <h3>Existing clinics</h3>
      {loading && <p>Loading clinics...</p>}
      {!loading && clinics.length === 0 && <p>No clinics yet.</p>}

      <ul className="list">
        {clinics.map(c => (
          <li key={c.id} className="card">
            <p><strong>{c.name}</strong></p>
            <p>{c.address}</p>
            <p><strong>Area:</strong> {c.area}</p>
            <p><strong>Services:</strong> {(c.services || []).join(', ')}</p>
            <div style={{ marginTop: '0.5rem' }}>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => handleEdit(c)}
              >
                Edit
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => handleDelete(c.id)}
                style={{ marginLeft: '0.5rem', backgroundColor: '#fee2e2' }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default AdminDashboard;
